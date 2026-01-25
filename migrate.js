const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('reader.html', 'utf8');

// Extract CSS
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = cssMatch ? cssMatch[1].trim() : '';

// Extract pageData
const pageDataMatch = html.match(/const pageData = \{([\s\S]*?)\n        \};/);
if (!pageDataMatch) {
    console.error('Could not find pageData');
    process.exit(1);
}

// Parse pageData entries
const pageDataStr = pageDataMatch[1];
const pages = [];
const pageRegex = /(\d+):\s*\{\s*title:\s*"([^"]+)",\s*content:\s*`([\s\S]*?)`\s*\}/g;
let match;
while ((match = pageRegex.exec(pageDataStr)) !== null) {
    pages.push({
        page: parseInt(match[1]),
        title: match[2],
        content: match[3].trim()
    });
}

console.log(`Found ${pages.length} pages`);

// Create directories
const dirs = ['reader/css/components', 'reader/css/themes', 'reader/js/modules', 'reader/js/utils', 'reader/data/pages', 'reader/assets/images'];
dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// Write CSS variables
const varsMatch = css.match(/:root\s*\{[\s\S]*?\}/);
fs.writeFileSync('reader/css/themes/variables.css', varsMatch ? varsMatch[0] : '');

// Write main CSS (everything else)
fs.writeFileSync('reader/css/main.css', css);

// Write manifest
const manifest = {
    title: "Agentic Reasoning for Large Language Models",
    totalPages: 135,
    pages: pages.map(p => ({
        page: p.page,
        title: p.title,
        hasContent: true
    }))
};
fs.writeFileSync('reader/data/manifest.json', JSON.stringify(manifest, null, 2));

// Write individual page JSONs
pages.forEach(p => {
    const pageJson = {
        page: p.page,
        title: p.title,
        content: p.content
    };
    const filename = `reader/data/pages/page-${String(p.page).padStart(3, '0')}.json`;
    fs.writeFileSync(filename, JSON.stringify(pageJson, null, 2));
});

console.log('Migration complete!');
console.log(`- CSS written to reader/css/`);
console.log(`- ${pages.length} page JSON files written to reader/data/pages/`);
console.log(`- Manifest written to reader/data/manifest.json`);
