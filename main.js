// ── CURSOR ──
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.transform = `translate(${tx - 18}px, ${ty - 18}px)`;
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.addEventListener('mousedown', () => {
  cursor.style.transform += ' scale(0.7)';
  cursor.style.background = '#a3c4ff';
});
document.addEventListener('mouseup', () => {
  cursor.style.background = '#4f8ef7';
});

// ── CANVAS PARTICLE NETWORK ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(79,142,247,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(loop);
}
loop();

// ── TYPING EFFECT ──
const titles = [
  'Chief Problem Solver',
  'Full Stack Developer',
  'AI Enthusiast',
  'Creative Builder'
];
let tIdx = 0, cIdx = 0, deleting = false;
const el = document.getElementById('typed-title');

function type() {
  const current = titles[tIdx];
  if (!deleting) {
    el.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; }
  }
  setTimeout(type, deleting ? 50 : 80);
}
type();

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.07}s`;
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(s => {
    if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${s.id}` ? 'var(--blue3)' : '';
      });
    }
  });
});
