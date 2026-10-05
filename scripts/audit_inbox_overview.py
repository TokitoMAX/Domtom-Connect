import imaplib, email, sys
from email.header import decode_header
from datetime import datetime

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

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

# Fetch the last 40 emails received in INBOX
status, data = mail.search(None, 'ALL')
msg_ids = data[0].split()
total_inbox = len(msg_ids)
print(f"Total messages in INBOX: {total_inbox}")

recent_ids = msg_ids[-40:] if total_inbox >= 40 else msg_ids

emails_list = []
for mid in recent_ids:
    st, d = mail.fetch(mid, '(RFC822.HEADER)')
    if st != 'OK': continue
    msg = email.message_from_bytes(d[0][1])
    sender = decode_str(msg.get("From"))
    subj = decode_str(msg.get("Subject"))
    date_str = msg.get("Date")
    emails_list.append({
        "id": mid.decode(),
        "from": sender,
        "subject": subj,
        "date": date_str
    })

print("\n=== DERNIERS 40 MESSAGES DE L'INBOX ===")
for e in reversed(emails_list):
    print(f"[{e['id']}] {e['date']} | De: {e['from'][:40]} | Sujet: {e['subject']}")

mail.close()
mail.logout()
