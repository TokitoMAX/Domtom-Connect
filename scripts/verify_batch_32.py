import json
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=======================================================")
print("VERIFICATION STRICTE DU BATCH 32 (HÔTELLERIE & LODGES D'EXCEPTION)")
print("=======================================================\n")

# 1. Load Batch 32
with open('batch_32_hotellerie_lodges.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

# 2. Load Existing Contacts
with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

existing_contacts = {c['email'].lower() for c in db.get('contacts', []) if isinstance(c, dict) and 'email' in c}
existing_domains = {d.lower() for d in db.get('domains', []) if isinstance(d, str)}

print(f"Total prospects dans Batch 32: {len(leads)}")
print(f"Total contacts connus en base: {len(existing_contacts)}")
print(f"Total domaines connus en base: {len(existing_domains)}\n")

errors = []
warnings = []
seen_emails = set()
seen_domains = set()

for i, lead in enumerate(leads, 1):
    comp = lead['company']
    email = lead['email'].strip().lower()
    subject = lead['subject']
    body = lead['body']
    domain = email.split('@')[1] if '@' in email else ''

    print(f"[{i}/{len(leads)}] Analyse: {comp} <{email}> ({lead['territory']})")

    # A. Email syntax & forbidden providers
    if '@' not in email or not domain:
        errors.append(f"{comp}: Adresse email invalide ({email})")
    if 'orange.fr' in domain or 'wanadoo.fr' in domain:
        errors.append(f"{comp}: Adresse Orange/Wanadoo interdite ({email})")

    # B. Deduplication
    if email in existing_contacts:
        errors.append(f"{comp}: Email DÉJÀ PRÉSENT dans la base ({email})")
    if email in seen_emails:
        errors.append(f"{comp}: Doublon email interne au batch ({email})")
    seen_emails.add(email)

    if domain in existing_domains:
        errors.append(f"{comp}: Domaine DÉJÀ PRÉSENT dans la base ({domain})")
    if domain in seen_domains:
        warnings.append(f"{comp}: Même domaine partagé dans le batch ({domain})")
    seen_domains.add(domain)

    # C. Zero Colons (:) Rule
    if ':' in subject:
        errors.append(f"{comp}: Caractère DEUX-POINTS (:) détecté dans le Sujet -> '{subject}'")
    if ':' in body:
        errors.append(f"{comp}: Caractère DEUX-POINTS (:) détecté dans le Corps")

    # D. Canonical URL Check
    if 'www.domtomconnect.com' not in body:
        errors.append(f"{comp}: URL canonique www.domtomconnect.com manquante dans le corps")
    if 'dom-tom' in body.lower() and 'dom-tom-connect' in body.lower():
        errors.append(f"{comp}: Erreur de nom de domaine avec tiret détectée")
    if 'http:' in body or 'https:' in body:
        errors.append(f"{comp}: Protocole http:/https: détecté (contient deux-points)")

    # E. Signature Check
    if "Loïc Villeronce\nFondateur — Domtom Connect" not in body:
        errors.append(f"{comp}: Signature non conforme")

    # F. DNS MX Verification
    p = subprocess.run(['nslookup', '-type=mx', domain], capture_output=True, text=True)
    if 'mail exchanger' not in p.stdout.lower() and 'mx' not in p.stdout.lower():
        errors.append(f"{comp}: Échec de résolution DNS MX pour {domain}")
    else:
        print(f"     -> MX OK pour {domain}")

print("\n-------------------------------------------------------")
print("RAPPORT DE CONTROLE QUALITÉ")
print("-------------------------------------------------------")

if errors:
    print(f"❌ {len(errors)} ERREUR(S) CRITIQUE(S) DÉTECTÉE(S) :")
    for err in errors:
        print(f"   - {err}")
    sys.exit(1)
else:
    print("✅ 100% CONFORME ! AUCUNE ERREUR.")
    print("   - Règle Zéro Deux-Points (:) : 100% respectée")
    print("   - Règle Déduplication : 100% vierge de doublons")
    print("   - Règle Résolution MX : 100% serveurs mail actifs")
    print("   - Règle URL www.domtomconnect.com : 100% présente")
    print("   - Règle Signature : 100% vérifiée")

if warnings:
    print(f"\n⚠️  {len(warnings)} Avertissement(s) :")
    for w in warnings:
        print(f"   - {w}")
