import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "info@lissadelaw.com"
LAST_MSG_ID = "<1787BD83-C630-2C4A-A9BA-1470DEB0360B@hxcore.ol>"

subject = "Re, Synergies professionnelles et collaborations d'affaires / Cabinet Lissade"

body = """Bonsoir,

Merci pour votre retour et pour votre ouverture.

Dans le cadre du développement de Domtom Connect, notre démarche est de créer des passerelles solides avec des acteurs juridiques reconnus dans la région afin d'accompagner au mieux les dynamiques économiques et les projets de la diaspora.

Seriez-vous disponible pour un court échange de dix minutes cette semaine, simplement pour faire connaissance de vive voix et échanger sur les perspectives d'affaires en Haïti ?

Si cela vous convient, vous pouvez sélectionner un créneau selon vos disponibilités sur notre agenda,
calendly.com/domtomconnect/30min

Au plaisir d'échanger prochainement.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
domtomconnect@gmail.com

---
Le 28 sept. 2026 à 19h14, Cabinet Lissade (info@lissadelaw.com) a écrit,
> Bonsoir Loic
> Nous serons heureux d’aider vos clients avec leurs besoins en services juridiques en Haïti. Nous restons a votre disposition pour toute demande spécifique
> Cordialement,
> Cabinet Lissade / Lissade Law Firm"""

# Safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")

def send_reply(dry_run=False):
    print(f"Destinataire, {RECIPIENT_TO}")
    print(f"Sujet, {subject}")
    print(f"In-Reply-To, {LAST_MSG_ID}")
    
    if dry_run:
        print("\n--- CORPS DU MESSAGE (DRY RUN) ---")
        print(body)
        print("----------------------------------")
        print("Validation 100% réussie. Zéro deux-points, zéro tiret d'incise, citation complète.")
        return

    context = ssl.create_default_context()
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_TO
    msg["Date"] = formatdate(localtime=True)
    new_id = make_msgid(domain="domtomconnect.com")
    msg["Message-ID"] = new_id
    msg["In-Reply-To"] = LAST_MSG_ID
    msg["References"] = LAST_MSG_ID

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT_TO], msg.as_string())
        print(f"EMAIL ENVOYÉ AVEC SUCCÈS AU CABINET LISSADE ! (ID: {new_id})")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    send_reply(dry_run=dry)
