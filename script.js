const menu=document.getElementById('menu'),nav=document.querySelector('nav');
if(menu&&nav){menu.onclick=()=>nav.classList.toggle('open');document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));}

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach((e,i)=>{e.style.setProperty('--delay',`${Math.min(i%6,5)*70}ms`);io.observe(e)});

document.querySelectorAll('video').forEach(v=>{v.addEventListener('mouseenter',()=>v.play().catch(()=>{}));});

const q=document.getElementById('quickQuote');
document.querySelectorAll('.quick-options button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.quick-options button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const p=b.dataset.product;
  q.href='https://wa.me/573027499180?text='+encodeURIComponent('Hola Sublifox, quiero cotizar '+p);
  q.innerHTML='<span>Cotizar '+b.textContent.trim()+'</span><b>→</b>';
}));

const bar=document.querySelector('.buy-bar'),progress=document.querySelector('.scroll-progress');
addEventListener('scroll',()=>{
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  if(bar)bar.classList.toggle('show',y>500&&y<h-700);
  if(progress)progress.style.width=(h?Math.min(100,y/h*100):0)+'%';
},{passive:true});

if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.product-grid article,.category-card,.video-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--rx',(-y*5)+'deg');
      card.style.setProperty('--ry',(x*7)+'deg');
    });
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry');});
  });
}

const quickBuy=document.querySelector('.quick-buy');
if(quickBuy&&!reduceMotion){[...quickBuy.querySelectorAll('button')].forEach((b,i)=>b.style.animationDelay=`${i*110}ms`);}

const galleryData={
  camisetas:{title:'Camisetas',items:[['assets/camiseta.jpg','Camiseta personalizada'],['assets/camiseta-kit.jpg','Camiseta y llavero personalizados'],['assets/produccion.jpg','Producción de camisetas por volumen']]},
  mugs:{title:'Mugs',items:[['assets/mugs.jpg','Mugs personalizados'],['assets/corporativo.jpg','Mugs corporativos']]},
  llaveros:{title:'Llaveros',items:[['assets/llaveros.jpg','Llaveros personalizados'],['assets/camiseta-kit.jpg','Kit con camiseta y llavero']]},
  vinilo:{title:'Forrado y vinilo',items:[['assets/forrado-nevera-spongebob.png','Nevera forrada con vinilo personalizado de Bob Esponja']]}
};

const modal=document.getElementById('galleryModal'),body=document.getElementById('galleryBody'),title=document.getElementById('galleryTitle');
let currentGallery=null,currentIndex=0;
function renderGallery(){
  const data=galleryData[currentGallery];
  if(!data||!body)return;
  title.textContent=data.title;
  if(!data.items.length){
    body.innerHTML='<div class="gallery-empty"><strong>Forrado de neveras y espacios</strong><p>Esta categoría ya está creada. Falta cargar las fotos de neveras, paredes, interiores y exteriores para mostrarlas aquí.</p><a href="https://wa.me/573027499180?text='+encodeURIComponent('Hola Sublifox, quiero cotizar un trabajo de forrado o vinilo')+'" target="_blank">Cotizar este servicio</a></div>';
    return;
  }
  const [src,alt]=data.items[currentIndex];
  const thumbs=data.items.map((it,i)=>`<button type="button" class="${i===currentIndex?'active':''}" data-thumb="${i}" aria-label="Ver foto ${i+1}"><img src="${it[0]}" alt="${it[1]}"></button>`).join('');
  body.innerHTML=`<div class="gallery-stage"><img src="${src}" alt="${alt}"></div><div class="gallery-nav"><button type="button" data-prev>← Anterior</button><span>${currentIndex+1} / ${data.items.length}</span><button type="button" data-next>Siguiente →</button></div><div class="gallery-thumbs">${thumbs}</div>`;
  body.querySelector('[data-prev]').onclick=()=>{currentIndex=(currentIndex-1+data.items.length)%data.items.length;renderGallery()};
  body.querySelector('[data-next]').onclick=()=>{currentIndex=(currentIndex+1)%data.items.length;renderGallery()};
  body.querySelectorAll('[data-thumb]').forEach(btn=>btn.onclick=()=>{currentIndex=Number(btn.dataset.thumb);renderGallery()});
}
function openGallery(key){currentGallery=key;currentIndex=0;renderGallery();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';modal.querySelector('.gallery-close').focus();}
function closeGallery(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-gallery]').forEach(btn=>btn.addEventListener('click',()=>openGallery(btn.dataset.gallery)));
if(modal){modal.querySelector('.gallery-close').onclick=closeGallery;modal.addEventListener('click',e=>{if(e.target===modal)closeGallery()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeGallery()});}

if(!reduceMotion&&window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add('(min-width: 701px)',()=>{
    gsap.fromTo('.hero-media img',{scale:.94,yPercent:-3,rotation:2},{scale:1.08,yPercent:7,rotation:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.utils.toArray('.product-grid article').forEach(card=>{const img=card.querySelector('img');gsap.fromTo(img,{scale:.92,yPercent:-4},{scale:1.1,yPercent:6,ease:'none',scrollTrigger:{trigger:card,start:'top 92%',end:'bottom 18%',scrub:.9}})});
    gsap.utils.toArray('.category-card').forEach(card=>{const img=card.querySelector('img');if(img)gsap.fromTo(img,{scale:.94,yPercent:-5},{scale:1.1,yPercent:6,ease:'none',scrollTrigger:{trigger:card,start:'top 92%',end:'bottom 18%',scrub:.85}})});
    gsap.utils.toArray('.video-card video').forEach(video=>gsap.fromTo(video,{scale:.96,yPercent:-3},{scale:1.07,yPercent:4,ease:'none',scrollTrigger:{trigger:video.parentElement,start:'top 95%',end:'bottom 10%',scrub:1}}));
    gsap.fromTo('.wholesale',{scale:.96,y:35},{scale:1,y:0,ease:'none',scrollTrigger:{trigger:'.wholesale',start:'top 92%',end:'top 48%',scrub:.8}});
  });
  mm.add('(max-width: 700px)',()=>{
    gsap.fromTo('.hero-media img',{scale:.96,yPercent:-2},{scale:1.04,yPercent:4,ease:'none',scrollTrigger:{trigger:'.hero-media',start:'top 92%',end:'bottom 18%',scrub:.8}});
    gsap.utils.toArray('.product-grid article img,.category-card img').forEach(img=>{const trigger=img.closest('article,button');gsap.fromTo(img,{scale:.95,yPercent:-3},{scale:1.06,yPercent:4,ease:'none',scrollTrigger:{trigger,start:'top 94%',end:'bottom 16%',scrub:.75}})});
  });
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
