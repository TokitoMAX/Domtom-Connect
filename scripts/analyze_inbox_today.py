import imaplib, email, sys
sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

# 1. Search for messages from Joseph (edukaraib or johnfres)
status, messages = mail.search(None, '(OR FROM "edukaraib.com" FROM "johnfres.45@gmail.com")')
msg_ids = messages[0].split()
print(f"=== EMAILS DE JOSEPH ({len(msg_ids)}) ===")
for mid in msg_ids:
    status, data = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(data[0][1])
    print(f"\nID: {mid.decode()} | Date: {msg.get('Date')} | From: {msg.get('From')} | Subject: {msg.get('Subject')}")
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            payload = part.get_payload(decode=True)
            if payload:
                print("--- TEXT ---")
                print(payload.decode("utf-8", errors="ignore"))

# 2. Check the latest 20 incoming emails in the account to see all recent prospect replies
status, messages = mail.search(None, 'UNSEEN')
unseen_ids = messages[0].split()
print(f"\n=== UNSEEN EMAILS ({len(unseen_ids)}) ===")
for mid in unseen_ids[-10:]:
    status, data = mail.fetch(mid, "(RFC822.HEADER)")
    msg = email.message_from_bytes(data[0][1])
    print(f"UNSEEN ID: {mid.decode()} | Date: {msg.get('Date')} | From: {msg.get('From')} | Subject: {msg.get('Subject')}")

# 3. Check all messages received today (28 Sep 2026) that are NOT from us
status, messages = mail.search(None, '(SINCE "28-Sep-2026")')
today_ids = messages[0].split()
print(f"\n=== EMAILS RECUS AUJOURD'HUI ({len(today_ids)}) ===")
for mid in today_ids:
    status, data = mail.fetch(mid, "(RFC822.HEADER)")
    msg = email.message_from_bytes(data[0][1])
    sender = msg.get("From", "")
    if "domtomconnect@gmail.com" not in sender:
        print(f"ID: {mid.decode()} | Date: {msg.get('Date')} | From: {sender} | Subject: {msg.get('Subject')}")

mail.close()
mail.logout()
