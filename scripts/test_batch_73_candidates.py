import os, sys, json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

CANDIDATES = [
    {
        "company": "The Golden Key Guadeloupe",
        "email": "booking@goldenkey-guadeloupe.com",
        "territory": "Guadeloupe",
        "website": "https://thegoldenkey-guadeloupe.com"
    },
    {
        "company": "WIVM Guadeloupe",
        "email": "sandrine@wivm.fr",
        "territory": "Guadeloupe",
        "website": "https://wivm.fr"
    },
    {
        "company": "Archipel Évasion Martinique",
        "email": "martinique@archipelevasion.com",
        "territory": "Martinique",
        "website": "https://archipelevasion.com"
    },
    {
        "company": "Heritage Villas Valriche Maurice",
        "email": "enquiry@villasvalriche.com",
        "territory": "Île Maurice",
        "website": "https://villasvalriche.com"
    },
    {
        "company": "The Estate Mauritius",
        "email": "contact@the-estate-mauritius.com",
        "territory": "Île Maurice",
        "website": "https://the-estate-mauritius.com"
    },
    {
        "company": "Pam Golding Mauritius",
        "email": "projects@pamgolding.mu",
        "territory": "Île Maurice",
        "website": "https://pamgolding.mu"
    },
    {
        "company": "MJ Développement Maurice",
        "email": "info@mj-developpement.com",
        "territory": "Île Maurice",
        "website": "https://mj-developpement.com"
    },
    {
        "company": "Elite Saly Sénégal",
        "email": "info@elite-saly.com",
        "territory": "Sénégal",
        "website": "https://elite-saly.com"
    },
    {
        "company": "Immo Plage Sénégal",
        "email": "contact@immobilier-saly.com",
        "territory": "Sénégal",
        "website": "https://immobilier-saly.com"
    },
    {
        "company": "Saly Immo Sénégal",
        "email": "contact@saly-immo-senegal.com",
        "territory": "Sénégal",
        "website": "https://agence-immobiliere-saly.com"
    },
    {
        "company": "Espace Cajou Afrique Bénin",
        "email": "infos@espacecajouafrique.com",
        "territory": "Bénin",
        "website": "https://espacecajouafrique.com"
    },
    {
        "company": "Adeba Nature Côte d'Ivoire",
        "email": "info@adebanature.com",
        "territory": "Côte d'Ivoire",
        "website": "https://adebanature.com"
    }
]

print("=== VÉRIFICATION TECHNIQUE CANDIDATS BATCH 73 ===")
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
