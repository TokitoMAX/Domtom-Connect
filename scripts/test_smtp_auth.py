import smtplib, ssl

context = ssl.create_default_context()
try:
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context)
    server.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
    print("SMTP AUTHENTIFICATION : SUCCÈS TOTAL !")
    server.quit()
except Exception as e:
    print(f"SMTP ERREUR : {e}")
