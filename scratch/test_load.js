const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const oldChapters = window.GUIDE_DATA.chapters;
console.log('Successfully loaded old chapters count:', oldChapters.length);
