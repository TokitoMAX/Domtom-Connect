import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_emails = set(c['email'].lower().strip() for c in excl['contacts'])
known_domains = set(d.lower().strip() for d in excl['domains'])

def check_mx(domain):
    cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
    res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
    out = res.stdout.strip().splitlines()
    return [o.strip() for o in out if o.strip()]

candidates = [
    # Rhum Bologne (Guadeloupe - Basse-Terre)
    {"company": "Distillerie Bologne", "domain": "distillerie-bologne.fr", "zone": "Guadeloupe", "sector": "Agro-industrie & Rhum"},
    # Café Chaulet (Guadeloupe - Vieux-Habitants)
    {"company": "Café Chaulet", "domain": "cafechaulet.com", "zone": "Guadeloupe", "sector": "Agroalimentaire & Café de terroir"},
    # Chocolat Elot (Martinique - Le Lamentin)
    {"company": "Chocolaterie Elot", "domain": "chocolatelot.com", "zone": "Martinique", "sector": "Agroalimentaire & Chocolat traditionnel"},
    # Rhum Neisson (Martinique - Le Carbet)
    {"company": "Distillerie Neisson", "domain": "neisson.com", "zone": "Martinique", "sector": "Agro-industrie & Rhum agricole"},
    # Somatrans (La Réunion - Le Port)
    {"company": "Somatrans", "domain": "somatrans.re", "zone": "La Réunion", "sector": "Logistique portuaire & Transit"},
    # Bio Pôle Antilles (Guadeloupe - Laboratoire)
    {"company": "Bio Pôle Antilles", "domain": "biopole-antilles.fr", "zone": "Guadeloupe", "sector": "Santé & Biologie médicale"},
    # Guyalog / Groupe Guyane Logistique (Guyane - Dégrad des Cannes)
    {"company": "Marfret Guyane / Caraïbes", "domain": "marfret.fr", "zone": "Guyane / Caraïbes", "sector": "Transport maritime & Fret"},
    # SNIE Mayotte (Société Nouvelle d'Importation et d'Exportation - Mayotte)
    {"company": "Groupe Cananga / Mayotte", "domain": "cananga.fr", "zone": "Mayotte", "sector": "Distribution & Commerce Mayotte"},
    # Runconcept (La Réunion)
    {"company": "Runconcept", "domain": "runconcept.com", "zone": "La Réunion", "sector": "Conseil & Stratégie océan Indien"},
    # Chanflor (Martinique - Eau minérale source de montagne)
    {"company": "Chanflor", "domain": "chanflor.com", "zone": "Martinique", "sector": "Agroalimentaire & Boissons locales"},
    # Damoiseau (Guadeloupe - Le Moule)
    {"company": "Rhum Damoiseau", "domain": "damoiseau.com", "zone": "Guadeloupe", "sector": "Agro-industrie & Export"}
]

print("--- VERIFICATION DES CANDIDATS BATCH 21 ---")
for c in candidates:
    dom = c['domain'].lower().strip()
    if dom in known_domains:
        print(f"[DEJA EN BASE] {c['company']} ({dom})")
        continue
    mx = check_mx(dom)
    is_m365 = any('outlook' in m.lower() or 'microsoft' in m.lower() for m in mx)
    is_orange = any('orange' in m.lower() or 'wanadoo' in m.lower() for m in mx)
    status = "OK" if mx and not is_orange else ("EXCLU ORANGE" if is_orange else "NO MX")
    print(f"{c['company']} ({c['zone']}) -> {dom} | MX: {len(mx)} | M365: {is_m365} | Status: {status} | MX1: {mx[0] if mx else 'None'}")
