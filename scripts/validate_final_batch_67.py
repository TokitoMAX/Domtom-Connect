import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

# Load currently validated 35
with open("scripts/validated_candidates_batch_67.json", "r", encoding="utf-8") as f:
    existing_validated = json.load(f)

print(f"Base validée : {len(existing_validated)} candidats")

new_prospects = [
    {
        "company": "Cabinet Ferdinand Avocat",
        "name": "Maître Ferdinand",
        "email": "ferdinand@ferdinand-avocat.re",
        "website": "https://www.ferdinand-avocat.re",
        "source": "Site officiel ferdinand-avocat.re",
        "territory": "La Réunion",
        "city": "Sainte-Clotilde"
    },
    {
        "company": "CDLV Avocat",
        "name": "Maître CDLV",
        "email": "vr@cdlv-avocat.re",
        "website": "https://cdlv-avocat.re",
        "source": "Site officiel cdlv-avocat.re",
        "territory": "La Réunion",
        "city": "Le Port"
    },
    {
        "company": "Cabinet Stéphane Bigot",
        "name": "Maître Stéphane Bigot",
        "email": "contact@avocat-bigot.re",
        "website": "https://www.avocat-bigot.re",
        "source": "Site officiel avocat-bigot.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "PB Avocats Réunion",
        "name": "Direction PB Avocats",
        "email": "contact@pb-avocats.re",
        "website": "https://www.pb-avocats.re",
        "source": "Site officiel pb-avocats.re",
        "territory": "La Réunion",
        "city": "Saint-Gilles les Bains"
    },
    {
        "company": "Cabinet Éric Bouhana",
        "name": "Maître Éric Bouhana",
        "email": "contact@bouhana-avocat.re",
        "website": "https://www.bouhana-avocat.re",
        "source": "Site officiel bouhana-avocat.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "Cabinet Aservadompoule",
        "name": "Maître Aservadompoule",
        "email": "contact@aservadompoule-avocat.re",
        "website": "https://aservadompoule-avocat.re",
        "source": "Site officiel aservadompoule-avocat.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Cabinet ACSEAS Guadeloupe",
        "name": "Direction ACSEAS",
        "email": "contact@acseas.com",
        "website": "https://www.acseas.com",
        "source": "Site officiel acseas.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cabinet Criquet Avocat",
        "name": "Maître Criquet",
        "email": "ncriquet@criquet-avocat.com",
        "website": "https://www.criquet-avocat.com",
        "source": "Site officiel criquet-avocat.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cabinet Brice Séguier",
        "name": "Maître Brice Séguier",
        "email": "brice.seguier@seguier-avocat.fr",
        "website": "https://www.seguier-avocat.fr",
        "source": "Site officiel seguier-avocat.fr",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "CQFD Avocats Guadeloupe",
        "name": "Maître Jan-Marc Ferly",
        "email": "contact@cqfd-avocats.com",
        "website": "https://www.cqfd-avocats.com",
        "source": "Site officiel cqfd-avocats.com",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Cabinet Auteville Avocats",
        "name": "Direction Auteville",
        "email": "contact@auteville-avocats.fr",
        "website": "https://www.auteville-avocats.fr",
        "source": "Site officiel auteville-avocats.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet CLC Avocat",
        "name": "Maître Sandrine Désiré",
        "email": "cabinet@clcavocat.com",
        "website": "https://www.clcavocat.com",
        "source": "Site officiel clcavocat.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet Alizé Apiou",
        "name": "Maître Alizé Apiou",
        "email": "avocat@apiou.fr",
        "website": "https://www.apiou.fr",
        "source": "Site officiel apiou.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet YC Avocat",
        "name": "Maître Yanna Cabarrus",
        "email": "contact@yc-avocat.com",
        "website": "https://www.yc-avocat.com",
        "source": "Site officiel yc-avocat.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cabinet AJM Avocats",
        "name": "Direction AJM",
        "email": "contact@ajmavocats.com",
        "website": "https://www.ajmavocats.com",
        "source": "Site officiel ajmavocats.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cabinet Nathalie Jacoby-Koaly",
        "name": "Maître Nathalie Jacoby-Koaly",
        "email": "contact@nathalie-jacoby-koaly-avocat.fr",
        "website": "https://www.nathalie-jacoby-koaly-avocat.fr",
        "source": "Site officiel nathalie-jacoby-koaly-avocat.fr",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Ordre des Avocats Barreau de la Guyane",
        "name": "Bâtonnier et Conseil de l'Ordre",
        "email": "barreauguyane@orange.fr",
        "website": "http://www.avocats-barreau-guyane.com",
        "source": "Site officiel avocats-barreau-guyane.com",
        "territory": "Guyane",
        "city": "Cayenne"
    },
    {
        "company": "Ordre des Avocats de la Martinique",
        "name": "Bâtonnier et Conseil de l'Ordre",
        "email": "ordre@avocatsdemartinique.com",
        "website": "http://www.avocatsdemartinique.com",
        "source": "Site officiel avocatsdemartinique.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Barreau de la Guadeloupe",
        "name": "Bâtonnier et Conseil de l'Ordre",
        "email": "contact@barreau-guadeloupe.avocat.fr",
        "website": "https://www.barreau-guadeloupe.avocat.fr",
        "source": "Site officiel barreau-guadeloupe.avocat.fr",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Cabinet OSE - Olivier Serva Expertise",
        "name": "Direction OSE",
        "email": "contact@ose.gp",
        "website": "https://www.ose.gp",
        "source": "Site officiel ose.gp",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cerfrance Réunion",
        "name": "Direction Cerfrance Réunion",
        "email": "agc@974.cerfrance.fr",
        "website": "https://www.cerfrance.fr",
        "source": "Site officiel cerfrance.fr/reunion",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    }
]

seen_emails = set(c["email"].lower().strip() for c in existing_validated)
final_validated = list(existing_validated)

for c in new_prospects:
    em = c["email"].lower().strip()
    co = c["company"].strip()
    if em in seen_emails:
        continue
    is_dup, reason = is_domain_or_company_duplicate(em, co, db_file="contacts_deja_contactes.json")
    if is_dup:
        print(f"[-] Dup/Excluded: {em} ({reason})")
        continue
    is_v, msg = verify_email_target(em)
    if not is_v:
        print(f"[-] DNS/MX fail: {em} -> {msg}")
        continue
    seen_emails.add(em)
    final_validated.append(c)
    print(f"[+] VALIDATED: {co} <{em}> ({c.get('territory')})")

print(f"\n==========================================")
print(f"TOTAL CANDIDATS VALIDES DISPONIBLES : {len(final_validated)}")
print(f"==========================================")

with open("scripts/all_validated_batch_67.json", "w", encoding="utf-8") as f:
    json.dump(final_validated, f, indent=2, ensure_ascii=False)
