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
  if(!reduceMotion){
    document.documentElement.style.setProperty('--scrollY',y+'px');
    const hero=document.querySelector('.hero-media');
    if(hero)hero.style.transform=`translate3d(0,${Math.min(y*.07,36)}px,0)`;
    document.querySelectorAll('.product-grid article').forEach((card,i)=>{
      const r=card.getBoundingClientRect();
      const center=innerHeight/2;
      const offset=(r.top+r.height/2-center)/center;
      const tilt=Math.max(-2.5,Math.min(2.5,offset*2.2));
      card.style.setProperty('--tilt',tilt+'deg');
    });
  }
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
