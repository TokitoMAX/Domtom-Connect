const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

walk('./', (filePath) => {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('href="#"')) {
            console.log("Cleaning:", filePath);
            let updated = content.replace(/href="#"/g, 'href="javascript:void(0)"');
            fs.writeFileSync(filePath, updated, 'utf8');
        }
    }
});
