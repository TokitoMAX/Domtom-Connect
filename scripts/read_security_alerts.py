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
            res.append(text)
    return " ".join(res)

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

for num in ["5021", "5026", "5027"]:
    s, d = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    subj = clean_header(msg.get("Subject"))
    sender = clean_header(msg.get("From"))
    date = msg.get("Date")
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")
    print(f"\n=== MSG {num} ===")
    print("From:", sender)
    print("Subject:", subj)
    print("Date:", date)
    print("Body:\n", body[:400])

mail.close()
mail.logout()
