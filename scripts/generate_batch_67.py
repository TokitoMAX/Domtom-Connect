# scripts/generate_batch_67.py
import json, os, sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VALIDATED_FILE = os.path.join(os.path.dirname(__file__), "all_validated_batch_67.json")
OUTPUT_BATCH_FILE = os.path.join(os.path.dirname(__file__), "batch_67_experts_juridique_affaires_50.json")

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
        subject = f"Synergies d'affaires et accompagnement d'entreprises avec {company}"
    elif idx % 3 == 1:
        subject = f"Partenariat stratégique et mise en relation avec Domtom Connect"
    else:
        subject = f"Prescription de dossiers et opportunités d'affaires avec DTC Pulse"

    body = f"""{salutation},

Je me permets de vous contacter au nom de Domtom Connect et de notre réseau professionnel DTC Pulse.

Nous fédérons au quotidien des dirigeants d'entreprises, des investisseurs et des porteurs de projets à travers les Caraïbes, l'Océan Indien, le Pacifique et l'Afrique francophone. Nos membres font face à des enjeux constants de structuration juridique, d'audit, de conformité fiscale et de gestion de trésorerie.

Au vu du positionnement d'expertise de {company} sur votre territoire, nous souhaitons vous proposer un partenariat direct d'apport d'affaires et de mise en relation ciblée avec nos entrepreneurs en phase d'accélération ou d'implantation. Nous pouvons également envisager des interventions conjointes ou des présentations expertes auprès de notre écosystème.

Seriez-vous ouvert à un court échange téléphonique ou visio de quinze minutes cette semaine pour faire connaissance et évaluer ces opportunités ?

Vous pouvez sélectionner directement le créneau qui vous convient le mieux sur notre agenda,
calendly.com/domtomconnect/30min

Dans l'attente de nos échanges, je vous souhaite une excellente semaine.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect et DTC Pulse
Plateforme B2B et Réseau d'Affaires International
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
        "axis": "Expertise Comptable, Droit & Conseils d'Affaires Outre-Mer",
        "subject": subject,
        "body": body
    }
    batch_leads.append(lead)

with open(OUTPUT_BATCH_FILE, "w", encoding="utf-8") as f:
    json.dump(batch_leads, f, indent=2, ensure_ascii=False)

print(f"Batch 67 generated successfully with {len(batch_leads)} targets.")
