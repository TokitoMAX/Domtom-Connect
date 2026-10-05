import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

with open("scripts/all_validated_batch_67.json", "r", encoding="utf-8") as f:
    all_validated = json.load(f)

extra_candidates = [
    {
        "company": "Cabinet Lionel Chevalier Avocats",
        "name": "Maître Lionel Chevalier",
        "email": "accueil@lc-avocats.nc",
        "website": "https://www.lc-avocats.nc",
        "source": "Site officiel lc-avocats.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Cabinet Reuter de Raissac Patet",
        "name": "Direction RDRP",
        "email": "accueil@rdrp.nc",
        "website": "https://www.reuterderaissacpatet.nc",
        "source": "Site officiel reuterderaissacpatet.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "MAC Avocat Nouméa",
        "name": "Maître Marie-Astrid Cazali",
        "email": "contact@macavocat.nc",
        "website": "https://www.macavocat.nc",
        "source": "Site officiel macavocat.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Rotkopf Avocat",
        "name": "Maître Jérémy Rotkopf",
        "email": "jeremy@rotkopf-avocat.com",
        "website": "https://www.rotkopf-avocat.com",
        "source": "Site officiel rotkopf-avocat.com",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    }
]

seen_emails = set(c["email"].lower().strip() for c in all_validated)

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
print(f"TOTAL VALIDATED FINAL : {len(all_validated)}")
print(f"==========================================")

with open("scripts/all_validated_batch_67.json", "w", encoding="utf-8") as f:
    json.dump(all_validated, f, indent=2, ensure_ascii=False)
