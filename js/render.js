// Renders the résumé object into the hero, summary and main mount points.
// Content is authored in resume-data.js, but everything still goes through
// escapeHtml so a stray < or & in a future edit can't break the markup.

import { resume } from './resume-data.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

const ICON = {
  mail: '<rect x="2" y="4" width="20" height="16" rx="1"/><path d="m22 6-10 7L2 6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  linkedin: '<rect x="2.5" y="2.5" width="19" height="19" rx="1"/><path d="M8 10.5V17M8 7.25v.01M12 17v-6.5M12 13.5a2.75 2.75 0 0 1 5.5 0V17"/>',
  scholar: '<path d="m12 3 10 5.5-10 5.5L2 8.5 12 3z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
  replay: '<path d="M2 12a10 10 0 1 0 3-7.1M2 3v5h5"/>',
};

const svg = (path, w = 24) =>
  `<svg viewBox="0 0 ${w} ${w}" fill="none" stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

/** A section wrapper. `meta` is optional and only used where it adds a fact. */
const section = (id, title, body, meta = '') => `
  <section class="section" id="${id}" aria-labelledby="${id}-h">
    <div class="section__head">
      <h2 class="section__title" id="${id}-h">${esc(title)}</h2>
      ${meta ? `<span class="section__meta">${esc(meta)}</span>` : ''}
    </div>
    ${body}
  </section>`;

/* ------------------------------------------------------------------ dates */

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december'];

/** "February 2022" → a Date on the 1st. Returns null if it can't be read. */
function parseMonth(text) {
  const m = String(text).trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  return month < 0 ? null : new Date(Number(m[2]), month, 1);
}

/**
 * "February 2022 – Present" → { from, to, open }. `open` marks a period that
 * is still running, so it can be drawn to today and labeled "now".
 */
function parsePeriod(period) {
  const [a = '', b = ''] = String(period).split('–').map((p) => p.trim());
  const from = parseMonth(a);
  if (!from) return null;
  if (/present/i.test(b)) return { from, to: new Date(), open: true };
  return { from, to: parseMonth(b) || from, open: false };
}

const yearOf = (d) => d.getFullYear();

/** A span the way a CV writes it: "2022 — now", or just "2019" if it's one year. */
const spanLabel = (p) =>
  p.open ? `${yearOf(p.from)} — now`
    : yearOf(p.from) === yearOf(p.to) ? String(yearOf(p.from))
      : `${yearOf(p.from)} — ${yearOf(p.to)}`;

/** The same span to the month: "Feb 2022 — now", with "now" marked up. */
const monthLabel = (p) => {
  const short = (d) => `${MONTHS[d.getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase())} ${d.getFullYear()}`;
  return p.open
    ? `${esc(short(p.from))} — <span class="now">now</span>`
    : `${esc(short(p.from))} — ${esc(short(p.to))}`;
};

/* ------------------------------------------------------------------- hero */

function hero(r) {
  const iconLink = (href, icon, label, text, external = false) => `
    <a class="icon-link" href="${esc(href)}" aria-label="${esc(label)}" data-tip="${esc(text)}"
       ${external ? 'target="_blank" rel="noopener"' : ''}>
      ${svg(icon)}<span class="icon-link__text">${esc(text)}</span>
    </a>`;

  const links = [
    iconLink(`mailto:${r.contact.email}`, ICON.mail, `Email ${r.contact.email}`, r.contact.email),
    iconLink(`tel:${r.contact.phone.replace(/\s/g, '')}`, ICON.phone, `Call ${r.contact.phone}`, r.contact.phone),
    iconLink(r.contact.linkedin.url, ICON.linkedin, 'LinkedIn profile', r.contact.linkedin.label, true),
    iconLink(r.contact.scholar.url, ICON.scholar, 'Google Scholar profile', r.contact.scholar.label, true),
  ].join('');

  // The title is written out in full. decode.js only takes it over once it has
  // confirmed the tokens still spell it, so this is what everyone sees if the
  // script never runs, or if someone prefers reduced motion.
  // Flat grid children rather than a photo + text-column pair: it lets the
  // narrow layout drop every line of type below the photo without moving
  // anything in the DOM.
  // .hero__lede is the decoding line's own box — decode.js positions the
  // candidate popover against it. .hero__slot is the empty cell beside the
  // photo on a phone, where the popover docks instead; it collapses on the
  // wide layout, and decode.js reads its display to know which one applies.
  return `
    <header class="hero">
      <div class="hero__inner">
        <img class="hero__photo" src="${esc(r.photo.src)}" alt="${esc(r.photo.alt)}"
             width="480" height="480" decoding="async">
        <div class="hero__slot" data-decode-slot aria-hidden="true"></div>
        <h1 class="hero__name">${esc(r.name)}<span class="hero__cred">, ${esc(r.credential)}</span></h1>
        <div class="hero__lede">
          <p class="hero__title" data-decode><span class="decode__out">${esc(r.headline[0])}</span><span
             class="decode__caret" aria-hidden="true"></span></p>
        </div>
        <div class="hero__foot">
          <p class="hero__place">${esc(r.location)}</p>
          <div class="hero__links">${links}</div>
          <button class="hero__replay" type="button" data-decode-replay hidden>
            ${svg(ICON.replay)}Decode again
          </button>
        </div>
      </div>
    </header>`;
}

/* ---------------------------------------------------------------- summary */

/**
 * The band under the hero: the CV in one paragraph, across the full width.
 * It used to hold a proportional chart of every post, but the `.path`
 * timeline in #experience carries the same two arrays in more detail and is
 * the version that prints — so the band gives its width to the prose that
 * introduces them instead.
 *
 * The heading names the arc; the paragraph is `resume.summary`, the same one
 * the chatbot is briefed with.
 */
function summary(r) {
  return `
    <section class="summary" id="summary" aria-labelledby="summary-h">
      <div class="summary__inner">
        <div class="summary__head">
          <span class="summary__eyebrow">Summary</span>
          <h2 class="summary__title" id="summary-h">From mathematics to leading AI</h2>
        </div>
        <p class="summary__text">${esc(r.summary)}</p>
      </div>
    </section>`;
}

/* --------------------------------------------------------------- sections */

/**
 * Every post of the CV flattened onto one line: each role and each degree is a
 * point, newest first, so the two records read as a single career rather than
 * as work and study kept in separate columns. It is the only drawing of the
 * CV and the version that prints, so it carries the whole body of every
 * post.
 */
function milestones(r) {
  const posts = [];

  r.experience.forEach((job) => {
    job.roles.forEach((role) => {
      // A role that names no period of its own ran for the whole job.
      const period = parsePeriod(role.period || job.period);
      if (period) {
        posts.push({
          kind: 'work',
          title: role.title,
          // The pill wants one line, and "DataX (SCB DataX Co., Ltd.)" is
          // three at this width.
          org: job.short || job.company,
          location: job.location,
          period,
          blurb: role.blurb,
          body: role.bullets,
        });
      }
    });
  });

  r.education.forEach((e) => {
    const period = parsePeriod(e.period);
    if (period) {
      posts.push({
        kind: 'study',
        title: e.degree,
        org: e.institution,
        location: e.location,
        period,
        // A degree's one-line detail is already the blurb a role needs one for.
        blurb: e.detail,
        body: [e.detail],
      });
    }
  });

  // Newest start first; when two start in the same month the longer one sits
  // above, so the order never falls back to the order they were authored in.
  return posts.sort((a, b) => b.period.from - a.period.from || b.period.to - a.period.to);
}

/**
 * One spine down the left, a ring on it per post, and every post reading off
 * to its right: organization, span, role, and the role in one sentence. Work
 * and study run on the same line rather than in two lanes, so a degree is
 * just another point on it.
 */
function path(r) {
  const posts = milestones(r);
  if (!posts.length) return '';

  // Both the blurb and the bullets are written out. The screen shows the
  // blurb and the print block swaps them, so the page stays a scannable
  // timeline without the printed CV losing what every role actually did.
  const items = posts.map((p) => `
    <li class="path__post path__post--${p.kind}${p.period.open ? ' path__post--current' : ''}">
      <span class="path__mark" aria-hidden="true"></span>
      <div class="path__card">
        <p class="path__lead">
          <span class="path__pill">${esc(p.org)}</span>
          <span class="path__years">${esc(spanLabel(p.period))}</span>
        </p>
        <h3 class="path__title">${esc(p.title)}</h3>
        <p class="path__place">${esc(p.location)} · ${monthLabel(p.period)}</p>
        ${p.blurb ? `<p class="path__blurb">${esc(p.blurb)}</p>` : ''}
        <ul class="bullets">${p.body.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>
    </li>`).join('');

  const meta = spanLabel({
    from: new Date(Math.min(...posts.map((p) => p.period.from))),
    to: new Date(Math.max(...posts.map((p) => p.period.to))),
    open: posts.some((p) => p.period.open),
  });

  return section('experience', 'Experience', `
    <ol class="path is-pending">${items}</ol>`, meta);
}

function publications(r) {
  // One destination per paper: the write-up. The link out to the publisher
  // lives there, so the list stays a list and the reader goes summary first,
  // paper second.
  const items = r.publications.map((p) => {
    const href = p.slug ? `papers/${esc(p.slug)}.html` : null;
    const title = href
      ? `<a class="pub__link" href="${href}">${esc(p.title)}</a>`
      : esc(p.title);

    return `
    <div class="pub">
      <span class="pub__year">${esc(p.year)}</span>
      <span class="pub__title">${title}</span>
      <span class="pub__venue">${esc(p.venue)}</span>
    </div>`;
  }).join('');

  return section('publications', 'Publications', `
    <div class="stack">${items}</div>`);
}

function footer(r) {
  return `
    <footer class="foot">
      <span>© ${new Date().getFullYear()} ${esc(r.name)}</span>
      <span><a href="mailto:${esc(r.contact.email)}">Get in touch</a></span>
    </footer>`;
}

/** Structured data so search engines read this as a person, not a blob of text. */
function structuredData(r) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: r.name,
    honorificSuffix: r.credential,
    jobTitle: r.headline[0],
    email: `mailto:${r.contact.email}`,
    telephone: r.contact.phone,
    url: 'https://pakhapoom.github.io/',
    image: new URL(r.photo.src, 'https://pakhapoom.github.io/').href,
    address: { '@type': 'PostalAddress', addressLocality: 'Bangkok', addressCountry: 'TH' },
    sameAs: [r.contact.linkedin.url, r.contact.scholar.url],
    worksFor: { '@type': 'Organization', name: r.experience[0].company },
    alumniOf: r.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
    knowsAbout: r.skills.flatMap((s) => s.items).slice(0, 30),
  };

  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(json);
  document.head.appendChild(tag);
}

/**
 * Renders into three mount points: the hero and the summary band sit full
 * width above the rail layout, the detailed sections inside the main column.
 */
export function renderResume({ hero: heroRoot, summary: summaryRoot, main }, r = resume) {
  heroRoot.innerHTML = hero(r);
  summaryRoot.innerHTML = summary(r);
  main.innerHTML = [
    publications(r),
    path(r),
    footer(r),
  ].join('');

  structuredData(r);
}
