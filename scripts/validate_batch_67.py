import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target
from candidate_pool_batch_67 import raw_candidates_67

print(f"Testing {len(raw_candidates_67)} candidates from Pool 67...")

validated_candidates = []
seen_emails = set()
seen_domains = set()

for c in raw_candidates_67:
    email = c["email"].lower().strip()
    company = c["company"].strip()
    domain = email.split("@")[1]

    if email in seen_emails:
        print(f"[-] Duplicate in list: {email}")
        continue

    # 1. Dedup check against contacts_deja_contactes.json and exclusions.json
    is_dup, reason = is_domain_or_company_duplicate(email, company, db_file="contacts_deja_contactes.json")
    if is_dup:
        print(f"[-] Already in DB / Excluded: {email} ({reason})")
        continue

    # 2. DNS & MX validation
    is_valid, msg = verify_email_target(email)
    if not is_valid:
        print(f"[-] DNS/MX failed: {email} -> {msg}")
        continue

    seen_emails.add(email)
    seen_domains.add(domain)
    validated_candidates.append(c)
    print(f"[+] Validated: {company} <{email}> ({c.get('territory')})")

print("\n" + "="*50)
print(f"TOTAL VALIDATED CANDIDATES: {len(validated_candidates)}")
print("="*50)

with open("scripts/validated_candidates_batch_67.json", "w", encoding="utf-8") as f:
    json.dump(validated_candidates, f, indent=2, ensure_ascii=False)
