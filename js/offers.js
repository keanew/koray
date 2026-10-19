/* =========================================================
   KORAY — OFFRES D'ABONNEMENT (Sprint 1)
   ========================================================= */
(function (global, Koray) {
  'use strict';

  const data = window.KorayData;
  const plans = data.PLANS;
  const container = document.getElementById('offers-grid');
  const rolloverChart = document.getElementById('rollover-chart');
  const rolloverLabels = document.getElementById('rollover-labels');
  const costSessionsRange = document.getElementById('cost-sessions-range');
  const costSessionsVal = document.getElementById('cost-sessions');
  const costAvgRange = document.getElementById('cost-avg-range');
  const costAvgVal = document.getElementById('cost-avg');
  const costBreakdown = document.getElementById('cost-breakdown');
  const heroPlanName = document.getElementById('hero-plan-name');
  const heroCredits = document.getElementById('hero-credits');
  const heroCreditMeter = document.getElementById('hero-credit-meter');
  const heroCreditUsed = document.getElementById('hero-credit-used');
  const heroCreditTotal = document.getElementById('hero-credit-total');
  const selectPlanButtons = document.querySelectorAll('[data-plan]');

  if (!container) return; // not on this page

  /* ---------- RENDER OFFERS GRID ---------- */
  function renderOffers() {
    container.innerHTML = '';
    plans.forEach(plan => {
      const card = document.createElement('div');
      card.className = 'premium-offer-card cursor-pointer hover:border-primary-500/50 transition-border';
      card.dataset.plan = plan.id;
      card.innerHTML = `
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-xl font-semibold">${plan.name}</h3>
            <span class="badge badge-${plan.highlight ? 'sun' : 'teal'}">${plan.price}€/mois</span>
          </div>
          <p class="text-slate-400 mb-4">${plan.perks.map(p => `• ${p}`).join('<br>')}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gradient">${plan.credits}</span>
            <span class="text-slate-400">crédits</span>
          </div>
          <div class="mt-4 text-sm text-slate-400">
            Coût moyen : <span class="font-medium">≈ ${(plan.price / plan.credits).toFixed(2)} €/crédit</span>
          </div>
        </div>
        <button class="w-full mt-4 btn-premium text-sm" data-action="select-plan">
          Choisir cette formule
        </button>
      `;
      card.querySelector('[data-action="select-plan"]').addEventListener('click', () => {
        selectPlan(plan.id);
      });
      container.appendChild(card);
    });
  }

  /* ---------- SELECT PLAN ---------- */
  function selectPlan(planId) {
    const plan = data.planById(planId);
    if (!plan) return;
    Koray.state.plan = planId;
    Koray.state.credits = plan.credits; // reset credits to plan amount on change? keep current? We'll set to plan credits.
    Koray.emit('plan-changed', plan);
    updateHeroFromPlan();
    Koray.toast(`Vous avez choisi l'abonnement ${plan.name}`, 'success');
    // close mobile drawer if open
    const burger = document.getElementById('burger');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.add('hidden');
  }

  function updateHeroFromPlan() {
    const plan = data.planById(Koray.state.plan);
    if (!plan) return;
    if (heroPlanName) heroPlanName.textContent = plan.name;
    if (heroCredits) heroCredits.textContent = plan.credits;
    if (heroCreditTotal) heroCreditTotal.textContent = `${plan.credits} max / mois`;
    // update meter width based on used (we don't have used yet)
    const used = Koray.state.credits - getAvailableCredits(); // we will compute used later; for now assume 0
    const usedPct = Math.min(100, Math.round((used / plan.credits) * 100));
    if (heroCreditMeter) heroCreditMeter.style.width = usedPct + '%';
    if (heroCreditUsed) heroCreditUsed.textContent = `${used} utilisés`;
    // update offers grid active state
    document.querySelectorAll('[data-plan]').forEach(el => {
      el.classList.toggle('selected', el.dataset.plan === Koray.state.plan);
    });
  }

  function getAvailableCredits() {
    // credits left after deducting reservations this month (simplified)
    const usedThisMonth = Koray.state.reservations.reduce((sum, r) => {
      // naive: assume all reservations are this month
      return sum + r.creditsUsed;
    }, 0);
    return Math.max(0, Koray.state.credits - usedThisMonth);
  }

  /* ---------- ROLLOVER CHART ---------- */
  function renderRolloverChart() {
    if (!rolloverChart) return;
    rolloverChart.innerHTML = '';
    rolloverLabels.innerHTML = '';
    const months = [1,2,3,4];
    const maxHeight = 100; // px
    plans.forEach((plan, idx) => {
      const roll = plan.rollover;
      const cap = plan.rolloverCap;
      const bar = document.createElement('div');
      bar.className = 'flex items-end gap-1';
      // label
      const label = document.createElement('div');
      label.className = 'text-xs text-slate-400';
      label.textContent = plan.name.slice(0,3);
      rolloverLabels.appendChild(label);
      // bar container
      const barContainer = document.createElement('div');
      barContainer.className = 'flex-1 h-[80px]';
      // background
      const bg = document.createElement('div');
      bg.className = 'h-full w-4 rounded-t-lg bg-background-200';
      // fill
      const fillHeight = Math.min(cap, roll) / cap * 100;
      const fill = document.createElement('div');
      fill.className = `h-${fillHeight}% w-full rounded-t-lg bg-${plan.highlight ? 'sun-500' : 'teal-500'}`;
      // cap indicator
      const capLine = document.createElement('div');
      capLine.className = 'h-0.5 w-full bg-background-100';
      bg.appendChild(fill);
      bg.appendChild(capLine);
      barContainer.appendChild(bg);
      bar.appendChild(barContainer);
      rolloverChart.appendChild(bar);
    });
  }

  /* ---------- COST CALCULATOR ---------- */
  function updateCost() {
    const sessions = parseInt(costSessionsRange.value) || 1;
    const avgCredits = parseInt(costAvgRange.value) || 1;
    costSessionsVal.textContent = sessions;
    costAvgVal.textContent = avgCredits;
    const monthlyCredits = sessions * avgCredits;
    // find best plan
    let bestPlan = null;
    let bestScore = 1e9;
    plans.forEach(p => {
      const over = Math.max(0, monthlyCredits - p.credits);
      const under = Math.max(0, p.credits - monthlyCredits);
      const penalty = over * 2 + under * 0.5; // overuse penalized more
      if (penalty < bestScore) {
        bestScore = penalty;
        bestPlan = p;
      }
    });
    const costPerCredit = (bestPlan ? bestPlan.price / bestPlan.credits : 0);
    const monthlyCost = monthlyCredits * costPerCredit;
    // render breakdown
    if (costBreakdown) {
      costBreakdown.innerHTML = `
        <div class="border-t border-border pt-4 mt-4">
          <div class="flex justify-between text-sm">
            <span>Besoin mensuel :</span>
            <span class="font-medium">${monthlyCredits} crédits</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Meilleure formule :</span>
            <span class="font-medium text-gradient">${bestPlan?.name || ' — '}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Coût mensuel estimé :</span>
            <span class="font-medium">${monthlyCost.toFixed(0)} €</span>
          </div>
          <div class="flex justify-between text-sm mt-2">
            <span>Économie vs. à l'unité :</span>
            <span class="font-medium text-accent-500">− ${((1 - (bestPlan?.price / (bestPlan?.credits * 2.5)) * 100).toFixed(0)}%</span>
          </div>
        </div>
      `;
    }
  }
  if (costSessionsRange) costSessionsRange.addEventListener('input', updateCost);
  if (costAvgRange) costAvgRange.addEventListener('input', updateCost);

  /* ---------- INIT ---------- */
  function init() {
    renderOffers();
    renderRolloverChart();
    updateCost();
    updateHeroFromPlan();
    // listen for plan change from other modules
    Koray.on('plan-changed', (plan) => {
      updateHeroFromPlan();
    });
    // when credits change (from wallet), update hero meter
    Koray.on('credits-changed', (credits) => {
      const plan = data.planById(Koray.state.plan);
      if (!plan) return;
      const used = Math.max(0, plan.credits - credits);
      const usedPct = Math.min(100, Math.round((used / plan.credits) * 100));
      if (heroCreditMeter) heroCreditMeter.style.width = usedPct + '%';
      if (heroCreditUsed) heroCreditUsed.textContent = `${used} utilisés`;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // expose for debugging
  global.KorayOffers = { selectPlan, renderOffers };
})(window, window.Koray);