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
    # =========================================================================
    # OPTION 1 : NAUTISME, CATAMARANS DE LUXE & CENTRES DE PLONGÉE DE RÉFÉRENCE
    # =========================================================================
    {
        "company": "Alternative Sailing",
        "email": "contact@alternative-sailing.com",
        "sector": "Location & Gestion de Catamarans Haut de Gamme",
        "location": "Martinique (Le Marin)",
        "source": "https://alternative-sailing.com",
        "subject": "Synergies d'affaires et développement pour Alternative Sailing",
        "body": """Bonjour,

J'observe avec beaucoup d'attention la qualité de votre flotte de catamarans et voiliers d'exception au Marin, ainsi que la rigueur de votre service de gestion-location en Martinique. Votre positionnement haut de gamme et votre passion maritime en font une vitrine remarquable du nautisme caribéen.

Je vous contacte au nom de Domtom Connect. Nous avons créé cet écosystème d'accompagnement pour apporter des réponses concrètes aux défis des entreprises ultramarines, particulièrement face aux enjeux de saisonnalité, de visibilité internationale et de gestion opérationnelle.

Notre dispositif s'articule autour du programme Tremplin pour un accompagnement à 360 degrés, d'un service de copilotage opérationnel direct pour décharger les équipes dirigeantes des processus chronophages, ainsi que d'un réseau d'affaires actif reliant la Caraïbe, l'Europe et leurs diasporas.

Seriez-vous ouvert à un court échange téléphonique ou visio de quinze minutes la semaine prochaine afin d'évaluer de possibles synergies ?

Vous pouvez retenir directement votre créneau sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Espace Plongée Martinique",
        "email": "infos@epm972.fr",
        "sector": "Plongée & Croisières Écotouristiques Catamaran",
        "location": "Martinique (Pointe du Bout)",
        "source": "https://espaceplongee-martinique.com",
        "subject": "Échange convivial et opportunités pour Espace Plongée Martinique",
        "body": """Bonjour,

Je suis avec beaucoup d'intérêt l'activité d'Espace Plongée Martinique à la marina de la Pointe du Bout, notamment avec votre catamaran Planète Bleue et vos sorties d'observation respectueuse des cétacés. Votre engagement pour faire découvrir la biodiversité marine antillaise est un modèle d'écotourisme exemplaire.

Je vous écris pour vous présenter Domtom Connect. Notre mission est d'épauler les dirigeants d'activités touristiques et maritimes pour lisser leur fréquentation tout au long de l'année et capter une clientèle qualifiée issue des territoires et de la diaspora.

Nous proposons le programme Tremplin, un suivi sur mesure pour structurer votre croissance, du copilotage opérationnel pour vous soulager de la gestion administrative quotidienne, ainsi qu'un réseau d'affaires dynamique.

Seriez-vous disponible pour une conversation de quinze minutes la semaine prochaine afin d'aborder vos perspectives ?

Vous pouvez choisir le moment qui vous convient le mieux sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Bleu Marine Réunion",
        "email": "contact@bleumarineplongee.re",
        "sector": "Centre de Plongée & Exploration Sous-Marine",
        "location": "La Réunion (Saint-Gilles)",
        "source": "https://bleumarineplongee.re",
        "subject": "Développement et synergies pour Bleu Marine Réunion",
        "body": """Bonjour,

C'est avec un grand intérêt que je suis le dynamisme de Bleu Marine Réunion au port de Saint-Gilles-les-Bains. Votre professionnalisme et la convivialité de vos immersions sur les plus beaux spots de l'île font de votre centre une adresse incontournable pour les passionnés de mer.

Je prends contact au nom de Domtom Connect. Nous avons mis en place un écosystème d'affaires dédié à accompagner les chefs d'entreprise des Outre-mer dans leur développement et leur visibilité.

À travers notre programme Tremplin et notre accompagnement en copilotage opérationnel, nous permettons aux dirigeants de se focaliser sur leur métier passion et la satisfaction de leurs plongeurs en déléguant les démarches d'acquisition et d'organisation qui pèsent sur leur quotidien.

Seriez-vous partant pour un rapide échange téléphonique de quinze minutes ces prochains jours ?

Vous pouvez réserver votre créneau directement ici,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Scubananas Réunion Plongée",
        "email": "contact@reunionplongee.com",
        "sector": "Plongée & Safari Cétacés Péi",
        "location": "La Réunion (Saint-Gilles)",
        "source": "https://reunionplongee.com",
        "subject": "Échange et perspectives d'activité pour Scubananas Réunion Plongée",
        "body": """Bonjour,

J'observe avec admiration la formidable énergie, la bonne humeur et l'exigence de sécurité qui caractérisent l'équipe de Scubananas à Saint-Gilles-les-Bains. Vos sorties baleines et vos plongées coralliennes incarnent le meilleur de l'expérience marine réunionnaise.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement créé pour soutenir les entrepreneurs indépendants et créateurs des territoires ultramarins.

Nous intervenons via notre programme Tremplin, des missions de copilotage opérationnel pour fluidifier vos canaux de réservation et votre communication, ainsi qu'un outil de diagnostic gratuit sous forme d'anamnèse clinique pour identifier vos meilleurs leviers d'expansion.

Seriez-vous ouvert à un court échange informel de quinze minutes la semaine prochaine afin de faire connaissance ?

Vous pouvez retenir un créneau à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Archipel Plongée",
        "email": "plongee@archipel-plongee.fr",
        "sector": "Plongée & Découverte Réserve Cousteau",
        "location": "Guadeloupe (Malendure)",
        "source": "https://archipel-plongee.fr",
        "subject": "Synergies partenariales et développement pour Archipel Plongée",
        "body": """Bonjour,

Je suis de près votre activité sur la plage de Malendure et votre expertise reconnue au cœur de la réserve Cousteau en Guadeloupe. La qualité de votre accueil et la passion de vos moniteurs permettent aux visiteurs comme aux locaux de vivre des moments marins privilégiés.

Je me permets de vous contacter au nom de Domtom Connect. Notre organisation fédère un écosystème d'affaires dédié à accompagner concrètement les TPE et PME des Outre-mer dans la consolidation de leur chiffre d'affaires.

Notre offre s'articule autour du programme Tremplin à 360 degrés, du copilotage opérationnel direct pour vous soulager de la gestion chronophage, ainsi que d'une mise en relation continue avec nos réseaux d'entrepreneurs et de voyageurs.

Seriez-vous disponible pour un échange téléphonique de quinze minutes afin de faire le point sur vos priorités actuelles ?

Vous pouvez choisir votre moment directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Abaca Croisières",
        "email": "yves@abaca-croisieres.com",
        "sector": "Croisières Catamaran & Charters Lagon",
        "location": "Nouvelle-Calédonie (Nouméa)",
        "source": "http://abaca-croisieres.com",
        "subject": "Échange et développement maritime pour Abaca Croisières",
        "body": """Bonjour Yves,

J'observe avec beaucoup d'intérêt la qualité de vos croisières en catamaran et vos navigations sur le plus grand lagon du monde au départ de Nouméa. Votre expérience de marin et votre authenticité offrent une expérience inoubliable sur les îlots calédoniens.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement d'affaires pensé pour soutenir les dirigeants et acteurs du tourisme d'Outre-mer face à leurs enjeux d'activité et de commercialisation.

Nous proposons le programme Tremplin pour piloter vos projets de croissance, du copilotage opérationnel pour vous faire gagner un temps précieux sur la gestion quotidienne, et une mise en relation avec des réseaux qualifiés.

Seriez-vous ouvert à une courte discussion de quinze minutes ces prochains jours afin d'aborder vos perspectives ?

Vous pouvez choisir le moment le plus pratique pour vous via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # =========================================================================
    # OPTION 2 : FRET MARITIME, GROUPAGE & TRANSIT DE PROXIMITÉ
    # =========================================================================
    {
        "company": "Trans Madikera Express",
        "email": "logistique@trans-madikera.com",
        "sector": "Logistique Inter-Îles, Groupage & Fret",
        "location": "Guadeloupe (Jarry)",
        "source": "https://trans-madikera.com",
        "subject": "Synergies de flux et partenariats logistiques pour Trans Madikera Express",
        "body": """Bonjour,

Je suis avec attention votre présence et votre savoir-faire en matière de transport de fret, de groupage et de logistique inter-îles depuis Jarry en Guadeloupe. La fluidité des liaisons maritimes et le désenclavement économique de nos territoires dépendent directement de la réactivité d'opérateurs comme le vôtre.

Je vous contacte au nom de Domtom Connect. Nous sommes un écosystème d'affaires réunissant des entreprises, industriels et commerçants des Outre-mer, d'Afrique et de la diaspora ayant d'importants besoins d'acheminement de marchandises.

Notre rôle est d'accompagner les acteurs du transport par notre programme Tremplin, du copilotage opérationnel pour développer de nouvelles opportunités de fret, ainsi que des mises en relation directes avec des expéditeurs réguliers.

Seriez-vous disponible pour un échange informel de quinze minutes la semaine prochaine afin d'évaluer des complémentarités ?

Vous pouvez choisir un créneau à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "GTA Groupeur Transitaire Associés",
        "email": "contact@gta-transitaire.com",
        "sector": "Fret Maritime, Aérien & Transit International",
        "location": "Afrique / Outre-Mer",
        "source": "https://gta-transitaire.com",
        "subject": "Partenariats de flux et synergies pour GTA Transitaire",
        "body": """Bonjour,

J'observe avec beaucoup d'intérêt votre expertise en groupage maritime et aérien, transport de véhicules et opérations de transit vers l'Afrique et les Outre-mer. Votre maîtrise des corridors logistiques transcontinentaux est un atout clé pour les échanges économiques.

Je vous écris pour vous présenter Domtom Connect. Notre organisation est un écosystème d'affaires fédérant des centaines d'entreprises et créateurs issus d'Afrique, de la Caraïbe et de la diaspora.

Nos membres recherchent en permanence des partenaires fiables pour optimiser leurs expéditions de conteneurs et de colis. En parallèle, nous accompagnons les entreprises de transport via notre programme Tremplin et du copilotage opérationnel pour stimuler leur développement commercial.

Seriez-vous ouvert à un court échange de quinze minutes afin de faire connaissance et d'étudier des ponts de collaboration ?

Vous pouvez retenir directement votre créneau sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Reunion Groupage Transit",
        "email": "contact@rgt.re",
        "sector": "Groupage Maritime & Déménagements Internationaux",
        "location": "La Réunion (Le Port)",
        "source": "https://rgt.re",
        "subject": "Développement et synergies logistiques pour Reunion Groupage Transit",
        "body": """Bonjour,

Je suis de près votre activité de groupage maritime, de déménagement international et de transit de marchandises au Port à La Réunion. La fiabilité de vos acheminements entre la métropole et l'Océan Indien est essentielle pour accompagner les mobilités et le commerce péi.

Je vous contacte au nom de Domtom Connect, un écosystème d'affaires dédié à apporter des solutions pragmatiques aux défis logistiques et de croissance des entreprises ultramarines.

Nous proposons le programme Tremplin pour accompagner votre expansion, des solutions de copilotage opérationnel pour fluidifier vos processus d'acquisition, ainsi qu'un accès privilégié à nos membres expéditeurs réguliers.

Seriez-vous disponible pour un échange téléphonique de quinze minutes ces prochains jours afin d'aborder vos projets ?

Vous pouvez fixer le moment qui vous conviendra via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Chenal SAS",
        "email": "contact@chenal-sas.com",
        "sector": "Transport Maritime & Logistique Insulaire",
        "location": "Mayotte / La Réunion",
        "source": "https://chenal-sas.com",
        "subject": "Synergies de fret et opportunités pour Chenal SAS",
        "body": """Bonjour,

J'observe avec un grand intérêt votre spécialisation dans le transport maritime de marchandises et de véhicules vers Mayotte et La Réunion. Votre présence continue sur cette ligne maritime hautement stratégique joue un rôle moteur pour l'approvisionnement des îles.

Je me permets de vous contacter au nom de Domtom Connect. Nous avons structuré un écosystème d'affaires pour lever les verrous opérationnels et développer les flux commerciaux des entrepreneurs ultramarins.

Nous accompagnons les acteurs de la logistique via notre programme Tremplin, un service de copilotage opérationnel personnalisé pour dynamiser la relation client, et des synergies directes avec des acteurs économiques locaux et régionaux.

Seriez-vous ouvert à une conversation informelle de quinze minutes la semaine prochaine ?

Vous pouvez sélectionner directement votre créneau sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Hippocampe Import Export",
        "email": "bordeaux@h-import-export.com",
        "sector": "Fret Régulier & Transit Mayotte Océan Indien",
        "location": "Mayotte / Réunion / Comores",
        "source": "https://h-import-export.com",
        "subject": "Échange partenarial et flux de fret pour Hippocampe Import Export",
        "body": """Bonjour,

Je suis avec beaucoup d'attention votre engagement logistique dans le transport maritime régulier et le groupage de marchandises reliant la métropole à Mayotte, La Réunion et les Comores. Votre savoir-faire sur ce bassin est un atout indispensable pour les professionnels et les familles de la diaspora.

Je vous contacte au nom de Domtom Connect. Nous sommes un écosystème d'accompagnement dont l'objectif est d'apporter des leviers concrets de développement aux entreprises des territoires ultramarins et de la diaspora.

Notre structure s'appuie sur le programme Tremplin, des interventions de copilotage opérationnel pour vous faire gagner du temps sur vos démarches, ainsi qu'une communauté d'affaires active en quête constante de partenaires d'expédition fiables.

Seriez-vous disponible pour un court échange de quinze minutes la semaine prochaine afin d'évoquer de possibles coopérations ?

Vous pouvez choisir le créneau qui vous arrange directement ici,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "J.A. Cowan et Fils",
        "email": "jac@jac.pf",
        "sector": "Transit Portuaire, Manutention & Fret International",
        "location": "Polynésie française (Papeete)",
        "source": "https://jac.pf",
        "subject": "Perspectives partenariales et synergies pour J.A. Cowan et Fils",
        "body": """Bonjour,

C'est avec beaucoup de respect que j'observe la trajectoire historique et l'excellence opérationnelle de la maison J.A. Cowan et Fils dans le transit, le dédouanement et la manutention portuaire à Papeete. Votre maison est un pilier de la logistique du Pacifique.

Je vous contacte au nom de Domtom Connect, un écosystème d'affaires dédié à accompagner les dirigeants et entreprises des Outre-mer dans leur développement et la mise en réseau avec de nouveaux marchés.

Nous proposons le programme Tremplin pour structurer des axes d'expansion, du copilotage opérationnel direct pour décharger vos équipes sur des projets stratégiques, ainsi que des opportunités d'échange au sein de notre communauté.

Seriez-vous ouvert à un rapide échange de quinze minutes la semaine prochaine afin de faire connaissance ?

Vous pouvez retenir un créneau directement à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "AltiTrans",
        "email": "info@altitrans.nc",
        "sector": "Fret Express, Transit & Logistique du Pacifique",
        "location": "Nouvelle-Calédonie (Nouméa)",
        "source": "https://altitrans.nc",
        "subject": "Échange stratégique et synergies de transport pour AltiTrans",
        "body": """Bonjour,

J'observe avec intérêt la réactivité et la qualité de vos solutions de fret express et de transport international en Nouvelle-Calédonie. Dans un contexte géographique exigeant, votre savoir-faire logistique garantit la continuité des approvisionnements indispensables au territoire.

Je vous écris au nom de Domtom Connect. Nous avons conçu cet écosystème d'affaires pour accompagner la croissance et l'efficacité opérationnelle des entreprises ultramarines.

À travers notre programme Tremplin et nos missions de copilotage opérationnel, nous aidons les chefs d'entreprise à optimiser leurs processus et à nouer des contacts privilégiés avec d'autres acteurs économiques d'envergure.

Seriez-vous partant pour un rapide échange téléphonique de quinze minutes ces prochains jours afin d'aborder vos priorités ?

Vous pouvez réserver votre créneau directement via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Polynésie Transit",
        "email": "contact@polynesietransit.pf",
        "sector": "Fret Maritime, Aérien & Dédouanement Insulaire",
        "location": "Polynésie française (Papeete)",
        "source": "https://polynesietransit.pf",
        "subject": "Développement et synergies logistiques pour Polynésie Transit",
        "body": """Bonjour,

Je suis de près votre expertise dans le dédouanement et le transit maritime et aérien en Polynésie française. Votre efficacité à fluidifier les formalités d'importation et d'exportation apporte une véritable bouffée d'oxygène aux commerçants et importateurs locaux.

Je vous contacte pour vous présenter l'écosystème d'affaires Domtom Connect. Nous soutenons les dirigeants des territoires du Pacifique et des Outre-mer pour accélérer leurs synergies commerciales.

Nous proposons le programme Tremplin à 360 degrés, du copilotage opérationnel one-to-one pour soulager la direction des frictions récurrentes, ainsi qu'une mise en relation avec des entreprises en recherche de partenaires d'acheminement de confiance.

Seriez-vous disponible pour un court échange de quinze minutes la semaine prochaine ?

Vous pouvez choisir le moment le plus pratique pour vous via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Transit SAT NUI",
        "email": "info@transit.pf",
        "sector": "Logistique Maritime, Déménagements & Fret Océanie",
        "location": "Polynésie française (Papeete)",
        "source": "https://transit.pf",
        "subject": "Perspectives d'affaires et collaborations pour Transit SAT NUI",
        "body": """Bonjour,

J'observe avec beaucoup d'attention la constance et le savoir-faire de Transit SAT NUI dans les opérations de transit maritime, de logistique et de déménagement en Polynésie française. Votre proximité avec le tissu économique local est un formidable gage de sérieux.

Je vous contacte au nom de Domtom Connect. Notre organisation est dédiée à soutenir les dirigeants ultramarins en leur apportant des leviers stratégiques et opérationnels concrets.

Notre accompagnement repose sur le programme Tremplin, des interventions de copilotage opérationnel direct pour fluidifier vos démarches de gestion et de prospection, ainsi qu'un réseau d'affaires actif reliant nos territoires.

Seriez-vous ouvert à une conversation informelle de quinze minutes afin de faire connaissance et d'évaluer des opportunités partagées ?

Vous pouvez choisir votre créneau directement sur ce lien,
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
    print("AUDIT RIGOUREUX DU BATCH 79 (15 CIBLES : NAUTISME & FRET)")
    print("=" * 80)
    has_error = False

    for i, t in enumerate(TARGETS, 1):
        comp = t["company"]
        email = t["email"]
        subj = t["subject"]
        body = t["body"]
        sec = t["sector"]
        loc = t["location"]

        dup, reason = is_domain_or_company_duplicate(email, comp)
        if dup:
            print(f"[{i:02d}/15] ERREUR DEDUP : {comp} <{email}> : {reason}")
            has_error = True
            continue

        domain = email.split('@')[1]
        mx_ok, msg = verify_domain_mx(domain)
        if not mx_ok:
            print(f"[{i:02d}/15] ERREUR MX : {comp} <{email}> : {msg}")
            has_error = True
            continue

        if ":" in subj:
            print(f"[{i:02d}/15] ERREUR REGLE 4 : Deux-points trouvé dans le sujet de {comp} : '{subj}'")
            has_error = True
        if ":" in body:
            print(f"[{i:02d}/15] ERREUR REGLE 4 : Deux-points trouvé dans le corps de {comp}")
            has_error = True

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
        print("AUDIT RÉUSSI : 100% DES 15 CIBLES DU BATCH 79 SONT STRICTEMENT CONFORMES ET PRÊTES.")
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
                "batch": "batch_79",
                "date_contact": time.strftime("%Y-%m-%d"),
                "statut": "ENVOYE",
                "source": t["source"],
                "notes": f"Batch 79 - {t['sector']} ({t['location']})"
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
