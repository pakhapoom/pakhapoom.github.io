/**
 * utils.js — Shared utility functions
 */

/** Shared mobile breakpoint in pixels. */
export const MOBILE_BREAKPOINT = 768;

/**
 * Escape a string for safe HTML insertion.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate a URL string and return it only if the protocol is http or https.
 * Returns an empty string for invalid or potentially dangerous URLs.
 * @param {string} url
 * @returns {string}
 */
export function safeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? url : '';
  } catch {
    return '';
  }
}

/**
 * Render a spinner into the container while async content loads.
 * @param {HTMLElement} container
 */
export function showLoading(container) {
  container.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; padding: var(--space-xl); color: var(--color-muted); font-size: var(--font-size-sm);">
      Loading…
    </div>`;
}
