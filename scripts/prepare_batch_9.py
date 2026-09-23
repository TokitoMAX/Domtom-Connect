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
    # Parcs & Jardins d'excellence
    {"name": "Zoo de Guadeloupe", "email": "contact@zoodeguadeloupe.com", "domain": "zoodeguadeloupe.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Jardin Botanique de Deshaies", "email": "ml.troplent@jardin-botanique.com", "domain": "jardin-botanique.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Jardin de Balata", "email": "contact@jardindebalata.com", "domain": "jardindebalata.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Zoo de Martinique", "email": "contact@zoodemartinique.com", "domain": "zoodemartinique.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Domaine Château Gaillard", "email": "contact@domaine-chateau-gaillard.fr", "domain": "domaine-chateau-gaillard.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},

    # Distilleries & Terroir d'exception
    {"name": "Distillerie La Favorite", "email": "contact@lafavorite.com", "domain": "lafavorite.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum HSE", "email": "contact@rhumhse.com", "domain": "rhumhse.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Charrette", "email": "info@rhum-charrette.com", "domain": "rhum-charrette.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "La Vanilleraie", "email": "contact@lavanilleraie.com", "domain": "lavanilleraie.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Musées Région Réunion", "email": "contact@museesreunion.re", "domain": "museesreunion.re", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},

    # Pépites Tech & Fintech Panafricaines
    {"name": "CinetPay", "email": "hello@cinetpay.com", "domain": "cinetpay.com", "zone": "Côte d'Ivoire / Sénégal", "offre": "copilotage", "lang": "fr"},
    {"name": "PayDunya", "email": "paydunya@paydunya.com", "domain": "paydunya.com", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},
    {"name": "CoinAfrique", "email": "contact@coinafrique.com", "domain": "coinafrique.com", "zone": "Sénégal / Côte d'Ivoire", "offre": "copilotage", "lang": "fr"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 9...", flush=True)
verified = []
for p in candidates:
    em = p["email"].lower().strip()
    dom = p["domain"].lower().strip()

    if em in excluded_emails:
        print(f"[-] DÉJÀ EN BASE (Email) : {em}", flush=True)
        continue
    if dom in excluded_domains:
        print(f"[-] DÉJÀ EN BASE (Domaine) : {dom}", flush=True)
        continue

    if check_mx(dom):
        print(f"[+] MX CERTIFIÉ : {p['name']} -> {em}", flush=True)
        verified.append(p)
    else:
        print(f"[x] ECHEC MX : {dom}", flush=True)

print(f"\nTotal Batch 9 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_9_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
