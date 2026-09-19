# CLAUDE.md

Project overview, layout, local dev, and deployment are in `README.md`. This
file covers only the rules to follow when changing code.

## Résumé data

`js/resume-data.js` is the single source of truth. `render.js` builds the page
from `resume`; `worker/index.js` builds the chatbot's system prompt from
`resumeToText()`. Never hard-code résumé content elsewhere.

To add a section: extend `resume`, add a render function in `render.js`, append
it to the array in `renderResume()`, and add a `.rail__link` in `index.html`.

The career timeline groups the CV by organisation and positions every bar by
parsing the `period` strings, so a period must stay in `Month YYYY – Month
YYYY` form (or `– Present`). It is also the only home for the work and study
detail — opening an organisation shows every bullet of a role and the detail
of a degree — so there is no Experience or Education section in the main
column, and none of that prose prints (`.career` is hidden in `@media print`). `resume.decode` drives the hero; its `top` tokens
must join back into `headline[0]` or the hero silently falls back to plain
text.

## Paper write-ups

Each publication has a long-form page at `papers/<slug>.html`. The page is a
thin shell that names its slug on `<body data-paper>`; the prose lives in
`js/papers-data.js` and is rendered by `js/paper.js`. To add a paper: add the
entry to `papers`, add a matching `slug` to the publication in `resume-data.js`
(the two slug sets must agree), and copy an existing shell, changing the slug
and meta tags.

Write-up bodies are plain text — `**bold**` is the only markup, applied after
escaping. Every claim must come from the paper. Where the full text could not
be read, set `partial` so the page says so rather than implying results that
were never checked.

A section may carry one `figure`, taken from the paper itself and never
redrawn: `{ src, width, height, alt, caption }`, with the file under
`public/papers/<slug>/` and `src` written from the site root (`paper.js` adds
the `../`). `width`/`height` are the file's real pixel size — they reserve the
box so the prose below it does not jump. Figures are dark ink on white, so they
render on `--logo-bg`, the plate that stays light in both themes.

## Conventions

- **Escape everything rendered.** Use the local `esc()` in `render.js` /
  `chat.js`. Model output goes through `miniMarkdown()`, which escapes first.
- **Theme tokens:** define every colour on bare `:root` (light). Dark mode
  redefines tokens only, in both `@media (prefers-color-scheme: dark)` under
  `:root:not([data-theme='light'])` and `:root[data-theme='dark']`.
- **Print is a feature.** Check `Cmd+P` output after layout changes to `.job`,
  `.post`, or `.section` — and check it with the OS in *dark* mode. The print
  block's token overrides use `:root:root:root` so they outrank the dark
  palette's `:root:not([data-theme='light'])`; drop that and a dark-mode
  visitor prints near-white ink onto white paper.
- No build step and no CDN libraries beyond Google Fonts (Inter).

## Secrets

`TYPHOON_API_KEY` must never appear in `js/`, `index.html`, or `wrangler.toml`
— everything served by Pages is public. It lives in `.env` locally and as a
Wrangler secret in production.
