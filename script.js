/* ===== Utilities ===== */
const $ = (sel, ctx=document)=>ctx.querySelector(sel);
const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

/* ===== Tahun footer ===== */
$('#year').textContent = new Date().getFullYear();

/* ===== Mobile menu ===== */
const toggleBtn = $('.menu-toggle');
const menu = $('.menu');
toggleBtn?.addEventListener('click', () => menu.classList.toggle('open'));
$$('.menu a').forEach(a => a.addEventListener('click', ()=> menu.classList.remove('open')));

/* ===== Scroll progress bar ===== */
const bar = $('.scrollbar');
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  bar.style.transform = `scaleX(${scrolled})`;
};
document.addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* ===== Intro / Splash ===== */
const intro = $('#intro');
const enterBtn = $('#enterBtn');
const introBrand = $('#introBrand');
if (intro) document.body.style.overflow = 'hidden';
function closeIntro(){
  if (!intro) return;
  intro.classList.add('hide');
  setTimeout(()=>{ intro.remove(); document.body.style.overflow=''; }, 580);
}
enterBtn?.addEventListener('click', closeIntro);
introBrand?.addEventListener('click', closeIntro);
document.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && document.body.style.overflow==='hidden') closeIntro(); });

/* ===== Theme toggle (system / light / dark) ===== */
const themeToggle = $('#themeToggle');
const THEME_KEY = 'theme-pref'; // values: 'system' | 'light' | 'dark'
function applyTheme(val){
  document.documentElement.dataset.theme = val;
  if(val==='system') document.documentElement.removeAttribute('data-theme');
}
function getSystemTheme(){ return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
applyTheme(localStorage.getItem(THEME_KEY) || 'system');
themeToggle?.addEventListener('click', ()=>{
  const current = document.documentElement.dataset.theme || 'system';
  const next = current==='system' ? (getSystemTheme()==='dark'?'light':'dark') : (current==='dark' ? 'light' : 'dark');
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

/* ===== IntersectionObserver: reveal on scroll ===== */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
},{threshold: 0.12});
$$('.reveal').forEach(el => io.observe(el));

/* ===== Hover tilt ===== */
$$('.tilt').forEach(card => {
  let t;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.setProperty('--rx', rx + 'deg');
    card.style.setProperty('--ry', ry + 'deg');
    clearTimeout(t);
  });
  card.addEventListener('mouseleave', () => {
    t = setTimeout(()=>{ card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg'); }, 80);
  });
});

/* ===== Lightbox ===== */
const lightbox = $('.lightbox');
const lightboxImg = lightbox.querySelector('img');
$$('.zoomable').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src; lightboxImg.alt = img.alt;
    lightbox.classList.add('open'); document.body.style.overflow = 'hidden';
  });
});
$('.lightbox__close').addEventListener('click', () => { lightbox.classList.remove('open'); document.body.style.overflow=''; });
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox){ lightbox.classList.remove('open'); document.body.style.overflow=''; }});

/* ===== Typed / Rotating roles di hero ===== */
const roles = ['Beginner','UI Enthusiast'];
const roleEl = $('#role');
let roleIdx = 0, charIdx = 0, deleting = false;
function tick(){
  const full = roles[roleIdx];
  if(!deleting){
    charIdx++;
    roleEl.textContent = full.slice(0, charIdx);
    if(charIdx === full.length){ deleting = true; setTimeout(tick, 1100); return; }
  }else{
    charIdx--;
    roleEl.textContent = full.slice(0, charIdx);
    if(charIdx === 0){ deleting = false; roleIdx = (roleIdx+1)%roles.length; }
  }
  setTimeout(tick, deleting ? 35 : 38);
}
tick();

/* ===== Ripple micro-interaction ===== */
$$('.btn').forEach(btn=>{
  btn.style.position='relative'; btn.style.overflow='hidden';
  btn.addEventListener('click', function(e){
    const r = this.getBoundingClientRect();
    const s = document.createElement('span');
    const d = Math.max(r.width, r.height);
    Object.assign(s.style,{
      width:d+'px',height:d+'px',position:'absolute',left:(e.clientX - r.left - d/2)+'px',
      top:(e.clientY - r.top - d/2)+'px',borderRadius:'50%',background:'rgba(0,0,0,.15)',
      transform:'scale(0)',animation:'ripple .6s ease-out'
    });
    this.appendChild(s); s.addEventListener('animationend',()=>s.remove());
  });
});
const rippleStyle = document.createElement('style'); rippleStyle.textContent='@keyframes ripple{to{transform:scale(2.8);opacity:0}}'; document.head.appendChild(rippleStyle);

/* ===== Counters ===== */
const counters = $$('.stat__num');
const ioCount = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target; ioCount.unobserve(el);
    const target = +el.dataset.target; let v = 0;
    const step = Math.max(1, Math.round(target/80));
    const inc = ()=>{ v += step; if(v>=target){ v=target; } el.textContent = v; if(v<target) requestAnimationFrame(inc); };
    inc();
  });
},{threshold:.6});
counters.forEach(c=>ioCount.observe(c));


/* ===== Accessibility: focus-visible poly styling ===== */
// (Tip: CSS :focus-visible didukung modern browser; tidak perlu JS)

/* ===== End ===== */
