# Implementation Plan: Portfolio Website — Ni Putu Divia Maharani

## Overview

Build a six-page static portfolio website using HTML, Tailwind CSS (CDN), and Vanilla JavaScript. The implementation proceeds incrementally: shared infrastructure first (project structure, CSS tokens, JS modules), then page-by-page content, and finally the test suite. Each step integrates immediately into the working site — no orphaned code.

## Tasks

- [x] 1. Set up project structure, CSS design tokens, and test scaffolding
  - Create the directory layout: `css/`, `js/`, `tests/unit/`, `tests/property/`, `tests/smoke/`
  - Create `css/styles.css` with CSS custom properties (design tokens: `--color-primary`, `--color-accent`, `--color-bg`, `--color-text`, `--color-text-muted`, transition variables, shadow variables) and base resets
  - Create `js/main.js` as an empty module scaffold with section comments for NavController, ModalController, StorageService, and PageInit
  - Create `package.json` with Vitest and fast-check as dev dependencies, and a `test` script
  - Create `vitest.config.js` configured for jsdom environment
  - _Requirements: 1.1, 1.2, 1.3, 1.6_

- [x] 2. Implement `StorageService` in `js/main.js`
  - [x] 2.1 Implement `StorageService._available()`, `set()`, `get()`, and `remove()` with JSON serialization and graceful fallback when `localStorage` throws
    - Guard all `localStorage` calls in try/catch; switch to no-op mode if `_available()` returns false
    - `get(key, defaultValue)` returns `defaultValue` on parse error or missing key
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 2.2 Write property test for `StorageService` round-trip (Property 6)
    - **Property 6: LocalStorage Serialization Round-Trip**
    - **Validates: Requirements 6.2, 6.3**
    - Use `fc.jsonValue()` to generate arbitrary serializable values; call `set` then `get`; assert deep equality
    - Tag: `// Feature: portfolio-website, Property 6: LocalStorage round-trip`
    - File: `tests/property/storage-roundtrip.property.test.js`

  - [ ]* 2.3 Write unit tests for `StorageService`
    - Test fallback behavior when `localStorage` throws `SecurityError`
    - Test `get` returns default when key is absent
    - Test `remove` deletes the key
    - File: `tests/unit/storage-service.test.js`
    - _Requirements: 6.4_

- [x] 3. Implement `NavController` in `js/main.js`
  - [x] 3.1 Implement `NavController.init()`, `toggle()`, `closeOnOutside()`, and `setActive(page)`
    - `init()` reads `<body data-page="...">` and calls `setActive()`
    - `toggle()` adds/removes `hidden` class on `#mobile-menu`
    - `closeOnOutside()` listens for document clicks and closes menu when target is outside `#main-nav`
    - `setActive(page)` adds `nav-active` class to the matching `[data-page]` link and removes it from all others
    - Guard against null DOM queries with early returns and `console.warn`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 3.2 Write property test for active navigation link (Property 3)
    - **Property 3: Active Navigation Link Matches Current Page**
    - **Validates: Requirements 4.4**
    - Enumerate all six `data-page` values; for each, call `setActive(page)`; assert exactly one link has `nav-active` and it matches the page
    - Tag: `// Feature: portfolio-website, Property 3: Active nav link matches page`
    - File: `tests/property/nav-active.property.test.js`

  - [ ]* 3.3 Write unit tests for `NavController`
    - Test hamburger toggle opens and closes `#mobile-menu`
    - Test outside-click closes the menu
    - File: `tests/unit/nav-controller.test.js`
    - _Requirements: 3.2, 4.6_

- [x] 4. Implement `ModalController` in `js/main.js`
  - [x] 4.1 Implement `ModalController.init()`, `open(src, caption)`, and `close()`
    - `init()` injects the modal overlay markup into `document.body` and binds close-button click, overlay click, and `Escape` keydown
    - `open()` sets `#modal-img` src and `#modal-caption` text, removes `hidden` from `#modal-overlay`, sets `document.body.style.overflow = 'hidden'`
    - `close()` adds `hidden` to `#modal-overlay`, restores `document.body.style.overflow`
    - If `data-src` is missing on a trigger, log a `console.warn` and abort
    - Wire event delegation on `document` for all `.modal-trigger` clicks
    - _Requirements: 8.5, 8.6, 9.5, 11.5, 12.5, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ]* 4.2 Write property test for modal trigger opens correctly (Property 7)
    - **Property 7: Modal Trigger Opens Lightbox with Correct Content**
    - **Validates: Requirements 8.5, 9.5, 11.5, 12.5, 13.1**
    - For each `.modal-trigger` in DOM: simulate click; assert overlay is visible, `#modal-img` src matches `data-src`, close button is present
    - Tag: `// Feature: portfolio-website, Property 7: Modal trigger opens correctly`
    - File: `tests/property/modal-trigger.property.test.js`

  - [ ]* 4.3 Write property test for modal scroll lock (Property 14)
    - **Property 14: Modal Open State Locks Body Scroll**
    - **Validates: Requirements 13.5**
    - For each `.modal-trigger`: open modal; assert `document.body.style.overflow === 'hidden'`; close modal; assert overflow is restored
    - Tag: `// Feature: portfolio-website, Property 14: Modal locks body scroll`
    - File: `tests/property/modal-scroll-lock.property.test.js`

  - [ ]* 4.4 Write unit tests for `ModalController`
    - Test Escape key closes modal
    - Test overlay click closes modal
    - Test missing `data-src` does not open modal
    - File: `tests/unit/modal-controller.test.js`
    - _Requirements: 8.6, 13.4_

- [x] 5. Checkpoint — Ensure all JS module tests pass
  - Run `npm test` and confirm StorageService, NavController, and ModalController tests all pass
  - Ask the user if any questions arise before proceeding to HTML pages

- [x] 6. Build shared navigation markup and wire `PageInit` in `js/main.js`
  - [x] 6.1 Create the shared nav HTML snippet (to be copy-pasted into each page): fixed `#main-nav`, desktop `#nav-links`, hamburger `#hamburger-btn`, mobile `#mobile-menu`
    - Apply deep blue/slate palette and amber active-state styles per design tokens
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.2 Implement `PageInit` in `js/main.js`
    - On `DOMContentLoaded`: call `StorageService` init, `NavController.init()`, `ModalController.init()`, then dispatch to page-specific init functions based on `document.body.dataset.page`
    - _Requirements: 1.3, 4.4_

  - [ ]* 6.3 Write property test for CSS transition durations (Property 4)
    - **Property 4: CSS Transition Durations Are Within Bounds**
    - **Validates: Requirements 5.5**
    - For each element with a `transition` property in the DOM; parse `transition-duration`; assert value is between 150 ms and 300 ms inclusive
    - Tag: `// Feature: portfolio-website, Property 4: Transition durations in bounds`
    - File: `tests/property/transition-duration.property.test.js`

- [x] 7. Build `index.html` — Home / Professional Cover & Profile
  - [x] 7.1 Create `index.html` with `<body data-page="home">`, Tailwind CDN `<script>`, `<link>` to `css/styles.css`, and `<script>` to `js/main.js`
    - Hero section: H1 "Ni Putu Divia Maharani", subtitle "Professional & Creative Portfolio", animated tagline
    - About Me section: concise professional statement (≤ 4 sentences)
    - Contact links: LinkedIn, Email, GitHub/Instagram with icons, `target="_blank"` and `rel="noopener noreferrer"`
    - Call-to-action button or scroll indicator
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 7.2 Write unit tests for Home page content
    - Assert H1 text is "Ni Putu Divia Maharani"
    - Assert subtitle text is "Professional & Creative Portfolio"
    - Assert contact links have `target="_blank"` and `rel="noopener noreferrer"`
    - _Requirements: 7.1, 7.4, 7.5_

- [x] 8. Build `capstone.html` — Capstone Project
  - [x] 8.1 Create `capstone.html` with `<body data-page="capstone">`, shared nav, and page content
    - H1: "Sustainable Infrastructure Project: Solar-Powered Borehole Well System Planning"
    - Framing badges: "Project Leadership", "Cross-Functional Teamwork", "Sustainable Problem Solving"
    - Four STAR cards in a 2×2 grid (desktop) / single column (mobile): Situation, Task, Action, Result — each with descriptive text
    - At least two placeholder images with `modal-trigger` class, `data-src`, and `data-caption`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 8.2 Write property test for STAR cards completeness (Property 8)
    - **Property 8: STAR Method Cards Are Complete**
    - **Validates: Requirements 8.3**
    - Enumerate {Situation, Task, Action, Result}; for each label assert a `.star-card[data-star]` exists with non-empty text content
    - Tag: `// Feature: portfolio-website, Property 8: STAR cards complete`
    - File: `tests/property/star-cards.property.test.js`

  - [ ]* 8.3 Write unit tests for Capstone page
    - Assert H1 text matches requirement
    - Assert badge text values are present
    - Assert at least two `.modal-trigger` elements exist
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 9. Build `electrical.html` — Electrical Installation
  - [x] 9.1 Create `electrical.html` with `<body data-page="electrical">`, shared nav, and page content
    - H1: "Technical Planning: 2-Story Residential Electrical & Load Management"
    - Framing badges: "Data-Driven Decision Making", "Resource & Risk Mitigation", "Precision Tracking"
    - Responsive grid with at least two placeholder images with `modal-trigger` class
    - Load grouping table: MCB Groups 1–10, columns for group number, circuit description, load (W), notes — wrapped in `overflow-x-auto`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 9.2 Write property test for load table completeness (Property 9)
    - **Property 9: Load Table Contains All MCB Groups with Required Fields**
    - **Validates: Requirements 9.4**
    - Use `fc.integer({min:1, max:10})` to generate group numbers; for each assert a table row exists with non-empty circuit description and notes
    - Tag: `// Feature: portfolio-website, Property 9: Load table completeness`
    - File: `tests/property/load-table.property.test.js`

  - [ ]* 9.3 Write unit tests for Electrical page
    - Assert H1 text matches requirement
    - Assert badge text values are present
    - Assert `overflow-x-auto` wrapper is present on the table
    - _Requirements: 9.1, 9.2, 9.6_

- [x] 10. Build `leadership.html` — Leadership & Organization Experience
  - [x] 10.1 Create `leadership.html` with `<body data-page="leadership">`, shared nav, and page content
    - H1: "Leadership & Organizational Milestones"
    - Framing badges: "Project Management", "Event Execution", "Team Coordination"
    - Vertical timeline using `<ol class="timeline">` with amber left-border line and dot markers
    - Each `<li class="timeline-entry">` contains: role title, organization name, date range, achievement description with at least one numeric/measurable metric
    - Hover effect on timeline entries (shadow elevation or highlight)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 10.2 Write property test for timeline entries completeness (Property 10)
    - **Property 10: Timeline Entries Contain All Required Fields**
    - **Validates: Requirements 10.3, 10.4**
    - For each `.timeline-entry` in DOM: assert non-empty `.role-title`, `.org-name`, date range text, `.achievement` text; assert achievement contains at least one digit
    - Tag: `// Feature: portfolio-website, Property 10: Timeline entries complete`
    - File: `tests/property/timeline-entries.property.test.js`

  - [ ]* 10.3 Write unit tests for Leadership page
    - Assert H1 text matches requirement
    - Assert badge text values are present
    - Assert at least one `.timeline-entry` exists
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 11. Build `creative.html` — Creative Archive (Crochet Work)
  - [x] 11.1 Create `creative.html` with `<body data-page="creative">`, shared nav, and page content
    - H1: "Digital Project Management: Managing @dipsandstitches"
    - Framing badges: "Growth Mindset", "Consistency", "Project Documentation"
    - Gallery grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with minimum six `<figure class="gallery-cell">` elements
    - Each cell: placeholder image, `modal-trigger` class, `data-src`, `data-caption`, hover-reveal `<figcaption>` overlay
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 11.2 Write property test for gallery captions non-empty (Property 11)
    - **Property 11: Gallery Cells Have Non-Empty Captions**
    - **Validates: Requirements 11.4**
    - For each `.gallery-cell` in DOM: assert `figcaption` or caption overlay has non-empty `textContent`
    - Tag: `// Feature: portfolio-website, Property 11: Gallery captions non-empty`
    - File: `tests/property/gallery-captions.property.test.js`

  - [ ]* 11.3 Write property test for gallery grid column count (Property 12)
    - **Property 12: Gallery Grid Column Count Matches Breakpoint**
    - **Validates: Requirements 11.6**
    - For viewport widths in mobile (< 640 px), tablet (640–1023 px), desktop (≥ 1024 px) ranges: assert computed column count is 1, 2, 3 respectively using `fc.integer` per range
    - Tag: `// Feature: portfolio-website, Property 12: Gallery grid columns match breakpoint`
    - File: `tests/property/gallery-columns.property.test.js`

  - [ ]* 11.4 Write unit tests for Creative page
    - Assert H1 text matches requirement
    - Assert badge text values are present
    - Assert at least six `.gallery-cell` elements exist
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 12. Build `gifts.html` — End-to-End Creative Gift Initiatives
  - [x] 12.1 Create `gifts.html` with `<body data-page="gifts">`, shared nav, and page content
    - H1: "End-to-End Product Design: Customized Memorabilia"
    - Framing badges: "User-Centric Mindset", "Invention & Initiative", "Vendor & Production Management"
    - Gift showcase grid: `grid-cols-1 md:grid-cols-3` with `<article class="gift-card">` elements — each with placeholder image (`modal-trigger`), `<h3>` title, `<p>` process description
    - Process step cards section: `grid-cols-1 md:grid-cols-4` with four step cards (Ideation → Canva Design → Vendor → Production)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 12.2 Write property test for gift cards content (Property 13)
    - **Property 13: Gift Showcase Items Have Required Content Fields**
    - **Validates: Requirements 12.3**
    - For each `.gift-card` in DOM: assert `h3` has non-empty `textContent` and `p` has non-empty `textContent`
    - Tag: `// Feature: portfolio-website, Property 13: Gift cards have content`
    - File: `tests/property/gift-cards.property.test.js`

  - [ ]* 12.3 Write unit tests for Gifts page
    - Assert H1 text matches requirement
    - Assert badge text values are present
    - Assert process step cards are present
    - _Requirements: 12.1, 12.2, 12.4_

- [x] 13. Checkpoint — Ensure all page content tests pass
  - Run `npm test` and confirm all unit and property tests for pages 1–6 pass
  - Ask the user if any questions arise before proceeding to cross-cutting tests

- [x] 14. Implement layout and accessibility property tests
  - [x] 14.1 Write property test for no horizontal overflow (Property 1)
    - **Property 1: No Horizontal Overflow at Any Supported Viewport Width**
    - **Validates: Requirements 3.1, 3.4**
    - Use `fc.integer({min:320, max:2560})` to generate viewport widths; for each page set `window.innerWidth`; assert `document.body.scrollWidth <= document.body.clientWidth`
    - Tag: `// Feature: portfolio-website, Property 1: No horizontal overflow`
    - File: `tests/property/layout-overflow.property.test.js`

  - [x] 14.2 Write property test for images not overflowing containers (Property 2)
    - **Property 2: Images Do Not Overflow Their Containers**
    - **Validates: Requirements 3.5**
    - For each `<img>` in DOM: assert `offsetWidth <= parentElement.offsetWidth`
    - Tag: `// Feature: portfolio-website, Property 2: Images don't overflow containers`
    - File: `tests/property/layout-overflow.property.test.js`

  - [x] 14.3 Write property test for body text contrast ratio (Property 5)
    - **Property 5: Body Text Meets WCAG AA Contrast Ratio**
    - **Validates: Requirements 5.6**
    - For each body text element: compute contrast ratio between `color` and effective `background-color`; assert ratio ≥ 4.5
    - Tag: `// Feature: portfolio-website, Property 5: Contrast ratio ≥ 4.5:1`
    - File: `tests/property/contrast-ratio.property.test.js`

  - [ ]* 14.4 Write smoke tests for structural constraints
    - Assert no framework imports (`import React`, `import Vue`, etc.) in any HTML or JS file
    - Assert exactly one `css/styles.css` and one `js/main.js` exist
    - Assert Tailwind CDN `<script>` tag is present in all six HTML files
    - Assert only one `#modal-overlay` element exists in DOM at any time
    - Assert no `fetch`/`XMLHttpRequest` calls that transmit localStorage data
    - File: `tests/smoke/structure-checks.test.js`
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 6.5_

- [x] 15. Wire all pages together and apply final polish
  - [x] 15.1 Verify all six HTML pages share identical nav markup and each has the correct `data-page` attribute on `<body>`
    - Confirm `NavController.setActive()` highlights the correct link on each page
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 15.2 Apply consistent spacing, padding, and hover effects across all pages
    - Ensure all interactive cards and buttons have `transition` properties using design token variables (`--transition-fast`, `--transition-base`)
    - Ensure hover effects apply within 150 ms per design tokens
    - _Requirements: 5.3, 5.4, 5.5_

  - [x] 15.3 Verify all placeholder images have `alt` text and CSS background-color fallback
    - Confirm all `<img>` elements include non-empty `alt` attributes
    - _Requirements: 3.5, 14.4_

  - [ ]* 15.4 Write unit tests for cross-page consistency
    - Assert each of the six pages has a `<link>` to `css/styles.css` and a `<script>` to `js/main.js`
    - Assert contact links on Home page have `target="_blank"` and `rel="noopener noreferrer"`
    - _Requirements: 1.2, 1.3, 7.5_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Run `npm test` and confirm the full test suite (unit, property, smoke) passes with zero failures
  - Ask the user if any questions arise before considering the implementation complete

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 5, 13, and 16 ensure incremental validation
- Property tests use fast-check and run a minimum of 100 iterations each
- Unit tests use Vitest with jsdom for DOM simulation
- All six HTML pages share `css/styles.css` and `js/main.js` — no per-page scripts or stylesheets
- Placeholder images use CSS background-color fallback so layout is preserved if image files are missing
