const fs = require('fs');

// We can read saved_from_1310.js as text and inspect the chapters it builds
const code = fs.readFileSync('scratch/saved_from_1310.js', 'utf8');

console.log('saved_from_1310 length:', code.length);
// Let's check which chapter variables are defined
const matches = code.match(/const ch[a-zA-Z0-9_]+ =/g);
console.log('Defined chapter variables:', matches);
