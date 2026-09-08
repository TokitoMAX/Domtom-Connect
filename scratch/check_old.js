const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const old = window.GUIDE_DATA.chapters;
const getOld = (id) => old.find(c => c.id === id);

console.log('Old chapters available:');
old.forEach(c => console.log(' - ' + c.id + ': ' + c.title));
