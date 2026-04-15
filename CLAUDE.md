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
2. Place any images in `assets/<slug>/`

## Architecture

### Routing
`js/app.js` handles hash-based routing (`#home`, `#papers`, `#paper/:id`, `#tags`, `#about`). Each route calls a render function from the corresponding module that clears and repopulates `#main-content`.

### Data Flow
`js/data.js` fetches `data/index.json`, then lazily loads each `.md` file and parses YAML frontmatter. Papers are cached in a module-level singleton after first load. All other modules import from `data.js`.

### Search (`js/search.js`)
Three-mode search merged by priority: **exact match** > **fuzzy (Fuse.js)** > **TF-IDF**. Title is weighted 3×, authors/tags 2×, content 1×. Results deduplicated with mode annotations.

### Page Modules
| Module | Responsibility |
|--------|---------------|
| `landing.js` | Landing page with animated canvas background (`background.js`) |
| `papers.js` | Paper card grid and full paper detail view (markdown → HTML via marked.js, KaTeX math) |
| `tags.js` | Statistics dashboard with Chart.js (timeline, tag distribution, co-occurrence) |
| `about.js` | About page with hardcoded publications list |

### Markdown Papers
Papers use marked.js with two custom extensions defined in `js/papers.js`:
- Image sizing via `![alt|WxH](url)` syntax
- KaTeX math rendering via `$...$` and `$$...$$`

### External Libraries (CDN only)
Fuse.js, Chart.js, marked.js, KaTeX, Google Fonts (Inter, Outfit). No package.json, no node_modules.
