// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const rule = e.target.querySelector('.gold-rule');
      if (rule) setTimeout(() => rule.classList.add('animate'), 200);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('pt-BR');
  }
  requestAnimationFrame(step);
}

let countersDone = false;
const cardEl = document.getElementById('sobre-card');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersDone) {
      countersDone = true;
      document.querySelectorAll('.count-val').forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.3 });
if (cardEl) counterObs.observe(cardEl);

// ── Hamburguer menu ──
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  drawer.classList.toggle('open', isOpen);
  drawer.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// ── Hero particles (canvas) ──
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  const COUNT = 15;
  let particles = [];
  let rafId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.35 + 0.1
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,150,46,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      else if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      else if (p.y > canvas.height) p.y = 0;
    });
    rafId = requestAnimationFrame(tick);
  }

  resize();
  initParticles();
  tick();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(rafId);
    resize();
    initParticles();
    tick();
  });
}());

// ── Custom cursor (desktop only) ──
(function () {
  if (document.querySelector('.custom-cursor')) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  if (prefersReduced || !hasFinePointer) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.opacity = '0';
  document.body.appendChild(cursor);

  let mx = -200, my = -200;
  let cx = mx, cy = my;
  let initialized = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!initialized) {
      cx = mx; cy = my;
      cursor.style.opacity = '1';
      initialized = true;
    }
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if (initialized) cursor.style.opacity = '1'; });

  (function moveCursor() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    cursor.style.transform = `translate(${cx - 10}px, ${cy - 10}px)`;
    requestAnimationFrame(moveCursor);
  }());

  document.querySelectorAll('a, button, .area-card, .dif-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}());

// ── LGPD banner ──
const banner = document.getElementById('lgpdBanner');
const LGPD_KEY = 'acc_lgpd_v1';
if (!localStorage.getItem(LGPD_KEY)) {
  setTimeout(() => banner.classList.add('visible'), 800);
} else {
  banner.classList.add('hidden');
}
document.getElementById('lgpdAccept').addEventListener('click', () => {
  localStorage.setItem(LGPD_KEY, 'accepted');
  banner.classList.remove('visible');
  setTimeout(() => banner.classList.add('hidden'), 500);
});
document.getElementById('lgpdReject').addEventListener('click', () => {
  localStorage.setItem(LGPD_KEY, 'rejected');
  banner.classList.remove('visible');
  setTimeout(() => banner.classList.add('hidden'), 500);
});
