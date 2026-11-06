"""Contenu de la boutique Domtom Connect (produits numériques). Tutoiement.

Uniquement des informations réelles : sommaire tiré de l'EPUB, prix et liens Stripe en place,
aucun prix barré (jamais pratiqué), aucun avis client (aucun n'existe à ce jour).
"""

STRIPE_LIVRE = "https://buy.stripe.com/8x228q71rfne9usgiN7Re07"
STRIPE_GUIDE = "https://buy.stripe.com/5kQ28qdpP6QI2205E97Re03"
STRIPE_PACK = "https://buy.stripe.com/9B6aEWetTcb25ec3w17Re04"

PARTIES = [
    ("Partie 1 · Cadrage et état d'esprit", "Ch. 1 à 4", ["Le mirage de l'entrepreneuriat", "Le mur invisible", "Trouver ton moteur profond", "La loi des 80/20"]),
    ("Partie 2 · Choisir sa voie et sa niche", "Ch. 5 à 10", ["Les cinq chemins de l'entrepreneuriat", "Choisir sa voie", "La spécialisation radicale", "L'espionnage commando", "La douleur du client", "La réputation insulaire"]),
    ("Partie 3 · Offre, marque et prix", "Ch. 11 à 18", ["L'identité sobre", "L'équation de la transformation", "L'offre irrésistible", "Le prix plancher", "L'offre bêta", "La clarté du message", "Encaisser avec dignité", "L'arsenal minimaliste"]),
    ("Partie 4 · Vendre et durer", "Ch. 19 à 28", ["Incarner sa marque", "La régularité sans souffrance", "Le canal unique", "La conversation humaine", "Le pitch en une phrase", "Traverser la tempête", "L'effet de recommandation", "Seul ou associé", "La feuille de route des 30 premiers jours", "La porte du cabinet se referme"]),
]

FAQ_COMMUNE = [
    ("Comment je reçois mon achat ?", "Le paiement se fait en ligne par carte via Stripe. Juste après, tu es redirigé vers ta page d'accès : téléchargement immédiat pour le livre, ouverture immédiate pour le guide interactif."),
    ("Le paiement est-il sécurisé ?", "Oui. Le paiement est traité par Stripe, l'une des plateformes de paiement les plus utilisées au monde. Domtom Connect n'a jamais accès à tes données bancaires."),
    ("Puis-je être remboursé ?", "Les produits numériques sont accessibles immédiatement, ils ne sont donc pas remboursables une fois ouverts. C'est pour ça que le chapitre 1 est lisible gratuitement avant d'acheter."),
    ("Ça marche sur téléphone ?", "Oui. Le livre se lit en PDF ou en EPUB sur téléphone, tablette, liseuse ou ordinateur. Le guide interactif s'ouvre dans ton navigateur, sur tous les appareils."),
    ("J'ai un souci avec ma commande, je fais comment ?", "Écris à domtomconnect@gmail.com ou sur WhatsApp au +33 6 20 78 33 77 avec l'adresse e-mail utilisée pour le paiement. On règle ça rapidement."),
]

PRODUITS = [
 {
  "slug": "les-fondamentaux-de-l-entrepreneur", "nom": "Les Fondamentaux de l'Entrepreneur", "court": "Le livre",
  "prix": 5, "stripe": STRIPE_LIVRE, "image": "/assets/images/mockup-couverture-guide-tome1-3d.jpg", "image_alt": "Couverture du livre Les Fondamentaux de l'Entrepreneur, Tome 1", "badge": "Idéal pour commencer",
  "galerie": [("/assets/images/mockup-couverture-guide-tome1-3d.jpg", "Le livre en 3D"), ("/assets/images/couverture-guide-tome1.jpg", "Couverture"), ("/assets/images/quatrieme-couverture-guide-tome1.jpg", "Quatrième de couverture")],
  "type": "Book", "format": "Livre numérique PDF et EPUB",
  "title": "Livre pour lancer son entreprise, Les Fondamentaux de l'Entrepreneur (5 €) | Domtom Connect",
  "description": "Le livre de Loïc Villeronce pour passer de l'idée aux premiers clients, pensé pour la Caraïbe, l'Afrique et la diaspora. 41 pages, 28 chapitres, PDF et EPUB, 5 €.",
  "eyebrow": "Livre numérique · Tome 1",
  "accroche": "De l'idée à tes premiers clients, sans capital de départ et sans te raconter d'histoires.",
  "pitch": "Un livre court et direct de Loïc Villeronce, écrit pour la réalité des entrepreneurs de la Caraïbe, d'Afrique et de la diaspora. Tu y trouves la posture, la méthode et les étapes concrètes pour lancer ton activité sans te ruiner.",
  "points": ["41 pages, 28 chapitres", "PDF haute définition et EPUB (liseuse, téléphone)", "Téléchargement immédiat après le paiement", "Lecture hors connexion sur tous tes appareils"],
  "pour_qui": [
    {"title": "Tu as une idée mais tu n'oses pas te lancer", "text": "Le livre t'aide à dépasser le syndrome de l'imposteur et à voir clair sur ce qui t'arrête vraiment."},
    {"title": "Tu n'as pas de capital de départ", "text": "Tu découvres comment valider ton idée et trouver tes premiers clients sans emprunt ni stock."},
    {"title": "Tu entreprends dans un petit marché", "text": "Réputation insulaire, bouche-à-oreille, prix plancher. Les exemples parlent de nos territoires, pas de la Silicon Valley."},
  ],
  "faq": [
    ("Quelle différence avec le guide interactif à 27 € ?", "Le livre est fait pour lire et poser ta vision. Le guide interactif reprend la méthode sous forme d'atelier en ligne, avec un carnet de bord qui garde tes réponses, un simulateur de rentabilité et l'export PDF de ton plan 30 jours."),
    ("Je peux lire un extrait avant d'acheter ?", "Oui. Le chapitre 1 est lisible gratuitement en ligne."),
  ],
 },
 {
  "slug": "guide-interactif", "nom": "Le Guide Interactif de l'Entrepreneur", "court": "Le guide interactif",
  "prix": 27, "stripe": STRIPE_GUIDE, "image": "/assets/images/bundle-mockup-tome1.jpg", "image_alt": "Le guide interactif Domtom Connect sur ordinateur et téléphone", "badge": "Le plus pratique",
  "galerie": [("/assets/images/bundle-mockup-tome1.jpg", "Le guide sur ordinateur et téléphone"), ("/assets/images/couverture-guide-tome1.jpg", "Couverture du Tome 1")],
  "type": "Product", "format": "Application web, accès à vie",
  "title": "Guide interactif pour créer son entreprise, simulateur et plan 30 jours (27 €) | Domtom Connect",
  "description": "La méthode des Fondamentaux de l'Entrepreneur en atelier en ligne. 27 étapes d'action, carnet de bord, simulateur de rentabilité et plan d'action 30 jours en PDF. 27 €.",
  "eyebrow": "Atelier en ligne · Accès à vie",
  "accroche": "Pas un PDF de plus. Un atelier qui te fait avancer étape par étape sur ton propre projet.",
  "pitch": "Le guide interactif reprend toute la méthode du livre sous forme d'application web. À chaque étape, tu réponds à des exercices concrets, tu calcules tes prix et ta rentabilité, et tu repars avec ton plan d'action des 30 premiers jours.",
  "points": ["Tout le contenu du livre, en version interactive", "27 étapes d'action concrètes", "Carnet de bord qui garde tes réponses", "Simulateur de rentabilité pour fixer tes prix", "Export PDF de ton plan d'action 30 jours", "Accès à vie et mises à jour sans surcoût"],
  "pour_qui": [
    {"title": "Tu veux passer à l'action, pas seulement lire", "text": "Chaque étape se termine par un exercice sur ton projet. Tu avances en faisant."},
    {"title": "Tu ne sais pas quel prix fixer", "text": "Le simulateur t'aide à calculer ton prix plancher et ce qu'il te faut vendre pour vivre de ton activité."},
    {"title": "Tu veux un plan clair pour démarrer", "text": "Tu repars avec ta feuille de route des 30 premiers jours, exportable en PDF."},
  ],
  "faq": [
    ("Mes réponses sont-elles sauvegardées ?", "Oui, dans le navigateur de l'appareil que tu utilises. Pense à exporter ton plan en PDF pour le garder partout."),
    ("J'ai déjà acheté le livre, je paie le prix complet ?", "Non. Après l'achat du livre, une offre te permet de passer au guide interactif pour 22 € au lieu de 27 €."),
  ],
 },
 {
  "slug": "pack-fondateur", "nom": "Le Pack Fondateur", "court": "Le pack fondateur",
  "prix": 47, "stripe": STRIPE_PACK, "image": "/assets/images/bundle-mockup-tome1.jpg", "image_alt": "Le pack fondateur Domtom Connect", "badge": "Le plus complet",
  "galerie": [("/assets/images/bundle-mockup-tome1.jpg", "Le guide interactif"), ("/assets/images/mockup-couverture-guide-tome1-3d.jpg", "Le Tome 1")],
  "type": "Product", "format": "Guide interactif et avantages membre fondateur",
  "title": "Pack Fondateur, guide interactif et avantages membre (47 €) | Domtom Connect",
  "description": "Le guide interactif complet, plus l'accès prioritaire à l'application DTC Pulse, la visibilité dans l'incubateur Domtom Connect et le badge membre fondateur. 47 €.",
  "eyebrow": "Guide interactif et statut fondateur",
  "accroche": "Pour aller au bout : la méthode complète et une place privilégiée dans la communauté Domtom Connect.",
  "pitch": "Le pack fondateur contient tout le guide interactif, et te donne en plus une place à part dans l'écosystème Domtom Connect, pour être vu et soutenu pendant que tu lances ton activité.",
  "points": ["Tout le guide interactif (27 étapes, carnet, simulateur, plan 30 jours)", "Accès prioritaire à l'application DTC Pulse", "Accompagnement et visibilité dans l'incubateur Domtom Connect", "Badge membre fondateur sur ton profil", "Paiement unique"],
  "pour_qui": [
    {"title": "Tu veux la méthode et le réseau", "text": "Tu as l'outil pour avancer seul, et une communauté d'entrepreneurs de la Caraïbe, d'Afrique et de la diaspora autour de toi."},
    {"title": "Tu veux être visible tôt", "text": "Le statut fondateur te met en avant auprès des membres du réseau."},
    {"title": "Tu crois au projet Domtom Connect", "text": "Tu fais partie des premiers à rejoindre l'aventure, avec les avantages qui vont avec."},
  ],
  "faq": [
    ("Qu'est-ce que DTC Pulse ?", "DTC Pulse est l'application de réseau de Domtom Connect pour les entrepreneurs et les communautés de la Caraïbe, de l'Afrique et de la diaspora. Tu y crées et gères toi-même ton compte."),
  ],
 },
]

EXTRAIT = ["Assieds-toi. Pose ton téléphone sur la table, écran retourné. Prends une grande inspiration, relâche les épaules et écoute ce que le silence a à te dire.",
           "Si tu as ouvert ce livre aujourd'hui, ce n'est pas par hasard. Ce n'est pas pour collectionner une méthode de plus, ni pour ajouter une couche de théorie à toutes celles qui encombrent déjà ton esprit.",
           "Tu es là parce qu'au fond de toi, une certitude silencieuse te travaille depuis des mois, peut-être des années. Tu sais que tu es capable de bâtir quelque chose de tes propres mains, mais quelque chose t'arrête net au bord du vide."]
