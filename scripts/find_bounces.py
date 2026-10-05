import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

# Chercher les messages de Mail Delivery Subsystem
status, search_data = mail.search(None, '(FROM "mailer-daemon")')
if status == 'OK' and search_data[0]:
    msg_ids = search_data[0].split()
    print(f"Total messages de rejet (Mailer-Daemon) trouvés : {len(msg_ids)}")
    for m_id in msg_ids[-10:]:
        status, fetch_data = mail.fetch(m_id, '(RFC822)')
        raw = fetch_data[0][1]
        msg = email.message_from_bytes(raw)
        print("--------------------------------------------------")
        print(f"Date: {msg.get('Date')}")
        print(f"Subject: {msg.get('Subject')}")
        # Trouver l'adresse rejetée
        body = ""
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                p = part.get_payload(decode=True)
                if p:
                    body += p.decode('utf-8', errors='ignore')
        for line in body.split("\n"):
            if "The email account that you tried to reach does not exist" in line or "550" in line or "dns" in line.lower() or "recipient" in line.lower() or "failed" in line.lower() or "@" in line:
                print(f"  > {line.strip()[:100]}")
else:
    print("Aucun mailer-daemon trouvé via search FROM.")

mail.logout()
