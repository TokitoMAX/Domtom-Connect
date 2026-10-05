import imaplib
import email
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
ids = data[0].split()

bounced_emails = set()

# Inspecter les 100 derniers emails reçus
for num in reversed(ids[-100:]):
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

print(f"Total bounced emails détectés : {len(bounced_emails)}")
for b in sorted(bounced_emails):
    print(f"  - {b}")

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

initial_count = len(db['contacts'])
db['contacts'] = [c for c in db['contacts'] if c['email'].lower().strip() not in bounced_emails]
final_count = len(db['contacts'])

with open('contacts_deja_contactes.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"\nNettoyage terminé : {initial_count - final_count} adresses introuvables purgées de la base.")
