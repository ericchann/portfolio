const D=window.RECIPES,EV=(window.PHOTOS&&window.PHOTOS.events)||[];
const EXT=['jpg','jpeg','png','webp'];
const $=s=>document.querySelector(s);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
function body(txt){let out='',list=null;const close=()=>{if(list){out+='</'+list+'>';list=null}};
 for(const raw of txt.split('\n')){const l=raw.trim();let m;
  if(!l){close();continue}
  if(l.startsWith('## ')){close();out+='<h3>'+esc(l.slice(3))+'</h3>';continue}
  if(l.startsWith('• ')){if(list!=='ul'){close();out+='<ul>';list='ul'}out+='<li>'+esc(l.slice(2))+'</li>';continue}
  if((m=l.match(/^\d+\.\s+(.*)/))){if(list!=='ol'){close();out+='<ol>';list='ol'}out+='<li>'+esc(m[1])+'</li>';continue}
  close();out+='<p>'+esc(l)+'</p>'}
 close();return out}

/* A recipe photo is photos/recipes/<slug>.jpg (or .jpeg, .png, .webp). Missing photos fall back to the colored tile. */
const rimg=(slug,alt)=>`<img src="photos/recipes/${slug}.jpg" data-slug="${slug}" data-e="0" alt="${esc(alt)}" loading="lazy">`;
document.addEventListener('error',e=>{const i=e.target;if(!i||i.tagName!=='IMG'||!i.dataset.slug)return;
 const n=+i.dataset.e+1;
 if(n<EXT.length){i.dataset.e=n;i.src=`photos/recipes/${i.dataset.slug}.${EXT[n]}`}
 else{const w=i.closest('.himg');if(w)w.remove();else i.remove()}},true);
document.addEventListener('load',e=>{const i=e.target;if(i&&i.tagName==='IMG'&&i.dataset.slug){const t=i.closest('.tile');if(t)t.classList.add('has')}},true);

const tile=r=>`<div class="tile" style="--h:${hue(r.slug)}"><a class="cov" href="#r-${r.slug}">${rimg(r.slug,r.title)}<span class="t">${esc(r.title)}</span><span class="y">${r.year}</span></a></div>`;
function view(){
 const h=location.hash.slice(1)||'events';const v=$('#v');
 document.querySelectorAll('[data-n]').forEach(a=>a.classList.toggle('on',h.startsWith('r')?a.dataset.n==='recipes':a.dataset.n===h));
 let html='';
 if(h==='events'){
  const tiles=EV.length?EV.map((f,i)=>`<div class="tile has"><button class="cov" data-open="${i}" aria-label="Open photo ${i+1}"><img src="photos/events/${encodeURIComponent(f)}" alt="Event photo ${i+1}" loading="lazy"></button></div>`).join('')
   :Array.from({length:9},(_,i)=>`<div class="tile ph" style="--h:${(i*47+200)%360}"><span class="t">Event photo</span></div>`).join('');
  html=`<h1 class="pt">Events</h1><div class="grid ev">${tiles}</div>`;
 }else if(h==='recipes'){
  html=`<h1 class="pt">Recipes</h1><div class="grid rc">${D.map(tile).join('')}</div>`;
 }else if(h.startsWith('r-')){
  const i=D.findIndex(r=>'r-'+r.slug===h);const r=D[i];
  if(!r){location.hash='recipes';return}
  const p=D[(i+D.length-1)%D.length],n=D[(i+1)%D.length];
  html=`<article class="rec"><a class="back" href="#recipes">All recipes</a><header class="rh"><h1 class="pt">${esc(r.title)}</h1><p class="meta">${r.cat} · ${r.year}</p></header><div class="himg">${rimg(r.slug,r.title)}</div><div class="txt">${body(r.txt)}</div><nav class="pn"><a href="#r-${p.slug}">&larr; ${esc(p.title)}</a><a href="#r-${n.slug}">${esc(n.title)} &rarr;</a></nav></article>`;
 }
 v.innerHTML=html;
 document.title=h.startsWith('r-')&&D.find(r=>'r-'+r.slug===h)?D.find(r=>'r-'+r.slug===h).title+' · Eric Chan':'Eric Chan Photography';
}
/* lightbox */
let lbI=-1;const L=$('#lb');
function lb(i){if(i<0&&lbI<0||!EV.length){L.hidden=true;lbI=-1;return}lbI=(i+EV.length)%EV.length;L.hidden=false;L.querySelector('img').src='photos/events/'+encodeURIComponent(EV[lbI])}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)lb(+o.dataset.open)});
L.addEventListener('click',e=>{const a=e.target.closest('[data-lb]');if(!a){if(e.target.tagName!=='IMG'){L.hidden=true;lbI=-1}return}
 if(a.dataset.lb==='x'){L.hidden=true;lbI=-1}else lb(lbI+(a.dataset.lb==='n'?1:-1))});
document.addEventListener('keydown',e=>{if(lbI<0)return;if(e.key==='Escape'){L.hidden=true;lbI=-1}else if(e.key==='ArrowRight')lb(lbI+1);else if(e.key==='ArrowLeft')lb(lbI-1)});
addEventListener('hashchange',()=>{view();scrollTo(0,0)});
view();
