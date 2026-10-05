import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

candidates = [
    # --- NICHE 1 : DISTILLERIES & TERROIRS (Non encore contactés) ---
    {"company": "Distillerie Braud et Quennesson", "email": "contact@braud-quennesson.com", "source": "https://sud-martinique-tourisme.com"},
    
    # --- NICHE 2 : INGÉNIERIE ENVIRONNEMENTALE & RSE TROPICALE ---
    {"company": "Filao Ingénieurs Conseils", "email": "info@filaoconseil.fr", "source": "https://www.filaoconseil.fr/contact"},
    {"company": "Biotope Caraïbes", "email": "caraibes@biotope.fr", "source": "https://www.biotope.fr/contactez-nous"},
    {"company": "ECR Environnement Océan Indien", "email": "lareunion@ecr-environnement.com", "source": "https://ecr-environnement.com"},
    {"company": "Impact Mer", "email": "contact@impact-mer.fr", "source": "https://www.impact-mer.fr"},
    {"company": "Zone-UP Architectes Paysagistes", "email": "l.bregent@zone-up.fr", "source": "https://www.zone-up.fr"},
    {"company": "Acrorun Élagage & Paysage", "email": "contact@acrorunelagage.com", "source": "https://acrorunelagage.com"},

    # --- NICHE 3 : MICROBRASSERIES ARTISANALES D'OUTRE-MER ---
    {"company": "Brasserie Labye", "email": "contact@labye-brasserie.fr", "source": "https://labye-brasserie.fr"},
    {"company": "Brasserie Sazilé", "email": "contact@brasserie-sazile.fr", "source": "https://brasserie-sazile.fr"},
    {"company": "Les Bières de la Lézarde", "email": "contact@lezarde.net", "source": "https://lezarde.net"},
    {"company": "Petite Brasserie Martiniquaise BAM", "email": "contact@bierebam.fr", "source": "https://bierebam.fr"},
    {"company": "Brasserie Doubsis", "email": "contact@doubsis.com", "source": "https://doubsis.com"},
    {"company": "Brasserie Guyanaise Jeune Gueule", "email": "contact@jeunegueule.com", "source": "https://jeunegueule.com"},
    {"company": "Brasserie des Couleurs", "email": "contact@brasseriedescouleurs.fr", "source": "https://brasseriedescouleurs.fr"},
    {"company": "Brasserie Gayar", "email": "contact@bieregayar.com", "source": "https://bieregayar.com"},
    {"company": "Brasserie de l'Ouest Ti Mouss", "email": "info@brasserieouest.re", "source": "https://brasserieouest.re"},
    {"company": "Le Demeter", "email": "samuel@ledemeter.fr", "source": "https://ledemeter.fr"}
]

print("================================================================================")
print("TEST DÉDUPLICATION ET DNS/MX CANDIDATS BATCH 78")
print("================================================================================")

valid_list = []
for c in candidates:
    email = c["email"]
    comp = c["company"]
    src = c["source"]
    
    dup, reason = is_domain_or_company_duplicate(email, comp)
    if dup:
        print(f"[REJET DEDUP/EXCLU] {comp} <{email}> : {reason}")
        continue
        
    domain = email.split('@')[1]
    mx_ok, mx_msg = verify_domain_mx(domain)
    if not mx_ok:
        print(f"[REJET DNS/MX] {comp} <{email}> : {mx_msg}")
        continue
        
    print(f"[VALIDÉ] {comp} <{email}> -> MX OK ({domain}) | Source: {src}")
    valid_list.append(c)

print("="*80)
print(f"TOTAL CANDIDATS QUALIFIÉS ET VALIDÉS POUR LE BATCH 78 : {len(valid_list)}")
print("="*80)
