/* ═══════════════════════════════════════════════
   GAME BOY DMG PORTFOLIO — ENGINE
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── State ───
  let currentScreen = 'screen-boot';
  let menuIndex = 0;
  let bootComplete = false;
  const menuTargets = [];

  // ─── DOM refs ───
  const screen = document.getElementById('screen');
  const transition = document.getElementById('screen-transition');
  const menuList = document.getElementById('menu-list');
  const menuItems = menuList ? menuList.querySelectorAll('.menu-item') : [];

  // Populate menu targets
  menuItems.forEach((item) => {
    menuTargets.push(item.dataset.target);
  });

  // ─── Speaker dots ───
  const speakerDots = document.getElementById('speaker-dots');
  if (speakerDots) {
    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      dot.className = 'speaker-dot';
      speakerDots.appendChild(dot);
    }
  }

  // ─── Screen management ───
  function showScreen(id) {
    const screens = screen.querySelectorAll('.game-screen');
    screens.forEach((s) => {
      s.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      // Reset scroll position
      const content = target.querySelector('.screen-content');
      if (content) content.scrollTop = 0;
    }
    currentScreen = id;
  }

  function transitionTo(id) {
    transition.classList.remove('flash');
    // Force reflow
    void transition.offsetWidth;
    transition.classList.add('flash');
    setTimeout(() => {
      showScreen(id);
    }, 80);
    setTimeout(() => {
      transition.classList.remove('flash');
    }, 220);
  }

  // ─── Boot sequence ───
  function runBoot() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bootBlack = document.getElementById('boot-black');
    const bootLogo = document.getElementById('boot-logo');
    const bootFlash = document.getElementById('boot-flash');
    const titleScreen = document.getElementById('title-screen');

    if (prefersReducedMotion) {
      // Skip boot, show title immediately
      bootBlack.style.display = 'none';
      bootLogo.style.display = 'none';
      bootFlash.style.display = 'none';
      titleScreen.style.opacity = '1';
      bootComplete = true;
      return;
    }

    // Step 1: Black screen (800ms)
    setTimeout(() => {
      bootBlack.style.transition = 'opacity 200ms';
      bootBlack.style.opacity = '0';
      bootLogo.style.transition = 'opacity 400ms';
      bootLogo.style.opacity = '1';
    }, 800);

    // Step 2: Logo visible (600ms), then flash
    setTimeout(() => {
      bootLogo.style.transition = 'opacity 100ms';
      bootLogo.style.opacity = '0';
      bootFlash.style.transition = 'opacity 80ms';
      bootFlash.style.opacity = '1';
    }, 1400);

    // Step 3: White flash, then fade to title
    setTimeout(() => {
      bootFlash.style.transition = 'opacity 400ms';
      bootFlash.style.opacity = '0';
      titleScreen.style.transition = 'opacity 300ms';
      titleScreen.style.opacity = '1';
      bootComplete = true;
    }, 2200);
  }

  // ─── Menu management ───
  function updateMenuCursor() {
    menuItems.forEach((item, i) => {
      const cursor = item.querySelector('.cursor');
      if (i === menuIndex) {
        item.classList.add('selected');
        cursor.innerHTML = '&#9654;';
      } else {
        item.classList.remove('selected');
        cursor.innerHTML = '&nbsp;';
      }
    });
  }

  function menuUp() {
    menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length;
    updateMenuCursor();
  }

  function menuDown() {
    menuIndex = (menuIndex + 1) % menuItems.length;
    updateMenuCursor();
  }

  function menuSelect() {
    if (menuTargets[menuIndex]) {
      transitionTo(menuTargets[menuIndex]);
    }
  }

  function goToMenu() {
    transitionTo('screen-menu');
  }

  // ─── Keyboard controls ───
  document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Boot/title screen
    if (currentScreen === 'screen-boot') {
      if (bootComplete && (key === 'Enter' || key === ' ')) {
        e.preventDefault();
        transitionTo('screen-menu');
      }
      return;
    }

    // Menu screen
    if (currentScreen === 'screen-menu') {
      if (key === 'ArrowUp') {
        e.preventDefault();
        menuUp();
      } else if (key === 'ArrowDown') {
        e.preventDefault();
        menuDown();
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        menuSelect();
      }
      return;
    }

    // Content screens — Escape or Backspace to go back
    if (key === 'Escape' || key === 'Backspace') {
      // Don't intercept Backspace in inputs
      if (key === 'Backspace' && e.target.tagName === 'INPUT') return;
      e.preventDefault();
      goToMenu();
    }
  });

  // ─── Click handlers ───

  // Title screen click
  document.getElementById('screen-boot').addEventListener('click', () => {
    if (bootComplete) {
      transitionTo('screen-menu');
    }
  });

  // Menu item clicks
  menuItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      menuIndex = i;
      updateMenuCursor();
      menuSelect();
    });
  });

  // Back buttons
  document.querySelectorAll('.back-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) {
        transitionTo(target);
      }
    });
  });

  // ─── Mobile swipe back ───
  let touchStartX = 0;
  let touchStartY = 0;

  screen.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  screen.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Swipe right (finger moves right) to go back
    if (dx > 60 && Math.abs(dy) < 40) {
      if (currentScreen !== 'screen-boot' && currentScreen !== 'screen-menu') {
        goToMenu();
      }
    }
  }, { passive: true });

  // ─── Initialize ───
  runBoot();
})();
