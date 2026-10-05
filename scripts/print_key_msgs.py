import imaplib, email, sys
sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

for mid in ["4892", "4883", "4886"]:
    status, data = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(data[0][1])
    print("="*60)
    print(f"MESSAGE ID: {mid} | FROM: {msg.get('From')} | SUBJECT: {msg.get('Subject')}")
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            p = part.get_payload(decode=True)
            if p:
                print(p.decode("utf-8", errors="ignore"))

mail.close()
mail.logout()
