/**
 * ============================================================================
 * KING CONSTRUCTION HOLDINGS S.A. — CORE SCRIPT
 * Premium Corporate Concept & Interactive Architecture
 * File: script.js (Vanilla JavaScript ES6+)
 * ============================================================================
 */

'use strict';

// Ensure DOM is fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * Main application initializer
 */
function initApp() {
  initYear();
  initNavigation();
  initMobileMenu();
  initScrollHeader();
  initFormValidation();
  handleInitialHash();
}

/**
 * Set the current dynamic year in the footer
 */
function initYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * ============================================================================
 * 1. SECTION SWITCHING & NAVIGATION ENGINE
 * ============================================================================
 */

// Valid application section IDs
const VALID_PAGES = ['home', 'about', 'services', 'contact'];

/**
 * Reusable function to switch between the 4 corporate sections seamlessly
 * @param {string} pageId - Target section ID ('home', 'about', 'services', 'contact')
 * @param {boolean} updateHistory - Whether to push state to browser history (default true)
 */
function switchPage(pageId, updateHistory = true) {
  // Fallback to 'home' if invalid page provided
  const targetId = VALID_PAGES.includes(pageId) ? pageId : 'home';

  // 1. Hide all page sections
  const allSections = document.querySelectorAll('.page-section');
  allSections.forEach(section => {
    section.classList.remove('active');
  });

  // 2. Display the selected section
  const targetSection = document.getElementById(`page-${targetId}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // 3. Remove active class from all desktop and mobile navigation links
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  allNavLinks.forEach(link => {
    link.classList.remove('active');
  });

  // 4. Apply active class to matching navigation links
  const activeLinks = document.querySelectorAll(`[data-page="${targetId}"]`);
  activeLinks.forEach(link => {
    link.classList.add('active');
  });

  // 5. Smoothly scroll the window to the top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // 6. Update browser URL hash without full page reload
  if (updateHistory) {
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${targetId}`);
    } else {
      window.location.hash = targetId;
    }
  }

  // 7. Update document title for context & SEO
  updateDocumentTitle(targetId);

  // 8. Close mobile navigation menu if opened
  closeMobileMenu();
}

/**
 * Dynamic document title based on active section
 */
function updateDocumentTitle(pageId) {
  const titles = {
    home: 'King Construction Holdings S.A. | Building Your Dreams Into Reality',
    about: 'About Us | King Construction Holdings S.A. — Buea, Cameroon',
    services: 'Services & Divisions | King Construction Holdings S.A.',
    contact: 'Contact & Project Inquiries | King Construction Holdings S.A.'
  };

  if (titles[pageId]) {
    document.title = titles[pageId];
  }
}

/**
 * Initialize navigation click listeners & hashchange observation
 */
function initNavigation() {
  // Handle popstate / hashchange (browser forward / back buttons)
  window.addEventListener('hashchange', () => {
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    if (VALID_PAGES.includes(rawHash)) {
      switchPage(rawHash, false);
    }
  });

  // Handle popstate for history navigation
  window.addEventListener('popstate', () => {
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    if (VALID_PAGES.includes(rawHash)) {
      switchPage(rawHash, false);
    } else {
      switchPage('home', false);
    }
  });
}

/**
 * Parse URL on first load and navigate to appropriate hash if present
 */
function handleInitialHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (VALID_PAGES.includes(hash)) {
    switchPage(hash, false);
  } else {
    switchPage('home', false);
  }
}

/**
 * Dedicated handler for "Get a Quote" CTAs across the site
 */
function handleQuoteClick(preselectedService = null) {
  switchPage('contact');

  // If a specific service was requested, pre-select it in the enquiry dropdown
  if (preselectedService) {
    const serviceSelect = document.getElementById('serviceInterest');
    if (serviceSelect) {
      serviceSelect.value = preselectedService;
    }
  }

  // Focus the first form element smoothly after section transition
  setTimeout(() => {
    const nameInput = document.getElementById('fullName');
    if (nameInput) {
      nameInput.focus();
    }
  }, 350);
}

/**
 * ============================================================================
 * 2. MOBILE HAMBURGER MENU & DRAWER
 * ============================================================================
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (!menuBtn || !mobileDrawer) return;

  // Toggle button click
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close when clicking outside drawer content
  mobileDrawer.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) {
      closeMobileMenu();
    }
  });

  // Close with Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
      menuBtn.focus();
    }
  });
}

function openMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuBtn && mobileDrawer) {
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuBtn && mobileDrawer) {
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling
  }
}

/**
 * ============================================================================
 * 3. STICKY HEADER ELEVATION ON SCROLL
 * ============================================================================
 */
function initScrollHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Check immediately on load
}

/**
 * ============================================================================
 * 4. SERVICES DIVISION FILTERING
 * ============================================================================
 */
function filterServices(category, triggerBtn = null) {
  // Update button active states if a button triggered this
  if (triggerBtn) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    triggerBtn.classList.add('active');
  } else {
    // If called programmatically, synchronize the filter buttons
    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
    if (matchingBtn) {
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => btn.classList.remove('active'));
      matchingBtn.classList.add('active');
    }
  }

  const divisionBlocks = document.querySelectorAll('.service-division-block');

  divisionBlocks.forEach(block => {
    const blockCategory = block.getAttribute('data-category');
    if (category === 'all' || blockCategory === category) {
      block.classList.remove('hidden');
    } else {
      block.classList.add('hidden');
    }
  });
}

/**
 * ============================================================================
 * 5. CONTACT ENQUIRY FORM CLIENT-SIDE VALIDATION
 * ============================================================================
 */
function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Real-time clearance of validation errors on user input
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
    input.addEventListener('change', () => {
      clearFieldError(input);
    });
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('contactForm');
  const successBanner = document.getElementById('formSuccessBanner');

  if (!form) return;

  // Form field references
  const fullName = document.getElementById('fullName');
  const emailAddress = document.getElementById('emailAddress');
  const phoneNumber = document.getElementById('phoneNumber');
  const serviceInterest = document.getElementById('serviceInterest');
  const projectDescription = document.getElementById('projectDescription');

  let isValid = true;

  // 1. Validate Full Name (Min 2 chars)
  if (!fullName.value.trim() || fullName.value.trim().length < 2) {
    showFieldError(fullName, 'Please enter your full legal or representative name (at least 2 characters).');
    isValid = false;
  } else {
    clearFieldError(fullName);
  }

  // 2. Validate Email Address (Standard RFC regex check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddress.value.trim() || !emailRegex.test(emailAddress.value.trim())) {
    showFieldError(emailAddress, 'Please provide a valid corporate or personal email address.');
    isValid = false;
  } else {
    clearFieldError(emailAddress);
  }

  // 3. Validate Phone Number (Allow Cameroonian & international formats, min 8 digits)
  const phoneClean = phoneNumber.value.replace(/[^0-9+]/g, '');
  if (!phoneClean || phoneClean.length < 8) {
    showFieldError(phoneNumber, 'Please provide a valid contact telephone number (e.g. +237 682 105 925).');
    isValid = false;
  } else {
    clearFieldError(phoneNumber);
  }

  // 4. Validate Service of Interest selection
  if (!serviceInterest.value) {
    showFieldError(serviceInterest, 'Please select the service division or capability of interest.');
    isValid = false;
  } else {
    clearFieldError(serviceInterest);
  }

  // 5. Validate Project Description (Min 10 characters for meaningful scope)
  if (!projectDescription.value.trim() || projectDescription.value.trim().length < 10) {
    showFieldError(projectDescription, 'Please describe your project location and scope (minimum 10 characters).');
    isValid = false;
  } else {
    clearFieldError(projectDescription);
  }

  // If validation fails, focus the first invalid field
  if (!isValid) {
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  if (successBanner) {
    form.style.display = 'none';
    successBanner.style.display = 'flex';
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Display inline validation error message for a given input element
 */
function showFieldError(inputElement, errorMessage) {
  inputElement.classList.add('is-invalid');
  const errorContainer = document.getElementById(`${inputElement.id}Error`);
  if (errorContainer) {
    errorContainer.textContent = errorMessage;
  }
}

/**
 * Clear inline validation error message for a given input element
 */
function clearFieldError(inputElement) {
  inputElement.classList.remove('is-invalid');
  const errorContainer = document.getElementById(`${inputElement.id}Error`);
  if (errorContainer) {
    errorContainer.textContent = '';
  }
}

/**
 * Reset the contact form and return from success state to form view
 */
function resetContactForm() {
  const form = document.getElementById('contactForm');
  const successBanner = document.getElementById('formSuccessBanner');

  if (form) {
    form.reset();
    form.style.display = 'block';

    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => clearFieldError(input));
  }

  if (successBanner) {
    successBanner.style.display = 'none';
  }
}

/**
 * ============================================================================
 * 6. LOW-BANDWIDTH ON-DEMAND MEDIA LOADERS (FACADE PATTERN)
 * ============================================================================
 */

/**
 * Loads the interactive Google Maps iframe only when explicitly requested.
 * Prevents transferring >1.5 MB of map scripts on initial mobile page loads.
 */
function loadInteractiveMap() {
  const container = document.getElementById('mapContainer');
  if (!container) return;

  container.innerHTML = `
    <iframe 
      title="Google Maps Location of Molyko, Buea, Cameroon"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15919.123547466854!2d9.273010787158203!3d4.152865999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106131c94ffcbb77%3A0xc367610c3f5080e7!2sMolyko%2C%20Buea%2C%20Cameroon!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
      width="100%" 
      height="220" 
      style="border:0; display:block;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `;
}

// Export functions to window for direct HTML inline event handlers
window.switchPage = switchPage;
window.handleQuoteClick = handleQuoteClick;
window.filterServices = filterServices;
window.handleFormSubmit = handleFormSubmit;
window.resetContactForm = resetContactForm;
window.loadInteractiveMap = loadInteractiveMap;

