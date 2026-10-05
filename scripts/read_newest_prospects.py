import imaplib
import email
from email.header import decode_header
import sys

sys.stdout.reconfigure(encoding='utf-8')

def decode_mime(h):
    if not h: return ''
    parts = decode_header(h)
    res = ''
    for p, e in parts:
        if isinstance(p, bytes):
            res += p.decode(e or 'utf-8', errors='ignore')
        else:
            res += str(p)
    return res

def get_body(msg):
    text = ''
    if msg.is_multipart():
        for part in msg.walk():
            ct = part.get_content_type()
            cd = str(part.get('Content-Disposition'))
            if ct == 'text/plain' and 'attachment' not in cd:
                p = part.get_payload(decode=True)
                if p: text += p.decode('utf-8', errors='ignore')
            elif ct == 'text/html' and not text and 'attachment' not in cd:
                p = part.get_payload(decode=True)
                if p: text += p.decode('utf-8', errors='ignore')
    else:
        p = msg.get_payload(decode=True)
        if p: text = p.decode('utf-8', errors='ignore')
    return text

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

for mid in ['2884', '2885', '2886', '2887']:
    res, data = mail.fetch(mid, '(BODY.PEEK[])')
    msg = email.message_from_bytes(data[0][1])
    print('='*70)
    print(f"ID {mid} | Date: {msg.get('Date')}")
    print(f"De: {decode_mime(msg.get('From'))}")
    print(f"Sujet: {decode_mime(msg.get('Subject'))}")
    print('-'*50)
    body = get_body(msg)
    print(body.strip()[:2000])

mail.logout()
