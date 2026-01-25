// app.js - Application initialization and core functions
import { State } from './state.js';

const TOTAL_PAGES = 135;
const ZOOM_LEVELS = [70, 80, 90, 100, 110, 120, 130, 140];
let currentPage = 1;
let currentView = localStorage.getItem('readerView') || 'image';
let currentZoom = parseInt(localStorage.getItem('readerZoom')) || 100;
let menuOpen = false;
const pageCache = {};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Load manifest
    try {
        const manifest = await fetch('data/manifest.json').then(r => r.json());
        State.manifest = manifest;
        State.totalPages = manifest.totalPages;
    } catch (e) {
        console.warn('Could not load manifest, using defaults');
    }

    loadPage(currentPage);
    setView(currentView);
    setupEventListeners();
    updateUI();
}

function setupEventListeners() {
    // Menu trigger
    document.getElementById('menuTrigger').addEventListener('click', toggleMenu);
    document.getElementById('menuOverlay').addEventListener('click', closeMenu);

    // Navigation
    document.getElementById('prevBtn').addEventListener('click', () => navigate(-1));
    document.getElementById('nextBtn').addEventListener('click', () => navigate(1));
    document.getElementById('pageInput').addEventListener('change', (e) => goToPage(parseInt(e.target.value)));

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => handleSearch(e.target.value));

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// ==================== MENU ====================
function toggleMenu() {
    menuOpen = !menuOpen;
    document.getElementById('menuTrigger').classList.toggle('active', menuOpen);
    document.getElementById('contextMenu').classList.toggle('active', menuOpen);
    document.getElementById('menuOverlay').classList.toggle('active', menuOpen);
}

function closeMenu() {
    menuOpen = false;
    document.getElementById('menuTrigger').classList.remove('active');
    document.getElementById('contextMenu').classList.remove('active');
    document.getElementById('menuOverlay').classList.remove('active');
}

// ==================== NAVIGATION ====================
function navigate(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= TOTAL_PAGES) {
        goToPage(newPage);
    }
}

function goToPage(page) {
    if (page < 1 || page > TOTAL_PAGES) return;
    currentPage = page;
    loadPage(page);
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateUI() {
    // Progress bar
    const progress = (currentPage / TOTAL_PAGES) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    // Page badge
    document.getElementById('pageBadge').textContent = `Page ${currentPage} of ${TOTAL_PAGES}`;

    // Menu page input
    document.getElementById('pageInput').value = currentPage;

    // Menu page title
    const data = pageCache[currentPage];
    document.getElementById('menuPageTitle').textContent = data ? data.title : `Page ${currentPage}`;

    // Nav buttons
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === TOTAL_PAGES;
}

// ==================== PAGE LOADING ====================
async function loadPage(page) {
    const reader = document.getElementById('reader');

    // Load page data if not cached
    if (!pageCache[page]) {
        try {
            const paddedNum = String(page).padStart(3, '0');
            const data = await fetch(`data/pages/page-${paddedNum}.json`).then(r => r.json());
            pageCache[page] = data;
        } catch (e) {
            // Page data not available
            pageCache[page] = null;
        }
    }

    const data = pageCache[page];

    const zoomButtonsHTML = ZOOM_LEVELS.map(level =>
        `<button class="zoom-btn ${currentZoom === level ? 'active' : ''}" onclick="window.setZoom(${level})">${level}%</button>`
    ).join('');

    const imageHTML = `
        <div class="image-view ${currentView === 'image' ? '' : 'hidden'}" id="imageView">
            <div class="zoom-trigger"></div>
            <div class="zoom-controls">
                <span>Zoom</span>
                ${zoomButtonsHTML}
            </div>
            <img src="assets/images/agentic_135-${String(page).padStart(3, '0')}.png"
                 alt="Page ${page}"
                 class="zoom-${currentZoom}"
                 id="pageImage">
        </div>
    `;

    const textHTML = data ? `
        <div class="text-view ${currentView === 'text' ? 'active' : ''}" id="textView">
            ${data.content}
        </div>
    ` : `
        <div class="text-view ${currentView === 'text' ? 'active' : ''}" id="textView">
            <div class="article-header">
                <div class="section-label">Page ${page}</div>
                <h1>Content</h1>
            </div>
            <div class="original-content">
                <p>Full transcription and analysis for this page is available in the image view. Use the menu or press <kbd>V</kbd> to switch views.</p>
            </div>
        </div>
    `;

    reader.innerHTML = imageHTML + textHTML;

    // Update menu title after loading
    document.getElementById('menuPageTitle').textContent = data ? data.title : `Page ${page}`;
}

// ==================== VIEW TOGGLE ====================
function setView(view) {
    currentView = view;
    localStorage.setItem('readerView', view);

    const imageView = document.getElementById('imageView');
    const textView = document.getElementById('textView');

    if (imageView) imageView.classList.toggle('hidden', view !== 'image');
    if (textView) textView.classList.toggle('active', view === 'text');

    // Update menu items
    document.getElementById('viewImage').classList.toggle('active', view === 'image');
    document.getElementById('viewText').classList.toggle('active', view === 'text');

    closeMenu();
}

function toggleView() {
    setView(currentView === 'image' ? 'text' : 'image');
}

// ==================== IMAGE ZOOM ====================
window.setZoom = function(level) {
    currentZoom = level;
    localStorage.setItem('readerZoom', level);

    const img = document.getElementById('pageImage');
    if (img) {
        // Remove all zoom classes
        ZOOM_LEVELS.forEach(l => img.classList.remove(`zoom-${l}`));
        // Add current zoom class
        img.classList.add(`zoom-${level}`);
    }

    // Update button states
    document.querySelectorAll('.zoom-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === `${level}%`);
    });
}

function openFullscreen() {
    window.open(`assets/images/agentic_135-${String(currentPage).padStart(3, '0')}.png`, '_blank');
    closeMenu();
}

// ==================== SEARCH ====================
async function handleSearch(query) {
    const container = document.getElementById('searchResults');
    if (query.length < 2) {
        container.innerHTML = '';
        return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search through manifest
    if (State.manifest && State.manifest.pages) {
        for (const page of State.manifest.pages) {
            if (page.title.toLowerCase().includes(lowerQuery)) {
                results.push({ page: page.page, title: page.title });
            }
        }
    }

    // Also search cached pages for content
    for (const [pageNum, data] of Object.entries(pageCache)) {
        if (data && !results.find(r => r.page === parseInt(pageNum))) {
            if (data.content.toLowerCase().includes(lowerQuery)) {
                results.push({ page: parseInt(pageNum), title: data.title });
            }
        }
    }

    if (results.length > 0) {
        container.innerHTML = results.slice(0, 5).map(r => `
            <div class="search-result" onclick="window.appGoToPage(${r.page})">
                <div class="search-result-page">Page ${r.page}</div>
                <div>${r.title}</div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<div class="search-result">No results</div>';
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function handleKeyboard(e) {
    // Don't trigger if typing in input
    if (e.target.tagName === 'INPUT') return;

    switch(e.key) {
        case 'ArrowLeft':
            navigate(-1);
            break;
        case 'ArrowRight':
            navigate(1);
            break;
        case 'v':
        case 'V':
            toggleView();
            break;
        case 'm':
        case 'M':
            toggleMenu();
            break;
        case 'Escape':
            closeMenu();
            break;
    }
}

// Expose functions to window for onclick handlers
window.appGoToPage = function(page) {
    goToPage(page);
    closeMenu();
};
window.setView = setView;
window.openFullscreen = openFullscreen;
