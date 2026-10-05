import os, json, sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_59_nautisme_50.json")

with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)
sent = set(c["email"].lower().strip() for c in db.get("contacts", []))

with open(BATCH_FILE, "r", encoding="utf-8") as f:
    batch = json.load(f)

pending = [x for x in batch if x["email"].lower().strip() not in sent]
print(f"Total envoyés dans Batch 59 : {len(batch) - len(pending)}")
print(f"Total restants à expédier : {len(pending)}")
for i, p in enumerate(pending, 1):
    print(f"{i:02d}. {p['company']} | {p['email']} | {p['territory']}")
