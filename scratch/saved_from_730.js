const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../assets/data/guide-tome1.js');
let code = fs.readFileSync(filePath, 'utf8');

// The new chapters to replace starting from chapitre-15 to the end of chapters
const newChaptersContent = `        {
            "id": "chapitre-15",
            "number": 15,
            "badge": "L'Échiquier des 6 Réseaux",
            "title": "L'Échiquier des 6 Réseaux Sociaux : Cartographie & Choix du Canal Maître",
            "subtitle": "Instagram, TikTok, YouTube, WhatsApp, LinkedIn, Facebook : Avantages réels, pièges cachés et la règle du Canal Unique.",
            "readTime": "11 min",
            "content": "\\n        <p class=\\\"lead-text\\\">\\n            Mettons fin au plus grand mythe du marketing digital : <strong>avoir des milliers d'abonnés ne veut absolument pas dire avoir un business rentable</strong>.\\n        </p>\\n        <p>\\n            Beaucoup d'entrepreneurs passent 4 heures par jour à créer des vidéos sur 4 réseaux en même temps, épuisent leur créativité, n'ont ni stratégie ni offre claire, et n'encaissent pas un seul centime à la fin du mois. Ils confondent <em>vanity metrics</em> (les likes et les vues qui flattent l'égo) et <em>cashflow opérationnel</em> (l'argent qui atterrit sur ton compte bancaire pour payer tes charges et ton salaire).\\n        </p>\\n\\n        <h3>L'Anatomie sans Filtre des 6 Grands Réseaux Sociaux</h3>\\n        <p>\\n            Chaque plateforme possède son ADN, son public et son niveau de friction pour convertir. Voici la cartographie détaillée avec les <strong>vrais avantages</strong> et les <strong>pièges cachés</strong> de chaque canal :\\n        </p>\\n\\n        <div class=\\\"channel-deep-grid\\\">\\n            <div class=\\\"channel-deep-card\\\">\\n                <div>\\n                    <div class=\\\"channel-card-top\\\">\\n                        <div class=\\\"channel-title-group\\\">\\n                            <i class=\\\"fa-brands fa-instagram channel-icon ig\\\"></i>\\n                            <h4>1. Instagram</h4>\\n                        </div>\\n                        <span class=\\\"phase-pill phase-mofu\\\">Relation & DM</span>\\n                    </div>\\n                    <p style=\\\"font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;\\\">\\n                        <strong>Idéal pour :</strong> Produits visuels, mode, cosmétique, terroirs, restauration, prestations créatives et consulting.\\n                    </p>\\n                    <div class=\\\"pros-cons-split\\\">\\n                        <div class=\\\"pros-box\\\">\\n                            <div class=\\\"pros-title\\\">✓ Côté Positif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Stories quotidiennes créant un lien d'intimité ultra-fort.</li>\\n                                <li>Messagerie DM idéale pour conseiller et closer sans site complexe.</li>\\n                                <li>Public habitué à acheter en ligne et sur mobile.</li>\\n                            </ul>\\n                        </div>\\n                        <div class=\\\"cons-box\\\">\\n                            <div class=\\\"cons-title\\\">✗ Côté Négatif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Portée organique des photos statiques quasi-nulle.</li>\\n                                <li>Exige une présence quasi-quotidienne en stories.</li>\\n                                <li>Concurrence visuelle très féroce.</li>\\n                            </ul>\\n                        </div>\\n                    </div>\\n                </div>\\n                <div class=\\\"channel-verdict-bar\\\">\\n                    <strong>Verdict :</strong> Le meilleur réseau pour construire une relation de confiance intime et convertir en DM.\\n                </div>\\n            </div>\\n\\n            <div class=\\\"channel-deep-card\\\">\\n                <div>\\n                    <div class=\\\"channel-card-top\\\">\\n                        <div class=\\\"channel-title-group\\\">\\n                            <i class=\\\"fa-brands fa-tiktok channel-icon tt\\\"></i>\\n                            <h4>2. TikTok</h4>\\n                        </div>\\n                        <span class=\\\"phase-pill phase-tofu\\\">Trafic Froid</span>\\n                    </div>\\n                    <p style=\\\"font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;\\\">\\n                        <strong>Idéal pour :</strong> Storytelling fondateur, marques B2C, coulisses de fabrication, street-food et défis terrain.\\n                    </p>\\n                    <div class=\\\"pros-cons-split\\\">\\n                        <div class=\\\"pros-box\\\">\\n                            <div class=\\\"pros-title\\\">✓ Côté Positif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Algorithme 100% méritocratique : 100k vues possibles dès la 1ère vidéo.</li>\\n                                <li>Parfait pour tester des accroches (hooks) et concepts à coût zéro.</li>\\n                                <li>Portée exponentielle auprès de parfaits inconnus.</li>\\n                            </ul>\\n                        </div>\\n                        <div class=\\\"cons-box\\\">\\n                            <div class=\\\"cons-title\\\">✗ Côté Négatif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Audience très volatile (swipe rapide, faible fidélité initiale).</li>\\n                                <li>Monétisation directe complexe sans un lien de bio puissant.</li>\\n                                <li>Pression du rythme de publication pour maintenir la traction.</li>\\n                            </ul>\\n                        </div>\\n                    </div>\\n                </div>\\n                <div class=\\\"channel-verdict-bar\\\">\\n                    <strong>Verdict :</strong> La machine à notoriété gratuite la plus puissante pour faire découvrir ton produit à grande échelle.\\n                </div>\\n            </div>\\n\\n            <div class=\\\"channel-deep-card\\\">\\n                <div>\\n                    <div class=\\\"channel-card-top\\\">\\n                        <div class=\\\"channel-title-group\\\">\\n                            <i class=\\\"fa-brands fa-youtube channel-icon yt\\\"></i>\\n                            <h4>3. YouTube Long-Form</h4>\\n                        </div>\\n                        <span class=\\\"phase-pill phase-mofu\\\">Autorité Pérenne</span>\\n                    </div>\\n                    <p style=\\\"font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;\\\">\\n                        <strong>Idéal pour :</strong> Experts, formateurs, artisans, tutoriels approfondis et déconstruction de croyances.\\n                    </p>\\n                    <div class=\\\"pros-cons-split\\\">\\n                        <div class=\\\"pros-box\\\">\\n                            <div class=\\\"pros-title\\\">✓ Côté Positif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Contenus pérennes : une vidéo génère des vues et des clients pendant 3 à 5 ans.</li>\\n                                <li>Autorité suprême : un prospect qui écoute 15 min de toi est déjà convaincu.</li>\\n                                <li>Référencé directement dans les résultats du moteur Google.</li>\\n                            </ul>\\n                        </div>\\n                        <div class=\\\"cons-box\\\">\\n                            <div class=\\\"cons-title\\\">✗ Côté Négatif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Charge de production élevée (tournage, montage, miniatures).</li>\\n                                <li>Démarrage lent (il faut souvent 10 à 20 vidéos pour amorcer l'algorithme).</li>\\n                                <li>Nécessite une vraie structure de script pour retenir l'attention.</li>\\n                            </ul>\\n                        </div>\\n                    </div>\\n                </div>\\n                <div class=\\\"channel-verdict-bar\\\">\\n                    <strong>Verdict :</strong> Le meilleur actif patrimonial à long terme pour bâtir un monopole personnel inattaquable.\\n                </div>\\n            </div>\\n\\n            <div class=\\\"channel-deep-card\\\">\\n                <div>\\n                    <div class=\\\"channel-card-top\\\">\\n                        <div class=\\\"channel-title-group\\\">\\n                            <i class=\\\"fa-brands fa-whatsapp channel-icon wa\\\"></i>\\n                            <h4>4. WhatsApp Business</h4>\\n                        </div>\\n                        <span class=\\\"phase-pill phase-bofu\\\">Conversion N°1</span>\\n                    </div>\\n                    <p style=\\\"font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;\\\">\\n                        <strong>Idéal pour :</strong> Tout business ultramarin (Antilles, Guyane, Réunion), africain et commerce de proximité.\\n                    </p>\\n                    <div class=\\\"pros-cons-split\\\">\\n                        <div class=\\\"pros-box\\\">\\n                            <div class=\\\"pros-title\\\">✓ Côté Positif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Taux d'ouverture record supérieur à 90% (contre ~20% par e-mail).</li>\\n                                <li>Canal de communication naturel et rassurant pour la communauté.</li>\\n                                <li>Outils pro gratuits : catalogue, réponses rapides et statuts 24h.</li>\\n                            </ul>\\n                        </div>\\n                        <div class=\\\"cons-box\\\">\\n                            <div class=\\\"cons-title\\\">✗ Côté Négatif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Nécessite d'avoir déjà obtenu le numéro du prospect.</li>\\n                                <li>Tolérance zéro pour le spam : respect absolu de la vie privée obligatoire.</li>\\n                                <li>Gestion chronophage des messages sans raccourcis bien paramétrés.</li>\\n                            </ul>\\n                        </div>\\n                    </div>\\n                </div>\\n                <div class=\\\"channel-verdict-bar\\\">\\n                    <strong>Verdict :</strong> L'outil de closing le plus rentable du monde pour transformer un contact tiède en client payant.\\n                </div>\\n            </div>\\n\\n            <div class=\\\"channel-deep-card\\\">\\n                <div>\\n                    <div class=\\\"channel-card-top\\\">\\n                        <div class=\\\"channel-title-group\\\">\\n                            <i class=\\\"fa-brands fa-linkedin channel-icon li\\\"></i>\\n                            <h4>5. LinkedIn</h4>\\n                        </div>\\n                        <span class=\\\"phase-pill phase-bofu\\\">B2B & Décideurs</span>\\n                    </div>\\n                    <p style=\\\"font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;\\\">\\n                        <strong>Idéal pour :</strong> Prestataires B2B, agences, experts comptables, freelances digitaux et consultants d'entreprise.\\n                    </p>\\n                    <div class=\\\"pros-cons-split\\\">\\n                        <div class=\\\"pros-box\\\">\\n                            <div class=\\\"pros-title\\\">✓ Côté Positif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Panier moyen le plus élevé du web (contrats de 1 000€ à 10 000€+).</li>\\n                                <li>Accès direct aux décideurs, directeurs généraux et gérants locaux.</li>\\n                                <li>Portée organique encore excellente sur les publications écrites à forte valeur.</li>\\n                            </ul>\\n                        </div>\\n                        <div class=\\\"cons-box\\\">\\n                            <div class=\\\"cons-title\\\">✗ Côté Négatif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Totalement inadapté à la vente impulsive de produits B2C pas chers.</li>\\n                                <li>Exige une posture professionnelle irréprochable et des retours d'expérience crédibles.</li>\\n                                <li>Les messages de vente directe copier-coller sont immédiatement ignorés.</li>\\n                            </ul>\\n                        </div>\\n                    </div>\\n                </div>\\n                <div class=\\\"channel-verdict-bar\\\">\\n                    <strong>Verdict :</strong> La plateforme reine si tu vends aux entreprises et veux signer des contrats récurrents à haute marge.\\n                </div>\\n            </div>\\n\\n            <div class=\\\"channel-deep-card\\\">\\n                <div>\\n                    <div class=\\\"channel-card-top\\\">\\n                        <div class=\\\"channel-title-group\\\">\\n                            <i class=\\\"fa-brands fa-facebook channel-icon fb\\\"></i>\\n                            <h4>6. Facebook & Groupes</h4>\\n                        </div>\\n                        <span class=\\\"phase-pill phase-tofu\\\">Communautés Locales</span>\\n                    </div>\\n                    <p style=\\\"font-size:0.85rem; color:var(--text-secondary); margin:0 0 10px 0;\\\">\\n                        <strong>Idéal pour :</strong> Événements, commerces de quartier, traiteurs, marchés locaux et public 35+ ans.\\n                    </p>\\n                    <div class=\\\"pros-cons-split\\\">\\n                        <div class=\\\"pros-box\\\">\\n                            <div class=\\\"pros-title\\\">✓ Côté Positif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Groupes locaux extrêmement actifs aux Antilles, en Guyane et à La Réunion.</li>\\n                                <li>Marketplace puissante pour vendre des stocks physiques localement.</li>\\n                                <li>Facilité de partage viral au sein de cercles familiaux et amicaux.</li>\\n                            </ul>\\n                        </div>\\n                        <div class=\\\"cons-box\\\">\\n                            <div class=\\\"cons-title\\\">✗ Côté Négatif</div>\\n                            <ul class=\\\"pros-cons-list\\\">\\n                                <li>Portée organique des pages professionnelles quasi-nulle sans publicité payante.</li>\\n                                <li>Public moins présent sur les tranches d'âge 18-28 ans.</li>\\n                                <li>Modération stricte requise dans les commentaires.</li>\\n                            </ul>\\n                        </div>\\n                    </div>\\n                </div>\\n                <div class=\\\"channel-verdict-bar\\\">\\n                    <strong>Verdict :</strong> Un levier de bouche-à-oreille et de recommandation de proximité redoutable pour le commerce local.\\n                </div>\\n            </div>\\n        </div>\\n\\n        <h3>La Règle d'Airain : Le Principe du Canal Maître Unique</h3>\\n        <p>\\n            Quand tu es seul ou avec une petite équipe, être sur 5 réseaux en même temps est la garantie absolue de l'échec par épuisement. Applique dès aujourd'hui la règle du <strong>Canal Maître</strong> :\\n        </p>\\n        <div class=\\\"highlight-box\\\">\\n            <h4 style=\\\"margin:0 0 10px 0;\\\"><i class=\\\"fa-solid fa-crosshairs\\\"></i> La Combinaison Gagnante 1 + 1</h4>\\n            <p style=\\\"font-size:1.05rem; line-height:1.6; margin:0;\\\">\\n                <strong>1 Canal d'Attraction Principal</strong> (ex: TikTok ou Instagram Reels) pour capter de nouvelles paires d'yeux chaque jour.<br>\\n                <strong>+ 1 Canal de Conversion Directe</strong> (ex: WhatsApp Business ou Messages DM Instagram) pour dialoguer, créer la confiance et envoyer ton lien de paiement.\\n            </p>\\n        </div>\\n    \",
            "exercise": {
                "id": "ex_chapitre_15",
                "title": "Stratégie de Canal Maître & Ligne Éditoriale",
                "description": "Fais le choix stratégique de ton écosystème d'acquisition pour concentrer 100% de ton énergie :",
                "fields": [
                    {
                        "id": "reseau_social_prioritaire",
                        "type": "select",
                        "label": "1. Quel sera ton Canal d'Attraction Maître (où tu crées du contenu pour être découvert) ?",
                        "options": [
                            {
                                "value": "instagram",
                                "label": "📸 Instagram (Reels & Stories visuelles)"
                            },
                            {
                                "value": "tiktok",
                                "label": "🎵 TikTok (Vidéos courtes virales & coulisses)"
                            },
                            {
                                "value": "youtube",
                                "label": "📺 YouTube (Vidéos tutoriels et autorité durable)"
                            },
                            {
                                "value": "linkedin",
                                "label": "💼 LinkedIn (Publications d'expertise B2B & cas clients)"
                            },
                            {
                                "value": "facebook",
                                "label": "👥 Facebook (Groupes locaux & bouche-à-oreille communautaire)"
                            }
                        ]
                    },
                    {
                        "id": "canal_conversion_secondaire",
                        "type": "select",
                        "label": "2. Quel est ton Canal de Conversion Directe (où tu dialogues et signes les ventes) ?",
                        "options": [
                            {
                                "value": "whatsapp_pro",
                                "label": "💬 WhatsApp Business (Messages vocaux, catalogue et lien wa.me)"
                            },
                            {
                                "value": "instagram_dm",
                                "label": "✉️ Messages Privés Instagram (Diagnostic personnalisé en DM)"
                            },
                            {
                                "value": "appel_decouverte",
                                "label": "📞 Appel de cadrage téléphonique 15 min"
                            },
                            {
                                "value": "boutique_site",
                                "label": "🛍️ Page de commande directe / Boutique Payhip / Shopify"
                            }
                        ]
                    },
                    {
                        "id": "ch15_promesse_editoriale",
                        "type": "text",
                        "label": "3. Ta promesse éditoriale claire (ce que la personne gagne à te suivre) :",
                        "placeholder": "Ex: 'J'aide les femmes actives caribéennes à soigner leurs cheveux au naturel avec des routines simples de 15 min par semaine.'"
                    },
                    {
                        "id": "contenu_hook_viral_1",
                        "type": "text",
                        "label": "4. Ton Hook n°1 pour stopper le scroll en 3 secondes (Problème / Erreur) :",
                        "placeholder": "Ex: 'Arrêtez immédiatement d'acheter des soins capillaires sans regarder cet ingrédient toxique...'"
                    },
                    {
                        "id": "contenu_hook_viral_2",
                        "type": "text",
                        "label": "5. Ton Hook n°2 (Chiffre marquant ou transformation contre-intuitive) :",
                        "placeholder": "Ex: 'Comment ce restaurant de Fort-de-France remplit ses tables en semaine sans dépenser 1€ en pub...'"
                    }
                ]
            }
        },
        {
            "id": "chapitre-16",
            "number": 16,
            "badge": "Tactiques & Tunnels Modulaires",
            "title": "Tactiques & Tunnels de Vente par Réseau : Les 5 Blueprints",
            "subtitle": "Sélectionne ton canal maître pour afficher son tunnel complet, sa cadence de publication et son script de closing mot pour mot.",
            "readTime": "12 min",
            "content": "\\n        <p class=\\\"lead-text\\\">\\n            Chaque réseau social exige une mécanique de conversion spécifique. Ce qui fonctionne sur TikTok pour du e-commerce est totalement inefficace sur LinkedIn pour du service B2B.\\n        </p>\\n        <p>\\n            Ce chapitre est <strong>entièrement interactif</strong> : clique sur ton canal maître ci-dessous pour afficher son blueprint d'action complet et adapter automatiquement ton carnet de bord :\\n        </p>\\n\\n        <!-- Channel Strategy Switcher Banner -->\\n        <div class=\\\"channel-switcher-banner\\\">\\n            <div class=\\\"channel-switcher-header\\\">\\n                <h3><i class=\\\"fa-solid fa-diagram-project\\\"></i> Sélectionne Ton Canal Maître</h3>\\n                <p>Clique sur l'un des 5 réseaux pour révéler son tunnel de conversion et sa routine hebdomadaire :</p>\\n            </div>\\n            <div class=\\\"channel-strategy-grid\\\">\\n                <button type=\\\"button\\\" class=\\\"channel-strategy-btn active\\\" data-target-channel=\\\"instagram\\\">\\n                    <div class=\\\"channel-tab-top\\\"><i class=\\\"fa-brands fa-instagram\\\" style=\\\"color:#E1306C;\\\"></i> <span>Canal 1</span></div>\\n                    <div class=\\\"channel-tab-title\\\">Instagram</div>\\n                    <div class=\\\"channel-tab-desc\\\">Reels, Stories quotidiennes & Closing conversationnel en DM.</div>\\n                </button>\\n                <button type=\\\"button\\\" class=\\\"channel-strategy-btn\\\" data-target-channel=\\\"tiktok\\\">\\n                    <div class=\\\"channel-tab-top\\\"><i class=\\\"fa-brands fa-tiktok\\\" style=\\\"color:#00F2FE;\\\"></i> <span>Canal 2</span></div>\\n                    <div class=\\\"channel-tab-title\\\">TikTok</div>\\n                    <div class=\\\"channel-tab-desc\\\">Trafic viral froid, coulisses réelles & redirection lien bio.</div>\\n                </button>\\n                <button type=\\\"button\\\" class=\\\"channel-strategy-btn\\\" data-target-channel=\\\"whatsapp\\\">\\n                    <div class=\\\"channel-tab-top\\\"><i class=\\\"fa-brands fa-whatsapp\\\" style=\\\"color:#25D366;\\\"></i> <span>Canal 3</span></div>\\n                    <div class=\\\"channel-tab-title\\\">WhatsApp Business</div>\\n                    <div class=\\\"channel-tab-desc\\\">Catalogue pro, Statuts 24h & Relance VIP en 3 temps.</div>\\n                </button>\\n                <button type=\\\"button\\\" class=\\\"channel-strategy-btn\\\" data-target-channel=\\\"linkedin\\\">\\n                    <div class=\\\"channel-tab-top\\\"><i class=\\\"fa-brands fa-linkedin\\\" style=\\\"color:#0A66C2;\\\"></i> <span>Canal 4</span></div>\\n                    <div class=\\\"channel-tab-title\\\">LinkedIn B2B</div>\\n                    <div class=\\\"channel-tab-desc\\\">Posts d'autorité, ciblage de dirigeants & contrats 1k€-5k€.</div>\\n                </button>\\n                <button type=\\\"button\\\" class=\\\"channel-strategy-btn\\\" data-target-channel=\\\"youtube\\\">\\n                    <div class=\\\"channel-tab-top\\\"><i class=\\\"fa-brands fa-youtube\\\" style=\\\"color:#FF0000;\\\"></i> <span>Canal 5</span></div>\\n                    <div class=\\\"channel-tab-title\\\">YouTube Long</div>\\n                    <div class=\\\"channel-tab-desc\\\">Vidéos piliers de fond (15 min), SEO Google & autorité sur 3 ans.</div>\\n                </button>\\n            </div>\\n        </div>\\n\\n        <!-- 5 Separate Channel Strategy Panels -->\\n        <div class=\\\"channel-article-panel active\\\" data-channel=\\\"instagram\\\">\\n            <div class=\\\"sector-card\\\" style=\\\"border-left: 4px solid #E1306C;\\\">\\n                <h4><i class=\\\"fa-brands fa-instagram\\\" style=\\\"color:#E1306C;\\\"></i> Blueprint Instagram : Le Tunnel Stories & Closing DM</h4>\\n                <p><strong>La Mécanique en 3 Étapes :</strong></p>\\n                <ol>\\n                    <li><strong>Attraction (Reels 3x/semaine) :</strong> Vidéos courtes (20-40s) axées sur un problème précis. Appel à l'action final : <em>« Commente GUIDE sous cette vidéo pour recevoir la méthode gratuite en privé. »</em></li>\\n                    <li><strong>Connexion & Rétention (Stories Quotidiennes) :</strong> Montre 3 à 5 stories par jour : coulisses, anecdotes, avant-après clients, sondages interactifs.</li>\\n                    <li><strong>Conversion en DM (Le Script Doux) :</strong> Dès qu'un prospect commente, réponds-lui immédiatement en message privé pour engager la conversation.</li>\\n                </ol>\\n                <div class=\\\"script-box-container\\\">\\n                    <div class=\\\"script-step\\\">\\n                        <div class=\\\"script-step-title\\\">Script Mot pour Mot Instagram DM :</div>\\n                        <div class=\\\"script-step-example\\\">\\n                            « Salut [Prénom] ! Voici le lien de ton guide comme promis [Lien]. Dis-moi, tu es plutôt dans la phase de lancement de ton projet ou tu as déjà des premiers clients ? »<br>\\n                            <em>(Attendre la réponse, puis rebondir avec empathie)</em><br>\\n                            « Je comprends à 100%. Si tu veux, j'ai préparé une solution clé en main qui règle ce souci en 14 jours. Tu veux que je te montre à quoi ça ressemble ? »\\n                        </div>\\n                    </div>\\n                </div>\\n            </div>\\n        </div>\\n\\n        <div class=\\\"channel-article-panel\\\" data-channel=\\\"tiktok\\\">\\n            <div class=\\\"sector-card\\\" style=\\\"border-left: 4px solid #00F2FE;\\\">\\n                <h4><i class=\\\"fa-brands fa-tiktok\\\" style=\\\"color:#00F2FE;\\\"></i> Blueprint TikTok : La Machine à Notoriété & Storytelling</h4>\\n                <p><strong>La Mécanique en 3 Étapes :</strong></p>\\n                <ol>\\n                    <li><strong>Arrêter le scroll dans les 3 premières secondes :</strong> Utilise un mouvement visuel ou une phrase provocante (ex: <em>« Si vous habitez aux Antilles et que vous achetez encore ceci, vous perdez de l'argent »</em>).</li>\\n                    <li><strong>Raconter une histoire authentique (Storytelling des coulisses) :</strong> Les gens n'aiment pas les publicités parfaites sur TikTok. Ils aiment voir l'atelier, les galères d'expédition, les paquets préparés à la main et les retours clients sincères.</li>\\n                    <li><strong>Redirection Chirurgicale vers la Bio :</strong> Termine toujours par une raison impérieuse d'aller cliquer sur le lien en bio (ex: <em>« Le lien pour tester gratuitement est tout en haut de mon profil »</em>).</li>\\n                </ol>\\n                <div class=\\\"script-box-container\\\">\\n                    <div class=\\\"script-step\\\">\\n                        <div class=\\\"script-step-title\\\">Structure d'un TikTok Gagnant en 35 secondes :</div>\\n                        <div class=\\\"script-step-example\\\">\\n                            <strong>0-3s :</strong> Hook choc (visuel + phrase textuelle à l'écran).<br>\\n                            <strong>3-20s :</strong> L'histoire ou l'erreur courante démontrée par la preuve.<br>\\n                            <strong>20-30s :</strong> La solution simple que tu apportes avec ton produit.<br>\\n                            <strong>30-35s :</strong> Appel à l'action clair vers le lien en bio.\\n                        </div>\\n                    </div>\\n                </div>\\n            </div>\\n        </div>\\n\\n        <div class=\\\"channel-article-panel\\\" data-channel=\\\"whatsapp\\\">\\n            <div class=\\\"sector-card\\\" style=\\\"border-left: 4px solid #25D366;\\\">\\n                <h4><i class=\\\"fa-brands fa-whatsapp\\\" style=\\\"color:#25D366;\\\"></i> Blueprint WhatsApp Business : L'Arsenal Ultime de Vente</h4>\\n                <p><strong>La Mécanique en 3 Étapes :</strong></p>\\n                <ol>\\n                    <li><strong>Configuration Professionnelle Impeccable :</strong> Photo de profil nette, description claire avec horaires d'ouverture, lien vers ton offre et <strong>Catalogue WhatsApp</strong> rempli avec prix et photos nettes.</li>\\n                    <li><strong>Les Statuts WhatsApp Quotidiens (Le secret le mieux gardé) :</strong> Aux Antilles et en Afrique, des milliers de personnes regardent les statuts chaque jour. Poste chaque matin une photo de tes coulisses, un avis client ou un produit disponible en quantité limitée.</li>\\n                    <li><strong>La Relance Délicate en 3 Temps :</strong> Si un prospect a demandé un renseignement puis n'a plus répondu, relance-le 48h plus tard sans agressivité.</li>\\n                </ol>\\n                <div class=\\\"script-box-container\\\">\\n                    <div class=\\\"script-step\\\">\\n                        <div class=\\\"script-step-title\\\">Script de Relance Bienveillante en 3 Temps :</div>\\n                        <div class=\\\"script-step-example\\\">\\n                            « Bonjour [Prénom], j'espère que tu passes une bonne journée ! Je préparais les commandes de la semaine et j'ai pensé à notre échange d'avant-hier sur [besoin]. Est-ce que tu as eu le temps de regarder ou tu as une question sur la formule ? Passe un excellent après-midi ! »\\n                        </div>\\n                    </div>\\n                </div>\\n            </div>\\n        </div>\\n\\n        <div class=\\\"channel-article-panel\\\" data-channel=\\\"linkedin\\\">\\n            <div class=\\\"sector-card\\\" style=\\\"border-left: 4px solid #0A66C2;\\\">\\n                <h4><i class=\\\"fa-brands fa-linkedin\\\" style=\\\"color:#0A66C2;\\\"></i> Blueprint LinkedIn : Le Pipeline B2B & Closing Dirigeants</h4>\\n                <p><strong>La Mécanique en 3 Étapes :</strong></p>\\n                <ol>\\n                    <li><strong>Profil Optimisé en Page de Vente :</strong> Ton titre ne doit pas être <em>« Consultant »</em> ou <em>« Étudiant »</em>, mais : <em>« J'aide les [Cible Dirigeants] à [Résultat Chiffré] grâce à [Méthode]. »</em></li>\\n                    <li><strong>2 Publications d'Études de Cas par Semaine :</strong> Raconte comment un client est passé de la galère au résultat en détaillant les étapes concrètes sans jargon.</li>\\n                    <li><strong>L'Approche Directe de Valeur Offerte :</strong> Contacte 5 décideurs cibles par semaine en leur apportant un retour d'expérience constructif sur leur entreprise, sans jamais leur envoyer de lien de vente direct.</li>\\n                </ol>\\n                <div class=\\\"script-box-container\\\">\\n                    <div class=\\\"script-step\\\">\\n                        <div class=\\\"script-step-title\\\">Message d'Approche LinkedIn Personnalisé :</div>\\n                        <div class=\\\"script-step-example\\\">\\n                            « Bonjour [Prénom], je suis vos actualités sur [Secteur] avec beaucoup d'intérêt. J'ai remarqué un petit point d'optimisation rapide sur votre communication [Détail précis]. J'ai enregistré une vidéo explicative de 2 minutes pour vous montrer comment corriger ça simplement. Si ça vous intéresse, dites-moi et je vous transmets le lien avec plaisir ! »\\n                        </div>\\n                    </div>\\n                </div>\\n            </div>\\n        </div>\\n\\n        <div class=\\\"channel-article-panel\\\" data-channel=\\\"youtube\\\">\\n            <div class=\\\"sector-card\\\" style=\\\"border-left: 4px solid #FF0000;\\\">\\n                <h4><i class=\\\"fa-brands fa-youtube\\\" style=\\\"color:#FF0000;\\\"></i> Blueprint YouTube : L'Autorité Pérenne & Moteur de Recherche</h4>\\n                <p><strong>La Mécanique en 3 Étapes :</strong></p>\\n                <ol>\\n                    <li><strong>Vidéos Piliers de 12 à 18 minutes :</strong> Réponds aux questions exactes que tes clients tapent dans Google (ex: <em>« Comment créer sa marque de cosmétique aux Antilles sans diplôme »</em>).</li>\\n                    <li><strong>Miniature & Titre à Fort Contraste :</strong> Un visage expressif, un texte court de 3 à 4 mots maximum et un contraste visuel fort pour susciter le clic.</li>\\n                    <li><strong>Tunnel dans la Description :</strong> La 1ère ligne de ta description doit contenir l'appel à l'action direct vers ton offre ou ton WhatsApp : <em>« 👉 Réserver votre diagnostic offert : [Lien] »</em>.</li>\\n                </ol>\\n            </div>\\n        </div>\\n    \",
            "exercise": {
                "id": "ex_chapitre_16",
                "title": "Blueprint & Plan d'Action sur Ton Canal Maître",
                "description": "Ce carnet s'adapte en direct à ton canal sélectionné pour poser ta cadence et tes scripts mot pour mot :",
                "fields": [
                    {
                        "id": "sec_plan_ig",
                        "channel": "instagram",
                        "type": "section-header",
                        "icon": "fa-brands fa-instagram",
                        "label": "Feuille de Route Instagram : Stories, Reels & DMs"
                    },
                    {
                        "id": "ig_cadence_reels_stories",
                        "channel": "instagram",
                        "type": "text",
                        "label": "1. Ta cadence hebdomadaire d'exécution Instagram :",
                        "placeholder": "Ex: 3 Reels par semaine (Lundi, Mercredi, Vendredi) + 4 Stories quotidiennes du Lundi au Samedi."
                    },
                    {
                        "id": "ig_lead_magnet_mot_cle",
                        "channel": "instagram",
                        "type": "text",
                        "label": "2. Ton mot-clé d'appel à l'action en commentaire :",
                        "placeholder": "Ex: 'Commente GUIDE sous ce Reel et je t'envoie la méthode complète en message privé.'"
                    },
                    {
                        "id": "ig_script_closing_dm",
                        "channel": "instagram",
                        "type": "textarea",
                        "label": "3. Ton script d'amorce de conversation en message privé (DM) :",
                        "placeholder": "« Salut [Prénom], voici le lien de ton guide ! Dis-moi, tu rencontres quelle difficulté principale actuellement sur [sujet] ? »"
                    },
                    {
                        "id": "ig_plan_14_jours",
                        "channel": "instagram",
                        "type": "textarea",
                        "label": "4. Ton plan d'action commando Instagram sur les 14 prochains jours :",
                        "placeholder": "Jours 1-3 : Optimiser la bio et créer le lien wa.me / Jours 4-10 : Publier 5 Reels avec hooks / Jours 11-14 : Répondre à chaque DM et closer 3 clients."
                    },
                    {
                        "id": "sec_plan_tt",
                        "channel": "tiktok",
                        "type": "section-header",
                        "icon": "fa-brands fa-tiktok",
                        "label": "Feuille de Route TikTok : Storytelling & Trafic Froid"
                    },
                    {
                        "id": "tt_rythme_tournage",
                        "channel": "tiktok",
                        "type": "text",
                        "label": "1. Ton rythme de tournage par lot (Batching) :",
                        "placeholder": "Ex: Tourner 6 vidéos courtes le dimanche après-midi pour publier 1 vidéo par jour à 18h30."
                    },
                    {
                        "id": "tt_coulisses_storytelling",
                        "channel": "tiktok",
                        "type": "textarea",
                        "label": "2. Quels moments réels des coulisses vas-tu filmer sans filtre ?",
                        "placeholder": "Ex: La préparation des colis à 6h du matin, les tests ratés de recettes, le témoignage spontané d'une cliente en salon."
                    },
                    {
                        "id": "tt_redirection_bio_wa",
                        "channel": "tiktok",
                        "type": "text",
                        "label": "3. Ta phrase d'accroche pour rediriger vers le lien en bio :",
                        "placeholder": "Ex: 'Pour recevoir la fiche technique gratuite avant ce soir, le lien direct est en haut sur mon profil !'"
                    },
                    {
                        "id": "tt_plan_14_jours",
                        "channel": "tiktok",
                        "type": "textarea",
                        "label": "4. Ton plan d'action commando TikTok sur les 14 prochains jours :",
                        "placeholder": "Jours 1-2 : Lister 15 idées de hooks / Jours 3-8 : Publier 1 vidéo par jour / Jours 9-14 : Analyser la vidéo qui perce et décliner le concept en série."
                    },
                    {
                        "id": "sec_plan_wa",
                        "channel": "whatsapp",
                        "type": "section-header",
                        "icon": "fa-brands fa-whatsapp",
                        "label": "Feuille de Route WhatsApp Business : Conversion de Proximité"
                    },
                    {
                        "id": "wa_message_accueil_catalogue",
                        "channel": "whatsapp",
                        "type": "textarea",
                        "label": "1. Ton message d'accueil automatique WhatsApp Business :",
                        "placeholder": "« Bonjour et bienvenue chez [Nom] ! Je suis ravi de t'accueillir. Tu peux consulter notre catalogue direct en haut à droite. Comment puis-je t'aider aujourd'hui ? »"
                    },
                    {
                        "id": "wa_rythme_statuts_24h",
                        "channel": "whatsapp",
                        "type": "text",
                        "label": "2. Ta routine de Statuts WhatsApp 24h :",
                        "placeholder": "Ex: 2 statuts par jour : 1 photo coulisses le matin à 8h + 1 preuve de satisfaction client l'après-midi à 16h."
                    },
                    {
                        "id": "wa_script_relance_3_temps",
                        "channel": "whatsapp",
                        "type": "textarea",
                        "label": "3. Ton message de relance douce à 48h (sans pression) :",
                        "placeholder": "« Bonjour [Prénom], j'espère que tu vas bien ! Je prépare le réapprovisionnement de la semaine. Est-ce que tu souhaites que je te réserve ta formule avant expédition ? »"
                    },
                    {
                        "id": "wa_plan_14_jours",
                        "channel": "whatsapp",
                        "type": "textarea",
                        "label": "4. Ton plan d'action commando WhatsApp sur les 14 prochains jours :",
                        "placeholder": "Jours 1-2 : Configurer WhatsApp Business + Catalogue / Jours 3-7 : Inviter mes 30 premiers contacts à enregistrer le numéro / Jours 8-14 : Animer les statuts."
                    },
                    {
                        "id": "sec_plan_li",
                        "channel": "linkedin",
                        "type": "section-header",
                        "icon": "fa-brands fa-linkedin",
                        "label": "Feuille de Route LinkedIn : B2B & Décideurs"
                    },
                    {
                        "id": "li_titre_profil_positionnement",
                        "channel": "linkedin",
                        "type": "text",
                        "label": "1. Le titre percutant de ton profil LinkedIn :",
                        "placeholder": "Ex: 'J'aide les commerçants et PME des Antilles à automatiser leur acquisition client avec WhatsApp Business.'"
                    },
                    {
                        "id": "li_post_autorite_etude_cas",
                        "channel": "linkedin",
                        "type": "textarea",
                        "label": "2. Le sujet de ta première publication d'étude de cas :",
                        "placeholder": "Ex: 'Comment une boutique de Fort-de-France a généré 4 200€ de chiffre d'affaires supplémentaire en 30 jours grâce à ce protocole simple.'"
                    },
                    {
                        "id": "li_script_approche_dirigeant",
                        "channel": "linkedin",
                        "type": "textarea",
                        "label": "3. Ton message d'approche direct à forte valeur pour un dirigeant :",
                        "placeholder": "« Bonjour [Prénom], j'ai analysé votre présence en ligne et j'ai repéré 2 leviers simples pour booster vos prises de contact. Seriez-vous ouvert à ce que je vous partage une courte vidéo explicative ? »"
                    },
                    {
                        "id": "li_plan_14_jours",
                        "channel": "linkedin",
                        "type": "textarea",
                        "label": "4. Ton plan d'action commando LinkedIn sur les 14 prochains jours :",
                        "placeholder": "Jours 1-3 : Refonte complète du profil / Jours 4-10 : 2 posts de valeur + 10 commentaires pertinents par jour / Jours 11-14 : 15 messages personnalisés."
                    },
                    {
                        "id": "sec_plan_yt",
                        "channel": "youtube",
                        "type": "section-header",
                        "icon": "fa-brands fa-youtube",
                        "label": "Feuille de Route YouTube : Autorité Pérenne"
                    },
                    {
                        "id": "yt_titre_video_pilier_seo",
                        "channel": "youtube",
                        "type": "text",
                        "label": "1. Le titre de ta première vidéo pilier de fond (Optimisé recherche) :",
                        "placeholder": "Ex: 'Comment lancer sa marque de soins capillaires en 2026 sans budget de départ (Guide Complet)'"
                    },
                    {
                        "id": "yt_structure_hook_valeur_cta",
                        "channel": "youtube",
                        "type": "textarea",
                        "label": "2. La structure de ta vidéo (Hook 30s + 3 Piliers de valeur + Appel à l'action) :",
                        "placeholder": "0-1 min : Pourquoi 90% échouent / 1-12 min : Les 3 étapes indispensables expliquées / 12-14 min : Lien en description pour réserver un appel."
                    },
                    {
                        "id": "yt_lien_offre_description",
                        "channel": "youtube",
                        "type": "text",
                        "label": "3. La première phrase de ta description YouTube (Lien d'action) :",
                        "placeholder": "👉 Télécharge ton plan d'action offert en 1 clic : https://wa.me/..."
                    },
                    {
                        "id": "yt_plan_14_jours",
                        "channel": "youtube",
                        "type": "textarea",
                        "label": "4. Ton plan d'action commando YouTube sur les 14 prochains jours :",
                        "placeholder": "Semaine 1 : Écrire le script détaillé et créer la miniature / Semaine 2 : Tourner la vidéo, monter et publier avec chapitrage SEO."
                    }
                ]
            }
        },
        {
            "id": "chapitre-17",
            "number": 17,
            "badge": "Chapitre Pratique",
            "title": "Le Pitch en Une Phrase",
            "subtitle": "Comment expliquer ton business en 15 secondes chrono à un inconnu, un partenaire ou ta famille sceptique.",
            "readTime": "6 min",
            "content": "\\n                <p class=\\\"lead-text\\\">\\n                    Imagine la scène : tu es dans une soirée de famille, un événement de networking ou face à un commerçant local. Quelqu'un te demande : <em>\\\"Et toi, tu fais quoi concrètement ?\\\"</em>\\n                </p>\\n                <p>\\n                    Si tu commences à hésiter : <em>\\\"Euh alors en fait c'est un concept un peu spécial, une marque locale écoresponsable qui veut impacter la communauté...\\\",</em> tu as perdu. Ton interlocuteur a déjà les yeux dans le vague et hoche la tête par politesse.\\n                </p>\\n                <h3>La Formule Mathématique du Pitch Parfait</h3>\\n                <p>\\n                    Mémorise cette formule et grave-la dans ta mémoire de travail :\\n                </p>\\n                <div class=\\\"tip-card pitch-formula\\\">\\n                    <p>\\n                        <strong>« J'aide [Cible Précise] à [Résultat Concret Désiré] grâce à [Méthode Unique / Produit], sans [Frustration ou Peur Habituelle]. »</strong>\\n                    </p>\\n                </div>\\n                <h4>3 Exemples selon les voies :</h4>\\n                <ul>\\n                    <li><strong>Service :</strong> <em>« J'aide les restaurateurs des Antilles à doubler leurs réservations en semaine grâce à des vidéos TikTok locales, sans qu'ils aient besoin de passer une seule heure sur leur téléphone. »</em></li>\\n                    <li><strong>Produit Physique :</strong> <em>« J'aide les femmes aux cheveux texturés à relancer la pousse de leurs longueurs grâce à une synergie d'huiles végétales 100% caribéennes, sans aucun produit chimique agressif. »</em></li>\\n                    <li><strong>Digital & Accompagnement :</strong> <em>« J'aide les aspirants entrepreneurs de la diaspora à lancer leur premier business rentable en 30 jours grâce à une méthode pas à pas, sans attendre de prêt bancaire. »</em></li>\\n                </ul>\\n            \",
            "exercise": {
                "id": "ex_chapitre_17",
                "title": "Générateur Automatique de Pitch en Une Phrase",
                "description": "Complète les 4 briques ci-dessous. Ton pitch complet se génère automatiquement en bas :",
                "fields": [
                    {
                        "id": "pitch_cible",
                        "type": "text",
                        "label": "1. Qui aides-tu ? (Cible précise) :",
                        "placeholder": "Ex: Les commerçants locaux / Les femmes actives aux cheveux crépus..."
                    },
                    {
                        "id": "pitch_resultat",
                        "type": "text",
                        "label": "2. À obtenir quel résultat concret ? :",
                        "placeholder": "Ex: Doubler leurs réservations / Retrouver des cheveux denses et hydratés..."
                    },
                    {
                        "id": "pitch_methode",
                        "type": "text",
                        "label": "3. Grâce à quoi ? (Ton angle, produit ou méthode) :",
                        "placeholder": "Ex: Notre méthode de micro-vidéos ciblées / Notre formule végétale 100% locale..."
                    },
                    {
                        "id": "pitch_sans_douleur",
                        "type": "text",
                        "label": "4. Sans quelle contrainte majeure ? :",
                        "placeholder": "Ex: Sans budget publicitaire / Sans routine compliquée de 2 heures..."
                    },
                    {
                        "id": "pitch_complet_final",
                        "type": "textarea",
                        "label": "Ton pitch complet (généré et prêt à être prononcé à voix haute) :",
                        "placeholder": "J'aide [cible] à [résultat] grâce à [méthode], sans [contrainte]."
                    }
                ]
            }
        },
        {
            "id": "chapitre-18",
            "number": 18,
            "badge": "Feuille de Route Militaire",
            "title": "Tes 30 premiers jours d'action (Semaine par Semaine)",
            "subtitle": "Finies les hésitations. Voici ta checklist interactive complète pour les 4 prochaines semaines.",
            "readTime": "9 min",
            "content": "\\n                <p class=\\\"lead-text\\\">\\n                    Tu as refermé les théories. Tu connais ton Why, tes multi-avatars, ton échelle d'offres, ton point mort et ton pitch. Maintenant, que fais-tu concrètement lundi matin à 8h00 ?\\n                </p>\\n                <p>\\n                    Voici ta <strong>feuille de route sur 4 semaines</strong>. Une seule mission par semaine. 80% d'action, 20% de réflexion. Coche chaque case au fur et à mesure de tes victoires terrain :\\n                </p>\\n\\n                <div class=\\\"roadmap-container\\\">\\n                    <div class=\\\"roadmap-step\\\">\\n                        <div class=\\\"step-num\\\">S1</div>\\n                        <div class=\\\"step-body\\\">\\n                            <h4>Semaine 1 : Écoute Active & Découverte Terrain</h4>\\n                            <p><strong>Objectif :</strong> Parler à 5 vraies personnes cibles sans chercher à leur vendre quoi que ce soit pour extraire leurs douleurs exactes.</p>\\n                        </div>\\n                    </div>\\n\\n                    <div class=\\\"roadmap-step\\\">\\n                        <div class=\\\"step-num\\\">S2</div>\\n                        <div class=\\\"step-body\\\">\\n                            <h4>Semaine 2 : Packaging de l'Offre & Simulateur Financier</h4>\\n                            <p><strong>Objectif :</strong> Formaliser ton offre en 1 page, fixer ton prix à la valeur et configurer ton encaissement direct.</p>\\n                        </div>\\n                    </div>\\n\\n                    <div class=\\\"roadmap-step\\\">\\n                        <div class=\\\"step-num\\\">S3</div>\\n                        <div class=\\\"step-body\\\">\\n                            <h4>Semaine 3 : Visibilité, Chasse & Premier Encaissement</h4>\\n                            <p><strong>Objectif :</strong> Déclencher tes 3 premiers contenus (TOFU/MOFU/BOFU) et contacter 15 prospects pour encaisser tes premiers euros réels.</p>\\n                        </div>\\n                    </div>\\n\\n                    <div class=\\\"roadmap-step\\\">\\n                        <div class=\\\"step-num\\\">S4</div>\\n                        <div class=\\\"step-body\\\">\\n                            <h4>Semaine 4 : Sur-Délivrance & Effet Tremplin</h4>\\n                            <p><strong>Objectif :</strong> Livrer ton premier client avec un soin maniaque, récolter un témoignage vidéo, et postuler au Programme Tremplin.</p>\\n                        </div>\\n                    </div>\\n                </div>\\n            \",
            "exercise": {
                "id": "ex_chapitre_18",
                "title": "Checklist Interactive des 30 Premiers Jours",
                "description": "Coche chaque étape directement dans le carnet au fur et à mesure de ta progression. Tes coches sont sauvegardées automatiquement :",
                "fields": [
                    {
                        "id": "sec_s1_check",
                        "type": "section-header",
                        "icon": "fa-solid fa-calendar-week",
                        "label": "Semaine 1 : Validation & Écoute Terrain"
                    },
                    {
                        "id": "s1_check_1",
                        "type": "checkbox",
                        "label": "Identifier 10 personnes correspondant à mon profil Avatar (B2C ou B2B)",
                        "hint": "Profils réels sur WhatsApp, Instagram, LinkedIn ou commerces de proximité."
                    },
                    {
                        "id": "s1_check_2",
                        "type": "checkbox",
                        "label": "Réaliser 5 entretiens d'écoute de 15 minutes sans chercher à vendre",
                        "hint": "Poser des questions ouvertes sur leurs pires galères actuelles."
                    },
                    {
                        "id": "s1_check_3",
                        "type": "checkbox",
                        "label": "Consigner les expressions exactes et mots-clés prononcés par les prospects",
                        "hint": "Ces mots formeront le vocabulaire exact de tes futures pages et vidéos."
                    },
                    {
                        "id": "sec_s2_check",
                        "type": "section-header",
                        "icon": "fa-solid fa-file-invoice-dollar",
                        "label": "Semaine 2 : Packaging & Structure Financière"
                    },
                    {
                        "id": "s2_check_1",
                        "type": "checkbox",
                        "label": "Rédiger ma fiche d'offre en 1 page (promesse, livrables, garantie)",
                        "hint": "Une offre si claire qu'un adolescent de 14 ans la comprend en 30 secondes."
                    },
                    {
                        "id": "s2_check_2",
                        "type": "checkbox",
                        "label": "Calculer mon point mort et ma cadence de vente dans le Simulateur du Chapitre 11",
                        "hint": "Savoir exactement combien de ventes par semaine sont requises pour payer mes charges et mon salaire."
                    },
                    {
                        "id": "s2_check_3",
                        "type": "checkbox",
                        "label": "Créer mon compte d'encaissement et tester mon premier lien de paiement (Stripe / Wave)",
                        "hint": "Zéro blocage technique : être capable d'envoyer un lien de paiement par message en 5 secondes."
                    },
                    {
                        "id": "sec_s3_check",
                        "type": "section-header",
                        "icon": "fa-solid fa-bolt",
                        "label": "Semaine 3 : Contenu, Chasse Directe & Premier Cash"
                    },
                    {
                        "id": "s3_check_1",
                        "type": "checkbox",
                        "label": "Publier mes 3 premiers contenus stratégiques (1 TOFU, 1 MOFU, 1 BOFU)",
                        "hint": "Enregistrer les liens dans le carnet du Chapitre 15 pour suivre la régularité."
                    },
                    {
                        "id": "s3_check_2",
                        "type": "checkbox",
                        "label": "Recontacter les 5 personnes de la Semaine 1 avec une offre test à tarif préférentiel",
                        "hint": "'Suite à notre échange, j'ai conçu la solution exacte. J'ouvre 3 places tests avec 30% de remise en échange d'un retour d'expérience sincère.'"
                    },
                    {
                        "id": "s3_check_3",
                        "type": "checkbox",
                        "label": "Engager la conversation avec 15 nouveaux prospects qualifiés par message privé",
                        "hint": "Approche directe, humaine, axée sur la résolution de leur problème."
                    },
                    {
                        "id": "s3_check_4",
                        "type": "checkbox",
                        "label": "Encaisser mon tout premier acompte client ou mes 5 premières précommandes !",
                        "hint": "La preuve ultime qui éteint tous les doutes et valide le modèle économique."
                    },
                    {
                        "id": "sec_s4_check",
                        "type": "section-header",
                        "icon": "fa-solid fa-trophy",
                        "label": "Semaine 4 : Sur-Délivrance & Effet Tremplin"
                    },
                    {
                        "id": "s4_check_1",
                        "type": "checkbox",
                        "label": "Livrer la prestation ou le produit avec un effet 'Whaouh' (sur-délivrer)",
                        "hint": "Ajouter un petit bonus inattendu qui transforme le client en fan absolu."
                    },
                    {
                        "id": "s4_check_2",
                        "type": "checkbox",
                        "label": "Recueillir un témoignage vidéo ou écrit avec photo du client satisfait",
                        "hint": "Ton témoignage le plus précieux pour convaincre les 10 prochains clients sans effort."
                    },
                    {
                        "id": "s4_check_3",
                        "type": "checkbox",
                        "label": "Poser ma candidature au Programme Tremplin de Domtom Connect",
                        "hint": "Passer de la validation artisanale à une machine d'acquisition structurée en 8 semaines avec les mentors de l'écosystème."
                    }
                ]
            }
        },
        {
            "id": "conclusion",
            "number": 19,
            "badge": "Conclusion & Passage à l'Action",
            "title": "Pour conclure cette consultation",
            "subtitle": "Trois chemins s'offrent à toi. Le seul inacceptable, c'est de refermer ce guide et de ne rien faire.",
            "readTime": "4 min",
            "content": "\\n                <p class=\\\"lead-text\\\">\\n                    Si tu es arrivé jusqu'ici, tu ne portes plus ton projet de la même façon qu'au premier chapitre.\\n                </p>\\n                <p>\\n                    Tu sais maintenant qu'il n'existe pas un seul chemin pour entreprendre, mais plusieurs, et que le tien peut démarrer aujourd'hui avec ce que tu as réellement entre les mains. Tu as identifié ton Why, tes 5 histoires de référence, ton client idéal, ton seuil de rentabilité, la différence entre buzz d'influenceur et chiffre d'affaires réel, et ton plan militaire sur 30 jours.\\n                </p>\\n                <p>\\n                    Peu importe où tu te trouves — aux Antilles, en Guyane, à La Réunion, en Afrique ou dans une diaspora européenne — ce guide avait un seul et unique objectif : <strong>te prouver que c'est possible, que tu es légitime, et que commencer petit n'a jamais empêché personne d'aller très loin</strong>.\\n                </p>\\n\\n                <div class=\\\"cta-programs-section\\\">\\n                    <h3>Comment veux-tu continuer à avancer avec Domtom Connect ?</h3>\\n                    <p>Trois accélérateurs sont à ta disposition selon ton stade d'avancement :</p>\\n\\n                    <div class=\\\"programs-grid\\\">\\n                        <div class=\\\"program-card highlight\\\">\\n                            <span class=\\\"program-badge\\\">Le Plus Populaire</span>\\n                            <h4><i class=\\\"fa-solid fa-rocket\\\"></i> Le Programme Tremplin</h4>\\n                            <p class=\\\"program-desc\\\">\\n                                <strong>80% Action, 20% Réflexion</strong>. Un cadre collectif d'accélération intensive avec sessions de groupe, mentorat individuel et soutien opérationnel sur tes tâches chronophages pour lancer ton business en 8 semaines.\\n                            </p>\\n                            <a href=\\\"candidature-tremplin.html\\\" class=\\\"btn-program primary\\\">Candidater à Tremplin</a>\\n                        </div>\\n\\n                        <div class=\\\"program-card\\\">\\n                            <span class=\\\"program-badge\\\">Sur Mesure</span>\\n                            <h4><i class=\\\"fa-solid fa-user-tie\\\"></i> Accompagnement 1-à-1</h4>\\n                            <p class=\\\"program-desc\\\">\\n                                Des séances de consultation stratégique individuelles avec un expert du terrain ultramarin et africain pour débloquer tes choix de modèle, de prix et de prospection.\\n                            </p>\\n                            <a href=\\\"candidature-mastermind.html\\\" class=\\\"btn-program secondary\\\">Postuler au Mentorat</a>\\n                        </div>\\n\\n                        <div class=\\\"program-card\\\">\\n                            <span class=\\\"program-badge\\\">Délégation</span>\\n                            <h4><i class=\\\"fa-solid fa-gears\\\"></i> Le Copilotage</h4>\\n                            <p class=\\\"program-desc\\\">\\n                                Ton business tourne déjà mais tu es débordé sous la charge administrative, logistique et commerciale ? Notre équipe prend en charge tes opérations pour te redonner du temps libre.\\n                            </p>\\n                            <a href=\\\"pilotage.html\\\" class=\\\"btn-program secondary\\\">Découvrir le Copilotage</a>\\n                        </div>\\n                    </div>\\n                </div>\\n\\n                <div class=\\\"final-word\\\">\\n                    <p>\\n                        <em>« Les trois chemins sont valables. Le seul qui ne l'est pas, c'est celui où tu éteins ton écran et où tu ne fais rien de différent demain matin. »</em>\\n                    </p>\\n                </div>\\n            \",
            "exercise": {
                "id": "ex_conclusion",
                "title": "Bilan & Export de Ton Plan d'Action Entrepreneur",
                "description": "Toutes tes réponses saisies tout au long de ce guide ont été précieusement sauvegardées dans ton navigateur. Tu peux désormais exporter ton carnet de bord personnel complet :",
                "fields": [
                    {
                        "id": "conclusion_choix_action",
                        "type": "select",
                        "label": "Quelle est ta prochaine étape avec Domtom Connect ?",
                        "options": [
                            {
                                "value": "tremplin",
                                "label": "Je postule au programme Tremplin (80% Action)"
                            },
                            {
                                "value": "solo_30j",
                                "label": "J'exécute ma feuille de route 30 jours en solo"
                            },
                            {
                                "value": "mentorat",
                                "label": "Je demande une séance d'accompagnement individuel"
                            }
                        ]
                    }
                ]
            }
        }
    ]
};
`;

// Find index of chapitre-15
const ch15Index = code.indexOf('{\\n            "id": "chapitre-15",');
if (ch15Index === -1) {
    // try with regular spaces
    const regex = /\{\s*"id":\s*"chapitre-15",[\s\S]*$/;
    code = code.replace(regex, newChaptersContent.trimStart());
} else {
    code = code.slice(0, ch15Index) + newChaptersContent.trimStart();
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Update script finished successfully');
