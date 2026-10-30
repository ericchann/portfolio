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
 document.querySelectorAll('[data-n]').forEach(a=>a.classList.toggle('on',h.startsWith('r')?a.dataset.n==='recipes':a.dataset.n===(h==='edit'?'events':h)));
 let html='';
 if(h==='edit'){
  ord=loadOrd();
  html=`<h1 class="pt">Events</h1><div class="eb"><p>Edit mode: drag photos, or use the arrows, to reorder. The order is saved in this browser only. To publish it, copy or download <code>manifest.js</code> and replace <code>photos/manifest.js</code> in the repo.</p><div class="ebb"><button data-act="copy">Copy manifest.js</button><button data-act="dl">Download</button><button data-act="reset">Reset</button><button data-act="done">Done</button></div><p class="est" aria-live="polite"></p></div><div class="grid ev" id="eg"></div>`;
 }else if(h==='events'){
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
 if(h==='edit')editGrid();
 document.title=h.startsWith('r-')&&D.find(r=>'r-'+r.slug===h)?D.find(r=>'r-'+r.slug===h).title+' · Eric Chan':'Eric Chan Photography';
}
/* edit mode (#edit): reorder event photos, then publish the order via photos/manifest.js */
const LS='evOrder';let ord=[],dragI=-1;
const loadOrd=()=>{let s=[];try{s=JSON.parse(localStorage.getItem(LS)||'[]')}catch(e){}
 return s.filter(f=>EV.includes(f)).concat(EV.filter(f=>!s.includes(f)))};
const saveOrd=()=>{try{localStorage.setItem(LS,JSON.stringify(ord))}catch(e){}};
const manifest=()=>'window.PHOTOS='+JSON.stringify({events:ord},null,1)+';\n';
function editGrid(){const g=$('#eg');if(!g)return;
 g.innerHTML=ord.length?ord.map((f,i)=>`<div class="tile has ed" draggable="true" data-i="${i}"><img src="photos/events/${encodeURIComponent(f)}" alt="" draggable="false"><span class="num">${i+1}</span><span class="mv"><button data-mv="-1" aria-label="Move earlier"${i?'':' disabled'}>&larr;</button><button data-mv="1" aria-label="Move later"${i<ord.length-1?'':' disabled'}>&rarr;</button></span></div>`).join(''):'<p class="est">No event photos yet. Add images to photos/events/ and list them in photos/manifest.js.</p>'}
function mvTo(a,b){if(a===b||a<0||b<0||b>=ord.length)return;ord.splice(b,0,ord.splice(a,1)[0]);saveOrd();editGrid()}
document.addEventListener('dragstart',e=>{const t=e.target.closest&&e.target.closest('.ed');if(t){dragI=+t.dataset.i;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragI));t.classList.add('drag')}});
document.addEventListener('dragover',e=>{const t=e.target.closest&&e.target.closest('.ed');if(t&&dragI>=0){e.preventDefault();document.querySelectorAll('.ed.over').forEach(x=>x!==t&&x.classList.remove('over'));t.classList.add('over')}});
document.addEventListener('drop',e=>{const t=e.target.closest&&e.target.closest('.ed');if(t&&dragI>=0){e.preventDefault();const a=dragI;dragI=-1;mvTo(a,+t.dataset.i)}});
document.addEventListener('dragend',()=>{dragI=-1;document.querySelectorAll('.ed.drag,.ed.over').forEach(x=>x.classList.remove('drag','over'))});
document.addEventListener('click',e=>{
 const m=e.target.closest('[data-mv]');if(m){const t=m.closest('.ed'),i=+t.dataset.i;mvTo(i,i+ +m.dataset.mv);return}
 const b=e.target.closest('[data-act]');if(!b)return;const st=$('.est'),a=b.dataset.act;
 if(a==='done')location.hash='events';
 else if(a==='reset'){ord=EV.slice();saveOrd();editGrid();if(st)st.textContent='Reset to the published order.'}
 else if(a==='dl'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([manifest()],{type:'text/javascript'}));l.download='manifest.js';l.click();URL.revokeObjectURL(l.href);if(st)st.textContent='Downloaded manifest.js.'}
 else if(a==='copy'){(navigator.clipboard?navigator.clipboard.writeText(manifest()):Promise.reject()).then(()=>{if(st)st.textContent='Copied. Paste it over photos/manifest.js in the repo.'},()=>{if(st)st.textContent='Copy failed. Use Download instead.'})}});
/* lightbox */
let lbI=-1;const L=$('#lb');
function lb(i){if(i<0&&lbI<0||!EV.length){L.hidden=true;lbI=-1;return}lbI=(i+EV.length)%EV.length;L.hidden=false;L.querySelector('img').src='photos/events/'+encodeURIComponent(EV[lbI])}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)lb(+o.dataset.open)});
L.addEventListener('click',e=>{const a=e.target.closest('[data-lb]');if(!a){if(e.target.tagName!=='IMG'){L.hidden=true;lbI=-1}return}
 if(a.dataset.lb==='x'){L.hidden=true;lbI=-1}else lb(lbI+(a.dataset.lb==='n'?1:-1))});
document.addEventListener('keydown',e=>{if(lbI<0)return;if(e.key==='Escape'){L.hidden=true;lbI=-1}else if(e.key==='ArrowRight')lb(lbI+1);else if(e.key==='ArrowLeft')lb(lbI-1)});
addEventListener('hashchange',()=>{view();scrollTo(0,0)});
view();
