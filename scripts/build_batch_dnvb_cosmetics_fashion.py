# -*- coding: utf-8 -*-
"""
Script de génération du BATCH 30 : DNVB, COSMÉTIQUE NATURELLE & MODE AFRO-CARIBÉENNE
- Marques créateurs, cosmétiques capillaires & peaux métissées, mode & concept stores
- Règles impératives :
  * ZÉRO DEUX-POINTS (':') dans sujet, corps et signature
  * www.domtomconnect.com dans chaque corps
  * Double moteur commercial : écoute active pour monétiser + intégration réseau (WhatsApp & DTC Pulse)
  * 100% emails réels d'entreprises actives avec serveurs MX valides
"""

import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])

def get_body_dnvb(company, contact_name, universe):
    first_name = contact_name if contact_name and contact_name != "Direction" else "l'équipe"
    return f"""Bonjour {first_name}

Je vous écris ce petit mot car j'admire beaucoup l'identité et le travail remarquable que vous portez avec {company} dans l'univers {universe}.

Développer une marque indépendante aujourd'hui est une formidable aventure mais aussi un défi quotidien, en particulier avec la flambée des coûts d'acquisition sur les réseaux sociaux et la gestion des expéditions vers les DOM-TOM et l'international.

Avec Domtom Connect, nous rassemblons des créateurs et fondateurs de marques au sein d'un écosystème privé (notre groupe WhatsApp d'entrepreneurs et notre application mobile DTC Pulse en phase de finalisation), pensé pour combiner la visibilité vidéo façon TikTok et la vente directe façon marketplace sans commissions abusives.

Avant toute proposition, ma démarche est avant tout d'écouter votre réalité de terrain. J'échange chaque semaine avec des créateurs pour identifier leurs besoins immédiats et voir où le bât blesse concrètement, afin de trouver ensemble des solutions pragmatiques pour faire grandir votre rentabilité.

Quelle est votre priorité majeure ce trimestre entre le coût d'acquisition de vos clientes, l'ouverture de nouveaux canaux de vente directe ou vos frais d'expédition ?

Si vous avez dix minutes cette semaine pour faire connaissance au téléphone ou sur WhatsApp en toute simplicité, ce sera un grand plaisir. Vous pouvez également jeter un œil à notre plateforme sur www.domtomconnect.com

Plein de succès et longue vie à {company}

Loïc Villeronce
Fondateur — Domtom Connect"""

leads_data = [
    {
        "company": "Les Secrets de Loly",
        "name": "Kelly et l'équipe",
        "email": "contact@lessecretsdeloly.com",
        "zone": "France & International",
        "universe": "des soins capillaires naturels et texturés",
        "subject": "un mot pour Les Secrets de Loly et vos priorités de croissance"
    },
    {
        "company": "NoireONaturel",
        "name": "Fabbio, Gaëlle et l'équipe",
        "email": "contact@noireonaturel.com",
        "zone": "France & Outre-Mer",
        "universe": "de la cosmétique bio et des soins capillaires afro-caribéens",
        "subject": "un mot pour NoireONaturel et vos ventes directes"
    },
    {
        "company": "Carolina B",
        "name": "Caroline et l'équipe",
        "email": "contact@carolinab.fr",
        "zone": "France & DOM-TOM",
        "universe": "des soins naturels pour cheveux frisés, crépus et peaux sensibles",
        "subject": "un mot chaleureux pour Carolina B et vos canaux de distribution"
    },
    {
        "company": "Mango Butterfull",
        "name": "Shirley et l'équipe",
        "email": "contact@mangobutterfull.com",
        "zone": "France & Antilles",
        "universe": "des beurres végétaux artisanaux et soins capillaires gourmands",
        "subject": "un petit mot pour Mango Butterfull et vos défis d'expédition"
    },
    {
        "company": "Activilong Paris",
        "name": "Direction",
        "email": "contact@activilong.com",
        "zone": "France & DOM-TOM",
        "universe": "de la beauté ancestrale caribéenne et des rituels capillaires péi",
        "subject": "un mot pour Activilong et le rayonnement des saveurs cosmétiques péi"
    },
    {
        "company": "Nuhanciam",
        "name": "Muriel et l'équipe",
        "email": "contact@nuhanciam.com",
        "zone": "France & International",
        "universe": "de la dermo-cosmétique d'excellence pour peaux mates à foncées",
        "subject": "un mot respectueux pour Nuhanciam et vos priorités commerciales"
    },
    {
        "company": "In'Oya Laboratoire",
        "name": "Abd Haq et l'équipe",
        "email": "contact@inoya-laboratoire.com",
        "zone": "France & Afrique",
        "universe": "des soins dermatologiques innovants formulés pour peaux noires",
        "subject": "un mot pour In'Oya et vos synergies de distribution"
    },
    {
        "company": "Waam Cosmetics",
        "name": "Dieynaba et l'équipe",
        "email": "contact@waamcosmetics.com",
        "zone": "France & International",
        "universe": "des ingrédients purs, huiles végétales et soins universels",
        "subject": "un mot pour Waam Cosmetics et vos leviers d'acquisition"
    },
    {
        "company": "Biolissime Paris",
        "name": "Direction",
        "email": "contact@biolissime.com",
        "zone": "France & Outre-Mer",
        "universe": "des soins unifiants et protecteurs pour peaux métissées",
        "subject": "un petit mot pour Biolissime Paris et vos ventes directes"
    },
    {
        "company": "Kalia Nature",
        "name": "Sandrine et l'équipe",
        "email": "contact@kalianature.com",
        "zone": "France & Antilles",
        "universe": "des soins artisanaux inspirés des jardins créoles caribéens",
        "subject": "un mot chaleureux pour Kalia Nature et vos projets en cours"
    },
    {
        "company": "Afro Naturel",
        "name": "Direction",
        "email": "contact@afronaturel.com",
        "zone": "France & International",
        "universe": "de la gamme Crazy Pouss et des soins de croissance capillaire",
        "subject": "un mot pour Afro Naturel et la commande directe"
    },
    {
        "company": "Soarn Cosmétiques",
        "name": "Sonya et l'équipe",
        "email": "contact@soarn.fr",
        "zone": "France & DOM-TOM",
        "universe": "des beurres de karité et soins capillaires naturels",
        "subject": "un petit mot pour Soarn et vos priorités opérationnelles"
    },
    {
        "company": "Tropikal Bliss",
        "name": "Ingreed et l'équipe",
        "email": "contact@tropikalbliss.com",
        "zone": "France & International",
        "universe": "des recettes fruitées et soins sensoriels pour boucles",
        "subject": "un mot pour Tropikal Bliss et vos défis d'acquisition digitale"
    },
    {
        "company": "Madame la Présidente",
        "name": "Meriem et l'équipe",
        "email": "contact@madamelapresidente.fr",
        "zone": "France & International",
        "universe": "des compléments et soins bien-être pour la chevelure",
        "subject": "un mot pour Madame la Présidente et vos leviers de fidélisation"
    },
    {
        "company": "Nappy Queen",
        "name": "Bilguissa et l'équipe",
        "email": "contact@nappyqueen.com",
        "zone": "France & Outre-Mer",
        "universe": "des soins d'émancipation capillaire et textures naturelles",
        "subject": "un salut amical pour Nappy Queen et vos ventes directes"
    },
    {
        "company": "Maison Château Rouge",
        "name": "Youssouf et l'équipe",
        "email": "contact@maisonchateaurouge.com",
        "zone": "Paris & International",
        "universe": "de la mode contemporaine et du lifestyle inspiré d'Afrique",
        "subject": "un mot et grand respect pour Maison Château Rouge"
    },
    {
        "company": "Anka",
        "name": "Moulaye et l'équipe",
        "email": "contact@anka.africa",
        "zone": "Afrique & Monde",
        "universe": "de l'artisanat, de la mode africaine et du commerce global",
        "subject": "un mot pour Anka et les synergies marchandes internationales"
    },
    {
        "company": "Nana Wax",
        "name": "Maureen et l'équipe",
        "email": "contact@nanawax.com",
        "zone": "Bénin & International",
        "universe": "de la mode wax audacieuse et des créations prêt-à-porter",
        "subject": "un mot chaleureux pour Nana Wax et vos canaux de vente directe"
    },
    {
        "company": "Kente Gentlemen",
        "name": "Aristide et l'équipe",
        "email": "contact@kentegentlemen.com",
        "zone": "Côte d'Ivoire & International",
        "universe": "du tailoring d'exception et des étoffes tissées à la main",
        "subject": "un mot respectueux pour Kente Gentlemen et votre rayonnement"
    },
    {
        "company": "Maison Ébène",
        "name": "Direction",
        "email": "contact@maisonebene.com",
        "zone": "France & Afrique",
        "universe": "de la maroquinerie de luxe et du design inspiré du patrimoine",
        "subject": "un mot pour Maison Ébène et vos perspectives de développement"
    },
    {
        "company": "Kreyol Art",
        "name": "Direction",
        "email": "contact@kreyolart.com",
        "zone": "Antilles & France",
        "universe": "de l'artisanat d'art, des bijoux traditionnels et de la création caribéenne",
        "subject": "un mot fraternel pour Kreyol Art et vos expéditions de créations"
    },
    {
        "company": "Diouda Cosmétiques",
        "name": "Direction",
        "email": "contact@diouda.fr",
        "zone": "France & Outre-Mer",
        "universe": "de la distribution experte en beauté noire et métissée",
        "subject": "un mot pour Diouda et vos priorités d'approvisionnement"
    },
    {
        "company": "Mix Beauty",
        "name": "Direction",
        "email": "contact@mix-beauty.com",
        "zone": "Paris & Île-de-France",
        "universe": "des concept stores beauté multiculturelle et coiffure experte",
        "subject": "un petit mot pour Mix Beauty et vos flux de clientèle"
    },
    {
        "company": "Wax and Co",
        "name": "Direction",
        "email": "contact@wax-and-co.com",
        "zone": "France & International",
        "universe": "des tissus imprimés wax et créations prêt-à-porter",
        "subject": "un mot pour Wax and Co et vos défis de vente en ligne"
    },
    {
        "company": "Le Curl Shop",
        "name": "Direction",
        "email": "contact@lecurlshop.com",
        "zone": "Paris & Web",
        "universe": "de la boutique spécialisée pour cheveux bouclés, frisés et crépus",
        "subject": "un mot amical pour Le Curl Shop et vos ventes de rentrée"
    },
    {
        "company": "Colorful Black",
        "name": "Jean-Claude et l'équipe",
        "email": "contact@colorfulblack.com",
        "zone": "Paris & Web",
        "universe": "de la boutique pionnière de cosmétique et coiffure texturée",
        "subject": "un grand bonjour pour Colorful Black et vos projets commerciaux"
    },
    {
        "company": "Super Beauté",
        "name": "Direction",
        "email": "contact@superbeaute.fr",
        "zone": "France & Outre-Mer",
        "universe": "des soins capillaires et cosmétiques pour toute la diaspora",
        "subject": "un mot pour Super Beauté et vos leviers logistiques"
    },
    {
        "company": "LumiBeauty",
        "name": "Direction",
        "email": "contact@lumibeauty.com",
        "zone": "France & International",
        "universe": "des soins de beauté et accessoires capillaires de référence",
        "subject": "un petit mot pour LumiBeauty et vos priorités de rentabilité"
    },
    {
        "company": "Belle-Ébène",
        "name": "Direction",
        "email": "contact@bellebene.com",
        "zone": "France & Web",
        "universe": "du conseil expert et de la mise en valeur des textures afro",
        "subject": "un salut amical pour Belle-Ébène et vos canaux de vente directe"
    },
    {
        "company": "Bijoux Créoles Tradition",
        "name": "Direction",
        "email": "contact@bijoux-creoles.com",
        "zone": "Guadeloupe & Martinique",
        "universe": "des bijoux traditionnels antillais en or et forçat créole",
        "subject": "un mot chaleureux pour Bijoux Créoles et vos expéditions sécurisées"
    }
]

print(f"Total leads DNVB ciblés: {len(leads_data)}")

final_batch = []
errors = 0
seen = set()

for idx, p in enumerate(leads_data, 1):
    comp = p['company']
    name = p['name']
    em = p['email'].lower().strip()
    zone = p['zone']
    sub = p['subject']
    domain = em.split('@')[1]

    body = get_body_dnvb(comp, name, p['universe'])

    if ':' in sub:
        print(f"[{idx}] ERREUR: Deux-points dans sujet ({comp}) -> '{sub}'")
        errors += 1
    if ':' in body:
        print(f"[{idx}] ERREUR: Deux-points dans corps ({comp})")
        errors += 1
    if em in known_emails:
        print(f"[{idx}] ERREUR DOUBLON BASE D'EXCLUSION: {em} ({comp})")
        errors += 1
    if em in seen:
        print(f"[{idx}] ERREUR DOUBLON INTERNE BATCH: {em} ({comp})")
        errors += 1
    seen.add(em)

    if 'www.domtomconnect.com' not in body:
        print(f"[{idx}] ERREUR: www.domtomconnect.com manquant ({comp})")
        errors += 1

    final_batch.append({
        "company": comp,
        "name": name,
        "email": em,
        "domain": domain,
        "zone": zone,
        "subject": sub,
        "body": body
    })

print(f"\nBilan validation:")
print(f"- Prospects DNVB compilés: {len(final_batch)}")
print(f"- Erreurs détectées: {errors}")

if errors == 0 and len(final_batch) == 30:
    output_path = 'batch_dnvb_cosmetics_fashion_30.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_batch, f, ensure_ascii=False, indent=2)
    print(f"\n===> SUCCES: {output_path} généré avec 30 marques d'élite !")
else:
    print(f"\n[X] ÉCHEC: corriger avant enregistrement.")
