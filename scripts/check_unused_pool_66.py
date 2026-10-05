import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target
from candidate_pool_batch_66 import raw_candidates

print(f"Total raw candidates in pool 66: {len(raw_candidates)}")

# Check against contacts_deja_contactes.json
db_file = "contacts_deja_contactes.json"
with open(db_file, "r", encoding="utf-8") as f:
    db = json.load(f)

emails_set = set(e.lower() for e in db.get("emails", []))

unused_candidates = [c for c in raw_candidates if c["email"].lower() not in emails_set]
print(f"Unused candidates from pool 66: {len(unused_candidates)}")
