const fs = require('fs');
const files = [
    'assets/js/app.js',
    'assets/js/modules/messages.module.js',
    'profile.html',
    'payment-success.html',
    'view-document.html'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/👑/g, '<i class="fas fa-crown"></i>')
                         .replace(/📅/g, '<i class="fas fa-calendar-alt"></i>')
                         .replace(/🎥/g, '<i class="fas fa-video"></i>')
                         .replace(/💳/g, '<i class="fas fa-credit-card"></i>')
                         .replace(/📍/g, '<i class="fas fa-map-marker-alt"></i>')
                         .replace(/🔒/g, '<i class="fas fa-lock"></i>')
                         .replace(/💼/g, '<i class="fas fa-briefcase"></i>')
                         .replace(/⚡️/g, '<i class="fas fa-bolt"></i>')
                         .replace(/🚀/g, '<i class="fas fa-rocket"></i>')
                         .replace(/📄/g, '<i class="fas fa-file-alt"></i>')
                         .replace(/✅/g, '<i class="fas fa-check-circle"></i>')
                         .replace(/📥/g, '<i class="fas fa-download"></i>');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } catch (err) {
        console.log(`Error updating ${file}: ${err.message}`);
    }
});
