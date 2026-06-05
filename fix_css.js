const fs = require('fs');

const appJsPath = 'd:/DomtomConnect-Website/assets/js/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

// The issue is `height: 100%` on the inner div, it should be `flex: 1`
content = content.replace(
    '<div style="background: white; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; height: 100%; border: 1px solid #e2e8f0;">',
    '<div style="background: white; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; flex: 1; border: 1px solid #e2e8f0;">'
);

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('App.js CSS layout fixed');
