/* Vendedor Automático — núcleo compartido de la DEMO (datos en este dispositivo) */
const VA_KEY='va_demo_v2';
const BASE=(()=>{const s=document.currentScript.src;return s.slice(0,s.lastIndexOf('/')+1)})();
const SEED={
 negocios:{
  dulces:{nombre:'Dulces Mary',lema:'Postres caseros que enamoran',emoji:'🍰',hero:'img/hero-dulces.jpg',pagos:['Pago móvil','Efectivo contra entrega','Zelle'],comision:10,pin:'0000',
   productos:[{id:'p1',n:'Torta de chocolate',d:'Bizcocho húmedo con ganache',p:15,img:'img/torta.jpg'},{id:'p2',n:'Quesillo',d:'Receta tradicional con caramelo',p:6,img:'img/quesillo.jpg'},{id:'p3',n:'Galletas x12',d:'Con chispas de chocolate',p:4,img:'img/galletas.jpg'},{id:'p4',n:'Cupcakes x6',d:'Crema de chocolate batida',p:7,img:'img/cupcakes.jpg'}],
   vendedores:[{cod:'ANA01',n:'Ana',pin:'1234'},{cod:'LUIS02',n:'Luis',pin:'1234'}]},
  belleza:{nombre:'Belleza Luz',lema:'Tu brillo, a domicilio',emoji:'💄',hero:'img/hero-belleza.jpg',pagos:['Pago móvil','Efectivo contra entrega'],comision:15,pin:'0000',
   productos:[{id:'b1',n:'Labial mate',d:'Larga duración',p:5,img:'img/labial.jpg'},{id:'b2',n:'Crema facial',d:'Hidratación 24 h',p:9,img:'img/crema.jpg'},{id:'b3',n:'Perfume 50 ml',d:'Notas florales y ámbar',p:18,img:'img/perfume.jpg'},{id:'b4',n:'Esmaltes x3',d:'Rojo, dorado y vino',p:6,img:'img/esmaltes.jpg'}],
   vendedores:[{cod:'CARLA1',n:'Carla',pin:'1234'}]}
 },pedidos:[],mensajes:[]};
let DB=JSON.parse(localStorage.getItem(VA_KEY)||'null')||JSON.parse(JSON.stringify(SEED));
const bc='BroadcastChannel' in window?new BroadcastChannel('va_demo2'):null;
function save(){localStorage.setItem(VA_KEY,JSON.stringify(DB));bc&&bc.postMessage(1)}
const QS=new URLSearchParams(location.search);
let BIZ=QS.get('n')&&DB.negocios[QS.get('n')]?QS.get('n'):(localStorage.getItem('va_biz')||'dulces');
const CUENTAS_DEMO=()=>[
 {id:'zelle',nombre:'Zelle',activo:true,campos:{Correo:'pagos@ejemplo.com',Titular:'Nombre del titular'}},
 {id:'pago_movil',nombre:'Pago Móvil',activo:true,campos:{Banco:'0102 Banco de Venezuela',Teléfono:'0414-0000000',Cédula:'V-00.000.000',Titular:'Nombre del titular'}},
 {id:'binance',nombre:'Binance',activo:true,campos:{'Pay ID':'000000000',Correo:'binance@ejemplo.com'}},
 {id:'efectivo',nombre:'Efectivo',activo:true,campos:{}}];
Object.values(DB.negocios).forEach(n=>{if(!n.cuentas)n.cuentas=CUENTAS_DEMO()});
if(!DB.negocios[BIZ])BIZ='dulces';localStorage.setItem('va_biz',BIZ);
const N=()=>DB.negocios[BIZ];
const $=s=>document.querySelector(s);
const money=v=>'$'+Number(v).toFixed(2);
const hora=t=>new Date(t).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=p=>/^(https?:|data:)/.test(p)?p:BASE+p;

/* Sonido de notificación generado (sin archivos) */
let actx;document.addEventListener('pointerdown',()=>{try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume()}catch(e){}});
function ding(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();
 [880,1320].forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(actx.destination);
 const t=actx.currentTime+i*.15;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.start(t);o.stop(t+.4)});
 navigator.vibrate&&navigator.vibrate([80,40,80])}catch(e){}}
function toast(t){let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';e.className='toast';document.body.appendChild(e)}
 e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2800)}
function notify(title,body){ding();toast(title+': '+body);
 if('Notification' in window&&Notification.permission==='granted'&&document.hidden){
  (navigator.serviceWorker?navigator.serviceWorker.ready:Promise.reject()).then(r=>r.showNotification(title,{body,icon:BASE+'icon.png'})).catch(()=>{try{new Notification(title,{body})}catch(e){}})}}

/* Mensajería interna */
function enviar(de,para,texto,pedido,nom){DB.mensajes.push({id:Date.now()+Math.random(),biz:BIZ,de,para,texto,pedido:pedido||null,nom:nom||null,t:Date.now(),leido:false});save()}

/* Sincronización entre pestañas (tienda ↔ panel) */
let _lm=DB.mensajes.length,_lp=DB.pedidos.length,onNuevo=()=>{},onRender=()=>{};
function _check(){const nm=DB.mensajes.slice(_lm),np=DB.pedidos.slice(_lp);_lm=DB.mensajes.length;_lp=DB.pedidos.length;if(nm.length||np.length){onNuevo(nm.filter(m=>m.biz===BIZ),np.filter(p=>p.biz===BIZ));onRender()}}
function _reload(){DB=JSON.parse(localStorage.getItem(VA_KEY)||'null')||DB;_check()}
bc&&(bc.onmessage=_reload);
window.addEventListener('storage',e=>{if(e.key===VA_KEY)_reload()});
setInterval(_check,700);
function markSeen(){_lm=DB.mensajes.length;_lp=DB.pedidos.length}
if('serviceWorker' in navigator)navigator.serviceWorker.register(BASE+'sw.js',{scope:BASE}).catch(()=>{});
