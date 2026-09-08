const fs = require('fs');
global.window = {};
require('../assets/data/guide-tome1.js');
const chaps = global.window.GUIDE_DATA.chapters;

let out = '';
chaps.forEach((c, idx) => {
    out += '\n=== [' + idx + '] ' + c.id + ' : ' + c.title + ' ===\n';
    if (!c.exercise) {
        out += '   NO EXERCISE\n';
        return;
    }
    out += '   Titre Exo: ' + c.exercise.title + '\n';
    c.exercise.fields.forEach(f => {
        if (f.type !== 'section-header') {
            out += '   - [' + f.id + '] (' + f.type + ') : ' + f.label + '\n';
        }
    });
});
fs.writeFileSync('scratch/all_exo_labels.txt', out, 'utf8');
console.log('Wrote scratch/all_exo_labels.txt');
