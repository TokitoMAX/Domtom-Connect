import json

data = [
  {
    "company": "Valcaco",
    "name": "Direction de la filière",
    "email": "contact@asso-valcaco.fr",
    "domain": "asso-valcaco.fr",
    "zone": "Martinique (Le Lorrain)",
    "subject": "Filière cacao d'excellence et défis de structuration / Valcaco",
    "body": "Bonjour,\n\nValcaco accomplit un travail admirable pour redonner au cacao de Martinique ses lettres de noblesse depuis Le Lorrain.\n\nFédérer les planteurs, garantir un niveau d'exigence élevé sur la fermentation des fèves et valoriser ce terroir insulaire face aux géants du marché demande une belle énergie au quotidien.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de producteurs de valeur, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour développer la visibilité directe et créer de vraies synergies d'affaires entre dirigeants. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nDans votre réalité actuelle, quelle est la contrainte pratique ou l'obstacle logistique qui freine le plus le déploiement de la filière ?\n\nSeriez-vous partants pour un court échange téléphonique informel de dix minutes afin de partager votre expérience de terrain ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Punch Mabi",
    "name": "Direction générale",
    "email": "contact@punchmabi.fr",
    "domain": "punchmabi.fr",
    "zone": "Guadeloupe (Sainte-Rose)",
    "subject": "Savoir-faire artisanal et approvisionnements locaux / Punch Mabi",
    "body": "Bonjour,\n\nLes Punchs Mabi sont devenus une référence incontournable de l'artisanat guadeloupéen avec cette macération authentique de fruits frais locaux qui fait la fierté de Sainte-Rose.\n\nTravailler exclusivement des fruits de saison et gérer la régularité des arrivages tout en répondant à la demande des amateurs exigeants exige une vigilance permanente sur les approvisionnements.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de producteurs de valeur, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour développer la visibilité directe et créer de vraies synergies d'affaires entre dirigeants. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nDans votre quotidien d'artisan d'exception, quel est aujourd'hui le plus grand défi d'organisation ou de gestion des flux qui mobilise vos équipes ?\n\nSeriez-vous disponible pour un échange informel de dix minutes ces prochains jours afin d'en parler en toute simplicité ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Sucrerie du Galion",
    "name": "Direction d'exploitation",
    "email": "boutique@legalion.eu",
    "domain": "legalion.eu",
    "zone": "Martinique (La Trinité)",
    "subject": "Patrimoine sucrier et équilibres industriels / Le Galion",
    "body": "Bonjour,\n\nLa Sucrerie du Galion fait vivre avec force le patrimoine sucrier de la Martinique depuis plus d'un siècle et demi au fond de la baie de La Trinité.\n\nFaire tourner une telle usine, synchroniser les campagnes avec les coupeurs et usiniers tout en préservant la rentabilité dans un environnement insulaire représente une vraie performance industrielle.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et d'industriels engagés, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour renforcer les passerelles d'affaires directes entre dirigeants. Vous pouvez d'ailleurs découvrir notre démarche sur www.domtomconnect.com\n\nÀ votre niveau d'exploitation, quel est l'arbitrage technique ou la contrainte de maintenance qui vous prend le plus de temps utile ?\n\nSeriez-vous ouverts à un court échange téléphonique informel de dix minutes cette semaine pour échanger sur vos priorités ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Theobroma Cacao Guyane",
    "name": "Direction générale",
    "email": "hello@theobroma-cacao-guyane.fr",
    "domain": "theobroma-cacao-guyane.fr",
    "zone": "Guyane (Régina / Cayenne)",
    "subject": "Cacao d'Amazonie et logistique équatoriale / Theobroma Guyane",
    "body": "Bonjour,\n\nVotre démarche bean-to-bar valorisant le cacao sauvage guyanais est fascinante et met en lumière les trésors aromatiques uniques de la forêt amazonienne.\n\nSourcer des fèves au cœur du fleuve Approuague, maîtriser la fermentation sous un climat équatorial et acheminer la production vers les comptoirs de vente demande une inventivité logistique sans faille.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de producteurs de valeur, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour développer la visibilité directe et créer de vraies synergies d'affaires entre dirigeants. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nDans votre exploitation au jour le jour, quel est le nœud d'organisation le plus complexe à gérer ?\n\nSeriez-vous disponibles pour dix minutes d'échange téléphonique informel afin d'évoquer votre aventure artisanale ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Biscuiterie de La Vallée",
    "name": "Direction artisanale",
    "email": "info@biscuiteriedelavallee.re",
    "domain": "biscuiteriedelavallee.re",
    "zone": "La Réunion (Saint-Pierre)",
    "subject": "Sablés péi et valorisation des farines locales / Biscuiterie de La Vallée",
    "body": "Bonjour,\n\nVotre travail de valorisation des ressources de l'île à travers vos sablés au manioc, à la patate douce et à la vanille Bourbon illustre magnifiquement la gourmandise péi depuis Saint-Pierre.\n\nDévelopper une gamme sans gluten à base de tubercules locaux tout en maintenant une régularité de texture et de conservation en milieu tropical est un défi technique pointu.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et d'artisans passionnés, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour dynamiser la mise en relation et la visibilité directe entre dirigeants. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nEn ce moment, quel est le sujet de production ou de distribution qui accapare le plus votre temps de direction ?\n\nAuriez-vous dix minutes cette semaine pour un échange téléphonique convivial à ce propos ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Pâtisserie Suréna",
    "name": "Direction générale",
    "email": "contact@patisserie-surena.com",
    "domain": "patisserie-surena.com",
    "zone": "Martinique (Fort-de-France)",
    "subject": "Transmission artisanale et douceurs d'antan / Pâtisserie Suréna",
    "body": "Bonjour,\n\nLa Pâtisserie Suréna incarne la mémoire gourmande et l'excellence artisanale de Fort-de-France depuis 1906, avec ses fameux robins et ses recettes transmises de génération en génération.\n\nFaire perdurer une telle maison plus d'un siècle, former les jeunes artisans et préserver une qualité constante face à l'évolution des coûts d'ingrédients requiert un dévouement de chaque instant.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et d'acteurs de transmission, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour faire rayonner nos savoir-faire et créer des ponts d'affaires solides. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nDans votre gestion quotidienne, quelle est la priorité ou la difficulté opérationnelle qui pèse le plus sur votre organisation ?\n\nSeriez-vous d'accord pour un court échange téléphonique informel de dix minutes afin de partager vos réflexions ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Vanille Lavany",
    "name": "Direction des plantations",
    "email": "contact@vanillelavany.com",
    "domain": "vanillelavany.com",
    "zone": "Madagascar (Région SAVA) & France",
    "subject": "Excellence de la vanille Bourbon et filières directes / Vanille Lavany",
    "body": "Bonjour,\n\nVanille Lavany fait un travail remarquable pour honorer les planteurs de Betavilona et d'Antalaha, en offrant aux artisans des gousses Bourbon d'une qualité aromatique rare.\n\nMaîtriser l'affinage traditionnel, sécuriser les approvisionnements à Madagascar face aux variations climatiques et maintenir un lien direct sans intermédiaire est un engagement exigeant.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de producteurs de valeur, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour développer la visibilité directe et ouvrir de nouvelles opportunités d'affaires sans frontières. Vous pouvez d'ailleurs découvrir notre démarche sur www.domtomconnect.com\n\nDans votre filière, quelle est la contrainte logistique ou le défi de marché qui vous demande le plus d'énergie actuellement ?\n\nSeriez-vous ouverts à un court échange téléphonique de dix minutes ces jours-ci pour en discuter en toute simplicité ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Chocolaterie Menakao",
    "name": "Direction générale",
    "email": "contact@menakao.com",
    "domain": "menakao.com",
    "zone": "Madagascar (Sambirano & Antananarivo)",
    "subject": "Cacao fin du Sambirano et transformation locale / Menakao",
    "body": "Bonjour,\n\nMenakao démontre avec éclat la puissance du savoir-faire malgache, en transformant sur place les fèves d'exception de la vallée du Sambirano en chocolats reconnus mondialement.\n\nOpérer une manufacture de chocolat de bout en bout à Madagascar, gérer la climatisation des ateliers et distribuer à l'international impose une rigueur d'exécution exceptionnelle.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de manufactures d'excellence, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour favoriser les échanges directs et la visibilité internationale sans friction. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nAu quotidien, quelle est la difficulté logistique ou de commercialisation export qui mobilise le plus votre attention ?\n\nSeriez-vous disponibles pour un court échange informel de dix minutes afin de confronter nos perspectives ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Choco Togo",
    "name": "Direction de la coopérative",
    "email": "contact@chocotogo.com",
    "domain": "chocotogo.com",
    "zone": "Togo (Kpalimé & Lomé)",
    "subject": "Chocolat équitable et valorisation des planteurs / Choco Togo",
    "body": "Bonjour,\n\nChoco Togo réalise une œuvre exemplaire pour valoriser le cacao togolais de Kpalimé et faire émerger une transformation artisanale équitable et biologique en Afrique de l'Ouest.\n\nCoordonner des centaines de petits producteurs, maintenir des certifications strictes et conquérir des parts de marché face aux produits importés demande une ténacité sans relâche.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de producteurs engagés, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour créer des passerelles d'affaires directes et solidaires entre bâtisseurs. Vous pouvez d'ailleurs découvrir notre démarche sur www.domtomconnect.com\n\nDans votre développement actuel, quel est le principal goulot d'étranglement opérationnel auquel vous faites face ?\n\nAccepteriez-vous un court appel téléphonique informel de dix minutes pour échanger de manière chaleureuse ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Mon Choco",
    "name": "Direction générale",
    "email": "superchoco@monchoco.com",
    "domain": "monchoco.com",
    "zone": "Côte d'Ivoire (Abidjan)",
    "subject": "Chocolat cru à la meule et innovation ivoirienne / Mon Choco",
    "body": "Bonjour,\n\nMon Choco bouscule magnifiquement les codes de la chocolaterie depuis Abidjan avec ce concept pionnier de fèves crues broyées à la pierre sans cuisson.\n\nÉduquer le marché à une nouvelle façon de savourer le cacao, maîtriser la conservation sans additifs et assurer la distribution sous la chaleur tropicale représente un sacré tour de force.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de créateurs audacieux, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour accélérer les connexions directes et la visibilité commerciale. Vous pouvez d'ailleurs découvrir notre démarche sur www.domtomconnect.com\n\nDans votre montée en puissance, quel est le défi d'organisation interne qui vous demande le plus de temps ?\n\nSeriez-vous partants pour dix minutes d'échange téléphonique informel cette semaine afin d'évoquer votre trajectoire ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Tahiti Vanille",
    "name": "Direction générale",
    "email": "info@tahiti-vanille.com",
    "domain": "tahiti-vanille.com",
    "zone": "Polynésie française (Taha'a & Raiatea)",
    "subject": "Grand Cru de Taha'a et rayonnement mondial / Tahiti Vanille",
    "body": "Bonjour,\n\nTahiti Vanille et Alain Abel ont hissé la vanille de Polynésie au sommet mondial de la gastronomie, avec ce travail d'orfèvre récompensé par les plus grands jurys.\n\nSélectionner des gousses mûres à point, orchestrer un affinage méticuleux et acheminer ce produit rare vers les grands chefs aux quatre coins du globe demande une exigence absolue.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de producteurs de valeur, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour relier les pépites de nos terroirs aux marchés internationaux sans intermédiaire inutile. Vous pouvez d'ailleurs découvrir notre démarche sur www.domtomconnect.com\n\nÀ votre niveau d'excellence, quelle est la contrainte logistique ou de gestion des flux qui reste la plus délicate à maîtriser ?\n\nSeriez-vous disposés à consacrer dix minutes pour un échange téléphonique informel afin de partager votre vision ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Terre Exotique",
    "name": "Direction générale",
    "email": "contact@terreexotique.fr",
    "domain": "terreexotique.fr",
    "zone": "France / Cameroun (Poivre de Penja) & Monde",
    "subject": "Trésors botaniques et expéditions d'épices rares / Terre Exotique",
    "body": "Bonjour,\n\nTerre Exotique accomplit une quête remarquable depuis l'aventure originelle du Poivre de Penja au Cameroun, en révélant les baies et poivres les plus singuliers de la planète.\n\nEntretenir des filières de récolte éthiques sur plusieurs continents, garantir une traçabilité sans faille et faire voyager ces pépites aromatiques vers les gastronomes demande une mécanique logistique de haute précision.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'entrepreneurs et de sourceurs d'exception, connecté à notre groupe privé WhatsApp et à notre écosystème DTC Pulse pour valoriser les terroirs rares et créer des synergies directes entre fondateurs. Vous pouvez d'ailleurs découvrir notre univers sur www.domtomconnect.com\n\nDans votre fonctionnement actuel, quel est l'irritant d'acheminement ou de gestion des stocks qui pèse le plus sur vos journées ?\n\nSeriez-vous partants pour dix minutes d'échange téléphonique informel afin d'échanger en toute simplicité ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  }
]

with open('batch_26_terroir_excellence.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Batch 26 mis à jour avec succès avec le lien www.domtomconnect.com, le réseau d'entrepreneurs, le groupe WhatsApp et DTC Pulse !")
