const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
const raw = fs.readFileSync(filePath, 'utf8');

// Parse current GUIDE_DATA
eval(raw.replace('window.GUIDE_DATA =', 'global.GUIDE_DATA ='));
const currentChapters = global.GUIDE_DATA.chapters;

console.log('Original chapters count:', currentChapters.length);

function findCh(predicate) {
    const found = currentChapters.find(predicate);
    if (!found) console.error('Chapter not found for predicate');
    return found;
}

// ------------------------------------------------------------------
// 1. CREATE NEW CHAPTER 7 : ÉTUDE DE MARCHÉ, CONCURRENCE & OPPORTUNITÉS
// ------------------------------------------------------------------
const chapterMarketContent = `
        <p class="lead-text">
            Maintenant que tu as identifié ta Voie et ta Niche, la pire erreur serait d'avancer les yeux fermés en ignorant qui est déjà présent sur le terrain.
        </p>
        <p>
            Faire une étude de marché ne consiste pas à remplir un rapport administratif théorique de 50 pages pour la banque. Sur le terrain, **une vraie étude de marché est une opération de détective** : observer la concurrence, identifier ses failles, et trouver l'espace vide exact où tu vas t'engouffrer.
        </p>

        <!-- I. CONCURRENTS DIRECTS VS INDIRECTS -->
        <div class="vs-container">
            <div class="vs-card bad">
                <h4><i class="fa-solid fa-crosshairs"></i> Concurrents Directs</h4>
                <p style="font-size:0.88rem; color:#fca5a5; margin-bottom:8px;">Ils proposent exactement le même type de produit/service à la même cible.</p>
                <ul>
                    <li>Exemple : Un autre préparateur de repas food-truck sur le même secteur.</li>
                    <li>Exemple : Une marque de cosmétique locale vendant des huiles de carapate.</li>
                </ul>
            </div>
            <div class="vs-card good">
                <h4><i class="fa-solid fa-arrows-split-up-and-left"></i> Concurrents Indirects</h4>
                <p style="font-size:0.88rem; color:#6ee7b7; margin-bottom:8px;">Ils résolvent le même problème mais avec un format ou un substitut différent.</p>
                <ul>
                    <li>Exemple : La boulangerie industrielle qui vend des sandwichs (substitut du déjeuner).</li>
                    <li>Exemple : Les produits chimiques importés vendus en grandes surfaces.</li>
                </ul>
            </div>
        </div>

        <!-- II. LA MATRICE DES FAIBLESSES = TES OPPORTUNITÉS -->
        <h3>La Règle d'Or : Les Faiblesses de tes Concurrents sont TES Opportunités</h3>
        <p>
            Analyse avec lucidité ce qui agace les clients chez tes concurrents actuels. C'est dans leurs failles que réside ta place au soleil :
        </p>

        <div class="highlight-box" style="margin:24px 0;">
            <h4 style="margin:0 0 10px 0; color:#10b981;"><i class="fa-solid fa-magnifying-glass-location"></i> Les 4 Failles Classiques à Traquer chez les Concurrents</h4>
            <ul style="margin:0; padding-left:20px; line-height:1.65; font-size:0.95rem;">
                <li><strong>1. Le service client froid ou inexistant :</strong> Délais de réponse de 3 jours par email, zéro réponse WhatsApp, pas de numéro direct.</li>
                <li><strong>2. Les délais de livraison interminables :</strong> Produits bloqués 3 semaines en douane ou expédiés sans numéro de suivi.</li>
                <li><strong>3. Le manque de clarté et de pédagogie :</strong> Des descriptions vagues, du jargon technique incompréhensible, des prix cachés qu'il faut demander en MP.</li>
                <li><strong>4. L'absence d'incarnation et de relation :</strong> Des marques impersonnelles sans visage qui ne créent aucune fidélité.</li>
            </ul>
        </div>

        <!-- III. ÉTUDE DE MARCHÉ ADAPTATIVE SELON TA VOIE -->
        <h3>Analyse d'Opportunité Terrain selon Ta Voie</h3>
        <p>
            Voici comment identifier les trous dans la raquette du marché selon le modèle que tu as sélectionné :
        </p>

        <div class="sector-adaptive-container" style="margin-top: 24px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">ANALYSE DU MARCHÉ PAR VOIE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Analyse de Marché : Produits Physiques</h4>
                <p>Observe les parapharmacies, boutiques et marques concurrentes sur les réseaux sociaux.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Ce que font les concurrents</h4>
                        <p>Produits importés chers avec des actifs chimiques raffinés et du packaging en plastique bas de gamme.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Ce que regrettent les clients dans les avis</h4>
                        <p>« Ça m'a asséché le cuir chevelu », « Livraison de 4 semaines », « Impossible de contacter le SAV ».</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Ton opportunité en or</h4>
                        <p>Formule locale ultra-fraîche, livraison en 48h en main propre ou Colissimo, SAV WhatsApp réactif en 15 min.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Analyse de Marché : Services B2B</h4>
                <p>Examine les agences locales et les indépendants travaillant dans ton domaine.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Ce que font les concurrents</h4>
                        <p>Proposent des devis flous à 5 000€ sans engagement de résultat avec un vocabulaire technique obscur.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Ce que regrettent les clients</h4>
                        <p>« On a payé 3 000€ et on a eu zéro prospect », « Ils ne répondent plus au téléphone après l'acompte ».</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Ton opportunité en or</h4>
                        <p>Forfait Sprint 14 jours avec objectifs chiffrés et suivi hebdomadaire vidéo Loom de 5 minutes.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Analyse de Marché : Produits Digitaux</h4>
                <p>Scanne les e-books et formations concurrentes vendues sur ton sujet.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Ce que font les concurrents</h4>
                        <p>Formations vidéos de 50 heures indigestes ou PDF de 200 pages plein de théorie universitaire.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Ce que regrettent les clients</h4>
                        <p>« C'est trop long », « Je ne sais pas par quoi commencer », « C'est adapté aux USA mais pas chez nous ».</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Ton opportunité en or</h4>
                        <p>Guide commando de 35 pages + Templates Notion/Excel prêts à être utilisés sous 24h.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Analyse de Marché : Restauration & Food</h4>
                <p>Inspecte les snacks, restaurants et food-trucks de ton secteur géographique.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Ce que font les concurrents</h4>
                        <p>Menus identiques, produits surgelés réchauffés, queue de 30 minutes le midi, rupture de stock non annoncée.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Ce que regrettent les clients</h4>
                        <p>« Attente trop longue », « Plats trop gras ou surgelés », « On ne sait jamais ce qu'ils ont en stock ».</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Ton opportunité en or</h4>
                        <p>Plat signature cuisiné frais du matin, servi en 3 minutes ou réservable sur WhatsApp dès 10h30.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Analyse de Marché : Boutique & Revente</h4>
                <p>Observe les boutiques du centre-ville, les concept stores et les comptes Instagram de revente.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Ce que font les concurrents</h4>
                        <p>Revendent tous les mêmes collections grossistes vues partout, vendeuses froides qui ne conseillent pas.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Ce que regrettent les clients</h4>
                        <p>« Tout le monde s'habille pareil », « Pas d'aide pour choisir », « Tarifs trop chers pour de la qualité moyenne ».</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Ton opportunité en or</h4>
                        <p>Petites séries de 12 pièces exclusives, conseil stylisme personnalisé et accès avant-première VIP WhatsApp.</p>
                    </div>
                </div>
            </div>
        </div>
`;

const chapterMarketExercise = {
    id: "ex_chapitre_7",
    title: "Ton Étude de Marché & Analyse Concurrentielle",
    description: "Analyse tes 2 principaux concurrents et verrouille l'opportunité unique où tu vas t'installer :",
    fields: [
        {
            id: "marche_concurrents_directs",
            type: "textarea",
            label: "1. Quels sont les 2 principaux concurrents directs ou indirects sur ton secteur ?",
            placeholder: "Ex: '1. Marque X (Cosmétique bio importée) / 2. Savonnerie locale Y (Vente sur les marchés).'"
        },
        {
            id: "marche_points_forts_faibles",
            type: "textarea",
            label: "2. Quels sont leurs 2 points forts et leurs 2 faiblesses majeures (failles) ?",
            placeholder: "Ex: 'Points forts : Forte communauté Instagram et beau packaging.\nFaiblesses : Délais d'expédition de 3 semaines et zéro réponse en DM.'"
        },
        {
            id: "marche_trou_raquette_opportunite",
            type: "textarea",
            label: "3. L'opportunité en or (Le trou dans la raquette où tu vas t'engouffrer) :",
            placeholder: "Ex: 'Proposer un produit local 100% frais livré en 48h avec conseils WhatsApp personnalisés en direct.'"
        },
        {
            id: "marche_mon_avantage_incomparable",
            type: "textarea",
            label: "4. Ton avantage positionnel (Pourquoi ton prospect va te préférer eux) :",
            placeholder: "Ex: 'Je suis la seule marque qui offre un diagnostic vocal de 15 secondes et une garantie satisfait ou remboursé sous 14 jours.'"
        }
    ]
};

const newChapterMarket = {
    id: "chapitre-7",
    number: 7,
    badge: "Chapitre 7",
    title: "Étude de Marché, Analyse de la Concurrence & Opportunités Uniques",
    subtitle: "Observer la concurrence, identifier ses failles et verrouiller l'espace vide où tu vas t'installer.",
    readTime: "7 min",
    content: chapterMarketContent,
    exercise: chapterMarketExercise
};

// ------------------------------------------------------------------
// 2. REORDER CHAPTERS IN 100% PERFECT CHRONOLOGICAL BUSINESS PLAN FLOW
// ------------------------------------------------------------------

const cCover = findCh(c => c.id === 'couverture');
const cAvant = findCh(c => c.id === 'avant-propos');
const c1 = findCh(c => c.title.includes("Ce que tu crois savoir"));
const c2 = findCh(c => c.title.includes("Le mur"));
const c3 = findCh(c => c.title.includes("Ton Why"));
const c4 = findCh(c => c.title.includes("Trouve ton chemin"));
const c5 = findCh(c => c.title.includes("Zoom sur ton secteur"));
const c6 = findCh(c => c.title.includes("Trouver sa Niche Rentable"));
// newChapterMarket is Chapter 7!
const c8_client = findCh(c => c.title.includes("Ton client, en profondeur"));
const c9_associer = findCh(c => c.title.includes("Seul ou accompagné"));
const c10_pareto = findCh(c => c.title.includes("Ton chemin, tes moyens") || c.title.includes("80/20"));
const c11_offre = findCh(c => c.title.includes("Architecture de l'Offre"));
const c12_branding = findCh(c => c.title.includes("Fondamentaux du Branding"));
const c13_logo = findCh(c => c.title.includes("Premier Logo"));
const c14_chiffres = findCh(c => c.title.includes("Financer sans la banque"));
const c15_outils = findCh(c => c.title.includes("Les outils selon ton business"));
const c16_echec = findCh(c => c.title.includes("Quand ça coince"));
const c17_soc1 = findCh(c => c.title.includes("Réseaux Sociaux (1/3)"));
const c18_soc2 = findCh(c => c.title.includes("Réseaux Sociaux (2/3)"));
const c19_soc3 = findCh(c => c.title.includes("Réseaux Sociaux (3/3)"));
const c20_pitch = findCh(c => c.title.includes("Le Pitch"));
const c21_action = findCh(c => c.title.includes("30 premiers jours"));
const cConclusion = findCh(c => c.id === 'conclusion');

const perfectChronologicalSequence = [
    cCover,            // idx 0, num 0
    cAvant,            // idx 1, num 1
    c1,                // idx 2, Ch 1 : Ce que tu crois savoir
    c2,                // idx 3, Ch 2 : Le mur
    c3,                // idx 4, Ch 3 : Ton Why
    c4,                // idx 5, Ch 4 : Trouve ton chemin (+ 5 histoires)
    c5,                // idx 6, Ch 5 : Zoom sur ton secteur (Choix de la Voie !)
    c6,                // idx 7, Ch 6 : Trouver sa Niche & Vendre la Transformation
    newChapterMarket,  // idx 8, Ch 7 : NOUVEAU — Étude de Marché & Concurrence
    c8_client,         // idx 9, Ch 8 : Ton Client Idéal (Avatar)
    c9_associer,       // idx 10, Ch 9 : Seul ou accompagné
    c10_pareto,        // idx 11, Ch 10 : Ton chemin, tes moyens & Pareto
    c11_offre,         // idx 12, Ch 11 : Architecture de l'Offre Irrésistible & Pricing
    c12_branding,      // idx 13, Ch 12 : Les Vrais Fondamentaux du Branding
    c13_logo,          // idx 14, Ch 13 : Ton Premier Logo & Studio Logo
    c14_chiffres,      // idx 15, Ch 14 : Financer sans la banque & Chiffres
    c15_outils,        // idx 16, Ch 15 : Les outils selon ton business
    c16_echec,         // idx 17, Ch 16 : Quand ça coince : surmonter l'échec
    c17_soc1,          // idx 18, Ch 17 : Réseaux Sociaux (1/3) — Psychologie & Algorithme
    c18_soc2,          // idx 19, Ch 18 : Réseaux Sociaux (2/3) — Tunnel & 6 Réseaux
    c19_soc3,          // idx 20, Ch 19 : Réseaux Sociaux (3/3) — Playbooks & Scripts
    c20_pitch,         // idx 21, Ch 20 : Le Pitch en Une Phrase
    c21_action,        // idx 22, Ch 21 : Tes 30 premiers jours d'action
    cConclusion        // idx 23, Conclusion
];

// Renumber and re-badge sequentially
perfectChronologicalSequence.forEach((ch, idx) => {
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
        totalChapters: perfectChronologicalSequence.length
    },
    chapters: perfectChronologicalSequence
};

const filePrefix = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie
 */

window.GUIDE_DATA = `;

fs.writeFileSync(filePath, filePrefix + JSON.stringify(outputData, null, 4) + ';\n', 'utf8');
console.log('Successfully written perfect chronological guide-tome1.js! Total chapters:', perfectChronologicalSequence.length);
