import imaplib, email, sys
sys.stdout.reconfigure(encoding='utf-8')
from email.header import decode_header

def clean_header(val):
    if not val: return ""
    decoded = decode_header(val)
    parts = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            parts.append(text.decode(enc or 'utf-8', errors='ignore'))
        else:
            parts.append(str(text))
    return " ".join(parts)

m = imaplib.IMAP4_SSL('imap.gmail.com')
m.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
m.select('INBOX')

_, ms = m.search(None, '(HEADER From "aquereburu")')
print("Found in INBOX:", ms[0].split())
_, data = m.fetch(b'3017', '(RFC822)')
msg = email.message_from_bytes(data[0][1])
print("Subject:", clean_header(msg.get("Subject")))
print("Date:", msg.get("Date"))
print("From:", clean_header(msg.get("From")))
for part in msg.walk():
    if part.get_content_type() == 'text/plain':
        print("\n--- CONTENT PLAIN ---")
        print(part.get_payload(decode=True).decode('utf-8', errors='ignore'))


m.logout()
