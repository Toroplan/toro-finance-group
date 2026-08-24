/* TORO FINANCE GROUP — SUPABASE + APPLICATION + TRACKING */

(function () {

"use strict";


/* ==============================
   SUPABASE
============================== */

const SUPABASE_URL =
    "https://lgmyjrctjjuvmjquvtqo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_bOUEY1LO_xnBgmw3V60_aA_bjeWQmGn";


/* ==============================
   LANGUAGE
============================== */

const language =
    (
        document.documentElement.lang ||
        navigator.language ||
        "en"
    )
    .toLowerCase()
    .slice(0, 2);


const messages = {

    en: {
        sending: "Submitting application…",
        success: "Application submitted successfully.",
        error: "The application could not be submitted. Please try again.",
        checking: "Checking application…",
        found: "Application found.",
        notFound: "No application was found with this reference.",
        whatsappNumber: "WhatsApp number",
        pending: "Pending",
        underReview: "Under review",
        approved: "Approved",
        declined: "Declined"
    },

    de: {
        sending: "Antrag wird gesendet…",
        success: "Antrag erfolgreich gesendet.",
        error: "Der Antrag konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        checking: "Antrag wird gesucht…",
        found: "Antrag gefunden.",
        notFound: "Für diese Referenz wurde kein Antrag gefunden.",
        whatsappNumber: "WhatsApp-Nummer",
        pending: "Ausstehend",
        underReview: "In Prüfung",
        approved: "Genehmigt",
        declined: "Abgelehnt"
    },

    es: {
        sending: "Enviando solicitud…",
        success: "Solicitud enviada correctamente.",
        error: "No se ha podido enviar la solicitud. Inténtelo de nuevo.",
        checking: "Buscando solicitud…",
        found: "Solicitud encontrada.",
        notFound: "No se encontró ninguna solicitud con esta referencia.",
        whatsappNumber: "Número de WhatsApp",
        pending: "Pendiente",
        underReview: "En revisión",
        approved: "Aprobada",
        declined: "Rechazada"
    },

    it: {
        sending: "Invio della richiesta…",
        success: "Richiesta inviata correttamente.",
        error: "Impossibile inviare la richiesta. Riprova.",
        checking: "Ricerca della richiesta…",
        found: "Richiesta trovata.",
        notFound: "Nessuna richiesta trovata con questo riferimento.",
        whatsappNumber: "Numero WhatsApp",
        pending: "In attesa",
        underReview: "In valutazione",
        approved: "Approvata",
        declined: "Rifiutata"
    },

    pt: {
        sending: "A enviar o pedido…",
        success: "Pedido enviado com sucesso.",
        error: "Não foi possível enviar o pedido. Tente novamente.",
        checking: "A procurar o pedido…",
        found: "Pedido encontrado.",
        notFound: "Não foi encontrado nenhum pedido com esta referência.",
        whatsappNumber: "Número WhatsApp",
        pending: "Pendente",
        underReview: "Em análise",
        approved: "Aprovado",
        declined: "Recusado"
    },

    lt: {
        sending: "Paraiška siunčiama…",
        success: "Paraiška sėkmingai išsiųsta.",
        error: "Paraiškos nepavyko išsiųsti. Bandykite dar kartą.",
        checking: "Ieškoma paraiškos…",
        found: "Paraiška rasta.",
        notFound: "Pagal šį numerį paraiška nerasta.",
        whatsappNumber: "WhatsApp numeris",
        pending: "Laukiama",
        underReview: "Vertinama",
        approved: "Patvirtinta",
        declined: "Atmesta"
    },

    fr: {
        sending: "Envoi de la demande…",
        success: "Demande envoyée avec succès.",
        error: "La demande n'a pas pu être envoyée. Veuillez réessayer.",
        checking: "Recherche du dossier…",
        found: "Dossier trouvé.",
        notFound: "Aucun dossier ne correspond à cette référence.",
        whatsappNumber: "Numéro WhatsApp",
        pending: "En attente",
        underReview: "En cours d'étude",
        approved: "Approuvé",
        declined: "Refusé"
    }

};


const text =
    messages[language] ||
    messages.en;


/* ==============================
   WHATSAPP BUTTON
============================== */

const whatsappButton =
    document.getElementById(
        "whatsappButton"
    );


if (whatsappButton) {

    const whatsappMessages = {

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


    const whatsappMessage =
        whatsappMessages[language] ||
        whatsappMessages.en;


    whatsappButton.href =
        "https://wa.me/48729210027?text=" +
        encodeURIComponent(
            whatsappMessage
        );


    whatsappButton.target =
        "_blank";


    whatsappButton.rel =
        "noopener";

}


/* ==============================
   APPLICATION FORM
============================== */

const form =
    document.getElementById(
        "demoForm"
    );


if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            const result =
                document.getElementById(
                    "result"
                );


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonText =
                button
                    ? button.textContent
                    : "";


            /* ==============================
               GENERATE REFERENCE
            ============================== */

            const reference =
                "TF-" +
                new Date()
                    .getFullYear() +
                "-" +
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                );


            const referenceField =
                document.getElementById(
                    "emailReference"
                );


            if (referenceField) {

                referenceField.value =
                    reference;

            }


            /* ==============================
               READ FORM
            ============================== */

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


            const whatsapp =
                form.elements.whatsapp
                    ? form.elements.whatsapp.value.trim()
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


            /* ==============================
               BUTTON STATE
            ============================== */

            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    text.sending;

            }


            if (result) {

                result.textContent =
                    text.sending;

            }


            /* ==============================
               SUPABASE PAYLOAD
            ============================== */

            const application = {

                reference:
                    reference,

                first_name:
                    firstName,

                last_name:
                    lastName,

                email:
                    email,

                whatsapp:
                    whatsapp,

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

                /* ==============================
                   INSERT APPLICATION
                ============================== */

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


                if (!response.ok) {

                    const error =
                        await response.text();

                    console.error(
                        "Supabase error:",
                        error
                    );

                    throw new Error(
                        "Supabase insert failed"
                    );

                }


                /* ==============================
                   LOCAL STORAGE
                ============================== */

                localStorage.setItem(
                    "toroReference",
                    reference
                );

                localStorage.setItem(
                    "toroApplicationStatus",
                    "pending"
                );


                /* ==============================
                   SUCCESS
                ============================== */

                if (result) {

                    result.textContent =
                        text.success +
                        " " +
                        reference;

                }


                /* ==============================
                   DASHBOARD
                ============================== */

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

                    const select =
                        form.elements.product;

                    if (select) {

                        dashProduct.textContent =
                            select.options[
                                select.selectedIndex
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
                        text.pending;

                }


                /* ==============================
                   RESET FORM
                ============================== */

                form.reset();


                if (referenceField) {

                    referenceField.value =
                        reference;

                }


            } catch (error) {

                console.error(
                    "Toro Finance Group:",
                    error
                );


                if (result) {

                    result.textContent =
                        text.error;

                }

            } finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        originalButtonText;

                }

            }

        }
    );

}


/* ==============================
   TRACKING
============================== */

const trackButton =
    document.getElementById(
        "trackButton"
    );


const trackInput =
    document.getElementById(
        "trackReferenceInput"
    );


const trackResult =
    document.getElementById(
        "trackResult"
    );


if (
    trackButton &&
    trackInput
) {

    trackButton.addEventListener(
        "click",
        async function () {

            const reference =
                trackInput.value
                    .trim()
                    .toUpperCase();


            if (!reference) {

                if (trackResult) {

                    trackResult.textContent =
                        text.notFound;

                }

                return;

            }


            if (trackResult) {

                trackResult.textContent =
                    text.checking;

            }


            try {

                const response =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/loan_applications" +
                        "?reference=eq." +
                        encodeURIComponent(
                            reference
                        ) +
                        "&select=reference,product,amount,status",
                        {

                            method:
                                "GET",

                            headers: {

                                "apikey":
                                    SUPABASE_KEY,

                                "Authorization":
                                    "Bearer " +
                                    SUPABASE_KEY

                            }

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Tracking request failed"
                    );

                }


                const applications =
                    await response.json();


                if (
                    !Array.isArray(
                        applications
                    ) ||
                    applications.length === 0
                ) {

                    if (trackResult) {

                        trackResult.textContent =
                            text.notFound;

                    }

                    return;

                }


                const application =
                    applications[0];


                /* ==============================
                   DISPLAY TRACKING
                ============================== */

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
                        application.reference ||
                        "—";

                }


                if (dashProduct) {

                    dashProduct.textContent =
                        application.product ||
                        "—";

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
                            Number(
                                application.amount ||
                                0
                            )
                        );

                }


                if (dashStatus) {

                    dashStatus.removeAttribute(
                        "data-t"
                    );


                    const status =
                        String(
                            application.status ||
                            "pending"
                        ).toLowerCase();


                    if (
                        status ===
                        "under_review"
                    ) {

                        dashStatus.textContent =
                            text.underReview;

                    } else if (
                        status ===
                        "approved"
                    ) {

                        dashStatus.textContent =
                            text.approved;

                    } else if (
                        status ===
                        "declined"
                    ) {

                        dashStatus.textContent =
                            text.declined;

                    } else {

                        dashStatus.textContent =
                            text.pending;

                    }

                }


                if (trackResult) {

                    trackResult.textContent =
                        text.found;

                }


            } catch (error) {

                console.error(
                    "Tracking error:",
                    error
                );


                if (trackResult) {

                    trackResult.textContent =
                        text.error;

                }

            }

        }
    );


    /* ENTER KEY */

    trackInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                trackButton.click();

            }

        }
    );

}
})();
