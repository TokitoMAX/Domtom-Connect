const fs = require('fs');
const files = ['billetterie.html', 'business.html', 'channel.html', 'dtc.html', 'mastermind.html', 'messages.html', 'mon-espace.html', 'pilotage.html', 'premium.html', 'profile.html', 'vitrine.html'];

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        
        // Add incubator-view div
        if (content.includes('<div id="premium-view" class="view-section" style="display:none;"></div>')) {
            if (!content.includes('<div id="incubator-view" class="view-section" style="display:none;"></div>')) {
                content = content.replace('<div id="premium-view" class="view-section" style="display:none;"></div>', 
                    '<div id="premium-view" class="view-section" style="display:none;"></div>\n                <div id="incubator-view" class="view-section" style="display:none;"></div>');
                fs.writeFileSync(f, content);
                console.log('Successfully added incubator-view to ' + f);
            } else {
                console.log('incubator-view already exists in ' + f);
            }
        } else {
            console.log('Could not find premium-view in ' + f);
        }
    } catch (e) {
        console.error('Error with ' + f + ':', e);
    }
});
