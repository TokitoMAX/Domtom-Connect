import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "johnfres.45@gmail.com"
RECIPIENT_CC = "contact@edukaraib.com"
LAST_MSG_ID = "<1a0deb0bbfe.6daa0bfb834895.3220181439287453384@edukaraib.com>"

subject = "Re, Échange Dom Tom Connect et EduKaraib / Factur'Peyi"

plain_body = """Bonjour Joseph,

Je me réjouis de notre échange prévu à 14h30.

Pour faciliter votre accès, voici le lien direct pour rejoindre la visioconférence Google Meet,
meet.google.com/zcf-nwuj-hrz

À tout de suite,

Bien cordialement,

Loïc Villeronce
Fondateur de Dom Tom Connect et DTC Pulse
domtomconnect@gmail.com

---
Le 26 sept. 2026 à 19h08, Edukaraib (contact@edukaraib.com) a écrit,
> Bonjour Loïc,
> Merci pour votre message, et pour le mot sur EduKaraib.
> Je dirige aussi Factur'Peyi, un logiciel de facturation conçu pour les entreprises d'outre-mer."""

# Rule safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in plain_body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in plain_body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")

def send():
    context = ssl.create_default_context()
    msg = MIMEText(plain_body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_TO
    msg["Cc"] = RECIPIENT_CC
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = LAST_MSG_ID
    msg["References"] = LAST_MSG_ID

    all_recipients = [RECIPIENT_TO, RECIPIENT_CC]

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, all_recipients, msg.as_string())
        print("EMAIL AVEC LIEN GOOGLE MEET ENVOYÉ AVEC SUCCÈS À JOSEPH TWISEYIMANA !")

if __name__ == "__main__":
    send()
