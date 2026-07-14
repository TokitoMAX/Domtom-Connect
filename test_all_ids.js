const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}
const files = walk('./blog');
const idSet = new Set();
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /photo-([a-zA-Z0-9-]+)\?/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        idSet.add(match[1]);
    }
});
const ids = Array.from(idSet);
async function checkAll() {
    console.log('Found ' + ids.length + ' unique Unsplash IDs.');
    for (const id of ids) {
        const url = 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&q=80&w=800';
        try {
            const res = await fetch(url);
            console.log(id + ' : ' + res.status);
        } catch (e) {
            console.log(id + ' : ERROR');
        }
    }
}
checkAll();
