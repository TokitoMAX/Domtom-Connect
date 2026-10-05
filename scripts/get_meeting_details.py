import imaplib, email, sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

for query in ['(BODY "Nissi")', '(BODY "Binnur")']:
    print(f"\n================ SEARCH QUERY: {query} ================")
    status, data = mail.search(None, query)
    msg_ids = data[0].split()
    print(f"Found {len(msg_ids)} messages.")
    for msg_id in msg_ids[-3:]:  # latest 3
        status, d = mail.fetch(msg_id, "(RFC822)")
        msg = email.message_from_bytes(d[0][1])
        print(f"\n--- MSG ID {msg_id.decode()} ---")
        print("Date:", msg["Date"])
        print("From:", msg["From"])
        print("To:", msg["To"])
        print("Subject:", msg["Subject"])
        print("Message-ID:", msg["Message-ID"])
        
        body_text = ""
        meet_links = []
        for part in msg.walk():
            ct = part.get_content_type()
            if ct == "text/plain":
                payload = part.get_payload(decode=True)
                if payload:
                    body_text += payload.decode("utf-8", errors="ignore")
            elif ct == "text/html":
                payload = part.get_payload(decode=True)
                if payload:
                    html_str = payload.decode("utf-8", errors="ignore")
                    soup = BeautifulSoup(html_str, "html.parser")
                    for a in soup.find_all("a"):
                        href = a.get("href", "")
                        if "meet.google.com" in href or "calendly.com/events" in href:
                            meet_links.append(href)
        print("Body preview (first 800 chars):")
        print(body_text[:800])
        print("Meet/Calendly links found:", list(set(meet_links)))

mail.close()
mail.logout()
