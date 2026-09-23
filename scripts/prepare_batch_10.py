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
    # Martinique
    {"name": "Mangofil Martinique", "email": "contact@mangofil.fr", "domain": "mangofil.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Habitation Belfort", "email": "resa@visitebelfort.com", "domain": "visitebelfort.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Groupe Macéo", "email": "contact@maceo-groupe.fr", "domain": "maceo-groupe.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Bubble Dive Martinique", "email": "bubbledivemartinique@gmail.com", "domain": "gmail.com", "zone": "Martinique", "offre": "tremplin", "lang": "fr"},

    # Guadeloupe
    {"name": "Le Tapeur Parc Aventure", "email": "contact@letapeur.fr", "domain": "letapeur.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Permis Bateaux Guadeloupe", "email": "contact@permisbateauxguadeloupe.fr", "domain": "permisbateauxguadeloupe.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Paradoxe Croisières", "email": "contact@paradoxe-croisieres.com", "domain": "paradoxe-croisieres.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Poul'do Bateaux", "email": "reservations@pouldo.com", "domain": "pouldo.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Tropical Boat", "email": "tropicalboat.971@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "Caraïbes Nautisme", "email": "caraibesnautisme@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},

    # La Réunion
    {"name": "Brasseries de Bourbon", "email": "bdb@bdb.re", "domain": "bdb.re", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Métiss", "email": "contact@rhum-metiss.com", "domain": "rhum-metiss.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 10...", flush=True)
verified = []
for p in candidates:
    em = p["email"].lower().strip()
    dom = p["domain"].lower().strip()

    if em in excluded_emails:
        print(f"[-] DÉJÀ EN BASE (Email) : {em}", flush=True)
        continue
    if dom != "gmail.com" and dom in excluded_domains:
        print(f"[-] DÉJÀ EN BASE (Domaine) : {dom}", flush=True)
        continue

    if check_mx(dom):
        print(f"[+] MX CERTIFIÉ : {p['name']} -> {em}", flush=True)
        verified.append(p)
    else:
        print(f"[x] ECHEC MX : {dom}", flush=True)

print(f"\nTotal Batch 10 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_10_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
