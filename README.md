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
js/config.js          chat endpoint (dev vs production)
js/main.js            boot, theme toggle, scroll-spy
worker/index.js       Typhoon API proxy: key, system prompt, CORS, rate limit
scripts/dev.sh        runs the Worker locally with the key from .env
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
