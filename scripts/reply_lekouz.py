import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "brasserie@lekouz.com"
LAST_MSG_ID = "<CABx=ar7o9L60wfL6AkncU3rynEX7dzhtUzNrkScvGAUnEOx=+g@mail.gmail.com>"

subject = "Re, Brassage artisanal péi et expansion des débouchés locaux / Brasserie Lékouz"

body = """Bonjour,

Un grand merci pour votre retour et pour votre accueil enthousiaste.

C'est un véritable plaisir d'échanger avec vous. Votre suggestion d'organiser des rencontres professionnelles pour les membres de Domtom Connect directement à la brasserie rejoint parfaitement notre vision, créer des passerelles concrètes entre entrepreneurs locaux et avec la diaspora.

Afin de caler ce premier échange selon vos disponibilités et votre timing, vous pouvez choisir directement le créneau qui vous convient sur notre agenda,

calendly.com/domtomconnect/30min

Au plaisir de faire connaissance et de construire ces synergies ensemble.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect et DTC Pulse
domtomconnect@gmail.com

---
Le 28 sept. 2026 à 13h07, Brasserie LEKOUZ (brasserie@lekouz.com) a écrit,
> Bonjour,
> Merci pour votre message et pour votre proposition.
> Nous sommes tout à fait intéressés pour échanger avec vous et découvrir les possibilités de collaboration avec Domtom Connect..."""

# Strict safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")
if "07 " in body or "06 " in body:
    raise ValueError("Interdit - Numéro de téléphone détecté dans le corps")

def send_reply(dry_run=False):
    print(f"Destinataire, {RECIPIENT_TO}")
    print(f"Sujet, {subject}")
    print(f"In-Reply-To, {LAST_MSG_ID}")
    
    if dry_run:
        print("\n--- CORPS DU MESSAGE (DRY RUN) ---")
        print(body)
        print("----------------------------------")
        print("\nValidation 100% réussie. Zéro deux-points, zéro tiret d'incise, zéro numéro de téléphone, orthographe Domtom Connect validée.")
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
        print(f"EMAIL ENVOYÉ AVEC SUCCÈS À LA BRASSERIE LÉKOUZ ! (ID: {new_id})")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    send_reply(dry_run=dry)
