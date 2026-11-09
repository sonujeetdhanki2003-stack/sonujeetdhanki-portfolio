(()=>{const h=document.querySelector('.avatar');if(!h)return;
const st=h.querySelector('.avatar__stage');
const still=()=>{h.classList.remove('is-live');h.classList.add('is-still')};
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const c=navigator.connection;const slow=(navigator.hardwareConcurrency||4)<=2||(navigator.deviceMemory||4)<2||(c&&c.saveData);
let gl=false;try{const x=document.createElement('canvas');gl=!!(x.getContext('webgl2')||x.getContext('webgl'))}catch(e){}
if(rm||slow||!gl){still();return}
let api=null;
const go=()=>import('../js/avatar2.js').then(m=>{api=m.mount(st,{onReady(){h.classList.add('is-live')},onSlow(){try{api&&api.destroy()}catch(e){}still()},onTap(){h.classList.add('tapped');setTimeout(()=>h.classList.remove('tapped'),900);dispatchEvent(new CustomEvent('avatar:wink'))}});window.__avatar=api}).catch(still);
if(!('IntersectionObserver'in window)){go();return}
let started=false;const go1=()=>{if(started)return;started=true;go()};
const io=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting)){io.disconnect();go1()}},{rootMargin:'900px 0px'});io.observe(h);
/* v2.2: build the bust while the page is idle (behind the Tap-to-enter gate), not mid-scroll */
const narrow=matchMedia('(max-width:820px)').matches||matchMedia('(pointer:coarse)').matches;
const idle=()=>(window.requestIdleCallback?requestIdleCallback(go1,{timeout:5000}):setTimeout(go1,1500));
if(narrow){/* v2.8: phones build the bust only when the page scrolls it into view */}else if(document.readyState==='complete')setTimeout(idle,1800);else addEventListener('load',()=>setTimeout(idle,1800),{once:true});})();
