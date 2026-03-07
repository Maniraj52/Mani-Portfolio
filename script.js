/* ============================================
   MANI RAJ PORTFOLIO - script.js
   ============================================ */

// --- PARTICLES (Hero Canvas) ---
(function initParticles() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('heroCanvas');
  container.appendChild(canvas);

  let W, H, particles = [];

  function resize() {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#7c3aed', '#a855f7', '#ec4899', '#c084fc', '#06b6d4'];

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  for (let i = 0; i < 100; i++) particles.push(createParticle());

  // Mouse effect
  let mouse = { x: W / 2, y: H / 2 };
  container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Bounce
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      // Mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += (dx / dist) * 0.5;
        p.y += (dy / dist) * 0.5;
      }
    });

    // Draw connecting lines
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// --- TYPING EFFECT ---
(function initTyping() {
  const lines = [
    'AI & ML Engineering Student',
    'Python Developer',
    'Competitive Programmer',
    'Web Dev Enthusiast',
    'Problem Solver'
  ];
  const el = document.getElementById('typedText');
  let lineIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = lines[lineIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  type();
})();

// --- NAVBAR SCROLL ---
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Active link highlight
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // Hamburger (mobile)
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.right = '1.5rem';
    navLinks.style.background = 'rgba(7,6,15,0.95)';
    navLinks.style.border = '1px solid rgba(168,85,247,0.2)';
    navLinks.style.borderRadius = '12px';
    navLinks.style.padding = '0.75rem';
    navLinks.style.zIndex = '999';
  });
})();

// --- SKILL BARS (Intersection Observer) ---
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

// --- SCROLL REVEAL ---
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.stat-card, .skill-category, .project-card, .contact-card, .timeline-card, .info-item'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * (i % 6));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
})();

// --- CONTACT FORM ---
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `<span>✅ Message Sent!</span>`;
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
})();

// --- CURSOR GLOW EFFECT ---
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 350px; height: 350px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// --- SMOOTH SCROLL for nav links ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
