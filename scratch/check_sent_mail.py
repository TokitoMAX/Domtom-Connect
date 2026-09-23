import imaplib
import email

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('"[Gmail]/Messages envoy&AOk-s"')

status, messages = mail.search(None, 'ALL')
if not messages[0]:
    mail.select('"[Gmail]/Sent Mail"')
    status, messages = mail.search(None, 'ALL')

msg_ids = messages[0].split()
latest_ids = msg_ids[-35:]

print(f"Total sent in mailbox: {len(msg_ids)}")
print("--- DERNIERS ENVOIS GMAIL ---")
for mid in reversed(latest_ids):
    _, data = mail.fetch(mid, '(RFC822.HEADER)')
    msg = email.message_from_bytes(data[0][1])
    to = msg.get('To', '')
    subj = msg.get('Subject', '')
    date = msg.get('Date', '')
    print(f"To: {to} | Subj: {subj[:45]} | Date: {date}")

mail.logout()
