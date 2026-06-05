const fs = require('fs');

const htmlPath = 'd:/DomtomConnect-Website/mon-espace.html';
let content = fs.readFileSync(htmlPath, 'utf8');

content = content.replace(/\?v=11\.6/g, '?v=11.7');

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('Cache version updated to 11.7');
