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

# Search across all messages
mail.select('"[Gmail]/Tous les messages"')

for target in ['ckconsultingfwi@gmail.com', 'info@easyivoire.com', 'ecolodge.simal@gmail.com']:
    status, data = mail.search(None, f'(TO "{target}")')
    ids = data[0].split()
    print(f'=== SENT TO {target}: {len(ids)} message(s) ===')
    for mid in ids:
        s, d = mail.fetch(mid, '(RFC822)')
        msg = email.message_from_bytes(d[0][1])
        print('  Date:', msg.get('Date'))
        print('  Subject:', decode_str(msg.get('Subject')))
        print('  Message-ID:', msg.get('Message-ID'))

mail.close()
mail.logout()
