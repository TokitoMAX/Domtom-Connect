import imaplib, email, sys
sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.fetch("4881", "(RFC822)")
if data and data[0]:
    msg = email.message_from_bytes(data[0][1])
    print("From:", msg.get("From"))
    print("Subject:", msg.get("Subject"))
    print("Date:", msg.get("Date"))
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            p = part.get_payload(decode=True)
            if p:
                print("Body:", p.decode("utf-8", errors="ignore"))

mail.close()
mail.logout()
