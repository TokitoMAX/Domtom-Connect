const fs = require('fs');
const path = require('path');

global.window = {};
require('../assets/data/guide-tome1.js');
const guideData = global.window.GUIDE_DATA;
const chaps = guideData.chapters;

// 1. Update Chapter 16: Add DTC Bio
const ch16 = chaps.find(c => c.id === 'chapitre-16');
if (ch16) {
    const dtcBioCard = `
          <div class="feature-card" style="border-color: rgba(16, 185, 129, 0.4); background: linear-gradient(145deg, rgba(16, 185, 129, 0.08) 0%, rgba(11, 19, 41, 0.9) 100%);">
              <div class="feature-card-icon" style="color: #10b981;"><i class="fa-solid fa-link"></i></div>
              <h4 style="color: #10b981;">DTC Bio (Domtom Connect)</h4>
              <p>L'alternative locale aux Linktree et Carrd : une page de liens vitrine optimisée mobile pour centraliser tes offres, ton catalogue et ton WhatsApp en un clic.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-bolt"></i></div>
              <h4>Carrd.co (9$ à 19$ / an)</h4>
              <p>Le roi de la One-Page mobile. Rapide, fluide, personnalisable et intégrable avec Stripe en quelques clics.</p>
          </div>`;

    ch16.content = ch16.content.replace(
        /<div class="feature-card">\s*<div class="feature-card-icon"><i class="fa-solid fa-bolt"><\/i><\/div>\s*<h4>Carrd\.co[\s\S]*?<\/div>/,
        dtcBioCard
    );

    // Update exercise options
    if (ch16.exercise) {
        const toolField = ch16.exercise.fields.find(f => f.id === 'onepage_outil_choisi');
        if (toolField && toolField.options) {
            if (!toolField.options.some(opt => opt.value === 'dtcbio')) {
                toolField.options.unshift({
                    value: 'dtcbio',
                    label: 'DTC Bio (Page de profil vitrine Domtom Connect)'
                });
            }
        }
    }
    console.log('✓ Chapter 16 updated with DTC Bio');
}

// 2. Update Conclusion: Add DTC Pulse
const conc = chaps.find(c => c.id === 'conclusion');
if (conc) {
    const dtcPulseBox = `
                <div class="tip-card" style="background: linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.7) 100%); border: 1px solid rgba(16, 185, 129, 0.35); margin-bottom: 35px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="background: #10b981; color: #020617; font-weight: 800; font-size: 0.75rem; padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">Avant-première</span>
                        <h4 style="margin: 0; color: #ffffff; font-size: 1.25rem;"><i class="fa-solid fa-mobile-screen-button" style="color: #10b981; margin-right: 6px;"></i> DTC Pulse — L'Application Mobile & Réseau Social des Entrepreneurs</h4>
                    </div>
                    <p style="margin-bottom: 14px; color: #cbd5e1; line-height: 1.65;">
                        Pour ne plus jamais entreprendre isolé dans ton coin, nous avons créé <strong>DTC Pulse</strong> : l'application mobile et le réseau social privé conçu pour connecter les entrepreneurs des Antilles, de la Guyane, de la Réunion, d'Afrique et de la diaspora. Échange sans filtre, trouve des partenaires de confiance et pose tes questions sans algorithme toxique (actuellement en phase bêta privée, bientôt disponible sur Android et iOS).
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                        <span style="font-size: 0.85rem; color: #10b981; font-weight: 700;"><i class="fa-solid fa-shield-check"></i> Accès prioritaire réservé aux détenteurs de ce guide</span>
                    </div>
                </div>`;

    if (!conc.content.includes('DTC Pulse')) {
        conc.content = conc.content.replace(
            /<div class="programs-showcase">/,
            dtcPulseBox + '\n<div class="programs-showcase">'
        );
        console.log('✓ Conclusion updated with DTC Pulse');
    }
}

// Write back to assets/data/guide-tome1.js
const finalContent = '/**\n * Guide Digital : Les Fondamentaux de l\'Entrepreneur — Tome 1\n * Écosystème Domtom Connect\n * Version Interactive & Enrichie 2026\n * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)\n */\n\nwindow.GUIDE_DATA = ' + JSON.stringify(guideData, null, 4) + ';\n';

const targetPath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
fs.writeFileSync(targetPath, finalContent, 'utf8');
console.log('SUCCESS! Updated assets/data/guide-tome1.js with DTC integrations.');
