import imaplib, email, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

def decode_str(s):
    if not s:
        return ""
    decoded = decode_header(s)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or 'utf-8', errors='ignore'))
        else:
            res.append(str(text))
    return "".join(res)

def get_body(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if ctype == 'text/plain' and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode('utf-8', errors='ignore')
            elif ctype == 'text/html' and 'attachment' not in cdispo and not body:
                payload = part.get_payload(decode=True)
                if payload:
                    body = payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode('utf-8', errors='ignore')
    return body

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

# Check newest 12 messages
status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

print("=== DÉTAIL DES DERNIERS MESSAGES REÇUS ===")
for m_id in reversed(msg_ids[-12:]):
    status, fetch_data = mail.fetch(m_id, '(RFC822)')
    raw_email = fetch_data[0][1]
    msg = email.message_from_bytes(raw_email)
    
    sender = decode_str(msg.get("From", ""))
    subject = decode_str(msg.get("Subject", ""))
    date = msg.get("Date", "")
    body = get_body(msg)
    
    print("\n" + "="*70)
    print(f"ID : {m_id.decode()} | DE : {sender}")
    print(f"DATE : {date}")
    print(f"SUJET : {subject}")
    print("-" * 70)
    # Print first 500 chars of body
    clean_lines = [l for l in body.splitlines() if l.strip() and not l.strip().startswith("<")][:15]
    print("\n".join(clean_lines[:10]))

mail.logout()
