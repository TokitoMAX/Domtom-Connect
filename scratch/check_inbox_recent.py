import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')
mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
msg_ids = data[0].split()
print("Derniers 10 messages dans INBOX :")
for m_id in reversed(msg_ids[-10:]):
    status, f = mail.fetch(m_id, '(RFC822)')
    if status == 'OK':
        msg = email.message_from_bytes(f[0][1])
        print(f"ID: {m_id.decode()} | From: {msg.get('From')} | Subject: {msg.get('Subject')} | Date: {msg.get('Date')}")
