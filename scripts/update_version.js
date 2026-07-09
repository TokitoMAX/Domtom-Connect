const fs = require('fs');

const updateVersion = (filePath, oldV, newV) => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(new RegExp('v=' + oldV, 'g'), 'v=' + newV);
        if (filePath.endsWith('sw.js')) {
            content = content.replace(new RegExp('dtc-cache-v' + oldV.replace('.', '')), 'dtc-cache-v' + newV.replace('.', ''));
        }
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath} to ${newV}`);
    }
};

['index.html', 'mon-espace.html', 'dtc.html', 'sw.js'].forEach(f => updateVersion(f, '11.25', '11.26'));
