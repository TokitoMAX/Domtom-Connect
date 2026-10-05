# scripts/generate_batch_66.py
import json, os, sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VALIDATED_FILE = os.path.join(os.path.dirname(__file__), "all_validated_57_batch_66.json")
OUTPUT_BATCH_FILE = os.path.join(os.path.dirname(__file__), "batch_66_patrimoine_defiscalisation_50.json")

with open(VALIDATED_FILE, "r", encoding="utf-8") as f:
    candidates = json.load(f)

# Take top 50
selected_50 = candidates[:50]

batch_leads = []

for idx, c in enumerate(selected_50, 1):
    company = c["company"].strip()
    name = c.get("name", "Direction").strip()
    territory = c.get("territory", "Outre-Mer").strip()
    city = c.get("city", "").strip()
    email = c["email"].lower().strip()
    source = c.get("source", "Site officiel vérifié")
    
    # Clean greeting
    if name.startswith("Direction") or name.startswith("Cabinet") or name.startswith("Secrétariat"):
        salutation = f"Bonjour {name}"
    else:
        salutation = f"Bonjour {name}"

    # Variations of subjects (strictly NO colon, NO mid-sentence hyphen)
    if idx % 3 == 0:
        subject = f"Synergies d'affaires et prescription patrimoniale avec {company}"
    elif idx % 3 == 1:
        subject = f"Partenariat stratégique et apport d'affaires avec Dom Tom Connect"
    else:
        subject = f"Prescription patrimoniale et opportunité d'affaires avec DTC Pulse"

    body = f"""{salutation},

Je me permets de vous contacter au nom de Dom Tom Connect et de notre réseau DTC Pulse.

Nous accompagnons au quotidien des dirigeants d'entreprise, des professions libérales et des investisseurs privés à travers toute la Caraïbe, le continent africain et sa diaspora. Une part grandissante de nos membres recherche activement des solutions d'optimisation fiscale, de défiscalisation Girardin, de structuration de holdings et d'ingénierie patrimoniale de premier plan.

Connaissant le positionnement d'excellence de {company}, nous souhaitons vous proposer un partenariat de prescription directe et d'apport d'affaires avec rétrocession d'honoraires de 15 à 30%. Nous pouvons également co-animer des masterclasses ciblées auprès de nos chefs d'entreprise pour valoriser votre expertise patrimoniale.

Seriez-vous disponible pour un court échange téléphonique ou visio de quinze minutes cette semaine afin d'étudier ces synergies ?

Vous pouvez choisir directement le créneau qui vous convient sur notre agenda,
calendly.com/domtomconnect/30min

Dans l'attente de nos échanges, je vous souhaite une excellente semaine.

Bien cordialement,

Loïc Villeronce
Fondateur de Dom Tom Connect et DTC Pulse
Plateforme B2B et Réseau d'Affaires International
domtomconnect@gmail.com"""

    lead = {
        "company": company,
        "name": name,
        "email": email,
        "territory": territory,
        "city": city,
        "source": source,
        "axis": "Patrimoine & Défiscalisation Outre-Mer",
        "subject": subject,
        "body": body
    }
    batch_leads.append(lead)

with open(OUTPUT_BATCH_FILE, "w", encoding="utf-8") as f:
    json.dump(batch_leads, f, indent=2, ensure_ascii=False)

print(f"Batch 66 generated successfully with {len(batch_leads)} targets.")
