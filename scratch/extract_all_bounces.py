import imaplib
import email
import re
import json

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('inbox')

status, messages = mail.search(None, 'FROM', 'mailer-daemon@googlemail.com')
bounces = {}

if messages[0]:
    msg_ids = messages[0].split()
    print(f"Total Mailer-Daemon messages found: {len(msg_ids)}")
    for mid in msg_ids:
        status, data = mail.fetch(mid, '(RFC822)')
        msg = email.message_from_bytes(data[0][1])
        subj = msg.get('Subject', '')
        date = msg.get('Date', '')
        
        body = ''
        if msg.is_multipart():
            for part in msg.walk():
                payload = part.get_payload(decode=True)
                if payload:
                    body += payload.decode('utf-8', errors='ignore') + '\n'
        else:
            payload = msg.get_payload(decode=True)
            if payload:
                body = payload.decode('utf-8', errors='ignore')
        
        # Look for target in body
        found_target = None
        for line in body.splitlines():
            line_str = line.strip()
            if any(k in line_str.lower() for k in ['final-recipient', 'original-recipient', 'failed to deliver', 'was not delivered to']):
                emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', line_str)
                for em in emails:
                    em_low = em.lower().strip()
                    if em_low not in ['domtomconnect@gmail.com', 'mailer-daemon@googlemail.com']:
                        found_target = em_low
                        break
            if found_target:
                break
                
        if not found_target:
            # Fallback to search in body
            emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', body)
            for em in emails:
                em_low = em.lower().strip()
                if em_low not in ['domtomconnect@gmail.com', 'mailer-daemon@googlemail.com']:
                    found_target = em_low
                    break
                    
        if found_target:
            bounces[found_target] = {
                'subject': subj,
                'date': date
            }

mail.logout()

print(f"\n=== {len(bounces)} EMAILS AVEC ECHEC OU REBOND DETECTES ===")
for em, details in sorted(bounces.items()):
    print(f" - {em} | {details['subject']} ({details['date']})")

with open('scratch/bounced_emails.json', 'w', encoding='utf-8') as f:
    json.dump(bounces, f, indent=2, ensure_ascii=False)
