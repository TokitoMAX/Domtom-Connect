const fs = require('fs');
const path = require('path');

const categories = {
    podcast: [
        '1590602847861-f357a9332bbc',
        '1516280440502-3c220f188365',
        '1478737270239-2f02b77fc618'
    ],
    tech: [
        '1451187580459-43490279c0fa',
        '1460925895917-afdab827c52f',
        '1504384308090-c894fdcc538d',
        '1519389950473-47ba0277781c'
    ],
    island: [
        '1499793983690-e29da59ef1c2',
        '1507525428034-b723cf961d3e',
        '1544376798-89aa6b82c6cd',
        '1589197331516-4b8fa8795c47'
    ],
    community: [
        '1522071820081-009f0129c71c',
        '1511632765486-a01980e01a18',
        '1528605248644-14dd04022da1'
    ],
    business: [
        '1556761175-5973dc0f32b7',
        '1454165804606-c3d57bc86b40',
        '1444653614773-995cb1ef9efa'
    ]
};

const keywords = {
    podcast: ['podcast', 'épisode', 'episode', 'insulink', 'interview', 'audio'],
    tech: ['tech', 'saas', 'startup', 'digital', 'numérique', 'plateforme', 'app', 'logiciel', 'cloud', 'innovation'],
    island: ['caraïbes', 'caribbean', 'outre-mer', 'outremer', 'martinique', 'guadeloupe', 'réunion', 'guyane', 'polynésie', 'antilles', 'tourisme', 'îles', 'island'],
    community: ['diaspora', 'réseau', 'network', 'communauté', 'community', 'social', 'pulse', 'étudiant', 'étudiants', 'rencontre'],
    business: ['business', 'b2b', 'vente', 'client', 'crm', 'facturation', 'marketplace', 'export', 'financement', 'investir', 'investissement', 'entreprise']
};

function getImageForTitle(title) {
    const t = title.toLowerCase();
    
    // Check keywords
    for (const [cat, words] of Object.entries(keywords)) {
        if (words.some(w => t.includes(w))) {
            const arr = categories[cat];
            // Deterministic random based on title length
            return arr[t.length % arr.length];
        }
    }
    
    // Default fallback to business
    return categories.business[t.length % categories.business.length];
}

const blogIndexFile = path.join(__dirname, 'blog', 'index.html');
let html = fs.readFileSync(blogIndexFile, 'utf8');

let match;
const imgRegex = /<img[^>]+alt="([^"]+)"[^>]+src="https:\/\/images\.unsplash\.com\/photo-([^?"]+)[^"]*"[^>]*>/g;

let updatedHtml = html;
let count = 0;

updatedHtml = updatedHtml.replace(imgRegex, (fullMatch, altText, photoId) => {
    const newId = getImageForTitle(altText);
    if (photoId !== newId) {
        count++;
        return fullMatch.replace(photoId, newId);
    }
    return fullMatch;
});

fs.writeFileSync(blogIndexFile, updatedHtml);
console.log('Updated ' + count + ' images in blog/index.html');

// Now update all individual blog post index.html files
const blogDirs = fs.readdirSync(path.join(__dirname, 'blog'), { withFileTypes: true });

let articleCount = 0;
for (const dir of blogDirs) {
    if (dir.isDirectory()) {
        const articleFile = path.join(__dirname, 'blog', dir.name, 'index.html');
        if (fs.existsSync(articleFile)) {
            let articleHtml = fs.readFileSync(articleFile, 'utf8');
            let articleUpdated = false;
            
            // Re-apply the same regex replacement
            const newArticleHtml = articleHtml.replace(imgRegex, (fullMatch, altText, photoId) => {
                const newId = getImageForTitle(altText);
                if (photoId !== newId) {
                    articleUpdated = true;
                    return fullMatch.replace(photoId, newId);
                }
                return fullMatch;
            });
            
            if (articleUpdated) {
                fs.writeFileSync(articleFile, newArticleHtml);
                articleCount++;
            }
        }
    }
}

console.log('Updated ' + articleCount + ' individual article pages.');
