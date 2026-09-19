const c = require('fs').readFileSync('assets/js/anamnese.js', 'utf8');
const lines = c.split('\n').filter(l => l.includes('label: "Question') || l.includes('label: "Acte'));
console.log(lines.join('\n'));
