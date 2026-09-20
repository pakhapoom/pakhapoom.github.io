# CLAUDE.md

Overview, dev, and deployment are in `README.md`. Rules only below.

## Résumé data

`js/resume-data.js` is the single source of truth: `render.js` builds the page,
`worker/index.js` builds the bot prompt from `resumeToText()`. Never hard-code
résumé content elsewhere.

New section: extend `resume`, add a render function in `render.js`, append it in
`renderResume()`, add a `.rail__link` in `index.html`.

- `path()` flattens `experience` **and** `education` into one timeline — there
  is no Education section. It parses `period`, so keep `Month YYYY – Month YYYY`
  (or `– Present`).
- **Screen shows `blurb`, print shows `bullets`.** `.path` renders both; screen
  CSS hides `.bullets`, print flips it. Break one rule and the other view dies
  silently. A `blurb` may claim nothing its own bullets don't. `resumeToText()`
  sends bullets, not blurbs.
- `is-pending` (`drawOnce()`) may hide only the marks — never the card, or a
  failed script swallows the CV.
- `resume.decode`'s `top` tokens must join back into `headline[0]`.
- The pill uses `job.short` so it stays one line.

## Paper write-ups

`papers/<slug>.html` is a thin shell naming its slug on `<body data-paper>`;
prose lives in `js/papers-data.js`, rendered by `js/paper.js`. To add one: add
the `papers` entry, add a matching `slug` in `resume-data.js` (the slug sets
must agree), copy a shell.

- Bodies are plain text; `**bold**` is the only markup, applied after escaping.
- Every claim must come from the paper. If the full text was unreadable, set
  `partial`.
- `applied-mathematics` is a collection: `collection: true`, no `authors`, one
  section with `entries` from `earlierPapers` in `resume-data.js`.
- One `figure` per section, never redrawn. `width`/`height` must be the file's
  real pixels. Figures sit on `--logo-bg` (light in both themes).

## Conventions

- **Escape everything rendered** via the local `esc()`; model output via
  `miniMarkdown()`.
- Define colors on bare `:root`; dark mode redefines tokens only, in both
  `@media (prefers-color-scheme: dark)` under `:root:not([data-theme='light'])`
  and `:root[data-theme='dark']`.
- **Print is a feature.** Check `Cmd+P` after `.path` / `.section` changes, with
  the OS in *dark* mode. Print token overrides need `:root:root:root` to outrank
  the dark palette.
- No build step; no CDN beyond Google Fonts. American spelling.

## Secrets

`TYPHOON_API_KEY` must never appear in `js/`, `index.html`, or `wrangler.toml` —
Pages serves them publicly. It lives in `.env` and as a Wrangler secret.
