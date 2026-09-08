const fs = require('fs');

const txt = fs.readFileSync('scratch/exact_avatar.txt', 'utf8');
const idx = txt.indexOf('id: "chapitre-5",');
let slice = txt.substring(idx).trim();
if (slice.endsWith(',')) slice = slice.substring(0, slice.length - 1);

const fnAv = new Function("return ({\n" + slice + "\n);");
const rawAvatar = fnAv();
console.log('SUCCESS! Avatar title:', rawAvatar.title, '| Exercise fields count:', rawAvatar.exercise.fields.length);
