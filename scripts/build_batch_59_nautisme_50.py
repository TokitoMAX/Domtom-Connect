import os, sys, json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_FILE = os.path.join(BASE_DIR, "scripts", "filiere_a_50.json")
sys.path.append(os.path.join(BASE_DIR, "scripts"))
from build_filiere_a_test import valid_list

CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)
known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))

# Filter exactly 50 targets that have never been contacted
fresh_50 = []
for item in valid_list:
    e = item["email"].lower().strip()
    if e not in known_emails:
        fresh_50.append(item)
    if len(fresh_50) == 50:
        break

subject = "Synergies nautisme et écotourisme insulaire - DomTom Connect"

def generate_body(company_name, territory):
    return f"""Bonjour,

Je me permets de vous contacter car nous suivons de près le dynamisme de {company_name} sur {territory}.

Chez DomTom Connect, nous structurons le premier écosystème d'accélération et de visibilité reliant directement toute la Caraïbe, le continent africain et sa diaspora.

Notre constat sur le nautisme et l'écotourisme insulaire est simple - vous disposez d'un savoir-faire et d'expériences uniques, mais capter en direct la clientèle qualifiée de l'Hexagone et de la diaspora sans dépendre d'intermédiaires à commissions élevées reste un véritable levier de croissance.

Nous accompagnons les acteurs de référence pour valoriser leurs offres, amplifier leur visibilité directe et fidéliser une communauté engagée à fort pouvoir d'achat.

Seriez-vous ouvert à un court échange informel de 15 minutes ces prochains jours afin de faire connaissance et voir comment nous pourrions collaborer ?

Vous pouvez choisir le créneau qui vous convient directement ici
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous,

Loïc
DomTom Connect
www.domtomconnect.com"""

batch_59 = []
for item in fresh_50:
    body = generate_body(item["company"], item["territory"])
    assert ":" not in subject, f"Colon found in subject: {subject}"
    assert ":" not in body, f"Colon found in body for {item['company']}"
    
    batch_59.append({
        "company": item["company"],
        "email": item["email"],
        "territory": item["territory"],
        "source": item["source"],
        "subject": subject,
        "body": body
    })

out_path = os.path.join(BASE_DIR, "scripts", "batch_59_nautisme_50.json")
with open(out_path, "w", encoding="utf-8") as out:
    json.dump(batch_59, out, indent=2, ensure_ascii=False)

print(f"Batch 59 généré avec succès : {len(batch_59)} emails 100% INÉDITS et prêts.")
