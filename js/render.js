// Renders the résumé object into the hero, career and main mount points.
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
 * is still running, so it can be drawn to today and labelled "now".
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

const initials = (name) =>
  name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('').slice(0, 3);

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
  return `
    <header class="hero">
      <div class="hero__inner">
        <img class="hero__photo" src="${esc(r.photo.src)}" alt="${esc(r.photo.alt)}"
             width="480" height="480" decoding="async">
        <div class="hero__text">
          <h1 class="hero__name">${esc(r.name)}<span class="hero__cred">, ${esc(r.credential)}</span></h1>
          <p class="hero__title" data-decode><span class="decode__out">${esc(r.headline[0])}</span><span
             class="decode__caret" aria-hidden="true"></span></p>
          <p class="hero__sub">${esc(r.headline[1])}</p>
          <p class="hero__place">${esc(r.location)}</p>
          <div class="hero__foot">
            <div class="hero__links">${links}</div>
            <button class="hero__replay" type="button" data-decode-replay hidden>
              ${svg(ICON.replay)}Decode again
            </button>
          </div>
        </div>
      </div>
    </header>`;
}

/* ----------------------------------------------------------------- career */

/**
 * Groups the CV into one entry per organisation, so a company where several
 * roles were held appears once, with the roles nested inside it. Without this
 * the same logo drew three times in a row for DataX and twice for Mahidol.
 */
function organisations(r) {
  const orgs = [];
  const find = (name) => orgs.find((o) => o.org === name);

  r.experience.forEach((job, i) => {
    const entry = find(job.company) || (orgs.push({
      kind: 'work',
      org: job.short || job.company,
      orgFull: job.company,
      logo: job.logo,
      href: `#job-${i}`,
      posts: [],
    }), orgs[orgs.length - 1]);

    job.roles.forEach((role) => {
      const period = parsePeriod(role.period || job.period);
      if (period) entry.posts.push({ title: role.title, period, note: role.bullets[0], href: `#job-${i}` });
    });
  });

  r.education.forEach((e, i) => {
    const entry = find(e.institution) || (orgs.push({
      kind: 'study',
      org: e.institution,
      orgFull: e.institution,
      logo: e.logo,
      href: `#edu-${i}`,
      posts: [],
    }), orgs[orgs.length - 1]);

    const period = parsePeriod(e.period);
    if (period) entry.posts.push({ title: e.short || e.degree, period, note: e.detail, href: `#edu-${i}` });
  });

  // Newest post first inside an organisation; organisations oldest first, so
  // the chart reads left to right as a staircase.
  for (const o of orgs) {
    o.posts.sort((a, b) => b.period.from - a.period.from);
    o.from = new Date(Math.min(...o.posts.map((p) => p.period.from)));
    o.to = new Date(Math.max(...o.posts.map((p) => p.period.to)));
    o.open = o.posts.some((p) => p.period.open);
  }
  return orgs.filter((o) => o.posts.length).sort((a, b) => a.from - b.from);
}

function career(r) {
  const orgs = organisations(r);
  if (!orgs.length) return '';

  const min = Math.min(...orgs.map((o) => o.from));
  const max = Math.max(...orgs.map((o) => o.to));
  const pct = (d) => ((d - min) / (max - min)) * 100;
  const geom = (from, to) => `--from:${pct(from).toFixed(2)}%;--w:${(pct(to) - pct(from)).toFixed(2)}%`;

  const rows = orgs.map((o, i) => {
    const face = o.logo
      ? `<img src="${esc(o.logo)}" alt="" loading="lazy" decoding="async">`
      : `<span class="org__initials">${esc(initials(o.org))}</span>`;

    const open = i === orgs.length - 1;   // the current organisation starts open
    const count = o.posts.length > 1
      ? `<span class="org__count">${o.posts.length} ${o.kind === 'study' ? 'degrees' : 'roles'}</span>`
      : '';

    const posts = o.posts.map((p) => `
      <div class="role${p.period.open ? ' role--current' : ''}">
        <div class="role__head">
          <span class="role__title">${esc(p.title)}</span>
          <span class="role__years">${esc(spanLabel(p.period))}</span>
        </div>
        <div class="track" aria-hidden="true">
          <span class="bar" style="${geom(p.period.from, p.period.to)}"></span>
        </div>
        <p class="role__note">${esc(p.note)}</p>
      </div>`).join('');

    return `
      <li class="org" data-open="${open}">
        <button class="org__btn" type="button" aria-expanded="${open}" aria-controls="org-${i}-posts">
          <span class="org__disc" aria-hidden="true">${face}</span>
          <span class="org__label">
            <span class="org__name">${esc(o.orgFull)}</span>
            <span class="org__span">${esc(spanLabel({ from: o.from, to: o.to, open: o.open }))}</span>
            ${count}
          </span>
          <span class="track" aria-hidden="true">
            <span class="bar bar--${o.kind}" style="${geom(o.from, o.to)}"></span>
          </span>
        </button>
        <div class="roles" id="org-${i}-posts" ${open ? '' : 'hidden'}>
          ${posts}
          <a class="roles__more" href="${esc(o.href)}">Read the full entry</a>
        </div>
      </li>`;
  }).join('');

  // A tick a year; the year is written on the ones that divide by four, plus
  // both ends, so the axis stays readable when the band is narrow.
  const first = new Date(min).getFullYear();
  const lastYear = new Date(max).getFullYear();
  const ticks = [`<span class="tick tick--major" style="--at:0%"><b>${first}</b></span>`];
  for (let y = first + 1; y <= lastYear; y++) {
    const at = pct(new Date(y, 0, 1));
    if (at <= 0 || at >= 100) continue;
    const major = y % 4 === 0;
    ticks.push(`<span class="tick${major ? ' tick--major' : ''}" style="--at:${at.toFixed(2)}%">${
      major ? `<b>${y}</b>` : ''}</span>`);
  }
  ticks.push('<span class="tick tick--major" style="--at:100%"><b>now</b></span>');

  return `
    <section class="career" id="journey" aria-labelledby="career-h">
      <div class="career__inner">
        <h2 class="career__title" id="career-h">From mathematics to leading AI</h2>
        <p class="career__note">Each bar is drawn to scale, so the gaps and the
          short stays are the real ones. Open an organisation to see the roles.</p>

        <div class="chart is-pending">
          <ul class="chart__rows">${rows}</ul>
          <div class="axis" aria-hidden="true">${ticks.join('')}</div>
        </div>
      </div>
    </section>`;
}

/* --------------------------------------------------------------- sections */

function summary(r) {
  return section('summary', 'Summary', `<p class="lede">${esc(r.summary)}</p>`);
}

function skills(r) {
  const groups = r.skills.map((g) => `
    <div class="skill-group">
      <h3 class="skill-group__name">${esc(g.group)}</h3>
      <p class="skill-group__items">${esc(g.items.join(', '))}</p>
    </div>`).join('');

  return section('skills', 'Technical skills', `<div class="skills">${groups}</div>`);
}

/** "February 2022 – Present" → "Feb 2022 — now", with "now" marked up. */
function periodLabel(period) {
  const p = parsePeriod(period);
  if (!p) return esc(period);
  const short = (d) => `${MONTHS[d.getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase())} ${d.getFullYear()}`;
  return p.open
    ? `${esc(short(p.from))} — <span class="now">now</span>`
    : `${esc(short(p.from))} — ${esc(short(p.to))}`;
}

function experience(r) {
  const jobs = r.experience.map((job, i) => {
    const posts = job.roles.map((role) => `
      <article class="post">
        <div class="post__head">
          <h4 class="post__title">${esc(role.title)}</h4>
          ${role.period ? `<span class="post__period">${periodLabel(role.period)}</span>` : ''}
        </div>
        <ul class="bullets">${role.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </article>`).join('');

    return `
      <article class="job" id="job-${i}">
        <div class="job__head">
          <h3 class="job__company">${esc(job.company)}
            <span class="job__location">${esc(job.location)}</span>
          </h3>
          <span class="job__meta">${periodLabel(job.period)}</span>
        </div>
        <div>${posts}</div>
      </article>`;
  }).join('');

  const spans = r.experience.map((j) => parsePeriod(j.period)).filter(Boolean);
  const meta = spans.length
    ? `${Math.min(...spans.map((p) => yearOf(p.from)))} — ${spans.some((p) => p.open) ? 'now' : Math.max(...spans.map((p) => yearOf(p.to)))}`
    : '';

  return section('experience', 'Professional experience', `<div class="timeline">${jobs}</div>`, meta);
}

function awards(r) {
  const items = r.awards.map((a) => `
    <div class="entry">
      <div class="entry__title">${esc(a.title)}</div>
      <div class="entry__detail">${esc(a.detail)}</div>
    </div>`).join('');

  const certs = r.certifications.map((c) => `
    <div class="entry">
      <div class="entry__title">${esc(c.title)}</div>
      <div class="entry__meta">${esc(c.issuer)}, ${esc(c.date)}</div>
    </div>`).join('');

  return section('awards', 'Awards', `
    <div class="stack">${items}</div>
    <h3 class="sub-title">Certifications</h3>
    <div class="stack">${certs}</div>`);
}

function education(r) {
  const items = r.education.map((e, i) => `
    <div class="entry" id="edu-${i}">
      <div class="entry__title">${esc(e.degree)}</div>
      <div class="entry__detail">${esc(e.institution)}, ${esc(e.location)}</div>
      <div class="entry__meta">${periodLabel(e.period)} — ${esc(e.detail)}</div>
    </div>`).join('');

  const spans = r.education.map((e) => parsePeriod(e.period)).filter(Boolean);
  const meta = spans.length
    ? `${Math.min(...spans.map((p) => yearOf(p.from)))} — ${Math.max(...spans.map((p) => yearOf(p.to)))}`
    : '';

  return section('education', 'Education', `<div class="stack">${items}</div>`, meta);
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
    <div class="stack">${items}</div>
    <p class="note">${esc(r.publicationsNote)}</p>`, '81 citations');
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
 * Renders into three mount points: the hero and the career band sit full width
 * above the rail layout, the detailed sections inside the main column.
 */
export function renderResume({ hero: heroRoot, career: careerRoot, main }, r = resume) {
  heroRoot.innerHTML = hero(r);
  careerRoot.innerHTML = career(r);
  main.innerHTML = [
    summary(r),
    skills(r),
    experience(r),
    awards(r),
    education(r),
    publications(r),
    footer(r),
  ].join('');

  structuredData(r);
}
