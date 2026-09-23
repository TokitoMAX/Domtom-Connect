import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)
known_domains = set(db.get('domains', []))
known_emails = set(c['email'].lower().strip() for c in db.get('contacts', []))

candidates = [
    {'comp': 'Distillerie Montebello', 'dom': 'distillerie-montebello.fr', 'email': 'boutique@distillerie-montebello.fr'},
    {'comp': 'Madiana', 'dom': 'madiana.com', 'email': 'contact@madiana.com'},
    {'comp': 'Groupe COFINA', 'dom': 'cofinacorp.com', 'email': 'service-client.cac@cofinacorp.com'},
    {'comp': 'Sunzil', 'dom': 'sunzil.com', 'email': 'oceanindien@sunzil.com'},
    {'comp': 'viàATV', 'dom': 'viaatv.tv', 'email': 'contact@viaatv.tv'},
    {'comp': 'Radio Free Dom', 'dom': 'freedom.fr', 'email': 'radio@freedom.fr'},
    {'comp': 'Le Journal de Mayotte', 'dom': 'lejournaldemayotte.com', 'email': 'direction@lejournaldemayotte.com'}
]

print(f"Verification des 7 cibles candidates pour Batch 20 :")
for p in candidates:
    dom = p['dom']
    em = p['email'].lower().strip()
    in_db_dom = dom in known_domains
    in_db_em = em in known_emails
    
    cmd = f"Resolve-DnsName -Name {dom} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
    res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
    mx_list = [line.strip() for line in res.stdout.splitlines() if line.strip()]
    
    print(f"-> {p['comp']} ({dom}) :")
    print(f"   Doublon domaine : {in_db_dom} | Doublon email : {in_db_em}")
    print(f"   MX : {mx_list}")
