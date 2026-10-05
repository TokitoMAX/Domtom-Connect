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

RECIPIENT = "soutien.scolaire.education@gmail.com"
RECIPIENT_NAME = "Mme Véronique Ringuet / Familles & Scolarité"

ORIGINAL_MSG_ID = "<CAPTGB719hpbMP8Sm+49Lur6LeySTXXZr-XaFWKXB=79wCvj+dA@mail.gmail.com>"
INITIAL_OUTBOUND_ID = "<179043558065.36348.8786263380055146055@domtomconnect.com>"

SUBJECT = "Re: Échange sur le soutien scolaire à Rémire-Montjoly / Familles et Scolarité"

MY_REPLY = """Bonjour Madame Ringuet,

Merci pour votre retour chaleureux et pour votre engagement essentiel auprès de la jeunesse et des familles en Guyane.

La prévention du décrochage scolaire, le renforcement de la confiance en soi et l'accompagnement personnalisé sont des piliers fondamentaux. Avec DomTom Connect et notre communauté active sur WhatsApp et l'application mobile DTC Pulse, notre vocation est justement de connecter les initiatives locales à fort impact social pour favoriser le partage d'expériences, la visibilité et la recherche d'opportunités de soutien.

Ce sera un vrai plaisir d'échanger avec vous pour explorer des synergies concrètes et voir comment vous apporter de la valeur.

Pour notre court point téléphonique, je suis disponible ce mardi à 10h30 ou ce jeudi à 15h00 (heure Guyane).

Pourriez-vous me confirmer le numéro sur lequel vous joindre, ou choisir directement le créneau qui s'adapte le mieux à votre emploi du temps sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de notre prochain échange.

Bien cordialement,

Loïc Villeronce
Fondateur — DomTom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 27 sept. 2026 à 07:02, veronique ringuet <soutien.scolaire.education@gmail.com> a écrit :
> Bonjour Monsieur Villeronce,
> Je vous remercie pour votre message et pour l'intérêt que vous portez aux actions de l'association Familles & Scolarité...
> Je serais donc intéressée pour en savoir davantage sur Domtom Connect, votre groupe d'entraide ainsi que sur DTC Pulse, et voir quelles passerelles pourraient éventuellement être envisagées avec Familles & Scolarité.
> Nous pouvons effectivement prévoir un court échange téléphonique.
> Bien cordialement,
> Mme Véronique Ringuet — Présidente
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
    msg["To"] = f"Mme Véronique Ringuet <{RECIPIENT}>"
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
