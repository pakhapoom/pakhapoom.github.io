// Renders one paper write-up. Each papers/<slug>.html is a thin shell that
// names its slug on <body data-paper="…">; everything else lives in
// papers-data.js so the four pages can never drift apart in structure.

import { bySlug } from './papers-data.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

/** Escapes first, then allows **bold** — the only markup the write-ups use. */
const emph = (s) =>
  esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

function authorList(p) {
  return p.authors
    .map((a) => (a === p.me
      ? `<strong class="paper__me">${esc(a)}</strong>`
      : esc(a)))
    .join(', ');
}

/**
 * A figure lifted from the paper itself. `src` is written from the site root,
 * so it picks up the ../ that a page in papers/ needs. width and height are the
 * file's real pixel size: they give the box an aspect ratio up front, so the
 * prose below it does not jump once the image arrives.
 */
function figureBlock(f) {
  if (!f) return '';

  // These are paper figures: dense enough that on a phone the only way to read
  // the axis labels is to open the file itself, so the image is its own link.
  return `
    <figure class="paper__figure">
      <a href="../${esc(f.src)}" target="_blank" rel="noopener" aria-label="Open the full-size figure">
        <img src="../${esc(f.src)}" alt="${esc(f.alt)}"
             width="${esc(f.width)}" height="${esc(f.height)}" loading="lazy" decoding="async">
      </a>
      <figcaption>${emph(f.caption)}</figcaption>
    </figure>`;
}

function sectionBlock(s, i) {
  const paras = (s.body || []).map((t) => `<p>${emph(t)}</p>`).join('');
  const bullets = s.bullets?.length
    ? `<ul class="paper__list">${s.bullets.map((b) => `<li>${emph(b)}</li>`).join('')}</ul>`
    : '';

  return `
    <section class="paper__section" aria-labelledby="s${i}">
      <h2 class="paper__heading" id="s${i}">${esc(s.heading)}</h2>
      ${paras}
      ${bullets}
      ${figureBlock(s.figure)}
    </section>`;
}

export function renderPaper(root, slug) {
  const p = bySlug(slug);

  if (!p) {
    root.innerHTML = `
      <p class="paper__missing">That paper could not be found.
        <a href="../index.html#publications">Back to publications</a>.</p>`;
    return;
  }

  document.title = `${p.title} — Pakhapoom Sarapat`;

  const links = p.links.map((l) => `
    <a class="paper__source" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');

  root.innerHTML = `
    <article class="paper">
      <a class="paper__back" href="../index.html#publications">Publications</a>

      <header class="paper__head">
        <h1 class="paper__title">${esc(p.title)}</h1>
        <p class="paper__meta">${esc(p.venue)}, ${esc(p.year)}</p>
        <p class="paper__authors">${authorList(p)}</p>
        <div class="paper__links">${links}</div>
      </header>

      <p class="paper__tldr">${emph(p.tldr)}</p>
      ${p.partial ? `<p class="paper__partial">${emph(p.partial)}</p>` : ''}

      ${p.sections.map(sectionBlock).join('')}

      <footer class="paper__foot">
        <a href="../index.html#publications">← All publications</a>
      </footer>
    </article>`;
}
