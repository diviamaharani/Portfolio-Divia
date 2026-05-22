# Requirements Document

## Introduction

A highly professional, modern, and responsive multi-page portfolio website for Ni Putu Divia Maharani, targeting Corporate HRDs and Management Trainee (MT) Recruiters. The website showcases her engineering background, project leadership, technical skills, organizational experience, and creative pursuits across six dedicated pages. The site is built entirely with HTML, CSS (Tailwind CSS), and Vanilla JavaScript — no backend required — with all persistent data stored client-side via the browser's Local Storage API.

## Glossary

- **Portfolio_Site**: The complete multi-page portfolio website described in this document
- **Navigation_Bar**: The persistent top navigation component present on all pages
- **Hero_Section**: The prominent introductory banner on the Home page
- **STAR_Method**: A structured storytelling framework using Situation, Task, Action, and Result sections
- **MCB_Group**: Miniature Circuit Breaker group used in electrical load management tables
- **Modal_Lightbox**: An overlay dialog that displays an enlarged image when triggered
- **Gallery_Grid**: A responsive grid layout mimicking an Instagram-style image feed
- **Timeline**: A vertical chronological layout used to display leadership milestones
- **Local_Storage**: The browser's built-in client-side key-value storage API
- **Tailwind_CSS**: A utility-first CSS framework used for styling
- **Viewport**: The visible area of the browser window at any given screen size
- **Smooth_Scroll**: Animated scrolling behavior when navigating between page sections or anchors
- **Hover_Effect**: A visual change applied to an element when the user's cursor moves over it
- **Placeholder_Image**: A styled container representing a future real image asset

---

## Requirements

---

### Requirement 1: Technology Stack and Project Structure

**User Story:** As a developer maintaining this portfolio, I want a clean, single-file-per-type project structure, so that the codebase remains easy to read, update, and deploy without a build step.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL be built using only HTML, CSS, and Vanilla JavaScript with no frontend frameworks such as React or Vue.
2. THE Portfolio_Site SHALL include exactly one CSS file located at `css/styles.css`.
3. THE Portfolio_Site SHALL include exactly one JavaScript file located at `js/main.js`.
4. THE Portfolio_Site SHALL function as a standalone web application openable directly in a browser without a backend server.
5. WHERE Tailwind CSS is used, THE Portfolio_Site SHALL load Tailwind CSS via CDN or a compiled utility stylesheet included within the single CSS file.
6. THE Portfolio_Site SHALL include well-commented HTML, CSS, and JavaScript code with logical section markers and explanatory inline comments.

---

### Requirement 2: Browser Compatibility

**User Story:** As a recruiter visiting the portfolio, I want the site to display and function correctly in any modern browser, so that I can view it regardless of my preferred browser.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render correctly and without visual breakage in the latest stable versions of Chrome, Firefox, Edge, and Safari.
2. WHEN a user opens the Portfolio_Site in a supported browser, THE Portfolio_Site SHALL display all content, styles, and interactive elements without requiring browser plugins or extensions.
3. THE Portfolio_Site SHALL be usable as a standalone web application opened from the local filesystem or a static hosting URL.

---

### Requirement 3: Responsive Layout

**User Story:** As a recruiter browsing on any device, I want the portfolio to adapt its layout to my screen size, so that I can read and navigate it comfortably on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL implement a fully responsive layout that adapts to viewport widths of at least 320px (mobile), 768px (tablet), and 1280px (desktop).
2. WHEN the viewport width is below 768px, THE Navigation_Bar SHALL collapse into a hamburger menu icon that expands on tap.
3. WHEN the viewport width is 768px or above, THE Navigation_Bar SHALL display all navigation links horizontally in a single row.
4. THE Portfolio_Site SHALL use fluid grid and flexbox or CSS grid layouts so that no horizontal scrollbar appears at any supported viewport width.
5. WHEN images or Placeholder_Images are displayed, THE Portfolio_Site SHALL scale them proportionally to fit their container without overflow or distortion.

---

### Requirement 4: Navigation Bar

**User Story:** As a recruiter reviewing the portfolio, I want a persistent navigation bar that links to all six pages, so that I can jump between sections instantly from anywhere on the site.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL be visible and fixed at the top of the Viewport on all six pages at all times during scrolling.
2. THE Navigation_Bar SHALL contain labeled links to all six pages: Home, Capstone Project, Electrical Installation, Leadership, Creative Archive, and Gift Initiatives.
3. WHEN a user clicks a Navigation_Bar link, THE Portfolio_Site SHALL navigate to the corresponding page using Smooth_Scroll behavior or direct page transition within 300ms.
4. WHEN a user is on a given page, THE Navigation_Bar SHALL visually highlight the active page link using a distinct color or underline indicator.
5. THE Navigation_Bar SHALL use the defined professional color palette (deep blue/slate primary, white background, warm accent for active state).
6. IF the hamburger menu is open and the user clicks outside the menu area, THEN THE Navigation_Bar SHALL close the expanded menu.

---

### Requirement 5: Visual Design and Color Palette

**User Story:** As a recruiter viewing the portfolio, I want a professional, clean, and visually distinctive design, so that the site conveys trustworthiness and creativity simultaneously.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL apply a consistent color palette using deep professional blue or slate as the primary color, white or near-white as the background, and a warm accent color (such as amber or coral) for highlights and calls to action.
2. THE Portfolio_Site SHALL use a readable, professional sans-serif typography system with a clear visual hierarchy distinguishing headings (H1–H3), body text, and captions.
3. THE Portfolio_Site SHALL apply consistent spacing, padding, and margin values across all pages to maintain visual rhythm.
4. WHEN a user hovers over an interactive card or button, THE Portfolio_Site SHALL apply a Hover_Effect such as a subtle shadow elevation, border highlight, or color shift within 150ms.
5. THE Portfolio_Site SHALL include smooth CSS transitions on all interactive elements with a duration between 150ms and 300ms.
6. THE Portfolio_Site SHALL maintain a minimum contrast ratio of 4.5:1 between body text and its background color to meet WCAG AA readability standards.

---

### Requirement 6: Local Storage Data Persistence

**User Story:** As a developer customizing the portfolio, I want any dynamic content or user preferences stored in the browser, so that the site retains state between sessions without a backend.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use the browser Local_Storage API as the sole mechanism for any client-side data persistence.
2. WHEN the Portfolio_Site stores data to Local_Storage, THE Portfolio_Site SHALL serialize the data as a valid JSON string.
3. WHEN the Portfolio_Site reads data from Local_Storage, THE Portfolio_Site SHALL deserialize the JSON string and apply the stored values to the relevant UI elements.
4. IF Local_Storage is unavailable or throws an access error, THEN THE Portfolio_Site SHALL fall back to displaying default static content without crashing or showing an error to the user.
5. THE Portfolio_Site SHALL NOT transmit any Local_Storage data to external servers or third-party services.

---

### Requirement 7: Page 1 — Home / Professional Cover & Profile

**User Story:** As a recruiter landing on the portfolio for the first time, I want a compelling hero section and clear personal introduction, so that I immediately understand who Ni Putu Divia Maharani is and how to contact her.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the full name "Ni Putu Divia Maharani" as the primary H1 heading and the subtitle "Professional & Creative Portfolio" as a secondary heading.
2. THE Hero_Section SHALL include a brief animated or styled tagline that communicates her identity as an engineering graduate bridging analytical, data-driven thinking with team leadership and creative execution.
3. THE Portfolio_Site SHALL include an About Me section below the Hero_Section containing a concise professional statement of no more than four sentences.
4. THE Portfolio_Site SHALL display contact links for LinkedIn, Email, and at least one of GitHub or Instagram using recognizable icons and accessible anchor tags.
5. WHEN a user clicks a contact icon link, THE Portfolio_Site SHALL open the corresponding URL in a new browser tab.
6. THE Home page SHALL include a clear call-to-action element (such as a button or scroll indicator) guiding the user to explore the portfolio pages.

---

### Requirement 8: Page 2 — Capstone Project

**User Story:** As a recruiter evaluating leadership and teamwork, I want a structured project showcase using the STAR method, so that I can quickly assess Ni Putu Divia Maharani's project management and collaborative capabilities.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display the page title "Sustainable Infrastructure Project: Solar-Powered Borehole Well System Planning" as the primary heading on Page 2.
2. THE Portfolio_Site SHALL include framing labels or badges highlighting "Project Leadership", "Cross-Functional Teamwork", and "Sustainable Problem Solving" prominently near the page title.
3. THE Portfolio_Site SHALL render four STAR_Method section cards labeled Situation, Task, Action, and Result, each containing descriptive text content.
4. THE Portfolio_Site SHALL include at least two Placeholder_Images styled to represent engineering blueprints or poster presentations within the page layout.
5. WHEN a user clicks a Placeholder_Image, THE Portfolio_Site SHALL open a Modal_Lightbox displaying the image at an enlarged size with a close button.
6. WHEN the Modal_Lightbox is open and the user presses the Escape key, THE Portfolio_Site SHALL close the Modal_Lightbox.

---

### Requirement 9: Page 3 — Electrical Installation

**User Story:** As a recruiter assessing technical and analytical skills, I want a structured technical project page with blueprints and a load table, so that I can evaluate precision, data-driven decision making, and engineering competence.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display the page title "Technical Planning: 2-Story Residential Electrical & Load Management" as the primary heading on Page 3.
2. THE Portfolio_Site SHALL include framing labels or badges highlighting "Data-Driven Decision Making", "Resource & Risk Mitigation", and "Precision Tracking" prominently near the page title.
3. THE Portfolio_Site SHALL render a responsive grid layout containing at least two Placeholder_Images styled to represent CAD installation blueprints.
4. THE Portfolio_Site SHALL include a structured load grouping table displaying MCB Groups numbered 1 through 10, with columns for group number, circuit description, and load value or notes.
5. WHEN a user clicks a Placeholder_Image on Page 3, THE Portfolio_Site SHALL open a Modal_Lightbox displaying the image at an enlarged size with a close button.
6. THE load grouping table SHALL be horizontally scrollable on viewport widths below 768px to prevent layout overflow.

---

### Requirement 10: Page 4 — Leadership & Organization Experience

**User Story:** As a recruiter evaluating managerial potential, I want a visually clear timeline or card layout of leadership roles, so that I can quickly identify quantifiable achievements and organizational impact.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display the page title "Leadership & Organizational Milestones" as the primary heading on Page 4.
2. THE Portfolio_Site SHALL include framing labels or badges highlighting "Project Management", "Event Execution", and "Team Coordination" prominently near the page title.
3. THE Portfolio_Site SHALL render leadership entries using either a vertical Timeline layout or interactive cards, with each entry containing a role title, organization name, date range, and a description of achievements.
4. EACH leadership entry SHALL include at least one quantifiable achievement or measurable outcome stated in the description text.
5. WHEN a user hovers over a Timeline entry or leadership card, THE Portfolio_Site SHALL apply a Hover_Effect that visually elevates or highlights the entry.
6. THE Timeline or card layout SHALL remain readable and properly stacked on viewport widths below 768px.

---

### Requirement 11: Page 5 — Creative Archive (Crochet Work)

**User Story:** As a recruiter assessing personal growth and consistency, I want an aesthetic gallery showcasing crochet project documentation, so that I can see evidence of discipline, creative execution, and project tracking.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display the page title "Digital Project Management: Managing @dipsandstitches" as the primary heading on Page 5.
2. THE Portfolio_Site SHALL include framing labels or badges highlighting "Growth Mindset", "Consistency", and "Project Documentation" prominently near the page title.
3. THE Portfolio_Site SHALL render a Gallery_Grid layout with a minimum of six Placeholder_Image cells styled to mimic an Instagram feed aesthetic.
4. EACH Gallery_Grid cell SHALL display a caption or overlay text describing the project or technique shown.
5. WHEN a user clicks a Gallery_Grid cell, THE Portfolio_Site SHALL open a Modal_Lightbox displaying the image and caption at an enlarged size with a close button.
6. THE Gallery_Grid SHALL display three columns on desktop viewports, two columns on tablet viewports, and one column on mobile viewports.

---

### Requirement 12: Page 6 — End-to-End Creative Gift Initiatives

**User Story:** As a recruiter evaluating initiative and user-centric thinking, I want a showcase of custom-designed memorabilia with process documentation, so that I can assess creativity, vendor management, and end-to-end execution skills.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display the page title "End-to-End Product Design: Customized Memorabilia" as the primary heading on Page 6.
2. THE Portfolio_Site SHALL include framing labels or badges highlighting "User-Centric Mindset", "Invention & Initiative", and "Vendor & Production Management" prominently near the page title.
3. THE Portfolio_Site SHALL render a showcase layout displaying custom-designed items including pins, mini gifts, and print items, each with a title and brief process description.
4. THE Portfolio_Site SHALL include a visible process narrative or step cards describing the workflow from ideation through Canva design to final physical production.
5. WHEN a user clicks a product showcase image or Placeholder_Image on Page 6, THE Portfolio_Site SHALL open a Modal_Lightbox displaying the item at an enlarged size with a close button.
6. THE showcase layout SHALL adapt from a multi-column grid on desktop to a single-column stacked layout on mobile viewports.

---

### Requirement 13: Modal Lightbox Component

**User Story:** As a recruiter viewing project images, I want a modal lightbox that enlarges images on click, so that I can inspect visual details without leaving the page.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL implement a single reusable Modal_Lightbox component used across all pages that display images.
2. WHEN a Modal_Lightbox is opened, THE Portfolio_Site SHALL display a semi-transparent dark overlay covering the full Viewport behind the enlarged image.
3. THE Modal_Lightbox SHALL include a clearly visible close button (×) in the top-right corner of the overlay.
4. WHEN a user clicks the dark overlay area outside the enlarged image, THE Portfolio_Site SHALL close the Modal_Lightbox.
5. WHEN the Modal_Lightbox is open, THE Portfolio_Site SHALL prevent the page body from scrolling.
6. THE Modal_Lightbox SHALL apply a smooth fade-in transition when opening and a fade-out transition when closing, each with a duration between 150ms and 300ms.

---

### Requirement 14: Performance

**User Story:** As a recruiter opening the portfolio, I want the pages to load and respond quickly, so that I am not kept waiting and can navigate fluidly.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL load and render the initial visible content of any page within 3 seconds on a standard broadband connection (10 Mbps or above).
2. WHEN a user interacts with a navigation link, hover effect, or modal trigger, THE Portfolio_Site SHALL respond visually within 100ms.
3. THE Portfolio_Site SHALL NOT load any unused JavaScript libraries or CSS frameworks beyond what is required for the defined features.
4. THE Portfolio_Site SHALL use optimized or appropriately sized image assets (or Placeholder_Images) to avoid unnecessary bandwidth consumption.
