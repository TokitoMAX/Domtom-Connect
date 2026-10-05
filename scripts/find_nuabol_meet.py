import imaplib, email
from bs4 import BeautifulSoup

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(BODY "nuabol")')
print("Msg IDs for nuabol:", data[0].split())

for msg_id in data[0].split()[-3:]:
    status, d = mail.fetch(msg_id, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    print(f"\n================ ID {msg_id.decode()} ================")
    print("From:", msg["From"])
    print("To:", msg["To"])
    print("Subject:", msg["Subject"])
    print("Date:", msg["Date"])
    print("Message-ID:", msg["Message-ID"])
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            print("--- PLAIN TEXT ---")
            print(part.get_payload(decode=True).decode("utf-8", errors="ignore")[:500])
        elif part.get_content_type() == "text/html":
            soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
            links = [a.get("href") for a in soup.find_all("a") if a.get("href") and ("meet.google" in a.get("href") or "calendly" in a.get("href"))]
            print("Links found:", links)

mail.close()
mail.logout()
