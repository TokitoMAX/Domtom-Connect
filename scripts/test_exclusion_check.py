import json
import os

# Base d'exclusion
with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    db_contacts = json.load(f)

excluded_domains = set(db_contacts["domains"])
excluded_emails = set(c["email"].lower().strip() for c in db_contacts["contacts"])

print(f"Total domaines exclus : {len(excluded_domains)}")
print(f"Total emails exclus : {len(excluded_emails)}")
