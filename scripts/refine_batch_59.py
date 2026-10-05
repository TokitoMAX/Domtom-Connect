import os, sys, json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_FILE = os.path.join(BASE_DIR, "scripts", "filiere_a_50.json")

CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)
sent = set(c["email"].lower().strip() for c in db.get("contacts", []))

ECOLODGE_KEYWORDS = ["lodge", "colibris", "kay", "bananes vertes", "carbet", "sourou", "cariacou", "nature"]

def is_ecolodge(company_name):
    c = company_name.lower()
    return any(k in c for k in ECOLODGE_KEYWORDS)

def generate_nautisme_body(company_name, territory):
    return f"""Bonjour,

Je me permets de vous contacter car nous suivons avec beaucoup d'attention vos prestations maritimes et votre présence sur {territory}.

Chez DomTom Connect, nous développons le premier écosystème de visibilité et d'accélération reliant toute la Caraïbe, le continent africain et sa diaspora.

Pour les professionnels de la mer et du charter insulaire, capter en direct une clientèle qualifiée de l'Hexagone et de la diaspora sans subir les commissions élevées des plateformes de réservation constitue un enjeu majeur de rentabilité.

Notre rôle consiste à valoriser vos sorties et votre savoir-faire auprès d'une communauté ciblée, afin d'optimiser le taux de réservation de vos bateaux tout au long de la saison.

Seriez-vous disponible pour un court échange informel de 15 minutes ces prochains jours afin de faire connaissance et envisager d'éventuelles synergies ?

Vous pouvez réserver le créneau qui vous convient le mieux sur ce lien
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous,

Loïc
DomTom Connect
www.domtomconnect.com"""

def generate_ecolodge_body(company_name, territory):
    return f"""Bonjour,

Je me permets de vous contacter car nous apprécions tout particulièrement la qualité de vos hébergements et votre démarche en faveur de l'écotourisme sur {territory}.

Chez DomTom Connect, nous développons le premier écosystème de visibilité et d'accélération reliant toute la Caraïbe, le continent africain et sa diaspora.

Pour les écolodges et hébergements de nature, développer les réservations directes auprès d'une clientèle respectueuse et à fort pouvoir d'achat, tout en réduisant la dépendance aux centrales de réservation, représente un levier déterminant.

Nous mettons en lumière les plus beaux concepts insulaires auprès d'une communauté active, désireuse de vivre des séjours immersifs et authentiques.

Seriez-vous disponible pour un court échange informel de 15 minutes ces prochains jours afin de faire connaissance et explorer nos opportunités communes ?

Vous pouvez choisir le créneau qui vous convient directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous,

Loïc
DomTom Connect
www.domtomconnect.com"""

with open(os.path.join(BASE_DIR, "scripts", "batch_59_nautisme_50.json"), "r", encoding="utf-8") as f:
    current_batch = json.load(f)

updated_batch = []
for item in current_batch:
    # If already sent, keep as is in the record
    if item["email"].lower().strip() in sent:
        updated_batch.append(item)
        continue
    
    company = item["company"]
    territory = item["territory"]
    
    if is_ecolodge(company):
        subject = "Opportunité écotourisme et réservations directes"
        body = generate_ecolodge_body(company, territory)
    else:
        subject = "Opportunité nautisme et réservations directes"
        body = generate_nautisme_body(company, territory)
    
    # Strict quality verification
    assert ":" not in subject, f"Deux-points trouvé dans l'objet : {subject}"
    assert ":" not in body, f"Deux-points trouvé dans le corps pour {company}"
    assert " - " not in body, f"Tiret milieu de phrase trouvé dans le corps pour {company}"
    assert " - " not in subject, f"Tiret milieu de phrase trouvé dans l'objet : {subject}"
    
    updated_batch.append({
        "company": company,
        "email": item["email"],
        "territory": territory,
        "source": item["source"],
        "subject": subject,
        "body": body
    })

out_path = os.path.join(BASE_DIR, "scripts", "batch_59_nautisme_50.json")
with open(out_path, "w", encoding="utf-8") as out:
    json.dump(updated_batch, out, indent=2, ensure_ascii=False)

print("Batch 59 réécrit avec succès !")
print(f"Total leads dans le fichier : {len(updated_batch)}")
print("Vérification qualité : 0 deux-points, 0 tiret en milieu de phrase, adaptation sectorielle 100% propre.")
