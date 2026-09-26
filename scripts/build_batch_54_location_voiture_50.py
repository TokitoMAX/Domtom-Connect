import json, sys, os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

# 50 CIBLES ULTRA-QUALIFIÉES - SECTEUR LOCATION DE VOITURE & VÉHICULES (LOUEURS INDÉPENDANTS)
# Répartition : 16 Guadeloupe + 14 Martinique + 2 Îles du Nord + 4 Guyane + 8 La Réunion + 6 Afrique (Sénégal & Côte d'Ivoire)
LEADS = [
    # =========================================================================
    # GUADELOUPE (16 CIBLES)
    # =========================================================================
    {
        "company": "Le Bleu Lagon Location",
        "email": "contact@bleulagonlocation.com",
        "territory": "Guadeloupe (Sainte-Anne)",
        "source": "https://bleulagonlocation.com",
        "subject": "Échange sur la gestion de flotte et vos priorités / Le Bleu Lagon Location",
        "body": """Bonjour,

Je découvre votre activité de location de véhicules avec Le Bleu Lagon à Sainte-Anne, au service des résidents et des visiteurs de Guadeloupe.

Chez Domtom Connect, nous accompagnons les entrepreneurs ultramarins dans leurs enjeux quotidiens de rentabilité, d'approvisionnement en pièces et d'organisation logistique.

Dans votre secteur aujourd'hui, quelles sont les problématiques qui pèsent le plus sur votre activité (gestion des entretiens de flotte, coût des pièces détachées ou saisonnalité) ?

Par ailleurs, nous développons un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp réunissant des dirigeants et des utilisateurs de notre application DTC Pulse pour s'entraider concrètement et mutualiser des ressources.

Seriez-vous ouvert à un court appel de dix minutes cette semaine pour échanger sur vos priorités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Caribbean Car Rental",
        "email": "contact.caribbeancarrental@gmail.com",
        "territory": "Guadeloupe (Jarry - Baie-Mahault)",
        "source": "https://caribbeancarrental.fr",
        "subject": "Vos enjeux de flotte automobile et développement / Caribbean Car Rental",
        "body": """Bonjour,

Bravo pour le développement de Caribbean Car Rental au cœur du pôle économique de Jarry en Guadeloupe.

Chez Domtom Connect, nous accompagnons les dirigeants indépendants pour les aider à relever leurs défis opérationnels, qu'il s'agisse de gestion de trésorerie, de logistique insulaire ou de visibilité directe sans dépendre des grandes plateformes.

Aujourd'hui, quel est le défi opérationnel qui vous demande le plus de temps et d'énergie dans votre gestion de flotte ?

Nous rassemblons également des entrepreneurs au sein d'un groupe d'entraide WhatsApp et via notre application DTC Pulse afin de partager des opportunités et des solutions concrètes entre les Caraïbes et l'Afrique.

Seriez-vous disponible pour un bref échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Dolo Rent",
        "email": "contacts.dolorentfwi@gmail.com",
        "territory": "Guadeloupe (Les Abymes)",
        "source": "https://dolorent.com",
        "subject": "Échange autour de vos défis de loueur indépendant / Dolo Rent",
        "body": """Bonjour,

Je suis avec intérêt le positionnement de Dolo Rent aux Abymes pour proposer une offre de location accessible et flexible en Guadeloupe.

Chez Domtom Connect, nous accompagnons les entreprises ultramarines dans la structuration de leurs projets et l'optimisation de leurs coûts d'exploitation en milieu insulaire.

Dans votre quotidien de loueur indépendant, quels sont vos principaux besoins en ce moment (délai d'acheminement des pièces, renouvellement de parc ou acquisition client) ?

Par ailleurs, nous animons un groupe d'entraide WhatsApp réunissant chefs d'entreprise et membres de notre application DTC Pulse pour créer des synergies d'affaires entre nos territoires et l'international.

Pourrions-nous caler un court échange de dix minutes pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Loca'Léz",
        "email": "localez971@gmail.com",
        "territory": "Guadeloupe (Lamentin)",
        "source": "https://localez.fr",
        "subject": "Vos priorités d'exploitation et flotte / Loca'Léz",
        "body": """Bonjour,

Félicitations pour votre engagement avec Loca'Léz au Lamentin pour offrir un service de mobilité de proximité en Guadeloupe.

Chez Domtom Connect, notre mission est d'accompagner les acteurs économiques locaux face à leurs problématiques concrètes de développement et d'organisation logistique.

Quels sont aujourd'hui les freins ou les besoins clés que vous rencontrez dans la gestion et la rotation de vos véhicules ?

Nous fédérons aussi un réseau d'entrepreneurs à travers un groupe WhatsApp dédié et notre application DTC Pulse afin de faciliter le partage de bonnes pratiques et la coopération économique.

Seriez-vous partant pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Caribbean Rental",
        "email": "caribrental@gmail.com",
        "territory": "Guadeloupe (Basse-Terre)",
        "source": "https://caribbeanrental.fr",
        "subject": "Échange sur votre activité de location de véhicules / Caribbean Rental",
        "body": """Bonjour,

Je salue votre présence avec Caribbean Rental sur le bassin de Basse-Terre pour répondre aux besoins de mobilité des particuliers et des professionnels.

Chez Domtom Connect, nous apportons un accompagnement stratégique et opérationnel aux entrepreneurs des départements d'Outre-mer dans la résolution de leurs difficultés de gestion ou d'approvisionnement.

Dans votre activité, quel est le sujet le plus complexe à gérer actuellement (coûts d'assurance, approvisionnement ou gestion des creux saisonniers) ?

Dans le même esprit, nous développons un groupe d'entraide WhatsApp couplé à notre application DTC Pulse pour connecter les entrepreneurs caribéens et africains autour de solutions concrètes.

Auriez-vous dix minutes à m'accorder cette semaine pour un échange rapide ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Zenith Auto Rent",
        "email": "contact@zenithautorent.com",
        "territory": "Guadeloupe",
        "source": "https://zenithautorent.com",
        "subject": "Partage sur vos enjeux de développement automobile / Zenith Auto Rent",
        "body": """Bonjour,

Je découvre le travail de Zenith Auto Rent dans le secteur de la location automobile en Guadeloupe.

Chez Domtom Connect, nous accompagnons les gérants d'entreprises ultramarines afin de les soutenir face aux contraintes du marché insulaire (coût du fret, entretien de flotte et préservation des marges).

Aujourd'hui, quels sont vos principaux leviers d'amélioration ou les aspects qui sollicitent le plus votre attention dans la société ?

Nous animons également un réseau WhatsApp et une communauté d'utilisateurs sur l'application DTC Pulse pour échanger des contacts utiles et renforcer la solidarité économique.

Seriez-vous disponible pour un échange convivial de dix minutes par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Harmony Location",
        "email": "contact@harmonylocation.fr",
        "territory": "Guadeloupe",
        "source": "https://harmonylocation.fr",
        "subject": "Échange sur vos priorités opérationnelles / Harmony Location",
        "body": """Bonjour,

Bravo pour l'offre de location proposée par Harmony Location pour accompagner les déplacements à travers la Guadeloupe.

Chez Domtom Connect, notre rôle est d'épauler les dirigeants dans la gestion de leurs problématiques d'entreprise, qu'elles concernent la logistique, la trésorerie ou les partenariats stratégiques.

Dans votre quotidien professionnel, quel est le défi majeur auquel vous faites face actuellement ?

Par ailleurs, nous avons mis en place un groupe WhatsApp d'entraide ainsi que l'application DTC Pulse pour connecter les dirigeants caribéens et créer des opportunités partagées.

Pourrions-nous convenir d'un bref point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "N'LOC Guadeloupe",
        "email": "contact@nloc-guadeloupe.com",
        "territory": "Guadeloupe",
        "source": "https://nloc-guadeloupe.com",
        "subject": "Vos besoins de gestion et perspective de flotte / N'LOC Guadeloupe",
        "body": """Bonjour,

Je découvre les services de N'LOC Guadeloupe et votre positionnement sur le marché guadeloupéen de la location de voitures.

Chez Domtom Connect, nous sommes aux côtés des chefs d'entreprise pour les aider à surmonter les obstacles logistiques et opérationnels propres à nos territoires.

Quelles sont les thématiques qui occupent le plus votre quotidien de gérant (maintenance, délais d'import de pièces ou visibilité commerciale) ?

Nous réunissons également des porteurs de projets et dirigeants dans un groupe WhatsApp d'entraide relié à notre application DTC Pulse afin de bâtir des ponts solides entre nos territoires et l'Afrique.

Seriez-vous partant pour un appel téléphonique de dix minutes pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Car-Bike-Loc",
        "email": "information@car-bike-loc.net",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://car-bike-loc.net",
        "subject": "Échange sur votre activité de mobilité / Car-Bike-Loc",
        "body": """Bonjour,

Je salue votre engagement avec Car-Bike-Loc à Saint-François pour proposer une gamme complète de mobilité (voitures et deux-roues) aux usagers en Guadeloupe.

Chez Domtom Connect, nous accompagnons les professionnels de nos îles dans l'optimisation de leurs processus, la gestion de leur parc et la recherche de synergies.

Sur le terrain, quels sont les défis les plus sensibles pour votre structure en cette période ?

Notre organisation anime aussi un groupe WhatsApp de dirigeants et propose l'application DTC Pulse pour s'entraider sur les enjeux concrets d'exploitation.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Pacificar",
        "email": "pacificar.guadeloupe@gmail.com",
        "territory": "Guadeloupe (Capesterre Belle-Eau)",
        "source": "https://pacificar.fr",
        "subject": "Échange sur vos besoins d'exploitation de flotte / Pacificar",
        "body": """Bonjour,

Bravo pour l'implantation de Pacificar à Capesterre Belle-Eau et votre service de location au contact direct de la clientèle locale et touristique.

Chez Domtom Connect, nous soutenons les entreprises indépendantes pour les aider à relever leurs défis de rentabilité, de gestion de flotte et de structuration.

Quels sont aujourd'hui vos principaux besoins ou les sujets qui vous demandent le plus de vigilance dans votre activité ?

Nous animons par ailleurs un groupe WhatsApp fédérant des dirigeants ultramarins et africains autour de notre application DTC Pulse pour partager solutions et opportunités.

Seriez-vous ouvert à un rapide échange de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Z'ed Location",
        "email": "contact.zedlocation@gmail.com",
        "territory": "Guadeloupe (Sainte-Rose)",
        "source": "https://zedlocation.fr",
        "subject": "Vos priorités de loueur à Sainte-Rose / Z'ed Location",
        "body": """Bonjour,

Félicitations pour le service offert par Z'ed Location à Sainte-Rose pour faciliter les déplacements des usagers en Guadeloupe.

Chez Domtom Connect, nous accompagnons les gérants de parcs automobiles et entreprises locales sur leurs problématiques d'organisation, de coûts de maintenance et de gestion des risques.

Quelles sont vos priorités actuelles dans le pilotage de votre entreprise de location ?

Nous mettons aussi en relation des entrepreneurs via un groupe WhatsApp et notre application mobile DTC Pulse pour échanger des retours d'expérience et créer de la valeur commune.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "RCM Location",
        "email": "Rcmlocation@gmail.com",
        "territory": "Guadeloupe (Les Abymes)",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Échange sur votre activité de location de véhicules / RCM Location",
        "body": """Bonjour,

Je découvre votre activité de location avec RCM Location aux Abymes pour accompagner la mobilité des résidents et vacanciers.

Chez Domtom Connect, notre mission est d'apporter un soutien concret aux entrepreneurs dans la gestion de leurs contraintes locales et insulaires.

Dans votre fonctionnement régulier, quel est le domaine qui mobilise le plus votre énergie (recherche de pièces, relations bancaires ou gestion des plannings) ?

Nous avons également mis en place un réseau d'entraide sur WhatsApp et l'application DTC Pulse pour connecter nos territoires ultramarins et la diaspora.

Seriez-vous disponible pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Location Voitures Guadeloupe",
        "email": "location.voitures.gpe@gmail.com",
        "territory": "Guadeloupe (Pointe-à-Pitre)",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Échange autour de vos besoins d'exploitation / Location Voitures Guadeloupe",
        "body": """Bonjour,

Je salue votre présence sur le secteur de la location de voitures pour répondre à la demande de déplacement en Guadeloupe.

Chez Domtom Connect, nous accompagnons les chefs d'entreprise dans l'optimisation de leur organisation, le traitement de leurs points de blocage et leur croissance.

Quelles sont les difficultés ou les opportunités prioritaires sur lesquelles vous travaillez actuellement ?

Nous rassemblons également des professionnels au sein d'un groupe WhatsApp et via l'application DTC Pulse pour bâtir un écosystème d'entraide et de partenariats.

Seriez-vous partant pour un court appel de dix minutes pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Trip Car Location",
        "email": "tripcarlocation971@gmail.com",
        "territory": "Guadeloupe (Sainte-Anne)",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Vos enjeux de gestion de flotte à Sainte-Anne / Trip Car Location",
        "body": """Bonjour,

Bravo pour votre activité avec Trip Car Location à Sainte-Anne pour offrir une solution de transport fiable en Guadeloupe.

Chez Domtom Connect, nous épaulons les loueurs indépendants et dirigeants face aux contraintes du milieu insulaire (approvisionnement, trésorerie et dépendance aux intermédiaires).

Quel est aujourd'hui votre défi numéro un dans la gestion de votre flotte automobile ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application mobile DTC Pulse afin de connecter les acteurs économiques des Caraïbes et d'Afrique.

Pourrions-nous convenir d'un échange téléphonique de dix minutes dans la semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Jimmy's Location",
        "email": "jimmyslocation@gmail.com",
        "territory": "Guadeloupe",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Échange sur vos perspectives d'activité / Jimmy's Location",
        "body": """Bonjour,

Je découvre votre offre avec Jimmy's Location au service de la clientèle locale et touristique en Guadeloupe.

Chez Domtom Connect, nous sommes dédiés à l'accompagnement des structures ultramarines pour les aider à pérenniser leur activité et optimiser leur modèle économique.

Dans votre gestion au quotidien, quelles sont les questions qui vous préoccupent le plus ?

Nous animons par ailleurs une communauté WhatsApp active et proposons l'application DTC Pulse pour encourager les partenariats entre dirigeants d'Outre-mer et d'Afrique.

Seriez-vous d'accord pour un court échange téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Angel Cars Location",
        "email": "angelcarslocation@gmail.com",
        "territory": "Guadeloupe (Le Moule)",
        "source": "https://angelcarslocation.com",
        "subject": "Échange sur la gestion de votre parc / Angel Cars Location",
        "body": """Bonjour,

Félicitations pour le service développé par Angel Cars Location au Moule pour garantir une mobilité sereine en Guadeloupe.

Chez Domtom Connect, nous accompagnons les entrepreneurs locaux pour répondre aux questions de logistique, d'organisation d'équipe et de rentabilité de flotte.

Quels sont les leviers que vous souhaiteriez actionner pour faciliter votre gestion au quotidien ?

Nous facilitons également la mise en réseau des dirigeants via un groupe WhatsApp d'entraide et l'application DTC Pulse pour créer des synergies économiques concrètes.

Pourrions-nous caler un court appel de dix minutes cette semaine selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # =========================================================================
    # MARTINIQUE (14 CIBLES)
    # =========================================================================
    {
        "company": "Car'Men Location",
        "email": "contact@carmenlocation.com",
        "territory": "Martinique (Le Lamentin)",
        "source": "https://carmenlocation.com",
        "subject": "Échange sur votre développement de flotte / Car'Men Location",
        "body": """Bonjour,

Je découvre avec attention le travail de Car'Men Location au Lamentin pour répondre aux besoins de location de voitures en Martinique.

Chez Domtom Connect, nous accompagnons les dirigeants et loueurs indépendants afin de les aider à sécuriser leur trésorerie, maîtriser leurs coûts d'entretien et diversifier leur clientèle.

Quels sont aujourd'hui les défis les plus exigeants dans la gestion de votre structure ?

Nous animons également un groupe d'entraide WhatsApp et l'application DTC Pulse réunissant des entrepreneurs des Caraïbes et d'Afrique pour partager ressources et solutions.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Tropique Évasion",
        "email": "tropiquevasion@gmail.com",
        "territory": "Martinique (Les Trois-Îlets)",
        "source": "https://tropiquevasion.com",
        "subject": "Vos priorités de gestion et saisonnalité / Tropique Évasion",
        "body": """Bonjour,

Bravo pour la qualité de service développée par Tropique Évasion aux Trois-Îlets pour satisfaire la demande automobile en Martinique.

Chez Domtom Connect, nous accompagnons les structures touristiques et de mobilité face aux variations saisonnières et aux contraintes insulaires d'approvisionnement.

Dans votre exploitation, quels sont les sujets qui requièrent le plus d'énergie en ce moment ?

Par ailleurs, nous connectons des chefs d'entreprise via un groupe WhatsApp et notre application mobile DTC Pulse pour créer un réseau solidaire reliant les Caraïbes et l'Afrique.

Auriez-vous dix minutes pour un rapide coup de fil cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "IZYCARLOC",
        "email": "reservation@izycarloc.rent",
        "territory": "Martinique (Le Lamentin)",
        "source": "https://izycarloc.rent",
        "subject": "Échange autour de vos enjeux de loueur / IZYCARLOC",
        "body": """Bonjour,

Félicitations pour le dynamisme d'IZYCARLOC au Lamentin pour simplifier la location de voitures pour vos clients en Martinique.

Chez Domtom Connect, notre rôle est d'épauler les dirigeants ultramarins sur leurs problématiques d'organisation, d'optimisation financière et de visibilité.

Quels sont les points d'amélioration ou les besoins clés que vous identifiez dans votre quotidien de loueur ?

Nous animons aussi une communauté de gérants d'entreprises sur WhatsApp et l'application DTC Pulse pour échanger des méthodes éprouvées et des opportunités d'affaires.

Seriez-vous disponible pour un échange rapide de dix minutes par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MadininaCar AMC",
        "email": "amcphone972@gmail.com",
        "territory": "Martinique (Le Lamentin)",
        "source": "https://madininacar.com",
        "subject": "Vos besoins de gestion et rotation de flotte / MadininaCar",
        "body": """Bonjour,

Je salue l'activité de MadininaCar au Lamentin pour fournir une solution de mobilité pratique et réactive en Martinique.

Chez Domtom Connect, nous apportons un accompagnement concret aux professionnels de nos îles confrontés aux problématiques de gestion de flotte, d'assurance et d'entretien.

Dans votre organisation, quel est le défi opérationnel qui vous mobilise le plus actuellement ?

Nous rassemblons également des entrepreneurs dans un groupe d'entraide WhatsApp couplé à l'application mobile DTC Pulse afin de mutualiser contacts et expertises.

Pourrions-nous caler un court appel de dix minutes pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Flexicar Location",
        "email": "contact@flexicarlocation.com",
        "territory": "Martinique",
        "source": "https://flexicarlocation.com",
        "subject": "Échange sur votre développement de flotte / Flexicar Location",
        "body": """Bonjour,

Je découvre le service de Flexicar Location et votre engagement pour une location automobile fluide en Martinique.

Chez Domtom Connect, nous travaillons aux côtés des dirigeants d'entreprises locales pour répondre à leurs questions de développement, de maîtrise des coûts et d'investissements.

Aujourd'hui, quels sont les aspects qui sollicitent le plus vos ressources au quotidien ?

Nous proposons également un réseau WhatsApp et l'application mobile DTC Pulse pour connecter les entrepreneurs de notre région et d'Afrique autour de solutions pratiques.

Seriez-vous ouvert à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "JS Auto Location",
        "email": "contact@js-auto-location-martinique.com",
        "territory": "Martinique",
        "source": "https://js-auto-location-martinique.com",
        "subject": "Vos priorités d'exploitation automobile / JS Auto Location",
        "body": """Bonjour,

Bravo pour votre offre de véhicules avec JS Auto Location au service des déplacements sur l'ensemble de la Martinique.

Chez Domtom Connect, nous accompagnons les indépendants et TPE ultramarines pour les aider à structurer leurs démarches et surmonter leurs freins opérationnels.

Sur quel aspect ressentez-vous le plus fort besoin de simplification ou d'appui aujourd'hui ?

Par ailleurs, nous développons un groupe WhatsApp d'entraide et l'application DTC Pulse pour favoriser l'émergence de partenariats utiles entre dirigeants caribéens et africains.

Pourrions-nous convenir d'un rapide point téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "IXORA Location",
        "email": "contact@ixora-martinique.fr",
        "territory": "Martinique",
        "source": "https://ixora-martinique.fr",
        "subject": "Échange sur vos défis de gestion de parc / IXORA Location",
        "body": """Bonjour,

Je salue la présence d'IXORA Location pour accompagner la mobilité des touristes et des résidents en Martinique.

Chez Domtom Connect, notre mission est de soutenir les acteurs économiques de nos territoires insulaires dans la gestion de leurs contraintes de coûts et d'approvisionnement.

Quelles sont vos priorités clés du moment dans l'exploitation de votre entreprise de location ?

Nous réunissons également des gérants de sociétés au sein d'un groupe WhatsApp et sur notre application DTC Pulse pour partager de l'expérience et des solutions adaptées.

Seriez-vous partant pour un appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Alwégo Location",
        "email": "centrale@alwego.capital",
        "territory": "Martinique & Guadeloupe",
        "source": "https://alwego.rent",
        "subject": "Échange stratégique sur la mobilité insulaire / Alwégo",
        "body": """Bonjour,

Félicitations pour le déploiement et la qualité de service d'Alwégo à travers les Antilles pour réinventer la location de véhicules.

Chez Domtom Connect, nous accompagnons les structures ultramarines dans l'optimisation de leurs opérations et l'expansion de leurs réseaux de partenaires.

Dans votre modèle actuel, quels sont les défis les plus stratégiques face aux réalités insulaires et à la gestion de flotte ?

Nous animons par ailleurs un groupe WhatsApp de dirigeants et notre application mobile DTC Pulse pour bâtir des passerelles solides entre les Caraïbes, l'Afrique et sa diaspora.

Seriez-vous disponible pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "XRENT-AUTO",
        "email": "contact@xrent-auto.com",
        "territory": "Martinique",
        "source": "https://xrent-auto.com",
        "subject": "Vos enjeux opérationnels de location / XRENT-AUTO",
        "body": """Bonjour,

Je découvre l'activité de XRENT-AUTO et votre engagement à fournir des véhicules fiables pour sillonner la Martinique.

Chez Domtom Connect, nous aidons les dirigeants locaux à résoudre leurs problématiques courantes de gestion, de logistique de maintenance et d'efficacité financière.

Quel est aujourd'hui le point le plus délicat à gérer dans votre activité de loueur ?

Notre réseau rassemble des chefs d'entreprise via un groupe WhatsApp et l'application DTC Pulse pour échanger concrètement sur les défis du terrain.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Voiture Location Martinique",
        "email": "voiturelocationmartinique@gmail.com",
        "territory": "Martinique (Ducos)",
        "source": "https://locationvoitures-martinique.fr",
        "subject": "Échange sur votre activité automobile à Ducos / Voiture Location Martinique",
        "body": """Bonjour,

Bravo pour votre implantation à Ducos avec Voiture Location Martinique pour répondre aux demandes de mobilité sur l'île.

Chez Domtom Connect, nous accompagnons les structures indépendantes dans la pérennisation de leur activité et l'anticipation des creux d'activité.

Quels sont les besoins majeurs qui occupent votre esprit d'entrepreneur en ce moment ?

Nous animons aussi un groupe d'entraide WhatsApp et l'application DTC Pulse pour connecter les décideurs ultramarins et créer des coopérations utiles.

Seriez-vous ouvert à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "DYLOC AND GO",
        "email": "dylocandgo@gmail.com",
        "territory": "Martinique",
        "source": "https://dylocandgo.fr",
        "subject": "Vos perspectives de flotte et développement / DYLOC AND GO",
        "body": """Bonjour,

Je salue le dynamisme de DYLOC AND GO pour proposer une formule de location automobile réactive en Martinique.

Chez Domtom Connect, nous aidons les gérants d'entreprises locales à franchir des paliers de croissance et à surmonter les aléas logistiques insulaires.

Sur quel volet de votre organisation souhaiteriez-vous gagner le plus de temps et d'efficacité ?

Par ailleurs, nous rassemblons des porteurs de projets dans un groupe WhatsApp dédié et via l'application DTC Pulse pour stimuler l'entraide économique.

Pourrions-nous caler un rapide point de dix minutes au téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Kett Location",
        "email": "kettlocation@gmail.com",
        "territory": "Martinique (Sainte-Luce)",
        "source": "https://kettlocation.com",
        "subject": "Échange sur vos activités de location et remorquage / Kett Location",
        "body": """Bonjour,

Félicitations pour votre offre combinée de location et assistance avec Kett Location à Sainte-Luce, un service précieux pour la Martinique.

Chez Domtom Connect, nous soutenons les entrepreneurs ultramarins dans la gestion de leurs contraintes de matériel, de pièces et de développement.

Quels sont aujourd'hui les défis les plus marquants dans le pilotage de votre entreprise ?

Nous développons également un réseau d'entraide via un groupe WhatsApp et notre application mobile DTC Pulse pour favoriser les échanges entre dirigeants des Caraïbes et d'Afrique.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Martinique Loc Vac",
        "email": "martiniquelocvac@gmail.com",
        "territory": "Martinique",
        "source": "https://martiniquelocationvacances.com",
        "subject": "Échange sur la mobilité touristique / Martinique Loc Vac",
        "body": """Bonjour,

Je découvre l'activité de Martinique Loc Vac pour faciliter les séjours et déplacements touristiques sur l'île.

Chez Domtom Connect, nous accompagnons les professionnels dans l'adaptation de leur organisation aux variations du marché et la recherche de partenaires de confiance.

Dans votre activité, quelles sont vos priorités actuelles pour optimiser votre rentabilité ?

Nous réunissons aussi des dirigeants dans un groupe WhatsApp et sur l'application mobile DTC Pulse pour partager contacts et solutions pragmatiques.

Pourrions-nous convenir d'un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Madinina Loc'Auto",
        "email": "madinina.locauto@gmail.com",
        "territory": "Martinique (Sainte-Anne)",
        "source": "https://madininalocauto.com",
        "subject": "Vos besoins de loueur à Sainte-Anne / Madinina Loc'Auto",
        "body": """Bonjour,

Bravo pour l'engagement de Madinina Loc'Auto à Sainte-Anne pour proposer des véhicules adaptés aux visiteurs et résidents de Martinique.

Chez Domtom Connect, nous apportons un regard stratégique et un accompagnement opérationnel aux entrepreneurs locaux pour consolider leur modèle économique.

Quel est le point qui mobilise le plus votre attention en ce moment dans votre société ?

Nous fédérons également des chefs d'entreprise via un groupe WhatsApp d'entraide et l'application DTC Pulse afin de créer des passerelles entre nos territoires.

Seriez-vous d'accord pour un bref appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # =========================================================================
    # ÎLES DU NORD - SAINT-BARTHÉLEMY & SAINT-MARTIN (2 CIBLES)
    # =========================================================================
    {
        "company": "Maurice Car Rental",
        "email": "info@mauricecarrental.com",
        "territory": "Saint-Barthélemy (Gustavia)",
        "source": "https://mauricecarrental.com",
        "subject": "Échange sur vos défis de gestion de flotte / Maurice Car Rental",
        "body": """Bonjour,

Je salue le professionnalisme de l'entreprise familiale Maurice Car Rental à Saint-Barthélemy, à l'aéroport et à Gustavia.

Chez Domtom Connect, nous accompagnons les dirigeants insulaires confrontés aux exigences logistiques particulières de nos îles (coût du fret, approvisionnement et gestion de parc premium).

Quels sont les défis majeurs auxquels vous portez le plus de vigilance dans votre activité aujourd'hui ?

Par ailleurs, nous développons un groupe WhatsApp d'entraide couplé à l'application mobile DTC Pulse pour connecter les entrepreneurs de nos territoires et d'Afrique.

Seriez-vous disponible pour un court appel de dix minutes cette semaine pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Quickly Rent A Car",
        "email": "reservation@quicklyrentacar.com",
        "territory": "Saint-Martin (Grand-Case)",
        "source": "https://quicklyrentacar.com",
        "subject": "Vos priorités d'exploitation à Saint-Martin / Quickly Rent A Car",
        "body": """Bonjour,

Bravo pour votre présence avec Quickly Rent A Car à Grand-Case pour répondre aux besoins de location de véhicules à Saint-Martin.

Chez Domtom Connect, notre mission est d'épauler les chefs d'entreprise dans la résolution de leurs défis logistiques, financiers et organisationnels.

Dans votre quotidien de loueur sur l'île, quel est le sujet le plus complexe à gérer actuellement ?

Nous animons aussi un réseau de décideurs via un groupe WhatsApp et l'application DTC Pulse pour échanger des opportunités et mutualiser nos forces.

Auriez-vous dix minutes à m'accorder par téléphone ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # =========================================================================
    # GUYANE (4 CIBLES)
    # =========================================================================
    {
        "company": "Yana Rent",
        "email": "yanarent973@gmail.com",
        "territory": "Guyane",
        "source": "https://yanarent.com",
        "subject": "Échange sur votre activité de mobilité en Guyane / Yana Rent",
        "body": """Bonjour,

Je découvre l'offre de Yana Rent pour accompagner les déplacements professionnels et touristiques à travers la Guyane.

Chez Domtom Connect, nous accompagnons les entrepreneurs locaux face aux spécificités territoriales de gestion de parc et d'approvisionnement.

Quelles sont vos priorités clés ou les difficultés que vous rencontrez dans la maintenance et la gestion de vos véhicules ?

Nous facilitons par ailleurs les synergies d'affaires via un groupe WhatsApp d'entraide et l'application DTC Pulse reliant la Guyane, les Antilles et l'Afrique.

Seriez-vous partant pour un rapide coup de fil de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Kar'Amazonie",
        "email": "contact@kar-amazonie-location.com",
        "territory": "Guyane (Cayenne)",
        "source": "https://kar-amazonie-location.com",
        "subject": "Vos défis de loueur automobile à Cayenne / Kar'Amazonie",
        "body": """Bonjour,

Félicitations pour le développement de Kar'Amazonie sur la route de Montabo à Cayenne pour offrir une gamme adaptée aux routes de Guyane.

Chez Domtom Connect, nous travaillons avec les dirigeants ultramarins sur leurs problématiques d'organisation, de maîtrise des charges et d'approvisionnement en pièces.

Quel est aujourd'hui le sujet qui mobilise le plus votre énergie dans votre entreprise ?

Nous animons également un groupe WhatsApp de décideurs et proposons l'application DTC Pulse pour partager de l'entraide concrète et des solutions terrain.

Pourrions-nous caler un court appel de dix minutes selon votre planning ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Sabi Aliba",
        "email": "sabialiba@gmail.com",
        "territory": "Guyane (Saint-Laurent-du-Maroni)",
        "source": "https://voyage-maroni-sabialiba.fr",
        "subject": "Échange sur la mobilité dans l'Ouest Guyanais / Sabi Aliba",
        "body": """Bonjour,

Je salue votre engagement avec Sabi Aliba à Saint-Laurent-du-Maroni pour assurer une offre de transport et de location indispensable dans l'Ouest guyanais.

Chez Domtom Connect, nous soutenons les acteurs économiques dans la consolidation de leurs activités face aux défis d'éloignement et de logistique.

Quels sont les besoins essentiels auxquels vous devez faire face pour maintenir et développer votre parc ?

Par ailleurs, notre réseau WhatsApp et l'application mobile DTC Pulse permettent de connecter les entrepreneurs des territoires d'Outre-mer et d'Afrique.

Seriez-vous ouvert à un échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "TPLM Location",
        "email": "ent.tplm@gmail.com",
        "territory": "Guyane (Maripasoula)",
        "source": "Annuaire professionnel vérifié Guyane",
        "subject": "Vos priorités de transport et mobilité / TPLM Location",
        "body": """Bonjour,

Bravo pour votre travail avec TPLM Location à Maripasoula pour assurer la disponibilité de véhicules dans des conditions territoriales exigeantes.

Chez Domtom Connect, notre mission est d'épauler les entrepreneurs situés au cœur de nos territoires dans la résolution de leurs contraintes de pièces et de logistique.

Quelles sont aujourd'hui les problématiques les plus critiques pour la pérennité de votre activité ?

Nous rassemblons également des dirigeants au sein d'un groupe d'entraide WhatsApp et sur l'application DTC Pulse afin de mutualiser compétences et contacts.

Pourrions-nous convenir d'un court échange téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # =========================================================================
    # LA RÉUNION (8 CIBLES)
    # =========================================================================
    {
        "company": "Nouloutou",
        "email": "contact@nouloutou.com",
        "territory": "La Réunion",
        "source": "https://nouloutou.com",
        "subject": "Échange sur votre modèle de mobilité partagée / Nouloutou",
        "body": """Bonjour,

Je salue le parcours remarquable de Nouloutou à La Réunion pour démocratiser la location et l'autopartage de véhicules.

Chez Domtom Connect, nous accompagnons les entreprises ultramarines innovantes dans leur passage à l'échelle, leur gestion opérationnelle et leurs partenariats.

Dans votre phase actuelle de développement, quels sont les défis les plus stimulants ou complexes que vous rencontrez ?

Nous animons par ailleurs une communauté d'entraide sur WhatsApp et l'application mobile DTC Pulse afin de créer des passerelles entre l'Océan Indien, les Caraïbes et l'Afrique.

Seriez-vous partant pour un court échange de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Fly Location Réunion",
        "email": "fly.locationreunion@gmail.com",
        "territory": "La Réunion (La Possession)",
        "source": "https://flylocationreunion.com",
        "subject": "Vos enjeux de gestion de flotte à La Possession / Fly Location Réunion",
        "body": """Bonjour,

Bravo pour l'activité de Fly Location Réunion à La Possession pour proposer des véhicules fiables aux Réunionnais et aux vacanciers.

Chez Domtom Connect, nous épaulons les loueurs indépendants sur leurs problématiques d'approvisionnement en pièces, de coûts d'assurance et d'acquisition client.

Quel est aujourd'hui l'enjeu opérationnel qui sollicite le plus votre temps dans la gestion de votre entreprise ?

Nous fédérons aussi des dirigeants au sein d'un groupe WhatsApp et via notre application mobile DTC Pulse pour partager des solutions concrètes entre nos territoires insulaires.

Pourrions-nous convenir d'un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Car'Ent",
        "email": "contact@car-rent.re",
        "territory": "La Réunion",
        "source": "https://car-rent.re",
        "subject": "Échange sur votre activité de location de voitures / Car'Ent",
        "body": """Bonjour,

Je découvre le positionnement de Car'Ent à La Réunion pour offrir une solution de déplacement pratique et soignée.

Chez Domtom Connect, notre mission est d'accompagner les acteurs économiques locaux dans la maîtrise de leurs coûts d'exploitation et la sécurisation de leur modèle.

Quels sont les freins ou les points d'appui que vous observez dans votre quotidien professionnel ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application DTC Pulse pour permettre aux chefs d'entreprise de partager expériences et contacts utiles.

Seriez-vous disponible pour un court entretien téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "ML CAR Location",
        "email": "mlcarlocreunion@gmail.com",
        "territory": "La Réunion (Sainte-Marie)",
        "source": "https://mlcarlocation.re",
        "subject": "Vos priorités d'exploitation automobile / ML CAR Location",
        "body": """Bonjour,

Félicitations pour le service proposé par ML CAR Location à Sainte-Marie pour faciliter les déplacements sur toute l'île de La Réunion.

Chez Domtom Connect, nous aidons les dirigeants d'entreprises locales à surmonter leurs problématiques de trésorerie, de maintenance et d'organisation logistique.

Quel est le domaine qui demande le plus d'énergie dans la gestion de votre flotte actuellement ?

Nous rassemblons également des entrepreneurs dans un groupe WhatsApp dédié et via l'application DTC Pulse pour créer des coopérations économiques fortes.

Pourrions-nous caler un appel rapide de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "AH Location",
        "email": "ah.location974@gmail.com",
        "territory": "La Réunion (Sainte-Clotilde)",
        "source": "https://ah-location.re",
        "subject": "Échange sur le développement de votre parc / AH Location",
        "body": """Bonjour,

Je salue la présence d'AH Location à Sainte-Clotilde et vos différents points de service pour la location automobile à La Réunion.

Chez Domtom Connect, nous accompagnons les chefs d'entreprise ultramarins dans la recherche d'efficacité opérationnelle et la gestion des risques du marché insulaire.

Dans votre quotidien, quels sont vos axes prioritaires de travail en ce moment ?

Nous animons par ailleurs une communauté WhatsApp active et l'application mobile DTC Pulse afin d'encourager la solidarité entre gérants de sociétés.

Seriez-vous ouvert à un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Ethan Service Location",
        "email": "ethanservicelocation@gmail.com",
        "territory": "La Réunion (Les Trois-Bassins)",
        "source": "https://ethanservicelocation.re",
        "subject": "Vos besoins de loueur aux Trois-Bassins / Ethan Service Location",
        "body": """Bonjour,

Bravo pour l'initiative d'Ethan Service Location aux Trois-Bassins pour proposer un service de proximité sur l'île de La Réunion.

Chez Domtom Connect, notre vocation est d'apporter un soutien stratégique et opérationnel aux entrepreneurs indépendants face à leurs défis quotidiens.

Quels sont aujourd'hui les défis les plus prenants dans la gestion et le suivi de vos véhicules ?

Nous proposons aussi un groupe d'entraide WhatsApp et l'application DTC Pulse pour connecter les porteurs de projets et échanger des solutions concrètes.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "JulAutos",
        "email": "julautos974@gmail.com",
        "territory": "La Réunion",
        "source": "https://julautos.fr",
        "subject": "Échange sur la gestion de votre flotte / JulAutos",
        "body": """Bonjour,

Je découvre le travail de JulAutos pour assurer la location et la disponibilité de véhicules à La Réunion.

Chez Domtom Connect, nous accompagnons les dirigeants de structures locales pour les aider à optimiser leurs charges, structurer leurs opérations et fidéliser leur clientèle.

Sur quel aspect de votre entreprise aimeriez-vous apporter des améliorations rapides ?

Par ailleurs, nous animons un groupe d'entraide WhatsApp couplé à notre application DTC Pulse pour renforcer les liens d'affaires entre nos régions et la diaspora.

Pourrions-nous convenir d'un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Location Carrée",
        "email": "location.carree@gmail.com",
        "territory": "La Réunion",
        "source": "https://location-carree.com",
        "subject": "Vos priorités d'activité de location / Location Carrée",
        "body": """Bonjour,

Félicitations pour l'offre développée par Location Carrée pour satisfaire les usagers en recherche de véhicules fiables à La Réunion.

Chez Domtom Connect, nous épaulons les professionnels ultramarins face aux contraintes du marché (coût des révisions, rotation du parc et gestion commerciale).

Quel est le sujet qui mobilise le plus votre attention en ce moment dans votre société ?

Nous fédérons également des chefs d'entreprise au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour s'entraider sur les problématiques de gestion.

Seriez-vous partant pour un échange téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # =========================================================================
    # AFRIQUE - SÉNÉGAL & CÔTE D'IVOIRE (6 CIBLES)
    # =========================================================================
    {
        "company": "Autowou Sénégal",
        "email": "contact.autowou@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "https://autowou.com",
        "subject": "Échange sur votre plateforme de mobilité / Autowou",
        "body": """Bonjour,

Je découvre avec grand intérêt la plateforme Autowou à Dakar et votre démarche pour connecter efficacement les voyageurs aux loueurs locaux de véhicules au Sénégal.

Chez Domtom Connect, nous accompagnons les entreprises et projets novateurs dans le développement de leur écosystème, l'optimisation de leurs processus et leurs partenariats.

Dans votre phase actuelle d'expansion, quels sont vos principaux enjeux opérationnels ou logistiques ?

Notre vision est de bâtir un pont solide reliant les entrepreneurs du continent africain, des Caraïbes et de la diaspora. Nous animons un groupe WhatsApp d'entraide et l'application DTC Pulse pour échanger des contacts et bâtir des synergies directes.

Seriez-vous ouvert à un court appel de dix minutes cette semaine pour échanger sur vos priorités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "KAMA Automobile",
        "email": "kamaautomobile1@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "https://kamaautomobile.sn",
        "subject": "Vos enjeux de gestion de flotte à Dakar / KAMA Automobile",
        "body": """Bonjour,

Bravo pour l'activité de KAMA Automobile au Point E à Dakar dans le domaine de la location et de la vente de véhicules.

Chez Domtom Connect, nous accompagnons les entrepreneurs et gérants de flottes pour les aider à sécuriser leurs opérations, gérer l'entretien de leurs parcs et créer de nouveaux partenariats.

Dans le marché dakarois aujourd'hui, quels sont les défis les plus marquants pour votre structure ?

Par ailleurs, nous rassemblons des dirigeants au sein d'un groupe WhatsApp d'entraide et via notre application mobile DTC Pulse pour rapprocher les acteurs économiques d'Afrique et des Caraïbes.

Pourrions-nous caler un rapide échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Diallo Logistique Auto",
        "email": "btp.diallo@gmail.com",
        "territory": "Sénégal",
        "source": "https://diallobtp.com",
        "subject": "Échange sur votre flotte de véhicules / Diallo Logistique",
        "body": """Bonjour,

Je salue le déploiement de vos services de logistique et de location de véhicules avec Diallo BTP Logistique pour répondre aux besoins des entreprises et particuliers au Sénégal.

Chez Domtom Connect, nous soutenons les dirigeants dans l'optimisation de leur parc, la gestion de maintenance et le développement de partenariats commerciaux.

Quelles sont vos priorités actuelles dans le suivi et l'exploitation de votre flotte ?

Nous animons aussi un groupe WhatsApp de chefs d'entreprise et proposons l'application DTC Pulse afin de créer des passerelles entre l'Afrique de l'Ouest, les Caraïbes et la diaspora.

Seriez-vous disponible pour un court appel de dix minutes pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SMD Express Sénégal",
        "email": "contact@smdexpresssarl.com",
        "territory": "Sénégal (Dakar)",
        "source": "https://smdexpresssarl.com",
        "subject": "Vos perspectives de transport et location / SMD Express",
        "body": """Bonjour,

Félicitations pour l'offre de location de véhicules et de transport mise en place par SMD Sénégal à Dakar.

Chez Domtom Connect, notre mission est d'accompagner les entrepreneurs sur leurs défis de gestion, de logistique de pièces et de structuration financière.

Sur quel aspect de votre organisation ressentez-vous le plus fort besoin d'appui actuellement ?

Nous fédérons également des chefs d'entreprise à travers un groupe WhatsApp d'entraide et notre application mobile DTC Pulse pour faciliter le partage d'opportunités d'affaires.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CKF Motors",
        "email": "ckf.motors@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://ckfmotors.ci",
        "subject": "Échange sur votre parc automobile à Abidjan / CKF Motors",
        "body": """Bonjour,

Je découvre le travail de CKF Motors à Cocody Djorobité pour proposer une offre moderne de location automobile à Abidjan.

Chez Domtom Connect, nous accompagnons les gérants de structures face à leurs enjeux de rentabilité de flotte, de suivi d'entretien et de fidélisation de clientèle.

Dans votre contexte d'activité actuel, quel est le défi opérationnel qui vous demande le plus d'attention ?

Par ailleurs, nous développons un réseau fort reliant le continent africain, les Caraïbes et la diaspora à travers un groupe d'entraide WhatsApp et notre application mobile DTC Pulse.

Seriez-vous partant pour un court appel de dix minutes cette semaine pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "LVCI Location Voitures",
        "email": "abidjancarrental@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://location-voitures.ci",
        "subject": "Vos priorités de loueur automobile / LVCI Abidjan",
        "body": """Bonjour,

Bravo pour le développement des services de LVCI à Abidjan pour faciliter la location de véhicules de courte et longue durée.

Chez Domtom Connect, nous sommes aux côtés des professionnels pour les aider à relever leurs défis d'exploitation, de sécurisation des contrats et d'organisation logistique.

Quels sont aujourd'hui les leviers prioritaires que vous cherchez à renforcer dans votre entreprise ?

Nous animons également un groupe d'entraide WhatsApp et l'application mobile DTC Pulse afin de connecter les entrepreneurs d'Afrique et d'Outre-mer autour de projets concrets.

Pourrions-nous caler un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

if __name__ == "__main__":
    print(f"=== VÉRIFICATION DU BATCH 54 (LOCATION DE VOITURE & VÉHICULES) : {len(LEADS)} CIBLES ===")
    errors = 0
    for idx, lead in enumerate(LEADS, 1):
        # 1. Deux-points
        if ":" in lead["subject"]:
            print(f"[{idx:02d}] ERREUR : Deux-points dans le sujet pour {lead['company']}")
            errors += 1
        if ":" in lead["body"]:
            print(f"[{idx:02d}] ERREUR : Deux-points dans le corps pour {lead['company']}")
            errors += 1
        
        # 2. DNS/MX
        ok, msg = verify_email_target(lead["email"])
        if not ok:
            print(f"[{idx:02d}] ERREUR MX : {lead['company']} ({lead['email']}) -> {msg}")
            errors += 1
            
        # 3. Dedup
        dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
        if dup:
            print(f"[{idx:02d}] ERREUR DUP : {lead['company']} ({lead['email']}) -> {reason}")
            errors += 1
            
        if not (":" in lead["subject"] or ":" in lead["body"]) and ok and not dup:
            print(f"[{idx:02d}] VALIDE - {lead['company']} ({lead['email']}) [{lead['territory']}]")
            
    print(f"\nBilan : {len(LEADS) - errors} / {len(LEADS)} cibles parfaitement valides.")
    if errors == 0:
        print("TOUS LES CRITÈRES SONT PARFAITEMENT RESPECTÉS (Zéro colon, MX valide, Zéro doublon).")
