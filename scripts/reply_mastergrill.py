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

RECIPIENT = "mastergrill.barresto@gmail.com"
RECIPIENT_NAME = "Nissi Pierre - Master Grill Bar Resto"

# Headers RFC 2822 pour le threading parfait dans le fil existant
ORIGINAL_MSG_ID = "<CAJj_-c=2d8rcrVHEMJNv6dV52_Dw0PBsFiGd4O2eVSdJUt3n1Q@mail.gmail.com>"
INITIAL_OUTBOUND_ID = "<6ab30f46.e862d496.1ec487.dd66@mx.google.com>"

SUBJECT = "Re: Un petit mot pour Master Grill Bar Resto / Rentabilité et nouvelle visibilité"

MY_REPLY = """Bonjour Nissi,

Merci beaucoup pour votre retour chaleureux et encourageant.

Je mesure parfaitement les réalités actuelles en Haïti et l'impératif de préserver chaque point de marge face aux commissions prédatrices. C'est exactement dans cet esprit que nous avons conçu DTC Pulse, pour développer votre visibilité directe et vous permettre de garder la pleine maîtrise de vos revenus.

Ce sera un vrai plaisir d'échanger de vive voix avec vous ces prochains jours pour vous présenter concrètement l'application et voir comment nous pouvons collaborer avec Master Grill.

Afin que vous puissiez choisir le créneau qui s'adapte le mieux à votre planning, je vous laisse réserver directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de notre prochain échange.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
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
    msg["To"] = f"Nissi Pierre <{RECIPIENT}>"
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
        "company": "Master Grill Bar Resto",
        "action": "reply_threaded_call_prochains_jours",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reply()
