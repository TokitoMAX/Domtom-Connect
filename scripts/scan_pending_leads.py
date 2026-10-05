import imaplib
import email
from email.header import decode_header

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

print(f"Total messages: {len(ids)}")
# Let's inspect the last 20 messages
for num in ids[-20:]:
    s, d = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    sender = clean_header(msg.get("From"))
    subj = clean_header(msg.get("Subject"))
    mid = msg.get("Message-ID")
    in_reply = msg.get("In-Reply-To")
    date = msg.get("Date")
    print(f"--- ID {num.decode()} ---")
    print(f"From: {sender}")
    print(f"Subject: {subj}")
    print(f"Date: {date}")
    print(f"Message-ID: {mid}")
    print(f"In-Reply-To: {in_reply}")

mail.close()
mail.logout()
