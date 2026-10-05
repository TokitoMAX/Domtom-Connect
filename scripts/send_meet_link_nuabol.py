import smtplib, ssl, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "nuabolsaumur@gmail.com"
RECIPIENT_CC = "nuabolangers@gmail.com"

subject = "Lien de connexion pour notre échange en visio / Domtom Connect & NUABOL"

body = """Bonjour Christophe,

Je suis actuellement connecté dans la salle de visioconférence pour notre échange prévu ce matin.

Voici le lien direct pour me rejoindre,

https://meet.google.com/bvg-vfvt-xzk

Je reste connecté, dites-moi si vous rencontrez le moindre souci technique pour accéder à la salle.

À tout de suite,

Loïc Villeronce
Fondateur de Domtom Connect
domtomconnect@gmail.com"""

# Safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body.replace("https://", "").replace("http://", ""):
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")

def send_email():
    print(f"Envoi à {RECIPIENT_TO} (cc: {RECIPIENT_CC})...")
    context = ssl.create_default_context()
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_TO
    msg["Cc"] = RECIPIENT_CC
    msg["Date"] = formatdate(localtime=True)
    msg_id = make_msgid(domain="domtomconnect.com")
    msg["Message-ID"] = msg_id

    recipients = [RECIPIENT_TO, RECIPIENT_CC]

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipients, msg.as_string())
        print(f"EMAIL ENVOYÉ AVEC SUCCÈS ! (ID: {msg_id})")

if __name__ == "__main__":
    send_email()
