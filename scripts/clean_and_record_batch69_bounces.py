import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

exclusions_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "exclusions.json")
contacts_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contacts_deja_contactes.json")

bounced_emails = [
    "contact@lasourcecosmetics.com",
    "contact@maevareunion.fr",
    "contact@boiscorail.re",
    "contact@karukera-conciergerie.com",
    "contact@mdimmo-ci.com",
    "contact@teyaimmobilier.com",
    "contact@replikimmo.com"
]

bounced_domains = [
    "lasourcecosmetics.com",
    "maevareunion.fr",
    "boiscorail.re",
    "karukera-conciergerie.com",
    "mdimmo-ci.com",
    "teyaimmobilier.com",
    "replikimmo.com"
]

# 1. Update exclusions.json
with open(exclusions_file, "r", encoding="utf-8") as f:
    ex = json.load(f)

ex_emails = set(e.lower().strip() for e in ex.get("excluded_emails", []))
ex_domains = set(d.lower().strip() for d in ex.get("excluded_domains", []))

added_e = 0
for e in bounced_emails:
    if e.lower().strip() not in ex_emails:
        ex.setdefault("excluded_emails", []).append(e.lower().strip())
        ex_emails.add(e.lower().strip())
        added_e += 1

added_d = 0
for d in bounced_domains:
    if d.lower().strip() not in ex_domains:
        ex.setdefault("excluded_domains", []).append(d.lower().strip())
        ex_domains.add(d.lower().strip())
        added_d += 1

with open(exclusions_file, "w", encoding="utf-8") as f:
    json.dump(ex, f, ensure_ascii=False, indent=2)

print(f"Exclusions mises à jour : +{added_e} emails, +{added_d} domaines exclus définitivement.")

# 2. Update contacts_deja_contactes.json to remove or mark bounced
with open(contacts_file, "r", encoding="utf-8") as f:
    db = json.load(f)

for contact in db.get("contacts", []):
    if contact.get("email", "").lower().strip() in bounced_emails:
        contact["bounced"] = True
        contact["statut"] = "BOUNCE_EXCLU"

with open(contacts_file, "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Base contacts_deja_contactes.json assainie.")
