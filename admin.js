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

const detailPanel = document.getElementById("detailPanel");
const detailTitle = document.getElementById("detailTitle");
const detailContent = document.getElementById("detailContent");
const closeDetailButton = document.getElementById("closeDetailButton");
let activeApplicationId = null;


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
                    <th>Durée de remboursement</th>
                    <th>Reçue le</th>
                    <th>Statut</th><th>Fiche</th>

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
                            )}            </td> 
                            <td>${escapeHtml(item.repayment_duration || "—")}</td>

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
                        <td><button type="button" class="detail-btn" data-detail-id="${escapeHtml(item.id)}">Ouvrir</button></td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;


    document.querySelectorAll(".detail-btn").forEach(button => {
        button.addEventListener("click", () => openApplicationDetails(button.dataset.detailId));
    });

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
            "id,reference,first_name,last_name,email,country,product,amount,status,whatsapp,created_at,updated_at,repayment_duration,decision_reason"
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



/* APPLICATION DETAIL FILE */
async function openApplicationDetails(id) {
    const item = applications.find(row => row.id === id);
    if (!item) return;
    activeApplicationId = id;
    detailPanel.classList.remove("hidden");
    detailTitle.textContent = `Dossier ${item.reference || ""}`;
    detailContent.innerHTML = '<div class="loading">Chargement de la fiche…</div>';

    const [userResult, notesResult, historyResult] = await Promise.all([
        db.auth.getUser(),
        db.from("admin_application_notes").select("id,note,created_at,author_id").eq("application_id", id).order("created_at", {ascending:false}),
        db.from("loan_application_status_history").select("old_status,new_status,changed_at,changed_by").eq("application_id", id).order("changed_at", {ascending:false})
    ]);

    if (notesResult.error || historyResult.error) {
        detailContent.textContent = "Impossible de charger les notes ou l’historique. Vérifiez les droits administrateur.";
        console.error(notesResult.error || historyResult.error);
        return;
    }

    const notes = notesResult.data || [];
    const history = historyResult.data || [];
    const fields = [
      ["Nom", `${item.first_name || ""} ${item.last_name || ""}`],
      ["E-mail", item.email], ["WhatsApp", item.whatsapp], ["Pays", item.country],
      ["Produit", item.product], ["Montant", money(item.amount)],
      ["Durée", item.repayment_duration], ["Référence", item.reference],
      ["Reçue le", dateValue(item.created_at)], ["Dernière mise à jour", dateValue(item.updated_at)],
      ["Statut", statusLabels[item.status] || item.status], ["Décision / motif", item.decision_reason || "Non renseigné"]
    ];
    detailContent.innerHTML = `
      <div class="detail-grid">${fields.map(([label,value]) => `<div class="detail-card"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value || "—")}</strong></div>`).join("")}</div>
      <div class="detail-section">
        <h3>Motif de décision</h3>
        <textarea id="decisionReasonInput" maxlength="3000" placeholder="Indiquer le motif de la décision ou les éléments à communiquer…">${escapeHtml(item.decision_reason || "")}</textarea>
        <button type="button" class="dark" id="saveDecisionReason">Enregistrer le motif</button>
        <span id="decisionSaveMessage" class="status-msg"></span>
      </div>
      <div class="detail-section">
        <h3>Notes internes</h3>
        <textarea id="newAdminNote" maxlength="5000" placeholder="Ajouter une note interne (visible uniquement par les administrateurs)…"></textarea>
        <button type="button" class="gold" id="addAdminNote">Ajouter la note</button>
        <div id="notesList">${notes.length ? notes.map(n => `<div class="note-item"><small>${dateValue(n.created_at)}</small><div>${escapeHtml(n.note)}</div></div>`).join("") : '<p class="muted">Aucune note interne.</p>'}</div>
      </div>
      <div class="detail-section">
        <h3>Historique des statuts</h3>
        <div>${history.length ? history.map(x => `<div class="history-item">${escapeHtml(statusLabels[x.old_status] || x.old_status || "Création")} → <strong>${escapeHtml(statusLabels[x.new_status] || x.new_status)}</strong><br><small>${dateValue(x.changed_at)}</small></div>`).join("") : '<p class="muted">Aucun changement de statut enregistré.</p>'}</div>
      </div>`;

    document.getElementById("saveDecisionReason").addEventListener("click", async () => {
        const reason = document.getElementById("decisionReasonInput").value.trim();
        const msg = document.getElementById("decisionSaveMessage");
        const {error} = await db.from("loan_applications").update({decision_reason:reason || null}).eq("id", id);
        if (error) { msg.textContent = "Échec de l’enregistrement."; msg.className = "status-msg bad"; return; }
        item.decision_reason = reason;
        msg.textContent = "Motif enregistré."; msg.className = "status-msg ok";
    });

    document.getElementById("addAdminNote").addEventListener("click", async () => {
        const input = document.getElementById("newAdminNote");
        const note = input.value.trim();
        if (!note) return;
        const user = userResult.data?.user;
        if (!user) return;
        const {error} = await db.from("admin_application_notes").insert({application_id:id,author_id:user.id,note});
        if (error) { alert("La note n’a pas pu être enregistrée."); console.error(error); return; }
        await openApplicationDetails(id);
    });
    detailPanel.scrollIntoView({behavior:"smooth",block:"start"});
}

closeDetailButton.addEventListener("click", () => {
    detailPanel.classList.add("hidden");
    activeApplicationId = null;
});

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
