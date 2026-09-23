import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_domains = set(d.lower().strip() for d in excl['domains'])

def check_mx(domain):
    try:
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=5)
        out = res.stdout.strip().splitlines()
        return [o.strip() for o in out if o.strip()]
    except Exception:
        return []

candidates_guyane_etc = [
    # SOLAM (Société Laitière de Guyane - Macouria, agroalimentaire incontournable)
    {"company": "SOLAM (Société Laitière de Guyane)", "domain": "solam.fr", "zone": "Guyane", "sector": "Agroalimentaire & Produits laitiers locaux"},
    # Sudamex Guyane (Matériaux & Négoce BTP)
    {"company": "Sudamex Guyane", "domain": "sudamex.fr", "zone": "Guyane", "sector": "Importation & Négoce matériaux Guyane"},
    # Guyane Nature Environnement / Eaux de Guyane (SGDE)
    {"company": "SGDE (Société Guyanaise des Eaux)", "domain": "sgde.fr", "zone": "Guyane", "sector": "Distribution d'eau potable & Assainissement"},
    # Mascarin (La Réunion - Chocolaterie, confiserie et sucre péi)
    {"company": "Chocolaterie Mascarin", "domain": "mascarin.fr", "zone": "La Réunion", "sector": "Agroalimentaire & Confiserie péi"},
    # Cilam (La Réunion - Compagnie Laitière des Mascareignes / Piton Saint-Leu)
    {"company": "CILAM (Compagnie Laitière des Mascareignes)", "domain": "cilam.com", "zone": "La Réunion", "sector": "Industrie agroalimentaire & Produits frais"},
    # Laboratoire Bio Pôle Antilles / Biofutur
    {"company": "Laboratoire Synergies Caraïbes", "domain": "synergies-caraibes.fr", "zone": "Guadeloupe", "sector": "Analyses médicales & Santé"},
    # C2I Outremer (Déjà whitelisté Mailinblack, mais domaine de Digitom)
    # Espace Micro (Guadeloupe - Informatique B2B)
    {"company": "Espace Micro", "domain": "espacemicro.com", "zone": "Guadeloupe", "sector": "Ingénierie informatique & Réseaux"},
    # Antilles Glaces (Martinique - Glaces Miko Caraïbes / Agroalimentaire)
    {"company": "Antilles Glaces", "domain": "antillesglaces.com", "zone": "Martinique", "sector": "Agroalimentaire & Surgelés"},
    # Air Affaires Guyane
    {"company": "Guyane Air Transport", "domain": "guyane-air-transport.com", "zone": "Guyane", "sector": "Aérien & Fret amazonien"}
]

print("--- CANDIDATS GUYANE & NOUVEAUX TERRITOIRES ---")
for c in candidates_guyane_etc:
    dom = c['domain'].lower().strip()
    if dom in known_domains:
        print(f"[DEJA EN BASE] {c['company']} ({dom})")
        continue
    mx = check_mx(dom)
    is_m365 = any('outlook' in m.lower() or 'microsoft' in m.lower() for m in mx)
    is_orange = any('orange' in m.lower() or 'wanadoo' in m.lower() for m in mx)
    status = "OK" if mx and not is_orange else ("EXCLU ORANGE" if is_orange else "NO MX")
    print(f"{c['company']} ({c['zone']}) -> {dom} | MX: {len(mx)} | M365: {is_m365} | Status: {status} | MX1: {mx[0] if mx else 'None'}")
