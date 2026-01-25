# Reader Application Specification

## Overview

A modular document reader application designed to display academic papers with dual-view capability (original page images and structured text/analysis). Built for the survey paper "Agentic Reasoning for Large Language Models".

---

## Project Structure

```
reader/
├── index.html              # Main HTML entry point (minimal markup)
├── css/
│   ├── main.css            # Core layout and base styles
│   ├── components/
│   │   ├── reader.css      # Reading area styles
│   │   ├── menu.css        # Context menu styles
│   │   ├── navigation.css  # Nav controls styles
│   │   ├── search.css      # Search component styles
│   │   └── content-boxes.css  # Definition, highlight, figure boxes
│   └── themes/
│       ├── variables.css   # CSS custom properties
│       └── dark.css        # Dark mode overrides (optional)
├── js/
│   ├── app.js              # Application initialization
│   ├── state.js            # State management module
│   ├── modules/
│   │   ├── navigation.js   # Page navigation logic
│   │   ├── menu.js         # Context menu controller
│   │   ├── search.js       # Search functionality
│   │   ├── view.js         # View toggle (image/text)
│   │   └── keyboard.js     # Keyboard shortcut handler
│   └── utils/
│       ├── storage.js      # LocalStorage wrapper
│       └── dom.js          # DOM helper utilities
├── data/
│   ├── manifest.json       # Page metadata index
│   └── pages/
│       ├── page-001.json   # Individual page content
│       ├── page-002.json
│       ├── page-003.json
│       └── ...
└── assets/
    └── images/
        ├── agentic_135-001.png
        ├── agentic_135-002.png
        └── ...
```

---

## Module Specifications

### HTML Entry Point (`index.html`)

Minimal HTML containing only:
- Document head with CSS imports
- Semantic structure placeholders
- Script module imports

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agentic Reasoning for Large Language Models</title>
    <link rel="stylesheet" href="css/themes/variables.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components/reader.css">
    <link rel="stylesheet" href="css/components/menu.css">
    <link rel="stylesheet" href="css/components/navigation.css">
    <link rel="stylesheet" href="css/components/search.css">
    <link rel="stylesheet" href="css/components/content-boxes.css">
</head>
<body>
    <div id="app"></div>
    <script type="module" src="js/app.js"></script>
</body>
</html>
```

---

### State Module (`js/state.js`)

Centralized reactive state management.

```javascript
// state.js
export const State = {
    currentPage: 1,
    totalPages: 103,
    currentView: 'image',  // 'image' | 'text'
    menuOpen: false,
    searchQuery: '',
    searchResults: [],

    // Subscribers for reactive updates
    listeners: new Map(),

    subscribe(key, callback) { ... },
    set(key, value) { ... },
    get(key) { ... }
};
```

---

### Navigation Module (`js/modules/navigation.js`)

```javascript
// navigation.js
export const Navigation = {
    init(state) { ... },

    navigate(delta) { ... },
    goToPage(pageNumber) { ... },

    updateUI() { ... },
    updateProgressBar() { ... },
    updatePageBadge() { ... },
    updateNavButtons() { ... }
};
```

---

### Menu Module (`js/modules/menu.js`)

```javascript
// menu.js
export const Menu = {
    init(state) { ... },

    open() { ... },
    close() { ... },
    toggle() { ... },

    render() { ... },
    updatePageTitle() { ... }
};
```

---

### Search Module (`js/modules/search.js`)

```javascript
// search.js
export const Search = {
    init(state, pageIndex) { ... },

    query(searchTerm) { ... },
    renderResults(results) { ... },
    clearResults() { ... },

    // Search index built from manifest
    buildIndex(manifest) { ... }
};
```

---

### View Module (`js/modules/view.js`)

```javascript
// view.js
export const View = {
    init(state) { ... },

    setView(mode) { ... },      // 'image' | 'text'
    toggleView() { ... },

    renderImageView(page) { ... },
    renderTextView(page, content) { ... },

    toggleZoom(imageElement) { ... }
};
```

---

### Keyboard Module (`js/modules/keyboard.js`)

```javascript
// keyboard.js
export const Keyboard = {
    init(handlers) { ... },

    // Shortcut map
    shortcuts: {
        'ArrowLeft': 'prevPage',
        'ArrowRight': 'nextPage',
        'v': 'toggleView',
        'V': 'toggleView',
        'm': 'toggleMenu',
        'M': 'toggleMenu',
        'Escape': 'closeMenu'
    },

    handleKeydown(event) { ... },
    isInputFocused() { ... }
};
```

---

## Data Specifications

### Page Manifest (`data/manifest.json`)

Index file for all pages with metadata for search and navigation.

```json
{
    "title": "Agentic Reasoning for Large Language Models",
    "totalPages": 103,
    "pages": [
        {
            "page": 1,
            "title": "Title Page & Abstract",
            "section": "Introduction",
            "keywords": ["abstract", "survey", "agentic AI"],
            "hasContent": true
        },
        {
            "page": 2,
            "title": "Framework Overview (Figure 1)",
            "section": "Section 1 - Introduction",
            "keywords": ["figure 1", "framework", "overview"],
            "hasContent": true
        },
        {
            "page": 4,
            "title": "Introduction continued",
            "section": "Section 1 - Introduction",
            "keywords": [],
            "hasContent": false
        }
    ]
}
```

---

### Individual Page Content (`data/pages/page-001.json`)

```json
{
    "page": 1,
    "title": "Title Page & Abstract",
    "section": {
        "number": null,
        "name": "Introduction"
    },
    "original": {
        "authors": ["Tianxin Wei", "Ting-Wei Li", "..."],
        "institutions": ["UIUC", "Meta", "Amazon", "..."],
        "paragraphs": [
            "Reasoning is a fundamental cognitive process...",
            "The emergence of agentic reasoning marks..."
        ],
        "lists": [
            {
                "type": "unordered",
                "items": [
                    "Foundational agentic reasoning establishes...",
                    "Self-evolving agentic reasoning examines...",
                    "Collective multi-agent reasoning extends..."
                ]
            }
        ]
    },
    "analysis": {
        "blocks": [
            {
                "title": "Core Thesis",
                "items": [
                    {
                        "heading": "Summary",
                        "content": "This paper introduces..."
                    },
                    {
                        "heading": "Real-World Applications",
                        "list": ["Autonomous AI assistants...", "..."]
                    }
                ]
            }
        ]
    },
    "tags": ["Agentic AI", "LLM Agent", "Agentic Reasoning"]
}
```

---

## DOM Component IDs

| Component | Element ID | Purpose |
|-----------|------------|---------|
| Progress Bar | `progressBar` | Visual reading progress indicator (top of viewport) |
| Page Badge | `pageBadge` | Current page number display (top-right) |
| Reader Container | `reader` | Main content area for page display |
| Menu Trigger | `menuTrigger` | Floating action button to open context menu |
| Menu Overlay | `menuOverlay` | Semi-transparent backdrop when menu is open |
| Context Menu | `contextMenu` | Navigation and settings panel |

---

## State Management

### Global State Variables

```javascript
TOTAL_PAGES = 103          // Total number of pages
currentPage = 1            // Active page number (1-indexed)
currentView = 'image'      // Active view mode: 'image' | 'text'
menuOpen = false           // Context menu visibility state
```

### Persistence

- `currentView` is persisted to `localStorage` under key `'readerView'`

---

## Views

### 1. Image View (Default)

- **Class**: `.image-view`
- **Content**: PNG image of the original PDF page
- **Source Pattern**: `agentic_135/agentic_135-{PAGE_NUMBER}.png`
  - Page number is zero-padded to 3 digits (e.g., `001`, `012`, `103`)
- **Features**:
  - Click-to-zoom toggle
  - Maximum dimensions constrained to viewport (85vh height, 100% width)
  - Zoomed state removes constraints for full-size viewing

### 2. Text View

- **Class**: `.text-view`
- **Content**: Structured HTML with:
  - Article header (section label, title)
  - Original content (transcribed text, figures, tables)
  - Analysis section (summaries, practical applications, insights)
- **Fallback**: Pages without data show placeholder message

---

## Page Data Structure

```javascript
pageData = {
  [pageNumber]: {
    title: string,      // Page/section title
    content: string     // HTML content for text view
  }
}
```

### Currently Defined Pages

| Page | Title |
|------|-------|
| 1 | Title Page & Abstract |
| 2 | Framework Overview (Figure 1) |
| 3 | Definition of Agentic Reasoning |
| 7 | From LLM to Agentic Reasoning |

---

## Content Components (CSS Classes)

### Structural

| Class | Purpose |
|-------|---------|
| `.article-header` | Page title area with section label |
| `.section-label` | Uppercase category indicator |
| `.original-content` | Main transcribed content |
| `.analysis-section` | AI-generated analysis and explanations |

### Special Boxes

| Class | Color Scheme | Use Case |
|-------|--------------|----------|
| `.definition-box` | Green gradient | Key definitions |
| `.highlight-box` | Blue gradient | Important tables/comparisons |
| `.figure-box` | Yellow/amber gradient | Figure descriptions |

### Analysis Structure

| Class | Purpose |
|-------|---------|
| `.analysis-block` | Container for analysis group |
| `.analysis-item` | Individual insight/summary |
| `.tags` | Keyword/topic tags container |
| `.tag` | Individual tag pill |

### Data Display

| Class | Purpose |
|-------|---------|
| `.data-table` | Formatted comparison tables |
| `.citation` | In-text citation references |

---

## Navigation

### Methods

| Method | Trigger | Behavior |
|--------|---------|----------|
| `navigate(delta)` | Arrow buttons, keyboard | Move ±1 page |
| `goToPage(page)` | Page input, search results | Jump to specific page |

### Constraints

- Page range: 1 to `TOTAL_PAGES` (103)
- Auto-scroll to top on page change
- Navigation buttons disabled at boundaries

---

## Context Menu

### Sections

1. **Header**: Current page title display
2. **Navigation**: Previous/Next buttons + page number input
3. **View Toggle**: Image vs Text view selection
4. **Search**: Content search with results
5. **Actions**: Open image in new tab

### Menu Behavior

- Opens via floating action button or `M` key
- Closes via overlay click or `Escape` key
- Animated entrance (scale + opacity transition)

---

## Search Functionality

### Implementation

```javascript
handleSearch(query)
```

- **Minimum Query Length**: 2 characters
- **Search Scope**: `pageData` titles and content
- **Results Limit**: 5 results displayed
- **Match Type**: Case-insensitive substring

### Result Actions

- Click result → Navigate to page + close menu

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` (ArrowLeft) | Previous page |
| `→` (ArrowRight) | Next page |
| `V` | Toggle view (image ↔ text) |
| `M` | Toggle menu |
| `Escape` | Close menu |

**Note**: Shortcuts disabled when focus is on input elements.

---

## Responsive Design

### Breakpoint: 768px

| Element | Desktop | Mobile |
|---------|---------|--------|
| Body font size | 18px | 16px |
| Reader padding | 3rem 2rem | 2rem 1.25rem |
| Menu trigger | 56px, bottom-right 2rem | 50px, bottom-right 1.5rem |
| Context menu | Right-aligned | Full-width (1rem margins) |
| Keyboard hints | Visible | Hidden |

---

## CSS Custom Properties (Theme)

```css
--bg: #fefefe              /* Primary background */
--bg-secondary: #f5f5f5    /* Secondary/muted background */
--text: #1a1a1a            /* Primary text */
--text-secondary: #555     /* Secondary text */
--text-muted: #888         /* Muted/hint text */
--accent: #2563eb          /* Primary accent (blue) */
--accent-hover: #1d4ed8    /* Accent hover state */
--border: #e5e5e5          /* Border color */
--shadow: rgba(0,0,0,0.1)  /* Shadow color */
--overlay: rgba(0,0,0,0.5) /* Menu overlay */
--menu-bg: #ffffff         /* Menu background */
--radius: 12px             /* Border radius */
--font-serif: Georgia...   /* Body text font */
--font-sans: system-ui...  /* UI element font */
```

---

## Application Initialization (`js/app.js`)

```javascript
// app.js
import { State } from './state.js';
import { Navigation } from './modules/navigation.js';
import { Menu } from './modules/menu.js';
import { Search } from './modules/search.js';
import { View } from './modules/view.js';
import { Keyboard } from './modules/keyboard.js';
import { Storage } from './utils/storage.js';

async function init() {
    // 1. Load manifest
    const manifest = await fetch('data/manifest.json').then(r => r.json());
    State.set('totalPages', manifest.totalPages);

    // 2. Restore persisted state
    const savedView = Storage.get('readerView');
    if (savedView) State.set('currentView', savedView);

    // 3. Render initial DOM structure
    renderApp();

    // 4. Initialize modules
    Navigation.init(State);
    Menu.init(State);
    Search.init(State, manifest.pages);
    View.init(State);
    Keyboard.init({
        prevPage: () => Navigation.navigate(-1),
        nextPage: () => Navigation.navigate(1),
        toggleView: () => View.toggleView(),
        toggleMenu: () => Menu.toggle(),
        closeMenu: () => Menu.close()
    });

    // 5. Load initial page
    await loadPage(State.get('currentPage'));
}

async function loadPage(pageNumber) {
    const paddedNum = String(pageNumber).padStart(3, '0');

    // Load page content (lazy)
    try {
        const content = await fetch(`data/pages/page-${paddedNum}.json`)
            .then(r => r.json());
        View.renderTextView(pageNumber, content);
    } catch {
        View.renderTextView(pageNumber, null); // Fallback
    }

    View.renderImageView(pageNumber);
}

document.addEventListener('DOMContentLoaded', init);
```

---

## Data Loading Strategy

### Lazy Loading

- Page content JSON files loaded on-demand when navigating
- Only manifest loaded at startup for search index
- Images use native lazy loading attribute

### Preloading (Optional Enhancement)

```javascript
// Preload adjacent pages for smoother navigation
function preloadAdjacentPages(current) {
    const toPreload = [current - 1, current + 1]
        .filter(p => p >= 1 && p <= State.get('totalPages'));

    toPreload.forEach(p => {
        const img = new Image();
        img.src = `assets/images/agentic_135-${String(p).padStart(3, '0')}.png`;
    });
}
```

### Caching

- Loaded page content cached in memory during session
- Consider IndexedDB for offline support

---

## File Dependencies

### Project Files

```
reader/
├── index.html
├── css/
│   ├── main.css
│   ├── components/*.css (5 files)
│   └── themes/*.css (1-2 files)
├── js/
│   ├── app.js
│   ├── state.js
│   ├── modules/*.js (5 files)
│   └── utils/*.js (2 files)
├── data/
│   ├── manifest.json
│   └── pages/*.json (up to 103 files)
└── assets/
    └── images/*.png (103 files)
```

### External Dependencies

None - vanilla JavaScript with ES modules.

---

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid/Flexbox support required
- LocalStorage API required for view persistence

---

## Print Styles

Hidden elements when printing:
- Menu trigger
- Context menu
- Menu overlay
- Progress indicator
- Page badge
- Keyboard hints

Reader container expands to full width with no padding.

---

## Migration from Monolith

### Current State (reader.html)

Single 1200+ line HTML file containing all CSS, JS, and page data inline.

### Migration Steps

1. **Extract CSS** → Split into `css/` directory by component
2. **Extract JS** → Split into ES modules in `js/` directory
3. **Extract Data** → Convert `pageData` object to JSON files
4. **Create Manifest** → Build `manifest.json` from existing page entries
5. **Update Paths** → Change image paths from `agentic_135/` to `assets/images/`

### Benefits

| Aspect | Monolith | Modular |
|--------|----------|---------|
| File size | 1 large file | Many small files |
| Caching | All or nothing | Granular |
| Maintainability | Difficult | Easy |
| Collaboration | Merge conflicts | Independent work |
| Testing | Hard to isolate | Unit testable |
| Content updates | Edit HTML | Edit JSON |

---

## Potential Enhancements

1. **Data Completion**: Only 4 of 103 pages have text content - add remaining pages
2. **Dark Mode**: Add `css/themes/dark.css` with CSS variable overrides
3. **Bookmarking**: Persist reading position in localStorage
4. **Export**: Download page analysis as markdown/PDF
5. **Image Preloading**: Preload ±1 adjacent page images
6. **Offline Support**: Service worker + IndexedDB caching
7. **Accessibility**: ARIA labels, focus trapping in menu, skip links
8. **Build Process**: Optional bundler (Vite/esbuild) for production
9. **TypeScript**: Add type definitions for better DX
10. **Content CMS**: Admin interface for editing page JSON files
