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
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Empty the nav
    const navStart = content.indexOf('<nav class="navbar">');
    if (navStart !== -1) {
        const navEnd = content.indexOf('</nav>', navStart);
        if (navEnd !== -1) {
            const currentNav = content.substring(navStart, navEnd + 6);
            if (currentNav.includes('Annuaire des Experts')) {
                const newNav = '<nav class="navbar">\n<div class="container"></div>\n</nav>';
                content = content.replace(currentNav, newNav);
                changed = true;
            }
        }
    }

    // 2. Add ui-components.js if missing
    if (!content.includes('ui-components.js')) {
        let prefix = '../';
        // if file is blog/index.html, it is also ../assets/js/ui-components.js
        if (content.includes('<script src="../assets/js/auth.js"></script>')) {
            content = content.replace(
                '<script src="../assets/js/auth.js"></script>',
                '<script src="../assets/js/auth.js"></script>\n<script src="../assets/js/ui-components.js?v=12.00"></script>'
            );
            changed = true;
        } else if (content.includes('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>')) {
            content = content.replace(
                '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>',
                '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../assets/js/ui-components.js?v=12.00"></script>'
            );
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
});

console.log('Updated ' + updatedCount + ' files.');
