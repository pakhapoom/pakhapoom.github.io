# Literature Vault

A static site for storing, searching, and exploring academic paper summaries.
Pure HTML5, vanilla CSS, and vanilla JS (ES modules) with CDN libraries — no build step, no backend.

![Landing Page](assets/site/landing-page.png)

Deployed at: https://pakhapoom.github.io/

## Running locally

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

No install, no build. Deploying means pushing to the `main` branch.

## Project structure

```
index.html          App shell (sidebar, header, content container)
css/styles.css      All styles
js/
  app.js            Entry point: hash routing, search bar wiring
  data.js           Loads papers/*.md, parses YAML frontmatter, caches
  search.js         Exact + fuzzy (Fuse.js) + TF-IDF search
  markdown.js       marked.js setup: image sizing/captions, video embeds, KaTeX
  papers.js         Paper card grid and detail view
  graph.js          Knowledge graph (D3 force layout)
  tags.js           Stats dashboard (Chart.js)
  landing.js        Landing page (+ background.js canvas animation)
  about.js          About page
  utils.js          Shared helpers
data/index.json     Generated list of paper files (newest first)
papers/<slug>.md    One markdown file per paper (YAML frontmatter + summary)
assets/<slug>/      Figures for each paper
assets/site/        Site-level imagery (portrait, og thumbnail, screenshot)
scripts/pre-commit  Git hook that regenerates data/index.json
```

## Setup after cloning

A git hook keeps `data/index.json` in sync automatically. Install it once after cloning:

```bash
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

After that, `data/index.json` is updated on every `git commit` — no manual edits needed.

## Adding a paper

1. Create `papers/<slug>.md` with YAML frontmatter (`title`, `authors`, `year`, `tags`, `url`, `dateAdded`).
2. Put any figures in `assets/<slug>/`.
3. Commit — the pre-commit hook regenerates `data/index.json`.
