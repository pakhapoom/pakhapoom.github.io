/**
 * data.js — Data loader module
 * Fetches papers.json and markdown summaries, provides helper accessors.
 */

let _papers = null;
let _markdownCache = new Map();

/**
 * Load all papers from data/papers.json.
 * Also fetches and caches all markdown summaries for search indexing.
 * @returns {Promise<Array>} Array of paper objects (with _markdownContent attached)
 */
export async function loadPapers() {
  if (_papers) return _papers;

  try {
    const response = await fetch('data/papers.json');
    if (!response.ok) throw new Error(`Failed to load papers: ${response.status}`);
    _papers = await response.json();

    // Fetch all markdown summaries in parallel
    const mdPromises = _papers.map(async (paper) => {
      try {
        const md = await fetchMarkdown(paper.summaryFile);
        paper._markdownContent = md;
      } catch {
        paper._markdownContent = '';
      }
    });
    await Promise.all(mdPromises);

    return _papers;
  } catch (err) {
    console.error('Error loading papers:', err);
    _papers = [];
    return _papers;
  }
}

/**
 * Fetch a markdown file and cache its content.
 * @param {string} path - Relative path to the markdown file
 * @returns {Promise<string>} Raw markdown content
 */
async function fetchMarkdown(path) {
  if (_markdownCache.has(path)) return _markdownCache.get(path);

  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  const text = await response.text();
  _markdownCache.set(path, text);
  return text;
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
 * @param {Object} paper - Paper object
 * @returns {Promise<string>} Raw markdown string
 */
export async function getMarkdownForPaper(paper) {
  if (paper._markdownContent) return paper._markdownContent;
  return fetchMarkdown(paper.summaryFile);
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
