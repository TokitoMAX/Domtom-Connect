import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

def get_text_from_msg(msg):
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

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

m_id = msg_ids[-1] # Le plus récent
status, fetch_data = mail.fetch(m_id, '(RFC822)')
raw_email = fetch_data[0][1]
msg = email.message_from_bytes(raw_email)

print("="*60)
print(f"DE : {msg.get('From')}")
print(f"DATE : {msg.get('Date')}")
print(f"SUJET : {msg.get('Subject')}")
print("="*60)
print("CONTENU DU MAIL D'ABSA BOYE (AFRETY) :")
print(get_text_from_msg(msg).strip())
print("="*60)

mail.logout()
