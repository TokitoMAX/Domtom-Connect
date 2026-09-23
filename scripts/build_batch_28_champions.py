import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

data = [
  {
    "company": "Groupe SEEN",
    "name": "Direction générale",
    "email": "contact@groupeseen.com",
    "domain": "groupeseen.com",
    "zone": "Martinique (Le Robert)",
    "subject": "Économie circulaire et gestion environnementale insulaire / Groupe SEEN",
    "body": "Bonjour,\n\nLe Groupe SEEN accomplit une mission structurante et indispensable pour la Martinique en orchestrant la valorisation des déchets, le recyclage et la propreté environnementale de notre île.\n\nOpérer des centres de tri sous contrainte insulaire, gérer les flux logistiques vers les filières de retraitement et moderniser les infrastructures face aux impératifs écologiques demande une rigueur d'exploitation de chaque instant.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires réunissant les bâtisseurs et décideurs de nos régions, articulé autour d'un réseau privé WhatsApp et de notre future plateforme DTC Pulse, pensée pour booster la mise en relation et les coopérations directes entre dirigeants. Vous pouvez découvrir notre univers sur www.domtomconnect.com\n\nÀ votre niveau d'exploitation, quel est l'obstacle logistique ou la contrainte technique qui pèse le plus lourd sur vos opérations quotidiennes ?\n\nSeriez-vous partants pour un court échange téléphonique informel de dix minutes afin de partager vos priorités de terrain ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Socomat",
    "name": "Direction commerciale",
    "email": "contact@socomat.gp",
    "domain": "socomat.gp",
    "zone": "Guadeloupe (Baie-Mahault)",
    "subject": "Approvisionnements BTP et distribution de matériaux / Socomat",
    "body": "Bonjour,\n\nSocomat est un pilier de l'approvisionnement des chantiers guadeloupéens depuis Baie-Mahault, avec une offre complète en matériaux, acier, bois et quincaillerie professionnelle.\n\nDans un secteur BTP soumis aux aléas des cadences maritimes et à la volatilité des coûts de matières premières, maintenir la disponibilité immédiate des stocks pour les artisans et majors du bâtiment est un véritable tour de force.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires dédié aux entrepreneurs de terrain, connecté à notre réseau privé WhatsApp et à notre solution DTC Pulse pour dynamiser la commande directe et les synergies inter-entreprises. Vous pouvez jeter un œil à notre univers sur www.domtomconnect.com\n\nSur votre chaîne d'approvisionnement, quel est aujourd'hui le point de friction qui complique le plus la gestion des flux ou la rotation des stocks ?\n\nAuriez-vous dix minutes ces jours-ci pour un court échange téléphonique informel et sans engagement ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Groupe Ravate",
    "name": "Direction du développement",
    "email": "contact@ravate.com",
    "domain": "ravate.com",
    "zone": "La Réunion (Saint-Denis)",
    "subject": "Distribution spécialisée et dynamiques commerciales de l'océan Indien / Groupe Ravate",
    "body": "Bonjour,\n\nLe Groupe Ravate fait figure d'institution incontournable à La Réunion et dans l'océan Indien, avec un savoir-faire familial remarquable dans l'équipement de la maison, le bricolage et les matériaux professionnels.\n\nCoordonner un réseau d'enseignes d'une telle envergure, synchroniser les approvisionnements maritimes depuis l'Europe et l'Asie tout en préservant la compétitivité en rayon exige une mécanique logistique et commerciale exceptionnelle.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires reliant des dirigeants audacieux sur l'ensemble de nos territoires, adossé à un groupe privé WhatsApp et à notre future application DTC Pulse pour fluidifier les opportunités directes. Notre univers est présenté sur www.domtomconnect.com\n\nAu regard de vos enjeux de distribution, quelle est la priorité opérationnelle ou la transition qui accapare le plus votre temps de direction en ce moment ?\n\nSeriez-vous ouverts à un court échange téléphonique informel de dix minutes afin d'évoquer vos perspectives ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Caraïbes Froid Industrie",
    "name": "Direction technique",
    "email": "contact@caraibesfroid-industrie.com",
    "domain": "caraibesfroid-industrie.com",
    "zone": "Martinique & Guadeloupe",
    "subject": "Génie frigorifique et continuité de la chaîne du froid tropicale / Caraïbes Froid Industrie",
    "body": "Bonjour,\n\nCaraïbes Froid Industrie apporte une expertise indispensable pour l'agroalimentaire et la grande distribution aux Antilles, avec la conception et la maintenance d'installations frigorifiques industrielles.\n\nSous climat tropical, garantir la fiabilité absolue des chambres froides face aux coupures, maîtriser la transition vers des fluides frigorigènes écologiques et intervenir en urgence 24/7 demande une mobilisation d'équipes exemplaire.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'affaires direct entre dirigeants et techniciens d'excellence, articulé autour d'un groupe privé WhatsApp et de notre future application DTC Pulse pour faciliter les échanges sans friction. Vous pouvez découvrir notre démarche sur www.domtomconnect.com\n\nDans vos interventions sur le terrain, quel est le principal goulot d'étranglement entre l'approvisionnement en pièces détachées et le recrutement de profils frigoristes qualifiés ?\n\nSeriez-vous partants pour un court appel téléphonique informel de dix minutes afin de partager votre regard de terrain ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "FCR System",
    "name": "Direction générale",
    "email": "contact@fcr.re",
    "domain": "fcr.re",
    "zone": "La Réunion (Le Port)",
    "subject": "Froid industriel et efficacité énergétique péi / FCR System",
    "body": "Bonjour,\n\nFCR System est une référence de premier plan au Port pour le froid commercial et industriel à La Réunion, accompagnant les acteurs majeurs de la logistique et de l'agroalimentaire.\n\nAvec des coûts de l'électricité élevés et les exigences de décarbonation, concevoir des installations frigorifiques à haute efficacité énergétique tout en assurant un SAV réactif sur toute l'île est un défi technique passionnant.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires pour les entreprises de terrain, relié à notre groupe privé WhatsApp et à notre solution DTC Pulse pour dynamiser la mise en relation directe entre dirigeants. Notre univers est détaillé sur www.domtomconnect.com\n\nEn ce moment, quelle est la contrainte matérielle ou réglementaire qui vous prend le plus de temps utile dans le déploiement de vos chantiers ?\n\nAuriez-vous dix minutes cette semaine pour un échange téléphonique informel à ce propos ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "GFR Réunion",
    "name": "Direction d'exploitation",
    "email": "contact@gfr-reunion.com",
    "domain": "gfr-reunion.com",
    "zone": "La Réunion (Saint-Pierre)",
    "subject": "Climatisation commerciale et maintenance des parcs frigorifiques / GFR Réunion",
    "body": "Bonjour,\n\nLa Galaxie Frigorifique Réunionnaise fait un travail remarquable depuis Saint-Pierre pour équiper les commerces, supermarchés et collectivités en climatisation et froid de précision.\n\nMaintenir des parcs d'équipements sous fortes chaleurs et gérer les urgences tout en respectant les nouvelles normes environnementales demande une gymnastique organisationnelle permanente.\n\nChez Domtom Connect, nous développons un écosystème d'affaires direct entre chefs d'entreprise, adossé à un groupe privé WhatsApp et à notre plateforme DTC Pulse pour fluidifier les opportunités et la visibilité locale. Vous pouvez voir notre approche sur www.domtomconnect.com\n\nDans votre activité quotidienne, quel est le défi d'organisation interne ou de gestion des interventions qui mobilise le plus votre énergie ?\n\nSeriez-vous disponibles pour dix minutes d'échange téléphonique informel afin d'en discuter en toute simplicité ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Guyanet",
    "name": "Direction générale",
    "email": "contact@guyanet.fr",
    "domain": "guyanet.fr",
    "zone": "Guyane (Cayenne & Kourou)",
    "subject": "Services aux entreprises et réactivité multiservice en milieu équatorial / Guyanet",
    "body": "Bonjour,\n\nGuyanet s'est imposé comme le leader incontesté des services aux entreprises, de la propreté industrielle et de l'hygiène 3D sur l'ensemble du territoire guyanais.\n\nFaire tourner des centaines d'agents sur des sites stratégiques comme le Centre Spatial Guyanais à Kourou ou les centres hospitaliers, sous un climat équatorial exigeant, représente une formidable performance managériale et logistique.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires réunissant les acteurs clés de nos territoires, connecté à notre réseau privé WhatsApp et à notre application DTC Pulse pour créer des synergies économiques solides. Vous pouvez consulter notre projet sur www.domtomconnect.com\n\nÀ votre niveau d'exploitation, quelle est la problématique opérationnelle ou le défi RH qui pèse le plus sur la gestion quotidienne de vos équipes ?\n\nSeriez-vous d'accord pour un court échange téléphonique informel de dix minutes afin de confronter nos perspectives ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Jumbo Car Caraïbes",
    "name": "Direction des opérations",
    "email": "contact@jumbocar.com",
    "domain": "jumbocar.com",
    "zone": "Guadeloupe & Martinique",
    "subject": "Rotation des flottes et gestion des pics touristiques / Jumbo Car",
    "body": "Bonjour,\n\nJumbo Car Caraïbes est un acteur emblématique de la mobilité et de la location de voitures aux Antilles, avec une présence stratégique dans tous nos aéroports et pôles touristiques.\n\nAbsorber les variations saisonnières brutales entre la haute et la basse saison, maintenir un parc automobile irréprochable et contourner les commissions des comparateurs en ligne demande une agilité commerciale constante.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires direct entre acteurs de nos îles, structuré autour d'un groupe privé WhatsApp et de notre future application DTC Pulse, conçue pour valoriser les offres en vidéo et stimuler la réservation directe sans intermédiaire coûteux. Notre démarche est accessible sur www.domtomconnect.com\n\nDans votre pilotage de flotte, quel est aujourd'hui le principal casse-tête entre la maintenance des véhicules et l'optimisation des canaux de réservation directe ?\n\nSeriez-vous partants pour dix minutes d'échange téléphonique informel afin d'en parler tranquillement ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Outremer Transit",
    "name": "Direction commerciale",
    "email": "contact@outremertransit.com",
    "domain": "outremertransit.com",
    "zone": "Hexagone & Outre-Mer",
    "subject": "Fret maritime et continuité logistique avec nos territoires / Outremer Transit",
    "body": "Bonjour,\n\nOutremer Transit réalise un travail essentiel pour assurer le lien logistique, le déménagement et le transport de conteneurs entre l'Hexagone et nos territoires d'Outre-mer.\n\nFace aux tensions récurrentes sur les corridors maritimes, aux formalités douanières d'octroi de mer et aux attentes fortes des particuliers et professionnels, maintenir la fluidité des délais est un engagement exigeant.\n\nChez Domtom Connect, nous bâtissons actuellement un réseau d'affaires direct reliant entrepreneurs métropolitains et ultramarins, connecté à notre réseau privé WhatsApp et à notre solution DTC Pulse pour renforcer les passerelles économiques. Vous pouvez voir notre démarche sur www.domtomconnect.com\n\nActuellement, quel est le nœud logistique ou l'arbitrage portuaire qui vous demande le plus d'énergie dans la gestion des expéditions ?\n\nAuriez-vous dix minutes disponibles cette semaine pour un échange téléphonique informel et convivial ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Groupe Ballou",
    "name": "Direction générale",
    "email": "contactballou976@gmail.com",
    "domain": "gmail.com",
    "zone": "Mayotte (Mamoudzou)",
    "subject": "Approvisionnements insulaires et distribution commerciale à Mayotte / Groupe Ballou",
    "body": "Bonjour,\n\nLe Groupe Ballou est une maison historique de Mamoudzou qui accompagne le quotidien et l'équipement des Mahorais depuis plusieurs générations.\n\nFaire face aux délais maritimes au port de Longoni, sécuriser les réapprovisionnements de marchandises et s'adapter aux évolutions rapides du marché local demande une vraie force d'anticipation.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires reliant des dirigeants engagés sur tous nos territoires, adossé à un groupe privé WhatsApp et à notre future application DTC Pulse pour soutenir les initiatives locales. Vous pouvez découvrir notre démarche sur www.domtomconnect.com\n\nDans votre réalité de commerçant et distributeur mahorais, quelle est la contrainte logistique ou de trésorerie qui pèse le plus sur vos choix de gestion ?\n\nSeriez-vous ouverts à un court appel téléphonique informel de dix minutes afin de partager vos réflexions ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Koolboks",
    "name": "Direction commerciale",
    "email": "support@koolboks.com",
    "domain": "koolboks.com",
    "zone": "Afrique de l'Ouest & France",
    "subject": "Froid solaire connecté et résilience énergétique / Koolboks",
    "body": "Bonjour,\n\nKoolboks apporte une réponse technologique magistrale aux défis de conservation des commerçants et PME en Afrique avec vos réfrigérateurs solaires intelligents sans batterie lourde.\n\nPermettre à des milliers de points de vente et maraîchers de sauvegarder leurs denrées sans dépendre d'un réseau électrique instable transforme concrètement l'économie locale.\n\nChez Domtom Connect, nous bâtissons un écosystème d'affaires direct entre entrepreneurs innovants sur plusieurs continents, articulé autour d'un groupe privé WhatsApp et de notre plateforme DTC Pulse pour accélérer les passerelles B2B et la visibilité commerciale. Notre univers est présenté sur www.domtomconnect.com\n\nDans votre montée en échelle actuelle, quel est le principal goulot d'étranglement entre le financement des équipements et le réseau de distribution sur le terrain ?\n\nSeriez-vous partants pour dix minutes d'échange téléphonique informel afin d'évoquer nos synergies possibles ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  },
  {
    "company": "Groupe SIFCA",
    "name": "Direction de la communication",
    "email": "communication@sifca.ci",
    "domain": "sifca.ci",
    "zone": "Côte d'Ivoire (Abidjan)",
    "subject": "Agro-industrie durable et rayonnement ouest-africain / Groupe SIFCA",
    "body": "Bonjour,\n\nLe Groupe SIFCA fait la fierté de l'agro-industrie ivoirienne et régionale depuis plus de six décennies, avec un impact colossal sur les filières de l'huile de palme, du caoutchouc naturel et du sucre.\n\nPiloter des dizaines de milliers d'hectares, coordonner des usines de transformation complexes et mener la transition énergétique avec la valorisation de la biomasse représente une vision industrielle hors du commun.\n\nChez Domtom Connect, nous bâtissons actuellement un écosystème d'affaires fédérant des bâtisseurs et créateurs de valeur sur plusieurs continents, connecté à notre réseau privé WhatsApp et à notre solution DTC Pulse pour développer des synergies économiques directes. Vous pouvez consulter notre univers sur www.domtomconnect.com\n\nDans vos défis actuels de modernisation et de transition, quelle est la priorité opérationnelle qui mobilise le plus l'attention de vos dirigeants ?\n\nSeriez-vous d'accord pour un court échange téléphonique informel de dix minutes afin de partager nos perspectives ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
  }
]

with open('batch_28_champions_industrie_services.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Batch 28 généré avec succès ({len(data)} cibles industrielles et services B2B) !")
