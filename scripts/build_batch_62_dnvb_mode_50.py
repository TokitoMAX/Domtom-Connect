# -*- coding: utf-8 -*-
"""
Génération du BATCH 62 avec segmentation intelligente :
- Angle 1 (Accompagnement & Structuration de Modèle) pour les ateliers artisanaux et créateurs locaux
- Angle 2 (Canal Direct DTC Pulse & Réduction Coûts Ads) pour les DNVB, marques e-commerce et boutiques établies
- Règles : Zéro deux-points, zéro tiret d'incise, formule sacrée, lien Calendly
"""

import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

TARGETS = [
    # --- GROUPE MARQUES & E-COMMERCE (Angle Vente Directe & DTC Pulse) ---
    {
        "company": "Dody Shop",
        "email": "contact@dodyshop.com",
        "territory": "Guadeloupe",
        "universe": "de la mode créole et du prêt-à-porter madras",
        "angle": "ecom"
    },
    {
        "company": "Shaeri Paris",
        "email": "hello@shaeri.fr",
        "territory": "France / Diaspora",
        "universe": "des soins capillaires naturels texturés",
        "angle": "ecom"
    },
    {
        "company": "Boucles d'Ébène",
        "email": "contact@bouclesdebene.com",
        "territory": "France / Diaspora",
        "universe": "de la valorisation du cheveu afro-caribéen",
        "angle": "ecom"
    },
    {
        "company": "Yodi Beauty",
        "email": "contact@yodibeauty.com",
        "territory": "France / Diaspora",
        "universe": "des soins cosmétiques naturels et écoresponsables",
        "angle": "ecom"
    },
    {
        "company": "OÜA Concept",
        "email": "christinepicard@oua-concept.com",
        "territory": "Guadeloupe",
        "universe": "de la valorisation des créateurs et de l'artisanat créole",
        "angle": "ecom"
    },
    {
        "company": "Terra Ô",
        "email": "bonjour@terra-o.fr",
        "territory": "Martinique / Réunion",
        "universe": "des cosmétiques naturels inspirés de la flore insulaire",
        "angle": "ecom"
    },
    {
        "company": "Jewellassy",
        "email": "jewellassy@gmail.com",
        "territory": "France / Diaspora",
        "universe": "de la mode wax et des créations sur-mesure",
        "angle": "ecom"
    },
    {
        "company": "Atelier RafMar",
        "email": "atelier_rafmar@yahoo.com",
        "territory": "France / Diaspora",
        "universe": "du prêt-à-porter et des créations modernes en wax",
        "angle": "ecom"
    },
    {
        "company": "L'Atelier du Wax",
        "email": "contact@modeafricaine.com",
        "territory": "France / Diaspora",
        "universe": "de la mode et des tissus africains",
        "angle": "ecom"
    },
    {
        "company": "Thiyya Création",
        "email": "mariellejerzissi@hotmail.fr",
        "territory": "France / Diaspora",
        "universe": "des vêtements créateurs et accessoires wax",
        "angle": "ecom"
    },
    {
        "company": "Afrika Color",
        "email": "contacto@afrikacolor.com",
        "territory": "France / Diaspora",
        "universe": "du textile et prêt-à-porter afro-contemporain",
        "angle": "ecom"
    },
    {
        "company": "Magic Afro",
        "email": "contact@magicafro.fr",
        "territory": "France / Diaspora",
        "universe": "des beurres végétaux et soins capillaires naturels",
        "angle": "ecom"
    },
    {
        "company": "Créol'Attitude",
        "email": "contact@creolattitude.com",
        "territory": "Guadeloupe",
        "universe": "du prêt-à-porter créole contemporain",
        "angle": "ecom"
    },
    {
        "company": "Liyann Marketplace",
        "email": "contact@liyann.fr",
        "territory": "Antilles / Guyane",
        "universe": "de la promotion des créateurs caribéens",
        "angle": "ecom"
    },
    {
        "company": "Karuni Artisanat",
        "email": "contact@karuni.fr",
        "territory": "France / Diaspora",
        "universe": "des bijoux et créations équitables",
        "angle": "ecom"
    },
    {
        "company": "Mahatsara",
        "email": "contact@mahatsara.com",
        "territory": "France / Diaspora",
        "universe": "des accessoires et créations artisanales éthiques",
        "angle": "ecom"
    },
    {
        "company": "Kafrine Mode",
        "email": "contact@kafrine.fr",
        "territory": "La Réunion / France",
        "universe": "du textile et créations d'inspiration réunionnaise",
        "angle": "ecom"
    },
    {
        "company": "Le Comptoir des Îles",
        "email": "contact@comptoirdesiles.fr",
        "territory": "France / DOM-TOM",
        "universe": "des produits et senteurs des îles",
        "angle": "ecom"
    },
    {
        "company": "Bio des Îles",
        "email": "contact@biodesiles.fr",
        "territory": "France / DOM-TOM",
        "universe": "des soins bien-être et cosmétiques insulaires",
        "angle": "ecom"
    },
    {
        "company": "Madin Store",
        "email": "contact@madinstore.com",
        "territory": "Martinique",
        "universe": "de la mise en avant des marques martiniquaises",
        "angle": "ecom"
    },
    {
        "company": "Afro Carib Market",
        "email": "contact@afrocaribmarket.com",
        "territory": "France / Diaspora",
        "universe": "de la valorisation des produits caribéens",
        "angle": "ecom"
    },
    {
        "company": "Avril Cosmétique Réunion",
        "email": "reunion@avril-beaute.fr",
        "territory": "La Réunion",
        "universe": "des cosmétiques bio et soins accessibles",
        "angle": "ecom"
    },
    {
        "company": "Kariderm",
        "email": "info@kariderm.com",
        "territory": "France / Afrique",
        "universe": "des soins au beurre de karité équitable",
        "angle": "ecom"
    },
    {
        "company": "Bazara'Pagne",
        "email": "contact@bazarapagne.com",
        "territory": "France / Diaspora",
        "universe": "de la mode contemporaine et créations wax",
        "angle": "ecom"
    },
    {
        "company": "Ekokoza",
        "email": "info@ekokoza.fr",
        "territory": "France",
        "universe": "des matières premières végétales et cosmétiques",
        "angle": "ecom"
    },

    # --- GROUPE ARTISANS, SAVONNERIES & CRÉATEURS D'ART (Angle Accompagnement Stratégique & Croissance) ---
    {
        "company": "L'Atelier de Mu",
        "email": "muriel@latelierdemu.com",
        "territory": "La Réunion",
        "universe": "des savons naturels et soins saponifiés à froid",
        "angle": "accompagnement"
    },
    {
        "company": "Genesis Soap",
        "email": "contact@genesissoap.fr",
        "territory": "Guadeloupe",
        "universe": "des savons artisanaux aux actifs tropicaux",
        "angle": "accompagnement"
    },
    {
        "company": "La Nébuleuse",
        "email": "nebuleuse.savonnerie@hotmail.com",
        "territory": "Guadeloupe",
        "universe": "des cosmétiques et savons artisanaux locaux",
        "angle": "accompagnement"
    },
    {
        "company": "La Boutik Bio",
        "email": "contact@laboutikbio.com",
        "territory": "La Réunion",
        "universe": "des cosmétiques bio et produits bien-être",
        "angle": "accompagnement"
    },
    {
        "company": "Les Petits Savons de Steph",
        "email": "contact@lespetitssavonsdesteph.fr",
        "territory": "Martinique",
        "universe": "des savons artisanaux naturels et zéro déchet",
        "angle": "accompagnement"
    },
    {
        "company": "Lalys Cosmétiques",
        "email": "commandes.lalys@gmail.com",
        "territory": "Guadeloupe",
        "universe": "des soins cosmétiques naturels et véganes",
        "angle": "accompagnement"
    },
    {
        "company": "Dufay Thysalia",
        "email": "crail.savonnerieartisanale@gmail.com",
        "territory": "Guadeloupe",
        "universe": "des cosmétiques et savons écoresponsables",
        "angle": "accompagnement"
    },
    {
        "company": "Les Secrets des Abeilles",
        "email": "lessecretsdesabeilles@gmail.com",
        "territory": "La Réunion",
        "universe": "des savons naturels au miel et à la cire d'abeille",
        "angle": "accompagnement"
    },
    {
        "company": "NaturHope",
        "email": "naturhope@gmail.com",
        "territory": "La Réunion",
        "universe": "des cosmétiques et soins naturels péi",
        "angle": "accompagnement"
    },
    {
        "company": "Le Poisson Lune",
        "email": "lesmondesdupoissonlune@gmail.com",
        "territory": "Guadeloupe",
        "universe": "des créations artisanales et bijoux d'art",
        "angle": "accompagnement"
    },
    {
        "company": "Sabuni & Cie",
        "email": "contact@sabuni-cie.fr",
        "territory": "France / Diaspora",
        "universe": "des savons artisanaux d'inspiration afro",
        "angle": "accompagnement"
    },
    {
        "company": "Savonnerie Cornet",
        "email": "contact@savonnerie-cornet.com",
        "territory": "France",
        "universe": "de la savonnerie artisanale de tradition",
        "angle": "accompagnement"
    },
    {
        "company": "Bulles en Blok",
        "email": "contact@bullesenblok.fr",
        "territory": "France",
        "universe": "de la savonnerie artisanale bio",
        "angle": "accompagnement"
    },
    {
        "company": "Madras Design",
        "email": "madrasdesign.mart@gmail.com",
        "territory": "Martinique",
        "universe": "de la création textile et confection madras",
        "angle": "accompagnement"
    },
    {
        "company": "GADEPAM Artisanat",
        "email": "contact@gadepam.com",
        "territory": "Guyane",
        "universe": "de l'artisanat et des matières traditionnelles de Guyane",
        "angle": "accompagnement"
    },
    {
        "company": "A mo bèt",
        "email": "contact@amobet.com",
        "territory": "Guyane",
        "universe": "de la bijouterie artisanale et créations locales",
        "angle": "accompagnement"
    },
    {
        "company": "Karu Nature",
        "email": "contact@karunature.com",
        "territory": "Guadeloupe",
        "universe": "des soins naturels aux actifs tropicaux",
        "angle": "accompagnement"
    },
    {
        "company": "Ti Kozé Cosmétiques",
        "email": "contact@tikoze.com",
        "territory": "Guadeloupe",
        "universe": "de la cosmétique artisanale des Antilles",
        "angle": "accompagnement"
    },
    {
        "company": "Casa Nature",
        "email": "contact@casanature-savonnerie.fr",
        "territory": "France",
        "universe": "des savons artisanaux saponifiés à froid",
        "angle": "accompagnement"
    },
    {
        "company": "En Douce Heure",
        "email": "contact@endouceheure.fr",
        "territory": "France",
        "universe": "de la cosmétique solide et savonnerie artisanale",
        "angle": "accompagnement"
    },
    {
        "company": "Mes L de Savon",
        "email": "mesldesavon@gmail.com",
        "territory": "France",
        "universe": "des créations savonnières artisanales",
        "angle": "accompagnement"
    },
    {
        "company": "La Fabrika Gemmes",
        "email": "guido.lafabrikagemmes@gmail.com",
        "territory": "Guadeloupe",
        "universe": "de la joaillerie et bijoux artisanaux",
        "angle": "accompagnement"
    },
    {
        "company": "Tosca Artisanat",
        "email": "tosca.artisanat@gmail.com",
        "territory": "Martinique",
        "universe": "des bijoux artisanaux et pierres fines",
        "angle": "accompagnement"
    },
    {
        "company": "La Bizouterie",
        "email": "contact@labizouterie.com",
        "territory": "Guadeloupe",
        "universe": "des bijoux artisanaux faits main aux Antilles",
        "angle": "accompagnement"
    },
    {
        "company": "OCEOM Marie-Galante",
        "email": "contact@oceom.fr",
        "territory": "Guadeloupe (Marie-Galante)",
        "universe": "des créations et bijoux d'inspiration marine",
        "angle": "accompagnement"
    }
]

def generate_lead(target):
    company = target["company"]
    universe = target["universe"]
    territory = target["territory"]
    angle = target["angle"]
    
    if angle == "accompagnement":
        subject = f"Accompagnement et structuration de {company} / Domtom Connect"
        body = f"""Bonjour,

Je me permets de vous contacter car j'apprécie beaucoup l'authenticité et le savoir-faire remarquable que vous développez avec {company} dans l'univers {universe}.

Chez Domtom Connect, nous accompagnons concrètement les artisans et entrepreneurs ultramarins dans la structuration de leur activité et le passage de cap vers un modèle plus rentable et durable. Notre écosystème relie directement toute la Caraïbe, le continent africain et sa diaspora.

Sur le terrain, nous constatons que les créateurs indépendants ont souvent un produit d'exception, mais manquent de temps pour structurer leur commercialisation, capter des clients réguliers et ouvrir de nouveaux marchés hors de leur zone immédiate.

C'est précisément là que nous intervenons, en vous apportant un accompagnement stratégique sur-mesure ainsi qu'un accès direct à notre réseau business et à l'application DTC Pulse.

Seriez-vous ouvert pour convenir d'un court échange téléphonique de dix minutes afin de faire le point sur vos priorités actuelles,

Vous pouvez choisir directement le créneau qui vous convient sur ce lien,

calendly.com/domtomconnect/30min

Au plaisir d'échanger et de soutenir le développement de {company},

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""
    else:
        subject = f"Vente directe et visibilité pour {company} / Domtom Connect"
        body = f"""Bonjour,

Je me permets de vous contacter car nous suivons de près la belle dynamique que vous portez avec {company} dans l'univers {universe}.

Chez Domtom Connect, nous bâtissons le premier écosystème d'accélération commerciale et de visibilité reliant directement toute la Caraïbe, le continent africain et sa diaspora.

Le défi majeur des marques et boutiques indépendantes aujourd'hui est bien connu, l'envolée des coûts publicitaires sur les réseaux sociaux traditionnels réduit les marges, alors que les débouchés vers nos territoires et la diaspora restent immenses.

C'est la raison pour laquelle nous mettons à votre disposition l'application mobile DTC Pulse et notre réseau d'affaires, afin de vous offrir une vitrine vidéo captivante et un canal de vente directe sans intermédiaire auprès d'une communauté ciblée.

Seriez-vous partant pour un bref échange de dix minutes afin de voir comment intégrer {company} dans cette dynamique,

Vous pouvez sélectionner le créneau qui vous arrange directement ici,

calendly.com/domtomconnect/30min

Au plaisir d'échanger prochainement,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""

    # Contrôles stricts
    if ":" in subject: raise ValueError(f"Deux-points dans sujet {company}")
    if ":" in body: raise ValueError(f"Deux-points dans corps {company}")
    if " - " in subject: raise ValueError(f"Tiret dans sujet {company}")
    if " - " in body: raise ValueError(f"Tiret dans corps {company}")
    if "toute la Caraïbe, le continent africain et sa diaspora" not in body:
        raise ValueError(f"Formule sacrée manquante pour {company}")

    return {
        "company": company,
        "email": target["email"],
        "territory": territory,
        "subject": subject,
        "body": body,
        "angle": angle
    }

output = [generate_lead(t) for t in TARGETS]

out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batch_62_dnvb_mode_50.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"SUCCÈS : {len(output)} cibles segmentées générées dans {out_file} !")
print(f"- Angle Accompagnement Stratégique : {sum(1 for x in output if x['angle'] == 'accompagnement')}")
print(f"- Angle Vente Directe & DTC Pulse : {sum(1 for x in output if x['angle'] == 'ecom')}")
