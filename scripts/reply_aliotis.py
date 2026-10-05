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

RECIPIENT = "aliotis.plongee@gmail.com"
RECIPIENT_NAME = "Laurent Crepieux - Aliotis Plongée"

# Headers RFC 2822 pour le threading parfait dans le fil existant
ORIGINAL_MSG_ID = "<CB46CE4D-52C8-4A97-BAB7-FD9ED2AE0A67@gmail.com>"
INITIAL_OUTBOUND_ID = "<179043750214.44540.10844990283899682701@domtomconnect.com>"

SUBJECT = "Re: Sorties subaquatiques et opportunités / Aliotis Martinique"

MY_REPLY = """Bonjour Laurent,

Merci pour votre franchise.

Vous avez parfaitement raison. Aucun chef d'entreprise lucide ne débloque un budget pour quelque chose dont il ne mesure pas encore la valeur concrète.

À ce stade, parler de budget n'a aucun sens. Nous ne savons même pas encore si notre manière de travailler et notre vision correspondent à la réalité de votre club aux Trois-Îlets.

Notre cœur de métier chez Domtom Connect n'est pas de placer une prestation de plus. Nous accompagnons les entreprises de nos îles avec une approche globale à 360 degrés, car ce qui me tient le plus à cœur, c'est la réussite réelle et durable de nos partenaires sur le terrain.

Votre structure mérite d'occuper une place de premier plan en Martinique. Échangeons simplement dix minutes pour faire connaissance, comprendre vos défis actuels et voir comment vous vous projetez sur les mois à venir.

Si après cet échange vous estimez que nos visions s'alignent et qu'une passerelle intelligente est possible, nous regarderons comment avancer ensemble. Sinon, nous en resterons là et nous aurons au moins fait connaissance entre professionnels d'ici.

Vous pouvez choisir le moment qui vous convient le mieux sur ce lien
calendly.com/domtomconnect/30min

Bonne fin de week-end à vous et au plaisir d'échanger.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 26 sept. 2026 à 17:56, Aliotis Plongée <aliotis.plongee@gmail.com> a écrit :
> Bonjour Loic
> Merci de vouloir m'aider car je pense que mon produit mérite d'être connu et d'être dans les toutes premières activités à faire en martinique mais j'ai bien peur que cette collaboration va être payante et je n'ai pas les budgets pour.
> Bonne soirée 
> Laurent Crepieux
> Aliotis plongée
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

    # 3. Préparation du message MIME avec threading
    msg = MIMEText(FULL_BODY, "plain", "utf-8")
    msg["Subject"] = Header(SUBJECT, "utf-8")
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = f"Laurent Crepieux <{RECIPIENT}>"
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
        "company": "Aliotis Plongée",
        "action": "reply_threaded_budget_desamorce",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reply()
