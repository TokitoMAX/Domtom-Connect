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
    # Groupes majeurs & Industrie
    {"name": "Groupe SAFO", "email": "info@safo.fr", "domain": "safo.fr", "zone": "Antilles-Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "Biometal", "email": "contact@biometal.fr", "domain": "biometal.fr", "zone": "Guadeloupe / Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "GBH Groupe Bernard Hayot", "email": "Service.CommunicationGbh@gbh.fr", "domain": "gbh.fr", "zone": "Antilles-Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "Albioma Caraïbes", "email": "contact@albioma.com", "domain": "albioma.com", "zone": "Guadeloupe / Martinique / Réunion", "offre": "copilotage", "lang": "fr"},

    # Logistique & Déménagement international
    {"name": "AGS Guadeloupe", "email": "guadeloupe@ags-demenagement.com", "domain": "ags-demenagement.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "AGS Martinique", "email": "martinique@ags-demenagement.com", "domain": "ags-demenagement.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "AGS Guyane", "email": "guyane@ags-demenagement.com", "domain": "ags-demenagement.com", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "AGS Réunion", "email": "reunion@ags-demenagement.com", "domain": "ags-demenagement.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},

    # Hôtellerie & Tourisme
    {"name": "Le Relais du Moulin", "email": "reservation@relaisdumoulin.com", "domain": "relaisdumoulin.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Hôtel Le Rotabas", "email": "contact@lerotabas.com", "domain": "lerotabas.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Hôtel Le Nil", "email": "reservation@hotel-le-nil.com", "domain": "hotel-le-nil.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "La Villa du Cap", "email": "villaducap.sainteanne@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "Langley Resort Fort Royal", "email": "reservations.fortroyal@langley.eu", "domain": "langley.eu", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Habitation Grande Anse", "email": "infohotelhga@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Hôtel Bois Joli Les Saintes", "email": "hotelboisjoli971@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Gîtes de France Guadeloupe", "email": "gitedefrance.gpe@wanadoo.fr", "domain": "wanadoo.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},

    # Conseil & Expertise
    {"name": "BDO Guadeloupe", "email": "contact@bdo.fr", "domain": "bdo.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Exco Antilles", "email": "contact@exco.fr", "domain": "exco.fr", "zone": "Guadeloupe / Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "In Extenso Antilles", "email": "contact@inextenso.fr", "domain": "inextenso.fr", "zone": "Guadeloupe / Martinique", "offre": "copilotage", "lang": "fr"},

    # Afrique (Sénégal)
    {"name": "DSP Consulting", "email": "contact@dsp-consulting.com", "domain": "dsp-consulting.com", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 8...", flush=True)
verified = []
for p in candidates:
    em = p["email"].lower().strip()
    dom = p["domain"].lower().strip()

    if em in excluded_emails:
        print(f"[-] DÉJÀ EN BASE (Email) : {em}", flush=True)
        continue
    if dom not in ["gmail.com", "wanadoo.fr", "ags-demenagement.com"] and dom in excluded_domains:
        print(f"[-] DÉJÀ EN BASE (Domaine) : {dom}", flush=True)
        continue

    if check_mx(dom):
        print(f"[+] MX CERTIFIÉ : {p['name']} -> {em}", flush=True)
        verified.append(p)
    else:
        print(f"[x] ECHEC MX : {dom}", flush=True)

print(f"\nTotal Batch 8 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_8_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
