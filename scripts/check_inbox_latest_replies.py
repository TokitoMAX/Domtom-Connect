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

status, data = mail.search(None, 'ALL')
ids = data[0].split()

print(f"Total messages dans la boîte: {len(ids)}")
for num in ids[-8:]:
    s, d = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    sender = clean_header(msg.get("From"))
    subj = clean_header(msg.get("Subject"))
    date = msg.get("Date")
    print(f"[{num.decode()}] {date} | De: {sender} | Sujet: {subj}")
    subj = clean_header(msg.get("Subject"))
    mid = msg.get("Message-ID")
    date = msg.get("Date")
    in_reply = msg.get("In-Reply-To")
    
    # Extract text plain body
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

    print(f"\n{'='*60}")
    print(f"ID: {num.decode()} | Date: {date}")
    print(f"From: {sender}")
    print(f"Subject: {subj}")
    print(f"Message-ID: {mid}")
    print(f"In-Reply-To: {in_reply}")
    print(f"Body snippet:\n{body[:350]}...")

mail.close()
mail.logout()
