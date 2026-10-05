import imaplib, email, sys, re
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

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

# Search for Calendly messages or Google Calendar notifications
status, data = mail.search(None, '(OR FROM "calendly" FROM "calendar-notification@google.com")')
print("Total matching messages:", len(data[0].split()))

for msg_id in data[0].split():
    status, d = mail.fetch(msg_id, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    subj = decode_mime(msg.get("Subject", ""))
    date = msg.get("Date", "")
    from_h = decode_mime(msg.get("From", ""))
    
    # We are interested in actual bookings or events
    if not any(k in subj.lower() for k in ["new event", "nouveau", "rendez-vous", "invitation", "accepté", "annulé", "reprogrammé", "meeting", "entretien", "binnur", "nissi", "pierre", "alkan", "jordan", "obadia"]):
        continue

    print(f"\n================ EVENT ID {msg_id.decode()} ================")
    print("From:", from_h)
    print("Subject:", subj)
    print("Date:", date)
    
    full_text = ""
    for part in msg.walk():
        ctype = part.get_content_type()
        if ctype == "text/plain":
            full_text += part.get_payload(decode=True).decode("utf-8", errors="ignore") + "\n"
        elif ctype == "text/html":
            soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
            full_text += soup.get_text(separator=" ", strip=True) + "\n"
            
    # Print relevant parts like phone, email, notes, questions
    lines = [line.strip() for line in full_text.splitlines() if line.strip()]
    for line in lines[:35]:
        print("  ", line)

mail.close()
mail.logout()
