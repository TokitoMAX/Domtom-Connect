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
    # 1. GESTION DE PATRIMOINE, FISCALITÉ & AFFAIRES
    # =========================================================================
    {
        "company": "JFD Patrimoine",
        "email": "contact@jfdpatrimoine-immobilier.fr",
        "sector": "Gestion de Patrimoine & Investissement",
        "location": "La Réunion (Saint-Paul)",
        "source": "https://jfdpatrimoine-immobilier.fr",
        "subject": "Synergies patrimoniales et partenariats pour JFD Patrimoine",
        "body": """Bonjour,

J'observe avec beaucoup d'attention l'expertise et la proximité du cabinet JFD Patrimoine à Saint-Paul, particulièrement dans l'ingénierie financière, l'investissement immobilier et l'optimisation patrimoniale à La Réunion. Votre approche sur mesure apporte une réelle sérénité aux investisseurs et dirigeants locaux.

Je vous contacte au nom de Domtom Connect. Nous avons bâti un écosystème d'affaires dédié à accompagner les chefs d'entreprise et cadres des Outre-mer et de leurs diasporas.

Nos membres ont régulièrement besoin de conseils avisés pour structurer leur patrimoine et investir efficacement dans les territoires ultramarins. En retour, notre programme Tremplin et nos solutions de copilotage opérationnel aident les dirigeants de cabinets partenaires à déléguer leurs tâches chronophages pour accélérer leur prospection.

Seriez-vous ouvert à un court échange de quinze minutes la semaine prochaine afin d'évaluer de potentielles synergies ?

Vous pouvez choisir votre créneau directement via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "CO Conseils",
        "email": "contact@coconseils.fr",
        "sector": "Conseil Patrimonial & Dispositifs Outre-Mer",
        "location": "La Réunion",
        "source": "https://coconseils.fr",
        "subject": "Partenariat d'affaires et synergies pour CO Conseils",
        "body": """Bonjour,

Je suis de près votre savoir-faire en ingénierie patrimoniale et votre maîtrise des dispositifs fiscaux ultramarins, notamment la loi Girardin et les opportunités immobilières à La Réunion. Votre capacité à allier sécurité juridique et optimisation constitue un atout précieux pour les patrimoines exigeants.

Je me permets de vous contacter au nom de Domtom Connect. Notre organisation réunit une communauté d'affaires active de chefs d'entreprise, investisseurs et porteurs d'initiatives issus d'Afrique, de la Caraïbe, de l'Océan Indien et de leurs diasporas.

Nous accompagnons nos partenaires à travers notre programme Tremplin et du copilotage opérationnel, tout en générant des passerelles d'apport d'affaires avec des profils qualifiés cherchant à investir dans les territoires.

Seriez-vous disponible pour une conversation informelle de quinze minutes ces prochains jours afin d'aborder des opportunités croisées ?

Vous pouvez sélectionner le moment qui vous conviendra sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Cabinet Claudine Portel",
        "email": "claudine.portel@avocat-conseil.fr",
        "sector": "Droit Fiscal & Conseil Patrimonial",
        "location": "Martinique (Fort-de-France)",
        "source": "https://claudine-portel-avocat.com",
        "subject": "Échange confraternel et synergies d'affaires pour Maître Portel",
        "body": """Bonjour Maître Portel,

C'est avec beaucoup d'intérêt que je suis votre réputation au Barreau de Martinique en matière de droit fiscal, de sécurisation patrimoniale et d'accompagnement des entreprises. Votre rigueur technique et votre écoute sont indispensables dans l'environnement économique antillais.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement dédié à soutenir la croissance des entreprises ultramarines et de leurs fondateurs.

Nous proposons le programme Tremplin à 360 degrés, du copilotage opérationnel pour libérer du temps stratégique aux dirigeants, ainsi qu'un outil gratuit d'anamnèse clinique pour identifier leurs blocages. Nous orientons également régulièrement nos membres chefs d'entreprise vers des experts juridiques et fiscaux de confiance.

Seriez-vous ouverte à un court échange téléphonique de quinze minutes afin de faire connaissance ?

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
        "company": "NPL Avocats",
        "email": "cabinet@nplavocats.com",
        "sector": "Droit des Affaires & Stratégie Fiscale",
        "location": "Guadeloupe",
        "source": "https://nplavocats.com",
        "subject": "Perspectives d'écosystème et collaborations pour NPL Avocats",
        "body": """Bonjour,

J'observe avec attention l'intervention du cabinet NPL Avocats auprès des dirigeants d'entreprises en Guadeloupe, notamment sur les opérations de transmission, de structuration corporate et d'optimisation fiscale. Votre positionnement résolument tourné vers les bâtisseurs locaux est remarquable.

Je vous écris pour vous faire découvrir Domtom Connect. Notre mission est d'apporter des solutions opérationnelles directes aux entreprises ultramarines pour soutenir leur développement économique.

À travers notre programme Tremplin et nos missions de copilotage opérationnel, nous aidons les dirigeants à exécuter leurs projets de croissance tout en facilitant des mises en relation ciblées avec des conseils juridiques référents.

Seriez-vous ouverts à une courte discussion de quinze minutes la semaine prochaine pour évoquer de possibles passerelles ?

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
        "company": "CAGEPA Saint-Martin",
        "email": "saint-martin@cagepa.fr",
        "sector": "Gestion de Patrimoine & Immobilier d'Exception",
        "location": "Saint-Martin",
        "source": "https://cagepa.fr",
        "subject": "Développement et synergies territoriales pour CAGEPA Saint-Martin",
        "body": """Bonjour,

Je suis de près la présence et le professionnalisme de CAGEPA à Saint-Martin dans la gestion de patrimoine, l'investissement immobilier et l'administration de biens haut de gamme. Votre connaissance fine des spécificités fiscales et juridiques saint-martinoises est un réel atout.

Je vous contacte au nom de Domtom Connect, un écosystème d'affaires dédié à accompagner les entrepreneurs et investisseurs des territoires ultramarins et de la diaspora.

Notre dispositif s'articule autour du programme Tremplin pour un suivi complet, d'un service de copilotage opérationnel pour fluidifier vos processus d'acquisition client, ainsi que d'une communauté active cherchant des opportunités solides dans les îles du Nord.

Seriez-vous disponible pour un rapide échange téléphonique de quinze minutes afin de faire le point ?

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
    # 2. CONCIERGERIE HAUT DE GAMME & GESTION DE PROPRIÉTÉS
    # =========================================================================
    {
        "company": "Bucket List Villa",
        "email": "contact@bucketlistvilla.com",
        "sector": "Conciergerie Privée & Villas de Prestige",
        "location": "Saint-Barthélemy",
        "source": "https://bucketlistvilla.com",
        "subject": "Synergies d'affaires et clientèle haut de gamme pour Bucket List Villa",
        "body": """Bonjour,

J'observe avec beaucoup d'admiration le standing exceptionnel de vos villas de luxe et l'exigence de conciergerie privée sur mesure que vous offrez à Saint-Barthélemy. La satisfaction d'une clientèle internationale raffinée demande une rigueur et une disponibilité sans faille.

Je vous contacte au nom de Domtom Connect. Nous sommes un écosystème d'accompagnement entrepreneurial créé pour soutenir les dirigeants d'activités premium en Outre-mer.

Nous accompagnons les gérants via notre programme Tremplin, du copilotage opérationnel one-to-one pour vous décharger de la logistique lourde et des tâches chronophages, ainsi qu'un réseau d'affaires actif favorisant les partenariats exclusifs.

Seriez-vous ouvert à un court échange de quinze minutes afin d'aborder vos perspectives pour la saison à venir ?

Vous pouvez sélectionner votre créneau à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Caribbean Keys Conciergerie",
        "email": "gwen@ckconciergerie.com",
        "sector": "Gestion Locative & Conciergerie de Prestige",
        "location": "Guadeloupe",
        "source": "https://ckconciergerie.com",
        "subject": "Échange et développement pour Caribbean Keys Conciergerie",
        "body": """Bonjour Gwen,

Je découvre avec grand intérêt le dynamisme et l'attention aux détails que vous apportez à la gestion de propriétés de charme et au séjour des voyageurs en Guadeloupe avec Caribbean Keys Conciergerie. Votre sens du service et la valorisation du patrimoine insulaire font toute la différence.

Je prends contact au nom de Domtom Connect. Nous avons créé cet écosystème pour épauler les dirigeants de structures d'accueil et de conciergerie face à leurs défis d'organisation et de remplissage annuel.

À travers notre programme Tremplin et du copilotage opérationnel direct, nous vous aidons à libérer du temps précieux sur l'intendance et à capter de nouveaux propriétaires ainsi qu'une clientèle régulière issue de notre réseau d'affaires.

Seriez-vous disponible pour un échange informel de quinze minutes la semaine prochaine ?

Vous pouvez choisir le moment qui vous conviendra via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Côté Caraïbes Conciergerie",
        "email": "christelle@cotecaraibes.com",
        "sector": "Gestion Immobilière & Conciergerie Privée",
        "location": "Guadeloupe",
        "source": "https://cotecaraibes.com",
        "subject": "Perspectives de développement pour Côté Caraïbes Conciergerie",
        "body": """Bonjour Christelle,

C'est avec beaucoup d'attention que je suis l'évolution de Côté Caraïbes et la qualité de votre prise en charge des villas et des séjours personnalisés en Guadeloupe. Votre rigueur dans la gestion locative et la fidélisation des propriétaires constitue un vrai gage de pérennité.

Je vous écris pour vous présenter Domtom Connect, un écosystème d'affaires conçu pour dynamiser les entrepreneurs ultramarins et leur offrir des solutions concrètes de développement.

Nous proposons le programme Tremplin pour franchir de nouveaux caps d'activité, un accompagnement en copilotage opérationnel pour vous soulager de la charge mentale administrative, et un réseau qualifié de décideurs et de voyageurs.

Seriez-vous partante pour un court échange téléphonique de quinze minutes ces prochains jours ?

Vous pouvez réserver directement votre créneau sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Villas Martinique",
        "email": "contact@villasmartinique.fr",
        "sector": "Location Saisonnière & Propriétés de Prestige",
        "location": "Martinique",
        "source": "https://villasmartinique.fr",
        "subject": "Synergies d'affaires et partenariats pour Villas Martinique",
        "body": """Bonjour,

J'observe avec beaucoup d'intérêt la sélection soignée de résidences d'exception et le savoir-faire de Villas Martinique dans l'accueil haut de gamme et la valorisation du séjour sur l'île. Votre positionnement répond parfaitement à la recherche d'authenticité et de confort des voyageurs.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement entrepreneurial dédié aux entreprises d'Outre-mer et de leurs diasporas.

Nous aidons les gérants de parcs de villas via notre programme Tremplin, des interventions de copilotage opérationnel pour fluidifier vos opérations quotidiennes, et des passerelles d'apport de clientèle avec les cadres et entrepreneurs de notre communauté.

Seriez-vous ouvert à une courte discussion de quinze minutes la semaine prochaine afin d'évoquer de possibles synergies ?

Vous pouvez retenir un créneau directement à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    # =========================================================================
    # 3. NAUTISME D'EXCEPTION & EXPLORATION SOUS-MARINE
    # =========================================================================
    {
        "company": "Moorea Ocean Adventures",
        "email": "info@moorea-ocean-adventures.com",
        "sector": "Safaris Marins Privés & Écotourisme Océanique",
        "location": "Polynésie française (Moorea)",
        "source": "https://moorea-ocean-adventures.com",
        "subject": "Échange et développement d'activité pour Moorea Ocean Adventures",
        "body": """Bonjour,

C'est avec une grande admiration que je suis votre travail de pionniers de l'observation privée et éthique des cétacés, baleines à bosse et raies à Moorea. Votre démarche naturaliste et le respect absolu de la faune sauvage sont un honneur pour le patrimoine océanien.

Je vous contacte au nom de Domtom Connect. Nous avons mis en place un écosystème d'affaires dédié à accompagner les entrepreneurs et structures d'exception des Outre-mer face à leurs enjeux de commercialisation et de gestion.

Notre dispositif s'appuie sur le programme Tremplin, des missions de copilotage opérationnel pour vous faire gagner un temps précieux sur la gestion et la prospection, ainsi qu'un réseau international d'échanges d'affaires.

Seriez-vous ouverts à un court échange en visio de quinze minutes ces prochains jours afin d'aborder vos priorités d'expansion ?

Vous pouvez choisir votre créneau directement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Top Dive Polynésie",
        "email": "dive@topdive.com",
        "sector": "Réseau de Centres de Plongée & Croisières Plongée",
        "location": "Polynésie française",
        "source": "https://topdive.fr",
        "subject": "Synergies d'affaires et perspectives pour Top Dive Polynésie",
        "body": """Bonjour,

J'observe avec beaucoup de respect le déploiement remarquable et la qualité de service irréprochable de Top Dive sur les plus beaux atolls de Polynésie française. Votre présence multi-îles et votre réputation internationale en font la référence absolue de la plongée sous-marine dans le Pacifique.

Je vous écris pour vous présenter Domtom Connect. Nous sommes un écosystème d'accompagnement réunissant des dirigeants d'entreprises, créateurs et décideurs des Outre-mer et de leurs diasporas.

Nous accompagnons les structures de référence à travers notre programme Tremplin et nos interventions de copilotage opérationnel pour optimiser la gestion de projets complexes, tout en stimulant des partenariats au sein de notre communauté.

Seriez-vous disponibles pour un échange de quinze minutes afin de faire connaissance et d'évaluer de potentielles opportunités communes ?

Vous pouvez fixer votre créneau directement via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Le Dodo Palmé",
        "email": "contact@dodopalme.com",
        "sector": "Centre de Plongée, Formations & Randonnées Baleines",
        "location": "La Réunion (Le Port)",
        "source": "https://dodopalme.com",
        "subject": "Développement et synergies maritimes pour Le Dodo Palmé",
        "body": """Bonjour,

Je suis avec beaucoup d'attention l'activité du Dodo Palmé au Port à La Réunion. Votre passion pour la formation de plongeurs, les randonnées subaquatiques et l'observation des baleines contribue grandement au rayonnement maritime de l'île de La Réunion.

Je vous contacte au nom de Domtom Connect, un écosystème d'affaires conçu pour dynamiser les entrepreneurs et structures indépendantes ultramarines.

À travers notre programme Tremplin et du copilotage opérationnel individualisé, nous aidons les chefs de centre à déléguer les processus administratifs lourds et à lisser leur fréquentation tout au long de l'année grâce à nos réseaux d'échanges d'affaires.

Seriez-vous ouvert à une conversation informelle de quinze minutes la semaine prochaine ?

Vous pouvez sélectionner un créneau à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Plateforme d'échange, calendly.com/domtomconnect/30min"""
    },

    {
        "company": "Aquabulle Martinique",
        "email": "info@aquabulle.com",
        "sector": "Bateau à Vision Sous-Marine & Écotourisme Marin",
        "location": "Martinique (Le Marin)",
        "source": "https://aquabulle.com",
        "subject": "Échange et développement touristique pour Aquabulle",
        "body": """Bonjour,

C'est avec beaucoup d'intérêt que je suis l'aventure d'Aquabulle au Marin en Martinique. Votre concept de bateau à vision sous-marine permet à tous les publics d'explorer la magie des fonds marins antillais en toute sécurité et avec un profond respect de l'environnement.

Je me permets de vous contacter au nom de Domtom Connect. Notre mission est d'apporter un soutien concret aux exploitants d'activités touristiques et maritimes pour consolider leur activité et capter de nouveaux relais de croissance.

Nous proposons le programme Tremplin pour structurer votre développement, des solutions de copilotage opérationnel pour alléger votre quotidien de gestion, ainsi qu'une visibilité directe auprès de notre communauté de voyageurs et d'entrepreneurs.

Seriez-vous partant pour un rapide échange téléphonique de quinze minutes ces prochains jours ?

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
        "company": "Fluid Tahiti Plongée",
        "email": "info@fluidtahiti.com",
        "sector": "Centre de Plongée Sous-Marine & Explorations Récifales",
        "location": "Polynésie française (Tahiti)",
        "source": "https://fluid-tahiti.com",
        "subject": "Développement et synergies pour Fluid Tahiti Plongée",
        "body": """Bonjour,

J'observe avec enthousiasme la renommée et l'ambiance chaleureuse de Fluid Tahiti à la marina Taina à Punaauia. Votre expertise des passes tahitiennes et votre dévouement pour offrir des plongées d'exception font de votre centre un incontournable de la vie marine polynésienne.

Je vous contacte au nom de Domtom Connect, un écosystème d'accompagnement d'affaires dédié aux dirigeants d'entreprises et créateurs des Outre-mer.

Nous soutenons les entrepreneurs via notre programme Tremplin, des interventions de copilotage opérationnel direct pour simplifier la gestion quotidienne, et un diagnostic d'entreprise gratuit grâce à notre anamnèse clinique pour exploiter vos meilleurs leviers d'activité.

Seriez-vous ouvert à une discussion de quinze minutes la semaine prochaine afin de faire le point ?

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
        "company": "Bora Ocean Adventures",
        "email": "contact@boraoceanadventures.com",
        "sector": "Excursions Maritimes Privées & Safari Lagon",
        "location": "Polynésie française (Bora Bora)",
        "source": "https://boraoceanadventures.com",
        "subject": "Synergies d'affaires et développement pour Bora Ocean Adventures",
        "body": """Bonjour,

Je suis avec un vif intérêt l'excellence de vos excursions nautiques privées et de vos rencontres sous-marines sur le lagon mythique de Bora Bora. Votre service personnalisé et la passion de vos capitaines offrent des souvenirs impérissables à vos hôtes.

Je vous écris pour vous présenter Domtom Connect. Notre organisation est un écosystème d'affaires dédié à accompagner les pépites entrepreneuriales ultramarines pour surmonter leurs défis opérationnels et pérenniser leur développement.

Notre offre comprend le programme Tremplin à 360 degrés, du copilotage opérationnel pour vous assister dans l'exécution de vos priorités, ainsi qu'un accès privilégié à un réseau d'affaires international.

Seriez-vous disponible pour un court échange de quinze minutes ces prochains jours afin d'aborder vos perspectives ?

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
    print("AUDIT RIGOUREUX DU BATCH 80 (15 CIBLES)")
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
        print("AUDIT RÉUSSI : 100% DES 15 CIBLES DU BATCH 80 SONT STRICTEMENT CONFORMES ET PRÊTES.")
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
                "batch": "batch_80",
                "date_contact": time.strftime("%Y-%m-%d"),
                "statut": "ENVOYE",
                "source": t["source"],
                "notes": f"Batch 80 - {t['sector']} ({t['location']})"
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
