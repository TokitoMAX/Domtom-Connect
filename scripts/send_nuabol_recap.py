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

RECIPIENT = "nuabolsaumur@gmail.com"
RECIPIENT_NAME = "Françoise et Christophe FRAPPEZ - NUABOL"

INITIAL_OUTBOUND_ID = "<179066918691.52480.14711588591426831753@domtomconnect.com>"
LAST_NUABOL_MSG_ID = "<CABL6C194XookAYhm3gyNC6B+=sBDSm6kCyXFxMM9o-8n7_vsxA@mail.gmail.com>"

SUBJECT = "Re, Lien de connexion pour notre échange en visio / Domtom Connect & NUABOL"

MY_REPLY = """Bonjour Christophe, bonjour Françoise,

J'espère que vous allez bien depuis notre échange de mardi.

Suite à notre première discussion, j'ai réalisé un audit stratégique complet de votre présence en ligne pour voir concrètement comment développer vos commandes.

La qualité de vos plats et vos retours clients (4,9 sur 5) sont remarquables, et sur smartphone votre site assure l'essentiel.

En revanche, l'analyse approfondie de vos données sous le capot révèle un vrai manque à gagner sur lequel vous perdez des clients chaque semaine

1. Plus de 80% de vos visiteurs sur Google vous connaissent déjà
Vos données montrent que presque tout votre trafic provient de personnes qui tapent déjà le nom Nuabol. Vous êtes donc très bien identifiés par vos habitués, mais vous passez à côté de tous ceux qui cherchent un restaurant végétal ou créole à Angers et Saumur sans connaître votre enseigne.

2. Des passerelles manquantes vers la commande
Vos plats donnent envie sur les réseaux sociaux, mais il manque un parcours direct et fluide pour transformer un abonné Instagram ou un visiteur sur ordinateur en commande ou réservation immédiate.

3. Des anomalies techniques sur votre site
Certains liens clés en bas de page renvoient vers la plateforme Wix au lieu de vos propres profils, ce qui disperse votre audience.

J'ai préparé une synthèse visuelle de cet audit avec le plan d'action pour corriger ces points et doper vos réservations.

Étant donné votre quotidien bien chargé en restaurant, le but est de vous faire gagner du temps et de voir comment nous pouvons mettre en place ces solutions ensemble.

Je vous propose qu'on prenne 30 minutes en visio pour que je vous présente ces résultats et voir comment collaborer pour booster NUABOL.

Vous pouvez choisir votre créneau de 30 minutes directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de vous retrouver pour cet échange.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 29 sept. 2026 à 10:08, Restaurant NUABOL Saumur <nuabolsaumur@gmail.com> a écrit :
> Bonjour je me connecte donnez moi quelque instant
> Bien cordialement
> Françoise et Christophe FRAPPEZ
> Restaurant NUABOL Saumur
> 42 rue du maréchal Leclerc 49400 Saumur
> nuabol.fr | Plant based restaurant
"""

FULL_BODY = MY_REPLY + QUOTE_THREAD

def send_nuabol_recap():
    print(f"=== ENVOI DU RÉCAPITULATIF AUDIT À {RECIPIENT_NAME} ===", flush=True)

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
    msg["To"] = f"Françoise et Christophe FRAPPEZ <{RECIPIENT}>"
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = LAST_NUABOL_MSG_ID
    msg["References"] = f"{INITIAL_OUTBOUND_ID} {LAST_NUABOL_MSG_ID}"

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

    print(f"Email envoyé avec succès dans le fil à {RECIPIENT} !", flush=True)

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
        "company": "NUABOL (Saumur & Angers)",
        "contact_name": "Françoise et Christophe FRAPPEZ",
        "action": "post_meeting_strategic_audit_recap_and_30min_collab_invite",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_nuabol_recap()
