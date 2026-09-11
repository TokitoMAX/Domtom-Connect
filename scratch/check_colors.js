const fs = require('fs');
const text = fs.readFileSync('scratch/guide-tome1-print.html', 'utf8');
const matches = text.match(/style="[^"]*color:[^"]*"/gi) || [];
console.log('Total inline style colors:', matches.length);
const sample = [...new Set(matches)].slice(0, 20);
sample.forEach(s => console.log('Sample:', s));
