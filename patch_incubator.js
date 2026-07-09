const fs = require('fs');
const files = ['billetterie.html', 'business.html', 'channel.html', 'dtc.html', 'mastermind.html', 'messages.html', 'mon-espace.html', 'pilotage.html', 'premium.html', 'profile.html', 'vitrine.html'];

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        // Check if already injected
        if (content.includes('incubator.module.js')) {
            console.log(f + ' already patched.');
            return;
        }
        
        // Inject after premium.module.js
        if (content.includes('<script src="./assets/js/modules/premium.module.js?v=1.0"></script>')) {
            content = content.replace('<script src="./assets/js/modules/premium.module.js?v=1.0"></script>', 
                '<script src="./assets/js/modules/premium.module.js?v=1.0"></script>\n    <script src="./assets/js/modules/incubator.module.js?v=1.0"></script>');
            fs.writeFileSync(f, content);
            console.log('Successfully patched ' + f);
        } else {
            console.log('Could not find premium.module.js in ' + f);
        }
    } catch (e) {
        console.error('Error with ' + f + ':', e);
    }
});
