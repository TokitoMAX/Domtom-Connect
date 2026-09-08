const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
const raw = fs.readFileSync(filePath, 'utf8');

// Parse current GUIDE_DATA
eval(raw.replace('window.GUIDE_DATA =', 'global.GUIDE_DATA ='));
const oldChapters = global.GUIDE_DATA.chapters;

console.log('Original chapters count:', oldChapters.length);

// ------------------------------------------------------------------
// 1. CREATE NEW CHAPTER 6 : NICHE, DIFFÉRENCIATION & TRANSFORMATION
// ------------------------------------------------------------------
const chapterNicheContent = `
        <p class="lead-text">
            Le plus grand piège dans lequel tombent 9 débutants sur 10 est de penser que plus leur cible est large, plus ils ont de chances de vendre. <strong>C'est exactement l'inverse qui se produit.</strong>
        </p>
        <p>
            Quand tu tentes de parler à tout le monde, ton message devient tellement fade, tiède et impersonnel qu'il ne touche plus personne. Sur le terrain, <strong>les généralistes meurent de faim, pendant que les spécialistes imposent leurs tarifs sans négociation</strong>.
        </p>

        <!-- 1. LA PUISSANCE DE LA NICHE -->
        <div class="vs-container">
            <div class="vs-card bad">
                <h4><i class="fa-solid fa-xmark"></i> L'Approche Généraliste (La Guerre des Prix)</h4>
                <p style="font-size:0.88rem; color:#fca5a5; margin-bottom:8px;">« Je fais du coaching pour tout le monde » ou « Je vends des cosmétiques naturels »</p>
                <ul>
                    <li>Noyé au milieu de 10 000 concurrents identiques.</li>
                    <li>Obligé de baisser ses prix pour espérer intéresser quelqu'un.</li>
                    <li>Clients hésitants, difficiles et infidèles.</li>
                </ul>
            </div>
            <div class="vs-card good">
                <h4><i class="fa-solid fa-check"></i> L'Approche Spécialiste (L'Autorité Incontestable)</h4>
                <p style="font-size:0.88rem; color:#6ee7b7; margin-bottom:8px;">« J'accompagne les mères actives débordées à retrouver 1h par jour » ou « Soin réparateur anti-chute pour cheveux crépus défrisés »</p>
                <ul>
                    <li>Le prospect se dit immédiatement : <em>« C'est fait exactement pour moi ! »</em>.</li>
                    <li>Zéro comparaison possible avec les produits de masse.</li>
                    <li>Tarifs 2 à 4 fois plus élevés acceptés avec le sourire.</li>
                </ul>
            </div>
        </div>

        <div class="highlight-box" style="margin:24px 0;">
            <h4 style="margin:0 0 8px 0; color:#10b981;"><i class="fa-solid fa-crosshairs"></i> Les 3 Piliers d'une Niche Ultra-Rentable</h4>
            <ul style="margin:0; padding-left:20px; line-height:1.6; font-size:0.95rem;">
                <li><strong>1. Une douleur aiguë et urgente :</strong> Ton client n'a pas un simple "souhait", il a un problème qui le réveille à 3 heures du matin et qu'il veut régler au plus vite.</li>
                <li><strong>2. Un pouvoir d'achat avéré :</strong> Ne cible pas une population qui n'a pas un centime ou qui cherche uniquement la gratuité. Cible des personnes qui ont l'habitude d'investir pour leur bien-être, leur statut ou leur business.</li>
                <li><strong>3. Une accessibilité simple :</strong> Tu sais exactement où ces personnes se regroupent (groupes WhatsApp, comptes Instagram spécifiques, lieux physiques, réseaux professionnels).</li>
            </ul>
        </div>

        <!-- 2. VENDRE LA TRANSFORMATION, PAS LES CARACTÉRISTIQUES -->
        <h3>Ne Vends Jamais des Caractéristiques : Vends la TRANSFORMATION</h3>
        <p>
            Retiens cette phrase et grave-la dans ta tête : <strong>personne n'achète un produit ou un service, les gens achètent la personne qu'ils deviennent grâce à lui</strong>.
        </p>
        <p>
            Quand une coach vend un accompagnement pour les femmes, si elle dit <em>« j'ai un programme de 6 modules vidéo et 4 sessions Zoom de 45 minutes »</em>, elle vend des caractéristiques ennuyeuses qui demandent de l'effort. 
            En revanche, quand elle dit : <strong>« Je t'aide à te regarder dans le miroir avec une fierté totale, à ne plus baisser la tête en réunion et à poser tes limites sans culpabiliser »</strong>, elle vend une <strong>transformation émotionnelle profonde</strong>. Et là, le prix passe au second plan !
        </p>

        <div class="table-responsive" style="margin:20px 0;">
            <table class="data-table" style="width:100%;">
                <thead>
                    <tr>
                        <th style="width:40%;">Ce que le débutant vend (Caractéristiques)</th>
                        <th style="width:60%;">Ce que le client achète réellement (La Transformation)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Un pot de crème de 50ml aux huiles locales</td>
                        <td><strong>La confiance retrouvée</strong> : sortir sans fond de teint et recevoir des compliments sur l'éclat de son teint.</td>
                    </tr>
                    <tr>
                        <td>Une prestation de gestion des réseaux sociaux</td>
                        <td><strong>La sérénité d'esprit</strong> : 15 heures de libérées par semaine et un flux continu de clients qui réservent sans prospecter.</td>
                    </tr>
                    <tr>
                        <td>Un e-book de 80 pages sur la fiscalité</td>
                        <td><strong>Le soulagement & l'économie</strong> : savoir exactement comment économiser 2 500€ d'impôts légalement sans stress de contrôle.</td>
                    </tr>
                    <tr>
                        <td>Un plat à emporter dans une barquette</td>
                        <td><strong>Le réconfort & le plaisir</strong> : la saveur nostalgique du pays qui réchauffe le cœur après une dure matinée de labeur.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 3. LA DIFFÉRENCIATION ADAPTATIVE SELON TA VOIE -->
        <h3>La Différenciation Radicale : Te Rendre Incomparable</h3>
        <p>
            Comment éliminer la concurrence ? En ne jouant pas sur le même terrain qu'elle. Voici comment te différencier selon le modèle que tu as validé :
        </p>

        <div class="sector-adaptive-container" style="margin-top: 24px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">DIFFÉRENCIATION PAR VOIE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Le Levier : La Traçabilité Pure & La Fierté Culturelle</h4>
                <p>Face aux géants de la cosmétique industrielle ou de la fast-fashion importée, ta force est l'<strong>authenticité sans compromis</strong>.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Zéro chimie cachée</h4>
                        <p>Mise sur la formule ultra-courte (5 ingrédients nobles et lisibles max). Ce que les multinationales sont incapables de produire à grande échelle.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. L'histoire du producteur local</h4>
                        <p>Montre les mains qui récoltent la matière première aux Antilles ou en Afrique. L'achat devient un acte de soutien à l'économie locale.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. L'expérience sensorielle signature</h4>
                        <p>Un parfum naturel signature ou un packaging texturé qui procure une émotion dès l'ouverture de la boîte.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Le Levier : La Spécialisation Sectorielle & La Garantie Chiffrée</h4>
                <p>Ne sois jamais une "agence de communication généraliste". Sois le spécialiste incontournable d'une seule industrie.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Hyper-niche d'industrie</h4>
                        <p>Positionne-toi comme l'expert exclusif d'une profession (ex: l'acquisition pour les artisans du BTP, les dentistes, ou les hôteliers).</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. La maîtrise du terrain d'Outre-mer</h4>
                        <p>Tu connais les spécificités des DOM-TOM (taux d'octroi de mer, retards logistiques, culture WhatsApp). Une agence parisienne ne peut pas rivaliser.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. L'inversion du risque</h4>
                        <p>« Si vous n'avez pas vos 10 premiers prospects qualifiés sous 30 jours, nous travaillons gratuitement jusqu'à l'atteinte de l'objectif ».</p>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Le Levier : La Méthode Synthétique en 48h & Les Templates Prêts</h4>
                <p>Face aux millions de vidéos gratuites et confuses sur Internet, les gens paient pour la <strong>synthèse et le gain de temps</strong>.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. L'éradication du blabla</h4>
                        <p>Pas de formation de 40 heures. Un guide de 45 pages condensées où chaque paragraphe produit un résultat immédiat.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Les modèles copier-coller</h4>
                        <p>Fournis les tableurs Excel pré-remplis, les modèles Notion et les scripts mot pour mot que le client n'a plus qu'à adapter.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Le format de poche consultable partout</h4>
                        <p>Optimisé pour la lecture sur smartphone depuis son canapé ou dans les transports en commun.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Le Levier : Le Plat Signature Secret & La Cadence Express</h4>
                <p>En cuisine, la différenciation se joue sur le goût mémorable et la ponctualité chirurgicale du service.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. La sauce ou marinade secrète</h4>
                        <p>Un assaisonnement maison inimitable qui rend tes clients accros et qu'aucun fast-food industriel ne peut copier.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. La promesse "Servi en 3 minutes"</h4>
                        <p>Le travailleur du midi n'a que 45 minutes : lui garantir qu'il sera servi chaud et prêt en moins de 3 minutes sans attente.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. La fraîcheur du jour en circuit court</h4>
                        <p>Légumes et viandes achetés le matin même aux producteurs du coin, cuisinés devant le client.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Le Levier : La Curation Exclusivité & Le Conseil Styliste Privé</h4>
                <p>Ta valeur n'est pas de revendre des objets : c'est d'être le filtre d'or qui déniche les pépites rares que les gens n'ont pas le temps de chercher.</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. Séries ultra-limitées</h4>
                        <p>Jamais 100 fois la même pièce. Seulement 12 exemplaires par arrivage pour garantir à tes clientes qu'elles seront uniques.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Le conseil morphologie ou style</h4>
                        <p>Tu ne vends pas un vêtement, tu conseilles la cliente pour sublimer sa silhouette et booster son assurance.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>3. Le packaging cadeau soigné</h4>
                        <p>Papier de soie parfumé, petit mot manuscrit personnalisé dans chaque sachet pour émerveiller dès la réception.</p>
                    </div>
                </div>
            </div>
        </div>
`;

const chapterNicheExercise = {
    id: "ex_chapitre_6",
    title: "Ta Niche, Ta Transformation & Ton Facteur Unique",
    description: "Clarifie dès maintenant ton positionnement pour sortir définitivement de la concurrence par les prix :",
    fields: [
        {
            id: "niche_definition_precise",
            type: "textarea",
            label: "1. Quelle est ta sous-niche précise (Qui est ton client exclusif ?) :",
            placeholder: "Ex: 'Les femmes actives de 30-45 ans en Guadeloupe souffrant de fatigue chronique et cherchant à retrouver leur énergie avec des plantes locales.'"
        },
        {
            id: "transformation_etat_a",
            type: "textarea",
            label: "2. L'État A : Quelle est la douleur, la frustration ou l'épreuve quotidienne de ce client ?",
            placeholder: "Ex: 'Elle se réveille épuisée, a des sautes d'humeur, culpabilise de ne pas avoir de patience avec ses enfants et ne se reconnaît plus dans le miroir.'"
        },
        {
            id: "transformation_etat_b",
            type: "textarea",
            label: "3. L'État B : Quelle transformation émotionnelle ou concrète achète-t-elle avec sa carte bancaire ?",
            placeholder: "Ex: 'Se réveiller pleine d'entrain, retrouver un ventre plat apaisé, se sentir désirable et avoir une clarté mentale pour cartonner au travail.'"
        },
        {
            id: "facteur_differenciation_unique",
            type: "textarea",
            label: "4. Ton facteur de différenciation unique (Pourquoi toi et pas un concurrent ?) :",
            placeholder: "Ex: '100% de plantes récoltées en agro-écologie locale + accompagnement WhatsApp quotidien bienveillant sans régime privatif.'"
        }
    ]
};

const newChapter6 = {
    id: "chapitre-6",
    number: 6,
    badge: "Chapitre 6",
    title: "Trouver sa Niche Rentable, sa Différenciation & Vendre la Transformation",
    subtitle: "Pourquoi les généralistes meurent de faim et comment te rendre incomparable sur ton marché.",
    readTime: "7 min",
    content: chapterNicheContent,
    exercise: chapterNicheExercise
};

// ------------------------------------------------------------------
// 2. SOCIAL MEDIA CHAPTER 16 SPLIT INTO 3 FOCUSED CHAPTERS
// ------------------------------------------------------------------

// SUB-CHAPTER A : PSYCHOLOGY & ALGORITHM 2026 (LE MENTAL & LES RÈGLES SANS TABOU)
const ch16PsychologyContent = `
        <p class="lead-text">
            Mettons fin au plus grand mythe du marketing digital : <strong>avoir des milliers d'abonnés ne veut absolument pas dire avoir un business rentable</strong>.
        </p>
        <p>
            Poster des citations génériques ou copier des "hooks magiques" en espérant que quelqu'un achète par miracle est une perte de temps. En 2026, l'intelligence artificielle est capable de générer 50 000 posts par minute. Le public est devenu immunisé contre le sensationnalisme creux. Voici les <strong>vrais mécanismes</strong> algorithmiques et humains qui déclenchent la confiance et les ventes :
        </p>

        <!-- MASTERCLASS RÉSEAUX SOCIAUX 2026 : LA VRAIE VÉRITÉ DU TERRAIN -->
        <div class="social-masterclass-card">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <span style="background:rgba(16,185,129,0.2); color:#10b981; font-weight:800; font-size:0.75rem; padding:4px 10px; border-radius:6px; text-transform:uppercase; letter-spacing:0.5px;">
                    <i class="fa-solid fa-shield-halved"></i> Masterclass Réseaux 2026
                </span>
                <span style="color:#94a3b8; font-size:0.85rem;">Fini les théories creuses et les accroches magiques</span>
            </div>
            <h3 style="font-size:1.45rem; color:#ffffff; margin:0 0 10px 0;">
                Au-Delà du "Hook" : Comment Fonctionnent Vraiment les Algorithmes et l'Esprit Humain
            </h3>
            <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin:0 0 18px 0;">
                Pour percer aujourd'hui, tu n'as pas besoin d'être un influenceur. Tu dois comprendre les <strong>4 lois fondamentales</strong> de l'attention et de la psychologie humaine :
            </p>

            <div class="social-pillars-grid">
                <!-- Pilier 1 : L'Échantillon des 200 & Signal DM -->
                <div class="social-pillar-item">
                    <div class="social-pillar-icon"><i class="fa-solid fa-chart-line"></i></div>
                    <h4>1. L'Échantillon des 200 & Le Signal du Partage en DM</h4>
                    <p>
                        Quand tu publies une vidéo, l'algorithme ne regarde pas ton audience passée : il la diffuse d'abord à un panel de <strong>200 personnes</strong> qui ne te connaissent pas. Si 65% regardent la vidéo (taux de complétion), il l'élargit à 2 000, puis à 20 000. Mais le signal suprême en 2026, c'est le <strong>partage en message privé (DM / WhatsApp)</strong> : quand quelqu'un envoie ta vidéo à un ami, l'algorithme considère que ton contenu a une valeur émotionnelle ou pratique inestimable et déploie le boost viral !
                    </p>
                </div>

                <!-- Pilier 2 : L'Incarnation Humaine -->
                <div class="social-pillar-item">
                    <div class="social-pillar-icon"><i class="fa-solid fa-user-check"></i></div>
                    <h4>2. L'Incarnation : Les Gens Achètent à des Humains, Pas à des Logos</h4>
                    <p>
                        Les pages corporate polies et froides sont mortes. Ce qui déclenche l'achat, c'est ton <strong>visage</strong>, tes <strong>coulisses réelles</strong> et ta vulnérabilité maîtrisée. Montre tes galères de livraison, tes tests ratés en cuisine, tes doutes avant le lancement. Un compte artisanal avec <strong>700 abonnés ultra-engagés</strong> qui ont confiance en toi vendra toujours 5 fois plus qu'un compte anonyme de 30 000 followers fantômes !
                    </p>
                </div>

                <!-- Pilier 3 : Le Social SEO -->
                <div class="social-pillar-item">
                    <div class="social-pillar-icon"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
                    <h4>3. Le Référencement Sémantique (Social SEO)</h4>
                    <p>
                        TikTok, Instagram et YouTube sont devenus les moteurs de recherche de la nouvelle génération. L'IA des plateformes <strong>écoute chaque mot prononcé à l'audio</strong> et analyse tous les sous-titres incrustés à l'écran. Ne cherche pas des hashtags obscurs : prononce et écris distinctement la question exacte que tape ton client idéal dans sa barre de recherche (ex: <em>« Comment créer sa boîte en Martinique sans capital »</em>).
                    </p>
                </div>

                <!-- Pilier 4 : Le Vocal DM 15s -->
                <div class="social-pillar-item">
                    <div class="social-pillar-icon"><i class="fa-solid fa-microphone-lines"></i></div>
                    <h4>4. Le Vrai Social Selling : Le Vocal DM de 15 Secondes</h4>
                    <p>
                        Ne balance jamais un lien d'achat froid en commentaire ou dans un message copié-collé impersonnel. Dès qu'un prospect commente ton contenu, invite-le en message privé pour répondre à sa question. Et là, envoie-lui une <strong>note vocale spontanée et chaleureuse de 15 secondes</strong> : <em>« Salut Johan ! J'ai vu ta question sur la livraison en Guadeloupe, c'est top que tu te lances... »</em>. Le vocal brise toute barrière de méfiance et transforme un inconnu en client acquis.
                    </p>
                </div>
            </div>

            <div class="algorithm-truth-box" style="margin-top:20px;">
                <strong><i class="fa-solid fa-lightbulb"></i> La Règle d'Or de Domtom Connect :</strong> 
                Les réseaux sociaux ne sont pas un panneau publicitaire froid : ce sont des accélérateurs de relations humaines. Traite chaque personne qui t'écrit comme si elle était en face de toi dans ta boutique.
            </div>
        </div>
`;

const ch16PsychologyExercise = {
    id: "ex_chapitre_17",
    title: "Ton Diagnostic d'Incarnation & de Référencement Social",
    description: "Pose les fondations de ton autorité humaine avant de poster la moindre vidéo :",
    fields: [
        {
            id: "social_visage_incarnation",
            type: "textarea",
            label: "1. Comment vas-tu incarner ton projet en vidéo (ton visage, tes mains, ta voix) ?",
            placeholder: "Ex: 'Je filme mes mains en train de fabriquer les produits avec ma voix en voix-off, et je prends la parole face caméra une fois par semaine pour raconter une anecdote de cliente.'"
        },
        {
            id: "social_seo_requete_cible",
            type: "text",
            label: "2. La question exacte que tape ton client cible dans la barre de recherche (Social SEO) :",
            placeholder: "Ex: 'Comment faire repousser ses tempes dégarnies naturellement aux Antilles'"
        },
        {
            id: "social_partage_dm_declencheur",
            type: "textarea",
            label: "3. Quelle information de haute valeur vas-tu donner pour que les gens l'envoient en DM à un ami ?",
            placeholder: "Ex: 'La liste des 3 pièges toxiques cachés dans 90% des soins capillaires importés.'"
        },
        {
            id: "social_vocal_dm_phrase_amorce",
            type: "textarea",
            label: "4. Ta phrase d'accroche pour ton premier vocal DM de 15 secondes :",
            placeholder: "« Salut [Prénom], merci pour ton commentaire ! Je voulais te faire un petit vocal rapide pour te dire que ton projet est super inspirant... »"
        }
    ]
};

// SUB-CHAPTER B : LE TUNNEL TOFU-MOFU-BOFU & L'ÉCHIQUIER DES 6 RÉSEAUX
const ch17FunnelContent = `
        <p class="lead-text">
            Un compte qui publie sans stratégie d'entonnoir est comme un magasin sans porte d'entrée : beaucoup de bruit, mais zéro encaissement en caisse.
        </p>
        <p>
            Tout système d'acquisition rentable sur les réseaux fonctionne selon un <strong>entonnoir en 3 étages</strong> :
        </p>

        <!-- 1. TOFU - MOFU - BOFU Acquisition Funnel -->
        <div class="social-funnel-grid">
            <div class="social-funnel-card">
                <div class="funnel-stage-header">
                    <span class="funnel-step-badge">Étape 1</span>
                    <span class="funnel-stage-name">Attraction</span>
                </div>
                <h4 class="funnel-card-title">TOFU — Top of Funnel</h4>
                <p class="funnel-card-desc">Toucher des personnes qui ne te connaissent pas encore grâce aux formats à forte portée algorithmique.</p>
                <div class="funnel-formats-box">
                    <div class="format-tag"><i class="fa-solid fa-play"></i> Reels / TikToks courts (< 30s)</div>
                    <div class="format-tag"><i class="fa-solid fa-layer-group"></i> Carrousels de valeur à sauvegarder</div>
                </div>
                <div class="funnel-kpi">Métrique clé : Partages en DM & Visionnages complets</div>
            </div>

            <div class="social-funnel-card">
                <div class="funnel-stage-header">
                    <span class="funnel-step-badge">Étape 2</span>
                    <span class="funnel-stage-name">Confiance</span>
                </div>
                <h4 class="funnel-card-title">MOFU — Middle of Funnel</h4>
                <p class="funnel-card-desc">Créer une relation d'intimité, montrer les coulisses et prouver ton expertise et ton honnêteté.</p>
                <div class="funnel-formats-box">
                    <div class="format-tag"><i class="fa-solid fa-camera"></i> Stories quotidiennes sans filtre</div>
                    <div class="format-tag"><i class="fa-solid fa-comment-dots"></i> Réponses aux questions en vidéo</div>
                    <div class="format-tag"><i class="fa-solid fa-envelope"></i> Newsletter ou Canal Broadcast</div>
                </div>
                <div class="funnel-kpi">Métrique clé : Réponses en Story & Taux d'ouverture</div>
            </div>

            <div class="social-funnel-card">
                <div class="funnel-stage-header">
                    <span class="funnel-step-badge">Étape 3</span>
                    <span class="funnel-stage-name">Conversion</span>
                </div>
                <h4 class="funnel-card-title">BOFU — Bottom of Funnel</h4>
                <p class="funnel-card-desc">Déclencher l'acte d'achat par la conversation directe et la proposition d'une offre irrésistible.</p>
                <div class="funnel-formats-box">
                    <div class="format-tag"><i class="fa-solid fa-paper-plane"></i> Closing chaleureux par message privé</div>
                    <div class="format-tag"><i class="fa-brands fa-whatsapp"></i> Catalogue WhatsApp & Liens de paiement</div>
                    <div class="format-tag"><i class="fa-solid fa-phone"></i> Diagnostic 15 min au téléphone</div>
                </div>
                <div class="funnel-kpi">Métrique clé : Ventes réelles & Taux de conversion</div>
            </div>
        </div>

        <!-- 2. L'ÉCHIQUIER INTERACTIF DES 6 RÉSEAUX -->
        <h3>L'Échiquier des 6 Réseaux Sociaux : Choisis Ton Canal Maître</h3>
        <p>
            Vouloir être partout à la fois quand on est seul est le moyen le plus sûr de faire un burnout en 3 semaines. <strong>Choisis un seul Canal Maître</strong>, maîtrise-le pendant 90 jours, puis déploie les autres.
        </p>

        <div class="matrix-6-networks-container">
            <div class="matrix-networks-nav">
                <button type="button" class="matrix-nav-btn active" data-target-network="instagram">
                    <i class="fa-brands fa-instagram"></i> Instagram
                </button>
                <button type="button" class="matrix-nav-btn" data-target-network="tiktok">
                    <i class="fa-brands fa-tiktok"></i> TikTok
                </button>
                <button type="button" class="matrix-nav-btn" data-target-network="whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
                <button type="button" class="matrix-nav-btn" data-target-network="youtube">
                    <i class="fa-brands fa-youtube"></i> YouTube
                </button>
                <button type="button" class="matrix-nav-btn" data-target-network="linkedin">
                    <i class="fa-brands fa-linkedin"></i> LinkedIn
                </button>
                <button type="button" class="matrix-nav-btn" data-target-network="facebook">
                    <i class="fa-brands fa-facebook"></i> Facebook
                </button>
            </div>

            <!-- Instagram Panel -->
            <div class="matrix-card-panel active" data-network="instagram">
                <div class="matrix-card-header">
                    <div class="network-icon-box ig"><i class="fa-brands fa-instagram"></i></div>
                    <div>
                        <h4>Instagram : Le Roi de la Relation & du Closing en DM</h4>
                        <span class="network-target-badge">Idéal pour : Produits Physiques, Beauté, Mode, Coaching, Food & Créateurs</span>
                    </div>
                </div>
                <div class="network-details-grid">
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-check-double" style="color:#10b981;"></i> 2 Atouts Majeurs</h5>
                        <ul>
                            <li><strong>Écosystème complet :</strong> Les Reels découvrent de nouvelles personnes, les Stories chauffent la relation, les DMs ferment la vente.</li>
                            <li><strong>Messagerie ultra-puissante :</strong> Les vocaux en DM convertissent à plus de 35% chez les abonnés engagés.</li>
                        </ul>
                    </div>
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 2 Pièges Mortels</h5>
                        <ul>
                            <li>Passer 4h sur la perfection esthétique d'un feed qui ne génère aucune conversation.</li>
                            <li>Ne pas publier de stories pendant plusieurs jours (perte immédiate de visibilité auprès des abonnés).</li>
                        </ul>
                    </div>
                </div>
                <div class="network-domtom-rule">
                    <strong>Règle d'or Domtom Connect :</strong> Sur Instagram, 80% de ton chiffre d'affaires se fait dans les messages privés, pas sous tes photos publiques. Provoque toujours une discussion.
                </div>
            </div>

            <!-- TikTok Panel -->
            <div class="matrix-card-panel" data-network="tiktok">
                <div class="matrix-card-header">
                    <div class="network-icon-box tt"><i class="fa-brands fa-tiktok"></i></div>
                    <div>
                        <h4>TikTok : La Machine à Notoriété & Storytelling Brut</h4>
                        <span class="network-target-badge">Idéal pour : Découverte rapide, Produits tangibles, Street-Food, Vulgarisation & Jeune public</span>
                    </div>
                </div>
                <div class="network-details-grid">
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-check-double" style="color:#10b981;"></i> 2 Atouts Majeurs</h5>
                        <ul>
                            <li><strong>Algorithme méritocratique :</strong> Une vidéo avec 0 abonné peut faire 150 000 vues si la rétention dépasse 70%.</li>
                            <li><strong>Prime au naturel :</strong> Moins la vidéo ressemble à une pub, plus elle cartonne (coulisses, erreurs, humour).</li>
                        </ul>
                    </div>
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 2 Pièges Mortels</h5>
                        <ul>
                            <li>Obtenir des millions de vues de divertissement sans jamais rediriger vers son lien en bio ou son catalogue.</li>
                            <li>Abandonner après 10 vidéos qui font 200 vues (l'algorithme teste votre constance sur 30 jours minimum).</li>
                        </ul>
                    </div>
                </div>
                <div class="network-domtom-rule">
                    <strong>Règle d'or Domtom Connect :</strong> TikTok apporte le flux d'attention brute ; capture immédiatement ce trafic vers WhatsApp ou ton site avant que l'utilisateur ne zappe au suivant.
                </div>
            </div>

            <!-- WhatsApp Panel -->
            <div class="matrix-card-panel" data-network="whatsapp">
                <div class="matrix-card-header">
                    <div class="network-icon-box wa"><i class="fa-brands fa-whatsapp"></i></div>
                    <div>
                        <h4>WhatsApp Business : L'Arme Absolue de Conversion Outre-Mer</h4>
                        <span class="network-target-badge">Idéal pour : Toute entreprise ciblant les Antilles, la Guyane, la Réunion et l'Afrique</span>
                    </div>
                </div>
                <div class="network-details-grid">
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-check-double" style="color:#10b981;"></i> 2 Atouts Majeurs</h5>
                        <ul>
                            <li><strong>Taux d'ouverture record :</strong> Plus de 95% des messages WhatsApp sont ouverts dans les 15 minutes.</li>
                            <li><strong>Le canal de confiance n°1 :</strong> En Outre-Mer, un client préfère mille fois commander par message WhatsApp que sur un site web froid.</li>
                        </ul>
                    </div>
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 2 Pièges Mortels</h5>
                        <ul>
                            <li>Spammer des promotions non sollicitées en messages de masse (risque de blocage définitif du numéro).</li>
                            <li>Ne pas configurer son profil professionnel (catalogue d'offres à jour, horaires, message d'absence).</li>
                        </ul>
                    </div>
                </div>
                <div class="network-domtom-rule">
                    <strong>Règle d'or Domtom Connect :</strong> Utilise les Statuts WhatsApp chaque matin : c'est la vitrine la plus puissante pour vendre le midi même à ta communauté locale.
                </div>
            </div>

            <!-- YouTube Panel -->
            <div class="matrix-card-panel" data-network="youtube">
                <div class="matrix-card-header">
                    <div class="network-icon-box yt"><i class="fa-brands fa-youtube"></i></div>
                    <div>
                        <h4>YouTube : L'Autorité Pérenne & Moteur de Recherche</h4>
                        <span class="network-target-badge">Idéal pour : Produits Digitaux, Formations, Experts, Tutos longue durée & Vlogs</span>
                    </div>
                </div>
                <div class="network-details-grid">
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-check-double" style="color:#10b981;"></i> 2 Atouts Majeurs</h5>
                        <ul>
                            <li><strong>Durée de vie des contenus :</strong> Une vidéo publiée il y a 3 ans continue de générer des clients chaque jour sur Google et YouTube.</li>
                            <li><strong>Niveau de confiance maximal :</strong> Un spectateur qui regarde 15 minutes de ta vidéo est déjà à 90% prêt à acheter.</li>
                        </ul>
                    </div>
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 2 Pièges Mortels</h5>
                        <ul>
                            <li>Négliger le titre et la miniature (si personne ne clique, le meilleur contenu du monde reste invisible).</li>
                            <li>Vouloir un montage hollywoodien dès la première vidéo : clarté du son et de l'explication suffisent à 100%.</li>
                        </ul>
                    </div>
                </div>
                <div class="network-domtom-rule">
                    <strong>Règle d'or Domtom Connect :</strong> 1 vidéo pilier sur YouTube par mois nourrit tous tes Shorts, tes Reels et ta légitimité pendant des années.
                </div>
            </div>

            <!-- LinkedIn Panel -->
            <div class="matrix-card-panel" data-network="linkedin">
                <div class="matrix-card-header">
                    <div class="network-icon-box li"><i class="fa-brands fa-linkedin"></i></div>
                    <div>
                        <h4>LinkedIn : Le Pipeline B2B & Décideurs</h4>
                        <span class="network-target-badge">Idéal pour : Prestations B2B, Consultants, Formateurs Pro, Cabinets & Recrutement</span>
                    </div>
                </div>
                <div class="network-details-grid">
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-check-double" style="color:#10b981;"></i> 2 Atouts Majeurs</h5>
                        <ul>
                            <li><strong>Accès direct aux décideurs :</strong> Contacte directement les directeurs généraux et chefs d'entreprise locaux sans filtre de secrétaire.</li>
                            <li><strong>Paniers moyens élevés :</strong> Un seul contrat signé sur LinkedIn rapporte souvent entre 1 500€ et 10 000€.</li>
                        </ul>
                    </div>
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 2 Pièges Mortels</h5>
                        <ul>
                            <li>Envoyer un pitch de vente copié-collé agressif dès la première seconde de mise en relation.</li>
                            <li>Écrire des textes impersonnels sans jamais raconter de cas clients concrets ou de leçons de terrain vécues.</li>
                        </ul>
                    </div>
                </div>
                <div class="network-domtom-rule">
                    <strong>Règle d'or Domtom Connect :</strong> Partage tes études de cas sans langue de bois : problème client, erreur courante, ta solution, résultat mesurable.
                </div>
            </div>

            <!-- Facebook Panel -->
            <div class="matrix-card-panel" data-network="facebook">
                <div class="matrix-card-header">
                    <div class="network-icon-box fb"><i class="fa-brands fa-facebook"></i></div>
                    <div>
                        <h4>Facebook : Les Groupes Locaux & Bouche-à-Oreille</h4>
                        <span class="network-target-badge">Idéal pour : Services locaux de proximité, Restauration, Événementiel & Marché 35+ ans</span>
                    </div>
                </div>
                <div class="network-details-grid">
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-check-double" style="color:#10b981;"></i> 2 Atouts Majeurs</h5>
                        <ul>
                            <li><strong>Puissance des groupes communautaires :</strong> Les groupes d'entraide et petites annonces locales réunissent des dizaines de milliers de résidents actifs.</li>
                            <li><strong>Partage viral familial :</strong> Les recommandations se transmettent très vite entre familles et cercles d'amis locaux.</li>
                        </ul>
                    </div>
                    <div class="detail-block">
                        <h5><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> 2 Pièges Mortels</h5>
                        <ul>
                            <li>Créer une page Facebook vide et attendre les likes sans animer les discussions dans les groupes existants.</li>
                            <li>Spammer les groupes sans demander l'accord des administrateurs ou sans apporter d'abord un vrai conseil utile.</li>
                        </ul>
                    </div>
                </div>
                <div class="network-domtom-rule">
                    <strong>Règle d'or Domtom Connect :</strong> Interviens dans les groupes pour répondre en expert aux questions des gens, ta signature fera le reste.
                </div>
            </div>
        </div>

        <!-- 3. LA CONSTANCE SANS BURNOUT : BATCHING & RECYCLAGE -->
        <h3>La Constance sans Burnout : Le Système du Dimanche</h3>
        <p>
            Ne te réveille jamais le matin avec l'angoisse de te demander <em>« qu'est-ce que je poste aujourd'hui ? »</em>. Voici le système simple en 2 règles :
        </p>
        <div class="social-pillars-grid">
            <div class="social-pillar-item">
                <div class="social-pillar-icon"><i class="fa-solid fa-clock"></i></div>
                <h4>La Session de Batching (2 Heures par Semaine)</h4>
                <p>Bloque 2 heures le dimanche ou le lundi matin. Filme 4 vidéos courtes d'affilée dans les mêmes conditions d'éclairage et programme-les. Tu as sécurisé ta semaine entière en un seul bloc de concentration !</p>
            </div>
            <div class="social-pillar-item">
                <div class="social-pillar-icon"><i class="fa-solid fa-arrows-spin"></i></div>
                <h4>La Règle 1 Idée = 3 Formats</h4>
                <p>Une idée forte de ta semaine devient : 1 vidéo courte dynamique pour l'attraction (TOFU), 1 carrousel synthétique à sauvegarder pour la confiance (MOFU), et 2 stories de coulisses pour la conversion (BOFU).</p>
            </div>
        </div>
`;

const ch17FunnelExercise = {
    id: "ex_chapitre_18",
    title: "Ton Canal Maître & Ton Planning Anti-Burnout",
    description: "Sélectionne ton terrain de jeu principal et verrouille ta routine d'exécution :",
    fields: [
        {
            id: "canal_maitre_choisi",
            type: "text",
            label: "1. Quel est ton UNIQUE Canal Maître pour les 90 prochains jours ?",
            placeholder: "Ex: 'Instagram (Reels + Stories) avec redirection vers WhatsApp Business.'"
        },
        {
            id: "rythme_hebdo_tofu",
            type: "text",
            label: "2. Ta cadence hebdomadaire d'attraction (TOFU) :",
            placeholder: "Ex: '3 Reels par semaine publiés le Mardi, Jeudi et Samedi à 18h30.'"
        },
        {
            id: "rituel_quotidien_mofu",
            type: "textarea",
            label: "3. Ton rituel quotidien de confiance (MOFU) :",
            placeholder: "Ex: 'Publier 3 à 4 stories chaque jour : le matin l'atelier/bureau, le midi une question aux abonnés, l'après-midi l'envoi des commandes.'"
        },
        {
            id: "creneau_batching_bloque",
            type: "text",
            label: "4. Ton créneau horaire hebdomadaire réservé pour le tournage (Batching) :",
            placeholder: "Ex: 'Le dimanche de 9h00 à 11h30 (téléphone chargé, lumière naturelle, 4 vidéos enregistrées).'"
        }
    ]
};

// SUB-CHAPTER C : STRATÉGIES PAR SECTEUR & SCRIPTS DE CLOSING EN DM
// (Uses the sector adaptive card we built + the 5 network blueprints & scripts!)
// We retrieve old Chapter 17 content (which contains the 5 blueprints) and prepend the adaptive sector strategy container!
const oldCh17 = oldChapters.find(c => c.id === 'chapitre-17');

// In old ch16, we had the adaptive sector strategies. Let's make that the hero of Chapter 19!
const ch18PlaybooksContent = `
        <p class="lead-text">
            Chaque modèle de business a sa propre dynamique d'acquisition. Un restaurateur ne vend pas comme une agence B2B, et un créateur d'e-books ne communique pas comme une boutique physique.
        </p>
        <p>
            Voici ton <strong>playbook d'acquisition adapté à la Voie que tu as sélectionnée</strong>, suivi des <strong>scripts de closing mot pour mot</strong> pour convertir tes prospects en clients sans être insistant :
        </p>

        <!-- STRATÉGIE RÉSEAUX ADAPTATIVE SELON LA VOIE CHOISIE -->
        <div class="sector-adaptive-container" style="margin-top: 24px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">STRATÉGIE RÉSEAUX SUR-MESURE SELON TA VOIE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-video" style="color:#10b981;"></i> Playbook d'Acquisition : TikTok + Instagram Reels + WhatsApp Catalog</h4>
                <p>Pour un produit tangible, ton contenu doit faire vivre les sens et prouver la qualité artisanale ou le résultat avant/après.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Format Roi (TOFU)</span>
                        <div class="adaptive-offer-name">L'Unboxing & Les Coulisses de Fabrication</div>
                        <div class="adaptive-offer-desc">Filme l'emballage minutieux d'une commande réelle, la texture du produit en gros plan, ou le son ASMR du packaging.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Montre le prénom du client sur le carton</li>
                            <li><i class="fa-solid fa-check"></i> Raconte l'histoire de la matière première locale</li>
                            <li><i class="fa-solid fa-check"></i> Déclencheur de partages massifs en DM</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Création de Confiance (MOFU)</span>
                        <div class="adaptive-offer-name">Les Retours Clients Spontanés en Stories</div>
                        <div class="adaptive-offer-desc">Reposte les captures d'écran des messages WhatsApp de clientes satisfaites avec leurs photos sans filtre.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Preuve sociale 100% authentique</li>
                            <li><i class="fa-solid fa-check"></i> Boîte à questions : « Quelle est ta routine actuelle ? »</li>
                            <li><i class="fa-solid fa-check"></i> Stories à la Une : « Avis & Résultats »</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Conversion & Vente (BOFU)</span>
                        <div class="adaptive-offer-name">Le Lien Catalogue WhatsApp Direct</div>
                        <div class="adaptive-offer-desc">Appel à l'action clair : « Envoie-moi le mot COFFRET en DM ou sur WhatsApp pour recevoir ton cadeau de bienvenue ».</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Clôture de la vente par message vocal chaleureux</li>
                            <li><i class="fa-solid fa-check"></i> Envoi du lien de paiement sécurisé direct</li>
                            <li><i class="fa-solid fa-check"></i> Zéro panier abandonné dans la nature</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-briefcase" style="color:#10b981;"></i> Playbook d'Acquisition : LinkedIn + Carrousels Expertise + Diagnostic 15 min</h4>
                <p>En B2B, personne n'achète une prestation suite à une danse TikTok. Tu dois démontrer ta compétence chirurgicale et ton sérieux.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Format Roi (TOFU)</span>
                        <div class="adaptive-offer-name">L'Étude de Cas Chiffrée (Avant / Après)</div>
                        <div class="adaptive-offer-desc">Décortique publiquement comment tu as résolu un problème complexe pour un dirigeant ou client local.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Structure : Problème initial → Erreur commise → Ta solution → Résultat chiffré</li>
                            <li><i class="fa-solid fa-check"></i> Ton posé, analytique et bienveillant</li>
                            <li><i class="fa-solid fa-check"></i> Attire des prospects qualifiés avec du budget</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Création de Confiance (MOFU)</span>
                        <div class="adaptive-offer-name">Le Retour d'Expérience sans Langue de Bois</div>
                        <div class="adaptive-offer-desc">Partage tes prises de position sur ton secteur, tes constats sur le marché caribéen/africain et tes principes de travail.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Élimine les prospects toxiques ou non alignés</li>
                            <li><i class="fa-solid fa-check"></i> Crée une relation d'égal à égal avec les décideurs</li>
                            <li><i class="fa-solid fa-check"></i> Positionne ta méthode comme la seule référence</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Conversion & Vente (BOFU)</span>
                        <div class="adaptive-offer-name">L'Audit Flash 15 min Offert en DM</div>
                        <div class="adaptive-offer-desc">Quand un dirigeant interagit avec ton post, propose-lui un diagnostic flash de 15 minutes sans engagement.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Prise de RDV sur ton lien Cal.com direct</li>
                            <li><i class="fa-solid fa-check"></i> Pendant l'appel : 80% d'écoute, 20% de prescription</li>
                            <li><i class="fa-solid fa-check"></i> Taux de transformation en contrat signé > 35%</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-laptop-code" style="color:#10b981;"></i> Playbook d'Acquisition : Carrousels Sauvegardables + Lead Magnet Offert</h4>
                <p>Dans le digital, la métrique maîtresse est le taux d'enregistrement (sauvegarde) de tes posts et le taux de téléchargement de ton guide offert.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Format Roi (TOFU)</span>
                        <div class="adaptive-offer-name">Le Carrousel Méthodologique 8 Slides</div>
                        <div class="adaptive-offer-desc">Un guide visuel pas-à-pas condensé si dense en valeur que le lecteur est obligé de le sauvegarder pour plus tard.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Titre percutant : « 5 étapes pour [Résultat] »</li>
                            <li><i class="fa-solid fa-check"></i> Richesse en schémas et puces actionnables</li>
                            <li><i class="fa-solid fa-check"></i> L'algorithme adore les sauvegardes (signe de haute valeur)</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Création de Confiance (MOFU)</span>
                        <div class="adaptive-offer-name">L'E-book / Template Offert (Lead Magnet)</div>
                        <div class="adaptive-offer-desc">« Commente GUIDE sous ce post pour recevoir gratuitement la checklist PDF complète en DM ».</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Automatisation simple par message privé</li>
                            <li><i class="fa-solid fa-check"></i> Capture de l'adresse email de ton prospect</li>
                            <li><i class="fa-solid fa-check"></i> Démonstration éclatante de ta générosité d'expert</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Conversion & Vente (BOFU)</span>
                        <div class="adaptive-offer-name">La Séquence Email de Bienvenue (4 Emails)</div>
                        <div class="adaptive-offer-desc">Dans les 5 jours qui suivent le téléchargement, ton prospect reçoit 4 emails racontant ton parcours et lui proposant le bundle complet avec une réduction temporaire.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Machine de vente qui tourne 24h/24 en pilote automatique</li>
                            <li><i class="fa-solid fa-check"></i> Ventes régulières même quand tu ne postes pas</li>
                            <li><i class="fa-solid fa-check"></i> Taux de conversion email moyen : 3% à 8%</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-utensils" style="color:#10b981;"></i> Playbook d'Acquisition : Stories "Coup de Feu" + Salivation Visuelle</h4>
                <p>En cuisine, la vente est 100% émotionnelle et instinctive. On achète avec les yeux, le son de la cuisson et la peur de rater le plat du jour.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Format Roi (TOFU)</span>
                        <div class="adaptive-offer-name">Le Gros Plan Cuisson & Le Son du Grill (Reels)</div>
                        <div class="adaptive-offer-desc">Courtes vidéos de 7 secondes montrant la découpe du pain croustillant, le fromage qui fond ou la marinade qui frémit.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Qualité audio et lumière naturelle soignées</li>
                            <li><i class="fa-solid fa-check"></i> Musique entraînante et sous-titres simples</li>
                            <li><i class="fa-solid fa-check"></i> Déclenche une envie irrésistible de manger immédiatement</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Création de Confiance (MOFU)</span>
                        <div class="adaptive-offer-name">Les Stories en Temps Réel à 10h45</div>
                        <div class="adaptive-offer-desc">Montre les coulisses du matin : la découpe des légumes frais du marché, la cuisson en cours et l'annonce du menu du jour.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Crée l'anticipation juste avant l'heure de la faim</li>
                            <li><i class="fa-solid fa-check"></i> Sonde ton audience : « Qui sera là ce midi ? »</li>
                            <li><i class="fa-solid fa-check"></i> Prouve la fraîcheur absolue de tes produits</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Conversion & Vente (BOFU)</span>
                        <div class="adaptive-offer-name">L'Annonce de Rupture & Précommande WhatsApp</div>
                        <div class="adaptive-offer-desc">« Plus que 12 portions de notre Colombo Signature disponibles ce midi ! Précommandez votre barquette sur WhatsApp en 1 clic ».</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Rareté et urgence réelles qui vident tes stocks avant 13h00</li>
                            <li><i class="fa-solid fa-check"></i> Récupération du numéro de mobile pour les promos hebdo</li>
                            <li><i class="fa-solid fa-check"></i> 0 invendu et trésorerie sécurisée le matin même</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-shop" style="color:#10b981;"></i> Playbook d'Acquisition : Live Déballage de Cartons + Club VIP WhatsApp</h4>
                <p>En boutique et revente, ton rôle est d'être le dénicheur de pépites de ta communauté et de créer un sentiment de privilège d'accès.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Format Roi (TOFU)</span>
                        <div class="adaptive-offer-name">Le Live / Réel Déballage de Nouveautés</div>
                        <div class="adaptive-offer-desc">« On ouvre les cartons du nouvel arrivage ensemble ! Dites-moi en commentaire votre pièce préférée ».</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Effet découverte et excitation du cadeau surprise</li>
                            <li><i class="fa-solid fa-check"></i> Forte interaction en direct avec les spectateurs</li>
                            <li><i class="fa-solid fa-check"></i> Chaque article montré est réservé dans les commentaires</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Création de Confiance (MOFU)</span>
                        <div class="adaptive-offer-name">Les Sondages Décisionnels en Story</div>
                        <div class="adaptive-offer-desc">« J'hésite entre ces deux coloris pour la prochaine commande chez mon fournisseur : vous préférez le terracotta ou le sauge ? ».</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Tes abonnés deviennent co-créateurs de ta boutique</li>
                            <li><i class="fa-solid fa-check"></i> Tu valides la demande avant même de payer la commande fournisseur</li>
                            <li><i class="fa-solid fa-check"></i> Engagement record sur ton compte</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Conversion & Vente (BOFU)</span>
                        <div class="adaptive-offer-name">Le Groupe WhatsApp VIP "Avant-Première"</div>
                        <div class="adaptive-offer-desc">Accès exclusif 24h avant tout le monde aux nouveaux arrivages et aux soldes privées pour tes 100 meilleures clientes.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Taux d'ouverture WhatsApp > 95% (contre 20% par email)</li>
                            <li><i class="fa-solid fa-check"></i> 50% de tes nouvelles pièces sont vendues avant même d'être exposées en vitrine</li>
                            <li><i class="fa-solid fa-check"></i> Fidélité absolue et bouche-à-oreille local garanti</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <h3 style="margin-top:36px;">Les 5 Blueprints Opérationnels & Scripts de Closing par Réseau</h3>
        <p>
            Sélectionne ci-dessous le canal pour afficher ton tunnel étape par étape et ton script de conversion mot pour mot :
        </p>
` + (oldCh17 ? oldCh17.content : '');

// ------------------------------------------------------------------
// RECONSTRUCT COMPLETE CHAPTER LIST WITH SEQUENTIAL NUMBERS
// ------------------------------------------------------------------
const updatedChapters = [];

// Cover (number 0)
updatedChapters.push(oldChapters[0]);

// Avant-propos (number 1)
updatedChapters.push(oldChapters[1]);

// Chapters 1 to 5
for (let i = 2; i <= 6; i++) {
    const ch = oldChapters[i];
    ch.number = i - 1;
    ch.badge = `Chapitre ${ch.number}`;
    updatedChapters.push(ch);
}

// Insert NEW Chapter 6 (Niche, Différenciation & Transformation)
newChapter6.number = 6;
newChapter6.badge = "Chapitre 6";
updatedChapters.push(newChapter6);

// Old Chapters 6 to 15 become Chapters 7 to 16
for (let i = 7; i <= 16; i++) {
    const ch = oldChapters[i];
    const newNum = i;
    ch.number = newNum;
    ch.badge = `Chapitre ${newNum}`;
    ch.id = `chapitre-${newNum}`;
    if (ch.exercise) {
        ch.exercise.id = `ex_chapitre_${newNum}`;
    }
    updatedChapters.push(ch);
}

// Social Media Chapter 17 (Psychology & 2026 Algorithm)
updatedChapters.push({
    id: "chapitre-17",
    number: 17,
    badge: "Chapitre 17",
    title: "Réseaux Sociaux (1/3) — Psychologie, Algorithme 2026 & Incarnation",
    subtitle: "L'échantillon des 200, le signal suprême des DMs et pourquoi les gens achètent à des visages.",
    readTime: "6 min",
    content: ch16PsychologyContent,
    exercise: ch16PsychologyExercise
});

// Social Media Chapter 18 (TOFU-MOFU-BOFU & Echiquier des 6 réseaux)
updatedChapters.push({
    id: "chapitre-18",
    number: 18,
    badge: "Chapitre 18",
    title: "Réseaux Sociaux (2/3) — Le Tunnel TOFU-MOFU-BOFU & Choisir son Canal Maître",
    subtitle: "L'entonnoir d'acquisition en 3 étapes, les 6 grands réseaux passés au crible et le batching anti-burnout.",
    readTime: "7 min",
    content: ch17FunnelContent,
    exercise: ch17FunnelExercise
});

// Social Media Chapter 19 (Playbooks par Secteur & Blueprints de Closing)
updatedChapters.push({
    id: "chapitre-19",
    number: 19,
    badge: "Chapitre 19",
    title: "Réseaux Sociaux (3/3) — Playbooks par Secteur & Scripts de Closing en DM",
    subtitle: "Stratégie adaptée à ta Voie, scripts de closing mot pour mot et plan d'action commando 14 jours.",
    readTime: "8 min",
    content: ch18PlaybooksContent,
    exercise: oldCh17 ? oldCh17.exercise : undefined
});

// Old Chapter 18 (Pitch) becomes Chapter 20
const oldCh18 = oldChapters.find(c => c.id === 'chapitre-18');
if (oldCh18) {
    oldCh18.number = 20;
    oldCh18.badge = "Chapitre 20";
    oldCh18.id = "chapitre-20";
    if (oldCh18.exercise) oldCh18.exercise.id = "ex_chapitre_20";
    updatedChapters.push(oldCh18);
}

// Old Chapter 19 (30 jours) becomes Chapter 21
const oldCh19 = oldChapters.find(c => c.id === 'chapitre-19');
if (oldCh19) {
    oldCh19.number = 21;
    oldCh19.badge = "Chapitre 21";
    oldCh19.id = "chapitre-21";
    if (oldCh19.exercise) oldCh19.exercise.id = "ex_chapitre_21";
    updatedChapters.push(oldCh19);
}

// Conclusion
const conclusion = oldChapters.find(c => c.id === 'conclusion');
if (conclusion) {
    updatedChapters.push(conclusion);
}

console.log('Total reconstructed chapters:', updatedChapters.length);

const outputData = {
    meta: {
        title: "Les fondamentaux de l'entrepreneur — Tome 1",
        subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
        author: "Domtom Connect",
        edition: "2026 — Édition Interactive Enrichie",
        totalChapters: updatedChapters.length
    },
    chapters: updatedChapters
};

const filePrefix = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie
 */

window.GUIDE_DATA = `;

fs.writeFileSync(filePath, filePrefix + JSON.stringify(outputData, null, 4) + ';\n', 'utf8');
console.log('Successfully written restructured guide-tome1.js!');
