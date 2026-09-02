document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('menu'),nav=document.querySelector('nav');
menu.onclick=()=>nav.classList.toggle('open');
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));

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
  document.querySelectorAll('.product-grid article,.masonry figure,.video-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--rx',(-y*5)+'deg');
      card.style.setProperty('--ry',(x*7)+'deg');
    });
    card.addEventListener('pointerleave',()=>{
      card.style.removeProperty('--rx');card.style.removeProperty('--ry');
    });
  });
}

const quickBuy=document.querySelector('.quick-buy');
if(quickBuy && !reduceMotion){
  const buttons=[...quickBuy.querySelectorAll('button')];
  buttons.forEach((b,i)=>b.style.animationDelay=`${i*110}ms`);
}

if(!reduceMotion && window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);

  const mm=gsap.matchMedia();

  mm.add('(min-width: 701px)',()=>{
    gsap.fromTo('.hero-media img',
      {scale:.94,yPercent:-3,rotation:2},
      {scale:1.08,yPercent:7,rotation:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}}
    );

    gsap.utils.toArray('.product-grid article').forEach((card,i)=>{
      const img=card.querySelector('img');
      gsap.fromTo(img,
        {scale:.92,yPercent:-4},
        {scale:1.1,yPercent:6,ease:'none',scrollTrigger:{trigger:card,start:'top 92%',end:'bottom 18%',scrub:.9}}
      );
      gsap.fromTo(card,
        {y:28,opacity:.72},
        {y:0,opacity:1,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 88%',end:'top 58%',scrub:.55}}
      );
    });

    gsap.utils.toArray('.masonry figure').forEach((figure,i)=>{
      const img=figure.querySelector('img');
      gsap.fromTo(img,
        {scale:.9,yPercent:-7},
        {scale:1.13,yPercent:8,ease:'none',scrollTrigger:{trigger:figure,start:'top 95%',end:'bottom 8%',scrub:1.1}}
      );
    });

    gsap.utils.toArray('.video-card video').forEach(video=>{
      gsap.fromTo(video,
        {scale:.96,yPercent:-3},
        {scale:1.07,yPercent:4,ease:'none',scrollTrigger:{trigger:video.parentElement,start:'top 95%',end:'bottom 10%',scrub:1}}
      );
    });

    gsap.fromTo('.wholesale',
      {scale:.96,y:35},
      {scale:1,y:0,ease:'none',scrollTrigger:{trigger:'.wholesale',start:'top 92%',end:'top 48%',scrub:.8}}
    );
  });

  mm.add('(max-width: 700px)',()=>{
    gsap.fromTo('.hero-media img',
      {scale:.96,yPercent:-2},
      {scale:1.04,yPercent:4,ease:'none',scrollTrigger:{trigger:'.hero-media',start:'top 92%',end:'bottom 18%',scrub:.8}}
    );

    gsap.utils.toArray('.product-grid article img,.masonry figure img').forEach(img=>{
      const trigger=img.closest('article,figure');
      gsap.fromTo(img,
        {scale:.95,yPercent:-3},
        {scale:1.06,yPercent:4,ease:'none',scrollTrigger:{trigger,start:'top 94%',end:'bottom 16%',scrub:.75}}
      );
    });

    gsap.utils.toArray('.video-card video').forEach(video=>{
      gsap.fromTo(video,
        {scale:.98},
        {scale:1.035,ease:'none',scrollTrigger:{trigger:video.parentElement,start:'top 94%',end:'bottom 18%',scrub:.7}}
      );
    });
  });

  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
