import imaplib
import email
from email.header import decode_header
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

def decode_str(s):
    if not s:
        return ""
    decoded = decode_header(s)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or 'utf-8', errors='ignore'))
        else:
            res.append(str(text))
    return "".join(res)

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

print(f"Total messages dans l'INBOX : {len(msg_ids)}")

# Look at the last 30 messages in INBOX
recent_ids = msg_ids[-30:] if len(msg_ids) >= 30 else msg_ids

bounces = []
prospect_replies = []
others = []

for m_id in reversed(recent_ids):
    status, fetch_data = mail.fetch(m_id, '(RFC822)')
    if status != 'OK':
        continue
    raw_email = fetch_data[0][1]
    msg = email.message_from_bytes(raw_email)
    
    sender = decode_str(msg.get("From", ""))
    subject = decode_str(msg.get("Subject", ""))
    date = msg.get("Date", "")
    message_id = msg.get("Message-ID", "")
    
    # Extract body snippet
    body_text = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if ctype == 'text/plain' and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    body_text = payload.decode('utf-8', errors='ignore')
                    break
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            body_text = payload.decode('utf-8', errors='ignore')
            
    snippet = body_text.strip()[:300].replace('\n', ' ')
    
    item = {
        "id": m_id.decode(),
        "from": sender,
        "subject": subject,
        "date": date,
        "snippet": snippet
    }
    
    sender_lower = sender.lower()
    subject_lower = subject.lower()
    
    if any(b in sender_lower for b in ["mailer-daemon", "postmaster"]) or any(b in subject_lower for b in ["delivery status", "failure", "undeliverable", "undelivered"]):
        bounces.append(item)
    elif any(s in sender_lower for s in ["google", "notification", "security", "calendly"]):
        others.append(item)
    else:
        prospect_replies.append(item)

print(f"\n=== RAPPORT D'ANALYSE DE L'INBOX ===")
print(f"Messages analysés : {len(recent_ids)}")
print(f"Réponses de prospects / interlocuteurs : {len(prospect_replies)}")
print(f"Rebonds / Notifications d'échec : {len(bounces)}")
print(f"Notifications système / Calendly / Google : {len(others)}")

print("\n--- 1. RÉPONSES PROSPECTS / INTERLOCUTEURS ---")
if prospect_replies:
    for idx, r in enumerate(prospect_replies, 1):
        print(f"\n[{idx}] DE : {r['from']}")
        print(f"    DATE : {r['date']}")
        print(f"    SUJET : {r['subject']}")
        print(f"    APERÇU : {r['snippet'][:200]}...")
else:
    print("Aucune nouvelle réponse de prospect détectée.")

print("\n--- 2. REBONDS / NOTIFICATIONS D'ÉCHEC ---")
if bounces:
    for idx, b in enumerate(bounces, 1):
        print(f"\n[{idx}] DE : {b['from']} | SUJET : {b['subject']} | DATE : {b['date']}")
        print(f"    EXTRAIT : {b['snippet'][:150]}...")
else:
    print("Aucun rebond détecté.")

print("\n--- 3. AUTRES (GOOGLE, CALENDLY, NOTIFICATIONS) ---")
for idx, o in enumerate(others, 1):
    print(f"[{idx}] {o['from']} | {o['subject']} | {o['date']}")

mail.logout()
