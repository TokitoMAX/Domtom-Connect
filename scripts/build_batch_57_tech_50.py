import json, sys, os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

# 50 CIBLES ULTRA-QUALIFIÉES - BATCH 57 (VAGUE 3 / 4)
# Secteur : Tech, ESN, Agences Web & Digitales, SaaS & Startups
# Répartition : 9 Guadeloupe + 8 Martinique + 3 Guyane + 2 Réunion + 7 Mayotte + 3 Sénégal + 2 Côte d'Ivoire + 9 Cameroun + 6 Bénin + 1 Togo
LEADS = [
    # --- GUADELOUPE (9) ---
    {
        "company": "Caraïbes Web Solutions (CWS)",
        "email": "contact@cws.gp",
        "territory": "Guadeloupe",
        "source": "https://cws.gp",
        "subject": "Synergies digitales et accompagnement / Caraïbes Web Solutions",
        "body": """Bonjour,

Félicitations pour le dynamisme que vous impulsez en Guadeloupe à travers vos solutions web et votre accompagnement digital pour les acteurs économiques locaux.

Chez Domtom Connect, nous accompagnons les professionnels et entreprises de nos régions afin de catalyser leur développement et renforcer leurs passerelles d'affaires.

Dans votre activité d'agence web aujourd'hui, quel est le principal enjeu qui mobilise votre équipe — le recrutement de talents tech, l'acquisition de nouveaux comptes ou le passage à l'échelle ?

Notre démarche s'appuie également sur un groupe d'entraide WhatsApp regroupant des entrepreneurs et sur notre application mobile DTC Pulse.

Seriez-vous ouvert à un court échange téléphonique de dix minutes dans les prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Damedia Agency",
        "email": "contact@damedia-agency.com",
        "territory": "Guadeloupe",
        "source": "https://damedia-agency.com",
        "subject": "Échange sur le développement digital / Damedia Agency",
        "body": """Bonjour,

Bravo pour l'expertise créative et web que vous déployez en Guadeloupe pour valoriser les marques et structures caribéennes.

Chez Domtom Connect, notre mission est de soutenir les entrepreneurs et dirigeants dans leurs projets de croissance, d'optimisation et d'ouverture de marchés.

Quel est à ce stade le défi prioritaire pour Damedia Agency — enrichir vos offres techniques, sourcer des compétences ou capter des opportunités régionales ?

Nous animons par ailleurs une communauté WhatsApp active et mettons à disposition l'application mobile DTC Pulse pour encourager les partenariats concrets.

Seriez-vous partant pour convenir d'un bref point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Digital Natives Solutions",
        "email": "dns21.contact@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://digital-natives-solutions.com",
        "subject": "Projets numériques et entraide / Digital Natives Solutions",
        "body": """Bonjour,

Bravo pour vos initiatives numériques et l'accompagnement digital que vous proposez aux structures et porteurs de projets en Guadeloupe.

Chez Domtom Connect, nous oeuvrons chaque jour à connecter les acteurs de nos territoires insulaires et de la diaspora afin de faciliter l'entraide et le développement d'affaires.

Quel est actuellement votre challenge le plus marquant — la gestion des délais techniques, le recrutement ou l'élargissement de votre portefeuille clients ?

Nous animons un réseau WhatsApp dédié aux synergies professionnelles ainsi que l'application DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Karukrea",
        "email": "contact@karukrea.com",
        "territory": "Guadeloupe",
        "source": "https://karukrea.com",
        "subject": "Stratégie web et synergies / Karukrea",
        "body": """Bonjour,

Toutes mes félicitations pour la qualité de vos réalisations web et le soin apporté à l'accompagnement des entreprises en Guadeloupe.

Chez Domtom Connect, nous accompagnons les dirigeants et structures innovantes afin de créer des passerelles entre nos îles, l'Hexagone et le continent africain.

Dans le développement de Karukrea, quelle est la priorité numéro un qui retient toute votre attention en ce moment ?

Nous fédérons également des professionnels autour d'un groupe WhatsApp d'entraide et via notre application mobile DTC Pulse.

Seriez-vous disponible pour un appel découverte de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Creawebstudio",
        "email": "willy@creawebstudio.com",
        "territory": "Guadeloupe",
        "source": "https://creawebstudio.com",
        "subject": "Création web et réseau d'entraide / Creawebstudio",
        "body": """Bonjour Willy,

Bravo pour votre régularité et votre créativité dans la conception de sites et le graphisme au service des entreprises guadeloupéennes.

Chez Domtom Connect, nous avons à coeur d'épauler les spécialistes du digital et indépendants afin de maximiser leur impact et leur réseau de recommandations.

Quel est aujourd'hui votre principal défi au quotidien — la charge de production, la visibilité commerciale ou la fidélisation ?

Notre écosystème comprend un canal WhatsApp d'entraide directe et l'application mobile DTC Pulse, conçue pour stimuler les collaborations.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MJ Metrix",
        "email": "direction@mjmetrix.com",
        "territory": "Guadeloupe",
        "source": "https://mjmetrix.com",
        "subject": "Métriques digitales et synergies territoriales / MJ Metrix",
        "body": """Bonjour,

Félicitations pour votre approche axée sur la performance digitale, le référencement et l'analyse de données au bénéfice de vos clients.

Domtom Connect accompagne les entreprises et structures à fort potentiel pour accélérer leur expansion et faciliter leurs partenariats stratégiques.

Dans votre vision de développement, quelle problématique technique ou commerciale sollicite le plus d'efforts actuellement ?

Nous animons une communauté de dirigeants sur WhatsApp et via notre application DTC Pulse pour partager solutions et opportunités concrètes.

Pourrions-nous prévoir un échange téléphonique rapide de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Altitude GP",
        "email": "contact@altitudegp.com",
        "territory": "Guadeloupe",
        "source": "https://altitudegp.com",
        "subject": "Perspectives digitales et entraide / Altitude GP",
        "body": """Bonjour,

Bravo pour votre contribution active au paysage digital et à la communication des acteurs économiques en Guadeloupe.

Chez Domtom Connect, nous mettons notre énergie au service des porteurs de projets et dirigeants pour briser l'isolement insulaire et démultiplier les opportunités.

Quel est aujourd'hui l'enjeu central pour votre agence — la recherche de compétences rares, la rentabilité des missions ou la diversification de vos services ?

Nous animons un groupe d'entraide WhatsApp ainsi que la plateforme mobile DTC Pulse, favorisant la mise en relation qualifiée.

Seriez-vous ouvert à un point informel de dix minutes par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cyber Formation",
        "email": "contact@cyberformation.fr",
        "territory": "Guadeloupe",
        "source": "https://cyberformation.fr",
        "subject": "Compétences numériques et synergies / Cyber Formation",
        "body": """Bonjour,

Félicitations pour votre engagement remarquable dans la formation numérique et la montée en compétences digitales en Guadeloupe.

Chez Domtom Connect, nous accompagnons les professionnels et acteurs de la tech pour valoriser leurs savoir-faire et créer des passerelles porteuses.

Dans le déploiement de vos formations et cursus web, quel est votre axe prioritaire d'évolution pour les mois à venir ?

Notre plateforme s'articule autour d'un groupe WhatsApp dynamique et de l'application DTC Pulse pour connecter nos talents à travers le monde.

Pourrions-nous échanger une dizaine de minutes au téléphone selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Exelcia IT",
        "email": "contact@exelcia-it.com",
        "territory": "Guadeloupe",
        "source": "https://exelcia-it.com",
        "subject": "Infrastructures informatiques et croissance / Exelcia IT",
        "body": """Bonjour,

Bravo pour l'accompagnement informatique et les solutions d'infrastructure que vous apportez aux structures antillaises.

Chez Domtom Connect, nous soutenons les entreprises technologiques régionales pour renforcer leur visibilité et favoriser l'émergence de nouveaux partenariats.

Quel est aujourd'hui votre défi majeur — la cybersécurité, la gestion de contrats d'infogérance ou l'accès à de nouveaux marchés ?

Nous rassemblons des dirigeants au sein d'un groupe d'entraide WhatsApp et via l'application mobile DTC Pulse.

Seriez-vous disponible pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- MARTINIQUE (8) ---
    {
        "company": "18.19 Digital",
        "email": "contact@1819digital.fr",
        "territory": "Martinique",
        "source": "https://1819digital.fr",
        "subject": "Innovation digitale et réseau d'affaires / 18.19 Digital",
        "body": """Bonjour,

Félicitations pour le dynamisme de votre équipe chez 18.19 Digital et vos projets digitaux modernes au service des entreprises en Martinique.

Chez Domtom Connect, nous oeuvrons à créer des connexions solides entre les entrepreneurs ultramarins, la diaspora et les marchés régionaux.

Dans la croissance de votre agence, quel est actuellement le principal sujet qui occupe votre temps — l'acquisition client, le sourcing technique ou l'organisation ?

Nous animons une communauté WhatsApp d'entraide entre professionnels ainsi que notre application mobile DTC Pulse.

Seriez-vous partant pour convenir d'un échange téléphonique de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "BPM-AD",
        "email": "contact@bpm-ad.fr",
        "territory": "Martinique",
        "source": "Annuaire Martinique Digitale",
        "subject": "Développement digital et synergies territoriales / BPM-AD",
        "body": """Bonjour,

Bravo pour l'expertise digitale et l'accompagnement technique que vous proposez aux organisations martiniquaises.

Chez Domtom Connect, nous soutenons les structures technologiques de nos territoires afin de valoriser leurs compétences et d'ouvrir de nouveaux canaux de recommandation.

Quel est aujourd'hui votre priorité de développement la plus stratégique pour BPM-AD ?

Nous réunissons des dirigeants et indépendants au sein d'un groupe d'entraide WhatsApp et sur notre application mobile DTC Pulse.

Pourrions-nous échanger dix minutes de vive voix ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Coclico Media",
        "email": "info@coclicomedia.com",
        "territory": "Martinique",
        "source": "Annuaire Martinique Digitale",
        "subject": "Création de contenu digital et synergies / Coclico Media",
        "body": """Bonjour,

Toutes mes félicitations pour la vitalité créative et la qualité des contenus digitaux que vous réalisez en Martinique.

Chez Domtom Connect, nous aidons les professionnels de la création et du web à développer leur visibilité et à nouer des partenariats à fort impact.

Quel est aujourd'hui votre principal axe de conquête ou défi opérationnel au sein de votre agence ?

Nous animons un réseau WhatsApp d'entraide entre professionnels et proposons l'application mobile DTC Pulse pour faciliter les échanges.

Seriez-vous ouvert à un appel rapide de dix minutes pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Comwebsolutions",
        "email": "contact@comwebsolutions.com",
        "territory": "Martinique",
        "source": "Annuaire Martinique Digitale",
        "subject": "Solutions web et accompagnement territorial / Comwebsolutions",
        "body": """Bonjour,

Bravo pour la constance et l'accompagnement web pragmatique que vous fournissez aux acteurs économiques de l'île.

Chez Domtom Connect, nous accompagnons les professionnels du numérique afin d'amplifier leur rayonnement régional et international.

Dans la conduite de vos projets clients, quel est l'enjeu qui vous mobilise le plus en ce moment ?

Nous serions ravis de vous présenter notre écosystème d'entraide WhatsApp et l'application mobile DTC Pulse.

Auriez-vous dix minutes disponibles cette semaine pour un échange téléphonique ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "DBNG",
        "email": "contact@dbng.fr",
        "territory": "Martinique",
        "source": "Annuaire Martinique Digitale",
        "subject": "Stratégie digitale et opportunités d'affaires / DBNG",
        "body": """Bonjour,

Félicitations pour vos réalisations dans le domaine du numérique et votre présence au sein de l'écosystème Martinique Digitale.

Chez Domtom Connect, notre rôle est d'apporter aux dirigeants de la tech un appui concret pour créer des passerelles entre nos territoires et leur diaspora.

Quel est actuellement le plus grand défi pour DBNG — recruter des profils pointus, accélérer sur de nouveaux secteurs ou scaler vos offres ?

Nous serions heureux de vous accueillir sur notre groupe d'entraide WhatsApp et sur l'application DTC Pulse.

Seriez-vous disponible pour un court appel téléphonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Digital Xpress",
        "email": "bonjour@digitalxpress.fr",
        "territory": "Martinique",
        "source": "Annuaire Martinique Digitale",
        "subject": "Accompagnement digital et réseau d'entraide / Digital Xpress",
        "body": """Bonjour,

Bravo pour le professionnalisme et la réactivité que vous apportez dans vos missions digitales auprès des entreprises martiniquaises.

Chez Domtom Connect, nous accompagnons les entrepreneurs et prestataires du web afin de démultiplier leurs synergies opérationnelles.

Quelle est la priorité numéro un sur laquelle vous concentrez vos efforts cette année ?

Nous animons une communauté de pairs sur WhatsApp ainsi que l'application mobile DTC Pulse, pensée pour créer du lien qualifié.

Pourrions-nous organiser un point téléphonique de dix minutes selon vos créneaux ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Agence BeeCee",
        "email": "contact@beecee.fr",
        "territory": "Martinique",
        "source": "https://beecee.fr",
        "subject": "Communication digitale et synergies caribéennes / Agence BeeCee",
        "body": """Bonjour,

Félicitations pour vos campagnes inspirantes et la vision stratégique globale que l'Agence BeeCee développe en Martinique.

Chez Domtom Connect, nous oeuvrons à relier les agences et créatifs locaux à un écosystème élargi couvrant les Caraïbes, l'Europe et l'Afrique.

Quel est aujourd'hui votre principal levier de croissance ou le défi qui retient le plus votre attention ?

Notre démarche collaborative s'appuie sur un groupe WhatsApp d'entraide et l'application mobile DTC Pulse.

Seriez-vous ouvert à un échange téléphonique informel de dix minutes ces jours-ci ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Agence NASDY",
        "email": "contact@nasdy.com",
        "territory": "Martinique",
        "source": "https://nasdy.com",
        "subject": "Conception web et passerelles de croissance / Agence NASDY",
        "body": """Bonjour,

Bravo pour vos réalisations soignées en conception web et pour votre implication pérenne au service des entreprises et institutions antillaises.

Chez Domtom Connect, nous accompagnons les professionnels du numérique afin de booster leurs partenariats et de décloisonner leurs opportunités.

Dans le pilotage de vos projets web, quel est votre défi majeur en ce moment ?

Nous serions ravis de vous faire découvrir notre communauté WhatsApp et notre application mobile DTC Pulse.

Auriez-vous dix minutes pour un court entretien téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- GUYANE (3) ---
    {
        "company": "Agence Web Guyane",
        "email": "contact@agencewebguyane.fr",
        "territory": "Guyane",
        "source": "https://agencewebguyane.fr",
        "subject": "Développement web et entraide entrepreneuriale / Agence Web Guyane",
        "body": """Bonjour,

Félicitations pour votre implication dans la numérisation des entreprises et institutions en Guyane à travers des solutions web sur-mesure.

Chez Domtom Connect, nous soutenons avec ferveur les acteurs guyanais pour les connecter aux réseaux d'affaires de l'Hexagone et d'Afrique.

Dans un contexte territorial aussi particulier, quel est le principal défi pour votre agence — la formation client, le recrutement ou la diversification technique ?

Nous animons une communauté WhatsApp active et l'application DTC Pulse pour faire émerger des collaborations utiles.

Pourrions-nous caler dix minutes d'échange téléphonique à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Web2Web Guyane",
        "email": "guyane@web2web.fr",
        "territory": "Guyane",
        "source": "https://web2web.fr",
        "subject": "Performance digitale et synergies / Web2Web Guyane",
        "body": """Bonjour,

Bravo pour vos interventions digitales et l'optimisation des revenus en ligne que vous mettez à disposition des acteurs guyanais.

Chez Domtom Connect, notre mission est de rompre l'isolement géographique en favorisant des ponts concrets d'entraide et de business.

Quel est aujourd'hui l'enjeu prioritaire dans le développement de vos activités en Guyane ?

Nous animons un groupe d'entraide WhatsApp et la plateforme DTC Pulse pour partager contacts et solutions pragmatiques.

Seriez-vous partant pour convenir d'un bref point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "ARIAS Informatique",
        "email": "contact@ariasnet.com",
        "territory": "Guyane",
        "source": "https://ariasnet.com",
        "subject": "Infrastructures IT et réseau professionnel / ARIAS Informatique",
        "body": """Bonjour,

Toutes mes félicitations pour la fiabilité et la solidité de votre support informatique et de vos services réseaux en Guyane.

Chez Domtom Connect, nous accompagnons les professionnels des infrastructures et de la tech afin d'élargir leur cercle d'influence et de recommandations.

Quel est actuellement votre challenge le plus déterminant — la cybersécurité, la logistique de matériel ou le recrutement technique ?

Nous serions heureux de vous accueillir sur notre groupe WhatsApp d'entraide et de vous présenter notre application mobile DTC Pulse.

Pourrions-nous échanger une dizaine de minutes par téléphone dans les prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- LA RÉUNION (2) ---
    {
        "company": "VIZION Réunion",
        "email": "contact@vizion.re",
        "territory": "La Réunion (Saint-Pierre)",
        "source": "https://vizion.re",
        "subject": "Création web et réseau d'affaires / VIZION Réunion",
        "body": """Bonjour,

Félicitations pour vos réalisations web et votre accompagnement SEO et Ads particulièrement soigné à La Réunion.

Chez Domtom Connect, nous accompagnons les agences digitales et entrepreneurs ultramarins dans la construction de passerelles d'affaires solides.

Dans le développement de votre portefeuille de clients réunionnais, quel défi demande le plus de ressources à votre équipe ?

Nous animons un réseau WhatsApp d'entraide directe et l'application mobile DTC Pulse pour stimuler les collaborations inter-territoires.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "ADITEC Réunion",
        "email": "contact@myaditec.com",
        "territory": "La Réunion",
        "source": "https://aditec.re",
        "subject": "Accompagnement web et synergies territoriales / ADITEC",
        "body": """Bonjour,

Bravo pour l'expertise web et l'écoute que vous portez aux professionnels réunionnais dans leur transition numérique.

Chez Domtom Connect, notre rôle est d'épauler les dirigeants et spécialistes de la tech afin de valoriser leurs compétences au-delà des frontières de l'île.

Quel est aujourd'hui votre principal objectif de progression pour ADITEC ?

Nous réunissons une communauté active sur WhatsApp ainsi que via l'application DTC Pulse.

Pourrions-nous convenir d'un rapide échange téléphonique de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- MAYOTTE (7) ---
    {
        "company": "Agence Web Mayotte",
        "email": "contact@agence-web-mayotte.fr",
        "territory": "Mayotte",
        "source": "https://agence-web-mayotte.fr",
        "subject": "Digitalisation mahoraise et entraide / Agence Web Mayotte",
        "body": """Bonjour,

Bravo pour votre rôle moteur dans la création de solutions web et la digitalisation du tissu entrepreneurial mahorais.

Chez Domtom Connect, nous mettons une attention toute particulière à soutenir Mayotte en bâtissant des passerelles directes avec les Caraïbes, l'Afrique et l'Hexagone.

Dans le contexte actuel de l'île, quel est l'enjeu le plus crucial pour votre agence — la stabilité des infrastructures, la formation ou l'acquisition de nouveaux clients ?

Nous animons une communauté WhatsApp d'entraide et l'application DTC Pulse pour briser l'éloignement et créer des opportunités partagées.

Seriez-vous ouvert à un point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "UWEZO",
        "email": "contact@uwezo.fr",
        "territory": "Mayotte",
        "source": "https://uwezo.fr",
        "subject": "Identité de marque et synergies régionales / UWEZO",
        "body": """Bonjour,

Félicitations pour le dynamisme et la force de proposition d'UWEZO pour faire rayonner les marques et projets à Mayotte et dans l'océan Indien.

Chez Domtom Connect, nous accompagnons les créatifs et communicants afin d'élargir leur cercle d'influence et leurs partenariats professionnels.

Quel est aujourd'hui votre chantier prioritaire — conquérir de nouveaux marchés régionaux, recruter ou étoffer vos expertises ?

Nous serions très heureux de vous faire une place au sein de notre groupe WhatsApp d'entraide et sur l'application mobile DTC Pulse.

Pourrions-nous convenir d'un court échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Mahaba Info Tech",
        "email": "contact@mahabainfotech.yt",
        "territory": "Mayotte",
        "source": "https://mahabainfotech.yt",
        "subject": "Services informatiques et réseau d'affaires / Mahaba Info Tech",
        "body": """Bonjour,

Bravo pour votre engagement technique et vos prestations informatiques indispensables pour les acteurs économiques à Mayotte.

Chez Domtom Connect, nous accompagnons les professionnels de l'IT pour leur offrir des relais de mise en relation et de soutien opérationnel.

Quel est actuellement votre plus grand défi au quotidien dans la conduite de vos activités à Mayotte ?

Nous animons un écosystème WhatsApp d'entraide ainsi que l'application DTC Pulse, orientée vers les synergies d'affaires concrètes.

Auriez-vous dix minutes pour un échange téléphonique d'ici la fin de semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Reflex Strategy",
        "email": "contact@reflexstrategy.fr",
        "territory": "Mayotte",
        "source": "https://reflexstrategy.fr",
        "subject": "Conseil digital et développement / Reflex Strategy",
        "body": """Bonjour,

Toutes mes félicitations pour la qualité de votre conseil en stratégie digitale et votre accompagnement des décideurs à Mayotte.

Chez Domtom Connect, nous bâtissons des ponts entre les acteurs des territoires insulaires, de l'océan Indien et du continent africain.

Dans le développement de votre cabinet, quel est le levier principal que vous souhaitez activer prochainement ?

Nous vous proposons de rejoindre notre communauté WhatsApp d'entraide et d'utiliser notre application DTC Pulse.

Seriez-vous partant pour convenir d'un court entretien de dix minutes par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MPJ Digital",
        "email": "contact@mpj.digital",
        "territory": "Mayotte",
        "source": "https://mpj.digital",
        "subject": "Agence 360 et partenariats économiques / MPJ Digital",
        "body": """Bonjour,

Bravo pour l'approche globale et l'expertise 360° que vous apportez au marché digital mahorais.

Chez Domtom Connect, nous aidons les agences innovantes à développer de nouvelles collaborations et à élargir leurs opportunités d'affaires.

Quelle est la problématique majeure qui mobilise le plus votre équipe en ce moment ?

Notre réseau d'entraide WhatsApp et l'application mobile DTC Pulse facilitent des connexions rapides et pertinentes entre dirigeants.

Pourrions-nous caler un appel téléphonique de dix minutes dans les jours qui viennent ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Duckreative",
        "email": "contact@duckreative.com",
        "territory": "Mayotte",
        "source": "https://duckreative.com",
        "subject": "Créativité digitale et opportunités / Duckreative",
        "body": """Bonjour,

Félicitations pour votre créativité et votre audace visuelle au service des entreprises et projets à Mayotte.

Chez Domtom Connect, notre mission est de relier les talents de nos îles avec l'écosystème entrepreneurial élargi.

Dans votre quotidien d'agence créative, quel est le besoin majeur qui sollicite le plus vos ressources en ce moment ?

Nous serions ravis de vous intégrer à notre réseau d'entraide WhatsApp et de vous présenter notre application DTC Pulse.

Seriez-vous disponible pour un appel découverte de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Mascareign Digital",
        "email": "contact@mascareign-digital.re",
        "territory": "Mayotte / Réunion",
        "source": "https://mascareign-digital.re",
        "subject": "Solutions numériques océan Indien / Mascareign Digital",
        "body": """Bonjour,

Bravo pour l'accompagnement numérique régional que vous déployez sur l'axe Réunion - Mayotte.

Chez Domtom Connect, nous oeuvrons à renforcer la solidarité économique et les opportunités de partenariat entre les territoires ultramarins et la diaspora.

Quel est à présent votre principal objectif stratégique pour accélérer vos activités ?

Nous animons une communauté active sur WhatsApp ainsi que l'application mobile DTC Pulse.

Pourrions-nous prévoir dix minutes d'échange téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- SÉNÉGAL (3) ---
    {
        "company": "NOLA Agence Web",
        "email": "contact@nola.sn",
        "territory": "Sénégal (Dakar)",
        "source": "https://nola.sn",
        "subject": "Innovation web et intelligence artificielle / NOLA Agence Web",
        "body": """Bonjour,

Félicitations pour votre positionnement novateur combinant sites web premium, agents IA et marketing digital à Dakar.

Chez Domtom Connect, nous développons des ponts stratégiques entre l'Afrique de l'Ouest, les Caraïbes et l'Hexagone pour accélérer les affaires de nos membres.

Dans le développement de votre portefeuille clients, quel défi requiert le plus d'énergie — l'évangélisation technologique, le recrutement ou le passage à l'international ?

Nous animons un groupe d'entraide WhatsApp réunissant des fondateurs et mettons à disposition l'application DTC Pulse.

Seriez-vous partant pour convenir d'un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "TekkiTechno",
        "email": "contact@tekkitechno.sn",
        "territory": "Sénégal (Dakar)",
        "source": "https://tekkitechno.sn",
        "subject": "Solutions digitales et partenariats d'affaires / TekkiTechno",
        "body": """Bonjour,

Bravo pour le travail de fond que vous réalisez à Dakar dans le développement web, mobile et le marketing digital.

Chez Domtom Connect, notre mission est de connecter les créateurs de solutions numériques aux opportunités et aux réseaux de la diaspora.

Quelle est la priorité numéro un qui concentre l'attention de l'équipe TekkiTechno en ce moment ?

Nous serions très heureux de vous faire découvrir notre communauté WhatsApp et notre application mobile DTC Pulse.

Auriez-vous dix minutes à consacrer à un premier contact téléphonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "DIGITPRO",
        "email": "contact@digissol.com",
        "territory": "Sénégal (Dakar)",
        "source": "https://digitpro.sn",
        "subject": "Outils de gestion et transformation digitale / DIGITPRO",
        "body": """Bonjour,

Félicitations pour vos solutions de gestion CRM/ERP et vos offres web dédiées à la productivité des entreprises au Sénégal.

Chez Domtom Connect, nous accompagnons les professionnels du logiciel et de l'intégration pour faciliter leur déploiement multi-territoires.

Quel est aujourd'hui votre axe de développement prioritaire — capter de nouveaux comptes PME ou enrichir votre offre logicielle ?

Nous animons une communauté de dirigeants sur WhatsApp et via notre application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique informel à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- CÔTE D'IVOIRE (2) ---
    {
        "company": "SKYSOFT CI",
        "email": "hello@skysoft.ci",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://skysoft.ci",
        "subject": "Développement web et passerelles économiques / SKYSOFT",
        "body": """Bonjour,

Bravo pour le dynamisme remarquable de SKYSOFT dans la conception de sites web et le webmarketing sur la place d'Abidjan.

Chez Domtom Connect, nous favorisons les synergies concrètes et les partenariats d'affaires entre l'Afrique subsaharienne, les Caraïbes et l'Europe.

Dans votre dynamique d'expansion, quelle est la problématique qui mobilise le plus votre équipe actuellement ?

Nous animons un écosystème WhatsApp d'entraide professionnelle et proposons l'application DTC Pulse pour stimuler les collaborations.

Seriez-vous ouvert à un rapide échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Agence Digitale Iroko CI",
        "email": "ali@iroko.io",
        "territory": "Côte d'Ivoire (Abidjan Marcory)",
        "source": "https://iroko.io",
        "subject": "Stratégie digitale et opportunités de synergies / Iroko",
        "body": """Bonjour Ali,

Félicitations pour la qualité de vos initiatives digitales et le positionnement stratégique d'Iroko à Abidjan.

Chez Domtom Connect, notre ambition est d'épauler les dirigeants de structures technologiques dans leur rayonnement et leur ouverture sur d'autres marchés.

Quel est aujourd'hui votre chantier le plus stimulant — le scale-up de vos offres, les partenariats stratégiques ou la gestion de talents ?

Nous serions ravis de vous accueillir sur notre groupe WhatsApp d'entraide et de vous présenter notre application DTC Pulse.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces jours-ci ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- CAMEROUN (9) ---
    {
        "company": "BEONWEB",
        "email": "contact@beonweb.cm",
        "territory": "Cameroun (Yaoundé)",
        "source": "https://beonweb.cm",
        "subject": "Solutions web et opportunités de réseau / BEONWEB",
        "body": """Bonjour,

Toutes mes félicitations pour la rigueur de vos prestations web et votre accompagnement des entreprises camerounaises.

Chez Domtom Connect, nous bâtissons un réseau international unissant les entrepreneurs africains, caribéens et de la diaspora.

Dans la croissance de BEONWEB, quel est actuellement votre défi prépondérant ?

Nous animons une communauté WhatsApp d'entraide directe et l'application mobile DTC Pulse pour catalyser les opportunités.

Seriez-vous disponible pour un appel découverte de dix minutes dans les jours à venir ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Media System",
        "email": "contact@mediasystem.cm",
        "territory": "Cameroun (Yaoundé)",
        "source": "https://mediasystem.cm",
        "subject": "Ingénierie informatique et synergies / Media System",
        "body": """Bonjour,

Bravo pour l'expertise technologique et le sérieux que vous insufflez dans vos réalisations informatiques à Yaoundé.

Chez Domtom Connect, nous accompagnons les professionnels de l'ingénierie logicielle pour démultiplier leurs connexions d'affaires.

Quel est aujourd'hui le principal enjeu opérationnel qui sollicite vos ressources ?

Nous animons un réseau WhatsApp dédié à l'entraide professionnelle ainsi que la plateforme DTC Pulse.

Pourrions-nous prévoir dix minutes d'échange téléphonique à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Agence Performance",
        "email": "hello@agenceperformance.cm",
        "territory": "Cameroun (Yaoundé)",
        "source": "https://agenceperformance.cm",
        "subject": "Performance digitale et développement / Agence Performance",
        "body": """Bonjour,

Félicitations pour vos résultats et votre démarche axée sur le retour sur investissement digital pour vos clients au Cameroun.

Chez Domtom Connect, nous accompagnons les dirigeants d'agences pour valoriser leur savoir-faire et créer des alliances productives.

Quelle est la priorité majeure sur laquelle vous concentrez vos forces actuellement ?

Nous vous proposons de découvrir notre groupe WhatsApp d'entraide et notre application mobile DTC Pulse.

Auriez-vous dix minutes disponibles pour faire connaissance par téléphone cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Promillys",
        "email": "contact@promillys.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "https://promillys.cm",
        "subject": "Créativité web et développement d'affaires / Promillys",
        "body": """Bonjour,

Bravo pour vos réalisations web et votre contribution active au dynamisme de la communication digitale au Cameroun.

Chez Domtom Connect, notre mission est de relier les acteurs clés de la tech aux réseaux économiques de la diaspora et des îles.

Dans la conduite de vos activités chez Promillys, quel est votre plus grand défi du moment ?

Nous serions heureux de vous intégrer à notre canal WhatsApp d'entraide et sur l'application DTC Pulse.

Seriez-vous ouvert à un bref point téléphonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Alain Web-creator",
        "email": "info@alainwebcreator.cm",
        "territory": "Cameroun (Douala)",
        "source": "https://alainwebcreator.cm",
        "subject": "Conception web et réseau professionnel / Alain Web-creator",
        "body": """Bonjour Alain,

Félicitations pour la clarté et l'impact de vos créations web pour les professionnels et entreprises à Douala.

Chez Domtom Connect, nous soutenons les concepteurs indépendants et agences afin de développer leurs recommandations mutuelles.

Quel est aujourd'hui votre principal axe de progression ou votre défi logistique au quotidien ?

Notre communauté WhatsApp et notre application mobile DTC Pulse ont été pensées pour stimuler les collaborations directes.

Pourrions-nous caler dix minutes d'échange téléphonique selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Onebiz",
        "email": "one@onebiz.cm",
        "territory": "Cameroun (Douala)",
        "source": "https://onebiz.cm",
        "subject": "Solutions business et digitalisation / Onebiz",
        "body": """Bonjour,

Bravo pour l'approche intégrée que Onebiz apporte pour simplifier le business et la digitalisation des entreprises camerounaises.

Chez Domtom Connect, nous accompagnons les facilitateurs d'affaires et experts tech pour démultiplier leurs partenariats internationaux.

Quelle est la priorité stratégique qui mobilise le plus votre équipe actuellement ?

Nous fédérons des dirigeants au sein d'un groupe WhatsApp d'entraide et sur l'application DTC Pulse.

Seriez-vous partant pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Actual Solutions",
        "email": "contact@actual-solutions.cm",
        "territory": "Cameroun (Douala)",
        "source": "https://actual-solutions.cm",
        "subject": "Solutions technologiques et synergies / Actual Solutions",
        "body": """Bonjour,

Toutes mes félicitations pour la pertinence de vos solutions technologiques déployées à Douala au service des entreprises.

Chez Domtom Connect, nous mettons en relation les compétences tech d'Afrique et des Caraïbes pour faire émerger des opportunités mutuelles.

Quel est aujourd'hui l'enjeu prédominant pour Actual Solutions — le recrutement, l'infrastructure ou l'acquisition de marchés ?

Nous serions ravis de vous présenter notre écosystème d'entraide WhatsApp et l'application mobile DTC Pulse.

Auriez-vous dix minutes à consacrer à un échange téléphonique informel ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "TENET",
        "email": "contact@tenet.cm",
        "territory": "Cameroun (Douala)",
        "source": "https://tenet.cm",
        "subject": "Ingénierie digitale et croissance / TENET",
        "body": """Bonjour,

Bravo pour la qualité de vos expertises digitales et votre rigueur méthodologique au service de vos clients camerounais.

Chez Domtom Connect, nous accompagnons les structures technologiques afin de valoriser leurs talents et stimuler leurs coopérations régionales.

Dans la montée en charge de vos projets, quel est votre axe prioritaire pour les prochains mois ?

Nous animons une communauté de professionnels sur WhatsApp et via notre application mobile DTC Pulse.

Pourrions-nous convenir d'un échange téléphonique de dix minutes ces jours-ci ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "KMR Start-up Hub",
        "email": "contact@kmrstart-up-hub.cm",
        "territory": "Cameroun (Douala)",
        "source": "https://kmrstart-up-hub.cm",
        "subject": "Accompagnement de startups et passerelles / KMR Start-up Hub",
        "body": """Bonjour,

Félicitations pour votre action inspirante à Douala pour incuber, conseiller et accélérer les jeunes pousses du numérique au Cameroun.

Chez Domtom Connect, notre mission est précisément de bâtir des synergies concrètes entre les incubateurs, startups et investisseurs de nos différents territoires.

Quel est aujourd'hui le défi majeur pour vos cohortes de startups — le financement, le mentorat ou l'accès aux marchés internationaux ?

Nous serions ravis de collaborer avec vous via notre communauté WhatsApp et l'application DTC Pulse.

Seriez-vous ouvert à un échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- BÉNIN (6) ---
    {
        "company": "Digital Innovation",
        "email": "contact@digitalinnovation.bj",
        "territory": "Bénin (Cotonou)",
        "source": "https://digitalinnovation.bj",
        "subject": "Innovation numérique et réseau d'affaires / Digital Innovation",
        "body": """Bonjour,

Bravo pour votre contribution dynamique à la transformation digitale et au marketing web des entreprises à Cotonou.

Chez Domtom Connect, nous oeuvrons à connecter les agences pionnières béninoises avec des opportunités d'affaires dans les Caraïbes et la diaspora.

Quelle est la priorité numéro un qui concentre vos efforts en ce moment au sein de l'agence ?

Nous animons un écosystème d'entraide WhatsApp et mettons à disposition l'application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SGTIC",
        "email": "info@sgtic.bj",
        "territory": "Bénin (Cotonou)",
        "source": "https://sgtic.bj",
        "subject": "Technologies TIC et partenariats de croissance / SGTIC",
        "body": """Bonjour,

Félicitations pour la palette complète de vos compétences en TIC, hébergement, développement et formation professionnelle au Bénin.

Chez Domtom Connect, nous accompagnons les spécialistes des technologies pour accélérer leur ouverture vers de nouveaux marchés.

Quel est aujourd'hui votre objectif majeur de développement pour SGTIC ?

Nous fédérons des acteurs engagés autour d'un canal WhatsApp d'entraide et via notre application DTC Pulse.

Seriez-vous disponible pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "GoSocial BJ",
        "email": "contact@gosocial.bj",
        "territory": "Bénin (Cotonou)",
        "source": "https://gosocial.bj",
        "subject": "Acquisition digitale et opportunités / GoSocial BJ",
        "body": """Bonjour,

Bravo pour votre expertise pointue dans la conversion de prospects et la gestion publicitaire au profit des marques béninoises.

Chez Domtom Connect, nous aidons les professionnels du growth et des réseaux sociaux à nouer des partenariats créateurs de valeur.

Dans la progression de votre agence, quel défi sollicite le plus de temps et d'attention ?

Nous serions enchantés de vous faire découvrir notre communauté WhatsApp et l'application mobile DTC Pulse.

Auriez-vous dix minutes à accorder pour un point téléphonique prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Digital Valley",
        "email": "hello@digitalvalley.bj",
        "territory": "Bénin (Cotonou)",
        "source": "https://digitalvalley.bj",
        "subject": "Compétences tech et accélération / Digital Valley",
        "body": """Bonjour,

Toutes mes félicitations pour votre engagement remarquable dans le renforcement des compétences numériques et l'éclosion de talents à Cotonou.

Chez Domtom Connect, nous partageons cette conviction que les talents sont la clé pour transformer nos économies régionales.

Dans la montée en puissance de vos programmes, quel est votre axe prioritaire pour les mois qui viennent ?

Nous animons une communauté WhatsApp d'entraide et la plateforme DTC Pulse pour soutenir les collaborations directes.

Pourrions-nous prévoir dix minutes d'échange téléphonique selon vos créneaux ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "BloLab",
        "email": "contact@blolab.bj",
        "territory": "Bénin (Cotonou)",
        "source": "https://blolab.bj",
        "subject": "Hub d'innovation et réseau d'entraide / BloLab",
        "body": """Bonjour,

Bravo pour l'énergie exemplaire que BloLab insuffle au Bénin comme tiers-lieu d'innovation, d'apprentissage et d'incubation numérique.

Chez Domtom Connect, nous avons vocation à bâtir des ponts entre les espaces d'innovation d'Afrique de l'Ouest, les Caraïbes et l'Europe.

Quel est aujourd'hui votre principal besoin pour démultiplier l'impact de vos incubés et projets ?

Nous serions très heureux de vous connecter à notre communauté WhatsApp et de vous présenter l'application DTC Pulse.

Seriez-vous partant pour convenir d'un rapide point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Future Studio",
        "email": "info@futurestudio.bj",
        "territory": "Bénin (Cotonou)",
        "source": "https://futurestudio.bj",
        "subject": "Accélération de startups et synergies / Future Studio",
        "body": """Bonjour,

Félicitations pour votre action d'accélération et votre vision stratégique pour faire grandir les startups béninoises à fort potentiel.

Chez Domtom Connect, notre rôle est d'apporter aux fonds et structures d'accompagnement un vivier de talents et d'opportunités d'expansion.

Quelle est la priorité numéro un sur laquelle vous vous concentrez pour vos startups actuellement ?

Nous animons un groupe d'entraide WhatsApp réunissant des dirigeants ainsi que notre application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- TOGO (1) ---
    {
        "company": "Bobo Création",
        "email": "solimcpaka@gmail.com",
        "territory": "Togo (Lomé)",
        "source": "CFE Togo",
        "subject": "Création digitale et réseau d'affaires / Bobo Création",
        "body": """Bonjour,

Bravo pour votre créativité et votre accompagnement en communication digitale et web design auprès des professionnels à Lomé.

Chez Domtom Connect, nous soutenons les créateurs et agences d'Afrique et d'Outre-mer afin de catalyser leurs coopérations économiques.

Dans le développement de Bobo Création, quel est votre défi majeur en ce moment ?

Nous serions ravis de vous accueillir dans notre groupe WhatsApp d'entraide et de vous faire découvrir l'application DTC Pulse.

Seriez-vous disponible pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

if __name__ == '__main__':
    print('=== VÉRIFICATION DU BATCH 57 (50 CIBLES TECH & DIGITAL) ===')
    db_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'contacts_deja_contactes.json')
    known_emails = set()
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            db = json.load(f)
            known_emails = set(c['email'].lower().strip() for c in db.get('contacts', []))

    for idx, lead in enumerate(LEADS, 1):
        if ':' in lead['subject']:
            raise ValueError(f"Deux-points dans sujet ({lead['company']})")
        if ':' in lead['body']:
            raise ValueError(f"Deux-points dans corps ({lead['company']})")
        
        ok, msg = verify_email_target(lead['email'])
        if not ok:
            raise ValueError(f"MX FAIL {lead['email']} : {msg}")
            
        if lead['email'].lower().strip() not in known_emails:
            dup, reason = is_domain_or_company_duplicate(lead['email'], lead['company'])
            if dup:
                raise ValueError(f"DUP {lead['email']} : {reason}")
                
        print(f"[{idx:02d}] VALIDE - {lead['company']} ({lead['email']}) [{lead['territory']}]")

    print(f"\nBilan : {len(LEADS)} / 50 cibles parfaitement valides.")
