import imaplib, smtplib, ssl, email, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding="utf-8")

APP_PASSWORD = "geqpuqluimxdjxeo"
EMAIL = "domtomconnect@gmail.com"

print("--- 1. TEST CONNEXION SMTP ---")
try:
    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context)
    server.login(EMAIL, APP_PASSWORD)
    print(">> SMTP : SUCCÈS TOTAL ET IMMÉDIAT !")
    server.quit()
except Exception as e:
    print(f">> SMTP Erreur : {e}")

print("\n--- 2. TEST CONNEXION IMAP ---")
try:
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL, APP_PASSWORD)
    mail.select('"[Gmail]/Tous les messages"')
    status, data = mail.search(None, 'ALL')
    ids = data[0].split()
    print(f">> IMAP : SUCCÈS TOTAL ! {len(ids)} messages accessibles dans la boîte.")
    
    # Inspect the last 10 messages
    print("\n--- DERNIERS MESSAGES ENTRÉS ---")
    for num in ids[-10:]:
        s, d = mail.fetch(num, '(RFC822.HEADER)')
        msg = email.message_from_bytes(d[0][1])
        sender = msg.get("From")
        subj = msg.get("Subject")
        print(f"ID {num.decode()} | From: {sender} | Subject: {subj}")
        
    mail.close()
    mail.logout()
except Exception as e:
    print(f">> IMAP Erreur : {e}")
