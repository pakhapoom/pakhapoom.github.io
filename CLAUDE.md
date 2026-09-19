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
YYYY` form (or `– Present`). `resume.decode` drives the hero; its `top` tokens
must join back into `headline[0]` or the hero silently falls back to plain
text.

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
