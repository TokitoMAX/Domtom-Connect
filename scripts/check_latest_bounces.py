import imaplib
import email
import sys

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
mail.select("INBOX")

# Récupérer les 5 derniers messages reçus
status, search_data = mail.search(None, 'ALL')
msg_ids = search_data[0].split()

print("Derniers messages dans la boîte de réception :")
for m_id in reversed(msg_ids[-6:]):
    status, fetch_data = mail.fetch(m_id, '(RFC822)')
    raw = fetch_data[0][1]
    msg = email.message_from_bytes(raw)
    
    from_hdr = msg.get("From", "")
    subject_hdr = msg.get("Subject", "")
    date_hdr = msg.get("Date", "")
    
    print("="*60)
    print(f"DE : {from_hdr}")
    print(f"DATE : {date_hdr}")
    print(f"SUJET : {subject_hdr}")
    
    # Si mailer-daemon, afficher la raison exacte et l'adresse rejetée
    body = ""
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            p = part.get_payload(decode=True)
            if p:
                body += p.decode('utf-8', errors='ignore')
    
    for line in body.split("\n"):
        if any(w in line.lower() for w in ["does not exist", "failed", "550", "554", "recipient", "rejeté", "parvenu", "introuvable"]):
            print(f"  > {line.strip()[:120]}")

mail.logout()
