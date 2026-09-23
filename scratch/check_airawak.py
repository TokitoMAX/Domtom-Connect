import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')
mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
msg_ids = data[0].split()

print(f"Total messages in INBOX: {len(msg_ids)}")

def get_text(msg):
    text = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if ctype == 'text/plain' and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
            elif ctype == 'text/html' and not text and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            text = payload.decode('utf-8', errors='ignore')
    return text

print("\n--- RECHERCHE AIRAWAK DANS INBOX ---")
for m_id in reversed(msg_ids[-30:]):
    status, f = mail.fetch(m_id, '(RFC822)')
    if status != 'OK':
        continue
    msg = email.message_from_bytes(f[0][1])
    sender = str(msg.get('From', ''))
    subject = str(msg.get('Subject', ''))
    if 'airawak' in sender.lower() or 'airawak' in subject.lower():
        print("MATCH TROUVÉ:")
        print(f"ID: {m_id}")
        print(f"From: {sender}")
        print(f"Subject: {subject}")
        print(f"Date: {msg.get('Date')}")
        print("Message ID:", msg.get('Message-ID'))
        print("Body snippet:")
        print(get_text(msg)[:500])
        print("="*50)

# Check Sent folder
mail.select('"[Gmail]/Messages envoyés"')
status, data = mail.search(None, 'ALL')
sent_ids = data[0].split()
print(f"\nTotal messages in Sent: {len(sent_ids)}")
print("\n--- DERNIERS ENVOIS SENT (10) ---")
for m_id in reversed(sent_ids[-10:]):
    status, f = mail.fetch(m_id, '(RFC822)')
    if status != 'OK':
        continue
    msg = email.message_from_bytes(f[0][1])
    to_hdr = str(msg.get('To', ''))
    subject = str(msg.get('Subject', ''))
    print(f"To: {to_hdr} | Subject: {subject} | Date: {msg.get('Date')}")
