const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const chapters = window.GUIDE_DATA.chapters;
console.log('Total entries:', chapters.length);
chapters.forEach((c, idx) => {
  console.log(`[${idx}] id: "${c.id}" | number: ${c.number} | badge: "${c.badge}" | title: "${c.title}"`);
});
