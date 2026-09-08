const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'data', 'guide-tome1.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

// We need to update chapters: 'chapitre-11', 'chapitre-14', and 'chapitre-16'.

// -------------------------------------------------------------
// 1. CHAPITRE 11 : ADAPTIVE 3-TIER OFFERS PER SECTOR
// -------------------------------------------------------------
const ch11AdaptiveHtml = `
        <div class="sector-adaptive-container" style="margin-top: 32px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">ÉCHELLE D'OFFRES ADAPTÉE À TON MODÈLE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-bottle-droplet" style="color:#10b981;"></i> Architecture d'Offre : Cosmétique, Mode & Terroir</h4>
                <p>Pour un produit physique, le but est de faire tester le produit sans hésitation, puis de maximiser le panier moyen et la récurrence.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Palier 1 : Découverte / Test</span>
                        <div class="adaptive-offer-name">Kit Échantillon / Travel Size</div>
                        <div class="adaptive-offer-price">19,00 €</div>
                        <div class="adaptive-offer-desc">Format découverte à friction zéro. Élimine la peur de se tromper d'odeur, de teinte ou de texture.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Échantillon 15ml + bon d'achat de 15€ sur la prochaine commande</li>
                            <li><i class="fa-solid fa-check"></i> Fret Colissimo ou remise en main propre</li>
                            <li><i class="fa-solid fa-check"></i> Taux de réachat moyen constaté : 35% à 45%</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Palier 2 : Offre Cœur (60% du CA)</span>
                        <div class="adaptive-offer-name">La Routine Complète (Duo ou Trio)</div>
                        <div class="adaptive-offer-price">69,00 €</div>
                        <div class="adaptive-offer-desc">Le coffret phare apportant un résultat complet visible en 3 semaines. Ta plus forte marge en euros.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Sérum + Crème active + Pochon coton bio offert</li>
                            <li><i class="fa-solid fa-check"></i> Marge brute > 70% (coût matière & packaging < 18€)</li>
                            <li><i class="fa-solid fa-check"></i> Déclencheur du franco de port (livraison offerte)</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Palier 3 : Haute Valeur / VIP</span>
                        <div class="adaptive-offer-name">Cure Saisonière VIP + Coaching Beauté</div>
                        <div class="adaptive-offer-price">220,00 €</div>
                        <div class="adaptive-offer-desc">Pack 6 mois + diagnostic personnalisé WhatsApp en direct avec la fondatrice.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Routine semestrielle avec recharges programmées</li>
                            <li><i class="fa-solid fa-check"></i> Accès VIP aux nouveautés en avant-première</li>
                            <li><i class="fa-solid fa-check"></i> Encaissement immédiat de trésorerie sans intermédiaire</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-handshake-angle" style="color:#10b981;"></i> Architecture d'Offre : Prestations & Conseil B2B</h4>
                <p>En B2B, ne vends jamais ton temps à l'heure (taux horaire). Vends un livrable précis et une transformation chiffrée pour le business du client.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Palier 1 : Diagnostic Flash</span>
                        <div class="adaptive-offer-name">Audit de Performance 48h</div>
                        <div class="adaptive-offer-price">190,00 € <span style="font-size:0.75rem; color:#94a3b8;">(ou déduit)</span></div>
                        <div class="adaptive-offer-desc">Analyse complète des failles du client avec rapport vidéo Loom de 15 minutes. Déduit de la prestation si signature.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> 0€ de coût matière, 1h30 de travail net</li>
                            <li><i class="fa-solid fa-check"></i> Positionne instantanément ton autorité d'expert</li>
                            <li><i class="fa-solid fa-check"></i> 6 clients sur 10 enchaînent sur l'offre cœur</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Palier 2 : Pack Déploiement Clé-en-Main</span>
                        <div class="adaptive-offer-name">Sprint Implémentation 14 Jours</div>
                        <div class="adaptive-offer-price">1 450,00 €</div>
                        <div class="adaptive-offer-desc">Tu résous le problème de A à Z (ex: refonte tunnel, création charte, mise en place CRM) sans que le client n'ait à lever le petit doigt.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Acompte de 50% à la commande obligatoire</li>
                            <li><i class="fa-solid fa-check"></i> 3 à 4 clients par mois suffisent pour générer 4 500€ à 6 000€</li>
                            <li><i class="fa-solid fa-check"></i> Marge nette > 85%</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Palier 3 : Retainer / Abonnement Mensuel</span>
                        <div class="adaptive-offer-name">Partenaire Croissance Récurrent</div>
                        <div class="adaptive-offer-price">750,00 € / mois</div>
                        <div class="adaptive-offer-desc">Accompagnement continu avec suivi hebdo, optimisation continue et disponibilité prioritaire WhatsApp.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Engagement minimum 3 mois reconductible</li>
                            <li><i class="fa-solid fa-check"></i> Sécurise tes charges fixes et ton salaire de base chaque mois</li>
                            <li><i class="fa-solid fa-check"></i> 5 clients récurrents = 3 750€ de revenu prévisible garanti</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-laptop-code" style="color:#10b981;"></i> Architecture d'Offre : E-books, Templates & Formations</h4>
                <p>Le produit digital a une marge brute supérieure à 95% et se livre automatiquement 24h/24 sans frais de stockage ni contrainte de transport.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Palier 1 : Produit Impulsion</span>
                        <div class="adaptive-offer-name">E-book Pratique / Checklist Action</div>
                        <div class="adaptive-offer-price">17,00 € à 27,00 €</div>
                        <div class="adaptive-offer-desc">Guide PDF actionnable qui résout un micro-problème douloureux immédiat en moins de 60 minutes.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Achat impulsif sans besoin de réflexion</li>
                            <li><i class="fa-solid fa-check"></i> Hébergement 100% gratuit sur Payhip ou Gumroad</li>
                            <li><i class="fa-solid fa-check"></i> Autofinance ton acquisition de trafic</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Palier 2 : Le Bundle Boîte à Outils (Système)</span>
                        <div class="adaptive-offer-name">Pack Complet + Templates Notion / Excel</div>
                        <div class="adaptive-offer-price">67,00 € à 97,00 €</div>
                        <div class="adaptive-offer-desc">Le système clé-en-main complet : Guide + Fichiers modifiables + Vidéos explicatives de 20 minutes.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Taux de conversion optimal auprès d'une audience qualifiée</li>
                            <li><i class="fa-solid fa-check"></i> Proposé en Order Bump (case à cocher) dès l'achat de l'e-book</li>
                            <li><i class="fa-solid fa-check"></i> 50 ventes / mois = 3 350€ à 4 850€ de marge quasi-pure</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Palier 3 : Masterclass & Accompagnement Groupe</span>
                        <div class="adaptive-offer-name">Programme Cohorte / Immersion 30 Jours</div>
                        <div class="adaptive-offer-price">350,00 € à 690,00 €</div>
                        <div class="adaptive-offer-desc">Session live collective sur 4 semaines avec corrections de cas, communauté privée et feedback direct.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> 10 à 15 participants par session maximum</li>
                            <li><i class="fa-solid fa-check"></i> Génère 3 500€ à 10 000€ en 1 seul lancement sans coût logistique</li>
                            <li><i class="fa-solid fa-check"></i> Fournit les témoignages explosifs pour vendre l'offre cœur en continu</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-utensils" style="color:#10b981;"></i> Architecture d'Offre : Street-Food, Dark Kitchen & Traiteur</h4>
                <p>En cuisine, la rentabilité repose sur le contrôle strict du ratio matière (< 28%) et l'optimisation du panier moyen avec des suppléments à forte marge.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Palier 1 : Formule Déjeuner Express</span>
                        <div class="adaptive-offer-name">Le Plat Signature du Jour</div>
                        <div class="adaptive-offer-price">12,50 €</div>
                        <div class="adaptive-offer-desc">Le plat réconfortant incontournable préparé en volume avec une cadence de service rapide (< 2 minutes).</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Ratio matière strict : coût denrées < 3,20€</li>
                            <li><i class="fa-solid fa-check"></i> Attire le flux de travailleurs du midi</li>
                            <li><i class="fa-solid fa-check"></i> Point d'entrée pour fidéliser sur WhatsApp</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Palier 2 : Le Menu Expérience Complète</span>
                        <div class="adaptive-offer-name">Menu Signature + Boisson Maison + Dessert</div>
                        <div class="adaptive-offer-price">18,50 €</div>
                        <div class="adaptive-offer-desc">L'upsell systématique : boisson artisanale locale (marge 85%) + dessert gourmand préparé en amont.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Augmente le panier moyen de +48% sans rallonger le temps de service</li>
                            <li><i class="fa-solid fa-check"></i> La boisson et le dessert génèrent 65% de la marge nette du repas</li>
                            <li><i class="fa-solid fa-check"></i> Choisi par 70% des clients quand il est suggéré avec enthousiasme</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Palier 3 : Prestation Événementielle / Traiteur</span>
                        <div class="adaptive-offer-name">Buffet Privé / Plateau Entreprise (15 à 50 pers.)</div>
                        <div class="adaptive-offer-price">450,00 € à 1 800,00 €</div>
                        <div class="adaptive-offer-desc">Commande traiteur pré-payée pour comités d'entreprise, séminaires ou fêtes de famille le week-end.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> 100% sur précommande : zéro gaspillage, zéro invendu</li>
                            <li><i class="fa-solid fa-check"></i> Acompte de 50% encaissé dès la réservation</li>
                            <li><i class="fa-solid fa-check"></i> 2 prestations traiteur par mois sécurisent les charges de loyer de la cuisine</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-shop" style="color:#10b981;"></i> Architecture d'Offre : Boutique, Bazar & Concept Store</h4>
                <p>En boutique, la survie dépend du coefficient multiplicateur (minimum x2.2 à x2.8) et de la capacité à faire repartir le client avec un produit complémentaire.</p>
                <div class="adaptive-offers-grid">
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-tripwire">Palier 1 : Coup de Cœur Impulsif</span>
                        <div class="adaptive-offer-name">L'Accessoire Complémentaire</div>
                        <div class="adaptive-offer-price">12,00 € à 19,00 €</div>
                        <div class="adaptive-offer-desc">Petit objet placé en caisse ou en tête de gondole. Acheté sans calcul mental.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Coût d'achat grossiste < 4,50€ (coeff x3)</li>
                            <li><i class="fa-solid fa-check"></i> Déclencheur du premier acte d'achat chez un nouveau visiteur</li>
                            <li><i class="fa-solid fa-check"></i> Fait monter le panier moyen global de +15%</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col highlight-tier">
                        <span class="adaptive-offer-badge badge-core">Palier 2 : La Pièce Maîtresse (L'Article Phare)</span>
                        <div class="adaptive-offer-name">La Tenue / La Pièce Déco Vedette</div>
                        <div class="adaptive-offer-price">49,00 € à 89,00 €</div>
                        <div class="adaptive-offer-desc">L'article tendance repéré sur les réseaux qui a fait déplacer le client jusqu'à ta boutique ou ton stand.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Stock tournant commandé en petites séries de 10 à 20 pièces</li>
                            <li><i class="fa-solid fa-check"></i> Marge brute nette comprise entre 28€ et 52€ par pièce</li>
                            <li><i class="fa-solid fa-check"></i> Vendu avec argument de rareté (« Arrivage limité, réassort non garanti »)</li>
                        </ul>
                    </div>
                    <div class="adaptive-offer-col">
                        <span class="adaptive-offer-badge badge-vip">Palier 3 : Le Pack Look Complet / Club VIP</span>
                        <div class="adaptive-offer-name">Le Total Look / Pack Cadeau Prestige</div>
                        <div class="adaptive-offer-price">149,00 € à 240,00 €</div>
                        <div class="adaptive-offer-desc">Ensemble coordonné prêt à offrir (tenue + sac + bijou ou assortiment maison) avec emballage soigné.</div>
                        <ul class="adaptive-offer-bullets">
                            <li><i class="fa-solid fa-check"></i> Élimine l'effort d'assortiment pour le client qui cherche un cadeau</li>
                            <li><i class="fa-solid fa-check"></i> Permet d'écouler un article à rotation plus lente associé à un best-seller</li>
                            <li><i class="fa-solid fa-check"></i> Donne accès immédiat au groupe WhatsApp VIP réservé aux meilleures clientes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
`;

// -------------------------------------------------------------
// 2. CHAPITRE 14 : ADAPTIVE MINIMALIST SOFTWARE STACK PER SECTOR
// -------------------------------------------------------------
const ch14AdaptiveHtml = `
        <div class="sector-adaptive-container" style="margin-top: 32px;">
            <div class="active-sector-indicator-bar" style="margin-bottom: 18px;">
                <div class="indicator-left">
                    <span class="indicator-tag">STACK MINIMALISTE ADAPTÉE À TON MODÈLE</span>
                    <span class="indicator-sector-name active-sector-label-text">📦 Voie 1 : Produits Physiques & Terroirs</span>
                </div>
                <button type="button" class="btn-change-sector">
                    <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                </button>
            </div>

            <!-- Voie 1 : Produits Physiques & Terroirs -->
            <div class="sector-adaptive-card" data-sector="physique">
                <span class="sector-adaptive-tag">Voie 1 : Produits Physiques & Terroirs</span>
                <h4><i class="fa-solid fa-toolbox" style="color:#10b981;"></i> La Stack Zéro Gaspillage (Budget : ~25€ à 35€ / mois)</h4>
                <p>En physique, chaque euro économisé sur les abonnements logiciels doit être réinvesti dans la qualité de tes packagings ou ton stock initial.</p>
                <div class="adaptive-tools-grid">
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Shopify (Plan Starter à 5€) ou WooCommerce</h5>
                            <p>Permet de créer des liens de paiement et une page produit épurée sans payer 40€ de plugins superflus.</p>
                            <span class="adaptive-tool-cost">5€ à 32€ / mois</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-brands fa-whatsapp"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>WhatsApp Business (Catalogue & Réponses Rapides)</h5>
                            <p>Création d'un catalogue mobile interactif. 70% des clients ultramarins finalisent leur commande par message.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-box-open"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Boxtal / Colissimo En Ligne</h5>
                            <p>Édition des bordereaux d'expédition depuis chez toi avec tarifs négociés sans abonnement contractuel.</p>
                            <span class="adaptive-tool-cost">0€ / mois (au réel)</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-palette"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Canva Gratuit (Étiquettes & Visuels)</h5>
                            <p>Design de tes stickers, cartes de remerciement glissées dans les colis et posts réseaux.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Voie 2 : Services & Agence B2B -->
            <div class="sector-adaptive-card" data-sector="service">
                <span class="sector-adaptive-tag">Voie 2 : Services & Agence B2B</span>
                <h4><i class="fa-solid fa-toolbox" style="color:#10b981;"></i> La Stack Consultant & Agence B2B (Budget : 0€ à 15€ / mois)</h4>
                <p>En prestation intellectuelle et agence, ton outil de travail principal est ton cerveau et ta capacité à closer en rendez-vous.</p>
                <div class="adaptive-tools-grid">
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-calendar-check"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Cal.com ou Calendly</h5>
                            <p>Lien direct vers ton agenda synchronisé avec Google Calendar pour caler les diagnostics 15 min sans friction.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-brands fa-linkedin"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>LinkedIn (Gratuit) + Notion CRM</h5>
                            <p>Prospection relationnelle ciblée par message privé et tableau de suivi des prospects chauds sur Notion.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-video"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Loom (Enregistreur d'Écran)</h5>
                            <p>Pour envoyer des audits vidéo ultra-personnalisés de 5 minutes qui décrochent des contrats à 1 500€.</p>
                            <span class="adaptive-tool-cost">Gratuit (jusqu'à 25 vidéos)</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Abby ou Freebe (Facturation Micro-Entreprise)</h5>
                            <p>Création de devis conformes avec signature électronique en ligne et relance automatique des impayés.</p>
                            <span class="adaptive-tool-cost">0€ à 12€ / mois</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Voie 3 : Produits Digitaux & E-books -->
            <div class="sector-adaptive-card" data-sector="digital">
                <span class="sector-adaptive-tag">Voie 3 : Produits Digitaux & E-books</span>
                <h4><i class="fa-solid fa-toolbox" style="color:#10b981;"></i> La Stack Produit Digital 100% Automatisée (Budget : 0€ fixe)</h4>
                <p>Tu peux encaisser des milliers d'euros par mois sans dépenser un seul centime d'abonnement fixe grâce aux plateformes à commission.</p>
                <div class="adaptive-tools-grid">
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-cloud-arrow-down"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Payhip ou Gumroad</h5>
                            <p>Hébergement de tes fichiers PDF, templates et vidéos. Gestion automatique des paiements par carte/PayPal et envoi sécurisé immédiat.</p>
                            <span class="adaptive-tool-cost">0€ fixe (5% de commission par vente)</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-envelope-open-text"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>MailerLite ou Brevo</h5>
                            <p>Capture des emails des lecteurs grâce à ton e-book gratuit, puis séquence automatique de 4 emails pour vendre le bundle.</p>
                            <span class="adaptive-tool-cost">100% Gratuit (jusqu'à 1 000 abonnés)</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-pen-nib"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Canva & Google Docs / Notion</h5>
                            <p>Mise en page épurée de ton e-book et export en PDF haute définition sans logiciel complexe.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-cubes"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Diybookcovers ou Canva 3D Mockup</h5>
                            <p>Création en 10 secondes d'un mockup 3D de livre ou de bundle pour rendre ton produit digital tangible et désirable.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Voie 4 : Restauration, Food & Street-Food -->
            <div class="sector-adaptive-card" data-sector="food">
                <span class="sector-adaptive-tag">Voie 4 : Restauration, Food & Street-Food</span>
                <h4><i class="fa-solid fa-toolbox" style="color:#10b981;"></i> La Stack Cuisine & Food (Budget : ~20€ à 39€ / mois)</h4>
                <p>En restauration nomade ou dark kitchen, la vitesse d'encaissement et la fluidité de la prise de commande font toute ta rentabilité.</p>
                <div class="adaptive-tools-grid">
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-credit-card"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>TPE SumUp Air ou Zettle</h5>
                            <p>Terminal carte bancaire sans fil (sans engagement ni frais mensuels) avec encaissement sans contact ultra-rapide.</p>
                            <span class="adaptive-tool-cost">29€ à l'achat, 0€ / mois (1,75% par transaction)</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-brands fa-whatsapp"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>WhatsApp Business (Menu & Précommandes)</h5>
                            <p>Diffusion du menu du jour chaque matin à 10h00 en Story et prise des commandes à emporter pour éviter la queue.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-qrcode"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Menu Digital QR Code (Menutouch ou Canva)</h5>
                            <p>QR code plastifié posé sur ton comptoir ou food truck : les clients scannent et consultent ton menu sans contact.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-receipt"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Tableur Fiches Recettes & Ratio Matière</h5>
                            <p>Feuille Google Sheets simple calculant le coût de chaque portion au gramme près pour ne jamais travailler à perte.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Voie 5 : Commerce & Achat-Revente -->
            <div class="sector-adaptive-card" data-sector="commerce">
                <span class="sector-adaptive-tag">Voie 5 : Commerce & Achat-Revente</span>
                <h4><i class="fa-solid fa-toolbox" style="color:#10b981;"></i> La Stack Boutique & Achat-Revente (Budget : ~25€ / mois)</h4>
                <p>En boutique physique ou stand éphémère, la priorité absolue est la gestion en direct de tes stocks et la fidélisation client.</p>
                <div class="adaptive-tools-grid">
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-cash-register"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Square POS ou Loyverse Caisse</h5>
                            <p>Application de caisse enregistreuse gratuite sur iPad ou smartphone avec impression de tickets et gestion des stocks.</p>
                            <span class="adaptive-tool-cost">100% Gratuit (application de base)</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-truck-ramp-box"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Faire.com & Ankorstore (Sourcing Grossistes)</h5>
                            <p>Plateformes de réassort pour boutiques avec conditions de paiement à 60 jours pour ne pas asphyxier ta trésorerie.</p>
                            <span class="adaptive-tool-cost">Inscription Gratuite</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-brands fa-instagram"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Instagram Shopping & Stories</h5>
                            <p>Mise en avant des arrivages hebdomadaires en direct pour déclencher les visites en magasin dès le lendemain.</p>
                            <span class="adaptive-tool-cost">100% Gratuit</span>
                        </div>
                    </div>
                    <div class="adaptive-tool-item">
                        <div class="adaptive-tool-icon"><i class="fa-solid fa-heart-circle-check"></i></div>
                        <div class="adaptive-tool-meta">
                            <h5>Carte de Fidélité Digitale ou Papier Élégante</h5>
                            <p>La règle des 10 achats = 1 cadeau surprise qui transforme un client occasionnel en fan inconditionnel.</p>
                            <span class="adaptive-tool-cost">~15€ pour 500 cartes imprimées</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

// -------------------------------------------------------------
// 3. CHAPITRE 16 : REAL SOCIAL MEDIA MASTERCLASS & ADAPTIVE PLAYBOOKS
// -------------------------------------------------------------
const ch16MasterclassHtml = `
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
                Sur Internet, des milliers de pseudo-experts te répètent en boucle qu'il suffit de copier 3 accroches sensationnalistes pour devenir riche. <strong>C'est faux.</strong> En 2026, l'intelligence artificielle est capable de générer 10 000 accroches par minute. Le public est devenu immunisé contre le sensationnalisme creux. Voici les <strong>vrais mécanismes</strong> qui font décoller un compte et remplissent un compte bancaire :
            </p>

            <div class="social-pillars-grid">
                <!-- Pilier 1 : L'Algorithme sans tabou -->
                <div class="social-pillar-item">
                    <div class="social-pillar-icon"><i class="fa-solid fa-chart-line"></i></div>
                    <h4>1. L'Échantillon des 200 & Le Signal du Partage en DM</h4>
                    <p>
                        Quand tu publies une vidéo, l'algorithme ne regarde pas ton nombre d'abonnés : il la montre à un échantillon test de <strong>200 personnes</strong> qui ne te connaissent pas. Si 65% regardent la vidéo en entier (taux de complétion), il l'élargit à 2 000, puis à 20 000. Mais le signal suprême en 2026, c'est le <strong>partage en message privé (DM / WhatsApp)</strong> : quand quelqu'un envoie ta vidéo à un ami, l'algorithme considère que ton contenu a une valeur émotionnelle ou pratique inestimable et déploie le boost viral !
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

                <!-- Pilier 5 : Le Système Anti-Burnout -->
                <div class="social-pillar-item">
                    <div class="social-pillar-icon"><i class="fa-solid fa-repeat"></i></div>
                    <h4>5. La Constance sans Burnout : 1 Idée = 3 Formats</h4>
                    <p>
                        Ne te réveille jamais le matin avec l'angoisse de te demander <em>« qu'est-ce que je poste aujourd'hui ? »</em>. Bloque 2 heures le dimanche matin pour tourner 4 vidéos d'affilée (méthode du <strong>Batching</strong>). Décline chaque sujet fort en 3 formats : 1 vidéo courte dynamique, 1 carrousel synthétique à sauvegarder, et 2 stories de coulisses le jour de la parution.
                    </p>
                </div>
            </div>

            <div class="algorithm-truth-box">
                <strong><i class="fa-solid fa-lightbulb"></i> La Règle d'Or de Domtom Connect :</strong> 
                Les réseaux sociaux ne sont pas un distributeur automatique de billets : ce sont des accélérateurs de relations humaines. Si tu traites chaque follower comme un être humain à qui tu souhaites réellement rendre service, tu n'auras plus jamais besoin de courir après les algorithmes.
            </div>
        </div>

        <!-- STRATÉGIE RÉSEAUX ADAPTATIVE SELON LA VOIE CHOISIE -->
        <div class="sector-adaptive-container" style="margin-top: 32px;">
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
`;

// Helper function to update chapter content in JS object safely
// Let's load the file into a string, find chapters, and update their .content properties.

// 1. In chapter 11:
// Find where 'La Suite d\'Offres' finishes, and append ch11AdaptiveHtml before closing the string
const ch11TargetStr = "représentera 40% de ton bénéfice net !</li>\\n        </ol>";
const ch11TargetStrAlt = "représentera 40% de ton bénéfice net !</li>\n        </ol>";

let ch11Replaced = false;
if (fileContent.includes("représentera 40% de ton bénéfice net !</li>\n        </ol>")) {
    fileContent = fileContent.replace(
        "représentera 40% de ton bénéfice net !</li>\n        </ol>",
        "représentera 40% de ton bénéfice net !</li>\n        </ol>\n" + ch11AdaptiveHtml
    );
    ch11Replaced = true;
} else if (fileContent.includes("représentera 40% de ton bénéfice net !</li>\\n        </ol>")) {
    fileContent = fileContent.replace(
        "représentera 40% de ton bénéfice net !</li>\\n        </ol>",
        "représentera 40% de ton bénéfice net !</li>\\n        </ol>\\n" + JSON.stringify(ch11AdaptiveHtml).slice(1, -1)
    );
    ch11Replaced = true;
}

console.log('Chapter 11 adaptive content injected:', ch11Replaced);

// 2. In chapter 14:
const ch14TargetStr = "logiciel à 200€ ne la vendra à ta place.\n                </p>";
const ch14TargetStrAlt = "logiciel à 200€ ne la vendra à ta place.\\n                </p>";

let ch14Replaced = false;
if (fileContent.includes(ch14TargetStr)) {
    fileContent = fileContent.replace(
        ch14TargetStr,
        ch14TargetStr + '\n' + ch14AdaptiveHtml
    );
    ch14Replaced = true;
} else if (fileContent.includes(ch14TargetStrAlt)) {
    fileContent = fileContent.replace(
        ch14TargetStrAlt,
        ch14TargetStrAlt + '\\n' + JSON.stringify(ch14AdaptiveHtml).slice(1, -1)
    );
    ch14Replaced = true;
}

console.log('Chapter 14 adaptive content injected:', ch14Replaced);

// 3. In chapter 16:
// Replace the "10 Accroches Virales" section with the Masterclass and the adaptive playbooks!
const ch16SearchStart = "<h3>10 Accroches Virales (Hooks) Prêtes à l'Emploi</h3>";
let ch16Replaced = false;
if (fileContent.includes(ch16SearchStart)) {
    // Find where the viral hooks container ends
    const startIdx = fileContent.indexOf(ch16SearchStart);
    const endStr = "</div>\n    ";
    const endIdx = fileContent.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        const fullBlock = fileContent.substring(startIdx, endIdx + endStr.length);
        fileContent = fileContent.replace(fullBlock, ch16MasterclassHtml + '\n    ');
        ch16Replaced = true;
    }
}

console.log('Chapter 16 masterclass injected:', ch16Replaced);

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully written updated guide-tome1.js!');
