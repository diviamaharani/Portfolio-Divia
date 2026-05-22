/**
 * Portfolio Website — Ni Putu Divia Maharani
 * js/main.js
 *
 * Single JavaScript file for the entire portfolio site.
 * Modules:
 *   1. StorageService   — localStorage wrapper with JSON serialization & fallback
 *   2. NavController    — hamburger menu, active-link highlight, outside-click close
 *   3. ModalController  — lightbox open/close, keyboard/scroll-lock, event delegation
 *   4. PageInit         — DOMContentLoaded entry point, dispatches per-page init
 */

'use strict';

/* =============================================================================
   Section 1: StorageService
   Thin wrapper around localStorage with JSON serialization and graceful fallback.
   If localStorage is unavailable (private browsing, quota exceeded, SecurityError),
   all writes are silently discarded and reads return the provided default value.
   ============================================================================= */

const StorageService = (() => {
  /**
   * Probe localStorage to determine if it is available and writable.
   * Returns true if localStorage can be read and written; false otherwise.
   * Handles SecurityError (private browsing), QuotaExceededError, and any
   * other exception that may be thrown by the browser.
   *
   * @returns {boolean}
   */
  function _available() {
    const TEST_KEY = '__storage_probe__';
    try {
      localStorage.setItem(TEST_KEY, '1');
      localStorage.removeItem(TEST_KEY);
      return true;
    } catch (_e) {
      return false;
    }
  }

  // Determine availability once at module load time.
  const _isAvailable = _available();

  /**
   * Serialize `value` as JSON and write it to localStorage under `key`.
   * Silently discards the write if localStorage is unavailable or throws.
   *
   * @param {string} key
   * @param {*} value  — any JSON-serializable value
   */
  function set(key, value) {
    if (!_isAvailable) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_e) {
      // Quota exceeded or other runtime error — silently discard.
    }
  }

  /**
   * Read the value stored under `key` from localStorage, deserialize it from
   * JSON, and return it.  Returns `defaultValue` when:
   *   - localStorage is unavailable
   *   - the key does not exist (getItem returns null)
   *   - the stored string cannot be parsed as valid JSON
   *
   * @param {string} key
   * @param {*} [defaultValue=null]
   * @returns {*}
   */
  function get(key, defaultValue = null) {
    if (!_isAvailable) return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (_e) {
      return defaultValue;
    }
  }

  /**
   * Remove the entry stored under `key` from localStorage.
   * Silently no-ops if localStorage is unavailable or throws.
   *
   * @param {string} key
   */
  function remove(key) {
    if (!_isAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch (_e) {
      // Silently discard.
    }
  }

  return { _available, set, get, remove };
})();

/* =============================================================================
   Section 2: NavController
   Manages the responsive navigation bar:
   - Hamburger toggle for mobile menu (#mobile-menu)
   - Active-link highlighting based on <body data-page="...">
   - Outside-click listener to close the mobile menu
   ============================================================================= */

const NavController = (() => {
  /**
   * Initialise the navigation controller.
   * Reads the current page identifier from <body data-page="..."> and calls
   * setActive() to highlight the matching nav link.
   * Also binds the hamburger button click handler and the outside-click listener.
   */
  function init() {
    const hamburger = document.getElementById('hamburger-btn');
    if (!hamburger) {
      console.warn('NavController.init: #hamburger-btn not found');
    } else {
      hamburger.addEventListener('click', toggle);
    }

    // Register outside-click listener to close the mobile menu.
    document.addEventListener('click', closeOnOutside);

    // Highlight the active nav link based on the current page.
    const page = document.body.dataset.page;
    if (page) {
      setActive(page);
    }
  }

  /**
   * Toggle the mobile menu open/closed by adding or removing the `hidden` class
   * on the #mobile-menu element.
   */
  function toggle() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) {
      console.warn('NavController.toggle: #mobile-menu not found');
      return;
    }
    menu.classList.toggle('hidden');
  }

  /**
   * Document-level click handler that closes the mobile menu when the user
   * clicks outside the #main-nav element.
   *
   * @param {MouseEvent} event
   */
  function closeOnOutside(event) {
    const nav = document.getElementById('main-nav');
    if (!nav) {
      console.warn('NavController.closeOnOutside: #main-nav not found');
      return;
    }
    const menu = document.getElementById('mobile-menu');
    if (!menu) {
      // Nothing to close.
      return;
    }
    // Only act when the menu is currently open and the click was outside the nav.
    if (!menu.classList.contains('hidden') && !nav.contains(event.target)) {
      menu.classList.add('hidden');
    }
  }

  /**
   * Add the `nav-active` CSS class to the nav link whose `data-page` attribute
   * matches `page`, and remove it from all other nav links.
   *
   * @param {string} page — the page identifier, e.g. "home", "capstone"
   */
  function setActive(page) {
    const links = document.querySelectorAll('.nav-link[data-page]');
    if (!links.length) {
      console.warn('NavController.setActive: no .nav-link[data-page] elements found');
      return;
    }
    links.forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    });
  }

  return { init, toggle, closeOnOutside, setActive };
})();

/* =============================================================================
   Section 3: ModalController
   Single reusable lightbox component:
   - Injects modal overlay markup into document.body on init
   - Opens with image src + caption; closes via button, overlay click, or Escape key
   - Locks body scroll while open; restores on close
   - Uses event delegation on document for all .modal-trigger clicks
   ============================================================================= */

const ModalController = (() => {
  /** HTML markup for the modal overlay, injected once into document.body. */
  const MODAL_HTML = `
<div id="modal-overlay" class="fixed inset-0 bg-black/70 z-[100] hidden flex items-center justify-center">
  <div id="modal-content" class="relative max-w-4xl max-h-[90vh] mx-4">
    <button id="modal-close" aria-label="Close lightbox"
            class="absolute -top-8 right-0 text-white text-3xl leading-none">&times;</button>
    <img id="modal-img" src="" alt="" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"/>
    <p id="modal-caption" class="text-white text-center mt-2 text-sm"></p>
  </div>
</div>`;

  /**
   * Inject the modal overlay markup into document.body and bind all event
   * listeners:
   *   - Close button click → close()
   *   - Overlay click (outside modal-content) → close()
   *   - Escape keydown → close()
   *   - Event delegation on document for .modal-trigger clicks → open()
   *
   * Safe to call multiple times — skips injection if #modal-overlay already exists.
   */
  function init() {
    // Avoid injecting the overlay more than once.
    if (document.getElementById('modal-overlay')) {
      return;
    }

    // Inject markup at the end of <body>.
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');

    if (!overlay || !closeBtn) {
      console.warn('ModalController.init: failed to inject modal markup');
      return;
    }

    // Close button click.
    closeBtn.addEventListener('click', close);

    // Clicking the dark overlay area (outside #modal-content) closes the modal.
    overlay.addEventListener('click', (event) => {
      const content = document.getElementById('modal-content');
      if (content && !content.contains(event.target)) {
        close();
      }
    });

    // Escape key closes the modal.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        close();
      }
    });

    // Event delegation: catch all .modal-trigger clicks on the document.
    document.addEventListener('click', (event) => {
      // Walk up the DOM to find the closest .modal-trigger ancestor (or self).
      const trigger = event.target.closest('.modal-trigger');
      if (!trigger) return;

      const src = trigger.dataset.src;
      if (!src) {
        console.warn('ModalController: .modal-trigger is missing data-src attribute', trigger);
        return;
      }

      const caption = trigger.dataset.caption || '';
      open(src, caption);
    });
  }

  /**
   * Open the modal lightbox with the given image source and caption text.
   * - Sets #modal-img src and alt to `src`
   * - Sets #modal-caption text to `caption`
   * - Removes the `hidden` class from #modal-overlay to show it
   * - Locks body scroll by setting document.body.style.overflow = 'hidden'
   *
   * @param {string} src     — URL or path of the image to display
   * @param {string} caption — Caption text shown below the image
   */
  function open(src, caption) {
    const overlay = document.getElementById('modal-overlay');
    const img     = document.getElementById('modal-img');
    const cap     = document.getElementById('modal-caption');

    if (!overlay || !img || !cap) {
      console.warn('ModalController.open: modal elements not found — was init() called?');
      return;
    }

    img.src = src;
    img.alt = caption || '';
    cap.textContent = caption || '';

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the modal lightbox.
   * - Adds the `hidden` class back to #modal-overlay
   * - Restores body scroll by clearing document.body.style.overflow
   */
  function close() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) {
      console.warn('ModalController.close: #modal-overlay not found');
      return;
    }

    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  return { init, open, close };
})();

/* =============================================================================
   Section 4: PageInit
   Entry point called on DOMContentLoaded.
   Initialises shared modules (StorageService, NavController, ModalController)
   then dispatches to page-specific initialisation functions based on
   document.body.dataset.page.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   PageInit — per-page initialisation stubs
   Each function is called by the DOMContentLoaded handler below when
   document.body.dataset.page matches the corresponding page identifier.
   Stubs are intentionally empty; page-specific logic will be added in later tasks.
   ----------------------------------------------------------------------------- */

/**
 * Initialise the Home page (index.html).
 * Called when <body data-page="home">.
 */
function initHome() {
  // TODO (Task 7): hero animation, contact link wiring, CTA scroll handler
}

/**
 * Initialise the Capstone Project page (capstone.html).
 * Called when <body data-page="capstone">.
 */
function initCapstone() {
  // TODO (Task 8): STAR card interactions
}

/**
 * Initialise the Electrical Installation page (electrical.html).
 * Called when <body data-page="electrical">.
 */
function initElectrical() {
  // TODO (Task 9): load table interactions
}

/**
 * Initialise the Leadership page (leadership.html).
 * Called when <body data-page="leadership">.
 */
function initLeadership() {
  // TODO (Task 10): timeline interactions
}

/**
 * Initialise the Creative Archive page (creative.html).
 * Called when <body data-page="creative">.
 */
function initCreative() {
  // TODO (Task 11): gallery grid interactions
}

/**
 * Initialise the Gift Initiatives page (gifts.html).
 * Called when <body data-page="gifts">.
 */
function initGifts() {
  // TODO (Task 12): gift showcase interactions
}

/* -----------------------------------------------------------------------------
   DOMContentLoaded entry point
   Runs once the HTML document has been fully parsed.
   Order of operations:
     1. NavController.init()   — hamburger, active-link highlight, outside-click
     2. ModalController.init() — inject overlay markup, bind close handlers
     3. Page-specific init     — dispatch based on <body data-page="...">
   ----------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialise shared navigation (hamburger toggle, active-link highlight).
  NavController.init();

  // 2. Initialise the modal lightbox (inject markup, bind keyboard/click handlers).
  ModalController.init();

  // 3. Dispatch to the page-specific initialisation function.
  const page = document.body.dataset.page;

  switch (page) {
    case 'home':
      initHome();
      break;
    case 'capstone':
      initCapstone();
      break;
    case 'electrical':
      initElectrical();
      break;
    case 'leadership':
      initLeadership();
      break;
    case 'creative':
      initCreative();
      break;
    case 'gifts':
      initGifts();
      break;
    default:
      // Unknown or missing data-page — shared modules are still initialised above.
      if (page) {
        console.warn(`PageInit: unrecognised data-page value "${page}"`);
      }
      break;
  }
});
