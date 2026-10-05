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

RECIPIENT = "contact@mediasystem.cm"
RECIPIENT_NAME = "Narcisse NKODO - Media System SARL"

ORIGINAL_MSG_ID = "<14364FA1-AB52-0449-AB41-9C23B91E16E1@hxcore.ol>"
INITIAL_OUTBOUND_ID = "<179043693862.24148.9087655333581811306@domtomconnect.com>"

SUBJECT = "Re: Ingénierie informatique et synergies / Media System"

MY_REPLY = """Bonjour Narcisse,

Merci pour votre message et pour ces précisions.

C'est parfaitement compréhensible. Notre valeur ajoutée se situe justement sur la création de synergies d'affaires et la mise en relation entre des porteurs de projets et entreprises de toute la Caraïbe, du continent africain et de sa diaspora qui recherchent des compétences techniques fiables.

Ce sera un vrai plaisir d'échanger avec vous ces prochains jours pour faire connaissance et regarder comment positionner Media System sur ces opportunités de collaboration.

Afin de caler un court échange téléphonique selon vos disponibilités, je vous laisse choisir le créneau qui vous convient le mieux sur ce lien
calendly.com/domtomconnect/30min

Bonne fin de week-end à Yaoundé et au plaisir d'échanger.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 26 sept. 2026 à 17:56, contact@mediasystem.cm a écrit :
> Bonjour Loïc,
> Merci pour votre message et pour l’intérêt porté à Media System.
> De notre côté, l’activité évolue progressivement, avec nos propres priorités et projets, sans enjeu opérationnel particulier nécessitant actuellement un accompagnement externe.
> Je reste toutefois ouvert à découvrir Domtom Connect, notamment les opportunités concrètes de mise en relation ou de collaboration que votre réseau peut offrir à une entreprise comme Media System.
> Bien cordialement,
> Narcisse NKODO
> Media System SARL
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
    msg["To"] = f"Narcisse NKODO <{RECIPIENT}>"
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
        "company": "Media System SARL",
        "action": "reply_threaded_tech_synergies",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reply()
