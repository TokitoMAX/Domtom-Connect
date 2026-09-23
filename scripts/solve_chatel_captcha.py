import imaplib
import email
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('inbox')
status, messages = mail.search(None, 'FROM', 'sarl_j_chatel@invitations.mailinblack.com')
if messages[0]:
    latest = messages[0].split()[-1]
    _, data = mail.fetch(latest, '(RFC822)')
    msg = email.message_from_bytes(data[0][1])
    html = ''
    for part in msg.walk():
        if part.get_content_type() == 'text/html':
            html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
    links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', html)
    for l in set(links):
        if 'mailinblack.com' in l and 'invitation' in l.lower():
            print('LINK FOUND:', l)
mail.logout()
