# Literature Vault — Project Specifications

> A static GitHub Pages site for storing, searching, and exploring summaries of academic papers.

---

## 1. Paper Data Model

Each paper entry contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier (e.g., UUID or slug) |
| `title` | `string` | ✅ | Paper title |
| `authors` | `string[]` | ✅ | List of author names |
| `year` | `number` | ✅ | Publication year |
| `tags` | `string[]` | ✅ | Categorization tags (used in search & stats) |
| `url` | `string` | ❌ | Link to the original paper |
| `summary` | `object` | ✅ | Structured summary (see below) |
| `dateAdded` | `string` | ✅ | ISO 8601 date when the entry was created |

### Summary Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `researchQuestions` | `string` | ❌ | What the paper investigates |
| `methodology` | `string` | ❌ | How the research was conducted |
| `discussion` | `string` | ❌ | Key findings and interpretations |
| `notes` | `string` | ❌ | Personal notes or takeaways |

### Example JSON

```json
{
  "id": "attention-is-all-you-need",
  "title": "Attention Is All You Need",
  "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
  "year": 2017,
  "tags": ["transformer", "attention", "nlp", "deep-learning"],
  "url": "https://arxiv.org/abs/1706.03762",
  "summary": {
    "researchQuestions": "Can a model based entirely on attention mechanisms replace recurrent layers for sequence transduction?",
    "methodology": "Proposed the Transformer architecture using multi-head self-attention and positional encoding. Evaluated on WMT 2014 EN-DE and EN-FR translation tasks.",
    "discussion": "The Transformer achieves state-of-the-art BLEU scores while being significantly faster to train than recurrent or convolutional models.",
    "notes": "This is the foundational paper for modern LLMs. The multi-head attention mechanism is the key innovation."
  },
  "dateAdded": "2026-02-22"
}
```

### Full File Format (`papers.json`)

The data file is a JSON array of paper objects:

```json
[
  { "id": "...", "title": "...", ... },
  { "id": "...", "title": "...", ... }
]
```

---

## 2. Features

### 2.1 Paper Browsing

- Display all papers in a clean, card-based list
- Each card shows: title, authors, year, tags, and a truncated summary
- Click a card to expand and see the full structured summary
- Link to the original paper opens in a new tab

### 2.2 Search

Search queries are matched against **title**, **authors**, **tags**, and **all summary fields**.

| Mode | Description |
|------|-------------|
| **Exact match** | Case-insensitive substring matching |
| **Fuzzy search** | Tolerant of typos and partial matches (via [Fuse.js](https://www.fusejs.io/)) |
| **TF-IDF** | Ranks results by term relevance across the corpus — surfaces papers where search terms carry the most weight |

The user types a query in a single search bar. The system runs all three modes and merges results, prioritising exact matches first.

### 2.3 Tag Statistics

- Show a summary of all tags with occurrence counts
- Visual chart (bar or word cloud) of tag distribution
- Each tag is clickable → filters the paper list to that tag

### 2.4 Add Paper (UI Form)

- A form to input all paper fields
- On submit, generates the JSON entry and allows the user to **copy** it (for pasting into `papers.json` and committing to the repo)
- This keeps the site fully static — no backend required

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | Vanilla CSS (minimalist, clean aesthetic) |
| Logic | Vanilla JavaScript (ES modules) |
| Search | Fuse.js (fuzzy) + custom TF-IDF implementation |
| Charts | Chart.js |
| Data | `papers.json` (static file in repo) |
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
| **Paper Detail** | Expanded view of a single paper's full summary |
| **Tags / Stats** | Tag cloud / chart + clickable tag filtering |
| **Add Paper** | Form to compose a new paper entry |

---

## 6. Workflow for Adding Papers

1. Open the **Add Paper** form on the site
2. Fill in the fields (title, authors, year, tags, summary sections)
3. Click **Generate JSON** → the formatted JSON is shown
4. Copy the JSON entry
5. Add it to `papers.json` in the repository
6. Commit and push → GitHub Pages auto-deploys
