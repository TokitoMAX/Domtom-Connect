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
    {"name": "Hôtel Bakoua", "email": "resa@hotel-bakoua.fr", "domain": "hotel-bakoua.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Hôtel Bambou", "email": "reservation@hotelbambou.fr", "domain": "hotelbambou.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Hôtel La Pagerie", "email": "resa@hotel-lapagerie.com", "domain": "hotel-lapagerie.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Catamaran Diamond Rock", "email": "contact@catamaran-diamond-rock.com", "domain": "catamaran-diamond-rock.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Marfret Ferrymar", "email": "bjulius@marfret.fr", "domain": "marfret.fr", "zone": "Martinique / Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Karibea Hôtels", "email": "reservation@karibea.com", "domain": "karibea.com", "zone": "Martinique / Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Domaine de Depaz", "email": "depaz@depaz.fr", "domain": "depaz.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Saint James", "email": "info@saintjames-rum.com", "domain": "saintjames-rum.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Institut d'Imagerie Place d'Armes", "email": "secretariat@radiologie-placedarmes.fr", "domain": "radiologie-placedarmes.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Ty Domino", "email": "tydomino@gmail.com", "domain": "gmail.com", "zone": "Martinique", "offre": "tremplin", "lang": "fr"},

    # Guadeloupe
    {"name": "Hôtel Canella Beach", "email": "reservation@canellabeach.com", "domain": "canellabeach.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Arawak Beach Resort", "email": "reservation@arawakbeachresort.com", "domain": "arawakbeachresort.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Bologne", "email": "contact@rhumbologne.fr", "domain": "rhumbologne.fr", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "BOKARAIBES Food Events", "email": "bokaraibes@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "Villa Guacana", "email": "villaguacana@gmail.com", "domain": "gmail.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},

    # Guyane
    {"name": "SOMASCO Guyane", "email": "somasco@loret.net", "domain": "loret.net", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "CEMKO Guyane", "email": "lionel@cemko.fr", "domain": "cemko.fr", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},
    {"name": "Dollar Antilles Guyane", "email": "reservation@dollarantilles.com", "domain": "dollarantilles.com", "zone": "Guyane", "offre": "copilotage", "lang": "fr"},

    # La Réunion
    {"name": "Villa Roméo", "email": "contact@villaromeo.fr", "domain": "villaromeo.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Rivière du Mât", "email": "contact@rivieredumat.com", "domain": "rivieredumat.com", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "SHLMR", "email": "communication@shlmr.fr", "domain": "shlmr.fr", "zone": "La Réunion", "offre": "copilotage", "lang": "fr"},

    # Mayotte
    {"name": "Les Eaux de Mayotte", "email": "eauxdemayotte@gmail.com", "domain": "gmail.com", "zone": "Mayotte", "offre": "copilotage", "lang": "fr"},
    {"name": "Troptical Opticien", "email": "v.prophete@laposte.net", "domain": "laposte.net", "zone": "Mayotte", "offre": "copilotage", "lang": "fr"},

    # Sénégal
    {"name": "Cabinet Fatou Babou", "email": "contact@fbavocat-sn.com", "domain": "fbavocat-sn.com", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 7...", flush=True)
verified = []
for p in candidates:
    em = p["email"].lower().strip()
    dom = p["domain"].lower().strip()

    if em in excluded_emails:
        print(f"[-] DÉJÀ EN BASE (Email) : {em}", flush=True)
        continue
    if dom != "gmail.com" and dom != "laposte.net" and dom in excluded_domains:
        print(f"[-] DÉJÀ EN BASE (Domaine) : {dom}", flush=True)
        continue

    if check_mx(dom):
        print(f"[+] MX CERTIFIÉ : {p['name']} -> {em}", flush=True)
        verified.append(p)
    else:
        print(f"[x] ECHEC MX : {dom}", flush=True)

print(f"\nTotal Batch 7 certifiés : {len(verified)}/{len(candidates)} prospects.")
with open("batch_7_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
