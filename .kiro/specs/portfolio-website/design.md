# Design Document

## Portfolio Website — Ni Putu Divia Maharani

---

## Overview

This document describes the technical design for a multi-page static portfolio website targeting Corporate HRDs and Management Trainee (MT) Recruiters. The site showcases engineering background, project leadership, technical skills, organizational experience, and creative pursuits across six dedicated HTML pages.

**Key design goals:**
- Zero build step — open directly in a browser from the filesystem or a static host
- Single CSS file (`css/styles.css`) and single JS file (`js/main.js`) for maintainability
- Tailwind CSS loaded via CDN for utility-first styling, supplemented by custom CSS for bespoke components
- Client-side state persistence via `localStorage` only — no backend, no cookies, no external data transmission
- Fully responsive from 320 px (mobile) through 1280 px+ (desktop)
- Consistent professional color palette: deep blue/slate primary, white background, warm amber/coral accent

**Pages:**

| File | Title |
|---|---|
| `index.html` | Home / Professional Cover & Profile |
| `capstone.html` | Capstone Project |
| `electrical.html` | Electrical Installation |
| `leadership.html` | Leadership & Organization Experience |
| `creative.html` | Creative Archive (Crochet Work) |
| `gifts.html` | End-to-End Creative Gift Initiatives |

---

## Architecture

The site is a **multi-page static application (MPA)**. There is no client-side router; each page is a self-contained HTML document that shares a common CSS file and a common JS file.

```
portfolio-website/
├── index.html
├── capstone.html
├── electrical.html
├── leadership.html
├── creative.html
├── gifts.html
├── css/
│   └── styles.css          ← single stylesheet (Tailwind CDN + custom)
└── js/
    └── main.js             ← single script (nav, modal, localStorage, utils)
```

### Dependency Graph

```
Each HTML page
    └── <link> css/styles.css
    └── <script> js/main.js
         ├── NavController      (hamburger, active-link highlight)
         ├── ModalController    (lightbox open/close/keyboard/scroll-lock)
         ├── StorageService     (localStorage read/write/fallback)
         └── PageInit           (per-page initialization, called on DOMContentLoaded)
```

### Data Flow

```
User interaction
    │
    ▼
DOM event listener (js/main.js)
    │
    ├─► NavController.toggle()        → updates DOM classes
    ├─► ModalController.open(src)     → injects image, shows overlay
    └─► StorageService.set(key, val)  → JSON.stringify → localStorage
                                      ← JSON.parse    ← localStorage
```

No network requests are made at runtime. Tailwind CSS is fetched once from CDN on page load; all other assets are local.

---

## Components and Interfaces

### 1. Navigation Bar (`NavController`)

**Markup pattern** (shared across all pages):

```html
<nav id="main-nav" class="fixed top-0 w-full z-50 bg-slate-900 shadow-md">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a href="index.html" class="text-white font-bold text-lg">Divia Maharani</a>
    <!-- Desktop links -->
    <ul id="nav-links" class="hidden md:flex gap-6 text-sm font-medium">
      <li><a href="index.html"        class="nav-link" data-page="home">Home</a></li>
      <li><a href="capstone.html"     class="nav-link" data-page="capstone">Capstone Project</a></li>
      <li><a href="electrical.html"   class="nav-link" data-page="electrical">Electrical Installation</a></li>
      <li><a href="leadership.html"   class="nav-link" data-page="leadership">Leadership</a></li>
      <li><a href="creative.html"     class="nav-link" data-page="creative">Creative Archive</a></li>
      <li><a href="gifts.html"        class="nav-link" data-page="gifts">Gift Initiatives</a></li>
    </ul>
    <!-- Hamburger (mobile) -->
    <button id="hamburger-btn" class="md:hidden text-white" aria-label="Toggle menu">
      <svg .../>
    </button>
  </div>
  <!-- Mobile dropdown -->
  <div id="mobile-menu" class="hidden md:hidden bg-slate-900 px-4 pb-4">
    <!-- same links repeated -->
  </div>
</nav>
```

**JS interface:**

```js
NavController = {
  init()           // called on DOMContentLoaded; reads data-page from <body>
  toggle()         // opens/closes mobile menu
  closeOnOutside() // closes menu when click target is outside nav
  setActive(page)  // adds active class to matching nav-link
}
```

**Active-link detection:** Each HTML page sets `<body data-page="capstone">` (etc.). `NavController.init()` reads this attribute and adds the `nav-active` CSS class to the matching link.

---

### 2. Modal Lightbox (`ModalController`)

Single reusable overlay component injected once into the DOM by `main.js`.

**Markup (injected by JS):**

```html
<div id="modal-overlay" class="fixed inset-0 bg-black/70 z-[100] hidden flex items-center justify-center">
  <div id="modal-content" class="relative max-w-4xl max-h-[90vh] mx-4">
    <button id="modal-close" aria-label="Close lightbox"
            class="absolute -top-8 right-0 text-white text-3xl leading-none">×</button>
    <img id="modal-img" src="" alt="" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"/>
    <p  id="modal-caption" class="text-white text-center mt-2 text-sm"></p>
  </div>
</div>
```

**JS interface:**

```js
ModalController = {
  init()              // injects markup, binds close-button, overlay-click, Escape key
  open(src, caption)  // sets img src + caption, removes 'hidden', locks body scroll
  close()             // adds 'hidden', restores body scroll
}
```

**Trigger pattern** (applied to every clickable image/placeholder):

```html
<img src="placeholder.jpg" alt="Blueprint diagram"
     class="modal-trigger cursor-pointer"
     data-src="placeholder.jpg"
     data-caption="CAD Installation Blueprint — Group 1"/>
```

`main.js` uses event delegation on `document` to catch all `.modal-trigger` clicks.

---

### 3. Storage Service (`StorageService`)

Thin wrapper around `localStorage` with JSON serialization and graceful fallback.

```js
StorageService = {
  set(key, value)   // JSON.stringify(value) → localStorage.setItem
  get(key, default) // localStorage.getItem → JSON.parse; returns default on error/null
  remove(key)       // localStorage.removeItem
  _available()      // returns boolean; tests localStorage with a probe write
}
```

If `_available()` returns `false` (private browsing, storage quota exceeded, security error), all `set` calls are silently no-ops and `get` returns the provided default. No error is surfaced to the user.

**Keys used:**

| Key | Value type | Purpose |
|---|---|---|
| `portfolio_theme` | `"light" \| "dark"` | Future theme toggle preference |
| `portfolio_visited` | `boolean` | Suppress intro animation on repeat visits |

---

### 4. Page-Specific Components

#### 4a. STAR Method Cards (capstone.html)

Four cards rendered in a 2×2 grid (desktop) / single column (mobile):

```html
<section class="star-grid grid grid-cols-1 md:grid-cols-2 gap-6">
  <div class="star-card" data-star="situation"> ... </div>
  <div class="star-card" data-star="task">      ... </div>
  <div class="star-card" data-star="action">    ... </div>
  <div class="star-card" data-star="result">    ... </div>
</section>
```

Each card has a colored left-border accent matching the palette and a label badge.

#### 4b. Load Table (electrical.html)

```html
<div class="overflow-x-auto">
  <table class="load-table min-w-full border-collapse text-sm">
    <thead>
      <tr>
        <th>MCB Group</th>
        <th>Circuit Description</th>
        <th>Load (W)</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <!-- 10 rows, MCB Groups 1–10 -->
    </tbody>
  </table>
</div>
```

The `overflow-x-auto` wrapper ensures horizontal scrollability on narrow viewports.

#### 4c. Leadership Timeline (leadership.html)

Vertical timeline using CSS pseudo-elements for the connecting line:

```html
<ol class="timeline relative border-l-2 border-amber-400 ml-4 space-y-8">
  <li class="timeline-entry pl-8 relative">
    <span class="timeline-dot absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-400"></span>
    <h3 class="role-title font-bold text-slate-900">Role Title</h3>
    <p  class="org-name text-slate-500 text-sm">Organization · Date Range</p>
    <p  class="achievement mt-2 text-slate-700">Achievement description with quantifiable outcome.</p>
  </li>
  ...
</ol>
```

#### 4d. Gallery Grid (creative.html)

Responsive CSS grid with overlay captions on hover:

```html
<div class="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <figure class="gallery-cell relative overflow-hidden rounded-lg cursor-pointer modal-trigger"
          data-src="..." data-caption="...">
    <img src="placeholder.jpg" alt="..." class="w-full h-64 object-cover"/>
    <figcaption class="gallery-caption absolute inset-0 bg-black/50 text-white
                        flex items-end p-4 opacity-0 transition-opacity duration-200
                        hover:opacity-100">
      Caption text
    </figcaption>
  </figure>
  ...
</div>
```

#### 4e. Gift Showcase (gifts.html)

Multi-column product grid (3 cols desktop → 1 col mobile) with process step cards below:

```html
<div class="gifts-grid grid grid-cols-1 md:grid-cols-3 gap-6">
  <article class="gift-card ...">
    <div class="modal-trigger" data-src="..." data-caption="...">
      <img src="placeholder.jpg" alt="..." class="w-full h-48 object-cover rounded-t-lg"/>
    </div>
    <div class="p-4">
      <h3 class="font-semibold">Pin Design — Batch 1</h3>
      <p class="text-sm text-slate-600">Brief process description.</p>
    </div>
  </article>
</div>

<section class="process-steps grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
  <div class="step-card ...">
    <span class="step-number">01</span>
    <h4>Ideation</h4>
    <p>...</p>
  </div>
  ...
</section>
```

---

## Data Models

### LocalStorage Schema

All data stored in `localStorage` is serialized as JSON. The site uses a minimal footprint — only preference data that meaningfully improves repeat-visit UX is persisted.

```ts
// Key: "portfolio_visited"
type VisitedFlag = boolean;

// Key: "portfolio_theme"
type ThemePreference = "light" | "dark";
```

### In-Memory Data Structures

These structures exist only in JavaScript runtime memory (not persisted):

```ts
// Represents a single gallery/lightbox-triggerable image
interface ModalTriggerData {
  src: string;       // image URL or placeholder path
  caption: string;   // alt/caption text shown in lightbox
}

// Represents a single leadership timeline entry
interface TimelineEntry {
  role: string;
  organization: string;
  dateRange: string;       // e.g. "Jan 2022 – Dec 2022"
  achievement: string;     // must include a quantifiable outcome
}

// Represents a single MCB load group row
interface LoadGroupRow {
  groupNumber: number;     // 1–10
  circuitDescription: string;
  loadWatts: number | null;
  notes: string;
}

// Represents a single gallery cell
interface GalleryCell {
  src: string;
  caption: string;
  technique?: string;
}

// Represents a single gift showcase item
interface GiftItem {
  title: string;
  src: string;
  processDescription: string;
}
```

### CSS Custom Properties (Design Tokens)

Defined in `css/styles.css` and used alongside Tailwind utilities:

```css
:root {
  --color-primary:    #1e3a5f;   /* deep professional blue */
  --color-primary-lt: #2d5282;   /* lighter blue for hover states */
  --color-accent:     #f59e0b;   /* warm amber */
  --color-accent-alt: #fb923c;   /* coral variant */
  --color-bg:         #f8fafc;   /* near-white background */
  --color-text:       #1e293b;   /* slate-900 body text */
  --color-text-muted: #64748b;   /* slate-500 secondary text */

  --transition-fast:  150ms ease-in-out;
  --transition-base:  250ms ease-in-out;
  --transition-slow:  300ms ease-in-out;

  --shadow-card:      0 2px 8px rgba(0,0,0,0.08);
  --shadow-elevated:  0 8px 24px rgba(0,0,0,0.15);
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: No Horizontal Overflow at Any Supported Viewport Width

*For any* viewport width in the supported range (320 px and above), no page in the Portfolio_Site should produce a horizontal scrollbar — that is, `document.body.scrollWidth` should not exceed `document.body.clientWidth`.

**Validates: Requirements 3.1, 3.4**

---

### Property 2: Images Do Not Overflow Their Containers

*For any* image element rendered on any page of the Portfolio_Site, the image's rendered width (`offsetWidth`) should not exceed the width of its parent container (`parentElement.offsetWidth`).

**Validates: Requirements 3.5**

---

### Property 3: Active Navigation Link Matches Current Page

*For any* page in the set of six pages (Home, Capstone, Electrical, Leadership, Creative, Gifts), the Navigation_Bar link corresponding to that page should have the active CSS class applied, and no other link should have the active class simultaneously.

**Validates: Requirements 4.4**

---

### Property 4: CSS Transition Durations Are Within Bounds

*For any* interactive element (button, card, nav link, modal overlay) on any page that has a CSS `transition` property defined, the `transition-duration` value should be between 150 ms and 300 ms inclusive.

**Validates: Requirements 5.5**

---

### Property 5: Body Text Meets WCAG AA Contrast Ratio

*For any* body text element on any page, the computed contrast ratio between the element's `color` and its effective `background-color` should be at least 4.5:1.

**Validates: Requirements 5.6**

---

### Property 6: LocalStorage Serialization Round-Trip

*For any* serializable JavaScript value (string, number, boolean, object, array), calling `StorageService.set(key, value)` followed by `StorageService.get(key)` should return a value deeply equal to the original — i.e., `JSON.parse(JSON.stringify(value))` equals the retrieved value.

**Validates: Requirements 6.2, 6.3**

---

### Property 7: Modal Trigger Opens Lightbox with Correct Content

*For any* element with the `modal-trigger` class on any page, clicking it should result in: (a) the modal overlay becoming visible (not hidden), (b) the modal image `src` matching the trigger's `data-src` attribute, and (c) a close button being present and accessible.

**Validates: Requirements 8.5, 9.5, 11.5, 12.5, 13.1**

---

### Property 8: STAR Method Cards Are Complete

*For any* STAR label in the set {Situation, Task, Action, Result}, a card element with that label and non-empty descriptive text content should be present on `capstone.html`.

**Validates: Requirements 8.3**

---

### Property 9: Load Table Contains All MCB Groups with Required Fields

*For any* MCB group number `n` in the range [1, 10], the load grouping table on `electrical.html` should contain a row where the group number cell equals `n`, and both the circuit description and notes columns contain non-empty text.

**Validates: Requirements 9.4**

---

### Property 10: Timeline Entries Contain All Required Fields

*For any* timeline entry element on `leadership.html`, the entry should contain non-empty text for all four required fields: role title, organization name, date range, and achievement description — and the achievement description should contain at least one numeric value or measurable metric.

**Validates: Requirements 10.3, 10.4**

---

### Property 11: Gallery Cells Have Non-Empty Captions

*For any* gallery cell element on `creative.html`, the cell should contain a caption or overlay element with non-empty text content describing the project or technique shown.

**Validates: Requirements 11.4**

---

### Property 12: Gallery Grid Column Count Matches Breakpoint

*For any* viewport width, the gallery grid on `creative.html` should display the correct number of columns: 1 column for mobile (< 640 px), 2 columns for tablet (640 px – 1023 px), and 3 columns for desktop (≥ 1024 px).

**Validates: Requirements 11.6**

---

### Property 13: Gift Showcase Items Have Required Content Fields

*For any* gift card element on `gifts.html`, the card should contain a non-empty title (`h3`) and a non-empty process description (`p`).

**Validates: Requirements 12.3**

---

### Property 14: Modal Open State Locks Body Scroll

*For any* modal-trigger that opens the Modal_Lightbox, `document.body` should have `overflow: hidden` (or an equivalent CSS class) applied while the modal is open, and the original overflow value should be restored after the modal is closed.

**Validates: Requirements 13.5**

---

## Error Handling

### LocalStorage Unavailability

`StorageService._available()` performs a probe write/read/delete on initialization. If it throws (e.g., `SecurityError` in private browsing, quota exceeded), the service switches to a no-op mode:
- `set()` silently discards writes
- `get(key, default)` always returns the provided default
- No error is surfaced to the user; the site renders with static defaults

### Modal Errors

If a `.modal-trigger` element is missing `data-src`, `ModalController.open()` logs a console warning and does not open the modal (no broken overlay is shown).

### Missing DOM Elements

All JS modules guard against `null` DOM queries with early returns. If a required element is absent (e.g., `#main-nav` not found), the module logs a warning and skips initialization rather than throwing.

### Image Load Failures

All `<img>` elements include an `alt` attribute. Placeholder images use CSS background colors as fallback so layout is preserved even if the image file is missing.

### Navigation on Unsupported Browsers

If `localStorage` is not available, the site degrades gracefully to static content. If CSS Grid or Flexbox is unsupported (extremely old browsers), the layout falls back to block-level stacking — readable but not pixel-perfect.

---

## Testing Strategy

### Overview

This is a static HTML/CSS/JS site with no build pipeline. Testing is split into three layers:

1. **Unit tests** — pure JavaScript logic (StorageService, ModalController state, NavController active-link logic)
2. **DOM integration tests** — component behavior in a real or simulated DOM (jsdom via Vitest or Jest)
3. **Property-based tests** — universal properties verified across many generated inputs

### Property-Based Testing

PBT applies to this feature because several requirements express universal properties over variable inputs (viewport widths, DOM element sets, data values). The recommended library is **[fast-check](https://github.com/dubzzz/fast-check)** (JavaScript/TypeScript), which integrates with Vitest or Jest.

Each property test runs a minimum of **100 iterations**.

Tag format for each test: `// Feature: portfolio-website, Property N: <property_text>`

**Property tests to implement:**

| Property | Test Description | fast-check Arbitraries |
|---|---|---|
| P1: No horizontal overflow | Generate viewport widths in [320, 2560]; set window width; check scrollWidth ≤ clientWidth | `fc.integer({min:320, max:2560})` |
| P2: Images don't overflow containers | For each img in DOM; check offsetWidth ≤ parent.offsetWidth | DOM enumeration |
| P3: Active nav link matches page | For each of 6 pages; check exactly one nav link has active class | Enumeration over page set |
| P4: Transition durations in bounds | For each element with transition; check duration in [150,300]ms | DOM enumeration |
| P5: Contrast ratio ≥ 4.5:1 | For each text element; compute contrast ratio | DOM enumeration + color math |
| P6: LocalStorage round-trip | Generate arbitrary JSON-serializable values; set then get; check deep equality | `fc.jsonValue()` |
| P7: Modal trigger opens correctly | For each modal-trigger; simulate click; check overlay visible + src matches | DOM enumeration |
| P8: STAR cards complete | For each STAR label; check card exists with non-empty content | Enumeration over {S,T,A,R} |
| P9: Load table completeness | For each n in [1,10]; check row exists with non-empty fields | `fc.integer({min:1, max:10})` |
| P10: Timeline entries complete | For each timeline entry; check all 4 fields non-empty + numeric in achievement | DOM enumeration |
| P11: Gallery captions non-empty | For each gallery cell; check caption non-empty | DOM enumeration |
| P12: Gallery grid columns | For viewport in mobile/tablet/desktop ranges; check column count | `fc.integer` per range |
| P13: Gift cards have content | For each gift card; check title and description non-empty | DOM enumeration |
| P14: Modal locks body scroll | For each modal-trigger; open modal; check body overflow:hidden; close; check restored | DOM enumeration |

### Unit Tests (Example-Based)

Focus on specific behaviors and edge cases not covered by property tests:

- Nav hamburger toggle (open/close)
- Outside-click closes hamburger menu
- Escape key closes modal
- Overlay click closes modal
- Contact links have `target="_blank"` and `rel="noopener noreferrer"`
- H1 text content on each page matches requirements
- Badge text content on each page matches requirements
- Table horizontal scroll wrapper present on electrical.html
- Process step cards present on gifts.html
- StorageService fallback when localStorage throws SecurityError

### Smoke Tests

Manual or automated single-execution checks:

- No framework imports in any HTML/JS file
- Exactly one `css/styles.css` and one `js/main.js`
- Tailwind CDN script tag present in all HTML files
- No extraneous script/link tags
- No fetch/XHR calls that transmit localStorage data
- Only one modal overlay element in DOM at any time

### Integration / Performance Tests

- Lighthouse audit: LCP < 3 s, no render-blocking resources
- Cross-browser smoke test in Chrome, Firefox, Edge, Safari (latest stable)
- Open from `file://` protocol — verify no mixed-content or CORS errors

### Test File Structure

```
tests/
├── unit/
│   ├── storage-service.test.js
│   ├── modal-controller.test.js
│   └── nav-controller.test.js
├── property/
│   ├── storage-roundtrip.property.test.js
│   ├── modal-trigger.property.test.js
│   ├── layout-overflow.property.test.js
│   ├── nav-active.property.test.js
│   ├── transition-duration.property.test.js
│   ├── contrast-ratio.property.test.js
│   ├── star-cards.property.test.js
│   ├── load-table.property.test.js
│   ├── timeline-entries.property.test.js
│   ├── gallery-captions.property.test.js
│   ├── gallery-columns.property.test.js
│   ├── gift-cards.property.test.js
│   └── modal-scroll-lock.property.test.js
└── smoke/
    └── structure-checks.test.js
```
