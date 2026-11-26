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
        <h3>Offres de financement</h3>
        <p class="muted">Les frais sont indiqués séparément du capital et du coût des intérêts.</p>
        <div class="offer-form-grid">
          <label>Capital proposé (€)<input id="offerPrincipal" type="number" min="0.01" step="0.01" value="${escapeHtml(item.amount || "")}" required></label>
          <label>Taux annuel (%)<input id="offerRate" type="number" min="0" max="100" step="0.01" value="4" required></label>
          <label>Durée (mois)<input id="offerDuration" type="number" min="1" max="360" step="1" value="24" required></label>
          <label>Frais totaux (€)<input id="offerFees" type="number" min="0" step="0.01" value="0" required></label>
          <label>Valable jusqu’au<input id="offerValidUntil" type="date"></label>
          <label>Méthode<select id="offerMethod"><option value="constant_monthly_installment">Mensualités constantes</option><option value="equal_principal">Capital constant</option></select></label>
        </div>
        <label>Conditions et informations<textarea id="offerDisclosures" maxlength="3000" placeholder="Décrire les conditions, frais et modalités applicables."></textarea></label>
        <button type="button" class="gold" id="calculateOffer">Calculer l’échéancier</button>
        <div id="offerPreview"></div>
        <button type="button" class="dark" id="saveOffer" disabled>Enregistrer en brouillon</button>
        <span id="offerMessage" class="status-msg"></span><div id="offersList"></div>
      </div>
      <div class="detail-section">
        <h3>Documents justificatifs</h3>
        <p class="muted">Fichiers privés, accessibles uniquement aux administrateurs autorisés. PDF, JPG, PNG ou WEBP — 10 Mo maximum par fichier.</p>
        <input type="file" id="applicationDocument" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp">
        <button type="button" class="dark" id="uploadApplicationDocument">Téléverser le document</button>
        <span id="documentMessage" class="status-msg"></span>
        <div id="documentsList"><p class="muted">Chargement des documents…</p></div>
      </div>
      <div class="detail-section">
        <h3>Historique des statuts</h3>
        <div>${history.length ? history.map(x => `<div class="history-item">${escapeHtml(statusLabels[x.old_status] || x.old_status || "Création")} → <strong>${escapeHtml(statusLabels[x.new_status] || x.new_status)}</strong><br><small>${dateValue(x.changed_at)}</small></div>`).join("") : '<p class="muted">Aucun changement de statut enregistré.</p>'}</div>
      </div>`;


    let calculatedOffer = null;
    const offerPreview = document.getElementById("offerPreview");
    const offerMessage = document.getElementById("offerMessage");
    const saveOfferButton = document.getElementById("saveOffer");

    function buildOfferSchedule(principal, rate, months, fees, method) {
      const monthlyRate = rate / 1200;
      let balance = principal;
      let totalInterest = 0;
      let totalPrincipal = 0;
      const rows = [];
      const fixedPayment = monthlyRate === 0 ? principal / months :
        principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
      const equalPrincipal = Math.round(principal / months * 100) / 100;
      for (let month = 1; month <= months; month++) {
        const interest = Math.round(balance * monthlyRate * 100) / 100;
        const capital = method === "equal_principal" ?
          (month === months ? balance : Math.min(balance, equalPrincipal)) :
          (month === months ? balance : Math.min(balance, Math.round((fixedPayment - interest) * 100) / 100));
        const payment = Math.round((capital + interest) * 100) / 100;
        balance = Math.max(0, Math.round((balance - capital) * 100) / 100);
        totalInterest += interest;
        totalPrincipal += capital;
        rows.push({month, payment, principal:capital, interest, remaining_balance:balance});
      }
      return {
        rows,
        monthlyPayment: method === "equal_principal" ?
          Math.round(rows.reduce((sum,row) => sum + row.payment, 0) / months * 100) / 100 :
          rows[0].payment,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalFees: fees,
        totalRepayable: Math.round((totalPrincipal + totalInterest + fees) * 100) / 100
      };
    }

    async function loadOffers() {
      const list = document.getElementById("offersList");
      const result = await db.from("loan_offers")
        .select("id,offer_reference,principal,currency,annual_interest_rate,duration_months,repayment_method,monthly_payment,total_interest,total_fees,total_repayable,schedule,disclosures,status,valid_until,created_at,sent_at,sent_by")
        .eq("application_id", id).order("created_at",{ascending:false});
      if (result.error) {
        list.textContent = "Impossible de charger les offres.";
        console.error(result.error);
        return;
      }
      const offers = result.data || [];
      list.innerHTML = offers.map(offer =>
        "<article class='note-item'><strong>" + escapeHtml(offer.offer_reference) + "</strong> — " +
        escapeHtml(offer.status) + "<br>Capital : " + money(offer.principal) +
        " · Taux : " + escapeHtml(offer.annual_interest_rate) + " % · Durée : " +
        escapeHtml(offer.duration_months) + " mois<br>Mensualité indicative : " +
        money(offer.monthly_payment) + " · Intérêts : " + money(offer.total_interest) +
        " · Frais : " + money(offer.total_fees) + " · Total : " + money(offer.total_repayable) +
        "<small>Créée le " + dateValue(offer.created_at) +
        (offer.sent_at ? " · Envoi confirmé le " + dateValue(offer.sent_at) : "") +
        "</small><div class='offer-actions'><button type='button' class='dark copy-offer-message' data-offer-id='" +
        escapeHtml(offer.id) + "'>Copier le message client</button>" +
        (offer.status === "draft" ? " <button type='button' class='gold confirm-offer-sent' data-offer-id='" +
        escapeHtml(offer.id) + "'>Envoyer par e-mail</button>" : "") +
        (offer.status === "sent" ? " <button type='button' class='dark create-offer-link' data-offer-id='" +
        escapeHtml(offer.id) + "'>Créer un lien sécurisé client</button>" : "") +
        "</div></article>"
      ).join("") || "<p class='muted'>Aucune offre pour ce dossier.</p>";

      list.querySelectorAll(".copy-offer-message").forEach(button => {
        button.addEventListener("click", async () => {
          const offer = offers.find(item => item.id === button.dataset.offerId);
          if (!offer) return;
          const scheduleText = (offer.schedule || []).map(row =>
            "Mois " + row.month + " : " + money(row.payment) +
            " (capital " + money(row.principal) + ", intérêts " + money(row.interest) +
            ", solde " + money(row.remaining_balance) + ")"
          ).join("\\n");
          const message = [
            "Bonjour " + item.first_name + " " + item.last_name + ",",
            "",
            "Veuillez trouver les principales conditions de votre proposition de financement.",
            "Référence de l’offre : " + offer.offer_reference,
            "Capital proposé : " + money(offer.principal),
            "Taux annuel : " + offer.annual_interest_rate + " %",
            "Durée : " + offer.duration_months + " mois",
            "Mensualité indicative : " + money(offer.monthly_payment),
            "Intérêts : " + money(offer.total_interest),
            "Frais : " + money(offer.total_fees),
            "Total à rembourser : " + money(offer.total_repayable),
            "Valable jusqu’au : " + (offer.valid_until || "Non précisé"),
            offer.disclosures || "",
            "",
            "Échéancier :",
            scheduleText,
            "",
            "Cette proposition reste soumise à votre examen et à votre acceptation expresse. Aucun financement n’est accepté ou débloqué par le seul envoi de cette proposition."
          ].filter(Boolean).join("\\n");
          try {
            await navigator.clipboard.writeText(message);
            offerMessage.textContent = "Message et échéancier copiés. Envoyez-les au client par votre canal habituel.";
            offerMessage.className = "status-msg ok";
          } catch (error) {
            offerMessage.textContent = "Copie impossible sur cet appareil. Vérifiez les autorisations du navigateur.";
            offerMessage.className = "status-msg bad";
          }
        });
      });

      list.querySelectorAll(".create-offer-link").forEach(button => {
        button.addEventListener("click", async () => {
          const offer = offers.find(item => item.id === button.dataset.offerId);
          if (!offer || offer.status !== "sent") return;
          const user = userResult.data?.user;
          if (!user) {
            offerMessage.textContent = "Session administrateur introuvable.";
            offerMessage.className = "status-msg bad";
            return;
          }
          if (offer.valid_until && offer.valid_until < new Date().toISOString().slice(0,10)) {
            offerMessage.textContent = "Cette offre est expirée. Modifiez sa validité avant de créer un lien.";
            offerMessage.className = "status-msg bad";
            return;
          }
          const bytes = crypto.getRandomValues(new Uint8Array(32));
          const accessKey = Array.from(bytes, b => b.toString(16).padStart(2,"0")).join("");
          const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(accessKey));
          const tokenHash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,"0")).join("");
          button.disabled = true;
          const {error} = await db.from("loan_offers")
            .update({access_token_hash:tokenHash})
            .eq("id",offer.id).eq("status","sent");
          if (error) {
            console.error("offer access key error:",error);
            offerMessage.textContent = "Impossible de créer le lien sécurisé.";
            offerMessage.className = "status-msg bad";
            button.disabled = false;
            return;
          }
          const link = "https://www.torofinancegroup.com/status.html?offer=" +
            encodeURIComponent(offer.offer_reference) + "#key=" + accessKey;
          try {
            await navigator.clipboard.writeText(link);
            offerMessage.textContent = "Lien sécurisé copié. Transmettez-le uniquement au client concerné. La création d’un nouveau lien invalide le précédent.";
            offerMessage.className = "status-msg ok";
          } catch (error) {
            offerMessage.textContent = "Lien créé, mais copie impossible. Réessayez depuis un navigateur autorisant le presse-papiers.";
            offerMessage.className = "status-msg bad";
          }
          button.disabled = false;
        });
      });

      list.querySelectorAll(".confirm-offer-sent").forEach(button => {
        button.addEventListener("click", async () => {
          const offer = offers.find(item => item.id === button.dataset.offerId);
          if (!offer || offer.status !== "draft") return;
          if (!confirm("Envoyer cette proposition et son échéancier à l’adresse e-mail enregistrée pour le client ?")) return;
          button.disabled = true;
          offerMessage.textContent = "Envoi de l’offre par e-mail…";
          offerMessage.className = "status-msg";
          const {data,error} = await db.functions.invoke("send-loan-offer", {
            body:{offer_id:offer.id}
          });
          if (error || !data?.ok) {
            console.error("offer email dispatch error:",error || data);
            const detail = data?.error || error?.message || "Erreur inconnue";
            offerMessage.textContent = "Envoi non confirmé : " + detail;
            offerMessage.className = "status-msg bad";
            button.disabled = false;
            return;
          }
          offerMessage.textContent = "E-mail accepté par le prestataire pour " + data.recipient + ". Référence : " + data.offer_reference + ". Le lien sécurisé est inclus dans le message.";
          offerMessage.className = "status-msg ok";
          await loadOffers();
        });
      });
;
    }

    document.getElementById("calculateOffer").addEventListener("click", () => {
      const principal = Number(document.getElementById("offerPrincipal").value);
      const rate = Number(document.getElementById("offerRate").value);
      const months = Number(document.getElementById("offerDuration").value);
      const fees = Number(document.getElementById("offerFees").value);
      const method = document.getElementById("offerMethod").value;
      if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(rate) ||
          rate < 0 || rate > 100 || !Number.isInteger(months) || months < 1 ||
          months > 360 || !Number.isFinite(fees) || fees < 0) {
        offerMessage.textContent = "Vérifiez le capital, le taux, la durée et les frais.";
        offerMessage.className = "status-msg bad";
        return;
      }
      calculatedOffer = {
        principal, rate, months, fees, method,
        validUntil: document.getElementById("offerValidUntil").value || null,
        disclosures: document.getElementById("offerDisclosures").value.trim(),
        ...buildOfferSchedule(principal,rate,months,fees,method)
      };
      let table = "<div class='table-wrap'><table><thead><tr><th>Mois</th><th>Mensualité</th><th>Capital</th><th>Intérêts</th><th>Solde</th></tr></thead><tbody>";
      calculatedOffer.rows.forEach(row => {
        table += "<tr><td>"+row.month+"</td><td>"+money(row.payment)+"</td><td>"+money(row.principal)+"</td><td>"+money(row.interest)+"</td><td>"+money(row.remaining_balance)+"</td></tr>";
      });
      table += "</tbody></table></div>";
      offerPreview.innerHTML = "<p><strong>Mensualité de départ : "+money(calculatedOffer.monthlyPayment)+
        "</strong><br>Intérêts : "+money(calculatedOffer.totalInterest)+
        " · Frais séparés : "+money(fees)+"<br>Total à rembourser : "+
        money(calculatedOffer.totalRepayable)+"</p>"+table+
        "<p class='muted'>La dernière échéance peut différer légèrement en raison des arrondis.</p>";
      offerMessage.textContent = "Échéancier calculé. Vérifiez les conditions avant de sauvegarder.";
      offerMessage.className = "status-msg ok";
      saveOfferButton.disabled = false;
    });

    saveOfferButton.addEventListener("click", async () => {
      if (!calculatedOffer) return;
      saveOfferButton.disabled = true;
      offerMessage.textContent = "Enregistrement…";
      const offerRef = "OFF-" + new Date().getFullYear() + "-" + crypto.randomUUID().slice(0,8).toUpperCase();
      const payload = {
        application_id:id, offer_reference:offerRef, principal:calculatedOffer.principal,
        currency:"EUR", annual_interest_rate:calculatedOffer.rate,
        duration_months:calculatedOffer.months, repayment_method:calculatedOffer.method,
        monthly_payment:calculatedOffer.monthlyPayment, total_interest:calculatedOffer.totalInterest,
        total_fees:calculatedOffer.totalFees, total_repayable:calculatedOffer.totalRepayable,
        schedule:calculatedOffer.rows, disclosures:calculatedOffer.disclosures,
        valid_until:calculatedOffer.validUntil, status:"draft"
      };
      const result = await db.from("loan_offers").insert(payload);
      if (result.error) {
        console.error("offer save error:",result.error);
        offerMessage.textContent = "L’offre n’a pas pu être enregistrée.";
        offerMessage.className = "status-msg bad";
        saveOfferButton.disabled = false;
        return;
      }
      offerMessage.textContent = "Offre enregistrée en brouillon. Elle n’a pas été envoyée au client.";
      offerMessage.className = "status-msg ok";
      calculatedOffer = null;
      await loadOffers();
    });
    loadOffers();

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

    async function refreshApplicationDocuments() {
      const list = document.getElementById("documentsList");
      list.innerHTML = '<p class="muted">Chargement des documents…</p>';
      const {data, error} = await db.storage.from("loan-documents").list(id, {limit:100, sortBy:{column:"name",order:"asc"}});
      if (error) {
        list.textContent = "Impossible de charger les documents.";
        console.error(error);
        return;
      }
      const files = (data || []).filter(file => file.name && file.id);
      if (!files.length) {
        list.innerHTML = '<p class="muted">Aucun document transmis.</p>';
        return;
      }
      list.innerHTML = files.map(file =>
        `<div class="note-item"><strong>${escapeHtml(file.name)}</strong> <button type="button" class="light document-open" data-name="${escapeHtml(file.name)}">Consulter</button><small>${dateValue(file.created_at)}</small></div>`
      ).join("");
      list.querySelectorAll(".document-open").forEach(button => button.addEventListener("click", async () => {
        const {data: signed, error: signError} = await db.storage.from("loan-documents").createSignedUrl(id + "/" + button.dataset.name, 60);
        if (signError) { console.error(signError); return; }
        window.open(signed.signedUrl, "_blank", "noopener");
      }));
    }

    document.getElementById("uploadApplicationDocument").addEventListener("click", async () => {
      const input = document.getElementById("applicationDocument");
      const msg = document.getElementById("documentMessage");
      const file = input.files?.[0];
      if (!file) { msg.textContent = "Choisissez un fichier."; msg.className = "status-msg bad"; return; }
      const allowed = ["application/pdf","image/jpeg","image/png","image/webp"];
      if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) {
        msg.textContent = "Format non autorisé ou fichier supérieur à 10 Mo.";
        msg.className = "status-msg bad";
        return;
      }
      const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"_").slice(-100);
      const objectPath = id + "/" + crypto.randomUUID() + "-" + safeName;
      msg.textContent = "Téléversement en cours…";
      msg.className = "status-msg";
      const {error} = await db.storage.from("loan-documents").upload(objectPath, file, {upsert:false,contentType:file.type});
      if (error) {
        console.error("document upload error:", error);
        msg.textContent = "Le téléversement a échoué. Vérifiez les droits et réessayez.";
        msg.className = "status-msg bad";
        return;
      }
      input.value = "";
      msg.textContent = "Document téléversé.";
      msg.className = "status-msg ok";
      await refreshApplicationDocuments();
    });

    await refreshApplicationDocuments();

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
