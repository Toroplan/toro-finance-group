<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Toro Finance Group</title>

    <link rel="stylesheet" href="styles.css">
</head>

<body>

<header class="nav">

    <a href="#top" class="brand">
        TORO <span>FINANCE GROUP</span>
    </a>

    <nav>
        <a href="#services" data-t="solutions">Solutions</a>
        <a href="#process" data-t="process">Processus</a>
        <a href="#apply" data-t="applyNav">Demande</a>
        <a href="#dashboard" data-t="track">Suivi</a>
    </nav>

</header>


<main id="top">

    <!-- HERO -->

    <section class="hero">

        <div>

            <p class="eyebrow">
                TORO FINANCE GROUP
            </p>

            <h1 data-t="heroTitle">
                Des solutions de financement pensées pour vos projets.
            </h1>

            <p class="lead" data-t="heroLead">
                Une expérience digitale simple pour présenter votre projet,
                effectuer une pré-demande et suivre son statut.
            </p>

            <div class="actions">

                <a
                    href="#apply"
                    class="button"
                    data-t="applyButton"
                >
                    Faire une demande
                </a>

                <a
                    href="#services"
                    class="button secondary"
                    data-t="solutionsButton"
                >
                    Nos solutions
                </a>

            </div>

            <p class="notice" data-t="notice">
                Site de présentation et de pré-demande.
                Toute décision de financement est soumise à l'étude du dossier
                et aux critères applicables.
            </p>

        </div>


        <aside class="hero-card">

            <b>TORO</b>

            <h2>
                <span data-t="heroCardTitle">
                    Force. Vision. Performance.
                </span>
            </h2>

            <p data-t="heroCardText">
                Une approche structurée, transparente et orientée projet.
            </p>

        </aside>

    </section>



    <!-- SOLUTIONS -->

    <section id="services">

        <p class="eyebrow" data-t="servicesEyebrow">
            NOS SOLUTIONS
        </p>

        <h2 data-t="servicesTitle">
            Un financement adapté à chaque objectif
        </h2>


        <div class="grid">

            <article>

                <b>01</b>

                <h3 data-t="s1">
                    Prêt personnel
                </h3>

                <p data-t="s1d">
                    Pour des besoins personnels et des projets du quotidien.
                </p>

            </article>


            <article>

                <b>02</b>

                <h3 data-t="s2">
                    Professionnel
                </h3>

                <p data-t="s2d">
                    Pour accompagner une activité, un investissement
                    ou un besoin de trésorerie.
                </p>

            </article>


            <article>

                <b>03</b>

                <h3 data-t="s3">
                    Immobilier
                </h3>

                <p data-t="s3d">
                    Pour les projets d'acquisition ou d'investissement immobilier.
                </p>

            </article>


            <article>

                <b>04</b>

                <h3 data-t="s4">
                    Automobile
                </h3>

                <p data-t="s4d">
                    Pour l'acquisition d'un véhicule selon les conditions applicables.
                </p>

            </article>


            <article>

                <b>05</b>

                <h3 data-t="s5">
                    Projet & investissement
                </h3>

                <p data-t="s5d">
                    Pour structurer une demande liée à un projet spécifique.
                </p>

            </article>

        </div>

    </section>



    <!-- PROCESS -->

    <section id="process" class="alt">

        <p class="eyebrow" data-t="processEyebrow">
            PROCESSUS
        </p>

        <h2 data-t="processTitle">
            Une démarche en 3 étapes
        </h2>


        <div class="steps">

            <div>

                <b>01</b>

                <h3 data-t="p1">
                    Votre demande
                </h3>

                <p data-t="p1d">
                    Présentez votre profil et votre besoin.
                </p>

            </div>


            <div>

                <b>02</b>

                <h3 data-t="p2">
                    Étude du dossier
                </h3>

                <p data-t="p2d">
                    Les informations sont examinées selon les critères applicables.
                </p>

            </div>


            <div>

                <b>03</b>

                <h3 data-t="p3">
                    Réponse
                </h3>

                <p data-t="p3d">
                    Vous recevez une réponse ou une demande
                    d'informations complémentaires.
                </p>

            </div>

        </div>

    </section>



    <!-- PRE-DEMANDE -->

    <section id="apply">

        <p class="eyebrow" data-t="applyEyebrow">
            PRÉ-DEMANDE
        </p>

        <h2 data-t="applyTitle">
            Présentez votre projet
        </h2>


        <div class="apply-grid">


            <form
                id="demoForm"
                action="https://formsubmit.co/torofinancegroup0@gmail.com"
                method="POST"
                target="formSubmitFrame"
            >

                <!-- FormSubmit -->

                <input
                    type="hidden"
                    name="_subject"
                    value="Nouvelle pré-demande — Toro Finance Group"
                >

                <input
                    type="hidden"
                    name="_captcha"
                    value="true"
                >

                <input
                    type="hidden"
                    name="_template"
                    value="table"
                >

                <input
                    type="hidden"
                    name="_next"
                    value="https://toroplan.github.io/toro-finance-group/"
                >

                <input
                    type="hidden"
                    name="reference"
                    id="emailReference"
                >


                <!-- NOM -->

                <div class="form-grid">

                    <label>

                        <span data-t="firstName">
                            Prénom
                        </span>

                        <input
                            type="text"
                            name="firstName"
                            required
                            autocomplete="given-name"
                        >

                    </label>


                    <label>

                        <span data-t="lastName">
                            Nom
                        </span>

                        <input
                            type="text"
                            name="lastName"
                            required
                            autocomplete="family-name"
                        >

                    </label>

                </div>


                <!-- EMAIL -->

                <label>

                    <span data-t="email">
                        E-mail
                    </span>

                    <input
                        type="email"
                        name="email"
                        required
                        autocomplete="email"
                        placeholder="votre@email.com"
                    >

                </label>


                <!-- PAYS + FINANCEMENT -->

                <div class="form-grid">

                    <label>

                        <span data-t="country">
                            Pays
                        </span>

                        <select name="country">

                            <option data-t="france">
                                France
                            </option>

                            <option data-t="belgium">
                                Belgique
                            </option>

                            <option data-t="germany">
                                Allemagne
                            </option>

                            <option data-t="italy">
                                Italie
                            </option>

                            <option data-t="lithuania">
                                Lituanie
                            </option>

                            <option data-t="spain">
                                Espagne
                            </option>

                            <option data-t="portugal">
                                Portugal
                            </option>

                            <option data-t="other">
                                Autre
                            </option>

                        </select>

                    </label>


                    <label>

                        <span data-t="product">
                            Financement
                        </span>

                        <select name="product">

                            <option data-t="personal">
                                Prêt personnel
                            </option>

                            <option data-t="business">
                                Professionnel
                            </option>

                            <option data-t="realestate">
                                Immobilier
                            </option>

                            <option data-t="auto">
                                Automobile
                            </option>

                            <option data-t="project">
                                Projet / investissement
                            </option>

                        </select>

                    </label>

                </div>


                <!-- MONTANT -->

                <label>

                    <span data-t="amount">
                        Montant souhaité
                    </span>

                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        min="1"
                        step="1"
                        required
                        inputmode="numeric"
                        placeholder="10000"
                    >

                </label>


                <!-- CONSENTEMENT -->

                <label class="check">

                    <input
                        type="checkbox"
                        name="consent"
                        required
                    >

                    <span data-t="consent">
                        J'accepte que ces informations soient utilisées
                        pour traiter cette pré-demande.
                    </span>

                </label>


                <!-- ENVOI -->

                <button
                    type="submit"
                    class="button"
                    data-t="submit"
                >
                    Envoyer la pré-demande
                </button>


                <!-- RESULTAT -->

                <p
                    id="result"
                    class="result"
                    aria-live="polite"
                ></p>


                <!-- WHATSAPP -->

                <a
                    id="whatsappButton"
                    class="button secondary"
                    href="https://wa.me/48729210027"
                    target="_blank"
                    rel="noopener"
                    data-t="whatsapp"
                >
                    Contacter Toro Finance Group sur WhatsApp
                </a>


                <iframe
                    name="formSubmitFrame"
                    title="Transmission de la demande"
                    hidden
                ></iframe>

            </form>



            <!-- SIMULATION -->

            <aside class="estimate">

                <p
                    class="eyebrow"
                    data-t="simulation"
                >
                    SIMULATION
                </p>

                <div id="estimateAmount">
                    € 0
                </div>

                <p data-t="requested">
                    Montant demandé
                </p>

                <p class="small" data-t="simulationNote">
                    Cette estimation est indicative et ne constitue
                    pas une offre de crédit.
                </p>

            </aside>

        </div>

    </section>



    <!-- SUIVI -->

    <section id="dashboard" class="alt">

        <p class="eyebrow" data-t="trackEyebrow">
            SUIVI
        </p>

        <h2 data-t="trackTitle">
            Votre dossier
        </h2>


        <div class="dashboard">

            <div>

                <span data-t="reference">
                    Référence
                </span>

                <strong id="dashRef">
                    —
                </strong>

            </div>


            <div>

                <span data-t="productLabel">
                    Produit
                </span>

                <strong id="dashProduct">
                    —
                </strong>

            </div>


            <div>

                <span data-t="amountLabel">
                    Montant
                </span>

                <strong id="dashAmount">
                    —
                </strong>

            </div>


            <div>

                <span data-t="statusLabel">
                    Statut
                </span>

                <strong id="dashStatus" data-t="noApplication">
                    Aucune demande
                </strong>

            </div>

        </div>


        <p class="small track-note" data-t="trackNote">
            Le suivi affiché ici est conservé uniquement dans ce navigateur.
        </p>

    </section>

</main>



<!-- FOOTER -->

<footer>

    <strong>
        TORO FINANCE GROUP
    </strong>

    <p>
        © 2026 Toro Finance Group.
    </p>

    <p class="small" data-t="footerNote">
        Aucune offre de crédit n'est conclue automatiquement via ce site.
        Les services financiers sont fournis uniquement lorsqu'ils sont
        légalement autorisés et selon les réglementations applicables.
    </p>

</footer>



<!-- JAVASCRIPT -->

<script src="app.js"></script>

</body>
</html>
