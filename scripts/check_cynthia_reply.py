import imaplib, email, sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

status, data = mail.search(None, '(FROM "commerciale.udd@gmail.com")')
print('Messages from Cynthia:', data[0].split())
for mid in data[0].split():
    st, d = mail.fetch(mid, '(RFC822.HEADER)')
    msg = email.message_from_bytes(d[0][1])
    print('MID:', mid.decode(), '| Date:', msg.get('Date'), '| Subj:', msg.get('Subject'))

mail.close()
mail.logout()
