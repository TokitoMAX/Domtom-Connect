import imaplib
import email

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

status, search_data = mail.search(None, '(FROM "afrety")')
msg_ids = search_data[0].split()

if msg_ids:
    m_id = msg_ids[-1]
    status, fetch_data = mail.fetch(m_id, '(RFC822)')
    msg = email.message_from_bytes(fetch_data[0][1])
    print(f"Message-ID: {msg.get('Message-ID')}")
    print(f"Subject: {msg.get('Subject')}")
    print(f"From: {msg.get('From')}")
    print(f"Reply-To: {msg.get('Reply-To')}")

mail.logout()
