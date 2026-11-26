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
    lt: ["Grąžinimo laikotarpis", "Laikotarpio vienetas", "Mėnesiai", "Metai"],
    hr: ["Rok otplate", "Jedinica trajanja", "Mjeseci", "Godine"],
    cs: ["Doba splácení", "Jednotka doby", "Měsíce", "Roky"],
    nl: ["Terugbetalingsduur", "Tijdseenheid", "Maanden", "Jaren"],
    pl: ["Okres spłaty", "Jednostka czasu", "Miesiące", "Lata"],
    sk: ["Doba splácania", "Časová jednotka", "Mesiace", "Roky"],
    ro: ["Perioada de rambursare", "Unitatea de timp", "Luni", "Ani"]
  };

  let t = labels[lang] || labels.en;

  const row = document.createElement("div");
  row.className = "form-grid duration-grid";

  row.innerHTML = `
    <label>
      <span id="durationTitle">${t[0]}</span>
      <input type="number" name="durationValue" min="1" max="360"
             step="1" required inputmode="numeric" placeholder="12">
    </label>
    <label>
      <span id="durationUnitLabel">${t[1]}</span>
      <select name="durationUnit" required>
        <option id="durationMonths" value="months">${t[2]}</option>
        <option id="durationYears" value="years">${t[3]}</option>
      </select>
    </label>
  `;

  const consent = form.querySelector('[name="consent"]');
  const consentLabel = consent ? consent.closest("label") : null;

  if (consentLabel) {
    form.insertBefore(row, consentLabel);
  } else {
    form.appendChild(row);
  }

  const valueInput = row.querySelector('[name="durationValue"]');
  const unitSelect = row.querySelector('[name="durationUnit"]');

  function refreshDurationLanguage() {
    const current = (document.documentElement.lang || "en").toLowerCase().slice(0, 2);
    t = labels[current] || labels.en;
    row.querySelector("#durationTitle").textContent = t[0];
    row.querySelector("#durationUnitLabel").textContent = t[1];
    row.querySelector("#durationMonths").textContent = t[2];
    row.querySelector("#durationYears").textContent = t[3];
  }

  const languageSelector = document.getElementById("languageSelector");
  if (languageSelector) languageSelector.addEventListener("change", function () {
    setTimeout(refreshDurationLanguage, 0);
  });


  unitSelect.addEventListener("change", function () {
    valueInput.max = unitSelect.value === "years" ? "30" : "360";

    if (Number(valueInput.value) > Number(valueInput.max)) {
      valueInput.value = valueInput.max;
    }
  });

  const originalFetch = window.fetch.bind(window);

  window.fetch = function (resource, options) {
    const url = typeof resource === "string"
      ? resource
      : (resource && resource.url) || "";

    if (
      url.includes("/functions/v1/submit-loan") &&
      options &&
      typeof options.body === "string"
    ) {
      try {
        const payload = JSON.parse(options.body);
        const value = Number(valueInput.value);
        const unit = unitSelect.value;
        const max = unit === "years" ? 30 : 360;

        if (Number.isInteger(value) && value >= 1 && value <= max) {
          const correctUnit = value === 1
            ? unit.slice(0, -1)
            : unit;

          payload.repayment_duration = `${value} ${correctUnit}`;

          options = {
            ...options,
            body: JSON.stringify(payload)
          };
        }
      } catch (error) {
        console.error("Toro duration field:", error);
      }
    }

    return originalFetch(resource, options);
  };
})();
