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

candidates = [
    # Tropical Shipping (The lifeline carrier between Florida & all Caribbean islands, HQ Riviera Beach FL)
    {"company": "Tropical Shipping", "domain": "tropical.com", "zone": "USA (Florida) / Pan-Caribbean", "sector": "Maritime Shipping & Caribbean Logistics"},
    # Caribtrans Logistics (Miami freight forwarder to all Caribbean islands)
    {"company": "Caribtrans Logistics", "domain": "caribtrans.com", "zone": "USA (Miami) / Caribbean", "sector": "Freight & Supply Chain"},
    # Goddard Enterprises (Barbados & Pan-Caribbean)
    {"company": "Goddard Enterprises", "domain": "goddardenterprises.com", "zone": "Barbados", "sector": "Conglomerate & Manufacturing"},
    # Ron Barcelo (Dominican Republic - Global Dominican Rum)
    {"company": "Ron Barceló", "domain": "ronbarcelo.com", "zone": "Dominican Republic", "sector": "Spirits & Global Export"},
    # Bahamas Waste (Bahamas - Premier waste management & green logistics)
    {"company": "Bahamas Waste", "domain": "bahamaswaste.com", "zone": "Bahamas", "sector": "Environmental Services & Logistics"},
    # Phoenix Beverages (Mauritius - Redirection vers Businessdev direct suite auto-reply)
    {"company": "Phoenix Beverages (Business Dev)", "domain": "phoenixbev.mu", "zone": "Mauritius", "sector": "Business Development & Distribution"},
    # Cervecería Nacional Dominicana / CND
    {"company": "Cervecería Nacional Dominicana", "domain": "cnd.com.do", "zone": "Dominican Republic", "sector": "Beverages & Distribution"}
]

print("--- CANDIDATS BATCH 23 (FUSEAUX AMERIQUES / CARAIBES 17H) ---")
for c in candidates:
    dom = c['domain'].lower().strip()
    if dom in known_domains and c['company'] != "Phoenix Beverages (Business Dev)":
        print(f"[DEJA EN BASE] {c['company']} ({dom})")
        continue
    mx = check_mx(dom)
    is_m365 = any('outlook' in m.lower() or 'microsoft' in m.lower() for m in mx)
    is_google = any('google' in m.lower() or 'googlemail' in m.lower() or 'aspmx' in m.lower() for m in mx)
    print(f"{c['company']} ({c['zone']}) -> {dom} | MX: {len(mx)} | Google: {is_google} | M365: {is_m365} | MX1: {mx[0] if mx else 'None'}")
