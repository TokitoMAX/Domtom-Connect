import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_domains = set(d.lower().strip() for d in excl['domains'])
known_emails = set(c['email'].lower().strip() for c in excl['contacts'])

def check_mx(domain):
    try:
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=5)
        out = res.stdout.strip().splitlines()
        return [o.strip() for o in out if o.strip()]
    except Exception:
        return []

candidates = [
    ("puntacana.com", "info@puntacana.com"),
    ("cerveceradepr.com", "marketing@cerveceradepr.com"),
    ("gracefoods.ca", "info@gracefoods.ca"),
    ("thebhlgroup.com", "info@thebhlgroup.com"),
    ("sopac-guyane.com", "contact@sopac-guyane.com"),
    ("rhumbielle.com", "contact@rhumbielle.com")
]

print("--- VERIFICATION CANDIDATS BATCH 23 ---")
for dom, em in candidates:
    in_em = em in known_emails
    in_dom = dom in known_domains
    mx = check_mx(dom)
    print(f"{dom} ({em}) -> in_db_email={in_em}, in_db_domain={in_dom}, MX={len(mx)}, MX1={mx[0] if mx else 'None'}")
