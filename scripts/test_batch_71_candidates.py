import os, sys, json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

CANDIDATES = [
    {
        "company": "Destiny Conciergerie Abidjan",
        "email": "contact@destiny-conciergerie.net",
        "territory": "Côte d'Ivoire",
        "website": "https://destiny-conciergerie.net"
    },
    {
        "company": "Wadi Conciergerie Abidjan",
        "email": "contact@wadi-ci.com",
        "territory": "Côte d'Ivoire",
        "website": "https://wadi-ci.com"
    },
    {
        "company": "Bénin Agence Immobilière",
        "email": "info@beninagence.com",
        "territory": "Bénin",
        "website": "https://beninagence.com"
    },
    {
        "company": "BENIN HOUSE",
        "email": "contact@beninhouse.com",
        "territory": "Bénin",
        "website": "https://beninhouse.com"
    },
    {
        "company": "Even Glowing Skin Sénégal",
        "email": "contact@evenglowingskin.com",
        "territory": "Sénégal",
        "website": "https://evenglowingskin.com"
    },
    {
        "company": "Binta Beauty Sénégal",
        "email": "contact@bintabeauty.com",
        "territory": "Sénégal",
        "website": "https://bintabeauty.com"
    }
]

print("=== VÉRIFICATION TECHNIQUE CANDIDATS SUPPLÉMENTAIRES ===")
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
