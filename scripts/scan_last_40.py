import imaplib
import email
from email.header import decode_header
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

def decode_mime(header_val):
    if not header_val:
        return ""
    decoded_parts = decode_header(header_val)
    res = ""
    for part, enc in decoded_parts:
        if isinstance(part, bytes):
            res += part.decode(enc or 'utf-8', errors='ignore')
        else:
            res += str(part)
    return res

def get_body(msg):
    text = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if ctype == 'text/plain' and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
            elif ctype == 'text/html' and not text and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            text = payload.decode('utf-8', errors='ignore')
    return text

def main():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    mail.select("INBOX")

    status, search_data = mail.search(None, 'ALL')
    msg_ids = search_data[0].split()
    
    # Check the last 40 messages headers
    last_ids = msg_ids[-40:]
    print(f"Scanning {len(last_ids)} latest messages...")

    for m_id in reversed(last_ids):
        status, fetch_data = mail.fetch(m_id, '(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])')
        raw_header = fetch_data[0][1]
        msg = email.message_from_bytes(raw_header)
        sender = decode_mime(msg.get("From", ""))
        subject = decode_mime(msg.get("Subject", ""))
        date_str = msg.get("Date", "")
        
        # Is it a reply or from a human lead?
        is_lead_reply = ("Re:" in subject or "RE:" in subject or "re:" in subject) and "mailer-daemon" not in sender.lower() and "google" not in sender.lower() and "corentincailleau" not in sender.lower()
        
        tag = "[LEAD REPLY!]" if is_lead_reply else ""
        print(f"ID: {m_id.decode('ascii')} | {date_str} | {sender} | {subject} {tag}")

    mail.logout()

if __name__ == "__main__":
    main()
