const fs = require('fs');

global.window = {};
require('../assets/data/guide-tome1.js');
const chs = global.window.GUIDE_DATA.chapters;

chs.forEach((c, idx) => {
  console.log(`\n--- [${idx}] ID="${c.id}" | Number=${c.number} | Badge="${c.badge}" ---`);
  console.log(`Title: ${c.title}`);
  console.log(`Subtitle: ${c.subtitle}`);
  console.log(`Content length: ${c.content ? c.content.length : 0} | Has exercise: ${!!c.exercise} (${c.exercise ? c.exercise.id : ''})`);
  if (c.content) {
    const preview = c.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 100);
    console.log(`Snippet: ${preview}...`);
  }
});
