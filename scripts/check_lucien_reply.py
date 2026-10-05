import imaplib, email, sys, re
sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

# Check recent messages in general (last 20 messages)
status, messages = mail.search(None, "ALL")
all_ids = messages[0].split()
print("Total messages in account:", len(all_ids))

for mid in all_ids[-15:]:
    status, data = mail.fetch(mid, "(RFC822.HEADER)")
    msg = email.message_from_bytes(data[0][1])
    print(f"ID: {mid.decode()} | Date: {msg.get('Date')} | From: {msg.get('From')} | Subject: {msg.get('Subject')}")

# Extract Meet link from 4692 (Calendly event for Lucien)
status, data = mail.fetch("4692", "(RFC822)")
if data and data[0]:
    msg_cal = email.message_from_bytes(data[0][1])
    for part in msg_cal.walk():
        p = part.get_payload(decode=True)
        if p:
            text = p.decode("utf-8", errors="ignore")
            # find calendly google meet link
            m = re.findall(r'https://calendly\.com/events/[a-z0-9\-]+/google_meet', text)
            if m:
                print("Calendly Google Meet redirect:", m[0])

mail.close()
mail.logout()
