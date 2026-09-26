import json, sys, os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

# 50 CIBLES ULTRA-QUALIFIÉES - BATCH 55 (VAGUE 1 / 4)
# Secteur : Location de Voiture & Mobilité Indépendante
# Répartition : 13 Guadeloupe + 7 Martinique + 7 Îles du Nord + 2 Guyane + 7 Réunion/Mayotte + 14 Afrique (Sénégal, Côte d'Ivoire, Bénin, Cameroun, Madagascar)
LEADS = [
    # --- GUADELOUPE (13) ---
    {
        "company": "Gagli Autos",
        "email": "gagliservicesplus@gmail.com",
        "territory": "Guadeloupe (Sainte-Anne)",
        "source": "https://gagliautos-guadeloupe.fr",
        "subject": "Échange sur vos besoins de gestion de parc / Gagli Autos",
        "body": """Bonjour,

Je salue l'activité de Gagli Autos à Sainte-Anne pour proposer une solution de transport fiable et soignée en Guadeloupe.

Chez Domtom Connect, nous accompagnons les entrepreneurs locaux pour les aider à relever leurs défis quotidiens de rentabilité, de pièces détachées et d'organisation logistique.

Quels sont aujourd'hui vos principaux besoins ou les sujets qui vous demandent le plus de vigilance dans votre activité ?

Nous animons par ailleurs un groupe WhatsApp fédérant des dirigeants ultramarins et africains autour de notre application DTC Pulse pour partager solutions et opportunités.

Seriez-vous ouvert à un rapide échange de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Antilles Autoloc Shuttle",
        "email": "aasv.gwada@gmail.com",
        "territory": "Guadeloupe (Deshaies)",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Vos priorités d'exploitation et navettes à Deshaies / Antilles Autoloc",
        "body": """Bonjour,

Bravo pour le service combiné de location et navettes que vous assurez avec Antilles Autoloc Shuttle sur le secteur de Deshaies en Guadeloupe.

Chez Domtom Connect, nous soutenons les acteurs de la mobilité insulaire face aux variations saisonnières et aux contraintes d'approvisionnement.

Dans votre fonctionnement, quel est le défi opérationnel qui vous mobilise le plus actuellement ?

Par ailleurs, nous connectons des chefs d'entreprise via un groupe WhatsApp d'entraide et notre application DTC Pulse pour mutualiser nos réseaux.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "IlikoCar Guadeloupe",
        "email": "ilikocargp@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://ilikocar.com",
        "subject": "Échange autour de votre plateforme de mobilité / IlikoCar",
        "body": """Bonjour,

Je découvre le développement de la plateforme IlikoCar en Guadeloupe pour connecter les besoins de déplacement et les véhicules disponibles.

Chez Domtom Connect, nous accompagnons les projets innovants dans la structuration de leurs opérations et l'élargissement de leurs partenariats.

Dans votre dynamique actuelle, quels sont les leviers prioritaires sur lesquels vous concentrez vos efforts ?

Nous rassemblons également des entrepreneurs dans un groupe d'entraide WhatsApp et sur l'application DTC Pulse reliant les Caraïbes, l'Afrique et la diaspora.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Gualoc",
        "email": "contact@gualoc.fr",
        "territory": "Guadeloupe (Sainte-Anne)",
        "source": "https://gualoc.com",
        "subject": "Vos enjeux de loueur indépendant à Sainte-Anne / Gualoc",
        "body": """Bonjour,

Félicitations pour l'activité de Gualoc à Sainte-Anne pour offrir une solution de location de proximité aux usagers de Guadeloupe.

Chez Domtom Connect, nous aidons les dirigeants d'entreprises locales à franchir des paliers de croissance et à surmonter les aléas logistiques insulaires.

Sur quel aspect de votre organisation ressentez-vous le plus fort besoin d'appui en ce moment ?

Nous animons par ailleurs une communauté WhatsApp active et l'application mobile DTC Pulse afin d'encourager la solidarité entre gérants de structures.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Le Loueur 971",
        "email": "leloueur971@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://leloueur971.fr",
        "subject": "Échange sur la gestion de votre flotte / Le Loueur 971",
        "body": """Bonjour,

Je découvre votre offre avec Le Loueur 971 pour faciliter les déplacements des résidents et visiteurs en Guadeloupe.

Chez Domtom Connect, notre rôle est d'épauler les gérants face aux contraintes du marché insulaire (coûts d'assurance, entretien de flotte et préservation des marges).

Quel est aujourd'hui le point le plus délicat à gérer dans votre quotidien de loueur ?

Notre réseau rassemble des chefs d'entreprise via un groupe WhatsApp et l'application DTC Pulse pour échanger concrètement sur les défis du terrain.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Bel' Ile Location",
        "email": "belilelocation@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://belilelocation.fr",
        "subject": "Vos priorités d'activité automobile / Bel' Ile Location",
        "body": """Bonjour,

Bravo pour l'engagement de Bel' Ile Location à répondre avec réactivité aux besoins de déplacement en Guadeloupe.

Chez Domtom Connect, nous accompagnons les professionnels de nos îles dans l'optimisation de leurs processus, la gestion de leur parc et la recherche de synergies.

Quelles sont vos priorités actuelles dans le pilotage de votre entreprise de location ?

Nous facilitons également la mise en réseau des dirigeants via un groupe WhatsApp d'entraide et l'application DTC Pulse pour créer des opportunités économiques directes.

Seriez-vous disponible pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "DJACAR Location",
        "email": "djacarlocation@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://djacarlocation.fr",
        "subject": "Échange sur votre développement de flotte / DJACAR Location",
        "body": """Bonjour,

Je salue le dynamisme de DJACAR Location pour assurer un service de location de véhicules accessible et pratique en Guadeloupe.

Chez Domtom Connect, nous apportons un regard stratégique et un accompagnement opérationnel aux entrepreneurs locaux pour consolider leur modèle économique.

Dans votre exploitation, quel est le domaine qui demande le plus d'énergie actuellement ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application DTC Pulse pour connecter nos territoires ultramarins et l'Afrique.

Pourrions-nous caler un rapide échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Hibis Cars",
        "email": "hibiscars971@gmail.com",
        "territory": "Guadeloupe",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Vos besoins d'exploitation automobile / Hibis Cars",
        "body": """Bonjour,

Félicitations pour votre présence avec Hibis Cars pour accompagner la mobilité des usagers et touristes en Guadeloupe.

Chez Domtom Connect, nous accompagnons les structures indépendantes dans la pérennisation de leur activité et l'anticipation des variations de fréquentation.

Quels sont les besoins majeurs qui occupent votre esprit d'entrepreneur en ce moment ?

Nous réunissons également des dirigeants au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour s'entraider concrètement sur la gestion d'entreprise.

Seriez-vous ouvert à un bref appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Platinium Cars Antilles",
        "email": "steeve.varieux@gmail.com",
        "territory": "Guadeloupe (Lamentin)",
        "source": "Annuaire professionnel vérifié Guadeloupe",
        "subject": "Échange sur votre activité de mobilité / Platinium Cars Antilles",
        "body": """Bonjour,

Je découvre l'activité de Platinium Cars Antilles au Lamentin pour répondre aux besoins de location de véhicules en Guadeloupe.

Chez Domtom Connect, notre mission est d'apporter un soutien concret aux entrepreneurs dans la gestion de leurs contraintes locales et insulaires.

Dans votre quotidien professionnel, quel est le défi majeur auquel vous faites face actuellement ?

Nous avons également mis en place un réseau d'entraide sur WhatsApp et l'application DTC Pulse pour connecter nos territoires et la diaspora.

Auriez-vous dix minutes à m'accorder par téléphone ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Heliconia Location",
        "email": "heliconialocation@gmail.com",
        "territory": "Guadeloupe (Les Abymes)",
        "source": "https://heliconialocation.fr",
        "subject": "Vos priorités de loueur aux Abymes / Heliconia Location",
        "body": """Bonjour,

Bravo pour l'offre de location proposée par Heliconia Location aux Abymes pour garantir des véhicules fiables sur les routes de Guadeloupe.

Chez Domtom Connect, nous sommes aux côtés des professionnels pour les aider à relever leurs défis d'exploitation, de sécurisation de parc et de logistique.

Quel est aujourd'hui votre défi numéro un dans la gestion de votre flotte automobile ?

Par ailleurs, nous animons un groupe d'entraide WhatsApp et l'application DTC Pulse réunissant des dirigeants des Caraïbes et d'Afrique.

Pourrions-nous convenir d'un court appel de dix minutes selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Terre de Haut Location",
        "email": "terredehautlocation@gmail.com",
        "territory": "Guadeloupe (Les Saintes)",
        "source": "https://terredehautlocation.com",
        "subject": "Échange sur la mobilité insulaire aux Saintes / Terre de Haut Location",
        "body": """Bonjour,

Je salue le rôle essentiel de Terre de Haut Location aux Saintes pour faciliter la découverte et les déplacements sur l'île.

Chez Domtom Connect, nous connaissons bien les spécificités des territoires insulaires isolés (logistique des pièces, acheminement et forte saisonnalité).

Quelles sont les difficultés ou les opportunités prioritaires sur lesquelles vous travaillez actuellement ?

Nous rassemblons également des professionnels au sein d'un groupe WhatsApp et via l'application DTC Pulse pour bâtir un écosystème d'entraide solidaire.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Marie-Galante Online Loc",
        "email": "mariegalanteonline@gmail.com",
        "territory": "Guadeloupe (Marie-Galante)",
        "source": "https://mariegalanteonline.com",
        "subject": "Vos enjeux de location de véhicules à Marie-Galante / Marie-Galante Online",
        "body": """Bonjour,

Félicitations pour vos services de location de voitures et de transport dédiés à Marie-Galante avec Marie-Galante Online.

Chez Domtom Connect, nous accompagnons les entrepreneurs ultramarins dans la préservation de leurs marges et la gestion de leurs contraintes d'insularité double.

Dans votre exploitation, quel est le sujet le plus complexe à gérer actuellement ?

Nous animons aussi une communauté de gérants d'entreprises sur WhatsApp et l'application DTC Pulse pour échanger des solutions éprouvées.

Seriez-vous disponible pour un rapide point de dix minutes par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Lagon Travel",
        "email": "lagon.travel.caraibes@gmail.com",
        "territory": "Guadeloupe (Marie-Galante)",
        "source": "https://lagon-travel.com",
        "subject": "Échange sur la mobilité et les séjours / Lagon Travel",
        "body": """Bonjour,

Bravo pour l'engagement de Lagon Travel à Marie-Galante pour combiner location de véhicules et accueil des visiteurs dans les meilleures conditions.

Chez Domtom Connect, notre mission est d'épauler les gérants dans la résolution de leurs défis logistiques, financiers et organisationnels.

Quels sont aujourd'hui vos principaux axes de développement ou les points qui sollicitent le plus votre vigilance ?

Nous fédérons aussi des porteurs de projets dans un groupe WhatsApp dédié et via l'application DTC Pulse pour stimuler l'entraide économique.

Pourrions-nous caler un rapide point de dix minutes au téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- MARTINIQUE (7) ---
    {
        "company": "Louiseloc Martinique",
        "email": "louiseloc972@gmail.com",
        "territory": "Martinique (Trois-Îlets)",
        "source": "https://louiseloc.fr",
        "subject": "Vos priorités d'exploitation aux Trois-Îlets / Louiseloc",
        "body": """Bonjour,

Je découvre le service de location automobile de Louiseloc aux Trois-Îlets pour répondre aux attentes des vacanciers et résidents en Martinique.

Chez Domtom Connect, nous accompagnons les loueurs indépendants face aux variations saisonnières et aux contraintes insulaires d'approvisionnement.

Dans votre activité, quels sont les sujets qui requièrent le plus d'énergie en ce moment ?

Par ailleurs, nous connectons des chefs d'entreprise via un groupe WhatsApp et notre application mobile DTC Pulse pour créer un réseau solidaire reliant les Caraïbes et l'Afrique.

Auriez-vous dix minutes pour un rapide coup de fil cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Melaclem Location",
        "email": "melaclem972@gmail.com",
        "territory": "Martinique",
        "source": "https://melaclem.com",
        "subject": "Échange sur la gestion de votre flotte / Melaclem Location",
        "body": """Bonjour,

Bravo pour votre présence avec Melaclem Location pour fournir une formule de mobilité pratique et fiable en Martinique.

Chez Domtom Connect, notre rôle est d'épauler les dirigeants ultramarins sur leurs problématiques d'organisation, d'optimisation financière et de visibilité directe.

Quels sont les points d'amélioration ou les besoins clés que vous identifiez dans votre quotidien de loueur ?

Nous animons aussi un réseau de décideurs via un groupe WhatsApp et l'application DTC Pulse pour échanger des opportunités et mutualiser nos forces.

Seriez-vous ouvert à un court appel de dix minutes cette semaine selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "R.CAR Martinique",
        "email": "rcars.martinique@gmail.com",
        "territory": "Martinique",
        "source": "https://location-voituremartinique.com",
        "subject": "Échange autour de vos besoins d'exploitation / R.CAR Martinique",
        "body": """Bonjour,

Je salue l'activité de R.CAR Martinique pour proposer des véhicules adaptés aux demandes de déplacement sur l'île.

Chez Domtom Connect, nous aidons les gérants d'entreprises locales à structurer leurs opérations, maîtriser leurs charges d'entretien et fidéliser leur clientèle.

Sur quel aspect de votre organisation aimeriez-vous apporter des améliorations rapides ?

Nous réunissons également des professionnels au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour partager de l'expérience et des solutions adaptées.

Pourrions-nous convenir d'un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "2LM Location",
        "email": "location.2lm@gmail.com",
        "territory": "Martinique",
        "source": "https://2lm-location.com",
        "subject": "Vos enjeux de loueur indépendant / 2LM Location",
        "body": """Bonjour,

Félicitations pour le développement de 2LM Location au service des résidents et des visiteurs de Martinique.

Chez Domtom Connect, nous soutenons les dirigeants dans l'anticipation des creux d'activité et la recherche d'efficacité logistique.

Quel est aujourd'hui l'enjeu opérationnel qui sollicite le plus votre temps dans la gestion de votre entreprise ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp couplé à notre application mobile DTC Pulse pour renforcer les liens d'affaires entre nos régions et la diaspora.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SN'D Location",
        "email": "sarlsndloc@gmail.com",
        "territory": "Martinique",
        "source": "https://sndloc.com",
        "subject": "Échange sur votre parc automobile / SN'D Location",
        "body": """Bonjour,

Je découvre le travail de SN'D Location pour proposer des solutions de location automobile souples et accessibles en Martinique.

Chez Domtom Connect, notre mission est d'accompagner les acteurs économiques locaux dans la maîtrise de leurs coûts d'exploitation et la sécurisation de leur modèle.

Quels sont les freins ou les points d'appui que vous observez dans votre quotidien professionnel ?

Nous facilitons par ailleurs les synergies d'affaires via un groupe WhatsApp d'entraide et l'application DTC Pulse reliant les Caraïbes, l'Afrique et la diaspora.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Luxiane Car",
        "email": "contact@luxianecar.com",
        "territory": "Martinique",
        "source": "https://luxianecar.com",
        "subject": "Vos perspectives de flotte et développement / Luxiane Car",
        "body": """Bonjour,

Bravo pour l'offre développée par Luxiane Car pour proposer des véhicules modernes et bien entretenus en Martinique.

Chez Domtom Connect, nous accompagnons les professionnels dans l'optimisation de leur parc, la gestion de maintenance et le développement de partenariats commerciaux.

Dans votre modèle actuel, quels sont les défis les plus stratégiques face aux réalités insulaires ?

Nous animons par ailleurs une communauté d'entraide sur WhatsApp et l'application mobile DTC Pulse afin de créer des passerelles entre nos territoires.

Pourrions-nous caler un rapide échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Planète Location",
        "email": "planetelocation@gmail.com",
        "territory": "Martinique (La Trinité)",
        "source": "https://planetelocation.com",
        "subject": "Échange sur votre activité à La Trinité / Planète Location",
        "body": """Bonjour,

Je salue l'implantation de Planète Location à La Trinité pour apporter une offre de mobilité de proximité sur la côte Atlantique de Martinique.

Chez Domtom Connect, nous accompagnons les dirigeants ultramarins sur leurs problématiques d'organisation, de maîtrise des charges et d'approvisionnement en pièces.

Quel est aujourd'hui le sujet qui mobilise le plus votre énergie dans votre entreprise ?

Nous animons également un groupe WhatsApp de décideurs et proposons l'application DTC Pulse pour partager de l'entraide concrète et des solutions terrain.

Seriez-vous disponible pour un court entretien de dix minutes par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- ÎLES DU NORD - SAINT-BARTH & SAINT-MARTIN (7) ---
    {
        "company": "Gumbs Car Rental",
        "email": "contact@gumbs-car-rental.com",
        "territory": "Saint-Barthélemy (Aéroport Rémy de Haenen)",
        "source": "https://gumbs-car-rental.com",
        "subject": "Échange sur la gestion de flotte à Saint-Barth / Gumbs Car Rental",
        "body": """Bonjour,

Je salue la présence reconnue de Gumbs Car Rental à l'aéroport de Saint-Barthélemy pour assurer un service automobile de premier ordre.

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
        "company": "Beranger Rental",
        "email": "beranger.rentalcarsbh@gmail.com",
        "territory": "Saint-Barthélemy (Gustavia)",
        "source": "https://beranger-rental.com",
        "subject": "Vos priorités d'exploitation à Gustavia / Beranger Rental",
        "body": """Bonjour,

Bravo pour l'activité de Beranger Rental à Gustavia pour répondre aux exigences des visiteurs et résidents de Saint-Barthélemy.

Chez Domtom Connect, nous aidons les professionnels locaux à sécuriser leurs opérations et à optimiser leur rentabilité face aux réalités insulaires.

Quel est le point qui mobilise le plus votre attention en ce moment dans votre société ?

Nous animons aussi un réseau de décideurs via un groupe WhatsApp et l'application DTC Pulse pour échanger des opportunités et mutualiser nos forces.

Pourrions-nous convenir d'un bref point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "EZ Loc St-Barth",
        "email": "ezlocstbarth@gmail.com",
        "territory": "Saint-Barthélemy (Saline)",
        "source": "Annuaire professionnel vérifié Saint-Barth",
        "subject": "Échange sur votre activité de mobilité / EZ Loc St-Barth",
        "body": """Bonjour,

Je découvre l'activité d'EZ Loc à Saline pour offrir une solution de transport réactive à Saint-Barthélemy.

Chez Domtom Connect, nous accompagnons les structures indépendantes sur leurs problématiques d'entretien de flotte, d'import de matériel et de gestion de trésorerie.

Dans votre fonctionnement régulier, quel est le domaine qui demande le plus d'énergie actuellement ?

Nous rassemblons également des entrepreneurs dans un groupe d'entraide WhatsApp et sur l'application mobile DTC Pulse pour partager contacts et solutions pragmatiques.

Seriez-vous ouvert à un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Travel Rent a Car SXM",
        "email": "hello@travel-sxm.com",
        "territory": "Saint-Martin",
        "source": "https://travel-sxm.com",
        "subject": "Échange sur la mobilité à Saint-Martin / Travel Rent a Car",
        "body": """Bonjour,

Félicitations pour l'offre développée par Travel Rent a Car pour simplifier la location de véhicules sur l'île de Saint-Martin.

Chez Domtom Connect, notre mission est d'épauler les chefs d'entreprise dans la résolution de leurs défis logistiques, financiers et organisationnels.

Dans votre quotidien de loueur sur l'île, quel est le sujet le plus complexe à gérer actuellement ?

Nous animons aussi une communauté de dirigeants sur WhatsApp et l'application DTC Pulse pour créer des synergies économiques fortes.

Pourrions-nous caler un rapide point de dix minutes au téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Exclusive Car Rental Ryan",
        "email": "ryancarssxm@gmail.com",
        "territory": "Saint-Martin",
        "source": "Annuaire professionnel vérifié Saint-Martin",
        "subject": "Vos priorités de parc automobile / Exclusive Car Rental SXM",
        "body": """Bonjour,

Je découvre votre engagement avec Exclusive Car Rental pour proposer des véhicules adaptés aux visiteurs et résidents de Saint-Martin.

Chez Domtom Connect, nous apportons un regard stratégique et un accompagnement opérationnel aux entrepreneurs locaux pour consolider leur modèle économique.

Quelles sont vos priorités actuelles dans le pilotage de votre flotte ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application mobile DTC Pulse pour bâtir un écosystème solidaire reliant les Caraïbes et l'Afrique.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Value Car Rental SXM",
        "email": "info@valuecarrental.com",
        "territory": "Saint-Martin",
        "source": "https://valuecarrental.com",
        "subject": "Échange autour de vos enjeux de loueur / Value Car Rental",
        "body": """Bonjour,

Bravo pour le positionnement de Value Car Rental pour offrir un service accessible et de qualité à Saint-Martin.

Chez Domtom Connect, nous accompagnons les professionnels dans l'adaptation de leur organisation aux variations du marché et la recherche de partenaires de confiance.

Dans votre activité, quel est le défi opérationnel qui vous demande le plus de temps et d'énergie ?

Nous réunissons également des gérants de structures au sein d'un groupe WhatsApp et sur notre application DTC Pulse pour partager expériences et opportunités d'affaires.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Paradise Car Rental SXM",
        "email": "rent@paradisesxm.com",
        "territory": "Saint-Martin",
        "source": "https://paradisesxm.com",
        "subject": "Vos perspectives d'activité automobile / Paradise Car Rental",
        "body": """Bonjour,

Je salue la présence de Paradise Car Rental pour faciliter les séjours et déplacements à Saint-Martin.

Chez Domtom Connect, nous aidons les dirigeants locaux à résoudre leurs problématiques courantes de gestion, de logistique de maintenance et d'efficacité financière.

Quel est aujourd'hui l'enjeu principal qui sollicite votre vigilance dans la société ?

Notre réseau rassemble des chefs d'entreprise via un groupe WhatsApp et l'application DTC Pulse afin de créer des passerelles économiques directes.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- GUYANE (2) ---
    {
        "company": "JMB Location Madeleine",
        "email": "jmblocationmadeleine@gmail.com",
        "territory": "Guyane (Cayenne)",
        "source": "https://jmblocation.fr",
        "subject": "Échange sur la gestion de votre flotte à Cayenne / JMB Location",
        "body": """Bonjour,

Bravo pour l'activité de JMB Location à la Madeleine et à l'aéroport Félix Éboué pour répondre aux besoins de mobilité en Guyane.

Chez Domtom Connect, nous accompagnons les entrepreneurs ultramarins face aux contraintes particulières de gestion de parc et d'approvisionnement en pièces.

Quelles sont aujourd'hui vos priorités clés ou les freins que vous rencontrez dans la maintenance et la rotation de vos véhicules ?

Nous facilitons par ailleurs les synergies d'affaires via un groupe WhatsApp d'entraide et l'application DTC Pulse reliant la Guyane, les Antilles et l'Afrique.

Seriez-vous partant pour un rapide coup de fil de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Wedrivus Guyane",
        "email": "locations.wedrivusparticulier@gmail.com",
        "territory": "Guyane",
        "source": "https://wedrivus.com",
        "subject": "Vos perspectives de mobilité partagée en Guyane / Wedrivus",
        "body": """Bonjour,

Je découvre avec beaucoup d'intérêt le modèle d'autopartage et de location développé par Wedrivus en Guyane.

Chez Domtom Connect, nous accompagnons les projets novateurs dans le développement de leur écosystème, l'optimisation de leurs processus et leurs partenariats.

Dans votre phase actuelle d'expansion, quels sont vos principaux enjeux opérationnels ou logistiques ?

Notre vision est de bâtir un pont solide reliant les entrepreneurs des Outre-mer, d'Afrique et de la diaspora via un groupe WhatsApp et l'application mobile DTC Pulse.

Pourrions-nous convenir d'un court échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- LA RÉUNION & MAYOTTE (7) ---
    {
        "company": "RED LOC SHN Auto",
        "email": "shn.auto974@gmail.com",
        "territory": "La Réunion",
        "source": "https://redloc.re",
        "subject": "Échange sur vos besoins d'exploitation automobile / RED LOC",
        "body": """Bonjour,

Félicitations pour le dynamisme de RED LOC à La Réunion pour proposer une formule de location automobile accessible et réactive.

Chez Domtom Connect, nous soutenons les entreprises locales face aux contraintes du marché insulaire (coûts des révisions, rotation du parc et gestion commerciale).

Quel est aujourd'hui le sujet opérationnel qui mobilise le plus votre attention dans votre société ?

Nous fédérons également des chefs d'entreprise au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour s'entraider sur les problématiques de gestion.

Seriez-vous ouvert à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "IJ Location",
        "email": "ijlocation97450@gmail.com",
        "territory": "La Réunion (Saint-Louis)",
        "source": "https://location-voiture-st-louis974.fr",
        "subject": "Vos priorités de loueur à Saint-Louis / IJ Location",
        "body": """Bonjour,

Bravo pour le service offert par IJ Location à Saint-Louis pour faciliter les déplacements sur l'île de La Réunion.

Chez Domtom Connect, notre vocation est d'apporter un soutien stratégique et opérationnel aux entrepreneurs indépendants face à leurs défis quotidiens.

Quels sont aujourd'hui les défis les plus prenants dans la gestion et le suivi de vos véhicules ?

Nous proposons aussi un groupe d'entraide WhatsApp et l'application DTC Pulse pour connecter les dirigeants et échanger des solutions concrètes.

Pourrions-nous caler un rapide échange de dix minutes selon votre planning ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Mik Location Lud",
        "email": "ludlocations@gmail.com",
        "territory": "La Réunion (Saint-Pierre)",
        "source": "https://mik-location.com",
        "subject": "Échange sur la gestion de votre flotte à Saint-Pierre / Mik Location",
        "body": """Bonjour,

Je salue l'activité de Mik Location à Saint-Pierre pour proposer des véhicules soignés et un accompagnement de proximité à La Réunion.

Chez Domtom Connect, nous accompagnons les professionnels dans l'optimisation de leurs processus, la gestion de parc et la recherche de synergies.

Dans votre gestion au quotidien, quelles sont les questions qui vous préoccupent le plus ?

Nous animons par ailleurs une communauté WhatsApp active et proposons l'application DTC Pulse pour encourager les partenariats entre dirigeants d'Outre-mer et d'Afrique.

Seriez-vous disponible pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Car Checking Location",
        "email": "carcheckinglocation974@gmail.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://carcheckinglocation974.com",
        "subject": "Vos enjeux de location dans l'Ouest / Car Checking Location",
        "body": """Bonjour,

Félicitations pour le développement de Car Checking Location à Saint-Gilles-les-Hauts pour répondre à la demande automobile à La Réunion.

Chez Domtom Connect, nous épaulons les loueurs indépendants sur leurs problématiques d'approvisionnement en pièces, de coûts d'assurance et d'acquisition client.

Sur quel aspect de votre organisation aimeriez-vous apporter des améliorations rapides ?

Par ailleurs, nous rassemblons des dirigeants dans un groupe WhatsApp d'entraide et via notre application mobile DTC Pulse pour partager de l'expérience et des solutions adaptées.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CMG Location",
        "email": "cmgrun1@gmail.com",
        "territory": "La Réunion (Saint-Pierre)",
        "source": "Annuaire professionnel vérifié La Réunion",
        "subject": "Échange sur votre activité automobile / CMG Location",
        "body": """Bonjour,

Je découvre votre offre avec CMG Location à Saint-Pierre pour offrir un service de mobilité de proximité sur le sud de La Réunion.

Chez Domtom Connect, nous aidons les dirigeants d'entreprises locales à franchir des paliers de croissance et à surmonter les aléas logistiques insulaires.

Quels sont aujourd'hui vos principaux besoins ou les sujets qui vous demandent le plus d'attention dans votre société ?

Nous facilitons également la mise en réseau des dirigeants via un groupe WhatsApp d'entraide et l'application DTC Pulse pour créer des opportunités économiques directes.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Vahiné Location",
        "email": "vahinelocation@gmail.com",
        "territory": "Mayotte (Mamoudzou)",
        "source": "Annuaire professionnel vérifié Mayotte",
        "subject": "Vos priorités de loueur automobile à Mamoudzou / Vahiné Location",
        "body": """Bonjour,

Je salue le rôle essentiel de Vahiné Location à Mamoudzou pour répondre aux besoins de mobilité indispensables à Mayotte.

Chez Domtom Connect, nous mesurons l'ampleur des contraintes d'approvisionnement en pièces, d'assurance et de gestion de flotte sur le territoire mahorais.

Quel est aujourd'hui le point le plus sensible dans la gestion quotidienne de votre entreprise ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application mobile DTC Pulse afin de connecter les acteurs économiques de Mayotte, des Caraïbes et d'Afrique.

Seriez-vous ouvert à un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Maore V&S",
        "email": "maorevs@gmail.com",
        "territory": "Mayotte",
        "source": "Annuaire professionnel vérifié Mayotte",
        "subject": "Échange sur votre activité de mobilité / Maore V&S",
        "body": """Bonjour,

Bravo pour votre offre de mobilité combinant véhicules et scooters avec Maore V&S au service des usagers de Mayotte.

Chez Domtom Connect, notre mission est de soutenir concrètement les entrepreneurs locaux dans la sécurisation de leur exploitation et l'optimisation de leur parc.

Dans votre activité actuelle, quel est le domaine qui demande le plus d'énergie et de ressources ?

Nous animons aussi un groupe WhatsApp de chefs d'entreprise et proposons l'application DTC Pulse afin de créer des passerelles économiques directes.

Pourrions-nous caler un rapide échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- AFRIQUE (14) ---
    {
        "company": "Kalsane Automobile",
        "email": "kalsaneautomobile@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "Annuaire professionnel vérifié Sénégal",
        "subject": "Vos enjeux de gestion de flotte à Dakar / Kalsane Automobile",
        "body": """Bonjour,

Je salue l'activité de Kalsane Automobile à Dakar dans le domaine de la location de courte et longue durée.

Chez Domtom Connect, nous accompagnons les entrepreneurs et gérants de parcs pour les aider à sécuriser leurs opérations, gérer l'entretien de leurs flottes et créer de nouveaux partenariats.

Dans le marché dakarois aujourd'hui, quels sont les défis les plus marquants pour votre structure ?

Par ailleurs, nous rassemblons des dirigeants au sein d'un groupe WhatsApp d'entraide et via notre application mobile DTC Pulse pour rapprocher les acteurs économiques d'Afrique et des Caraïbes.

Pourrions-nous caler un rapide échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Buggy Evasion",
        "email": "buggyevasion02@gmail.com",
        "territory": "Sénégal (Saly)",
        "source": "https://buggyevasionsenegal.com",
        "subject": "Échange sur la mobilité touristique à Saly / Buggy Evasion",
        "body": """Bonjour,

Bravo pour l'offre de transport et de location développée par Buggy Evasion à Saly pour accompagner la clientèle touristique et professionnelle au Sénégal.

Chez Domtom Connect, nous accompagnons les professionnels dans l'adaptation de leur organisation aux variations du marché et la recherche de partenaires de confiance.

Dans votre exploitation, quels sont les sujets qui requièrent le plus d'attention en ce moment ?

Nous fédérons également des chefs d'entreprise à travers un groupe WhatsApp d'entraide et notre application mobile DTC Pulse pour faciliter le partage d'opportunités d'affaires.

Seriez-vous partant pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Hibiscus Tours",
        "email": "ibiscustours22@gmail.com",
        "territory": "Bénin (Cotonou)",
        "source": "Annuaire professionnel vérifié Bénin",
        "subject": "Vos priorités de location et transport à Cotonou / Hibiscus Tours",
        "body": """Bonjour,

Je découvre l'activité d'Hibiscus Tours à Cotonou pour assurer des services de location de véhicules et de transport sur mesure au Bénin.

Chez Domtom Connect, notre mission est d'épauler les dirigeants d'entreprises locales dans la consolidation de leurs activités et l'optimisation de leurs opérations.

Quel est aujourd'hui le point le plus délicat à gérer dans votre quotidien de loueur ?

Nous animons par ailleurs un réseau WhatsApp et l'application mobile DTC Pulse pour connecter les entrepreneurs du continent africain, des Caraïbes et de la diaspora.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Sion Car Benin",
        "email": "sioncarbenin1@gmail.com",
        "territory": "Bénin (Cotonou)",
        "source": "https://sioncarbenin.com",
        "subject": "Échange sur la gestion de votre flotte / Sion Car Benin",
        "body": """Bonjour,

Félicitations pour le développement de Sion Car Benin à Cotonou pour fournir une solution de mobilité pratique et fiable.

Chez Domtom Connect, nous soutenons les professionnels de la mobilité dans la maîtrise de leurs coûts d'exploitation et le développement de partenariats commerciaux.

Quelles sont vos priorités actuelles dans le pilotage de votre entreprise ?

Nous réunissons également des porteurs de projets et dirigeants dans un groupe WhatsApp d'entraide relié à notre application DTC Pulse.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Auto Ivoire",
        "email": "automobileivoire@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Riviera)",
        "source": "Annuaire professionnel vérifié Côte d'Ivoire",
        "subject": "Vos enjeux de location automobile à Abidjan / Auto Ivoire",
        "body": """Bonjour,

Je salue la présence d'Auto Ivoire à Cocody Riviera 2 pour proposer une large gamme de véhicules au service des particuliers et entreprises à Abidjan.

Chez Domtom Connect, nous accompagnons les gérants de structures face à leurs enjeux de rentabilité de flotte, de suivi d'entretien et de fidélisation de clientèle.

Dans votre contexte d'activité actuel, quel est le défi opérationnel qui vous demande le plus d'attention ?

Par ailleurs, nous développons un réseau fort reliant le continent africain, les Caraïbes et la diaspora à travers un groupe d'entraide WhatsApp et notre application mobile DTC Pulse.

Seriez-vous disponible pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Lux Location Abidjan",
        "email": "office.luxlocation@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "Annuaire professionnel vérifié Côte d'Ivoire",
        "subject": "Échange sur votre flotte de véhicules / Lux Location Abidjan",
        "body": """Bonjour,

Bravo pour l'offre développée par Lux Location à Abidjan pour offrir des prestations automobiles fiables et de qualité.

Chez Domtom Connect, nous travaillons aux côtés des dirigeants d'entreprises pour répondre à leurs questions de développement, de maîtrise des coûts et d'investissements.

Aujourd'hui, quels sont les aspects qui sollicitent le plus vos ressources au quotidien ?

Nous proposons également un réseau WhatsApp et l'application mobile DTC Pulse pour connecter les entrepreneurs de notre région et d'Outre-mer autour de solutions pratiques.

Pourrions-nous caler un rapide échange téléphonique de dix minutes selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CCTH Afrique Évasion",
        "email": "ccthafrique@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://ccthafriqueevasion.com",
        "subject": "Vos perspectives de transport et mobilité / CCTH Afrique Évasion",
        "body": """Bonjour,

Je découvre le service de transport et location de véhicules proposé par CCTH Afrique Évasion à Abidjan.

Chez Domtom Connect, notre mission est d'accompagner les acteurs économiques dans la consolidation de leurs activités face aux défis logistiques et de croissance.

Sur quel aspect de votre organisation ressentez-vous le plus fort besoin d'appui actuellement ?

Nous rassemblons également des décideurs au sein d'un groupe d'entraide WhatsApp et sur l'application DTC Pulse afin de mutualiser compétences et contacts.

Seriez-vous ouvert à un court entretien téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "JMNGA Services",
        "email": "contact.jmnga@gmail.com",
        "territory": "Madagascar (Nosy Be)",
        "source": "https://jmnga-services.com",
        "subject": "Échange sur la mobilité touristique à Nosy Be / JMNGA Services",
        "body": """Bonjour,

Félicitations pour le déploiement de JMNGA Services à Nosy Be pour assurer la disponibilité de véhicules indispensables aux visiteurs et professionnels.

Chez Domtom Connect, nous accompagnons les entrepreneurs locaux face aux spécificités territoriales de gestion de parc et d'approvisionnement en milieu insulaire.

Quelles sont vos priorités clés ou les difficultés que vous rencontrez dans la maintenance et la rotation de vos véhicules ?

Par ailleurs, notre réseau WhatsApp et l'application mobile DTC Pulse permettent de connecter les entrepreneurs des îles de l'Océan Indien, des Caraïbes et d'Afrique.

Seriez-vous partant pour un rapide coup de fil de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Agora Travel Mada",
        "email": "agora.travelmada@gmail.com",
        "territory": "Madagascar",
        "source": "https://agoratravel.fr",
        "subject": "Vos enjeux de transport et logistique / Agora Travel",
        "body": """Bonjour,

Je salue le professionnalisme d'Agora Travel à Madagascar pour proposer des solutions de déplacement et de location avec chauffeur adaptées au terrain.

Chez Domtom Connect, nous accompagnons les dirigeants dans l'optimisation de leur modèle, la gestion des risques et la création de partenariats internationaux.

Quel est aujourd'hui le défi opérationnel qui demande le plus d'énergie dans votre entreprise ?

Nous animons par ailleurs une communauté d'entraide sur WhatsApp et l'application mobile DTC Pulse afin de créer des passerelles entre nos régions.

Pourrions-nous convenir d'un court point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "FWS Location Voitures",
        "email": "fwslocationdevoitures@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire professionnel vérifié Cameroun",
        "subject": "Échange sur votre activité de location à Douala / FWS Location",
        "body": """Bonjour,

Je découvre le travail de FWS Location de Voitures à Douala pour répondre aux besoins de mobilité des professionnels et particuliers au Cameroun.

Chez Domtom Connect, nous accompagnons les gérants d'entreprises locales pour les aider à sécuriser leur trésorerie, maîtriser leurs coûts d'entretien et diversifier leur clientèle.

Quels sont aujourd'hui les défis les plus exigeants dans la gestion de votre flotte ?

Nous animons également un groupe d'entraide WhatsApp et l'application DTC Pulse réunissant des professionnels d'Afrique et des Caraïbes pour partager ressources et solutions.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Rodrigo Auto Services",
        "email": "rodrigoservices39@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire professionnel vérifié Cameroun",
        "subject": "Vos priorités d'exploitation automobile / Rodrigo Auto Services",
        "body": """Bonjour,

Bravo pour l'implantation de Rodrigo Auto Services à Bonamoussadi Douala pour fournir une formule de mobilité pratique et réactive.

Chez Domtom Connect, nous apportons un accompagnement concret aux professionnels confrontés aux problématiques de gestion de flotte, d'assurance et d'entretien.

Dans votre organisation, quel est le défi opérationnel qui vous mobilise le plus actuellement ?

Nous rassemblons également des entrepreneurs dans un groupe d'entraide WhatsApp couplé à l'application mobile DTC Pulse afin de mutualiser contacts et expertises.

Pourrions-nous caler un court appel de dix minutes pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "NyatAuto",
        "email": "nyatauto@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire professionnel vérifié Cameroun",
        "subject": "Échange sur la gestion de votre parc automobile / NyatAuto",
        "body": """Bonjour,

Je découvre le positionnement soigné de NyatAuto à Douala pour proposer des véhicules de qualité aux clients au Cameroun.

Chez Domtom Connect, nous aidons les dirigeants d'entreprises locales à franchir des paliers de croissance et à surmonter les aléas logistiques.

Sur quel volet de votre organisation souhaiteriez-vous gagner le plus de temps et d'efficacité ?

Par ailleurs, nous rassemblons des porteurs de projets dans un groupe WhatsApp dédié et via l'application DTC Pulse pour stimuler l'entraide économique.

Seriez-vous ouvert à un court appel de dix minutes cette semaine selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Noun Global Invest",
        "email": "nounglobalinvestsarl@gmail.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "Annuaire professionnel vérifié Cameroun",
        "subject": "Vos perspectives de mobilité à Yaoundé / Noun Global Invest",
        "body": """Bonjour,

Félicitations pour le développement des services de location de véhicules de Noun Global Invest Sarl à Bastos Yaoundé.

Chez Domtom Connect, nous accompagnons les structures indépendantes dans la pérennisation de leur activité et l'optimisation de leurs partenariats d'affaires.

Quels sont les besoins majeurs qui occupent votre esprit d'entrepreneur en ce moment ?

Nous animons aussi un groupe d'entraide WhatsApp et l'application DTC Pulse pour connecter les décideurs africains, ultramarins et de la diaspora.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Majeo Car Services",
        "email": "majeobyjd@gmail.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "Annuaire professionnel vérifié Cameroun",
        "subject": "Échange sur vos prestations automobiles / Majeo Car Services",
        "body": """Bonjour,

Je salue l'activité de location de véhicules développée par le complexe MAJEO à Yaoundé pour faciliter les déplacements au Cameroun.

Chez Domtom Connect, notre mission est d'épauler les dirigeants dans la gestion de leurs contraintes de coûts, d'organisation logistique et de développement.

Quelles sont vos priorités actuelles dans l'exploitation de votre service de véhicules ?

Nous réunissons également des gérants de sociétés au sein d'un groupe WhatsApp et sur notre application DTC Pulse pour partager de l'expérience et des solutions adaptées.

Pourrions-nous convenir d'un court point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

if __name__ == "__main__":
    print(f"=== VÉRIFICATION DU BATCH 55 (50 CIBLES LOCATION DE VOITURE) ===")
    errors = 0
    for idx, lead in enumerate(LEADS, 1):
        if ":" in lead["subject"]:
            print(f"[{idx:02d}] ERREUR : Deux-points dans le sujet pour {lead['company']}")
            errors += 1
        if ":" in lead["body"]:
            print(f"[{idx:02d}] ERREUR : Deux-points dans le corps pour {lead['company']}")
            errors += 1
        ok, msg = verify_email_target(lead["email"])
        if not ok:
            print(f"[{idx:02d}] ERREUR MX : {lead['company']} ({lead['email']}) -> {msg}")
            errors += 1
        dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
        if dup:
            print(f"[{idx:02d}] ERREUR DUP : {lead['company']} ({lead['email']}) -> {reason}")
            errors += 1
        if not (":" in lead["subject"] or ":" in lead["body"]) and ok and not dup:
            print(f"[{idx:02d}] VALIDE - {lead['company']} ({lead['email']}) [{lead['territory']}]")
            
    print(f"\nBilan : {len(LEADS) - errors} / {len(LEADS)} cibles parfaitement valides.")
