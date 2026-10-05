import imaplib
import email
import sys
from bs4 import BeautifulSoup
from email.header import decode_header
import datetime

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

print("=== 1. SEARCHING CALENDLY ===")
status, data = mail.search(None, '(FROM "calendly")')
msg_ids = data[0].split()
print(f"Calendly msgs: {len(msg_ids)}")
for mid in msg_ids[-10:]:
    status, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    subj = decode_mime(msg.get("Subject", ""))
    date = msg.get("Date", "")
    print(f"ID {mid.decode()} | Date: {date} | Subj: {subj}")
    # print snippet
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            pl = part.get_payload(decode=True)
            if pl:
                txt = pl.decode("utf-8", errors="ignore")
                for line in txt.splitlines()[:15]:
                    if line.strip():
                        print("  ", line.strip())
                break

print("\n=== 2. SEARCHING GOOGLE CALENDAR ===")
status, data = mail.search(None, '(FROM "calendar-notification@google.com")')
msg_ids = data[0].split()
print(f"Google Calendar msgs: {len(msg_ids)}")
for mid in msg_ids[-10:]:
    status, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    subj = decode_mime(msg.get("Subject", ""))
    date = msg.get("Date", "")
    print(f"ID {mid.decode()} | Date: {date} | Subj: {subj}")
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            pl = part.get_payload(decode=True)
            if pl:
                txt = pl.decode("utf-8", errors="ignore")
                for line in txt.splitlines()[:15]:
                    if line.strip():
                        print("  ", line.strip())
                break

print("\n=== 3. SEARCHING MEET.GOOGLE.COM IN RECENT EMAILS ===")
status, data = mail.search(None, '(BODY "meet.google.com")')
msg_ids = data[0].split()
print(f"meet.google.com msgs: {len(msg_ids)}")
for mid in msg_ids[-10:]:
    status, d = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    subj = decode_mime(msg.get("Subject", ""))
    date = msg.get("Date", "")
    from_h = decode_mime(msg.get("From", ""))
    to_h = decode_mime(msg.get("To", ""))
    print(f"ID {mid.decode()} | Date: {date} | From: {from_h} | Subj: {subj}")
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            pl = part.get_payload(decode=True)
            if pl:
                txt = pl.decode("utf-8", errors="ignore")
                lines = [l.strip() for l in txt.splitlines() if "meet.google.com" in l or "14:" in l or "octobre" in l.lower() or "5 oct" in l.lower()]
                for l in lines:
                    print("   ->", l)
                break

mail.close()
mail.logout()
