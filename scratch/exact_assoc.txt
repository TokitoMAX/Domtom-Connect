const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
const raw = fs.readFileSync(filePath, 'utf8');

eval(raw.replace('window.GUIDE_DATA =', 'global.GUIDE_DATA ='));
const oldChapters = global.GUIDE_DATA.chapters;

console.log('Current chapters count:', oldChapters.length);

// ------------------------------------------------------------------
// 1. CHAPITRE 6 : TROUVER SA NICHE RENTABLE SELON SA VOIE
// ------------------------------------------------------------------
const ch6Content = `
        <p class="lead-text">
            Le plus grand piège dans lequel tombent 9 débutants sur 10 est de penser que plus leur cible est large, plus ils ont de chances de vendre. <strong>C'est exactement l'inverse qui se produit.</strong>
        </p>
        <p>
            Quand tu tentes de parler à tout le monde, ton message devient tellement fade, tiède et impersonnel qu'il ne touche plus personne. Sur le terrain, <strong>les généralistes meurent de faim, pendant que les spécialistes imposent leurs tarifs sans négociation</strong>.
        </p>

        <!-- VS BOX GÉNÉRALISTE VS SPÉCIALISTE -->
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
                <p style="font-size:0.88rem; color:#6ee7b7; margin-bottom:8px;">« J'accompagne les mères actives débordées à retrouver 1h par jour » ou « Soin réparateur anti-chute pour tempes dégarnies »</p>
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
                <li><strong>1. Une douleur aiguë et urgente :</strong> Ton client n'a pas un simple "souhait", il a un problème qui le réveille la nuit et qu'il veut régler au plus vite.</li>
                <li><strong>2. Un pouvoir d'achat avéré :</strong> Ne cible pas une population qui n'a pas un centime ou qui cherche uniquement la gratuité. Cible des personnes qui ont l'habitude d'investir pour leur bien-être, leur statut ou leur business.</li>
                <li><strong>3. Une accessibilité simple :</strong> Tu sais exactement où ces personnes se regroupent (groupes WhatsApp, communautés Instagram, associations professionnelles, lieux de vie locaux).</li>
            </ul>
        </div>

        <!-- OPPORTUNITÉS DE NICHES RÉELLES ADAPTIVES PAR VOIE -->
        <h3>Opportunités Réelles du Marché Actuel (Adaptées à Ta Voie)</h3>
        <p>
            Pour ne pas chercher dans le vide, voici pour ton modèle économique <strong>3 niches concrètes, rentables et en forte demande non saturée</strong> sur nos territoires :
        </p>

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
`;

const ch6Exercise = {
    id: "ex_chapitre_6",
    title: "Ta Niche Rentable & Ton Client Cible",
    description: "Positionne-toi sur une cible précise pour ne plus jamais subir la guerre des prix :",
    fields: [
        {
            id: "niche_choisie_description",
            type: "textarea",
            label: "1. Quelle est ta sous-niche précise (Qui est ton client exclusif ?) :",
            placeholder: "Ex: 'Les propriétaires de villas et gîtes en Guadeloupe qui veulent des réservations directes sans payer 20% à Airbnb.'"
        },
        {
            id: "niche_douleur_urgente",
            type: "textarea",
            label: "2. Quelle est la douleur aiguë et urgente qui l'empêche de dormir ?",
            placeholder: "Ex: 'Voir 4 500€ de commissions prélevées par les plateformes chaque trimestre alors que ses charges de crédit augmentent.'"
        },
        {
            id: "niche_pouvoir_achat",
            type: "text",
            label: "3. Pourquoi cette cible a-t-elle le pouvoir d'achat nécessaire pour payer ton offre ?",
            placeholder: "Ex: 'Chaque réservation directe supplémentaire lui fait économiser immédiatement 250€, mon service est rentabilisé dès le 1er mois.'"
        },
        {
            id: "niche_lieu_accessibilite",
            type: "text",
            label: "4. Où peux-tu trouver et contacter facilement 20 personnes de cette niche dès cette semaine ?",
            placeholder: "Ex: 'Dans les groupes Facebook d'hébergeurs touristiques locaux et en prospection directe sur Google Maps.'"
        }
    ]
};

// ------------------------------------------------------------------
// 2. CHAPITRE 7 : ÉTUDE DE MARCHÉ COMMANDO — CONCURRENCE DIRECTE, INDIRECTE & HABITUDES
// ------------------------------------------------------------------
const ch7Content = `
        <p class="lead-text">
            Beaucoup de porteurs de projet disent fièrement : <em>« Je n'ai aucun concurrent, mon idée est 100% unique ! »</em>. <strong>C'est le signal d'alarme n°1.</strong>
        </p>
        <p>
            Si personne ne vend ce que tu veux vendre, c'est généralement parce qu'il n'y a <strong>aucun marché</strong> et que personne n'est prêt à payer pour ça. La présence de concurrents est une excellente nouvelle : elle prouve que des clients sortent leur carte bancaire tous les jours pour ce besoin. Ton seul travail est d'aller analyser leurs forces et d'exploiter leurs faiblesses.
        </p>

        <!-- LES 2 TYPES DE CONCURRENTS -->
        <div class="vs-container">
            <div class="vs-card bad">
                <h4><i class="fa-solid fa-arrows-split-up-and-left"></i> 1. Les Concurrents Directs</h4>
                <p style="font-size:0.88rem; color:#fca5a5; margin-bottom:8px;">Ils vendent le même produit ou service à la même cible.</p>
                <ul>
                    <li>L'autre marque de cosmétique locale de ton île.</li>
                    <li>L'autre consultant ou agence web qui démarche les commerçants.</li>
                    <li>Le food truck installé à 2 kilomètres de ton emplacement.</li>
                </ul>
            </div>
            <div class="vs-card good">
                <h4><i class="fa-solid fa-shield-halved"></i> 2. Les Concurrents Indirects & Le Statu Quo</h4>
                <p style="font-size:0.88rem; color:#6ee7b7; margin-bottom:8px;">Ils résolvent le même problème par un autre moyen.</p>
                <ul>
                    <li>La méthode "bricolée maison" (ex: faire sa mixture soi-même ou gérer ses devis sur un cahier d'écolier).</li>
                    <li>Les produits industriels de grande surface (moins chers mais de moins bonne qualité).</li>
                    <li><strong>Le pire concurrent de tous : L'INACTION.</strong> Le client qui se résigne et dit <em>« je verrai ça plus tard »</em>.</li>
                </ul>
            </div>
        </div>

        <!-- LA TECHNIQUE DES AVIS NÉGATIFS -->
        <h3>La Technique Secrète des Avis 2 Étoiles</h3>
        <p>
            Veux-tu savoir exactement ce que tu dois proposer pour que les clients quittent tes concurrents et viennent chez toi ? Fais ce que 95% des entrepreneurs ont la flemme de faire :
        </p>
        <div class="highlight-box" style="margin:20px 0;">
            <h4 style="margin:0 0 10px 0; color:#10b981;"><i class="fa-solid fa-magnifying-glass"></i> Le Protocole d'Investigation en 3 Étapes</h4>
            <ol style="margin:0; padding-left:20px; line-height:1.6; font-size:0.95rem;">
                <li><strong>Ouvre Google Avis, Trustpilot et les commentaires sous les posts Instagram/TikTok de tes concurrents.</strong></li>
                <li><strong>Filtre sur les avis 2 étoiles et 3 étoiles :</strong> Ce ne sont pas des haineux irrationnels (1 étoile), ce sont des clients déçus qui expliquent précisément pourquoi le produit n'a pas tenu sa promesse.</li>
                <li><strong>Note les 3 plaintes récurrentes :</strong> <em>« Livraison en 3 semaines au lieu de 48h »</em>, <em>« Personne ne répond sur WhatsApp »</em>, <em>« Texture trop liquide qui coule partout »</em>, <em>« Devis incompréhensible avec des frais cachés »</em>.</li>
            </ol>
        </div>
        <p>
            <strong>Voilà ta place sur le marché !</strong> Il te suffit de corriger ces 3 faiblesses pour devenir le choix évident de toute ta niche.
        </p>

        <!-- DÉCRYPTER LES HABITUDES D'ACHAT DE LA NICHE -->
        <h3>Comprendre les Habitudes d'Achat de Ta Niche</h3>
        <p>
            Un bon entrepreneur ne cherche pas à changer les habitudes de ses clients : il se place exactement là où ils ont déjà l'habitude de dépenser leur argent :
        </p>
        <div class="social-pillars-grid">
            <div class="social-pillar-item">
                <div class="social-pillar-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                <h4>Où achètent-ils habituellement ?</h4>
                <p>Est-ce qu'ils commandent sur un site web, est-ce qu'ils finalisent tout par message WhatsApp, ou ont-ils impérativement besoin de toucher le produit sur un stand ?</p>
            </div>
            <div class="social-pillar-item">
                <div class="social-pillar-icon"><i class="fa-solid fa-wallet"></i></div>
                <h4>Comment préfèrent-ils payer ?</h4>
                <p>Carte bancaire en ligne, lien de paiement sécurisé, virement immédiat, SumUp sans contact ou espèces au comptoir ?</p>
            </div>
            <div class="social-pillar-item">
                <div class="social-pillar-icon"><i class="fa-solid fa-bolt"></i></div>
                <h4>Quel est le déclencheur d'achat ?</h4>
                <p>Est-ce un achat impulsif plaisir du week-end, une urgence absolue (panne, douleur), ou une dépense budgétée en début de mois ?</p>
            </div>
        </div>
`;

const ch7Exercise = {
    id: "ex_chapitre_7",
    title: "Ta Cartographie Concurrentielle & Habitudes d'Achat",
    description: "Espionne légalement ton marché pour repérer les failles béantes de tes concurrents :",
    fields: [
        {
            id: "concurrence_directe_2_noms",
            type: "textarea",
            label: "1. Cite 2 concurrents directs (leurs noms et leurs points forts) :",
            placeholder: "Concurrent A : [Nom] — Point fort : Forte notoriété sur Instagram.\nConcurrent B : [Nom] — Point fort : Prix très agressifs."
        },
        {
            id: "concurrence_failles_avis_negatifs",
            type: "textarea",
            label: "2. Quelles sont les failles ou plaintes récurrentes de leurs clients (avis, délais, accueil) ?",
            placeholder: "Ex: 'Les clients se plaignent des délais de livraison interminables (15 jours), du manque de conseil personnalisé et du packaging qui fuit.'"
        },
        {
            id: "concurrence_indirecte_alternatives",
            type: "textarea",
            label: "3. Quels sont les 2 concurrents indirects (les solutions alternatives que les clients utilisent) ?",
            placeholder: "Ex: '1. Préparer des masques maison à la cuisine / 2. Acheter des produits chimiques importés vendus en grande surface.'"
        },
        {
            id: "niche_habitudes_achat",
            type: "textarea",
            label: "4. Quelles sont les habitudes d'achat dominantes de ta cible (canal préféré, moyen de paiement, moment) ?",
            placeholder: "Ex: 'Elles commandent le soir après 20h depuis leur téléphone, posent 2 questions sur WhatsApp avant de payer par carte via un lien de paiement.'"
        }
    ]
};

// ------------------------------------------------------------------
// 3. CHAPITRE 8 : VENDRE LA TRANSFORMATION & TA DIFFÉRENCIATION RADICALE
// ------------------------------------------------------------------
const ch8Content = `
        <p class="lead-text">
            Maintenant que tu connais ta niche et les failles de tes concurrents, voici la règle d'or qui te permettra de facturer le juste prix sans jamais être comparé : <strong>on ne vend JAMAIS des caractéristiques, on vend la TRANSFORMATION</strong>.
        </p>

        <!-- L'EXEMPLE DU COACHING FEMMES & L'ÉQUATION DE TRANSFORMATION -->
        <div class="highlight-box" style="margin:24px 0;">
            <h4 style="margin:0 0 10px 0; color:#10b981;"><i class="fa-solid fa-wand-magic-sparkles"></i> L'Équation Universelle de la Transformation</h4>
            <p style="font-size:1.15rem; font-weight:700; color:#ffffff; margin:0 0 12px 0;">
                ÉTAT A (Douleur & Frustration) ➔ LE VÉHICULE (Ton Offre) ➔ ÉTAT B (Transformation Désirée)
            </p>
            <p style="font-size:0.95rem; line-height:1.6; color:#cbd5e1; margin:0;">
                Prenons un exemple concret : une entrepreneure lance du coaching pour les femmes. Si elle vend <em>« 4 séances de 45 minutes sur Zoom et des exercices respiratoires »</em>, elle vend des <strong>caractéristiques</strong> (ennuyeuses, qui demandent des efforts). 
                En revanche, quand elle annonce : <strong>« J'aide les femmes actives qui se sentent épuisées et invisibles (État A) à retrouver une confiance inébranlable, à se regarder dans le miroir avec fierté et à oser demander leur promotion sans trembler (État B) »</strong>, elle vend une <strong>transformation émotionnelle vitale</strong>. Ses clientes paient 1 200€ sans hésiter !
            </p>
        </div>

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
                        <td>Un flacon d'huile de 100ml de carapate</td>
                        <td><strong>La fierté retrouvée :</strong> Ne plus avoir honte de ses cheveux au réveil et attacher ses cheveux en arrière sans cacher ses tempes.</td>
                    </tr>
                    <tr>
                        <td>Une prestation d'audit de site web de 20 pages</td>
                        <td><strong>La croissance financière :</strong> 15 nouvelles réservations directes par mois et 3 000€ d'économies de commissions tierces.</td>
                    </tr>
                    <tr>
                        <td>Un e-book de 60 pages sur la gestion du temps</td>
                        <td><strong>La liberté d'esprit :</strong> Pouvoir aller chercher ses enfants à 16h30 sans culpabiliser ni stresser pour son business.</td>
                    </tr>
                    <tr>
                        <td>Un plat à emporter le midi</td>
                        <td><strong>Le réconfort & l'énergie :</strong> Un repas chaud, savoureux et sain qui cale sans donner envie de dormir pendant la réunion de 14h.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- DIFFÉRENCIATION PAR VOIE -->
        <h3>Comment Devenir Totalement Incomparable dans Ton Secteur</h3>
        <p>
            La différenciation, c'est l'art d'utiliser les failles de tes concurrents (découvertes au chapitre précédent) pour construire ton argument massue :
        </p>

        <div class="sector-adaptive-container" style="margin-top: 24px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">DIFFÉRENCIATION ADAPTÉE À TON MODÈLE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Ta Différenciation : La Pureté Traçable & L'Expérience Sensorielle</h4>
                <p>Face aux marques industrielles importées dont la liste INCI fait 40 lignes incompréhensibles :</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. La transparence radicale</h4>
                        <p>Affiche fièrement la provenance des récoltes et le nom des agriculteurs partenaires. Moins de 6 ingrédients, 100% compréhensibles.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. La livraison rapide soignée</h4>
                        <p>Pendant que les colis de métropole mettent 15 jours à arriver avec des frais d'octroi de mer surprises, livre en 48h avec un mot manuscrit parfumé.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Ta Différenciation : La Spécialisation Terrain & L'Inversion du Risque</h4>
                <p>Face aux agences généralistes parisiennes qui ne comprennent rien aux spécificités des DOM-TOM :</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. L'ancrage local & la réactivité</h4>
                        <p>Tu es sur le même fuseau horaire, tu comprends la culture relationnelle WhatsApp et tu te déplaces au besoin.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. L'engagement de résultat</h4>
                        <p>« Si vous n'avez pas rentabilisé la prestation sous 45 jours, nous continuons à travailler gratuitement jusqu'à l'objectif ».</p>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Ta Différenciation : La Synthèse Actionnable & Les Templates Prêts</h4>
                <p>Face aux formations de 40 heures sur YouTube où l'on se perd sans jamais passer à l'action :</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. La promesse "Résultat en 48h"</h4>
                        <p>Un guide épuré de 40 pages où chaque page produit une action concrète et un résultat vérifiable le jour même.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. Les outils clé-en-main</h4>
                        <p>Tu ne donnes pas juste de la théorie, tu donnes le fichier Excel pré-calculé ou le modèle Notion qu'il n'y a plus qu'à dupliquer.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Ta Différenciation : Le Plat Signature Inimitable & Le Service Éclair</h4>
                <p>Face aux snacks industriels réchauffés au micro-ondes :</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. L'assaisonnement secret signature</h4>
                        <p>Une sauce maison dont tu es le seul dépositaire du secret et qui rend ton plat mémorable dès la première bouchée.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. La précommande zéro attente</h4>
                        <p>Le client commande sur WhatsApp le matin, sa barquette l'attend prête et fumante dès son arrivée sans 1 seconde d'attente.</p>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-gem" style="color:#10b981;"></i> Ta Différenciation : La Rareté des Séries & Le Conseil VIP</h4>
                <p>Face aux rayons anonymes et impersonnels des grandes enseignes :</p>
                <div class="social-pillars-grid">
                    <div class="social-pillar-item">
                        <h4>1. L'exclusivité des collections</h4>
                        <p>Seulement 10 exemplaires par modèle. Tes clientes savent qu'elles ne croiseront personne avec la même tenue au bureau.</p>
                    </div>
                    <div class="social-pillar-item">
                        <h4>2. L'attention aux détails</h4>
                        <p>Tu te souviens du prénom de ta cliente, de ses goûts, et tu lui glisses une attention personnalisée à chaque visite.</p>
                    </div>
                </div>
            </div>
        </div>
`;

const ch8Exercise = {
    id: "ex_chapitre_8",
    title: "Ta Transformation Vendue & Ton Facteur X",
    description: "Formule la transformation irrésistible que tu apportes dans la vie de ton client :",
    fields: [
        {
            id: "transformation_etat_a",
            type: "textarea",
            label: "1. L'État A : Quelle est la douleur, le doute ou la frustration quotidienne de ton client avant de te rencontrer ?",
            placeholder: "Ex: 'Elle se sent coupable, épuisée par la charge mentale de son travail et de sa famille, et a perdu confiance en son pouvoir d'action.'"
        },
        {
            id: "transformation_etat_b",
            type: "textarea",
            label: "2. L'État B : Quelle est la victoire émotionnelle, financière ou statutaire exacte qu'il vit après ton offre ?",
            placeholder: "Ex: 'Elle ose enfin négocier son augmentation, pose ses limites avec le sourire et retrouve une énergie joyeuse chaque matin.'"
        },
        {
            id: "facteur_x_differenciation",
            type: "textarea",
            label: "3. Ton Facteur X de différenciation (Pourquoi est-il 10 fois plus rassurant d'acheter chez toi que chez tes concurrents ?) :",
            placeholder: "Ex: 'Parce que ma méthode est 100% adaptée au contexte de vie caribéen, sans jargon théorique, avec un accompagnement vocal direct chaque semaine.'"
        }
    ]
};

// ------------------------------------------------------------------
// REBUILD FULL SEQUENTIAL CHAPTERS LIST (24 Chapters Total)
// ------------------------------------------------------------------
const updated = [];

// 0: Cover
updated.push(oldChapters[0]);

// 1: Avant-propos
updated.push(oldChapters[1]);

// 2: Ch 1 (Ce que tu crois...)
updated.push(oldChapters[2]);

// 3: Ch 2 (Le mur...)
updated.push(oldChapters[3]);

// 4: Ch 3 (Ton Why...)
updated.push(oldChapters[4]);

// 5: Ch 4 (Trouve ton chemin...)
updated.push(oldChapters[5]);

// 6: Ch 5 (Ton client, en profondeur...)
updated.push(oldChapters[6]);

// 7: NOUVEAU Ch 6 (Trouver sa Niche Rentable selon sa Voie)
updated.push({
    id: "chapitre-6",
    number: 6,
    badge: "Chapitre 6",
    title: "Trouver sa Niche Rentable selon sa Voie (Opportunités Réelles du Marché)",
    subtitle: "Pourquoi les généralistes meurent de faim et 3 niches concrètes à exploiter dans ton secteur.",
    readTime: "7 min",
    content: ch6Content,
    exercise: ch6Exercise
});

// 8: NOUVEAU Ch 7 (Étude de Marché Commando : Concurrence Directe, Indirecte & Habitudes)
updated.push({
    id: "chapitre-7",
    number: 7,
    badge: "Chapitre 7",
    title: "Étude de Marché Commando : Concurrence Directe, Indirecte & Habitudes d'Achat",
    subtitle: "Comment espionner légalement les avis négatifs de tes concurrents et comprendre comment ta niche achète.",
    readTime: "7 min",
    content: ch7Content,
    exercise: ch7Exercise
});

// 9: NOUVEAU Ch 8 (Vendre la Transformation & Ta Différenciation Radicale)
updated.push({
    id: "chapitre-8",
    number: 8,
    badge: "Chapitre 8",
    title: "Vendre la Transformation & Ta Différenciation Radicale",
    subtitle: "Pourquoi personne n'achète de caractéristiques et comment te rendre totalement incomparable.",
    readTime: "6 min",
    content: ch8Content,
    exercise: ch8Exercise
});

// 10: Ch 9 (ancien Ch 7: Seul ou accompagné...)
const chAssocié = oldChapters.find(c => c.title.includes("faut-il t'associer"));
if (chAssocié) {
    chAssocié.number = 9;
    chAssocié.badge = "Chapitre 9";
    chAssocié.id = "chapitre-9";
    if (chAssocié.exercise) chAssocié.exercise.id = "ex_chapitre_9";
    updated.push(chAssocié);
}

// 11: Ch 10 (ancien Ch 8: Ton chemin, tes moyens...)
const chMoyens = oldChapters.find(c => c.title.includes("Ton chemin, tes moyens"));
if (chMoyens) {
    chMoyens.number = 10;
    chMoyens.badge = "Chapitre 10";
    chMoyens.id = "chapitre-10";
    if (chMoyens.exercise) chMoyens.exercise.id = "ex_chapitre_10";
    updated.push(chMoyens);
}

// 12: Ch 11 (ancien Ch 9: Le défi des 80/20...)
const chPareto = oldChapters.find(c => c.title.includes("80/20"));
if (chPareto) {
    chPareto.number = 11;
    chPareto.badge = "Chapitre 11";
    chPareto.id = "chapitre-11";
    if (chPareto.exercise) chPareto.exercise.id = "ex_chapitre_11";
    updated.push(chPareto);
}

// 13: Ch 12 (ancien Ch 10: Les Vrais Fondamentaux du Branding...)
const chBranding = oldChapters.find(c => c.title.includes("Fondamentaux du Branding"));
if (chBranding) {
    chBranding.number = 12;
    chBranding.badge = "Chapitre 12";
    chBranding.id = "chapitre-12";
    if (chBranding.exercise) chBranding.exercise.id = "ex_chapitre_12";
    updated.push(chBranding);
}

// 14: Ch 13 (ancien Ch 11: Ton Premier Logo...)
const chLogo = oldChapters.find(c => c.title.includes("Premier Logo"));
if (chLogo) {
    chLogo.number = 13;
    chLogo.badge = "Chapitre 13";
    chLogo.id = "chapitre-13";
    if (chLogo.exercise) chLogo.exercise.id = "ex_chapitre_13";
    updated.push(chLogo);
}

// 15: Ch 14 (ancien Ch 12: Architecture de l'Offre Irrésistible...)
const chOffre = oldChapters.find(c => c.title.includes("Architecture de l'Offre"));
if (chOffre) {
    chOffre.number = 14;
    chOffre.badge = "Chapitre 14";
    chOffre.id = "chapitre-14";
    if (chOffre.exercise) chOffre.exercise.id = "ex_chapitre_14";
    updated.push(chOffre);
}

// 16: Ch 15 (ancien Ch 13: Financer sans la banque & Chiffres simples...)
const chChiffres = oldChapters.find(c => c.title.includes("Financer sans la banque"));
if (chChiffres) {
    chChiffres.number = 15;
    chChiffres.badge = "Chapitre 15";
    chChiffres.id = "chapitre-15";
    if (chChiffres.exercise) chChiffres.exercise.id = "ex_chapitre_15";
    updated.push(chChiffres);
}

// 17: Ch 16 (ancien Ch 14: Zoom sur ton secteur...)
const chZoom = oldChapters.find(c => c.title.includes("Zoom sur ton secteur"));
if (chZoom) {
    chZoom.number = 16;
    chZoom.badge = "Chapitre 16";
    chZoom.id = "chapitre-16";
    if (chZoom.exercise) chZoom.exercise.id = "ex_chapitre_16";
    updated.push(chZoom);
}

// 18: Ch 17 (ancien Ch 15: Les outils selon ton business...)
const chOutils = oldChapters.find(c => c.title.includes("outils selon ton business"));
if (chOutils) {
    chOutils.number = 17;
    chOutils.badge = "Chapitre 17";
    chOutils.id = "chapitre-17";
    if (chOutils.exercise) chOutils.exercise.id = "ex_chapitre_17";
    updated.push(chOutils);
}

// 19: Ch 18 (ancien Ch 16: Quand ça coince : surmonter l'échec...)
const chEchec = oldChapters.find(c => c.title.includes("surmonter l'échec"));
if (chEchec) {
    chEchec.number = 18;
    chEchec.badge = "Chapitre 18";
    chEchec.id = "chapitre-18";
    if (chEchec.exercise) chEchec.exercise.id = "ex_chapitre_18";
    updated.push(chEchec);
}

// 20: Ch 19 : Réseaux Sociaux (1/3) — Psychologie, Algorithme 2026 & Incarnation
const chRS1 = oldChapters.find(c => c.title.includes("Réseaux Sociaux (1/3)"));
if (chRS1) {
    chRS1.number = 19;
    chRS1.badge = "Chapitre 19";
    chRS1.id = "chapitre-19";
    if (chRS1.exercise) chRS1.exercise.id = "ex_chapitre_19";
    updated.push(chRS1);
}

// 21: Ch 20 : Réseaux Sociaux (2/3) — Le Tunnel TOFU-MOFU-BOFU & Choisir son Canal Maître
const chRS2 = oldChapters.find(c => c.title.includes("Réseaux Sociaux (2/3)"));
if (chRS2) {
    chRS2.number = 20;
    chRS2.badge = "Chapitre 20";
    chRS2.id = "chapitre-20";
    if (chRS2.exercise) chRS2.exercise.id = "ex_chapitre_20";
    updated.push(chRS2);
}

// 22: Ch 21 : Réseaux Sociaux (3/3) — Playbooks par Secteur & Scripts de Closing en DM
const chRS3 = oldChapters.find(c => c.title.includes("Réseaux Sociaux (3/3)"));
if (chRS3) {
    chRS3.number = 21;
    chRS3.badge = "Chapitre 21";
    chRS3.id = "chapitre-21";
    if (chRS3.exercise) chRS3.exercise.id = "ex_chapitre_21";
    updated.push(chRS3);
}

// 23: Ch 22 : Le Pitch en Une Phrase
const chPitch = oldChapters.find(c => c.title.includes("Le Pitch en Une Phrase"));
if (chPitch) {
    chPitch.number = 22;
    chPitch.badge = "Chapitre 22";
    chPitch.id = "chapitre-22";
    if (chPitch.exercise) chPitch.exercise.id = "ex_chapitre_22";
    updated.push(chPitch);
}

// 24: Ch 23 : Tes 30 premiers jours d'action
const ch30Jours = oldChapters.find(c => c.title.includes("30 premiers jours"));
if (ch30Jours) {
    ch30Jours.number = 23;
    ch30Jours.badge = "Chapitre 23";
    ch30Jours.id = "chapitre-23";
    if (ch30Jours.exercise) ch30Jours.exercise.id = "ex_chapitre_23";
    updated.push(ch30Jours);
}

// 25: Conclusion
const conclusion = oldChapters.find(c => c.id === 'conclusion');
if (conclusion) {
    updated.push(conclusion);
}

console.log('Total updated chapters:', updated.length);

const outputData = {
    meta: {
        title: "Les fondamentaux de l'entrepreneur — Tome 1",
        subtitle: "Le guide qui te montre que peu importe ton idée, peu importe tes moyens, tu peux entreprendre",
        author: "Domtom Connect",
        edition: "2026 — Édition Interactive Enrichie",
        totalChapters: updated.length
    },
    chapters: updated
};

const filePrefix = `/**
 * Guide Digital : Les Fondamentaux de l'Entrepreneur — Tome 1
 * Écosystème Domtom Connect
 * Version Interactive & Enrichie
 */

window.GUIDE_DATA = `;

fs.writeFileSync(filePath, filePrefix + JSON.stringify(outputData, null, 4) + ';\n', 'utf8');
console.log('Successfully written reconstructed guide-tome1.js!');
