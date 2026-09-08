const fs = require('fs');
const path = require('path');

global.window = {};
require('../assets/data/guide-tome1.js');
const guideData = global.window.GUIDE_DATA;
const chaps = guideData.chapters;

console.log('--- Cleaning Remaining Headings and Colons ---');

const replacements = [
    ['Étape suivante :', 'Étape suivante'],
    ['Sélectionne & Valide Ta Voie Officielle', 'Sélectionne et valide ta voie officielle'],
    ['Produits Physiques & Terroirs', 'Produits physiques et terroirs'],
    ['Produits Digitaux & E-books', 'Produits digitaux et e-books'],
    ['Restauration, Food & Street-Food', 'Restauration, food et street-food'],
    ['Commerce & Achat-Revente', 'Commerce et achat-revente'],
    ['Cartographie des Métiers Concrets par Voie', 'Cartographie des métiers concrets par voie'],
    ['Artisanat, Beauté & Terroirs', 'Artisanat, beauté et terroirs'],
    ['Food & Restauration Rapide', 'Food et restauration rapide'],
    ['La Règle d\'Or : Les Faiblesses de tes Concurrents sont TES Opportunités', 'Les faiblesses de tes concurrents deviennent tes opportunités'],
    ['Les 4 Failles Classiques à Traquer chez les Concurrents', 'Les quatre failles classiques à repérer chez les concurrents'],
    ['Analyse d\'Opportunité Terrain selon Ta Voie', 'Analyse d\'opportunité terrain selon ta voie'],
    ['Analyse de Marché : Produits Physiques', 'Analyse de marché pour les produits physiques'],
    ['Analyse de Marché : Services B2B', 'Analyse de marché pour les services et prestations B2B'],
    ['Analyse de Marché : Produits Digitaux', 'Analyse de marché pour les produits digitaux'],
    ['Analyse de Marché : Restauration & Food', 'Analyse de marché pour la restauration et la food'],
    ['Analyse de Marché : Boutique & Revente', 'Analyse de marché pour le commerce et la revente'],
    ['La Règle d\'Or : Tu ne vends pas un produit, tu vends une TRANSFORMATION', 'Vendre une transformation plutôt qu\'un simple produit'],
    ['Trois Exemples Concrets de Transformation Terrain', 'Trois exemples concrets de transformation sur le terrain'],
    ['Ce qui t\'attend au Chapitre 8 :', 'Ce qui t\'attend au chapitre suivant'],
    ['Ce qui t\'attend au Chapitre 8', 'Ce qui t\'attend au chapitre suivant'],
    ['3 Niches Fortes à Exploiter en Produits Physiques', 'Trois niches porteuses en produits physiques'],
    ['3 Niches Fortes à Exploiter en Prestations B2B', 'Trois niches porteuses en prestations B2B'],
    ['3 Niches Fortes à Exploiter en Produits Digitaux', 'Trois niches porteuses en produits digitaux'],
    ['3 Niches Fortes à Exploiter en Cuisine & Food', 'Trois niches porteuses en cuisine et food'],
    ['3 Niches Fortes à Exploiter en Commerce', 'Trois niches porteuses en commerce'],
    ['Les 3 Piliers de Rentabilité à Valider', 'Les trois piliers de rentabilité à valider'],
    ['Stripe & Liens de Paiement', 'Stripe et liens de paiement'],
    ['TPE Mobile SumUp / Zettle', 'Terminal mobile SumUp et Zettle'],
    ['Compte Impôts & URSSAF', 'Compte impôts et cotisations'],
    ['Compte Salaire / Réserve', 'Compte salaire et réserve'],
    ['Le Test des 200 Premières Personnes', 'Le test des deux cents premières personnes'],
    ['Sélectionne Ton Canal Maître', 'Sélectionne ton canal principal']
];

chaps.forEach(c => {
    replacements.forEach(([target, rep]) => {
        if (c.content.includes(target)) {
            c.content = c.content.split(target).join(rep);
        }
    });
});

const finalContent = '/**\n * Guide Digital : Les Fondamentaux de l\'Entrepreneur — Tome 1\n * Écosystème Domtom Connect\n * Version Interactive & Enrichie 2026\n * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)\n */\n\nwindow.GUIDE_DATA = ' + JSON.stringify(guideData, null, 4) + ';\n';

const targetPath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
fs.writeFileSync(targetPath, finalContent, 'utf8');
console.log('SUCCESS! All remaining headings cleaned in guide-tome1.js');
