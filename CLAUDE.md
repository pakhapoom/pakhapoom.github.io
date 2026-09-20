# CLAUDE.md

Project overview, layout, local dev, and deployment are in `README.md`. This
file covers only the rules to follow when changing code.

## Résumé data

`js/resume-data.js` is the single source of truth. `render.js` builds the page
from `resume`; `worker/index.js` builds the chatbot's system prompt from
`resumeToText()`. Never hard-code résumé content elsewhere.

To add a section: extend `resume`, add a render function in `render.js`, append
it to the array in `renderResume()`, and add a `.rail__link` in `index.html`.

The CV is drawn once. The **`#experience` timeline** (`.path`) flattens
`r.experience` and `r.education` into one reverse-chronological spine down the
left, a ring per post on it, every post reading off to its right.
Despite the name
it holds the degrees too: there is no Education section, and `path()` reads
both arrays together. It parses the `period` strings, so a period must stay in
`Month YYYY – Month YYYY` form (or `– Present`).

The band under the hero (`.summary`, `#summary`) is prose, not a drawing: one
paragraph, `resume.summary`, on the full-width plate. A proportional career
chart stood there until it said the same thing the timeline says; if a second
drawing of the CV ever comes back, it goes there, not into the main column.

**The screen shows blurbs; only paper shows bullets.** Each role carries a
one-sentence `blurb` next to its `bullets`: `.path` renders both and hides
`.bullets` in screen CSS, and the print block flips it — `.path__blurb` off,
`.bullets` on — so `Cmd+P` still yields a full CV. Change one of those rules
and you silently gut the other view. A `blurb` must be a condensation of that
role's own bullets and may claim nothing they do not; education needs none,
since `detail` already plays that part. `resumeToText()` feeds the chatbot the
bullets, not the blurbs, so it can still answer in detail about work the page
only summarises.

The pill takes `job.short` (`DataX`, not `SCB DataX Co., Ltd.`) so it stays
one line. Colour is the page's own — the spine and the heads' edge are
`--accent`, a head's fill `--paper` until the post is the current one, the
pill `--paper-2` — so dark mode needs no rules of its own. On paper the spine
and heads go and the pill becomes a run-in company name, which is how a CV
writes that line anyway; the summary band prints too, as the first section,
with its eyebrow set like every other section title and the headline dropped.

Only the heads hide behind `is-pending` (`drawOnce()` in `timeline.js`). Never
put the card behind that class — a script that fails to run would swallow the
whole CV.

`resume.decode` drives the hero; its `top` tokens must join back into
`headline[0]` or the hero silently falls back to plain text.

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

One entry is a *collection* rather than a paper: `applied-mathematics` stands
for the eight earlier applied-mathematics papers, which are one row in the
publications list instead of eight. It sets `collection: true` and omits
`authors` (the header drops the author line), and one of its sections carries
`entries` instead of prose — the bibliography, which lives in `earlierPapers`
in `resume-data.js` so the chatbot lists the same eight titles the page does.

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
