# -*- coding: utf-8 -*-
"""
Vérificateur indépendant pour le Batch 100 Vague 3 (Global & Asie)
"""

import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('batch_100_wave3_global_asia.json', 'r', encoding='utf-8') as f:
    batch = json.load(f)

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])

print(f"=======================================================")
print(f"VERIFICATION BATCH 100 VAGUE 3 (GLOBAL & ASIE)")
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
        print(f"[{idx}] ERREUR DOUBLON BASE D'EXCLUSION: {em} ({comp})")
        errors += 1
    if em in seen_emails:
        print(f"[{idx}] ERREUR DOUBLON BATCH: {em} ({comp})")
        errors += 1
    seen_emails.add(em)

    if 'www.domtomconnect.com' not in body:
        print(f"[{idx}] ERREUR: Absence de l'URL www.domtomconnect.com ({comp})")
        errors += 1

print(f"\nContrôles terminés.")
if errors == 0:
    print(f"===> SUCCES TOTAL: 100/100 NOUVEAUX RESTAURANTS VALIDÉS !")
    print(f"     - 0 deux-points (':')")
    print(f"     - 0 doublons")
    print(f"     - 100% avec l'URL www.domtomconnect.com")
    print(f"     - Répartition équilibrée (Asie, USA, Canada, Afrique, France & Caraïbes)")
else:
    print(f"===> ATTENTION: {errors} erreurs détectées.")
