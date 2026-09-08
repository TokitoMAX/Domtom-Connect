const fs = require('fs');

// saved_from_1310.js defines ch4, ch5, ch6, ch7, ch8...
// Let's create a sandbox and run saved_from_1310.js with dummy oldChapters
const code1310 = fs.readFileSync('scratch/saved_from_1310.js', 'utf8');

// Provide mock oldChapters for any oldMap lookup
const mockOldChapters = [
  { id: 'couverture', title: 'Couverture' },
  { id: 'avant-propos', title: 'Avant-propos' },
  { id: 'chapitre-1', title: 'Ch 1' },
  { id: 'chapitre-2', title: 'Ch 2' },
  { id: 'chapitre-3', title: 'Ch 3' },
  { id: 'chapitre-7', title: 'Ch 7' },
  { id: 'chapitre-8', title: 'Ch 8' },
  { id: 'chapitre-9', title: 'Ch 9' },
  { id: 'chapitre-10', title: 'Ch 10' },
  { id: 'chapitre-11', title: 'Ch 11' },
  { id: 'chapitre-12', title: 'Ch 12' },
  { id: 'chapitre-13', title: 'Ch 13' },
  { id: 'chapitre-14', title: 'Ch 14' },
  { id: 'chapitre-15', title: 'Ch 15' },
  { id: 'chapitre-16', title: 'Ch 16' },
  { id: 'chapitre-17', title: 'Ch 17' },
  { id: 'chapitre-18', title: 'Ch 18' },
  { id: 'chapitre-19', title: 'Ch 19' },
  { id: 'chapitre-20', title: 'Ch 20' },
  { id: 'chapitre-21', title: 'Ch 21' },
  { id: 'conclusion', title: 'Conclusion' }
];

// Replace the require('./assets/data/guide-tome1.js') with mock
let adaptedCode = code1310.replace(
  "require('./assets/data/guide-tome1.js');",
  "global.window.GUIDE_DATA = { chapters: mockOldChapters };"
);

// Prevent fs.writeFileSync at the end
adaptedCode = adaptedCode.replace("fs.writeFileSync('assets/data/guide-tome1.js', output, 'utf8');", "// skipped write");

const sandbox = {
  fs: fs,
  require: require,
  global: { window: {} },
  mockOldChapters: mockOldChapters,
  console: console
};

const fn = new Function('sandbox', `
  with(sandbox) {
    ${adaptedCode}
    return { ch4, ch5, ch6, ch7, ch8 };
  }
`);

const extracted = fn(sandbox);
console.log('Extracted ch4 title:', extracted.ch4.title);
console.log('Extracted ch5 title:', extracted.ch5.title);
console.log('Extracted ch6 title:', extracted.ch6.title);
console.log('Extracted ch7 title:', extracted.ch7.title);
console.log('Extracted ch8 title:', extracted.ch8.title);
