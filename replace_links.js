const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldContent = content;
    // We only replace exact matches of "mon-projet" in links and scripts, but careful with text.
    // Actually, maybe simpler to just replace "mon-projet" with "mon-espace" globally in these files, 
    // because all instances of mon-projet introduced recently were for the dashboard.
    // EXCEPT "mon-projet" text, but the dashboard URL was "mon-projet". 
    // Let's replace:
    // "mon-projet.html" -> "mon-espace.html"
    // "mon-projet" -> "mon-espace" (but careful not to break text if any).
    // Let's replace 'mon-projet' in specific contexts:
    content = content.replace(/['"]\/?mon-projet['"]/g, match => match.replace('mon-projet', 'mon-espace'));
    content = content.replace(/['"]\.\.\/mon-projet['"]/g, match => match.replace('mon-projet', 'mon-espace'));
    content = content.replace(/['"]\.\.\/\.\.\/mon-projet['"]/g, match => match.replace('mon-projet', 'mon-espace'));
    content = content.replace(/mon-projet\.html/g, 'mon-espace.html');
    content = content.replace(/\/mon-projet/g, '/mon-espace');
    // For text in links: <a href="mon-espace">Aller à mon mon-projet</a>
    content = content.replace(/Aller à mon mon-projet/g, 'Aller à mon espace');

    if (content !== oldContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

const files = [
    'index.html', 'login.html', 'profile.html', 'messages.html',
    'landing/webinaire/index.html',
    'marketplace/projects.html', 'marketplace/jobs.html', 'marketplace/directory.html', 'marketplace/companies.html',
    'registration/client.html', 'registration/basic.html', 'registration/onboarding.html', 'registration/verify-email.html',
    'admin/leads.html', 'assets/js/admin.js', 'assets/js/auth.js'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        replaceInFile(fullPath);
    }
});
