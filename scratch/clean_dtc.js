const fs = require('fs');
const path = require('path');

const files = [
    'mon-espace.html',
    'premium.html',
    'pilotage.html',
    'vitrine.html',
    'business.html',
    'channel.html',
    'mastermind.html',
    'billetterie.html',
    'messages.html',
    'profile.html'
];

files.forEach(f => {
    const filePath = path.join(__dirname, '..', f);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/<a href="dtc\.html" onclick="toggleMobileMenu\(\)"><i class="fas fa-play"><\/i> DTC<\/a>\s*/g, '');
        fs.writeFileSync(filePath, content);
        console.log('Cleaned ' + f);
    }
});
