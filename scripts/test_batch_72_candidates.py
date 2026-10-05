import os, sys, json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

CANDIDATES = [
    {
        "company": "MonChoco Abidjan",
        "email": "superchoco@monchoco.com",
        "territory": "Côte d'Ivoire",
        "website": "https://monchoco.com"
    },
    {
        "company": "Chocolat des Villages",
        "email": "info@chocolatdesvillages.org",
        "territory": "Côte d'Ivoire",
        "website": "https://chocolatdesvillages.ci"
    },
    {
        "company": "FLORAMAD Madagascar",
        "email": "contact@floramad.com",
        "territory": "Madagascar",
        "website": "https://floramad.com"
    },
    {
        "company": "MadAroma Exports Madagascar",
        "email": "contact@madaroma-exports.mg",
        "territory": "Madagascar",
        "website": "https://madaroma-exports.mg"
    },
    {
        "company": "GEHEM Madagascar",
        "email": "info@gehemgie.com",
        "territory": "Madagascar",
        "website": "https://gehemgie.com"
    },
    {
        "company": "Immoplus Sablux Dakar",
        "email": "contact@immoplussablux.com",
        "territory": "Sénégal",
        "website": "https://immoplussablux.com"
    },
    {
        "company": "Gaïa Immobilier Dakar",
        "email": "contact@immo-gaia.com",
        "territory": "Sénégal",
        "website": "https://immo-gaia.com"
    },
    {
        "company": "Delsa Immo Dakar",
        "email": "contact@delsa-immo.com",
        "territory": "Sénégal",
        "website": "https://delsa-immo.com"
    },
    {
        "company": "Centrimmo Libreville",
        "email": "contact@centrimmo.pro",
        "territory": "Gabon",
        "website": "https://centrimmo.pro"
    },
    {
        "company": "EPEE LINE Douala",
        "email": "contact@epeeline.com",
        "territory": "Cameroun",
        "website": "https://epeeline.com"
    },
    {
        "company": "Lena Real Estate Douala",
        "email": "contact@lena-realestate.com",
        "territory": "Cameroun",
        "website": "https://lena-realestate.com"
    },
    {
        "company": "Codecis Immobilier Douala",
        "email": "info@codecis.com",
        "territory": "Cameroun",
        "website": "https://codecis.com"
    },
    {
        "company": "Zenith Immobilier Douala",
        "email": "info@zenithimo.com",
        "territory": "Cameroun",
        "website": "https://zenithimo.com"
    }
]

print("=== VÉRIFICATION TECHNIQUE CANDIDATS BATCH 72 ===")
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
