import imaplib, email, sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')

for mid in [b'4478', b'5085']:
    status, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print(f"\n--- MID {mid.decode()} ---")
    print("From:", msg.get("From"))
    print("To:", msg.get("To"))
    print("Subject:", msg.get("Subject"))
    print("Date:", msg.get("Date"))
    print("Message-ID:", msg.get("Message-ID"))
    print("In-Reply-To:", msg.get("In-Reply-To"))
    print("References:", msg.get("References"))

mail.close()
mail.logout()
