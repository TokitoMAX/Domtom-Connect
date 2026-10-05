import imaplib
import email

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

m_id = msg_ids[-1]
status, fetch_data = mail.fetch(m_id, '(RFC822)')
raw = fetch_data[0][1]
msg = email.message_from_bytes(raw)

print("Date:", msg.get("Date"))
print("Subject:", msg.get("Subject"))
for part in msg.walk():
    if part.get_content_type() == "text/plain":
        body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
        for line in body.split("\n"):
            if "550" in line or "parvenu" in line or "@" in line:
                print(" >", line.strip()[:100])

mail.logout()
