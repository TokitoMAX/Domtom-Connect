import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "ranking.re@gmail.com"
RECIPIENT_CC = "contact@ranking.re"

LAST_SENT_MSG_ID = "<179059630965.7384.8710619798568686113@domtomconnect.com>"
CALENDAR_MSG_ID = "<calendar-e905a0da-df94-4e35-b49c-74aa79128477@google.com>"

subject = "Re, Rendez-vous Ranking Réunion et Dom Tom Connect"

body = """Bonjour Lucien,

Pour vous éviter de devoir reprendre un créneau sur Calendly, vous pouvez rejoindre directement notre visioconférence sur notre lien Google Meet si vous êtes disponible maintenant ou dans l'après-midi,

meet.google.com/cvi-sxyx-rsa

Je suis en ligne et prêt à vous y accueillir dès que vous vous connectez afin que nous puissions échanger simplement sur nos synergies.

Bien cordialement,

Loïc Villeronce
Fondateur de Dom Tom Connect et DTC Pulse
domtomconnect@gmail.com

---
Le 28 sept. 2026 à 13h51, Loïc Villeronce a écrit,
> Bonjour Lucien,
> Je tiens à vous présenter mes excuses les plus sincères pour notre rendez-vous prévu aujourd'hui à 13h00 (15h00 heure Réunion)..."""

# Safety validation
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")

def send():
    context = ssl.create_default_context()
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_TO
    msg["Cc"] = RECIPIENT_CC
    msg["Date"] = formatdate(localtime=True)
    new_msg_id = make_msgid(domain="domtomconnect.com")
    msg["Message-ID"] = new_msg_id
    msg["In-Reply-To"] = LAST_SENT_MSG_ID
    msg["References"] = f"{CALENDAR_MSG_ID} {LAST_SENT_MSG_ID}"

    all_recipients = [RECIPIENT_TO, RECIPIENT_CC]

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, all_recipients, msg.as_string())
        print(f"EMAIL AVEC LIEN DIRECT GOOGLE MEET ENVOYÉ À LUCIEN BOUFFARD ! (ID: {new_msg_id})")

if __name__ == "__main__":
    send()
