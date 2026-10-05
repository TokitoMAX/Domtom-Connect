import imaplib, email

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, messages = mail.search(None, 'SUBJECT', '"EduKaraib"')
msg_ids = messages[0].split()
print("EduKaraib subject msgs:", len(msg_ids))
for mid in msg_ids:
    status, data = mail.fetch(mid, "(RFC822.HEADER)")
    msg = email.message_from_bytes(data[0][1])
    print(mid.decode(), msg.get("Date"), msg.get("From"), msg.get("To"), msg.get("Subject"))

status, messages = mail.search(None, 'SUBJECT', '"Factur"')
msg_ids = messages[0].split()
print("Factur subject msgs:", len(msg_ids))

status, messages = mail.search(None, 'SUBJECT', '"Twizeyimana"')
msg_ids = messages[0].split()
print("Twizeyimana subject msgs:", len(msg_ids))
for mid in msg_ids:
    status, data = mail.fetch(mid, "(RFC822.HEADER)")
    msg = email.message_from_bytes(data[0][1])
    print(mid.decode(), msg.get("Date"), msg.get("From"), msg.get("To"), msg.get("Subject"))

# Also search for any Calendly or Google Calendar email for today 14h30 / 2:30pm
status, messages = mail.search(None, '(OR FROM "calendly.com" FROM "calendar-notification@google.com")')
msg_ids = messages[0].split()
print("Calendar notifications:", len(msg_ids))
for mid in msg_ids[-10:]:
    status, data = mail.fetch(mid, "(RFC822)")
    msg = email.message_from_bytes(data[0][1])
    subj = msg.get("Subject", "")
    print(mid.decode(), msg.get("Date"), subj)
    payload = msg.get_payload()
    if "Joseph" in str(payload) or "EduKaraib" in str(payload) or "14:30" in str(payload) or "2:30pm" in str(payload):
        print("MATCH FOUND IN BODY!")
        if isinstance(payload, list):
            for part in payload:
                p_text = str(part.get_payload(decode=True))
                if "meet.google.com" in p_text:
                    print("MEET LINK FOUND:", [line for line in p_text.split("\\n") if "meet.google.com" in line])

mail.close()
mail.logout()
