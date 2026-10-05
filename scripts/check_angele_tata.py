import imaplib, email, sys

sys.stdout.reconfigure(encoding="utf-8")

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

s, d = mail.fetch("4881", '(RFC822)')
msg = email.message_from_bytes(d[0][1])

print("=== MESSAGE ANGÈLE TATA (4881) ===")
print("From:", msg.get("From"))
print("Subject:", msg.get("Subject"))
print("Date:", msg.get("Date"))
print("Message-ID:", msg.get("Message-ID"))

body = ""
if msg.is_multipart():
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
            break
        elif part.get_content_type() == "text/html" and not body:
            body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
else:
    body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

print("\n--- CORPS DU MESSAGE ---")
print(body)
print("------------------------")

# Also check if we replied to Angèle
status, data = mail.search(None, '(TO "a.tata@terrae-patrimoine.fr")')
print("Réponses envoyées à Angèle:", data[0].split())

mail.close()
mail.logout()
