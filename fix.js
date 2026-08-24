/* TORO FINANCE GROUP — SUPABASE FORM CONNECTION */

(function () {

    const SUPABASE_URL =
        "https://lgmyjrctjjuvmjquvtqo.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_bOUEY1LO_xnBgmw3V60_aA_bjeWQmGn";


    /* LANGUAGE */

    const lang =
        (
            document.documentElement.lang ||
            navigator.language ||
            "en"
        )
        .toLowerCase()
        .slice(0, 2);


    /* WHATSAPP */

    const messages = {

        en:
        "Hello Toro Finance Group, I would like to make a financing request.",

        de:
        "Guten Tag Toro Finance Group, ich möchte eine Finanzierungsanfrage stellen.",

        es:
        "Hola Toro Finance Group, quiero realizar una solicitud de financiación.",

        it:
        "Buongiorno Toro Finance Group, desidero presentare una richiesta di finanziamento.",

        pt:
        "Olá Toro Finance Group, gostaria de fazer um pedido de financiamento.",

        lt:
        "Sveiki Toro Finance Group, noriu pateikti finansavimo paraišką.",

        fr:
        "Bonjour Toro Finance Group, je souhaite faire une demande de financement."

    };


    const whatsappButton =
        document.getElementById("whatsappButton");


    if (whatsappButton) {

        const message =
            messages[lang] || messages.en;

        whatsappButton.href =
            "https://wa.me/48729210027?text=" +
            encodeURIComponent(message);

        whatsappButton.target =
            "_blank";

        whatsappButton.rel =
            "noopener";

    }


    /* FORM */

    const form =
        document.getElementById("demoForm");


    if (!form) {
        return;
    }


    /* PREVENT DOUBLE CONNECTION */

    if (form.dataset.supabaseReady === "1") {
        return;
    }

    form.dataset.supabaseReady = "1";


    /* SUBMIT */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            const result =
                document.getElementById("result");


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            const originalText =
                button
                    ? button.textContent
                    : "";


            /* REFERENCE */

            const reference =
                "TF-" +
                new Date().getFullYear() +
                "-" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            const referenceField =
                document.getElementById(
                    "emailReference"
                );


            if (referenceField) {

                referenceField.value =
                    reference;

            }


            /* SAVE REFERENCE */

            localStorage.setItem(
                "toroReference",
                reference
            );


            /* BUTTON */

            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    lang === "de"
                        ? "Wird gesendet…"
                        : lang === "es"
                        ? "Enviando…"
                        : lang === "it"
                        ? "Invio…"
                        : lang === "pt"
                        ? "A enviar…"
                        : lang === "lt"
                        ? "Siunčiama…"
                        : "Sending…";

            }


            /* RESULT */

            if (result) {

                result.textContent =
                    lang === "de"
                        ? "Übermittlung läuft…"
                        : lang === "es"
                        ? "Enviando solicitud…"
                        : lang === "it"
                        ? "Invio della richiesta…"
                        : lang === "pt"
                        ? "A enviar o pedido…"
                        : lang === "lt"
                        ? "Paraiška siunčiama…"
                        : "Submitting application…";

            }
                      /* FORM DATA */

            const firstName =
                form.elements.firstName
                    ? form.elements.firstName.value.trim()
                    : "";


            const lastName =
                form.elements.lastName
                    ? form.elements.lastName.value.trim()
                    : "";


            const email =
                form.elements.email
                    ? form.elements.email.value.trim()
                    : "";


            const country =
                form.elements.country
                    ? form.elements.country.value
                    : "";


            const product =
                form.elements.product
                    ? form.elements.product.value
                    : "";


            const amount =
                form.elements.amount
                    ? Number(
                        form.elements.amount.value
                    )
                    : null;


            const consent =
                form.elements.consent
                    ? form.elements.consent.checked
                    : false;


            /* SUPABASE DATA */

            const application = {

                reference:
                    reference,

                first_name:
                    firstName,

                last_name:
                    lastName,

                email:
                    email,

                country:
                    country,

                product:
                    product,

                amount:
                    amount,

                consent:
                    consent,

                status:
                    "pending"

            };


            try {

                /* SEND TO SUPABASE */

                const response =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/loan_applications",
                        {

                            method:
                                "POST",

                            headers: {

                                "apikey":
                                    SUPABASE_KEY,

                                "Authorization":
                                    "Bearer " +
                                    SUPABASE_KEY,

                                "Content-Type":
                                    "application/json",

                                "Prefer":
                                    "return=minimal"

                            },

                            body:
                                JSON.stringify(
                                    application
                                )

                        }
                    );


                /* CHECK RESPONSE */

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Supabase error:",
                        errorText
                    );

                    throw new Error(
                        "Supabase submission failed"
                    );

                }


                /* LOCAL STORAGE */

                localStorage.setItem(
                    "toroApplicationStatus",
                    "pending"
                );


                /* SUCCESS TEXT */

                const successMessages = {

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
                        (
                            successMessages[lang] ||
                            successMessages.en
                        ) +
                        " " +
                        reference;

                }


                /* DASHBOARD */

                const dashRef =
                    document.getElementById(
                        "dashRef"
                    );


                const dashProduct =
                    document.getElementById(
                        "dashProduct"
                    );


                const dashAmount =
                    document.getElementById(
                        "dashAmount"
                    );


                const dashStatus =
                    document.getElementById(
                        "dashStatus"
                    );


                if (dashRef) {

                    dashRef.textContent =
                        reference;

                }


                if (dashProduct) {

                    const productSelect =
                        form.elements.product;

                    if (productSelect) {

                        dashProduct.textContent =
                            productSelect.options[
                                productSelect.selectedIndex
                            ].text;

                    }

                }


                if (dashAmount) {

                    dashAmount.textContent =
                        new Intl.NumberFormat(
                            navigator.language ||
                            "en",
                            {

                                style:
                                    "currency",

                                currency:
                                    "EUR",

                                maximumFractionDigits:
                                    0

                            }
                        ).format(
                            amount || 0
                        );

                }


                if (dashStatus) {

                    dashStatus.removeAttribute(
                        "data-t"
                    );

                    dashStatus.textContent =
                        "Pending";

                      }
                            /* RESET FORM */

                form.reset();


                /* RESTORE REFERENCE */

                if (referenceField) {

                    referenceField.value =
                        reference;

                }


            } catch (error) {

                console.error(
                    "Toro Finance Group / Supabase:",
                    error
                );


                /* ERROR MESSAGES */

                const errorMessages = {

                    en:
                    "The application could not be submitted. Please try again.",

                    de:
                    "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",

                    es:
                    "No se ha podido enviar la solicitud. Inténtelo de nuevo.",

                    it:
                    "La richiesta non può essere inviata. Riprova.",

                    pt:
                    "Não foi possível enviar o pedido. Tente novamente.",

                    lt:
                    "Paraiškos nepavyko išsiųsti. Bandykite dar kartą.",

                    fr:
                    "La pré-demande n'a pas pu être envoyée. Veuillez réessayer."

                };


                if (result) {

                    result.textContent =
                        errorMessages[lang] ||
                        errorMessages.en;

                }


            } finally {

                /* RESTORE BUTTON */

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        originalText;

                }

            }

        }

    );

})(); 
