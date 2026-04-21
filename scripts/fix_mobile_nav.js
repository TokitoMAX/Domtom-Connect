const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..');
const htmlFiles = [
    'profile.html',
    'mon-espace.html',
    'messages.html',
    'business.html',
    'epopee.html',
    'candidatures.html',
    'marketplace/jobs.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(directoryPath, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file}, not found.`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove the entire <nav class="mobile-nav"> ... </nav> block
    const navRegex = /<nav class="mobile-nav">[\s\S]*?<\/nav>/g;
    if (navRegex.test(content)) {
        content = content.replace(navRegex, '');
        modified = true;
    }

    // 2. Inject <script src="assets/js/mobile-nav.js"></script> just before </body>
    const jsSrc = file.includes('marketplace/') ? '../assets/js/mobile-nav.js' : 'assets/js/mobile-nav.js';
    const scriptTag = `<script src="${jsSrc}"></script>\n</body>`;
    
    // Check if script is already injected
    if (!content.includes(jsSrc) && content.includes('</body>')) {
        content = content.replace('</body>', scriptTag);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
});
