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

RECIPIENT = "buggyevasion02@gmail.com"
RECIPIENT_NAME = "Buggy Evasion (Saly - Sénégal)"

ORIGINAL_MSG_ID = "<CAJcwVT6z_Ln7pkRzjaCnktvYHJnJognM7OzLz20YoJ84BiqNMQ@mail.gmail.com>"
INITIAL_OUTBOUND_ID = "<179043472501.40268.12111582091428842981@domtomconnect.com>"

SUBJECT = "Re: Échange sur la mobilité touristique à Saly / Buggy Evasion"

MY_REPLY = """Bonjour,

Merci pour votre retour positif et votre réactivité.

Ce sera un vrai plaisir de faire votre connaissance, d'en savoir plus sur le développement de Buggy Evasion à Saly et de vous présenter concrètement les opportunités de synergies au sein de notre réseau d'affaires.

Pour convenir d'un court échange téléphonique ces prochains jours selon vos disponibilités, je vous laisse choisir le créneau qui vous arrange directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 26 sept. 2026 à 17:58, Buggy Evasion <buggyevasion02@gmail.com> a écrit :
> Avec plaisir.
"""

FULL_BODY = MY_REPLY + QUOTE_THREAD

def send_reply():
    print(f"=== ENVOI DE LA RÉPONSE THREADÉE À {RECIPIENT_NAME} ===", flush=True)

    # 1. Règle absolue : aucun deux-points dans notre texte rédigé
    if ":" in MY_REPLY:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le corps rédigé !")

    # 2. Validation DNS / MX
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX réussie pour {RECIPIENT}.", flush=True)

    # 3. Préparation du message MIME avec threading parfait
    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Buggy Evasion <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = ORIGINAL_MSG_ID
    msg["References"] = f"{INITIAL_OUTBOUND_ID} {ORIGINAL_MSG_ID}"

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Réponse envoyée avec succès dans le fil existant à {RECIPIENT} !", flush=True)

    # 5. Historisation dans contacts_deja_contactes.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": RECIPIENT,
        "company": "Buggy Evasion",
        "action": "reply_threaded_call_prochains_jours",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reply()
