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

function getNavBlock(depth) {
    const prefix = getPrefix(depth);
    return `    <nav class="navbar">
        <div class="container">
            <a href="/" class="nav-brand" id="logo-home" title="Accueil Domtom Connect">
                <img src="${prefix}assets/images/logo-domtomconnect.png" alt="Domtom Connect" class="nav-logo">
                <span class="nav-brand-name">Domtom Connect</span>
            </a>
            <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"
                aria-controls="primary-navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="nav-content" id="primary-navigation">
                <div class="nav-links" id="nav-links-container">
                    <a href="${prefix}marketplace/directory.html">Talents</a>
                    <a href="${prefix}marketplace/companies.html">Entreprises</a>
                </div>
                <div class="nav-actions" id="nav-actions-container">
                    <a href="${prefix}login.html" class="cta-button secondary" id="login-link">Connexion</a>
                    <a href="${prefix}register-choice.html" class="cta-button primary" id="start-button">Démarrer</a>
                </div>
            </div>
        </div>
    </nav>`;
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
    if (file.includes('blog') || file.includes('webinaire')) return;

    let content = fs.readFileSync(file, 'utf8');

    // We want to replace <nav class="navbar"> ... </nav>
    // However, it can be multiline.
    const navRegex = /<nav class="navbar">[\s\S]*?<\/nav>/;

    if (navRegex.test(content)) {
        const depth = getDepth(file);
        const newNav = getNavBlock(depth);

        // Also check if they ALREADY have the full nav? 
        // We know it if it has 'nav-links-container'.
        if (!content.includes('id="nav-links-container"')) {
            content = content.replace(navRegex, newNav);
            fs.writeFileSync(file, content, 'utf8');
            console.log("Updated " + file);
            updatedCount++;
        }
    }
});

console.log("Updated " + updatedCount + " files.");
