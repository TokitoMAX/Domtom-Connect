import smtplib, ssl, json, time, sys, os
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

RECIPIENT = "binnur.alkan@boussolepatrimoine.fr"
RECIPIENT_NAME = "Binnur Alkan"

CALENDAR_MSG_ID = "<calendar-b15c447f-563d-4a2c-9e72-98fa85d66fa9@google.com>"

SUBJECT = "Re, Rendez-vous Domtom Connect et Boussole Patrimoine / Confirmation 10h30 heure Réunion"

MY_REPLY = """Bonjour Binnur,

Je vous remercie pour la validation de notre rendez-vous d'échange prévu ce matin.

Pour tenir compte du fuseau horaire de La Réunion, notre créneau est bien fixé à 10h30 heure locale, ce qui correspond à 08h30 heure de Paris.

Voici le lien direct pour rejoindre notre visioconférence Google Meet
meet.google.com/mce-fomd-qye

Je me réjouis d'échanger avec vous autour des synergies possibles entre Boussole Patrimoine et le réseau Domtom Connect.

À tout à l'heure pour notre échange.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 28 sept. 2026 à 08:56, binnur.alkan@boussolepatrimoine.fr (Google Agenda) a écrit :
> Binnur Alkan and Loïc VILLERONCE
> jeudi 1 oct. 2026 ⋅ 8:30am – 9am (Heure d'Europe centrale - Paris)
> Soit 10:30am – 11am (Heure de La Réunion)
> Participer avec Google Meet : meet.google.com/mce-fomd-qye
> Note : Partenariat/Collaboration suite au mail
"""

FULL_BODY = MY_REPLY + QUOTE_THREAD

def send_reminder():
    print(f"=== ENVOI DU RAPPEL À {RECIPIENT_NAME} (BOUSSOLE PATRIMOINE) ===", flush=True)

    # 1. Règle absolue : aucun deux-points dans notre texte rédigé
    if ":" in MY_REPLY:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le corps rédigé !")

    # Règle absolue : aucun tiret cadratin ou d'incise au milieu des phrases
    if " - " in MY_REPLY:
        raise ValueError("Erreur critique : Présence de tiret d'incise ' - ' interdite au milieu d'une phrase !")

    # 2. Validation DNS / MX pour le destinataire
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX réussie pour {RECIPIENT}.", flush=True)

    # 3. Préparation du message MIME avec threading
    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Binnur Alkan <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = CALENDAR_MSG_ID
    msg["References"] = CALENDAR_MSG_ID

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Rappel envoyé avec succès dans le fil à {RECIPIENT} !", flush=True)

    # 5. Historisation
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": RECIPIENT,
        "company": "Boussole Patrimoine",
        "action": "reminder_rdv_10h30_reunion_meet_link",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reminder()
