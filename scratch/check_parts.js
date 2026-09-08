const fs = require('fs');

// 1. Chapters from parsed_871_chapters.js
const p871 = require('./parsed_871_chapters.js');
console.log('--- p871 chapters:');
p871.forEach(c => console.log('p871:', c.id, '|', c.title));

// 2. Ch 1 to 3 from original line 47 or saved_from_452.js
const code452 = fs.readFileSync('scratch/saved_from_452.js', 'utf8');
console.log('code452 has chapitre-1:', code452.includes('chapitre-1'));
console.log('code452 has chapitre-2:', code452.includes('chapitre-2'));
console.log('code452 has chapitre-3:', code452.includes('chapitre-3'));
