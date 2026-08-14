const $=s=>document.querySelector(s);
const lang=$('#language');
const amount=$('#amount');
const fmt=v=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v)||0);
amount.addEventListener('input',()=>$('#estimateAmount').textContent=fmt(amount.value));
lang.addEventListener('change',()=>{document.documentElement.lang=lang.value;});
$('#demoForm').addEventListener('submit',e=>{
 e.preventDefault();
 const f=new FormData(e.currentTarget), id='TF-'+new Date().getFullYear()+'-'+Math.floor(100000+Math.random()*900000);
 $('#result').textContent='Pré-demande enregistrée. Référence : '+id;
 $('#dashRef').textContent=id;
 $('#dashProduct').textContent=f.get('product');
 $('#dashAmount').textContent=fmt(f.get('amount'));
 $('#dashStatus').textContent='Dossier reçu';
 localStorage.setItem('toroApplication',JSON.stringify({id,product:f.get('product'),amount:f.get('amount'),status:'Dossier reçu'}));
 $('#dashboard').scrollIntoView({behavior:'smooth'});
});
try{const a=JSON.parse(localStorage.getItem('toroApplication'));if(a){$('#dashRef').textContent=a.id;$('#dashProduct').textContent=a.product;$('#dashAmount').textContent=fmt(a.amount);$('#dashStatus').textContent=a.status;}}catch(e){}