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

candidates = [
    # Réunion
    {"name": "Hôtel Ness by D-Ocean", "email": "contact@nessbydocean.com", "domain": "nessbydocean.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Diamond's Cars", "email": "contact@diamondscars.com", "domain": "diamondscars.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Expertauto Réunion", "email": "rcpj@expertauto.re", "domain": "expertauto.re", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Hodi SAS", "email": "hello@hodi.host", "domain": "hodi.host", "zone": "La Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Service Intérim", "email": "fproust@serviceinterim.fr", "domain": "serviceinterim.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},

    # Guadeloupe
    {"name": "Guadeloupe Annonce Légale", "email": "contact@guadeloupeannoncelegale.fr", "domain": "guadeloupeannoncelegale.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "SMI Antilles", "email": "contact@smi-antilles.fr", "domain": "smi-antilles.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Youdom Domiciliation", "email": "info@youdom.biz", "domain": "youdom.biz", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},

    # Martinique
    {"name": "Presse Antilles Guyane", "email": "infos@franceantilles.fr", "domain": "franceantilles.fr", "zone": "Martinique / Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Nou-La", "email": "contact@nou-la.com", "domain": "nou-la.com", "zone": "Martinique", "offre": "tremplin", "lang": "fr"},
    {"name": "SH Entreprises", "email": "direction@shentreprises.com", "domain": "shentreprises.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "abitē Architecture", "email": "contact@abite.fr", "domain": "abite.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Martinique Annonce Légale", "email": "contact@martiniqueannoncelegale.fr", "domain": "martiniqueannoncelegale.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "SCLM Papeterie", "email": "marketing@sclm.fr", "domain": "sclm.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Arthurimmo Martinique", "email": "martinique@arthurimmo.com", "domain": "arthurimmo.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},

    # Guyane
    {"name": "S3T Guyane", "email": "contact@s3tguyane.com", "domain": "s3tguyane.com", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "Guyane Annonce Légale", "email": "contact@guyaneannoncelegale.fr", "domain": "guyaneannoncelegale.fr", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "Cateco Guyane", "email": "contact@cateco.fr", "domain": "cateco.fr", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "Guyane Agricole", "email": "info@guyane-agricole.com", "domain": "guyane-agricole.com", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},

    # Sénégal
    {"name": "AF Consulting", "email": "contact@afconsulting.com", "domain": "afconsulting.com", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},
    {"name": "Sénégal Estates", "email": "contact@senegalestates.com", "domain": "senegalestates.com", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},

    # International Caribbean (Anglophone)
    {"name": "Parkland Industrial", "email": "info@parklandindustrial.com", "domain": "parklandindustrial.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"},
    {"name": "Jamaica Trading Services", "email": "customerservice@shipdoortodoor.com", "domain": "shipdoortodoor.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 5...", flush=True)
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

print(f"\nTotal Batch 5 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_5_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
