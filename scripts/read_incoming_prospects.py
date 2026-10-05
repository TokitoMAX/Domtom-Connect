import imaplib, email, sys
sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

target_ids = ["4892", "4883", "4886", "4887", "4888", "4891", "4879"]

for mid in target_ids:
    status, data = mail.fetch(mid, "(RFC822)")
    if data and data[0]:
        msg = email.message_from_bytes(data[0][1])
        print("="*60)
        print(f"MESSAGE ID: {mid}")
        print("FROM:", msg.get("From"))
        print("DATE:", msg.get("Date"))
        print("SUBJECT:", msg.get("Subject"))
        print("MESSAGE-ID HEADER:", msg.get("Message-ID"))
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                p = part.get_payload(decode=True)
                if p:
                    print("--- BODY ---")
                    print(p.decode("utf-8", errors="ignore"))

mail.close()
mail.logout()
