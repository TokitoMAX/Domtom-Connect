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

def main():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    mail.select("INBOX")

    status, search_data = mail.search(None, 'ALL')
    msg_ids = search_data[0].split()
    total = len(msg_ids)
    print(f"Total messages: {total}")

    start_num = max(1, total - 100)
    range_str = f"{start_num}:{total}"

    status, fetch_data = mail.fetch(range_str, '(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])')
    
    interesting = []
    
    for item in fetch_data:
        if isinstance(item, tuple):
            msg = email.message_from_bytes(item[1])
            sender = decode_mime(msg.get("From", ""))
            subject = decode_mime(msg.get("Subject", ""))
            date_str = msg.get("Date", "")
            
            # Filter out bounces, automated newsletters unless relevant
            s_low = sender.lower()
            if "mailer-daemon" in s_low or "postmaster" in s_low:
                continue
            
            interesting.append((date_str, sender, subject))

    print(f"\n--- NON-BOUNCE EMAILS IN THE LAST 100 INBOX ITEMS ({len(interesting)}) ---")
    for d, s, subj in reversed(interesting):
        print(f"[{d}] \n   De: {s} \n   Sujet: {subj}\n")

    mail.logout()

if __name__ == "__main__":
    main()
