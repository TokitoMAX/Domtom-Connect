const fs = require('fs');

const filesToUpdate = [
    'dtc.html', 
    'mon-espace.html', 
    'profile.html', 
    'index.html',
    'billetterie.html',
    'business.html',
    'candidatures.html',
    'channel.html',
    'epopee.html',
    'mastermind.html',
    'messages.html',
    'pilotage.html',
    'premium.html',
    'vitrine.html'
];

const newVersion = '12.00';

filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace all ?v=11.xx with ?v=12.00
        content = content.replace(/v=11\.\d+/g, `v=${newVersion}`);
        // Replace all ?v=10.xx
        content = content.replace(/v=10\.\d+/g, `v=${newVersion}`);
        fs.writeFileSync(filePath, content);
        console.log(`Unified cache version to ${newVersion} in ${filePath}`);
    }
});
