const fs = require('fs');
const path = require('path');

// Load current data
global.window = {};
require('../assets/data/guide-tome1.js');
const guideData = global.window.GUIDE_DATA;
const chaps = guideData.chapters;

console.log('--- Applying Pedagogical Refinement to All 30 Chapters ---');

// 1. Clean Minimalist Cover
const coverChap = chaps.find(c => c.id === 'couverture');
if (coverChap) {
    coverChap.title = "Couverture du tome 1";
    coverChap.subtitle = "Les fondamentaux de l'entrepreneur";
    coverChap.content = `
    <div class="clean-cover-page">
        <div class="clean-cover-wrapper" id="cover-3d-book" role="button" tabindex="0" title="Cliquer pour commencer la consultation">
            <img src="assets/images/couverture-guide-tome1.jpg" alt="Couverture officielle — Les Fondamentaux de l'Entrepreneur Tome 1" class="clean-cover-image">
        </div>
        <div class="clean-cover-actions">
            <button id="btn-open-guide-now" class="btn-clean-open-cover">
                <span>Ouvrir le guide et commencer</span>
                <i class="fa-solid fa-arrow-right"></i>
            </button>
            <span class="clean-cover-hint">Cliquer sur la couverture ou le bouton pour démarrer</span>
        </div>
    </div>
    `;
    console.log('✓ Clean cover page applied');
}

// 2. Titles & Subtitles Harmonization (Sentence Case & Zero Middle Colons)
const titleMap = {
    'avant-propos': {
        title: "Avant de commencer, la consultation",
        subtitle: "Pose ce que tu fais, prends un carnet, on parle franchement."
    },
    'chapitre-1': {
        title: "Ce que tu crois savoir sur l'entrepreneuriat est faux",
        subtitle: "Démystifier les levées de fonds et repartir du seul juge de paix sur le terrain."
    },
    'chapitre-2': {
        title: "Le mur que tu t'es construit toi-même",
        subtitle: "Déconstruire le syndrome de l'imposteur, la peur du regard des autres et le manque de légitimité."
    },
    'chapitre-3': {
        title: "Ton why et ta légitimité profonde",
        subtitle: "Trouver ton moteur profond pour ne jamais abandonner au premier obstacle."
    },
    'chapitre-4': {
        title: "La loi de Pareto pour faire un maximum avec tes moyens actuels",
        subtitle: "Comprendre comment vingt pour cent de tes actions créent l'essentiel de tes résultats sans budget de départ."
    },
    'chapitre-5': {
        title: "Comprendre les cinq chemins à travers cinq histoires réelles",
        subtitle: "Découvre les cinq véhicules possibles pour bâtir ton entreprise sans te précipiter."
    },
    'chapitre-6': {
        title: "Choisir son chemin et valider sa voie d'action",
        subtitle: "L'aiguillage stratégique pour sélectionner ton modèle économique et adapter tout le reste du guide à ta réalité."
    },
    'chapitre-7': {
        title: "Du modèle au métier pour valoriser tes compétences réelles",
        subtitle: "Un modèle n'est qu'un véhicule, tu dois définir ton métier exact, tes forces immédiates et ce que tu es capable de délivrer."
    },
    'chapitre-8': {
        title: "Étude de marché et analyse des opportunités du terrain",
        subtitle: "Les quatre failles chroniques des acteurs locaux comme le service client ou les retards, et comment t'y engouffrer."
    },
    'chapitre-9': {
        title: "Comprendre la niche et la psychologie du positionnement",
        subtitle: "Pourquoi vouloir plaire à tout le monde garantit de ne vendre à personne et comment maîtriser l'art du soulagement."
    },
    'chapitre-10': {
        title: "Verrouiller sa niche rentable et sa différenciation",
        subtitle: "Passer de la théorie à l'engagement en définissant ton angle unique et ton sous-marché solvable."
    },
    'chapitre-11': {
        title: "Comprendre son client idéal en profondeur",
        subtitle: "Le profil de ton client idéal, de ses frustrations inavouées jusqu'à son déclencheur d'achat immédiat."
    },
    'chapitre-12': {
        title: "Les vrais fondamentaux de la marque et de la réputation",
        subtitle: "Ta réputation te précède toujours, voici comment construire une marque forte sans budget excessif."
    },
    'chapitre-13': {
        title: "Créer son premier logo sans prise de tête",
        subtitle: "La règle d'or reste la lisibilité sur smartphone avant tout, avec des couleurs adaptées à ton message."
    },
    'chapitre-14': {
        title: "Construire une offre irrésistible et fixer ses prix",
        subtitle: "Transformer un simple produit en une offre évidente grâce à trois paliers de valeur pour maximiser tes revenus."
    },
    'chapitre-15': {
        title: "Lancer une offre bêta et récolter ses premières preuves sociales",
        subtitle: "Le secret des lancements réussis repose sur trois à cinq clients tests avant de dévoiler ton offre au grand public."
    },
    'chapitre-16': {
        title: "Créer une page de vente simple et efficace",
        subtitle: "Une seule page bien structurée en cinq blocs suffit pour convertir tes visiteurs en acheteurs sans site complexe."
    },
    'chapitre-17': {
        title: "Encaisser sans friction et maîtriser sa rentabilité",
        subtitle: "La finance enfin démystifiée avec les bons outils d'encaissement, le calcul du point mort et ton simulateur de revenus."
    },
    'chapitre-18': {
        title: "Choisir les bons outils selon son activité",
        subtitle: "Moins tu as d'outils, plus tu vas vite grâce à une sélection minimale et gratuite pour faire tourner ton activité."
    },
    'chapitre-19': {
        title: "Réseaux sociaux, algorithmes et incarnation de marque",
        subtitle: "Ce qui fait vendre aujourd'hui repose sur l'humain derrière l'écran et la confiance authentique plutôt que des comptes vitrines sans visage."
    },
    'chapitre-20': {
        title: "Créer un système de contenu régulier sans s'épuiser",
        subtitle: "La méthode des quatre piliers pour tourner et planifier un mois de publications en trois heures chrono."
    },
    'chapitre-21': {
        title: "Choisir son canal principal et structurer son tunnel de vente",
        subtitle: "Un seul réseau social maîtrisé vaut dix comptes abandonnés pour attirer, fidéliser et convertir simplement."
    },
    'chapitre-22': {
        title: "Converser et conclure ses ventes par message privé",
        subtitle: "Les scripts adaptés à ton secteur pour transformer une simple demande de renseignement en vente conclue."
    },
    'chapitre-23': {
        title: "Présenter son projet en une phrase percutante",
        subtitle: "La formule en quatre briques pour expliquer ton activité à n'importe qui en dix secondes chrono."
    },
    'chapitre-24': {
        title: "Surmonter l'échec, le rejet et les moments de doute",
        subtitle: "Le rejet n'est pas une sentence mais une donnée pour apprendre à ajuster ton offre et garder le cap."
    },
    'chapitre-25': {
        title: "Fidéliser ses clients et créer une boucle de recommandation",
        subtitle: "Fidéliser ses clients existants coûte bien moins cher que d'en chercher de nouveaux grâce à un protocole de suivi attentif."
    },
    'chapitre-26': {
        title: "Entreprendre seul ou s'associer avec les bonnes règles",
        subtitle: "Les questions indispensables à clarifier avant de s'associer afin d'éviter les pièges et désaccords futurs."
    },
    'chapitre-27': {
        title: "Plan d'action concret pour tes trente premiers jours",
        subtitle: "Ta feuille de route semaine par semaine pour passer de l'idée brute jusqu'à tes premiers clients payants."
    },
    'conclusion': {
        title: "Pour conclure cette consultation",
        subtitle: "Le serment de passage à l'action, l'export de ton plan et tes opportunités avec l'écosystème Domtom Connect."
    }
};

chaps.forEach(c => {
    if (titleMap[c.id]) {
        c.title = titleMap[c.id].title;
        c.subtitle = titleMap[c.id].subtitle;
    }
});
console.log('✓ Titles and subtitles harmonized');

// 3. Chapter 4 Exercise: Coherent Phase 1 Action & Resources
const ch4 = chaps.find(c => c.id === 'chapitre-4');
if (ch4) {
    ch4.exercise = {
        id: "ex_chapitre_4",
        title: "Ton engagement d'action et tes ressources immédiates",
        description: "La loi de Pareto impose de consacrer 80% de ton énergie à l'action concrète et 20% à la réflexion. Définis dès maintenant tes conditions d'exécution :",
        fields: [
            {
                id: "pareto_distractions_eliminees",
                type: "textarea",
                label: "Quelles sont les distractions ou habitudes de sur-réflexion que tu t'engages à éliminer dès cette semaine ?",
                placeholder: "Ex: Passer des heures à scroller sans but, chercher la perfection avant de commencer, attendre un financement miracle..."
            },
            {
                id: "pareto_ressources_disponibles",
                type: "textarea",
                label: "Quelles sont les ressources concrètes que tu as déjà à ta disposition sans dépenser un euro ?",
                placeholder: "Ex: 2 heures de temps libre chaque soir, un smartphone avec connexion internet, un entourage proche à sonder..."
            },
            {
                id: "pareto_heures_action_hebdo",
                type: "text",
                label: "Combien d'heures précises par semaine bloques-tu dans ton agenda pour avancer sur cette consultation ?",
                placeholder: "Ex: 6 heures par semaine (2h le mardi, 2h le jeudi, 2h le samedi)"
            }
        ]
    };
    console.log('✓ Chapter 4 exercise updated for coherent Phase 1');
}

// 4. Chapter 6 Pathway Confirmation Banner: Add Reset Button & Clean Next Step
const ch6 = chaps.find(c => c.id === 'chapitre-6');
if (ch6) {
    ch6.content = ch6.content.replace(
        /<div id="pathway-confirmation-box"[^>]*>[\s\S]*?<\/div>\s*<\/div>/,
        `<div id="pathway-confirmation-box" class="pathway-confirmation-banner" style="display: none;">
            <div class="confirmation-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="confirmation-text">
                <h4 id="confirmation-title">Voie validée</h4>
                <p id="confirmation-desc">Ton carnet de bord et tous les chapitres suivants sont désormais configurés pour ton modèle. Tu peux passer au Chapitre 7 pour auditer tes compétences exactes.</p>
            </div>
            <button type="button" class="btn-reset-pathway" id="btn-reset-pathway" title="Cliquer pour décocher et réinitialiser ton choix">
                <i class="fa-solid fa-rotate-left"></i> Décocher / Changer
            </button>
        </div>`
    );
    if (ch6.exercise) {
        ch6.exercise.title = "Validation de ta voie d'action";
        ch6.exercise.description = "Sélectionne ta voie officielle ou modifie ton choix ci-dessous :";
    }
    console.log('✓ Chapter 6 reset button added in banner');
}

// 5. Fix Chapter 27 reference to Chapter 17 (Simulator)
const ch27 = chaps.find(c => c.id === 'chapitre-27');
if (ch27 && ch27.exercise) {
    const f = ch27.exercise.fields.find(fld => fld.id === 's2_check_2');
    if (f) {
        f.label = "Calculer mon point mort et ma cadence de vente dans le simulateur financier (Chapitre 17)";
        console.log('✓ Chapter 27 simulator reference fixed to Chapter 17');
    }
}

// 6. Polish Exercise Titles to remove colons in titles
const exerciseTitleFixes = {
    'ex_chapitre_1': "Le test des cinq personnes sur le terrain",
    'ex_chapitre_2': "Identifier et briser tes blocages",
    'ex_chapitre_3': "Définir ton why profond",
    'ex_chapitre_5': "Auto-diagnostic réflexif sans pression",
    'ex_chapitre_7': "Bilan de compétences et choix de ton métier réel",
    'ex_chapitre_8': "Étude de marché et analyse concurrentielle",
    'ex_chapitre_9': "Comprendre la transformation de ton client",
    'ex_chapitre_10': "Verrouillage de ta niche et différenciation",
    'ex_chapitre_11': "Profils de ton client idéal",
    'ex_chapitre_12': "Fondations de ta réputation et de ta marque",
    'ex_chapitre_13': "Studio logo et test en situation réelle",
    'ex_chapitre_14': "Architecture de ton échelle d'offres en trois paliers",
    'ex_chapitre_15': "Recrutement de tes cinq premiers clients tests",
    'ex_chapitre_16': "Structure de ta page de vente en cinq blocs",
    'ex_chapitre_17': "Simulateur financier de rentabilité et cadence de vente",
    'ex_chapitre_18': "Ta pile d'outils minimale",
    'ex_chapitre_19': "Diagnostic d'incarnation et de visibilité",
    'ex_chapitre_20': "Matrice des quatre piliers de contenu",
    'ex_chapitre_21': "Stratégie de ton tunnel d'attraction et de conversion",
    'ex_chapitre_22': "Plan d'action et scripts de conversation sur ton canal",
    'ex_chapitre_23': "Formuler ton pitch en une phrase",
    'ex_chapitre_24': "Protocole pour surmonter le rejet et les objections",
    'ex_chapitre_25': "Protocole de suivi post-vente et parrainage",
    'ex_chapitre_26': "Diagnostic d'association et répartition des rôles",
    'ex_chapitre_27': "Feuille de route des trente premiers jours",
    'ex_conclusion': "Bilan et export de ton plan d'action"
};

chaps.forEach(c => {
    if (c.exercise && exerciseTitleFixes[c.exercise.id]) {
        c.exercise.title = exerciseTitleFixes[c.exercise.id];
    }
});
console.log('✓ Exercise titles polished');

// Write out updated data file
const finalContent = '/**\n * Guide Digital : Les Fondamentaux de l\'Entrepreneur — Tome 1\n * Écosystème Domtom Connect\n * Version Interactive & Enrichie 2026\n * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)\n */\n\nwindow.GUIDE_DATA = ' + JSON.stringify(guideData, null, 4) + ';\n';

const targetPath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
fs.writeFileSync(targetPath, finalContent, 'utf8');
console.log('SUCCESS! Updated assets/data/guide-tome1.js cleanly. Total length:', finalContent.length);
