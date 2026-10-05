import imaplib
import email
import sys

sys.stdout.reconfigure(encoding="utf-8")

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

for mid in ["4887", "4888", "4889"]:
    s, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    print(f"=== MSG {mid} ===")
    print("From:", msg.get("From"))
    print("Subject:", msg.get("Subject"))
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")
    print("Body:\n", body)
    print("-" * 50)

mail.close()
mail.logout()
