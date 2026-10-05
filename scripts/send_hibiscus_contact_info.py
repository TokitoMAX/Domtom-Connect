import smtplib, ssl, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
RECIPIENT_TO = "domtomconnect@gmail.com"

subject = "CONTACT WHATSAPP , Agence Hibiscus Tours (Cotonou Benin)"

body = """Bonjour Loïc,

Voici les coordonnées directes transmises par Hibiscus Tours suite à notre prise de contact,

Entreprise, Agence Hibiscus Tours
Localisation, Cotonou, Bénin
Activité, Location de véhicules et transport sur mesure
Email, ibiscustours22@gmail.com
WhatsApp direct, +229 01 62 70 46 48 (ou +229 0162704648)

Message reçu du prospect,
"Bonjour Merci de nous contacter.je suis a votre disposition mon wasap +229 (0162704648,)"

Bonne prise de contact,
Assistant Domtom Connect"""

# Safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")

context = ssl.create_default_context()
msg = MIMEText(body, "plain", "utf-8")
msg["Subject"] = subject
msg["From"] = f"Assistant Domtom Connect <{SENDER_EMAIL}>"
msg["To"] = RECIPIENT_TO
msg["Date"] = formatdate(localtime=True)
msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, [RECIPIENT_TO], msg.as_string())
    print("Email de récapitulatif Hibiscus Tours envoyé avec succès à domtomconnect@gmail.com !")
