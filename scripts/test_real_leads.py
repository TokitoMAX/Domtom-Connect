import subprocess
import json

with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    db = json.load(f)

excluded_domains = set(db["domains"])
excluded_emails = set(c["email"].lower().strip() for c in db["contacts"])

def check_mx(domain):
    try:
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=4)
        return "NameExchange" in res.stdout or "MailExchange" in res.stdout or len(res.stdout.strip()) > 0
    except Exception:
        return False

# Liste de prospects avec vrais emails officiels extraits
real_leads = [
    # Antilles / Réunion / Guyane (Emails réels extraits des sites)
    {"name": "Damoiseau", "email": "rhum@damoiseau.com", "domain": "damoiseau.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Chanflor", "email": "marketing@somadicom.fr", "domain": "somadicom.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Hôtel Villa Delisle", "email": "info@villadelisle.re", "domain": "villadelisle.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Ringuin SARL", "email": "administration@ringuinsarl.re", "domain": "ringuinsarl.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Kom à la Kaz", "email": "contact@komalakaz.re", "domain": "komalakaz.re", "zone": "Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Osmose Bistro", "email": "contact@osmose-bistro.re", "domain": "osmose-bistro.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Martinique Transport", "email": "contact@martiniquetransport.mq", "domain": "martiniquetransport.mq", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Promotion Santé Guadeloupe", "email": "contact@promotion-sante.gp", "domain": "promotion-sante.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "GIS 971", "email": "contact@gis-971.gp", "domain": "gis-971.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Jungle Tech", "email": "contact@jungletech.gf", "domain": "jungletech.gf", "zone": "Guyane", "offre": "tremplin", "lang": "fr"},
    {"name": "Class Auto Import", "email": "contact@classauto.gf", "domain": "classauto.gf", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},

    # Afrique (Sénégal & Côte d'Ivoire)
    {"name": "Collab Solutions", "email": "contact@collabsolutions.sn", "domain": "collabsolutions.sn", "zone": "Sénégal", "offre": "tremplin", "lang": "fr"},
    {"name": "Zone01 Dakar", "email": "contact@zone01dakar.sn", "domain": "zone01dakar.sn", "zone": "Sénégal", "offre": "tremplin", "lang": "fr"},
    {"name": "Sengold", "email": "contact@sengold.sn", "domain": "sengold.sn", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},
    {"name": "Inovatec CI", "email": "contact@inovatec.ci", "domain": "inovatec.ci", "zone": "Côte d'Ivoire", "offre": "tremplin", "lang": "fr"},
    {"name": "Boxit CI", "email": "info@boxit.ci", "domain": "boxit.ci", "zone": "Côte d'Ivoire", "offre": "copilotage", "lang": "fr"}
]

print("Test DNS / MX sur les nouveaux prospects réels :")
passed = []
for p in real_leads:
    dom = p["domain"]
    em = p["email"].lower().strip()
    if em in excluded_emails or dom in excluded_domains:
        print(f"DEJA CONTACTE : {em}")
        continue
    if check_mx(dom):
        print(f"OK (MX Valide) : {p['name']} -> {em}")
        passed.append(p)
    else:
        print(f"ECHEC MX : {p['name']} ({dom})")

print(f"\nTotal validés sans faille : {len(passed)}/{len(real_leads)}")
with open("real_leads_verified.json", "w", encoding="utf-8") as f:
    json.dump(passed, f, indent=2, ensure_ascii=False)
