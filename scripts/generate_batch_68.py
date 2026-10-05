# scripts/generate_batch_68.py
import json, os, sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VALIDATED_FILE = os.path.join(os.path.dirname(__file__), "all_validated_batch_68.json")
OUTPUT_BATCH_FILE = os.path.join(os.path.dirname(__file__), "batch_68_sondage_locaux_intendance_50.json")

with open(VALIDATED_FILE, "r", encoding="utf-8") as f:
    candidates = json.load(f)

# Select top 50 exactly
selected_50 = candidates[:50]

batch_leads = []

for idx, c in enumerate(selected_50, 1):
    company = c["company"].replace(" - ", " / ").strip()
    name = c.get("name", "Direction").replace(" - ", " / ").strip()
    territory = c.get("territory", "Outre-Mer").strip()
    city = c.get("city", "").strip()
    email = c["email"].lower().strip()
    source = c.get("source", "Site officiel vérifié")
    
    salutation = f"Bonjour {name}"

    # Variations of subjects (strictly NO colon, NO mid-sentence hyphen)
    if idx % 3 == 0:
        subject = f"Synergies opérationnelles et gestion de vos locaux avec {company}"
    elif idx % 3 == 1:
        subject = f"Partenariat d'intendance et gestion de biens avec Domtom Connect"
    else:
        subject = f"Entretien de locaux et services d'intendance pour {company}"

    body = f"""{salutation},

J'espère que vous allez bien.

Je me permets de vous contacter au nom de Domtom Connect et de notre pôle de services Vesteris.

Dans le cadre de l'accompagnement de notre réseau de dirigeants, d'agences et de PME à travers les Caraïbes, l'Afrique et la diaspora, nous constatons que la gestion du quotidien représente souvent une charge importante pour les professionnels.

Qu'il s'agisse de l'entretien soigné de vos bureaux et espaces d'accueil, de la remise en état de locaux, ou encore de l'intendance et de la conciergerie de biens meublés pour vos séjours d'affaires et ceux de vos clients, nous développons des solutions opérationnelles sans contrainte d'engagement.

Avez-vous aujourd'hui des besoins particuliers sur l'entretien régulier de vos locaux ou sur la gestion et conciergerie de biens immobiliers ?

Seriez-vous ouvert à un court échange informel de dix minutes cette semaine pour faire connaissance et étudier nos synergies ?

Vous pouvez choisir directement le créneau qui vous convient sur notre agenda,
calendly.com/domtomconnect/30min

Dans l'attente de votre retour, je vous souhaite une excellente semaine.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect et Vesteris
Plateforme d'Affaires et Services d'Intendance
domtomconnect@gmail.com"""

    # Safety assertion
    if ":" in subject or ":" in body:
        raise ValueError(f"Colon found in lead {company}")
    if " - " in subject or " - " in body:
        raise ValueError(f"Mid-sentence hyphen found in lead {company}")

    lead = {
        "company": company,
        "name": name,
        "email": email,
        "territory": territory,
        "city": city,
        "source": source,
        "axis": "Sondage Besoins Locaux & Intendance PME / Agences",
        "subject": subject,
        "body": body
    }
    batch_leads.append(lead)

with open(OUTPUT_BATCH_FILE, "w", encoding="utf-8") as f:
    json.dump(batch_leads, f, indent=2, ensure_ascii=False)

print(f"Batch 68 generated successfully with {len(batch_leads)} targets.")
