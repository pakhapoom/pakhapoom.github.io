/**
 * landing.js — Landing page with quote, search, neural-network bg, and explore link
 */

import { initBackground, destroyBackground } from './background.js';

/**
 * Render the landing page.
 * @param {HTMLElement} container - The main content container
 * @param {Function} onSearch - Callback to trigger a search with a query
 */
export function renderLanding(container, onSearch) {
  // Destroy any previous background instance
  destroyBackground();

  // Remove any existing canvas
  const existingCanvas = document.getElementById('neural-bg');
  if (existingCanvas) existingCanvas.remove();

  // Create new canvas
  const canvasEl = document.createElement('canvas');
  canvasEl.id = 'neural-bg';
  document.body.appendChild(canvasEl);

  container.innerHTML = `
    <div class="landing fade-in">
      <div class="landing-content">
        <div class="landing-quote-block">
          <svg class="landing-quote-icon" viewBox="0 0 24 24" fill="currentColor" opacity="0.12">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
          </svg>
          <blockquote class="landing-quote">
            Somewhere, something incredible is waiting to be known.
          </blockquote>
          <cite class="landing-author">— Carl Sagan</cite>
        </div>

        <div class="landing-search-wrapper">
          <svg class="landing-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            id="landing-search-input"
            class="landing-search-input"
            placeholder="Search for a paper to read..."
            aria-label="Search papers"
            autocomplete="off"
          />
        </div>

        <a href="#papers" class="landing-explore">
          <span>Explore all possibilities</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </div>
  `;

  // Initialize the neural-network background
  initBackground(canvasEl);

  // Wire up search
  const searchInput = container.querySelector('#landing-search-input');

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query && onSearch) {
        onSearch(query);
      }
    }
  });

  // Auto-focus the search input (skip on mobile to avoid virtual keyboard popup)
  if (window.innerWidth > 768) {
    requestAnimationFrame(() => searchInput.focus());
  }
}

/**
 * Clean up the landing page background when navigating away.
 */
export function cleanupLanding() {
  destroyBackground();
  const canvasEl = document.getElementById('neural-bg');
  if (canvasEl) canvasEl.remove();
}
