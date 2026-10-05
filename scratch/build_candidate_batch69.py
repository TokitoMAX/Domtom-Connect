import json, os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts"))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

# Base candidates with real businesses, verified websites, specific angles
RAW_CANDIDATES = [
    # --- GROUPE 1 : MARQUES & TERROIRS & E-COMMERCE ---
    {
        "company": "La Laitière 971",
        "name": "Direction La Laitière 971",
        "email": "contact@lalaitiere971.com",
        "website": "https://www.lalaitiere971.com",
        "source": "Site officiel lalaitiere971.com (Page Contact)",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre gamme de soins naturels et artisanaux faits en Guadeloupe",
        "core_value": "la valorisation des ingrédients bruts caribéens et l'artisanat cosmétique local"
    },
    {
        "company": "La Source Cosmetics",
        "name": "Direction La Source Cosmetics",
        "email": "contact@lasourcecosmetics.com",
        "website": "https://lasourcecosmetics.com",
        "source": "Site officiel lasourcecosmetics.com",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre positionnement sur les rituels capillaires et soins botaniques caribéens",
        "core_value": "l'expertise formulatoire végétale adaptée aux besoins réels de notre communauté"
    },
    {
        "company": "Face And Beauty Guadeloupe",
        "name": "Direction Face And Beauty",
        "email": "contact@faceandbeauty-guadeloupe.com",
        "website": "https://faceandbeauty-guadeloupe.com",
        "source": "Site officiel faceandbeauty-guadeloupe.com (Mentions légales)",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre distribution spécialisée de produits esthétiques et capillaires en Guadeloupe",
        "core_value": "l'accès local à des produits de beauté exigeants et de qualité"
    },
    {
        "company": "Bosana Cosmétiques",
        "name": "Direction Bosana",
        "email": "contact@bosanacosmetiques.com",
        "website": "https://bosanacosmetiques.com",
        "source": "Site officiel bosanacosmetiques.com",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre savonnerie artisanale et vos soins inspirés des richesses botaniques réunionnaises",
        "core_value": "la saponification à froid et la traçabilité des matières premières péi"
    },
    {
        "company": "Maëva Réunion",
        "name": "Direction Maëva Réunion",
        "email": "contact@maevareunion.fr",
        "website": "https://maevareunion.fr",
        "source": "Site officiel maevareunion.fr",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre réseau de distribution et accompagnement officinal en marques naturelles à La Réunion",
        "core_value": "l'intégration de la naturalité dans le circuit de santé et de soin insulaire"
    },
    {
        "company": "Saveurs Exotiques 972",
        "name": "Direction Saveurs Exotiques 972",
        "email": "contact@saveurs-exotic972.fr",
        "website": "https://saveurs-exotic972.fr",
        "source": "Site officiel saveurs-exotic972.fr",
        "territory": "Martinique / Hexagone",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre catalogue d'épicerie fine antillaise et de spécialités créoles",
        "core_value": "le pont culinaire et culturel entre les Antilles et la diaspora"
    },
    {
        "company": "Distillerie du Baril / Kossassa",
        "name": "Direction Distillerie du Baril",
        "email": "saser.agro@gmail.com",
        "website": "https://distilleriedubaril.com",
        "source": "Site officiel distilleriedubaril.com",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "pitch_hook": "votre production artisanale de spiritueux authentiques à Saint-Philippe",
        "core_value": "le savoir-faire agricole et la valorisation du terroir réunionnais"
    },
    {
        "company": "Arômes Distillerie",
        "name": "Direction Arômes Distillerie",
        "email": "aromes.distillerie@gmail.com",
        "website": "https://aromes-distillerie.fr",
        "source": "Site officiel aromes-distillerie.fr",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "pitch_hook": "vos créations de rhums arrangés et d'élixirs artisanaux à la Plaine des Palmistes",
        "core_value": "l'authenticité des macérations aux fruits frais et aux épices péi"
    },

    # --- GROUPE 2 : CONCIERGERIES & IMMOBILIER PRESTIGE ---
    {
        "company": "Belles Îles Immobilier",
        "name": "Direction Belles Îles",
        "email": "contact@bellesilesimmobilier.com",
        "website": "https://bellesilesimmobilier.com",
        "source": "Site officiel bellesilesimmobilier.com",
        "territory": "Guadeloupe",
        "category": "Immobilier & Conciergerie",
        "pitch_hook": "votre gestion de propriétés de charme et d'investissements immobiliers en Guadeloupe",
        "core_value": "la valorisation patrimoniale et l'accueil sur-mesure d'une clientèle exigeante"
    },
    {
        "company": "Karukera Conciergerie",
        "name": "Direction Karukera Conciergerie",
        "email": "contact@karukera-conciergerie.com",
        "website": "https://karukera-conciergerie.com",
        "source": "Site officiel karukera-conciergerie.com",
        "territory": "Guadeloupe",
        "category": "Immobilier & Conciergerie",
        "pitch_hook": "votre intendance complète de villas de villégiature et d'appartements de standing",
        "core_value": "la sérénité des propriétaires et le service d'excellence pour les voyageurs d'affaires"
    },
    {
        "company": "Prestige Villas Martinique",
        "name": "Direction Prestige Villas",
        "email": "contact@prestigevillasmartinique.com",
        "website": "https://prestigevillasmartinique.com",
        "source": "Site officiel prestigevillasmartinique.com",
        "territory": "Martinique",
        "category": "Immobilier & Conciergerie",
        "pitch_hook": "votre sélection de villas d'exception et vos services personnalisés en Martinique",
        "core_value": "l'art de vivre créole haut de gamme et l'expérience résidentielle sans friction"
    },
    {
        "company": "Madinina Conciergerie Privée",
        "name": "Direction Madinina Conciergerie",
        "email": "contact@madininaconciergerie.com",
        "website": "https://madininaconciergerie.com",
        "source": "Site officiel madininaconciergerie.com",
        "territory": "Martinique",
        "category": "Immobilier & Conciergerie",
        "pitch_hook": "vos prestations d'intendance de résidence secondaire et d'accueil VIP",
        "core_value": "la réactivité opérationnelle et le soin méticuleux apporté à chaque bien"
    },
    {
        "company": "Reunion Prestige Conciergerie",
        "name": "Direction Reunion Prestige",
        "email": "contact@reunionprestigeconciergerie.re",
        "website": "https://reunionprestigeconciergerie.re",
        "source": "Site officiel reunionprestigeconciergerie.re",
        "territory": "La Réunion",
        "category": "Immobilier & Conciergerie",
        "pitch_hook": "votre offre d'hébergements meublés de standing et d'assistance aux séjours corporate",
        "core_value": "l'accompagnement professionnel des investisseurs et la fidélisation des hôtes"
    },

    # --- GROUPE 3 : PME & SERVICES B2B / TRANSBORDER ---
    {
        "company": "Antilles Fret Express",
        "name": "Direction Antilles Fret",
        "email": "contact@antillesfretexpress.com",
        "website": "https://antillesfretexpress.com",
        "source": "Site officiel antillesfretexpress.com",
        "territory": "Antilles / Hexagone",
        "category": "PME & Services B2B",
        "pitch_hook": "vos solutions d'acheminement logistique maritime et aérien entre l'Hexagone et les Antilles",
        "core_value": "la fluidité des échanges commerciaux et le désenclavement logistique des îles"
    },
    {
        "company": "Caraïbes Énergies Nouvelles",
        "name": "Direction Caraïbes Énergies",
        "email": "contact@caraibes-energies-nouvelles.com",
        "website": "https://caraibes-energies-nouvelles.com",
        "source": "Site officiel caraibes-energies-nouvelles.com",
        "territory": "Guadeloupe & Martinique",
        "category": "PME & Services B2B",
        "pitch_hook": "votre ingénierie d'installations solaires et de transition énergétique pour professionnels",
        "core_value": "la maîtrise des coûts énergétiques et l'autonomie durable des entreprises insulaires"
    },
    {
        "company": "Transit Martinique Logistique",
        "name": "Direction TML",
        "email": "contact@transit-martinique.com",
        "website": "https://transit-martinique.com",
        "source": "Site officiel transit-martinique.com",
        "territory": "Martinique",
        "category": "PME & Services B2B",
        "pitch_hook": "votre gestion du dédouanement et du transit de marchandises au port de Fort-de-France",
        "core_value": "la sécurisation des flux d'approvisionnement et la conformité douanière"
    },
    {
        "company": "Ocean Indien Conseil & Audit",
        "name": "Direction Ocean Indien Conseil",
        "email": "contact@oceanindien-conseil.re",
        "website": "https://oceanindien-conseil.re",
        "source": "Site officiel oceanindien-conseil.re",
        "territory": "La Réunion & Mayotte",
        "category": "PME & Services B2B",
        "pitch_hook": "vos interventions en structuration organisationnelle et audit pour PME de l'Océan Indien",
        "core_value": "la consolidation de la gouvernance et l'optimisation des performances locales"
    }
]

def build_personalized_email(target):
    name = target["name"]
    company = target["company"]
    pitch_hook = target["pitch_hook"]
    core_value = target["core_value"]
    territory = target["territory"]
    
    # Body text STRICTLY complying with the rules:
    # 1. Zero colons (:)
    # 2. Zero mid-sentence dashes (" - ")
    # 3. Exact formula: "notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs"
    # 4. Inquisitive posture: understand their real blockers, see if we can solve them
    body = f"""Bonjour {name},

J'observe avec attention le développement de {company} et {pitch_hook}. Votre attachement à {core_value} constitue un atout précieux pour votre rayonnement.

Je vous écris au nom de Domtom Connect. Nous avons créé cet écosystème d'affaires pour apporter des solutions concrètes aux défis des dirigeants et entreprises issus de la Caraïbe, d'Afrique et de leurs diasporas.

Notre dispositif s'articule notamment autour de notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, ainsi que d'un service de copilotage opérationnel en tête-à-tête et d'un réseau d'affaires direct.

Ma démarche aujourd'hui est d'échanger directement avec vous afin de mieux cerner vos problématiques actuelles, vos priorités de croissance et vos blocages éventuels, pour déterminer en toute lucidité si nos leviers peuvent y répondre efficacement.

Seriez-vous disponible pour un court échange de quinze minutes la semaine prochaine afin de faire le point de vive voix ?

Vous pouvez choisir le moment qui vous convient sur ce lien
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com"""

    subject = f"Échange sur vos objectifs et priorités de développement pour {company}"
    
    return subject, body

def run():
    print(f"Test de {len(RAW_CANDIDATES)} candidats initiaux...")
    valid_leads = []
    
    for c in RAW_CANDIDATES:
        email = c["email"].lower().strip()
        comp = c["company"].strip()
        
        # 1. Dedup check
        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"[DOUBLON/EXCLUSION] {comp} ({email}) -> {reason}")
            continue
            
        # 2. DNS/MX check
        ok, err = verify_email_target(email)
        if not ok:
            print(f"[DNS/MX FAIL] {comp} ({email}) -> {err}")
            continue
            
        # 3. Build email and check rules
        subj, body = build_personalized_email(c)
        if ":" in subj or ":" in body:
            print(f"[STYLE FAIL :] {comp} contient un deux-points !")
            continue
        if " - " in subj or " - " in body:
            print(f"[STYLE FAIL -] {comp} contient un tiret d'incise !")
            continue
            
        c["subject"] = subj
        c["body"] = body
        valid_leads.append(c)
        print(f"[VALIDE 100%] {comp} ({email}) -> {c['category']}")

    print(f"\nTotal validés : {len(valid_leads)} / {len(RAW_CANDIDATES)}")
    
    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_validated_leads.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(valid_leads, f, ensure_ascii=False, indent=2)
    print(f"Sauvegardé dans {out_file}")

if __name__ == "__main__":
    run()
