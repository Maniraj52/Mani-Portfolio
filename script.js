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

/* ==========================================================================
   INTERACTIVE LIVE DEMOS CONSOLE & PLAYGROUNDS (UPDATED FOR CV PROJECTS)
   ========================================================================== */

// --- 1. SHOWCASE CONSOLE CONTROLLER ---
const LiveDemoConsole = (function () {
  const URL_MAP = {
    'demo-ai-nlp': 'demos.maniraj.dev/fakebuster-nlp',
    'demo-parking-sim': 'demos.maniraj.dev/parking-assistance',
    'demo-snake-game': 'demos.maniraj.dev/snake-arcade',
    'demo-rural-assist': 'demos.maniraj.dev/rural-assist-ai'
  };

  const TITLE_MAP = {
    'demo-ai-nlp': { title: 'FAKEBUSTER & AI NLP Studio', icon: '🛡️' },
    'demo-parking-sim': { title: 'Automated Parking Assistance', icon: '🚗' },
    'demo-snake-game': { title: 'Interactive Snake Game', icon: '🐍' },
    'demo-rural-assist': { title: 'RuralAssist AI Community Advisor', icon: '🌾' }
  };

  let activeDemoId = 'demo-ai-nlp';

  function init() {
    const tabCards = document.querySelectorAll('.demo-tab-card');
    const filterBtns = document.querySelectorAll('.demo-filter-btn');
    const urlText = document.getElementById('demoUrlText');
    const reloadBtn = document.getElementById('demoReloadBtn');
    const btnDesktop = document.getElementById('btnDeviceDesktop');
    const btnMobile = document.getElementById('btnDeviceMobile');
    const browserFrame = document.querySelector('.demo-browser-frame');
    const fullscreenBtn = document.getElementById('btnFullscreenModal');
    const modal = document.getElementById('demoFullscreenModal');
    const modalClose = document.getElementById('dfmCloseBtn');
    const modalBackdrop = document.getElementById('dfmBackdrop');

    // Tab switcher
    tabCards.forEach(card => {
      card.addEventListener('click', () => {
        const demoId = card.getAttribute('data-demo-id');
        activateDemo(demoId);
      });
    });

    // Category Filter
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        let firstVisible = null;
        tabCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'block';
            if (!firstVisible) firstVisible = card;
          } else {
            card.style.display = 'none';
          }
        });

        const currentCard = document.querySelector(`.demo-tab-card[data-demo-id="${activeDemoId}"]`);
        if (currentCard && currentCard.style.display === 'none' && firstVisible) {
          activateDemo(firstVisible.getAttribute('data-demo-id'));
        }
      });
    });

    // Device Preview Toggle
    if (btnDesktop && btnMobile && browserFrame) {
      btnDesktop.addEventListener('click', () => {
        btnDesktop.classList.add('active');
        btnMobile.classList.remove('active');
        browserFrame.classList.remove('is-mobile');
      });
      btnMobile.addEventListener('click', () => {
        btnMobile.classList.add('active');
        btnDesktop.classList.remove('active');
        browserFrame.classList.add('is-mobile');
      });
    }

    // Reset / Reload button
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        reloadBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => reloadBtn.style.transform = '', 400);
        resetActiveDemo();
      });
    }

    // Fullscreen Modal
    if (fullscreenBtn && modal) {
      fullscreenBtn.addEventListener('click', openFullscreenModal);
      if (modalClose) modalClose.addEventListener('click', closeFullscreenModal);
      if (modalBackdrop) modalBackdrop.addEventListener('click', closeFullscreenModal);
    }

    // External Triggers from project cards
    document.querySelectorAll('.trigger-demo').forEach(link => {
      link.addEventListener('click', () => {
        const demoId = link.getAttribute('data-demo');
        if (demoId) activateDemo(demoId);
      });
    });
  }

  function activateDemo(demoId) {
    activeDemoId = demoId;

    document.querySelectorAll('.demo-tab-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-demo-id') === demoId);
    });

    document.querySelectorAll('.demo-screen').forEach(s => {
      s.classList.toggle('active', s.id === demoId);
    });

    const urlText = document.getElementById('demoUrlText');
    if (urlText && URL_MAP[demoId]) {
      urlText.textContent = URL_MAP[demoId];
    }
  }

  function resetActiveDemo() {
    if (activeDemoId === 'demo-ai-nlp' && window.FakeBusterStudio) {
      window.FakeBusterStudio.reset();
    } else if (activeDemoId === 'demo-parking-sim' && window.ParkingSimulator) {
      window.ParkingSimulator.reset();
    } else if (activeDemoId === 'demo-snake-game' && window.SnakeGameEngine) {
      window.SnakeGameEngine.reset();
    } else if (activeDemoId === 'demo-rural-assist' && window.RuralAssistAdvisor) {
      window.RuralAssistAdvisor.reset();
    }
  }

  function openFullscreenModal() {
    const modal = document.getElementById('demoFullscreenModal');
    const dfmBody = document.getElementById('dfmBody');
    const dfmTitle = document.getElementById('dfmTitle');
    const dfmIcon = document.getElementById('dfmIcon');
    const activeScreen = document.getElementById(activeDemoId);

    if (!modal || !dfmBody || !activeScreen) return;

    const info = TITLE_MAP[activeDemoId] || { title: 'Live Project Demo', icon: '⚡' };
    if (dfmTitle) dfmTitle.textContent = info.title;
    if (dfmIcon) dfmIcon.textContent = info.icon;

    dfmBody.innerHTML = '';
    const clone = activeScreen.cloneNode(true);
    clone.style.display = 'block';
    dfmBody.appendChild(clone);

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeFullscreenModal() {
    const modal = document.getElementById('demoFullscreenModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  return { init, activateDemo };
})();

// --- 2. DEMO 1: FAKEBUSTER & AI MISINFORMATION VERIFIER ---
const FakeBusterStudio = (function () {
  const VERIFIED_LEXICON = {
    study: 0.85, peer: 0.9, reviewed: 0.95, researchers: 0.85, scientists: 0.9,
    university: 0.8, official: 0.85, published: 0.8, data: 0.75, report: 0.7,
    confirmed: 0.8, evidence: 0.85, breakthrough: 0.8, trial: 0.8, patent: 0.85,
    system: 0.65, efficiency: 0.8, deployment: 0.75, tested: 0.75, verified: 0.95
  };

  const MISINFO_LEXICON = {
    shocking: -0.9, miracle: -0.95, secret: -0.85, hiding: -0.9, cure: -0.75,
    click: -0.85, overnight: -0.8, conspiracy: -0.95, rumor: -0.85, aliens: -0.9,
    hoax: -0.95, scam: -0.95, urgent: -0.65, panic: -0.8, shut: -0.7,
    destroy: -0.7, guaranteed: -0.75, magic: -0.85, unproven: -0.8
  };

  function analyze(text) {
    if (!text || text.trim() === '') {
      return {
        credibility: 50,
        emoji: '⚖️',
        label: 'Neutral Statement',
        barPercent: 50,
        signals: { fact: 50, sensational: 10, objectivity: 60, urgency: 10 },
        tokens: [],
        words: 0,
        verdict: 'Uncertain (0.50)'
      };
    }

    const words = text.toLowerCase().match(/\b[a-zA-Z0-9_-]+\b/g) || [];
    let veracityScore = 0;
    let tokenMatches = [];
    let factScore = 30, sensScore = 10, objScore = 50, urgScore = 5;

    words.forEach(w => {
      if (VERIFIED_LEXICON[w]) {
        let val = VERIFIED_LEXICON[w];
        veracityScore += val;
        factScore += 25;
        objScore += 20;
        tokenMatches.push({ text: `${w} (+${val.toFixed(1)})`, type: 'pos' });
      } else if (MISINFO_LEXICON[w]) {
        let val = MISINFO_LEXICON[w];
        veracityScore += val;
        sensScore += 35;
        urgScore += 30;
        objScore = Math.max(5, objScore - 20);
        tokenMatches.push({ text: `${w} (${val.toFixed(1)})`, type: 'neg' });
      }
    });

    // Compute final credibility %
    let rawProb = 50 + veracityScore * 20;
    let credibility = Math.max(8, Math.min(96, Math.round(rawProb)));

    let emoji = '🛡️', label = 'Highly Reliable';
    if (credibility >= 80) { emoji = '🛡️'; label = 'Authentic & Verified'; }
    else if (credibility >= 55) { emoji = '📰'; label = 'Likely Credible'; }
    else if (credibility <= 30) { emoji = '🚨'; label = 'High Misinformation Risk'; }
    else { emoji = '⚠️'; label = 'Unverified / Sensational'; }

    const sSum = factScore + sensScore + objScore + urgScore;
    const signals = {
      fact: Math.min(98, Math.max(10, Math.round((factScore / sSum) * 180))),
      sensational: Math.min(98, Math.max(5, Math.round((sensScore / sSum) * 180))),
      objectivity: Math.min(98, Math.max(10, Math.round((objScore / sSum) * 180))),
      urgency: Math.min(98, Math.max(5, Math.round((urgScore / sSum) * 180)))
    };

    return {
      credibility,
      emoji,
      label,
      barPercent: credibility,
      signals,
      tokens: tokenMatches.slice(0, 8),
      words: words.length,
      verdict: `${credibility >= 70 ? 'Authentic' : credibility <= 35 ? 'Fake / Clickbait' : 'Caution'} (${(credibility / 100).toFixed(2)})`
    };
  }

  function updateUI(res) {
    const emojiEl = document.getElementById('nlpSentimentEmoji');
    const labelEl = document.getElementById('nlpSentimentLabel');
    const scoreEl = document.getElementById('nlpSentimentScore');
    const barEl = document.getElementById('nlpSentimentBar');
    const tokensList = document.getElementById('nlpTokensList');
    const wordCountEl = document.getElementById('nlpWordCount');
    const subEl = document.getElementById('nlpSubjectivity');

    if (emojiEl) emojiEl.textContent = res.emoji;
    if (labelEl) labelEl.textContent = res.label;
    if (scoreEl) {
      scoreEl.textContent = `${res.credibility}% Credibility`;
      scoreEl.style.color = res.credibility >= 65 ? '#10b981' : res.credibility <= 35 ? '#ef4444' : '#f59e0b';
    }
    if (barEl) {
      barEl.style.width = res.barPercent + '%';
      if (res.credibility >= 65) {
        barEl.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
      } else if (res.credibility <= 35) {
        barEl.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
      } else {
        barEl.style.background = 'linear-gradient(90deg, #f59e0b, #6366f1)';
      }
    }

    setSig('emoConf', 'emoConfVal', res.signals.fact);
    setSig('emoJoy', 'emoJoyVal', res.signals.sensational);
    setSig('emoNeut', 'emoNeutVal', res.signals.objectivity);
    setSig('emoEnergy', 'emoEnergyVal', res.signals.urgency);

    if (tokensList) {
      tokensList.innerHTML = '';
      if (res.tokens.length === 0) {
        tokensList.innerHTML = '<span class="token-tag tech">Standard Vocabulary</span>';
      } else {
        res.tokens.forEach(t => {
          const span = document.createElement('span');
          span.className = `token-tag ${t.type}`;
          span.textContent = t.text;
          tokensList.appendChild(span);
        });
      }
    }

    if (wordCountEl) wordCountEl.textContent = res.words;
    if (subEl) subEl.textContent = res.verdict;
  }

  function setSig(barId, valId, val) {
    const b = document.getElementById(barId);
    const v = document.getElementById(valId);
    if (b) b.style.width = val + '%';
    if (v) v.textContent = val + '%';
  }

  function run() {
    const input = document.getElementById('nlpInputText');
    if (!input) return;
    const res = analyze(input.value);
    updateUI(res);
  }

  function init() {
    const input = document.getElementById('nlpInputText');
    const charCount = document.getElementById('nlpCharCount');
    const analyzeBtn = document.getElementById('btnAnalyzeNlp');
    const presetBtns = document.querySelectorAll('.nlp-preset-btn');

    if (input) {
      input.addEventListener('input', () => {
        if (charCount) charCount.textContent = `${input.value.length} characters`;
        run();
      });
    }

    if (analyzeBtn) analyzeBtn.addEventListener('click', run);

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        if (input && text) {
          input.value = text;
          if (charCount) charCount.textContent = `${text.length} characters`;
          run();
        }
      });
    });

    run();
  }

  function reset() {
    const input = document.getElementById('nlpInputText');
    if (input) {
      input.value = 'Scientists at MIT develop breakthrough clean solar cells with 45% efficiency in peer-reviewed study.';
      run();
    }
  }

  return { init, run, reset };
})();

// --- 3. DEMO 2: AUTOMATED PARKING ASSISTANCE SIMULATOR ---
const ParkingSimulator = (function () {
  const TOTAL_SLOTS = 8;
  let slots = [true, false, true, false, false, true, false, true]; // true = occupied, false = vacant
  let isGateOpen = false;
  let isBuzzerActive = false;

  const SAMPLE_PLATES = [
    'PB-10-MR-2026', 'DL-03-AI-9942', 'HR-26-CS-1337', 'BR-01-PK-8821',
    'MH-02-EE-4500', 'UP-32-TECH-77', 'KA-04-AUTO-10', 'RJ-14-ML-5522'
  ];

  function renderSlots() {
    const container = document.getElementById('parkingSlotsGrid');
    if (!container) return;
    container.innerHTML = '';

    slots.forEach((isOccupied, idx) => {
      const card = document.createElement('div');
      card.className = `parking-slot-card ${isOccupied ? 'occupied' : 'vacant'}`;
      card.innerHTML = `
        <div class="slot-num">Slot #${idx + 1}</div>
        <div class="slot-icon">${isOccupied ? '🚗' : '🅿️'}</div>
        <div class="slot-status-text">${isOccupied ? 'Occupied' : 'Vacant'}</div>
      `;
      card.addEventListener('click', () => toggleSlot(idx));
      container.appendChild(card);
    });

    updateStats();
  }

  function toggleSlot(idx) {
    slots[idx] = !slots[idx];
    logMsg(`Slot #${idx + 1} manually toggled to ${slots[idx] ? 'Occupied' : 'Vacant'}.`);
    renderSlots();
  }

  function updateStats() {
    const occEl = document.getElementById('parkOccupancy');
    const gateEl = document.getElementById('parkGateStatus');
    const buzzerEl = document.getElementById('parkBuzzerStatus');
    const barrier = document.getElementById('gateBarrier');

    const occupiedCount = slots.filter(Boolean).length;
    if (occEl) occEl.textContent = `${occupiedCount} / ${TOTAL_SLOTS} Slots`;

    // Overcapacity Buzzer Logic
    if (occupiedCount >= TOTAL_SLOTS) {
      isBuzzerActive = true;
      if (buzzerEl) {
        buzzerEl.textContent = '🚨 OVERCAPACITY BUZZER ON';
        buzzerEl.style.color = '#ef4444';
      }
      isGateOpen = false;
      if (gateEl) {
        gateEl.textContent = 'CLOSED (Lot Full)';
        gateEl.style.color = '#ef4444';
      }
    } else {
      isBuzzerActive = false;
      if (buzzerEl) {
        buzzerEl.textContent = 'OFF';
        buzzerEl.style.color = '#94a3b8';
      }
      if (gateEl) {
        gateEl.textContent = isGateOpen ? 'OPEN (Active)' : 'READY';
        gateEl.style.color = '#22c55e';
      }
    }

    if (barrier) {
      barrier.classList.toggle('is-open', isGateOpen);
    }
  }

  function vehicleArrive() {
    const occupiedCount = slots.filter(Boolean).length;
    if (occupiedCount >= TOTAL_SLOTS) {
      logMsg('⚠️ ALERT: Parking is FULL! Entry gate locked & buzzer ringing.');
      updateStats();
      return;
    }

    // Find first vacant slot
    const vacantIdx = slots.findIndex(s => !s);
    if (vacantIdx !== -1) {
      const plate = SAMPLE_PLATES[Math.floor(Math.random() * SAMPLE_PLATES.length)];
      const scannerEl = document.getElementById('plateScanner');
      if (scannerEl) scannerEl.innerHTML = `Plate: <strong>${plate}</strong>`;

      isGateOpen = true;
      updateStats();
      logMsg(`🚙 Vehicle [${plate}] detected. Gate opened. Allocating Slot #${vacantIdx + 1}...`);

      setTimeout(() => {
        slots[vacantIdx] = true;
        isGateOpen = false;
        renderSlots();
        logMsg(`✅ Vehicle parked in Slot #${vacantIdx + 1}. Gate lowered.`);
      }, 1200);
    }
  }

  function vehicleLeave() {
    const occupiedIdxs = slots.map((s, i) => s ? i : -1).filter(i => i !== -1);
    if (occupiedIdxs.length === 0) {
      logMsg('Parking lot is already completely vacant.');
      return;
    }

    const leaveIdx = occupiedIdxs[Math.floor(Math.random() * occupiedIdxs.length)];
    slots[leaveIdx] = false;
    renderSlots();
    logMsg(`🚗 Vehicle departed Slot #${leaveIdx + 1}. Slot is now Vacant.`);
  }

  function toggleGate() {
    isGateOpen = !isGateOpen;
    logMsg(`Manual override: Gate barrier set to ${isGateOpen ? 'OPEN' : 'CLOSED'}.`);
    updateStats();
  }

  function logMsg(msg) {
    const logEl = document.getElementById('parkingLogBar');
    if (logEl) {
      logEl.textContent = `🟢 [Sensor Telemetry] ${msg}`;
    }
  }

  function reset() {
    slots = [true, false, true, false, false, true, false, true];
    isGateOpen = false;
    isBuzzerActive = false;
    renderSlots();
    logMsg('Parking lot system reset to default initial state.');
  }

  function init() {
    const btnArrive = document.getElementById('btnCarArrive');
    const btnLeave = document.getElementById('btnCarLeave');
    const btnGate = document.getElementById('btnToggleGate');
    const btnReset = document.getElementById('btnResetParking');

    if (btnArrive) btnArrive.addEventListener('click', vehicleArrive);
    if (btnLeave) btnLeave.addEventListener('click', vehicleLeave);
    if (btnGate) btnGate.addEventListener('click', toggleGate);
    if (btnReset) btnReset.addEventListener('click', reset);

    renderSlots();
  }

  return { init, reset };
})();

// --- 4. DEMO 3: INTERACTIVE 2D SNAKE GAME ENGINE ---
const SnakeGameEngine = (function () {
  let canvas, ctx;
  let snake = [];
  let food = { x: 10, y: 10 };
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let gridCountX = 22, gridCountY = 16;
  let gridSize = 20;
  let score = 0, highScore = 14;
  let gameInterval = null;
  let isRunning = false;
  let speedMs = 110;

  function init() {
    canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    const startBtn = document.getElementById('btnStartSnake');
    const restartBtn = document.getElementById('btnRestartSnake');
    const diffSelect = document.getElementById('snakeDifficulty');

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', startGame);

    if (diffSelect) {
      diffSelect.addEventListener('change', () => {
        const val = diffSelect.value;
        speedMs = val === 'easy' ? 140 : val === 'hard' ? 75 : 110;
        const lbl = document.getElementById('snakeSpeedLbl');
        if (lbl) lbl.textContent = val.toUpperCase();
        if (isRunning) {
          clearInterval(gameInterval);
          gameInterval = setInterval(gameLoop, speedMs);
        }
      });
    }

    // Keyboard controls
    window.addEventListener('keydown', e => {
      if (!isRunning) return;
      if (['ArrowUp', 'KeyW'].includes(e.code) && dir.y === 0) nextDir = { x: 0, y: -1 };
      else if (['ArrowDown', 'KeyS'].includes(e.code) && dir.y === 0) nextDir = { x: 0, y: 1 };
      else if (['ArrowLeft', 'KeyA'].includes(e.code) && dir.x === 0) nextDir = { x: -1, y: 0 };
      else if (['ArrowRight', 'KeyD'].includes(e.code) && dir.x === 0) nextDir = { x: 1, y: 0 };
    });

    // D-Pad buttons
    const dUp = document.getElementById('dpadUp');
    const dDown = document.getElementById('dpadDown');
    const dLeft = document.getElementById('dpadLeft');
    const dRight = document.getElementById('dpadRight');

    if (dUp) dUp.addEventListener('click', () => { if (dir.y === 0) nextDir = { x: 0, y: -1 }; });
    if (dDown) dDown.addEventListener('click', () => { if (dir.y === 0) nextDir = { x: 0, y: 1 }; });
    if (dLeft) dLeft.addEventListener('click', () => { if (dir.x === 0) nextDir = { x: -1, y: 0 }; });
    if (dRight) dRight.addEventListener('click', () => { if (dir.x === 0) nextDir = { x: 1, y: 0 }; });

    drawStaticBoard();
  }

  function startGame() {
    const overlay = document.getElementById('snakeOverlayMsg');
    if (overlay) overlay.style.display = 'none';

    snake = [
      { x: 6, y: 8 },
      { x: 5, y: 8 },
      { x: 4, y: 8 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    updateScoreUI();
    spawnFood();

    isRunning = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speedMs);
  }

  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * (gridCountX - 2)) + 1,
      y: Math.floor(Math.random() * (gridCountY - 2)) + 1
    };
  }

  function gameLoop() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall Collision Check
    if (head.x < 0 || head.x >= gridCountX || head.y < 0 || head.y >= gridCountY) {
      gameOver('Wall Collision!');
      return;
    }

    // Body Collision Check
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        gameOver('Self Collision!');
        return;
      }
    }

    snake.unshift(head);

    // Food Eaten Check
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      if (score > highScore) highScore = score;
      updateScoreUI();
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function gameOver(reason) {
    isRunning = false;
    clearInterval(gameInterval);
    const overlay = document.getElementById('snakeOverlayMsg');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.innerHTML = `
        <div class="som-title" style="color:#ef4444;">GAME OVER</div>
        <p>${reason} Your Score: <strong>${score}</strong></p>
        <button class="btn btn-primary btn-sm" id="btnRestartSnakeModal">Play Again 🔄</button>
      `;
      const rBtn = document.getElementById('btnRestartSnakeModal');
      if (rBtn) rBtn.addEventListener('click', startGame);
    }
  }

  function updateScoreUI() {
    const sEl = document.getElementById('snakeScore');
    const hsEl = document.getElementById('snakeHighScore');
    if (sEl) sEl.textContent = score;
    if (hsEl) hsEl.textContent = highScore;
  }

  function draw() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#04030c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ec4899';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, idx) => {
      ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
      if (idx === 0) {
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.roundRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2, 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function drawStaticBoard() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#04030c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function reset() {
    startGame();
  }

  return { init, reset };
})();

// --- 5. DEMO 4: RURALASSIST AI ADVISOR ---
const RuralAssistAdvisor = (function () {
  const KNOWLEDGE_BASE = {
    fertilizer: 'For wheat crops in rabi season, apply NPK (120:60:40 kg/ha) balanced with organic compost, vermicompost, and neem-coated urea to enhance soil nitrogen retention and root strength.',
    disease: 'Early mustard leaf spot (Alternaria blight) shows small brown circular spots. Spray Mancozeb (0.2%) or apply bio-pesticide neem seed kernel extract (NSKE 5%) during morning hours.',
    irrigation: 'Drip irrigation delivers water directly to root zones with 90%+ efficiency, saving up to 50% groundwater compared to flood irrigation. Solar-powered micro-drip setups qualify for central subsidy.',
    subsidy: 'Under the PM Fasal Bima Yojana (PMFBY), farmers pay only a 1.5% premium for rabi crops and 2% for kharif. You can register via your local Common Service Center (CSC) or state agriculture portal with Aadhaar and land records.',
    general: 'RuralAssist AI uses natural language processing to answer agricultural inquiries, mandi prices, soil health tips, and government subsidy procedures for rural development.'
  };

  function addMessage(sender, text) {
    const container = document.getElementById('ruralMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = `
      <span class="msg-avatar">${sender === 'user' ? '👤' : '🌾'}</span>
      <div class="msg-content">
        <strong>${sender === 'user' ? 'You' : 'RuralAssist AI'}:</strong> ${text}
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function handleQuery(query) {
    if (!query || query.trim() === '') return;
    addMessage('user', query);

    const q = query.toLowerCase();
    let reply = KNOWLEDGE_BASE.general;
    if (q.includes('fertilizer') || q.includes('wheat') || q.includes('npk')) reply = KNOWLEDGE_BASE.fertilizer;
    else if (q.includes('disease') || q.includes('mustard') || q.includes('leaf') || q.includes('pest')) reply = KNOWLEDGE_BASE.disease;
    else if (q.includes('irrigation') || q.includes('water') || q.includes('drip')) reply = KNOWLEDGE_BASE.irrigation;
    else if (q.includes('subsidy') || q.includes('fasal') || q.includes('bima') || q.includes('scheme') || q.includes('government')) reply = KNOWLEDGE_BASE.subsidy;

    setTimeout(() => {
      addMessage('assistant', reply);
    }, 600);
  }

  function init() {
    const input = document.getElementById('ruralInput');
    const sendBtn = document.getElementById('btnSendRural');
    const chips = document.querySelectorAll('.rural-chip');

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => {
        handleQuery(input.value);
        input.value = '';
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          handleQuery(input.value);
          input.value = '';
        }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-q');
        if (q) handleQuery(q);
      });
    });
  }

  function reset() {
    const container = document.getElementById('ruralMessages');
    if (container) {
      container.innerHTML = `
        <div class="chat-msg assistant">
          <span class="msg-avatar">🌾</span>
          <div class="msg-content">
            <strong>RuralAssist AI:</strong> Namaste! How can I assist your farming or community today? Try one of the quick queries below!
          </div>
        </div>
      `;
    }
  }

  return { init, reset };
})();

// --- CERTIFICATE VIEWER MODAL CONTROLLER ---
const CertViewerController = (function() {
  const certData = {
    'cert-infosys-ai': {
      title: 'Introduction to Artificial Intelligence',
      certType: 'COURSE COMPLETION CERTIFICATE',
      issuer: 'Infosys Limited • Springboard',
      logoHtml: '<span style="color:#0284c7; font-weight:900; font-size:1.4rem;">Infosys</span> <span style="font-size:0.85rem; color:#475569; font-weight:700; margin-left:4px;">Springboard</span>',
      recipient: 'Mani Raj',
      badge: '🤖 Artificial Intelligence',
      badgeClass: 'badge-purple',
      date: '25th March 2026',
      dateFull: 'Issued on: Wednesday, March 25, 2026',
      id: 'INFOSYS-AI-SPRINGBOARD-2026',
      pdfUrl: 'certificates/cert_infosys_ai.pdf',
      desc: 'Awarded for successfully completing the Introduction to Artificial Intelligence course on Infosys Springboard, demonstrating mastery of fundamental AI concepts, cognitive technologies, and machine intelligence.',
      sig1: { name: 'Satheesha B. Nanjappa', role: 'Senior Vice President & Head Education, Infosys', script: 'Satheesha B. N.' },
      sig2: { name: 'Springboard Authority', role: 'Training & Assessment, Infosys Limited', script: 'Infosys Springboard' }
    },
    'cert-blockseblock-ai': {
      title: 'Hands-on Bootcamp on Artificial Intelligence',
      certType: 'CERTIFICATE OF ACHIEVEMENT',
      issuer: 'BlockseBlock & OpenxAI',
      logoHtml: '<span style="font-weight:900; color:#0f172a; font-size:1.2rem;">⚡ BlockseBlock</span> <span style="color:#0ea5e9; font-weight:800; margin-left:8px; font-size:1.1rem;">❄️ OpenxAI</span>',
      recipient: 'Mani Raj',
      badge: '🧠 AI & Neural Tech',
      badgeClass: 'badge-purple',
      date: '28th August 2025',
      dateFull: 'Date: 28th August 2025 • National Bootcamp',
      id: 'BSB-OPENXAI-AI-2025',
      pdfUrl: 'certificates/cert_blockseblock_ai.pdf',
      desc: 'Awarded for the successful completion of the Hands-on Bootcamp on Artificial Intelligence, demonstrating applied learning, neural model workflows, and professional engineering excellence.',
      sig1: { name: 'Sahil Thakur', role: 'Founder • BlockseBlock', script: 'Sahil Thakur' },
      sig2: { name: 'Rupin Mathur', role: 'OpenxAI India Lead', script: 'Rupin Mathur' }
    },
    'cert-lpu-innotek': {
      title: 'Innotek\'2026: Annual Innovation Expo',
      certType: 'CERTIFICATE OF PARTICIPATION',
      issuer: 'Lovely Professional University (Student Welfare Wing)',
      logoHtml: '<span style="color:#ea580c; font-weight:900; font-size:1.2rem;">🏛 LPU</span> <span style="font-size:0.8rem; color:#475569; font-weight:800; margin-left:4px;">STUDENT WELFARE WING</span>',
      recipient: 'Mr. Mani Raj',
      badge: '🏅 Innovation & Tech',
      badgeClass: 'badge-amber',
      date: '21-04-2026 to 22-04-2026',
      dateFull: 'Registration No: 12514687 • Certificate No: 488768 • Issued: 28-07-2026',
      id: 'LPU-INNOTEK-488768-REG12514687',
      pdfUrl: 'certificates/cert_lpu_innotek.pdf',
      desc: 'Awarded for participating in the Computer Science Category at Innotek\'2026: Annual Innovation Expo, organized by the Department of Student Research and Project under the aegis of Student Welfare Wing, Lovely Professional University.',
      sig1: { name: 'Mr. Mandeep Singh', role: 'Organizing Secretary • LPU', script: 'Mandeep Singh' },
      sig2: { name: 'Dr. Sorabh Lakhanpal', role: 'Executive Dean, Student Welfare Wing, LPU', script: 'Dr. Sorabh Lakhanpal' }
    },
    'cert-optimus-algonhunt': {
      title: 'ALGO-N-HUNT Competitive Coding & Gaming Marathon',
      certType: 'CERTIFICATE OF PARTICIPATION',
      issuer: 'Student Organization OPTIMUS & Lovely Professional University',
      logoHtml: '<span style="color:#0284c7; font-weight:900; font-size:1.3rem;">⚙️ OPTIMUS</span> <span style="font-size:0.8rem; color:#64748b; font-weight:700;">STUDENT ORG</span>',
      recipient: 'Mani Raj',
      badge: '🌐 Algorithmic DSA',
      badgeClass: 'badge-amber',
      date: '22nd November 2025',
      dateFull: 'Date: 22nd November 2025 • Lovely Professional University',
      id: 'OPTIMUS-ALGONHUNT-2025-LPU',
      pdfUrl: 'certificates/cert_optimus_algonhunt.pdf',
      desc: 'Awarded in recognition of active participation in "ALGO-N-HUNT", a Competitive Coding, Puzzle & Gaming Marathon conducted by Student Organization OPTIMUS, demonstrating commitment, analytical thinking, teamwork, and problem-solving excellence.',
      sig1: { name: 'Mrs. Poonam Bala', role: 'Faculty Facilitator • LPU', script: 'Poonam Bala' },
      sig2: { name: 'Charchit Singh', role: 'CEO, OPTIMUS', script: 'Charchit Singh' }
    },
    'cert-python-ds': {
      title: 'Advance Your Python Skills for Data Science',
      certType: 'CERTIFICATE OF COMPLETION',
      issuer: 'LinkedIn Learning',
      logoHtml: '<span style="color:#0a66c2; font-weight:900; font-size:1.3rem;">Linked<span style="background:#0a66c2; color:#fff; border-radius:3px; padding:0 3px; margin-left:2px;">in</span></span> <span style="font-weight:700; color:#334155; font-size:1.1rem;">Learning</span>',
      recipient: 'Mani Raj',
      badge: '🐍 Python & Data Science',
      badgeClass: 'badge-purple',
      date: '15th December 2025',
      dateFull: 'Dec 15, 2025 at 04:18PM UTC • Duration: 22h 26m',
      id: '64373a72da4d09b223339974ef4ab43347881ad893feb75e945b224f7d801c2e',
      pdfUrl: 'certificates/cert_python_ds.pdf',
      desc: 'Official certificate for successfully completing the Advance Your Python Skills for Data Science learning path covering Data Analysis, Big Data Analytics, Python programming, and analytical pipelines.',
      sig1: { name: 'Shea Hanson', role: 'Head of Learning Content Strategy', script: 'Shea Hanson' },
      sig2: { name: 'LinkedIn Authority', role: 'Academic Verification Lead', script: 'LinkedIn Learning' }
    },
    'cert-iamneo-prog': {
      title: 'Computer Programming (150 Hours)',
      certType: 'CERTIFICATE OF APPRECIATION',
      issuer: 'iamneo — An NIIT Venture & Lovely Professional University',
      logoHtml: '<span style="color:#ef4444; font-size:1.4rem;">●</span> <span style="font-weight:900; color:#0f172a; font-size:1.2rem;">iam<span style="color:#ef4444;">neo</span></span> <span style="font-size:0.75rem; color:#64748b; font-weight:600; margin-left:6px;">An NIIT Venture</span>',
      recipient: 'Mani Raj',
      badge: '💻 Computer Programming',
      badgeClass: 'badge-blue',
      date: '21st May 2026',
      dateFull: 'Course Duration: 18-Jan-2026 to 20-May-2026 • 150 Hours',
      id: '24cL60M8Dj3Dk3DI3Bm1',
      pdfUrl: 'certificates/cert_iamneo_prog.pdf',
      desc: 'Official Certificate of Appreciation for demonstrating strong commitment, consistency, and programming excellence throughout 150 hours of intensive computer programming and DSA algorithms.',
      sig1: { name: 'Senthikumar TP', role: 'Program Director • iamneo', script: 'Senthikumar TP' },
      sig2: { name: 'LPU Authority', role: 'Dean of Computer Engineering', script: 'Lovely Prof. Univ' }
    },
    'cert-hack-node': {
      title: 'Hack Node India National Hackathon',
      certType: 'CERTIFICATE OF PARTICIPATION',
      issuer: 'BlockseBlock & Web3 Sabha',
      logoHtml: '<span style="font-weight:900; color:#0f172a; font-size:1.15rem;">⚡ BlockseBlock</span> <span style="color:#6366f1; font-weight:800; margin-left:8px; font-size:0.85rem;">WEB3 SABHA</span>',
      recipient: 'Mani Raj',
      badge: '⚡ Web3 & Hackathon',
      badgeClass: 'badge-cyan',
      date: 'August 2025',
      dateFull: 'National Hackathon • BlockseBlock Prototype Edition',
      id: 'BSB-683I5R-MEZPI2OX',
      pdfUrl: 'certificates/cert_hack_node.pdf',
      desc: 'Official Certificate of Participation for successfully attending and engineering innovative web & Web3 software solutions under fast-paced hackathon sprint conditions.',
      sig1: { name: 'Sahil Thakur', role: 'Founder • BlockseBlock', script: 'Sahil Thakur' },
      sig2: { name: 'Rupin Mathur', role: 'OpenxAI India Lead', script: 'Rupin Mathur' }
    },
    'cert-time-mgmt': {
      title: 'Time Management Tips Course Certification',
      certType: 'COURSE COMPLETION CERTIFICATE',
      issuer: 'LinkedIn Learning',
      logoHtml: '<span style="color:#0a66c2; font-weight:900; font-size:1.3rem;">Linked<span style="background:#0a66c2; color:#fff; border-radius:3px; padding:0 3px; margin-left:2px;">in</span></span> <span style="font-weight:700; color:#334155; font-size:1.1rem;">Learning</span>',
      recipient: 'Mani Raj',
      badge: '⏱️ Productivity & Workflow',
      badgeClass: 'badge-emerald',
      date: '2nd November 2025',
      dateFull: 'Nov 02, 2025 at 09:10AM UTC • Duration: 7h 51m',
      id: '7ca3cd5f42d9abebb58b6f700c037ef004c6e720b2ad0c1ca1633bb442670b52',
      pdfUrl: 'certificates/cert_time_mgmt.pdf',
      desc: 'Official LinkedIn Learning credential validating mastery of high-impact productivity systems, priority planning, deep-work scheduling, and workflow optimization.',
      sig1: { name: 'Shea Hanson', role: 'Head of Learning Content Strategy', script: 'Shea Hanson' },
      sig2: { name: 'LinkedIn Authority', role: 'Professional Skills Board', script: 'LinkedIn Learning' }
    },
    'cert-ngo-lead': {
      title: 'Certificate of Internship — Community Development',
      certType: 'CERTIFICATE OF INTERNSHIP',
      issuer: 'Being Helper Foundation • Patna, Bihar',
      logoHtml: '<span style="color:#0284c7; font-weight:900; font-size:1.3rem;">🤝 Being Helper</span> <span style="font-size:0.8rem; color:#1e3a8a; font-weight:800; margin-left:4px;">FOUNDATION</span>',
      recipient: 'Mani Raj (Reg No: 12514687)',
      badge: '🤝 Community Development & Social Work',
      badgeClass: 'badge-emerald',
      date: '26th June 2026 to 28th July 2026',
      dateFull: 'Issued: 01-08-2026 • Reg No: U85300BR2021NPL050486 • Grade: A+',
      id: 'BHF-INTERN-PATNA-12514687-2026',
      pdfUrl: 'certificates/cert_being_helper_internship.pdf',
      desc: 'Awarded Grade A+ for successfully completing the 30-Hour Internship under the Community Development Project organized by Being Helper Foundation, Patna (Reg. No: U85300BR2021NPL050486, registered under NITI Aayog, MSME, NGO Darpan & MCA, Govt. of India), demonstrating exceptional commitment to social responsibility, community welfare, and field leadership.',
      sig1: { name: 'Subham Kumar', role: 'Founder & Director • Being Helper Foundation', script: 'Subham Kumar' },
      sig2: { name: 'Muskan Kumari', role: 'Director • Being Helper Foundation', script: 'Muskan Kumari' }
    }
  };

  function init() {
    const modal = document.getElementById('certViewerModal');
    const backdrop = document.getElementById('cvmBackdrop');
    const closeBtn = document.getElementById('cvmCloseBtn');
    const sheetMount = document.getElementById('cvmCertSheetMount');
    const footerMount = document.getElementById('cvmMetaFooter');

    if (!modal) return;

    function openModal(certId) {
      const data = certData[certId] || certData['cert-python-ds'];

      // SVG Ribbon Geometry
      const cornerSvgTL = `
        <svg class="sheet-corner-tl" viewBox="0 0 100 100" fill="none">
          <polygon points="0,0 100,0 0,100" fill="#0f172a" />
          <polygon points="0,0 70,0 0,70" fill="#ca8a04" />
          <polygon points="0,0 45,0 0,45" fill="#fde047" />
          <line x1="0" y1="85" x2="85" y2="0" stroke="#f59e0b" stroke-width="2" />
        </svg>
      `;

      const cornerSvgBR = `
        <svg class="sheet-corner-br" viewBox="0 0 100 100" fill="none">
          <polygon points="100,100 0,100 100,0" fill="#0f172a" />
          <polygon points="100,100 30,100 100,30" fill="#ca8a04" />
          <polygon points="100,100 55,100 100,55" fill="#fde047" />
          <line x1="15" y1="100" x2="100" y2="15" stroke="#f59e0b" stroke-width="2" />
        </svg>
      `;

      const certSheetHtml = `
        <div class="official-cert-sheet" id="printCertSheet">
          ${cornerSvgTL}
          ${cornerSvgBR}

          <div class="sheet-top-row">
            <div class="sheet-brand-box">
              ${data.logoHtml}
            </div>
            <div class="sheet-seal-rosette">
              <span>2026</span>
              <span style="font-size: 0.5rem; letter-spacing: 0.5px;">AWARD</span>
              <span>★</span>
            </div>
          </div>

          <div class="sheet-title-main">CERTIFICATE</div>
          <div class="sheet-title-sub">${data.certType.replace('CERTIFICATE ', '')}</div>

          <div class="sheet-presented-to">PROUDLY PRESENTED TO</div>
          <div class="sheet-recipient-name">${data.recipient}</div>

          <div class="sheet-body-text">${data.desc}</div>
          <div class="sheet-date-line">Date: ${data.date}</div>

          <div class="sheet-signatures-row">
            <div class="sig-block">
              <div class="sig-script">${data.sig1.script}</div>
              <div class="sig-line"></div>
              <div class="sig-name">${data.sig1.name}</div>
              <div class="sig-role">${data.sig1.role}</div>
            </div>
            <div class="sig-block">
              <div class="sig-script">${data.sig2.script}</div>
              <div class="sig-line"></div>
              <div class="sig-name">${data.sig2.name}</div>
              <div class="sig-role">${data.sig2.role}</div>
            </div>
          </div>
        </div>
      `;

      let topContentHtml = '';

      if (data.pdfUrl) {
        topContentHtml = `
          <div class="cvm-view-tabs">
            <button class="cvm-tab-btn active" id="tabPdfView">📄 Official PDF Document</button>
            <button class="cvm-tab-btn" id="tabCanvasView">🎨 Certificate Award Sheet</button>
          </div>
          <div id="cvmViewContainer">
            <div class="pdf-viewer-frame-container" id="pdfEmbedBox">
              <iframe src="${data.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1" class="official-pdf-embed"></iframe>
            </div>
            <div id="canvasSheetBox" style="display: none;">
              ${certSheetHtml}
            </div>
          </div>
        `;
      } else {
        topContentHtml = certSheetHtml;
      }

      sheetMount.innerHTML = topContentHtml;

      // Tab Switcher Logic
      if (data.pdfUrl) {
        const tabPdf = document.getElementById('tabPdfView');
        const tabCanvas = document.getElementById('tabCanvasView');
        const pdfBox = document.getElementById('pdfEmbedBox');
        const canvasBox = document.getElementById('canvasSheetBox');

        if (tabPdf && tabCanvas) {
          tabPdf.addEventListener('click', () => {
            tabPdf.classList.add('active');
            tabCanvas.classList.remove('active');
            pdfBox.style.display = 'block';
            canvasBox.style.display = 'none';
          });
          tabCanvas.addEventListener('click', () => {
            tabCanvas.classList.add('active');
            tabPdf.classList.remove('active');
            pdfBox.style.display = 'none';
            canvasBox.style.display = 'block';
          });
        }
      }

      // Render Bottom Metadata Footer
      const pdfActionBtn = data.pdfUrl 
        ? `<a href="${data.pdfUrl}" target="_blank" class="btn-pdf-download">
             <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             Open Original PDF
           </a>`
        : `<button class="btn-pdf-download" id="btnPrintCert">
             <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             Download / Print Sheet
           </button>`;

      footerMount.innerHTML = `
        <div class="cvm-meta-top">
          <span class="cvm-meta-badge ${data.badgeClass}">${data.badge}</span>
          <span class="cvm-meta-date">${data.date}</span>
        </div>
        <div class="cvm-meta-title">${data.title}</div>
        <div class="cvm-meta-issuer">${data.issuer}</div>
        <p class="cvm-meta-desc">${data.desc}</p>
        <div class="cvm-meta-actions">
          ${pdfActionBtn}
          <button class="btn-copy-cred-id" id="btnModalCopyId" data-id="${data.id}">
            📋 ID: ${data.id.substring(0, 18)}...
          </button>
        </div>
      `;

      // Print handler fallback
      const btnPrint = document.getElementById('btnPrintCert');
      if (btnPrint) {
        btnPrint.addEventListener('click', () => {
          window.print();
        });
      }

      // Copy ID handler
      const btnCopy = document.getElementById('btnModalCopyId');
      if (btnCopy) {
        btnCopy.addEventListener('click', () => {
          navigator.clipboard.writeText(data.id).then(() => {
            btnCopy.textContent = '✅ Credential ID Copied!';
            setTimeout(() => {
              btnCopy.textContent = `📋 ID: ${data.id.substring(0, 18)}...`;
            }, 2500);
          });
        });
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Attach click triggers on preview buttons
    document.querySelectorAll('.btn-preview-modal, .btn-action-view, .btn-action-verify').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const certId = btn.getAttribute('data-cert');
        openModal(certId);
      });
    });

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  return { init };
})();

// Expose globals for console controller hooks
window.FakeBusterStudio = FakeBusterStudio;
window.ParkingSimulator = ParkingSimulator;
window.SnakeGameEngine = SnakeGameEngine;
window.RuralAssistAdvisor = RuralAssistAdvisor;
window.CertViewerController = CertViewerController;

// Initialize Subsystems
document.addEventListener('DOMContentLoaded', () => {
  LiveDemoConsole.init();
  FakeBusterStudio.init();
  ParkingSimulator.init();
  SnakeGameEngine.init();
  RuralAssistAdvisor.init();
  CertViewerController.init();
});
