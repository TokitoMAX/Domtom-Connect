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

RECIPIENT = "leylalouviers@lakazaley.com"
RECIPIENT_NAME = "Leyla Louviers - La Kaz A Ley"

IN_REPLY_TO = "<o4VEFG4OQ0OrYB9HEIaNvQ@geopod-ismtpd-136>"
REFERENCES = "<o4VEFG4OQ0OrYB9HEIaNvQ@geopod-ismtpd-136>"
SUBJECT = "Re, Échange Domtom Connect et La Kaz A Ley / Groupe WhatsApp Réseau Entreprises"

BODY_TEXT = """Bonjour Leyla,

Je tenais à vous remercier chaleureusement pour notre échange de cet après-midi autour de La Kaz A Ley et de votre belle dynamique culinaire à Nice.

Comme convenu lors de notre discussion, voici votre lien direct pour rejoindre le groupe WhatsApp officiel de notre réseau d'entreprises et prestataires

chat.whatsapp.com/Fe8LuB5IUa1K8JbP00qOdt

Cet espace vous permettra de tisser des liens avec d'autres entrepreneurs ultramarins, de suivre les opportunités de notre écosystème et de partager vos actualités.

Je reste bien entendu à votre entière disposition si vous avez la moindre question.

Très belle continuation à vous et un franc succès pour La Kaz A Ley.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 01 oct. 2026 à 18:33, Calendly <notifications@calendly.com> a écrit :
> Event Type: 30 Minute Meeting
> Invitee: leyla LOUVIERS
> Invitee Email: leylalouviers@lakazaley.com
> Activity: Food truck créole Nice, Chef à domicile, Traiteur Caraïben & Océan Indien
"""

FULL_BODY = BODY_TEXT + QUOTE_THREAD

def send_thank_you_leyla():
    print(f"=== ENVOI DU MESSAGE DE REMERCIEMENT ET LIEN WHATSAPP À {RECIPIENT_NAME} ===", flush=True)

    # 1. Vérification stricte des deux-points dans le texte rédigé
    if ":" in BODY_TEXT:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le corps rédigé !")

    # 2. Vérification stricte du tiret d'incise au milieu des phrases
    if " - " in BODY_TEXT:
        raise ValueError("Erreur critique : Présence de tiret d'incise ' - ' interdite au milieu d'une phrase !")

    # 3. Validation DNS / MX
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX réussie pour {RECIPIENT}.", flush=True)

    # 4. Message MIME avec threading parfait
    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Leyla Louviers <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = IN_REPLY_TO
    msg["References"] = REFERENCES

    # 5. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Email envoyé avec succès dans le fil à {RECIPIENT} !", flush=True)

    # 6. Historisation dans contacts_deja_contactes.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": RECIPIENT,
        "company": "La Kaz A Ley (Leyla Louviers)",
        "action": "post_call_thank_you_whatsapp_enterprise_invite",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_thank_you_leyla()
