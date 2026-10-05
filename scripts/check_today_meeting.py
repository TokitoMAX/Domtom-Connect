import imaplib
import email
import sys
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

status, data = mail.search(None, "ALL")
msg_ids = data[0].split()
print("Total messages:", len(msg_ids))

# Scan last 40 messages
for mid in msg_ids[-40:]:
    status, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    subj = decode_mime(msg.get("Subject", ""))
    date = msg.get("Date", "")
    from_h = decode_mime(msg.get("From", ""))
    to_h = decode_mime(msg.get("To", ""))
    print(f"ID: {mid.decode()} | Date: {date} | From: {from_h} | Subj: {subj}")
    
    # Check if Calendly or Google Calendar or contains meet/rendez-vous
    body_text = ""
    meet_links = []
    for part in msg.walk():
        ct = part.get_content_type()
        if ct == "text/plain":
            payload = part.get_payload(decode=True)
            if payload:
                body_text += payload.decode("utf-8", errors="ignore")
        elif ct == "text/html":
            payload = part.get_payload(decode=True)
            if payload:
                html_str = payload.decode("utf-8", errors="ignore")
                soup = BeautifulSoup(html_str, "html.parser")
                for a in soup.find_all("a"):
                    href = a.get("href", "")
                    if "meet.google.com" in href or "calendly.com" in href:
                        meet_links.append(href)
    
    if any(k in subj.lower() for k in ["calendly", "invitation", "rendez-vous", "google meet", "entretien", "visio", "rappel", "notification", "event"]):
        print(f"   -> POTENTIAL MEETING:")
        print(f"   Body snippet: {body_text[:400].strip()}")
        print(f"   Meet links: {meet_links}")

mail.close()
mail.logout()
