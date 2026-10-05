import smtplib, ssl, os, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

PARENT_MSG_ID = "<6aba1282.a652db78.7a05.4f77SMTPIN_ADDED_BROKEN@mx.google.com>"
RECIPIENT = "achazai@chazai-wamba.com"
CC_EMAIL = "contact@chazai-partners.com"
SUBJECT = "Re, Synergies professionnelles et collaborations d'affaires / Chazai Wamba"

BODY = """Chère Maître Chazai,

Je vous remercie vivement, ainsi que votre équipe, pour cette précision concernant l'évolution de votre cabinet vers Chazai Wamba.

Je m'adresse directement à vous au regard de votre leadership reconnu dans le conseil juridique de haut niveau et la structuration d'opérations stratégiques en zone OHADA et au Cameroun.

Domtom Connect développe une plateforme d'affaires reliant des dirigeants, des investisseurs et des porteurs de projets d'envergure répartis sur toute la Caraïbe, le continent africain et sa diaspora.

Nos membres expriment des besoins réguliers en accompagnement juridique d'élite pour leurs implantations transfrontalières, leurs levées de fonds et leurs opérations de croissance externe entre l'Afrique centrale et l'international.

Seriez-vous disposée à échanger une quinzaine de minutes cette semaine afin d'envisager des synergies d'apport d'affaires et de mise en relation ciblée pour Chazai Wamba ?

Vous pouvez me joindre directement au 07 45 61 74 97 ou choisir un créneau selon vos disponibilités sur calendly.com/domtomconnect/30min

Très cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min

Le 28 septembre 2026, l'équipe Chazai Wamba a écrit,
> Dear Madam, Dear Sir,
> Your email has been duly received.
> As from April 6, 2022, Chazai & Partners became Chazai Wamba.
> Thank you for using our new electronic addresses as follows, (1st letter of first name)(family name)@chazai-wamba.com
> For instance, Aurélie Chazai -> achazai@chazai-wamba.com 
> Kind regards,
> The Chazai Wamba Team
> www.chazai-wamba.com"""

# Safety Audit
assert ":" not in SUBJECT, "Colon found in SUBJECT"
assert ":" not in BODY, "Colon found in BODY"
assert " - " not in SUBJECT, "Mid-sentence dash in SUBJECT"
assert " - " not in BODY, "Mid-sentence dash in BODY"
assert "toute la Caraïbe, le continent africain et sa diaspora" in BODY, "Sacred formula missing"
assert "entraide" not in BODY.lower(), "Banned word entraide"
assert "ddc" not in BODY.lower(), "Typo DDC"

print("Reply message passed all strict safety checks!")

msg = MIMEText(BODY, "plain", "utf-8")
msg["Subject"] = SUBJECT
msg["From"] = f"Loïc Villeronce - Domtom Connect <{SENDER_EMAIL}>"
msg["To"] = RECIPIENT
msg["Cc"] = CC_EMAIL
msg["Date"] = formatdate(localtime=True)
msg["In-Reply-To"] = PARENT_MSG_ID
msg["References"] = PARENT_MSG_ID
msg["Message-ID"] = make_msgid(domain="domtom-connect.com")

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, [RECIPIENT, CC_EMAIL], msg.as_string())

print(f"Reply sent successfully to {RECIPIENT} (CC: {CC_EMAIL}) in thread {PARENT_MSG_ID}!")
