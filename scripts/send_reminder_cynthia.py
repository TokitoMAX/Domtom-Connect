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

RECIPIENT = "commerciale.udd@gmail.com"
RECIPIENT_NAME = "Cynthia Zèbre - Univers Du Déménagement"

ORIGINAL_OUTBOUND_ID = "<179054153033.23756.10230042382957139071@domtomconnect.com>"
CALENDAR_ACCEPT_ID = "<calendar-c969c52d-ced1-44bd-b201-40fe7bfac850@google.com>"

SUBJECT = "Re, Rendez-vous Domtom Connect et Univers Du Déménagement / Confirmation 15h30 Paris (09h30 Guadeloupe)"

MY_REPLY = """Bonjour Cynthia,

Je vous écris ce court mot pour vous confirmer notre rendez-vous d'échange prévu cet après-midi.

Pour tenir compte du décalage horaire entre la Guadeloupe et la métropole, notre créneau est bien fixé à 09h30 heure locale en Guadeloupe, ce qui correspond à 15h30 heure de Paris.

Voici votre lien direct pour vous connecter à la visioconférence Google Meet
meet.google.com/xpy-xevy-srk

Je me réjouis d'échanger avec vous tout à l'heure autour des activités de Univers Du Déménagement et des opportunités de synergie avec notre réseau.

À tout à l'heure pour notre échange.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 30 sept. 2026 à 15:03, Commerciale Univers du déménagement <commerciale.udd@gmail.com> a écrit :
> ZEBRE Cynthia and Loïc VILLERONCE
> jeudi 1 oct. 2026 ⋅ 3:30pm – 4pm (Heure de Paris)
> Soit 9:30am – 10am (Heure de Guadeloupe)
> Participer avec Google Meet : meet.google.com/xpy-xevy-srk
"""

FULL_BODY = MY_REPLY + QUOTE_THREAD

def send_reminder():
    print(f"=== ENVOI DU RAPPEL À {RECIPIENT_NAME} ===", flush=True)

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

    # 3. Préparation du message MIME avec threading parfait
    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Cynthia Zèbre <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = CALENDAR_ACCEPT_ID
    msg["References"] = f"{ORIGINAL_OUTBOUND_ID} {CALENDAR_ACCEPT_ID}"

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
        "company": "Univers Du Déménagement (UDD SAS)",
        "action": "reminder_rdv_15h30_paris_09h30_guadeloupe_meet_link",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reminder()
