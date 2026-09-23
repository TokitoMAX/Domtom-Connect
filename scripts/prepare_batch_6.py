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
    # Mayotte
    {"name": "ServeU Mayotte", "email": "contact@serveu.fr", "domain": "serveu.fr", "zone": "Mayotte", "offre": "copilotage", "lang": "fr"},
    {"name": "Coffee Mayotte", "email": "contact@nespresso-mayotte.com", "domain": "nespresso-mayotte.com", "zone": "Mayotte", "offre": "copilotage", "lang": "fr"},

    # Guadeloupe
    {"name": "Ingéni'Eaux Caraïbes", "email": "contact@ingenieaux.com", "domain": "ingenieaux.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Sinergis Guadeloupe", "email": "info@groupesfpr.fr", "domain": "groupesfpr.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Les Belles Envies Guadeloupe", "email": "contactgp@lesbellesenvies.fr", "domain": "lesbellesenvies.fr", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},

    # Martinique
    {"name": "ENR'DEAL", "email": "contact@enrdeal.com", "domain": "enrdeal.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Émeraude Villas", "email": "infos@emeraude-villas.com", "domain": "emeraude-villas.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Pose 24", "email": "contact@pose24.fr", "domain": "pose24.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Sono Audition", "email": "contact@sonoaudition.com", "domain": "sonoaudition.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Locations Vue Turquoise", "email": "jm@locations-vue-turquoise.com", "domain": "locations-vue-turquoise.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},

    # La Réunion
    {"name": "Innocéan La Réunion", "email": "commercial@innocean.re", "domain": "innocean.re", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "SNDS Négoce", "email": "contact@snds.run", "domain": "snds.run", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "GFA Réunion", "email": "grondinm@gfareunion.fr", "domain": "gfareunion.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Canopée Expertise", "email": "vincent.alain@canopee-expertise.re", "domain": "canopee-expertise.re", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "OIF Formation", "email": "nadja.djaffar@oif-formation.fr", "domain": "oif-formation.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Adventure Quad Réunion", "email": "reservation@adventure-quad.re", "domain": "adventure-quad.re", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "MyAssetRocks", "email": "contact@myassetrocks.com", "domain": "myassetrocks.com", "zone": "La Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Fibres Industries Bois", "email": "marketing@fibres.fr", "domain": "fibres.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "RUNPARK", "email": "contact@runpark.re", "domain": "runpark.re", "zone": "La Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Gîtes de France Réunion", "email": "contact@gites-de-france-reunion.com", "domain": "gites-de-france-reunion.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},

    # Afrique (Côte d'Ivoire)
    {"name": "Julaya Fintech", "email": "contact@julaya.co", "domain": "julaya.co", "zone": "Côte d'Ivoire", "offre": "copilotage", "lang": "fr"},
    {"name": "ANKA Marketplace", "email": "help@anka.africa", "domain": "anka.africa", "zone": "Côte d'Ivoire / International", "offre": "tremplin", "lang": "fr"},

    # Caraïbes Anglophones
    {"name": "800 Star Limited", "email": "info@800star.com", "domain": "800star.com", "zone": "Trinidad & Tobago", "offre": "copilotage", "lang": "en"},
    {"name": "Kestrel Liner Agencies", "email": "barbados@kestrel.com", "domain": "kestrel.com", "zone": "Barbados / Caribbean", "offre": "copilotage", "lang": "en"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 6...", flush=True)
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

print(f"\nTotal Batch 6 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_6_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
