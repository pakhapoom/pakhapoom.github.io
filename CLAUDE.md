# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Literature Vault** is a static GitHub Pages site for storing, searching, and exploring academic paper summaries. No build step, no backend — pure HTML5, vanilla CSS, and vanilla JS (ES modules) with CDN libraries.

Deployed at: `https://pakhapoom.github.io/`

## Running Locally

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

No install, no build. Deploying means pushing to the `main` branch.

## Git Hooks

A pre-commit hook at `.git/hooks/pre-commit` auto-regenerates `data/index.json` on every commit — scanning `papers/*.md` and sorting by `dateAdded` descending. Since `.git/` is not tracked, reinstall it after a fresh clone:

```bash
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Adding a Paper

1. Create `papers/<slug>.md` with YAML frontmatter:
   ```yaml
   ---
   title: "Paper Title"
   authors: ["Author One", "Author Two"]
   year: 2025
   tags: ["tag1", "tag2"]
   url: https://arxiv.org/abs/...
   dateAdded: "2025-01-01"
   ---
   ```
2. Place any images in `assets/<slug>/` (site-level imagery lives in `assets/site/`)

## Architecture

### Routing
`js/app.js` handles hash-based routing (`#home`, `#papers`, `#paper/:id`, `#graph`, `#tags`, `#about`). Each route calls a render function from the corresponding module that clears and repopulates `#content-body`.

### Data Flow
`js/data.js` fetches `data/index.json`, then lazily loads each `.md` file and parses YAML frontmatter. Papers are cached in a module-level singleton after first load. All other modules import from `data.js`.

### Search (`js/search.js`)
Three-mode search merged by priority: **exact match** > **fuzzy (Fuse.js)** > **TF-IDF**. Title is weighted 3×, authors/tags 2×, content 1×. Results deduplicated with mode annotations.

### Page Modules
| Module | Responsibility |
|--------|---------------|
| `landing.js` | Landing page with animated canvas background (`background.js`) |
| `papers.js` | Paper card grid and full paper detail view |
| `markdown.js` | marked.js configuration and custom extensions (images, video embeds, KaTeX) |
| `graph.js` | Knowledge graph of papers connected by shared tags (D3 force layout) |
| `tags.js` | Statistics dashboard with Chart.js (timeline, tag distribution) |
| `about.js` | About page with hardcoded publications list |
| `utils.js` | Shared helpers: `escapeHtml`, `safeUrl`, `showLoading`, `MOBILE_BREAKPOINT` |

### Markdown Papers
Papers use marked.js with custom extensions defined in `js/markdown.js`:
- Images with captions and sizing: `![alt](url)(Figure: caption){: .img-half width="80%"}` — `Figure:`/`Table:` captions are auto-numbered
- YouTube embeds via `[video](youtube-url)`
- KaTeX math rendering via `$...$` and `$$...$$`

### External Libraries (CDN only)
Fuse.js, Chart.js, marked.js, D3.js, KaTeX, Google Fonts (Inter, Outfit). No package.json, no node_modules.
