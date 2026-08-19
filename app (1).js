const $ = (s) => document.querySelector(s);
const lang = $('#language');
const amount = $('#amount');

const translations = {
  fr: {
    navSolutions:'Solutions', navProcess:'Processus', navApply:'Demande', navTrack:'Suivi',
    heroTitle:'Des solutions de financement pensées pour vos projets.',
    heroLead:'Une expérience digitale simple pour présenter votre projet, effectuer une pré-demande et suivre son statut.',
    applyButton:'Faire une demande', solutionsButton:'Nos solutions',
    notice:"Site de présentation et de pré-demande. Toute décision de financement est soumise à l'étude du dossier et aux critères applicables.",
    heroCardTitle:'Force. Vision. Performance.', heroCardText:'Une approche structurée, transparente et orientée projet.',
    solutionsEyebrow:'NOS SOLUTIONS', solutionsTitle:'Un financement adapté à chaque objectif',
    personalTitle:'Prêt personnel', personalText:'Pour des besoins personnels et des projets du quotidien.',
    businessTitle:'Professionnel', businessText:"Pour accompagner une activité, un investissement ou un besoin de trésorerie.",
    realEstateTitle:'Immobilier', realEstateText:"Pour les projets d'acquisition ou d'investissement immobilier.",
    autoTitle:'Automobile', autoText:"Pour l'acquisition d'un véhicule selon les conditions applicables.",
    projectTitle:'Projet & investissement', projectText:'Pour structurer une demande liée à un projet spécifique.',
    processEyebrow:'PROCESSUS', processTitle:'Une démarche en 3 étapes',
    step1Title:'Votre demande', step1Text:'Présentez votre profil et votre besoin.',
    step2Title:'Étude du dossier', step2Text:'Les informations sont examinées selon les critères applicables.',
    step3Title:'Réponse', step3Text:"Vous recevez une réponse ou une demande d'informations complémentaires.",
    applyEyebrow:'PRÉ-DEMANDE', applyTitle:'Présentez votre projet',
    firstName:'Prénom', lastName:'Nom', country:'Pays', product:'Financement',
    optPersonal:'Prêt personnel', optBusiness:'Professionnel', optRealEstate:'Immobilier', optAuto:'Automobile', optProject:'Projet / investissement',
    amountLabel:'Montant souhaité', consent:"J'accepte que ces informations soient utilisées pour traiter cette pré-demande.",
    submit:'Envoyer la pré-demande', simulation:'SIMULATION', requestedAmount:'Montant demandé',
    simulationNote:"Cette estimation est indicative et ne constitue pas une offre de crédit.",
    trackEyebrow:'SUIVI', trackTitle:'Votre dossier', reference:'Référence', productDash:'Produit',
    amountDash:'Montant', statusDash:'Statut', localNote:'Le suivi affiché ici est conservé uniquement dans ce navigateur. Il ne constitue pas un système de suivi serveur.',
    footerNote:"Aucune offre de crédit n'est conclue automatiquement via ce site. Les services financiers sont fournis uniquement lorsqu'ils sont légalement autorisés et selon les réglementations applicables.",
    received:'Pré-demande enregistrée. Référence : ', noApplication:'Aucune demande'
  },
  en: {
    navSolutions:'Solutions', navProcess:'Process', navApply:'Application', navTrack:'Tracking',
    heroTitle:'Financing solutions designed around your projects.',
    heroLead:'A simple digital experience to present your project, submit a pre-application and track its status.',
    applyButton:'Apply now', solutionsButton:'Our solutions',
    notice:'Presentation and pre-application site. Any financing decision is subject to application review and applicable criteria.',
    heroCardTitle:'Strength. Vision. Performance.', heroCardText:'A structured, transparent and project-focused approach.',
    solutionsEyebrow:'OUR SOLUTIONS', solutionsTitle:'Financing adapted to every objective',
    personalTitle:'Personal loan', personalText:'For personal needs and everyday projects.',
    businessTitle:'Business', businessText:'To support an activity, investment or working-capital need.',
    realEstateTitle:'Real estate', realEstateText:'For property acquisition or investment projects.',
    autoTitle:'Automotive', autoText:'For vehicle acquisition subject to applicable conditions.',
    projectTitle:'Project & investment', projectText:'To structure a request related to a specific project.',
    processEyebrow:'PROCESS', processTitle:'A 3-step approach',
    step1Title:'Your application', step1Text:'Present your profile and financing need.',
    step2Title:'Application review', step2Text:'Information is reviewed according to applicable criteria.',
    step3Title:'Response', step3Text:'You receive a response or a request for additional information.',
    applyEyebrow:'PRE-APPLICATION', applyTitle:'Present your project',
    firstName:'First name', lastName:'Last name', country:'Country', product:'Financing',
    optPersonal:'Personal loan', optBusiness:'Business', optRealEstate:'Real estate', optAuto:'Automotive', optProject:'Project / investment',
    amountLabel:'Requested amount', consent:'I agree that this information may be used to process this pre-application.',
    submit:'Submit pre-application', simulation:'SIMULATION', requestedAmount:'Requested amount',
    simulationNote:'This estimate is indicative and does not constitute a credit offer.',
    trackEyebrow:'TRACKING', trackTitle:'Your application', reference:'Reference', productDash:'Product',
    amountDash:'Amount', statusDash:'Status', localNote:'The tracking information shown here is stored only in this browser. It is not a server-side tracking system.',
    footerNote:'No credit offer is automatically concluded through this website. Financial services are provided only where legally authorized and under applicable regulations.',
    received:'Pre-application saved. Reference: ', noApplication:'No application'
  }
};

const fmt = (v) => new Intl.NumberFormat(lang.value === 'en' ? 'en-US' : 'fr-FR', {
  style:'currency', currency:'EUR', maximumFractionDigits:0
}).format(Number(v) || 0);

function applyLanguage(value) {
  const t = translations[value];
  document.documentElement.lang = value;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  if (amount) $('#estimateAmount').textContent = fmt(amount.value);
  const stored = JSON.parse(localStorage.getItem('toroApplication') || 'null');
  if (!stored) $('#dashStatus').textContent = t.noApplication;
}

amount.addEventListener('input', () => $('#estimateAmount').textContent = fmt(amount.value));
lang.addEventListener('change', () => {
  localStorage.setItem('toroLanguage', lang.value);
  applyLanguage(lang.value);
});

$('#demoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const id = 'TF-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  const application = {
    id,
    firstName: f.get('firstName'),
    lastName: f.get('lastName'),
    country: f.get('country'),
    product: f.get('product'),
    amount: f.get('amount'),
    status: 'Dossier reçu',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('toroApplication', JSON.stringify(application));
  $('#result').textContent = translations[lang.value].received + id;
  $('#dashRef').textContent = id;
  $('#dashProduct').textContent = application.product;
  $('#dashAmount').textContent = fmt(application.amount);
  $('#dashStatus').textContent = application.status;
  $('#dashboard').scrollIntoView({ behavior:'smooth' });
});

try {
  const savedLanguage = localStorage.getItem('toroLanguage');
  if (savedLanguage === 'en' || savedLanguage === 'fr') lang.value = savedLanguage;
  applyLanguage(lang.value);
  const a = JSON.parse(localStorage.getItem('toroApplication') || 'null');
  if (a) {
    $('#dashRef').textContent = a.id;
    $('#dashProduct').textContent = a.product;
    $('#dashAmount').textContent = fmt(a.amount);
    $('#dashStatus').textContent = a.status;
  }
} catch (_) {}