/* ── HERO SLIDER + NAVIGATION ──────────────────────── */
(() => {
  'use strict';

  const slides   = Array.from(document.querySelectorAll('.hero-slide'));
  const numEl    = document.getElementById('heroNum');
  const labelEl  = document.getElementById('heroLabel');
  let current    = 0;
  let autoTimer;

  function goTo(n) {
    slides[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (numEl)   numEl.textContent   = slides[current].dataset.num   || '0' + (current + 1);
    if (labelEl) labelEl.textContent = slides[current].dataset.label || '';
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  if (slides.length > 1) {
    startAuto();
    document.querySelector('.hero-next')
      ?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    document.querySelector('.hero-prev')
      ?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  }

  /* ── HAMBURGER / NAV DRAWER ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const closeBtn  = document.getElementById('nav-close');

  function openNav() {
    hamburger?.classList.add('open');
    drawer?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeNav() {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger?.focus();
  }

  hamburger?.addEventListener('click', () =>
    drawer?.classList.contains('open') ? closeNav() : openNav()
  );
  closeBtn?.addEventListener('click', closeNav);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) closeNav();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      drawer?.classList.contains('open') &&
      !drawer.contains(e.target) &&
      !hamburger?.contains(e.target)
    ) closeNav();
  });

  // Close when a nav link is clicked
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ── SERVICE TITLE SLIDE-IN ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    const titleObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          titleObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '-80px 0px -120px 0px' });

    document.querySelectorAll('.svc-detail-title, .extra-heading').forEach(el => titleObserver.observe(el));
  } else {
    // fallback — show immediately
    document.querySelectorAll('.svc-detail-title, .extra-heading').forEach(el => el.classList.add('is-visible'));
  }

  /* ── ACTIVE NAV LINK (IntersectionObserver) ─────────────────── */
  const navLinks = drawer?.querySelectorAll('a[href^="#"]') ?? [];
  const sections = document.querySelectorAll('section[id], main[id]');

  if ('IntersectionObserver' in window && sections.length) {
    let activeSectionId = '';
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) activeSectionId = e.target.id; });
      navLinks.forEach(link => {
        const target = link.getAttribute('href')?.slice(1);
        link.classList.toggle('active', target === activeSectionId);
      });
    }, { rootMargin: '-38% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
  }

})();

/* ── STAGGER ANIMATION — fit-items & faq-items ──────── */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    // fallback: show everything immediately
    document.querySelectorAll('.fit-item, .faq-item').forEach(el => el.classList.add('is-visible'));
    return;
  }

  /* fit-items — each fires individually as it scrolls into view,
     with a small wave-delay between sibling items that enter together */
  const fitItems = Array.from(document.querySelectorAll('.fit-item'));
  if (fitItems.length) {
    let batchTimer = null;
    let batchQueue = [];

    const fitIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        batchQueue.push(entry.target);
        fitIO.unobserve(entry.target);
      });

      // flush queue in next tick so all entries from this callback are grouped
      clearTimeout(batchTimer);
      batchTimer = setTimeout(() => {
        batchQueue.forEach((el, i) => {
          setTimeout(() => el.classList.add('is-visible'), i * 100);
        });
        batchQueue = [];
      }, 0);
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    fitItems.forEach(el => fitIO.observe(el));
  }

  /* faq-items — simpler stagger, fires as a group */
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  if (faqItems.length) {
    let faqTriggered = false;
    const faqIO = new IntersectionObserver(entries => {
      if (faqTriggered) return;
      const anyVisible = entries.some(e => e.isIntersecting);
      if (!anyVisible) return;
      faqTriggered = true;
      faqItems.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 55);
      });
      faqIO.disconnect();
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    // observe only the first few items to trigger the group
    faqItems.slice(0, 3).forEach(el => faqIO.observe(el));
  }

}());

/* ── CLOSE LEGAL DIALOGS ON BACKDROP CLICK ─────────── */
document.querySelectorAll('.legal-dialog').forEach(dlg => {
  dlg.addEventListener('click', e => {
    if (e.target === dlg) dlg.close();
  });
});
