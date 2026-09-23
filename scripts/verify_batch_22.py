import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('batch_22_needs_discovery.json', 'r', encoding='utf-8') as f:
    batch = json.load(f)

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])
known_domains = set(d.lower().strip() for d in db['domains'])

print(f"Total prospects Batch 22: {len(batch)}")

errors = 0
for idx, p in enumerate(batch, 1):
    sub = p['subject']
    body = p['body']
    em = p['email'].lower().strip()
    dom = p['domain']
    comp = p['company']
    zone = p['zone']
    
    if ':' in sub:
        print(f"ERREUR: Deux-points dans sujet ({comp})")
        errors += 1
    if ':' in body:
        print(f"ERREUR: Deux-points dans corps ({comp})")
        errors += 1
    if em in known_emails:
        print(f"ERREUR DOUBLON EMAIL: {em}")
        errors += 1
    if dom in known_domains:
        print(f"ERREUR DOUBLON DOMAINE: {dom}")
        errors += 1
    print(f"[{idx}] {comp} ({zone}) -> {em} | Deux-points sub={sub.count(':')} body={body.count(':')}")

if errors == 0:
    print("\n===> VALIDATION PARFAITE 100% CONFORME (ZERO DEUX-POINTS, ZERO DOUBLON)")
else:
    print(f"\n===> ATTENTION: {errors} ERREURS DETECTEES")
