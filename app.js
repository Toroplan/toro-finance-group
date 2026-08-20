const $ = (selector) => document.querySelector(selector);

const amount = $("#amount");
const form = $("#demoForm");
const result = $("#result");
const emailReference = $("#emailReference");

const formatAmount = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

function createReference() {
  const year = new Date().getFullYear();
  const number = Math.floor(100000 + Math.random() * 900000);
  return `TF-${year}-${number}`;
}

if (amount) {
  amount.addEventListener("input", () => {
    const estimate = $("#estimateAmount");

    if (estimate) {
      estimate.textContent = formatAmount(amount.value);
    }
  });
}

if (form) {
  form.addEventListener("submit", () => {
    const reference = createReference();

    emailReference.value = reference;

    const data = new FormData(form);

    if ($("#dashRef"))
      $("#dashRef").textContent = reference;

    if ($("#dashProduct"))
      $("#dashProduct").textContent = data.get("product") || "—";

    if ($("#dashAmount"))
      $("#dashAmount").textContent =
        formatAmount(data.get("amount"));

    if ($("#dashStatus"))
      $("#dashStatus").textContent = "Demande transmise";

    localStorage.setItem(
      "toroApplication",
      JSON.stringify({
        reference,
        product: data.get("product"),
        amount: data.get("amount"),
        status: "Demande transmise"
      })
    );

    result.textContent =
      `Votre pré-demande ${reference} est en cours de transmission. ` +
      `Vous pouvez également contacter Toro Finance Group sur WhatsApp.`;
  });
}

try {
  const saved = JSON.parse(
    localStorage.getItem("toroApplication")
  );

  if (saved) {
    if ($("#dashRef"))
      $("#dashRef").textContent = saved.reference;

    if ($("#dashProduct"))
      $("#dashProduct").textContent = saved.product;

    if ($("#dashAmount"))
      $("#dashAmount").textContent =
        formatAmount(saved.amount);

    if ($("#dashStatus"))
      $("#dashStatus").textContent = saved.status;
  }
} catch (error) {
  console.warn(
    "Impossible de restaurer le suivi local.",
    error
  );
}
