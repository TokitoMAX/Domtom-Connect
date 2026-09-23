import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

initial_c = len(db['contacts'])
initial_d = len(db['domains'])

db['contacts'] = [c for c in db['contacts'] if c['email'].lower().strip() != 'contact@cerp-ba.com']
db['domains'] = [d for d in db['domains'] if d.lower().strip() != 'cerp-ba.com']

with open('contacts_deja_contactes.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Purge CERP effectuée : {initial_c} -> {len(db['contacts'])} contacts, {initial_d} -> {len(db['domains'])} domaines.")
