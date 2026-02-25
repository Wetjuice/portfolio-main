/* ============================================================
   MARCUS REEVE — V6 — Shared Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Cursor Glow --- */
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    // Smooth follow with lerp
    function animateCursor() {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide on leave, show on enter
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  /* --- Scroll Reveal --- */
  const reveals = document.querySelectorAll('.reveal, .reveal-left');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* --- Nav scroll behavior --- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Work entry hover expand (touch-friendly) --- */
  const workEntries = document.querySelectorAll('.work-entry');
  workEntries.forEach(entry => {
    entry.addEventListener('click', () => {
      // On mobile, toggle expanded state
      if (window.innerWidth <= 600) {
        entry.classList.toggle('expanded');
      }
    });
  });

  /* --- Principle rows accordion --- */
  const principleHeaders = document.querySelectorAll('.principle-header');
  principleHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const detail = header.nextElementSibling;
      if (!detail) return;
      const isOpen = detail.classList.contains('open');

      // Close all others
      document.querySelectorAll('.principle-detail.open').forEach(d => {
        d.classList.remove('open');
      });

      if (!isOpen) {
        detail.classList.add('open');
      }
    });
  });

  /* --- Experience entries accordion --- */
  const expHeaders = document.querySelectorAll('.exp-header');
  expHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const detail = header.nextElementSibling;
      if (!detail) return;
      const isOpen = detail.classList.contains('open');
      document.querySelectorAll('.exp-detail.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) detail.classList.add('open');
    });
  });

  /* --- Library tabs --- */
  const libTabs = document.querySelectorAll('.lib-tab');
  const libPanels = document.querySelectorAll('.lib-panel');
  libTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      libTabs.forEach(t => t.classList.remove('active'));
      libPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('lib-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  /* --- Library entry notes --- */
  const libHeaders = document.querySelectorAll('.lib-entry-header');
  libHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const notes = header.nextElementSibling;
      if (!notes) return;
      notes.classList.toggle('open');
    });
  });

  /* --- Stash toggle (experience) --- */
  const stashBtn = document.querySelector('.stash-toggle');
  if (stashBtn) {
    stashBtn.addEventListener('click', () => {
      const entries = stashBtn.nextElementSibling;
      if (entries) {
        entries.classList.toggle('open');
        stashBtn.querySelector('.stash-icon').style.color =
          entries.classList.contains('open') ? 'var(--accent)' : 'var(--gold)';
      }
    });
  }

});
