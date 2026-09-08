const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const chapters = window.GUIDE_DATA.chapters;
console.log('Total chapters:', chapters.length);
chapters.forEach((c, idx) => {
  console.log(`Index ${idx}: id="${c.id}", num="${c.num || ''}", title="${c.title}", badge="${c.badge || ''}"`);
});
