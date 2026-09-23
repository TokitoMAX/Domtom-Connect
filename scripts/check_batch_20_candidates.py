import json
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)
known_domains = set(db.get('domains', []))
known_emails = set(c['email'].lower().strip() for c in db.get('contacts', []))

candidates = [
    'chocolat-elot.com',
    'madiana.com',
    'rhummontebello.fr',
    'rhum-montebello.net',
    'laboratoirebiosoleil.com',
    'djamo.com',
    'djamo.ci',
    'bizao.com',
    'aquatech-caraibes.com',
    'groupe-loret.com',
    'perelabat.com',
    'rhumperelabat.com',
    'cirest.net',
    'urcoopa.fr'
]

print("Verification des domaines candidats :")
for d in candidates:
    in_db = d in known_domains
    print(f"{d} : in_db={in_db}")
