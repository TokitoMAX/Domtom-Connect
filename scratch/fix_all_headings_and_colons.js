const fs = require('fs');
const path = require('path');

global.window = {};
require('../assets/data/guide-tome1.js');
const guideData = global.window.GUIDE_DATA;
const chaps = guideData.chapters;

console.log('--- Cleaning Headings, Colons, Fake Stories, and Title Case ---');

// 1. Clean Chapter 4: Remove Rodrigue, keep honest practical reality
const ch4 = chaps.find(c => c.id === 'chapitre-4');
if (ch4) {
    ch4.content = `
      <p class="lead-text">
          Voici la règle du jeu suprême de toute cette consultation, inscrite en grand sur la couverture de ce guide : <strong>80% d'action et 20% de réflexion</strong>. Si tu ne retiens qu'un seul principe de tout ce livre, que ce soit celui-ci.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-scale-balanced"></i></div>
          <p>
              « 80% de tes résultats économiques découleront de seulement 20% de tes efforts. Le drame de beaucoup de créateurs est de passer 80% de leur temps sur des détails secondaires qui rapportent zéro euro. »
          </p>
      </div>
      <h3>La créativité naît de la contrainte et des moyens actuels</h3>
      <p>
          Beaucoup pensent qu'il faut un emprunt bancaire, un local et un budget colossal pour commencer. C'est un piège fréquent. Avoir peu de moyens financiers au départ oblige à être dix fois plus affûté, plus agile et plus proche de ses premiers interlocuteurs.
      </p>
      <p>
          Quand on démarre avec ses propres moyens, on se concentre sur l'essentiel : <strong>aller échanger avec des personnes réelles et comprendre leurs besoins avant d'engager la moindre dépense</strong>.
      </p>

      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">La règle d'action</span>
              <h4>Les 20% d'efforts vitaux face aux 80% de dispersion</h4>
          </div>
          <div class="method-body">
              <div class="method-steps">
                  <div class="method-step-item">
                      <div class="method-step-num" style="background:#ef4444; color:#fff;">❌</div>
                      <div class="method-step-content">
                          <strong>Les 80% de dispersion qui font perdre du temps</strong>
                          <p>Passer des semaines à hésiter sur un nom, peaufiner un logo avant d'avoir une offre, attendre un financement incertain ou créer des comptes sur tous les réseaux sociaux sans savoir quoi vendre.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num" style="background:#10b981; color:#fff;">✅</div>
                      <div class="method-step-content">
                          <strong>Les 20% vitaux qui font avancer concrètement</strong>
                          <p>Contacter directement des personnes concernées par le problème, écouter leurs besoins sans chercher à survendre, formuler une solution claire et obtenir un premier engagement réel.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <h3>Démarrer avec ce qu'on a déjà sous la main</h3>
      <p>
          Le principe fondamental de Pareto appliqué à l'entrepreneuriat consiste à faire l'inventaire honnête de ce qui est immédiatement disponible : tes compétences pratiques, ton temps disponible en dehors des heures de travail, ton smartphone et ton cercle de relations proches.
      </p>
      <p>
          Toute la suite de cette consultation est construite sur cette logique : avancer pas à pas, valider chaque étape sur le terrain et ne dépenser d'argent que lorsque les premiers revenus commencent à rentrer.
      </p>
    `;

    // Update Q3 label precisely as requested
    if (ch4.exercise) {
        const q3 = ch4.exercise.fields.find(f => f.id === 'pareto_heures_action_hebdo');
        if (q3) {
            q3.label = "Combien d'heures précises par semaine tu bloqueras pour avancer dans cette consultation ?";
        }
    }
    console.log('✓ Chapter 4 cleaned (no fake stories, honest Pareto principle, exact Q3 label)');
}

// 2. Headings replacements map for all chapters (eliminate Title Case and colons)
const headingReplacements = [
    // Chapter 12 (Branding)
    ['<h3>1. Le Branding dans la Vie de Tous les Jours</h3>', '<h3>1. Le branding dans la vie de tous les jours</h3>'],
    ['<h3>2. Le Branding dans Ton Business : La Promesse Répétée</h3>', '<h3>2. Le branding dans ton business et la promesse tenue</h3>'],
    ['<h3>3. Travailler Ton Cerveau de Fondateur</h3>', '<h3>3. Travailler ton état d\'esprit de fondateur</h3>'],
    ['<h4><i class="fa-solid fa-gem"></i> Les 3 Piliers de la Perception</h4>', '<h4><i class="fa-solid fa-gem"></i> Les trois piliers de la perception</h4>'],
    ['Les 3 Piliers de la Perception', 'Les trois piliers de la perception'],

    // Chapter 13 (Logo)
    ['Les 2 Seuls Formats Efficaces pour Démarrer', 'Les deux seuls formats efficaces pour démarrer'],
    ['Option 1 : Le Wordmark Typographique', 'Option 1, le wordmark typographique'],
    ['Option 2 : Le Monogramme (Initiales)', 'Option 2, le monogramme avec initiales'],
    ['Guide Rapide : La Psychologie des Couleurs', 'Guide pratique de la psychologie des couleurs'],

    // Chapter 14 (Offre)
    ['L\'Équation de la Valeur d\'Alex Hormozi ($100M Offers)', 'L\'équation de la valeur pour ton offre'],
    ['La Formule de la Valeur Perçue', 'La formule de la valeur perçue'],
    ['La Suite d\'Offres : Ne vends jamais un seul produit isolé', 'La suite d\'offres pour ne jamais dépendre d\'une seule vente'],

    // Chapter 15 (Bêta)
    ['Le protocole du Lancement Bêta Fondateur', 'Le protocole du lancement avec les clients bêta'],
    ['Le Deal avec tes 5 Clients Bêta', 'L\'accord clair avec tes cinq clients tests'],

    // Chapter 16 (Page de vente)
    ['Les 5 Blocs Chirurgicaux d\'une One-Page qui Convertit', 'Les cinq blocs essentiels d\'une page qui convertit'],

    // Chapter 17 (Finance)
    ['La Règle d\'Or des 3 Comptes Bancaires Séparés', 'La règle simple des trois comptes bancaires'],
    ['Le Matelas de Sécurité de 90 Jours', 'Le matelas de sécurité de trois mois'],

    // Chapter 19 (Réseaux)
    ['L\'Incarnation : Pourquoi les gens achètent à des visages', 'L\'incarnation pour créer une relation de confiance'],

    // Chapter 20 (Batching)
    ['La Méthode du Batching Chrono (3h par mois)', 'La méthode du batching en trois heures par mois'],
    ['Le Découpage Minute par Minute', 'Le découpage par étape'],
    ['Les 4 Piliers de Contenu Incontournables', 'Les quatre piliers de contenu'],
    ['Pilier 1 : Valeur & Autorité (25%)', 'Pilier 1, valeur et conseils utiles'],
    ['Pilier 2 : Coulisses & Réalité Terrain (25%)', 'Pilier 2, coulisses et réalité du terrain'],
    ['Pilier 3 : Preuve & Transformation (25%)', 'Pilier 3, preuves et retours d\'expérience'],
    ['Pilier 4 : Vente Directe & Offre (25%)', 'Pilier 4, présentation directe de l\'offre'],

    // Chapter 21 (Tunnel)
    ['L\'Échiquier des 6 Réseaux Sociaux : Choisis Ton Canal Maître', 'Les différents réseaux et le choix de ton canal principal'],
    ['Instagram : Le Roi de la Relation & du Closing en DM', 'Instagram pour la relation et la conversion en message privé'],
    ['TikTok : La Machine à Notoriété & Storytelling Brut', 'TikTok pour la visibilité et le storytelling spontané'],
    ['WhatsApp Business : L\'Arme Absolue de Conversion Outre-Mer', 'WhatsApp Business pour la relation client directe'],
    ['YouTube : L\'Autorité Pérenne & Moteur de Recherche', 'YouTube pour l\'autorité durable et la recherche'],
    ['LinkedIn : Le Pipeline B2B & Décideurs', 'LinkedIn pour les services professionnels et les décideurs'],
    ['Facebook : Les Groupes Locaux & Bouche-à-Oreille', 'Facebook pour les communautés locales et le bouche-à-oreille'],
    ['10 Accroches Virales (Hooks) Prêtes à l\'Emploi', 'Dix accroches prêtes à l\'emploi pour capter l\'attention'],

    // Chapter 22 (Closing)
    ['Blueprint Instagram : Le Tunnel Stories & Closing DM', 'Méthode Instagram pour converser et vendre en message privé'],
    ['Blueprint TikTok : La Machine à Notoriété & Storytelling', 'Méthode TikTok pour partager son parcours et orienter vers son offre'],
    ['Blueprint WhatsApp Business : L\'Arsenal Ultime de Vente', 'Méthode WhatsApp Business pour organiser son catalogue et ses échanges'],
    ['Blueprint LinkedIn : Le Pipeline B2B & Closing Dirigeants', 'Méthode LinkedIn pour approcher des professionnels avec pertinence'],
    ['Blueprint YouTube : L\'Autorité Pérenne & Moteur de Recherche', 'Méthode YouTube pour apporter de la valeur et rediriger vers ses liens'],

    // Chapter 23 (Pitch)
    ['La Formule Mathématique du Pitch', 'La formule en quatre parties pour ton pitch'],
    ['Pourquoi cette structure est invincible :', 'Pourquoi cette structure fonctionne'],

    // Chapter 24 (Rejet)
    ['L\'autopsie d\'un "Non" : les 4 raisons réelles', 'Comprendre les vraies raisons d\'un refus'],
    ['Le protocole du Rebond : La question magique', 'Le protocole pour rebondir après un refus'],

    // Chapter 25 (Fidélisation)
    ['Le Protocole de Suivi WhatsApp Post-Achat (J+3, J+15, J+30)', 'Le protocole de suivi attentif après chaque vente'],
    ['La Boucle de Parrainage Chaleureuse (Bouche-à-Oreille Organisé)', 'La boucle de recommandation naturelle par le bouche-à-oreille'],

    // Chapter 26 (Association)
    ['1. Des Compétences Strictement Opposées', '1. Des compétences complémentaires'],
    ['3. Le Pacte d\'Associés Écrit au Départ', '3. Le pacte d\'associés clarifié dès le départ'],

    // Chapter 27 (30 jours)
    ['Semaine 1 : Écoute Active & Découverte Terrain', 'Semaine 1, écoute et découverte du terrain'],
    ['Semaine 2 : Packaging de l\'Offre & Simulateur Financier', 'Semaine 2, finalisation de l\'offre et calcul de rentabilité'],
    ['Semaine 3 : Visibilité, Chasse & Premier Encaissement', 'Semaine 3, visibilité et premiers contacts commerciaux'],
    ['Semaine 4 : Sur-Délivrance & Effet Tremplin', 'Semaine 4, livraison soignée et premiers retours d\'expérience']
];

chaps.forEach(c => {
    headingReplacements.forEach(([target, rep]) => {
        if (c.content.includes(target)) {
            c.content = c.content.split(target).join(rep);
        }
    });
});

console.log('✓ Headings polished with sentence case and zero middle colons');

// Write updated data
const finalContent = '/**\n * Guide Digital : Les Fondamentaux de l\'Entrepreneur — Tome 1\n * Écosystème Domtom Connect\n * Version Interactive & Enrichie 2026\n * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)\n */\n\nwindow.GUIDE_DATA = ' + JSON.stringify(guideData, null, 4) + ';\n';

const targetPath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
fs.writeFileSync(targetPath, finalContent, 'utf8');
console.log('SUCCESS! Updated assets/data/guide-tome1.js');
