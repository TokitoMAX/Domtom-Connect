import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

emails = set(e.lower().strip() for e in db.get('emails', []))
domains = set(d.lower().strip() for d in db.get('domains', []))
companies = set(c.lower().strip() for c in db.get('companies', []))

print(f"Base de données contacts_deja_contactes.json :")
print(f"Total emails enregistrés : {len(emails)}")
print(f"Total domaines enregistrés : {len(domains)}")
print(f"Total entreprises enregistrées : {len(companies)}")

with open('scripts/exclusions.json', 'r', encoding='utf-8') as f:
    ex = json.load(f)

ex_emails = set(e.lower().strip() for e in ex.get('excluded_emails', []))
ex_domains = set(d.lower().strip() for d in ex.get('excluded_domains', []))
print(f"Exclusions : {len(ex_emails)} emails, {len(ex_domains)} domaines")
