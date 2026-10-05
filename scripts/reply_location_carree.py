import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "location.carree@gmail.com"
LAST_MSG_ID = "<CADxaTWZLZ9v0GNjzt3O7xGhDWXQxqWRjz55j69368-_gaRUGGA@mail.gmail.com>"

subject = "Re, Vos priorités d'activité de location / Location Carrée"

body = """Bonjour David,

Merci beaucoup pour votre retour franc et chaleureux.

Je comprends tout à fait la charge sur votre agenda et vos priorités actuelles, aucun souci pour l'échange téléphonique.

Ravi en tout cas que les problématiques résonnent avec votre réalité réunionnaise. Pour ne pas vous faire perdre de temps, je vous laisse simplement le lien d'accès à l'espace DTC Pulse si vous souhaitez y jeter un œil à l'occasion, en totale autonomie,

www.domtomconnect.com

La porte reste ouverte si vous souhaitez un jour échanger sur les synergies locales ou vos retours d'expérience.

Très bon développement à Location Carrée et une excellente continuation,

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
domtomconnect@gmail.com

---
Le 29 sept. 2026 à 06h25, David DA COSTA SA (location.carree@gmail.com) a écrit,
> Bonjour Monsieur Villeronce,
> Je vous remercie pour votre message, vos félicitations et pour la présentation de Domtom Connect.
> Votre démarche et les problématiques évoquées sont effectivement intéressantes. Cependant, je ne souhaite pas donner suite à une prise de contact téléphonique pour le moment, mon agenda étant déjà bien chargé et mes priorités actuelles étant orientées vers d'autres sujets.
> Je vous remercie néanmoins d'avoir pensé à Location Carrée et vous souhaite une belle continuation dans le développement de Domtom Connect.
> Je vous souhaite une belle journée et reste disponible au besoin,
> Bien Cordialement,
> David DA COSTA SA"""

# Safety checks
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body.replace("https://", "").replace("http://", ""):
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
        print(f"EMAIL ENVOYÉ AVEC SUCCÈS À LOCATION CARRÉE ! (ID: {new_id})")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    send_reply(dry_run=dry)
