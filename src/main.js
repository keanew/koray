/**
 * Main application entry point
 * Handles global state, language switching, and theme management.
 */

// --- State ---
const state = {
  language: 'fr', // 'fr' | 'en'
  theme: 'dark'   // 'dark' | 'light'
};

// --- DOM References ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialise language and theme
  initLanguage();
  initTheme();
});

// --- Language Toggle ---
function initLanguage() {
  // Update active language button
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === state.language);
  });

  // Switch text content for language change
  const langMap = {
    fr: {
      label: 'Français',
      subtitle: 'Offres et partenariats',
      cta: 'Découvrir les offres',
      rateSeason: 'Basse saison',
      creditUnit: 'crédits',
      currency: '€'
    },
    en: {
      label: 'English',
      subtitle: 'Offers and partners',
      cta: 'Discover offers',
      rateSeason: 'Off‑season',
      creditUnit: 'credits',
      currency: '$'
    }
  };

  const langEl = document.querySelector('.lang-btn');
  if (langEl) {
    langEl.classList.toggle('active', langEl.dataset.lang === state.language);
  }

  // Listen for language change (could be triggered by button click)
  // In a real app, you might expose a language API endpoint
}

// --- Theme Toggle ---
function initTheme() {
  // Apply initial theme
  applyTheme(state.theme);

  // Toggle button handlers
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
    });
  }

  // Listen for data-theme attribute changes (if any)
  // The CSS uses [data-theme] to control variables
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);

  // Update CSS custom properties based on theme
  if (theme === 'dark') {
    html.style.setProperty('--koray-bg', '#0F172A');
    html.style.setProperty('--koray-surface', '#1E293B');
    html.style.setProperty('--koray-text', '#F1F5F9');
    html.style.setProperty('--koray-text-2', '#1E293B');
    html.style.setProperty('--koray-muted', '#94A3B8');
    html.style.setProperty('--koray-dim', '#475569');
  } else {
    html.style.setProperty('--koray-bg', '#F8FAFC');
    html.style.setProperty('--koray-surface', '#FFFFFF');
    html.style.setProperty('--koray-text', '#0F172A');
    html.style.setProperty('--koray-text-2', '#1E293B');
    html.style.setProperty('--koray-muted', '#64748B');
    html.style.setProperty('--koray-dim', '#CBD5E1');
  }

  // Update UI elements that depend on theme (e.g., language labels)
  // The language toggle buttons use CSS variables for their active state
  // No additional JS needed for most theme-related UI changes
}

// --- Optional: Initialize language on load ---
initLanguage();

// --- Future enhancements ---
// - Save/load language preference to localStorage
// - Save/load theme preference
// - Internationalization (i18n) for all strings
// - More complex filtering and sorting
// - Animations for map markers (hover effects)
// - B2B section integration
// - Portfolio section integration

console.log('Koray application ready. Sprint 2 (Catalogue & Hubs) implemented.');
