import os
import glob
import re
import json
from collections import defaultdict

print("=== AUDIT COMPLET DES ENVOIS MULTIPLES ===")

# 1. Vérifier dans contacts_deja_contactes.json
with open('contacts_deja_contactes.json', encoding='utf-8') as f:
    db = json.load(f)

contacts = db.get('contacts', [])
print(f"Total contacts dans la base: {len(contacts)}")

# Compter par email
email_counts = defaultdict(list)
domain_counts = defaultdict(list)

for c in contacts:
    if isinstance(c, dict):
        email = c.get('email', '').strip().lower()
        company = c.get('company', '')
        date = c.get('date_contacted', '')
        source = c.get('source', '')
        if email and '@' in email:
            dom = email.split('@')[1]
            email_counts[email].append({'company': company, 'date': date, 'source': source})
            domain_counts[dom].append({'company': company, 'email': email, 'date': date, 'source': source})

# 2. Scanner tous les scripts d'envoi batch dans scripts/
scripts = glob.glob('scripts/send_*.py') + glob.glob('scripts/send_*.js')

script_targets = defaultdict(list)
for s in scripts:
    with open(s, encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    # Trouver les emails
    found_emails = re.findall(r'[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}', text)
    # Filtrer les adresses propres (ex: domtomconnect@gmail.com, test@..., brevo...)
    system_emails = {'domtomconnect@gmail.com', 'smtp@brevo.com', 'test@example.com'}
    for em in set(found_emails):
        em_lower = em.strip().lower()
        if em_lower not in system_emails and not em_lower.endswith('.png') and not em_lower.endswith('.jpg'):
            script_targets[em_lower].append(os.path.basename(s))

# Doublons stricts par email dans les contacts
duplicates_email = {em: lst for em, lst in email_counts.items() if len(lst) > 1}
# Doublons par domaine (ex: plusieurs emails envoyés au même nom de domaine)
duplicates_domain = {dom: lst for dom, lst in domain_counts.items() if len(lst) > 1}
# Emails ciblés dans plusieurs scripts d'envoi
duplicates_in_scripts = {em: s_list for em, s_list in script_targets.items() if len(s_list) > 1}

print("\n--- 1. DOUBLONS STRICTS PAR ADRESSE EMAIL DANS LA BASE ---")
print(f"Nombre d'adresses email avec > 1 entrée dans contacts: {len(duplicates_email)}")
for em, lst in duplicates_email.items():
    print(f"\n[EMAIL DOUBLON] {em} (trouvé {len(lst)} fois):")
    for item in lst:
        print(f"   - Date: {item['date']} | Entreprise: {item['company']} | Source: {item['source'][:60]}")

print("\n--- 2. DOUBLONS PAR DOMAINE D'ENTREPRISE (DIFFÉRENTES ADRESSES OU MÊME ENTREPRISE) ---")
# Filtrer les domaines publics comme gmail.com, yahoo.fr, orange.fr, hotmail.com, etc.
free_domains = {'gmail.com', 'yahoo.fr', 'yahoo.com', 'orange.fr', 'wanadoo.fr', 'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'icloud.com', 'laposte.net', 'free.fr'}
company_domain_dups = {dom: lst for dom, lst in duplicates_domain.items() if dom not in free_domains}

print(f"Nombre de domaines d'entreprises ciblés plus d'une fois: {len(company_domain_dups)}")
for dom, lst in company_domain_dups.items():
    print(f"\n[DOMAINE ENTREPRISE MULTI-ENVOIS] {dom} ({len(lst)} occurrences):")
    for item in lst:
        print(f"   - {item['email']} | {item['company']} | Date: {item['date']} | Source: {item['source'][:50]}")

print("\n--- 3. ADRESSES PRÉSENTES DANS PLUSIEURS SCRIPTS DE BATCH ---")
print(f"Nombre d'emails présents dans plus d'un script d'envoi: {len(duplicates_in_scripts)}")
for em, s_list in duplicates_in_scripts.items():
    print(f"   - {em}: {', '.join(s_list)}")
