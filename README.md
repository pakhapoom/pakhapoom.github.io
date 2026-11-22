# pakhapoom.github.io

Interactive online résumé for **Pakhapoom Sarapat, PhD**, live at
<https://pakhapoom.github.io/>. A static GitHub Pages site (vanilla HTML, CSS,
ES modules; no build step) plus a Cloudflare Worker that powers a
résumé-grounded chat widget.

The previous Literature Vault site is on the `literature-vault` branch.

## Structure

```
index.html            page shell, chat widget markup
css/styles.css        light / dark / print styles
js/resume-data.js     the résumé — single source of truth
js/render.js          builds the page from resume-data.js
js/chat.js            chat widget (SSE streaming, markdown)
js/views.js           page-view beacon to the Worker's /view route
js/session.js         the per-tab id shared by chat and view logs
js/config.js          chat endpoint (dev vs production)
js/main.js            boot, theme toggle, scroll-spy
js/decode.js          hero: the job title emitted token by token
js/timeline.js        Experience timeline: pops the rings in, once
js/papers-data.js     long-form write-up for each publication
js/paper.js           renders one write-up into papers/<slug>.html
papers/<slug>.html    per-paper page shells (generated, then committed)
public/               photo and organization logos (logos are unused today)
public/papers/<slug>/ figures taken from the papers themselves
worker/index.js       Typhoon proxy: key, system prompt, CORS, rate limit,
                      output guard, per-turn logging; /view page counts
scripts/dev.sh        runs the Worker locally with the key from .env
scripts/og-card.html  the link-preview image's source, read from resume-data.js
scripts/og-card.sh    renders it to public/og-card.png (needs Chrome)
```

To update the résumé, edit `js/resume-data.js`. The page and the chatbot both
read from it.

## Running locally

```bash
python3 -m http.server 8000   # site → http://localhost:8000
./scripts/dev.sh              # chat → http://localhost:8787
```

Put `TYPHOON_API_KEY` in `.env`. `js/config.js` uses the local Worker
automatically on localhost. The site works without the Worker; only chat needs
it.

## Deploying

**Site:** push to `main`; `.github/workflows/pages.yml` publishes the repo root.

**Worker:**

```bash
cd worker
npx wrangler secret put TYPHOON_API_KEY
npx wrangler deploy
```

Then set `PRODUCTION_ENDPOINT` in `js/config.js` to the deployed `/chat` URL.

## Chat widget

The browser sends only visitor turns to the Worker, which adds the system
prompt and API key and streams the reply from Typhoon
(`typhoon-v2.5-30b-a3b-instruct`). The key never reaches the browser.

Worker limits: CORS restricted to `pakhapoom.github.io` and localhost, 20
requests/min per IP, 24 messages and 1000 chars per message, `user`/`assistant`
roles only.

The Worker also cuts the stream if the model opens a fenced code block. The
assistant never legitimately emits one, so it is enforced outside the prompt,
where visitor input can't argue with it.

## Chat logs

Every answered turn is written to the Worker's log as one JSON line:

```json
{"kind":"chat","at":"2026-09-22T15:42:01.003Z","session":"11111111-2222-…",
 "question":"how long has he been there?",
 "reply":"Pakhapoom has been with DataX since February 2022…",
 "chars":140,"cut":false}
```

`session` is a random UUID in `sessionStorage`: per tab, discarded when the tab
closes, derived from nothing about the visitor. It groups the turns of one
conversation, so a follow-up can be read next to what it was following up on.
No IP, user agent, or location is recorded — this is a record of what was
asked, not of who asked it.

`cut: true` marks a reply the output guard truncated. Those are the ones worth
reading: they are where the model was talked into starting something it
shouldn't have.

**Live** — only shows traffic while it runs:

```bash
cd worker
npx wrangler tail --format pretty              # every request
npx wrangler tail --search '"kind":"chat"'     # just the turns
```

**Retrospectively** — Cloudflare dashboard → Workers & Pages → `resume-chat` →
Logs. Retained because `[observability]` is enabled in `worker/wrangler.toml`;
the dashboard shows the retention window that applies to the account's plan.
The lines are structured, so they can be filtered by field — `cut = true` for
near-misses, or grouped by `question` to see what visitors actually ask.

Enabling or changing `[observability]` only takes effect on the next
`wrangler deploy`.

## Page views

Every page (home and each `papers/<slug>.html`) sends one beacon on load to
the same Worker's `/view` route, which logs one line next to the chat turns:

```json
{"kind":"view","at":"2026-11-22T03:51:01.608Z","session":"16cbd514-…",
 "path":"/papers/latb.html","ref":"www.linkedin.com","src":"linkedin"}
```

- `path` — the page viewed.
- `ref` — the referring site's hostname only, empty when the browser sends
  none (typed URLs, most mobile apps).
- `src` — the link's `utm_source`, if any. Tag links you post yourself
  (`?utm_source=linkedin`) to tell them apart when `ref` is empty.
- `session` — the same per-tab id chat sends, so a visit's views and its chat
  turns line up.

Same privacy rule as chat: no IP, user agent or location. Visitors sending
Global Privacy Control or Do Not Track are not counted. Beacons from any origin
other than the site are dropped, and `/view` has its own 30/min per-IP limit so
it never spends a visitor's chat allowance.

Read them like the chat logs — `wrangler tail --search '"kind":"view"'`, or
filter `kind = view` in the dashboard and group by `path`, `ref` or `src`. The
free plan keeps logs for about 3 days; export them if you want longer trends.

The route ships with the Worker, so it starts counting after the next
`wrangler deploy`. Until then the beacons fail silently.
