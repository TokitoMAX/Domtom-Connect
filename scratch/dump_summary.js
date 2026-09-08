const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const chapters = window.GUIDE_DATA.chapters;
chapters.forEach((c, idx) => {
  console.log(`\n=== [${idx}] ID: ${c.id} | BADGE: ${c.badge} ===`);
  console.log(`TITLE: ${c.title}`);
  console.log(`SUBTITLE: ${c.subtitle}`);
  if (c.exercise) {
    console.log(`EXERCISE: [${c.exercise.id}] ${c.exercise.title} (calc: ${!!c.exercise.isCalculator}, fields: ${c.exercise.fields ? c.exercise.fields.length : 0})`);
  }
});
