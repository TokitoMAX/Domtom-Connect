import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

targets = [
    # OPTION 1 : NAUTISME, CATAMARANS & PLONGÉE (6 CIBLES)
    {"pool": "Nautisme", "company": "Alternative Sailing", "email": "contact@alternative-sailing.com", "location": "Martinique (Le Marin)", "source": "https://alternative-sailing.com"},
    {"pool": "Nautisme", "company": "Espace Plongée Martinique", "email": "infos@epm972.fr", "location": "Martinique (Pointe du Bout)", "source": "https://espaceplongee-martinique.com"},
    {"pool": "Nautisme", "company": "Bleu Marine Réunion", "email": "contact@bleumarineplongee.re", "location": "La Réunion (Saint-Gilles)", "source": "https://bleumarineplongee.re"},
    {"pool": "Nautisme", "company": "Scubananas Réunion Plongée", "email": "contact@reunionplongee.com", "location": "La Réunion (Saint-Gilles)", "source": "https://reunionplongee.com"},
    {"pool": "Nautisme", "company": "Archipel Plongée", "email": "plongee@archipel-plongee.fr", "location": "Guadeloupe (Malendure)", "source": "https://archipel-plongee.fr"},
    {"pool": "Nautisme", "company": "Abaca Croisières", "email": "yves@abaca-croisieres.com", "location": "Nouvelle-Calédonie (Nouméa)", "source": "http://abaca-croisieres.com"},

    # OPTION 2 : FRET MARITIME, GROUPAGE & TRANSIT (9 CIBLES)
    {"pool": "Fret & Transit", "company": "Trans Madikera Express", "email": "logistique@trans-madikera.com", "location": "Guadeloupe (Jarry)", "source": "https://trans-madikera.com"},
    {"pool": "Fret & Transit", "company": "GTA Groupeur Transitaire Associés", "email": "contact@gta-transitaire.com", "location": "Afrique / Outre-Mer", "source": "https://gta-transitaire.com"},
    {"pool": "Fret & Transit", "company": "Reunion Groupage Transit", "email": "contact@rgt.re", "location": "La Réunion (Le Port)", "source": "https://rgt.re"},
    {"pool": "Fret & Transit", "company": "Chenal SAS", "email": "contact@chenal-sas.com", "location": "Mayotte / La Réunion", "source": "https://chenal-sas.com"},
    {"pool": "Fret & Transit", "company": "Hippocampe Import Export", "email": "bordeaux@h-import-export.com", "location": "Mayotte / Réunion / Comores", "source": "https://h-import-export.com"},
    {"pool": "Fret & Transit", "company": "J.A. Cowan et Fils", "email": "jac@jac.pf", "location": "Polynésie française (Papeete)", "source": "https://jac.pf"},
    {"pool": "Fret & Transit", "company": "AltiTrans", "email": "info@altitrans.nc", "location": "Nouvelle-Calédonie (Nouméa)", "source": "https://altitrans.nc"},
    {"pool": "Fret & Transit", "company": "Polynésie Transit", "email": "contact@polynesietransit.pf", "location": "Polynésie française (Papeete)", "source": "https://polynesietransit.pf"},
    {"pool": "Fret & Transit", "company": "Transit SAT NUI", "email": "info@transit.pf", "location": "Polynésie française (Papeete)", "source": "https://transit.pf"}
]

print("="*80)
print("VÉRIFICATION DES 15 CIBLES DU BATCH 79 (OPTIONS 1 ET 2)")
print("="*80)

for i, t in enumerate(targets, 1):
    comp = t["company"]
    email = t["email"]
    loc = t["location"]
    pool = t["pool"]
    
    dup, reason = is_domain_or_company_duplicate(email, comp)
    if dup:
        print(f"[{i:02d}/15] ERREUR DEDUP : {comp} ({loc}) <{email}> : {reason}")
        sys.exit(1)
        
    domain = email.split('@')[1]
    mx_ok, msg = verify_domain_mx(domain)
    if not mx_ok:
        print(f"[{i:02d}/15] ERREUR MX : {comp} ({loc}) <{email}> : {msg}")
        sys.exit(1)
        
    print(f"[{i:02d}/15] OK : [{pool}] {comp} ({loc}) <{email}> | MX: {domain}")

print("="*80)
print("100% DES 15 CIBLES SONT STRICTEMENT AUDITÉES, VALIDES ET DISPONIBLES !")
print("="*80)
