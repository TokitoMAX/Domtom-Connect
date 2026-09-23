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

international_candidates = [
    # Trinidad & Tobago
    {"company": "Angostura", "domain": "angostura.com", "zone": "Trinidad & Tobago", "sector": "Beverages & Rum / Heritage"},
    {"company": "Blue Waters", "domain": "bluewaterscaribbean.com", "zone": "Trinidad & Tobago", "sector": "FMCG & Bottled Water"},
    # Saint Lucia
    {"company": "Baron Foods", "domain": "baronfoodsltd.com", "zone": "Saint Lucia", "sector": "Agro-processing & CARICOM Export"},
    # Jamaica
    {"company": "GraceKennedy", "domain": "gracekennedy.com", "zone": "Jamaica", "sector": "Food Distribution & Financial Services"},
    # Mauritius
    {"company": "Phoenix Beverages", "domain": "phoenixbev.mu", "zone": "Mauritius", "sector": "Beverages & Regional Distribution"},
    {"company": "CIEL Group", "domain": "cielgroup.com", "zone": "Mauritius", "sector": "Agro, Healthcare, Finance & Textile"},
    # Kenya / East Africa
    {"company": "Wasoko", "domain": "wasoko.com", "zone": "East Africa (Kenya)", "sector": "B2B E-commerce & Retail Supply Chain"},
    # Ghana / West Africa
    {"company": "Kasapreko", "domain": "kasapreko.com", "zone": "Ghana", "sector": "Beverages & Regional Manufacturing"}
]

print("--- RECHERCHE DOMAINES CARAIBES & AFRIQUE INTERNATIONALE ---")
for c in international_candidates:
    dom = c['domain'].lower().strip()
    if dom in known_domains:
        print(f"[DEJA EN BASE] {c['company']} ({dom})")
        continue
    mx = check_mx(dom)
    is_m365 = any('outlook' in m.lower() or 'microsoft' in m.lower() for m in mx)
    is_google = any('google' in m.lower() or 'googlemail' in m.lower() or 'aspmx' in m.lower() for m in mx)
    print(f"{c['company']} ({c['zone']}) -> {dom} | MX: {len(mx)} | Google: {is_google} | M365: {is_m365} | MX1: {mx[0] if mx else 'None'}")
