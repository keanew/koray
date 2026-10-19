/**
 * SmartRate — Motorisé dynamique de tarif en crédits
 * 4 curseurs interactifs :
 *   - Heure creuse / pointe (peak_hour)
 *   - Taux d'occupation (occupancy_rate) 0-100%
 *   - Saisonnalité touristique (high season Nov-Apr vs low season Sep-Oct)
 *   - Ajustement instantané du prix en crédits par créneau
 */
class SmartRate {
  constructor() {
    this.state = {
      peakHour: 14,           // 0-23, default 14h (pointe)
      occupancy: 60,          // 0-100%
      season: 'low',          // 'high' | 'low'
      basePrice: 8            // crédits de base avant ajustement
    };

    this.elements = {};
    this.init();
  }

  init() {
    // Cache DOM elements
    this.elements = {
      peakRange: document.getElementById('sr-peak-hour'),
      peakValue: document.getElementById('sr-peak-value'),
      occRange: document.getElementById('sr-occupancy'),
      occValue: document.getElementById('sr-occupancy-value'),
      seasonRadios: document.querySelectorAll('input[name="sr-season"]'),
      priceDisplay: document.getElementById('sr-price'),
      popEl: document.getElementById('sr-price-pop')
    };

    if (!this.elements.priceDisplay) return; // safety if not on page

    // Bind input events
    this.elements.peakRange.addEventListener('input', (e) => {
      this.state.peakHour = parseInt(e.target.value);
      this.elements.peakValue.textContent = this.labelHour(this.state.peakHour);
      this.updatePrice();
    });

    this.elements.occRange.addEventListener('input', (e) => {
      this.state.occupancy = parseInt(e.target.value);
      this.elements.occValue.textContent = this.state.occupancy + '%';
      this.updatePrice();
    });

    this.elements.seasonRadios.forEach(r => {
      r.addEventListener('change', () => {
        this.state.season = r.value;
        this.updatePrice();
      });
    });

    // Initial render
    this.updatePrice();
  }

  labelHour(h) {
    if (h >= 7 && h < 10) return 'Creuse matin';
    if (h >= 10 && h < 16) return 'Pointe';
    if (h >= 16 && h < 19) return 'Retour creuse';
    return 'Nuit';
  }

  /** Compute the credit price per slot */
  updatePrice() {
    const { peakHour, occupancy, season, basePrice } = this.state;

    // Base factor: occupancy influences price inversely (more occupied => higher price)
    // Simple linear: price = basePrice * (1 + (occ-50)/100) * seasonFactor * peakFactor
    const occFactor = 1 + (occupancy - 50) / 100; // centered at 50% => factor 1 at 50%
    const peakFactor = (peakHour >= 10 && peakHour < 16) ? 1.3 : 1; // peak hour surcharge 30%

    let seasonFactor;
    if (season === 'high') {
      // High season (Nov-Apr): prices increase 20%
      seasonFactor = 1.2;
    } else {
      // Low season (Sep-Oct): prices drop 15% for residents
      seasonFactor = 0.85;
    }

    let price = Math.round(basePrice * occFactor * peakFactor * seasonFactor);

    // Add a small pop animation if price changed significantly
    if (this.elements.priceDisplay.dataset.lastPrice && price !== parseInt(this.elements.priceDisplay.dataset.lastPrice)) {
      this.elements.priceDisplay.classList.add('price-pop');
      setTimeout(() => this.elements.priceDisplay.classList.remove('price-pop'), 450);
    }
    this.elements.priceDisplay.dataset.lastPrice = price;
    this.elements.priceDisplay.textContent = price;

    // Update a small info line about factors
    const info = document.getElementById('sr-factors');
    if (info) {
      info.innerHTML = `Crédit(s) : base ${basePrice} × occ ${this.state.occupancy}% × ${peakFactor > 1 ? 'pointe +30%' : 'hors pointe'} × saison ${seasonFactor >= 1 ? 'haute +20%' : 'basse -15%'}`;
    }
  }
}

// Auto-init when DOM is ready (if module imported)
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const sr = new SmartRate();
    // expose for debugging
    window.sr = sr;
  });
}