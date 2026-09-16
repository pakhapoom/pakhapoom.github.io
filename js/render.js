// Renders the résumé object into #resume-root.
// Content is authored in resume-data.js, but everything still goes through
// escapeHtml so a stray < or & in a future edit can't break the markup.

import { resume } from './resume-data.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

const ICON = {
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  scholar: '<path d="m12 3 10 5.5-10 5.5L2 8.5 12 3z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
};

const svg = (path) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

/** A section wrapper with a uniform heading treatment. */
const section = (id, title, body) => `
  <section class="section reveal" id="${id}" aria-labelledby="${id}-h">
    <h2 class="section__title" id="${id}-h">${esc(title)}</h2>
    ${body}
  </section>`;

function masthead(r) {
  const headline = r.headline.map((h) => `<li>${esc(h)}</li>`).join('');

  const chips = [
    `<span class="chip">${svg(ICON.pin)}${esc(r.location)}</span>`,
    `<a class="chip" href="mailto:${esc(r.contact.email)}">${svg(ICON.mail)}${esc(r.contact.email)}</a>`,
    `<a class="chip" href="tel:${esc(r.contact.phone.replace(/\s/g, ''))}">${svg(ICON.phone)}${esc(r.contact.phone)}</a>`,
    `<a class="chip" href="${esc(r.contact.linkedin.url)}" target="_blank" rel="noopener">${svg(ICON.link)}${esc(r.contact.linkedin.label)}</a>`,
    `<a class="chip" href="${esc(r.contact.scholar.url)}" target="_blank" rel="noopener">${svg(ICON.scholar)}${esc(r.contact.scholar.label)}</a>`,
  ].join('');

  return `
    <header class="masthead">
      <h1 class="masthead__name">${esc(r.name)}<span class="cred">${esc(r.credential)}</span></h1>
      <ul class="masthead__headline">${headline}</ul>
      <div class="masthead__contact">${chips}</div>
    </header>`;
}

function summary(r) {
  const figures = r.highlights.map((f) => `
    <div class="figure">
      <div class="figure__value">${esc(f.value)}</div>
      <div class="figure__label">${esc(f.label)}</div>
    </div>`).join('');

  return section('summary', 'Summary', `
    <p class="lede">${esc(r.summary)}</p>
    <div class="figures">${figures}</div>`);
}

function skills(r) {
  const groups = r.skills.map((g) => `
    <div class="skill-group">
      <h3 class="skill-group__name">${esc(g.group)}</h3>
      <ul class="skill-group__items">
        ${g.items.map((i) => `<li><span class="tag">${esc(i)}</span></li>`).join('')}
      </ul>
    </div>`).join('');

  return section('skills', 'Technical Skills', `<div class="skills">${groups}</div>`);
}

function experience(r) {
  const jobs = r.experience.map((job) => {
    const roles = job.roles.map((role) => `
      <article class="role">
        <div class="role__head">
          <h4 class="role__title">${esc(role.title)}</h4>
          ${role.period ? `<span class="role__period">${esc(role.period)}</span>` : ''}
        </div>
        <ul class="bullets">
          ${role.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
        </ul>
      </article>`).join('');

    return `
      <article class="job">
        <div class="job__head">
          <h3 class="job__company">
            ${esc(job.company)}
            <span class="job__location">· ${esc(job.location)}</span>
            ${job.current ? '<span class="badge-now">Now</span>' : ''}
          </h3>
          <span class="job__meta">${esc(job.period)}</span>
        </div>
        <div>${roles}</div>
      </article>`;
  }).join('');

  return section('experience', 'Professional Experience', `<div class="timeline">${jobs}</div>`);
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
      <div class="entry__meta">${esc(c.issuer)} · ${esc(c.date)}</div>
    </div>`).join('');

  return section('awards', 'Awards & Certifications', `
    <div class="stack">${items}</div>
    <h3 class="section__title" style="margin-top:2rem">Certifications</h3>
    <div class="stack">${certs}</div>`);
}

function education(r) {
  const items = r.education.map((e) => `
    <div class="entry">
      <div class="entry__title">${esc(e.degree)}</div>
      <div class="entry__detail">${esc(e.institution)} · ${esc(e.location)}</div>
      <div class="entry__meta">${esc(e.period)} — ${esc(e.detail)}</div>
    </div>`).join('');

  return section('education', 'Education', `<div class="stack">${items}</div>`);
}

function publications(r) {
  const items = r.publications.map((p) => `
    <div class="pub">
      <span class="pub__year">${esc(p.year)}</span>
      <span class="pub__title">${esc(p.title)}</span>
      <span class="pub__venue">${esc(p.venue)}</span>
    </div>`).join('');

  return section('publications', 'Publications', `
    <div class="stack">${items}</div>
    <p class="note">${esc(r.publicationsNote)}</p>`);
}

function footer(r) {
  return `
    <footer class="foot">
      <span>© ${new Date().getFullYear()} ${esc(r.name)}</span>
      <span>Last updated August 2026 · <a href="mailto:${esc(r.contact.email)}">Get in touch</a></span>
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

export function renderResume(root, r = resume) {
  root.innerHTML = [
    masthead(r),
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
