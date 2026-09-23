import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

print("Derniers messages reçus :")
for m_id in reversed(msg_ids[-3:]):
    status, fetch_data = mail.fetch(m_id, '(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])')
    raw_header = fetch_data[0][1]
    msg = email.message_from_bytes(raw_header)
    print(f"- De: {msg.get('From')}")
    print(f"  Date: {msg.get('Date')}")
    print(f"  Sujet: {msg.get('Subject')}")

mail.logout()
