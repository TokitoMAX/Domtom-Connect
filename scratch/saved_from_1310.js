const fs = require('fs');

global.window = {};
require('./assets/data/guide-tome1.js');
const oldChapters = global.window.GUIDE_DATA.chapters;

// Old chapters mapped by old id
const oldMap = {};
oldChapters.forEach(c => { oldMap[c.id] = c; });

// 1. Couverture
const chCouverture = oldMap['couverture'];

// 2. Avant-propos
const chAvantPropos = oldMap['avant-propos'];

// 3. Chapitre 1
const ch1 = oldMap['chapitre-1'];

// 4. Chapitre 2
const ch2 = oldMap['chapitre-2'];

// 5. Chapitre 3
const ch3 = oldMap['chapitre-3'];

// 6. NEW Chapitre 4 : Comprendre les 5 Chemins (+ 5 Histoires Réelles) [PURE EXPLANATION & INSPIRATION]
const ch4 = {
    id: "chapitre-4",
    number: 4,
    badge: "Chapitre 4",
    title: "Comprendre les 5 Chemins (+ 5 Histoires Réelles)",
    subtitle: "Découvrir les 5 grands modèles entrepreneuriaux à travers des trajectoires concrètes parties de zéro.",
    readTime: "8 min",
    content: `
        <p class="lead-text">
            Avant de choisir où tu vas poser tes valises, il faut connaître la carte du territoire. Il n'existe pas une seule façon d'entreprendre : il en existe au moins cinq majeures. Chacune possède son rythme, ses contraintes de trésorerie et ses règles du jeu.
        </p>
        <p>
            Dans ce chapitre, <strong>aucune pression de choix</strong>. Prends le temps de lire, d'assimiler et de t'imprégner de ces cinq trajectoires réelles et documentées d'entrepreneurs partis de zéro, sans millions ni carnet d'adresses ministériel.
        </p>

        <div class="story-box">
            <div class="story-badge"><i class="fa-solid fa-bottle-droplet"></i> Histoire 1 : La Marque de Produit Physique & Terroir</div>
            <h4>Kelly Massol (Les Secrets de Loly) — De 1 500 € dans sa cuisine à plus de 10 millions d'euros</h4>
            <p>
                En 2009, Kelly Massol ne trouve aucun produit adapté à ses cheveux texturés dans la grande distribution sans ingrédient chimique agressif. Avec seulement <strong>1 500 € d'économies personnelles</strong>, elle commence à formuler artisanalement ses premiers soins dans sa propre cuisine. Pas d'investisseurs de la Silicon Valley, pas de gros laboratoire : elle partage ses recettes et ses conseils avec authenticité sur les forums et les réseaux sociaux. Elle réinvestit chaque euro gagné dans sa production. Quinze ans plus tard, Les Secrets de Loly est un géant pesant plus de 10 millions d'euros de chiffre d'affaires, distribué chez Sephora, Marionnaud et Monoprix, et exporté dans le monde entier.
            </p>
            <span class="story-moral"><strong>Ce qu'il faut retenir :</strong> Tu n'as pas besoin de millions pour créer une marque culte. Une formulation sincère, une vraie réponse à un manque criant et une constance sans faille surpassent n'importe quel budget marketing.</span>
        </div>

        <div class="story-box">
            <div class="story-badge"><i class="fa-solid fa-handshake-angle"></i> Histoire 2 : Les Prestations de Services B2B & Agence Locale</div>
            <h4>Le Consultant / Agence Locale (DOM, Afrique & Diaspora) — 0€ de stock et 85% de marge</h4>
            <p>
                Aux Antilles, en Guyane, à La Réunion ou à Abidjan, de nombreux indépendants démarrent sans un centime de stock : ils transforment une compétence pratique (gestion de campagnes publicitaires, montage de vidéos courtes TikTok/Reels, automatisation WhatsApp des commandes pour restaurants, formalités administratives et douanières) en forfaits mensuels de 800€ à 2 500€ par client. Ils encaissent 30% à 50% d'acompte avant même d'ouvrir leur ordinateur.
            </p>
            <span class="story-moral"><strong>Ce qu'il faut retenir :</strong> Le service transforme ta compétence immédiate en cashflow direct dès les premiers jours, avec un risque financier quasi nul.</span>
        </div>

        <div class="story-box">
            <div class="story-badge"><i class="fa-solid fa-laptop-code"></i> Histoire 3 : Les Produits Digitaux & Infoproduits</div>
            <h4>Le Créateur de Guides & Outils — Coût marginal zéro et vente automatique 24h/24</h4>
            <p>
                Qu'il s'agisse d'un guide pratique sur les aides régionales DOM, d'un recueil de recettes nutritionnelles créoles, de modèles de contrats juridiques ou de templates Notion pour artisans, le produit digital a une caractéristique magique : il coûte du temps à concevoir, mais <strong>0€ à reproduire</strong>. Que tu le vendes à 1 personne ou à 5 000 personnes dans le monde entier, ta marge brute dépasse 95%.
            </p>
            <span class="story-moral"><strong>Ce qu'il faut retenir :</strong> Le digital permet de tester une idée à l'échelle planétaire sans aucun risque d'invendus ni de frais de port.</span>
        </div>

        <div class="story-box">
            <div class="story-badge"><i class="fa-solid fa-utensils"></i> Histoire 4 : Restauration, Food & Street-Food</div>
            <h4>Le Traiteur & Street-Food Terroir — L'attachement viscéral aux saveurs</h4>
            <p>
                Du food-truck de bokits gourmets au stand événementiel de grillades marinées et jus locaux pressés minute, la street-food bénéficie d'une demande immédiate et quotidienne. Les clients paient comptant, le retour est instantané. Cependant, la réussite ne repose pas seulement sur la gourmandise : elle exige une maîtrise stricte du coût matière (ne jamais dépasser 28% du prix de vente) et une hygiène HACCP irréprochable sous climat tropical.
            </p>
            <span class="story-moral"><strong>Ce qu'il faut retenir :</strong> La restauration génère du cashflow quotidien en direct, mais demande une rigueur d'exécution opérationnelle sans faille.</span>
        </div>

        <div class="story-box">
            <div class="story-badge"><i class="fa-solid fa-shop"></i> Histoire 5 : Commerce & Boutique Sélective</div>
            <h4>Le Concept-Store & l'Achat-Revente — L'art de la sélection et du conseil</h4>
            <p>
                Plutôt que d'ouvrir une boutique impersonnelle avec des stocks colossaux, les nouveaux commerçants commencent par des pop-up stores d'un week-end, des ventes privées WhatsApp ou des stands sur les marchés d'artisans. Ils sélectionnent des pépites (mode éthique, senteurs d'intérieur, épicerie fine de terroir) avec un coefficient multiplicateur minimum de x2.2 pour absorber l'ensemble de leurs charges et se dégager un vrai revenu.
            </p>
            <span class="story-moral"><strong>Ce qu'il faut retenir :</strong> Le commerce physique ou hybride fonctionne si tu maîtrises ta rotation de stock (vendre sous 45 jours) et apportes une vraie expérience humaine.</span>
        </div>

        <div class="highlight-box">
            <h4><i class="fa-solid fa-lightbulb"></i> Étape suivante :</h4>
            <p>
                Tu as maintenant le panorama complet des 5 modèles. Dans le chapitre suivant (Chapitre 5), nous allons t'aider à <strong>poser ton choix officiel</strong> selon tes moyens actuels, sans te disperser.
            </p>
        </div>
    `,
    exercise: {
        id: "ex_chapitre_4",
        title: "Auto-Diagnostic Réflexif (Sans Pression)",
        description: "Prends un moment pour noter tes premières impressions avant de formaliser ton choix au Chapitre 5 :",
        fields: [
            {
                id: "ch4_histoire_resonance",
                type: "textarea",
                label: "Laquelle de ces 5 histoires ou modèles résonne le plus avec ce que tu as envie de bâtir ?",
                placeholder: "Ex: L'histoire de Kelly Massol me parle énormément car j'ai une recette artisanale... OU le modèle du service B2B car je veux démarrer sans stock..."
            },
            {
                id: "ch4_ressources_actuelles",
                type: "textarea",
                label: "Quels sont tes principaux atouts aujourd'hui (temps disponible, budget de départ, compétences, réseau) ?",
                placeholder: "Ex: J'ai 10h par semaine, un budget limité à 500€, une bonne maîtrise d'Instagram et des outils digitaux..."
            }
        ]
    }
};

// 7. NEW Chapitre 5 : Choisir son Chemin & Valider sa Voie (L'Aiguillage) [THE ACTION & CHOICE CHAPTER]
const ch5 = {
    id: "chapitre-5",
    number: 5,
    badge: "Chapitre 5",
    title: "Choisir son Chemin & Valider sa Voie (L'Aiguillage)",
    subtitle: "C'est le moment de vérité : compare les 5 voies et verrouille celle qui correspond à tes moyens réels d'aujourd'hui.",
    readTime: "7 min",
    content: `
        <p class="lead-text">
            Tu connais les cinq voies. Le plus grand danger maintenant serait d'hésiter pendant six mois ou de vouloir tout lancer en même temps. <strong>Entreprendre, c'est choisir. Et choisir, c'est renoncer temporairement aux autres options.</strong>
        </p>
        <p>
            Il n'y a pas de voie noble et de voie inférieure : il n'y a que la voie qui correspond à ta trésorerie, ton temps disponible et ton tempérament d'aujourd'hui. Rien ne t'empêchera d'ajouter un produit physique dans deux ans si tu démarres aujourd'hui par du service B2B !
        </p>

        <!-- Matrice comparative sans filtre -->
        <div class="table-responsive" style="margin: 24px 0;">
            <table class="table-compare" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                    <tr style="background: rgba(16, 185, 129, 0.15); color: var(--accent);">
                        <th style="padding: 12px; text-align: left;">Voie Entrepreneuriale</th>
                        <th style="padding: 12px; text-align: center;">Capital Minimum</th>
                        <th style="padding: 12px; text-align: center;">Délai 1er Euro</th>
                        <th style="padding: 12px; text-align: center;">Marge Nette</th>
                        <th style="padding: 12px; text-align: center;">Complexité Logistique</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 12px; font-weight: 700;">📦 Voie 1 : Produits Physiques</td>
                        <td style="padding: 12px; text-align: center;">500 € – 2 000 €</td>
                        <td style="padding: 12px; text-align: center;">2 à 4 mois</td>
                        <td style="padding: 12px; text-align: center;">40% – 60%</td>
                        <td style="padding: 12px; text-align: center; color: #f87171;">Élevée (DIP, fret, stocks)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02);">
                        <td style="padding: 12px; font-weight: 700;">💼 Voie 2 : Services & Agence B2B</td>
                        <td style="padding: 12px; text-align: center; color: #10b981; font-weight: 700;">0 € – 100 €</td>
                        <td style="padding: 12px; text-align: center; color: #10b981; font-weight: 700;">7 à 30 jours</td>
                        <td style="padding: 12px; text-align: center; color: #10b981; font-weight: 700;">75% – 90%</td>
                        <td style="padding: 12px; text-align: center; color: #10b981;">Nulle (Matière grise)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 12px; font-weight: 700;">💻 Voie 3 : Produits Digitaux</td>
                        <td style="padding: 12px; text-align: center;">50 € – 200 €</td>
                        <td style="padding: 12px; text-align: center;">15 à 45 jours</td>
                        <td style="padding: 12px; text-align: center; color: #10b981; font-weight: 700;">90% – 95%</td>
                        <td style="padding: 12px; text-align: center; color: #10b981;">Nulle (Fichiers digitaux)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02);">
                        <td style="padding: 12px; font-weight: 700;">🍳 Voie 4 : Restauration & Food</td>
                        <td style="padding: 12px; text-align: center;">800 € – 3 000 €</td>
                        <td style="padding: 12px; text-align: center; color: #10b981; font-weight: 700;">Immédiat (Jour J)</td>
                        <td style="padding: 12px; text-align: center;">30% – 50%</td>
                        <td style="padding: 12px; text-align: center; color: #fbbf24;">Quotidienne (HACCP, frais)</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; font-weight: 700;">🛍️ Voie 5 : Commerce & Revente</td>
                        <td style="padding: 12px; text-align: center;">500 € – 2 500 €</td>
                        <td style="padding: 12px; text-align: center;">15 à 30 jours</td>
                        <td style="padding: 12px; text-align: center;">35% – 55%</td>
                        <td style="padding: 12px; text-align: center; color: #fbbf24;">Moyenne (Gestion de stock)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Sélectionne & Valide Ta Voie Officielle</h3>
        <p>
            Clique ci-dessous sur la carte de ton choix. Dès que tu cliques sur <strong>« Valider cette Voie »</strong>, ton guide s'adapte automatiquement, la barre supérieure s'aligne, et le Chapitre 6 se concentrera à 100% sur les réalités de ton modèle.
        </p>

        <!-- 5 Interactive Decision Cards -->
        <div class="pathway-decision-grid" id="pathway-decision-grid">
            <div class="pathway-card" data-sector="physique">
                <div class="pathway-header">
                    <div class="pathway-icon"><i class="fa-solid fa-bottle-droplet"></i></div>
                    <span class="pathway-badge">Voie 1</span>
                </div>
                <h4>Produits Physiques & Terroirs</h4>
                <p class="pathway-desc">Créer une marque de cosmétique, mode, bien-être ou produits locaux transformés.</p>
                <div class="pathway-metrics">
                    <span><i class="fa-solid fa-coins"></i> Budget : 500€ - 2 000€</span>
                    <span><i class="fa-solid fa-clock"></i> 1er encaissement : 2 à 4 mois</span>
                </div>
                <button type="button" class="btn-choose-pathway" data-target="physique">
                    <i class="fa-solid fa-check"></i> Choisir cette Voie
                </button>
            </div>

            <div class="pathway-card" data-sector="service">
                <div class="pathway-header">
                    <div class="pathway-icon"><i class="fa-solid fa-handshake-angle"></i></div>
                    <span class="pathway-badge">Voie 2</span>
                </div>
                <h4>Prestations de Services & B2B</h4>
                <p class="pathway-desc">Vendre son expertise, création de contenu, gestion WhatsApp, consulting ou artisanat.</p>
                <div class="pathway-metrics">
                    <span><i class="fa-solid fa-coins"></i> Budget : 0€ - 100€</span>
                    <span><i class="fa-solid fa-clock"></i> 1er encaissement : 7 à 30 jours</span>
                </div>
                <button type="button" class="btn-choose-pathway" data-target="service">
                    <i class="fa-solid fa-check"></i> Choisir cette Voie
                </button>
            </div>

            <div class="pathway-card" data-sector="digital">
                <div class="pathway-header">
                    <div class="pathway-icon"><i class="fa-solid fa-laptop-code"></i></div>
                    <span class="pathway-badge">Voie 3</span>
                </div>
                <h4>Produits Digitaux & E-books</h4>
                <p class="pathway-desc">E-books pratiques, guides commando, templates Notion/Excel, formations courtes.</p>
                <div class="pathway-metrics">
                    <span><i class="fa-solid fa-coins"></i> Budget : 50€ - 200€</span>
                    <span><i class="fa-solid fa-clock"></i> 1er encaissement : 15 à 45 jours</span>
                </div>
                <button type="button" class="btn-choose-pathway" data-target="digital">
                    <i class="fa-solid fa-check"></i> Choisir cette Voie
                </button>
            </div>

            <div class="pathway-card" data-sector="food">
                <div class="pathway-header">
                    <div class="pathway-icon"><i class="fa-solid fa-utensils"></i></div>
                    <span class="pathway-badge">Voie 4</span>
                </div>
                <h4>Restauration, Food & Street-Food</h4>
                <p class="pathway-desc">Box déjeuners saines, bokits gourmets, traiteur terroir ou pâtisserie créative.</p>
                <div class="pathway-metrics">
                    <span><i class="fa-solid fa-coins"></i> Budget : 800€ - 3 000€</span>
                    <span><i class="fa-solid fa-clock"></i> 1er encaissement : Immédiat</span>
                </div>
                <button type="button" class="btn-choose-pathway" data-target="food">
                    <i class="fa-solid fa-check"></i> Choisir cette Voie
                </button>
            </div>

            <div class="pathway-card" data-sector="commerce">
                <div class="pathway-header">
                    <div class="pathway-icon"><i class="fa-solid fa-shop"></i></div>
                    <span class="pathway-badge">Voie 5</span>
                </div>
                <h4>Commerce & Achat-Revente</h4>
                <p class="pathway-desc">Concept-store, friperie chic, revente d'accessoires ou épicerie fine sélectionnée.</p>
                <div class="pathway-metrics">
                    <span><i class="fa-solid fa-coins"></i> Budget : 500€ - 2 500€</span>
                    <span><i class="fa-solid fa-clock"></i> 1er encaissement : 15 à 30 jours</span>
                </div>
                <button type="button" class="btn-choose-pathway" data-target="commerce">
                    <i class="fa-solid fa-check"></i> Choisir cette Voie
                </button>
            </div>
        </div>

        <div id="pathway-confirmation-box" class="pathway-confirmation-banner" style="display: none;">
            <div class="confirmation-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="confirmation-text">
                <h4 id="confirmation-title">Voie Validée !</h4>
                <p id="confirmation-desc">Ton carnet de bord et tous les chapitres suivants sont désormais configurés pour ton modèle. Passe au Chapitre 6 pour le zoom opérationnel.</p>
            </div>
        </div>
    `,
    exercise: {
        id: "ex_chapitre_5",
        title: "Validation Formelle de Ta Voie",
        description: "Confirme ton choix stratégique pour calibrer l'ensemble de ton parcours dans ce guide :",
        fields: [
            {
                id: "secteur_activite_selection",
                type: "select",
                label: "Ta voie retenue pour lancer ton activité :",
                options: [
                    { value: "physique", label: "Voie 1 : Produits Physiques & Terroirs (Cosmétique, mode, agro)" },
                    { value: "service", label: "Voie 2 : Prestations de Services & Agence B2B (0€ de stock)" },
                    { value: "digital", label: "Voie 3 : Produits Digitaux & E-books (Marge 95%+)" },
                    { value: "food", label: "Voie 4 : Restauration, Food & Street-Food (Cashflow quotidien)" },
                    { value: "commerce", label: "Voie 5 : Commerce & Achat-Revente (Sélection & boutiques)" }
                ]
            },
            {
                id: "pourquoi_ce_chemin",
                type: "textarea",
                label: "Pourquoi cette voie est-elle le véhicule le plus réaliste pour toi aujourd'hui ?",
                placeholder: "Ex: J'ai besoin de générer mes premiers 1 500 € sous 30 jours sans prendre de risque financier lourd, le service me permet d'encaisser des acomptes tout de suite..."
            }
        ]
    }
};

// 8. NEW Chapitre 6 : Zoom sur ton Secteur : Les Spécificités de ta Voie [FOCUSED ON CHOSEN PATH]
const ch6 = {
    id: "chapitre-6",
    number: 6,
    badge: "Chapitre 6",
    title: "Zoom sur ton Secteur : Les Spécificités de ta Voie",
    subtitle: "Réglementation, marges réelles, logistique et erreurs fatales : focus chirurgical sur le modèle que tu as validé.",
    readTime: "10 min",
    content: `
        <p class="lead-text">
            Tu as validé ta voie au Chapitre 5. À partir de maintenant, <strong>nous ne parlons plus de généralités</strong>. Nous entrons dans les rouages spécifiques de ton modèle économique.
        </p>
        <p>
            Ce chapitre s'adapte en direct à ton choix : découvre les obligations juridiques, les ratios de marge et les pièges d'exécution propres à ta voie terrain.
        </p>

        <!-- Active Sector Indicator Bar -->
        <div class="active-sector-indicator-bar" style="margin-bottom: 24px;">
            <div class="indicator-left">
                <span class="indicator-tag">FOCUS SUR TA VOIE VALIDÉE</span>
                <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
            </div>
            <button type="button" class="btn-change-sector">
                <i class="fa-solid fa-arrows-rotate"></i> Ajuster ma voie
            </button>
        </div>

        <!-- 5 Separate Sector Panels in Reading Mode -->
        <div class="sector-article-panel active" data-sector="physique">
            <div class="sector-card" style="border-left: 4px solid #10b981;">
                <h4><i class="fa-solid fa-bottle-droplet"></i> Voie 1 : Produits Physiques, Cosmétique & Marques de Terroirs</h4>
                <p><strong>L'Opportunité :</strong> Une demande mondiale explosive pour les trésors botaniques caribéens et africains (huile de carapate, moringa, aloe vera pur, hibiscus, beurre de karité brut). Des marges brutes de 70% à 85% une fois la marque installée.</p>
                <p><strong>La Réalité Opérationnelle Pas-à-Pas :</strong></p>
                <ul>
                    <li><strong>La Réglementation Cosmetovigilance :</strong> En Europe et dans les DOM, un cosmétique ne se vend pas sans un <em>DIP (Dossier d'Information Produit)</em> validé par un toxicologue certifié, des tests de stabilité en étuve et un enregistrement sur le portail CPNP. Compte 800€ à 1 500€ par formule.</li>
                    <li><strong>Sourcing Usine & MOQ :</strong> Ne commence jamais par commander 5 000 unités. Négocie un premier batch test de 250 à 500 pièces, même si le coût unitaire est plus élevé de 15%.</li>
                    <li><strong>Logistique & Fret :</strong> Le fret maritime groupé LCL (3 à 5 semaines vers les Antilles/Afrique) est 4 fois moins cher que l'aérien. Provisionne systématiquement les droits de douane et l'octroi de mer local (7% à 30%).</li>
                </ul>
            </div>
        </div>

        <div class="sector-article-panel" data-sector="service">
            <div class="sector-card" style="border-left: 4px solid #10b981;">
                <h4><i class="fa-solid fa-handshake-angle"></i> Voie 2 : Prestations de Services, Consulting & Agence B2B</h4>
                <p><strong>L'Opportunité :</strong> Le secteur le plus rapide et le plus sécurisant pour démarrer dès aujourd'hui : <strong>0€ de stock, 0€ de laboratoire, 85%+ de marge nette</strong>. Les entreprises traditionnelles manquent cruellement de compétences sur le digital, les vidéos courtes et la gestion.</p>
                <p><strong>La Réalité Opérationnelle Pas-à-Pas :</strong></p>
                <ul>
                    <li><strong>Packager plutôt que facturer à l'heure :</strong> Arrête de dire « je facture 40€ de l'heure ». Dis : « Je livre un Pack Acquisition de 8 vidéos courtes + optimisation profil pour 850€/mois ». Le client achète un résultat, pas des heures d'horloge.</li>
                    <li><strong>Acompte obligatoire :</strong> 30% à 50% d'acompte encaissé à la signature du devis par virement ou lien Stripe avant d'ouvrir ton ordinateur.</li>
                    <li><strong>Le closing en direct :</strong> Pas besoin de site web complexe à 3 000€. Un compte Instagram soigné, un profil LinkedIn et un numéro WhatsApp Business suffisent pour signer tes 5 premiers contrats.</li>
                </ul>
            </div>
        </div>

        <div class="sector-article-panel" data-sector="digital">
            <div class="sector-card" style="border-left: 4px solid #10b981;">
                <h4><i class="fa-solid fa-laptop-code"></i> Voie 3 : Produits Digitaux, E-books, Outils & Formations</h4>
                <p><strong>L'Opportunité :</strong> Coût de reproduction marginal égal à 0 €. Que tu vendes à 1 client ou à 10 000 clients, ton produit ne te coûte pas 1 centime de plus à fabriquer. Zéro stock, zéro expédition, encaissement mondial 24h/24.</p>
                <p><strong>La Réalité Opérationnelle Pas-à-Pas :</strong></p>
                <ul>
                    <li><strong>Le Lead Magnet Incontournable :</strong> Crée un document gratuit ultra-actionnable (checklist, template Notion, mini-guide) pour capturer les emails et numéros de prospects qualifiés.</li>
                    <li><strong>La Stack Technique Simple :</strong> Héberge ton produit sur Payhip, Podia ou Shopify avec Stripe et PayPal. Zéro outil payant mensuel lourd avant d'avoir encaissé 1 000€.</li>
                    <li><strong>La Règle de l'Offre Flash :</strong> Propose une réduction spéciale de 48h dès qu'un prospect télécharge ton contenu gratuit pour déclencher l'achat immédiat.</li>
                </ul>
            </div>
        </div>

        <div class="sector-article-panel" data-sector="food">
            <div class="sector-card" style="border-left: 4px solid #10b981;">
                <h4><i class="fa-solid fa-utensils"></i> Voie 4 : Restauration, Food & Street-Food</h4>
                <p><strong>L'Opportunité :</strong> L'attachement viscéral de la communauté aux saveurs authentiques, marinades créoles, bokits gourmets, grillades et boissons de terroirs. Un chiffre d'affaires immédiat en espèces et cartes bancaires chaque jour.</p>
                <p><strong>La Réalité Opérationnelle Pas-à-Pas :</strong></p>
                <ul>
                    <li><strong>La Règle d'Airain du Coût Matière :</strong> Le coût de tes ingrédients alimentaires ne doit JAMAIS dépasser <strong>25% à 28%</strong> du prix de vente TTC de ton plat. Si tu vends une formule à 12€, tes ingrédients doivent coûter moins de 3,36€.</li>
                    <li><strong>Hygiène & Traçabilité HACCP :</strong> La chaîne du froid ne se négocie pas sous le climat tropical. Étiquetage strict des préparations, thermomètre de contrôle et formation HACCP à jour.</li>
                    <li><strong>Emplacement & Dark Kitchen :</strong> Démarre en livraison click & collect ou food-truck événementiel pour valider tes recettes avant de t'endetter sur un bail commercial de 9 ans.</li>
                </ul>
            </div>
        </div>

        <div class="sector-article-panel" data-sector="commerce">
            <div class="sector-card" style="border-left: 4px solid #10b981;">
                <h4><i class="fa-solid fa-shop"></i> Voie 5 : Commerce, Boutique & Achat-Revente</h4>
                <p><strong>L'Opportunité :</strong> Distribution de produits tendance, concept-stores de créateurs, mode caribéenne ou épicerie fine. Capacité à créer une expérience d'achat physique ou en ligne ultra-séduisante.</p>
                <p><strong>La Réalité Opérationnelle Pas-à-Pas :</strong></p>
                <ul>
                    <li><strong>Le Coefficient Multiplicateur Vital :</strong> Multiplie au minimum par <strong>x2.2 voire x2.8</strong> le prix d'achat HT de tes marchandises pour absorber le loyer, l'énergie, les pertes et te dégager un vrai salaire net.</li>
                    <li><strong>La Rotation Rapide de Stock :</strong> Tout article qui reste plus de 45 jours en rayon sans se vendre te coûte de l'argent. Fais des ventes flash pour récupérer ta trésorerie et réinvestir sur les best-sellers.</li>
                    <li><strong>Le Pop-up Éphémère :</strong> Teste tes collections lors de salons, marchés créateurs ou pop-up stores d'un week-end avant d'engager des frais fixes de boutique permanente.</li>
                </ul>
            </div>
        </div>
    `,
    exercise: {
        id: "ex_chapitre_6",
        title: "Feuille de Route Dédiée à Ton Secteur",
        description: "Ce carnet de bord s'adapte en direct à ta voie choisie : définis précisément ton activité et tes paramètres opérationnels :",
        fields: [
            // Volet Physique
            { id: "sec_volet_physique", sector: "physique", type: "section-header", icon: "fa-solid fa-bottle-droplet", label: "Paramètres Opérationnels : Produit Physique" },
            { id: "physique_fournisseur_labo", sector: "physique", type: "text", label: "Usine, laboratoire façonnier ou atelier contacté :", placeholder: "Ex: Façonnier cosmétique certifié en région PACA..." },
            { id: "physique_statut_echantillon", sector: "physique", type: "select", label: "Statut des échantillons et tests de tenue :", options: [
                { value: "recherche", label: "Phase de sourcing et demandes de devis" },
                { value: "commande", label: "Échantillon payé et en cours de livraison" },
                { value: "valide", label: "Formule validée et testée auprès de 10 proches" }
            ]},
            { id: "physique_normes_dip", sector: "physique", type: "checkbox", label: "J'ai budgétisé le Dossier d'Information Produit (DIP) et les tests réglementaires." },
            { id: "physique_moq_fret", sector: "physique", type: "textarea", label: "Quantité minimale de commande (MOQ) et mode d'expédition retenu :", placeholder: "Ex: Premier batch test de 300 unités, transport maritime groupé..." },

            // Volet Service
            { id: "sec_volet_services", sector: "service", type: "section-header", icon: "fa-solid fa-handshake-angle", label: "Paramètres Opérationnels : Services B2B & Freelance" },
            { id: "service_packaging_offre", sector: "service", type: "textarea", label: "Formule ou forfait mensuel que tu vas vendre (intitulé et tarif) :", placeholder: "Ex: Pack Visibilité TikTok & Instagram (8 vidéos/mois) : 750 €/mois" },
            { id: "service_cible_b2b", sector: "service", type: "text", label: "Types d'entreprises locales ciblées en priorité :", placeholder: "Ex: Agences immobilières, restaurants, cabinets de santé, artisans..." },
            { id: "service_livrables_perimetre", sector: "service", type: "textarea", label: "Périmètre précis de ton livrable (ce qui est inclus et ce qui est exclu) :", placeholder: "Inclus : tournage, montage, publication. Exclu : gestion des DM commerciaux." },

            // Volet Digital
            { id: "sec_volet_digital", sector: "digital", type: "section-header", icon: "fa-solid fa-laptop-code", label: "Paramètres Opérationnels : Produits Digitaux" },
            { id: "digital_plateforme_vente", sector: "digital", type: "select", label: "Plateforme retenue pour héberger et encaisser :", options: [
                { value: "payhip", label: "Payhip (0€/mois, 5% de commission, Stripe/PayPal direct)" },
                { value: "podia", label: "Podia (Formations, coaching et communauté)" },
                { value: "shopify", label: "Shopify Digital Downloads" }
            ]},
            { id: "digital_lead_magnet", sector: "digital", type: "textarea", label: "Quel sera ton Lead Magnet gratuit pour attirer tes 100 premiers prospects qualifiés ?", placeholder: "Ex: Checklist PDF de 5 pages : 'Les 10 erreurs qui bloquent un dossier d'aide régionale'..." },

            // Volet Food
            { id: "sec_volet_food", sector: "food", type: "section-header", icon: "fa-solid fa-utensils", label: "Paramètres Opérationnels : Restauration & Street-Food" },
            { id: "food_cout_portion", sector: "food", type: "number", label: "Coût de revient estimé de tes ingrédients par portion (€) :", placeholder: "Ex: 3.20" },
            { id: "food_prix_formule", sector: "food", type: "number", label: "Prix de vente TTC de la formule envisagée (€) :", placeholder: "Ex: 12.50" },
            { id: "food_format_demarrage", sector: "food", type: "select", label: "Format de lancement retenu pour tester sans risque de bail lourd :", options: [
                { value: "click_collect", label: "Click & Collect / Commandes WhatsApp la veille" },
                { value: "traiteur_event", label: "Traiteur événementiel pour entreprises et mariages" },
                { value: "foodtruck", label: "Stand éphémère / Food-truck sur emplacements stratégiques" }
            ]},

            // Volet Commerce
            { id: "sec_volet_commerce", sector: "commerce", type: "section-header", icon: "fa-solid fa-shop", label: "Paramètres Opérationnels : Commerce & Revente" },
            { id: "commerce_fournisseurs_grossistes", sector: "commerce", type: "textarea", label: "Grossistes ou créateurs identifiés pour tes approvisionnements :", placeholder: "Ex: Grossiste d'accessoires à Paris / 3 créatrices locales en dépôt-vente..." },
            { id: "commerce_coefficient_marge", sector: "commerce", type: "text", label: "Coefficient multiplicateur appliqué sur le prix d'achat HT :", placeholder: "Ex: x2.4 (un article acheté 10€ HT sera vendu 24€ TTC)" },
            { id: "commerce_plan_rotation_stock", sector: "commerce", type: "textarea", label: "Que prévois-tu pour écouler les invendus au-delà de 45 jours ?", placeholder: "Ex: Ventes privées flash en Story Instagram à prix coûtant..." }
        ]
    }
};

// 9. NEW Chapitre 7 : Comprendre la Niche & la Transformation [PURE EXPLANATION & PSYCHOLOGY]
const ch7 = {
    id: "chapitre-7",
    number: 7,
    badge: "Chapitre 7",
    title: "Comprendre la Niche & la Transformation (La Psychologie du Positionnement)",
    subtitle: "Pourquoi les généralistes meurent de faim et comment vendre la bascule entre l'État A et l'État B.",
    readTime: "8 min",
    content: `
        <p class="lead-text">
            Le piège le plus sournois dans lequel tombent 90% des débutants est de penser que plus leur cible est large, plus ils feront de ventes. <strong>C'est une illusion dévastatrice.</strong>
        </p>
        <p>
            Quand tu tentes de parler à tout le monde, ton message devient fade, tiède et impersonnel. Personne ne se sent concerné. Sur le marché, <strong>les généralistes meurent de faim en bradant leurs prix, tandis que les spécialistes imposent leurs tarifs avec autorité</strong>.
        </p>

        <!-- Le Choc : Généraliste vs Spécialiste -->
        <div class="vs-container" style="margin: 28px 0;">
            <div class="vs-card bad">
                <h4><i class="fa-solid fa-user-doctor"></i> Le Médecin Généraliste (25 € la consultation)</h4>
                <p style="font-size:0.88rem; color:#fca5a5; margin-bottom:8px;">Il soigne les rhumes, les maux de gorge, voit 35 patients par jour.</p>
                <ul>
                    <li>Salle d'attente bondée, épuisement total.</li>
                    <li>Tarif bloqué, imposé et négocié par la sécurité sociale.</li>
                    <li>Remplaceable par n'importe quel autre cabinet à 200 mètres.</li>
                </ul>
            </div>
            <div class="vs-card good">
                <h4><i class="fa-solid fa-heart-pulse"></i> Le Chirurgien Cardiologue de Pointe (3 500 € l'intervention)</h4>
                <p style="font-size:0.88rem; color:#6ee7b7; margin-bottom:8px;">Il intervient sur une malformation cardiaque rare et vitale.</p>
                <ul>
                    <li>Liste d'attente de 6 mois, les patients viennent de l'autre bout du monde.</li>
                    <li>Zéro négociation sur le tarif : on paie pour sauver sa vie.</li>
                    <li>Autorité incontestable et respect absolu.</li>
                </ul>
            </div>
        </div>

        <div class="quote-card">
            <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
            <p>
                « Les gens ne paient pas pour des caractéristiques techniques ou pour des heures de ton temps. Ils paient pour l'élimination d'une douleur aiguë ou pour l'accès à un état de soulagement garanti. »
            </p>
        </div>

        <h3>La Règle d'Or : Tu ne vends pas un produit, tu vends une TRANSFORMATION</h3>
        <p>
            Personne ne se lève le matin en se disant : <em>« Tiens, j'ai envie d'acheter un flacon d'huile de 100ml »</em> ou <em>« Tiens, si je m'achetais 3 heures de coaching »</em>.
        </p>
        <p>
            Ce que ton client achète, c'est le <strong>PONT</strong> entre sa situation de douleur actuelle (<strong>l'État A</strong>) et la situation rêvée qu'il désire désespérément atteindre (<strong>l'État B</strong>).
        </p>

        <!-- Le Pont de la Transformation -->
        <div class="story-box" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.05);">
            <div class="story-badge" style="background: #10b981; color: #020617;"><i class="fa-solid fa-arrow-right-arrow-left"></i> Le Schéma Universel de la Transformation</div>
            <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin: 16px 0;">
                <div style="flex: 1; min-width: 200px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 14px;">
                    <strong style="color: #f87171; display: block; font-size: 0.95rem; margin-bottom: 6px;">ÉTAT A (Le Point de Départ)</strong>
                    <p style="font-size: 0.88rem; margin: 0; color: var(--text-secondary);">Douleur vive, frustration, honte, insécurité, perte de temps, fatigue, impression de tourner en rond.</p>
                </div>
                <div style="text-align: center; color: var(--accent); font-size: 1.5rem; font-weight: 700;">
                    ➔ TON OFFRE (LE PONT) ➔
                </div>
                <div style="flex: 1; min-width: 200px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 14px;">
                    <strong style="color: #34d399; display: block; font-size: 0.95rem; margin-bottom: 6px;">ÉTAT B (La Destination Rêvée)</strong>
                    <p style="font-size: 0.88rem; margin: 0; color: var(--text-secondary);">Soulagement immédiat, fierté retrouvée, temps libéré, beauté célébrée, autonomie et sérénité.</p>
                </div>
            </div>
        </div>

        <h3>Trois Exemples Concrets de Transformation Terrain</h3>
        <ul>
            <li>
                <strong>Exemple 1 : Soin capillaire texturé (Cosmétique)</strong><br>
                <em>État A :</em> Une femme qui a honte de ses tempes dégarnies par des tresses trop serrées (alopécie de traction) et n'ose plus détacher ses cheveux en public.<br>
                <em>État B :</em> Des repousses denses et visibles en 8 semaines, la liberté de coiffer ses cheveux naturels avec fierté devant ses collègues.
            </li>
            <li style="margin-top: 12px;">
                <strong>Exemple 2 : Service d'automatisation WhatsApp pour Artisans (Service B2B)</strong><br>
                <em>État A :</em> Un électricien indépendant qui passe 2 heures chaque soir à trier ses messages au lieu de dîner avec ses enfants et perd 3 chantiers sur 5 faute de répondre à temps.<br>
                <em>État B :</em> Un assistant WhatsApp qui qualifie les demandes et cale les devis automatiquement. L'électricien rentre serein à 18h en sachant que ses chantiers sont verrouillés.
            </li>
            <li style="margin-top: 12px;">
                <strong>Exemple 3 : Coaching pour Mères Actives Débordées</strong><br>
                <em>État A :</em> La charge mentale écrasante, la culpabilité constante de ne pas être assez disponible, la fatigue chronique.<br>
                <em>État B :</em> 1 heure de temps personnel récupérée chaque jour sans culpabilité, un planning familial clair et apaisé.
            </li>
        </ul>

        <div class="tip-card">
            <h4><i class="fa-solid fa-compass"></i> Ce qui t'attend au Chapitre 8 :</h4>
            <p>
                Maintenant que le principe de la niche et de la transformation est parfaitement clair, <strong>tu vas verrouiller au Chapitre 8 ta sous-niche précise et formuler l'État A et l'État B de tes propres clients</strong>.
            </p>
        </div>
    `,
    exercise: {
        id: "ex_chapitre_7",
        title: "Test d'Assimilation : Maîtriser l'État A ➔ État B",
        description: "Entraîne ton regard stratégique avant d'appliquer cette grille à ton propre projet au Chapitre 8 :",
        fields: [
            {
                id: "ch7_exercice_comprehension",
                type: "textarea",
                label: "Dans ton idée de projet, quelle est la plus grande DOULEUR (État A) que ressent aujourd'hui ton prospect type ?",
                placeholder: "Ex: Il perd du temps chaque semaine à... Il a peur de se tromper sur... Il a honte de..."
            },
            {
                id: "ch7_exercice_transformation_visee",
                type: "textarea",
                label: "Quelle est la TRANSFORMATION concrète (État B) qu'il vivra après avoir utilisé ton offre ?",
                placeholder: "Ex: En 30 jours, il aura enfin... Il ressentira de la fierté parce que... Ses revenus augmenteront de..."
            }
        ]
    }
};

// 10. NEW Chapitre 8 : Verrouiller sa Niche Rentable & sa Différenciation [ACTION & LOCK-IN]
// Take the best parts of old Chapitre 6 (Niches adaptées par voie + champs de verrouillage)
const ch8 = {
    id: "chapitre-8",
    number: 8,
    badge: "Chapitre 8",
    title: "Verrouiller sa Niche Rentable & sa Différenciation (Action & Décision)",
    subtitle: "Découvre 3 opportunités concrètes adaptées à ta voie et formule ta sous-niche rentable dès aujourd'hui.",
    readTime: "8 min",
    content: `
        <p class="lead-text">
            Tu as compris la psychologie de la spécialisation au Chapitre 7. Il est temps de passer à l'action et de **verrouiller officiellement ta niche rentable**.
        </p>
        <p>
            Pour ne pas chercher dans le vide, voici pour **la voie que tu as sélectionnée** trois opportunités concrètes, rentables et en forte demande non saturée sur nos territoires :
        </p>

        <!-- Dynamic Niche Opportunities Grid per Sector -->
        <div class="sector-adaptive-container" style="margin-top: 24px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">NICHES RECOMMANDÉES POUR TON MODÈLE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-bottle-droplet" style="color:#10b981;"></i> 3 Niches Fortes à Exploiter en Produits Physiques</h4>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Niche 1 : Soin Capillaire Ciblé</span>
                        <div class="adaptive-offer-name">Soins Anti-Chute & Alopécie de Traction</div>
                        <div class="adaptive-offer-desc">Cible : Femmes aux cheveux crépus/texturés fragilisés par les tresses serrées ou défrisages. Besoin urgent : repousse visible des tempes dégarnies.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Actifs bruts : Huile de carapate noire pure, ricin, moringa local</li>
                            <li><i class="fa-solid fa-check"></i> Forte récurrence : achat d'une cure de 3 mois renouvelable</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Niche 2 : Épicerie Fine Prestige</span>
                        <div class="adaptive-offer-name">Condiments & Piments Rares d'Origine</div>
                        <div class="adaptive-offer-desc">Cible : Épicuriens locaux et diaspora nostalgique cherchant l'authenticité gastronomique sans colorants ni conservateurs industriels.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Coffrets cadeaux bois avec pots numérotés en édition limitée</li>
                            <li><i class="fa-solid fa-check"></i> Panier moyen élevé : 39€ à 65€ le coffret cadeau</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Niche 3 : Mode Éco-Conçue</span>
                        <div class="adaptive-offer-name">Beachwear & Maillots Morpho-Inclusifs</div>
                        <div class="adaptive-offer-desc">Cible : Femmes aux morphologies généreuses cherchant maintien parfait, tissus anti-UV respirants et motifs culturels élégants.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Zéro complexe : coupes testées sur des vrais corps locaux</li>
                            <li><i class="fa-solid fa-check"></i> Taux de retour très faible grâce au conseil morphologie</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-handshake-angle" style="color:#10b981;"></i> 3 Niches Fortes à Exploiter en Prestations B2B</h4>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Niche 1 : Tourisme & Hébergement</span>
                        <div class="adaptive-offer-name">Réservations Directes pour Gîtes & Villas</div>
                        <div class="adaptive-offer-desc">Cible : Propriétaires de meublés de tourisme étouffés par les 20% de commission d'Airbnb et Booking.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Proposition : Site one-page rapide + campagnes Google Maps</li>
                            <li><i class="fa-solid fa-check"></i> Valeur perçue : Économiser 4 000€ à 10 000€ de commissions par an</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Niche 2 : Artisans & BTP</span>
                        <div class="adaptive-offer-name">Système Devis & WhatsApp pour Artisans</div>
                        <div class="adaptive-offer-desc">Cible : Plombiers, électriciens, peintres qui perdent 10h/semaine à courir après les clients et envoyer des devis tard le soir.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Mise en place d'un répondeur WhatsApp Business automatisé</li>
                            <li><i class="fa-solid fa-check"></i> Contrat d'installation 1 200€ + maintenance 250€/mois</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Niche 3 : E-commerce & Import</span>
                        <div class="adaptive-offer-name">Optimisation Fret & Formalités Douanières</div>
                        <div class="adaptive-offer-desc">Cible : Jeunes marques locales bloquées par les calculs d'octroi de mer, frais de dossier et blocages portuaires.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Audit logistique + mise en relation avec transitaires fiables</li>
                            <li><i class="fa-solid fa-check"></i> Gain de temps et économies directes sur les coûts de fret</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-laptop-code" style="color:#10b981;"></i> 3 Niches Fortes à Exploiter en Produits Digitaux</h4>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Niche 1 : Administratif & Statut</span>
                        <div class="adaptive-offer-name">Kit Juridique & Devis Clé-en-Main DOM</div>
                        <div class="adaptive-offer-desc">Cible : Nouveaux indépendants et prestataires de services qui ont peur de faire une erreur légale sur leurs devis et CGV.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Modèles Word/Notion personnalisables + guide explicatif</li>
                            <li><i class="fa-solid fa-check"></i> Prix : 37€ à 47€ (vendu 100% en automatique)</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Niche 2 : Financement & Aides</span>
                        <div class="adaptive-offer-name">Dossier Subventions Régionales & ADIE</div>
                        <div class="adaptive-offer-desc">Cible : Porteurs de projet perdus dans le labyrinthe des aides publiques locales.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Trame prête à remplir + exemples de dossiers acceptés</li>
                            <li><i class="fa-solid fa-check"></i> Évite de payer 1 500€ à un cabinet de montage de dossier</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Niche 3 : Reconversion & Freelance</span>
                        <div class="adaptive-offer-name">Tremplin Salariat vers Indépendant pour Femmes</div>
                        <div class="adaptive-offer-desc">Cible : Cadres et salariées des îles souhaitant lancer leur activité sans risquer la stabilité de leur foyer.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Guide stratégique + simulateur financier + masterclass vidéo</li>
                            <li><i class="fa-solid fa-check"></i> Panier moyen : 97€ pour le bundle complet</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-utensils" style="color:#10b981;"></i> 3 Niches Fortes à Exploiter en Cuisine & Food</h4>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Niche 1 : Repas Midi Santé</span>
                        <div class="adaptive-offer-name">Box Déjeuner Healthy Créole au Bureau</div>
                        <div class="adaptive-offer-desc">Cible : Employés de bureau et soignants qui en ont marre des sandwichs gras et veulent manger sainement le midi.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Légumes pays vapeur, protéines grillées marinées, sauces maison</li>
                            <li><i class="fa-solid fa-check"></i> Précommande WhatsApp à 10h, livraison groupée à 12h</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Niche 2 : Street-Food Gourmet</span>
                        <div class="adaptive-offer-name">Bokit ou Pastel Fusion au Levain Naturel</div>
                        <div class="adaptive-offer-desc">Cible : Jeunes actifs et amateurs de street-food cherchant une expérience gastronomique croustillante et raffinée.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Garnitures nobles : poisson frais du matin, effiloché de bœuf épicé</li>
                            <li><i class="fa-solid fa-check"></i> Prix menu 16€ (ratio matière maîtrisé < 26%)</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Niche 3 : Événementiel B2B</span>
                        <div class="adaptive-offer-name">Cocktail Dînatoire Terroir pour Entreprises</div>
                        <div class="adaptive-offer-desc">Cible : Entreprises locales organisant des séminaires, pots de départ ou réceptions VIP de 20 à 60 personnes.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Pièces cocktail créatives et élégantes sur plateaux en bois</li>
                            <li><i class="fa-solid fa-check"></i> Commandes pré-payées de 600€ à 1 800€ la prestation</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-shop" style="color:#10b981;"></i> 3 Niches Fortes à Exploiter en Commerce</h4>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Niche 1 : Cadeaux Créateurs</span>
                        <div class="adaptive-offer-name">Boutique Éphémère Artisans & Senteurs</div>
                        <div class="adaptive-offer-desc">Cible : Clients cherchant un cadeau unique et raffiné qu'on ne trouve dans aucune grande surface.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Bougies végétales aux épices, bijoux faits main, carterie d'art</li>
                            <li><i class="fa-solid fa-check"></i> Coefficient multiplicateur moyen de x2.5 à x3.0</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Niche 2 : Bien-Être & Plantes</span>
                        <div class="adaptive-offer-name">Comptoir des Super-Aliments & Tisanes Brutes</div>
                        <div class="adaptive-offer-desc">Cible : Personnes de 35 à 65 ans soucieuses de leur vitalité, cherchant des poudres de feuilles pures (moringa, kinkeliba, curcuma).</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Produits à conservation longue, stockage facile</li>
                            <li><i class="fa-solid fa-check"></i> Clientèle ultra-fidèle avec réachat mensuel régulier</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Niche 3 : Mode Responsable</span>
                        <div class="adaptive-offer-name">Friperie Chic & Vintage Sélectionné</div>
                        <div class="adaptive-offer-desc">Cible : Femmes branchées cherchant des pièces de marque impeccables à prix doux sans cautionner la fast-fashion.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Pièces uniques nettoyées, repassées et présentées comme du neuf</li>
                            <li><i class="fa-solid fa-check"></i> Écoulement immédiat lors des Lives déballage de cartons</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="highlight-box" style="margin: 24px 0;">
            <h4><i class="fa-solid fa-check-double"></i> Les 3 Piliers de Rentabilité à Valider</h4>
            <ul>
                <li><strong>1. Douleur aiguë ou désir pressant :</strong> Le problème doit être suffisamment pénible pour que le prospect veuille le régler rapidement.</li>
                <li><strong>2. Pouvoir d'achat avéré :</strong> La cible doit avoir l'habitude d'investir de l'argent dans ce domaine.</li>
                <li><strong>3. Accessibilité simple :</strong> Tu sais exactement où les trouver (groupes WhatsApp, profils Instagram, lieux physiques, annuaires).</li>
            </ul>
        </div>
    `,
    exercise: {
        id: "ex_chapitre_8",
        title: "Verrouillage de Ta Niche & Différenciation",
        description: "Remplis cette fiche pour fixer définitivement ta niche avant de passer à l'étude de la concurrence :",
        fields: [
            {
                id: "niche_choisie_description",
                type: "textarea",
                label: "1. Quelle est ta sous-niche précise (À qui s'adresse exclusivement ton offre ?) :",
                placeholder: "Ex: 'Les propriétaires de gîtes et villas touristiques en Guadeloupe qui veulent des réservations directes sans verser 20% à Airbnb.'"
            },
            {
                id: "niche_etat_a_douleur",
                type: "textarea",
                label: "2. Quel est l'ÉTAT A (la douleur aiguë, la frustration ou la perte) qu'ils subissent aujourd'hui ?",
                placeholder: "Ex: 'Voir partir 4 000€ de commissions par an vers des plateformes américaines alors que les charges locales augmentent.'"
            },
            {
                id: "niche_etat_b_promesse",
                type: "textarea",
                label: "3. Quel est l'ÉTAT B promis (le résultat concret, le soulagement et le bénéfice mesurable) ?",
                placeholder: "Ex: 'Encaisser 60% de réservations directes sur leur propre site WhatsApp/Stripe et récupérer 350€ de marge nette par séjour.'"
            },
            {
                id: "niche_pouvoir_achat",
                type: "text",
                label: "4. Pourquoi cette cible a-t-elle le pouvoir d'achat nécessaire pour payer ton offre ?",
                placeholder: "Ex: 'Parce que chaque réservation directe supplémentaire rembourse immédiatement mon forfait mensuel.'"
            },
            {
                id: "niche_lieu_accessibilite",
                type: "text",
                label: "5. Où peux-tu trouver et contacter facilement 20 personnes de cette niche dès cette semaine ?",
                placeholder: "Ex: 'Sur Google Maps (recherche gîtes), dans les groupes Facebook d'hébergeurs locaux et par prospection WhatsApp directe.'"
            }
        ]
    }
};

// 11. Chapitre 9 : Étude de Marché Terrain & Analyse de la Concurrence (formerly Ch 7)
const ch9 = { ...oldMap['chapitre-7'], id: "chapitre-9", number: 9, badge: "Chapitre 9" };

// 12. Chapitre 10 : Profiler son Client Idéal en Profondeur (L'Avatar) (formerly Ch 8)
const ch10 = { ...oldMap['chapitre-8'], id: "chapitre-10", number: 10, badge: "Chapitre 10" };

// 13. Chapitre 11 : Seul ou accompagné : faut-il t'associer ? (formerly Ch 9)
const ch11 = { ...oldMap['chapitre-9'], id: "chapitre-11", number: 11, badge: "Chapitre 11" };

// 14. Chapitre 12 : Ton chemin, tes moyens (formerly Ch 10)
const ch12 = { ...oldMap['chapitre-10'], id: "chapitre-12", number: 12, badge: "Chapitre 12" };

// 15. Chapitre 13 : Architecture de l'Offre Irrésistible (formerly Ch 11)
const ch13 = { ...oldMap['chapitre-11'], id: "chapitre-13", number: 13, badge: "Chapitre 13" };

// 16. Chapitre 14 : Les Vrais Fondamentaux du Branding (formerly Ch 12)
const ch14 = { ...oldMap['chapitre-12'], id: "chapitre-14", number: 14, badge: "Chapitre 14" };

// 17. Chapitre 15 : Ton Premier Logo : Zéro Prise de Tête (formerly Ch 13)
const ch15 = { ...oldMap['chapitre-13'], id: "chapitre-15", number: 15, badge: "Chapitre 15" };

// 18. Chapitre 16 : Financer sans la banque & Maîtriser ses chiffres (formerly Ch 14)
const ch16 = { ...oldMap['chapitre-14'], id: "chapitre-16", number: 16, badge: "Chapitre 16" };

// 19. Chapitre 17 : Les outils selon ton business (formerly Ch 15)
const ch17 = { ...oldMap['chapitre-15'], id: "chapitre-17", number: 17, badge: "Chapitre 17" };

// 20. Chapitre 18 : Quand ça coince : surmonter l'échec et le rejet (formerly Ch 16)
const ch18 = { ...oldMap['chapitre-16'], id: "chapitre-18", number: 18, badge: "Chapitre 18" };

// 21. Chapitre 19 : Réseaux Sociaux (1/3) (formerly Ch 17)
const ch19 = { ...oldMap['chapitre-17'], id: "chapitre-19", number: 19, badge: "Chapitre 19" };

// 22. Chapitre 20 : Réseaux Sociaux (2/3) (formerly Ch 18)
const ch20 = { ...oldMap['chapitre-18'], id: "chapitre-20", number: 20, badge: "Chapitre 20" };

// 23. Chapitre 21 : Réseaux Sociaux (3/3) (formerly Ch 19)
const ch21 = { ...oldMap['chapitre-19'], id: "chapitre-21", number: 21, badge: "Chapitre 21" };

// 24. Chapitre 22 : Le Pitch en Une Phrase (formerly Ch 20)
const ch22 = { ...oldMap['chapitre-20'], id: "chapitre-22", number: 22, badge: "Chapitre 22" };

// 25. Chapitre 23 : Tes 30 premiers jours d'action (formerly Ch 21)
const ch23 = { ...oldMap['chapitre-21'], id: "chapitre-23", number: 23, badge: "Chapitre 23" };

// 26. Conclusion
const chConclusion = { ...oldMap['conclusion'], number: 24, badge: "Conclusion & Passage à l'Action" };

const newChapters = [
    chCouverture,
    chAvantPropos,
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
    chConclusion
];

const newGuideData = {
    meta: {
        title: "Les fondamentaux de l'entrepreneur — Tome 1",
        subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
        author: "Domtom Connect",
        edition: "2026 — Édition Interactive Enrichie",
        totalChapters: 23
    },
    chapters: newChapters
};

const output = `/**\n * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1\n * Écosystème Domtom Connect\n * Version Interactive & Enrichie 2026\n */\n\nwindow.GUIDE_DATA = ${JSON.stringify(newGuideData, null, 4)};\n`;

fs.writeFileSync('assets/data/guide-tome1.js', output, 'utf8');
console.log("Successfully rebuilt assets/data/guide-tome1.js with", newChapters.length, "chapters!");
newChapters.forEach((c, i) => console.log(`${i}: id=${c.id}, number=${c.number}, badge=${c.badge}, title=${c.title}`));
