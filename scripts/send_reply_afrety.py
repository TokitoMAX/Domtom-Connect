import smtplib
from email.mime.text import MIMEText
from email.header import Header

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

TO_EMAIL = "contact@afrety.com"
SUBJECT = "Re: Vos tâches énergivores / Afrety"
IN_REPLY_TO = "<c0817045eefc8832183f2bd59dcd7b62@afrety.com>"

BODY = """Bonjour Malick,

Non, je suis basé en France.

En fait, mon message ne concerne pas l'envoi d'un colis. Je cherche à joindre directement la direction d'Afrety pour un échange professionnel.

Pourriez-vous m'indiquer à quelle adresse je peux les contacter directement ?

Merci à vous,

Loïc Villeronce
Domtom Connect
"""

def send_reply():
    print("Connexion SMTP à Gmail...")
    msg = MIMEText(BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
    msg["To"] = f"Malick d'Afrety | AFRETY <{TO_EMAIL}>"
    msg["In-Reply-To"] = IN_REPLY_TO
    msg["References"] = IN_REPLY_TO

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [TO_EMAIL], msg.as_string())
        print(f"Réponse envoyée avec succès à {TO_EMAIL} dans le fil existant !")
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi : {e}")
        return False

if __name__ == "__main__":
    send_reply()
