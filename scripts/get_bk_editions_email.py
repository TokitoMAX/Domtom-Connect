import imaplib, email, sys, re
from email.header import decode_header
from bs4 import BeautifulSoup

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

status, data = mail.search(None, '(FROM "bkeditions")')
for mid in data[0].split():
    res, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    print(f"\n=== BK EDITIONS EMAIL ID {mid.decode()} ===")
    print("From:", decode_mime(msg.get("From", "")))
    print("To:", decode_mime(msg.get("To", "")))
    print("Subject:", decode_mime(msg.get("Subject", "")))
    print("Date:", msg.get("Date", ""))
    print("Message-ID:", msg.get("Message-ID", ""))
    print("In-Reply-To:", msg.get("In-Reply-To", ""))
    print("References:", msg.get("References", ""))
    
    text = ""
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            text += part.get_payload(decode=True).decode("utf-8", errors="ignore")
        elif part.get_content_type() == "text/html" and not text:
            soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
            text += soup.get_text(separator=" ", strip=True)
            
    print("\n--- BODY ---")
    print(text)

mail.logout()
