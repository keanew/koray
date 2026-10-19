/* =========================================================
   KORAY — DATA LAYER (source unique de vérité)
   Données inlinées (aucun fetch) pour un fonctionnement
   100% navigateur, y compris en ouverture directe file://
   ========================================================= */
(function (global) {
  'use strict';

  /* ---------- Hubs / zones géographiques ---------- */
  const HUBS = [
    {
      id: 'jarry',
      label: 'Jarry · Baie-Mahault',
      short: 'Jarry',
      zone: 'Grande-Terre',
      kind: 'Hub économique & tertiaire',
      desc: "Pôle d'affaires du Nord :记忆中 bureaux, entrepôts logistiques et complexes sportifs de nouvelle génération.",
      coord: { x: 300, y: 58 },
      hue: '#FF6B6B'
    },
    {
      id: 'abymes',
      label: 'Les Abymes · Pointe-à-Pitre',
      short: 'Abymes',
      zone: 'Grande-Terre',
      kind: 'Cœur administratif & commercial',
      desc: "Centre névralgique de l'île :préfecture,.CHUs, galeries et salles mythiques à quelques minutes du port.",
      coord: { x: 303, y: 82 },
      hue: '#4ECDC4'
    },
    {
      id: 'gosier',
      label: 'Bas-du-Fort · Le Gosier',
      short: 'Gosier',
      zone: 'Grande-Terre',
      kind: 'Front de mer & hôtellerie 5★',
      desc: "La riviera guadeloupéenne : complexes balnéaires, marinas et spas d'hôtels haut de gamme.",
      coord: { x: 274, y: 108 },
      hue: '#FFE66D'
    },
    {
      id: 'sainte-anne',
      label: 'Sainte-Anne · Saint-François',
      short: 'Sainte-Anne',
      zone: 'Grande-Terre',
      kind: 'Littoral sud & tourisme bleu',
      desc: "Pôle balnéaire et nautique, spots de kite-surf, thalasso et yoga en fin de journée.",
      coord: { x: 418, y: 78 },
      hue: '#C4B5FD'
    }
  ];

  /* ---------- Catégories ---------- */
  const CATEGORIES = [
    { id: 'crossfit', label: 'CrossFit & HIIT', icon: 'dumbbell', color: '#FF6B6B', desc: 'CrossFit, HIIT, haltérophilie, cours collectifs' },
    { id: 'ems', label: 'Électrostimulation EMS', icon: 'bolt', color: '#FFE66D', desc: '20 min de coaching 1:1, bilan santé et suivi nutrition' },
    { id: 'yoga', label: 'Yoga & Pilates', icon: 'lotus', color: '#4ECDC4', desc: 'Vinyasa, hatha,yin, reformer, yoga aérien' },
    { id: 'spa', label: 'Spas & Hôtels', icon: 'spa', color: '#C4B5FD', desc: 'Massages, hammam, hydrothérapie, soins signature 5★' }
  ];

  /* ---------- Partenaires ---------- */
  const PARTNERS = [
    {
      id: 'p-jarry-crossfit', name: 'CrossFit Jarry', category: 'crossfit', hub: 'jarry',
      town: 'Jarry', coord: { x: 296, y: 54 }, rating: 4.8, reviews: 214,
      basePrice: 9, capacity: 18, duration: 60, hotel: false,
      desc: 'Box de 2 000 m² en zone d\'activité : haltérophilie complète, cours "WOD" quotidiens et initiations le samedi.',
      tags: ['Parking gratuit', 'Douches', '24/7', 'Compétitions'],
      grad: 'linear-gradient(135deg,#FF6B6B,#B34848)'
    },
    {
      id: 'p-jarry-ems', name: 'Jarry EMS Studio', category: 'ems', hub: 'jarry',
      town: 'Baie-Mahault', coord: { x: 306, y: 63 }, rating: 4.7, reviews: 96,
      basePrice: 11, capacity: 10, duration: 45, hotel: false,
      desc: 'Électrostimulation musculaire 20 min, coaching 1:1, bilan de santé et programme nutrition personnalisé.',
      tags: ['Coaching 1:1', 'Bilan santé', 'Nutrition'],
      grad: 'linear-gradient(135deg,#FFE66D,#E6CC61)'
    },
    {
      id: 'p-jarry-yoga', name: 'Baie-Mahault Wellness Club', category: 'yoga', hub: 'jarry',
      town: 'Baie-Mahault', coord: { x: 292, y: 66 }, rating: 4.5, reviews: 112,
      basePrice: 7, capacity: 16, duration: 60, hotel: false,
      desc: 'Studio de yoga & reformer au cœur du quartier d\'affaires, cours du matin et du soir en semaine.',
      tags: ['Reformer', 'Tapis fournis', 'Coaching corporate'],
      grad: 'linear-gradient(135deg,#4ECDC4,#358D87)'
    },
    {
      id: 'p-abymes-crossfit', name: 'CrossFit Pointe-à-Pitre', category: 'crossfit', hub: 'abymes',
      town: 'Pointe-à-Pitre', coord: { x: 294, y: 90 }, rating: 4.9, reviews: 268,
      basePrice: 10, capacity: 20, duration: 60, hotel: false,
      desc: 'La référence du CrossFit en Guadeloupe : coach ISA, gymnase complet, CrossFit Games Regionals.',
      tags: ['Coach ISA', 'Open day', 'Parking'],
      grad: 'linear-gradient(135deg,#FF6B6B,#803333)'
    },
    {
      id: 'p-abymes-ems', name: 'EMS Pro Caraïbes', category: 'ems', hub: 'abymes',
      town: 'Les Abymes', coord: { x: 308, y: 76 }, rating: 4.6, reviews: 121,
      basePrice: 12, capacity: 8, duration: 45, hotel: false,
      desc: 'Centre EMS premium, électrostimulation dernière génération, suivi nutrition et bilan biométrique.',
      tags: ['Premium', 'Nutrition', '8 places'],
      grad: 'linear-gradient(135deg,#FFE66D,#B39348)'
    },
    {
      id: 'p-pierre-vacances', name: 'Pierre & Vacances Grande-Terre', category: 'spa', hub: 'abymes',
      town: 'Les Abymes', coord: { x: 314, y: 70 }, rating: 4.7, reviews: 342,
      basePrice: 18, capacity: 14, duration: 60, hotel: true,
      desc: 'Résidence 4★ avec spa, piscine, sauna et fitness : l\'adresse带孩子 en famille et des soigneurs chevronnés.',
      tags: ['Hôtel 4★', 'Piscine', 'Sauna', 'Familial'],
      grad: 'linear-gradient(135deg,#C4B5FD,#8B7BD8)'
    },
    {
      id: 'p-gosier-crossfit', name: 'Gosier CrossFit Box', category: 'crossfit', hub: 'gosier',
      town: 'Le Gosier', coord: { x: 280, y: 102 }, rating: 4.6, reviews: 138,
      basePrice: 9, capacity: 16, duration: 60, hotel: false,
      desc: 'Box à 5 minutes de la marina, séances sunrise et créneaux du soir très demandés en haute saison.',
      tags: ['Sunrise', 'Front de mer', 'Douches premium'],
      grad: 'linear-gradient(135deg,#FF6B6B,#E65A5A)'
    },
    {
      id: 'p-zen-yoga', name: 'Zen Yoga Studio', category: 'yoga', hub: 'gosier',
      town: 'Le Gosier', coord: { x: 268, y: 112 }, rating: 4.6, reviews: 158,
      basePrice: 7, capacity: 14, duration: 60, hotel: false,
      desc: 'Yoga doux, dynamique et prénatal dans une ambiance zen, avecTerrasse ouverte sur la baie.',
      tags: ['Terrasse', 'Prénatal', 'Cours collectif'],
      grad: 'linear-gradient(135deg,#4ECDC4,#266660)'
    },
    {
      id: 'p-toubana', name: 'La Toubana Hôtel & Spa', category: 'spa', hub: 'gosier',
      town: 'Le Gosier', coord: { x: 262, y: 116 }, rating: 4.9, reviews: 428,
      basePrice: 22, capacity: 12, duration: 60, hotel: true,
      desc: 'Le palace de la Guadeloupe : spa signature "Ô l\'Eau", hammam, 3 piscines et vue Grande-Terre.',
      tags: ['5★', 'Hammam', '3 piscines', 'Soins signature'],
      grad: 'linear-gradient(135deg,#C4B5FD,#6D5BC4)'
    },
    {
      id: 'p-creole-beach', name: 'La Créole Beach Hôtel & Spa', category: 'spa', hub: 'gosier',
      town: 'Bas-du-Fort', coord: { x: 284, y: 96 }, rating: 4.8, reviews: 391,
      basePrice: 20, capacity: 12, duration: 60, hotel: true,
      desc: 'Spa"Guaïava" de 800 m² : gommage au coco, bain à remous, soins ayurvédiques et accès plage privée.',
      tags: ['5★', 'Bain à remous', 'Accès plage', 'Ayurvéda'],
      grad: 'linear-gradient(135deg,#FFB2B2,#C4B5FD)'
    },
    {
      id: 'p-sainte-anne-yoga', name: 'Sainte-Anne Yoga & Kite', category: 'yoga', hub: 'sainte-anne',
      town: 'Sainte-Anne', coord: { x: 408, y: 70 }, rating: 4.5, reviews: 88,
      basePrice: 8, capacity: 15, duration: 60, hotel: false,
      desc: 'Yoga au lever du soleil face au lagon, stages trimestriels et cours "post-kite" pour les pratiquants.',
      tags: ['Lagon', 'Stages', 'Post-kite'],
      grad: 'linear-gradient(135deg,#4ECDC4,#95E7DE)'
    },
    {
      id: 'p-saint-francois-ems', name: 'Studio Saint-François', category: 'ems', hub: 'sainte-anne',
      town: 'Saint-François', coord: { x: 430, y: 92 }, rating: 4.4, reviews: 64,
      basePrice: 10, capacity: 8, duration: 45, hotel: false,
      desc: 'EMS et préparation physique au cœur du spot de kite : séance courte et efficace pour les sportifs.',
      tags: ['EMS', 'Kite-surf', 'Séance 20 min'],
      grad: 'linear-gradient(135deg,#FFE66D,#FFB2B2)'
    },
    {
      id: 'p-sainte-anne-spa', name: 'Grand Spa Sainte-Anne', category: 'spa', hub: 'sainte-anne',
      town: 'Sainte-Anne', coord: { x: 420, y: 84 }, rating: 4.6, reviews: 197,
      basePrice: 16, capacity: 10, duration: 60, hotel: true,
      desc: 'Thalasso, cabine de sel, sauna finlandais et rituels bien-être : le spa préféré des familles le week-end.',
      tags: ['Thalasso', 'Cabine de sel', 'Familial'],
      grad: 'linear-gradient(135deg,#C4B5FD,#95E7DE)'
    },
    {
      id: 'p-pilates-gosier', name: 'Pilates du Gosier', category: 'yoga', hub: 'gosier',
      town: 'Le Gosier', coord: { x: 272, y: 100 }, rating: 4.7, reviews: 112,
      basePrice: 8, capacity: 10, duration: 50, hotel: false,
      desc: 'Réformers, 加强 du centre et suivi postural : 8 places par cours pour un coaching ultra-personnalisé.',
      tags: ['Reformer', '8 places', 'Renforcement'],
      grad: 'linear-gradient(135deg,#4ECDC4,#266660)'
    },
    {
      id: 'p-abymes-yoga', name: 'Yogaloft Abymes', category: 'yoga', hub: 'abymes',
      town: 'Les Abymes', coord: { x: 310, y: 88 }, rating: 4.5, reviews: 74,
      basePrice: 6, capacity: 12, duration: 60, hotel: false,
      desc: 'Yoga aérien et traditionnel en petit groupe sur terrasse, à l\'étage d\'un bâtiment historique rénové.',
      tags: ['Terrasse', 'Petit groupe', 'Aérien'],
      grad: 'linear-gradient(135deg,#95E7DE,#4ECDC4)'
    }
  ];

  /* ---------- Offres d'abonnement ---------- */
  const PLANS = [
    {
      id: 'decouverte', name: 'Découverte', price: 49, credits: 28, rollover: 6, rolloverCap: 8,
      perks: ['1 accès / semaine', '1 discipline au choix', 'Crédits valables 90 jours'],
      highlight: false
    },
    {
      id: 'passion', name: 'Passion', price: 89, credits: 55, rollover: 8, rolloverCap: 12,
      perks: ['2 accès / semaine', 'Toutes disciplines', 'Crédits valables 90 jours'],
      highlight: true
    },
    {
      id: 'intense', name: 'Intense', price: 139, credits: 90, rollover: 12, rolloverCap: 18,
      perks: ['Accès illimité', 'Priorité créneaux 7h-9h', 'Crédits valables 120 jours'],
      highlight: false
    }
  ];

  /* ---------- Saisonnalité (Guadeloupe) ---------- */
  const SEASONS = {
    high: { id: 'high', label: 'Haute saison', months: [11, 12, 1, 2, 3, 4], factor: 1.15, note: 'Nov → Avr · tourisme + flights, taux d\'occupation hôtelier > 80%.' },
    mid: { id: 'mid', label: 'Saison intermédiaire', months: [5, 6, 7, 8], factor: 1.0, note: 'Mai → Août · affluence régulière, promotions mids et tarif plein.' },
    low: { id: 'low', label: 'Basse saison cyclonique', months: [9, 10], factor: 0.85, note: 'Sept → Oct · les hôtels bradent leurs créneaux invendus aux résidents locaux.' }
  };

  const MONTHS = [
    { m: 1, label: 'Jan', season: 'high' }, { m: 2, label: 'Fév', season: 'high' },
    { m: 3, label: 'Mar', season: 'high' }, { m: 4, label: 'Avr', season: 'high' },
    { m: 5, label: 'Mai', season: 'mid' }, { m: 6, label: 'Juin', season: 'mid' },
    { m: 7, label: 'Juil', season: 'mid' }, { m: 8, label: 'Août', season: 'mid' },
    { m: 9, label: 'Sept', season: 'low' }, { m: 10, label: 'Oct', season: 'low' },
    { m: 11, label: 'Nov', season: 'high' }, { m: 12, label: 'Déc', season: 'high' }
  ];

  /* ---------- Entreprises B2B ---------- */
  const B2B_COMPANIES = [
    { id: 'chu', name: 'CHU de Guadeloupe', sector: 'Santé', employees: 3200, icon: '✚' },
    { id: 'gbh', name: 'GBH', sector: 'Hospitalier', employees: 4800, icon: '⌂' },
    { id: 'edf', name: 'EDF Guadeloupe', sector: 'Énergie', employees: 640, icon: '⚡' },
    { id: 'corsair', name: 'Corsair', sector: 'Transport aérien', employees: 950, icon: '✈' }
  ];

  /* ---------- Paramètres URSSAF (loi du 2 mars 2022) ---------- */
  const URSSAF = {
    employerRate: 0.42,          // taux global charges patronales (hors réduction générale)
    lawDate: '2 mars 2022',
    headcountThreshold: 50,     // seuil d'effectif de l'exonération
    payrollCapMonthly: 30000,   // masse salariale mensuelle max (€)
    reductionGeneralMax: 0.30   // taux de réduction générale max appliqué auxendel'
  };

  /* ---------- Utilitaires de génération de créneaux ---------- */
  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }

  const SLOTS_TIMES = ['06:30', '07:00', '07:30', '08:00', '09:00', '10:00', '11:00', '12:15',
    '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

  /** Génère des créneaux déterministes (par partenaire) sur 7 jours */
  function generateSlots(partner, days = 7) {
    const rand = seededRandom(hashCode(partner.id) || 7);
    const out = [];
    const today = new Date();
    for (let d = 0; d < days; d++) {
      const date = new Date(today.getTime() + d * 86400000);
      const n = 2 + Math.floor(rand() * 3);
      const picks = SLOTS_TIMES.slice().sort(() => rand() - 0.5).slice(0, n);
      picks.forEach(t => {
        const hour = parseInt(t.split(':')[0], 10);
        const peak = (hour >= 7 && hour <= 9) || (hour >= 12 && hour <= 14) || (hour >= 17 && hour <= 19);
        const occupancy = Math.min(98, Math.round(18 + rand() * 72 + (peak ? 12 : 0)));
        out.push({
          id: partner.id + '-' + d + '-' + t.replace(':', ''),
          partnerId: partner.id,
          partnerName: partner.name,
          date: date.toISOString().slice(0, 10),
          time: t,
          hour: hour,
          duration: partner.duration,
          occupancy: occupancy,
          capacity: partner.capacity,
          basePrice: partner.basePrice,
          category: partner.category,
          hub: partner.hub
        });
      });
    }
    return out.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }

  /* ---------- Export ---------- */
  const KorayData = {
    HUBS, CATEGORIES, PARTNERS, PLANS, SEASONS, MONTHS, B2B_COMPANIES, URSSAF,
    generateSlots, seededRandom, hashCode,
    hubById: (id) => HUBS.find(h => h.id === id),
    categoryById: (id) => CATEGORIES.find(c => c.id === id),
    partnerById: (id) => PARTNERS.find(p => p.id === id),
    planById: (id) => PLANS.find(p => p.id === id)
  };

  global.KorayData = KorayData;
})(window);
