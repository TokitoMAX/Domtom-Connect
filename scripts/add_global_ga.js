const fs = require('fs');
const path = require('path');

const gaSnippet = `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1C5QTWZFER"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-1C5QTWZFER');
</script>
`;

function injectGAIntoHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has this exact GA code
    if (content.includes('G-1C5QTWZFER')) {
        console.log(`[SKIP] Already injected in: ${filePath}`);
        return;
    }

    // Insert right before </head>
    if (content.includes('</head>')) {
        content = content.replace('</head>', `${gaSnippet}</head>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[INJECTED] ${filePath}`);
    } else {
        console.log(`[WARNING] No </head> found in: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Ignore node_modules, .git, etc.
            if (['node_modules', '.git', 'scripts', 'assets'].includes(file)) continue;
            processDirectory(fullPath);
        } else if (stat.isFile() && file.endsWith('.html')) {
            injectGAIntoHtml(fullPath);
        }
    }
}

// Also process the root HTML files
const rootDir = __dirname.replace(/\\scripts$/, '');
processDirectory(rootDir);
console.log('Injection terminee !');
