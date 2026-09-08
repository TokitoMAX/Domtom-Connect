const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const ch12 = window.GUIDE_DATA.chapters.find(c => c.id === 'chapitre-12');
console.log('Chapter 12:', ch12.title, ch12.subtitle);
console.log('Snippet of content:');
console.log(ch12.content.substring(0, 500));
