import smtplib
from email.mime.text import MIMEText
from email.header import Header

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

TO_EMAIL = "domtomconnect@gmail.com"
SUBJECT = "[TEST RENDU] Vos tâches énergivores / Kadalys"

BODY = """Bonjour,

En tant que dirigeant, votre temps doit servir en priorité à développer votre activité et faire rentrer du chiffre d'affaires.

Le problème, c'est que les journées sont souvent absorbées par des tâches opérationnelles, techniques ou de coordination qui prennent énormément d'énergie sans générer directement de ventes.

Avec Domtom Connect, j'interviens comme copilote opérationnel sur-mesure :
- Vous vous concentrez sur ce qui fait tourner et grandir le business.
- Je prends en charge les tâches énergivores qui vous ralentissent et vous font perdre votre temps.

Avez-vous 15 minutes cette semaine pour échanger sur vos priorités actuelles et voir ce qui pourrait vous être délégué ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
"""

def send_test():
    print(f"Connexion SMTP à {SMTP_HOST}:{SMTP_PORT}...")
    msg = MIMEText(BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
    msg["To"] = TO_EMAIL

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [TO_EMAIL], msg.as_string())
        print(f"Email de test envoyé avec succès à {TO_EMAIL} !")
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi : {e}")
        return False

if __name__ == "__main__":
    send_test()
