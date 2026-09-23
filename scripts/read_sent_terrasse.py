import imaplib
import email
from email.header import decode_header
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

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
    mail.select('"[Gmail]/Messages envoy&AOk-s"')
    
    status, data = mail.search(None, 'TO "reservationlaterrasse@gmail.com"')
    ids = data[0].split()
    if ids:
        last_id = ids[-1]
        status, fdata = mail.fetch(last_id, '(RFC822)')
        msg = email.message_from_bytes(fdata[0][1])
        print("DATE:", msg.get('Date'))
        print("SUJET:", msg.get('Subject'))
        print("CORPS:")
        print(get_body(msg))

    mail.logout()

if __name__ == "__main__":
    main()
