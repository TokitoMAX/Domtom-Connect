import smtplib
from email.mime.text import MIMEText
from email.header import Header

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

TO_EMAIL = "contact@afrety.com"
SUBJECT = "Re: Vos tâches énergivores / Afrety"
IN_REPLY_TO = "<9876299f3c2a0df6e74ef370f29fc1a5@afrety.com>"

BODY = """Bonjour Absa,

Merci beaucoup pour votre réactivité et pour la transmission en interne.

C'est bien noté, je reste donc dans l'attente du retour de votre collègue pour échanger à ce sujet.

Excellente journée à vous,

Loïc Villeronce
Domtom Connect
"""

def send_reply():
    print("Connexion SMTP à Gmail...")
    msg = MIMEText(BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
    msg["To"] = f"Absa BOYE - AFRETY | AFRETY <{TO_EMAIL}>"
    msg["In-Reply-To"] = IN_REPLY_TO
    msg["References"] = IN_REPLY_TO

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [TO_EMAIL], msg.as_string())
        print(f"Réponse envoyée avec succès à Absa ({TO_EMAIL}) !")
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi : {e}")
        return False

if __name__ == "__main__":
    send_reply()
