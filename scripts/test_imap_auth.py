import imaplib, time

for i in range(5):
    try:
        print(f"Connexion IMAP essai {i+1}...")
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
        mail.select('"[Gmail]/Tous les messages"')
        status, data = mail.search(None, 'ALL')
        ids = data[0].split()
        print(f"SUCCÈS ! {len(ids)} messages trouvés.")
        mail.close()
        mail.logout()
        break
    except Exception as e:
        print(f"Erreur : {e}")
        time.sleep(5)
