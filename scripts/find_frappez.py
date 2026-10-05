import imaplib, email

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, '(BODY "Frappez")')
print("Frappez IDs:", data[0].split())
for mid in data[0].split():
    s, d = mail.fetch(mid, "(RFC822)")
    m = email.message_from_bytes(d[0][1])
    print("ID:", mid, "Subject:", m["Subject"], "From:", m["From"], "To:", m["To"], "Date:", m["Date"])

status, data2 = mail.search(None, '(BODY "nuabol")')
print("Nuabol IDs:", data2[0].split())
for mid in data2[0].split():
    s, d = mail.fetch(mid, "(RFC822)")
    m = email.message_from_bytes(d[0][1])
    print("ID:", mid, "Subject:", m["Subject"], "From:", m["From"], "To:", m["To"], "Date:", m["Date"])

mail.close()
mail.logout()
