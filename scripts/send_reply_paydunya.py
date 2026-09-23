import smtplib
from email.mime.text import MIMEText
from email.header import Header
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

TO_EMAIL = "paydunya@paydunya.com"
IN_REPLY_TO = "<CAHkGEX+3LHvRhBHDm+Jqe3rKqG1+-z2619aR9oTR5vr2diWTcA@mail.gmail.com>"
REFERENCES = "<CAHkGEX+3LHvRhBHDm+Jqe3rKqG1+-z2619aR9oTR5vr2diWTcA@mail.gmail.com>"
SUBJECT = "Re / Vos tâches énergivores / PayDunya"

BODY = """Bonjour à toute l'équipe PayDunya,

Un grand merci pour votre retour rapide et pour la transmission du message à votre direction.

Pour clarifier notre démarche, le copilotage n'est qu'une des facettes de ce que nous proposons. Domtom Connect accompagne les entreprises sur plusieurs leviers stratégiques, et je vous laisse l'adresse de notre plateforme www.domtomconnect.com pour que votre équipe puisse y jeter un coup d'œil en toute simplicité.

En parallèle, nous construisons deux axes qui rejoignent directement votre écosystème.

D'une part, nous animons un groupe WhatsApp d'entrepreneurs pour bâtir un réseau d'affaires solide, avec l'ambition d'en faire un véritable incubateur de projets.

D'autre part, nous finalisons actuellement DTC Pulse, notre application mobile en phase de bêta fermée. C'est un nouveau réseau social business pensé pour marquer l'avenir des échanges dans les Caraïbes, en Afrique et au sein de leurs diasporas, en réunissant la visibilité vidéo façon TikTok, la marketplace façon Amazon et la commande directe façon UberEats.

J'espère que ces informations complémentaires permettront à votre direction de prendre rendez-vous avec nous afin que nous puissions échanger.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def check_no_colons(text):
    if ":" in text:
        raise ValueError("ERREUR: Deux-points interdit détecté !")

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
    print("===> RÉPONSE STRATÉGIQUE ENVOYÉE AVEC SUCCÈS À PAYDUNYA !")

if __name__ == "__main__":
    send()
