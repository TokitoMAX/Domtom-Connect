const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('assets/data/guide-tome1.js');
let raw = fs.readFileSync(targetPath, 'utf8');

// Load existing data
let window = {};
eval(raw);
const data = window.GUIDE_DATA;

// 1. Update Chapter 9 (Branding)
const c9 = data.chapters.find(c => c.id === 'chapitre-9');
if (c9) {
    c9.badge = "Masterclass Branding & Identité";
    c9.title = "Branding, Logo & Identité Visuelle Fondatrice";
    c9.subtitle = "Les 5 archétypes de logos, la règle 60-30-10, la typographie et les lois fondamentales de la marque.";
    c9.readTime = "10 min";
    c9.content = `
        <p class="lead-text">
            Le branding n'est pas un fichier PNG avec un joli dégradé. Le branding, c'est l'émotion, le respect et les mots exacts que les gens utilisent pour parler de toi quand tu n'es pas dans la pièce.
        </p>
        <p>
            Si ton discours vante l'excellence et la proximité, mais que tes visuels sont amateurs, tes polices illisibles et tes délais non respectés... ton branding est mort avant d'avoir commencé.
        </p>

        <h3>Les 5 Grands Archétypes de Logos : Anatomie & Quand les Choisir</h3>
        <p>
            Ne perds pas des semaines à hésiter sur Canva ou à payer 2 000€ chez une agence avant ta première vente. Choisis l'un des <strong>5 archétypes fondamentaux</strong> selon ton modèle :
        </p>

        <div class="branding-archetypes-grid">
            <div class="branding-archetype-card">
                <div>
                    <div class="archetype-header">
                        <div class="archetype-icon-box"><i class="fa-solid fa-font"></i></div>
                        <div>
                            <h4 class="archetype-title">1. Wordmark / Typographique Pur</h4>
                            <span class="archetype-examples">Exemples : Dior, Sony, Feed, Zara, Respire</span>
                        </div>
                    </div>
                    <p style="font-size:0.9rem; color: var(--text-secondary); line-height: 1.5;">
                        <strong>Quand le choisir :</strong> Quand ton nom de marque est court (1 à 2 mots), percutant et facile à prononcer. Aucun dessin complexe ne vient brouiller la lecture.
                    </p>
                    <p style="font-size:0.85rem; color: #10b981;">
                        <strong>Avantage clé :</strong> Clarté absolue, mémorisation directe du nom, intemporel et facile à décliner sur packaging.
                    </p>
                </div>
                <div class="archetype-prompt-box">
                    <strong>Prompt IA / Brief Graphiste :</strong><br>
                    <em>"Minimalist high-end typography wordmark logo for [Nom], luxury modern sans-serif font, bold, ultra-clean kerning, black vector on pure white background --no mockups"</em>
                </div>
            </div>

            <div class="branding-archetype-card">
                <div>
                    <div class="archetype-header">
                        <div class="archetype-icon-box"><i class="fa-solid fa-signature"></i></div>
                        <div>
                            <h4 class="archetype-title">2. Monogramme / Initiales</h4>
                            <span class="archetype-examples">Exemples : YSL, Louis Vuitton (LV), Chanel (CC), DTC</span>
                        </div>
                    </div>
                    <p style="font-size:0.9rem; color: var(--text-secondary); line-height: 1.5;">
                        <strong>Quand le choisir :</strong> Quand ton nom de marque complet comporte 2 à 4 mots longs ou prestigieux. Les initiales créent un emblème géométrique compact.
                    </p>
                    <p style="font-size:0.85rem; color: #10b981;">
                        <strong>Avantage clé :</strong> Statut statutaire immédiat, parfait pour les broderies, gravures, tampons et photos de profil compactes.
                    </p>
                </div>
                <div class="archetype-prompt-box">
                    <strong>Prompt IA / Brief Graphiste :</strong><br>
                    <em>"Elegant interlocking monogram logo featuring letters [Initiales], geometric luxury symmetry, gold foil accent on obsidian background, vectors only"</em>
                </div>
            </div>

            <div class="branding-archetype-card">
                <div>
                    <div class="archetype-header">
                        <div class="archetype-icon-box"><i class="fa-solid fa-shapes"></i></div>
                        <div>
                            <h4 class="archetype-title">3. Symbole / Pictogramme Universel</h4>
                            <span class="archetype-examples">Exemples : Apple, Nike (Swoosh), Twitter/X, Target</span>
                        </div>
                    </div>
                    <p style="font-size:0.9rem; color: var(--text-secondary); line-height: 1.5;">
                        <strong>Quand le choisir :</strong> Quand une forme visuelle unique exprime instantanément ton univers sans nécessiter de traduction textuelle.
                    </p>
                    <p style="font-size:0.85rem; color: #10b981;">
                        <strong>Avantage clé :</strong> Reconnaissance visuelle en 0,2 seconde sur mobile, favicons, icônes d'application et étiquettes.
                    </p>
                </div>
                <div class="archetype-prompt-box">
                    <strong>Prompt IA / Brief Graphiste :</strong><br>
                    <em>"Modern iconic pictorial logo symbol of [Symbole souhaité], geometric silhouette, flat vector, memorable at 32x32 pixels, negative space design"</em>
                </div>
            </div>

            <div class="branding-archetype-card">
                <div>
                    <div class="archetype-header">
                        <div class="archetype-icon-box"><i class="fa-solid fa-shield-halved"></i></div>
                        <div>
                            <h4 class="archetype-title">4. Blason / Sceau de Terroir</h4>
                            <span class="archetype-examples">Exemples : Porsche, Starbucks, Rhums Agricoles, Épiceries</span>
                        </div>
                    </div>
                    <p style="font-size:0.9rem; color: var(--text-secondary); line-height: 1.5;">
                        <strong>Quand le choisir :</strong> Produits de terroir antillais/africains, artisanat patrimonial, gastronomie, spiritueux et marques d'héritage.
                    </p>
                    <p style="font-size:0.85rem; color: #10b981;">
                        <strong>Avantage clé :</strong> Inspire l'authenticité ancestrale, le savoir-faire artisanal garanti et la fierté d'appartenance.
                    </p>
                </div>
                <div class="archetype-prompt-box">
                    <strong>Prompt IA / Brief Graphiste :</strong><br>
                    <em>"Heritage vintage emblem seal logo for [Marque], artisanal crest with tropical botanical wreath, established year banner, vector line art"</em>
                </div>
            </div>

            <div class="branding-archetype-card">
                <div>
                    <div class="archetype-header">
                        <div class="archetype-icon-box"><i class="fa-solid fa-user-tie"></i></div>
                        <div>
                            <h4 class="archetype-title">5. Personal Branding & Mascotte</h4>
                            <span class="archetype-examples">Exemples : Anthony Bourbon, Kelly Massol, Michelin</span>
                        </div>
                    </div>
                    <p style="font-size:0.9rem; color: var(--text-secondary); line-height: 1.5;">
                        <strong>Quand le choisir :</strong> Prestations de services B2B, coaching, consulting, création de contenu où le visage du fondateur est le moteur de confiance n°1.
                    </p>
                    <p style="font-size:0.85rem; color: #10b981;">
                        <strong>Avantage clé :</strong> Impossible à copier par la concurrence. Le capital sympathie et l'histoire personnelle vendent plus vite que n'importe quelle publicité.
                    </p>
                </div>
                <div class="archetype-prompt-box">
                    <strong>Règle d'or :</strong><br>
                    <em>Photo de profil haute définition prise de face, éclairage studio naturel, regard direct dans l'objectif, fond uni contrasté aux couleurs de ta charte.</em>
                </div>
            </div>
        </div>

        <h3>La Règle d'Or des Couleurs : L'Architecture 60 - 30 - 10</h3>
        <p>
            Ne choisis pas des couleurs au hasard. Respecte scrupuleusement la règle des décorateurs et designers professionnels :
        </p>
        <ul>
            <li><strong>60% — Couleur Dominante de Fond :</strong> La couleur d'ambiance générale (ex: Blanc crème éclatant ou Noir obsidienne profond).</li>
            <li><strong>30% — Couleur de Structure :</strong> La couleur des textes, cartes et éléments de réassurance (ex: Vert forêt, Bleu marine, Terracotta).</li>
            <li><strong>10% — Couleur d'Accent & Conversion :</strong> Réservée <strong>exclusivement</strong> à tes boutons d'achat, promotions et liens d'action (ex: Or impérial, Orange mangue, Vert menthe néon).</li>
        </ul>

        <div class="color-palettes-grid">
            <div class="color-palette-card">
                <h5>1. Émeraude Royale & Or (Luxe Végétal & Cosmétique)</h5>
                <div class="palette-swatches-row">
                    <div class="swatch-item swatch-60" style="background:#0F382C;">#0F382C (60%)</div>
                    <div class="swatch-item swatch-30" style="background:#1B4D3E;">#1B4D3E (30%)</div>
                    <div class="swatch-item swatch-10" style="background:#D4AF37; color:#000;">#D4AF37 (10%)</div>
                </div>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">Évoque la santé des plantes nobles, la régénération cellulaire et le prestige caribéen.</p>
            </div>

            <div class="color-palette-card">
                <h5>2. Terracotta & Soleil Ocre (Terroirs, Food & Artisanat)</h5>
                <div class="palette-swatches-row">
                    <div class="swatch-item swatch-60" style="background:#E07A5F;">#E07A5F (60%)</div>
                    <div class="swatch-item swatch-30" style="background:#3D405B;">#3D405B (30%)</div>
                    <div class="swatch-item swatch-10" style="background:#F2CC8F; color:#000;">#F2CC8F (10%)</div>
                </div>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">Évoque la terre cuite, la chaleur des épices, la convivialité et l'authenticité.</p>
            </div>

            <div class="color-palette-card">
                <h5>3. Tech Nuit & Émeraude Digitale (Services B2B & Finance)</h5>
                <div class="palette-swatches-row">
                    <div class="swatch-item swatch-60" style="background:#0B0F19;">#0B0F19 (60%)</div>
                    <div class="swatch-item swatch-30" style="background:#1E293B;">#1E293B (30%)</div>
                    <div class="swatch-item swatch-10" style="background:#10B981; color:#000;">#10B981 (10%)</div>
                </div>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">Évoque la modernité technologique, la rentabilité financière et la rigueur d'exécution.</p>
            </div>
        </div>

        <h3>Les 3 Grandes Lois Fondatrices du Branding Durable</h3>
        <ol>
            <li><strong>La Loi de la Catégorie (Al Ries & Jack Trout) :</strong> <em>« Si tu ne peux pas être le premier d'une catégorie existante, crée une nouvelle sous-catégorie où tu seras le premier. »</em> Ne sois pas "un énième freelance en marketing" : sois "le seul spécialiste de l'acquisition WhatsApp Business pour les commerces de Guadeloupe".</li>
            <li><strong>La Loi de la Vache Pourpre (Seth Godin) :</strong> Dans un pré rempli de vaches noires et blanches, personne ne ralentit sa voiture. Si une vache est pourpre, tout le monde prend une photo. Quel est le détail remarquable qui fait parler de toi gratuitement ?</li>
            <li><strong>L'Épreuve du T-Shirt (Community Branding) :</strong> Pose-toi la question : <em>« Est-ce qu'un client fier accepterait de porter un t-shirt avec mon logo dans la rue ? »</em> Si la réponse est oui, tu as créé une tribu. Si la réponse est non, tu n'as qu'une étiquette commerciale.</li>
        </ol>
    `;

    c9.exercise = {
        id: "ex_chapitre_9",
        title: "Cahier des Charges de Ton Identité & Branding",
        description: "Pose les fondations graphiques et stratégiques de ton image de marque :",
        fields: [
            {
                id: "branding_nom_officiel",
                type: "text",
                label: "Nom officiel de ta marque ou de ton projet :",
                placeholder: "Ex: KréyolTech / Nappy Botanicals / Atelier Gwada..."
            },
            {
                id: "branding_type_logo",
                type: "select",
                label: "Quel archétype de logo choisis-tu pour ton positionnement ?",
                options: [
                    { value: "wordmark", label: "1. Wordmark / Typographique Pur (Nom lisible épuré - style Respire/Zara)" },
                    { value: "monogramme", label: "2. Monogramme (Initiales prestigieuses - style Chanel/LV/YSL)" },
                    { value: "symbole", label: "3. Symbole / Pictogramme Universel (Icône mémorisable sur mobile)" },
                    { value: "embleme_sceau", label: "4. Blason / Sceau de Terroir (Authenticité, patrimoine, artisanat)" },
                    { value: "personal_branding", label: "5. Personal Branding (Le créateur incarne directement la marque)" }
                ]
            },
            {
                id: "branding_brief_prompt",
                type: "textarea",
                label: "Ton prompt IA ou brief graphiste pour créer ton logo :",
                placeholder: "Ex: Logo Wordmark minimaliste pour marque de soins capillaires 'Nappy Botanicals'. Typographie moderne sans-serif, lignes pures, inspirant la confiance médicale et la douceur des plantes. Noir vectoriel sur fond blanc."
            },
            {
                id: "branding_palette_couleurs",
                type: "text",
                label: "Tes 3 teintes majeures selon la règle 60-30-10 (Codes HEX ou noms) :",
                placeholder: "Ex: 60% Fond Blanc cassé (#FAF9F6) / 30% Vert Émeraude foncé (#0F382C) / 10% Or Impérial CTA (#D4AF37)"
            },
            {
                id: "branding_duo_typo",
                type: "text",
                label: "Ton duo typographique (Police de Titre forte + Police de lecture fluide) :",
                placeholder: "Ex: Titres : Plus Jakarta Sans (Gras 800) | Corps de texte : Inter (Régulier 400)"
            },
            {
                id: "branding_archetype",
                type: "select",
                label: "L'archétype de personnalité de ta marque (Carl Jung) :",
                options: [
                    { value: "expert", label: "L'Expert Rigoureux (Précis, scientifique, gage de résultat mesurable)" },
                    { value: "rebelle", label: "Le Rebelle sans Filtre (Casse les codes, franchise totale, audace)" },
                    { value: "bienveillant", label: "Le Guide Bienveillant (Chaleur humaine, écoute fraternelle, soutien)" },
                    { value: "artisan", label: "L'Artisan Passionné (Amour du travail bien fait, terroirs, traditions)" },
                    { value: "hero", label: "Le Héros Déterminé (Dépassement de soi, discipline, victoire sur l'obstacle)" }
                ]
            },
            {
                id: "branding_vache_pourpre",
                type: "textarea",
                label: "Ta 'Vache Pourpre' : Quelle est ta singularité remarquable qu'aucun concurrent n'ose faire ?",
                placeholder: "Ex: Nous préparons les soins capillaires à la commande sous les yeux de la cliente et offrons un diagnostic trichologique gratuit par microscope sur place..."
            },
            {
                id: "valeur_non_negociable",
                type: "text",
                label: "L'Anti-Marque : La pratique que ta marque refuse catégoriquement d'adopter :",
                placeholder: "Ex: Jamais de promesse mensongère de résultat en 48h, jamais de produits formulés à base de silicones ou parabènes."
            }
        ]
    };
}

// 2. Update Chapter 10 (Offre & Pricing)
const c10 = data.chapters.find(c => c.id === 'chapitre-10');
if (c10) {
    c10.badge = "Stratégie Offre & Prix";
    c10.title = "Architecture de l'Offre Irrésistible & Stratégie de Pricing";
    c10.subtitle = "Arrête de te brader. L'Équation de la Valeur d'Alex Hormozi et l'Échelle de Valeur en 3 Paliers.";
    c10.readTime = "9 min";
    c10.content = `
        <p class="lead-text">
            Vendre pas cher est le piège mortel du débutant qui manque de confiance en lui.
        </p>
        <p>
            Quand tu fixes un prix au rabais en te disant <em>« comme ça tout le monde pourra acheter »</em>, voici ce qui se passe réellement sur le terrain :
        </p>
        <ul>
            <li>Tu attires les clients les plus exigeants, les plus toxiques et les moins reconnaissants de ton travail.</li>
            <li>Tu n'as plus aucune marge de sécurité pour absorber un aléa logistique, payer ton fret maritime ou offrir un cadeau à tes clients.</li>
            <li>Tu envoies un signal de mauvaise qualité (dans l'esprit du public : pas cher = suspect ou bas de gamme).</li>
        </ul>

        <h3>L'Équation de la Valeur d'Alex Hormozi ($100M Offers)</h3>
        <p>
            Pour faire payer 500€, 1 500€ ou 3 000€ à un client sans qu'il négocie, tu dois maximiser la <strong>valeur perçue</strong> selon cette formule mathématique universelle :
        </p>
        <div class="highlight-box">
            <h4 style="margin:0 0 10px 0;"><i class="fa-solid fa-brain"></i> La Formule de la Valeur Perçue</h4>
            <p style="font-size:1.1rem; font-weight:700; color:#10b981; margin:0 0 12px 0;">
                VALEUR = (Rêve Résolu × Certitude de Réussite) ÷ (Délai de Réalisation × Effort & Sacrifice)
            </p>
            <ul style="font-size:0.95rem; margin:0; padding-left:20px; line-height:1.6;">
                <li><strong>Augmente le numérateur :</strong> Montre une transformation spectaculaire et prouve avec des témoignages irréfutables que ton client va réussir.</li>
                <li><strong>Divise le dénominateur :</strong> Réduis le temps nécessaire pour obtenir le premier résultat et prends en charge le travail fastidieux à sa place.</li>
            </ul>
        </div>

        <h3>La Suite d'Offres : Ne vends jamais un seul produit isolé</h3>
        <p>
            Un business solide ne repose pas sur une seule offre rigide. Il repose sur une <strong>Échelle de Valeur en 3 paliers</strong> :
        </p>
        <ol>
            <li><strong>1. L'Offre d'Entrée / Tripwire :</strong> Un mini-produit, kit échantillon ou audit flash (ex: 19€ à 49€) qui élimine la barrière psychologique et transforme un inconnu en client payant.</li>
            <li><strong>2. L'Offre Cœur (Core Offer) :</strong> Ton produit ou service phare (ex: 75€ à 250€ pour un produit, 700€ à 1 800€ pour une prestation). C'est le moteur principal qui génère ton volume de marge saine.</li>
            <li><strong>3. L'Offre Haute Valeur / VIP ou B2B :</strong> Un accompagnement sur-mesure, une cure complète exclusive ou un pack revendeur (ex: 1 500€ à 3 500€). Seuls 5% à 10% de tes clients la prendront, mais elle représentera 40% de ton bénéfice net !</li>
        </ol>
    `;
}

// 3. Update Chapter 12 (Zoom Opérationnel par Secteur)
const c12 = data.chapters.find(c => c.id === 'chapitre-12');
if (c12) {
    c12.badge = "Chapitre Opérationnel Modulaire";
    c12.title = "Zoom sur ton secteur : Les 5 Voies Terrain (Modulable)";
    c12.subtitle = "Choisis ton secteur d'activité pour afficher ton plan d'action personnalisé et tes questions exclusives.";
    c12.readTime = "12 min";
    c12.content = `
        <p class="lead-text">
            Il n'y a rien de pire qu'un conseil généraliste. Créer une marque de cosmétique avec un laboratoire n'a rien à voir avec lancer une agence de services B2B ou ouvrir un concept de street-food antillaise.
        </p>
        <p>
            Ce chapitre s'adapte à 100% à ta réalité terrain. <strong>Clique ci-dessous sur ton secteur d'activité</strong> pour déverrouiller ton plan d'action exclusif et adapter instantanément ton carnet de bord :
        </p>

        <!-- Interactive Sector Switcher Banner -->
        <div class="sector-switcher-banner">
            <div class="sector-switcher-header">
                <h3><i class="fa-solid fa-layer-group"></i> Sélectionne ton Modèle Économique</h3>
                <p>Clique sur l'une des 5 voies ci-dessous pour filtrer les conseils et les champs du carnet de bord :</p>
            </div>
            <div class="sector-tabs-grid">
                <button type="button" class="sector-tab-btn active" data-target-sector="physique">
                    <div class="sector-tab-top"><i class="fa-solid fa-bottle-droplet"></i> <span>Voie 1</span></div>
                    <div class="sector-tab-title">Produits Physiques & Terroirs</div>
                    <div class="sector-tab-desc">Cosmétique, mode, usines, DIP & fret maritime.</div>
                </button>
                <button type="button" class="sector-tab-btn" data-target-sector="service">
                    <div class="sector-tab-top"><i class="fa-solid fa-handshake-angle"></i> <span>Voie 2</span></div>
                    <div class="sector-tab-title">Services & Agence B2B</div>
                    <div class="sector-tab-desc">0€ de stock, closing direct DM & 80%+ marge.</div>
                </button>
                <button type="button" class="sector-tab-btn" data-target-sector="digital">
                    <div class="sector-tab-top"><i class="fa-solid fa-laptop-code"></i> <span>Voie 3</span></div>
                    <div class="sector-tab-title">Produits Digitaux & E-books</div>
                    <div class="sector-tab-desc">Marge brute > 95%, vente automatisée 24h/24.</div>
                </button>
                <button type="button" class="sector-tab-btn" data-target-sector="food">
                    <div class="sector-tab-top"><i class="fa-solid fa-utensils"></i> <span>Voie 4</span></div>
                    <div class="sector-tab-title">Restauration & Food</div>
                    <div class="sector-tab-desc">Street-food, HACCP, Dark Kitchen & ratio &lt; 28%.</div>
                </button>
                <button type="button" class="sector-tab-btn" data-target-sector="commerce">
                    <div class="sector-tab-top"><i class="fa-solid fa-shop"></i> <span>Voie 5</span></div>
                    <div class="sector-tab-title">Commerce & Achat-Revente</div>
                    <div class="sector-tab-desc">Grossistes, coefficient &gt; x2.2 & trésorerie.</div>
                </button>
            </div>
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
                <h4><i class="fa-solid fa-utensils"></i> Voie 4 : Restauration, Street-Food & Agroalimentaire</h4>
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
    `;

    c12.exercise = {
        id: "ex_chapitre_12",
        title: "Plan d'Action Sur-Mesure Dédié à Ton Secteur",
        description: "Ce carnet de bord s'adapte en direct à ton secteur : seuls les champs qui concernent ton business s'affichent :",
        fields: [
            // Field 0: Selector (Sector: all)
            {
                id: "secteur_activite_selection",
                sector: "all",
                type: "select",
                label: "Confirme ton secteur d'activité pour adapter le formulaire :",
                options: [
                    { value: "physique", label: "1. Marque de Produit Physique (Cosmétique, Mode, Terroirs, Objets)" },
                    { value: "service", label: "2. Prestation de Services / Freelance / Agence B2B (Zéro stock)" },
                    { value: "digital", label: "3. Produit Digital / E-book / Formation en ligne" },
                    { value: "food", label: "4. Restauration / Street-Food / Dark Kitchen / Agroalimentaire" },
                    { value: "commerce", label: "5. Commerce / Boutique / Achat-Revente" }
                ]
            },

            // Sector 1: PHYSIQUE
            {
                id: "sec_volet_physique",
                sector: "physique",
                type: "section-header",
                icon: "fa-solid fa-bottle-droplet",
                label: "Feuille de Route : Produit Physique & Cosmétique"
            },
            {
                id: "physique_fournisseur_labo",
                sector: "physique",
                type: "text",
                label: "Usine, laboratoire façonnier ou atelier contacté :",
                placeholder: "Ex: Laboratoire en région PACA pour la formulation / Façonnier cosmétique local..."
            },
            {
                id: "physique_statut_echantillon",
                sector: "physique",
                type: "select",
                label: "Statut des échantillons et tests de tenue :",
                options: [
                    { value: "recherche", label: "Phase de sourcing et demandes de devis" },
                    { value: "commande", label: "Échantillon payé et en cours de livraison" },
                    { value: "test", label: "Échantillon reçu en test terrain (climat, texture, odeur)" },
                    { value: "valide", label: "Échantillon 100% validé pour précommandes" }
                ]
            },
            {
                id: "physique_normes_dip",
                sector: "physique",
                type: "text",
                label: "Conformité réglementaire (DIP, tests toxicologiques, portail CPNP) :",
                placeholder: "Ex: Toxicologue identifié (devis 950€) / Tests de stabilité 3 mois programmés."
            },
            {
                id: "physique_moq_fret",
                sector: "physique",
                type: "text",
                label: "MOQ (quantité minimale), coût unitaire cible et mode de fret prévu :",
                placeholder: "Ex: Première commande de 300 unités à 4,20€/pièce. Fret maritime groupé LCL + prévision octroi de mer 14%."
            },

            // Sector 2: SERVICE B2B
            {
                id: "sec_volet_services",
                sector: "service",
                type: "section-header",
                icon: "fa-solid fa-handshake-angle",
                label: "Feuille de Route : Prestations de Services & Agence B2B"
            },
            {
                id: "service_packaging_offre",
                sector: "service",
                type: "textarea",
                label: "Intitulé et packaging de ton offre de service forfaitisée :",
                placeholder: "Ex: Pack Visibilité Express : 8 vidéos courtes produites par mois + optimisation profil Instagram & fiche Google Maps pour 850€/mois."
            },
            {
                id: "service_cible_b2b",
                sector: "service",
                type: "text",
                label: "Profil précis du client cible qui a le budget pour payer (500€ à 2 500€) :",
                placeholder: "Ex: Restaurateurs et gérants d'instituts de beauté locaux réalisant plus de 150k€ de CA annuel."
            },
            {
                id: "service_livrables_perimetre",
                sector: "service",
                type: "textarea",
                label: "Périmètre strict : ce qui est inclus vs ce qui est facturé en supplément :",
                placeholder: "Inclus : Tournage, montage, publication des 8 vidéos.\nNon inclus : Réponse aux DMs clients (option à +200€/mois), campagnes publicitaires payantes."
            },
            {
                id: "service_processus_closing",
                sector: "service",
                type: "text",
                label: "Ton processus de closing (Script DM -> Appel 15 min -> Devis avec acompte 50%) :",
                placeholder: "Ex: Message vocal personnalisé sur Instagram -> Visio 15 min de diagnostic gratuit -> Signature devis avec 50% d'acompte obligatoire."
            },

            // Sector 3: DIGITAL
            {
                id: "sec_volet_digital",
                sector: "digital",
                type: "section-header",
                icon: "fa-solid fa-laptop-code",
                label: "Feuille de Route : Produits Digitaux & E-books"
            },
            {
                id: "digital_format_promesse",
                sector: "digital",
                type: "text",
                label: "Format de ton produit digital et promesse de résultat :",
                placeholder: "Ex: E-book interactif + Pack 15 templates Notion pour organiser sa comptabilité d'auto-entrepreneur en 1 week-end."
            },
            {
                id: "digital_lead_magnet",
                sector: "digital",
                type: "text",
                label: "Ton Lead Magnet gratuit pour capturer emails & numéros WhatsApp :",
                placeholder: "Ex: Checklist PDF offerte 'Les 10 erreurs fiscales à éviter avant d'immatriculer sa micro-entreprise'."
            },
            {
                id: "digital_stack_technique",
                sector: "digital",
                type: "text",
                label: "Plateforme d'hébergement, encaissement et livraison automatique :",
                placeholder: "Ex: Hébergement Payhip / Encaissement Stripe & PayPal / E-mail de livraison automatique immédiate."
            },
            {
                id: "digital_tunnel_acquisition",
                sector: "digital",
                type: "textarea",
                label: "Stratégie d'acquisition organique (Hook -> Bio -> Gratuit -> Vente) :",
                placeholder: "Ex: 2 vidéos TikTok/Reels par jour avec accroche sur un point de douleur fiscal -> Lien en bio vers la checklist gratuite -> Séquence de 3 emails de valeur avec offre promo 48h à 27€."
            },

            // Sector 4: RESTAURATION / FOOD
            {
                id: "sec_volet_food",
                sector: "food",
                type: "section-header",
                icon: "fa-solid fa-utensils",
                label: "Feuille de Route : Restauration, Food & Agroalimentaire"
            },
            {
                id: "food_recette_signature",
                sector: "food",
                type: "text",
                label: "Ton plat signature et concept distinctif :",
                placeholder: "Ex: Bokit artisanal au porc roussi mariné 24h et sauce piment doux maison."
            },
            {
                id: "food_cout_matiere",
                sector: "food",
                type: "text",
                label: "Calcul du coût matière portion vs prix de vente TTC (Cible < 28%) :",
                placeholder: "Ex: Coût des ingrédients : 2,60€ par portion | Prix de vente formule : 11,50€ TTC | Ratio : 22,6% (Marge brute saine)."
            },
            {
                id: "food_hygiene_haccp",
                sector: "food",
                type: "select",
                label: "Conformité sanitaire et chaîne du froid :",
                options: [
                    { value: "haccp_valide", label: "Formation HACCP validée et fiches de traçabilité prêtes" },
                    { value: "haccp_en_cours", label: "Formation HACCP en cours d'inscription" },
                    { value: "haccp_a_faire", label: "Formation à programmer avant ouverture" }
                ]
            },
            {
                id: "food_mode_distribution",
                sector: "food",
                type: "text",
                label: "Emplacement ou modèle opérationnel (Food-truck, Dark Kitchen, Click & Collect) :",
                placeholder: "Ex: Dark kitchen partagée avec commande préalable sur WhatsApp et livraison en point relais le midi."
            },

            // Sector 5: COMMERCE & ACHAT-REVENTE
            {
                id: "sec_volet_commerce",
                sector: "commerce",
                type: "section-header",
                icon: "fa-solid fa-shop",
                label: "Feuille de Route : Commerce, Boutique & Achat-Revente"
            },
            {
                id: "commerce_fournisseurs_grossistes",
                sector: "commerce",
                type: "text",
                label: "Fournisseurs grossistes identifiés et délais de livraison :",
                placeholder: "Ex: Grossiste textile en France métropolitaine, franco de port à 500€, délai de livraison 7 jours."
            },
            {
                id: "commerce_coefficient_marge",
                sector: "commerce",
                type: "text",
                label: "Coefficient multiplicateur appliqué sur le prix d'achat HT (min x2.2) :",
                placeholder: "Ex: Produit acheté 12€ HT -> Vendu 29€ TTC (Coefficient x2.41 pour couvrir charges et invendus)."
            },
            {
                id: "commerce_plan_rotation_stock",
                sector: "commerce",
                type: "textarea",
                label: "Plan d'écoulement à 30 jours et politique anti-dormance de stock :",
                placeholder: "Ex: Test sur micro-séries de 15 pièces par modèle. Si un article ne s'écoule pas en 25 jours, mise en avant 'Vente Flash -20%' le week-end."
            }
        ]
    };
}

// 4. Update Chapter 15 (Réseaux Sociaux & Marketing)
const c15 = data.chapters.find(c => c.id === 'chapitre-15');
if (c15) {
    c15.badge = "Stratégie Vente & Réseaux";
    c15.title = "Réseaux Sociaux : Matrice des 5 Canaux, Lois Marketing & Closing DM";
    c15.subtitle = "Du parfait inconnu au client fidèle : le tunnel TOFU-MOFU-BOFU, le script de closing en DM et 10 hooks viraux.";
    c15.readTime = "12 min";
    c15.content = `
        <p class="lead-text">
            Mettons les choses au clair une bonne fois pour toutes : <strong>avoir beaucoup d'abonnés ne veut absolument pas dire avoir un business qui gagne de l'argent</strong>.
        </p>
        <p>
            L'équation fondamentale de la monétisation moderne se résume en une formule :<br>
            <strong style="color: var(--accent); font-size: 1.25rem; display: block; margin: 14px 0;">ATTENTION QUALIFIÉE + OFFRE IRRÉSISTIBLE = CASHFLOW RÉCURRENT</strong>
        </p>

        <h3>Le Tunnel d'Acquisition Moderne : De l'Inconnu à l'Acheteur</h3>
        <div class="funnel-phases-grid">
            <div class="funnel-phase-card">
                <span class="phase-pill phase-tofu">1. TOFU (Découverte Virale)</span>
                <h4 style="margin:0 0 8px 0; color:#ffffff;">TikTok & Reels</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
                    Vidéos courtes (15 à 45s) avec un <strong>Hook percutant en moins de 3 secondes</strong>. Zéro abonné nécessaire. L'algorithme pousse la vidéo vers de parfaits inconnus.
                </p>
            </div>
            <div class="funnel-phase-card">
                <span class="phase-pill phase-mofu">2. MOFU (Confiance & Autorité)</span>
                <h4 style="margin:0 0 8px 0; color:#ffffff;">Stories & YouTube Long</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
                    Stories Instagram quotidiennes pour montrer les coulisses et l'authenticité. Vidéos YouTube de fond (12 à 25 min) qui prouvent ton expertise sur 5 ans.
                </p>
            </div>
            <div class="funnel-phase-card">
                <span class="phase-pill phase-bofu">3. BOFU (Closing Direct)</span>
                <h4 style="margin:0 0 8px 0; color:#ffffff;">DMs & WhatsApp Business</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
                    La conversion finale en tête-à-tête. <strong>WhatsApp Business est le canal n°1 en Outre-mer et en Afrique (>90% de taux d'ouverture)</strong>.
                </p>
            </div>
        </div>

        <h3>Le Script de Closing en DM en 4 Étapes (Sans Passer pour un Vendeur Lourd)</h3>
        <p>
            Arrête d'envoyer des copier-coller impersonnels qui finissent à la corbeille. Voici la méthode conversationnelle en 4 étapes qui convertit 1 prospect sur 3 :
        </p>

        <div class="script-box-container">
            <div class="script-step">
                <div class="script-step-title">Étape 1 : La Connexion Humaine (Pas de vente)</div>
                <div class="script-step-example">« Salut [Prénom], j'ai vu ta dernière story sur [sujet]. Bravo pour [détail précis], le concept est top ! »</div>
            </div>
            <div class="script-step">
                <div class="script-step-title">Étape 2 : Le Diagnostic Flash (Poser une question ouverte sur son blocage)</div>
                <div class="script-step-example">« Par curiosité, sur la partie [sujet lié à ton expertise], tu t'organises comment aujourd'hui pour trouver des clients ? »</div>
            </div>
            <div class="script-step">
                <div class="script-step-title">Étape 3 : La Prescription Gratuite (Prouver sa valeur immédiatement)</div>
                <div class="script-step-example">« Je vois totalement le souci. Si j'étais à ta place, je testerais tout de suite [1 micro-conseil précis et immédiatement applicable]. Ça te débloquerait 80% du problème. »</div>
            </div>
            <div class="script-step">
                <div class="script-step-title">Étape 4 : La Proposition Sans Pression</div>
                <div class="script-step-example">« Si tu veux qu'on pose ça proprement ensemble, je fais 2 diagnostics gratuits de 15 minutes cette semaine. Dis-moi si ça te dit qu'on regarde ça ensemble jeudi matin ? »</div>
            </div>
        </div>

        <h3>La Réserve des 10 Hooks Viraux Prêts à l'Emploi</h3>
        <p>
            Utilise ces formules d'accroche pour tes 3 premières secondes de vidéo afin de stopper le scroll :
        </p>
        <ol style="font-size:0.95rem; line-height:1.7;">
            <li><em>« Arrêtez immédiatement de faire [Erreur courante] si vous voulez [Résultat désiré]... »</em></li>
            <li><em>« 90% des entrepreneurs dans [Secteur] se font avoir sur ce détail tout bête... »</em></li>
            <li><em>« Comment j'ai fait [Résultat chiffré] en [Délai court] avec 0€ de budget de départ... »</em></li>
            <li><em>« La vérité que personne n'ose vous dire sur [Sujet polémique] en [Région]... »</em></li>
            <li><em>« Si je devais tout recommencer de zéro aujourd'hui avec seulement 100€, voici exactement ce que je ferais... »</em></li>
        </ol>
    `;

    c15.exercise = {
        id: "ex_chapitre_15",
        title: "Plan d'Action Réseaux Sociaux & Script de Closing",
        description: "Configure ton tunnel d'acquisition et prépare tes contenus à fort impact :",
        fields: [
            {
                id: "reseau_social_prioritaire",
                type: "select",
                label: "Quel est ton réseau d'acquisition prioritaire ce mois-ci ?",
                options: [
                    { value: "instagram", label: "1. Instagram (Stories quotidiennes & closing direct en DM)" },
                    { value: "tiktok", label: "2. TikTok / Shorts (Découverte virale avec Hooks 3s)" },
                    { value: "youtube_long", label: "3. YouTube Format Long (Autorité, tutoriels de fond, SEO sur 5 ans)" },
                    { value: "linkedin", label: "4. LinkedIn (B2B, partenariats avec entreprises, storytelling fondateur)" },
                    { value: "whatsapp", label: "5. WhatsApp Business (Statuts locaux & vente directe de proximité)" }
                ]
            },
            {
                id: "contenu_hook_viral_1",
                type: "text",
                label: "1. Ton Hook n°1 pour stopper le scroll en 3 secondes :",
                placeholder: "Ex: 'Arrêtez immédiatement de créer votre site web avant d'avoir fait ceci...' "
            },
            {
                id: "contenu_hook_viral_2",
                type: "text",
                label: "2. Ton Hook n°2 (Contre-intuitif ou chiffre marquant) :",
                placeholder: "Ex: 'Comment ce petit commerce de Fort-de-France a fait +4 000€ en 30 jours grâce à une simple liste WhatsApp...' "
            },
            {
                id: "script_closing_dm_perso",
                type: "textarea",
                label: "3. Ton script de message DM / WhatsApp personnalisé prêt à envoyer :",
                placeholder: "« Salut [Prénom], j'ai vu ta story sur [...]. Je remarque que beaucoup de pros comme toi galèrent sur [...]. J'ai préparé un mini-guide gratuit qui règle ça, tu veux que je te l'envoie ici ? »"
            },
            {
                id: "lien_canal_whatsapp",
                type: "url",
                label: "4. Ton lien WhatsApp Business (wa.me/...) ou lien de bio Instagram :",
                placeholder: "https://wa.me/596..."
            }
        ]
    };
}

// Write back cleanly
const outputJs = "/**\n * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1\n * Écosystème Domtom Connect\n * Version Interactive & Enrichie\n */\n\nwindow.GUIDE_DATA = " + JSON.stringify(data, null, 4) + ";\n";
fs.writeFileSync(targetPath, outputJs, 'utf8');
console.log('Successfully updated chapters in guide-tome1.js!');
