/**
 * Catalogue & Carte des Hubs
 * - Filters by zone and category
 * - Interactive map with hub markers
 * - List of partners matching filters
 */
class Catalogue {
  constructor(containerElement) {
    this.container = containerElement;
    this.state = {
      activeZones: new Set(),
      activeCategories: new Set(),
      allPartners: [],
      mapData: {}
    };

    // Load data
    this.loadData().then(() => {
      this.render();
      this.initFilters();
      this.initMap();
      this.initList();
    });
  }

  async loadData() {
    // Load partners JSON
    const resp = await fetch('/src/data/partners.json');
    const data = await resp.json();
    this.state.allPartners = data.partners;
    this.state.mapData = data.zones;

    // Populate map positions
    this.state.allPartners.forEach(p => {
      const zonePath = this.state.mapData[p.zone];
      if (zonePath) {
        const mapPath = document.getElementById(zonePath.id);
        if (mapPath) {
          // Store map position relative to SVG viewBox (0-500,0-260)
          const x = zonePath.x * 500 / 500; // simple scaling; for actual positions we could map coordinates
          const y = zonePath.y * 260 / 260;
          // Use a custom data attribute to store hub position
          p._mapPos = { x, y };
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <section class="catalogue-section pt-20 pb-12">
        <div class="max-w-7xl mx-auto px-5 sm:px-6">
          <!-- Title -->
          <div class="text-center mb-8 reveal">
            <p class="eyebrow mb-3" data-i18n="cat.eyebrow">Sprint 2 — Catalogue & Carte des hubs</p>
            <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5" data-i18n="cat.title">Toute la Guadeloupe, en un coup d’œil.</h2>
            <p class="text-slate-400 text-lg" data-i18n="cat.sub">Filtrez par zone géographique et par discipline pour trouver votre terrain de jeu.</p>
          </div>

          <!-- Controls -->
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12">
            <!-- Zone filters -->
            <div class="filter-group">
              <h3 class="text-lg font-semibold mb-2 text-slate-300">Zones</h3>
              <div class="flex flex-wrap gap-2">
                ${this.state.mapData.zones.map(zone => `
                  <label class="filter-chip" data-zone="${zone.id}">
                    ${zone.label}
                    <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M8 7l8 7-8 7"/>
                    </svg>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Category filters -->
            <div class="filter-group">
              <h3 class="text-lg font-semibold mb-2 text-slate-300">Disciplines</h3>
              <div class="flex flex-wrap gap-2">
                ${this.state.mapData.categories.map(cat => `
                  <label class="filter-chip" data-category="${cat.id}">
                    ${cat.label}
                    <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="9"/>
                    </svg>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Map toggle -->
            <button id="map-toggle" class="btn-teal hidden sm:flex items-center gap-2">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12h4v8H2zM2 16h4v4h-6z"/>
              </svg>
              <span class="text-sm">Carte</span>
            </button>
          </div>

          <!-- Map container -->
          <div class="relative map-container mb-8 h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-soft-lg">
            <div id="map" class="map-wrapper"></div>
          </div>

          <!-- List of partners -->
          <div id="partner-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Partners will be injected here -->
          </div>
        </div>
      </section>
    `;
  }

  initFilters() {
    // Zone filters
    this.container.querySelectorAll('[data-zone]').forEach(btn => {
      btn.addEventListener('click', () => {
        const zoneId = btn.dataset.zone;
        if (this.state.activeZones.has(zoneId)) {
          this.state.activeZones.delete(zoneId);
          btn.classList.remove('selected');
        } else {
          this.state.activeZones.add(zoneId);
          btn.classList.add('selected');
        }
        this.renderList();
      });
    });

    // Category filters
    this.container.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.category;
        if (this.state.activeCategories.has(catId)) {
          this.state.activeCategories.delete(catId);
          btn.classList.remove('selected');
        } else {
          this.state.activeCategories.add(catId);
          btn.classList.add('selected');
        }
        this.renderList();
      });
    });
  }

  initMap() {
    // Render map SVG
    const mapContainer = this.container.querySelector('#map');
    const mapSvg = document.getElementById('guadeloupe'); // imported via script tag or inline

    // Ensure map SVG is in DOM
    if (!mapContainer.contains(document.getElementById('guadeloupe'))) {
      mapContainer.appendChild(document.getElementById('guadeloupe'));
    }

    // Create hub markers (circles) for each partner
    this.state.allPartners.forEach(partner => {
      const mapPos = partner._mapPos;
      if (!mapPos) return;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'hub-marker');
      circle.setAttribute('cx', mapPos.x);
      circle.setAttribute('cy', mapPos.y);
      circle.setAttribute('r', 8);
      circle.setAttribute('data-id', partner.id);
      circle.setAttribute('data-name', partner.name);
      circle.setAttribute('data-category', partner.category);
      circle.setAttribute('data-zone', partner.zone);
      circle.setAttribute('data-rating', partner.rating);
      circle.setAttribute('data-price', partner.price);
      circle.setAttribute('data-description', partner.description);
      circle.setAttribute('data-image', partner.image);
      circle.setAttribute('data-tooltip', `
        <strong>${partner.name}</strong>
        <br/>
        <span class="text-slate-300">${partner.town}</span>
        <br/>
        <span class="text-accent-500">Rating: ${partner.rating} ★</span>
        <br/>
        <span class="text-slate-400">Zone: ${partner.zone}</span>
        <br/>
        <span class="text-slate-300">${partner.description}</span>
      `);

      // Tooltip handling
      circle.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.innerHTML = circle.dataset.tooltip;
        document.body.appendChild(tooltip);
        const rect = circle.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY}px`;
        tooltip.style.zIndex = '1000';
      });
      circle.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.map-tooltip');
        if (tooltip) tooltip.remove();
      });

      mapContainer.appendChild(circle);
    });

    // Highlight zone on hover
    this.container.querySelectorAll('.map-zone').forEach(zone => {
      zone.addEventListener('mouseenter', () => {
        zone.classList.add('hover:fill-secondary-400');
      });
      zone.addEventListener('mouseleave', () => {
        zone.classList.remove('hover:fill-secondary-400');
      });
    });
  }

  initList() {
    const listContainer = this.container.querySelector('#partner-list');
    this.renderList();
  }

  renderList() {
    const listContainer = this.container.querySelector('#partner-list');
    const filtered = this.state.allPartners.filter(partner => {
      if (this.state.activeZones.size > 0 && !this.state.activeZones.has(partner.zone)) return false;
      if (this.state.activeCategories.size > 0 && !this.state.activeCategories.has(partner.category)) return false;
      return true;
    });

    // Sort by rating desc, then price asc
    filtered.sort((a, b) => b.rating - a.rating || a.price - b.price);

    // Render cards
    listContainer.innerHTML = filtered.map(partner => `
      <article class="premium-offer-card border border-slate-200 rounded-xl overflow-hidden shadow-soft">
        <div class="flex items-center justify-between py-4 px-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-${partner.category === 'crossfit' ? '#FF6B6B' : partner.category === 'yoga' ? '#4ECDC4' : partner.category === 'ems' ? '#FFE66D' : '#C4B5FD'} opacity-30"></div>
            <div class="text-slate-300 text-xs font-medium">${partner.initials}</div>
            <div class="text-slate-300 text-xs font-medium">${partner.category.charAt(0).toUpperCase() + partner.category.slice(1)}</div>
          </div>
          <button class="btn-teal inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-teal-600/20 hover:bg-teal-500/30 transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
            <span class="text-slate-300">Voir</span>
          </button>
        </div>

        <div class="p-6 space-y-3">
          <h3 class="text-lg font-semibold text-slate-300">${partner.name}</h3>
          <p class="text-slate-400 text-sm">${partner.description}</p>

          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-2">
              <span class="text-slate-300">Zone :</span>
              <span class="text-slate-200">${partner.zone.charAt(0).toUpperCase() + partner.zone.slice(1)}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-300">Rating :</span>
              <span class="text-accent-500 font-semibold">${partner.rating} ★</span>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-slate-300">Prix :</span>
            <span class="text-accent-500 font-semibold">${partner.price} crédits / séance</span>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-6 mt-6">
          <button class="w-full text-left text-sm text-slate-400 hover:text-slate-300 transition-colors">
            Voir le profil <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h4v8H2zM2 16h4v4h-6z"/></svg>
          </button>
        </div>
      </article>
    `).join('');
  }
}