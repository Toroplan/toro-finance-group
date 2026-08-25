const SUPABASE_URL = "https://lgmyjrctjjuvmjquvtqo.supabase.co";
const SUPABASE_KEY = "sb_publishable_bOUEY1LO_xnBgmw3V60_aA_bjeWQmGn";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ELEMENTS */

const loginPanel =
    document.getElementById("loginPanel");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");

const logoutButton =
    document.getElementById("logoutButton");

const tableArea =
    document.getElementById("tableArea");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const refreshButton =
    document.getElementById("refreshButton");

const count =
    document.getElementById("count");

const saveMessage =
    document.getElementById("saveMessage");


/* STATUS */

const statusLabels = {

    pending:
        "En attente",

    reviewing:
        "En étude",

    more_info:
        "Informations complémentaires",

    approved:
        "Approuvé",

    rejected:
        "Refusé"

};


let applications = [];


/* SECURITY */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/[&<>"']/g, char => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        }[char]));

}


/* MONEY */

function money(value) {

    return new Intl.NumberFormat(
        "fr-FR",
        {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0
        }
    ).format(Number(value || 0));

}


/* DATE */

function dateValue(value) {

    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(new Date(value));

}


/* STATUS OPTIONS */

function statusOptions(current) {

    return Object.entries(statusLabels)

        .map(([value, label]) =>

            `<option value="${value}"
                ${value === current ? "selected" : ""}>
                ${label}
            </option>`

        )

        .join("");

}


/* FILTER */

function filteredApplications() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    const filter =
        statusFilter.value;


    return applications.filter(item => {

        if (
            filter &&
            item.status !== filter
        ) {
            return false;
        }


        if (!query) {
            return true;
        }


        return [

            item.reference,
            item.first_name,
            item.last_name,
            item.email,
            item.country,
            item.product,
            item.whatsapp

        ]

        .some(value =>

            String(value ?? "")
                .toLowerCase()
                .includes(query)

        );

    });

}


/* RENDER */

function render() {

    const rows =
        filteredApplications();


    count.textContent =
        `${rows.length} dossier${rows.length > 1 ? "s" : ""}`;


    if (!rows.length) {

        tableArea.innerHTML =
            `<div class="loading">
                Aucune demande trouvée.
            </div>`;

        return;

    }


    tableArea.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>Référence</th>
                    <th>Demandeur</th>
                    <th>Contact</th>
                    <th>Pays</th>
                    <th>Produit</th>
                    <th>Montant</th>
                    <th>Reçue le</th>
                    <th>Statut</th>

                </tr>

            </thead>


            <tbody>

                ${rows.map(item => `

                    <tr>

                        <td>

                            <div class="ref">

                                ${escapeHtml(
                                    item.reference
                                )}

                            </div>

                        </td>


                        <td>

                            ${escapeHtml(
                                item.first_name
                            )}

                            ${escapeHtml(
                                item.last_name
                            )}

                        </td>


                        <td class="contact">

                            <div>

                                <a href="mailto:${encodeURIComponent(
                                    item.email || ""
                                )}">

                                    ${escapeHtml(
                                        item.email
                                    )}

                                </a>

                            </div>


                            ${
                                item.whatsapp

                                ?

                                `<div>

                                    <a
                                        target="_blank"
                                        rel="noopener"
                                        href="https://wa.me/${String(
                                            item.whatsapp
                                        ).replace(/\D/g, "")}"
                                    >
                                        WhatsApp
                                    </a>

                                </div>`

                                :

                                ""
                            }

                        </td>


                        <td>

                            ${escapeHtml(
                                item.country
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                item.product
                            )}

                        </td>


                        <td class="amount">

                            ${money(
                                item.amount
                            )}

                        </td>


                        <td>

                            ${dateValue(
                                item.created_at
                            )}

                        </td>


                        <td class="status">

                            <select
                                data-id="${escapeHtml(item.id)}"
                                class="statusSelect"
                            >

                                ${statusOptions(
                                    item.status
                                )}

                            </select>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;


    document
        .querySelectorAll(".statusSelect")
        .forEach(select => {

            select.addEventListener(
                "change",
                () => updateStatus(
                    select.dataset.id,
                    select.value
                )
            );

        });

}


/* CHECK ADMIN */

async function ensureAdmin() {

    const {
        data,
        error
    } = await db.rpc("is_admin");


    if (error) {

        console.error(
            "is_admin error:",
            error
        );

        throw error;

    }


    return data === true;

}


/* LOAD APPLICATIONS */

async function loadApplications() {

    tableArea.innerHTML =
        `<div class="loading">
            Chargement des demandes…
        </div>`;


    const {
        data,
        error
    } = await db

        .from("loan_applications")

        .select(
            "id,reference,first_name,last_name,email,country,product,amount,status,whatsapp,created_at,updated_at"
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "loan_applications error:",
            error
        );


        tableArea.innerHTML =
            `<div class="loading">
                Impossible de charger les demandes.
            </div>`;


        saveMessage.textContent =
            error.message;


        saveMessage.className =
            "status-msg bad";


        return;

    }


    applications =
        data || [];


    saveMessage.textContent =
        "";

    saveMessage.className =
        "status-msg";


    render();

}


/* UPDATE STATUS */

async function updateStatus(
    id,
    status
) {

    saveMessage.textContent =
        "Enregistrement…";


    saveMessage.className =
        "status-msg";


    const {
        error
    } = await db

        .from("loan_applications")

        .update({
            status: status
        })

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "status update error:",
            error
        );


        saveMessage.textContent =
            "La modification n'a pas pu être enregistrée.";


        saveMessage.className =
            "status-msg bad";


        await loadApplications();


        return;

    }


    const item =
        applications.find(
            row => row.id === id
        );


    if (item) {

        item.status =
            status;

    }


    saveMessage.textContent =
        `Statut mis à jour : ${
            statusLabels[status] || status
        }.`;

    saveMessage.className =
        "status-msg ok";


    render();

}


/* SHOW DASHBOARD */

async function showDashboard() {

    const admin =
        await ensureAdmin();


    if (!admin) {

        await db.auth.signOut();


        loginError.textContent =
            "Ce compte n'est pas autorisé à accéder à l'administration.";


        return;

    }


    loginError.textContent =
        "";


    loginPanel.classList.add(
        "hidden"
    );


    dashboard.classList.remove(
        "hidden"
    );


    logoutButton.classList.remove(
        "hidden"
    );


    await loadApplications();

}


/* LOGIN */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        loginError.textContent =
            "";


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const {
            data,
            error
        } = await db.auth
            .signInWithPassword({

                email,
                password

            });


        if (error) {

            console.error(
                "login error:",
                error
            );


            loginError.textContent =
                "E-mail ou mot de passe incorrect.";


            return;

        }


        try {

            await showDashboard();

        }

        catch (error) {

            console.error(
                "admin verification error:",
                error
            );


            await db.auth.signOut();


            loginError.textContent =
                "Impossible de vérifier les droits administrateur.";

        }

    }
);


/* LOGOUT */

logoutButton.addEventListener(
    "click",
    async () => {

        await db.auth.signOut();


        dashboard.classList.add(
            "hidden"
        );


        loginPanel.classList.remove(
            "hidden"
        );


        logoutButton.classList.add(
            "hidden"
        );


        tableArea.innerHTML =
            `<div class="loading">
                Chargement…
            </div>`;

    }
);


/* EVENTS */

refreshButton.addEventListener(
    "click",
    loadApplications
);


searchInput.addEventListener(
    "input",
    render
);


statusFilter.addEventListener(
    "change",
    render
);


/* INIT */

(async function init() {

    const {
        data
    } = await db.auth.getSession();


    if (
        data.session &&
        data.session.user
    ) {

        try {

            await showDashboard();

        }

        catch (error) {

            console.error(
                error
            );


            await db.auth.signOut();

        }

    }

})();
