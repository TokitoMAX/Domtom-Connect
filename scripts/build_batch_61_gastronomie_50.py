import os, sys, json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_FILE = os.path.join(BASE_DIR, "scripts", "filiere_c_50.json")

with open(SRC_FILE, "r", encoding="utf-8") as f:
    leads = json.load(f)

subject = "Opportunité gastronomie et rayonnement terroir"

def generate_body(company_name, territory):
    return f"""Bonjour,

Je me permets de vous contacter car nous suivons de près l'excellence de {company_name} sur {territory}.

Chez DomTom Connect, nous développons le premier écosystème de visibilité et d'accélération reliant toute la Caraïbe, le continent africain et sa diaspora.

Pour les artisans de bouche, producteurs de terroir et restaurateurs passionnés, faire rayonner des savoir-faire authentiques auprès d'une clientèle exigeante dans l'Hexagone et au sein de la diaspora constitue un levier d'expansion formidable.

Notre plateforme met en avant les créateurs d'excellence afin de stimuler vos réservations, commandes et opportunités professionnelles sans intermédiaires pesants.

Seriez-vous disponible pour un court échange informel de 15 minutes ces prochains jours afin de faire connaissance et envisager d'éventuelles synergies ?

Vous pouvez choisir le créneau qui vous convient directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous,

Loïc
DomTom Connect
www.domtomconnect.com"""

batch_61 = []
for item in leads[:50]:
    body = generate_body(item["company"], item["territory"])
    assert ":" not in subject, f"Deux-points trouvé dans l'objet : {subject}"
    assert ":" not in body, f"Deux-points trouvé dans le corps pour {item['company']}"
    assert " - " not in body, f"Tiret en milieu de phrase dans le corps pour {item['company']}"
    assert " - " not in subject, f"Tiret en milieu de phrase dans l'objet : {subject}"
    
    batch_61.append({
        "company": item["company"],
        "email": item["email"],
        "territory": item["territory"],
        "source": item["source"],
        "subject": subject,
        "body": body
    })

out_path = os.path.join(BASE_DIR, "scripts", "batch_61_gastronomie_50.json")
with open(out_path, "w", encoding="utf-8") as out:
    json.dump(batch_61, out, indent=2, ensure_ascii=False)

print(f"Batch 61 généré avec succès : {len(batch_61)} emails 100% conformes et prêts.")
