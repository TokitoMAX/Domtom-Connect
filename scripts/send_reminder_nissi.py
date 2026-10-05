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

PRIMARY_RECIPIENT = "mastergrill.barresto@gmail.com"
CC_RECIPIENT = "emmanuellanissi90@gmail.com"
RECIPIENT_NAME = "Nissi Georges Pierre"

ORIGINAL_MSG_ID = "<CAJj_-c=2d8rcrVHEMJNv6dV52_Dw0PBsFiGd4O2eVSdJUt3n1Q@mail.gmail.com>"
INITIAL_OUTBOUND_ID = "<6ab30f46.e862d496.1ec487.dd66@mx.google.com>"
PREV_REPLY_ID = "<179046589760.8376.11562589387266585139@domtomconnect.com>"

SUBJECT = "Re, Un petit mot pour Master Grill Bar Resto / Rentabilité et nouvelle visibilité"

MY_REPLY = """Bonjour Nissi,

Je vous écris ce court mot pour vous confirmer notre rendez-vous d'échange prévu ce matin.

Pour tenir compte du décalage horaire entre Haïti et Paris, notre créneau est fixé à 00h30 heure locale au Cap-Haïtien, ce qui correspond à 06h30 heure de Paris.

Voici le lien direct pour vous connecter à la visioconférence Google Meet
meet.google.com/qdk-jtcy-dxj

Si par hasard cet horaire nocturne en Haïti devenait trop contraignant pour vous, n'hésitez surtout pas à me le signaler et nous pourrons très facilement reprogrammer notre appel sur une plage plus confortable en journée.

Au plaisir de faire votre connaissance et d'échanger autour de Master Grill Bar Resto.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 27 sept. 2026 à 01:38, Loïc Villeronce <domtomconnect@gmail.com> a écrit :
> Bonjour Nissi,
> Merci beaucoup pour votre retour chaleureux et encourageant.
> Je mesure parfaitement les réalités actuelles en Haïti et l'impératif de préserver chaque point de marge face aux commissions prédatrices. C'est exactement dans cet esprit que nous avons conçu DTC Pulse, pour développer votre visibilité directe et vous permettre de garder la pleine maîtrise de vos revenus.
> Ce sera un vrai plaisir d'échanger de vive voix avec vous ces prochains jours pour vous présenter concrètement l'application et voir comment nous pouvons collaborer avec Master Grill.
> Afin que vous puissiez choisir le créneau qui s'adapte le mieux à votre planning, je vous laisse réserver directement sur ce lien
> calendly.com/domtomconnect/30min
> Au plaisir de notre prochain échange.
> Bien cordialement,
> Loïc Villeronce
>
> Le 26 sept. 2026 à 14:09, MASTER Grill <mastergrill.barresto@gmail.com> a écrit :
> Bonjour Loïc,
> Merci beaucoup pour votre message et pour l’intérêt porté à Master Grill Bar Resto.
> Votre approche m’intéresse particulièrement, notamment l’idée de pouvoir développer notre visibilité tout en réduisant l’impact des commissions sur nos marges. Dans le contexte actuel en Haïti, toute solution concrète permettant aux restaurateurs de générer davantage de chiffre d’affaires tout en gardant une meilleure maîtrise de leurs coûts mérite certainement d’être explorée.
> Je serais donc ravie d’en apprendre davantage sur DTC Pulse, son fonctionnement et la manière dont vous envisagez de travailler avec des établissements comme le nôtre.
> Je suis disponible pour un court échange téléphonique cette semaine.
> Au plaisir d’échanger avec vous et de découvrir ce que Domtom Connect développe.
> Bien cordialement,
> Nissi Pierre
> Master Grill Bar Resto
> Cap-Haïtien, Haïti
"""

FULL_BODY = MY_REPLY + QUOTE_THREAD

def send_reminder():
    print(f"=== ENVOI DU RAPPEL À {RECIPIENT_NAME} (MASTER GRILL) ===", flush=True)

    # 1. Règle absolue : aucun deux-points dans notre texte rédigé
    if ":" in MY_REPLY:
        raise ValueError("Erreur critique : Présence de deux-points interdite dans le corps rédigé !")

    # Règle absolue : aucun tiret cadratin ou d'incise au milieu des phrases
    if " - " in MY_REPLY:
        raise ValueError("Erreur critique : Présence de tiret d'incise ' - ' interdite au milieu d'une phrase !")

    # 2. Validation DNS / MX pour les destinataires
    for email_to_check in [PRIMARY_RECIPIENT, CC_RECIPIENT]:
        ok, msg = verify_email_target(email_to_check)
        if not ok:
            raise ValueError(f"Erreur DNS/MX pour {email_to_check} : {msg}")
        print(f"Validation DNS/MX réussie pour {email_to_check}.", flush=True)

    # 3. Préparation du message MIME avec threading parfait
    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Nissi Pierre <{PRIMARY_RECIPIENT}>"
    msg["Cc"] = CC_RECIPIENT
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = PREV_REPLY_ID
    msg["References"] = f"{INITIAL_OUTBOUND_ID} {ORIGINAL_MSG_ID} {PREV_REPLY_ID}"

    all_recipients = [PRIMARY_RECIPIENT, CC_RECIPIENT]

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, all_recipients, msg.as_string())

    print(f"Rappel envoyé avec succès dans le fil à {PRIMARY_RECIPIENT} et en copie à {CC_RECIPIENT} !", flush=True)

    # 5. Historisation
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": PRIMARY_RECIPIENT,
        "cc": CC_RECIPIENT,
        "company": "Master Grill Bar Resto",
        "action": "reminder_rdv_00h30_haiti_meet_link",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reminder()
