const $ = (selector) => document.querySelector(selector);

const amount = $("#amount");
const form = $("#demoForm");
const result = $("#result");
const whatsappButton = $("#whatsappButton");
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

    const message =
`Bonjour Toro Finance Group,

Je viens d'effectuer une pré-demande de financement.

Référence : ${reference}
Prénom : ${data.get("firstName")}
Nom : ${data.get("lastName")}
E-mail : ${data.get("email")}
Pays : ${data.get("country")}
Financement : ${data.get("product")}
Montant souhaité : ${formatAmount(data.get("amount"))}

Je comprends qu'il s'agit d'une pré-demande et qu'aucun financement n'est accordé automatiquement.`;

    whatsappButton.href =
      "https://wa.me/491787401108?text=" +
      encodeURIComponent(message);

    whatsappButton.hidden = false;

    if ($("#dashRef"))
      $("#dashRef").textContent = reference;

    if ($("#dashProduct"))
      $("#dashProduct").textContent = data.get("product");

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
      `Votre pré-demande ${reference} a été préparée. ` +
      `Elle est transmise à Toro Finance Group. ` +
      `Vous pouvez maintenant l'envoyer également sur WhatsApp.`;

    /*
      IMPORTANT :
      Le formulaire possède target="formSubmitFrame".
      FormSubmit reçoit donc la demande sans quitter la page.
      Le bouton WhatsApp reste visible.
    */
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
