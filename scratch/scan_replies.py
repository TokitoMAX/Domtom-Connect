import imaplib
import email
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

contact_emails = {c['email'].lower().strip(): c for c in db['contacts']}
contact_domains = {d.lower().strip() for d in db['domains']}

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
msg_ids = data[0].split()

print(f"Scanning {len(msg_ids)} messages in INBOX for matches with our contacted leads...")

matches = []
for m_id in reversed(msg_ids[-100:]): # scan last 100
    s, f = mail.fetch(m_id, '(RFC822)')
    if s != 'OK':
        continue
    msg = email.message_from_bytes(f[0][1])
    sender = str(msg.get('From', '')).lower()
    subject = str(msg.get('Subject', ''))
    date = str(msg.get('Date', ''))
    
    # check if sender contains any known domain or email
    matched_contact = None
    for em in contact_emails:
        if em in sender:
            matched_contact = contact_emails[em]
            break
    if not matched_contact:
        for dom in contact_domains:
            if f"@{dom}" in sender:
                matched_contact = {"email": sender, "company": dom}
                break
    
    if matched_contact:
        matches.append({
            "id": m_id.decode(),
            "from": msg.get('From'),
            "subject": subject,
            "date": date,
            "matched": matched_contact
        })

print(f"Trouvé {len(matches)} messages de prospects récents :")
for m in matches:
    print(f"ID: {m['id']} | Date: {m['date']} | From: {m['from']} | Subj: {m['subject']}")
