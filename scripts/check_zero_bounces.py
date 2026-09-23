import imaplib
import email
import sys
from datetime import datetime

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

# Regarder les 3 derniers messages reçus
status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

print("Derniers messages en boîte :")
for m_id in reversed(msg_ids[-3:]):
    status, fetch_data = mail.fetch(m_id, '(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])')
    raw = fetch_data[0][1]
    msg = email.message_from_bytes(raw)
    print(f"- De: {msg.get('From')} | Date: {msg.get('Date')} | Sujet: {msg.get('Subject')}")

mail.logout()
