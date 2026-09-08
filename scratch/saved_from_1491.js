const fs = require('fs');

global.window = global;
require('../assets/data/guide-tome1.js');

const oldChapters = window.GUIDE_DATA.chapters;
const getOld = (id) => oldChapters.find(c => c.id === id);

console.log('Building new guide structure...');

// Define new 27-chapter sequence
const newChapters = [];

// 0. Couverture
const couverture = getOld('couverture');
couverture.content = couverture.content.replace('19 Chapitres d\'action', '27 Chapitres de consultation');
newChapters.push(couverture);

// 1. Avant-propos
const avantPropos = getOld('avant-propos');
avantPropos.number = 1;
newChapters.push(avantPropos);

// 2. Ch 1 (Old Ch 1)
const ch1 = getOld('chapitre-1');
ch1.number = 1;
ch1.badge = 'Chapitre 1';
newChapters.push(ch1);

// 3. Ch 2 (Old Ch 2)
const ch2 = getOld('chapitre-2');
ch2.number = 2;
ch2.badge = 'Chapitre 2';
newChapters.push(ch2);

// 4. Ch 3 (Old Ch 3)
const ch3 = getOld('chapitre-3');
ch3.number = 3;
ch3.badge = 'Chapitre 3';
newChapters.push(ch3);

// 5. Ch 4: Pareto & Moyens actuels (Old Ch 12 adapted to Phase 1 Mindset)
const oldCh12 = getOld('chapitre-12');
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
                                <div class="method-step-num" style="background:#ef4444;">❌</div>
                                <div class="method-step-content">
                                    <strong>Les 80% qui te font perdre ton temps (Procrastination déguisée) :</strong>
                                    <p>Passer 3 semaines à choisir un nom d'entreprise, débattre sur la nuance de bleu de ton logo, imprimer des cartes de visite, lire 4 livres de gestion, créer un compte Twitter vide.</p>
                                </div>
                            </div>
                            <div class="method-step-item">
                                <div class="method-step-num" style="background:#10b981;">✅</div>
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
newChapters.push(ch4);

// 6. Ch 5: Comprendre les 5 Chemins (+ 5 Histoires Réelles) (Old Ch 4)
const ch5 = getOld('chapitre-4');
ch5.id = 'chapitre-5';
ch5.number = 5;
ch5.badge = 'Chapitre 5';
newChapters.push(ch5);

// 7. Ch 6: Choisir son Chemin & Valider sa Voie (L'Aiguillage) (Old Ch 5)
const ch6 = getOld('chapitre-5');
ch6.id = 'chapitre-6';
ch6.number = 6;
ch6.badge = 'Chapitre 6';
newChapters.push(ch6);

// 8. Ch 7: Du Modèle au Métier : Bilan de Compétences & Choix de Spécialité (NEW)
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

                <div class="sector-tab-container">
                    <div class="sector-tabs-nav" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
                        <span class="sector-tab-btn active" data-target-sector="physique">Voie 1 : Physique</span>
                        <span class="sector-tab-btn" data-target-sector="service">Voie 2 : Services B2B</span>
                        <span class="sector-tab-btn" data-target-sector="digital">Voie 3 : Digital</span>
                        <span class="sector-tab-btn" data-target-sector="food">Voie 4 : Food</span>
                        <span class="sector-tab-btn" data-target-sector="commerce">Voie 5 : Commerce</span>
                    </div>

                    <div class="sector-article-panel active" data-sector="physique">
                        <div class="method-box">
                            <div class="method-header">
                                <span class="method-badge">Métiers Concrets — Voie 1</span>
                                <h4>Artisanat, Beauté & Terroirs</h4>
                            </div>
                            <div class="method-body">
                                <ul>
                                    <li><strong>Savonnier / Formulateur cosmétique naturel :</strong> Savons au soufre, huiles de carapate/ricin pressées à froid, beurres corporels pour peaux mélanodermes.</li>
                                    <li><strong>Cirier / Artisan senteurs :</strong> Bougies parfumées aux notes tropicales (maracudja, vanille Bourbon, ylang-ylang) pour hôtellerie et particuliers.</li>
                                    <li><strong>Créateur de mode & maroquinerie :</strong> Vêtements sur-mesure aux motifs identitaires, accessoires en madras revisité ou matières recyclées.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="sector-article-panel" data-sector="service">
                        <div class="method-box">
                            <div class="method-header">
                                <span class="method-badge">Métiers Concrets — Voie 2</span>
                                <h4>Prestations de Services & B2B</h4>
                            </div>
                            <div class="method-body">
                                <ul>
                                    <li><strong>Monteur Vidéo Reels / TikTok pour commerçants :</strong> Tu viens filmer 1h dans leur boutique et tu leur livres 8 vidéos montées avec sous-titres dynamiques.</li>
                                    <li><strong>Gestionnaire WhatsApp Business & Service Client :</strong> Tu configures et réponds aux messages clients des TPE débordées le soir et le week-end.</li>
                                    <li><strong>Assistant(e) administratif(ve) et facturation freelance :</strong> Tu relances les impayés et classes les factures des artisans qui détestent la paperasse.</li>
                                    <li><strong>Nettoyage professionnel spécialisé :</strong> Nettoyage de canapés/tapis à domicile, désinfection de véhicules pros ou fin de chantier.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="sector-article-panel" data-sector="digital">
                        <div class="method-box">
                            <div class="method-header">
                                <span class="method-badge">Métiers Concrets — Voie 3</span>
                                <h4>Produits Digitaux & E-books</h4>
                            </div>
                            <div class="method-body">
                                <ul>
                                    <li><strong>Auteur d'E-books pratiques ciblés :</strong> Guide de recettes sans gluten aux tubercules locaux, guide d'installation administrative aux Antilles/Réunion.</li>
                                    <li><strong>Créateur de Templates Notion & Tableurs :</strong> Outils prêts à l'emploi pour gérer les stocks d'un restaurant ou le budget des familles.</li>
                                    <li><strong>Formateur express sur logiciel :</strong> Mini-formation en ligne de 2h pour apprendre Canva ou WhatsApp Business aux indépendants.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="sector-article-panel" data-sector="food">
                        <div class="method-box">
                            <div class="method-header">
                                <span class="method-badge">Métiers Concrets — Voie 4</span>
                                <h4>Food & Restauration Rapide</h4>
                            </div>
                            <div class="method-body">
                                <ul>
                                    <li><strong>Traiteur boîtes repas du midi pour zones d'activités :</strong> Plats équilibrés et saveurs locales livrés directement aux salariés de bureau à 12h.</li>
                                    <li><strong>Spécialiste Street-Food événementiel :</strong> Stand mobile de bokits, pastels ou accras minute pour foires, mariages et soirées privées.</li>
                                    <li><strong>Pâtisserie personnalisée sur commande :</strong> Gâteaux d'anniversaire créatifs (Cake design) avec livraison sécurisée le samedi.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="sector-article-panel" data-sector="commerce">
                        <div class="method-box">
                            <div class="method-header">
                                <span class="method-badge">Métiers Concrets — Voie 5</span>
                                <h4>Commerce & Achat-Revente</h4>
                            </div>
                            <div class="method-body">
                                <ul>
                                    <li><strong>Dénicheur de pièces rares / Sourcing local :</strong> Importer des produits de beauté ou accessoires de sport introuvables sur le territoire et livrés sous 24h.</li>
                                    <li><strong>Reconditionneur High-Tech / Téléphonie :</strong> Rachat, nettoyage, changement d'écran et revente d'iPhone d'occasion avec garantie 6 mois.</li>
                                    <li><strong>Boutique éphémère / Pop-up store de prêt-à-porter :</strong> Vente flash de collections sélectionnées le temps d'un week-end festif.</li>
                                </div>
                        </div>
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
newChapters.push(ch7);

// 9. Ch 8: Étude de Marché Terrain & Failles de la Concurrence (Old Ch 9)
const ch8 = getOld('chapitre-9');
ch8.id = 'chapitre-8';
ch8.number = 8;
ch8.badge = 'Chapitre 8';
ch8.exercise.id = 'ex_chapitre_8';
newChapters.push(ch8);

// 10. Ch 9: Comprendre la Niche & la Transformation (Old Ch 7)
const ch9 = getOld('chapitre-7');
ch9.id = 'chapitre-9';
ch9.number = 9;
ch9.badge = 'Chapitre 9';
ch9.exercise.id = 'ex_chapitre_9';
newChapters.push(ch9);

// 11. Ch 10: Verrouiller sa Niche Rentable & sa Différenciation (Old Ch 8)
const ch10 = getOld('chapitre-8');
ch10.id = 'chapitre-10';
ch10.number = 10;
ch10.badge = 'Chapitre 10';
ch10.exercise.id = 'ex_chapitre_10';
newChapters.push(ch10);

// 12. Ch 11: Ton Client Idéal en Profondeur (L'Avatar) (Old Ch 10)
const ch11 = getOld('chapitre-10');
ch11.id = 'chapitre-11';
ch11.number = 11;
ch11.badge = 'Chapitre 11';
ch11.exercise.id = 'ex_chapitre_11';
newChapters.push(ch11);

// 13. Ch 12: Les Vrais Fondamentaux du Branding (Old Ch 14)
const ch12_b = getOld('chapitre-14');
ch12_b.id = 'chapitre-12';
ch12_b.number = 12;
ch12_b.badge = 'Chapitre 12';
ch12_b.exercise.id = 'ex_chapitre_12';
newChapters.push(ch12_b);

// 14. Ch 13: Ton Premier Logo & Studio Couleurs (Old Ch 15)
const ch13 = getOld('chapitre-15');
ch13.id = 'chapitre-13';
ch13.number = 13;
ch13.badge = 'Chapitre 13';
ch13.exercise.id = 'ex_chapitre_13';
newChapters.push(ch13);

// 15. Ch 14: Architecture de l'Offre Irrésistible (Old Ch 13)
const ch14 = getOld('chapitre-13');
ch14.id = 'chapitre-14';
ch14.number = 14;
ch14.badge = 'Chapitre 14';
ch14.exercise.id = 'ex_chapitre_14';
newChapters.push(ch14);

// 16. Ch 15: L'Offre Bêta & Collecter ses 5 Preuves Sociales (NEW)
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
newChapters.push(ch15);

// 17. Ch 16: La Page de Vente One-Page & Link-in-Bio (NEW)
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
newChapters.push(ch16);

// 18. Ch 17: Encaisser sans Friction & Maîtriser ses Chiffres Simples (Old Ch 16 enriched)
const ch17 = getOld('chapitre-16');
ch17.id = 'chapitre-17';
ch17.number = 17;
ch17.badge = 'Chapitre 17';
ch17.title = "Encaisser sans Friction & Maîtriser ses Chiffres Simples";
ch17.subtitle = "Le stack d'encaissement moderne, la règle des 3 comptes et le simulateur de rentabilité en direct.";
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

                <h3>La règle des 3 comptes bancaires</h3>
                <p>
                    Pour ne jamais te retrouver pris à la gorge par les cotisations sociales ou les impôts en fin de trimestre, applique cette discipline dès ton premier euro encaissé :
                </p>
                <div class="feature-grid-3">
                    <div class="feature-card">
                        <div class="feature-card-icon"><i class="fa-solid fa-vault"></i></div>
                        <h4>Compte 1 : Trésorerie Pro (100%)</h4>
                        <p>Tout ce que tes clients paient atterrit ici. C'est le compte tampon officiel de ton entreprise.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-card-icon"><i class="fa-solid fa-shield-halved"></i></div>
                        <h4>Compte 2 : Provisions & Charges (25-30%)</h4>
                        <p>Dès qu'une somme rentre, vire immédiatement 25% sur ce sous-compte intouchable dédié aux cotisations (URSSAF, TVA, impôts). Cet argent ne t'appartient pas.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-card-icon"><i class="fa-solid fa-wallet"></i></div>
                        <h4>Compte 3 : Rémunération Nette</h4>
                        <p>Ce qui reste après charges fixes et provisions est ton salaire réel. Tu le vires sur ton compte personnel à date fixe.</p>
                    </div>
                </div>

                <h3>Simulateur de Seuil de Rentabilité & Cadence Hebdomadaire</h3>
                <p>
                    Utilise le calculateur ci-dessous pour connaître exactement combien de ventes tu dois réaliser chaque semaine pour vivre dignement de ton activité :
                </p>
` + (ch17.content.includes('id="calc-results-live"') ? '' : '');
ch17.exercise.id = 'ex_chapitre_17';
ch17.exercise.isCalculator = true;
newChapters.push(ch17);

// 19. Ch 18: La Boîte à Outils Minimaliste (Old Ch 17)
const ch18 = getOld('chapitre-17');
ch18.id = 'chapitre-18';
ch18.number = 18;
ch18.badge = 'Chapitre 18';
ch18.exercise.id = 'ex_chapitre_18';
newChapters.push(ch18);

// 20. Ch 19: Réseaux Sociaux (1/3) — Psychologie & Algorithme 2026 (Old Ch 19)
const ch19 = getOld('chapitre-19');
ch19.id = 'chapitre-19';
ch19.number = 19;
ch19.badge = 'Chapitre 19';
ch19.exercise.id = 'ex_chapitre_19';
newChapters.push(ch19);

// 21. Ch 20: Le Système de Contenu sans Burnout (Batching 1 mois en 3h) (NEW)
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
newChapters.push(ch20);

// 22. Ch 21: Réseaux Sociaux (2/3) — Le Tunnel TOFU-MOFU-BOFU & Canal Maître (Old Ch 20)
const ch21 = getOld('chapitre-20');
ch21.id = 'chapitre-21';
ch21.number = 21;
ch21.badge = 'Chapitre 21';
ch21.exercise.id = 'ex_chapitre_21';
newChapters.push(ch21);

// 23. Ch 22: Réseaux Sociaux (3/3) — Playbooks par Secteur & Closing DM (Old Ch 21)
const ch22 = getOld('chapitre-21');
ch22.id = 'chapitre-22';
ch22.number = 22;
ch22.badge = 'Chapitre 22';
ch22.exercise.id = 'ex_chapitre_22';
newChapters.push(ch22);

// 24. Ch 23: Le Pitch en Une Phrase (Old Ch 22)
const ch23 = getOld('chapitre-22');
ch23.id = 'chapitre-23';
ch23.number = 23;
ch23.badge = 'Chapitre 23';
ch23.exercise.id = 'ex_chapitre_23';
newChapters.push(ch23);

// 25. Ch 24: Vendre & Surmonter le Rejet Commercial (Old Ch 18)
const ch24 = getOld('chapitre-18');
ch24.id = 'chapitre-24';
ch24.number = 24;
ch24.badge = 'Chapitre 24';
ch24.exercise.id = 'ex_chapitre_24';
newChapters.push(ch24);

// 26. Ch 25: Rétention, Réachat & Boucle de Parrainage (NEW)
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
newChapters.push(ch25);

// 27. Ch 26: Seul ou Accompagné : Faut-il t'associer ? (Old Ch 11)
const ch26 = getOld('chapitre-11');
ch26.id = 'chapitre-26';
ch26.number = 26;
ch26.badge = 'Chapitre 26';
ch26.exercise.id = 'ex_chapitre_26';
newChapters.push(ch26);

// 28. Ch 27: Tes 30 premiers jours d'action (Old Ch 23)
const ch27 = getOld('chapitre-23');
ch27.id = 'chapitre-27';
ch27.number = 27;
ch27.badge = 'Chapitre 27';
ch27.exercise.id = 'ex_chapitre_27';
newChapters.push(ch27);

// 29. Conclusion
const conclusion = getOld('conclusion');
conclusion.number = 28;
newChapters.push(conclusion);

console.log('Total new chapters assembled:', newChapters.length);
newChapters.forEach((c, i) => console.log(`[${i}] ${c.id}: ${c.title}`));

// Assemble and write to guide-tome1.js
const guideData = {
    meta: {
        title: "Les fondamentaux de l'entrepreneur — Tome 1",
        subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
        author: "Domtom Connect",
        edition: "2026 — Édition Interactive Enrichie",
        totalChapters: 27
    },
    chapters: newChapters
};

const fileHeader = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie 2026
 * Parcours Consultation Pas-à-Pas (27 Chapitres Fondamentaux)
 */

window.GUIDE_DATA = `;

const finalContent = fileHeader + JSON.stringify(guideData, null, 4) + ';\n';
fs.writeFileSync('./assets/data/guide-tome1.js', finalContent, 'utf8');
console.log('Successfully updated assets/data/guide-tome1.js! File size:', finalContent.length);
