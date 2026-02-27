/* ============================================================
   KIRA VOSS — V7 Portfolio
   Game-UI RPG Menu — Interactions & Animations
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------
     BOOT SCREEN
     ------------------------------------------------------- */
  const bootScreen = document.getElementById('boot-screen');

  function runBootSequence() {
    const lines = bootScreen.querySelectorAll('.boot-line');
    const progressWrap = bootScreen.querySelector('.boot-progress-wrap');
    const progressBar = bootScreen.querySelector('.boot-progress-bar');

    lines.forEach((line) => {
      const delay = parseInt(line.dataset.delay, 10) || 0;
      setTimeout(() => line.classList.add('visible'), delay);
    });

    if (progressWrap) {
      const wrapDelay = parseInt(progressWrap.dataset.delay, 10) || 800;
      setTimeout(() => {
        progressWrap.classList.add('visible');
        setTimeout(() => progressBar.classList.add('filling'), 50);
      }, wrapDelay);
    }
  }

  function dismissBoot() {
    bootScreen.classList.add('dismissed');
    document.body.classList.add('loaded');
    setTimeout(() => {
      bootScreen.style.display = 'none';
      initMainAnimations();
    }, 600);
    triggerAchievement('Welcome, Player');
  }

  if (prefersReducedMotion) {
    bootScreen.style.display = 'none';
    document.body.classList.add('loaded');
    window.addEventListener('DOMContentLoaded', initMainAnimations);
  } else {
    runBootSequence();
    // Dismiss on any key or click (after prompt appears)
    let bootDismissable = false;
    setTimeout(() => { bootDismissable = true; }, 2400);
    const handleBootDismiss = () => {
      if (!bootDismissable) return;
      dismissBoot();
      document.removeEventListener('keydown', handleBootDismiss);
      document.removeEventListener('click', handleBootDismiss);
    };
    document.addEventListener('keydown', handleBootDismiss);
    document.addEventListener('click', handleBootDismiss);

    // Auto-dismiss after 5s if no interaction
    setTimeout(() => {
      if (!bootScreen.classList.contains('dismissed')) {
        dismissBoot();
        document.removeEventListener('keydown', handleBootDismiss);
        document.removeEventListener('click', handleBootDismiss);
      }
    }, 5000);
  }

  /* -------------------------------------------------------
     CUSTOM CURSOR
     ------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  let cursorX = 0, cursorY = 0;
  let targetX = 0, targetY = 0;

  if (cursor && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    // Hover state on interactive elements
    const hoverTargets = 'a, button, .skill-node, .game-card, .contact-link, .trait, .tool-item, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    function animateCursor() {
      cursorX += (targetX - cursorX) * 0.15;
      cursorY += (targetY - cursorY) * 0.15;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* -------------------------------------------------------
     LENIS SMOOTH SCROLL
     ------------------------------------------------------- */
  let lenis;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* -------------------------------------------------------
     SPLITTING.JS — TEXT SPLIT
     ------------------------------------------------------- */
  if (typeof Splitting !== 'undefined') {
    Splitting();
  }

  /* -------------------------------------------------------
     GSAP + SCROLLTRIGGER — MAIN ANIMATIONS
     ------------------------------------------------------- */
  gsap.registerPlugin(ScrollTrigger);

  function initMainAnimations() {
    if (prefersReducedMotion) {
      // Just make everything visible
      document.querySelectorAll('.char').forEach((c) => {
        c.style.opacity = 1;
        c.style.transform = 'none';
      });
      document.querySelectorAll('.hero-stat, .about-text, .game-card, .timeline-entry, .mini-stat').forEach((el) => {
        el.classList.add('in-view');
      });
      document.querySelectorAll('.stat-bar').forEach((bar) => {
        bar.classList.add('in-view');
        bar.style.setProperty('--level', bar.dataset.level);
      });
      document.querySelectorAll('.section-title').forEach((t) => t.classList.add('in-view'));
      return;
    }

    // --- Hero entrance ---
    const heroTl = gsap.timeline({ delay: 0.2 });

    const heroSubChars = document.querySelectorAll('.hero-subtitle .char');
    const heroTitleChars = document.querySelectorAll('.hero-title .char');
    const heroTagChars = document.querySelectorAll('.hero-tagline .char');

    heroTl
      .to(heroSubChars, {
        opacity: 1,
        duration: 0.04,
        stagger: 0.04,
        ease: 'none',
      })
      .to(heroTitleChars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
      }, '-=0.2')
      .to(heroTagChars, {
        opacity: 1,
        duration: 0.03,
        stagger: 0.02,
        ease: 'none',
      }, '-=0.3')
      .add(() => {
        document.querySelectorAll('.hero-stat').forEach((s, i) => {
          setTimeout(() => s.classList.add('in-view'), i * 100);
        });
      }, '-=0.1');

    // --- Section title reveals ---
    document.querySelectorAll('.section-title').forEach((title) => {
      ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        once: true,
        onEnter: () => title.classList.add('in-view'),
      });
    });

    // --- About text reveals ---
    document.querySelectorAll('.about-text').forEach((p, i) => {
      ScrollTrigger.create({
        trigger: p,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          setTimeout(() => p.classList.add('in-view'), i * 120);
        },
      });
    });

    // --- Mini stat bars ---
    document.querySelectorAll('.mini-stat').forEach((stat) => {
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        once: true,
        onEnter: () => stat.classList.add('in-view'),
      });
    });

    // --- Game cards ---
    document.querySelectorAll('.game-card').forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: (i % 3) * 0.1,
            ease: 'power2.out',
            onComplete: () => card.classList.add('in-view'),
          });
        },
      });
    });

    // --- Stat bars (skills) ---
    document.querySelectorAll('.stat-bar').forEach((bar) => {
      const level = bar.dataset.level;
      bar.style.setProperty('--level', level);
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => bar.classList.add('in-view'),
      });
    });

    // --- Timeline entries ---
    document.querySelectorAll('.timeline-entry').forEach((entry, i) => {
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          setTimeout(() => entry.classList.add('in-view'), i * 80);
        },
      });
    });

    // --- Parallax pixel decorations ---
    document.querySelectorAll('.pixel-deco').forEach((deco) => {
      gsap.to(deco, {
        y: -80,
        scrollTrigger: {
          trigger: '.section--hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // --- Hero background grid parallax ---
    gsap.to('.hero-bg-grid', {
      y: 120,
      scrollTrigger: {
        trigger: '.section--hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  /* -------------------------------------------------------
     HUD UPDATES (scroll %, section label, FPS)
     ------------------------------------------------------- */
  const scrollPctEl = document.getElementById('scroll-pct');
  const sectionLabelEl = document.getElementById('current-section-label');
  const xpFill = document.getElementById('xp-bar-fill');
  const xpLevel = document.getElementById('xp-level');
  const fpsCounter = document.getElementById('fps-counter');

  const sectionNames = {
    hero: 'TITLE_SCREEN',
    about: 'CHARACTER_BIO',
    games: 'INVENTORY',
    skills: 'SKILL_TREE',
    timeline: 'QUEST_LOG',
    contact: 'SAVE_POINT',
  };

  // Scroll progress
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    if (scrollPctEl) scrollPctEl.textContent = pct;
    if (xpFill) xpFill.style.width = pct + '%';

    // Level based on scroll
    const level = Math.floor(pct / 20) + 1;
    if (xpLevel) xpLevel.textContent = Math.min(level, 5);
  });

  // Active section observer
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (sectionLabelEl && sectionNames[id]) {
            sectionLabelEl.textContent = sectionNames[id];
          }
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // FPS counter
  let lastTime = performance.now();
  let frameCount = 0;

  function updateFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsCounter) fpsCounter.textContent = frameCount;
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(updateFPS);
  }
  requestAnimationFrame(updateFPS);

  /* -------------------------------------------------------
     ACHIEVEMENTS
     ------------------------------------------------------- */
  const achievementToast = document.getElementById('achievement-toast');
  const achievementName = document.getElementById('achievement-name');
  const unlockedAchievements = new Set();
  let achievementTimeout;

  function triggerAchievement(name) {
    if (unlockedAchievements.has(name)) return;
    unlockedAchievements.add(name);

    if (achievementName) achievementName.textContent = name;
    if (achievementToast) {
      achievementToast.classList.add('show');
      clearTimeout(achievementTimeout);
      achievementTimeout = setTimeout(() => {
        achievementToast.classList.remove('show');
      }, 3000);
    }
  }

  // Achievement: Scroll to bottom
  window.addEventListener('scroll', function checkScrollBottom() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTop >= docHeight - 50) {
      triggerAchievement('The Long Scroll');
      window.removeEventListener('scroll', checkScrollBottom);
    }
  });

  // Achievement: Click 3 skill nodes (+ keyboard activation)
  let skillClicks = 0;
  document.querySelectorAll('.skill-node').forEach((node) => {
    function activateNode() {
      skillClicks++;
      if (skillClicks >= 3) {
        triggerAchievement('Skill Inspector');
      }
    }
    node.addEventListener('click', activateNode);
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateNode();
      }
    });
  });

  // Achievement: Visit games section
  const gamesSection = document.getElementById('games');
  if (gamesSection) {
    const gamesObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerAchievement('Loot Viewer');
          gamesObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    gamesObserver.observe(gamesSection);
  }

  // Achievement: Submit form (prevent default, show achievement)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerAchievement('Message Sent!');
      contactForm.reset();
    });
  }

  /* -------------------------------------------------------
     KONAMI CODE EASTER EGG
     ------------------------------------------------------- */
  const konamiSequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a',
  ];
  let konamiIndex = 0;
  const konamiOverlay = document.getElementById('konami-overlay');
  const konamiClose = document.getElementById('konami-close');

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiOverlay.classList.add('active');
        triggerAchievement('Secret Ending');
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  if (konamiClose) {
    konamiClose.addEventListener('click', () => {
      konamiOverlay.classList.remove('active');
    });
  }

  /* -------------------------------------------------------
     KEYBOARD NAV (1-6 keys)
     ------------------------------------------------------- */
  const sectionIds = ['hero', 'about', 'games', 'skills', 'timeline', 'contact'];

  document.addEventListener('keydown', (e) => {
    // Only when not typing in form
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 6) {
      const target = document.getElementById(sectionIds[num - 1]);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });

  /* -------------------------------------------------------
     GAME CARD TILT EFFECT
     ------------------------------------------------------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.game-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------------
     SMOOTH NAV CLICK HANDLING
     ------------------------------------------------------- */
  document.querySelectorAll('.nav-link, .btn[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* -------------------------------------------------------
     HIDDEN INTERACTION: Triple-click hero title
     ------------------------------------------------------- */
  let heroClickCount = 0;
  let heroClickTimer;
  const heroTitle = document.querySelector('.hero-title');

  if (heroTitle) {
    heroTitle.addEventListener('click', () => {
      heroClickCount++;
      clearTimeout(heroClickTimer);
      heroClickTimer = setTimeout(() => { heroClickCount = 0; }, 600);

      if (heroClickCount >= 3) {
        triggerAchievement('Name Clicker');
        heroTitle.style.transition = 'filter 0.3s';
        heroTitle.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => { heroTitle.style.filter = ''; }, 2000);
        heroClickCount = 0;
      }
    });
  }

})();
