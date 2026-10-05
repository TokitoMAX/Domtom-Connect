import imaplib, email

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.fetch("4892", "(RFC822.HEADER)")
msg = email.message_from_bytes(data[0][1])
print("Message-ID 4892:", msg.get("Message-ID"))

mail.close()
mail.logout()
