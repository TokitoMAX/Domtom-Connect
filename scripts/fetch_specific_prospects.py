import imaplib
import email
from email.header import decode_header
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

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

    targets = ["lecomptoirgeneral", "paydunya"]
    for query in targets:
        status, search_data = mail.search(None, f'FROM "{query}"')
        msg_ids = search_data[0].split()
        if msg_ids:
            latest_id = msg_ids[-1]
            status, fetch_data = mail.fetch(latest_id, '(RFC822)')
            msg = email.message_from_bytes(fetch_data[0][1])
            print("="*80)
            print(f"QUERY: {query} | ID: {latest_id.decode('ascii')}")
            print(f"DE: {decode_mime(msg.get('From', ''))}")
            print(f"DATE: {msg.get('Date', '')}")
            print(f"SUJET: {decode_mime(msg.get('Subject', ''))}")
            print("-" * 80)
            print("CORPS :")
            lines = [line.strip() for line in get_body(msg).splitlines() if line.strip()]
            for l in lines[:30]:
                print(f"  {l}")

    mail.logout()

if __name__ == "__main__":
    main()
