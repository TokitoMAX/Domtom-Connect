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
mail.select('INBOX')

status, data = mail.search(None, '(FROM "ecolodge.simal@gmail.com")')
print('=== ECOLODGE SIMAL ===')
for mid in data[0].split():
    s, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print('Date:', msg.get('Date'))
    print('Subject:', decode_str(msg.get('Subject')))
    for part in msg.walk():
        if part.get_content_type() == 'text/plain':
            print('Body:\n', part.get_payload(decode=True).decode('utf-8', errors='ignore'))
            break

status, data = mail.search(None, '(FROM "no-reply-googleplay-developer@google.com")')
print('\n=== GOOGLE PLAY SUPPORT ===')
for mid in data[0].split()[-1:]:
    s, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print('Date:', msg.get('Date'))
    print('Subject:', decode_str(msg.get('Subject')))
    found = False
    for part in msg.walk():
        if part.get_content_type() == 'text/plain':
            print('Body:\n', part.get_payload(decode=True).decode('utf-8', errors='ignore')[:1500])
            found = True
            break
    if not found:
        print('Body (HTML preview):', msg.get_payload()[:1000] if isinstance(msg.get_payload(), str) else 'Multipart')

mail.close()
mail.logout()
