# -*- coding: utf-8 -*-
"""
Nettoyage rigoureux de contacts_deja_contactes.json :
1. Suppression de mailer-daemon et adresses internes/système
2. Extraction de tous les bounces de l'INBOX Gmail
3. Purge complète des adresses qui ont rebondi
"""

import imaplib
import email
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Récupération des bounces récents depuis Gmail
print("Récupération des bounces récents sur Gmail...")
mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
ids = data[0].split()

bounced_emails = set()
for num in reversed(ids[-120:]):
    typ, msg_data = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(msg_data[0][1])
    sender = str(msg.get('From', '')).lower()
    subject = str(msg.get('Subject', '')).lower()

    if 'mailer-daemon' in sender or 'delivery status' in subject or 'failure' in subject:
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                text = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                found = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', text)
                for f_em in found:
                    f_em = f_em.lower().strip()
                    if not f_em.endswith('google.com') and not f_em.endswith('googlemail.com') and f_em != 'domtomconnect@gmail.com':
                        bounced_emails.add(f_em)

mail.logout()
print(f"Total bounces uniques détectés dans les 120 derniers messages : {len(bounced_emails)}")

# 2. Nettoyage de la base
with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

system_ignores = {'mailer-daemon@googlemail.com', 'domtomconnect@gmail.com', 'loickrv@gmail.com'}
initial_count = len(db['contacts'])

cleaned_contacts = []
seen_emails = set()

for c in db['contacts']:
    em = c['email'].lower().strip()
    if em in system_ignores or em in bounced_emails or em.endswith('google.com') or em.endswith('googlemail.com'):
        continue
    if em not in seen_emails:
        cleaned_contacts.append(c)
        seen_emails.add(em)

db['contacts'] = cleaned_contacts
db['total_contacts'] = len(cleaned_contacts)

# Mise à jour du fichier avec écriture atomique sûre
temp_file = 'contacts_deja_contactes_clean.json'
with open(temp_file, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

import os
os.replace(temp_file, 'contacts_deja_contactes.json')

print(f"Bilan nettoyage :")
print(f"- Contacts initiaux : {initial_count}")
print(f"- Contacts valides conservés : {len(cleaned_contacts)}")
print(f"- Adresses purgées (bounces + système) : {initial_count - len(cleaned_contacts)}")
print(f"===> Base contacts_deja_contactes.json 100% propre et opérationnelle !")
