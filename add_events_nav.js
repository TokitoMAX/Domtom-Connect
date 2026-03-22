const fs = require('fs');
const path = require('path');

const targetDirs = [
    '.', // root
    'faq',
    'services',
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
    'landing/prestataires',
    'blog',
    'a-propos'
];

// Some blog subdirectories
function addBlogSubdirs() {
    if (fs.existsSync('blog')) {
        const items = fs.readdirSync('blog');
        for (const item of items) {
            if (fs.statSync(path.join('blog', item)).isDirectory()) {
                targetDirs.push(path.join('blog', item));
            }
        }
    }
}
addBlogSubdirs();

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

console.log("Found " + htmlFiles.length + " HTML files to check.");

let updatedCount = 0;
htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    const navRegex = /(<a href="([^"]*?)marketplace\/projects(?:\.html)?".*?>Projets<\/a>)/g;

    if (navRegex.test(content)) {
        // Prevent double injection if already run
        if (!content.includes('marketplace/evenements')) {
            content = content.replace(navRegex, '$1\n                    <a href="$2marketplace/evenements">Événements</a>');
            fs.writeFileSync(file, content, 'utf8');
            console.log("Updated " + file);
            updatedCount++;
        }
    }
});

console.log("Updated " + updatedCount + " files.");
