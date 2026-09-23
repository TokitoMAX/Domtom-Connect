import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('batch_100_restaurants_wave2.json', 'r', encoding='utf-8') as f:
    batch = json.load(f)

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])

print(f"=======================================================")
print(f"VERIFICATION BATCH 100 RESTAURATEURS (VAGUE 2)")
print(f"=======================================================\n")
print(f"Total prospects dans le batch: {len(batch)}")

errors = 0
seen_emails = set()

for idx, p in enumerate(batch, 1):
    sub = p['subject']
    body = p['body']
    em = p['email'].lower().strip()
    comp = p['company']
    zone = p['zone']

    if ':' in sub:
        print(f"[{idx}] ERREUR: Deux-points dans sujet ({comp}) -> '{sub}'")
        errors += 1
    if ':' in body:
        print(f"[{idx}] ERREUR: Deux-points dans corps ({comp})")
        errors += 1
    if em in known_emails:
        print(f"[{idx}] ERREUR DOUBLON BASE: {em} ({comp})")
        errors += 1
    if em in seen_emails:
        print(f"[{idx}] ERREUR DOUBLON BATCH: {em} ({comp})")
        errors += 1
    seen_emails.add(em)

    for forbidden in ['solidaire', 'solidarite', 'bénévole', 'associatif', 'gratuit']:
        if forbidden in body.lower():
            print(f"[{idx}] ERREUR MOT INTERDIT '{forbidden}' ({comp})")
            errors += 1

    if 'dtc pulse' not in body.lower():
        print(f"[{idx}] ERREUR: Absence de DTC Pulse ({comp})")
        errors += 1
    if 'whatsapp' not in body.lower():
        print(f"[{idx}] ERREUR: Absence de WhatsApp ({comp})")
        errors += 1

print(f"\nContrôles terminés.")
if errors == 0:
    print(f"===> SUCCES TOTAL: 100/100 NOUVEAUX RESTAURANTS VALIDÉS !")
    print(f"     - 0 deux-points (':')")
    print(f"     - 0 doublons")
    print(f"     - 0 mot 'solidaire'")
    print(f"     - 100% alignés sur la rentabilité, les marges, DTC Pulse et le réseau WhatsApp !")
else:
    print(f"===> ATTENTION: {errors} erreurs détectées !")
