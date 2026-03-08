/* ══════════════════════════════════════════
   Kira Tanaka — Portfolio JS
   Progressive enhancement only.
   All content visible by default.
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    /* ═══ SCROLL REVEAL ═══
       1. Mark all .reveal-el with .reveal-ready (hides them via CSS)
       2. Immediately add .revealed to any already in viewport
       3. IntersectionObserver adds .revealed on scroll
       If JS never runs, .reveal-ready never gets added → content stays visible */

    const revealEls = document.querySelectorAll('.reveal-el');

    // Step 1: prep all elements (hides them via CSS transition-ready state)
    revealEls.forEach(el => el.classList.add('reveal-ready'));

    // Step 2: observer with safe rootMargin
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    // Step 3: observe — anything already visible gets revealed immediately
    revealEls.forEach(el => revealObserver.observe(el));


    /* ═══ HERO PARALLAX ═══ */
    const hero = document.querySelector('.hero');
    let ticking = false;

    if (hero) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    if (scrolled < window.innerHeight) {
                        const ratio = scrolled / window.innerHeight;
                        hero.style.opacity = 1 - ratio * 0.6;
                        hero.style.transform = `translateY(${scrolled * 0.35}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }


    /* ═══ SMOOTH SCROLL ═══ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
