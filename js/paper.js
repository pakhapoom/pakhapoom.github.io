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
