import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

new_contacts = [
    {"email": "group@gozem.co", "name": "Direction générale", "company": "Gozem"},
    {"email": "corpsec@angostura.com", "name": "Corporate Office", "company": "Angostura"}
]

for c in new_contacts:
    db["contacts"].append(c)

db["domains"].append("gozem.co")
db["domains"].append("angostura.com")

with open('contacts_deja_contactes.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Base mise à jour avec succès : {len(db['contacts'])} contacts, {len(db['domains'])} domaines.")
