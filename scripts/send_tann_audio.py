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

RECIPIENT = "hello@tann.audio"
RECIPIENT_NAME = "Gérald Joseph-Alexandre - Tann"

SUBJECT = "Échange entre créateurs audio et synergies / Podcast Insulink x Tann"

BODY = """Bonjour Gérald,

Bravo pour ce que vous développez avec Tann au Lamentin. Créer la première plateforme audio dédiée aux récits et aux créations des Outre-mer est une démarche que je salue tout particulièrement.

En tant que créateur du podcast Insulink, où je partage les coulisses et la vision de nos territoires, j'ai tout de suite été sensible à ce que vous bâtissez.

En parallèle de ce format audio, je développe actuellement l'écosystème Domtom Connect et la plateforme DTC Pulse, avec l'ambition de créer des ponts économiques solides entre toute la Caraïbe, le continent africain et sa diaspora.

Comme nous partageons cet attachement viscéral à faire résonner la voix et les projets de nos îles, je me suis dit qu'il serait naturel d'échanger de vive voix. Que ce soit pour partager nos retours d'expérience sur l'audio, envisager la diffusion de formats comme Insulink sur Tann ou imaginer des passerelles entre nos univers.

Seriez-vous ouvert à un court échange téléphonique de dix minutes ces prochains jours pour faire connaissance ?

Si vous le souhaitez, vous pouvez choisir le créneau qui vous convient le mieux sur ce lien
calendly.com/domtomconnect/30min

Bonne continuation à toute l'équipe de Tann et au plaisir d'échanger.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect & Podcast Insulink
Plateforme www.domtomconnect.com
"""

def send_email():
    print(f"=== ENVOI DU MESSAGE D'APPROCHE À {RECIPIENT_NAME} ({RECIPIENT}) ===", flush=True)

    # 1. Règle absolue : aucun deux-points dans le corps ou l'objet
    if ":" in BODY or ":" in SUBJECT:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le message !")

    # 2. Validation DNS / MX
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX réussie pour {RECIPIENT}.", flush=True)

    # 3. Préparation du message MIME
    msg = MIMEText(BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Gérald Joseph-Alexandre <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Email envoyé avec succès à {RECIPIENT} !", flush=True)

    # 5. Historisation dans contacts_deja_contactes.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    if RECIPIENT not in db.get("emails", []):
        db.setdefault("emails", []).append(RECIPIENT)
    if "Tann" not in db.get("companies", []):
        db.setdefault("companies", []).append("Tann")

    db.setdefault("contacts", []).append({
        "email": RECIPIENT,
        "company": "Tann (tann.audio)",
        "contact_name": "Gérald Joseph-Alexandre",
        "action": "outbound_partnership_podcast_insulink",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_email()
