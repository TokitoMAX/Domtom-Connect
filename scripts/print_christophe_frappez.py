import imaplib, email, sys
from bs4 import BeautifulSoup

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.fetch("4886", "(RFC822)")
if data and data[0]:
    msg = email.message_from_bytes(data[0][1])
    print("Subject:", msg.get("Subject"))
    for part in msg.walk():
        if part.get_content_type() == "text/html":
            soup = BeautifulSoup(part.get_payload(decode=True).decode("utf-8", errors="ignore"), "html.parser")
            print(soup.get_text(separator="\n"))

mail.close()
mail.logout()
