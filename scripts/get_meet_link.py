import imaplib, email, sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')

status, d = mail.fetch(b'5140', "(RFC822)")
msg = email.message_from_bytes(d[0][1])

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        soup = BeautifulSoup(part.get_payload(decode=True).decode('utf-8', errors='ignore'), 'html.parser')
        for a in soup.find_all('a'):
            href = a.get('href', '')
            text = a.get_text(strip=True)
            if 'meet.google.com' in href or 'calendly.com' in href or 'Join' in text:
                print(f"Text: '{text}' -> Link: {href}")

mail.close()
mail.logout()
