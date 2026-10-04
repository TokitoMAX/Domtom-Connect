import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

batch_78_targets = [
    # 1. Distillerie & Terroirs
    {
        "company": "Distillerie Braud et Quennesson",
        "email": "contact@braud-quennesson.com",
        "sector": "Spiritueux & Terroirs d'Exception",
        "location": "Martinique",
        "source": "https://sud-martinique-tourisme.com"
    },
    # 2. Bureaux d'études & Environnement
    {
        "company": "Filao Ingénieurs Conseils",
        "email": "info@filaoconseil.fr",
        "sector": "Ingénierie Environnementale & Territoires",
        "location": "Guadeloupe",
        "source": "https://www.filaoconseil.fr/contact"
    },
    {
        "company": "Biotope Caraïbes",
        "email": "caraibes@biotope.fr",
        "sector": "Biodiversité, Écologie & RSE",
        "location": "Guadeloupe / Martinique",
        "source": "https://www.biotope.fr/contactez-nous"
    },
    {
        "company": "ECR Environnement Océan Indien",
        "email": "lareunion@ecr-environnement.com",
        "sector": "Ingénierie Environnementale & Géotechnique",
        "location": "La Réunion",
        "source": "https://ecr-environnement.com"
    },
    {
        "company": "Impact Mer",
        "email": "contact@impact-mer.fr",
        "sector": "Environnement Marin & Économie Bleue",
        "location": "Martinique / Caraïbes",
        "source": "https://www.impact-mer.fr"
    },
    {
        "company": "Zone-UP Architectes Paysagistes",
        "email": "l.bregent@zone-up.fr",
        "sector": "Architecture du Paysage & Aménagement Durable",
        "location": "La Réunion",
        "source": "https://www.zone-up.fr"
    },
    {
        "company": "Acrorun Élagage & Paysage",
        "email": "contact@acrorunelagage.com",
        "sector": "Aménagement Paysager Tropical & Espaces Verts",
        "location": "La Réunion",
        "source": "https://acrorunelagage.com"
    },
    # 3. Microbrasseries artisanales & Terroirs
    {
        "company": "Brasserie Sazilé",
        "email": "contact@brasserie-sazile.fr",
        "sector": "Brasserie Artisanale Insulaire",
        "location": "Mayotte / Océan Indien",
        "source": "https://brasserie-sazile.fr"
    },
    {
        "company": "Brasserie Doubsis",
        "email": "contact@doubsis.com",
        "sector": "Microbrasserie Artisanale Antillaise",
        "location": "Martinique",
        "source": "https://doubsis.com"
    },
    {
        "company": "Brasserie des Couleurs",
        "email": "contact@brasseriedescouleurs.fr",
        "sector": "Bière Artisanale & Terroir Péi",
        "location": "La Réunion",
        "source": "https://brasseriedescouleurs.fr"
    },
    {
        "company": "Brasserie Gayar",
        "email": "contact@bieregayar.com",
        "sector": "Brasserie Artisanale Locale",
        "location": "La Réunion",
        "source": "https://bieregayar.com"
    },
    {
        "company": "Brasserie de l'Ouest Ti Mouss",
        "email": "info@brasserieouest.re",
        "sector": "Microbrasserie Artisanale Péi",
        "location": "La Réunion",
        "source": "https://brasserieouest.re"
    },
    {
        "company": "Le Demeter",
        "email": "samuel@ledemeter.fr",
        "sector": "Craft Beer & Brasserie Artisanale",
        "location": "La Réunion",
        "source": "https://ledemeter.fr"
    },
    # 4. Panafricain & Terroirs Locaux
    {
        "company": "Maison Kalao",
        "email": "contact@maison-kalao.com",
        "sector": "Brasserie Artisanale Céréales Locales",
        "location": "Sénégal",
        "source": "https://maison-kalao.com"
    },
    {
        "company": "Kaynoo",
        "email": "contact@kaynoo.sn",
        "sector": "Marketplace Terroir & Boissons Locales",
        "location": "Sénégal",
        "source": "https://kaynoo.sn"
    }
]

print("================================================================================")
print(f"AUDIT FINAL DES 15 CIBLES DU BATCH 78")
print("================================================================================")

for i, t in enumerate(batch_78_targets, 1):
    comp = t["company"]
    email = t["email"]
    loc = t["location"]
    sec = t["sector"]
    src = t["source"]
    
    dup, reason = is_domain_or_company_duplicate(email, comp)
    if dup:
        print(f"[{i}/15] ERREUR DEDUP : {comp} <{email}> : {reason}")
        sys.exit(1)
        
    domain = email.split('@')[1]
    mx_ok, msg = verify_domain_mx(domain)
    if not mx_ok:
        print(f"[{i}/15] ERREUR MX : {comp} <{email}> : {msg}")
        sys.exit(1)
        
    print(f"[{i:02d}/15] OK : {comp} ({loc}) <{email}> | MX: {domain}")

print("="*80)
print("TOUTES LES 15 CIBLES DU BATCH 78 SONT 100% VALIDES, DÉDUPLIQUÉES ET PRÊTES !")
print("="*80)
