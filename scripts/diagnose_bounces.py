import imaplib
import email
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
ids = data[0].split()

results = []

# Inspecter les 35 derniers messages
for num in reversed(ids[-35:]):
    typ, msg_data = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(msg_data[0][1])
    sender = str(msg.get('From', '')).lower()
    subject = str(msg.get('Subject', '')).lower()

    if 'mailer-daemon' in sender or 'delivery status' in subject or 'failure' in subject:
        text = ''
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                text += part.get_payload(decode=True).decode('utf-8', errors='ignore')
        
        target = "Inconnu"
        for line in text.split('\n'):
            if "Votre message n'est pas parvenu" in line or "tried to reach" in line:
                m = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', line)
                if m:
                    target = m.group(0)
                    break

        error_detail = "Inconnue"
        for line in text.split('\n'):
            line_clean = line.strip()
            if any(code in line_clean for code in ["550", "554", "5.1.1", "5.2.1", "No Such User", "blocked", "does not exist", "disabled"]):
                error_detail = line_clean
                break
        
        results.append((target, error_detail))

mail.logout()

print(f"Total rebonds analyses : {len(results)}\n")
for t, e in results:
    print(f"Target: {t}")
    print(f"  Erreur: {e}\n")
