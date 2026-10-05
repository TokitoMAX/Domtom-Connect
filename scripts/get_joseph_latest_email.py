import imaplib, email, sys
sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, messages = mail.search(None, '(OR FROM "edukaraib.com" FROM "johnfres.45@gmail.com")')
msg_ids = messages[0].split()
print("Total Joseph msg ids:", len(msg_ids))

# Print the last 3 messages from Joseph in detail
for mid in msg_ids[-3:]:
    status, data = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(data[0][1])
    print("="*50)
    print(f"ID: {mid.decode()}")
    print("Date:", msg.get("Date"))
    print("From:", msg.get("From"))
    print("To:", msg.get("To"))
    print("Subject:", msg.get("Subject"))
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            p = part.get_payload(decode=True)
            if p:
                print("--- BODY ---")
                print(p.decode("utf-8", errors="ignore"))

mail.close()
mail.logout()
