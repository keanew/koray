document.addEventListener('DOMContentLoaded', () => {
  const b2bSection = document.getElementById('b2b');
  if (!b2bSection) return;

  // Create the B2B UI
  b2bSection.innerHTML = `
    <section class="b2b-section py-20">
      <div class="max-w-7xl mx-auto px-5 sm:px-6">
        <h2 class="text-3xl font-extrabold text-slate-300 mb-6">Espace Entreprise</h2>
        <p class="text-slate-400 mb-10">Simulez vos économies URSSAF grâce à la loi du 2 mars 2022.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <!-- Form -->
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-xl shadow-soft-lg">
            <h3 class="text-xl font-semibold text-slate-300 mb-4">Paramètres de l'entreprise</h3>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-300">Nombre de salariés</label>
              <input type="range" id="b2b-employees" min="1" max="500" value="50" class="w-full">
              <div class="flex items-center justify-between mt-2">
                <span id="b2b-emp-count" class="text-slate-300">50</span>
                <span class="text-slate-400 text-xs">salariés</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-300">Budget mensuel (€)</label>
              <input type="number" id="b2b-budget" min="0" max="500000" value="30000" class="w-full border border-slate-200 rounded-md py-2 px-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>

            <div class="mb-6">
              <div class="flex items-center mb-3">
                <input type="checkbox" id="b2b-exonere" class="mr-2">
                <label class="flex items-center text-sm text-slate-300">
                  Exonération URSSAF (Loi 2022)
                </label>
              </div>
              <p class="text-xs text-slate-400" id="b2b-exonere-desc">
                Une entreprise avec ≤ 50 salariés et un budget ≤ 30 000 € bénéficie d’une exonération totale des charges patronales.
              </p>
            </div>

            <button id="b2b-calculate" class="btn-premium w-full">
              Calculer
            </button>
          </div>

          <!-- Results -->
          <div class="bg-gradient-to-b from-slate-800 to-slate-700 p-8 rounded-xl shadow-soft-lg">
            <h3 class="text-xl font-semibold text-slate-300 mb-4">Résultats</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-slate-300 text-sm">
                  <span class="font-bold">Économie de charges patronales :</span>
                </div>
                <div class="text-accent-500 text-lg font-semibold" id="b2b-savings">0 €</div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-slate-300 text-sm">
                  <span class="font-bold">Coût net réel :</span>
                </div>
                <div class="text-accent-500 text-lg font-semibold" id="b2b-net-cost">0 €</div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-slate-300 text-sm">
                  <span class="font-bold">Impact QVT :</span>
                </div>
                <div class="text-slate-400 text-lg" id="b2b-qvt-impact">0%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-200 rounded-xl bg-slate-50 p-6">
          <p class="text-sm text-slate-400">
            <strong>Note :</strong> La simulation est indicative et se base sur des paramètres simplifiés. Pour une analyse précise, consultez un expert-comptable.
          </div>
        </div>
      </div>
    </section>
  `;

  // Initialize UI components
  const employeesSlider = document.getElementById('b2b-employees');
  const empCountEl = document.getElementById('b2b-emp-count');
  const budgetInput = document.getElementById('b2b-budget');
  const calculateBtn = document.getElementById('b2b-calculate');
  const savingsEl = document.getElementById('b2b-savings');
  const netCostEl = document.getElementById('b2b-net-cost');
  const qvtImpactEl = document.getElementById('b2b-qvt-impact');
  const exemptionCheckbox = document.getElementById('b2b-exonere');

  // Update employee count display
  employeesSlider.addEventListener('input', () => {
    empCountEl.textContent = employeesSlider.value;
  });

  // Calculate button
  calculateBtn.addEventListener('click', () => {
    const employees = parseInt(employeesSlider.value);
    const budget = parseFloat(budgetInput.value);
    const isExempt = exemptionCheckbox.checked;

    // Simplified URSSAF exemption logic (example)
    let savings = 0;
    let netCost = budget;

    if (employees <= 50 && budget <= 30000) {
      // Full exemption
      savings = budget * 0.10; // example 10% of budget as saved contributions
      netCost = budget - savings;
    } else {
      // Partial exemption based on employee count
      if (employees <= 100) {
        savings = budget * 0.07; // 7% exemption
      } else if (employees <= 200) {
        savings = budget * 0.05; // 5% exemption
      } else {
        savings = budget * 0.03; // 3% exemption
      }
      netCost = budget - savings;
    }

    // QVT impact (example: more satisfied employees -> 1% per 10 employees)
    const qvt = Math.min(15, Math.floor(employees / 10) * 1); // max 15%
    savingsEl.textContent = `${netCost * 0.10} €`;
    netCostEl.textContent = `${netCost.toLocaleString('fr-FR')} €`;
    qvtImpactEl.textContent = `${qvt}%`;

    // Highlight if exempt
    if (isExempt && employees <= 50 && budget <= 30000) {
      savingsEl.classList.add('text-green-500');
      savingsEl.textContent = `${(budget * 0.10).toLocaleString('fr-FR')} € (exonération totale)`;
    }
  });
});