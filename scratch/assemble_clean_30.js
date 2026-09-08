const fs = require('fs');
const path = require('path');

console.log('--- Assembling Clean 30-Item Guide (27 Consultation Chapters) ---');

// 1. Parsed 871 chapters
const p871 = require('./parsed_871_chapters.js');
const find871 = (id) => {
  const f = p871.find(c => c.id === id);
  if (!f) throw new Error('Missing 871 chapter: ' + id);
  return JSON.parse(JSON.stringify(f));
};

// 2. Ch 4 & Ch 5 from saved_from_1310.js:
const code1310 = fs.readFileSync('scratch/saved_from_1310.js', 'utf8');

// Extract ch4 (Comprendre les 5 Chemins)
const ch4Start = code1310.indexOf('const ch4 = {');
const ch4End = code1310.indexOf('// 7. NEW Chapitre 5');
const ch4Snippet = code1310.substring(ch4Start, ch4End);
const fnCh4 = new Function(ch4Snippet + '; return ch4;');
const rawCh4_1310 = fnCh4();

// Extract ch5 (Choisir son Chemin & Valider sa Voie with pathway-decision-grid)
const ch5Start = code1310.indexOf('const ch5 = {');
const ch5End = code1310.indexOf('// 8. NEW Chapitre 6');
const ch5Snippet = code1310.substring(ch5Start, ch5End);
const fnCh5 = new Function(ch5Snippet + '; return ch5;');
const rawCh5_1310 = fnCh5();

// Extract ch7 (Comprendre la Niche & la Transformation)
const ch7Start = code1310.indexOf('const ch7 = {');
const ch7End = code1310.indexOf('// 10. NEW Chapitre 8');
const ch7Snippet = code1310.substring(ch7Start, ch7End);
const fnCh7 = new Function(ch7Snippet + '; return ch7;');
const rawCh7_1310 = fnCh7();

// Extract ch8 (Verrouiller sa Niche Rentable)
const ch8Start = code1310.indexOf('const ch8 = {');
const ch8End = code1310.indexOf('// 11. Chapitre 9');
const ch8Snippet = code1310.substring(ch8Start, ch8End);
const fnCh8 = new Function(ch8Snippet + '; return ch8;');
const rawCh8_1310 = fnCh8();

// Extract Avatar from exact_avatar.txt
const avatarFile = fs.readFileSync('scratch/exact_avatar.txt', 'utf8');
const avIdx = avatarFile.indexOf('id: "chapitre-5",');
let avSlice = avatarFile.substring(avIdx).trim();
if (avSlice.endsWith(',')) avSlice = avSlice.substring(0, avSlice.length - 1);
const fnAv = new Function("return ({\n" + avSlice + "\n);");
const rawAvatar = fnAv();

// 3. Early chapters from scratch/build_perfect_chronology.js
const rawChronology = fs.readFileSync('scratch/build_perfect_chronology.js', 'utf8');
const mktStart = rawChronology.indexOf('const chapterMarketContent = `');
const mktContent = rawChronology.substring(mktStart + 'const chapterMarketContent = `'.length, rawChronology.indexOf('`;', mktStart));

const mktExStart = rawChronology.indexOf('const chapterMarketExercise = {');
const mktExEnd = rawChronology.indexOf('};', mktExStart);
const fnMktEx = new Function(rawChronology.substring(mktExStart, mktExEnd + 2) + '; return chapterMarketExercise;');
const mktExercise = fnMktEx();

// 0. Couverture
const ch0 = {
  id: "couverture",
  number: 0,
  isCover: true,
  badge: "Édition Officielle",
  title: "Couverture — Tome 1",
  subtitle: "Les Fondamentaux de l'Entrepreneur",
  readTime: "1 min",
  content: `
    <div class="cover-hero-wrapper">
        <div class="cover-card-container">
            <div class="cover-3d-visual">
                <div class="book-3d-mockup" id="cover-3d-book" title="Cliquer pour commencer la consultation">
                    <img src="assets/images/couverture-guide-tome1.jpg" alt="Couverture Officielle — Les Fondamentaux de l'Entrepreneur Tome 1" class="book-3d-cover-img">
                    <div class="book-spine-effect"></div>
                </div>
            </div>
            <div class="cover-info-content">
                <span class="cover-badge-pill"><i class="fa-solid fa-gem"></i> Édition Officielle Interactive & Consultation 2026</span>
                <h1 class="cover-main-title">Les Fondamentaux de l'Entrepreneur — Tome 1</h1>
                <p class="cover-lead-subtitle">
                    Le guide sans filtre qui te montre que peu importe ton idée, peu importe tes moyens actuels, tu peux bâtir un business rentable sur le terrain ultramarin, africain et international.
                </p>
                <div class="cover-value-pills">
                    <span class="value-pill-item"><i class="fa-solid fa-book-open"></i> 27 Chapitres de consultation</span>
                    <span class="value-pill-item"><i class="fa-solid fa-pen-to-square"></i> Carnet de bord interactif</span>
                    <span class="value-pill-item"><i class="fa-solid fa-calculator"></i> Simulateur financier en direct</span>
                    <span class="value-pill-item"><i class="fa-solid fa-file-pdf"></i> Export PDF de ton plan</span>
                </div>
                <div class="cover-action-group">
                    <button id="btn-open-guide-now" class="btn-cover-start">
                        Ouvrir le Guide & Commencer <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <a href="guide-entrepreneur.html" class="btn-cover-bundle">
                        <i class="fa-solid fa-gift"></i> Découvrir la Boîte à Outils Complète
                    </a>
                </div>
            </div>
        </div>

        <div class="cover-features-grid">
            <div class="cover-feature-box">
                <div class="cover-feature-icon"><i class="fa-solid fa-bullseye"></i></div>
                <h4>80% Action, 20% Réflexion</h4>
                <p>Zéro jargon de salon, zéro théorie abstraite. Chaque chapitre se conclut par un livrable concret pour ton projet.</p>
            </div>
            <div class="cover-feature-box">
                <div class="cover-feature-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                <h4>Sauvegarde Automatique</h4>
                <p>Remplis ton carnet de bord directement dans le navigateur. Tes réponses et chiffres restent sauvegardés sur ton appareil.</p>
            </div>
            <div class="cover-feature-box">
                <div class="cover-feature-icon"><i class="fa-solid fa-network-wired"></i></div>
                <h4>Propulsé par Domtom Connect</h4>
                <p>Connecté directement au 1er écosystème d'entrepreneurs et talents des Caraïbes, de l'Afrique et de la diaspora.</p>
            </div>
        </div>
    </div>
  `
};

// 1. Avant-propos
const chAvant = {
  id: "avant-propos",
  number: 1,
  badge: "Consultation Initiale",
  title: "Avant de commencer — La Consultation",
  subtitle: "Pose ce que tu fais, prends un carnet, on parle franchement.",
  readTime: "4 min",
  content: `
      <p class="lead-text">
          Réponds-moi honnêtement, avant même de tourner cette page. Combien de fois cette année as-tu remis ton projet à plus tard ? Combien de fois as-tu pensé <em>"je le ferai quand j'aurai plus d'argent, plus de temps, plus de contacts"</em> ?
      </p>
      <p>
          Si tu te reconnais là-dedans, ce livre s'adresse à toi. Et je vais être direct avec toi tout du long, parce que c'est ce dont tu as besoin, pas d'un discours de plus qui te caresse dans le sens du poil pour te laisser au même endroit dans six mois.
      </p>
      <p>
          Ce livre n'est pas un cours théorique sur l'entrepreneuriat rédigé par des gens qui n'ont jamais vendu un centime de leur vie. <strong>C'est une consultation</strong>, exactement comme la première séance de cadrage que tu aurais avec un mentor ou un accompagnateur qui connaît ton terrain, tes doutes, et les vraies raisons pour lesquelles tu n'as pas encore avancé.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-bolt"></i></div>
          <p>
              « La plupart des gens qui ne réussissent jamais à lancer leur projet ne manquent pas d'idées : ils manquent de l'habitude d'investir du temps, de l'énergie et de l'argent sur eux-mêmes avant d'avoir une garantie de résultat. »
          </p>
      </div>
      <p>
          On va nommer les blocages, les casser un par un, et à chaque étape, tu vas repartir avec quelque chose de précis à faire, pas une vague idée de plus qui traîne dans un coin de ta tête. Tu as sous les yeux un outil interactif : chaque encadré à la fin des chapitres est ton carnet de bord. Tes réponses y sont sauvegardées automatiquement.
      </p>
      <p>
          Le simple fait que tu sois en train de lire ces lignes est déjà un acte que 90% des gens ne font jamais : celui de poser son attention pour construire son propre avenir économique. Retiens bien ce sentiment, on va en reparler à la fin de cette consultation.
      </p>
  `,
  exercise: {
      id: "ex_avant_propos",
      title: "Ton Engagement de Consultation",
      description: "Pour tirer profit de ce guide, formule dès maintenant la promesse que tu te fais à toi-même :",
      fields: [
          {
              id: "engagement_nom",
              type: "text",
              label: "Ton prénom & nom ou nom de projet :",
              placeholder: "Ex: Johan — Projet KréyolTech"
          },
          {
              id: "engagement_date_blocage",
              type: "textarea",
              label: "Quelle est l'excuse principale qui t'a empêché de démarrer jusqu'ici ?",
              placeholder: "Sois 100% honnête : manque d'argent, peur du regard des autres, pas le bon statut, peur de l'échec..."
          }
      ]
  }
};

// 2. Ch 1
const ch1 = {
  id: "chapitre-1",
  number: 1,
  badge: "Chapitre 1",
  title: "Ce que tu crois savoir sur l'entrepreneuriat est faux",
  subtitle: "Démystifier les levées de fonds et repartir du seul juge de paix : le terrain.",
  readTime: "6 min",
  content: `
      <p class="lead-text">
          On t'a menti sur ce qu'est un entrepreneur. Les médias et les réseaux sociaux ont créé une fiction toxique : celle du jeune de 24 ans en costume qui lève 2 millions d'euros auprès de fonds d'investissement à Paris ou San Francisco avant même d'avoir vendu son premier produit.
      </p>
      <p>
          Dans la vraie vie, sur nos territoires aux Antilles, en Guyane, à La Réunion, en Afrique ou au cœur des diasporas, <strong>l'entrepreneuriat n'a rien à voir avec des levées de fonds</strong>. L'entrepreneuriat réel, celui qui nourrit des familles et crée du patrimoine, repose sur une seule équation :
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-handshake"></i></div>
          <p>
              « Trouver une personne qui a un problème urgent ou un désir profond, lui apporter une solution concrète, et se faire payer immédiatement avec le sourire. Tout le reste est de la littérature. »
          </p>
      </div>
      <h3>La tragédie de la recherche de perfection</h3>
      <p>
          Combien de porteurs de projet passent six mois à peaufiner un logo sur Canva, rédiger un business plan de 40 pages que personne ne lira jamais, ou débattre du choix entre une SASU et une SARL avant même d'avoir encaissé 1 euro ?
      </p>
      <p>
          C'est de la lâcheté intellectuelle déguisée en rigueur. Tant que tu rédiges des statuts ou que tu choisis des polices d'écriture, tu es à l'abri du rejet. Tu n'es pas confronté au marché. Mais le jour où tu dois regarder un prospect dans les yeux et lui dire : <em>"Mon service coûte 500€, comment souhaitez-vous régler ?"</em>, c'est là que commence la vraie vie d'entrepreneur.
      </p>
  `,
  exercise: {
      id: "ex_chapitre_1",
      title: "Action Immédiate : Le Test des 5 Personnes",
      description: "Pour sortir de la théorie dès maintenant, confronte ton intuition à la réalité :",
      fields: [
          {
              id: "ch1_probleme_identifie",
              type: "textarea",
              label: "Quel est le problème douloureux et précis que tu veux résoudre ?",
              placeholder: "Ex: Les commerçants locaux perdent 2h par jour à répondre aux mêmes questions sur WhatsApp."
          },
          {
              id: "ch1_cible_5_personnes",
              type: "textarea",
              label: "Liste 5 personnes de ton réseau (amis, commerçants, collègues) à qui tu vas poser une question sous 24h :",
              placeholder: "1. Marc (restaurant)\n2. Sarah (esthéticienne)\n3. Thomas (artisan)..."
          }
      ]
  }
};

// 3. Ch 2
const ch2 = {
  id: "chapitre-2",
  number: 2,
  badge: "Chapitre 2",
  title: "Le mur que tu t'es construit toi-même",
  subtitle: "Dépasser les plafonds de verre historiques, le doute familial et l'autocensure.",
  readTime: "7 min",
  content: `
      <p class="lead-text">
          Parlons de ce que personne n'ose écrire dans les manuels de management : le poids du regard des tiens, le syndrome de l'imposteur enraciné dans l'histoire coloniale ou sociale, et cette phrase assassine que tu as entendue mille fois : <em>"Ici, c'est pas possible, il n'y a pas d'argent."</em>
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <p>
              « Nos territoires ne manquent pas d'argent : ils manquent de circuits locaux de confiance où l'argent circule entre nos mains au lieu de repartir immédiatement vers l'extérieur. »
          </p>
      </div>
      <h3>La peur de réussir et la pression de l'entourage</h3>
      <p>
          Souvent, tes plus grands détracteurs ne sont pas tes ennemis : ce sont tes parents, tes frères et sœurs, ou ton groupe d'amis d'enfance. Ils ne te veulent pas de mal, mais ils projettent sur toi leurs propres peurs non résolues. Pour eux, le Graal reste le CDI dans la fonction publique ou dans une grande enseigne importatrice.
      </p>
      <p>
          Quand tu leur dis que tu te lances, tu bouscules leur vision du monde. Ne perds pas ton énergie à essayer de les convaincre avec des paroles. <strong>La seule réponse qui fait taire le doute familial, ce sont les résultats concrets et la ponctualité de tes encaissements</strong>.
      </p>
  `,
  exercise: {
      id: "ex_chapitre_2",
      title: "Briser le Plafond de Verre",
      description: "Identifie les chaînes invisibles qui te retiennent pour t'en libérer définitivement :",
      fields: [
          {
              id: "ch2_peur_principale",
              type: "textarea",
              label: "Quelle est la phrase toxique sur l'argent ou le travail que tu as le plus entendue dans ton enfance ?",
              placeholder: "Ex: 'Les affaires c'est pour les voleurs', 'Ici rien ne marche', 'Reste discret'..."
          },
          {
              id: "ch2_contre_croyance",
              type: "textarea",
              label: "Quelle nouvelle règle de vie choisis-tu d'adopter dès aujourd'hui pour la remplacer ?",
              placeholder: "Ex: 'Créer de la valeur enrichit ma communauté et me donne ma dignité financière.'"
          }
      ]
  }
};

// 4. Ch 3
const ch3 = {
  id: "chapitre-3",
  number: 3,
  badge: "Chapitre 3",
  title: "Ton Why, ta légitimité",
  subtitle: "Pourquoi les gens n'achètent pas ce que tu fais, mais pourquoi tu le fais.",
  readTime: "6 min",
  content: `
      <p class="lead-text">
          Simon Sinek l'a magistralement théorisé, mais sur le terrain, c'est une question de survie pure : si ton seul moteur est <em>"je veux gagner de l'argent pour m'acheter une voiture"</em>, tu abandonneras à la première facture impayée ou au premier client difficile.
      </p>
      <p>
          Entreprendre est un marathon semé d'embûches. Ce qui te fera te lever à 5 heures du matin un jour de pluie battante, ce n'est pas un tableur Excel, c'est ton **Why profond** : la raison viscérale pour laquelle cette mission te tient à cœur.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-heart-pulse"></i></div>
          <p>
              « La légitimité ne se demande pas, elle ne se décrète pas par un diplôme : elle se prend en apportant une solution avec une sincérité désarmante. »
          </p>
      </div>
  `,
  exercise: {
      id: "ex_chapitre_3",
      title: "Générateur Guidé de Ton 'Why'",
      description: "Clarifie ton moteur inépuisable pour traverser les tempêtes sans flancher :",
      fields: [
          {
              id: "ch3_why_profond",
              type: "textarea",
              label: "Pour quelle cause ou pour qui te bats-tu en construisant cette entreprise ?",
              placeholder: "Ex: Pour offrir un avenir libre à mes enfants, pour valoriser notre savoir-faire local, pour ne plus jamais subir l'humiliation d'un patron..."
          }
      ]
  }
};

// 5. Ch 4: Pareto 80/20 in Phase 1
const ch4 = {
  id: "chapitre-4",
  number: 4,
  badge: "Chapitre 4",
  title: "La Loi de Pareto (80% Action, 20% Réflexion) : Faire un max avec tes moyens",
  subtitle: "Comment 20% de tes actions créent 80% de ton cashflow et comment démarrer avec 0 euro en poche.",
  readTime: "7 min",
  content: `
      <p class="lead-text">
          Voici la règle du jeu suprême de toute cette consultation, inscrite en grand sur la couverture de ce guide : <strong>80% d'Action, 20% de Réflexion</strong>. Si tu ne retiens qu'un seul principe de tout ce livre, que ce soit celui-ci.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-scale-balanced"></i></div>
          <p>
              « 80% de tes résultats économiques découleront de seulement 20% de tes efforts. Le drame de 90% des débutants est de passer 80% de leur temps sur des futilités qui rapportent zéro euro. »
          </p>
      </div>
      <h3>La créativité naît de la contrainte : démarrer avec 0 euro</h3>
      <p>
          La plupart des gens pensent qu'il faut 10 000€, un prêt bancaire et un local pour commencer. C'est le piège numéro un. Si tu as peu de moyens financiers aujourd'hui, réjouis-toi : cela va te forcer à être dix fois plus affûté, plus agile et plus proche de tes clients que celui qui démarre avec un compte plein et gaspille son capital en futilités (logos hors de prix, mobilier design, stocks invendables).
      </p>
      <p>
          Quand tu n'as pas d'argent, tu as ce que l'argent ne peut pas acheter : <strong>l'obligation d'aller parler à des êtres humains et de vendre avant de dépenser</strong>. C'est ce qu'on appelle la <em>stratégie de la traction inversée</em>.
      </p>

      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">La Règle d'Airain</span>
              <h4>Les 20% d'actions vitales vs les 80% de distraction</h4>
          </div>
          <div class="method-body">
              <div class="method-steps">
                  <div class="method-step-item">
                      <div class="method-step-num" style="background:#ef4444; color:#fff;">❌</div>
                      <div class="method-step-content">
                          <strong>Les 80% qui te font perdre ton temps (Procrastination déguisée) :</strong>
                          <p>Passer 3 semaines à choisir un nom d'entreprise, débattre sur la nuance de bleu de ton logo, imprimer des cartes de visite, lire 4 livres de gestion, créer un compte Twitter vide.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num" style="background:#10b981; color:#fff;">✅</div>
                      <div class="method-step-content">
                          <strong>Les 20% vitaux qui créent 80% du chiffre d'affaires :</strong>
                          <p>Envoyer 10 messages WhatsApp personnalisés à des prospects qualifiés, décrocher ton téléphone, poser des questions sur leurs douleurs, formuler une offre claire en 3 phrases, et demander un premier acompte.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <h3>L'histoire de Rodrigue : 2 400 €/mois en 6 semaines avec 0 € de capital</h3>
      <p>
          À Fort-de-France, Rodrigue voulait créer une entreprise de nettoyage et rénovation de véhicules haut de gamme. Il n'avait ni local, ni pont élévateur, ni machine à vapeur professionnelle.
      </p>
      <p>
          Au lieu d'attendre un prêt bancaire refusé deux fois, il a appliqué la règle des 20% : il a pris son aspirateur ménager, deux microfibres professionnelles achetées 15€, et a fait le tour des cabinets médicaux et d'avocats de sa zone. Sa proposition : <em>« Docteur, pendant que vous êtes en consultation, je nettoie et désinfecte intégralement l'intérieur de votre véhicule sur votre parking privé pour 45€. Si le résultat n'est pas impeccable, vous ne me devez rien. »</em>
      </p>
      <p>
          Résultat : 4 clients dès le premier après-midi, 3 recommandations immédiates entre confrères. En 6 semaines, il tournait à 2 400€ nets par mois, tout payé d'avance en espèces et virement. C'est cela, la Loi de Pareto sur le terrain.
      </p>
  `,
  exercise: {
      id: "ex_chapitre_4",
      title: "Ton Filtre Pareto & Ta Première Action à 0 €",
      description: "Applique immédiatement le ratio 80/20 à ta situation actuelle pour débloquer du cashflow :",
      fields: [
          {
              id: "pareto_80_distractions",
              type: "textarea",
              label: "Quelles sont les 2 ou 3 tâches secondaires sur lesquelles tu perdais ton temps et que tu abandonnes dès aujourd'hui ?",
              placeholder: "Ex: Chercher le nom parfait, passer des heures sur Canva sans offre, attendre un prêt bancaire..."
          },
          {
              id: "pareto_20_action_vitale",
              type: "textarea",
              label: "Quelle est l'UNIQUE action commerciale (tes 20% vitaux) qui peut te générer un premier échange client sous 48h ?",
              placeholder: "Ex: Envoyer un message direct à 5 commerçants de mon quartier pour leur proposer un audit gratuit de leur compte Instagram."
          },
          {
              id: "pareto_action_zero_euro",
              type: "text",
              label: "Le prénom ou nom de la première personne réelle que tu vas contacter aujourd'hui sans dépenser 1 centime :",
              placeholder: "Ex: Sarah (propriétaire du salon de coiffure X) ou Marc (gérant d'entreprise locale)"
          }
      ]
  }
};

// 6. Ch 5: Comprendre les 5 Chemins (+ 5 Histoires Réelles)
const ch5 = {
  ...rawCh4_1310,
  id: "chapitre-5",
  number: 5,
  badge: "Chapitre 5",
  exercise: { ...rawCh4_1310.exercise, id: "ex_chapitre_5" }
};

// 7. Ch 6: Choisir son Chemin & Valider sa Voie (L'Aiguillage)
const ch6 = {
  ...rawCh5_1310,
  id: "chapitre-6",
  number: 6,
  badge: "Chapitre 6",
  exercise: { ...rawCh5_1310.exercise, id: "ex_chapitre_6" }
};

// 8. Ch 7: Du Modèle au Métier : Bilan de Compétences & Choix de Spécialité
const ch7 = {
  id: "chapitre-7",
  number: 7,
  badge: "Chapitre 7",
  title: "Du Modèle au Métier : Bilan de Compétences & Choix de Spécialité",
  subtitle: "Tu as choisi ta Voie économique. Maintenant, qu'est-ce que tu sais faire concrètement ? Verrouille ton métier exact.",
  readTime: "8 min",
  content: `
      <p class="lead-text">
          Attention : voici l'erreur qui fait couler 80% des entrepreneurs débutants. Ils disent fièrement : <em>« J'ai choisi la Voie 2, je fais du service B2B ! »</em> ou <em>« J'ai choisi la Voie 1, je vends des produits physiques ! »</em>. Mais quand un client leur demande : <em>« Concrètement, quel est ton métier et que fais-tu pour moi demain matin ? »</em>, ils bégayent.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-user-gear"></i></div>
          <p>
              « Un client n'achète jamais un "modèle économique". Il achète un métier, exercé avec précision par quelqu'un qui maîtrise son art et règle un problème précis. »
          </p>
      </div>
      <p>
          Une Voie n'est qu'un véhicule. Maintenant, nous devons définir <strong>le moteur et le conducteur</strong> : tes compétences réelles d'aujourd'hui, ton savoir-faire pratique, et le métier exact que tu vas exercer sur le terrain.
      </p>

      <h3>Le test des 3 filtres de compétences</h3>
      <p>
          Pour trouver ton métier rentable sans t'inventer une fausse vie, passe tes compétences à travers ces trois filtres stricts :
      </p>
      <div class="feature-grid-2">
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-bolt"></i></div>
              <h4>1. Ce que tu fais déjà avec aisance</h4>
              <p>Ce qui te paraît naturel mais qui semble insurmontable ou rébarbatif pour les autres (organiser un événement, négocier des prix, monter une vidéo, cuisiner un plat traditionnel, rédiger sans fautes, configurer des outils numériques).</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div>
              <h4>2. Ce qu'on te demande déjà gratuitement</h4>
              <p>Pense aux 12 derniers mois. Pour quelles raisons des amis, des collègues ou des membres de ta famille sont-ils venus te demander de l'aide ? C'est le signal le plus fiable de ta valeur perçue.</p>
          </div>
      </div>

      <h3>Cartographie des Métiers Concrets par Voie</h3>
      <p>
          Voici des exemples réels de métiers ultra-demandés dans nos territoires et la diaspora, qui ne nécessitent aucun diplôme ronflant mais une exécution rigoureuse :
      </p>

      <div class="sector-adaptive-container" style="margin-top: 24px;">
          <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
              <div class="indicator-left">
                  <span class="indicator-tag">MÉTIERS CONCRETS PAR VOIE</span>
                  <span class="indicator-sector-name active-sector-label-text">💼 Voie 2 : Prestations de Services & Agence B2B</span>
              </div>
              <button type="button" class="btn-change-sector">
                  <i class="fa-solid fa-arrows-rotate"></i> Changer de voie
              </button>
          </div>

          <div class="sector-adaptive-card" data-sector="physique">
              <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
              <h4><i class="fa-solid fa-bottle-droplet" style="color:#10b981;"></i> Artisanat, Beauté & Terroirs</h4>
              <ul style="line-height:1.7; padding-left:20px; font-size:0.95rem;">
                  <li><strong>Savonnier / Formulateur cosmétique naturel :</strong> Savons au soufre, huiles de carapate/ricin pressées à froid, beurres corporels pour peaux mélanodermes.</li>
                  <li><strong>Cirier / Artisan senteurs :</strong> Bougies parfumées aux notes tropicales (maracudja, vanille Bourbon, ylang-ylang) pour hôtellerie et particuliers.</li>
                  <li><strong>Créateur de mode & maroquinerie :</strong> Vêtements sur-mesure aux motifs identitaires, accessoires en madras revisité ou matières recyclées.</li>
              </ul>
          </div>

          <div class="sector-adaptive-card" data-sector="service">
              <span class="sector-adaptive-tag">Voie 2 : Services B2B & Freelance</span>
              <h4><i class="fa-solid fa-briefcase" style="color:#10b981;"></i> Prestations de Services & B2B</h4>
              <ul style="line-height:1.7; padding-left:20px; font-size:0.95rem;">
                  <li><strong>Monteur Vidéo Reels / TikTok pour commerçants :</strong> Tu viens filmer 1h dans leur boutique et tu leur livres 8 vidéos montées avec sous-titres dynamiques.</li>
                  <li><strong>Gestionnaire WhatsApp Business & Service Client :</strong> Tu configures et réponds aux messages clients des TPE débordées le soir et le week-end.</li>
                  <li><strong>Assistant(e) administratif(ve) et facturation freelance :</strong> Tu relances les impayés et classes les factures des artisans qui détestent la paperasse.</li>
                  <li><strong>Nettoyage professionnel spécialisé :</strong> Nettoyage de canapés/tapis à domicile, désinfection de véhicules pros ou fin de chantier.</li>
              </ul>
          </div>

          <div class="sector-adaptive-card" data-sector="digital">
              <span class="sector-adaptive-tag">Voie 3 : Digital & E-learning</span>
              <h4><i class="fa-solid fa-laptop-code" style="color:#10b981;"></i> Produits Digitaux & E-books</h4>
              <ul style="line-height:1.7; padding-left:20px; font-size:0.95rem;">
                  <li><strong>Auteur d'E-books pratiques ciblés :</strong> Guide de recettes sans gluten aux tubercules locaux, guide d'installation administrative aux Antilles/Réunion.</li>
                  <li><strong>Créateur de Templates Notion & Tableurs :</strong> Outils prêts à l'emploi pour gérer les stocks d'un restaurant ou le budget des familles.</li>
                  <li><strong>Formateur express sur logiciel :</strong> Mini-formation en ligne de 2h pour apprendre Canva ou WhatsApp Business aux indépendants.</li>
              </ul>
          </div>

          <div class="sector-adaptive-card" data-sector="food">
              <span class="sector-adaptive-tag">Voie 4 : Food & Restauration</span>
              <h4><i class="fa-solid fa-utensils" style="color:#10b981;"></i> Food & Restauration Rapide</h4>
              <ul style="line-height:1.7; padding-left:20px; font-size:0.95rem;">
                  <li><strong>Traiteur boîtes repas du midi pour zones d'activités :</strong> Plats équilibrés et saveurs locales livrés directement aux salariés de bureau à 12h.</li>
                  <li><strong>Spécialiste Street-Food événementiel :</strong> Stand mobile de bokits, pastels ou accras minute pour foires, mariages et soirées privées.</li>
                  <li><strong>Pâtisserie personnalisée sur commande :</strong> Gâteaux d'anniversaire créatifs (Cake design) avec livraison sécurisée le samedi.</li>
              </ul>
          </div>

          <div class="sector-adaptive-card" data-sector="commerce">
              <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
              <h4><i class="fa-solid fa-bag-shopping" style="color:#10b981;"></i> Commerce & Achat-Revente</h4>
              <ul style="line-height:1.7; padding-left:20px; font-size:0.95rem;">
                  <li><strong>Dénicheur de pièces rares / Sourcing local :</strong> Importer des produits de beauté ou accessoires de sport introuvables sur le territoire et livrés sous 24h.</li>
                  <li><strong>Reconditionneur High-Tech / Téléphonie :</strong> Rachat, nettoyage, changement d'écran et revente d'iPhone d'occasion avec garantie 6 mois.</li>
                  <li><strong>Boutique éphémère / Pop-up store de prêt-à-porter :</strong> Vente flash de collections sélectionnées le temps d'un week-end festif.</li>
              </ul>
          </div>
      </div>
  `,
  exercise: {
      id: "ex_chapitre_7",
      title: "Bilan de Compétences & Verrouillage de Ton Métier Réel",
      description: "Aligne tes compétences personnelles avec ton métier concret pour attaquer le marché avec légitimité :",
      fields: [
          {
              id: "competences_naturelles",
              type: "textarea",
              label: "Quelles sont les 2 compétences pratiques que tu maîtrises déjà le mieux aujourd'hui ?",
              placeholder: "Ex: Organiser et planifier, retoucher des photos et vidéos, cuisiner des marinades, négocier et convaincre au téléphone..."
          },
          {
              id: "metier_exact_retenu",
              type: "text",
              label: "Quel est l'intitulé EXACT de ton métier ou activité retenue ?",
              placeholder: "Ex: Monteur vidéo Reels pour commerçants locaux, Fabricant de bougies tropicales, Traiteur déjeuners express..."
          },
          {
              id: "preuve_legitimite_metier",
              type: "textarea",
              label: "Pourquoi es-tu capable de délivrer ce résultat de manière fiable dès ce mois-ci ?",
              placeholder: "Ex: J'ai déjà monté des vidéos pour mon compte perso qui ont fait 10k vues, ou je cuisine cette recette depuis 5 ans avec des retours unanimes..."
          }
      ]
  }
};

// 9. Ch 8: Étude de Marché Terrain & Analyse des Failles de la Concurrence
const ch8 = {
  id: "chapitre-8",
  number: 8,
  badge: "Chapitre 8",
  title: "Étude de Marché, Analyse de la Concurrence & Opportunités Uniques",
  subtitle: "Observer la concurrence, identifier ses 4 failles majeures et verrouiller l'espace vide où tu vas t'installer.",
  readTime: "8 min",
  content: mktContent,
  exercise: {
    ...mktExercise,
    id: "ex_chapitre_8"
  }
};

// 10. Ch 9: Comprendre la Niche & la Transformation
const ch9 = {
  ...rawCh7_1310,
  id: "chapitre-9",
  number: 9,
  badge: "Chapitre 9",
  exercise: { ...rawCh7_1310.exercise, id: "ex_chapitre_9" }
};

// 11. Ch 10: Verrouiller sa Niche Rentable & sa Différenciation
const ch10 = {
  ...rawCh8_1310,
  id: "chapitre-10",
  number: 10,
  badge: "Chapitre 10",
  exercise: { ...rawCh8_1310.exercise, id: "ex_chapitre_10" }
};

// 12. Ch 11: Ton client, en profondeur (L'Avatar)
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

// 13. Ch 12: Les Vrais Fondamentaux du Branding
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

// 15. Ch 14: Architecture de l'Offre Irrésistible
const rawCh14 = find871('chapitre-11');
const ch14 = {
  ...rawCh14,
  id: "chapitre-14",
  number: 14,
  badge: "Chapitre 14",
  exercise: { ...rawCh14.exercise, id: "ex_chapitre_14" }
};

// 16. Ch 15: L'Offre Bêta & Collecter ses 5 Preuves Sociales
const ch15 = {
  id: "chapitre-15",
  number: 15,
  badge: "Chapitre 15",
  title: "L'Offre Bêta & Collecter ses 5 Preuves Sociales",
  subtitle: "Ne lance jamais dans le vide : recrute 3 à 5 clients testeurs pour blinder ta crédibilité avant le grand public.",
  readTime: "7 min",
  content: `
      <p class="lead-text">
          Règle d'or de tout stratège commercial : <strong>on ne lance jamais une offre à plein tarif devant des inconnus sans avoir validé la machine avec des testeurs pionniers</strong>.
      </p>
      <p>
          Sur nos territoires ultramarins et dans les communautés soudées, la méfiance initiale est naturelle. Tout le monde se connaît, les promesses non tenues se paient cher, et l'acheteur moyen attend de voir si son voisin a testé et validé avant d'ouvrir son portefeuille.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-users-viewfinder"></i></div>
          <p>
              « Ce n'est pas ce que TOI tu dis de ton produit qui fait vendre. C'est ce que tes 5 premiers clients disent de toi avec des étoiles dans les yeux. »
          </p>
      </div>

      <h3>Le protocole du Lancement Bêta Fondateur</h3>
      <p>
          Ton objectif n'est pas de faire fortune la première semaine, mais de <strong>récolter 5 preuves sociales irréfutables</strong> (témoignages audio WhatsApp, captures d'écran de compliments, ou vidéos face caméra).
      </p>
      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">Protocole Fondateur</span>
              <h4>Le Deal avec tes 5 Clients Bêta</h4>
          </div>
          <div class="method-body">
              <p>Tu approches 5 personnes correspondant exactement à ton avatar et tu leur dis sans détour :</p>
              <blockquote style="background:rgba(245,158,11,0.08); border-left:4px solid #f59e0b; padding:12px 16px; margin:12px 0; border-radius:0 8px 8px 0; font-style:italic;">
                  « Je finalise le lancement officiel de mon service/produit [Nom]. Avant de l'ouvrir au public à [Tarif normal, ex: 150€], je sélectionne 5 clients testeurs à un tarif privilégié de [50% ou 0€ selon tes moyens]. En échange, tu t'engages à me faire un retour franc et, si tu es ravi du résultat, à m'enregistrer un court témoignage de 45 secondes racontant ton expérience. Est-ce que tu veux faire partie des 5 ? »
              </blockquote>
          </div>
      </div>

      <h3>Les 4 questions magiques pour un témoignage qui vend</h3>
      <p>
          Quand un client dit simplement <em>"C'est super, merci"</em>, ça ne convertit personne. Pour qu'un avis déclenche des ventes automatiques, pose-lui ces 4 questions par note vocale :
      </p>
      <div class="feature-grid-2">
          <div class="feature-card">
              <div class="feature-card-icon">1</div>
              <h4>Quelle était ta situation avant ?</h4>
              <p>Permet aux futurs prospects de s'identifier à la même douleur initiale.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon">2</div>
              <h4>Quelle était ta crainte principale avant d'essayer ?</h4>
              <p>Désarme les objections des acheteurs frileux (prix, délai, qualité).</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon">3</div>
              <h4>Quel résultat concret as-tu obtenu ?</h4>
              <p>Des faits mesurables : du temps gagné, des compliments reçus, un problème réglé.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon">4</div>
              <h4>Que dirais-tu à quelqu'un qui hésite ?</h4>
              <p>La recommandation chaleureuse qui pousse à l'action immédiate.</p>
          </div>
      </div>
  `,
  exercise: {
      id: "ex_chapitre_15",
      title: "Recrutement de tes 5 Bêta-Testeurs & Protocole d'Avis",
      description: "Sélectionne dès maintenant tes 5 premiers testeurs pour sécuriser tes preuves sociales :",
      fields: [
          {
              id: "beta_noms_testeurs",
              type: "textarea",
              label: "Les noms ou profils des 3 à 5 personnes ou entreprises que tu vas contacter pour l'offre Bêta :",
              placeholder: "1. Marc (restaurant local)\n2. Julie (amie active qui manque de temps)\n3. Cabinet X..."
          },
          {
              id: "beta_condition_echange",
              type: "text",
              label: "Quelle condition avantageuse leur proposes-tu en échange de leur avis complet ?",
              placeholder: "Ex: -50% sur la prestation, ou première boîte offerte, ou bonus exclusif..."
          },
          {
              id: "beta_date_collecte_avis",
              type: "text",
              label: "À quelle date précise auras-tu collecté ces 5 avis sur ton téléphone ?",
              placeholder: "Ex: Dans 10 jours maximum (le 18 du mois)"
          }
      ]
  }
};

// 17. Ch 16: La Page de Vente One-Page & Link-in-Bio
const ch16 = {
  id: "chapitre-16",
  number: 16,
  badge: "Chapitre 16",
  title: "La Page de Vente One-Page & Link-in-Bio",
  subtitle: "Où atterrit le client ? La structure chirurgicale en 5 blocs qui transforme un curieux en acheteur.",
  readTime: "7 min",
  content: `
      <p class="lead-text">
          Arrête de croire qu'il te faut un site internet de 10 pages à 2 500€ avec un blog, une page "À propos" et une galerie photo pour vendre. C'est l'illusion favorite des agences web pour vider la trésorerie des créateurs d'entreprise.
      </p>
      <p>
          En 2026, <strong>plus de 85% de ton trafic arrive depuis un smartphone</strong> via Instagram, TikTok, WhatsApp ou un lien partagé. Le prospect a une durée d'attention de 8 secondes. S'il doit chercher où cliquer, il quitte la page.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
          <p>
              « Une page de vente efficace est un couloir fermé : le visiteur n'a que deux choix possibles : acheter maintenant ou fermer la page. Aucune distraction possible. »
          </p>
      </div>

      <h3>Les 5 Blocs Chirurgicaux d'une One-Page qui Convertit</h3>
      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">Anatomie de Conversion</span>
              <h4>La Structure de Haut en Bas</h4>
          </div>
          <div class="method-body">
              <div class="method-steps">
                  <div class="method-step-item">
                      <div class="method-step-num">1</div>
                      <div class="method-step-content">
                          <strong>Le Hero Banner (L'Accroche Immédiate) :</strong>
                          <p>Ta promesse d'État B en 1 phrase percutante, une photo ou vidéo courte montrant le résultat, et un gros bouton d'action visible sans avoir besoin de faire défiler l'écran.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">2</div>
                      <div class="method-step-content">
                          <strong>L'Agonie & l'Empathie (Le Problème) :</strong>
                          <p>Trois puces décrivant la douleur actuelle de ton client. Il doit se dire : <em>« C'est exactement ce que je vis tous les matins »</em>.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">3</div>
                      <div class="method-step-content">
                          <strong>La Solution & l'Offre en 3 Paliers :</strong>
                          <p>Présentation limpide de ton offre (Tripwire, Offre Cœur, Option VIP) avec le détail précis de ce qui est inclus et le tarif clair.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">4</div>
                      <div class="method-step-content">
                          <strong>Le Mur de Confiance (Preuves Sociales) :</strong>
                          <p>Les 3 à 5 témoignages récoltés lors de ta phase Bêta (Ch. 15). Captures d'écran WhatsApp authentiques ou citations avec prénoms.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">5</div>
                      <div class="method-step-content">
                          <strong>L'Appel à l'Action sans Friction (Le Bouton Ultime) :</strong>
                          <p>Lien direct vers la commande sécurisée (Stripe/Payhip) ou bouton vert géant : <em>« Commander directement par WhatsApp »</em>.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <h3>Les outils gratuits ou ultra-économiques pour créer ta page en 2h</h3>
      <div class="feature-grid-3">
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-cube"></i></div>
              <h4>Carrd.co (19$/an)</h4>
              <p>Le roi absolu de la One-Page mobile. Rapide, fluide, magnifique et intégrable avec Stripe en 3 clics.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-download"></i></div>
              <h4>Payhip (0€ / 5% par vente)</h4>
              <p>Parfait pour vendre des e-books, du coaching ou des acomptes sans payer aucun abonnement mensuel au départ.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-brands fa-whatsapp"></i></div>
              <h4>Catalogue WhatsApp Business</h4>
              <p>100% gratuit. Tes fiches produits directement dans la messagerie avec prix, photos et lien de commande.</p>
          </div>
      </div>
  `,
  exercise: {
      id: "ex_chapitre_16",
      title: "Structure de ta One-Page & Lien Bio",
      description: "Rédige les éléments clés de ta page d'atterrissage pour être prêt à accueillir tes prospects :",
      fields: [
          {
              id: "onepage_titre_hero",
              type: "text",
              label: "Le titre de ton Hero Banner (Promesse État B en 1 phrase) :",
              placeholder: "Ex: Obtenez 8 vidéos prêtes à poster par mois sans toucher à un logiciel de montage."
          },
          {
              id: "onepage_3_douleurs",
              type: "textarea",
              label: "Les 3 douleurs ou blocages majeurs listés dans la section Empathie :",
              placeholder: "1. Pas le temps de publier régulièrement\n2. Peur d'être ridicule en vidéo\n3. Aucun résultat malgré des heures d'efforts"
          },
          {
              id: "onepage_outil_choisi",
              type: "select",
              label: "Outil retenu pour héberger ta page :",
              options: [
                  "Catalogue WhatsApp Business (0€ - Recommandé pour démarrer local)",
                  "Carrd.co (One-Page épurée - 19$/an)",
                  "Payhip (0€ fixe - Idéal digital & coaching)",
                  "Lien direct vers DM WhatsApp"
              ]
          }
      ]
  }
};

// 18. Ch 17: Encaisser sans Friction & Maîtriser ses Chiffres Simples
const rawCh17 = find871('chapitre-12');
const ch17 = {
  ...rawCh17,
  id: "chapitre-17",
  number: 17,
  badge: "Chapitre 17",
  title: "Encaisser sans Friction & Maîtriser ses Chiffres Simples",
  subtitle: "Le stack d'encaissement moderne, la règle des 3 comptes et le simulateur de rentabilité en direct.",
  content: `
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
  ` + rawCh17.content,
  exercise: {
    ...rawCh17.exercise,
    id: "ex_chapitre_17",
    isCalculator: true
  }
};

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
const ch19 = {
  id: "chapitre-19",
  number: 19,
  badge: "Chapitre 19",
  title: "Réseaux Sociaux (1/3) — Psychologie, Algorithme 2026 & Incarnation",
  subtitle: "L'échantillon des 200, le signal suprême des DMs et pourquoi les gens achètent à des visages.",
  readTime: "8 min",
  content: `
      <p class="lead-text">
          Mettons fin au plus grand mythe du marketing digital : <strong>avoir des milliers d'abonnés ne veut absolument pas dire être rentable</strong>.
      </p>
      <p>
          Combien d'influenceurs avec 50 000 followers n'arrivent pas à payer leur loyer à la fin du mois, pendant que des artisans ou consultants avec 800 abonnés ultra-qualifiés encaissent 4 000€ à 8 000€ mensuels ?
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-brain"></i></div>
          <p>
              « Les abonnés sont une vanity metric (flatterie d'ego). Les vues sont une curiosité. Seules les conversations privées (DMs et WhatsApp) et les euros sur ton compte sont une mesure de ton succès. »
          </p>
      </div>

      <h3>Comment fonctionnent réellement les algorithmes en 2026</h3>
      <p>
          Que tu sois sur Instagram, TikTok, Facebook ou LinkedIn, l'algorithme n'est pas un ennemi : c'est un robot programmé pour retenir l'attention des utilisateurs.
      </p>
      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">La Mécanique Secrète</span>
              <h4>Le Test des 200 Premières Personnes</h4>
          </div>
          <div class="method-body">
              <p>Quand tu publies une vidéo ou une photo, l'algorithme ne la montre pas à tout le monde. Il la montre à un échantillon test de 200 à 300 personnes. Il mesure 3 critères :</p>
              <ul>
                  <li><strong>Le Watch Time (Temps de rétention) :</strong> Les gens regardent-ils plus de 3 secondes ? Restent-ils jusqu'à la fin ?</li>
                  <li><strong>Les Partages et Sauvegardes :</strong> Le contenu apporte-t-il une valeur telle qu'on veut le réécouter ou l'envoyer à un proche ?</li>
                  <li><strong>Les Messages Privés déclenchés :</strong> Le signal suprême en 2026. Si ton post pousse quelqu'un à t'envoyer un DM, l'algorithme décuple ta visibilité.</li>
              </ul>
          </div>
      </div>

      <h3>L'Incarnation : Pourquoi les gens achètent à des visages</h3>
      <p>
          Les logos abstraits n'inspirent confiance à personne. Surtout dans nos régions, l'acheteur a besoin de savoir qui se trouve derrière la marque. Montrer ton visage, parler avec ton accent naturel, raconter tes anecdotes locales et assumer tes valeurs crée un bouclier d'attachement qu'aucune grande multinationale ne pourra jamais copier.
      </p>
  `,
  exercise: {
      id: "ex_chapitre_19",
      title: "Ton Diagnostic d'Incarnation & de Référencement Social",
      description: "Prépare ton profil pour qu'il inspire confiance dès la première seconde :",
      fields: [
          {
              id: "rs_incarnation_visage",
              type: "select",
              label: "Quel est ton niveau d'incarnation actuel sur tes réseaux ?",
              options: [
                  "J'assume mon visage face caméra (recommandé - taux de confiance maximal)",
                  "Je montre mes mains et mon travail en coulisses (voix off)",
                  "Je suis encore anonyme (urgent à faire évoluer pour vendre)"
              ]
          },
          {
              id: "rs_bio_transformation",
              type: "textarea",
              label: "Rédige ta bio en 3 lignes (Qui tu aides + Quel résultat + Ton lien d'action) :",
              placeholder: "Ex: J'aide les restaurateurs à doubler leurs réservations grâce à des vidéos captivantes.\n👇 Réserve ton audit gratuit ici :"
          }
      ]
  }
};

// 21. Ch 20: Le Système de Contenu sans Burnout (Batching 1 mois en 3h)
const ch20 = {
  id: "chapitre-20",
  number: 20,
  badge: "Chapitre 20",
  title: "Le Système de Contenu sans Burnout (Batching 1 mois en 3h)",
  subtitle: "Pourquoi créer au jour le jour te tue à petit feu et comment produire 1 mois de visibilité en un seul après-midi.",
  readTime: "8 min",
  content: `
      <p class="lead-text">
          Voici la tragédie du créateur débutant : il se réveille le lundi matin, il allume son téléphone sous pression, il se demande <em>« Qu'est-ce que je vais bien pouvoir poster aujourd'hui ? »</em>, il passe 2 heures à bricoler un visuel sur Canva, il récolte 9 likes, et au bout de trois semaines d'épuisement mental, il abandonne totalement les réseaux sociaux.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
          <p>
              « L'inspiration au jour le jour est le poison de la constance. Les entrepreneurs qui durent ne créent jamais au feeling : ils séparent radicalement la phase de production de la phase de distribution. »
          </p>
      </div>

      <h3>La Méthode du Batching Chrono (3h par mois)</h3>
      <p>
          Le principe du <strong>batching</strong> consiste à regrouper toutes les tâches similaires sur un seul bloc de temps. Tu ne filmes pas une vidéo chaque jour : tu filmes <strong>12 vidéos d'un coup en 1 heure</strong> un dimanche après-midi ou un lundi matin.
      </p>
      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">La Session Chrono 3h</span>
              <h4>Le Découpage Minute par Minute</h4>
          </div>
          <div class="method-body">
              <div class="method-steps">
                  <div class="method-step-item">
                      <div class="method-step-num">0h45</div>
                      <div class="method-step-content">
                          <strong>Étape 1 : Le Brainstorming des 4 Piliers</strong>
                          <p>Tu listes 12 idées précises réparties sur tes 4 piliers de contenu (3 idées par pilier). Pas de script mot à mot : juste une accroche et 3 puces mémo.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">1h00</div>
                      <div class="method-step-content">
                          <strong>Étape 2 : Le Tournage Commando</strong>
                          <p>Tu poses ton smartphone sur un trépied face à une fenêtre. Tu filmes les 12 vidéos courtes (45 à 60 secondes max) à la suite. Tu changes de veste ou de t-shirt toutes les 3 vidéos si tu veux varier les plans.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">0h45</div>
                      <div class="method-step-content">
                          <strong>Étape 3 : Légendes & Call-to-Action</strong>
                          <p>Tu rédiges les 12 descriptions avec des accroches percutantes et ton appel à l'action vers les DMs ou ta page One-Page.</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">0h30</div>
                      <div class="method-step-content">
                          <strong>Étape 4 : Programmation Automatique</strong>
                          <p>Tu charges tout dans Meta Business Suite (gratuit pour Instagram/Facebook) ou TikTok Studio. C'est programmé à 3 publications par semaine. Tu es libre pour les 30 prochains jours.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <h3>Les 4 Piliers de Contenu Incontournables</h3>
      <div class="feature-grid-2">
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-graduation-cap"></i></div>
              <h4>Pilier 1 : Valeur & Autorité (25%)</h4>
              <p>Règle un micro-problème en 45 secondes. Ex : <em>« L'erreur numéro 1 que font tous les propriétaires de voiture aux Antilles... »</em></p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-eye"></i></div>
              <h4>Pilier 2 : Coulisses & Réalité Terrain (25%)</h4>
              <p>Montre ce qui est vrai : la préparation des colis à 6h du matin, un échec sur une recette, la vérité sur les délais de livraison.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-star"></i></div>
              <h4>Pilier 3 : Preuve & Transformation (25%)</h4>
              <p>Les avis de tes clients Bêta, les Avant/Après spectaculaires, la capture d'un message WhatsApp de remerciement.</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-bullhorn"></i></div>
              <h4>Pilier 4 : Vente Directe & Offre (25%)</h4>
              <p>Parle franchement : <em>« Il me reste 3 créneaux disponibles pour [Service] cette semaine. Envoie-moi 'INFOS' en DM pour réserver. »</em></p>
          </div>
      </div>
  `,
  exercise: {
      id: "ex_chapitre_20",
      title: "Matrice des 4 Piliers & Calendrier 1 Mois en 3h",
      description: "Définis immédiatement tes 4 premiers sujets de vidéos pour ta prochaine session de batching :",
      fields: [
          {
              id: "batching_sujet_valeur",
              type: "text",
              label: "Pilier 1 (Valeur / Micro-conseil) : Ton idée de sujet en 1 phrase",
              placeholder: "Ex: 3 astuces pour repérer un vrai savon artisanal sans produits chimiques..."
          },
          {
              id: "batching_sujet_coulisses",
              type: "text",
              label: "Pilier 2 (Coulisses / Sans filtre) : Quelle scène réelle de ton travail vas-tu filmer ?",
              placeholder: "Ex: Comment j'emballe les commandes fragiles pour résister à la livraison locale..."
          },
          {
              id: "batching_sujet_preuve",
              type: "text",
              label: "Pilier 3 (Preuve / Témoignage) : Quel retour client vas-tu mettre en avant ?",
              placeholder: "Ex: La capture du message vocal de Sarah qui a gagné 3h de gestion cette semaine..."
          },
          {
              id: "batching_date_session",
              type: "text",
              label: "Date et heure de ton créneau réservé de 3h dans ton agenda :",
              placeholder: "Ex: Samedi prochain de 9h à 12h"
          }
      ]
  }
};

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
const ch25 = {
  id: "chapitre-25",
  number: 25,
  badge: "Chapitre 25",
  title: "Rétention, Réachat & Boucle de Parrainage",
  subtitle: "Acquérir un client coûte 7 fois plus cher que de le faire racheter. Bâtis ta machine à réachat et recommandations.",
  readTime: "7 min",
  content: `
      <p class="lead-text">
          La plupart des entrepreneurs débutants ont une passoire en guise de business : ils déploient une énergie titanesque pour trouver de nouveaux clients, et une fois la vente conclue, ils ne donnent plus jamais signe de vie.
      </p>
      <div class="quote-card">
          <div class="quote-icon"><i class="fa-solid fa-repeat"></i></div>
          <p>
              « Ton premier client te donne de l'oxygène. Son réachat et les 3 amis qu'il t'amène te donnent ta liberté financière. »
          </p>
      </div>
      <p>
          Dans les économies insulaires et communautaires, la proximité humaine est ton plus grand avantage compétitif face aux multinationales froides. Un client traité comme un roi après l'achat devient ton commercial le plus fidèle.
      </p>

      <h3>Le Protocole de Suivi WhatsApp Post-Achat (J+3, J+15, J+30)</h3>
      <p>
          Ne laisse jamais le hasard décider de la relation client. Programme ces 3 messages automatiques ou semi-manuels :
      </p>
      <div class="method-box">
          <div class="method-header">
              <span class="method-badge">La Cadence de Rétention</span>
              <h4>Les 3 Relances Chaleureuses</h4>
          </div>
          <div class="method-body">
              <div class="method-steps">
                  <div class="method-step-item">
                      <div class="method-step-num">J+3</div>
                      <div class="method-step-content">
                          <strong>La Prise de Nouvelles (Zéro Vente) :</strong>
                          <p><em>« Bonjour [Prénom], c'est [Ton Nom]. Je voulais juste m'assurer que tu as bien reçu ta commande / que la première mise en place s'est bien passée. Est-ce que tout est clair pour toi ? »</em> (Démontre une attention sincère rarissime).</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">J+15</div>
                      <div class="method-step-content">
                          <strong>Le Conseil à Forte Valeur Ajoutée :</strong>
                          <p><em>« Salut [Prénom], voici une astuce supplémentaire pour maximiser l'effet de ton produit / service... »</em> (Renforce ton statut d'expert bienveillant).</p>
                      </div>
                  </div>
                  <div class="method-step-item">
                      <div class="method-step-num">J+30</div>
                      <div class="method-step-content">
                          <strong>Le Réachat & l'Offre de Renouvellement :</strong>
                          <p><em>« Salut [Prénom], ton stock arrive probablement sur la fin / il est temps de passer au niveau supérieur pour le mois prochain. Voici un lien réservé à nos clients VIP avec -15% ou un cadeau offert pour ta réappro. »</em></p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <h3>La Boucle de Parrainage Chaleureuse (Bouche-à-Oreille Organisé)</h3>
      <p>
          Ne dis pas simplement <em>"Parlez-en autour de vous"</em> (personne ne le fait). Donne une incitation précise et valorisante :
      </p>
      <div class="feature-grid-2">
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-gift"></i></div>
              <h4>L'Offre Gagnant-Gagnant</h4>
              <p>« Donne ce code personnalisé à 1 collègue ou ami : il bénéficie de 15€ offerts sur sa 1ère commande, et toi tu reçois 15€ de crédit direct sur ta prochaine facture. »</p>
          </div>
          <div class="feature-card">
              <div class="feature-card-icon"><i class="fa-solid fa-share-nodes"></i></div>
              <h4>Le Statut d'Ambassadeur</h4>
              <p>Remercie publiquement ou envoie un petit produit bonus inattendu à tout client qui partage ta publication en story. L'effet de réciprocité est immédiat.</p>
          </div>
      </div>
  `,
  exercise: {
      id: "ex_chapitre_25",
      title: "Protocole de Suivi Post-Vente & Boucle Ambassadeur",
      description: "Mets en place ton système de réachat pour transformer chaque client en rentier de confiance :",
      fields: [
          {
              id: "retention_message_j3",
              type: "textarea",
              label: "Ton message type personnalisé à envoyer à J+3 après chaque livraison ou prestation :",
              placeholder: "Ex: Bonjour [Prénom], j'espère que tu vas bien. As-tu pu tester [Produit] ? Je reste disponible si tu as la moindre question !"
          },
          {
              id: "retention_offre_reachat_j30",
              type: "text",
              label: "Quelle offre ou produit complémentaire proposes-tu à J+30 pour inciter au réachat ?",
              placeholder: "Ex: Recharge format éco avec -15%, ou forfait suivi mensuel avec 1er mois à tarif préférentiel..."
          },
          {
              id: "retention_parrainage_incentive",
              type: "text",
              label: "Quel avantage concret offres-tu pour chaque recommandation réussie ?",
              placeholder: "Ex: 10€ de réduction pour le filleul et 10€ de bon d'achat pour le parrain."
          }
      ]
  }
};

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

// 28. Ch 27: Tes 30 premiers jours d'action
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

// Assemble the 30 chapters
const definitiveChapters = [
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

console.log('Successfully assembled definitive chapters count:', definitiveChapters.length);
definitiveChapters.forEach((c, idx) => {
  console.log(`[${idx}] id="${c.id}" | num=${c.number} | badge="${c.badge}" | title="${c.title}"`);
});

const guideOutput = {
  meta: {
    title: "Les fondamentaux de l'entrepreneur — Tome 1",
    subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
    author: "Domtom Connect",
    edition: "2026 — Édition Interactive Enrichie",
    totalChapters: 27
  },
  chapters: definitiveChapters
};

const fileStr = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie 2026
 * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)
 */

window.GUIDE_DATA = ` + JSON.stringify(guideOutput, null, 4) + ';\n';

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js'), fileStr, 'utf8');
console.log('SUCCESS! Wrote assets/data/guide-tome1.js cleanly. Total length:', fileStr.length);
