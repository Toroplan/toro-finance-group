/* TORO FINANCE GROUP — REPAYMENT DURATION FIELD */
(function () {
  "use strict";

  const form = document.getElementById("demoForm");
  if (!form || form.querySelector('[name="durationValue"]')) return;

  const lang = (document.documentElement.lang || "en").toLowerCase().slice(0, 2);
  const labels = {
    fr: ["Durée de remboursement", "Unité de durée", "Mois", "Années"],
    de: ["Rückzahlungsdauer", "Zeiteinheit", "Monate", "Jahre"],
    en: ["Repayment duration", "Duration unit", "Months", "Years"],
    es: ["Plazo de reembolso", "Unidad de duración", "Meses", "Años"],
    it: ["Durata del rimborso", "Unità di durata", "Mesi", "Anni"],
    pt: ["Prazo de reembolso", "Unidade de duração", "Meses", "Anos"],
    lt: ["Grąžinimo laikotarpis", "Laikotarpio vienetas", "Mėnesiai", "Metai"]
  };
  const t = labels[lang] || labels.en;

  const row = document.createElement("div");
  row.className = "form-grid duration-grid";
  row.innerHTML = `
    <label>
      <span>${t[0]}</span>
      <input type="number" name="durationValue" min="1" max="360"
             step="1" required inputmode="numeric" placeholder="12">
    </label>
    <label>
      <span>${t[1]}</span>
      <select name="durationUnit" required>
        <option value="months">${t[2]}</option>
        <option value="years">${t[3]}</option>
      </select>
    </label>
  `;

  const consent = form.querySelector('[name="consent"]');
  const consentLabel = consent ? consent.closest("label") : null;
  if (consentLabel) form.insertBefore(row, consentLabel);
  else form.appendChild(row);

  const valueInput = row.querySelector('[name="durationValue"]');
  const unitSelect = row.querySelector('[name="durationUnit"]');

  unitSelect.addEventListener("change", function () {
    valueInput.max = unitSelect.value === "years" ? "30" : "360";
    if (Number(valueInput.value) > Number(valueInput.max)) {
      valueInput.value = valueInput.max;
    }
  });

  const originalFetch = window.fetch.bind(window);
  window.fetch = function (resource, options) {
    const url = typeof resource === "string" ? resource : (resource && resource.url) || "";
    if (url.includes("/functions/v1/submit-loan") && options && typeof options.body === "string") {
      try {
        const payload = JSON.parse(options.body);
        const value = Number(valueInput.value);
        const unit = unitSelect.value;
        const max = unit === "years" ? 30 : 360;
        if (Number.isInteger(value) && value >= 1 && value <= max) {
          payload.repayment_duration = `${value} ${unit}`;
          options = { ...options, body: JSON.stringify(payload) };
        }
      } catch (error) {
        console.error("Toro duration field:", error);
      }
    }
    return originalFetch(resource, options);
  };
})();
