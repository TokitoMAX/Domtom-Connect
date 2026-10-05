import imaplib
import email
from email.header import decode_header
from bs4 import BeautifulSoup
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def decode_str(s):
    if not s:
        return ""
    decoded = decode_header(s)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or "utf-8", errors="ignore"))
        else:
            res.append(str(text))
    return " ".join(res)

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(FROM "calendly" SUBJECT "New Event")')
msg_ids = data[0].split()
print("Found Calendly 'New Event' message IDs:", len(msg_ids))

for mid in msg_ids[-15:]:
    status, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    sender = decode_str(msg.get("From"))
    subj = decode_str(msg.get("Subject"))
    date = msg.get("Date")
    print(f"\n================ MID {mid.decode()} ================")
    print("Subject:", subj)
    print("Email Date:", date)
    
    plain_text = ""
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            plain_text = part.get_payload(decode=True).decode("utf-8", errors="ignore")
            break
        elif part.get_content_type() == "text/html" and not plain_text:
            soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
            plain_text = soup.get_text()
            
    lines = [l.strip() for l in plain_text.splitlines() if l.strip()]
    for l in lines[:25]:
        print("  ", l)

mail.close()
mail.logout()
