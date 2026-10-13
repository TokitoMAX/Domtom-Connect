import imaplib, email, sys

sys.stdout.reconfigure(encoding='utf-8')

m = imaplib.IMAP4_SSL('imap.gmail.com')
m.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
m.select('"[Gmail]/Tous les messages"')

status, data = m.search(None, '(OR FROM "kouggan@gmail.com" TO "kouggan@gmail.com")')
ids = data[0].split()
print(f"Total messages trouvés pour Kouggan: {len(ids)}")

for mid in ids:
    res, d = m.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print('==============================')
    print('ID:', mid.decode(), '| Date:', msg.get('Date'))
    print('From:', msg.get('From'))
    print('To:', msg.get('To'))
    print('Subject:', msg.get('Subject'))
    body = ''
    if msg.is_multipart():
        for p in msg.walk():
            if p.get_content_type() == 'text/plain':
                body = p.get_payload(decode=True).decode('utf-8', errors='ignore')
                break
    else:
        body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
    print('Snippet:', body[:300].strip())

m.logout()
