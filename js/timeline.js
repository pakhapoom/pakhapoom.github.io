// Career timeline. render.js has already placed every bar on a shared year
// scale, so this only handles the two things that need the browser: opening
// one organisation at a time, and drawing the bars in once the band is seen.

export function initTimeline(root) {
  if (!root) return;
  const chart = root.querySelector('.chart');
  const orgs = [...root.querySelectorAll('.org')];
  if (!chart || !orgs.length) return;

  /* ---- one organisation open at a time ---- */

  const open = (org) => {
    for (const other of orgs) {
      const on = other === org;
      other.dataset.open = String(on);
      other.querySelector('.org__btn').setAttribute('aria-expanded', String(on));
      other.querySelector('.roles').hidden = !on;
    }
  };

  orgs.forEach((org) => {
    org.querySelector('.org__btn').addEventListener('click', () => {
      // Clicking the open one closes it, so the chart can be read on its own.
      open(org.dataset.open === 'true' ? null : org);
    });
  });

  /* ---- draw the bars in, once ---- */

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !('IntersectionObserver' in window)) {
    chart.classList.remove('is-pending');
    return;
  }

  const seen = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    seen.disconnect();
    chart.classList.remove('is-pending');
    chart.classList.add('is-drawing');
  }, { threshold: 0.25 });

  seen.observe(chart);
}
