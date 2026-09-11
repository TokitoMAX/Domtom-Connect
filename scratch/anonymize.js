const fs = require('fs');

let raw = fs.readFileSync('assets/data/guide-tome1.js', 'utf8');
raw = raw.replace(
    /L'histoire de Kelly Massol me parle/g,
    "L'histoire de la marque de soins capillaires maison me parle"
);
fs.writeFileSync('assets/data/guide-tome1.js', raw, 'utf8');

eval(raw.replace('window.GUIDE_DATA =', 'global.GUIDE_DATA ='));
fs.writeFileSync('scratch/guide_data.json', JSON.stringify(global.GUIDE_DATA));

const rawCheck = fs.readFileSync('assets/data/guide-tome1.js', 'utf8');
console.log('Kelly occurrences remaining:', (rawCheck.match(/Kelly/gi) || []).length);
console.log('Massol occurrences remaining:', (rawCheck.match(/Massol/gi) || []).length);
