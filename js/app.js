/**
 * app.js — Main application router and initialisation
 */

import { loadPapers } from './data.js';
import { initSearch, search } from './search.js';
import { renderPapers, renderPaperDetail } from './papers.js';
import { renderTags } from './tags.js';
import { renderLanding, cleanupLanding } from './landing.js';

// ---- DOM Elements ----
const contentBody = document.getElementById('content-body');
const contentTitle = document.getElementById('content-title');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mainContent = document.querySelector('.main-content');

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
    const hash = window.location.hash.slice(1) || 'home';
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

    // Toggle header visibility for landing page
    const isLanding = (page === 'home');
    mainContent.classList.toggle('header-hidden', isLanding);

    // Update search bar placeholder based on current page
    searchInput.closest('.search-bar').style.display = '';
    searchInput.placeholder = (page === 'tags')
        ? 'Search papers by title, author, tag, or keyword...'
        : 'Search papers by title, author, tag, or keyword...';

    // Clean up landing background when navigating away
    if (!isLanding) {
        cleanupLanding();
    }

    // Route
    switch (page) {
        case 'home':
            contentTitle.textContent = '';
            renderLanding(contentBody, performSearch);
            break;

        case 'papers':
            contentTitle.textContent = 'Papers';
            if (pendingSearchQuery) {
                // Handle search initiated from landing page
                const query = pendingSearchQuery;
                pendingSearchQuery = null;
                const papers = await loadPapers();
                const results = search(papers, query);
                contentTitle.textContent = 'Search Results';
                searchInput.value = query;
                await renderPapers(contentBody, {
                    searchResults: results,
                    query: query
                });
            } else if (params.tag) {
                await renderPapers(contentBody, { tag: params.tag });
            } else {
                await renderPapers(contentBody);
                searchInput.value = '';
            }
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
            contentTitle.textContent = '';
            renderLanding(contentBody, performSearch);
    }
}

// ---- Search Handler ----

let searchDebounce = null;
let pendingSearchQuery = null;

/**
 * Perform a search and render results in the papers view.
 * Used both by the header search bar and the landing page search.
 */
async function performSearch(query) {
    if (!query) return;

    const currentRoute = parseRoute();
    if (currentRoute.page === 'papers' || currentRoute.page === 'paper') {
        // Already on papers — render results directly (hashchange won't fire)
        const papers = await loadPapers();
        const results = search(papers, query);
        contentTitle.textContent = 'Search Results';
        searchInput.value = query;
        await renderPapers(contentBody, {
            searchResults: results,
            query: query
        });
    } else {
        // Navigate to papers page with the search query
        pendingSearchQuery = query;
        window.location.hash = '#papers';
    }
}

async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        // If we're on the papers page, clear search
        if (parseRoute().page === 'papers' || parseRoute().page === 'paper') {
            window.location.hash = '#papers';
        }
        return;
    }

    await performSearch(query);
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

    // Clear search when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            searchInput.value = '';
            pendingSearchQuery = null;
        });
    });

    menuToggle.addEventListener('click', toggleMobileMenu);
    sidebarOverlay.addEventListener('click', toggleMobileMenu);

    // Initial route
    navigate();
}

// Start the app
init();
