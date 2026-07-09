const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');

let content = fs.readFileSync(indexFile, 'utf8');

const navRegex = /let extraLinks = '<a href="marketplace\/directory\.html">Talents<\/a><a href="marketplace\/companies\.html">Entreprises<\/a>';/;

if (navRegex.test(content)) {
    const newNavLinks = `let extraLinks = '<a href="marketplace/directory.html">Talents</a><a href="marketplace/companies.html">Entreprises</a><a href="marketplace/jobs.html">Missions</a>';`;
    content = content.replace(navRegex, newNavLinks);
    fs.writeFileSync(indexFile, content, 'utf8');
    console.log("Updated index.html dynamic nav");
} else {
    console.log("Could not find dynamic nav regex in index.html");
}
