import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

def check_mx(domain):
    try:
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=5)
        out = res.stdout.strip().splitlines()
        return [o.strip() for o in out if o.strip()]
    except Exception:
        return []

extra = [
    {"company": "Saint Lucia Distillers", "domain": "saintluciadistillers.com", "zone": "Saint Lucia"},
    {"company": "Goddard Enterprises", "domain": "goddardenterprises.com", "zone": "Barbados / Caribbean"},
    {"company": "Mount Gay Rum", "domain": "mountgayrum.com", "zone": "Barbados"},
    {"company": "Seprod Group", "domain": "seprod.com", "zone": "Jamaica"},
    {"company": "IBL Group", "domain": "iblgroup.com", "zone": "Mauritius"},
    {"company": "TradeDepot", "domain": "tradedepot.co", "zone": "Nigeria / West Africa"}
]

for e in extra:
    mx = check_mx(e['domain'])
    print(f"{e['company']} ({e['zone']}) -> {e['domain']} | MX: {len(mx)} | MX1: {mx[0] if mx else 'None'}")
