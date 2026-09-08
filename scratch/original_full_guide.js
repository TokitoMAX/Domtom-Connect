const fs = require('fs');
const content = fs.readFileSync('assets/data/guide-tome1.js', 'utf8');
const data = eval(content.replace('window.GUIDE_DATA =', ''));
console.log("Total chapters in array:", data.chapters.length);
data.chapters.forEach((ch, idx) => {
    console.log(`${idx}: id="${ch.id}", number=${ch.number}, badge="${ch.badge}", title="${ch.title}"`);
});
