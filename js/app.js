/* =========================================================
   KORAY — APPLICATION CORE
   Gestion du thème, langue, état global, toast, modal,
   révélation au défilement, persistance locale.
   ========================================================= */
(function (global, data) {
  'use strict';

  const Koray = global.Koray || {};
  global.Koray = Koray;

  /* ---------- STATE ---------- */
  const STORAGE_KEY = 'koray.state';
  const defaultState = {
    plan: 'passion',
    credits: 55,
    reservations: [], // {id, partner, date, time, creditsUsed}
    transactions: [], // {type, amount, note, ts}
    theme: 'dark', // 'dark' | 'light'
    lang: 'fr', // 'fr' | 'en'
    venueSlots: [] // added by partner portal
  };

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (_) {}
    }
    return { ...defaultState };
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const state = loadState();

  // reactive listeners (simple pub/sub)
  const listeners = new Map();
  function on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(cb);
  }
  function emit(event, payload) {
    const cbs = listeners.get(event);
    if (cbs) cbs.slice().forEach(cb => cb(payload));
  }

  /* ---------- THEME ---------- */
  const htmlEl = document.documentElement;
  function applyTheme(theme) {
    state.theme = theme;
    htmlEl.setAttribute('data-theme', theme);
    emit('theme-changed', theme);
  }
  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }
  // initial
  applyTheme(state.theme);

  /* ---------- LANGUAGE ---------- */
  const i18n = {
    fr: {},
    en: {}
  };
  function loadTranslations() {
    // we will fill after i18n.js loads via global.KorayI18n
    if (global.KorayI18n && global.KorayI18n.dict) {
      Object.assign(i18n.fr, global.KorayI18n.dict.fr || {});
      Object.assign(i18n.en, global.KorayI18n.dict.en || {});
    }
  }
  function t(key, fallback = key) {
    const langState = state.lang;
    const dict = i18n[langState] || {};
    return dict[key] ?? (i18n.fr[key] ?? fallback);
  }
  function setLang(lang) {
    if (['fr','en'].includes(lang)) {
      state.lang = lang;
      emit('lang-changed', lang);
      // update DOM (elements with data-i18n)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.dataset.i18n;
        if (k) {
          const val = t(k, el.textContent.trim());
          if (val !== undefined) el.textContent = val;
        }
      });
      // also update placeholder/title attributes
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const k = el.dataset.i18nPlaceholder;
        if (k) {
          const val = t(k, el.placeholder);
          if (val !== undefined) el.placeholder = val;
        }
      });
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const k = el.dataset.i18nTitle;
        if (k) {
          const val = t(k, el.title);
          if (val !== undefined) el.title = val;
        }
      });
    }
  }
  // initial
  loadTranslations();
  setLang(state.lang);

  /* ---------- CREDITS HELPERS ---------- */
  function getCredits() { return state.credits; }
  function addCredits(amount) {
    if (amount <= 0) return;
    state.credits += amount;
    state.transactions.push({
      type: 'credit',
      amount,
      note: 'Ajout manuel',
      ts: Date.now()
    });
    saveState(state);
    emit('credits-changed', state.credits);
    Koray.toast(`+${amount} crédits ajoutés`, 'success');
  }
  function deductCredits(amount) {
    if (amount <= 0) return false;
    if (state.credits < amount) return false;
    state.credits -= amount;
    state.transactions.push({
      type: 'debit',
      amount,
      note: 'Déduction réservation',
      ts: Date.now()
    });
    saveState(state);
    emit('credits-changed', state.credits);
    return true;
  }

  /* ---------- RESERVATIONS ---------- */
  function addReservation(res) {
    const {partnerId, date, time, creditsUsed} = res;
    const partner = data.partnerById(partnerId);
    const newRes = {
      id: 'res-' + Date.now() + '-' + Math.floor(Math.random()*1000),
      partner: partner ? partner.name : partnerId,
      date,
      time,
      creditsUsed,
      ts: Date.now()
    };
    state.reservations.push(newRes);
    saveState(state);
    emit('reservation-added', newRes);
    return newRes;
  }
  function getReservations() { return [...state.reservations]; }

  /* ---------- VENUE SLOTS (partner portal) ---------- */
  function addVenueSlot(slot) {
    state.venueSlots.push(slot);
    saveState(state);
    emit('venue-slot-added', slot);
  }
  function getVenueSlots() { return [...state.venueSlots]; }

  /* ---------- TOAST ---------- */
  const toastContainer = document.getElementById('koray-toasts') ||
    (() => {
      const div = document.createElement('div');
      div.id = 'koray-toasts';
      document.body.appendChild(div);
      return div;
    })();
  function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    // close button
    const btn = document.createElement('button');
    btn.className = 'btn-close';
    btn.innerHTML = '&times;';
    btn.onclick = () => el.remove();
    el.appendChild(btn);
    toastContainer.appendChild(el);
    // auto-remove after 5s
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, 5000);
  }
  Koray.toast = toast;

  /* ---------- MODAL ---------- */
  const modalOverlay = document.getElementById('koray-modal-overlay') ||
    (() => {
      const overlay = document.createElement('div');
      overlay.id = 'koray-modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
      return overlay;
    })();
  const modalPanel = document.getElementById('koray-modal-panel') ||
    (() => {
      const panel = document.createElement('div');
      panel.id = 'koray-modal-panel');
      panel.className = 'modal-panel';
      overlay.appendChild(panel);
      return panel;
    })();
  function openModal(content, options = {}) {
    modalPanel.innerHTML = '';
    if (typeof content === 'string') {
      modalPanel.innerHTML = content;
    } else if (content instanceof Node) {
      modalPanel.appendChild(content);
    }
    // optional close button
    if (options.close !== false) {
      const btn = document.createElement('button');
      btn.className = 'btn-close absolute top-2 right-2';
      btn.innerHTML = '&times;';
      btn.onclick = closeModal;
      modalPanel.style.position = 'relative';
      modalPanel.prepend(btn);
    }
    overlay.classList.remove('hidden');
    // trap focus
    const focusable = modalPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function trap(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      if (e.key === 'Escape') closeModal();
    }
    modalPanel.addEventListener('keydown', trap);
  }
  function closeModal() {
    modalOverlay.classList.add('hidden');
    modalPanel.innerHTML = '';
  }
  Koray.openModal = openModal;
  Koray.closeModal = closeModal;

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
  }
  document.addEventListener('DOMContentLoaded', initReveal);

  /* ---------- NAV HIGHLIGHT & MOBILE DRAWER ---------- */
  const navLinks = document.querySelectorAll('.koray-nav-link, .mobile-nav-link');
  const sections = ['hero','abonnements','catalogue','smartrate','b2b','partenaires','portefeuille'];
  function updateNavHighlight() {
    const scrollY = window.scrollY + 80; // offset for header
    let current = null;
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY && el.offsetTop + el.offsetHeight > scrollY) {
        current = id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const target = href && href.startsWith('#') ? href.slice(1) : '';
      if (target === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', updateNavHighlight);
  window.addEventListener('load', updateNavHighlight);
  const burger = document.getElementById('burger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (burger && mobileDrawer) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      mobileDrawer.classList.toggle('hidden');
    });
    // close on link click
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.add('hidden');
      });
    });
  }

  /* ---------- EXPORT ---------- */
  Koray.state = state;
  Koray.on = on;
  Koray.emit = emit;
  Koray.applyTheme = applyTheme;
  Koray.toggleTheme = toggleTheme;
  Koray.setLang = setLang;
  Koray.t = t;
  Koray.getCredits = getCredits;
  Koray.addCredits = addCredits;
  Koray.deductCredits = deductCredits;
  Koray.getReservations = getReservations;
  Koray.addReservation = addReservation;
  Koray.getVenueSlots = getVenueSlots;
  Koray.addVenueSlot = addVenueSlot;
  Koray.toast = toast;
  Koray.openModal = openModal;
  Koray.closeModal = closeModal;

  global.Koray = Koray;
})(window, window.KorayData || {});