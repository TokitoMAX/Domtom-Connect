import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

print("=" * 80)
print("TEST QUALIFICATION STRICTE : OPTION 1 (NAUTISME/CATAMARANS) & OPTION 2 (FRET/TRANSIT)")
print("=" * 80)

candidates = [
    # --- OPTION 1 : NAUTISME, CATAMARANS DE LUXE & CENTRES DE PLONGÉE DE RÉFÉRENCE ---
    {"pool": "Option 1 (Nautisme)", "company": "ACM Caraïbes", "email": "commercial@acm-caraibes.com", "territory": "Martinique / Guadeloupe"},
    {"pool": "Option 1 (Nautisme)", "company": "Sailoé Caraïbes", "email": "charter@sailoe.com", "territory": "Guadeloupe"},
    {"pool": "Option 1 (Nautisme)", "company": "Alternative Sailing", "email": "contact@alternative-sailing.com", "territory": "Martinique (Le Marin)"},
    {"pool": "Option 1 (Nautisme)", "company": "Punch Croisières", "email": "contact@punch-croisieres.com", "territory": "Martinique (Le Marin)"},
    {"pool": "Option 1 (Nautisme)", "company": "Corail Caraïbes", "email": "info@corail-caraibes.com", "territory": "Martinique (Le Marin)"},
    {"pool": "Option 1 (Nautisme)", "company": "Kata Mambo", "email": "contact@kata-mambo.com", "territory": "Martinique (Trois-Îlets)"},
    {"pool": "Option 1 (Nautisme)", "company": "Espace Plongée Martinique", "email": "infos@epm972.fr", "territory": "Martinique (Pointe du Bout)"},
    {"pool": "Option 1 (Nautisme)", "company": "Grand Bleu Réunion", "email": "resa@grandbleu.re", "territory": "La Réunion (Saint-Gilles)"},
    {"pool": "Option 1 (Nautisme)", "company": "Festiyacht de Bourbon", "email": "contact@fyb.re", "territory": "La Réunion (Saint-Gilles)"},
    {"pool": "Option 1 (Nautisme)", "company": "Bleu Marine Réunion", "email": "contact@bleumarineplongee.re", "territory": "La Réunion (Saint-Gilles)"},
    {"pool": "Option 1 (Nautisme)", "company": "Scubananas Réunion Plongée", "email": "contact@reunionplongee.com", "territory": "La Réunion (Saint-Gilles)"},
    {"pool": "Option 1 (Nautisme)", "company": "Les Heures Saines", "email": "info@heures-saines.gp", "territory": "Guadeloupe (Malendure)"},
    {"pool": "Option 1 (Nautisme)", "company": "Archipel Plongée", "email": "plongee@archipel-plongee.fr", "territory": "Guadeloupe (Malendure)"},

    # --- OPTION 2 : FRET MARITIME, GROUPAGE & TRANSIT DE PROXIMITÉ ---
    {"pool": "Option 2 (Fret)", "company": "Long-Cours Transit", "email": "contact@long-cours.fr", "territory": "Antilles / Métropole"},
    {"pool": "Option 2 (Fret)", "company": "OCX Outre-Mer Cargo Express", "email": "contact.guadeloupe@ocxpress.com", "territory": "Guadeloupe (Jarry)"},
    {"pool": "Option 2 (Fret)", "company": "RMP Caraïbes", "email": "info@rmp-caraibes.com", "territory": "Martinique / Guadeloupe"},
    {"pool": "Option 2 (Fret)", "company": "Trans Madikera Express", "email": "logistique@trans-madikera.com", "territory": "Guadeloupe (Jarry)"},
    {"pool": "Option 2 (Fret)", "company": "GTA Groupeur Transitaire Associés", "email": "contact@gta-transitaire.com", "territory": "Afrique / Outre-Mer"},
    {"pool": "Option 2 (Fret)", "company": "Outremer Transit", "email": "contact@outremertransit.com", "territory": "La Réunion (Le Port)"},
    {"pool": "Option 2 (Fret)", "company": "TTRAM Transit Réunion", "email": "commercial@ttram.fr", "territory": "La Réunion (Le Port)"},
    {"pool": "Option 2 (Fret)", "company": "Reunion Groupage Transit", "email": "contact@rgt.re", "territory": "La Réunion (Le Port)"},
    {"pool": "Option 2 (Fret)", "company": "Chenal SAS", "email": "contact@chenal-sas.com", "territory": "Mayotte / La Réunion"},
    {"pool": "Option 2 (Fret)", "company": "Hippocampe Import Export", "email": "bordeaux@h-import-export.com", "territory": "Mayotte / Réunion / Comores"}
]

opt1_valid = []
opt2_valid = []

for c in candidates:
    pool = c["pool"]
    comp = c["company"]
    email = c["email"]
    terr = c["territory"]
    
    dup, reason = is_domain_or_company_duplicate(email, comp)
    if dup:
        print(f"[REJET DEDUP/EXCLU] {comp} ({terr}) <{email}> : {reason}")
        continue
        
    domain = email.split('@')[1]
    mx_ok, msg = verify_domain_mx(domain)
    if not mx_ok:
        print(f"[REJET DNS/MX] {comp} ({terr}) <{email}> : {msg}")
        continue
        
    print(f"[100% VALIDE] {pool} : {comp} ({terr}) <{email}> -> MX OK ({domain})")
    if "Option 1" in pool:
        opt1_valid.append(c)
    else:
        opt2_valid.append(c)

print("\n" + "=" * 80)
print(f"RÉCAPITULATIF :")
print(f" - Option 1 (Nautisme / Catamarans / Plongée) : {len(opt1_valid)} cibles 100% qualifiées et prêtes")
print(f" - Option 2 (Fret / Transitaires / Logistique) : {len(opt2_valid)} cibles 100% qualifiées et prêtes")
print("=" * 80)
