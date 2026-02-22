/**
 * search.js — Search engine module
 * Provides exact match, fuzzy (Fuse.js), and TF-IDF search.
 */

let fuseInstance = null;
let tfidfIndex = null;

// ---- Stopwords for TF-IDF ----
const STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'it', 'as', 'be', 'was', 'were',
    'are', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'can', 'this', 'that', 'these',
    'those', 'not', 'no', 'so', 'if', 'than', 'then', 'its', 'also',
    'into', 'such', 'which', 'what', 'when', 'where', 'how', 'who',
    'we', 'our', 'their', 'they', 'them', 'he', 'she', 'his', 'her',
    'i', 'me', 'my', 'you', 'your', 'more', 'most', 'very', 'each',
    'about', 'up', 'out', 'over', 'all', 'some', 'any', 'only', 'other'
]);

/**
 * Extract all searchable text from a paper as a single string.
 */
function getSearchableText(paper) {
    const parts = [
        paper.title,
        paper.authors.join(' '),
        paper.tags.join(' '),
        paper.summary.researchQuestions || '',
        paper.summary.methodology || '',
        paper.summary.discussion || '',
        paper.summary.notes || ''
    ];
    return parts.join(' ');
}

/**
 * Tokenize text: lowercase, split on non-alphanumeric, remove stopwords.
 */
function tokenize(text) {
    return text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

// ---- TF-IDF Engine ----

/**
 * Build TF-IDF index from an array of papers.
 */
function buildTFIDFIndex(papers) {
    const N = papers.length;
    const docs = [];
    const df = {}; // document frequency for each term

    // Compute TF for each document and DF across corpus
    for (const paper of papers) {
        const text = getSearchableText(paper);
        const tokens = tokenize(text);
        const tf = {};
        for (const token of tokens) {
            tf[token] = (tf[token] || 0) + 1;
        }
        // Normalize TF
        const maxTf = Math.max(...Object.values(tf), 1);
        for (const term in tf) {
            tf[term] = tf[term] / maxTf;
        }
        docs.push({ paper, tf, tokenCount: tokens.length });

        // Count DF
        const uniqueTerms = new Set(tokens);
        for (const term of uniqueTerms) {
            df[term] = (df[term] || 0) + 1;
        }
    }

    // Compute IDF
    const idf = {};
    for (const term in df) {
        idf[term] = Math.log(N / df[term]) + 1; // smoothed IDF
    }

    tfidfIndex = { docs, idf, N };
}

/**
 * Search using TF-IDF index.
 * @returns {Array<{paper, score}>} sorted by score descending
 */
function searchTFIDF(query) {
    if (!tfidfIndex) return [];

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const results = [];

    for (const doc of tfidfIndex.docs) {
        let score = 0;
        for (const token of queryTokens) {
            const tf = doc.tf[token] || 0;
            const idf = tfidfIndex.idf[token] || 0;
            score += tf * idf;
        }
        if (score > 0) {
            results.push({ paper: doc.paper, score });
        }
    }

    results.sort((a, b) => b.score - a.score);
    return results;
}

// ---- Exact Match ----

/**
 * Case-insensitive substring match across all searchable fields.
 */
function searchExact(papers, query) {
    const q = query.toLowerCase();
    return papers.filter(paper => {
        const text = getSearchableText(paper).toLowerCase();
        return text.includes(q);
    });
}

// ---- Fuzzy (Fuse.js) ----

/**
 * Initialize or return the Fuse.js instance.
 */
function getFuseInstance(papers) {
    if (fuseInstance) return fuseInstance;

    fuseInstance = new Fuse(papers, {
        keys: [
            { name: 'title', weight: 3 },
            { name: 'authors', weight: 2 },
            { name: 'tags', weight: 2 },
            { name: 'summary.researchQuestions', weight: 1 },
            { name: 'summary.methodology', weight: 1 },
            { name: 'summary.discussion', weight: 1 },
            { name: 'summary.notes', weight: 1 }
        ],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2
    });

    return fuseInstance;
}

// ---- Public API ----

/**
 * Initialize the search engine with paper data.
 * Must be called before search().
 */
export function initSearch(papers) {
    getFuseInstance(papers);
    buildTFIDFIndex(papers);
}

/**
 * Search across all modes and return merged, deduplicated results.
 * @param {Array} papers - All papers
 * @param {string} query - The search query
 * @returns {Array<{paper, modes: string[]}>}
 */
export function search(papers, query) {
    if (!query || query.trim().length === 0) return [];

    const q = query.trim();

    // 1. Exact match
    const exactResults = searchExact(papers, q);
    const exactIds = new Set(exactResults.map(p => p.id));

    // 2. Fuzzy match
    const fuse = getFuseInstance(papers);
    const fuseResults = fuse.search(q);
    const fuzzyPapers = fuseResults.map(r => r.item);
    const fuzzyIds = new Set(fuzzyPapers.map(p => p.id));

    // 3. TF-IDF
    const tfidfResults = searchTFIDF(q);
    const tfidfPapers = tfidfResults.map(r => r.paper);

    // Merge with priority: exact > fuzzy > tfidf
    const merged = [];
    const seen = new Set();

    // Add exact matches first
    for (const paper of exactResults) {
        const modes = ['exact'];
        if (fuzzyIds.has(paper.id)) modes.push('fuzzy');
        merged.push({ paper, modes });
        seen.add(paper.id);
    }

    // Add fuzzy-only matches
    for (const paper of fuzzyPapers) {
        if (seen.has(paper.id)) continue;
        merged.push({ paper, modes: ['fuzzy'] });
        seen.add(paper.id);
    }

    // Add TF-IDF-only matches
    for (const paper of tfidfPapers) {
        if (seen.has(paper.id)) continue;
        merged.push({ paper, modes: ['tfidf'] });
        seen.add(paper.id);
    }

    return merged;
}
