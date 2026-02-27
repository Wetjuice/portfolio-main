/* ============================================
   KAEL DRENNAN — SPACE SIMULATOR PORTFOLIO
   script.js
   ============================================ */

(function () {
  'use strict';

  // ——— REDUCED MOTION CHECK ———
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ——— LOADING SCREEN ———
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `
    <span class="loader__text">INITIALIZING SYSTEMS</span>
    <div class="loader__bar"><div class="loader__bar-fill"></div></div>
  `;
  document.body.prepend(loader);
  document.body.classList.add('loading');

  const loaderFill = loader.querySelector('.loader__bar-fill');
  let loadProgress = 0;

  function advanceLoader(target) {
    const interval = setInterval(() => {
      loadProgress += Math.random() * 8;
      if (loadProgress >= target) {
        loadProgress = target;
        clearInterval(interval);
      }
      loaderFill.style.width = loadProgress + '%';
    }, 50);
  }

  advanceLoader(70);

  // ——— STAR FIELD ———
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.min(Math.floor(window.innerWidth * window.innerHeight / 3000), 400);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: Math.floor(Math.random() * 3), // 0=far, 1=mid, 2=near
      });
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle nebula gradient
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.3, canvas.height * 0.4, 0,
      canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.6
    );
    gradient.addColorStop(0, 'rgba(0, 40, 80, 0.08)');
    gradient.addColorStop(0.5, 'rgba(10, 20, 50, 0.04)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Second nebula
    const gradient2 = ctx.createRadialGradient(
      canvas.width * 0.7, canvas.height * 0.7, 0,
      canvas.width * 0.7, canvas.height * 0.7, canvas.width * 0.4
    );
    gradient2.addColorStop(0, 'rgba(40, 10, 60, 0.06)');
    gradient2.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Parallax offsets from mouse
    const parallaxStrength = [0.005, 0.015, 0.03];

    for (const star of stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
      const alpha = star.opacity * twinkle;

      // Parallax based on layer
      const px = (mouseX - canvas.width / 2) * parallaxStrength[star.layer];
      const py = (mouseY - canvas.height / 2) * parallaxStrength[star.layer];

      const drawX = star.x + px;
      const drawY = star.y + py;

      ctx.beginPath();
      ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.layer === 2
        ? `rgba(0, 229, 255, ${alpha * 0.6})`
        : `rgba(200, 220, 255, ${alpha})`;
      ctx.fill();

      // Slight glow for larger stars
      if (star.size > 1.2) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = star.layer === 2
          ? `rgba(0, 229, 255, ${alpha * 0.06})`
          : `rgba(200, 220, 255, ${alpha * 0.04})`;
        ctx.fill();
      }
    }
  }

  let animFrameId;
  function animateStars(time) {
    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    drawStars(time);
    animFrameId = requestAnimationFrame(animateStars);
  }

  resizeCanvas();
  createStars();

  if (!prefersReducedMotion) {
    animFrameId = requestAnimationFrame(animateStars);
  } else {
    drawStars(0);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
    if (prefersReducedMotion) drawStars(0);
  });

  document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  // ——— CUSTOM CURSOR ———
  const cursorEl = document.querySelector('.cursor-reticle');
  let cursorX = 0;
  let cursorY = 0;
  let cursorTargetX = 0;
  let cursorTargetY = 0;

  if (cursorEl && !prefersReducedMotion && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorTargetX = e.clientX;
      cursorTargetY = e.clientY;
    });

    function updateCursor() {
      cursorX += (cursorTargetX - cursorX) * 0.15;
      cursorY += (cursorTargetY - cursorY) * 0.15;
      cursorEl.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover state on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .project-card, .skill-system, .principle-card, .channel-link, .tool-tag');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ——— INIT ON LOAD ———
  window.addEventListener('load', () => {
    advanceLoader(100);

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');

      setTimeout(() => {
        loader.remove();
        initAll();
      }, 600);
    }, 800);
  });

  function initAll() {
    initSplitting();
    initLenis();
    initGSAP();
    initTypewriters();
    initMobileNav();
    initNavHighlight();
    initCountUp();
  }

  // ——— SPLITTING.JS ———
  function initSplitting() {
    if (typeof Splitting !== 'undefined') {
      Splitting();
    }
  }

  // ——— LENIS SMOOTH SCROLL ———
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, { offset: -60 });
        }
      });
    });
  }

  // ——— GSAP + SCROLLTRIGGER ———
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Use Lenis' requestAnimationFrame for ScrollTrigger
    if (lenis) {
      gsap.ticker.lagSmoothing(0);
    }

    // ---- Scroll Progress Bar ----
    const progressBar = document.querySelector('.scroll-progress__bar');
    if (progressBar) {
      gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    }

    // ---- Hero Animations ----
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Title chars
    const heroChars = document.querySelectorAll('.hero__title-line--name .char');
    if (heroChars.length > 0) {
      heroTl.to(heroChars, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.8,
      }, 0.2);
    }

    // Role subtitle
    heroTl.to('.hero__title-line--role', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 0.6);

    // Subtitle text
    heroTl.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 0.8);

    // Stats
    heroTl.to('.hero__stats', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 1.0);

    // CTA
    heroTl.to('.hero__cta', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 1.2);

    // ---- Section Title Chars ----
    document.querySelectorAll('.section__title').forEach(title => {
      const chars = title.querySelectorAll('.char');
      if (chars.length === 0) return;

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // ---- About Section ----
    gsap.from('.about__portrait', {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__grid',
        start: 'top 80%',
      },
    });

    gsap.from('.about__bio-block', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__bio-block',
        start: 'top 85%',
      },
    });

    gsap.from('.meta-card', {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__meta-grid',
        start: 'top 85%',
      },
    });

    // ---- Project Cards ----
    document.querySelectorAll('.project-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    // ---- Skill Systems ----
    document.querySelectorAll('.skill-system').forEach(skill => {
      gsap.from(skill, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: skill,
          start: 'top 88%',
          onEnter: () => {
            // Animate skill bar
            const fill = skill.querySelector('.skill-system__bar-fill');
            if (fill) fill.classList.add('animated');
          },
        },
      });
    });

    // ---- Tool Tags ----
    gsap.from('.tool-tag', {
      opacity: 0,
      scale: 0.9,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills__tools-grid',
        start: 'top 90%',
      },
    });

    // ---- Timeline Entries ----
    document.querySelectorAll('.timeline__entry').forEach(entry => {
      gsap.from(entry, {
        opacity: 0,
        x: -30,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: entry,
          start: 'top 85%',
        },
      });
    });

    // ---- Timeline Line ----
    gsap.from('.timeline__line', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.timeline__track',
        start: 'top 80%',
      },
    });

    // ---- Philosophy ----
    gsap.from('.philosophy__quote', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.philosophy__quote',
        start: 'top 85%',
      },
    });

    document.querySelectorAll('.principle-card').forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
      });
    });

    // ---- Contact Terminal ----
    gsap.from('.contact__terminal', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact__terminal',
        start: 'top 85%',
      },
    });

    gsap.from('.channel-link', {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact__channels',
        start: 'top 88%',
      },
    });

    // ---- HUD Corners Parallax ----
    if (!prefersReducedMotion) {
      gsap.to('.hud-corner--tl', {
        y: -20,
        x: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hud-corner--br', {
        y: 20,
        x: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // ---- Fade out hero on scroll ----
    if (!prefersReducedMotion) {
      gsap.to('.hero__content', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: '60% top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  // ——— TYPEWRITER EFFECT ———
  function initTypewriters() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.typewriter[data-typewriter]').forEach(el => {
      const fullText = el.getAttribute('data-typewriter');
      el.textContent = '';
      let charIndex = 0;
      let started = false;

      function startTyping() {
        if (started) return;
        started = true;

        function typeChar() {
          if (charIndex < fullText.length) {
            el.textContent += fullText[charIndex];
            charIndex++;
            setTimeout(typeChar, 30 + Math.random() * 40);
          } else {
            el.classList.add('done');
          }
        }
        setTimeout(typeChar, 500);
      }

      // Start hero typewriter immediately, others on scroll
      if (el.closest('#hero') || el.closest('.hero')) {
        setTimeout(startTyping, 1200);
      } else {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            startTyping();
            observer.disconnect();
          }
        }, { threshold: 0.5 });
        observer.observe(el);
      }
    });
  }

  // ——— COUNT UP ANIMATION ———
  function initCountUp() {
    const statValues = document.querySelectorAll('[data-count]');
    if (statValues.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          animateCount(el, 0, target, 1500);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));
  }

  function animateCount(el, start, end, duration) {
    if (prefersReducedMotion) {
      el.textContent = end;
      return;
    }

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ——— MOBILE NAVIGATION ———
  function initMobileNav() {
    const menuBtn = document.querySelector('.nav-hud__menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const menuBars = menuBtn ? menuBtn.querySelectorAll('.menu-bar') : [];

    if (!menuBtn || !mobileNav) return;

    let isOpen = false;

    function toggleNav() {
      isOpen = !isOpen;
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen);

      // Animate hamburger to X
      if (isOpen) {
        menuBars[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        menuBars[1].style.opacity = '0';
        menuBars[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        menuBars[0].style.transform = '';
        menuBars[1].style.opacity = '';
        menuBars[2].style.transform = '';
      }

      // Freeze/unfreeze body
      if (isOpen && lenis) {
        lenis.stop();
      } else if (lenis) {
        lenis.start();
      }
    }

    menuBtn.addEventListener('click', toggleNav);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) toggleNav();
      });
    });
  }

  // ——— ACTIVE NAV HIGHLIGHT ———
  function initNavHighlight() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -50% 0px',
    });

    sections.forEach(section => observer.observe(section));
  }

})();
