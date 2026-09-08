const fs = require('fs');

const txt = fs.readFileSync('scratch/exact_avatar.txt', 'utf8');
const idx = txt.indexOf('id: "chapitre-5",');
console.log('Index:', idx);
const slice = txt.substring(idx);
console.log('Slice length:', slice.length);
console.log('Slice start:', slice.substring(0, 200));
console.log('Slice end:', slice.substring(slice.length - 200));
