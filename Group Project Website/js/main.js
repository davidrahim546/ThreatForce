// === Background Canvas Animation ===
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const numParticles = 90;
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 1.2; // faster
      this.vy = (Math.random() - 0.5) * 1.2;
      this.size = Math.random() * 1.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    }
  }

  for (let i=0;i<numParticles;i++) particles.push(new Particle());
  function animate() {
    ctx.clearRect(0,0,w,h);
    for (let p of particles){ p.update(); p.draw(); }
    requestAnimationFrame(animate);
  }
  animate();
}

// === Typing Animation ===
const typingEl = document.querySelector('.typing-text');
if (typingEl) {
  const phrases = [
    "Empowering SMEs with human-first cyber defense.",
    "Live phishing simulations with real responders.",
    "Actionable guidance, not just another dashboard."
  ];
  let i=0, j=0, currentPhrase=[], isDeleting=false;

  function type() {
    typingEl.innerHTML = currentPhrase.join('');
    if(!isDeleting && j<phrases[i].length){
      currentPhrase.push(phrases[i][j]);
      j++;
    } else if(isDeleting && j>0){
      currentPhrase.pop();
      j--;
    }

    if(j===phrases[i].length) { 
      isDeleting = true; 
      setTimeout(type,1800); 
      return; 
    }
    if(isDeleting && j===0) { 
      currentPhrase=[]; 
      isDeleting=false; 
      i = (i+1)%phrases.length; 
    }

    const speed = isDeleting ? 60 : 120;
    setTimeout(type,speed);
  }
  type();
}

// === Dropdown Menu Logic ===
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown=>{
  const menu = dropdown.querySelector('.dropdown-menu');
  const trigger = dropdown.querySelector('a');

  // Desktop hover with delay for smooth exit
  let timeout;
  dropdown.addEventListener('mouseenter',()=>{ clearTimeout(timeout); menu.style.display='flex'; menu.style.opacity='1'; });
  dropdown.addEventListener('mouseleave',()=>{
    timeout=setTimeout(()=>{ menu.style.opacity='0'; setTimeout(()=>{ menu.style.display='none'; },300); },300);
  });

  // Mobile click toggle
  trigger.addEventListener('click', e=>{
    if(window.innerWidth<=768){ e.preventDefault(); menu.style.display = menu.style.display==='flex'?'none':'flex'; menu.style.opacity='1'; }
  });
});

// === Hamburger Menu ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if(hamburger && navLinks){
  hamburger.addEventListener('click',()=>{ navLinks.classList.toggle('open'); });
}

// === Fade-In Sections ===
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold:0.3, rootMargin:"0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader=>appearOnScroll.observe(fader));

// === Optional Hero Parallax ===
const hero = document.querySelector('.hero');
window.addEventListener('scroll',()=>{
  if(hero){
    const scrollY = window.scrollY;
    hero.style.transform = `translateY(${scrollY*0.2}px)`;
  }
});
// Read More toggle
const readMoreBtns = document.querySelectorAll('.read-more-btn');
readMoreBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const extra = btn.nextElementSibling;
    extra.style.display = extra.style.display==='block'?'none':'block';
  });
});

// === Chart Animation ===
const insightsSection = document.querySelector('.insights-section');
const barFills = document.querySelectorAll('.bar-fill');
if (insightsSection && barFills.length) {
  const revealBars = () => {
    barFills.forEach(bar => {
      const value = bar.dataset.value || 0;
      bar.style.width = `${value}%`;
    });
  };
  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealBars();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  barObserver.observe(insightsSection);
} else if (barFills.length) {
  // Fallback if observer not available
  barFills.forEach(bar => { bar.style.width = `${bar.dataset.value || 0}%`; });
}

// === FAQ Accordions ===
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
  const item = btn.closest('.faq-item');
  const answer = item?.querySelector('.faq-answer');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    if (answer) {
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
    }
  });
});

// === Live RSS Feed ===
const newsFeed = document.getElementById('news-feed');
if (newsFeed) {
  const feedUrl = 'https://feeds.feedburner.com/TheHackersNews';
  const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
  const fallback = [
    { title: 'CISA warns of surge in spear phishing targeting finance teams', link: '#', date: 'Fresh intel' },
    { title: 'New SSO abuse technique bypasses MFA in legacy apps', link: '#', date: 'Briefing note' },
    { title: 'Ransomware crews pivot to SaaS backups—what to harden now', link: '#', date: 'Playbook' }
  ];

  const renderItems = items => {
    newsFeed.innerHTML = items.map(item => `
      <article class="news-card">
        <h3>${item.title}</h3>
        <div class="news-meta">
          <span>${item.date}</span>
          <a href="${item.link}" target="_blank" rel="noopener noreferrer">Read</a>
        </div>
      </article>
    `).join('');
  };

  fetch(proxy)
    .then(res => res.text())
    .then(str => {
      const doc = new window.DOMParser().parseFromString(str, 'text/xml');
      const items = Array.from(doc.querySelectorAll('item')).slice(0, 6).map(item => ({
        title: item.querySelector('title')?.textContent ?? 'Security update',
        link: item.querySelector('link')?.textContent ?? '#',
        date: item.querySelector('pubDate') ? new Date(item.querySelector('pubDate').textContent).toLocaleDateString() : 'Today'
      }));
      if (!items.length) { throw new Error('No feed items'); }
      renderItems(items);
    })
    .catch(err => {
      console.warn('RSS feed unavailable', err);
      renderItems(fallback);
    });
}

// === Contact Form UX ===
const contactForm = document.getElementById('contact-form');
const formAlert = document.getElementById('form-alert');
if (contactForm && formAlert) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const values = Object.fromEntries(formData.entries());

    if (!values.name || !values.email || !values.company || !values.message) {
      formAlert.textContent = 'Please fill in every field so we can tailor advice.';
      formAlert.style.color = '#ffb4b4';
      return;
    }

    formAlert.textContent = 'Thanks for reaching out. We’ll respond within one business day.';
    formAlert.style.color = '#9ad8ff';
    contactForm.reset();
  });
}

// === Footer Year ===
const yearEl = document.getElementById('year');
if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
