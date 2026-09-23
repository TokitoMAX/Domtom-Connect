import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    db = json.load(f)

excluded_domains = set(db["domains"])
excluded_emails = set(c["email"].lower().strip() for c in db["contacts"])

def check_mx(domain):
    try:
        res = subprocess.run(["nslookup", "-type=mx", domain], capture_output=True, text=True, timeout=3)
        out = res.stdout.lower()
        return "mail exchanger" in out or "mx preference" in out
    except Exception:
        return False

# 24 cibles certifiées avec adresses officielles publiées et MX confirmés
candidates = [
    # Martinique
    {"name": "Fort Savane", "email": "contact@fortsavane.fr", "domain": "fortsavane.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Centre International de Séjour", "email": "info@cis-martinique.com", "domain": "cis-martinique.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "PARM Martinique", "email": "contact@parm.mq", "domain": "parm.mq", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "LifeOn Martinique", "email": "contact@lifeon.mq", "domain": "lifeon.mq", "zone": "Martinique", "offre": "tremplin", "lang": "fr"},
    {"name": "Lokizy Martinique", "email": "info@lokizy.fr", "domain": "lokizy.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "EWAG Média Caraïbes", "email": "contact@ewag.fr", "domain": "ewag.fr", "zone": "Martinique / Guadeloupe / Guyane", "offre": "copilotage", "lang": "fr"},

    # Guadeloupe
    {"name": "La Toubana Hotel & Spa", "email": "info@toubana.com", "domain": "toubana.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Bwa Chik Hôtel", "email": "info@bwachik.com", "domain": "bwachik.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Idézil Agence", "email": "contact@idezil.com", "domain": "idezil.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "Ma Courtière Guadeloupe", "email": "florence.sepulcre@macourtiere.gp", "domain": "macourtiere.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Assistance 97", "email": "contact.gp@assistance97.fr", "domain": "assistance97.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Routes de Guadeloupe", "email": "contact@routesdeguadeloupe.fr", "domain": "routesdeguadeloupe.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Transport TMG", "email": "contact@transporttmg.fr", "domain": "transporttmg.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "QuickShipping", "email": "contact@quickshipping.fr", "domain": "quickshipping.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Pousse Pousse", "email": "contact@poussepousse.net", "domain": "poussepousse.net", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "Bychon Location", "email": "contact@bychonlocation.fr", "domain": "bychonlocation.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "QuickRent", "email": "info@quickrent.fr", "domain": "quickrent.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},

    # Guyane
    {"name": "Cabinet Zobeide IDEA", "email": "ma.zobeide@idea-expertises.com", "domain": "idea-expertises.com", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},

    # Réunion
    {"name": "Shop Diététique Réunion", "email": "contact@shopdietetiquereunion.re", "domain": "shopdietetiquereunion.re", "zone": "La Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Expertise Concept", "email": "y.berhault@expertiseconcept.fr", "domain": "expertiseconcept.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},

    # Sénégal
    {"name": "Paps Logistique", "email": "hello@paps.sn", "domain": "paps.sn", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},

    # Côte d'Ivoire
    {"name": "AMAREX Sourcing", "email": "contact@amarex.fr", "domain": "amarex.fr", "zone": "Côte d'Ivoire", "offre": "copilotage", "lang": "fr"},

    # International Caribbean (Anglophone)
    {"name": "Marine Cargo Services", "email": "operations@marinecargott.com", "domain": "marinecargott.com", "zone": "Trinidad & Tobago", "offre": "copilotage", "lang": "en"},
    {"name": "Shore to Shore Shipping", "email": "kin@shoretoshoreshipping.com", "domain": "shoretoshoreshipping.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 4...", flush=True)
verified = []
for p in candidates:
    em = p["email"].lower().strip()
    dom = p["domain"].lower().strip()

    if em in excluded_emails or dom in excluded_domains:
        print(f"[-] DÉJÀ EN BASE : {em} ({dom})", flush=True)
        continue

    if check_mx(dom):
        print(f"[+] MX CERTIFIÉ : {p['name']} -> {em}", flush=True)
        verified.append(p)
    else:
        print(f"[x] ECHEC MX : {dom}", flush=True)

print(f"\nTotal Batch 4 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_4_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
