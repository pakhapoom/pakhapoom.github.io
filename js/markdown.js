/**
 * markdown.js — Markdown rendering via marked.js with custom extensions
 *
 * Extensions (registered once at module level):
 *   - videoEmbed:    [video](youtube-url) → responsive iframe embed
 *   - imageWithSize: ![alt](src)(Caption){: .class width="x"} → figure with
 *                    auto-numbered "Figure N:" / "Table N:" captions
 *   - KaTeX math:    $...$ and $$...$$ via marked-katex-extension
 */

import { escapeHtml } from './utils.js';

// Auto-numbering counters for figure/table captions, reset per document
let figureCount = 0;
let tableCount = 0;

const videoEmbed = {
  name: 'videoEmbed',
  level: 'block',
  start(src) { return src.match(/^\[video\]/)?.index; },
  tokenizer(src) {
    const match = /^\[video\]\(([^)]+)\)/.exec(src);
    if (match) return { type: 'videoEmbed', raw: match[0], url: match[1].trim() };
  },
  renderer(token) {
    const url = token.url;
    const idMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) ||
                    url.match(/[?&]v=([A-Za-z0-9_-]+)/) ||
                    url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
    if (!idMatch) return `<p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`;
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1rem 0;">` +
      `<iframe src="https://www.youtube.com/embed/${idMatch[1]}" ` +
      `style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe></div>`;
  }
};

const imageWithSize = {
  name: 'imageWithSize',
  level: 'inline',
  start(src) { return src.match(/!\[/)?.index; },
  tokenizer(src) {
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

    if (/^Figure\s*:/i.test(title)) {
      figureCount++;
      title = title.replace(/^Figure\s*:/i, `Figure ${figureCount}:`);
    } else if (/^Table\s*:/i.test(title)) {
      tableCount++;
      title = title.replace(/^Table\s*:/i, `Table ${tableCount}:`);
    }

    const classAttr = ` class="${token.className || 'img-half'}"`;  // default to img-half if no explicit class
    const widthAttr = token.width ? ` style="width: ${token.width}; max-width: 100%;"` : '';
    const altAttr = token.text ? ` alt="${escapeHtml(token.text)}"` : '';
    const img = `<img src="${encodeURI(token.href)}"${altAttr}${classAttr}${widthAttr}>`;
    if (title) {
      return `<figure>${img}<figcaption>${escapeHtml(title)}</figcaption></figure>`;
    }
    return img;
  }
};

let configured = false;

/**
 * Register the extensions on the global marked instance exactly once.
 */
function configureMarked() {
  if (configured) return;
  marked.use({ extensions: [videoEmbed, imageWithSize] });
  if (window.markedKatex) {
    marked.use(window.markedKatex({ throwOnError: false }));
  }
  configured = true;
}

/**
 * Whether the marked.js CDN library is available.
 * @returns {boolean}
 */
export function canRenderMarkdown() {
  return typeof marked !== 'undefined';
}

/**
 * Render a markdown document to HTML.
 * Figure/table caption numbering restarts for each call.
 * @param {string} md
 * @returns {string} HTML
 */
export function renderMarkdown(md) {
  configureMarked();
  figureCount = 0;
  tableCount = 0;
  return marked.parse(md);
}

/**
 * Strip markdown syntax to get plain text (for card previews).
 * @param {string} md
 * @returns {string}
 */
export function stripMarkdown(md) {
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
