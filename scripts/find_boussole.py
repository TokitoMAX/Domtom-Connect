import imaplib, email, sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')
status, data = mail.search(None, '(BODY "boussolepatrimoine")')
print('IDs:', data[0].split())
for mid in data[0].split():
    status, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print('MID:', mid.decode(), '| From:', msg['From'], '| To:', msg['To'], '| Subj:', msg['Subject'])
mail.close()
mail.logout()
