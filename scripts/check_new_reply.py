import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

def get_text_from_msg(msg):
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
    if not msg_ids:
        print("Aucun message trouvé.")
        return

    # Prendre les 2 derniers
    last_ids = msg_ids[-2:]
    for m_id in reversed(last_ids):
        status, fetch_data = mail.fetch(m_id, '(RFC822)')
        if status != 'OK':
            continue
        raw_email = fetch_data[0][1]
        msg = email.message_from_bytes(raw_email)
        
        from_hdr = msg.get("From", "")
        subject_hdr = msg.get("Subject", "")
        date_hdr = msg.get("Date", "")
        body = get_text_from_msg(msg)

        print("="*60)
        print(f"DE : {from_hdr}")
        print(f"DATE : {date_hdr}")
        print(f"SUJET : {subject_hdr}")
        print("="*60)
        print("CONTENU :")
        print(body.strip())
        print("="*60)

    mail.logout()

if __name__ == "__main__":
    main()
