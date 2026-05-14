// ── Clock in nav ────────────────────────────
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Los_Angeles' });
  el.textContent = `BOSTON · ${t} PT`;
}
updateClock();
setInterval(updateClock, 30000);

// ── Reveal on scroll ────────────────────────
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
  const kids = parent.querySelectorAll('.reveal');
  kids.forEach((k, i) => k.style.transitionDelay = `${i * 60}ms`);
});

// ── Active nav link via scroll spy ──────────
const sections = ['work', 'projects', 'skills', 'education', 'awards', 'contact'];
const navAnchors = document.querySelectorAll('.nav-links a[data-section]');
function spy() {
  let current = '';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 160) current = id;
  }
  navAnchors.forEach(a => a.classList.toggle('active', a.dataset.section === current));
}
addEventListener('scroll', spy, { passive: true });
spy();

// ── Cursor-aware accent ring on project cards ──
document.querySelectorAll('.proj').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.backgroundImage = `radial-gradient(420px circle at ${x}% ${y}%, rgba(222,58,31,.07), transparent 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.backgroundImage = '';
  });
});

// ── Name letter hover ───────────────────────
const nameEl = document.querySelector('.hero-name');
if (nameEl) {
  const wrapLetters = (root) => {
    root.querySelectorAll('span.first, span.last').forEach(span => {
      const txt = span.textContent;
      span.innerHTML = '';
      for (const ch of txt) {
        if (ch === ' ') {
          span.appendChild(document.createTextNode(' '));
        } else {
          const s = document.createElement('span');
          s.textContent = ch;
          s.className = 'ltr';
          s.style.display = 'inline-block';
          s.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1), color .3s';
          s.addEventListener('mouseenter', () => {
            s.style.transform = `translateY(${(Math.random() * 16 - 8).toFixed(1)}px) rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
            s.style.color = 'var(--accent)';
          });
          s.addEventListener('mouseleave', () => {
            s.style.transform = '';
            s.style.color = '';
          });
          span.appendChild(s);
        }
      }
    });
  };
  wrapLetters(nameEl);
}
