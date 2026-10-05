import imaplib, email, os

IMAP_SERVER = "imap.gmail.com"
USER = "domtomconnect@gmail.com"
PASSWORD = "geqpuqluimxdjxeo"

mail = imaplib.IMAP4_SSL(IMAP_SERVER)
mail.login(USER, PASSWORD)
status, _ = mail.select('"[Gmail]/Tous les messages"')
if status != "OK":
    status, _ = mail.select("INBOX")

status, messages = mail.search(None, '(OR FROM "ranking.re@gmail.com" TO "ranking.re@gmail.com")')
msg_ids = messages[0].split()
print("Found messages:", len(msg_ids))

for mid in msg_ids[-5:]:
    status, data = mail.fetch(mid, '(RFC822.HEADER)')
    raw_header = data[0][1]
    msg = email.message_from_bytes(raw_header)
    print("---")
    print("ID:", mid.decode())
    print("From:", msg.get("From"))
    print("To:", msg.get("To"))
    print("Subject:", msg.get("Subject"))
    print("Date:", msg.get("Date"))
    print("Message-ID:", msg.get("Message-ID"))

mail.close()
mail.logout()
