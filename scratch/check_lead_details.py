import imaplib
import email
from email.header import decode_header
from bs4 import BeautifulSoup
import sys, json

sys.stdout.reconfigure(encoding='utf-8')

def decode_str(s):
    if not s: return ""
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

targets = [
    "binnur.alkan@boussolepatrimoine.fr",
    "emmanuellanissi90@gmail.com",
    "commerciale.udd@gmail.com"
]

for t in targets:
    print(f"\n==================== SEARCH FOR {t} ====================")
    status, data = mail.search(None, f'(OR TO "{t}" FROM "{t}")')
    for mid in data[0].split():
        status, d = mail.fetch(mid, "(RFC822)")
        msg = email.message_from_bytes(d[0][1])
        subj = decode_str(msg.get("Subject"))
        sender = decode_str(msg.get("From"))
        to = decode_str(msg.get("To"))
        date = msg.get("Date")
        print(f"\n[MID {mid.decode()}] Date: {date} | From: {sender} | To: {to} | Subj: {subj}")
        
        body = ""
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
            elif part.get_content_type() == "text/html" and not body:
                soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
                body = soup.get_text()
        lines = [l.strip() for l in body.splitlines() if l.strip()]
        for l in lines[:15]:
            print("  ", l)

mail.close()
mail.logout()
