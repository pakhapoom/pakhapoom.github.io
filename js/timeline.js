// The Experience timeline. render.js has already written every post onto the
// spine, so this only handles the one thing that needs the browser: walking a
// reading line down the list as the visitor scrolls, drawing the spine to it
// and popping each head as the line arrives.
//
// Both halves read from the same line in the same frame, so they are one
// gesture rather than two effects that happen to overlap. It is decorative and
// it fails safe: the stylesheet defaults `--draw` to 100%, so a browser that
// never gets here renders the finished line, and a card is never hidden —
// only its mark.

/** How far down the viewport the reading line sits. */
const LINE = 0.8;

/** Steps between heads that come due in the same frame, after a fast scroll. */
const STAGGER = 70;

const clamp = (n) => Math.min(Math.max(n, 0), 1);

/** True when the visitor has asked the OS for less movement. */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True once the page is as far down as it goes, give or take a rounding error. */
const atEnd = () =>
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

function choreograph(root) {
  const posts = [...root.querySelectorAll('.path__post')];
  if (!posts.length) return;

  // Hand the hold over from the list to the individual posts in one tick, so
  // no head is visible in between.
  root.classList.remove('is-pending');
  root.classList.add('is-drawing');

  let frame = 0;
  let waiting = posts;

  const update = () => {
    frame = 0;
    const box = root.getBoundingClientRect();
    if (!box.height) return;

    // The line in viewport coordinates, and the same line as a fraction of the
    // list — which is exactly how much of the spine is up.
    const line = window.innerHeight * LINE;
    root.style.setProperty('--draw', `${clamp((line - box.top) / box.height) * 100}%`);

    if (!waiting.length) return;

    // A head is due once the line has reached the top of its post, which is
    // where that head sits. The last posts on the page may never get there —
    // the document can run out of scroll first — so the bottom releases
    // whatever is left.
    const end = atEnd();
    const due = waiting.filter((p) => end || p.getBoundingClientRect().top <= line);

    due.forEach((post, i) => {
      post.style.setProperty('--pop-delay', `${i * STAGGER}ms`);
      post.classList.add('is-in');
    });

    if (due.length) waiting = waiting.filter((p) => !due.includes(p));
  };

  // Scroll fires far faster than the screen repaints; one pass per frame is
  // all the line can actually show.
  const schedule = () => { frame ||= requestAnimationFrame(update); };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

/** The vertical timeline in the main column: heads only, nothing to open. */
export function initPath(root) {
  if (!root) return;

  // Reduced motion goes straight to the finished state: every head drawn and
  // the whole spine up. Never leave a head at zero or a line half drawn.
  if (reduced()) {
    root.classList.remove('is-pending');
    return;
  }

  choreograph(root);
}
