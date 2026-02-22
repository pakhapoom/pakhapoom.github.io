/**
 * data.js — Data loader module
 * Loads papers from individual markdown files with YAML frontmatter.
 * No external YAML parser needed — uses a lightweight built-in parser.
 */

let _papers = null;

/**
 * Parse YAML frontmatter from a markdown string.
 * Handles: strings, numbers, arrays (JSON-style), and bare values.
 * @param {string} raw - Full markdown file content
 * @returns {{ meta: Object, content: string }}
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const yamlBlock = match[1];
  const content = match[2].trim();
  const meta = {};

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.substring(0, colonIdx).trim();
    let value = trimmed.substring(colonIdx + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Parse JSON-style arrays
    else if (value.startsWith('[')) {
      try {
        value = JSON.parse(value);
      } catch {
        // fallback: keep as string
      }
    }
    // Parse numbers
    else if (/^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }

    meta[key] = value;
  }

  return { meta, content };
}

/**
 * Load all papers from individual markdown files listed in papers/index.json.
 * Parses YAML frontmatter for metadata, keeps markdown body for rendering.
 * @returns {Promise<Array>} Array of paper objects
 */
export async function loadPapers() {
  if (_papers) return _papers;

  try {
    // Fetch the index of paper filenames
    const indexRes = await fetch('papers/index.json');
    if (!indexRes.ok) throw new Error(`Failed to load index: ${indexRes.status}`);
    const filenames = await indexRes.json();

    // Fetch all markdown files in parallel
    const paperPromises = filenames.map(async (filename) => {
      const res = await fetch(`papers/${filename}`);
      if (!res.ok) {
        console.warn(`Failed to load papers/${filename}: ${res.status}`);
        return null;
      }
      const raw = await res.text();
      const { meta, content } = parseFrontmatter(raw);

      // Derive ID from filename (strip .md extension)
      const id = filename.replace(/\.md$/, '');

      return {
        id,
        title: meta.title || id,
        authors: meta.authors || [],
        year: meta.year || 0,
        tags: meta.tags || [],
        url: meta.url || '',
        dateAdded: meta.dateAdded || '',
        _markdownContent: content,
        _filename: filename
      };
    });

    _papers = (await Promise.all(paperPromises)).filter(Boolean);
    return _papers;
  } catch (err) {
    console.error('Error loading papers:', err);
    _papers = [];
    return _papers;
  }
}

/**
 * Get a single paper by its ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPaperById(id) {
  const papers = await loadPapers();
  return papers.find(p => p.id === id) || null;
}

/**
 * Get the markdown content for a paper.
 * @param {Object} paper
 * @returns {string}
 */
export function getMarkdownForPaper(paper) {
  return paper._markdownContent || '';
}

/**
 * Get a map of all tags with their occurrence counts.
 * @returns {Promise<Map<string, number>>}
 */
export async function getAllTags() {
  const papers = await loadPapers();
  const tagMap = new Map();
  for (const paper of papers) {
    for (const tag of paper.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return tagMap;
}

/**
 * Get total count of papers.
 * @returns {Promise<number>}
 */
export async function getPaperCount() {
  const papers = await loadPapers();
  return papers.length;
}
