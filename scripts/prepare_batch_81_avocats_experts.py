import sys, os, json, re
sys.stdout.reconfigure(encoding='utf-8')

# Batch 81: Cabinets d'Avocats, Droit des Affaires & Experts-Comptables Outre-Mer et Afrique
LEADS = [
    {
        "company": "Cabinet Fred Germain - ATHENA",
        "email": "cabinet@avocats-athena.com",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.fredgermainavocat-athena.com",
        "subject": "Échange confraternel et temps de direction pour le Cabinet ATHENA",
        "body": """Bonjour Maître Germain,

C'est avec beaucoup d'attention que j'observe le travail du Cabinet ATHENA à Fort-de-France, notamment dans la défense des entreprises, le droit immobilier et l'accompagnement contractuel en Martinique.

Je vous contacte au nom de Domtom Connect. Nous avons créé un écosystème d'accompagnement de terrain dédié aux chefs d'entreprise et professions libérales de la Caraïbe et de la diaspora.

Nous constatons que beaucoup d'associés et d'avocats passent un temps considérable sur la gestion quotidienne de leur cabinet, les relances d'honoraires et l'intendance administrative, ce qui alourdit leur charge mentale. À travers notre copilotage opérationnel et notre diagnostic gratuit, nous aidons les professionnels du droit à déléguer ces tâches chronophages tout en les connectant à notre réseau de dirigeants partenaires via notre groupe WhatsApp et notre tech propriétaire DTC Pulse.

Seriez-vous ouvert à un court échange téléphonique de quinze minutes ces prochains jours afin de faire connaissance ?

Vous pouvez réserver directement le moment qui vous convient sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "LEGALEX AVOCAT",
        "email": "contact@legalexavocat.com",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.legalexavocat.com",
        "subject": "Synergies d'affaires et structuration opérationnelle pour LEGALEX",
        "body": """Bonjour Maître,

Je suis avec un vif intérêt le positionnement de LEGALEX AVOCAT à Fort-de-France, en particulier votre savoir-faire en droit des sociétés, en droit commercial et en accompagnement patrimonial de dirigeants.

Je me permets de vous contacter au nom de Domtom Connect. Notre mission est d'épauler concrètement les entrepreneurs et les structures professionnelles des Antilles et de la diaspora dans leur croissance quotidienne.

Nos membres ont un besoin récurrent de conseils juridiques pointus pour sécuriser leurs montages et leurs opérations. En parallèle, nous aidons les cabinets partenaires à structurer leur gestion interne et à déléguer l'intendance grâce à nos solutions de copilotage et à notre diagnostic d'anamnèse clinique.

Seriez-vous disponible pour une brève conversation de quinze minutes cette semaine pour évaluer de potentielles passerelles ?

Vous pouvez sélectionner un créneau directement à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet S.F.B. Avocat & Lawyer",
        "email": "contact@avocat-guadeloupe.com",
        "territory": "Guadeloupe & Saint-Martin",
        "source": "https://www.avocat-guadeloupe.com",
        "subject": "Échange confraternel et synergies d'affaires pour Maître Serge Bille",
        "body": """Bonjour Maître Bille,

Votre réputation et votre pratique transfrontalière entre la Guadeloupe, Saint-Martin et l'international apportent une réelle valeur ajoutée aux entreprises qui doivent naviguer entre plusieurs environnements réglementaires.

Je vous écris au nom de Domtom Connect. Nous développons un écosystème d'accompagnement pragmatique pour les entrepreneurs ultramarins et les acteurs économiques de la région.

Nous intervenons notamment sur le copilotage opérationnel pour soulager les dirigeants de cabinet de leur intendance administrative et fluidifier leurs processus de gestion. Nous disposons également d'une communauté active sur WhatsApp et d'une application mobile en bêta fermée, DTC Pulse, qui rassemble des chefs d'entreprise en recherche constante de conseils juridiques de confiance.

Seriez-vous ouvert à un court appel informel de quinze minutes pour faire connaissance ?

Vous pouvez retenir un créneau directement selon vos disponibilités sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet SFM Avocat",
        "email": "contact@sfm-avocat.com",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://www.sfm-avocat.com",
        "subject": "Partenariat d'affaires et charge mentale du cabinet / SFM Avocat",
        "body": """Bonjour Maître,

Votre implantation au cœur du poumon économique de Jarry et votre expertise en droit des affaires et en médiation répondent parfaitement aux enjeux de sécurisation des entreprises guadeloupéennes.

Je me permets de vous contacter au nom de Domtom Connect. Nous accompagnons au quotidien les entrepreneurs et professions indépendantes de la Caraïbe pour les aider à surmonter leurs goulots d'étranglement opérationnels.

Nous savons à quel point la gestion courante d'un cabinet, le suivi des dossiers et la coordination administrative peuvent empiéter sur le temps d'analyse juridique et de plaidoirie. Grâce à notre accompagnement Tremplin et au copilotage d'activités, nous aidons les associés à préserver leur temps utile tout en créant des synergies d'affaires avec notre réseau de dirigeants.

Pourrions-nous caler un court appel de quinze minutes à votre convenance ces prochains jours ?

Vous pouvez fixer la date et l'heure facilement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Cocly Avocat",
        "email": "contact@cocly-avocat.com",
        "territory": "Guadeloupe (Pointe-à-Pitre)",
        "source": "https://www.cocly-avocat.com",
        "subject": "Échange confraternel et passerelles d'affaires pour Maître Camille Cocly",
        "body": """Bonjour Maître Cocly,

Je suis avec attention votre pratique juridique, en particulier vos interventions sur les cessions d'entreprises, le droit des sociétés et le recouvrement de créances en Guadeloupe, qui sont des leviers cruciaux pour la santé des PME locales.

Je vous contacte au nom de Domtom Connect, un écosystème d'entraide et d'accélération d'entreprises implanté au service des territoires ultramarins et de la diaspora.

Nous constatons sur le terrain que le recouvrement d'honoraires et les contraintes administratives pèsent lourdement sur le quotidien des cabinets libéraux. Avec notre outil gratuit d'anamnèse clinique et notre copilotage opérationnel, nous aidons les professionnels à structurer leurs processus internes et à libérer du temps stratégique, tout en apportant des affaires qualifiées via notre réseau d'entrepreneurs.

Seriez-vous disponible pour un bref échange de quinze minutes cette semaine ?

Vous pouvez réserver votre créneau directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Elisabeth Calonne",
        "email": "contact@calonne-avocat-fwi.fr",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://www.calonne-avocat-fwi.fr",
        "subject": "Synergies d'affaires et accompagnement des dirigeants / Maître Calonne",
        "body": """Bonjour Maître Calonne,

Votre approche globale alliant conseil en droit des affaires, droit immobilier et médiation à Baie-Mahault constitue un socle essentiel pour apaiser et sécuriser les relations économiques en Guadeloupe.

Je vous écris au nom de Domtom Connect. Nous animons une communauté active de dirigeants et porteurs d'initiatives à travers la Caraïbe et la diaspora.

Nos membres font face à des défis constants de gouvernance et de négociation où votre regard d'experte serait particulièrement précieux. De notre côté, nous intervenons auprès des cabinets indépendants pour alléger leur intendance quotidienne, optimiser leurs flux et briser la solitude du dirigeant grâce à notre réseau WhatsApp et notre application DTC Pulse.

Seriez-vous ouverte à un court entretien téléphonique de quinze minutes afin de faire connaissance ?

Vous pouvez choisir le moment qui vous conviendra le mieux sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Jurisguyane",
        "email": "contact@jurisguyane.fr",
        "territory": "Guyane (Cayenne)",
        "source": "https://www.jurisguyane.com",
        "subject": "Échange confraternel et synergies d'affaires pour Maître Patrick Lingibé",
        "body": """Bonjour Maître Lingibé,

C'est avec un très grand respect que je suis vos contributions juridiques de référence et votre engagement pour le droit et le développement économique en Guyane et dans l'ensemble des Outre-mer.

Je me permets de vous contacter au nom de Domtom Connect. Nous développons un écosystème d'accompagnement pour les entrepreneurs ultramarins, axé sur la levée des blocages opérationnels et la connexion de compétences.

Nos entrepreneurs guyanais et caribéens ont un besoin permanent d'une doctrine solide pour sécuriser leurs marchés publics et leurs accords privés. Nous serions particulièrement honorés d'échanger avec vous sur les passerelles possibles avec notre réseau, et de vous présenter comment nous soutenons l'organisation des structures d'excellence grâce à nos démarches de copilotage.

Seriez-vous ouvert à une brève conversation téléphonique de quinze minutes dans les prochains jours ?

Vous pouvez sélectionner un moment à votre convenance sur notre agenda,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Bourrié-Latour",
        "email": "contact@bourrielatour.com",
        "territory": "Guyane & Martinique",
        "source": "https://www.bourrielatour.com",
        "subject": "Développement des cabinets et synergies d'affaires / Bourrié-Latour",
        "body": """Bonjour Maître,

Votre présence interterritoriale entre la Guyane et les Antilles et votre rigueur en droit des affaires et contentieux commercial représentent un atout précieux pour les entreprises qui opèrent sur plusieurs bassins géographiques.

Je vous contacte au nom de Domtom Connect. Nous fédérons des dirigeants et créateurs d'entreprises répartis sur la Caraïbe, l'Amazonie et la diaspora.

Nous constatons combien la coordination multi-sites et la gestion administrative peuvent peser sur le temps utile des associés. Grâce à notre accompagnement opérationnel et à notre audit gratuit d'anamnèse, nous aidons les cabinets à systématiser leurs processus pour se concentrer sur l'expertise pure, tout en partageant des opportunités d'affaires directes avec notre communauté d'entrepreneurs.

Auriez-vous un créneau de quinze minutes à m'accorder prochainement pour faire connaissance ?

Vous pouvez réserver facilement selon vos disponibilités sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Avocats & Conseils Réunion",
        "email": "cabinet@avocatsconseilsreunion.fr",
        "territory": "La Réunion (Saint-Denis)",
        "source": "https://www.avocatsconseilsreunion.re",
        "subject": "Échange confraternel et partenariats d'affaires pour Maître Chane-Meng-Hime",
        "body": """Bonjour Maître Chane-Meng-Hime,

Votre expertise reconnue en droit des affaires, fiscalité et conseil stratégique auprès des entreprises réunionnaises apporte une sécurité essentielle aux dirigeants de l'océan Indien.

Je vous contacte au nom de Domtom Connect. Notre écosystème accompagne les chefs d'entreprise et professions libérales ultramarines pour stimuler leur développement et alléger leur charge mentale quotidienne.

Nous savons que les dirigeants de cabinets portent souvent seuls la responsabilité du développement commercial et du suivi administratif. Avec notre programme Tremplin et nos outils de copilotage, nous permettons aux associés de déléguer l'intendance et d'élargir leur cercle d'apporteurs d'affaires qualifiés via notre communauté WhatsApp et l'application DTC Pulse.

Seriez-vous ouverte à un court échange téléphonique de quinze minutes ces prochains jours ?

Vous pouvez retenir un créneau sur mon agenda directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "ABOUT Avocats",
        "email": "contact@about-avocats.fr",
        "territory": "La Réunion (Saint-Paul)",
        "source": "https://www.avocat-about.re",
        "subject": "Synergies d'affaires et efficacité opérationnelle pour ABOUT Avocats",
        "body": """Bonjour Maître,

Votre installation au Centre d'affaires Savanna à Saint-Paul et votre offre transversale en droit des affaires, droit des sociétés et fiscalité démontrent une volonté claire d'accompagner les entrepreneurs au plus près de leur terrain.

Je me permets de vous contacter au nom de Domtom Connect. Nous construisons des passerelles concrètes pour les dirigeants des territoires d'Outre-mer et de leurs diasporas.

Nous aidons les cabinets partenaires à dépasser le plafond de verre de la gestion quotidienne grâce à des méthodes de copilotage éprouvées et un diagnostic d'anamnèse clinique offert. Par ailleurs, notre réseau regroupe des porteurs de projets et investisseurs en recherche permanente de conseils juridiques fiables à La Réunion.

Seriez-vous disponible pour une conversation de quinze minutes à votre convenance ?

Vous pouvez fixer votre rendez-vous directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Ingrid Giry",
        "email": "contact@giry-avocat.re",
        "territory": "La Réunion (Saint-Pierre)",
        "source": "https://www.giry-avocat.re",
        "subject": "Échange confraternel et passerelles d'affaires pour Maître Giry",
        "body": """Bonjour Maître Giry,

Votre engagement au Barreau de Saint-Pierre et votre accompagnement des entreprises et particuliers dans le sud de La Réunion témoignent d'une écoute de proximité indispensable à notre tissu économique.

Je vous contacte au nom de Domtom Connect. Nous avons mis en place un réseau d'affaires et d'accompagnement opérationnel dédié aux acteurs des territoires insulaires.

Nous savons combien le cumul des dossiers techniques et de la gestion administrative d'un cabinet peut devenir pesant pour un associé indépendant. Notre approche consiste à épauler les dirigeants pour décharger l'intendance opérationnelle et créer des opportunités mutuelles au sein de notre communauté d'entrepreneurs.

Pourrions-nous échanger pendant une quinzaine de minutes au téléphone cette semaine ?

Vous pouvez caler notre appel directement sur ce lien selon votre emploi du temps,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Société d'Avocats IMBOUA-KOUAO-TELLA & ASSOCIÉS (IKT)",
        "email": "contact@ikt-avocats.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://www.ikt-avocats.com",
        "subject": "Synergies panafricaines et opportunités d'affaires pour le Cabinet IKT",
        "body": """Bonjour Maîtres,

C'est avec une grande attention que je suis le rayonnement et l'excellence de votre cabinet IKT à Abidjan, acteur de premier plan dans le conseil juridique aux institutions et aux entreprises en Afrique de l'Ouest.

Je vous contacte au nom de Domtom Connect. Nous développons un réseau d'affaires et une plateforme de copilotage opérationnel reliant les dirigeants d'Afrique, des Caraïbes et de la diaspora.

Nos membres réalisent des opérations d'implantation et d'investissement croisées entre l'Afrique subsaharienne et l'espace caribéen, nécessitant une expertise juridique sans faille en droit OHADA et droit financier. Nous serions ravis de faire connaître votre savoir-faire auprès de notre réseau et d'évaluer de potentielles synergies confraternelles.

Seriez-vous ouverts à un court échange en visio de quinze minutes pour faire connaissance ?

Vous pouvez retenir le créneau qui vous arrange le mieux sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Dirabou et Associés",
        "email": "contact@dirabou-avocats.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://www.dirabou-avocats.com",
        "subject": "Partenariat d'affaires et investissements croisés pour Dirabou et Associés",
        "body": """Bonjour Maître Dirabou,

Votre expertise reconnue dans les opérations de financement, les infrastructures, le private equity et le droit des affaires à Abidjan positionne votre cabinet au cœur des grands flux de croissance de la région.

Je me permets de vous contacter au nom de Domtom Connect. Nous animons une communauté active d'investisseurs et de dirigeants d'entreprises reliant l'Afrique francophone, les territoires caribéens et leurs diasporas.

Nous accompagnons des porteurs de projets structurants qui recherchent des conseils juridiques locaux d'élite pour sécuriser leurs prises de participation et leurs contrats. En complément, nous aidons les cabinets partenaires à optimiser leur copilotage interne pour décharger leur intendance opérationnelle.

Seriez-vous disponible pour une courte discussion de quinze minutes cette semaine ?

Vous pouvez réserver facilement votre créneau sur notre agenda,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Cabinet Ouattara & Associés",
        "email": "secretariat@coassocies.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://www.coassocies.com",
        "subject": "Échange confraternel et flux d'affaires pour Ouattara & Associés",
        "body": """Bonjour Maîtres,

Votre ancrage et votre pratique transversale en droit maritime, droit des affaires et contentieux économique à Abidjan répondent de façon très concrète aux réalités logistiques et commerciales de l'Afrique de l'Ouest.

Je vous écris au nom de Domtom Connect. Notre mission est de connecter les dirigeants et porteurs d'initiatives d'Afrique et de la Caraïbe pour fluidifier les opportunités d'affaires mutuelles.

Nos adhérents ont régulièrement besoin de conseils avertis pour structurer leurs flux commerciaux et sécuriser leurs contrats internationaux. Nous serions ravis d'échanger avec vous sur des passerelles de collaboration et de vous présenter notre écosystème d'accompagnement.

Auriez-vous quinze minutes à m'accorder ces prochains jours pour un premier contact informel ?

Vous pouvez choisir le jour et l'heure directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "CSP Expertise",
        "email": "contact@csp-expertise.fr",
        "territory": "Martinique (Schoelcher)",
        "source": "https://www.csp-expertise.fr",
        "subject": "Partenariat d'affaires et accompagnement des dirigeants / CSP Expertise",
        "body": """Bonjour,

Votre implantation au Centre d'Affaires Sainte-Catherine à Schoelcher et votre accompagnement comptable et fiscal de proximité sont des atouts précieux pour la vitalité des entreprises martiniquaises.

Je vous contacte au nom de Domtom Connect. Nous soutenons au quotidien les chefs d'entreprise des Outre-mer dans leur pilotage stratégique et la résolution de leurs défis d'organisation.

Nous constatons que beaucoup de dirigeants s'appuient sur leur expert-comptable pour des questions de rentabilité qui dépassent parfois la stricte conformité comptable. Avec notre outil d'anamnèse clinique gratuit et nos solutions de copilotage opérationnel, nous aidons les cabinets partenaires à décharger leurs clients sur les tâches d'intendance tout en favorisant l'apport d'affaires avec notre réseau d'entrepreneurs.

Seriez-vous ouverts à un court échange téléphonique de quinze minutes pour faire connaissance ?

Vous pouvez fixer votre créneau directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "CmC Expertise",
        "email": "secretariat@cmcexpertise.fr",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.cmcexpertise.fr",
        "subject": "Synergies d'affaires et gestion opérationnelle pour CmC Expertise",
        "body": """Bonjour,

Votre engagement auprès des entrepreneurs de Fort-de-France et votre expertise dans la tenue, le conseil de gestion et le suivi social sont déterminants pour sécuriser les PME de notre territoire.

Je vous écris au nom de Domtom Connect, un écosystème d'entraide et de conseil dédié à soutenir la croissance des entreprises caribéennes et de la diaspora.

Nous collaborons régulièrement avec des experts-comptables pour épauler conjointement les dirigeants, en prenant en charge le copilotage opérationnel et la décharge administrative pour leur permettre de se concentrer sur leur chiffre d'affaires. Par ailleurs, notre réseau d'affaires apporte une visibilité ciblée auprès de porteurs de projets qualifiés.

Seriez-vous disponibles pour un court entretien de quinze minutes dans les prochains jours ?

Vous pouvez réserver facilement votre créneau sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    },
    {
        "company": "Maje Expertise",
        "email": "mpenchard@majeexpertise.com",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://www.majeexpertise.com",
        "subject": "Échange confraternel et synergies d'affaires pour Maxime Penchard",
        "body": """Bonjour Monsieur Penchard,

Votre réputation et votre écoute au service des chefs d'entreprise guadeloupéens au sein de Maje Expertise constituent une référence pour la structuration financière et fiscale des sociétés locales.

Je me permets de vous contacter au nom de Domtom Connect. Nous développons un écosystème d'accompagnement pour les entrepreneurs ultramarins afin de répondre concrètement à leurs défis d'organisation.

Nous savons combien le conseil de gestion et le suivi opérationnel demandent du temps et de l'énergie. Grâce à nos parcours Tremplin et à notre copilotage d'activités, nous aidons les dirigeants à sortir de la surcharge administrative, tout en orientant régulièrement nos membres vers des experts-comptables de confiance en Guadeloupe.

Seriez-vous ouvert à un court appel téléphonique de quinze minutes cette semaine pour faire connaissance ?

Vous pouvez sélectionner un créneau selon votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle dédié, www.domtomconnect.com/entreprises-juridique"""
    }
]

print(f"Total leads compiled: {len(LEADS)}")

# Strictest validation checks
for idx, lead in enumerate(LEADS, 1):
    subj = lead['subject']
    body = lead['body']
    
    # Rule 1: No colon in subject or body
    if ':' in subj:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ':' in subject: {subj}")
    if ':' in body:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ':' in body!")
        
    # Rule 2: No mid-sentence dashes
    if ' - ' in body:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ' - ' in body!")
    if ' - ' in subj:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ' - ' in subject!")
        
    # Rule 3: Zero unicode emoji
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
    if emoji_pattern.findall(subj) or emoji_pattern.findall(body):
        raise ValueError(f"Lead {idx} has emoji!")
        
    # Rule 4: Canonical Calendly and Phone
    if 'calendly.com/domtomconnect/30min' not in body:
        raise ValueError(f"Lead {idx} missing calendly!")
    if '+33 6 20 78 33 77' not in body:
        raise ValueError(f"Lead {idx} missing phone!")

print("100% of leads passed all strict rules (zero colon, zero mid-sentence dash, zero emoji, official contacts)!")

# Save as JSON for batch 81
with open('scripts/batch_81_experts_juridique_affaires.json', 'w', encoding='utf-8') as f:
    json.dump(LEADS, f, indent=2, ensure_ascii=False)

print("Saved to scripts/batch_81_experts_juridique_affaires.json successfully!")
