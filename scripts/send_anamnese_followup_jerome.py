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

RECIPIENT = "butterflytours971@gmail.com"
RECIPIENT_NAME = "Jérôme SYDEIN (Butterfly Tours 971)"
SUBJECT = "Votre diagnostic entrepreneurial Domtom Connect / Échange et prochaines étapes"

BODY_TEXT = """Bonjour Jérôme,

Merci pour votre démarche et pour avoir complété l'anamnèse entrepreneuriale sur Domtom Connect.

Votre profil diagnostiqué, Le perfectionniste en fuite, révèle une belle exigence de qualité et un réel souci du détail pour votre activité en Guadeloupe avec Butterfly Tours. C'est souvent l'indicateur d'une offre solide, qui mérite désormais de fluidifier son développement commercial et de gagner en temps.

Ce serait un plaisir d'échanger directement avec vous lors d'un appel d'une trentaine de minutes. Cela nous permettra de débriefer votre diagnostic, de faire le point sur vos priorités actuelles et de voir très concrètement ce que notre écosystème peut vous apporter.

Pour caler cet échange selon vos disponibilités en Guadeloupe, je vous invite à choisir le créneau qui vous convient le mieux sur ce lien
calendly.com/domtomconnect/30min

Au plaisir d'échanger de vive voix avec vous.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

def send_followup_jerome():
    print(f"=== ENVOI DU SUIVI ANAMNÈSE À {RECIPIENT_NAME} ===", flush=True)

    # 1. Règle absolue : aucun deux-points dans le corps rédigé
    if ":" in BODY_TEXT:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le corps rédigé !")

    # 2. Règle absolue : aucun tiret d'incise au milieu des phrases
    if " - " in BODY_TEXT:
        raise ValueError("Erreur critique : Présence de tiret d'incise ' - ' interdite au milieu d'une phrase !")

    # 3. Validation DNS / MX
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX réussie pour {RECIPIENT}.", flush=True)

    # 4. Message MIME
    msg = MIMEText(BODY_TEXT, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Jérôme SYDEIN <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

    # 5. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Email envoyé avec succès à {RECIPIENT} !", flush=True)

    # 6. Historisation
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": RECIPIENT,
        "company": "Butterfly Tours 971 (Jérôme SYDEIN)",
        "action": "anamnese_followup_calendly_invitation",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_followup_jerome()
