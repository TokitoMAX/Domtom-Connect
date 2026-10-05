import imaplib, email, re, requests

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'esbmvnvpvxdqphci')
mail.select('inbox')
res, data = mail.fetch('2770', '(RFC822)')
raw = data[0][1]
msg = email.message_from_bytes(raw)
html_content = ""
for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html_content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
mail.logout()

links = re.findall(r'href=["\'](https?://[^"\']+)["\']', html_content)
for l in set(links):
    if 'mailinblack' in l:
        print("FOUND LINK:", l)
