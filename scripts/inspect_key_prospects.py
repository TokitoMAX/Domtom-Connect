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

def get_body(msg):
    text = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if ctype == 'text/plain' and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
            elif ctype == 'text/html' and not text and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            text = payload.decode('utf-8', errors='ignore')
    return text.strip()

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

for mid in [b'3154', b'3155', b'3174']:
    s, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print(f"=== MESSAGE {mid.decode()} ===")
    print("From:", decode_str(msg.get('From')))
    print("To:", decode_str(msg.get('To')))
    print("Date:", msg.get('Date'))
    print("Subject:", decode_str(msg.get('Subject')))
    print("Message-ID:", msg.get('Message-ID'))
    print("In-Reply-To:", msg.get('In-Reply-To'))
    print("References:", msg.get('References'))
    print("--- BODY ---")
    print(get_body(msg))
    print("\n" + "="*60 + "\n")

mail.logout()
