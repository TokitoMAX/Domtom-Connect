import imaplib, email

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, messages = mail.search(None, '(OR FROM "edukaraib.com" FROM "johnfres.45@gmail.com")')
msg_ids = messages[0].split()
print("Found messages:", len(msg_ids))

for mid in msg_ids[-5:]:
    status, data = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(data[0][1])
    print("---")
    print("ID:", mid.decode())
    print("From:", msg.get("From"))
    print("To:", msg.get("To"))
    print("Subject:", msg.get("Subject"))
    print("Date:", msg.get("Date"))
    print("Message-ID:", msg.get("Message-ID"))
    payload = msg.get_payload()
    if isinstance(payload, list):
        body_part = payload[0].get_payload(decode=True)
        if body_part:
            print("Snippet:", body_part.decode("utf-8", errors="ignore")[:400])
    elif isinstance(payload, str):
        print("Snippet:", payload[:400])

mail.close()
mail.logout()
