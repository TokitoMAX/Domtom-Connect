import imaplib, email

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")

# List mailboxes to get exact name of Sent
status, boxes = mail.list()
sent_box = None
for b in boxes:
    decoded = b.decode()
    if "Sent" in decoded or "Messages" in decoded or "Envoy" in decoded:
        # extract name in quotes
        parts = decoded.split(' "/" ')
        if len(parts) > 1:
            sent_box = parts[1].strip()

print("Sent mailbox detected:", sent_box)
if sent_box:
    mail.select(sent_box)
else:
    mail.select('"[Gmail]/Tous les messages"')

status, messages = mail.search(None, 'TO', '"ranking.re@gmail.com"')
msg_ids = messages[0].split()
print("Total messages to ranking.re@gmail.com:", len(msg_ids))

if msg_ids:
    last_id = msg_ids[-1]
    status, data = mail.fetch(last_id, "(RFC822)")
    msg = email.message_from_bytes(data[0][1])
    print("--- PREUVE D'ENVOI GMAIL ---")
    print("Subject:", msg.get("Subject"))
    print("Date:", msg.get("Date"))
    print("From:", msg.get("From"))
    print("To:", msg.get("To"))
    print("Cc:", msg.get("Cc"))
    print("Message-ID:", msg.get("Message-ID"))
    print("In-Reply-To:", msg.get("In-Reply-To"))
    print("References:", msg.get("References"))
    print("--- CORPS ENVOYÉ ---")
    payload = msg.get_payload(decode=True)
    if payload:
        print(payload.decode("utf-8", errors="ignore"))
    else:
        print(msg.get_payload())

mail.close()
mail.logout()
