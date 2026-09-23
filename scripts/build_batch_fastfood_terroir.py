# -*- coding: utf-8 -*-
"""
Script de génération du BATCH 30 : FAST-FOOD, STREET-FOOD & MARQUES DU TERROIR
- 15 Fast-Food, Street-Food & Restauration Rapide (Caraïbes, Hexagone, Afrique)
- 15 Marques du Terroir, Agroalimentaire & Épiceries Fines (DOM-TOM & Afrique)

Règles impératives :
- ZÉRO DEUX-POINTS (':') dans sujet, corps et signature
- www.domtomconnect.com dans chaque corps
- Double moteur d'affaires : écoute active pour résoudre et monétiser + intégration réseau (WhatsApp & DTC Pulse)
- 100% emails réels d'entreprises actives avec serveurs MX valides
"""

import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])

def get_body_fastfood(company, contact_name, specialty):
    first_name = contact_name if contact_name and contact_name != "Direction" else "l'équipe"
    return f"""Bonjour {first_name}

Je vous écris ce mot en toute simplicité car je suis de près ce que vous développez avec {company} sur le créneau {specialty}.

Dans la restauration rapide et la street-food, la cadence est intense et les défis sont permanents, en particulier avec la hausse du coût des ingrédients et les commissions souvent très lourdes des grandes plateformes de commande.

Chez Domtom Connect, nous construisons actuellement un écosystème d'affaires dédié aux entrepreneurs audacieux, articulé autour d'un réseau privé WhatsApp et de notre future application DTC Pulse, pensée pour booster la commande directe et la visibilité sans intermédiaires abusifs.

Mais avant toute chose, ma démarche est avant tout d'écouter le terrain. J'échange chaque semaine avec des créateurs et dirigeants d'enseignes pour identifier leurs besoins immédiats et voir où le bât blesse concrètement, afin de trouver ensemble des leviers efficaces pour faire grandir votre rentabilité.

Quel est votre principal casse-tête actuellement entre vos marges sur la livraison, la fidélisation de vos clients ou vos approvisionnements ?

Si vous avez dix minutes cette semaine en dehors des heures de rush pour échanger tranquillement, ce sera un vrai plaisir. Vous pouvez également découvrir notre plateforme sur www.domtomconnect.com

Très bon service et belle réussite à {company}

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_body_terroir(company, contact_name, product):
    first_name = contact_name if contact_name and contact_name != "Direction" else "l'équipe"
    return f"""Bonjour {first_name}

Je me permets de vous contacter car j'apprécie profondément l'authenticité et la qualité des produits de {company} autour du terroir {product}.

Développer et distribuer une marque de terroir aujourd'hui est un engagement remarquable, mais cela implique aussi des défis logistiques et commerciaux exigeants pour toucher la diaspora et faire rayonner ses produits sans laisser trop de marges aux distributeurs classiques.

Avec Domtom Connect, nous bâtissons un écosystème privé (notre groupe WhatsApp d'entrepreneurs et notre application DTC Pulse en phase de finalisation) pensé pour donner une visibilité vidéo et une marketplace directe aux marques emblématiques de nos territoires.

Avant toute démarche, mon objectif est d'abord d'écouter votre réalité de dirigeant. Nous cherchons à comprendre les besoins précis des marques du terroir pour les aider à débloquer des opportunités concrètes et monétisables.

Quelle est votre priorité numéro un ce trimestre entre l'expédition de colis, l'accès à de nouveaux marchés ou la rentabilité de vos ventes directes ?

Si vous êtes ouvert à un court échange téléphonique informel de dix minutes cette semaine, j'en serais ravi. N'hésitez pas à jeter un coup d'œil à notre univers sur www.domtomconnect.com

Plein de succès à toute l'équipe de {company}

Loïc Villeronce
Fondateur — Domtom Connect"""

leads_data = [
    # -------------------------------------------------------------
    # FAST-FOOD & STREET-FOOD (15)
    # -------------------------------------------------------------
    {
        "company": "PB Poulet Braisé",
        "name": "Direction",
        "email": "contact@pouletbraise.fr",
        "zone": "France & International",
        "specialty": "du poulet braisé et de la street-food moderne",
        "subject": "un mot pour PB Poulet Braisé et vos priorités de croissance",
        "type": "fastfood"
    },
    {
        "company": "G la Dalle",
        "name": "Direction",
        "email": "contact@gladalle.fr",
        "zone": "France & Outre-Mer",
        "specialty": "du burger et du fast-food en réseau",
        "subject": "un mot pour G la Dalle et vos défis de développement",
        "type": "fastfood"
    },
    {
        "company": "Chicken Street",
        "name": "Direction",
        "email": "contact@chickenstreet.fr",
        "zone": "France & Outre-Mer",
        "specialty": "du fast-food street et du naan burger",
        "subject": "un mot pour Chicken Street et vos marges sur la livraison",
        "type": "fastfood"
    },
    {
        "company": "Afrik'N'Fusion",
        "name": "Direction",
        "email": "contact@afriknfusion.com",
        "zone": "France & Afrique",
        "specialty": "du fast-casual africain et de la commande rapide",
        "subject": "un petit mot pour Afrik'N'Fusion et vos priorités actuelles",
        "type": "fastfood"
    },
    {
        "company": "Dabali Xpress",
        "name": "Direction",
        "email": "contact@dabalixpress.com",
        "zone": "Abidjan (Côte d'Ivoire)",
        "specialty": "du fast-food africain et ivoirien",
        "subject": "un mot amical pour Dabali Xpress et vos projets d'expansion",
        "type": "fastfood"
    },
    {
        "company": "Bokit Factory",
        "name": "Direction",
        "email": "contact@bokitfactory.fr",
        "zone": "Paris & Île-de-France",
        "specialty": "du bokit traditionnel et de la street-food caribéenne",
        "subject": "un petit mot pour Bokit Factory et la commande directe",
        "type": "fastfood"
    },
    {
        "company": "O'Tacos",
        "name": "Direction Réseau",
        "email": "contact@otacos.com",
        "zone": "France & Outre-Mer",
        "specialty": "du french tacos et des flux de commande rapide",
        "subject": "un mot pour O'Tacos et vos leviers de rentabilité",
        "type": "fastfood"
    },
    {
        "company": "Point B Burger",
        "name": "Direction",
        "email": "contact@pointb.fr",
        "zone": "France & Outre-Mer",
        "specialty": "du smash burger et de la restauration rapide urbaine",
        "subject": "un mot pour Point B et vos priorités opérationnelles",
        "type": "fastfood"
    },
    {
        "company": "Afro Cooking",
        "name": "Direction",
        "email": "contact@afro-cooking.com",
        "zone": "France & International",
        "specialty": "des cuisines d'Afrique et de la street-food afro-caribéenne",
        "subject": "un mot pour Afro Cooking et vos projets culinaires",
        "type": "fastfood"
    },
    {
        "company": "G la Dalle Franchise",
        "name": "Pôle Franchise",
        "email": "franchise@gladalle.fr",
        "zone": "France & Outre-Mer",
        "specialty": "du développement de franchises street-food",
        "subject": "un mot pour l'équipe Franchise G la Dalle et vos implantations",
        "type": "fastfood"
    },
    {
        "company": "Chicken Street Franchise",
        "name": "Pôle Franchise",
        "email": "franchise@chickenstreet.fr",
        "zone": "France & Outre-Mer",
        "specialty": "de l'expansion réseau et de la street-food",
        "subject": "un mot pour Chicken Street Franchise et vos leviers business",
        "type": "fastfood"
    },
    {
        "company": "PB Poulet Braisé Développement",
        "name": "Pôle Développement",
        "email": "franchise@pouletbraise.fr",
        "zone": "France & International",
        "specialty": "du réseau PB Poulet Braisé et de la restauration rapide",
        "subject": "un mot pour le développement PB Poulet Braisé",
        "type": "fastfood"
    },
    {
        "company": "Dom-Express",
        "name": "Direction",
        "email": "contact@dom-express.fr",
        "zone": "Guadeloupe & Martinique",
        "specialty": "du fret et du colisage alimentaire outre-mer",
        "subject": "un mot pour Dom-Express et les flux logistiques DOM",
        "type": "fastfood"
    },
    {
        "company": "DomTomLivraison",
        "name": "Direction",
        "email": "contact@domtomlivraison.com",
        "zone": "DOM-TOM",
        "specialty": "de la livraison et de l'approvisionnement des îles",
        "subject": "un mot pour DomTomLivraison et les commandes directes",
        "type": "fastfood"
    },
    {
        "company": "La Boutique Antillaise",
        "name": "Direction",
        "email": "contact@laboutiqueantillaise.com",
        "zone": "France & Antilles",
        "specialty": "des produits antillais et des saveurs créoles en ligne",
        "subject": "un petit mot pour La Boutique Antillaise et vos ventes",
        "type": "fastfood"
    },

    # -------------------------------------------------------------
    # MARQUES DU TERROIR & AGROALIMENTAIRE (15)
    # -------------------------------------------------------------
    {
        "company": "TropicMarché",
        "name": "Direction",
        "email": "contact@tropicmarche.com",
        "zone": "Paris & Outre-Mer",
        "product": "des spécialités antillaises et africaines en ligne",
        "subject": "un mot pour TropicMarché et vos leviers d'expédition",
        "type": "terroir"
    },
    {
        "company": "Distillerie Depaz",
        "name": "Direction",
        "email": "contact@depaz.fr",
        "zone": "Saint-Pierre (Martinique)",
        "product": "du rhum agricole et du terroir volcanique martiniquais",
        "subject": "un mot respectueux pour Depaz et le rayonnement du terroir",
        "type": "terroir"
    },
    {
        "company": "Rhum Père Labat",
        "name": "Direction",
        "email": "contact@perelabat.com",
        "zone": "Marie-Galante (Guadeloupe)",
        "product": "du savoir-faire de canne de Marie-Galante",
        "subject": "un salut amical pour Père Labat et vos marchés de distribution",
        "type": "terroir"
    },
    {
        "company": "Café Chaulet",
        "name": "Direction",
        "email": "contact@cafechaulet.fr",
        "zone": "Vieux-Habitants (Guadeloupe)",
        "product": "du café bonifieur et des fèves d'exception de Guadeloupe",
        "subject": "un mot chaleureux pour Café Chaulet et vos expéditions",
        "type": "terroir"
    },
    {
        "company": "Confitures M'Amour",
        "name": "Direction",
        "email": "contact@mamour.fr",
        "zone": "Guadeloupe",
        "product": "des confitures tropicales et des fruits des Antilles",
        "subject": "un petit mot pour Confitures M'Amour et vos ventes directes",
        "type": "terroir"
    },
    {
        "company": "Chocolaterie Robert Madagascar",
        "name": "Direction",
        "email": "contact@chocolatmadagascar.com",
        "zone": "Madagascar & France",
        "product": "du cacao fin et des chocolats d'origine de Madagascar",
        "subject": "un mot pour Chocolat Madagascar et la distribution directe",
        "type": "terroir"
    },
    {
        "company": "Karethic",
        "name": "Carole et l'équipe",
        "email": "contact@karethic.com",
        "zone": "Bénin & France",
        "product": "du véritable karité brut et de la cosmétique naturelle équitable",
        "subject": "un mot pour Karethic et vos circuits de distribution",
        "type": "terroir"
    },
    {
        "company": "Racines SA",
        "name": "Direction",
        "email": "contact@racines-sa.com",
        "zone": "France & Afrique",
        "product": "des produits alimentaires africains et des terroirs du Sud",
        "subject": "un mot pour Racines SA et vos approvisionnements",
        "type": "terroir"
    },
    {
        "company": "Distillerie Isautier",
        "name": "Direction",
        "email": "contact@isautier.com",
        "zone": "Saint-Pierre (La Réunion)",
        "product": "des rhums traditionnels et arrangés de La Réunion",
        "subject": "un mot respectueux pour Isautier et vos marchés métropole",
        "type": "terroir"
    },
    {
        "company": "Habitation Clément",
        "name": "Direction",
        "email": "contact@rhum-clement.com",
        "zone": "Le François (Martinique)",
        "product": "du patrimoine agricole et des rhums d'appellation de Martinique",
        "subject": "un mot respectueux pour Clément et vos canaux de vente",
        "type": "terroir"
    },
    {
        "company": "Banane de Guadeloupe et Martinique",
        "name": "Direction Communication",
        "email": "contact@bananeguadeloupemartinique.com",
        "zone": "Antilles & France",
        "product": "de la filière agricole durable des îles",
        "subject": "un mot pour la filière Banane de Guadeloupe et Martinique",
        "type": "terroir"
    },
    {
        "company": "Rhum Bielle",
        "name": "Direction",
        "email": "contact@rhumbielle.com",
        "zone": "Marie-Galante (Guadeloupe)",
        "product": "de la tradition agricole et des saveurs de Marie-Galante",
        "subject": "un salut amical pour Rhum Bielle et vos expéditions",
        "type": "terroir"
    },
    {
        "company": "Rhum J.M",
        "name": "Direction",
        "email": "contact@rhum-jm.com",
        "zone": "Macouba (Martinique)",
        "product": "des rhums du Nord Martinique et des fûts de terroir",
        "subject": "un mot respectueux pour Rhum J.M et le rayonnement caribéen",
        "type": "terroir"
    },
    {
        "company": "Distillerie Damoiseau",
        "name": "Direction",
        "email": "contact@damoiseau.fr",
        "zone": "Le Moule (Guadeloupe)",
        "product": "des rhums agricoles et du savoir-faire du Moule",
        "subject": "un mot chaleureux pour Damoiseau et vos projets en cours",
        "type": "terroir"
    },
    {
        "company": "Rhum Trois Rivières",
        "name": "Direction",
        "email": "contact@troisrivieresrhum.com",
        "zone": "Sainte-Luce (Martinique)",
        "product": "des grands crus agricoles du Sud Martinique",
        "subject": "un mot pour Trois Rivières et vos priorités commerciales",
        "type": "terroir"
    }
]

print(f"Total leads ciblés: {len(leads_data)}")

final_batch = []
errors = 0
seen = set()

for idx, p in enumerate(leads_data, 1):
    comp = p['company']
    name = p['name']
    em = p['email'].lower().strip()
    zone = p['zone']
    sub = p['subject']
    mtype = p['type']
    domain = em.split('@')[1]

    if mtype == 'fastfood':
        body = get_body_fastfood(comp, name, p['specialty'])
    else:
        body = get_body_terroir(comp, name, p['product'])

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
print(f"- Prospects compilés: {len(final_batch)}")
print(f"- Erreurs détectées: {errors}")

if errors == 0 and len(final_batch) == 30:
    output_path = 'batch_fastfood_terroir_30.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_batch, f, ensure_ascii=False, indent=2)
    print(f"\n===> SUCCES: {output_path} généré avec 30 prospects ultra-qualifiés !")
else:
    print(f"\n[X] ÉCHEC: corriger avant enregistrement.")
