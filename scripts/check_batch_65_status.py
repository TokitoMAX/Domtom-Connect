import json, os

db_file = "contacts_deja_contactes.json"
with open(db_file, "r", encoding="utf-8") as f:
    db = json.load(f)

emails_set = set(e.lower() for e in db.get("emails", []))

# Check if batch 65 file exists
for path in ["batch_65_pancaribeen_afrique_50.json", "scripts/batch_65_pancaribeen_afrique_50.json"]:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            b65 = json.load(f)
            in_db = sum(1 for c in b65 if c["email"].lower() in emails_set)
            print(f"{path}: {len(b65)} leads, {in_db} already in DB")
