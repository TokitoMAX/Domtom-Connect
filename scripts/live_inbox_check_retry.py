import imaplib, email, sys, json, os, time
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

for attempt in range(3):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
        mail.select('"[Gmail]/Tous les messages"')
        break
    except Exception as e:
        print(f"Tentative {attempt+1} échouée ({e}), attente 3s...")
        time.sleep(3)

status, data = mail.search(None, 'ALL')
ids = data[0].split()

print(f"Total messages actuels dans la boîte : {len(ids)}")

# Look at the last 20 messages
print("\n=== DERNIERS MESSAGES ENTRÉS DANS LA BOÎTE ===")
for num in ids[-20:]:
    s, d = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    sender = clean_header(msg.get("From"))
    subj = clean_header(msg.get("Subject"))
    mid = msg.get("Message-ID")
    in_reply = msg.get("In-Reply-To")
    date_str = msg.get("Date")

    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

    print(f"\n[ID {num.decode()}] Date: {date_str}")
    print(f"From: {sender}")
    print(f"Subject: {subj}")
    print(f"Message-ID: {mid}")
    print(f"In-Reply-To: {in_reply}")
    print(f"Extrait: {body[:150].strip()}...")

mail.close()
mail.logout()
