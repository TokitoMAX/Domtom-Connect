import json, sys, os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

# 50 CIBLES ULTRA-QUALIFIÉES - BATCH 56 (VAGUE 2 / 4)
# Secteur : Petite Enfance, Éveil, Crèches, Écoles Maternelles & Soutien Scolaire
# Répartition : 10 Guadeloupe/Martinique + 4 Guyane + 10 La Réunion + 26 Afrique (Sénégal, Côte d'Ivoire, Cameroun, Bénin, Gabon, Togo)
LEADS = [
    # --- GUADELOUPE & MARTINIQUE (10) ---
    {
        "company": "Crèche Ti Zabitan",
        "email": "crechetizabitan@gmail.com",
        "territory": "Guadeloupe (Vieux-Habitants)",
        "source": "CAF Guadeloupe",
        "subject": "Échange sur vos priorités d'accueil et d'éveil / Ti Zabitan",
        "body": """Bonjour,

Bravo pour votre investissement quotidien à Vieux-Habitants avec la crèche Ti Zabitan pour accueillir les tout-petits et accompagner les familles guadeloupéennes.

Chez Domtom Connect, nous accompagnons les responsables d'établissements et porteurs de projets dans nos îles afin de les aider à surmonter leurs problématiques de gestion d'équipe, de matériel ou d'organisation.

Dans votre quotidien de structure d'accueil, quel est le besoin majeur ou le défi qui sollicite le plus vos ressources en ce moment ?

Par ailleurs, notre mission est de développer un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp réunissant des responsables de structures et des utilisateurs de notre application DTC Pulse pour nous entraider concrètement.

Pourrions-nous caler un court échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Multi-accueil On Ti Bo",
        "email": "multiaccueilontibo@gmail.com",
        "territory": "Guadeloupe (Petit-Canal)",
        "source": "CAF Guadeloupe",
        "subject": "Vos priorités d'encadrement et petite enfance / On Ti Bo",
        "body": """Bonjour,

Félicitations pour le travail remarquable accompli par le multi-accueil On Ti Bo à Petit-Canal au service des enfants et des parents en Guadeloupe.

Chez Domtom Connect, notre rôle est d'épauler les gérantes et directrices de structures d'éveil dans la gestion de leurs contraintes administratives, logistiques et financières.

Quel est aujourd'hui l'enjeu principal qui demande le plus d'énergie dans la gestion de votre établissement ?

Nous animons par ailleurs une communauté WhatsApp active et l'application mobile DTC Pulse afin d'encourager la solidarité et le partage de solutions utiles.

Seriez-vous disponible pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "AleNa Caraïbes Conseil",
        "email": "alenacaraibesconseil@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://alenacaraibesconseil.com",
        "subject": "Échange sur le conseil et l'appui aux crèches / AleNa Caraïbes",
        "body": """Bonjour,

Je découvre avec grand intérêt votre expertise chez AleNa Caraïbes pour conseiller et accompagner les gestionnaires de structures petite enfance aux Antilles.

Chez Domtom Connect, nous accompagnons les professionnels et consultants ultramarins dans le développement de leurs activités et la création de synergies stratégiques.

Quels sont aujourd'hui les défis les plus récurrents que vous observez chez les gestionnaires d'accueil de la région ?

Nous fédérons également des porteurs de projets au sein d'un groupe WhatsApp d'entraide et via notre application DTC Pulse reliant les Caraïbes, l'Afrique et la diaspora.

Pourrions-nous convenir d'un court point téléphonique de dix minutes pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche SO BABY",
        "email": "sobaby.creche@gmail.com",
        "territory": "Guadeloupe (Lamentin)",
        "source": "Registre officiel Guadeloupe",
        "subject": "Vos priorités d'exploitation en crèche / SO BABY",
        "body": """Bonjour,

Je salue l'activité de la micro-crèche SO BABY au Lamentin pour offrir un cadre d'éveil sécurisant et bienveillant aux jeunes enfants de Guadeloupe.

Chez Domtom Connect, nous soutenons les directrices et gérantes de micro-crèches dans la gestion quotidienne de leurs équipes, l'approvisionnement en matériel et la conformité.

Dans votre structure, quel est le volet qui sollicite le plus votre attention en ce moment ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application DTC Pulse pour permettre aux responsables de structures de partager leurs retours d'expérience.

Seriez-vous partante pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Pom de reinette et Pom d'api",
        "email": "mcpomdereinette1@gmail.com",
        "territory": "Guadeloupe (Saint-François)",
        "source": "Registre officiel Guadeloupe",
        "subject": "Échange sur l'éveil des tout-petits / Pom de reinette",
        "body": """Bonjour,

Bravo pour votre dévouement avec Pom de reinette et Pom d'api à Saint-François pour créer un espace d'éveil chaleureux pour les tout-petits.

Chez Domtom Connect, nous accompagnons les professionnels de la petite enfance face aux réalités insulaires (coûts d'équipement, contraintes de personnel et charge administrative).

Quelles sont vos priorités actuelles dans le développement et le fonctionnement de votre crèche ?

Nous animons aussi un réseau de responsables sur WhatsApp et via l'application DTC Pulse pour s'entraider concrètement et mutualiser des ressources.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Étude Plus Guadeloupe",
        "email": "etudeplus971@gmail.com",
        "territory": "Guadeloupe",
        "source": "https://etudeplusguadeloupe.com",
        "subject": "Échange sur l'accompagnement scolaire / Étude Plus Guadeloupe",
        "body": """Bonjour,

Félicitations pour votre engagement avec Étude Plus Guadeloupe pour soutenir la scolarité et l'épanouissement des jeunes dans le département.

Chez Domtom Connect, nous sommes aux côtés des structures éducatives ultramarines pour les aider à relever leurs défis d'organisation, de communication et de gestion de trésorerie.

Quel est aujourd'hui votre défi numéro un dans le pilotage de votre activité pédagogique ?

Nous rassemblons également des éducateurs et dirigeants dans un groupe WhatsApp d'entraide couplé à l'application mobile DTC Pulse.

Seriez-vous disponible pour un bref échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Kazatyka Soutien Scolaire",
        "email": "Kazatyka971@gmail.com",
        "territory": "Guadeloupe (Saint-François)",
        "source": "Annuaire éducatif Guadeloupe",
        "subject": "Vos priorités d'aide aux devoirs / Kazatyka",
        "body": """Bonjour,

Je salue le rôle essentiel de Kazatyka à Saint-François pour accompagner les élèves du primaire au collège dans leur parcours scolaire.

Chez Domtom Connect, notre mission est d'apporter un soutien concret aux entrepreneurs éducatifs dans la structuration de leurs démarches et la fidélisation des familles.

Sur quel aspect ressentez-vous le plus fort besoin d'appui ou de simplification actuellement ?

Par ailleurs, nous bâtissons un écosystème solidaire reliant les Caraïbes et l'Afrique via un groupe WhatsApp et l'application mobile DTC Pulse.

Pourrions-nous caler un rapide échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-Crèche Chez Maman Doudou",
        "email": "emerydom.presidente@gmail.com",
        "territory": "Martinique (Schœlcher)",
        "source": "Registre officiel Martinique",
        "subject": "Échange sur l'accueil des tout-petits / Chez Maman Doudou",
        "body": """Bonjour Madame Emery,

Bravo pour l'engagement bienveillant de votre association à Schœlcher avec la micro-crèche Chez Maman Doudou au service des tout-petits martiniquais.

Chez Domtom Connect, nous épaulons les gestionnaires associatives face aux lourdeurs administratives, aux contraintes budgétaires et à l'organisation des plannings.

Dans votre quotidien de structure, quel est le besoin qui mobilise le plus votre énergie en ce moment ?

Nous fédérons également des directrices d'établissements dans un groupe WhatsApp d'entraide et sur notre application DTC Pulse pour partager de bonnes pratiques.

Seriez-vous ouverte à un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche Mont Sinaï",
        "email": "micro-creeche.montsinai@gmail.com",
        "territory": "Martinique (Fort-de-France)",
        "source": "Registre officiel Martinique",
        "subject": "Vos priorités d'éveil et accueil à Fort-de-France / Mont Sinaï",
        "body": """Bonjour,

Je salue l'activité de la micro-crèche Mont Sinaï à Fort-de-France pour offrir un cadre d'apprentissage et de garde sécurisé aux enfants de Martinique.

Chez Domtom Connect, nous accompagnons les responsables d'établissements d'accueil pour les aider à surmonter les aléas logistiques et la gestion du matériel.

Quelles sont vos priorités actuelles dans le fonctionnement régulier de votre crèche ?

Nous animons par ailleurs une communauté WhatsApp active et proposons l'application DTC Pulse pour encourager les échanges solidaires entre structures.

Pourrions-nous convenir d'un court appel de dix minutes selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Petites Colombes",
        "email": "contact@lespetitescolombes.fr",
        "territory": "Martinique (Saint-Joseph)",
        "source": "https://lespetitescolombes.fr",
        "subject": "Échange autour de vos besoins d'encadrement / Les Petites Colombes",
        "body": """Bonjour,

Félicitations pour la qualité d'accueil proposée par Les Petites Colombes à Saint-Joseph au service du bien-être des jeunes enfants en Martinique.

Chez Domtom Connect, nous travaillons avec les dirigeants et responsables pédagogiques pour les aider à pérenniser leur modèle et optimiser leur temps de gestion.

Quel est aujourd'hui le défi le plus complexe dans la conduite de votre établissement ?

Notre réseau rassemble des responsables de structures via un groupe WhatsApp et l'application mobile DTC Pulse afin de créer des synergies utiles.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- GUYANE (4) ---
    {
        "company": "Crèche Les Toucanets",
        "email": "lestouvanets@gmail.com",
        "territory": "Guyane (Macouria)",
        "source": "Registre officiel Guyane",
        "subject": "Vos priorités d'accueil de la petite enfance à Macouria / Les Toucanets",
        "body": """Bonjour,

Bravo pour l'engagement de la crèche Les Toucanets à Macouria pour accueillir et stimuler les jeunes enfants en Guyane.

Chez Domtom Connect, nous accompagnons les professionnels de nos départements d'Outre-mer face aux contraintes spécifiques d'éloignement, de logistique et d'équipement.

Dans votre structure, quel est le domaine qui demande le plus d'énergie et de vigilance actuellement ?

Par ailleurs, notre réseau WhatsApp et l'application DTC Pulse permettent de connecter les responsables d'établissements ultramarins et d'Afrique.

Seriez-vous partante pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Familles et Scolarité",
        "email": "soutien.scolaire.education@gmail.com",
        "territory": "Guyane (Rémire-Montjoly)",
        "source": "https://soutienscolaireeducation.com",
        "subject": "Échange sur le soutien scolaire à Rémire-Montjoly / Familles et Scolarité",
        "body": """Bonjour,

Je découvre votre démarche avec Familles & Scolarité à Rémire-Montjoly pour accompagner les élèves et prévenir le décrochage scolaire en Guyane.

Chez Domtom Connect, notre mission est d'épauler les acteurs éducatifs locaux dans la valorisation de leurs services et la consolidation de leur modèle.

Quels sont aujourd'hui vos principaux besoins pour amplifier l'impact de votre accompagnement pédagogique ?

Nous animons aussi un groupe d'entraide WhatsApp et l'application mobile DTC Pulse afin de créer des passerelles entre nos territoires et l'Afrique.

Pourrions-nous caler un court échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "EDA Guyane",
        "email": "association.edaguyane@gmail.com",
        "territory": "Guyane (Cayenne)",
        "source": "Annuaire associatif Guyane",
        "subject": "Vos actions pour les enfants en difficulté d'apprentissage / EDA Guyane",
        "body": """Bonjour,

Je salue le travail admirable d'EDA Guyane pour accompagner les enfants confrontés aux troubles des apprentissages et soutenir leurs familles à Cayenne.

Chez Domtom Connect, nous accompagnons les responsables associatifs et éducatifs dans l'organisation de leurs projets et la recherche de partenariats utiles.

Dans vos actions quotidiennes, quel est le défi majeur auquel votre équipe fait face ?

Nous réunissons également des acteurs de terrain au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour échanger des méthodes et créer des coopérations.

Seriez-vous disponible pour un court entretien téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Alliance Française de Cayenne",
        "email": "contact@afcayenne.org",
        "territory": "Guyane (Cayenne)",
        "source": "https://afcayenne.org",
        "subject": "Éveil au langage et éducation / Alliance Française de Cayenne",
        "body": """Bonjour,

Félicitations pour vos programmes d'apprentissage, d'éveil linguistique et d'intégration menés par l'Alliance Française à Cayenne.

Chez Domtom Connect, nous développons des partenariats et des ponts économiques et éducatifs entre l'espace amazonien, les Caraïbes et le continent africain.

Quelles sont vos priorités actuelles dans le déploiement de vos ateliers éducatifs et linguistiques ?

Nous proposons également un groupe d'entraide WhatsApp et l'application DTC Pulse réunissant des acteurs engagés pour échanger des contacts et opportunités.

Pourrions-nous convenir d'un court échange téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- LA RÉUNION (10) ---
    {
        "company": "Micro-Crèche Les Coquillettes",
        "email": "microcrechelescoquillettes974@gmail.com",
        "territory": "La Réunion (Saint-Denis)",
        "source": "https://microcrecheslescoquillettes.fr",
        "subject": "Vos priorités d'éveil et accueil / Les Coquillettes",
        "body": """Bonjour,

Bravo pour l'environnement soigné et stimulant développé par la micro-crèche Les Coquillettes à Saint-Denis de La Réunion.

Chez Domtom Connect, nous accompagnons les gestionnaires de structures petite enfance dans la maîtrise de leurs coûts d'exploitation et la gestion d'équipe.

Quel est aujourd'hui le point le plus exigeant dans le fonctionnement quotidien de votre micro-crèche ?

Par ailleurs, nous animons un réseau d'entraide sur WhatsApp et l'application mobile DTC Pulse afin de connecter les responsables de structures dans nos îles.

Seriez-vous ouverte à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche GOBABYGO",
        "email": "microcrechereunion@gmail.com",
        "territory": "La Réunion (Saint-Louis)",
        "source": "Allocreche Réunion",
        "subject": "Échange sur la gestion de votre micro-crèche / GOBABYGO",
        "body": """Bonjour,

Je découvre l'activité de la micro-crèche GOBABYGO à Saint-Louis pour accueillir les enfants dans un cadre bienveillant à La Réunion.

Chez Domtom Connect, notre rôle est d'apporter un soutien concret aux gérantes et éducatrices face aux réalités insulaires et aux démarches de gestion.

Dans votre organisation, quel est le volet qui demande le plus d'énergie en ce moment ?

Nous réunissons également des porteurs de projets dans un groupe WhatsApp dédié et via l'application DTC Pulse pour favoriser l'entraide entre professionnels.

Pourrions-nous caler un rapide point de dix minutes au téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Crèche et Cie",
        "email": "ccie.bureau@gmail.com",
        "territory": "La Réunion (La Possession)",
        "source": "Registre officiel Réunion",
        "subject": "Vos enjeux d'accueil à La Possession / Crèche et Cie",
        "body": """Bonjour,

Je salue l'activité de Crèche et Cie à La Possession pour accompagner le développement des tout-petits réunionnais.

Chez Domtom Connect, nous accompagnons les structures d'accueil dans la pérennisation de leur activité et l'optimisation de leurs processus internes.

Quels sont les besoins majeurs qui occupent votre esprit de gestionnaire actuellement ?

Nous animons par ailleurs une communauté WhatsApp active et l'application DTC Pulse pour partager de l'entraide concrète et des méthodes éprouvées.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "La Maison de Tante Chou",
        "email": "micro.clfe@gmail.com",
        "territory": "La Réunion (Saint-Pierre)",
        "source": "Registre officiel Réunion",
        "subject": "Échange sur vos micro-crèches à Saint-Pierre / La Maison de Tante Chou",
        "body": """Bonjour,

Félicitations pour le cadre chaleureux développé par La Maison de Tante Chou 1 et 2 à Saint-Pierre de La Réunion.

Chez Domtom Connect, nous aidons les gestionnaires de structures indépendantes à consolider leur organisation et à surmonter leurs problématiques de matériel.

Sur quel aspect de votre quotidien ressentez-vous le plus fort besoin de simplification ?

Nous fédérons aussi des directrices d'établissements dans un groupe WhatsApp d'entraide et via notre application mobile DTC Pulse.

Pourrions-nous convenir d'un court échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèches Montessori Réunion",
        "email": "adm.microcreches@gmail.com",
        "territory": "La Réunion (Saint-Denis)",
        "source": "https://microcrechesmontessori.re",
        "subject": "Pédagogie active et développement à La Réunion / Micro-crèches Montessori",
        "body": """Bonjour,

Je découvre avec grand intérêt votre projet pédagogique fondé sur la méthode Montessori à Saint-Denis et Sainte-Clotilde.

Chez Domtom Connect, nous valorisons les initiatives éducatives innovantes et accompagnons leurs dirigeants dans leur structuration administrative et logistique.

Quels sont aujourd'hui vos principaux axes de développement ou de vigilance dans vos structures ?

Nous rassemblons également des professionnels au sein d'un groupe WhatsApp et sur notre application DTC Pulse pour créer des coopérations pérennes.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche Gadiamb",
        "email": "lechatetlasouris97419@gmail.com",
        "territory": "La Réunion (La Possession)",
        "source": "Registre officiel Réunion",
        "subject": "Vos priorités d'éveil des tout-petits / Micro-crèche Gadiamb",
        "body": """Bonjour,

Bravo pour l'engagement de l'équipe de la micro-crèche Gadiamb à La Possession pour accompagner les premières années des enfants à La Réunion.

Chez Domtom Connect, notre mission est de soutenir les responsables de structures face aux défis quotidiens de personnel, d'approvisionnement et de gestion.

Dans votre structure, quel est le domaine qui mobilise le plus votre attention en ce moment ?

Par ailleurs, notre réseau d'entraide WhatsApp et l'application DTC Pulse permettent de mutualiser contacts et retours d'expérience utiles.

Seriez-vous partante pour un rapide point de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Baby Trees Réunion",
        "email": "lapossession@baby-trees.fr",
        "territory": "La Réunion (La Possession)",
        "source": "https://baby-trees.fr",
        "subject": "Échange sur votre modèle de crèche / Baby Trees",
        "body": """Bonjour,

Félicitations pour le projet éco-responsable et l'accueil bienveillant proposés par Baby Trees à La Possession.

Chez Domtom Connect, nous accompagnons les entreprises et crèches engagées dans la gestion de leur modèle économique et l'élargissement de leurs partenariats.

Dans votre phase actuelle d'exploitation, quels sont vos principaux enjeux opérationnels ?

Nous animons également un groupe WhatsApp de décideurs et proposons l'application DTC Pulse pour bâtir un écosystème solidaire reliant l'Océan Indien, les Caraïbes et l'Afrique.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Notre Dame des Enfants",
        "email": "assnotredamedesenfants@gmail.com",
        "territory": "La Réunion (Saint-Denis)",
        "source": "Registre officiel Réunion",
        "subject": "Vos actions éducatives et accueil / Notre Dame des Enfants",
        "body": """Bonjour,

Je salue l'investissement de votre association Notre Dame des Enfants à Saint-Denis au service des familles et de la petite enfance réunionnaise.

Chez Domtom Connect, nous aidons les structures associatives à structurer leurs démarches, sécuriser leur fonctionnement et alléger leur charge administrative.

Quel est aujourd'hui votre défi numéro un dans la gestion de votre activité ?

Nous rassemblons également des acteurs engagés via un groupe WhatsApp et l'application mobile DTC Pulse afin de mutualiser des solutions concrètes.

Seriez-vous disponible pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Crèche And Go Réunion",
        "email": "accueil@creche-and-go.fr",
        "territory": "La Réunion",
        "source": "https://creche-and-go.fr",
        "subject": "Échange sur le développement de votre réseau / Crèche And Go",
        "body": """Bonjour,

Bravo pour le déploiement de Crèche And Go à La Réunion pour apporter des solutions d'accueil flexibles et adaptées aux parents actifs.

Chez Domtom Connect, nous accompagnons les réseaux d'accueil dans l'optimisation de leurs processus, leur communication et leurs partenariats d'entreprise.

Dans votre modèle actuel, quelles sont les problématiques qui sollicitent le plus vos ressources ?

Par ailleurs, notre groupe WhatsApp d'entraide et l'application DTC Pulse permettent de connecter les dirigeants et d'échanger des bonnes pratiques.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Récréa Family",
        "email": "recreafamily974@gmail.com",
        "territory": "La Réunion (Saint-Pierre)",
        "source": "Annuaire éducatif Réunion",
        "subject": "Vos activités éducatives et soutien / Récréa Family",
        "body": """Bonjour,

Je découvre l'activité de Récréa Family à Saint-Pierre pour proposer du soutien scolaire et des activités d'éveil enrichissantes aux enfants.

Chez Domtom Connect, nous soutenons les acteurs pédagogiques indépendants dans la pérennisation de leur activité et la fidélisation des familles.

Quelles sont vos priorités actuelles dans le développement de vos ateliers et services ?

Nous animons aussi une communauté WhatsApp de professionnels et l'application DTC Pulse pour échanger des contacts et opportunités utiles.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- AFRIQUE (26) ---
    {
        "company": "Les Petits Soleils Dakar",
        "email": "creche.lespetitssoleils@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "Annuaire officiel Dakar",
        "subject": "Vos priorités d'éveil et accueil à Dakar / Les Petits Soleils",
        "body": """Bonjour,

Je salue le rôle essentiel des Petits Soleils à Dakar pour accueillir les enfants de deux mois et demi à six ans dans un environnement épanouissant.

Chez Domtom Connect, nous accompagnons les gestionnaires de structures éducatives dans la consolidation de leurs opérations, la gestion d'équipe et la conformité.

Dans votre quotidien d'établissement, quel est le défi opérationnel qui vous mobilise le plus ?

Par ailleurs, nous bâtissons un pont fort reliant les entrepreneurs du continent africain, des Caraïbes et de la diaspora via un groupe WhatsApp et l'application mobile DTC Pulse.

Seriez-vous disponible pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "L'Île aux Enfants Dakar",
        "email": "contact.lileauxenfants@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "Annuaire officiel Dakar",
        "subject": "Échange sur votre programme d'éveil / L'Île aux Enfants Dakar",
        "body": """Bonjour,

Félicitations pour la qualité du programme bilingue développé par l'école maternelle L'Île aux Enfants à Dakar au service des jeunes élèves.

Chez Domtom Connect, notre mission est d'épauler les dirigeants d'établissements éducatifs dans l'optimisation de leurs processus et le partage d'outils de gestion.

Quel est aujourd'hui l'enjeu prioritaire sur lequel vous concentrez vos efforts ?

Nous réunissons également des responsables éducatifs au sein d'un groupe WhatsApp d'entraide et sur notre application DTC Pulse.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Petites Mains Dakar",
        "email": "lespetites.mains123@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "Annuaire officiel Dakar",
        "subject": "Vos priorités d'encadrement pédagogique / Les Petites Mains",
        "body": """Bonjour,

Bravo pour l'engagement de l'équipe de l'école maternelle Les Petites Mains à Dakar pour stimuler la créativité et l'éveil des enfants.

Chez Domtom Connect, nous aidons les professionnels de l'éducation à relever leurs défis logistiques, d'approvisionnement en matériel et de formation continue.

Dans votre fonctionnement régulier, quel est le sujet qui demande le plus d'énergie actuellement ?

Nous animons aussi une communauté de décideurs sur WhatsApp et l'application DTC Pulse reliant l'Afrique et les Caraïbes.

Seriez-vous partante pour un court échange de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Yaaru Éducation",
        "email": "yaaru2021@gmail.com",
        "territory": "Sénégal (Dakar Yoff)",
        "source": "Annuaire officiel Dakar",
        "subject": "Échange sur votre vision éducative à Yoff / Yaaru Éducation",
        "body": """Bonjour,

Je découvre avec attention le cycle complet développé par Yaaru à Yoff, de la crèche à l'élémentaire, pour ancrer l'excellence éducative au Sénégal.

Chez Domtom Connect, nous accompagnons les projets éducatifs structurants dans leur développement, la gestion de trésorerie et la valorisation de leur offre.

Quels sont les défis majeurs auxquels vous devez faire face pour soutenir votre croissance ?

Par ailleurs, notre réseau WhatsApp et l'application mobile DTC Pulse facilitent la création de passerelles directes entre entrepreneurs africains et caribéens.

Pourrions-nous caler un court appel de dix minutes cette semaine pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Établissement Scolaire Mission Libanaise",
        "email": "esml.direction@gmail.com",
        "territory": "Sénégal (Dakar)",
        "source": "Annuaire officiel Dakar",
        "subject": "Vos enjeux de gestion scolaire à Dakar / ESML",
        "body": """Bonjour,

Je salue le sérieux et la renommée de l'Établissement Scolaire Mission Libanaise à Dakar pour assurer un cursus de qualité dès la maternelle.

Chez Domtom Connect, nous apportons un regard stratégique et un accompagnement opérationnel aux directions d'établissements dans la modernisation de leurs outils.

Quel est aujourd'hui le point le plus délicat à gérer dans l'administration quotidienne de votre structure ?

Nous rassemblons également des chefs d'établissement dans un groupe WhatsApp et sur l'application DTC Pulse pour partager solutions et contacts d'affaires.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les P'tits Anges de Lalou",
        "email": "lespetitsangesdelalou@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Cocody)",
        "source": "Annuaire officiel Abidjan",
        "subject": "Échange sur l'éveil des tout-petits à Cocody / Les P'tits Anges de Lalou",
        "body": """Bonjour,

Félicitations pour le cadre bienveillant et sécurisant développé par Les P'tits Anges de Lalou à Cocody pour la crèche et la maternelle.

Chez Domtom Connect, nous accompagnons les gérantes de crèches face à leurs contraintes d'équipement, de gestion d'équipe et d'exigences des parents.

Dans votre structure aujourd'hui, quel est le volet qui sollicite le plus votre temps et votre énergie ?

Nous animons également un groupe d'entraide WhatsApp et l'application DTC Pulse connectant les acteurs de la petite enfance d'Afrique et des Caraïbes.

Seriez-vous ouverte à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Ateliers Pomme d'Api",
        "email": "atelierspommedapi@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Biétry)",
        "source": "Annuaire officiel Abidjan",
        "subject": "Vos priorités d'accueil à Biétry / Les Ateliers Pomme d'Api",
        "body": """Bonjour,

Bravo pour l'accueil et les ateliers d'éveil de qualité proposés par Les Ateliers Pomme d'Api à Biétry pour les jeunes enfants abidjanais.

Chez Domtom Connect, notre rôle est d'épauler les responsables de structures éducatives dans la simplification de leur gestion administrative et logistique.

Quelles sont vos priorités actuelles dans le développement et l'organisation de vos classes ?

Par ailleurs, nous connectons des chefs d'entreprise et directrices via un groupe WhatsApp et l'application mobile DTC Pulse pour partager de l'entraide concrète.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Groupe Fred et Poppée",
        "email": "groupefredetpoppee@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Attoban)",
        "source": "Annuaire officiel Abidjan",
        "subject": "Échange sur votre projet éducatif / Groupe Fred et Poppée",
        "body": """Bonjour,

Je découvre le positionnement d'excellence du Groupe Fred & Poppée à Cocody Attoban pour former les jeunes enfants dans un cadre international soigné.

Chez Domtom Connect, nous accompagnons les établissements scolaires dans la sécurisation de leur modèle et le déploiement de partenariats stratégiques.

Dans votre quotidien de direction, quel est le défi majeur auquel vous portez le plus de vigilance ?

Nous animons par ailleurs une communauté WhatsApp active et proposons l'application DTC Pulse pour relier les acteurs économiques d'Afrique et d'Outre-mer.

Seriez-vous disponible pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Maison Pakken",
        "email": "maison.pakken@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Deux Plateaux)",
        "source": "Annuaire officiel Abidjan",
        "subject": "Vos enjeux de crèche et maternelle / Maison Pakken",
        "body": """Bonjour,

Je salue le dynamisme de la Maison Pakken aux Deux Plateaux pour offrir un lieu de vie et d'apprentissage stimulant aux tout-petits à Abidjan.

Chez Domtom Connect, nous soutenons les dirigeants dans l'anticipation de leurs besoins en ressources humaines, matériel et structuration financière.

Sur quel aspect de votre organisation aimeriez-vous apporter des améliorations rapides ?

Nous rassemblons également des directrices d'établissements au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour échanger solutions et méthodes.

Pourrions-nous caler un rapide échange de dix minutes selon votre planning ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Centre de Petite Enfance Babilou",
        "email": "cpebabilou@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Riviera)",
        "source": "Annuaire officiel Abidjan",
        "subject": "Échange sur la garde bilingue à Riviera 3 / CPE Babilou",
        "body": """Bonjour,

Félicitations pour le service d'accueil et de toute petite section bilingue développé par le Centre de Petite Enfance Babilou à Riviera 3.

Chez Domtom Connect, notre mission est d'apporter un soutien stratégique et opérationnel aux structures privées de garde et d'éveil d'Afrique de l'Ouest.

Quel est aujourd'hui le besoin majeur qui sollicite le plus vos ressources en ce moment ?

Par ailleurs, notre réseau d'entraide WhatsApp et l'application mobile DTC Pulse permettent de mutualiser des retours d'expérience et des contacts clés.

Seriez-vous partant pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Groupe Scolaire Bilingue Verdun",
        "email": "education.gsbv@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Vos priorités d'enseignement bilingue / GSB Verdun Douala",
        "body": """Bonjour,

Bravo pour l'engagement du Groupe Scolaire Bilingue Verdun à Pk19 Douala Ngoma pour former les enfants dès la maternelle.

Chez Domtom Connect, nous accompagnons les gestionnaires d'écoles dans la gestion de leurs infrastructures, de leurs équipes et de leur rentabilité.

Dans votre exploitation, quel est le domaine qui demande le plus d'énergie actuellement ?

Nous animons aussi un réseau de responsables éducatifs sur WhatsApp et l'application DTC Pulse pour créer des synergies économiques et scolaires.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "LadyBird School Douala",
        "email": "ndagracel@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Échange sur le parcours éducatif complet / LadyBird School",
        "body": """Bonjour Madame Nda,

Je salue le travail remarquable de LadyBird School à Douala pour offrir une expérience éducative enrichissante dès la maternelle.

Chez Domtom Connect, nous aidons les dirigeants d'établissements scolaires privés à franchir des paliers de croissance et à sécuriser leurs opérations.

Quel est aujourd'hui votre principal levier d'amélioration dans le pilotage de votre école ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application DTC Pulse pour connecter nos territoires et l'Afrique.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Rapha Bilingual School",
        "email": "raphanurseryprimaryschool@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Vos enjeux de cycle maternelle / Rapha Bilingual School",
        "body": """Bonjour,

Félicitations pour le parcours proposé par Rapha Bilingual Nursery & Primary School à Douala de la crèche aux classes primaires.

Chez Domtom Connect, nous soutenons les directeurs d'écoles face aux contraintes quotidiennes de gestion du matériel, de trésorerie et d'encadrement.

Dans votre quotidien professionnel, quel est le défi majeur auquel vous faites face actuellement ?

Nous réunissons également des porteurs de projets dans un groupe WhatsApp d'entraide relié à notre application mobile DTC Pulse.

Seriez-vous ouvert à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Reference Bilingual Complex",
        "email": "referencebilingual93@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Échange sur la formation pré-scolaire / Reference Bilingual",
        "body": """Bonjour,

Je découvre le sérieux de Reference Bilingual Education Complex à Douala pour accompagner les élèves de la pré-maternelle jusqu'au secondaire.

Chez Domtom Connect, notre rôle est d'épauler les responsables pédagogiques et administratifs dans l'optimisation de leurs processus.

Quelles sont vos priorités actuelles dans le développement de vos infrastructures d'accueil ?

Nous animons aussi une communauté de gérants d'établissements sur WhatsApp et l'application DTC Pulse pour partager de l'expérience et des solutions.

Pourrions-nous caler un rapide échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Papillons Groupe Scolaire",
        "email": "lespapillons237@gmail.com",
        "territory": "Cameroun (Yaoundé Bastos)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Vos priorités de crèche et maternelle à Bastos / Les Papillons",
        "body": """Bonjour,

Bravo pour l'excellence développée par le Groupe Scolaire Bilingue Les Papillons à Bastos Yaoundé pour accueillir les tout-petits et écoliers.

Chez Domtom Connect, nous accompagnons les gestionnaires d'écoles privées dans la pérennisation de leur modèle et l'amélioration de leur efficacité opérationnelle.

Quel est aujourd'hui le point le plus délicat à gérer dans votre quotidien de direction ?

Par ailleurs, nous bâtissons un écosystème solidaire reliant l'Afrique et les Caraïbes à travers un groupe WhatsApp d'entraide et l'application DTC Pulse.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "L'Ilot des Anges Crèche",
        "email": "lilotdesangescreche@gmail.com",
        "territory": "Cameroun (Yaoundé Ngousso)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Échange sur l'accueil des tout-petits à Ngousso / L'Ilot des Anges",
        "body": """Bonjour,

Je salue l'activité de L'Ilot des Anges à Ngousso Yaoundé pour offrir un service de crèche et garderie bienveillant aux familles camerounaises.

Chez Domtom Connect, notre mission est de soutenir concrètement les créatrices et gérantes de crèches dans l'organisation de leurs équipes et l'approvisionnement en matériel.

Dans votre structure, quel est le volet qui demande le plus d'énergie en ce moment ?

Nous fédérons également des responsables de structures d'éveil via un groupe WhatsApp et notre application DTC Pulse pour partager des solutions utiles.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon votre planning ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "JoyeuZEnfance Crèche",
        "email": "joyeuzenfance@gmail.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Vos besoins de gestion et garde d'enfants / JoyeuZEnfance",
        "body": """Bonjour,

Félicitations pour l'accueil et le suivi attentionné proposés par la crèche-garderie JoyeuZEnfance à Yaoundé.

Chez Domtom Connect, nous aidons les gestionnaires de petite enfance à sécuriser leur fonctionnement régulier et à valoriser leurs prestations auprès des parents.

Quel est aujourd'hui votre défi numéro un dans la gestion de votre crèche ?

Nous animons par ailleurs une communauté WhatsApp active et l'application mobile DTC Pulse afin d'encourager la solidarité entre responsables de structures.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Prestige Bilingual Complex",
        "email": "collegeprestige12@gmail.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "Annuaire officiel Cameroun",
        "subject": "Échange sur votre cycle pré-scolaire à Mimboman / Prestige Bilingual",
        "body": """Bonjour,

Je salue l'engagement de Prestige Bilingual School Complex à Mimboman Yaoundé pour assurer un encadrement scolaire solide dès les classes maternelles.

Chez Domtom Connect, nous travaillons aux côtés des dirigeants d'établissements pour répondre à leurs questions de développement, de maîtrise des coûts et d'investissements.

Dans votre contexte d'activité actuel, quelle est la priorité majeure qui retient votre attention ?

Par ailleurs, notre réseau WhatsApp et l'application mobile DTC Pulse permettent de mutualiser retours d'expérience et contacts d'affaires.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Île aux Oiseaux Crèche",
        "email": "ileauxoiseaux2016@gmail.com",
        "territory": "Bénin (Cotonou)",
        "source": "Annuaire officiel Bénin",
        "subject": "Vos priorités d'éveil et loisirs à Cotonou / Île aux oiseaux",
        "body": """Bonjour,

Bravo pour l'activité de la crèche et centre de loisirs Île aux oiseaux à Zongo-Ehuzu Cotonou pour stimuler l'épanouissement des tout-petits au Bénin.

Chez Domtom Connect, nous soutenons les directrices d'établissements petite enfance dans la gestion de leurs contraintes de personnel, de matériel et d'organisation.

Quel est aujourd'hui le point le plus délicat à gérer dans l'exploitation de votre centre ?

Nous animons aussi un groupe WhatsApp d'entraide et l'application DTC Pulse réunissant des acteurs de l'éducation reliant le continent africain et les Caraïbes.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Royaume des Anges Bénin",
        "email": "royaumedesangesbenin@gmail.com",
        "territory": "Bénin (Cotonou)",
        "source": "Annuaire officiel Bénin",
        "subject": "Échange sur votre crèche bilingue / Royaume des Anges",
        "body": """Bonjour,

Félicitations pour l'offre bilingue de crèche et maternelle développée par Le Royaume des Anges à Haie-Vive et Abomey-Calavi.

Chez Domtom Connect, notre rôle est d'épauler les gestionnaires d'écoles privées dans la consolidation de leurs opérations et l'optimisation de leur modèle.

Dans votre structure, quel est le défi opérationnel qui vous mobilise le plus en ce moment ?

Par ailleurs, nous développons un groupe d'entraide WhatsApp et l'application mobile DTC Pulse afin de connecter les professionnels d'Afrique et d'Outre-mer.

Seriez-vous ouvert à un rapide échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Complexe Scolaire Les Grâces",
        "email": "sognon712@gmail.com",
        "territory": "Bénin (Cotonou Fidjrossè)",
        "source": "Annuaire officiel Bénin",
        "subject": "Vos enjeux de maternelle et crèche à Fidjrossè / Les Grâces",
        "body": """Bonjour,

Je salue l'activité du Complexe Scolaire Les Grâces à Fidjrossè Cotonou pour assurer l'accueil et l'enseignement des enfants dès la crèche-garderie.

Chez Domtom Connect, nous accompagnons les fondateurs d'écoles dans la gestion de leurs infrastructures et la recherche d'outils de pilotage efficaces.

Quelles sont vos priorités actuelles dans le développement de vos classes maternelles ?

Nous rassemblons également des acteurs de l'éducation au sein d'un groupe WhatsApp et sur l'application DTC Pulse pour échanger des contacts utiles.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Centre Clés Garderie",
        "email": "centrecles82@gmail.com",
        "territory": "Bénin (Cotonou)",
        "source": "Annuaire officiel Bénin",
        "subject": "Échange sur la garde et l'éveil / Centre Clés",
        "body": """Bonjour,

Bravo pour l'engagement du Centre Clés à Cotonou pour assurer la garderie et l'accueil en maternelle dans un environnement sécurisant pour les enfants.

Chez Domtom Connect, nous aidons les responsables de structures indépendantes à alléger leur charge mentale de gestion et à pérenniser leur modèle.

Sur quel aspect de votre organisation aimeriez-vous apporter des améliorations rapides ?

Par ailleurs, nous connectons des chefs d'entreprise et directrices via un groupe WhatsApp et l'application mobile DTC Pulse pour stimuler la coopération.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "École Les Mille Pattes",
        "email": "secretariat.lesmillepattes@gmail.com",
        "territory": "Bénin (Cotonou)",
        "source": "Annuaire officiel Bénin",
        "subject": "Vos priorités d'enseignement pré-scolaire / Les Mille Pattes",
        "body": """Bonjour,

Je découvre l'activité de l'École Les Mille Pattes à la Patte d'Oie Cotonou pour former et accompagner les jeunes élèves de la maternelle au primaire.

Chez Domtom Connect, notre mission est d'accompagner les établissements d'enseignement dans l'optimisation de leurs ressources et la formation d'équipes.

Quel est aujourd'hui votre principal enjeu dans la gestion quotidienne de l'école ?

Nous animons par ailleurs une communauté WhatsApp active et proposons l'application DTC Pulse pour créer des opportunités partagées.

Pourrions-nous caler un rapide échange de dix minutes selon votre planning ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les P'tits Mousses Nomba",
        "email": "lesptitsmoussesdelanomba@gmail.com",
        "territory": "Gabon (Libreville)",
        "source": "Annuaire officiel Gabon",
        "subject": "Pédagogie Montessori et petite enfance à Libreville / Les P'tits Mousses",
        "body": """Bonjour,

Félicitations pour votre démarche éducative et l'application de la pédagogie Montessori au sein de la crèche et maternelle Les P'tits Mousses de la Nomba à Libreville.

Chez Domtom Connect, nous valorisons les méthodes d'apprentissage actives et accompagnons leurs fondateurs dans la gestion logistique et opérationnelle de leurs établissements.

Dans votre structure aujourd'hui, quel est le défi qui demande le plus d'énergie et de vigilance ?

Par ailleurs, notre réseau d'entraide WhatsApp et l'application DTC Pulse permettent de connecter les acteurs de l'éducation en Afrique et dans les Caraïbes.

Seriez-vous partante pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Enoch Olinga School",
        "email": "enocholingaschool@gmail.com",
        "territory": "Togo (Lomé)",
        "source": "Annuaire officiel Togo",
        "subject": "Vos enjeux d'enseignement dès la petite enfance / Enoch Olinga School",
        "body": """Bonjour,

Je salue le parcours remarquable de Enoch Olinga School à Lomé pour accompagner les enfants dès la petite enfance et la maternelle.

Chez Domtom Connect, nous accompagnons les gestionnaires d'écoles dans la sécurisation de leur modèle, la gestion de personnel et les partenariats stratégiques.

Quel est le point qui mobilise le plus votre attention en ce moment dans votre établissement ?

Nous animons également un groupe WhatsApp de décideurs et proposons l'application DTC Pulse pour partager de l'entraide concrète et des passerelles d'affaires.

Pourrions-nous convenir d'un court point téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "École des Charbonnages",
        "email": "direction.cha.apepc@gmail.com",
        "territory": "Gabon (Libreville)",
        "source": "Annuaire officiel Gabon",
        "subject": "Vos priorités de gestion pré-scolaire à Libreville / École des Charbonnages",
        "body": """Bonjour,

Bravo pour l'encadrement pédagogique assuré par l'École Publique Conventionnée des Charbonnages à Libreville dès la petite section de maternelle.

Chez Domtom Connect, nous sommes aux côtés des directions d'écoles pour les aider à relever leurs défis logistiques, organisationnels et de communication avec les parents.

Dans votre contexte d'activité actuel, quelle est la priorité majeure qui retient votre attention ?

Nous rassemblons également des acteurs de terrain au sein d'un groupe WhatsApp et sur notre application DTC Pulse pour échanger des contacts utiles.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

if __name__ == "__main__":
    print(f"=== VÉRIFICATION DU BATCH 56 (50 CIBLES PETITE ENFANCE) ===")
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
