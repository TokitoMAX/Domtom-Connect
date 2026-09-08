const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'guide-entrepreneur.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('--- Updating Sales Page (guide-entrepreneur.html) ---');

// 1. Remove gradient-text definition and replace with solid Domtom Connect green
html = html.replace(
    /\.hero-headline span\.gradient-text\s*\{[\s\S]*?\}/,
    '.hero-headline span.green-accent {\n            color: #10b981;\n        }'
);

html = html.replace(
    '<span class="gradient-text">sans excuse et sans gros budget</span>',
    '<span class="green-accent">sans excuse et sans gros budget</span>'
);

// 2. Replace Pack Fondateur features
const oldPackRegex = /<ul class="pricing-features-list">[\s\S]*?Badge exclusif « Membre Fondateur » Domtom Connect<\/li>\s*<\/ul>/;

const newPackHtml = `<ul class="pricing-features-list">
                    <li><i class="fa-solid fa-check"></i> <strong>Tout ce qui est inclus dans le Guide Solo</strong></li>
                    <li class="bonus-item"><i class="fa-solid fa-mobile-screen" style="color:#10b981;"></i> <strong>Accès à la bêta fermée de l'application mobile DTC Pulse</strong></li>
                    <li class="bonus-item"><i class="fa-solid fa-rocket" style="color:#10b981;"></i> <strong>Intégration dans l'incubateur Domtom Connect</strong></li>
                    <li><i class="fa-solid fa-check"></i> <strong>Badge exclusif Membre Fondateur</strong> Domtom Connect</li>
                </ul>`;

html = html.replace(oldPackRegex, newPackHtml);

// 3. Update FAQ for DTC Pulse (closed beta, not private club)
html = html.replace(
    /<strong>DTC Pulse<\/strong> est le réseau social et l'application mobile privée développée par Domtom Connect pour connecter les entrepreneurs[\s\S]*?réseaux publics traditionnels\./,
    '<strong>DTC Pulse</strong> est l\'application mobile développée par Domtom Connect pour connecter les entrepreneurs des Caraïbes, d\'Afrique et de la diaspora. Elle est actuellement en phase de bêta fermée avant son ouverture générale sur Android et iOS.'
);

// 4. Clean subtitles and colons
html = html.replace(/80% Action \/ 20% Réflexion : /g, '80% action et 20% réflexion, ');
html = html.replace(/Paiement unique • Accès à vie/g, 'Paiement unique, accès à vie');
html = html.replace(/Paiement unique • Accès VIP/g, 'Paiement unique, accès fondateur');
html = html.replace(/Phase 1 \(Ch\. 1 à 4\) : /g, 'Phase 1 (Ch. 1 à 4) ');
html = html.replace(/Tome 1 : Fondamentaux/g, 'Tome 1, fondamentaux');
html = html.replace(/80% Action \/ 20% Réflexion/g, '80% action et 20% réflexion');

fs.writeFileSync(filePath, html, 'utf8');
console.log('SUCCESS! guide-entrepreneur.html updated perfectly.');
