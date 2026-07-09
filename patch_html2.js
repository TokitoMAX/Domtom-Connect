const fs = require('fs');
const files = ['billetterie.html', 'business.html', 'channel.html', 'dtc.html', 'mastermind.html', 'messages.html', 'mon-espace.html', 'pilotage.html', 'premium.html', 'profile.html', 'vitrine.html'];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /<script src="\.\/assets\/js\/ecosystems\/spectators\.module\.js\?v=.*?"><\/script>/m;
    if (regex.test(content) && !content.includes('standard.module.js')) {
        content = content.replace(regex, '$&\n    <script src="./assets/js/ecosystems/standard.module.js?v=11.22"></script>');
        fs.writeFileSync(f, content);
        console.log('Patched ' + f);
    } else {
        console.log('Skipped ' + f);
    }
});
