/**
 * app.js — Main application router and initialisation
 */

import { loadPapers } from './data.js';
import { initSearch, search } from './search.js';
import { renderPapers, renderPaperDetail } from './papers.js';
import { renderTags } from './tags.js';

// ---- DOM Elements ----
const contentBody = document.getElementById('content-body');
const contentTitle = document.getElementById('content-title');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// ---- Routing ----

/**
 * Parse the current hash into a route object.
 * Examples:
 *   #papers          -> { page: 'papers', params: {} }
 *   #papers?tag=nlp  -> { page: 'papers', params: { tag: 'nlp' } }
 *   #paper/some-id   -> { page: 'paper', params: { id: 'some-id' } }
 *   #tags            -> { page: 'tags', params: {} }
 */
function parseRoute() {
    const hash = window.location.hash.slice(1) || 'papers';
    const [pathPart, queryPart] = hash.split('?');
    const segments = pathPart.split('/');
    const page = segments[0];
    const params = {};

    if (segments.length > 1) {
        params.id = segments.slice(1).join('/');
    }

    if (queryPart) {
        const searchParams = new URLSearchParams(queryPart);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
    }

    return { page, params };
}

/**
 * Route to the correct view.
 */
async function navigate() {
    const { page, params } = parseRoute();

    // Update active nav link
    navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        link.classList.toggle('active', href === page || (page === 'paper' && href === 'papers'));
    });

    // Close mobile sidebar
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');

    // Route
    switch (page) {
        case 'papers':
            contentTitle.textContent = 'Papers';
            if (params.tag) {
                await renderPapers(contentBody, { tag: params.tag });
            } else {
                await renderPapers(contentBody);
            }
            searchInput.value = '';
            break;

        case 'paper':
            contentTitle.textContent = 'Paper Detail';
            await renderPaperDetail(contentBody, params.id);
            break;

        case 'tags':
            contentTitle.textContent = 'Tags & Stats';
            await renderTags(contentBody);
            break;

        default:
            contentTitle.textContent = 'Papers';
            await renderPapers(contentBody);
    }
}

// ---- Search Handler ----

let searchDebounce = null;

async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        // If we're on the papers page, clear search
        if (parseRoute().page === 'papers' || parseRoute().page === 'paper') {
            window.location.hash = '#papers';
        }
        return;
    }

    // Always navigate to papers view for search
    const papers = await loadPapers();
    const results = search(papers, query);

    contentTitle.textContent = 'Search Results';
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#papers');
    });

    await renderPapers(contentBody, {
        searchResults: results,
        query: query
    });
}

// ---- Mobile Menu ----

function toggleMobileMenu() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
}

// ---- Initialization ----

async function init() {
    // Load data and initialize search engine
    const papers = await loadPapers();
    initSearch(papers);

    // Set up event listeners
    window.addEventListener('hashchange', navigate);

    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(handleSearch, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchDebounce);
            handleSearch();
        }
    });

    menuToggle.addEventListener('click', toggleMobileMenu);
    sidebarOverlay.addEventListener('click', toggleMobileMenu);

    // Initial route
    navigate();
}

// Start the app
init();
