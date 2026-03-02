/* ================================================================
   V13 — Interactive Timeline Portfolio
   GSAP + ScrollTrigger + Lenis + Splitting.js
   ================================================================ */

(function () {
  'use strict';

  // ── Reduced motion check ──────────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Initialize Splitting.js ───────────────────────────────────
  Splitting();

  // ── DOM refs ──────────────────────────────────────────────────
  const yearIndicator = document.querySelector('.year-indicator');
  const yearValue = document.querySelector('.year-indicator__value');
  const timelineRail = document.querySelector('.timeline-rail');
  const railNodes = document.querySelectorAll('.timeline-rail__node');
  const railProgress = document.querySelector('.timeline-rail__progress');
  const sections = document.querySelectorAll('.section');
  const roleSections = document.querySelectorAll('.role');
  const expandButtons = document.querySelectorAll('.role__expand');

  // ── Lenis smooth scroll ───────────────────────────────────────
  let lenis;

  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ── Register GSAP plugins ────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ── Skip animations if reduced motion ─────────────────────────
  if (prefersReducedMotion) {
    yearIndicator.classList.add('visible');
    timelineRail.classList.add('visible');
    roleSections.forEach(function (s) { s.classList.add('in-view'); });
    return;
  }

  // ── Hero animations ──────────────────────────────────────────
  var heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to('.hero__eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, 0)
    .to('.hero__name .char', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.03,
      ease: 'power3.out',
    }, 0.2)
    .from('.hero__title', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.6)
    .from('.hero__tagline', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.75)
    .to('.hero__cta', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.9)
    .from('.hero__accent-line', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
    }, 0.5);

  // Show timeline rail and year indicator after hero loads
  heroTl.call(function () {
    timelineRail.classList.add('visible');
    yearIndicator.classList.add('visible');
  }, null, 1.2);

  // ── Role section reveal animations ───────────────────────────
  roleSections.forEach(function (section) {
    var header = section.querySelector('.role__header');
    var summary = section.querySelector('.role__summary');
    var stats = section.querySelector('.role__stats');
    var quote = section.querySelector('.role__quote');
    var details = section.querySelector('.role__details');
    var chars = section.querySelectorAll('.role__company .char');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'top 20%',
        toggleActions: 'play none none none',
        onEnter: function () { section.classList.add('in-view'); },
      },
    });

    // Stagger chars
    if (chars.length) {
      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.025,
        ease: 'power3.out',
      }, 0);
    }

    // Header elements
    tl.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.1);

    if (summary) {
      tl.to(summary, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.3);
    }

    if (stats) {
      tl.to(stats, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.4);
    }

    if (quote) {
      tl.to(quote, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.5);
    }

    if (details) {
      tl.to(details, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.6);
    }
  });

  // ── Pullquote animations ─────────────────────────────────────
  document.querySelectorAll('.pullquote').forEach(function (pq) {
    var chars = pq.querySelectorAll('.pullquote__text .char');
    var mark = pq.querySelector('.pullquote__mark');
    var rule = pq.querySelector('.pullquote__rule');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: pq,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    if (mark) {
      tl.from(mark, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'power2.out',
      }, 0);
    }

    if (chars.length) {
      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.012,
        ease: 'power3.out',
      }, 0.1);
    }

    if (rule) {
      tl.from(rule, {
        scaleX: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.6);
    }
  });

  // ── Skills & Contact section reveals ─────────────────────────
  var footerSection = document.querySelector('.footer-section');
  if (footerSection) {
    var skillsTl = gsap.timeline({
      scrollTrigger: {
        trigger: footerSection,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    skillsTl
      .from('.skills__heading', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, 0)
      .from('.skills__rule', { scaleX: 0, duration: 0.6, ease: 'power2.out' }, 0.2)
      .from('.skills__tag', { opacity: 0, y: 15, duration: 0.4, stagger: 0.04, ease: 'power3.out' }, 0.3)
      .from('.contact__heading', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, 0.5)
      .from('.contact__rule', { scaleX: 0, duration: 0.6, ease: 'power2.out' }, 0.6)
      .from('.contact__text', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.7)
      .from('.contact__link', { opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 0.8)
      .from('.footer', { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.0);
  }

  // ── Timeline rail — active node tracking ─────────────────────
  var sectionIds = [];
  railNodes.forEach(function (node) {
    sectionIds.push(node.getAttribute('data-section'));
  });

  // Build year map from sections
  var yearMap = {};
  sections.forEach(function (s) {
    if (s.id && s.dataset.year) {
      yearMap[s.id] = parseInt(s.dataset.year, 10);
    }
  });

  // Track active section for year interpolation
  var currentActiveIndex = 0;

  function updateActiveNode(activeId) {
    var activeIdx = -1;
    railNodes.forEach(function (node, i) {
      var sectionId = node.getAttribute('data-section');
      if (sectionId === activeId) {
        node.classList.add('active');
        node.setAttribute('aria-current', 'true');
        activeIdx = i;
      } else {
        node.classList.remove('active');
        node.removeAttribute('aria-current');
      }
    });

    // Update passed state and progress
    if (activeIdx >= 0) {
      currentActiveIndex = activeIdx;
      var progressPct = (activeIdx / (railNodes.length - 1)) * 100;
      railProgress.style.height = progressPct + '%';

      railNodes.forEach(function (node, i) {
        if (i < activeIdx) {
          node.classList.add('passed');
        } else {
          node.classList.remove('passed');
        }
      });
    }
  }

  // ScrollTrigger for each section to update active rail node
  sections.forEach(function (section) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: function () { updateActiveNode(section.id || ''); },
      onEnterBack: function () { updateActiveNode(section.id || ''); },
    });
  });

  // ── Sticky header detection ──────────────────────────────────
  roleSections.forEach(function (section) {
    var header = section.querySelector('.role__header');
    if (!header) return;

    ScrollTrigger.create({
      trigger: header,
      start: 'top top',
      endTrigger: section,
      end: 'bottom top',
      onEnter: function () { header.classList.add('is-stuck'); },
      onLeave: function () { header.classList.remove('is-stuck'); },
      onEnterBack: function () { header.classList.add('is-stuck'); },
      onLeaveBack: function () { header.classList.remove('is-stuck'); },
    });
  });

  // ── Floating year indicator — smooth interpolation ───────────
  var displayedYear = 2025;
  var targetYear = 2025;

  // Build ordered list of sections with year data for interpolation
  var yearSections = [];
  sections.forEach(function (s) {
    if (s.dataset.year) {
      yearSections.push({
        el: s,
        year: parseInt(s.dataset.year, 10),
      });
    }
  });

  // Smooth year update via scroll position
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: function (self) {
      // Find which two sections we're between
      var scrollY = window.scrollY || window.pageYOffset;
      var windowH = window.innerHeight;
      var center = scrollY + windowH * 0.5;

      var prevSection = null;
      var nextSection = null;

      for (var i = 0; i < yearSections.length; i++) {
        var rect = yearSections[i].el.getBoundingClientRect();
        var sectionCenter = scrollY + rect.top + rect.height / 2;

        if (sectionCenter <= center) {
          prevSection = yearSections[i];
        } else {
          nextSection = yearSections[i];
          break;
        }
      }

      if (prevSection && nextSection) {
        var prevRect = prevSection.el.getBoundingClientRect();
        var nextRect = nextSection.el.getBoundingClientRect();
        var prevCenter = scrollY + prevRect.top + prevRect.height / 2;
        var nextCenter = scrollY + nextRect.top + nextRect.height / 2;
        var progress = (center - prevCenter) / (nextCenter - prevCenter);
        progress = Math.max(0, Math.min(1, progress));
        targetYear = prevSection.year + (nextSection.year - prevSection.year) * progress;
      } else if (prevSection) {
        targetYear = prevSection.year;
      } else if (nextSection) {
        targetYear = nextSection.year;
      }
    },
  });

  // Animate year value smoothly
  gsap.ticker.add(function () {
    displayedYear += (targetYear - displayedYear) * 0.08;
    var rounded = Math.round(displayedYear);
    if (yearValue.textContent !== String(rounded)) {
      yearValue.textContent = rounded;
    }
  });

  // ── Timeline rail — click navigation ─────────────────────────
  railNodes.forEach(function (node) {
    node.addEventListener('click', function () {
      var targetId = node.getAttribute('data-section');
      var target = document.getElementById(targetId);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Expandable details accordion ─────────────────────────────
  expandButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('aria-controls');
      var content = document.getElementById(targetId);
      if (!content) return;

      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('.role__expand-text').textContent = 'View details';
        content.classList.remove('open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.role__expand-text').textContent = 'Hide details';
        content.classList.add('open');

        // Refresh ScrollTrigger after expand
        setTimeout(function () { ScrollTrigger.refresh(); }, 700);
      }
    });
  });

  // ── Parallax on accent elements ──────────────────────────────
  document.querySelectorAll('.hero__accent-line').forEach(function (line, i) {
    gsap.to(line, {
      y: (i + 1) * -40,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  // Slight parallax on role rules
  document.querySelectorAll('.role__rule').forEach(function (rule) {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: rule,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  // ── Keyboard navigation for timeline rail ────────────────────
  timelineRail.addEventListener('keydown', function (e) {
    var nodes = Array.from(railNodes);
    var current = nodes.indexOf(document.activeElement);
    if (current === -1) return;

    var next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      next = Math.min(current + 1, nodes.length - 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      next = Math.max(current - 1, 0);
    }

    if (next >= 0 && next !== current) {
      e.preventDefault();
      nodes[next].focus();
    }
  });

})();
