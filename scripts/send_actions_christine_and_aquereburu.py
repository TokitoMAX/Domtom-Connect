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

# ==============================================================================
# 1. CHRISTINE PICARD (OUA CONCEPT)
# ==============================================================================
OUA_RECIPIENT = "contact@oua-concept.com"
OUA_RECIPIENT_NAME = "Christine Picard - OUA Concept"
OUA_IN_REPLY_TO = "<F592CA0D-A93D-4F49-BD2A-58311FDD1A3E@oua-concept.com>"
OUA_REFERENCES = "<179021265653.16056.6689348557171939937@domtomconnect.com> <F592CA0D-A93D-4F49-BD2A-58311FDD1A3E@oua-concept.com>"
OUA_SUBJECT = "Re, Épicerie créole artisanale premium et valorisation des producteurs ultramarins / OUA Concept"

OUA_BODY_TEXT = """Bonjour Christine,

Merci beaucoup pour votre retour et votre intérêt.

Votre positionnement dans le Sud de la France avec une ouverture sur les marchés suisse et européen fait totalement sens, en particulier pour valoriser l'excellence artisanale ultramarine auprès d'une clientèle exigeante.

Ce sera un vrai plaisir d'échanger avec vous de vive voix afin de vous présenter les opportunités de visibilité directe avec DTC Pulse et envisager de belles synergies.

Pour caler notre échange de manière simple selon vos disponibilités, je vous laisse choisir le créneau qui vous convient le mieux sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de faire votre connaissance.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

OUA_QUOTE = """
> Le 01 oct. 2026 à 12:11, contact@oua-concept.com a écrit :
> Bonjour,
> Curieuse d’en savoir plus.
> OUA est basé en hexagone (Sud de France) et vise un marché hexagonal, européen et suisse.
> Au plaisir d’échanger,
> Bien cordialement,
> Christine PICARD
> Fondatrice - OÜA
> oua-concept.com
> +33 (0) 6 58 58 46 10
"""

OUA_FULL_BODY = OUA_BODY_TEXT + OUA_QUOTE

# ==============================================================================
# 2. SCP AQUEREBURU & PARTNERS
# ==============================================================================
AQUEREBURU_RECIPIENT = "contact@aquereburu-partners.com"
AQUEREBURU_RECIPIENT_NAME = "SCP Aquereburu & Partners (Me Ehonam A. GAMISSO YEVENOU)"
AQUEREBURU_IN_REPLY_TO = "<!&!AAAAAAAAAAAYAAAAAAAAAKBaB0ESEDZLtmDSz7txEsXCgAAAEAAAADQb/YEXsWlDpYsfwlg1Fl4BAAAAAA==@aquereburu-partners.com>"
AQUEREBURU_REFERENCES = "<!&!AAAAAAAAAAAYAAAAAAAAAKBaB0ESEDZLtmDSz7txEsXCgAAAEAAAADQb/YEXsWlDpYsfwlg1Fl4BAAAAAA==@aquereburu-partners.com>"
AQUEREBURU_SUBJECT = "Re, Synergies professionnelles et collaborations d'affaires / Cabinet Aquereburu & Partners"

AQUEREBURU_BODY_TEXT = """Bonjour Maître,

Je vous remercie vivement pour votre retour et pour l'intérêt accordé au développement de Domtom Connect.

Je vous confirme notre rendez-vous d'échange prévu ce vendredi 2 octobre 2026.

Pour assurer une parfaite synchronisation entre nos fuseaux horaires, notre appel se déroulera à 10h30 heure de Lomé (UTC), ce qui correspond à 12h30 heure de Paris.

Voici votre lien direct pour vous connecter à la visioconférence Google Meet
meet.google.com/uor-jcqu-pzd

Je me réjouis de cette opportunité d'échanger avec vous autour des synergies juridiques et fiscales au service des entrepreneurs et investisseurs de notre écosystème.

Au plaisir de notre échange demain.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

AQUEREBURU_QUOTE = """
> Le 29 sept. 2026 à 18:04, contact@aquereburu-partners.com a écrit :
> Monsieur,
> Nous accusons réception de votre courriel ci-dessous et vous remercions pour la confiance que vous avez bien voulu placer en notre société en nous contactant pour cette opportunité de collaboration.
> Afin d'échanger sur le sujet, nous sommes disposés à avoir un call avec vous ce Vendredi 02 Octobre 2026 à 10h30 min. Nous avons également choisi le créneau sur calendly comme vous l'avez indiqué.
> A votre disposition,
> Ehonam A. GAMISSO YEVENOU
> Avocat collaborateur
> Chef du département droit du travail et sécurité sociale
> Chef section fiscalité, droits civils et sociaux
> AQUEREBURU & PARTNERS
"""

AQUEREBURU_FULL_BODY = AQUEREBURU_BODY_TEXT + AQUEREBURU_QUOTE

def send_actions():
    print("=== DÉBUT ENVOI : CHRISTINE PICARD & AQUEREBURU & PARTNERS ===", flush=True)

    # 1. Vérifications de style obligatoires
    for name, text in [("OUA", OUA_BODY_TEXT), ("Aquereburu", AQUEREBURU_BODY_TEXT)]:
        if ":" in text:
            raise ValueError(f"Erreur critique ({name}) : Deux-points interdits dans le corps rédigé !")
        if " - " in text:
            raise ValueError(f"Erreur critique ({name}) : Tiret d'incise ' - ' interdit au milieu d'une phrase !")

    # 2. Validation DNS / MX
    for r in [OUA_RECIPIENT, AQUEREBURU_RECIPIENT]:
        ok, msg = verify_email_target(r)
        if not ok:
            raise ValueError(f"Erreur DNS/MX pour {r} : {msg}")
        print(f"Validation DNS/MX OK pour {r}.", flush=True)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)

        # Envoi à Christine Picard
        msg_oua = MIMEText(OUA_FULL_BODY, "plain", "utf-8")
        msg_oua["Subject"] = Header(OUA_SUBJECT, "utf-8")
        msg_oua["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
        msg_oua["To"] = f"Christine Picard <{OUA_RECIPIENT}>"
        msg_oua["Date"] = formatdate(localtime=True)
        msg_oua["Message-ID"] = make_msgid(domain="domtomconnect.com")
        msg_oua["In-Reply-To"] = OUA_IN_REPLY_TO
        msg_oua["References"] = OUA_REFERENCES
        server.sendmail(SENDER_EMAIL, [OUA_RECIPIENT], msg_oua.as_string())
        print("Réponse envoyée avec succès à Christine Picard (OUA Concept) !", flush=True)

        # Envoi au Cabinet Aquereburu & Partners
        msg_aq = MIMEText(AQUEREBURU_FULL_BODY, "plain", "utf-8")
        msg_aq["Subject"] = Header(AQUEREBURU_SUBJECT, "utf-8")
        msg_aq["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
        msg_aq["To"] = f"SCP Aquereburu & Partners <{AQUEREBURU_RECIPIENT}>"
        msg_aq["Date"] = formatdate(localtime=True)
        msg_aq["Message-ID"] = make_msgid(domain="domtomconnect.com")
        msg_aq["In-Reply-To"] = AQUEREBURU_IN_REPLY_TO
        msg_aq["References"] = AQUEREBURU_REFERENCES
        server.sendmail(SENDER_EMAIL, [AQUEREBURU_RECIPIENT], msg_aq.as_string())
        print("Rappel et confirmation envoyés avec succès au Cabinet Aquereburu & Partners !", flush=True)

    # 3. Historisation dans contacts_deja_contactes.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": OUA_RECIPIENT,
        "company": "OUA Concept",
        "action": "reply_propose_calendly_booking",
        "date": formatdate(localtime=True)
    })
    db.setdefault("contacts", []).append({
        "email": AQUEREBURU_RECIPIENT,
        "company": "SCP Aquereburu & Partners",
        "action": "reminder_rdv_vendredi_10h30_lome_12h30_paris",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("Historique mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_actions()
