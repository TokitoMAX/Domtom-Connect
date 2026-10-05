import smtplib, ssl, json, sys, os
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT = "contact@damedia-agency.com"
RECIPIENT_NAME = "Jorys Damas / Damedia Agency"

ORIGINAL_MSG_ID = "<1790510277866067875.1790510277@damedia-agency.com>"
INITIAL_OUTBOUND_ID = "<179043637981.24148.819955784955934917@domtomconnect.com>"

SUBJECT = "Re: Échange sur le développement digital / Damedia Agency"

MY_REPLY = """Bonjour Jorys,

Merci pour votre retour.

Chez DomTom Connect, nous rassemblons et connectons des entreprises et porteurs de projets à travers nos espaces d'échange, notre groupe d'entraide et l'application DTC Pulse.

Ce sera un plaisir de faire connaissance lors d'un court échange de dix minutes, afin de mieux comprendre vos expertises avec Damedia Agency et voir comment nous pourrions collaborer ou créer des passerelles utiles pour notre communauté.

Pour que vous puissiez choisir le créneau qui s'adapte le mieux à votre emploi du temps en fin de journée ou le samedi, je vous laisse réserver directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de notre échange.

Bien cordialement,

Loïc Villeronce
Fondateur — DomTom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 27 sept. 2026 à 11:58, Damedia Agency <contact@damedia-agency.com> a écrit :
> Bonjour Monsieur Villeronce,
> Merci pour votre message et pour votre retour sur le travail de Damedia.
> Pour répondre directement à votre question : notre priorité aujourd'hui se situe du côté des opportunités régionales. Damedia est une agence digitale et créative basée à Petit-Bourg, structurée autour de sept expertises création de sites web, référencement, réseaux sociaux, photographie, vidéo, drone FPV cinématique et cartes de visite NFC...
> Je suis disponible pour votre point de dix minutes. Mes créneaux les plus confortables sont en fin de journée en semaine, ou le samedi ; dites-moi ce qui vous arrange et je m'adapte.
> Bien cordialement,
> Jorys Damas — Fondateur
"""

FULL_BODY = MY_REPLY + QUOTE_THREAD

def send_reply():
    print(f"=== ENVOI DE LA RÉPONSE THREADÉE À {RECIPIENT_NAME} ===", flush=True)

    if ":" in MY_REPLY:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le corps rédigé !")

    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX réussie pour {RECIPIENT}.", flush=True)

    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Jorys Damas <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = ORIGINAL_MSG_ID
    msg["References"] = f"{INITIAL_OUTBOUND_ID} {ORIGINAL_MSG_ID}"

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Réponse envoyée avec succès dans le fil existant à {RECIPIENT} !", flush=True)

if __name__ == "__main__":
    send_reply()
