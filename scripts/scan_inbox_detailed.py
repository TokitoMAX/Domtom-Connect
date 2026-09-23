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
    print(f"Total messages in INBOX: {len(msg_ids)}")

    # Examine last 15 messages
    last_ids = msg_ids[-15:]
    for m_id in reversed(last_ids):
        status, fetch_data = mail.fetch(m_id, '(RFC822)')
        if status != 'OK':
            continue
        raw_email = fetch_data[0][1]
        msg = email.message_from_bytes(raw_email)
        
        from_hdr = decode_mime(msg.get("From", ""))
        subject_hdr = decode_mime(msg.get("Subject", ""))
        date_hdr = msg.get("Date", "")
        body = get_body(msg)

        print("\n" + "="*80)
        print(f"ID: {m_id.decode('ascii')} | DATE: {date_hdr}")
        print(f"DE: {from_hdr}")
        print(f"SUJET: {subject_hdr}")
        print("-" * 80)
        print("EXTRAIT CONTENU (premières 40 lignes) :")
        lines = [line.strip() for line in body.splitlines() if line.strip()]
        for line in lines[:40]:
            print(f"  {line}")
        print("="*80)

    mail.logout()

if __name__ == "__main__":
    main()
