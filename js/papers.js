/**
 * papers.js — Paper list and detail rendering
 */

import { loadPapers, getPaperById, getMarkdownForPaper } from './data.js';
import { escapeHtml } from './utils.js';

/**
 * Strip markdown syntax to get plain text for previews.
 */
function stripMarkdown(md) {
  return md
    .replace(/^#{1,6}\s+/gm, '')       // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')    // bold
    .replace(/\*(.+?)\*/g, '$1')        // italic
    .replace(/`(.+?)`/g, '$1')          // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')    // images
    .replace(/\[(.+?)\]\(.*?\)/g, '$1') // links
    .replace(/^\s*[-*+]\s+/gm, '')      // list items
    .replace(/^\s*>\s+/gm, '')          // blockquotes
    .replace(/\n{2,}/g, ' ')            // collapse newlines
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Render the paper list view.
 * @param {HTMLElement} container - The main content container
 * @param {Object} [options] - Optional filter options
 * @param {string} [options.tag] - Filter by tag
 * @param {Array} [options.searchResults] - Pre-filtered search results
 * @param {string} [options.query] - The search query (for display)
 */
export async function renderPapers(container, options = {}) {
  const papers = await loadPapers();
  let displayPapers = papers;
  let subtitle = '';

  // Filter by tag
  if (options.tag) {
    displayPapers = papers.filter(p => p.tags.includes(options.tag));
    subtitle = `Filtered by tag: <span class="tag-badge">${escapeHtml(options.tag)}</span>`;
  }

  // Search results
  if (options.searchResults) {
    displayPapers = options.searchResults;
    subtitle = `${displayPapers.length} result${displayPapers.length !== 1 ? 's' : ''} for "<strong>${escapeHtml(options.query)}</strong>"`;
  }

  let html = '<div class="fade-in">';

  if (subtitle) {
    html += `<div class="search-results-info">${subtitle}
      ${options.tag ? ` <a href="#papers" style="margin-left: var(--space-sm); font-size: var(--font-size-xs);">✕ Clear filter</a>` : ''}
    </div>`;
  }

  if (displayPapers.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>No papers found</h3>
        <p>Try a different search term or browse all papers.</p>
      </div>`;
  } else {
    html += '<div class="cards-grid">';
    for (const item of displayPapers) {
      const paper = item.paper || item; // handle both search results and raw papers
      const modes = item.modes || [];
      html += renderPaperCard(paper, modes);
    }
    html += '</div>';
  }

  html += '</div>';
  container.innerHTML = html;

  // Attach click handlers
  container.querySelectorAll('.card[data-paper-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.tag-badge')) return; // don't navigate when clicking a tag
      window.location.hash = `#paper/${card.dataset.paperId}`;
    });
  });
}

/**
 * Render a single paper card.
 */
function renderPaperCard(paper, modes = []) {
  // Extract plain-text preview from the "What are they doing?" section only
  let rawPreview = '';
  if (paper._markdownContent) {
    const startMarker = /\*\*What are they (?:doing|arguing)\?\*\*/i;
    const endMarker = /\*\*Why do we need it\?\*\*/i;
    const startMatch = startMarker.exec(paper._markdownContent);
    if (startMatch) {
      const afterStart = paper._markdownContent.substring(startMatch.index + startMatch[0].length);
      const endMatch = endMarker.exec(afterStart);
      const section = endMatch ? afterStart.substring(0, endMatch.index) : afterStart;
      rawPreview = stripMarkdown(section);
    } else {
      rawPreview = stripMarkdown(paper._markdownContent);
    }
  }
  const preview = rawPreview.length > 200 ? rawPreview.substring(0, 200) + '…' : rawPreview;

  const modeBadges = modes.map(m =>
    `<span class="search-mode-badge ${m}">${m}</span>`
  ).join(' ');

  return `
    <div class="card" data-paper-id="${paper.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(paper.title)}">
      <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-sm);">
        <h3 class="card-title">${escapeHtml(paper.title)}</h3>
        ${modeBadges ? `<div style="display: flex; gap: var(--space-xs); flex-shrink: 0;">${modeBadges}</div>` : ''}
      </div>
      <div class="card-meta">
        <span>${escapeHtml(paper.authors.slice(0, 3).join(', '))}${paper.authors.length > 3 ? ' et al.' : ''}</span>
        <span>${paper.year}</span>
      </div>
      <p class="card-summary">${escapeHtml(preview)}</p>
      <div class="card-tags">
        ${paper.tags.map(t => `<a href="#papers?tag=${encodeURIComponent(t)}" class="tag-badge" onclick="event.stopPropagation()">${escapeHtml(t)}</a>`).join('')}
      </div>
    </div>`;
}

/**
 * Render the detail view for a single paper.
 * @param {HTMLElement} container
 * @param {string} paperId
 */
export async function renderPaperDetail(container, paperId) {
  const paper = await getPaperById(paperId);

  if (!paper) {
    container.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-icon">🔍</div>
        <h3>Paper not found</h3>
        <p>The paper you're looking for doesn't exist.</p>
        <a href="#papers" class="btn" style="margin-top: var(--space-md);">← Back to Papers</a>
      </div>`;
    return;
  }

  // Get markdown content and render to HTML
  const markdown = getMarkdownForPaper(paper);
  // marked extension to handle {: .classname} or {: width="x"} after images
  let figureCount = 0;
  let tableCount = 0;
  marked.use({
    extensions: [{
      name: 'imageWithSize',
      level: 'inline',
      start(src) { return src.match(/!\[/)?.index; },
      tokenizer(src, tokens) {
        const rule = /^!\[([^\]]*)\]\(([^)]+)\)(?:\(((?:[^)(]|\([^)]*\))*)\))?(?:\{:([^}]+)\})?/;
        const match = rule.exec(src);
        if (match) {
          const attrs = match[4] || '';
          const classes = (attrs.match(/\.([\w-]+)/g) || []).map(c => c.slice(1)).join(' ');
          const widthMatch = attrs.match(/width="([^"]+)"/);
          return {
            type: 'imageWithSize',
            raw: match[0],
            text: match[1],
            href: match[2],
            caption: match[3] || null,
            className: classes || null,
            width: widthMatch ? widthMatch[1] : null
          };
        }
      },
      renderer(token) {
        let title = token.caption || '';
        const href = token.href;

        if (/^Figure\s*:/i.test(title)) {
          figureCount++;
          title = title.replace(/^Figure\s*:/i, `Figure ${figureCount}:`);
        } else if (/^Table\s*:/i.test(title)) {
          tableCount++;
          title = title.replace(/^Table\s*:/i, `Table ${tableCount}:`);
        }

        const classAttr = ` class="${token.className || 'img-half'}"`;  // default to img-half if no explicit class
        const widthAttr = token.width ? ` style="width: ${token.width};"` : '';
        const altAttr = token.text ? ` alt="${escapeHtml(token.text)}"` : '';
        const img = `<img src="${encodeURI(href)}"${altAttr}${classAttr}${widthAttr}>`;
        if (title) {
          return `<figure>${img}<figcaption>${escapeHtml(title)}</figcaption></figure>`;
        }
        return img;
      }
    }]
  });

  // marked extension for KaTeX (math equations)
  if (window.markedKatex) {
    marked.use(window.markedKatex({
      throwOnError: false
    }));
  }

  const renderedHtml = marked.parse(markdown);

  let html = `
    <div class="paper-detail fade-in">
      <a href="#papers" class="back-link">← Back to Papers</a>
      <h1>${escapeHtml(paper.title)}${paper.url ? ` <a href="${escapeHtml(paper.url)}" target="_blank" rel="noopener noreferrer" class="paper-external-link" title="View original paper"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}</h1>
      <div class="card-meta" style="font-size: var(--font-size-sm);">
        <span>${escapeHtml(paper.authors.join(', '))}</span>
        <span>${paper.year}</span>
      </div>
      <div class="card-tags" style="margin-bottom: var(--space-xl);">
        ${paper.tags.map(t => `<a href="#papers?tag=${encodeURIComponent(t)}" class="tag-badge">${escapeHtml(t)}</a>`).join('')}
      </div>

      <div class="markdown-body">
        ${renderedHtml}
      </div>

      <div style="margin-top: var(--space-xl); font-size: var(--font-size-xs); color: var(--color-muted);">
        Added on ${paper.dateAdded}
      </div>
    </div>`;

  container.innerHTML = html;
}
