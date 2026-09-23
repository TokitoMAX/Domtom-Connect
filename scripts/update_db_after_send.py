import json
from datetime import datetime

CONTACTS_FILE = "contacts_deja_contactes.json"
PROSPECTS_FILE = "fichier_prospection_copilotage.json"

with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)

with open(PROSPECTS_FILE, "r", encoding="utf-8") as f:
    prospects = json.load(f)

known_emails = set(c["email"] for c in db["contacts"])
known_domains = set(db["domains"])

now_str = datetime.now().isoformat()

for p in prospects:
    email = p["email"].lower().strip()
    domain = email.split("@")[1]
    subject = f"Vos tâches énergivores / {p['entreprise']}"
    
    known_domains.add(domain)
    
    if email not in known_emails:
        db["contacts"].append({
            "email": email,
            "name": p["destinataire"],
            "domain": domain,
            "count_sent": 1,
            "count_received": 0,
            "last_date": now_str,
            "subjects": [subject]
        })
        known_emails.add(email)

db["total_contacts"] = len(db["contacts"])
db["total_domains"] = len(known_domains)
db["domains"] = sorted(list(known_domains))
db["last_update"] = now_str

with open(CONTACTS_FILE, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Base de contacts mise à jour avec les 10 nouveaux envois !")
