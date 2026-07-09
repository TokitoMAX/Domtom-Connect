const fs = require('fs');
try {
    const data = fs.readFileSync('vercel.json', 'utf8');
    JSON.parse(data);
    console.log('JSON is valid syntactically.');
} catch (e) {
    console.error('Syntax error:', e);
}
