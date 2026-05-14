// ────────────────────────────────────────────
// Live clock
// ────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const t = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'America/Los_Angeles'
  });
  el.textContent = `SCC · ${t} PT`;
}
updateClock();
setInterval(updateClock, 30000);

// ────────────────────────────────────────────
// Tagline rotator
// ────────────────────────────────────────────
const rotator = document.getElementById('rotator');
const ROTATE = ['1M+ users.', 'production.', 'scale.', 'sign-off.', 'real impact.', 'startups.'];
let ri = 0;
function rotate() {
  if (!rotator) return;
  rotator.style.opacity = '0';
  rotator.style.transform = 'translateY(-6px)';
  setTimeout(() => {
    ri = (ri + 1) % ROTATE.length;
    rotator.textContent = ROTATE[ri];
    rotator.style.opacity = '1';
    rotator.style.transform = 'translateY(0)';
  }, 280);
}
if (rotator) {
  rotator.style.transition = 'opacity .3s ease, transform .3s ease';
  setInterval(rotate, 2400);
}

// ────────────────────────────────────────────
// Reveal on scroll
// ────────────────────────────────────────────
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// stagger children of .stagger
document.querySelectorAll('.stagger').forEach(parent => {
  parent.querySelectorAll('.reveal').forEach((k, i) => k.style.transitionDelay = `${i * 70}ms`);
});

// ────────────────────────────────────────────
// Count-up stats
// ────────────────────────────────────────────
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US');
    if (p < 1) requestAnimationFrame(step);
    else {
      el.textContent = el.dataset.final || (decimals ? target.toFixed(decimals) : target.toLocaleString('en-US'));
    }
  }
  requestAnimationFrame(step);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => countObs.observe(el));

// ────────────────────────────────────────────
// Scroll spy
// ────────────────────────────────────────────
const sections = ['work', 'projects', 'skills', 'education', 'wins', 'contact'];
const navAnchors = document.querySelectorAll('.nav-links a[data-section]');
function spy() {
  let current = '';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 200) current = id;
  }
  navAnchors.forEach(a => a.classList.toggle('active', a.dataset.section === current));
}
addEventListener('scroll', spy, { passive: true });
spy();

// ────────────────────────────────────────────
// Cursor-aware gradient on cards
// ────────────────────────────────────────────
document.querySelectorAll('.proj, .featured').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ────────────────────────────────────────────
// Magnetic CTA buttons
// ────────────────────────────────────────────
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  const strength = 0.25;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ────────────────────────────────────────────
// Hero name letter wiggle
// ────────────────────────────────────────────
document.querySelectorAll('.hero-name .first, .hero-name .last').forEach(span => {
  const txt = span.textContent;
  span.innerHTML = '';
  for (const ch of txt) {
    if (ch === ' ') {
      span.appendChild(document.createTextNode(' '));
      continue;
    }
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.display = 'inline-block';
    s.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1)';
    s.addEventListener('mouseenter', () => {
      const dx = (Math.random() * 14 - 7).toFixed(1);
      const dy = (Math.random() * 14 - 7).toFixed(1);
      s.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    s.addEventListener('mouseleave', () => { s.style.transform = ''; });
    span.appendChild(s);
  }
});

// ────────────────────────────────────────────
// Terminal typing simulation
// ────────────────────────────────────────────
const terminal = document.getElementById('terminal-body');
if (terminal) {
  const LINES = [
    { t: 350, html: `<span class="prompt">$</span> firstapply --start` },
    { t: 500, html: `<span class="dim">[init]</span> connecting boards <span class="dim">…</span>` },
    { t: 600, html: `<span class="ok">✓</span> LinkedIn  <span class="dim">·</span> Indeed  <span class="dim">·</span> YC  <span class="dim">·</span> Greenhouse` },
    { t: 750, html: `<span class="ok">✓</span> scraped <span class="key">2,617</span> roles in <span class="key">4.2s</span>` },
    { t: 700, html: `<span class="dim">[claude]</span> scoring against profile_v3 <span class="dim">…</span>` },
    { t: 900, html: `<span class="ok">✓</span> top match: <span class="key">Cohere · ML Eng</span>  <span class="key">92/100</span>` },
    { t: 600, html: `<span class="prompt">$</span> ship --now <span class="cursor">█</span>` }
  ];
  let idx = 0;
  function next() {
    if (idx >= LINES.length) return;
    const ln = LINES[idx++];
    const row = document.createElement('div');
    row.innerHTML = ln.html;
    row.style.opacity = '0';
    row.style.transform = 'translateY(4px)';
    row.style.transition = 'opacity .3s, transform .3s';
    terminal.appendChild(row);
    requestAnimationFrame(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    });
    setTimeout(next, ln.t);
  }
  // start a moment after load so user sees it animate
  setTimeout(next, 600);
}

// ────────────────────────────────────────────
// Keyboard: 'G' to scroll to contact (easter egg) & nothing else
// ────────────────────────────────────────────
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'g' || e.key === 'G') {
    const contact = document.getElementById('contact');
    if (contact) window.scrollTo({ top: contact.offsetTop - 20, behavior: 'smooth' });
  }
});
