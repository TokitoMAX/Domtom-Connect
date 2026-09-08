const fs = require('fs');
global.window = {};
require('../assets/data/guide-tome1.js');
const chaps = global.window.GUIDE_DATA.chapters;

console.log('=== AUDIT HEADINGS AND COLONS ===');

chaps.forEach((c, idx) => {
    // Check chapter title and subtitle
    if (c.title.includes(':')) {
        console.log(`[Ch ${idx} (${c.id})] Title has colon: "${c.title}"`);
    }
    if (c.subtitle && c.subtitle.includes(':')) {
        console.log(`[Ch ${idx} (${c.id})] Subtitle has colon: "${c.subtitle}"`);
    }

    // Check inner headings in content
    const headingMatches = c.content.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi) || [];
    headingMatches.forEach(h => {
        const text = h.replace(/<[^>]+>/g, '').trim();
        // Check for colon
        if (text.includes(':')) {
            console.log(`[Ch ${idx} (${c.id})] Heading has colon: "${text}"`);
        }
        // Check for Title Case (multiple uppercase letters in words)
        const words = text.split(/\s+/).filter(w => w.length > 3 && !w.startsWith('DTC'));
        const upperWords = words.filter(w => /^[A-ZÀ-ÖØ-ß]/.test(w));
        if (upperWords.length > 2) {
            console.log(`[Ch ${idx} (${c.id})] Possible Title Case heading: "${text}"`);
        }
    });

    // Check exercise title and field labels
    if (c.exercise) {
        if (c.exercise.title.includes(':')) {
            console.log(`[Ch ${idx} (${c.id})] Exercise title has colon: "${c.exercise.title}"`);
        }
    }
});
