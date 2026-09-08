const fs = require('fs');
const path = require('path');

console.log('--- Assembling Final Definitive 27-Chapter Master Guide ---');

// Load parsed 871
const p871 = require('./parsed_871_chapters.js');
const find871 = (id) => {
  const f = p871.find(c => c.id === id);
  return f ? JSON.parse(JSON.stringify(f)) : null;
};

// Load extracted 1310 objects
const test1310 = require('./test_extract_1310.js');
// Load current guide-tome1 for early chapters
global.window = {};
require('../assets/data/guide-tome1.js');
const currentChapters = global.window.GUIDE_DATA.chapters;
const findCur = (id) => {
  const f = currentChapters.find(c => c.id === id);
  return f ? JSON.parse(JSON.stringify(f)) : null;
};

// 0. Couverture
const ch0 = findCur('couverture');
ch0.badge = "Édition Officielle";
ch0.number = 0;
ch0.content = ch0.content.replace(/19 Chapitres/g, '27 Chapitres').replace(/23 Chapitres/g, '27 Chapitres');

// 1. Avant-propos
const chAvant = findCur('avant-propos');
chAvant.badge = "Consultation Initiale";
chAvant.number = 1;

// 2. Ch 1
const ch1 = findCur('chapitre-1');
ch1.badge = "Chapitre 1";
ch1.number = 1;

// 3. Ch 2
const ch2 = findCur('chapitre-2');
ch2.badge = "Chapitre 2";
ch2.number = 2;

// 4. Ch 3
const ch3 = findCur('chapitre-3');
ch3.badge = "Chapitre 3";
ch3.number = 3;

// 5. Ch 4: Pareto 80/20 in Phase 1
const ch4 = findCur('chapitre-4');
ch4.badge = "Chapitre 4";
ch4.number = 4;
ch4.title = "La Loi de Pareto (80% Action, 20% Réflexion) : Faire un max avec tes moyens";
ch4.subtitle = "Comment 20% de tes actions créent 80% de ton cashflow et comment démarrer avec 0 euro en poche.";
ch4.exercise.id = "ex_chapitre_4";

// 6. Ch 5: Comprendre les 5 Chemins (+ 5 Histoires Réelles)
const code1310 = fs.readFileSync('scratch/saved_from_1310.js', 'utf8');
// ch4 in 1310 was "Comprendre les 5 Chemins"
// Let's get ch4 from 1310
const sb = { global: { window: { GUIDE_DATA: { chapters: [] } } }, require: require, fs: fs, console: { log: () => {} } };
const fn1310 = new Function('sandbox', `with(sandbox) {
  ${code1310.replace("require('./assets/data/guide-tome1.js');", "// noop")}
  return { ch4, ch5, ch7, ch8 };
}`);
const ext1310 = fn1310(sb);

const ch5 = JSON.parse(JSON.stringify(ext1310.ch4));
ch5.id = "chapitre-5";
ch5.number = 5;
ch5.badge = "Chapitre 5";
ch5.exercise.id = "ex_chapitre_5";

// 7. Ch 6: Choisir son Chemin & Valider sa Voie (L'Aiguillage)
const ch6 = JSON.parse(JSON.stringify(ext1310.ch5));
ch6.id = "chapitre-6";
ch6.number = 6;
ch6.badge = "Chapitre 6";
ch6.exercise.id = "ex_chapitre_6";

// 8. Ch 7: Du Modèle au Métier : Bilan de Compétences & Choix de Spécialité
const ch7 = findCur('chapitre-7');
ch7.id = "chapitre-7";
ch7.number = 7;
ch7.badge = "Chapitre 7";
ch7.exercise.id = "ex_chapitre_7";

// 9. Ch 8: Étude de Marché Terrain & Analyse des Failles de la Concurrence
const ch8 = findCur('chapitre-8');
ch8.id = "chapitre-8";
ch8.number = 8;
ch8.badge = "Chapitre 8";
ch8.exercise.id = "ex_chapitre_8";

// 10. Ch 9: Comprendre la Niche & la Transformation (La Psychologie du Positionnement)
const ch9 = JSON.parse(JSON.stringify(ext1310.ch7));
ch9.id = "chapitre-9";
ch9.number = 9;
ch9.badge = "Chapitre 9";
ch9.exercise.id = "ex_chapitre_9";

// 11. Ch 10: Verrouiller sa Niche Rentable & sa Différenciation (Action & Décision)
const ch10 = JSON.parse(JSON.stringify(ext1310.ch8));
ch10.id = "chapitre-10";
ch10.number = 10;
ch10.badge = "Chapitre 10";
ch10.exercise.id = "ex_chapitre_10";

// 12. Ch 11: Ton client, en profondeur (L'Avatar)
const avatarFile = fs.readFileSync('scratch/exact_avatar.txt', 'utf8');
const avIdx = avatarFile.indexOf('id: "chapitre-5",');
const avEnd = avatarFile.indexOf('};', avIdx);
const avSnippet = avatarFile.substring(avIdx, avEnd + 2);
const fnAv = new Function(`return { ${avSnippet} };`);
const rawAvatar = fnAv();
const ch11 = {
  id: "chapitre-11",
  number: 11,
  badge: "Chapitre 11",
  title: rawAvatar.title,
  subtitle: rawAvatar.subtitle,
  readTime: rawAvatar.readTime || "8 min",
  content: rawAvatar.content,
  exercise: {
    id: "ex_chapitre_11",
    title: rawAvatar.exercise.title,
    description: rawAvatar.exercise.description,
    fields: rawAvatar.exercise.fields
  }
};

// 13. Ch 12: Les Vrais Fondamentaux du Branding (Mentalité & Réputation)
const rawCh12 = find871('chapitre-9');
const ch12 = {
  ...rawCh12,
  id: "chapitre-12",
  number: 12,
  badge: "Chapitre 12",
  exercise: { ...rawCh12.exercise, id: "ex_chapitre_12" }
};

// 14. Ch 13: Ton Premier Logo : Zéro Prise de Tête & Psychologie des Couleurs
const rawCh13 = find871('chapitre-10');
const ch13 = {
  ...rawCh13,
  id: "chapitre-13",
  number: 13,
  badge: "Chapitre 13",
  exercise: { ...rawCh13.exercise, id: "ex_chapitre_13" }
};

// 15. Ch 14: Architecture de l'Offre Irrésistible & Stratégie de Pricing
// Use current Ch 14 which has the rich adaptive offers per sector!
const rawCh14 = findCur('chapitre-14');
const ch14 = {
  ...rawCh14,
  id: "chapitre-14",
  number: 14,
  badge: "Chapitre 14",
  exercise: { ...rawCh14.exercise, id: "ex_chapitre_14" }
};

// 16. Ch 15: L'Offre Bêta & Collecter ses 5 Preuves Sociales
const ch15 = findCur('chapitre-15');
ch15.id = "chapitre-15";
ch15.number = 15;
ch15.badge = "Chapitre 15";
ch15.exercise.id = "ex_chapitre_15";

// 17. Ch 16: La Page de Vente One-Page & Link-in-Bio
const ch16 = findCur('chapitre-16');
ch16.id = "chapitre-16";
ch16.number = 16;
ch16.badge = "Chapitre 16";
ch16.exercise.id = "ex_chapitre_16";

// 18. Ch 17: Encaisser sans Friction & Maîtriser ses Chiffres Simples
const rawCh17 = find871('chapitre-12');
const ch17 = {
  ...rawCh17,
  id: "chapitre-17",
  number: 17,
  badge: "Chapitre 17",
  title: "Encaisser sans Friction & Maîtriser ses Chiffres Simples",
  subtitle: "Le stack d'encaissement moderne, la règle des 3 comptes et le simulateur de rentabilité en direct.",
  exercise: {
    ...rawCh17.exercise,
    id: "ex_chapitre_17",
    isCalculator: true
  }
};
// Add the frictionless payment stack to content
ch17.content = `
    <p class="lead-text">
        Il existe une règle impitoyable dans le business : <strong>tant que l'argent n'est pas sur ton compte, tu n'as pas fait de vente, tu as simplement eu une conversation amicale</strong>.
    </p>
    <p>
        Le plus grand frein à la vente chez les indépendants n'est pas le prix : c'est <em>la friction au moment de payer</em>. Un client chaud qui attend un RIB pendant 48 heures est un client qui a le temps de changer d'avis.
    </p>

    <h3>Le Stack d'Encaissement sans Friction (2026)</h3>
    <p>
        Voici les solutions modernes indispensables pour que ton client puisse te payer en 30 secondes chrono, où qu'il soit :
    </p>
    <div class="feature-grid-3">
        <div class="feature-card">
            <div class="feature-card-icon"><i class="fa-brands fa-stripe"></i></div>
            <h4>Stripe & Liens de Paiement</h4>
            <p>Génère un lien de paiement en 2 clics et envoie-le par WhatsApp ou SMS. Le client paie par Carte Bancaire ou Apple Pay en 10 secondes. Reçu automatique.</p>
        </div>
        <div class="feature-card">
            <div class="feature-card-icon"><i class="fa-solid fa-credit-card"></i></div>
            <h4>TPE Mobile SumUp / Zettle</h4>
            <p>Le boîtier autonome à 29€ connecté en Bluetooth. Indispensable sur les marchés, salons, livraisons physiques ou chantiers. Sans abonnement mensuel.</p>
        </div>
        <div class="feature-card">
            <div class="feature-card-icon"><i class="fa-solid fa-money-bill-transfer"></i></div>
            <h4>Alma / Paiement en 3x ou 4x</h4>
            <p>Pour toute offre supérieure à 150€. Le client paie en 3 mensualités, toi tu touches 100% de la somme immédiatement. Augmente le taux de conversion de 30%.</p>
        </div>
    </div>
` + ch17.content;

// 19. Ch 18: La Boîte à Outils Minimaliste
const rawCh18 = find871('chapitre-14');
const ch18 = {
  ...rawCh18,
  id: "chapitre-18",
  number: 18,
  badge: "Chapitre 18",
  exercise: { ...rawCh18.exercise, id: "ex_chapitre_18" }
};

// 20. Ch 19: Réseaux Sociaux (1/3) — Psychologie, Algorithme 2026 & Incarnation
const ch19 = findCur('chapitre-19');
ch19.id = "chapitre-19";
ch19.number = 19;
ch19.badge = "Chapitre 19";
ch19.exercise.id = "ex_chapitre_19";

// 21. Ch 20: Le Système de Contenu sans Burnout (Batching 1 mois en 3h)
const ch20 = findCur('chapitre-20');
ch20.id = "chapitre-20";
ch20.number = 20;
ch20.badge = "Chapitre 20";
ch20.exercise.id = "ex_chapitre_20";

// 22. Ch 21: Réseaux Sociaux (2/3) — Le Tunnel TOFU-MOFU-BOFU & Choisir son Canal Maître
const rawCh21 = find871('chapitre-16');
const ch21 = {
  ...rawCh21,
  id: "chapitre-21",
  number: 21,
  badge: "Chapitre 21",
  title: "Réseaux Sociaux (2/3) — Le Tunnel TOFU-MOFU-BOFU & Choisir son Canal Maître",
  exercise: { ...rawCh21.exercise, id: "ex_chapitre_21" }
};

// 23. Ch 22: Réseaux Sociaux (3/3) — Playbooks par Secteur & Scripts de Closing en DM
const rawCh22 = find871('chapitre-17');
const ch22 = {
  ...rawCh22,
  id: "chapitre-22",
  number: 22,
  badge: "Chapitre 22",
  title: "Réseaux Sociaux (3/3) — Playbooks par Secteur & Scripts de Closing en DM",
  exercise: { ...rawCh22.exercise, id: "ex_chapitre_22" }
};

// 24. Ch 23: Le Pitch en Une Phrase
const rawCh23 = find871('chapitre-18');
const ch23 = {
  ...rawCh23,
  id: "chapitre-23",
  number: 23,
  badge: "Chapitre 23",
  exercise: { ...rawCh23.exercise, id: "ex_chapitre_23" }
};

// 25. Ch 24: Quand ça coince : surmonter l'échec et le rejet
const rawCh24 = find871('chapitre-15');
const ch24 = {
  ...rawCh24,
  id: "chapitre-24",
  number: 24,
  badge: "Chapitre 24",
  exercise: { ...rawCh24.exercise, id: "ex_chapitre_24" }
};

// 26. Ch 25: Rétention, Réachat & Boucle de Parrainage
const ch25 = findCur('chapitre-25');
ch25.id = "chapitre-25";
ch25.number = 25;
ch25.badge = "Chapitre 25";
ch25.exercise.id = "ex_chapitre_25";

// 27. Ch 26: Seul ou accompagné : faut-il t'associer ?
const ch26 = {
  id: "chapitre-26",
  number: 26,
  badge: "Chapitre 26",
  title: "Seul ou accompagné : faut-il t'associer ?",
  subtitle: "La différence vitale entre combler une vraie faiblesse et fuir la peur de se lancer seul.",
  readTime: "6 min",
  content: `
      <p class="lead-text">
          La plupart des créateurs qui cherchent un associé au démarrage ne cherchent pas des compétences complémentaires : <strong>ils cherchent quelqu'un avec qui partager leur peur d'échouer</strong>.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-user-group"></i></div>
          <p>
              « Mieux vaut être seul et avancer lentement que mal accompagné et devoir négocier chaque décision commerciale jusqu'à l'épuisement. »
          </p>
      </div>

      <h3>Les 3 Règles d'Or de l'Association Réussie</h3>
      <div class="feature-grid-3">
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-puzzle-piece"></i></div>
              <h4>1. Des Compétences Strictement Opposées</h4>
              <p>Deux cuisiniers ou deux graphistes associés se marchent sur les pieds. L'association idéale réunit <strong>un créateur/technicien</strong> et <strong>un commercial/vendeur</strong>.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-handshake"></i></div>
              <h4>2. Le 50/50 par Politesse est Interdit</h4>
              <p>En cas de désaccord stratégique urgent, le 50/50 bloque l'entreprise. Il doit toujours y avoir un décisionnaire final clair (51/49 ou répartition par domaine de responsabilité).</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-file-contract"></i></div>
              <h4>3. Le Pacte d'Associés Écrit au Départ</h4>
              <p>On rédige le divorce le jour du mariage. Que se passe-t-il si l'un veut arrêter dans 1 an ? Comment sont rachetées ses parts ? Tout doit être noir sur blanc.</p>
          </div>
      </div>
  `,
  exercise: {
    id: "ex_chapitre_26",
    title: "Diagnostic Association & Rôles Clairs",
    description: "Clarifie ta position sur l'association pour éviter tout conflit destructeur de valeur :",
    fields: [
      {
        id: "assoc_besoin_reel",
        type: "select",
        label: "Quelle est ta situation actuelle concernant l'association ?",
        options: [
          "Je lance mon activité 100% en solo (recommandé pour démarrer vite)",
          "J'ai déjà un associé aux compétences complémentaires identifié",
          "Je cherche un associé commercial / profil vendeur",
          "Je cherche un associé technique / profil production"
        ]
      },
      {
        id: "assoc_repartition_pouvoir",
        type: "textarea",
        label: "Si tu t'associes, qui a le dernier mot sur les décisions commerciales et financières ?",
        placeholder: "Ex: Je prends 100% des décisions de prix et de vente, mon associé gère 100% de la production..."
      }
    ]
  }
};

// 28. Ch 27: Tes 30 premiers jours d'action (Semaine par Semaine)
const rawCh27 = find871('chapitre-19');
const ch27 = {
  ...rawCh27,
  id: "chapitre-27",
  number: 27,
  badge: "Chapitre 27",
  exercise: { ...rawCh27.exercise, id: "ex_chapitre_27" }
};

// 29. Conclusion
const rawConclusion = find871('conclusion');
const chConclusion = {
  ...rawConclusion,
  number: 28,
  badge: "Conclusion & Passage à l'Action",
  exercise: { ...rawConclusion.exercise, id: "ex_conclusion" }
};

// Assemble all 30 elements
const masterChapters = [
  ch0,
  chAvant,
  ch1,
  ch2,
  ch3,
  ch4,
  ch5,
  ch6,
  ch7,
  ch8,
  ch9,
  ch10,
  ch11,
  ch12,
  ch13,
  ch14,
  ch15,
  ch16,
  ch17,
  ch18,
  ch19,
  ch20,
  ch21,
  ch22,
  ch23,
  ch24,
  ch25,
  ch26,
  ch27,
  chConclusion
];

console.log('Total master chapters assembled:', masterChapters.length);
masterChapters.forEach((c, idx) => {
  console.log(`[${idx}] id="${c.id}" | num=${c.number} | badge="${c.badge}" | title="${c.title}"`);
});

const outputData = {
  meta: {
    title: "Les fondamentaux de l'entrepreneur — Tome 1",
    subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
    author: "Domtom Connect",
    edition: "2026 — Édition Interactive Enrichie",
    totalChapters: 27
  },
  chapters: masterChapters
};

const fullOutput = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie 2026
 * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)
 */

window.GUIDE_DATA = ` + JSON.stringify(outputData, null, 4) + ';\n';

const targetPath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
fs.writeFileSync(targetPath, fullOutput, 'utf8');
console.log('MASTER SUCCESS! Written assets/data/guide-tome1.js cleanly. Total bytes:', fullOutput.length);
