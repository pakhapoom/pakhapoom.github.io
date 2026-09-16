// Boot: render the résumé, wire the page chrome, start the chat widget.

import { renderResume } from './render.js';
import { initChat } from './chat.js';

/* ------------------------------------------------------------------ theme */

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const label = btn.querySelector('[data-label]');
  const icon = btn.querySelector('[data-icon]');

  const MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  const SUN =
    '<circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const current = () =>
    document.documentElement.dataset.theme || (systemDark.matches ? 'dark' : 'light');

  const paint = () => {
    const dark = current() === 'dark';
    // The button offers the *other* theme, so it shows that theme's icon.
    icon.innerHTML = dark ? SUN : MOON;
    label.textContent = dark ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  };

  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    paint();
  });

  // Follow the OS only while the visitor hasn't made an explicit choice.
  systemDark.addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) paint();
  });

  paint();
}

/* --------------------------------------------------------------- scrollspy */

function initScrollSpy() {
  const links = [...document.querySelectorAll('.rail__link')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const mark = (id) => {
    for (const a of links) {
      a.setAttribute('aria-current', String(a.getAttribute('href') === `#${id}`));
    }
  };

  // Top-biased band: a section counts as "current" once its heading reaches the
  // upper third of the viewport, which matches where the eye actually is.
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) mark(visible[0].target.id);
    },
    { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
  mark(sections[0].id);
}

/* ------------------------------------------------------------------ reveal */

function initReveal() {
  const targets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);   // one-shot; no re-animation on scroll back
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  targets.forEach((t) => observer.observe(t));
}

/* -------------------------------------------------------------------- boot */

renderResume(document.getElementById('resume-root'));
initTheme();
initScrollSpy();
initReveal();
initChat();

document.getElementById('print-btn').addEventListener('click', () => window.print());
