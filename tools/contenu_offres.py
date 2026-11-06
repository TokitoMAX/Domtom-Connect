"""Contenu des pages d'offre. Fidèle à ce que Domtom Connect propose réellement, sans chiffres inventés."""

STEPS_STD = [("Un échange de 30 minutes", "Offert. Vous présentez votre situation, nous vous disons franchement si nous pouvons vous aider."),
             ("Une séance stratégique", "Une heure pour poser vos priorités, avec un plan d'action écrit. 100 €, déduits si vous continuez."),
             ("Un accompagnement sur mesure", "Le format et le rythme sont définis ensemble, puis précisés dans un devis.")]

OFFRES = [
 {
  "file": "pilotage.html", "label": "Copilotage opérationnel", "active": "",
  "title": "Copilotage opérationnel et direction externe | Domtom Connect",
  "description": "Un bras droit externe pour les dirigeants de TPE et PME de la Caraïbe, d'Afrique et de la diaspora. Marges, organisation, priorités et suivi régulier.",
  "eyebrow": "Copilotage opérationnel · Direction externe",
  "h1": ("Un copilote pour votre entreprise,", "pour reprendre la main sur vos marges et votre organisation."),
  "lead": "Coûts d'importation, logistique, équipe, clients, administratif. Votre temps de dirigeant part dans les détails. Nous intervenons comme votre bras droit externe pour protéger votre rentabilité, organiser le quotidien et vous laisser piloter.",
  "facts": [("30 min", "premier échange offert"), ("100 €", "séance stratégique, déduite du devis"), ("Sur devis", "copilotage dimensionné pour vous")],
  "steps": STEPS_STD,
  "service_name": "Copilotage opérationnel et direction externe d'entreprise",
  "service_types": ["Copilotage opérationnel", "Pilotage des marges", "Organisation", "Direction externe"],
  "ld_offers": [{"@type": "Offer", "name": "Échange de 30 minutes", "price": "0", "priceCurrency": "EUR"},
                {"@type": "Offer", "name": "Séance stratégique", "price": "100", "priceCurrency": "EUR", "url": "https://domtomconnect.com/seance-strategique"}],
  "sections": [
   {"type": "cards", "id": "piege", "eyebrow": "Le piège classique", "h2": "Chercher plus de clients ne règle pas tout",
    "intro": "Beaucoup de dirigeants pensent avoir un problème de visibilité. Souvent, c'est l'organisation et les marges qui bloquent. Envoyer plus de clients dans une machine engorgée ne fait qu'aggraver les choses.",
    "cols": 2, "items": [
     {"tag": "Dépenses", "title": "De la communication sans retour", "text": "Un site ou des publications payés sans avoir vérifié ce que rapporte vraiment chaque vente, une fois le fret et les charges déduits."},
     {"tag": "Saturation", "title": "Plus de clients, plus de retards", "text": "Quand les process internes sont engorgés, chaque nouveau client dégrade la qualité de service et les délais."},
     {"tag": "Course sans fin", "title": "Toujours chercher le client suivant", "text": "Pas d'offre complémentaire pour les clients existants, donc une prospection permanente pour maintenir le chiffre d'affaires."},
     {"tag": "Charge mentale", "title": "Le dirigeant pompier", "text": "Vous restez celui qui éteint tous les feux, au lieu de vous concentrer sur ce que vous faites de mieux."},
    ]},
   {"type": "cards", "id": "leviers", "eyebrow": "Ce que nous prenons en charge", "h2": "Trois leviers pour une entreprise plus solide",
    "items": [
     {"tag": "Marges et trésorerie", "title": "Savoir ce qui rapporte vraiment", "text": "Nous analysons vos coûts de revient, y compris le fret et l'octroi de mer, et nous suivons votre trésorerie avec vous.",
      "list": ["Rentabilité par offre et par produit", "Anticipation des tensions de trésorerie", "Réduction des coûts de transport et de logistique"]},
     {"tag": "Offres et clients", "title": "Vendre mieux à vos clients", "text": "Nous repositionnons vos offres pour attirer une clientèle solvable, locale et dans la diaspora, et faire revenir vos clients.",
      "list": ["Offres restructurées", "Qualification des prospects", "Ventes complémentaires aux clients existants"]},
     {"tag": "Direction opérationnelle", "title": "Un bras droit au quotidien", "text": "Nous cadrons les priorités, suivons les prestataires et levons les blocages avec vous, lors de points réguliers.",
      "list": ["Points réguliers avec tableau de bord", "Suivi des prestataires", "Décisions prises plus sereinement"]},
    ]},
   {"type": "cards", "id": "methode", "eyebrow": "La méthode", "h2": "Le copilotage en trois étapes",
    "items": [
     {"tag": "Étape 1", "title": "Faire le point", "text": "Un échange offert de 30 minutes, puis si besoin une séance stratégique pour analyser vos marges, vos coûts et vos blocages."},
     {"tag": "Étape 2", "title": "Une feuille de route à 90 jours", "text": "Un plan d'action précis, centré sur la trésorerie, la clarté de vos offres et les points qui bloquent."},
     {"tag": "Étape 3", "title": "Le copilotage", "text": "Des points réguliers, un tableau de bord partagé et un soutien opérationnel pour tenir le cap."},
    ]},
   {"type": "pricing", "id": "tarifs", "eyebrow": "Comment démarrer", "h2": "Une première marche claire, puis du sur mesure"},
   {"type": "faq", "id": "faq", "eyebrow": "Questions fréquentes", "h2": "Ce que les dirigeants nous demandent sur le copilotage"},
  ],
  "faq": [
   ("Quelle différence entre un copilote et un consultant ?", "Un consultant remet souvent un rapport et s'en va. Le copilote travaille avec vous dans la durée, suit les actions, ajuste les priorités et vous aide à décider au fil de l'eau."),
   ("Combien coûte le copilotage ?", "Le copilotage est proposé sur devis, selon la taille de votre entreprise et le rythme souhaité. Le premier échange de 30 minutes est offert, et la séance stratégique à 100 € permet de poser le diagnostic. Son montant est déduit si vous continuez."),
   ("Combien de temps dure un copilotage ?", "Nous construisons d'abord une feuille de route à 90 jours. La suite se décide ensemble selon les résultats et vos besoins."),
   ("Le copilotage se fait-il à distance ?", "Oui. Les points se font en visio, au téléphone et sur WhatsApp, où que vous soyez dans la Caraïbe, en Afrique ou dans l'Hexagone."),
   ("Mes informations restent-elles confidentielles ?", "Oui. Les chiffres et les informations de votre entreprise restent strictement confidentiels."),
  ],
  "cta_title": "Parlons de votre entreprise",
  "cta_text": "Trente minutes offertes avec Loïc Villeronce pour regarder vos marges, votre organisation et vos priorités, et voir si le copilotage a du sens pour vous.",
 },
 {
  "file": "tremplin.html", "label": "Programme Tremplin", "active": "tremplin",
  "title": "Programme Tremplin pour porteurs de projet | Domtom Connect",
  "description": "Lancer ou relancer son entreprise accompagné, dans la Caraïbe, en Afrique et la diaspora. Offre, prix, site, prospection et finances, construits avec vous.",
  "eyebrow": "Programme Tremplin · Porteurs de projet et jeunes entreprises",
  "h1": ("Le Programme Tremplin,", "pour lancer votre entreprise avec un vrai accompagnement."),
  "lead": "Pas de théorie. Nous construisons avec vous les outils dont votre entreprise a besoin pour démarrer ou passer un cap, votre offre, vos prix, votre site, votre prospection, et nous ne passons à l'étape suivante que lorsque la précédente fonctionne.",
  "ctas": [("/candidature-tremplin", "Déposer ma candidature", True), ("CAL", "Réserver un échange de 30 minutes", False)],
  "facts": [("6 piliers", "activés selon votre projet"), ("Individuel", "et ateliers collectifs"), ("Sur candidature", "places limitées par session")],
  "steps_title": "Comment rejoindre le Tremplin",
  "steps": [("Un échange de 30 minutes", "Offert. Vous présentez votre projet et vos objectifs."),
            ("Votre candidature", "Vous déposez votre dossier en ligne, nous choisissons ensemble les piliers prioritaires."),
            ("Le programme", "Nous construisons vos outils à vos côtés, étape par étape, sur devis.")],
  "service_name": "Programme Tremplin, accompagnement à la création et au développement d'entreprise",
  "service_types": ["Accompagnement à la création d'entreprise", "Positionnement et tarification", "Création de site web", "Prospection", "Structuration financière"],
  "sections": [
   {"type": "cards", "id": "principes", "eyebrow": "Ce qui change d'une formation classique", "h2": "Trois principes, un seul objectif, le résultat",
    "items": [
     {"title": "Jusqu'au bout", "text": "Pas de conseils suivis d'un au revoir. Nous travaillons avec vous jusqu'à ce que l'objectif soit atteint, en vous aidant à lever chaque blocage."},
     {"title": "Rien à moitié fait", "text": "Pas de site terminé à 80 % ni d'offre approximative. Chaque élément est finalisé, testé et utilisable avant de passer au suivant."},
     {"title": "La preuve par le livrable", "text": "Chaque étape se termine par quelque chose de concret et en service, pas par une simple fiche ou une liste de conseils."},
    ]},
   {"type": "cards", "id": "piliers", "eyebrow": "Les 6 piliers", "h2": "Ce que nous construisons avec vous",
    "intro": "Selon votre avancement, nous activons les piliers les plus utiles pour votre projet.",
    "items": [
     {"tag": "Pilier 1", "title": "Positionnement et offre", "text": "Votre promesse, vos offres en plusieurs niveaux et des prix qui couvrent vraiment vos coûts."},
     {"tag": "Pilier 2", "title": "Site web", "text": "Un site clair, rapide, qui présente bien votre activité et permet de vous contacter facilement."},
     {"tag": "Pilier 3", "title": "Identité visuelle", "text": "Un logo et une charte simples et soignés, pour inspirer confiance dès le premier regard."},
     {"tag": "Pilier 4", "title": "Prospection", "text": "Une méthode pour trouver vos premiers clients, les qualifier et les relancer."},
     {"tag": "Pilier 5", "title": "Finances", "text": "Facturation, moyens de paiement et calcul de votre marge par prestation ou par produit."},
     {"tag": "Pilier 6", "title": "Visibilité et contenu", "text": "Une routine de contenu réaliste pour vous faire connaître et asseoir votre crédibilité."},
    ]},
   {"type": "cards", "id": "format", "eyebrow": "Le format", "h2": "Un accompagnement individuel, et un collectif pour ne pas rester seul",
    "cols": 2, "items": [
     {"tag": "En individuel", "title": "Nous construisons ensemble", "text": "Nous travaillons avec vous en partage d'écran pour concevoir, rédiger et configurer vos outils. Vous repartez avec un résultat, pas avec des consignes."},
     {"tag": "En collectif", "title": "Des ateliers entre entrepreneurs", "text": "Des sessions avec d'autres entrepreneurs qui travaillent sur les mêmes sujets, pour confronter vos idées, vous entraider et avancer plus vite."},
    ]},
   {"type": "faq", "id": "faq", "eyebrow": "Questions fréquentes", "h2": "Avant de candidater"},
  ],
  "faq": [
   ("À qui s'adresse le Programme Tremplin ?", "Aux porteurs de projet prêts à se lancer et aux jeunes entreprises qui veulent passer un cap, dans la Caraïbe, en Afrique, à La Réunion ou dans la diaspora."),
   ("Combien coûte le Programme Tremplin ?", "Le prix dépend des piliers activés pour votre projet. Il est précisé dans un devis après l'échange offert de 30 minutes et l'étude de votre candidature."),
   ("Pourquoi faut-il candidater ?", "Le nombre de projets par session est limité, pour garantir un accompagnement intensif. La candidature permet de vérifier que le programme correspond à votre situation."),
   ("Le programme se fait-il à distance ?", "Oui. Le travail individuel se fait en visio avec partage d'écran, et les ateliers collectifs en ligne."),
   ("Je préfère avancer seul pour l'instant, que me conseillez-vous ?", "Vous pouvez commencer par le diagnostic gratuit et par le guide pratique Tome 1, disponible dès 5 €, pour poser les bases de votre projet."),
  ],
  "cta_title": "Prêt à passer à l'action ?",
  "cta_text": "Déposez votre candidature ou réservez un échange offert de 30 minutes pour parler de votre projet avec Loïc Villeronce.",
 },
]

# Page création de site web (contenu dans contenu_site_web.py)
from contenu_site_web import OFFRE_SITE
OFFRES.append(OFFRE_SITE)
