const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const oldContent = content;

    // Replace "/mon-espace" with "/mon-projet" in links and strings
    content = content.replace(/['"]\/?mon-espace['"]/g, match => match.replace('mon-espace', 'mon-projet'));
    content = content.replace(/['"]\.\.\/mon-espace['"]/g, match => match.replace('mon-espace', 'mon-projet'));
    content = content.replace(/['"]\.\.\/\.\.\/mon-espace['"]/g, match => match.replace('mon-espace', 'mon-projet'));
    content = content.replace(/mon-espace\.html/g, 'mon-projet.html');
    content = content.replace(/\/mon-espace/g, '/mon-projet');

    // Fix specific text mistakes if any
    content = content.replace(/mon mon-projet/g, 'mon projet');

    if (content !== oldContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

const files = [
    'index.html', 'login.html', 'profile.html', 'messages.html',
    'mon-espace.html', // Note: we'll rename this file later
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
