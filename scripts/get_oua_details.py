import imaplib, email, sys
from bs4 import BeautifulSoup
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

def decode_mime(header_val):
    if not header_val:
        return ""
    parts = decode_header(header_val)
    res = ""
    for part, enc in parts:
        if isinstance(part, bytes):
            res += part.decode(enc or 'utf-8', errors='ignore')
        else:
            res += str(part)
    return res

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(BODY "oua-concept")')
msg_ids = data[0].split()
print("oua-concept msgs:", len(msg_ids))

for mid in msg_ids:
    status, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    subj = decode_mime(msg.get("Subject", ""))
    date = msg.get("Date", "")
    from_h = decode_mime(msg.get("From", ""))
    to_h = decode_mime(msg.get("To", ""))
    mid_h = msg.get("Message-ID", "")
    print(f"\n--- ID {mid.decode()} ---")
    print("Date:", date)
    print("From:", from_h)
    print("To:", to_h)
    print("Subject:", subj)
    print("Message-ID:", mid_h)
    
    body = ""
    for part in msg.walk():
        ct = part.get_content_type()
        if ct == "text/plain":
            pl = part.get_payload(decode=True)
            if pl:
                body += pl.decode("utf-8", errors="ignore") + "\n"
        elif ct == "text/html":
            pl = part.get_payload(decode=True)
            if pl:
                soup = BeautifulSoup(pl.decode("utf-8", errors="ignore"), "html.parser")
                body += soup.get_text(separator="\n", strip=True) + "\n"
    print("BODY:")
    for line in body.splitlines()[:25]:
        if line.strip():
            print("  ", line.strip())

mail.close()
mail.logout()
