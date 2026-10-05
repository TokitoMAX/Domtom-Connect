import json, os, sys, re, ssl, smtplib
sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts"))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

CANDIDATES = [
    # --- GROUPE 1 : MARQUES, TERROIRS & E-COMMERCE ---
    {
        "company": "La Laitière 971",
        "name": "Direction La Laitière 971",
        "email": "contact@lalaitiere971.com",
        "website": "https://www.lalaitiere971.com",
        "source": "Site officiel lalaitiere971.com",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "hook": "votre gamme de soins naturels et artisanaux élaborés en Guadeloupe",
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
        "hook": "votre positionnement sur les rituels capillaires et soins botaniques caribéens",
        "core_value": "l'expertise formulatoire végétale adaptée aux besoins réels de notre communauté"
    },
    {
        "company": "Face And Beauty Guadeloupe",
        "name": "Direction Face And Beauty",
        "email": "contact@faceandbeauty-guadeloupe.com",
        "website": "https://faceandbeauty-guadeloupe.com",
        "source": "Site officiel faceandbeauty-guadeloupe.com",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "hook": "votre distribution spécialisée de produits esthétiques et capillaires en Guadeloupe",
        "core_value": "l'accès local à des produits de beauté exigeants et de qualité"
    },
    {
        "company": "Genesis Soap",
        "name": "Direction Genesis Soap",
        "email": "contact@genesissoap.fr",
        "website": "https://genesissoap.fr",
        "source": "Site officiel genesissoap.fr",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "hook": "vos savons saponifiés à froid et créations artisanales saines en Guadeloupe",
        "core_value": "la cosmétique biodégradable et le respect des écosystèmes tropicaux"
    },
    {
        "company": "Parfums des Îles Martinique",
        "name": "Direction Parfums des Îles",
        "email": "contact@parfums-des-iles.com",
        "website": "https://parfums-des-iles.com",
        "source": "Site officiel parfums-des-iles.com",
        "territory": "Martinique",
        "category": "Marques & Terroirs",
        "hook": "vos fragrances et créations olfactives artisanales inspirées des Caraïbes",
        "core_value": "le raffinement sensoriel et l'authenticité des senteurs insulaires"
    },
    {
        "company": "Bosana Cosmétiques",
        "name": "Direction Bosana",
        "email": "contact@bosanacosmetiques.com",
        "website": "https://bosanacosmetiques.com",
        "source": "Site officiel bosanacosmetiques.com",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "hook": "votre savonnerie artisanale et vos soins inspirés des richesses botaniques réunionnaises",
        "core_value": "la saponification à froid et la traçabilité des matières premières péi"
    },
    {
        "company": "Ti Soap Péi",
        "name": "Direction Ti Soap Péi",
        "email": "info@tisoappei.com",
        "website": "https://tisoappei.re",
        "source": "Site officiel tisoappei.re",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "hook": "votre gamme de savons naturels et écoresponsables fabriqués à La Réunion",
        "core_value": "le zéro déchet et l'artisanat éthique au service du bien-être"
    },
    {
        "company": "Maëva Réunion",
        "name": "Direction Maëva Réunion",
        "email": "contact@maevareunion.fr",
        "website": "https://maevareunion.fr",
        "source": "Site officiel maevareunion.fr",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "hook": "votre réseau de distribution et accompagnement officinal en marques naturelles à La Réunion",
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
        "hook": "votre catalogue d'épicerie fine antillaise et de spécialités créoles",
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
        "hook": "votre production artisanale de spiritueux authentiques à Saint-Philippe",
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
        "hook": "vos créations de rhums arrangés et d'élixirs artisanaux à la Plaine des Palmistes",
        "core_value": "l'authenticité des macérations aux fruits frais et aux épices péi"
    },
    {
        "company": "Bois Corail Réunion",
        "name": "Direction Bois Corail",
        "email": "contact@boiscorail.re",
        "website": "https://boiscorail.re",
        "source": "Site officiel boiscorail.re",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "hook": "votre sélection soignée d'épicerie fine et de confitures artisanales de La Réunion",
        "core_value": "la préservation des recettes traditionnelles et la gourmandise péi"
    },
    {
        "company": "Réunion des Saveurs",
        "name": "Direction Réunion des Saveurs",
        "email": "contact@reuniondessaveurs.re",
        "website": "https://reuniondessaveurs.re",
        "source": "Site officiel reuniondessaveurs.re",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "hook": "votre mise en avant des artisans et agriculteurs passionnés de La Réunion",
        "core_value": "le rayonnement collectif des filières d'excellence réunionnaises"
    },
    {
        "company": "La Cave du Sommelier Réunion",
        "name": "Direction La Cave du Sommelier",
        "email": "lacave@sommelier.re",
        "website": "https://sommelier.re",
        "source": "Site officiel sommelier.re",
        "territory": "La Réunion",
        "category": "Marques & Terroirs",
        "hook": "votre expertise œnologique et votre offre d'épicerie fine d'exception",
        "core_value": "le conseil de dégustation et la recherche des meilleurs crus"
    },
    {
        "company": "Papilles et Prestige",
        "name": "Direction Papilles et Prestige",
        "email": "contact@papillesetprestige.com",
        "website": "https://papillesetprestige.com",
        "source": "Site officiel papillesetprestige.com",
        "territory": "Guadeloupe",
        "category": "Marques & Terroirs",
        "hook": "votre cave d'exception et vos sélections gourmandes haut de gamme à Baie-Mahault",
        "core_value": "l'exigence gustative et la mise en valeur des terroirs nobles"
    },
    {
        "company": "Caribbean Jewelry",
        "name": "Direction Caribbean Jewelry",
        "email": "contact@caribbeanjewelry.fr",
        "website": "https://caribbeanjewelry.fr",
        "source": "Site officiel caribbeanjewelry.fr",
        "territory": "Martinique",
        "category": "Marques & Terroirs",
        "hook": "votre collection de bijoux et parures caribéennes précieuses",
        "core_value": "la finesse orfèvre et la célébration du patrimoine créole"
    },

    # --- GROUPE 2 : CONCIERGERIES & IMMOBILIER PRESTIGE ---
    {
        "company": "Karukera Conciergerie",
        "name": "Direction Karukera Conciergerie",
        "email": "contact@karukera-conciergerie.com",
        "website": "https://karukera-conciergerie.com",
        "source": "Site officiel karukera-conciergerie.com",
        "territory": "Guadeloupe",
        "category": "Immobilier & Conciergerie",
        "hook": "votre intendance complète de villas de villégiature et d'appartements de standing",
        "core_value": "la sérénité des propriétaires et le service d'excellence pour les séjours de prestige"
    },
    {
        "company": "JEM Care St Barth",
        "name": "Direction JEM Care",
        "email": "contact@jemcare.fr",
        "website": "https://jemcare.fr",
        "source": "Site officiel jemcare.fr",
        "territory": "Saint-Barthélemy",
        "category": "Immobilier & Conciergerie",
        "hook": "vos prestations de conciergerie privée et de maintenance haut de gamme à Saint-Barthélemy",
        "core_value": "la réactivité discrète et le niveau d'exigence requis sur l'île"
    },
    {
        "company": "Tropical St Barth Conciergerie",
        "name": "Direction Tropical St Barth",
        "email": "conciergerie@tropical-sbh.com",
        "website": "https://tropical-sbh.com",
        "source": "Site officiel tropical-sbh.com",
        "territory": "Saint-Barthélemy",
        "category": "Immobilier & Conciergerie",
        "hook": "votre accompagnement sur-mesure pour les séjours et propriétés exclusives à Saint-Barthélemy",
        "core_value": "l'hospitalité ultra-personnalisée et la gestion sans faille des attentes VIP"
    },
    {
        "company": "Luxury Homes St Barth",
        "name": "Direction Luxury Homes",
        "email": "contact@luxuryhomes-stbarth.com",
        "website": "https://luxuryhomes-stbarth.com",
        "source": "Site officiel luxuryhomes-stbarth.com",
        "territory": "Saint-Barthélemy",
        "category": "Immobilier & Conciergerie",
        "hook": "votre catalogue de propriétés d'exception et votre conciergerie dédiée à Saint-Barthélemy",
        "core_value": "la gestion immobilière d'ultra-luxe et la fidélisation des clientèles internationales"
    },
    {
        "company": "My St Barth Concierge",
        "name": "Direction My St Barth Concierge",
        "email": "contact@mystbarthconcierge.com",
        "website": "https://mystbarthconcierge.com",
        "source": "Site officiel mystbarthconcierge.com",
        "territory": "Saint-Barthélemy",
        "category": "Immobilier & Conciergerie",
        "hook": "vos services exclusifs d'intendance de villas et d'assistance privée pour voyageurs d'affaires",
        "core_value": "la personnalisation intégrale et la maîtrise logistique sur l'île"
    },
    {
        "company": "YAQOOA Immobilier Abidjan",
        "name": "Direction YAQOOA Immobilier",
        "email": "contact@yaqooa.com",
        "website": "https://yaqooa.com",
        "source": "Site officiel yaqooa.com",
        "territory": "Côte d'Ivoire",
        "category": "Immobilier & Conciergerie",
        "hook": "vos projets de développement immobilier et de commercialisation de résidences modernes à Abidjan",
        "core_value": "la transparence transactionnelle et l'accompagnement des investisseurs régionaux"
    },
    {
        "company": "Caroline Immobilier Abidjan",
        "name": "Direction Caroline Immobilier",
        "email": "contact@carolineimmo.com",
        "website": "https://carolineimmo.com",
        "source": "Site officiel carolineimmo.com",
        "territory": "Côte d'Ivoire",
        "category": "Immobilier & Conciergerie",
        "hook": "votre portefeuille de biens résidentiels et professionnels de qualité à Abidjan",
        "core_value": "l'expertise du marché ivoirien et la sécurisation des acquisitions patrimoniales"
    },
    {
        "company": "MD Immobilier Abidjan",
        "name": "Direction MD Immobilier",
        "email": "contact@mdimmo-ci.com",
        "website": "https://mdimmo-ci.com",
        "source": "Site officiel mdimmo-ci.com",
        "territory": "Côte d'Ivoire",
        "category": "Immobilier & Conciergerie",
        "hook": "vos mandats de gestion et d'intermédiation sur les biens de prestige à Abidjan",
        "core_value": "la rigueur juridique et la confiance accordée par les investisseurs de la diaspora"
    },
    {
        "company": "TEYA Immobilier Dakar",
        "name": "Direction TEYA Immobilier",
        "email": "contact@teyaimmobilier.com",
        "website": "https://teyaimmobilier.com",
        "source": "Site officiel teyaimmobilier.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre gestion immobilière rigoureuse et vos offres d'habitat de standing à Dakar",
        "core_value": "le professionnalisme opérationnel et la confiance bâtie avec les propriétaires"
    },
    {
        "company": "Everest Immo Sénégal",
        "name": "Direction Everest Immo",
        "email": "contact@everest-immo.com",
        "website": "https://everest-immo.com",
        "source": "Site officiel everest-immo.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre sélection de logements de standing et d'opportunités d'investissement locatif au Sénégal",
        "core_value": "l'analyse financière pointue et l'accompagnement patrimonial durable"
    },
    {
        "company": "Agence Replik Dakar",
        "name": "Direction Agence Replik",
        "email": "contact@replikimmo.com",
        "website": "https://replikimmo.com",
        "source": "Site officiel replikimmo.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre approche novatrice de la transaction et du conseil immobilier à Dakar",
        "core_value": "l'écoute active des porteurs de projets et la maîtrise foncière"
    },
    {
        "company": "Suzosky Conciergerie Abidjan",
        "name": "Direction Suzosky Conciergerie",
        "email": "contact@conciergerie-privee-suzosky.com",
        "website": "https://conciergerie-privee-suzosky.com",
        "source": "Site officiel conciergerie-privee-suzosky.com",
        "territory": "Côte d'Ivoire",
        "category": "Immobilier & Conciergerie",
        "hook": "votre gamme de conciergerie privée et d'assistance exécutive à Abidjan",
        "core_value": "le gain de temps précieux et l'intendance sur-mesure pour dirigeants et voyageurs"
    },
    {
        "company": "DIOUF Errands & Services",
        "name": "Direction DIOUF Services",
        "email": "contact@diouferrandsservices.com",
        "website": "https://diouferrandsservices.com",
        "source": "Site officiel diouferrandsservices.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "vos solutions d'intendance professionnelle et de conciergerie logistique à Dakar",
        "core_value": "la fiabilité d'exécution et le service direct aux entreprises et particuliers exigeants"
    },
    {
        "company": "FORZA Luxury Concierge",
        "name": "Direction FORZA Luxury",
        "email": "contact@forza-luxury.com",
        "website": "https://forza-luxury.com",
        "source": "Site officiel forza-luxury.com",
        "territory": "Afrique / International",
        "category": "Immobilier & Conciergerie",
        "hook": "vos prestations de conciergerie VIP et d'accueil haut de gamme",
        "core_value": "l'excellence du service discret et la satisfaction sans compromis"
    },

    # --- GROUPE 3 : PME, EXPERTISE & SERVICES B2B ---
    {
        "company": "Ecofip Guyane",
        "name": "Direction Ecofip",
        "email": "contact@ecofip.com",
        "website": "https://ecofip.com",
        "source": "Site officiel ecofip.com",
        "territory": "Guyane / Outre-Mer",
        "category": "PME & Services B2B",
        "hook": "votre ingénierie financière en défiscalisation productive pour les PME ultramarines",
        "core_value": "le soutien à l'investissement productif et la croissance des entreprises locales"
    },
    {
        "company": "Assuranoo Guyane",
        "name": "Direction Assuranoo",
        "email": "contact@assuranoo.gf",
        "website": "https://assuranoo.gf",
        "source": "Site officiel assuranoo.gf",
        "territory": "Guyane",
        "category": "PME & Services B2B",
        "hook": "votre solution d'intermédiation en assurances et protection des entreprises guyanaises",
        "core_value": "l'accompagnement de proximité et l'adaptation aux réalités économiques locales"
    },
    {
        "company": "Soregor TGS France Antilles",
        "name": "Direction TGS France Antilles",
        "email": "contact@tgs-france.fr",
        "website": "https://www.tgs-france.fr",
        "source": "Site officiel tgs-france.fr",
        "territory": "Guadeloupe & Martinique",
        "category": "PME & Services B2B",
        "hook": "votre accompagnement pluridisciplinaire en expertise comptable et conseil stratégique aux PME",
        "core_value": "la solidité financière et la pérennisation des entreprises insulaires"
    },
    {
        "company": "Fidag Antilles",
        "name": "Direction Fidag Antilles",
        "email": "contact@fidag.fr",
        "website": "https://fidag.fr",
        "source": "Site officiel fidag.fr",
        "territory": "Guadeloupe",
        "category": "PME & Services B2B",
        "hook": "votre expertise de conseil financier et d'audit pour les structures ultramarines",
        "core_value": "la conformité rigoureuse et la sécurisation des trajectoires de croissance"
    }
]

def build_email_for_lead(lead):
    name = lead["name"]
    company = lead["company"]
    hook = lead["hook"]
    core_value = lead["core_value"]
    
    # 1. Zero colons
    # 2. Zero mid-sentence dashes
    # 3. Exact formula: "notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs"
    # 4. Clear presentation of Domtom Connect
    # 5. Open posture pushing them to speak about their real bottlenecks
    
    body = f"""Bonjour {name},

J'observe avec attention le parcours de {company} et {hook}. Votre attachement à {core_value} constitue un atout précieux pour votre rayonnement.

Je vous contacte au nom de Domtom Connect. Nous avons créé cet écosystème d'affaires pour apporter des solutions concrètes aux défis des dirigeants et entreprises issus de la Caraïbe, d'Afrique et de leurs diasporas.

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

def main():
    print(f"Validation stricte de {len(CANDIDATES)} cibles réelles...")
    validated = []
    
    for c in CANDIDATES:
        email = c["email"].lower().strip()
        comp = c["company"].strip()
        
        # 1. Dedup check
        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"[REJET DÉDOUBLONNAGE] {comp} ({email}) -> {reason}")
            continue
            
        # 2. DNS/MX check
        ok, err = verify_email_target(email)
        if not ok:
            print(f"[REJET DNS/MX] {comp} ({email}) -> {err}")
            continue
            
        # 3. Style rules check
        subj, body = build_email_for_lead(c)
        if ":" in subj or ":" in body:
            print(f"[REJET STYLE :] {comp} contient un deux-points !")
            continue
        if " - " in subj or " - " in body:
            print(f"[REJET STYLE -] {comp} contient un tiret !")
            continue
            
        c["subject"] = subj
        c["body"] = body
        validated.append(c)
        print(f"[VALIDÉ 100%] {comp} ({email}) -> {c['territory']} ({c['category']})")
        
    print(f"\n==========================================")
    print(f"TOTAL VALIDÉS À 100% : {len(validated)} sur {len(CANDIDATES)} candidats.")
    print(f"==========================================")
    
    out_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts", "batch_69_tres_haute_conversion_validated.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(validated, f, ensure_ascii=False, indent=2)
    print(f"Fichier final enregistré : {out_file}")

if __name__ == "__main__":
    main()
