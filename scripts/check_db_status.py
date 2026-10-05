import json
import os

with open("contacts_deja_contactes.json", encoding="utf-8") as f:
    db = json.load(f)

print(f"Total contacts dans contacts_deja_contactes.json: {len(db)}")
if db:
    print("Derniers contacts enregistrés:")
    for c in db[-5:]:
        print(c.get("company"), "-", c.get("email"), "-", c.get("batch"))
