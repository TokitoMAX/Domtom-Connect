import sys
import os
import smtplib
import time
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

TARGETS = [
    # 1. Distillerie & Terroirs
    {
        "company": "Distillerie Braud et Quennesson",
        "email": "contact@braud-quennesson.com",
        "sector": "Spiritueux & Terroirs d'Exception",
        "location": "Martinique",
        "source": "https://sud-martinique-tourisme.com",
        "subject": "Développement commercial et synergies pour la Distillerie Braud et Quennesson",
        "body": """Bonjour,

J'observe avec un grand intérêt la renaissance remarquable et la valorisation du terroir de l'Habitation Grands Fonds menées par la Distillerie Braud et Quennesson en Martinique. La recherche d'authenticité, la qualité de vos cuvées et le rayonnement de votre savoir-faire agricole constituent une véritable référence pour nos territoires.

Je vous contacte au nom de Domtom Connect, un écosystème d'affaires et d'accompagnement dédié aux entreprises des Outre-mer, d'Afrique et de leurs diasporas. Nous intervenons aux côtés des dirigeants pour répondre à leurs problématiques concrètes de structuration, de passage à l'échelle et d'accès aux marchés extérieurs.

Notre dispositif s'appuie sur le programme Tremplin, un accompagnement à 360 degrés, sur des missions de copilotage opérationnel pour soulager les équipes dirigeantes des tâches chronophages, ainsi que sur une communauté d'affaires active fédérée sur notre réseau privé.

Seriez-vous ouvert à un court échange téléphonique ou visio de quinze minutes la semaine prochaine afin de faire le point sur vos priorités actuelles ?

Vous pouvez réserver le créneau qui vous convient directement via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 2. Filao Ingénieurs Conseils
    {
        "company": "Filao Ingénieurs Conseils",
        "email": "info@filaoconseil.fr",
        "sector": "Ingénierie Environnementale & Territoires",
        "location": "Guadeloupe",
        "source": "https://www.filaoconseil.fr/contact",
        "subject": "Échange partenarial et développement pour Filao Ingénieurs Conseils",
        "body": """Bonjour,

Je suis avec beaucoup d'attention vos réalisations en matière d'ingénierie environnementale, d'aménagements durables et de gestion des ressources naturelles en Guadeloupe. Votre rigueur technique et votre capacité à accompagner la résilience de nos écosystèmes insulaires sont essentielles.

Je me permets de vous contacter au nom de Domtom Connect. Nous avons bâti un écosystème d'affaires ayant pour mission d'apporter des solutions opérationnelles aux dirigeants d'entreprises des territoires ultramarins et de leurs diasporas.

Nous proposons notamment le programme Tremplin, un accompagnement sur mesure à 360 degrés, des solutions de copilotage opérationnel pour permettre aux chefs d'entreprise de se concentrer sur leur cœur de métier, ainsi qu'un diagnostic stratégique gratuit grâce à notre outil d'anamnèse clinique.

Seriez-vous disponible pour un échange de quinze minutes la semaine prochaine afin de faire connaissance et d'étudier de possibles synergies ?

Vous pouvez choisir le moment qui vous conviendra le mieux sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 3. Biotope Caraïbes
    {
        "company": "Biotope Caraïbes",
        "email": "caraibes@biotope.fr",
        "sector": "Biodiversité, Écologie & RSE",
        "location": "Guadeloupe / Martinique",
        "source": "https://www.biotope.fr/contactez-nous",
        "subject": "Synergies territoriales et partenariats pour Biotope Caraïbes",
        "body": """Bonjour à l'équipe Biotope Caraïbes,

Votre expertise pionnière en ingénierie écologique, préservation de la biodiversité tropicale et études d'impact aux Antilles constitue une contribution majeure à la transition écologique de nos territoires.

Je vous contacte au nom de Domtom Connect. Notre organisation est un écosystème d'affaires et de mise en relation dont l'objectif est d'accompagner la montée en puissance des entreprises et acteurs stratégiques des Outre-mer, d'Afrique et de leurs diasporas.

Nous accompagnons les porteurs de projets et les organisations à travers notre programme Tremplin, du copilotage opérationnel pour fluidifier l'exécution de leurs projets, ainsi qu'un accès privilégié à notre réseau d'affaires et à notre plateforme d'échanges.

Seriez-vous disponibles pour un bref échange de quinze minutes ces prochains jours afin d'aborder vos perspectives régionales ?

Vous pouvez choisir votre créneau en toute simplicité via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 4. ECR Environnement Océan Indien
    {
        "company": "ECR Environnement Océan Indien",
        "email": "lareunion@ecr-environnement.com",
        "sector": "Ingénierie Environnementale & Géotechnique",
        "location": "La Réunion",
        "source": "https://ecr-environnement.com",
        "subject": "Échange stratégique et synergies pour ECR Environnement Océan Indien",
        "body": """Bonjour,

Je suis de près vos interventions dans l'Océan Indien dans les domaines de l'ingénierie de l'environnement, de l'aménagement du territoire et de la géotechnique. Votre capacité à répondre aux contraintes géographiques et environnementales spécifiques de La Réunion est un atout précieux.

Je vous écris au nom de Domtom Connect, un écosystème d'affaires conçu pour dynamiser et accompagner les entreprises des Outre-mer, d'Afrique et de la diaspora.

Notre structure propose un accompagnement global via le programme Tremplin, du copilotage opérationnel direct pour déléguer les processus lourds, ainsi que des outils d'analyse stratégique comme notre anamnèse clinique pour accélérer les opportunités de développement.

Seriez-vous ouvert à un rapide échange de quinze minutes la semaine prochaine afin d'évaluer de potentielles complémentarités ?

Vous pouvez retenir un créneau directement à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 5. Impact Mer
    {
        "company": "Impact Mer",
        "email": "contact@impact-mer.fr",
        "sector": "Environnement Marin & Économie Bleue",
        "location": "Martinique / Caraïbes",
        "source": "https://www.impact-mer.fr",
        "subject": "Économie bleue et synergies partenariales pour Impact Mer",
        "body": """Bonjour,

Vos travaux de référence dans l'évaluation et la préservation des milieux marins et côtiers aux Antilles sont essentiels pour préserver le patrimoine naturel et guider les projets maritimes durables.

Je vous contacte pour vous présenter l'écosystème Domtom Connect. Nous accompagnons les dirigeants et porteurs d'initiatives des territoires ultramarins et de la Caraïbe pour lever leurs blocages opérationnels et accélérer leur développement.

Nos piliers reposent sur le programme Tremplin pour un suivi complet, un service de copilotage opérationnel one-to-one pour décharger la direction des frictions administratives, et une communauté d'affaires engagée.

Seriez-vous disponible pour un échange convivial de quinze minutes la semaine prochaine pour faire le point sur vos priorités ?

Vous pouvez sélectionner un créneau selon vos disponibilités sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 6. Zone-UP Architectes Paysagistes
    {
        "company": "Zone-UP Architectes Paysagistes",
        "email": "l.bregent@zone-up.fr",
        "sector": "Architecture du Paysage & Aménagement Durable",
        "location": "La Réunion",
        "source": "https://www.zone-up.fr",
        "subject": "Développement et perspectives d'aménagement pour Zone-UP",
        "body": """Bonjour Monsieur Bregent,

J'observe avec beaucoup d'intérêt la qualité de vos projets d'architecture du paysage et d'urbanisme durable à La Réunion. Votre approche sensible des paysages insulaires et votre exigence de conception durable apportent une vraie valeur ajoutée aux espaces vivants de l'île.

Je prends contact avec vous au nom de Domtom Connect. Nous avons structuré un écosystème d'affaires dédié aux dirigeants d'entreprises et créateurs des Outre-mer et de leurs diasporas.

Nous accompagnons les structures en croissance via notre programme Tremplin, du copilotage opérationnel direct pour libérer du temps stratégique aux fondateurs, ainsi qu'un réseau d'affaires actif facilitant les coopérations territoriales.

Seriez-vous ouvert à un échange téléphonique ou visio de quinze minutes la semaine prochaine pour échanger sur vos perspectives de développement ?

Vous pouvez choisir le moment qui vous conviendra via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 7. Acrorun Élagage & Paysage
    {
        "company": "Acrorun Élagage & Paysage",
        "email": "contact@acrorunelagage.com",
        "sector": "Aménagement Paysager Tropical & Espaces Verts",
        "location": "La Réunion",
        "source": "https://acrorunelagage.com",
        "subject": "Développement opérationnel et synergies pour Acrorun Élagage",
        "body": """Bonjour,

J'observe votre parcours et votre expertise technique dans les travaux d'élagage délicats et l'entretien des espaces paysagers à La Réunion. Votre réactivité et la maîtrise des interventions en hauteur répondent à un besoin fondamental sur l'île.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement entrepreneurial dédié aux entreprises d'Outre-mer, d'Afrique et de leurs diasporas.

Notre mission est de soutenir concrètement les chefs d'entreprise dans leur gestion quotidienne, notamment par notre programme Tremplin, un service de copilotage opérationnel individualisé pour vous soulager des démarches administratives et commerciales lourdes, ainsi qu'une communauté d'entraide entre entrepreneurs.

Seriez-vous disponible pour un bref échange de quinze minutes afin de faire connaissance et d'évaluer comment nous pourrions vous épauler ?

Vous pouvez réserver votre créneau directement ici,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 8. Brasserie Sazilé
    {
        "company": "Brasserie Sazilé",
        "email": "contact@brasserie-sazile.fr",
        "sector": "Brasserie Artisanale Insulaire",
        "location": "Mayotte / Océan Indien",
        "source": "https://brasserie-sazile.fr",
        "subject": "Développement et synergies pour la Brasserie Sazilé",
        "body": """Bonjour,

Je suis avec beaucoup d'attention l'aventure de la Brasserie Sazilé et votre engagement courageux et inspirant pour développer une bière artisanale authentique et locale à Mayotte. Votre volonté de valoriser le savoir-faire brassicole dans l'Océan Indien est remarquable.

Je vous écris au nom de Domtom Connect. Nous sommes un écosystème d'affaires créé pour accompagner les entreprises et porteurs de projets d'Outre-mer, d'Afrique et de leurs diasporas face à leurs défis logistiques, commerciaux et opérationnels.

À travers notre programme Tremplin et nos missions de copilotage opérationnel, nous permettons aux dirigeants de se focaliser sur la production et la création de valeur en déléguant les aspects chronophages de leur gestion.

Seriez-vous ouvert à un échange informel de quinze minutes la semaine prochaine pour faire le point sur vos priorités actuelles ?

Vous pouvez choisir le moment le plus pratique pour vous via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 9. Brasserie Doubsis
    {
        "company": "Brasserie Doubsis",
        "email": "contact@doubsis.com",
        "sector": "Microbrasserie Artisanale Antillaise",
        "location": "Martinique",
        "source": "https://doubsis.com",
        "subject": "Développement et perspectives commerciales pour la Brasserie Doubsis",
        "body": """Bonjour,

J'observe avec grand intérêt le dynamisme de la Brasserie Doubsis et la qualité de vos créations brassicoles artisanales en Martinique. La diversité de votre gamme et votre volonté d'offrir des saveurs uniques sur le marché local illustrent parfaitement la vitalité de l'artisanat antillais.

Je vous contacte au nom de Domtom Connect. Nous avons créé cet écosystème pour accompagner les entrepreneurs ultramarins dans leur structuration, leur visibilité et leur croissance.

Nous proposons le programme Tremplin pour un pilotage à 360 degrés, du copilotage opérationnel en tête-à-tête pour vous libérer du temps de prospection et de gestion, ainsi qu'un réseau actif d'échanges d'affaires.

Seriez-vous disponible pour un court échange de quinze minutes ces prochains jours afin d'aborder vos projets d'expansion ?

Vous pouvez sélectionner un créneau à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 10. Brasserie des Couleurs
    {
        "company": "Brasserie des Couleurs",
        "email": "contact@brasseriedescouleurs.fr",
        "sector": "Bière Artisanale & Terroir Péi",
        "location": "La Réunion",
        "source": "https://brasseriedescouleurs.fr",
        "subject": "Synergies d'affaires et développement pour la Brasserie des Couleurs",
        "body": """Bonjour,

C'est avec beaucoup d'admiration que je découvre l'univers créatif et la richesse aromatique des bières artisanales de la Brasserie des Couleurs à La Réunion. Votre ancrage local et votre passion pour le brassage traditionnel constituent une belle réussite pour le terroir réunionnais.

Je vous écris pour vous faire découvrir Domtom Connect. Nous sommes un écosystème d'accompagnement dédié à soutenir la croissance des entreprises d'Outre-mer, d'Afrique et de leurs diasporas.

Nous aidons les dirigeants d'entreprises artisanales via notre programme Tremplin, du copilotage opérationnel pour fluidifier vos démarches et canaux de vente, ainsi qu'une communauté active sur notre groupe WhatsApp et notre réseau propriétaire.

Seriez-vous partant pour un rapide échange téléphonique ou visio de quinze minutes la semaine prochaine ?

Vous pouvez retenir directement votre créneau sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 11. Brasserie Gayar
    {
        "company": "Brasserie Gayar",
        "email": "contact@bieregayar.com",
        "sector": "Brasserie Artisanale Locale",
        "location": "La Réunion",
        "source": "https://bieregayar.com",
        "subject": "Échange convivial et opportunités pour la Brasserie Gayar",
        "body": """Bonjour,

Je tiens à saluer l'esprit festif, l'identité péi assumée et la qualité des recettes proposées par la Brasserie Gayar à La Réunion. Votre travail pour démocratiser la craft beer locale avec fierté et caractère est un superbe modèle d'entrepreneuriat insulaire.

Je me présente, Loïc Villeronce, fondateur de Domtom Connect. Notre vocation est d'apporter un soutien stratégique et opérationnel concret aux dirigeants d'entreprises ultramarines.

À travers notre programme Tremplin, notre assistance en copilotage opérationnel direct et notre communauté d'affaires, nous aidons les chefs d'entreprise à lever leurs contraintes matérielles ou logistiques pour se concentrer sur leur croissance.

Seriez-vous ouvert à un échange informel de quinze minutes la semaine prochaine afin d'échanger sur vos projets actuels ?

Vous pouvez bloquer un créneau directement via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 12. Brasserie de l'Ouest Ti Mouss
    {
        "company": "Brasserie de l'Ouest Ti Mouss",
        "email": "info@brasserieouest.re",
        "sector": "Microbrasserie Artisanale Péi",
        "location": "La Réunion",
        "source": "https://brasserieouest.re",
        "subject": "Perspectives de croissance et synergies pour la Brasserie de l'Ouest Ti Mouss",
        "body": """Bonjour,

Je découvre avec un grand plaisir les créations de la Brasserie de l'Ouest et la renommée grandissante de vos bières Ti Mouss à La Réunion. Votre passion pour les produits artisanaux sains et savoureux contribue activement à la richesse gastronomique de l'île.

Je prends contact au nom de Domtom Connect. Nous avons mis en place un écosystème d'affaires dédié à accompagner les pépites entrepreneuriales des Outre-mer et de leurs diasporas.

Nous proposons un accompagnement à 360 degrés via notre programme Tremplin, du copilotage opérationnel pour vous épauler dans la gestion des processus complexes, ainsi qu'un diagnostic stratégique gratuit grâce à notre anamnèse clinique d'entreprise.

Seriez-vous disponible pour une conversation de quinze minutes la semaine prochaine afin d'aborder vos priorités de développement ?

Vous pouvez choisir le moment qui vous conviendra sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 13. Le Demeter
    {
        "company": "Le Demeter",
        "email": "samuel@ledemeter.fr",
        "sector": "Craft Beer & Brasserie Artisanale",
        "location": "La Réunion",
        "source": "https://ledemeter.fr",
        "subject": "Échange et développement pour Le Demeter",
        "body": """Bonjour Samuel,

J'observe avec beaucoup d'intérêt votre engagement pour la culture craft beer, la convivialité et la mise en avant de bières artisanales exigeantes au Demeter à La Réunion. Votre établissement est devenu un véritable point de repère pour les amateurs de dégustation soignée.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement d'affaires pensé pour soutenir les entrepreneurs indépendants et créateurs des Outre-mer et de la diaspora.

Nous épaulons les chefs d'entreprise via notre programme Tremplin, des interventions de copilotage opérationnel pour déléguer les tâches récurrentes de gestion, et un réseau d'entraide actif.

Seriez-vous partant pour un rapide échange téléphonique de quinze minutes ces prochains jours afin de faire le point sur vos enjeux actuels ?

Vous pouvez fixer le créneau qui vous arrange directement ici,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 14. Maison Kalao
    {
        "company": "Maison Kalao",
        "email": "contact@maison-kalao.com",
        "sector": "Brasserie Artisanale Céréales Locales",
        "location": "Sénégal",
        "source": "https://maison-kalao.com",
        "subject": "Développement et synergies de distribution pour Maison Kalao",
        "body": """Bonjour,

C'est avec un très grand enthousiasme que je suis l'aventure de Maison Kalao au Sénégal. Votre démarche audacieuse consistant à brasser des bières artisanales d'exception à base de céréales africaines comme le fonio ou le mil est une référence d'innovation agroalimentaire panafricaine.

Je vous contacte au nom de Domtom Connect. Nous avons créé cet écosystème d'affaires pour bâtir des ponts solides et apporter des réponses concrètes aux défis des entreprises d'Afrique, de la Caraïbe et de leurs diasporas.

Notre dispositif intègre le programme Tremplin pour un accompagnement global, du copilotage opérationnel pour fluidifier vos opérations, ainsi que des passerelles commerciales avec nos réseaux de distribution internationaux.

Seriez-vous disponible pour un court échange en visio de quinze minutes la semaine prochaine afin d'évoquer vos perspectives régionales et export ?

Vous pouvez choisir votre créneau directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # 15. Kaynoo
    {
        "company": "Kaynoo",
        "email": "contact@kaynoo.sn",
        "sector": "Marketplace Terroir & Boissons Locales",
        "location": "Sénégal",
        "source": "https://kaynoo.sn",
        "subject": "Synergies d'écosystème et distribution pour Kaynoo",
        "body": """Bonjour,

J'observe avec un vif intérêt le développement de Kaynoo à Dakar et votre engagement pour valoriser les produits du terroir, les artisans locaux et les marques émergentes d'Afrique de l'Ouest. La facilitation de l'accès aux richesses locales est un levier majeur de souveraineté économique.

Je vous écris au nom de Domtom Connect. Notre organisation est un écosystème d'affaires ayant pour mission d'accélérer la croissance des entrepreneurs et des plateformes issus d'Afrique, de la Caraïbe et de leurs diasporas.

Nous proposons un accompagnement complet via notre programme Tremplin, des missions de copilotage opérationnel pour vous faire gagner du temps sur l'exécution, et un réseau qualifié de partenaires et d'investisseurs.

Seriez-vous ouvert à une discussion de quinze minutes la semaine prochaine afin d'explorer des synergies concrètes entre nos communautés ?

Vous pouvez retenir un créneau directement à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    }
]

def audit_batch():
    print("=" * 80)
    print("AUDIT RIGOUREUX DU BATCH 78 (15 CIBLES)")
    print("=" * 80)
    has_error = False

    for i, t in enumerate(TARGETS, 1):
        comp = t["company"]
        email = t["email"]
        subj = t["subject"]
        body = t["body"]
        sec = t["sector"]
        loc = t["location"]
        src = t["source"]

        # 1. Verification Dedup et Exclusions
        dup, reason = is_domain_or_company_duplicate(email, comp)
        if dup:
            print(f"[{i:02d}/15] ERREUR DEDUP : {comp} <{email}> : {reason}")
            has_error = True
            continue

        # 2. Verification DNS & MX
        domain = email.split('@')[1]
        mx_ok, msg = verify_domain_mx(domain)
        if not mx_ok:
            print(f"[{i:02d}/15] ERREUR MX : {comp} <{email}> : {msg}")
            has_error = True
            continue

        # 3. Règle N°4 : Aucun deux-points (:)
        if ":" in subj:
            print(f"[{i:02d}/15] ERREUR REGLE 4 : Deux-points trouvé dans le sujet de {comp} : '{subj}'")
            has_error = True
        if ":" in body:
            print(f"[{i:02d}/15] ERREUR REGLE 4 : Deux-points trouvé dans le corps de {comp}")
            has_error = True

        # 4. Règle N°7 : Aucun tiret d'incise ( - )
        if " - " in subj:
            print(f"[{i:02d}/15] ERREUR REGLE 7 : Tiret d'incise trouvé dans le sujet de {comp}")
            has_error = True
        if " - " in body:
            print(f"[{i:02d}/15] ERREUR REGLE 7 : Tiret d'incise trouvé dans le corps de {comp}")
            has_error = True

        print(f"[{i:02d}/15] OK : {comp} ({loc} | {sec}) <{email}> -> MX OK ({domain})")

    print("=" * 80)
    if has_error:
        print("AUDIT ÉCHOUÉ : Des erreurs doivent être corrigées avant tout envoi.")
        sys.exit(1)
    else:
        print("AUDIT RÉUSSI : 100% DES 15 CIBLES DU BATCH 78 SONT CONFORMES ET PRÊTES.")
        print("=" * 80)

def send_batch():
    audit_batch()

    db_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contacts_deja_contactes.json")
    with open(db_file, encoding='utf-8') as f:
        db = json.load(f)

    smtp_server = "smtp.gmail.com"
    smtp_port = 465
    smtp_user = "domtomconnect@gmail.com"
    smtp_pass = os.environ.get("GMAIL_APP_PASS", "geqpuqluimxdjxeo")

    print("\nConnexion SMTP en cours sur smtp.gmail.com:465...")
    server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30)
    server.login(smtp_user, smtp_pass)
    print("Connexion SMTP établie avec succès.\n")

    sent_count = 0
    total = len(TARGETS)

    for i, t in enumerate(TARGETS, 1):
        comp = t["company"]
        email = t["email"]
        subj = t["subject"]
        body = t["body"]

        msg = MIMEMultipart("alternative")
        msg["From"] = f"Loïc Villeronce <{smtp_user}>"
        msg["To"] = f"{comp} <{email}>"
        msg["Subject"] = subj
        msg["Date"] = formatdate(localtime=True)
        msg_id = make_msgid(domain="domtomconnect.com")
        msg["Message-ID"] = msg_id

        msg.attach(MIMEText(body, "plain", "utf-8"))

        print(f"[{i:02d}/{total:02d}] Envoi en cours à {comp} <{email}>...")
        try:
            server.sendmail(smtp_user, [email], msg.as_string())
            print(f"  -> Délivré avec succès ! Message-ID : {msg_id}")
            sent_count += 1

            contact_record = {
                "email": email.lower().strip(),
                "nom": comp,
                "prenom": "",
                "entreprise": comp,
                "batch": "batch_78",
                "date_contact": time.strftime("%Y-%m-%d"),
                "statut": "ENVOYE",
                "source": t["source"],
                "notes": f"Batch 78 - {t['sector']} ({t['location']})"
            }
            db["contacts"].append(contact_record)
            domain = email.split('@')[1].lower().strip()
            if domain not in db["domains"]:
                db["domains"].append(domain)
            db["total_contacts"] = len(db["contacts"])
            db["total_domains"] = len(db["domains"])

            with open(db_file, "w", encoding="utf-8") as f_out:
                json.dump(db, f_out, ensure_ascii=False, indent=2)

            if i < total:
                pause = 4.0 + (i % 3) * 0.8
                print(f"  Pause anti-spam ({pause:.1f}s)...")
                time.sleep(pause)

        except Exception as e:
            print(f"  -> ERREUR d'envoi à {comp} <{email}> : {e}")

    server.quit()
    print("\n" + "=" * 80)
    print(f"RÉSULTAT : {sent_count}/{total} EMAILS DÉLIVRÉS AVEC SUCCÈS.")
    print("=" * 80)

if __name__ == "__main__":
    if "--send" in sys.argv:
        send_batch()
    else:
        audit_batch()
