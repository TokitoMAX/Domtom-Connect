import os, sys, json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

CANDIDATES = [
    {
        "company": "Transactis Immo Guyane",
        "email": "contact@transactisimmo.fr",
        "territory": "Guyane",
        "website": "https://transactisimmo.fr"
    },
    {
        "company": "Bes't Immobilier Guyane",
        "email": "bb@bes-immo.com",
        "territory": "Guyane",
        "website": "https://bes-immo.com"
    },
    {
        "company": "Biovanilla Madagascar",
        "email": "contact@biovanilla.fr",
        "territory": "Madagascar",
        "website": "https://biovanilla.fr"
    },
    {
        "company": "Hublot Conciergerie Réunion",
        "email": "contact@hublot.re",
        "territory": "La Réunion",
        "website": "https://hublot.re"
    }
]

print("=== VÉRIFICATION COMPLÉMENTAIRE BATCH 74 ===")
valid = []
for c in CANDIDATES:
    email = c["email"].lower().strip()
    comp = c["company"].strip()
    
    is_dup, reason = is_domain_or_company_duplicate(email, comp)
    if is_dup:
        print(f"[REJET DÉDUP/EXCLUSION] {comp} <{email}> : {reason}")
        continue
        
    is_valid, diag = verify_email_target(email)
    if not is_valid:
        print(f"[REJET DNS/MX] {comp} <{email}> : {diag}")
        continue
        
    print(f"[VALIDE 100%] {comp} <{email}> ({c['territory']})")
    valid.append(c)

print(f"\nTotal validés : {len(valid)} / {len(CANDIDATES)}")
