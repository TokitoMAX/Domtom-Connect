import imaplib, email, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

def decode_str(s):
    if not s: return ''
    decoded = decode_header(s)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes): res.append(text.decode(enc or 'utf-8', errors='ignore'))
        else: res.append(str(text))
    return ''.join(res)

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(OR FROM "ckconsulting" TO "ckconsulting")')
ids = data[0].split()
print("Matches for ckconsulting:", len(ids))
for mid in ids:
    s, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print("---")
    print("ID:", mid.decode())
    print("Date:", msg.get('Date'))
    print("From:", decode_str(msg.get('From')))
    print("To:", decode_str(msg.get('To')))
    print("Subject:", decode_str(msg.get('Subject')))
    print("Message-ID:", msg.get('Message-ID'))

mail.close()
mail.logout()
