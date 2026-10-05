import imaplib, email

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(FROM "location.carree@gmail.com")')
print("Msg IDs:", data[0].split())
if data[0].split():
    msg_id = data[0].split()[-1]
    status, d = mail.fetch(msg_id, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    print("Subject:", msg["Subject"])
    print("Date:", msg["Date"])
    print("Message-ID:", msg["Message-ID"])
    print("--- BODY ---")
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            print(part.get_payload(decode=True).decode("utf-8", errors="ignore"))

mail.close()
mail.logout()
