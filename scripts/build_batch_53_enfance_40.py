import json, sys, os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

# 40 CIBLES ULTRA-QUALIFIÉES : 20 CARAÏBES + 20 AFRIQUE
# Secteur : Bien-être des enfants, petite enfance, éveil, soutien scolaire, éducation, livres jeunesse
LEADS = [
    # ==========================
    # 20 CIBLES CARAÏBES
    # ==========================
    {
        "company": "MaxiRéussite Caraïbes",
        "email": "contact@maxireussite.fr",
        "territory": "Caraïbes (Guadeloupe, Martinique)",
        "source": "https://maxireussite.com",
        "subject": "Échange sur vos besoins d'accompagnement scolaire / MaxiRéussite",
        "body": """Bonjour,

Je découvre votre engagement avec MaxiRéussite pour accompagner les élèves et soutenir la réussite scolaire dans nos départements d'Outre-mer.

Chez Domtom Connect, nous accompagnons les entreprises et porteurs de projets ultramarins afin de les aider à répondre concrètement à leurs différentes problématiques de développement, d'organisation ou de gestion.

Dans votre activité aujourd'hui, quels sont vos principaux besoins ou les sujets qui vous demandent le plus d'énergie ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse pour échanger des solutions et créer des synergies utiles.

Seriez-vous partant pour un court appel de dix minutes cette semaine pour faire connaissance et parler de vos priorités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche Du Sens O Eveils",
        "email": "dusensoeveils@outlook.com",
        "territory": "Guadeloupe (Le Gosier)",
        "source": "Annuaire vérifié Petite Enfance Guadeloupe",
        "subject": "Échange sur vos priorités d'éveil et accueil en crèche / Du Sens O Eveils",
        "body": """Bonjour,

Bravo pour votre investissement quotidien au Gosier au sein de la micro-crèche Du Sens O Eveils au service des tout-petits et des familles guadeloupéennes.

Chez Domtom Connect, nous accompagnons les dirigeants de structures et porteurs de projets dans nos îles afin de les aider à surmonter leurs problématiques de gestion d'équipe, de matériel ou d'organisation.

Dans votre quotidien de structure d'accueil, quel est le besoin majeur ou le défi qui sollicite le plus vos ressources en ce moment ?

Par ailleurs, notre mission est de développer un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp réunissant des responsables de structures et des utilisateurs de notre application DTC Pulse pour nous entraider concrètement.

Pourrions-nous caler un court échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche Du Sens O Pluriels",
        "email": "dusensopluriels@gmail.com",
        "territory": "Guadeloupe (Le Gosier)",
        "source": "Annuaire vérifié Petite Enfance Guadeloupe",
        "subject": "Échange sur vos besoins d'accueil en crèche / Du Sens O Pluriels",
        "body": """Bonjour,

Félicitations pour le cadre bienveillant et stimulant que vous proposez chaque jour aux jeunes enfants au sein de Du Sens O Pluriels au Gosier.

Avec Domtom Connect, nous accompagnons les gestionnaires et entrepreneurs ultramarins pour les aider à répondre à leurs différentes problématiques de pilotage, de continuité de service et de recrutement.

Dans la gestion de votre établissement aujourd'hui, quels sont vos besoins prioritaires ou les sujets qui vous prennent le plus de temps ?

Par ailleurs, notre objectif est de bâtir un réseau fort entre les Caraïbes, le continent africain et sa diaspora. Nous réunissons des porteurs de projets et utilisateurs de notre application mobile DTC Pulse dans un groupe WhatsApp d'entraide pour partager des solutions.

Seriez-vous ouverts à un court appel de dix minutes cette semaine pour échanger simplement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Crèche Evanoë",
        "email": "avanoe971@gmail.com",
        "territory": "Guadeloupe (Le Gosier)",
        "source": "Annuaire officiel des crèches de Guadeloupe",
        "subject": "Échange sur vos réalités d'accueil des tout-petits / Crèche Evanoë",
        "body": """Bonjour,

Je tiens à saluer votre travail avec la Crèche Evanoë pour accompagner l'épanouissement des tout-petits et soulager les familles au Gosier.

Chez Domtom Connect, nous accompagnons les entreprises et structures de terrain dans nos territoires pour les aider à résoudre leurs problématiques opérationnelles, administratives et logistiques.

Dans votre exploitation quotidienne, quelle est la contrainte principale ou le besoin qui mobilise le plus votre énergie actuellement ?

Par ailleurs, notre ambition est de créer un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp regroupant des acteurs engagés et des utilisateurs de notre application mobile DTC Pulse afin de créer des synergies utiles.

Serait-il possible de convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MAM Soleil d'Enfance",
        "email": "mamsoleildenfant@gmail.com",
        "territory": "Guadeloupe (Le Gosier)",
        "source": "Registre petite enfance Guadeloupe",
        "subject": "Échange sur vos priorités en accueil de la petite enfance / MAM Soleil d'Enfance",
        "body": """Bonjour,

Bravo pour votre engagement au sein de la Maison d'Assistantes Maternelles Soleil d'Enfance au Gosier, offrant une alternative chaleureuse pour la garde des jeunes enfants.

Avec Domtom Connect, nous accompagnons les professionnels et porteurs d'initiatives locales pour les aider à faire face à leurs problématiques quotidiennes d'organisation et de gestion.

Dans votre quotidien d'accueil, quel est le besoin essentiel ou la difficulté pratique qui pèse le plus sur votre organisation ?

Par ailleurs, nous bâtissons un réseau fort entre les Caraïbes, l'Afrique et la diaspora. Nous animons un groupe WhatsApp réunissant des dirigeants et utilisateurs de notre application DTC Pulse pour partager des conseils et rompre l'isolement.

Accepteriez-vous un court appel de dix minutes selon vos créneaux pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Micro-crèche Les Petites Pépites",
        "email": "lpp97180@gmail.com",
        "territory": "Guadeloupe (Sainte-Anne)",
        "source": "Registre des structures petite enfance Guadeloupe",
        "subject": "Échange sur vos besoins en micro-crèche à Sainte-Anne / Les Petites Pépites",
        "body": """Bonjour,

Félicitations pour l'accueil bienveillant et sécurisant que vous apportez aux tout-petits au sein des Petites Pépites à Sainte-Anne.

Chez Domtom Connect, nous accompagnons les structures de proximité et dirigeants ultramarins afin de les aider à surmonter leurs problématiques de fonctionnement et d'approvisionnement en matériel d'éveil.

Dans votre activité aujourd'hui, quels sont vos plus grands besoins ou les sujets qui vous demandent le plus d'efforts au quotidien ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp regroupant des gestionnaires et utilisateurs de notre application DTC Pulse pour échanger des solutions directes.

Seriez-vous partants pour un bref échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Maia Village",
        "email": "infos@maiavillage.com",
        "territory": "Guyane (Matoury)",
        "source": "https://maiavillage.fr",
        "subject": "Échange sur vos enjeux de développement petite enfance / Maia Village",
        "body": """Bonjour,

Le réseau d'accueil petite enfance déployé par Maia Village en Guyane accomplit une mission de premier plan pour répondre aux besoins immenses des familles locales.

Chez Domtom Connect, nous accompagnons les entreprises et organisations ultramarines afin de les aider à répondre concrètement à leurs problématiques de gestion d'équipe, de logistique et d'infrastructure.

Dans le développement de votre réseau aujourd'hui, quel est le besoin prioritaire ou le point de blocage qui mobilise le plus votre attention ?

Par ailleurs, notre ambition est de créer un réseau fort reliant les Caraïbes, l'Afrique et la diaspora. Nous réunissons des dirigeants et utilisateurs de notre application mobile DTC Pulse dans un groupe WhatsApp d'entraide pour partager des opportunités.

Pourrions-nous convenir d'un court entretien téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les P'tites Bouilles",
        "email": "contact@lesptitesbouilles-guyane.fr",
        "territory": "Guyane (Cayenne)",
        "source": "https://lesptitesbouilles-guyane.fr",
        "subject": "Échange sur vos réalités d'accueil en crèche à Cayenne / Les P'tites Bouilles",
        "body": """Bonjour,

Bravo pour la qualité d'accueil que vous assurez à Cayenne à travers la micro-crèche de Stanis et la crèche de Noha au service des tout-petits guyanais.

Avec Domtom Connect, nous accompagnons les dirigeants de structures locales pour les aider à résoudre leurs différentes problématiques de recrutement, de régulation quotidienne et d'organisation.

Dans votre exploitation aujourd'hui, quels sont vos besoins les plus pressants ou les difficultés qui vous prennent le plus de temps ?

Par ailleurs, nous développons un réseau fort reliant la Guyane, les Caraïbes, l'Afrique et la diaspora. Nous animons un groupe WhatsApp regroupant des porteurs de projets et utilisateurs de notre application mobile DTC Pulse pour s'entraider efficacement.

Serait-il possible de caler un court appel de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "PLB Éditions",
        "email": "contact@plbeditions.com",
        "territory": "Guadeloupe (Le Gosier)",
        "source": "https://plbeditions.com",
        "subject": "Échange sur vos besoins d'édition jeunesse et contes / PLB Éditions",
        "body": """Cher Thierry Petit le Brun,

Je salue le remarquable travail accompli par PLB Éditions au Gosier pour enrichir la littérature caribéenne, les contes traditionnels et les livres illustrés pour les enfants de nos îles.

Chez Domtom Connect, nous accompagnons les entreprises et éditeurs ultramarins pour les aider à surmonter leurs problématiques de transport maritime, de distribution et de visibilité.

Dans votre activité éditoriale actuellement, quel est le besoin majeur ou le chantier qui réclame le plus de ressources de votre côté ?

Par ailleurs, notre démarche vise à bâtir un réseau fort entre les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp réunissant des créateurs, entrepreneurs et utilisateurs de notre application DTC Pulse pour créer des synergies.

Auriez-vous dix minutes cette semaine pour un court échange téléphonique informel ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "École Maternelle La Coccinelle",
        "email": "lacoccinelle.sxm@gmail.com",
        "territory": "Saint-Martin (Marigot)",
        "source": "Annuaire officiel des écoles privées de Saint-Martin",
        "subject": "Échange sur vos besoins éducatifs à Saint-Martin / La Coccinelle",
        "body": """Bonjour,

Bravo pour votre engagement quotidien auprès des jeunes enfants de Saint-Martin au sein de l'école maternelle La Coccinelle.

Chez Domtom Connect, nous accompagnons les structures éducatives et porteurs de projets dans nos îles afin de les aider à répondre à leurs différentes problématiques de ressources, de matériel et de gestion.

Dans votre quotidien d'école, quels sont aujourd'hui vos principaux besoins ou les défis organisationnels qui vous sollicitent le plus ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous réunissons des acteurs de terrain et utilisateurs de notre application mobile DTC Pulse au sein d'un groupe WhatsApp pour échanger des solutions.

Seriez-vous partants pour un court appel de dix minutes ces prochains jours afin d'évoquer vos priorités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Kazajeux",
        "email": "kazajeux@gmail.com",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://kazajeux.fr",
        "subject": "Échange sur vos besoins et jeux éducatifs en Martinique / Kazajeux",
        "body": """Bonjour,

Félicitations pour votre passion communicative et votre travail formidable avec Kazajeux à Fort-de-France pour animer le jeu de société et le ludo-éducatif auprès des familles martiniquaises.

Chez Domtom Connect, nous accompagnons les commerçants et entrepreneurs péi pour les aider à faire face à leurs problématiques d'approvisionnement maritime, de gestion de stocks et d'animation commerciale.

Dans votre activité aujourd'hui, quel est le besoin prioritaire ou la contrainte logistique qui pèse le plus sur votre quotidien ?

Par ailleurs, nous mettons en place un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp regroupant des commerçants, créateurs et utilisateurs de notre application mobile DTC Pulse pour partager de l'entraide concrète.

Pourrions-nous convenir d'un court échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Librairie Générale Jasor",
        "email": "contact@librairiegenerale.fr",
        "territory": "Guadeloupe (Pointe-à-Pitre / Baie-Mahault)",
        "source": "Site officiel Librairie Générale",
        "subject": "Échange sur vos priorités dans le livre scolaire et jeunesse / Jasor",
        "body": """Bonjour,

La Librairie Générale Jasor est une institution incontournable en Guadeloupe pour la diffusion de la culture, des manuels scolaires et des livres jeunesse qui accompagnent nos enfants.

Avec Domtom Connect, nous accompagnons les entreprises et acteurs culturels de nos territoires pour les aider à répondre à leurs problématiques d'approvisionnement, de logistique et de relation clients.

Dans votre activité actuellement, quel est le besoin le plus marquant ou le défi d'organisation qui mobilise le plus votre énergie ?

Par ailleurs, notre ambition est de créer un réseau fort entre les Caraïbes, l'Afrique et la diaspora. Nous réunissons des dirigeants d'entreprises et utilisateurs de notre application mobile DTC Pulse dans un groupe WhatsApp pour développer des collaborations directes.

Seriez-vous disponibles pour un court entretien téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Librairie Kazabul",
        "email": "librairie@kazabulmartinique.fr",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://kazabulmartinique.fr",
        "subject": "Échange sur vos besoins dans le livre jeunesse et BD / Kazabul",
        "body": """Bonjour,

Bravo pour l'espace culturel magnifique que vous faites vivre avec Kazabul à Fort-de-France, particulièrement pour la valorisation de la bande dessinée, du livre jeunesse et de l'imaginaire caribéen.

Chez Domtom Connect, nous accompagnons les acteurs économiques et culturels ultramarins afin de les aider à surmonter leurs problématiques de transport, de rotation de fonds et de visibilité.

Dans votre quotidien de librairie, quel est aujourd'hui votre principal besoin ou le sujet qui vous prend le plus de temps ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp rassemblant des créateurs, libraires et utilisateurs de notre application DTC Pulse pour mutualiser des solutions.

Auriez-vous dix minutes pour un bref échange téléphonique informel ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Lettres d'Amazonie / Cas'à Bulles",
        "email": "librairies@lettres-amazonie.fr",
        "territory": "Guyane (Cayenne)",
        "source": "Annuaire officiel librairies Guyane",
        "subject": "Échange sur vos priorités d'édition et librairie jeunesse / Lettres d'Amazonie",
        "body": """Bonjour,

Je salue votre engagement remarquable avec Lettres d'Amazonie et Cas'à Bulles à Cayenne pour rendre accessibles la littérature jeunesse, les albums illustrés et la BD au public guyanais.

Chez Domtom Connect, nous accompagnons les entreprises et acteurs du livre en Outre-mer pour les aider à faire face à leurs problématiques logistiques, de délais maritimes et de distribution.

Dans votre exploitation aujourd'hui, quelle est la contrainte principale ou le besoin qui pèse le plus sur votre fonctionnement ?

Par ailleurs, nous développons un réseau fort reliant la Guyane, les Caraïbes, l'Afrique et la diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants et utilisateurs de notre application DTC Pulse pour échanger des contacts et des solutions.

Serait-il possible de caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Nomany Cré'action",
        "email": "nomanycreaction@gmail.com",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "Annuaire petite enfance Baie-Mahault",
        "subject": "Échange sur vos besoins en micro-crèche à Moudong / Nomany Cré'action",
        "body": """Bonjour,

Félicitations pour le travail accompli par Nomany Cré'action à Moudong Sud pour accueillir les jeunes enfants et faciliter le quotidien des familles actives de Baie-Mahault.

Avec Domtom Connect, nous accompagnons les dirigeants de structures petite enfance afin de les aider à répondre à leurs différentes problématiques de recrutement, de conformité et d'organisation pratique.

Dans votre gestion quotidienne, quel est le besoin majeur ou le défi qui réclame le plus de soutien actuellement ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp réunissant des responsables locaux et des utilisateurs de notre application DTC Pulse pour s'entraider concrètement.

Accepteriez-vous un court point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Enfants Harmonie",
        "email": "enfants.harmoniepbb@gmail.com",
        "territory": "Martinique (Le Marin)",
        "source": "Annuaire Petite Enfance Martinique",
        "subject": "Échange sur vos priorités d'accueil en crèche au Marin / Enfants Harmonie",
        "body": """Bonjour,

Bravo pour l'engagement d'Enfants Harmonie au Marin pour offrir un accueil bienveillant et sécurisé aux tout-petits dans le sud de la Martinique.

Chez Domtom Connect, nous accompagnons les structures d'accueil et gestionnaires insulaires pour les aider à surmonter leurs problématiques de planning, d'approvisionnement et de gestion d'équipe.

Dans votre quotidien de crèche, quel est aujourd'hui votre besoin prioritaire ou la contrainte qui vous mobilise le plus ?

Par ailleurs, nous créons un réseau fort reliant les Caraïbes, l'Afrique et la diaspora. Nous mettons en place un groupe WhatsApp regroupant des gestionnaires et utilisateurs de notre application mobile DTC Pulse pour partager conseils et bonnes pratiques.

Seriez-vous partants pour un court appel de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Petits Sourires",
        "email": "contact@lespetitssourires.fr",
        "territory": "Guyane (Matoury)",
        "source": "https://lespetitssourires.fr",
        "subject": "Échange sur vos besoins en micro-crèche à Matoury / Les Petits Sourires",
        "body": """Bonjour,

Je tiens à saluer l'initiative des Petits Sourires à Matoury pour accompagner le développement harmonieux et le bien-être des jeunes enfants en Guyane.

Chez Domtom Connect, nous accompagnons les porteurs de projets et dirigeants de structures d'accueil pour les aider à répondre concrètement à leurs problématiques d'exploitation et de ressources humaines.

Dans le fonctionnement de votre micro-crèche, quels sont vos besoins essentiels ou les freins que vous souhaiteriez débloquer ?

Par ailleurs, notre objectif est de développer un réseau fort reliant la Guyane, les Caraïbes, l'Afrique et la diaspora. Nous animons un groupe WhatsApp réunissant des responsables de terrain et utilisateurs de notre application DTC Pulse pour nous soutenir mutuellement.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Domicours Guadeloupe",
        "email": "domicours.abymes@gmail.com",
        "territory": "Guadeloupe (Les Abymes)",
        "source": "Annuaire des services scolaires Guadeloupe",
        "subject": "Échange sur vos besoins en soutien scolaire / Domicours Guadeloupe",
        "body": """Bonjour,

Bravo pour le travail mené par Domicours aux Abymes pour accompagner les élèves guadeloupéens vers la réussite et reprendre confiance dans leurs apprentissages.

Avec Domtom Connect, nous accompagnons les entreprises et organismes éducatifs de nos îles afin de les aider à faire face à leurs problématiques de recrutement d'enseignants, de visibilité et d'organisation.

Dans votre activité aujourd'hui, quel est le besoin majeur ou le sujet qui vous demande le plus d'énergie ?

Par ailleurs, notre ambition est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous réunissons des acteurs éducatifs et utilisateurs de notre application mobile DTC Pulse sur un groupe WhatsApp d'entraide pour créer des passerelles.

Seriez-vous ouvert à un court appel de dix minutes cette semaine pour échanger simplement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Mental'O Antilles",
        "email": "sandsaintg@gmail.com",
        "territory": "Caraïbes (Guadeloupe, Martinique)",
        "source": "https://mental-o.fr",
        "subject": "Échange sur vos priorités d'accompagnement des jeunes / Mental'O",
        "body": """Chère Sandra Saint Germain,

Je salue votre démarche avec Mental'O aux Antilles pour guider les jeunes et leurs familles dans leur orientation et le développement de méthodes de travail adaptées.

Chez Domtom Connect, nous accompagnons les professionnels et indépendants ultramarins afin de les aider à surmonter leurs problématiques de mise en réseau, de visibilité et de gestion du temps.

Dans votre pratique quotidienne, quels sont aujourd'hui vos principaux besoins ou les axes de développement que vous privilégiez ?

Par ailleurs, nous créons un réseau fort reliant les Caraïbes, l'Afrique et la diaspora. Nous mettons en place un groupe WhatsApp regroupant des spécialistes de l'accompagnement et des utilisateurs de notre application mobile DTC Pulse pour échanger des contacts qualifiés.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MAM Kaz A Ti Doudou",
        "email": "kazatidoudou@yahoo.com",
        "territory": "Guadeloupe (Les Abymes)",
        "source": "Registre petite enfance Guadeloupe",
        "subject": "Échange sur vos priorités d'accueil des tout-petits / Kaz A Ti Doudou",
        "body": """Bonjour,

Félicitations pour l'accueil chaleureux que vous proposez aux jeunes enfants au sein de la Maison d'Assistantes Maternelles Kaz A Ti Doudou aux Abymes.

Chez Domtom Connect, nous accompagnons les structures de terrain et professionnelles de la petite enfance pour les aider à répondre à leurs différentes problématiques de gestion et de logistique quotidienne.

Dans votre activité d'accueil, quel est le besoin essentiel ou la difficulté organisationnelle qui pèse le plus sur votre temps ?

Par ailleurs, notre mission est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp regroupant des acteurs engagés et des utilisateurs de notre application DTC Pulse pour partager de l'entraide concrète.

Accepteriez-vous un court échange téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # ==========================
    # 20 CIBLES CONTINENT AFRICAIN
    # ==========================
    {
        "company": "EDTECH CASE",
        "email": "info@edtechcase.com",
        "territory": "Côte d'Ivoire (Abidjan)",
        "source": "https://edtechcase.com",
        "subject": "Échange sur vos besoins d'innovation éducative / EDTECH CASE",
        "body": """Bonjour,

Je découvre votre initiative avec EDTECH CASE à Abidjan pour concevoir des technologies et des méthodes pédagogiques adaptées aux défis éducatifs actuels.

Chez Domtom Connect, nous accompagnons les entreprises et porteurs de projets dans leurs problématiques de structuration, de partenariats et d'expansion territoriale.

Dans le développement de votre solution aujourd'hui, quels sont vos principaux besoins ou les freins que vous cherchez à lever ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants et utilisateurs de notre application mobile DTC Pulse pour accélérer les coopérations directes.

Seriez-vous partants pour un court appel de dix minutes cette semaine pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "EDC Sénégal",
        "email": "contact@edcsenegal.sn",
        "territory": "Sénégal (Dakar)",
        "source": "https://edcsenegal.sn",
        "subject": "Échange sur vos priorités d'apprentissage des jeunes / EDC Sénégal",
        "body": """Bonjour,

Bravo pour l'engagement d'EDC Sénégal à Dakar pour promouvoir l'éducation de base, les compétences pratiques et l'apprentissage des jeunes générations.

Avec Domtom Connect, nous accompagnons les organisations et porteurs de projets pour les aider à répondre concrètement à leurs problématiques d'organisation, de suivi de programmes et de mobilisation de partenaires.

Dans vos actions actuelles sur le terrain, quel est le besoin prioritaire ou le sujet qui requiert le plus de soutien ?

Par ailleurs, nous développons un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous animons un groupe WhatsApp regroupant des acteurs engagés et des utilisateurs de notre application DTC Pulse pour partager expertises et solutions.

Pourrions-nous bloquer un court créneau de dix minutes pour échanger par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Educautisme Dakar",
        "email": "bilal.faye@educautismeofficiel.sn",
        "territory": "Sénégal (Dakar)",
        "source": "https://educautismeofficiel.sn",
        "subject": "Échange sur l'accompagnement des enfants à besoins spécifiques / Educautisme",
        "body": """Cher Bilal Faye,

Je tiens à saluer votre mission remarquable avec Educautisme à Dakar pour offrir un cadre éducatif adapté et bienveillant aux enfants autistes et à leurs familles.

Chez Domtom Connect, nous accompagnons les structures et professionnels de terrain pour les aider à surmonter leurs problématiques de matériel adapté, de formation et de sensibilisation.

Dans votre quotidien d'accompagnement spécialisé, quels sont aujourd'hui vos besoins les plus urgents ou les freins qui mobilisent le plus votre énergie ?

Par ailleurs, notre ambition est de créer un réseau fort reliant l'Afrique, les Caraïbes et la diaspora. Nous réunissons des porteurs d'initiatives à fort impact et des utilisateurs de notre application DTC Pulse sur un groupe WhatsApp d'entraide.

Seriez-vous ouvert à un court entretien de dix minutes ces prochains jours pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Enko Education",
        "email": "waca@enkoeducation.com",
        "territory": "Panafricain (Dakar, Abidjan, Yaoundé)",
        "source": "https://enkoeducation.com",
        "subject": "Échange sur vos enjeux de développement scolaire international / Enko Education",
        "body": """Bonjour,

La trajectoire d'Enko Education pour démocratiser l'accès aux standards éducatifs internationaux à travers le continent africain est particulièrement inspirante.

Chez Domtom Connect, nous accompagnons les dirigeants et structures de formation pour les aider à répondre à leurs problématiques d'expansion multi-pays, de visibilité et d'organisation opérationnelle.

Dans vos priorités actuelles pour l'Afrique de l'Ouest et du Centre, quel est le chantier majeur ou le besoin qui mobilise le plus vos équipes ?

Par ailleurs, notre mission est de bâtir un réseau fort reliant le continent africain, les Caraïbes et sa diaspora. Nous animons un groupe WhatsApp réunissant des dirigeants d'entreprises et utilisateurs de notre application DTC Pulse afin de créer des passerelles d'affaires.

Pourrions-nous convenir d'un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Maison Cerise Abidjan",
        "email": "maisoncerise.abidjan@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Riviera)",
        "source": "https://maisonceriseabidjan.com",
        "subject": "Échange sur vos priorités d'accueil petite enfance / Maison Cerise",
        "body": """Bonjour,

Félicitations pour le cadre chaleureux et stimulant que vous offrez aux tout-petits au sein de Maison Cerise à la Riviera Bonoumin à Abidjan.

Avec Domtom Connect, nous accompagnons les directeurs d'établissements et entrepreneurs pour les aider à résoudre leurs différentes problématiques de gestion des équipes, d'approvisionnement et de relation parents.

Dans votre exploitation quotidienne, quel est le besoin essentiel ou la difficulté organisationnelle qui vous prend le plus de temps ?

Par ailleurs, nous développons un réseau fort reliant l'Afrique, les Caraïbes et la diaspora. Nous mettons en place un groupe WhatsApp regroupant des gestionnaires de structures et utilisateurs de notre application DTC Pulse pour s'entraider concrètement.

Serait-il possible de caler un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "École Maternelle Les Tournesols",
        "email": "contact@lestournesols.ci",
        "territory": "Côte d'Ivoire (Abidjan Riviera Golf)",
        "source": "https://lestournesols.ci",
        "subject": "Échange sur vos besoins éducatifs en maternelle / Les Tournesols",
        "body": """Bonjour,

Bravo à l'équipe des Tournesols à Riviera Golf pour votre engagement constant à faire grandir et s'épanouir les jeunes enfants dans un environnement sécurisant.

Chez Domtom Connect, nous accompagnons les structures scolaires et porteurs de projets pour les aider à répondre à leurs problématiques de ressources pédagogiques et d'organisation continue.

Dans votre gestion d'école aujourd'hui, quels sont vos principaux besoins ou les sujets qui vous demandent le plus d'énergie ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous réunissons des acteurs de terrain et utilisateurs de notre application DTC Pulse dans un groupe WhatsApp pour échanger des solutions utiles.

Seriez-vous partants pour un court échange de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Le Nid de Cocody",
        "email": "info@lenidecocody.com",
        "territory": "Côte d'Ivoire (Abidjan Cocody)",
        "source": "https://lenidecocody.com",
        "subject": "Échange sur vos priorités d'accueil en crèche / Le Nid de Cocody",
        "body": """Bonjour,

Je tiens à saluer le travail réalisé par Le Nid de Cocody pour accompagner les premiers pas et l'éveil des tout-petits avec bienveillance à Abidjan.

Chez Domtom Connect, nous accompagnons les gestionnaires de structures petite enfance afin de les aider à surmonter leurs problématiques administratives, d'encadrement et de logistique.

Dans votre quotidien de directrice ou directeur, quel est actuellement votre besoin prioritaire ou le défi managérial qui pèse le plus ?

Par ailleurs, nous animons un réseau fort reliant le continent africain, les Caraïbes et la diaspora, soutenu par un groupe WhatsApp et notre application mobile DTC Pulse pour partager de bonnes pratiques.

Pourrions-nous convenir d'un court point téléphonique de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Nid d'Or Crèches",
        "email": "niddorsipim4@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Palmeraie)",
        "source": "https://niddorcreches.com",
        "subject": "Échange sur vos besoins en crèche à la Palmeraie / Nid d'Or",
        "body": """Bonjour,

Félicitations pour la qualité d'encadrement et d'éveil offerte aux jeunes enfants au sein de la crèche Nid d'Or à la Riviera Palmeraie.

Avec Domtom Connect, nous accompagnons les responsables d'établissements petite enfance pour les aider à faire face à leurs problématiques quotidiennes de planning, de fournitures et d'organisation.

Dans le fonctionnement de votre crèche, quel est le besoin majeur ou le sujet qui sollicite le plus vos ressources en ce moment ?

Par ailleurs, notre mission est de développer un réseau fort reliant l'Afrique, les Caraïbes et la diaspora. Nous réunissons des dirigeants et utilisateurs de notre application mobile DTC Pulse dans un groupe WhatsApp d'entraide pour créer des synergies.

Accepteriez-vous un court appel informel de dix minutes d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Crèche & Maternelle Beldo",
        "email": "contact@beldo.sn",
        "territory": "Sénégal (Dakar Point E)",
        "source": "https://beldo.sn",
        "subject": "Échange sur vos priorités petite enfance au Point E / Beldo",
        "body": """Bonjour,

Bravo pour l'espace d'éveil et d'apprentissage que vous faites vivre au Point E avec la crèche et maternelle Beldo au service des familles dakarroises.

Chez Domtom Connect, nous accompagnons les entreprises et directeurs d'écoles pour les aider à répondre concrètement à leurs problématiques de fonctionnement et d'accueil.

Dans votre quotidien d'établissement, quels sont aujourd'hui vos principaux besoins ou les freins matériels et organisationnels que vous rencontrez ?

Par ailleurs, notre ambition est de bâtir un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous animons un groupe WhatsApp réunissant des acteurs engagés et utilisateurs de notre application DTC Pulse pour partager conseils et opportunités.

Serait-il possible de caler un court entretien de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "École Française des Almadies",
        "email": "directrice.lefda@gmail.com",
        "territory": "Sénégal (Dakar Almadies)",
        "source": "https://ecolefrancaisedakaralmadies.net",
        "subject": "Échange sur vos priorités éducatives aux Almadies / EFDA",
        "body": """Chère Madame la Directrice,

Je salue la rigueur et la qualité d'encadrement assurées par l'École Française des Almadies auprès des jeunes élèves dans le quartier des Almadies à Dakar.

Chez Domtom Connect, nous accompagnons les responsables éducatifs et porteurs de projets afin de les aider à lever leurs contraintes logistiques et de coordination.

Dans le pilotage de votre école actuellement, quel est le besoin prépondérant ou le sujet d'organisation qui mobilise le plus votre énergie ?

Par ailleurs, nous développons un réseau fort reliant l'Afrique, les Caraïbes et la diaspora. Nous mettons en place un groupe WhatsApp regroupant des acteurs de l'éducation et utilisateurs de notre application mobile DTC Pulse pour échanger des passerelles utiles.

Auriez-vous dix minutes ces prochains jours pour un bref appel téléphonique ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Editions Or",
        "email": "info@editionsor.net",
        "territory": "Côte d'Ivoire (Abidjan Cocody)",
        "source": "https://editionsor.net",
        "subject": "Échange sur vos besoins dans le livre jeunesse et éducation / Éditions Or",
        "body": """Bonjour,

Félicitations pour le catalogue engagé développé par Éditions Or à Abidjan pour accompagner l'éducation, la lecture et l'éveil des enfants et adolescents.

Avec Domtom Connect, nous accompagnons les éditeurs et acteurs culturels afin de les aider à répondre à leurs problématiques d'impression, de distribution et de visibilité panafricaine.

Dans votre activité d'édition aujourd'hui, quel est le besoin majeur ou le point de blocage qui pèse le plus sur votre croissance ?

Par ailleurs, notre objectif est de créer un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous réunissons des éditeurs et utilisateurs de notre application DTC Pulse au sein d'un groupe WhatsApp pour nouer des partenariats concrets.

Seriez-vous partant pour un court échange de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Éditions du Makri",
        "email": "leseditionsdumakri@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Angré)",
        "source": "https://editionsmakri.com",
        "subject": "Échange sur vos priorités d'édition pour la jeunesse / Éditions du Makri",
        "body": """Bonjour,

Bravo pour votre investissement avec Les Éditions du Makri à Abidjan pour faire vivre la littérature jeunesse et donner aux enfants le goût de la lecture à travers des récits qui les inspirent.

Chez Domtom Connect, nous accompagnons les créateurs et entrepreneurs pour les aider à surmonter leurs problématiques de commercialisation, de diffusion et de gestion opérationnelle.

Dans vos chantiers éditoriaux actuels, quels sont vos plus grands besoins ou les freins que vous souhaiteriez surmonter ?

Par ailleurs, nous bâtissons un réseau fort reliant l'Afrique, les Caraïbes et la diaspora. Nous animons un groupe WhatsApp regroupant des porteurs de projets et utilisateurs de notre application DTC Pulse pour partager solutions et contacts.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Éditions Supernova",
        "email": "info@editionsupernova.com",
        "territory": "Côte d'Ivoire (Abidjan Yopougon)",
        "source": "https://editionsupernova.com",
        "subject": "Échange sur vos besoins dans le livre jeunesse et pédagogique / Supernova",
        "body": """Bonjour,

Je salue le dynamisme des Éditions Supernova à Abidjan pour enrichir l'offre de livres jeunesse et éducatifs au service de l'éveil intellectuel de nos enfants.

Chez Domtom Connect, nous accompagnons les entreprises et acteurs du livre pour les aider à répondre concrètement à leurs problématiques de distribution et de développement.

Dans votre exploitation aujourd'hui, quelle est la contrainte principale ou le besoin qui mobilise le plus votre attention ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants et utilisateurs de notre application mobile DTC Pulse pour créer des synergies d'affaires.

Seriez-vous disponibles pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "BK Éditions",
        "email": "bkeditions@gmail.com",
        "territory": "Côte d'Ivoire (Abidjan Angré)",
        "source": "https://bkeditions.org",
        "subject": "Échange sur vos priorités d'édition et livres pour enfants / BK Éditions",
        "body": """Bonjour,

Bravo pour l'engagement de BK Éditions à Abidjan pour proposer des livres jeunesse et des ouvrages de référence qui nourrissent l'imaginaire des plus jeunes.

Avec Domtom Connect, nous accompagnons les éditeurs et porteurs de projets culturels afin de les aider à lever leurs freins logistiques et commerciaux.

Dans votre activité actuellement, quel est le besoin prioritaire ou le sujet qui vous demande le plus d'énergie ?

Par ailleurs, nous développons un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous animons un groupe WhatsApp regroupant des entrepreneurs et utilisateurs de notre application DTC Pulse pour s'entraider concrètement.

Auriez-vous dix minutes pour un bref échange téléphonique informel d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Montessori Kids Academy Douala",
        "email": "contact@montessorikidsacademy-douala.com",
        "territory": "Cameroun (Douala)",
        "source": "https://montessorikidsacademy-douala.com",
        "subject": "Échange sur vos besoins en pédagogie Montessori à Douala / Kids Academy",
        "body": """Bonjour,

Félicitations pour votre démarche pionnière avec Montessori Kids Academy à Douala afin de proposer une pédagogie respectueuse du rythme et de l'autonomie des enfants au Cameroun.

Chez Domtom Connect, nous accompagnons les structures d'enseignement et directeurs d'écoles pour les aider à répondre à leurs problématiques de matériel didactique, d'organisation et de formation continue.

Dans votre quotidien d'école, quels sont aujourd'hui vos principaux besoins ou les défis pratiques qui mobilisent le plus vos ressources ?

Par ailleurs, notre mission est de bâtir un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous réunissons des éducateurs et utilisateurs de notre application DTC Pulse sur un groupe WhatsApp d'entraide pour partager de bonnes pratiques.

Serait-il possible de caler un court appel de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "La Crèche des Merveilles Bastos",
        "email": "contact@lacrechedesmerveilles.com",
        "territory": "Cameroun (Yaoundé Bastos)",
        "source": "https://lacrechedesmerveilles.com",
        "subject": "Échange sur vos priorités d'accueil petite enfance à Bastos / Crèche des Merveilles",
        "body": """Bonjour,

Bravo pour l'accueil soigné et l'environnement sécurisant que vous offrez aux tout-petits au sein de La Crèche des Merveilles dans le quartier de Bastos à Yaoundé.

Avec Domtom Connect, nous accompagnons les gestionnaires de crèches et structures d'accueil pour les aider à surmonter leurs problématiques de planning, d'approvisionnement et de gestion d'équipe.

Dans votre fonctionnement quotidien, quel est le besoin essentiel ou la difficulté organisationnelle qui vous prend le plus de temps ?

Par ailleurs, nous développons un réseau fort reliant l'Afrique, les Caraïbes et la diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants d'établissements et utilisateurs de notre application mobile DTC Pulse pour nous entraider concrètement.

Pourrions-nous convenir d'un court point téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "École Les Ribambelles",
        "email": "directrice@ecolelesribambelles.com",
        "territory": "Cameroun (Douala)",
        "source": "https://ecolelesribambelles.com",
        "subject": "Échange sur vos réalités d'accueil scolaire et maternelle / Les Ribambelles",
        "body": """Chère Madame la Directrice,

Je tiens à saluer l'engagement éducatif de l'École Les Ribambelles à Douala pour faire grandir et épanouir les jeunes enfants dans un climat d'apprentissage de qualité.

Chez Domtom Connect, nous accompagnons les responsables d'écoles et entrepreneurs éducatifs pour les aider à répondre à leurs différentes problématiques de ressources et de pilotage.

Dans le fonctionnement de votre établissement actuellement, quel est le besoin majeur ou le point de vigilance qui mobilise le plus votre attention ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant le continent africain, les Caraïbes et sa diaspora. Nous animons un groupe WhatsApp regroupant des acteurs de terrain et utilisateurs de notre application DTC Pulse pour créer des synergies d'échange.

Seriez-vous partante pour un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Caramboles",
        "email": "info@lescaramboles.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "https://lescaramboles.com",
        "subject": "Échange sur vos priorités d'accueil des jeunes enfants / Les Caramboles",
        "body": """Bonjour,

Félicitations pour le cadre stimulant et attentif développé par Les Caramboles à Yaoundé pour accompagner les tout-petits dans leurs premiers apprentissages.

Avec Domtom Connect, nous accompagnons les gestionnaires d'établissements petite enfance afin de les aider à faire face à leurs problématiques de logistique, d'infrastructure et d'organisation pratique.

Dans votre activité quotidienne, quels sont vos besoins les plus urgents ou les freins que vous aimeriez surmonter ?

Par ailleurs, notre démarche vise à créer un réseau fort entre le continent africain, les Caraïbes et la diaspora. Nous réunissons des porteurs de projets et utilisateurs de notre application mobile DTC Pulse au sein d'un groupe WhatsApp pour partager des solutions concrètes.

Accepteriez-vous un court échange de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Canadian School of Yaoundé",
        "email": "ecolecsoy@gmail.com",
        "territory": "Cameroun (Yaoundé)",
        "source": "https://csoy.net",
        "subject": "Échange sur vos défis éducatifs et pédagogiques / Canadian School of Yaoundé",
        "body": """Bonjour,

Je salue la rigueur et l'ambition pédagogique de la Canadian School of Yaoundé pour offrir aux enfants un encadrement bilingue de haut niveau au Cameroun.

Chez Domtom Connect, nous accompagnons les structures d'enseignement et porteurs de projets pour les aider à répondre à leurs problématiques de visibilité, de partenariats et d'organisation.

Dans vos priorités actuelles d'école, quel est le besoin essentiel ou le chantier qui réclame le plus d'énergie managériale ?

Par ailleurs, nous développons un réseau fort reliant le continent africain, les Caraïbes et sa diaspora. Nous animons un groupe WhatsApp regroupant des acteurs engagés et utilisateurs de notre application DTC Pulse afin de créer des passerelles directes.

Pourrions-nous bloquer un court créneau de dix minutes pour échanger par téléphone ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "La Centrale Bilingual School",
        "email": "lacentralebilingualschool@gmail.com",
        "territory": "Cameroun (Douala)",
        "source": "Registre établissements bilingues Douala",
        "subject": "Échange sur vos besoins scolaires et bilingues à Douala / La Centrale",
        "body": """Bonjour,

Bravo pour l'engagement de La Centrale Bilingual School à Douala pour promouvoir le bilinguisme précoce et l'épanouissement des jeunes élèves camerounais.

Chez Domtom Connect, nous accompagnons les dirigeants d'écoles et entrepreneurs éducatifs afin de les aider à surmonter leurs problématiques de matériel, d'effectifs et de gestion opérationnelle.

Dans votre activité scolaire aujourd'hui, quel est le besoin prioritaire ou la difficulté qui pèse le plus sur votre quotidien ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant le continent africain, les Caraïbes et la diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants d'écoles et utilisateurs de notre application DTC Pulse pour partager de l'entraide concrète.

Seriez-vous disponibles pour un court entretien téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

print(f"Total targets: {len(LEADS)}")
print(f"Caraïbes: {len([l for l in LEADS if 'Caraïbes' in l['territory'] or 'Guadeloupe' in l['territory'] or 'Martinique' in l['territory'] or 'Guyane' in l['territory'] or 'Saint-Martin' in l['territory']])}")
print(f"Afrique: {len([l for l in LEADS if 'Côte d\'Ivoire' in l['territory'] or 'Sénégal' in l['territory'] or 'Cameroun' in l['territory'] or 'Panafricain' in l['territory']])}")
