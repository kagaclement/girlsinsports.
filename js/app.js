const DEFAULT_MEDIA = {
    hero: [
      {
        src: "images/banner.jpg",
        alt: "Girls celebrating",
        title: "Empowering Girls Through Sports",
        subtitle: "Girls showing confidence and leadership on the field."
      },
      {
        src: "images/banner1.jpg",
        alt: "Basketball huddle",
        title: "Strength in Teamwork",
        subtitle: "Teamwork helps girls achieve more."
      },
      {
        src: "images/banner2.jpg",
        alt: "Sprint start",
        title: "Breaking Barriers",
        subtitle: "Girls breaking stereotypes through sports."
      }
    ],
    gallery: [],
    defaults: { gallery_fallback: "images/gallery/default.jpg" }
  };
  
/* ========= Helpers ========= */
function getJSON(id, fallback) {
  try {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const txt = el.textContent.trim();
    if (!txt) return fallback;
    return JSON.parse(txt);
  } catch (e) {
    console.warn(`Failed to parse JSON from #${id}`, e);
    return fallback;
  }
}
const today = new Date();
const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const parseDate = (s) => new Date(new Date(s).getFullYear(), new Date(s).getMonth(), new Date(s).getDate());
const isPast = (s) => parseDate(s) < d0;

/* ========= Render: HERO & GALLERY ========= */
function renderHeroCarousel(items = [], fallbackImg = '') {
  const host = document.getElementById('carouselHero');
  if (!host) return;
  const indicators = host.querySelector('.carousel-indicators');
  const inner = host.querySelector('.carousel-inner');
  if (!indicators || !inner) return;

  if (!items.length) {
    indicators.innerHTML = `<li data-target="#carouselHero" data-slide-to="0" class="active"></li>`;
    inner.innerHTML = `
      <div class="carousel-item active">
        <div class="d-flex w-100 h-100 align-items-center justify-content-center bg-light" style="height:500px;">
          <div class="carousel-caption d-block">
            <h1 class="green-apple-text">Welcome</h1>
            <p class="green-apple-text">Empowering girls through sports.</p>
          </div>
        </div>
      </div>`;
    return;
  }

  indicators.innerHTML = items.map((_, i) =>
    `<li data-target="#carouselHero" data-slide-to="${i}" class="${i===0?'active':''}"></li>`
  ).join('');

  inner.innerHTML = items.map((it, i) => `
    <div class="carousel-item ${i===0?'active':''}">
      <img src="${it.src}" class="d-block w-100" alt="${it.alt||''}" onerror="${fallbackImg?`this.src='${fallbackImg}'`:''}">
      <div class="carousel-caption d-none d-md-block">
        <h1 class="green-apple-text">${it.title||''}</h1>
        <p class="green-apple-text">${it.subtitle||''}</p>
      </div>
    </div>
  `).join('');

  const hours = new Date().getHours();
  const greet = hours<12?"Good Morning!":hours<18?"Good Afternoon!":"Good Evening!";
  const heroP = host.querySelector('.carousel-item.active .carousel-caption p');
  if (heroP && heroP.textContent.trim()) heroP.textContent = `${greet} ${heroP.textContent}`;
}

function renderGalleryCarousel(items = [], fallback = '') {
  const wrap = document.getElementById('photoCarousel');
  if (!wrap) return;
  const inner = wrap.querySelector('.carousel-inner');
  if (!inner) return;

  if (!items.length) {
    inner.innerHTML = `
      <div class="carousel-item active">
        <div class="d-flex w-100 h-100 align-items-center justify-content-center bg-light" style="height:500px;">
          <div class="text-muted">Gallery will appear here.</div>
        </div>
      </div>`;
    return;
  }

  inner.innerHTML = items.map((it, i) => `
    <div class="carousel-item ${i===0?'active':''}">
      <img src="${it.src}" class="d-block w-100" alt="${it.alt||''}" onerror="this.src='${fallback}'">
      <div class="carousel-caption d-none d-md-block">
        <h5>${it.title||''}</h5>
        <p>${it.caption||''}</p>
      </div>
    </div>
  `).join('');
}

/* ========= Render: EVENTS ========= */
function eventCard(ev) {
  const past = isPast(ev.date);
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card position-relative h-100">
        <span class="badge ${past?'badge-secondary':'badge-success'}">${past?'Past':'Upcoming'}</span>
        ${ev.image?`<img src="${ev.image}" class="card-img-top" alt="${ev.title}">`:''}
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${ev.title}</h5>
          <small class="text-muted d-block mb-2">${ev.date}${ev.location?` · ${ev.location}`:''}</small>
          <p class="card-text flex-grow-1">${ev.description||''}</p>
          ${ev.link?`<a href="${ev.link}" class="btn btn-primary mt-auto" target="_blank" rel="noopener">Learn more</a>`:''}
        </div>
      </div>
    </div>
  `;
}
function renderEventsList(data) {
  const upcomingWrap = document.getElementById('upcoming-events');
  const pastWrap = document.getElementById('past-events');
  const allWrap = document.getElementById('all-events');
  if (!upcomingWrap || !pastWrap || !allWrap) return;

  const sorted = [...data].sort((a,b)=>parseDate(a.date)-parseDate(b.date));
  const upcoming = sorted.filter(e=>!isPast(e.date));
  const past = sorted.filter(e=>isPast(e.date)).reverse();

  upcomingWrap.innerHTML = upcoming.length ? upcoming.map(eventCard).join('') : `<div class="col-12 text-center text-muted">No upcoming events.</div>`;
  pastWrap.innerHTML = past.length ? past.map(eventCard).join('') : `<div class="col-12 text-center text-muted">No past events recorded.</div>`;
  allWrap.innerHTML = sorted.length ? sorted.map(eventCard).join('') : `<div class="col-12 text-center text-muted">No events available.</div>`;
}

/* ========= Render: PARTNERS ========= */
function partnerCard(p) {
  return `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card partner-card h-100 text-center p-3">
        <img src="${p.logo}" alt="${p.name} logo" class="partner-logo mx-auto mb-3" onerror="this.src='images/partners/default.png'"/>
        <h6 class="mb-1">${p.name}</h6>
        <p class="text-muted small mb-2">${p.blurb||''}</p>
        ${p.website?`<a href="${p.website}" class="btn btn-outline-primary btn-sm" target="_blank" rel="noopener">Visit</a>`:''}
      </div>
    </div>
  `;
}
function renderPartnersList(data) {
  const grid = document.getElementById('partners-grid');
  if (!grid) return;
  grid.innerHTML = data.length ? data.map(partnerCard).join('') : `<div class="col-12 text-center text-muted">Partners list will appear here.</div>`;
}

/* ========= Render: TESTIMONIES ========= */
function starRow(n=0){
  let out=''; for(let i=1;i<=5;i++) out+=`<span class="${i<=n?'filled':''}">&#9733;</span>`;
  return `<div class="stars" aria-label="${n} out of 5 stars">${out}</div>`;
}
function renderTestimoniesCarousel(data){
  const slides = document.getElementById('testimony-slides');
  const indicators = document.getElementById('testimony-indicators');
  if (!slides || !indicators) return;

  if (!data.length){
    slides.innerHTML = `<div class="carousel-item active"><div class="testimony-card text-center text-muted">No testimonies yet.</div></div>`;
    indicators.innerHTML = `<li data-target="#testimoniesCarousel" data-slide-to="0" class="active"></li>`;
    return;
  }

  slides.innerHTML = data.map((t,i)=>`
    <div class="carousel-item ${i===0?'active':''}">
      <div class="testimony-card">
        <p class="testimony-quote mb-3">“${t.quote}”</p>
        ${starRow(t.stars||0)}
        <div class="testimony-author">
          <img class="testimony-avatar" src="${t.avatar}" alt="${t.name} avatar" onerror="this.src='images/testimonies/default.png'"/>
          <div>
            <strong>${t.name}</strong><br/>
            <small class="text-muted">${t.role||''}</small>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  indicators.innerHTML = data.map((_,i)=>`<li data-target="#testimoniesCarousel" data-slide-to="${i}" class="${i===0?'active':''}"></li>`).join('');
}

/* ========= Bootstrap everything (no fetch) ========= */
(function init(){
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const tgt=document.querySelector(a.getAttribute('href'));
      if(tgt){ e.preventDefault(); tgt.scrollIntoView({behavior:'smooth'}); }
    });
  });

  // Load data from embedded JSON
  const media = getJSON('media-json', {hero:[], gallery:[], defaults:{}});
  const events = getJSON('events-json', []);
  const partners = getJSON('partners-json', []);
  const testimonies = getJSON('testimonies-json', []);

  // Render
  renderHeroCarousel(media.hero || [], media.defaults?.gallery_fallback || '');
  renderGalleryCarousel(media.gallery || [], media.defaults?.gallery_fallback || '');
  renderEventsList(events);
  renderPartnersList(partners);
  renderTestimoniesCarousel(testimonies);
})();
