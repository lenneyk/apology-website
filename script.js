/* =================================================================
   SMOOTH SCROLL CUE
================================================================= */
const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  scrollCue.addEventListener('click', () => {
    const target = document.querySelector('.music-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* =================================================================
   SCROLL-TRIGGERED FADE-UP REVEALS
================================================================= */
const revealEls = document.querySelectorAll('.fade-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el) => revealObserver.observe(el));

/* Stagger the reason cards slightly for a nicer cascade */
document.querySelectorAll('.reason-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 90}ms`;
});

/* =================================================================
   GALLERY — auto-populate from /images folder with graceful fallback
================================================================= */
const galleryGrid = document.getElementById('galleryGrid');
const photoFiles = [
  'photo1.jpeg', 'photo2.jpeg', 'photo3.jpeg',
  'photo4.jpeg', 'photo5.jpeg', 'photo6.jpeg'
];

const heartPlaceholderSVG = `
  <svg width="34" height="34" viewBox="0 0 24 24" class="placeholder-icon-svg">
    <path d="M12 21s-7.5-4.6-10.2-9.1C-0.1 8.9 1.4 5 5.1 4.2 7.6 3.6 10 4.8 12 7.3 14 4.8 16.4 3.6 18.9 4.2 22.6 5 24.1 8.9 22.2 11.9 19.5 16.4 12 21 12 21Z" fill="currentColor"/>
  </svg>`;

photoFiles.forEach((file, index) => {
  const item = document.createElement('div');
  item.className = 'gallery-item fade-up';
  item.style.transitionDelay = `${index * 80}ms`;

  const img = document.createElement('img');
  img.src = file;
  img.alt = `A photo we shared, memory ${index + 1}`;
  img.loading = 'lazy';

  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder-icon';
  placeholder.innerHTML = heartPlaceholderSVG;
  placeholder.style.display = 'none';

  img.addEventListener('error', () => {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  });

  item.appendChild(img);
  item.appendChild(placeholder);
  galleryGrid.appendChild(item);
  revealObserver.observe(item);
});

/* =================================================================
   FORGIVENESS BUTTONS
================================================================= */
const acceptBtn = document.getElementById('acceptBtn');
const notYetBtn = document.getElementById('notYetBtn');
const responseBox = document.getElementById('responseBox');

function showResponse(message) {
  responseBox.classList.remove('show');
  // force reflow so the transition replays even if box was already visible
  void responseBox.offsetWidth;
  responseBox.textContent = message;
  requestAnimationFrame(() => responseBox.classList.add('show'));
}

acceptBtn.addEventListener('click', () => {
  showResponse(
    "Thank you for giving me another chance. I promise to keep proving every day how much you mean to me."
  );
  launchHeartBurst();
});

notYetBtn.addEventListener('click', () => {
  showResponse(
    "I understand. I know forgiveness can't be rushed, and I respect your feelings. I'll continue showing you through my actions how much you mean to me. I'll be here whenever you're ready."
  );
});

/* =================================================================
   HEART BURST ANIMATION (on acceptance)
================================================================= */
const burstLayer = document.getElementById('heartBurstLayer');

function launchHeartBurst() {
  const count = window.innerWidth < 600 ? 16 : 28;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'burst-heart';
    heart.textContent = '❀';
    // Use a soft floral mark rather than emoji glyphs for a premium feel
    heart.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10.2-9.1C-0.1 8.9 1.4 5 5.1 4.2 7.6 3.6 10 4.8 12 7.3 14 4.8 16.4 3.6 18.9 4.2 22.6 5 24.1 8.9 22.2 11.9 19.5 16.4 12 21 12 21Z" fill="currentColor"/></svg>`;

    const left = Math.random() * 100;
    const duration = 3.2 + Math.random() * 2.2;
    const delay = Math.random() * 0.6;
    const drift = (Math.random() - 0.5) * 160;
    const rot = (Math.random() - 0.5) * 60;
    const scale = 0.7 + Math.random() * 0.9;

    heart.style.left = `${left}%`;
    heart.style.setProperty('--drift', `${drift}px`);
    heart.style.setProperty('--rot', `${rot}deg`);
    heart.style.fontSize = `${1 + Math.random()}rem`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.transform = `scale(${scale})`;

    burstLayer.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + delay) * 1000 + 300);
  }
}

/* =================================================================
   AMBIENT FLOATING PARTICLES (canvas hearts, background)
================================================================= */
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawHeart(x, y, size, rotation, opacity, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  const s = size / 24;
  ctx.moveTo(0, 6 * s);
  ctx.bezierCurveTo(-10 * s, -2 * s, -12 * s, -10 * s, -5 * s, -12 * s);
  ctx.bezierCurveTo(-1 * s, -13 * s, 0, -9 * s, 0, -7 * s);
  ctx.bezierCurveTo(0, -9 * s, 1 * s, -13 * s, 5 * s, -12 * s);
  ctx.bezierCurveTo(12 * s, -10 * s, 10 * s, -2 * s, 0, 6 * s);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

const heartColors = [
  'rgba(232, 65, 126, 0.55)',
  'rgba(255, 111, 160, 0.5)',
  'rgba(255, 168, 197, 0.6)',
  'rgba(240, 201, 160, 0.4)'
];

function createParticle(initial = false) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: Math.random() * w,
    y: initial ? Math.random() * h : h + Math.random() * 100,
    size: 10 + Math.random() * 16,
    speed: 0.25 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.01,
    opacity: 0.25 + Math.random() * 0.35,
    color: heartColors[Math.floor(Math.random() * heartColors.length)],
    sway: Math.random() * Math.PI * 2
  };
}

function initParticles() {
  const isMobile = window.innerWidth < 700;
  const count = isMobile ? 14 : 24;
  particles = Array.from({ length: count }, () => createParticle(true));
}

let lastTime = 0;
function animateParticles(time) {
  if (time - lastTime < 33) { // cap ~30fps, plenty for soft ambient motion
    requestAnimationFrame(animateParticles);
    return;
  }
  lastTime = time;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((p) => {
    p.y -= p.speed;
    p.sway += 0.015;
    p.x += Math.sin(p.sway) * 0.4 + p.drift;
    p.rotation += p.rotationSpeed;

    if (p.y < -40) {
      Object.assign(p, createParticle(false));
      p.y = window.innerHeight + 20;
    }
    if (p.x < -40) p.x = window.innerWidth + 40;
    if (p.x > window.innerWidth + 40) p.x = -40;

    drawHeart(p.x, p.y, p.size, p.rotation, p.opacity, p.color);
  });

  requestAnimationFrame(animateParticles);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

resizeCanvas();
initParticles();

if (!prefersReducedMotion) {
  requestAnimationFrame(animateParticles);
} else {
  // draw a single static frame so the canvas isn't blank, then stop
  particles.forEach((p) => drawHeart(p.x, p.y, p.size, p.rotation, p.opacity, p.color));
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resizeCanvas();
    initParticles();
  }, 200);
});
