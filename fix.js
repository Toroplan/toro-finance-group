/* TORO FINANCE GROUP — FORM + WHATSAPP FIX */
(function () {
  const lang = (document.documentElement.lang || navigator.language || "en")
    .toLowerCase()
    .slice(0, 2);

  const messages = {
    en: "Hello Toro Finance Group, I would like to make a financing request.",
    de: "Guten Tag Toro Finance Group, ich möchte eine Finanzierungsanfrage stellen.",
    es: "Hola Toro Finance Group, quiero realizar una solicitud de financiación.",
    it: "Buongiorno Toro Finance Group, desidero presentare una richiesta di finanziamento.",
    pt: "Olá Toro Finance Group, gostaria de fazer um pedido de financiamento.",
    lt: "Sveiki Toro Finance Group, noriu pateikti finansavimo paraišką.",
    fr: "Bonjour Toro Finance Group, je souhaite faire une demande de financement."
  };

  const whatsappButton = document.getElementById("whatsappButton");

  if (whatsappButton) {
    const message = messages[lang] || messages.en;

    whatsappButton.href =
      "https://wa.me/48729210027?text=" +
      encodeURIComponent(message);

    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener";
  }

  const form = document.getElementById("demoForm");

  if (!form || form.dataset.fixReady === "1") return;

  form.dataset.fixReady = "1";

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const result = document.getElementById("result");
    const button = form.querySelector('button[type="submit"]');

    const originalText = button ? button.textContent : "";

    const reference =
      "TF-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(100000 + Math.random() * 900000);

    const referenceField =
      document.getElementById("emailReference");

    if (referenceField) {
      referenceField.value = reference;
    }

    localStorage.setItem("toroReference", reference);

    if (button) {
      button.disabled = true;
      button.textContent =
        lang === "de"
          ? "Wird gesendet…"
          : lang === "fr"
          ? "Envoi…"
          : "Sending…";
    }

    if (result) {
      result.textContent =
        lang === "de"
          ? "Übermittlung läuft…"
          : lang === "fr"
          ? "Transmission en cours…"
          : "Submitting…";
    }

    try {

      const data = new FormData(form);

      data.set(
        "_subject",
        "New financing pre-application — Toro Finance Group"
      );

      data.set("_template", "table");

      data.set("_captcha", "false");

      data.set("_url", window.location.href);

      const response = await fetch(
        "https://formsubmit.co/ajax/torofinancegroup0@gmail.com",
        {
          method: "POST",
          headers: {
            "Accept": "application/json"
          },
          body: data
        }
      );

      const json = await response.json().catch(() => ({}));

      if (!response.ok || json.success === false) {
        throw new Error("Submission failed");
      }

      const success = {

        en:
          "Pre-application submitted successfully.",

        de:
          "Voranfrage erfolgreich gesendet.",

        es:
          "Solicitud enviada correctamente.",

        it:
          "Richiesta inviata correttamente.",

        pt:
          "Pedido enviado com sucesso.",

        lt:
          "Paraiška sėkmingai išsiųsta.",

        fr:
          "Pré-demande envoyée avec succès."

      };

      if (result) {
        result.textContent =
          success[lang] || success.en;
      }

      const dashRef =
        document.getElementById("dashRef");

      const dashProduct =
        document.getElementById("dashProduct");

      const dashAmount =
        document.getElementById("dashAmount");

      const dashStatus =
        document.getElementById("dashStatus");

      if (dashRef) {
        dashRef.textContent = reference;
      }

      if (dashProduct) {
        dashProduct.textContent =
          form.elements.product.value;
      }

      if (dashAmount) {
        dashAmount.textContent =
          form.elements.amount.value + " EUR";
      }

      if (dashStatus) {
        dashStatus.textContent =
          success[lang] || success.en;
      }

      form.reset();

    } catch (error) {

      if (result) {

        result.textContent =
          lang === "de"
            ? "Übermittlung fehlgeschlagen. Bitte erneut versuchen."
            : lang === "fr"
            ? "L'envoi a échoué. Veuillez réessayer."
            : "Submission failed. Please try again.";

      }

    } finally {

      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }

    }

  });

})();
