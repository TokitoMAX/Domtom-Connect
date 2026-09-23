import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)
known_domains = set(db.get('domains', []))
known_emails = set(c['email'].lower().strip() for c in db.get('contacts', []))

candidates = [
    {'comp': 'Laboratoire Bio Soleil (Guyane)', 'dom': 'laboratoirebiosoleil.com', 'email': 'reclamations@laboratoirebiosoleil.com'},
    {'comp': 'Aquatech Caraïbes (Guadeloupe)', 'dom': 'aquatech-caraibes.com', 'email': 'contact@aquatech-caraibes.com'},
    {'comp': 'Guyane Énergie Climat', 'dom': 'guyane-energie.org', 'email': 'contact@guyane-energie.org'}
]

for p in candidates:
    dom = p['dom']
    em = p['email'].lower().strip()
    in_db_dom = dom in known_domains
    in_db_em = em in known_emails
    cmd = f"Resolve-DnsName -Name {dom} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
    res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
    mx_list = [line.strip() for line in res.stdout.splitlines() if line.strip()]
    print(f"{p['comp']} ({dom}) -> in_db_dom={in_db_dom}, in_db_em={in_db_em}, MX={mx_list}")
