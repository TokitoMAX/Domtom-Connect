const fs = require('fs');

const raw = fs.readFileSync('./assets/data/guide-tome1.js', 'utf8');
const lines = raw.split('\n');

const chapterStarts = [];
lines.forEach((l, idx) => {
  const m = l.match(/^\s*id:\s*['"]([a-zA-Z0-9_-]+)['"],/);
  if (m) {
    chapterStarts.push({ line: idx + 1, id: m[1] });
  }
});

console.log('Found chapter IDs at lines:');
chapterStarts.forEach(cs => console.log(`Line ${cs.line}: ${cs.id}`));
