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

def main():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    
    # List mailboxes to find Sent folder name
    status, mailboxes = mail.list()
    sent_folder = None
    for mb in mailboxes:
        decoded = mb.decode('utf-8', errors='ignore')
        if "Sent" in decoded or "Envoy" in decoded:
            # Extract folder name
            parts = decoded.split(' "/" ')
            if len(parts) == 2:
                sent_folder = parts[1].strip()
                break

    print(f"Sent folder detected: {sent_folder}")
    if sent_folder:
        mail.select(sent_folder)
        # Search sent emails to reservationlaterrasse or sagaafricaresa
        for target in ["reservationlaterrasse@gmail.com", "sagaafricaresa@gmail.com"]:
            status, data = mail.search(None, f'TO "{target}"')
            ids = data[0].split()
            print(f"Sent emails to {target}: {len(ids)}")
            for mid in ids:
                status, fdata = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (DATE SUBJECT)])')
                msg = email.message_from_bytes(fdata[0][1])
                print(f"   Date: {msg.get('Date')} | Sujet: {decode_mime(msg.get('Subject', ''))}")

    mail.logout()

if __name__ == "__main__":
    main()
