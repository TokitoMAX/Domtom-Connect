const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
const raw = fs.readFileSync(filePath, 'utf8');

// Parse current GUIDE_DATA
eval(raw.replace('window.GUIDE_DATA =', 'global.GUIDE_DATA ='));
const currentChapters = global.GUIDE_DATA.chapters;

console.log('Total current chapters:', currentChapters.length);

// Helper to find chapter by title fragment or id
function findCh(predicate) {
    const found = currentChapters.find(predicate);
    if (!found) console.error('Chapter not found for predicate');
    return found;
}

// 1. Couverture
const cCover = findCh(c => c.id === 'couverture');

// 2. Avant-propos
const cAvant = findCh(c => c.id === 'avant-propos');

// 3. Chapitre 1 : Ce que tu crois savoir
const c1 = findCh(c => c.title.includes("Ce que tu crois savoir"));

// 4. Chapitre 2 : Le mur que tu t'es construit
const c2 = findCh(c => c.title.includes("Le mur"));

// 5. Chapitre 3 : Ton Why
const c3 = findCh(c => c.title.includes("Ton Why"));

// 6. Chapitre 4 : Trouve ton chemin (+ 5 histoires réelles)
const c4 = findCh(c => c.title.includes("Trouve ton chemin"));

// 7. Chapitre 5 : Zoom sur ton secteur : Les 5 Voies Terrain (Modulable)
const c5 = findCh(c => c.title.includes("Zoom sur ton secteur"));

// 8. Chapitre 6 : Ton client, en profondeur
const c6 = findCh(c => c.title.includes("Ton client, en profondeur"));

// 9. Chapitre 7 : Trouver sa Niche Rentable, sa Différenciation & Vendre la Transformation
const c7 = findCh(c => c.title.includes("Trouver sa Niche Rentable"));

// 10. Chapitre 8 : Seul ou accompagné : faut-il t'associer ?
const c8 = findCh(c => c.title.includes("Seul ou accompagné"));

// 11. Chapitre 9 : Ton chemin, tes moyens & Le défi 80/20
const c9 = findCh(c => c.title.includes("Ton chemin, tes moyens") || c.title.includes("80/20"));

// 12. Chapitre 10 : Architecture de l'Offre Irrésistible & Pricing
const c10 = findCh(c => c.title.includes("Architecture de l'Offre"));

// 13. Chapitre 11 : Les Vrais Fondamentaux du Branding
const c11 = findCh(c => c.title.includes("Fondamentaux du Branding"));

// 14. Chapitre 12 : Ton Premier Logo : Zéro Prise de Tête & Studio Logo
const c12 = findCh(c => c.title.includes("Premier Logo"));

// 15. Chapitre 13 : Financer sans la banque & Maîtriser ses chiffres simples
const c13 = findCh(c => c.title.includes("Financer sans la banque"));

// 16. Chapitre 14 : Les outils selon ton business
const c14 = findCh(c => c.title.includes("Les outils selon ton business"));

// 17. Chapitre 15 : Quand ça coince : surmonter l'échec
const c15 = findCh(c => c.title.includes("Quand ça coince"));

// 18. Chapitre 16 : Réseaux Sociaux (1/3) — Psychologie, Algorithme 2026 & Incarnation
const c16 = findCh(c => c.title.includes("Réseaux Sociaux (1/3)"));

// 19. Chapitre 17 : Réseaux Sociaux (2/3) — Le Tunnel TOFU-MOFU-BOFU & Choisir son Canal Maître
const c17 = findCh(c => c.title.includes("Réseaux Sociaux (2/3)"));

// 20. Chapitre 18 : Réseaux Sociaux (3/3) — Playbooks par Secteur & Scripts de Closing
const c18 = findCh(c => c.title.includes("Réseaux Sociaux (3/3)"));

// 21. Chapitre 19 : Le Pitch en Une Phrase
const c19 = findCh(c => c.title.includes("Le Pitch en Une Phrase"));

// 22. Chapitre 20 : Tes 30 premiers jours d'action
const c20 = findCh(c => c.title.includes("30 premiers jours"));

// 23. Conclusion
const cConclusion = findCh(c => c.id === 'conclusion');

const orderedList = [
    cCover,
    cAvant,
    c1,
    c2,
    c3,
    c4,
    c5,
    c6,
    c7,
    c8,
    c9,
    c10,
    c11,
    c12,
    c13,
    c14,
    c15,
    c16,
    c17,
    c18,
    c19,
    c20,
    cConclusion
];

// Renumber and re-badge sequentially
orderedList.forEach((ch, idx) => {
    if (ch.isCover) {
        ch.number = 0;
        ch.badge = "Édition Officielle";
    } else if (ch.id === 'avant-propos') {
        ch.number = 1;
        ch.badge = "Consultation Initiale";
    } else if (ch.id === 'conclusion') {
        ch.badge = "Conclusion & Passage à l'Action";
    } else {
        const num = idx - 1; // 1-indexed after avant-propos
        ch.number = num;
        ch.badge = `Chapitre ${num}`;
        ch.id = `chapitre-${num}`;
        if (ch.exercise) {
            ch.exercise.id = `ex_chapitre_${num}`;
        }
    }
});

const outputData = {
    meta: {
        title: "Les fondamentaux de l'entrepreneur — Tome 1",
        subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
        author: "Domtom Connect",
        edition: "2026 — Édition Interactive Enrichie",
        totalChapters: orderedList.length
    },
    chapters: orderedList
};

const filePrefix = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie
 */

window.GUIDE_DATA = `;

fs.writeFileSync(filePath, filePrefix + JSON.stringify(outputData, null, 4) + ';\n', 'utf8');
console.log('Successfully reordered and written guide-tome1.js! Total chapters:', orderedList.length);
