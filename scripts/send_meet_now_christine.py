import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

TO_EMAIL = "contact@oua-concept.com"
CC_EMAIL = "christinepicard@oua-concept.com"

# Verify emails first
for em in [TO_EMAIL, CC_EMAIL]:
    valid, reason = verify_email_target(em)
    if not valid:
        print(f"Aborting: {em} is not valid: {reason}")
        sys.exit(1)

# Thread headers
IN_REPLY_TO = "<F592CA0D-A93D-4F49-BD2A-58311FDD1A3E@oua-concept.com>"
REFERENCES = "<179021265653.16056.6689348557171939937@domtomconnect.com> <F592CA0D-A93D-4F49-BD2A-58311FDD1A3E@oua-concept.com> <179085984710.33752.14506571746195878751@domtomconnect.com>"
SUBJECT = "Re, Épicerie créole artisanale premium et valorisation des producteurs ultramarins / OUA Concept"

BODY = """Bonjour Christine,

Je suis actuellement connecté sur notre salon Google Meet pour notre échange prévu ce jour à 14h00.

Voici le lien direct pour me rejoindre en visioconférence,
meet.google.com/xxu-ivkm-rpe

Si vous rencontrez la moindre difficulté de connexion ou un contretemps, n'hésitez pas à me joindre directement au +33 6 20 78 33 77.

À tout de suite en ligne,

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Portable et WhatsApp, +33 6 20 78 33 77
Plateforme, www.domtomconnect.com

> Le 01 oct. 2026 à 12,11, contact@oua-concept.com a écrit ,
> Bonjour,
> Curieuse d’en savoir plus.
> OUA est basé en hexagone (Sud de France) et vise un marché hexagonal, européen et suisse.
> Au plaisir d’échanger,
> Bien cordialement,
> Christine PICARD
> Fondatrice - OÜA
> oua-concept.com
> +33 (0) 6 58 58 46 10
"""

# Check rule: no colon in body
if ":" in BODY:
    raise ValueError(f"CRITICAL RULE VIOLATION: Colon detected in body text!\n{BODY}")

msg = MIMEText(BODY, 'plain', 'utf-8')
msg['From'] = f"Loïc Villeronce <{SENDER_EMAIL}>"
msg['To'] = f"Christine Picard <{TO_EMAIL}>"
msg['Cc'] = CC_EMAIL
msg['Subject'] = Header(SUBJECT, 'utf-8')
msg['Date'] = formatdate(localtime=True)
msg['Message-ID'] = make_msgid(domain='domtomconnect.com')
msg['In-Reply-To'] = IN_REPLY_TO
msg['References'] = REFERENCES

recipients = [TO_EMAIL, CC_EMAIL]

print(f"Connecting to SMTP {SMTP_SERVER}...")
context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, recipients, msg.as_string())
    print("SUCCESS: Email sent successfully to", recipients)
