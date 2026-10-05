import os, sys, json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_FILE = os.path.join(BASE_DIR, "scripts", "filiere_b_50.json")

with open(SRC_FILE, "r", encoding="utf-8") as f:
    leads = json.load(f)

subject = "Opportunité logistique et visibilité diaspora"

def generate_body(company_name, territory):
    return f"""Bonjour,

Je me permets de vous contacter car nous suivons de près l'expertise de {company_name} sur le transport et le fret vers {territory}.

Chez DomTom Connect, nous développons le premier écosystème de visibilité et d'accélération reliant toute la Caraïbe, le continent africain et sa diaspora.

Pour les spécialistes du fret maritime, aérien et de la réexpédition, capter une clientèle régulière de particuliers et d'entrepreneurs de la diaspora en quête de fiabilité logistique représente un enjeu capital de croissance.

Notre plateforme valorise les acteurs de confiance et fluidifie la mise en relation directe avec les diasporas connectées en quête de solutions de transport sécurisées.

Seriez-vous disponible pour un court échange informel de 15 minutes ces prochains jours afin de faire connaissance et envisager d'éventuelles synergies ?

Vous pouvez choisir le créneau le plus pratique pour vous directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous,

Loïc
DomTom Connect
www.domtomconnect.com"""

batch_60 = []
for item in leads[:50]:
    body = generate_body(item["company"], item["territory"])
    assert ":" not in subject, f"Deux-points trouvé dans l'objet : {subject}"
    assert ":" not in body, f"Deux-points trouvé dans le corps pour {item['company']}"
    assert " - " not in body, f"Tiret en milieu de phrase dans le corps pour {item['company']}"
    assert " - " not in subject, f"Tiret en milieu de phrase dans l'objet : {subject}"
    
    batch_60.append({
        "company": item["company"],
        "email": item["email"],
        "territory": item["territory"],
        "source": item["source"],
        "subject": subject,
        "body": body
    })

out_path = os.path.join(BASE_DIR, "scripts", "batch_60_fret_tech_50.json")
with open(out_path, "w", encoding="utf-8") as out:
    json.dump(batch_60, out, indent=2, ensure_ascii=False)

print(f"Batch 60 généré avec succès : {len(batch_60)} emails 100% conformes et prêts.")
