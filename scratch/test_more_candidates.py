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

more_candidates = [
    {"company": "Kirène", "domain": "kirene.sn", "zone": "Afrique de l'Ouest (Sénégal)", "sector": "Agroalimentaire & Boissons"},
    {"company": "Sedima", "domain": "sedima.com", "zone": "Afrique de l'Ouest (Sénégal)", "sector": "Agro-industrie & Aviculture"},
    {"company": "Distillerie Longueteau", "domain": "rhumlongueteau.com", "zone": "Guadeloupe", "sector": "Agro-industrie & Rhum agricole"},
    {"company": "Longueteau Alt", "domain": "domaine-longueteau.fr", "zone": "Guadeloupe", "sector": "Agro-industrie"},
    {"company": "Rhum Karukera", "domain": "karukera-rhum.com", "zone": "Guadeloupe", "sector": "Agroalimentaire & Spiritueux"},
    {"company": "Chocolaterie Robert", "domain": "chocolatier-robert.com", "zone": "Océan Indien", "sector": "Agroalimentaire & Cacao de terroir"},
    {"company": "Groupe Siprec", "domain": "siprec.ci", "zone": "Afrique de l'Ouest (Côte d'Ivoire)", "sector": "Industrie cosmétique & Agro"}
]

print("--- TESTS COMPLEMENTAIRES BATCH 21 ---")
for c in more_candidates:
    dom = c['domain'].lower().strip()
    if dom in known_domains:
        print(f"[DEJA EN BASE] {c['company']} ({dom})")
        continue
    mx = check_mx(dom)
    is_m365 = any('outlook' in m.lower() or 'microsoft' in m.lower() for m in mx)
    is_orange = any('orange' in m.lower() or 'wanadoo' in m.lower() for m in mx)
    status = "OK" if mx and not is_orange else ("EXCLU ORANGE" if is_orange else "NO MX")
    print(f"{c['company']} ({c['zone']}) -> {dom} | MX: {len(mx)} | M365: {is_m365} | Status: {status} | MX1: {mx[0] if mx else 'None'}")
