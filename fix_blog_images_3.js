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
    podcast: ['podcast', 'episode', 'insulink', 'interview', 'audio'],
    tech: ['tech', 'saas', 'startup', 'digital', 'numerique', 'plateforme', 'app', 'logiciel', 'cloud', 'innovation'],
    island: ['caraibe', 'caribbean', 'outre-mer', 'outremer', 'martinique', 'guadeloupe', 'reunion', 'guyane', 'polynesie', 'antilles', 'tourisme', 'ile', 'island'],
    community: ['diaspora', 'reseau', 'network', 'communaute', 'community', 'social', 'pulse', 'etudiant', 'rencontre'],
    business: ['business', 'b2b', 'vente', 'client', 'crm', 'facturation', 'marketplace', 'export', 'financement', 'investir', 'investissement', 'entreprise']
};

function getImageForText(text) {
    const t = text.toLowerCase();
    for (const [cat, words] of Object.entries(keywords)) {
        if (words.some(w => t.includes(w))) {
            const arr = categories[cat];
            return arr[t.length % arr.length];
        }
    }
    return categories.business[t.length % categories.business.length];
}

const blogDirs = fs.readdirSync(path.join(__dirname, 'blog'), { withFileTypes: true });

let articleCount = 0;
for (const dir of blogDirs) {
    if (dir.isDirectory()) {
        const articleFile = path.join(__dirname, 'blog', dir.name, 'index.html');
        if (fs.existsSync(articleFile)) {
            let html = fs.readFileSync(articleFile, 'utf8');
            let updated = false;
            
            let title = dir.name;
            const titleMatch = html.match(/<h1 class="article-title">([^<]+)<\/h1>/);
            if (titleMatch) {
                title = titleMatch[1];
            }
            
            const newId = getImageForText(dir.name);
            
            if (html.includes('<!--\r\n                <div class="article-featured-image">')) {
                 html = html.replace(/<!--\s*<div class="article-featured-image">\s*<img[^>]+>\s*<\/div>\s*-->/g, 
                 '<div class="article-featured-image">\n                    <img src="../assets/images/[[IMAGE_ARTICLE]]" alt="[[ALT_IMAGE]]">\n                </div>');
            }
            if (html.includes('<!--\n                <div class="article-featured-image">')) {
                 html = html.replace(/<!--\s*<div class="article-featured-image">\s*<img[^>]+>\s*<\/div>\s*-->/g, 
                 '<div class="article-featured-image">\n                    <img src="../assets/images/[[IMAGE_ARTICLE]]" alt="[[ALT_IMAGE]]">\n                </div>');
            }

            if (html.includes('[[IMAGE_ARTICLE]]') || html.includes('[[ALT_IMAGE]]')) {
                updated = true;
                html = html.replace(/<img src="\.\.\/assets\/images\/\[\[IMAGE_ARTICLE\]\]" alt="\[\[ALT_IMAGE\]\]">/g, 
                    `<img src="https://images.unsplash.com/photo-${newId}?auto=format&fit=crop&q=80&w=1200" alt="${title}">`);
            }
            
            if (html.includes('<img src="../assets/images/[[IMAGE_ARTICLE]]"')) {
                updated = true;
                html = html.replace(/<img src="\.\.\/assets\/images\/\[\[IMAGE_ARTICLE\]\]"[^>]+>/g, 
                    `<img src="https://images.unsplash.com/photo-${newId}?auto=format&fit=crop&q=80&w=1200" alt="${title}">`);
            }

            if (updated) {
                fs.writeFileSync(articleFile, html);
                articleCount++;
            }
        }
    }
}

console.log('Updated ' + articleCount + ' individual article pages with placeholders.');
