import imaplib, email, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding="utf-8")

def clean_header(val):
    if not val:
        return ""
    decoded = decode_header(val)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or "utf-8", errors="ignore"))
        else:
            res.append(str(text))
    return " ".join(res)

def get_body(msg):
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
    return text.strip()

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select("INBOX")

s, data = mail.fetch(b"3168", '(BODY.PEEK[])')
msg = email.message_from_bytes(data[0][1])

print("=== GOOGLE PLAY ALERT (ID 3168) ===")
print("From:", clean_header(msg.get("From")))
print("Subject:", clean_header(msg.get("Subject")))
print("Date:", msg.get("Date"))
print("Body:\n")
lines = [l.strip() for l in get_body(msg).splitlines() if l.strip()]
for l in lines[:50]:
    print(l)

mail.logout()
