import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

with open("scripts/validated_candidates_batch_68.json", "r", encoding="utf-8") as f:
    base_validated = json.load(f)

extra_candidates = [
    {
        "company": "ENEZ Immobilier Réunion",
        "name": "E. Tison",
        "email": "e.tison@enezimmobilier.re",
        "website": "https://www.enezimmobilier.re",
        "source": "Site officiel enezimmobilier.re",
        "territory": "La Réunion",
        "city": "Saint-Paul"
    },
    {
        "company": "Lili Conciergerie Guadeloupe",
        "name": "Direction Lili Conciergerie",
        "email": "contact@liliconciergerie.fr",
        "website": "https://www.liliconciergerie.fr",
        "source": "Site officiel liliconciergerie.fr",
        "territory": "Guadeloupe",
        "city": "Saint-François"
    },
    {
        "company": "ZeWelcome Conciergerie",
        "name": "Direction ZeWelcome",
        "email": "contact@zewelcome.com",
        "website": "https://www.zewelcome.com",
        "source": "Site officiel zewelcome.com",
        "territory": "Guadeloupe",
        "city": "Saint-François"
    },
    {
        "company": "Conciergerie Fleurs des Îles",
        "name": "Direction Fleurs des Îles",
        "email": "contact@conciergerie-fleursdesiles.com",
        "website": "https://www.conciergerie-fleursdesiles.com",
        "source": "Site officiel conciergerie-fleursdesiles.com",
        "territory": "Guadeloupe",
        "city": "Sainte-Anne"
    },
    {
        "company": "Eloha Prestige Conciergerie",
        "name": "Direction Eloha",
        "email": "elohaconciergerie@gmail.com",
        "website": "https://www.elohaconciergerie.com",
        "source": "Site officiel elohaconciergerie.com",
        "territory": "Guadeloupe",
        "city": "Sainte-Anne"
    },
    {
        "company": "La Conciergerie Guadeloupe",
        "name": "Direction La Conciergerie",
        "email": "contact@guadeloupeconciergerie.com",
        "website": "https://www.guadeloupeconciergerie.com",
        "source": "Site officiel guadeloupeconciergerie.com",
        "territory": "Guadeloupe",
        "city": "Saint-François"
    }
]

seen_emails = set(c["email"].lower().strip() for c in base_validated)
all_validated = list(base_validated)

for c in extra_candidates:
    em = c["email"].lower().strip()
    co = c["company"].strip()
    if em in seen_emails:
        continue
    is_dup, reason = is_domain_or_company_duplicate(em, co, db_file="contacts_deja_contactes.json")
    if is_dup:
        print(f"[-] Dup/Excluded: {em} ({reason})")
        continue
    is_v, msg = verify_email_target(em)
    if not is_v:
        print(f"[-] DNS/MX fail: {em} -> {msg}")
        continue
    seen_emails.add(em)
    all_validated.append(c)
    print(f"[+] VALIDATED: {co} <{em}> ({c.get('territory')})")

print(f"\n==========================================")
print(f"TOTAL VALIDATED FINAL BATCH 68 : {len(all_validated)}")
print(f"==========================================")

with open("scripts/all_validated_batch_68.json", "w", encoding="utf-8") as f:
    json.dump(all_validated, f, indent=2, ensure_ascii=False)
