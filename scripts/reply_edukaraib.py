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

RECIPIENT = "contact@edukaraib.com"
RECIPIENT_NAME = "EduKaraib / Factur'Peyi"

ORIGINAL_MSG_ID = "<1a0deb0bbfe.6daa0bfb834895.3220181439287453384@edukaraib.com>"
INITIAL_OUTBOUND_ID = "<179038931825.25492.11151787413611185298@domtomconnect.com>"

SUBJECT = "Re: Échange sur vos besoins et accompagnement scolaire / EduKaraib"

MY_REPLY = """Bonjour,

Merci pour votre retour direct et pour cette proposition de synergie très pertinente.

Le sujet de la facture électronique pour nos entrepreneurs en Martinique, Guadeloupe et Réunion est un vrai enjeu d'actualité. Votre démarche pragmatique avec Factur'Peyi correspond tout à fait à la valeur concrète que nous souhaitons apporter aux membres de notre écosystème.

L'idée d'un outil simple de diagnostic pour notre communauté couplé à un modèle d'apport d'affaires m'intéresse.

Ce sera un vrai plaisir d'en discuter de vive voix ces prochains jours. Afin de choisir le moment qui s'adapte le mieux à votre emploi du temps, je vous laisse réserver directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de notre prochain échange.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 26 sept. 2026 à 19:08, Edukaraib <contact@edukaraib.com> a écrit :
> Bonjour Loic,
> Merci pour votre message, et pour le mot sur EduKaraib.
> Je vous propose de retourner votre question, parce que je crois que l'intérêt est de ce côté-là : je ne cherche pas d'accompagnement en ce moment, mais j'ai quelque chose d'utile pour vos membres.
> Je dirige aussi Factur'Peyi, un logiciel de facturation conçu pour les entreprises d'outre-mer. Depuis le 1er septembre, toute entreprise doit pouvoir recevoir une facture électronique, et l'émission devient obligatoire pour les TPE et PME au 1er septembre 2027. La Martinique, la Guadeloupe et La Réunion sont concernées. La Guyane et Mayotte ne le sont pas beaucoup l'ignorent, et se font vendre une mise en conformité inutile.
> Ce que je peux mettre à disposition de vos membres, gratuitement : les cinq questions qui leur disent en cinq minutes s'ils sont concernés, et ce qu'ils doivent faire s'ils le sont.
> Et si certains s'équipent ensuite, il y a un reversement pour vous. On en parlera si ça vous intéresse, pas avant.
> Dix minutes me vont très bien. Je suis disponible lundi après-midi dites-moi ce qui vous arrange.
> Bien à vous
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
    msg["To"] = f"EduKaraib <{RECIPIENT}>"
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
        "company": "EduKaraib / Factur'Peyi",
        "action": "reply_threaded_facturpeyi_partenariat",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reply()
