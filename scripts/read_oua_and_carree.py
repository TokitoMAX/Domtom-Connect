import imaplib, email, sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

for mid in [b'3055', b'3030']:
    st, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print(f"\n==================== MSG {mid.decode()} ====================")
    print('From:', msg.get('From'))
    print('Date:', msg.get('Date'))
    print('Subject:', msg.get('Subject'))
    for part in msg.walk():
        if part.get_content_type() == 'text/html':
            payload = part.get_payload(decode=True)
            if payload:
                text = BeautifulSoup(payload.decode('utf-8', errors='ignore'), 'html.parser').get_text(separator='\n', strip=True)
                print('--- HTML BODY ---')
                print(text)
                break
        elif part.get_content_type() == 'text/plain':
            payload = part.get_payload(decode=True)
            if payload:
                print('--- PLAIN TEXT ---')
                print(payload.decode('utf-8', errors='ignore'))
                break

mail.close()
mail.logout()
