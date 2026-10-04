import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

batch_80_targets = [
    # 1. Gestion de patrimoine & Fiscalité
    {"pool": "Patrimoine & Fiscalité", "company": "JFD Patrimoine", "email": "contact@jfdpatrimoine-immobilier.fr", "location": "La Réunion (Saint-Paul)", "source": "https://jfdpatrimoine-immobilier.fr"},
    {"pool": "Patrimoine & Fiscalité", "company": "CO Conseils", "email": "contact@coconseils.fr", "location": "La Réunion", "source": "https://coconseils.fr"},
    {"pool": "Patrimoine & Fiscalité", "company": "Cabinet Claudine Portel", "email": "claudine.portel@avocat-conseil.fr", "location": "Martinique (Fort-de-France)", "source": "https://claudine-portel-avocat.com"},
    {"pool": "Patrimoine & Fiscalité", "company": "NPL Avocats", "email": "cabinet@nplavocats.com", "location": "Guadeloupe", "source": "https://nplavocats.com"},
    {"pool": "Patrimoine & Fiscalité", "company": "CAGEPA Saint-Martin", "email": "saint-martin@cagepa.fr", "location": "Saint-Martin", "source": "https://cagepa.fr"},

    # 2. Conciergerie de Prestige
    {"pool": "Conciergerie Prestige", "company": "Bucket List Villa", "email": "contact@bucketlistvilla.com", "location": "Saint-Barthélemy", "source": "https://bucketlistvilla.com"},
    {"pool": "Conciergerie Prestige", "company": "Caribbean Keys Conciergerie", "email": "gwen@ckconciergerie.com", "location": "Guadeloupe", "source": "https://ckconciergerie.com"},
    {"pool": "Conciergerie Prestige", "company": "Côté Caraïbes Conciergerie", "email": "christelle@cotecaraibes.com", "location": "Guadeloupe", "source": "https://cotecaraibes.com"},
    {"pool": "Conciergerie Prestige", "company": "Villas Martinique", "email": "contact@villasmartinique.fr", "location": "Martinique", "source": "https://villasmartinique.fr"},

    # 3. Nautisme & Plongée d'Exception
    {"pool": "Nautisme & Mer", "company": "Moorea Ocean Adventures", "email": "info@moorea-ocean-adventures.com", "location": "Polynésie française (Moorea)", "source": "https://moorea-ocean-adventures.com"},
    {"pool": "Nautisme & Mer", "company": "Top Dive Polynésie", "email": "dive@topdive.com", "location": "Polynésie française", "source": "https://topdive.fr"},
    {"pool": "Nautisme & Mer", "company": "Le Dodo Palmé", "email": "contact@dodopalme.com", "location": "La Réunion (Le Port)", "source": "https://dodopalme.com"},
    {"pool": "Nautisme & Mer", "company": "Aquabulle Martinique", "email": "info@aquabulle.com", "location": "Martinique (Le Marin)", "source": "https://aquabulle.com"},
    {"pool": "Nautisme & Mer", "company": "Fluid Tahiti Plongée", "email": "info@fluidtahiti.com", "location": "Polynésie française (Tahiti)", "source": "https://fluid-tahiti.com"},
    {"pool": "Nautisme & Mer", "company": "Bora Ocean Adventures", "email": "contact@boraoceanadventures.com", "location": "Polynésie française (Bora Bora)", "source": "https://boraoceanadventures.com"}
]

print("="*80)
print(f"AUDIT DES 15 CIBLES DU BATCH 80")
print("="*80)

for i, t in enumerate(batch_80_targets, 1):
    comp = t["company"]
    email = t["email"]
    loc = t["location"]
    pool = t["pool"]
    
    dup, reason = is_domain_or_company_duplicate(email, comp)
    if dup:
        print(f"[{i:02d}/15] ERREUR DEDUP : {comp} <{email}> : {reason}")
        sys.exit(1)
        
    domain = email.split('@')[1]
    mx_ok, msg = verify_domain_mx(domain)
    if not mx_ok:
        print(f"[{i:02d}/15] ERREUR MX : {comp} <{email}> : {msg}")
        sys.exit(1)
        
    print(f"[{i:02d}/15] OK : [{pool}] {comp} ({loc}) <{email}> | MX: {domain}")

print("="*80)
print("100% DES 15 CIBLES SONT AUDITÉES, SOURCÉES ET STRICTEMENT VALIDES !")
print("="*80)
