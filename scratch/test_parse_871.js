const fs = require('fs');

let snippet = fs.readFileSync('scratch/new_chapters_from_871.json_snippet', 'utf8');

const lastChapterEnd = snippet.lastIndexOf('            }\n        }');
if (lastChapterEnd !== -1) {
  snippet = snippet.substring(0, lastChapterEnd + '            }\n        }'.length);
}

// Replace \` with `
snippet = snippet.replace(/\\`/g, '`');

const jsFile = `module.exports = [\n${snippet}\n];\n`;
fs.writeFileSync('scratch/parsed_871_chapters.js', jsFile);

try {
  const arr = require('./parsed_871_chapters.js');
  console.log('SUCCESS! Loaded parsed 871 chapters! Count:', arr.length);
  arr.forEach((c, idx) => console.log(`${idx}: id=${c.id} | number=${c.number} | title=${c.title}`));
} catch (e) {
  console.error('Error requiring parsed_871_chapters.js:', e.message);
}
