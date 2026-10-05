import imaplib, email, sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(OR FROM "binnur" TO "binnur")')
msg_ids = data[0].split()
print(f"Found {len(msg_ids)} messages for Binnur.")

for m_id in msg_ids:
    status, d = mail.fetch(m_id, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    print(f"\n--- MSG ID {m_id.decode()} ---")
    print("From:", msg["From"])
    print("To:", msg["To"])
    print("Subject:", msg["Subject"])
    print("Date:", msg["Date"])
    print("Message-ID:", msg["Message-ID"])
    print("In-Reply-To:", msg.get("In-Reply-To"))
    print("References:", msg.get("References"))

mail.close()
mail.logout()
