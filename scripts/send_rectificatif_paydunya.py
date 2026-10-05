import smtplib
from email.mime.text import MIMEText
from email.header import Header
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "geqpuqluimxdjxeo"

TO_EMAIL = "paydunya@paydunya.com"
IN_REPLY_TO = "<CAHkGEX+3LHvRhBHDm+Jqe3rKqG1+-z2619aR9oTR5vr2diWTcA@mail.gmail.com>"
REFERENCES = "<CAHkGEX+3LHvRhBHDm+Jqe3rKqG1+-z2619aR9oTR5vr2diWTcA@mail.gmail.com>"
SUBJECT = "Re / Vos tâches énergivores / PayDunya"

BODY = """Bonjour à toute l'équipe PayDunya,

Une petite coquille de frappe s'est glissée dans mon message précédent concernant le lien de notre plateforme.

Il s'agit bien de www.domtomconnect.com (tout attaché, sans tiret).

Toutes mes excuses pour cette inadvertance et merci encore pour votre accueil.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def check_no_colons(text):
    if ":" in text:
        raise ValueError("ERREUR: Deux-points détecté !")

check_no_colons(SUBJECT)
check_no_colons(BODY)

msg = MIMEText(BODY, "plain", "utf-8")
msg["Subject"] = Header(SUBJECT, "utf-8")
msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
msg["To"] = TO_EMAIL
msg["Reply-To"] = EMAIL_USER
msg["In-Reply-To"] = IN_REPLY_TO
msg["References"] = REFERENCES

def send():
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, [TO_EMAIL], msg.as_string())
    print("===> RECTIFICATIF ENVOYÉ AVEC SUCCÈS À PAYDUNYA !")

if __name__ == "__main__":
    send()
