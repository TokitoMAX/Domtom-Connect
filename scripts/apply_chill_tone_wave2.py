import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Re-génération de la Vague 2 avec le ton HUMAIN, CHILL & BUSINESS
with open('batch_100_restaurants_wave2.json', 'r', encoding='utf-8') as f:
    batch = json.load(f)

updated_batch = []
for p in batch:
    comp = p['company']
    zone = p['zone']
    name = p['name']
    em = p['email']
    dom = p['domain']
    cuisine = p.get('cuisine', 'qualité')

    # Objet chill et humain sans deux-points
    subject = f"Un petit mot pour {comp} / Rentabilité et nouvelle visibilité"

    # Corps humain, chaleureux, chill mais orienté aide concrète et rentabilité
    body = (
        f"Bonjour,\n\n"
        f"Je vous écris ce petit mot en toute simplicité.\n\n"
        f"Faire tourner une belle adresse comme {comp} à {zone}, c'est une aventure passionnante mais aussi un marathon quotidien, surtout quand il faut composer avec la hausse du coût des matières premières et les commissions souvent très lourdes des plateformes habituelles.\n\n"
        f"Chez Domtom Connect, nous accompagnons concrètement les restaurateurs pour les aider à faire respirer leurs marges et aller chercher du chiffre d'affaires supplémentaire.\n\n"
        f"Pour cela, nous mettons notamment en place DTC Pulse, notre nouvelle application mobile pensée pour mettre en avant vos spécialités avec la visibilité vidéo façon TikTok, tout en permettant la commande directe sans commission abusive pour que l'argent reste dans votre poche. Nous avons également créé un groupe WhatsApp privé entre chefs et entrepreneurs pour partager de bons plans et s'entraider.\n\n"
        f"Mon but n'est pas de vous vendre quoi que ce soit à la va-vite, mais simplement de voir si ce qu'on développe peut vous être utile là où ça coince actuellement.\n\n"
        f"Seriez-vous partant pour un court échange téléphonique informel de dix minutes cette semaine, tranquillement en dehors de vos heures de service ?\n\n"
        f"Plein de succès à toute votre équipe,\n\n"
        f"Loïc Villeronce\n"
        f"Fondateur — Domtom Connect"
    )

    if ':' in subject or ':' in body:
        raise ValueError(f"ERREUR: Deux-points dans {comp} !")

    updated_batch.append({
        "company": comp,
        "name": name,
        "email": em,
        "domain": dom,
        "zone": zone,
        "cuisine": cuisine,
        "subject": subject,
        "body": body
    })

with open('batch_100_restaurants_wave2.json', 'w', encoding='utf-8') as f:
    json.dump(updated_batch, f, ensure_ascii=False, indent=2)

print(f"batch_100_restaurants_wave2.json mis à jour avec le ton HUMAIN & CHILL ({len(updated_batch)} prospects) !")
