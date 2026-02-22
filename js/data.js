/**
 * data.js — Data loader module
 * Fetches papers.json and provides helper accessors.
 */

let _papers = null;

/**
 * Load all papers from data/papers.json.
 * Caches the result after the first call.
 * @returns {Promise<Array>} Array of paper objects
 */
export async function loadPapers() {
  if (_papers) return _papers;

  try {
    const response = await fetch('data/papers.json');
    if (!response.ok) throw new Error(`Failed to load papers: ${response.status}`);
    _papers = await response.json();
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
