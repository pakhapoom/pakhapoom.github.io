// The Experience timeline. render.js has already written every post onto the
// spine, so this only handles the one thing that needs the browser: popping
// the rings in once the timeline is seen.

/**
 * Swaps `is-pending` for `is-drawing` the first time `el` is a quarter on
 * screen, which is what the CSS animations key off. Reduced motion and a
 * browser without IntersectionObserver both drop straight to the drawn state,
 * so a head is never stranded at zero.
 */
function drawOnce(el) {
  if (!el) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !('IntersectionObserver' in window)) {
    el.classList.remove('is-pending');
    return;
  }

  const seen = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    seen.disconnect();
    el.classList.remove('is-pending');
    el.classList.add('is-drawing');
  }, { threshold: 0.25 });

  seen.observe(el);
}

/** The vertical timeline in the main column: heads only, nothing to open. */
export function initPath(root) {
  drawOnce(root);
}
