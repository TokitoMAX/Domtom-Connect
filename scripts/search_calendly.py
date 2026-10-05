import imaplib, email
from bs4 import BeautifulSoup

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(FROM "calendly")')
print("Calendly msg IDs:", data[0].split())

for msg_id in data[0].split():
    status, d = mail.fetch(msg_id, "(RFC822)")
    msg = email.message_from_bytes(d[0][1])
    print(f"\n================ CALENDLY ID {msg_id.decode()} ================")
    print("Subject:", msg["Subject"])
    print("Date:", msg["Date"])
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            print("--- PLAIN ---")
            print(part.get_payload(decode=True).decode("utf-8", errors="ignore")[:400])
        elif part.get_content_type() == "text/html":
            soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
            meet_links = [a.get("href") for a in soup.find_all("a") if a.get("href") and "meet.google.com" in a.get("href")]
            print("Meet links:", meet_links)

mail.close()
mail.logout()
