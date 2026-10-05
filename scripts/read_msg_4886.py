import imaplib, email, sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

s, d = mail.fetch("4886", "(RFC822)")
msg = email.message_from_bytes(d[0][1])
print("Subject:", msg["Subject"])
print("Date:", msg["Date"])

for part in msg.walk():
    if part.get_content_type() == "text/plain":
        print("=== PLAIN ===")
        print(part.get_payload(decode=True).decode("utf-8", errors="ignore"))
    elif part.get_content_type() == "text/html":
        print("=== HTML ===")
        soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
        print(soup.get_text(separator="\n"))
        for a in soup.find_all("a"):
            print("Link:", a.get_text(), "->", a.get("href"))

mail.close()
mail.logout()
