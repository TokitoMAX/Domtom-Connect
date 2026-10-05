import os, sys, ssl, smtplib
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT = "ksassocies@ksassocies.com"
IN_REPLY_TO = "<BCFA91C9-AA69-4663-A8FB-C6D8D6858AAA@ksassocies.com>"
SUBJECT = "Re, Synergies d'affaires et collaborations avec Domtom Connect / KS & Associés Avocats"

BODY = """Bonjour Maître,

Je viens de constater une coquille technique dans ma signature précédente sur mon numéro de téléphone.

Mon WhatsApp direct officiel est le +33 6 20 78 33 77.

Et dans tous les cas, vous avez également accès à mon lien Calendly si vous préférez fixer directement un échange
calendly.com/domtomconnect/30min

Veuillez m'excuser pour cette précision matérielle.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
WhatsApp direct, +33 6 20 78 33 77
Plateforme web, www.domtomconnect.com"""

def check_rules():
    errors = []
    if ":" in SUBJECT:
        errors.append(f"Deux-points trouvé dans le sujet, {SUBJECT}")
    if ":" in BODY:
        errors.append("Deux-points trouvé dans le corps du message")
    if " - " in BODY or " - " in SUBJECT:
        errors.append("Tiret d'incise ' - ' trouvé au milieu d'une phrase")
    return errors

def send_correction():
    errors = check_rules()
    if errors:
        print("Erreurs détectées :", errors)
        return False

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        msg = MIMEText(BODY, "plain", "utf-8")
        msg["Subject"] = SUBJECT
        msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
        msg["To"] = f"KS & Associés <{RECIPIENT}>"
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
        msg["In-Reply-To"] = IN_REPLY_TO
        msg["References"] = IN_REPLY_TO

        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())
        print("EMAIL DE RECTIFICATION ENVOYÉ AVEC SUCCÈS À KS & ASSOCIÉS !")
    return True

if __name__ == "__main__":
    send_correction()
