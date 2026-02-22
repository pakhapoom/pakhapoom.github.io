# Literature Vault — Project Specifications

> A static GitHub Pages site for storing, searching, and exploring summaries of academic papers.

---

## 1. Paper Data Model

Each paper entry in `papers.json` contains metadata. The summary itself lives in a separate **Markdown file**.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier (slug) |
| `title` | `string` | ✅ | Paper title |
| `authors` | `string[]` | ✅ | List of author names |
| `year` | `number` | ✅ | Publication year |
| `tags` | `string[]` | ✅ | Categorization tags (used in search & stats) |
| `url` | `string` | ❌ | Link to the original paper |
| `summaryFile` | `string` | ✅ | Path to the markdown summary (relative to repo root, e.g. `papers/attention-is-all-you-need.md`) |
| `dateAdded` | `string` | ✅ | ISO 8601 date when the entry was created |

### Example JSON Entry

```json
{
  "id": "attention-is-all-you-need",
  "title": "Attention Is All You Need",
  "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
  "year": 2017,
  "tags": ["transformer", "attention", "nlp", "deep-learning"],
  "url": "https://arxiv.org/abs/1706.03762",
  "summaryFile": "papers/attention-is-all-you-need.md",
  "dateAdded": "2026-02-22"
}
```

### Full File Format (`papers.json`)

```json
[
  { "id": "...", "title": "...", "summaryFile": "papers/....md", ... },
  { "id": "...", "title": "...", "summaryFile": "papers/....md", ... }
]
```

### Summary Markdown File

Each paper has a `.md` file in the `papers/` directory. The author is free to use **any Markdown structure** — there are no required sections. A suggested template:

```markdown
## Research Questions

What the paper investigates...

## Methodology

How the research was conducted...

## Discussion

Key findings and interpretations...

## Notes

Personal notes or takeaways...

![Figure 1: Architecture](../assets/attention-is-all-you-need/architecture.png)
```

Images referenced in markdown files are stored in the `assets/` directory, organized by paper ID:

```
assets/
└── attention-is-all-you-need/
    ├── architecture.png
    └── results-table.png
```

---

## 2. Features

### 2.1 Paper Browsing

- Display all papers in a clean, card-based list
- Each card shows: title, authors, year, tags, and a truncated preview of the summary
- Click a card to see the full summary rendered from Markdown
- Link to the original paper opens in a new tab

### 2.2 Search

Search queries are matched against **title**, **authors**, **tags**, and **markdown summary content**.

| Mode | Description |
|------|-------------|
| **Exact match** | Case-insensitive substring matching |
| **Fuzzy search** | Tolerant of typos and partial matches (via [Fuse.js](https://www.fusejs.io/)) |
| **TF-IDF** | Ranks results by term relevance across the corpus |

The user types a query in a single search bar. The system runs all three modes and merges results, prioritising exact matches first.

### 2.3 Tag Statistics

- Show a summary of all tags with occurrence counts
- Visual chart (bar or word cloud) of tag distribution
- Each tag is clickable → filters the paper list to that tag

### 2.4 Add Paper (UI Form)

- A form to input paper metadata fields
- On submit, generates:
  1. The **JSON entry** to add to `papers.json`
  2. A **Markdown template** file to copy into `papers/<id>.md`
- This keeps the site fully static — no backend required

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | Vanilla CSS (minimalist, clean aesthetic) |
| Logic | Vanilla JavaScript (ES modules) |
| Markdown | marked.js (renders .md to HTML) |
| Search | Fuse.js (fuzzy) + custom TF-IDF implementation |
| Charts | Chart.js |
| Data | `papers.json` + `papers/*.md` (static files in repo) |
| Hosting | GitHub Pages |

---

## 4. Design Direction

- **Minimalist and clean** — generous whitespace, restrained color palette
- **Typography-first** — modern sans-serif font (e.g., Inter)
- **Neutral tones** with a single accent color for interactive elements
- **Responsive** — works on desktop and mobile
- Subject to user feedback — design will be iterated

---

## 5. Pages / Views

| View | Description |
|------|-------------|
| **Home / Papers** | Searchable list of all papers |
| **Paper Detail** | Rendered Markdown summary with full metadata |
| **Tags / Stats** | Tag cloud / chart + clickable tag filtering |
| **Add Paper** | Form to compose a new paper entry + markdown template |

---

## 6. Directory Structure

```
github-page/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── papers.js
│   ├── search.js
│   ├── tags.js
│   └── form.js
├── data/
│   └── papers.json
├── papers/                     # One .md file per paper
│   ├── attention-is-all-you-need.md
│   ├── bert-pre-training.md
│   └── ...
├── assets/                     # Images referenced by summaries
│   ├── attention-is-all-you-need/
│   │   └── architecture.png
│   └── ...
└── SPEC.md
```

---

## 7. Workflow for Adding Papers

1. Open the **Add Paper** form on the site
2. Fill in the metadata fields (title, authors, year, tags, url)
3. Click **Generate** → JSON entry + Markdown template are shown
4. Copy the JSON entry → add it to the array in `data/papers.json`
5. Copy the Markdown template → save as `papers/<id>.md`
6. Add any images to `assets/<id>/`
7. Commit and push → GitHub Pages auto-deploys
