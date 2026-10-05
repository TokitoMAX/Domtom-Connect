import imaplib, email, sys, json, os
from email.header import decode_header
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8")

def clean_header(val):
    if not val:
        return ""
    decoded = decode_header(val)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or "utf-8", errors="ignore"))
        else:
            res.append(text)
    return " ".join(res)

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, 'ALL')
ids = data[0].split()

print(f"Total messages dans la boîte: {len(ids)}")

# Let's inspect the last 60 messages to map out everything
messages = []

for num in ids[-60:]:
    s, d = mail.fetch(num, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    sender = clean_header(msg.get("From"))
    recipient = clean_header(msg.get("To"))
    subj = clean_header(msg.get("Subject"))
    mid = msg.get("Message-ID")
    in_reply = msg.get("In-Reply-To")
    date_str = msg.get("Date")

    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

    messages.append({
        "id": num.decode(),
        "sender": sender,
        "recipient": recipient,
        "subject": subj,
        "mid": mid,
        "in_reply": in_reply,
        "date": date_str,
        "body": body[:400]
    })

mail.close()
mail.logout()

# Classify messages
prospect_replies = []
outbound_sent = []
system_bounces = []
notifications = []

for m in messages:
    sender_l = m["sender"].lower()
    subj_l = m["subject"].lower()
    
    if "mailer-daemon" in sender_l or "delivery status" in subj_l:
        system_bounces.append(m)
    elif "calendly" in sender_l or "stripe" in sender_l or "mailinblack" in sender_l:
        notifications.append(m)
    elif "domtomconnect@gmail.com" in sender_l:
        outbound_sent.append(m)
    else:
        prospect_replies.append(m)

print("\n" + "="*80)
print(f"RAPPORT D'AUDIT COMPLET DE LA BOÎTE GMAIL (Sur les 60 derniers emails)")
print("="*80)

print(f"\n1. EMAILS ENTRANTS / RÉPONSES PROSPECTS ({len(prospect_replies)}) :")
for pr in prospect_replies:
    print(f"\n--- [ID {pr['id']}] Date: {pr['date']} ---")
    print(f"From: {pr['sender']}")
    print(f"Subject: {pr['subject']}")
    print(f"Message-ID: {pr['mid']}")
    print(f"In-Reply-To: {pr['in_reply']}")
    print(f"Extrait:\n{pr['body'].strip()[:250]}")

print("\n" + "="*80)
print(f"2. ÉCHECS DE DISTRIBUTION (BOUNCES/DELAYS) DÉTECTÉS ({len(system_bounces)}) :")
for sb in system_bounces:
    print(f"- [ID {sb['id']}] {sb['subject']} (In-Reply-To: {sb['in_reply']})")

print("\n" + "="*80)
print(f"3. NOTIFICATIONS / CALENDLY / SYSTÈME ({len(notifications)}) :")
for nt in notifications:
    print(f"- [ID {nt['id']}] From: {nt['sender']} | Subject: {nt['subject']}")
