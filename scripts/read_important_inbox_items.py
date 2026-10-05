import imaplib, email, sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

target_mids = [b'3055', b'3052', b'3045', b'3043', b'3036', b'3030', b'3018', b'3016']

for mid in target_mids:
    st, d = mail.fetch(mid, '(RFC822)')
    if st != 'OK': continue
    msg = email.message_from_bytes(d[0][1])
    print(f"\n=======================================================")
    print(f"MSG {mid.decode()} | Date: {msg.get('Date')}")
    print(f"From: {msg.get('From')}")
    print(f"To: {msg.get('To')}")
    print(f"Subject: {msg.get('Subject')}")
    print(f"Message-ID: {msg.get('Message-ID')}")
    print("-------------------- CONTENT --------------------------")
    for part in msg.walk():
        ct = part.get_content_type()
        if ct == 'text/plain':
            text = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            print(text[:1200])
            break
        elif ct == 'text/html':
            html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            print(soup.get_text(separator="\n", strip=True)[:1200])
            break

mail.close()
mail.logout()
