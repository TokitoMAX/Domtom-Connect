import imaplib, email, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

def decode_str(s):
    if not s: return ""
    decoded = decode_header(s)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or "utf-8", errors="ignore"))
        else:
            res.append(str(text))
    return " ".join(res)

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')
status, data = mail.search(None, '(FROM "domtomconnect@gmail.com")')
latest_ids = data[0].split()[-3:]
for mid in latest_ids:
    status, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print('SENT:', mid.decode(), '| Date:', msg['Date'], '| To:', decode_str(msg['To']), '| Subj:', decode_str(msg['Subject']))
mail.close()
mail.logout()
