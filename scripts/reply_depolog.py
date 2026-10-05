import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "depolog.tls@gmail.com"
LAST_MSG_ID = "<DS7PR17MB66334D8EE174CB830D683E95F78D2@DS7PR17MB6633.namprd17.prod.outlook.com>"

subject = "Re, Opportunité logistique et visibilité diaspora"

body = """Bonjour Allann,

Un grand merci pour votre retour, c'est un plaisir d'échanger avec vous.

Aucun problème, faisons au plus simple sans lien ni intermédiaire. Dites-moi quel jour et quelle heure vous conviendraient le mieux cette semaine pour que je vous appelle directement sur votre mobile au 06.98.73.57.62 pour cet échange informel de dix minutes.

Au plaisir d'échanger prochainement et d'envisager nos synergies logistiques.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect et DTC Pulse
domtomconnect@gmail.com

---
Le 28 sept. 2026 à 14h20, depo log (depolog.tls@gmail.com) a écrit,
> Bonjour
> Nous n'arrivons pas à cliquer sur le lien des créneaux horaires mais oui nous sommes disponible pour un échange informel..."""

# Strict safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")
if "calendly" in body.lower():
    raise ValueError("Interdit - Calendly ne doit pas être mentionné")

def send_reply(dry_run=False):
    print(f"Destinataire, {RECIPIENT_TO}")
    print(f"Sujet, {subject}")
    print(f"In-Reply-To, {LAST_MSG_ID}")
    
    if dry_run:
        print("\n--- CORPS DU MESSAGE (DRY RUN) ---")
        print(body)
        print("----------------------------------")
        print("\nValidation 100% réussie. Zéro deux-points, zéro tiret d'incise, zéro lien Calendly superflu.")
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
        print(f"EMAIL ENVOYÉ AVEC SUCCÈS À DEPOLOG ! (ID: {new_id})")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    send_reply(dry_run=dry)
