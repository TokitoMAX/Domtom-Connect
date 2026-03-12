const fs = require('fs');
const path = require('path');

const targetDirs = [
    '.', // root
    'faq',
    'services',
    'tarifs',
    'ressources',
    'diaspora',
    'territoires/reunion',
    'territoires/polynesie',
    'territoires/mayotte',
    'territoires/martinique',
    'territoires/guyane',
    'territoires/guadeloupe',
    'marketplace',
    'landing/autre',
    'landing/entreprises',
    'landing/investisseurs',
    'landing/porteurs-projets',
    'landing/prestataires'
];

function getDepth(filePath) {
    const relative = path.relative('.', filePath);
    if (!relative || relative === '.') return 0;
    return relative.split(path.sep).length - 1;
}

function getPrefix(depth) {
    if (depth === 0) return '';
    return '../'.repeat(depth);
}

const htmlFiles = [];

function findHtmlFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Not recursive here, we only do explicit dirs or targetDirs
        } else if (fullPath.endsWith('.html')) {
            htmlFiles.push(fullPath);
        }
    }
}

targetDirs.forEach(dir => findHtmlFiles(dir));

console.log("Found " + htmlFiles.length + " files to check.");

let updatedCount = 0;
htmlFiles.forEach(file => {
    // Skip blog or specific landing pages that should remain isolated
    if (file.includes('blog') || file.includes('webinaire') || file.includes('a-propos')) return;

    let content = fs.readFileSync(file, 'utf8');

    // We want to replace <div class="nav-links" id="nav-links-container">
    const navRegex = /<div class="nav-links" id="nav-links-container">\s*<a href="([^"]+)marketplace\/directory.html">Talents<\/a>\s*<a href="([^"]+)marketplace\/companies.html">Entreprises<\/a>\s*<\/div>/;

    if (navRegex.test(content)) {
        const depth = getDepth(file);
        const prefix = getPrefix(depth);
        const newNavLinks = '<div class="nav-links" id="nav-links-container">\n' +
            '                    <a href="' + prefix + 'marketplace/directory.html">Talents</a>\n' +
            '                    <a href="' + prefix + 'marketplace/companies.html">Entreprises</a>\n' +
            '                    <a href="' + prefix + 'marketplace/jobs.html">Missions</a>\n' +
            '                </div>';

        content = content.replace(navRegex, newNavLinks);
        fs.writeFileSync(file, content, 'utf8');
        console.log("Updated " + file);
        updatedCount++;
    }
});

console.log("Updated " + updatedCount + " files.");
