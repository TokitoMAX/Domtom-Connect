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

RECIPIENT = "contact@aquereburu-partners.com"
RECIPIENT_NAME = "SCP Aquereburu & Partners (Me Ehonam A. GAMISSO YEVENOU)"
IN_REPLY_TO = "<!&!AAAAAAAAAAAYAAAAAAAAAKBaB0ESEDZLtmDSz7txEsXCgAAAEAAAADQb/YEXsWlDpYsfwlg1Fl4BAAAAAA==@aquereburu-partners.com>"
REFERENCES = "<!&!AAAAAAAAAAAYAAAAAAAAAKBaB0ESEDZLtmDSz7txEsXCgAAAEAAAADQb/YEXsWlDpYsfwlg1Fl4BAAAAAA==@aquereburu-partners.com>"
SUBJECT = "Re, Synergies professionnelles et collaborations d'affaires / Cabinet Aquereburu & Partners"

BODY_TEXT = """Bonjour Maître,

Je vous prie d'excuser ce retour tardif en cette fin de soirée, mon après-midi ayant été particulièrement dense suite à notre échange.

Je tenais à vous remercier chaleureusement pour notre discussion de tout à l'heure. Afin de poser un cadre de collaboration simple, efficace et parfaitement aligné avec vos impératifs, voici notre proposition,

1. Un canal privé dédié aux professionnels du droit
Nous mettons en place un groupe restreint réservé aux avocats d'affaires partenaires. Dès qu'une entreprise établie, un dirigeant de PME ou un investisseur solvable de notre réseau exprime un besoin juridique ou fiscal sur votre région, nous vous transmettons l'opportunité en direct.

2. Un format de prescription d'affaires direct
Nous formalisons notre collaboration par une convention de prescription d'affaires. Dès qu'un client transmis signe une lettre de mission avec votre cabinet et règle sa provision de démarrage, une commission d'intermédiation convenue est due à Domtom Connect.

Ce modèle vous garantit un flux d'opportunités ciblées sans frais fixes à l'entrée, tout en évitant toute attente liée à l'issue finale des dossiers.

Si cette formule vous convient, je vous intègre avec plaisir au canal privé afin d'initier nos premières synergies.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE = """
> Le 29 sept. 2026 à 18,04, contact@aquereburu-partners.com a écrit 
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

FULL_BODY = BODY_TEXT + QUOTE

def send_followup():
    print("=== ENVOI PROPOSITION PARTENARIAT APPORTEUR D'AFFAIRES A AQUEREBURU & PARTNERS ===", flush=True)

    # 1. Vérification stricte de la règle zéro deux-points
    if ":" in BODY_TEXT:
        raise ValueError("Erreur critique : Deux-points interdits dans le corps rédigé !")
    if " - " in BODY_TEXT:
        raise ValueError("Erreur critique : Tiret d'incise ' - ' interdit au milieu d'une phrase !")

    # 2. Validation DNS / MX
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX OK pour {RECIPIENT}.", flush=True)

    # 3. Création du message MIME
    msg_mime = MIMEText(FULL_BODY, "plain", "utf-8")
    msg_mime["Subject"] = Header(SUBJECT, "utf-8")
    msg_mime["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg_mime["To"] = f"{RECIPIENT_NAME} <{RECIPIENT}>"
    msg_mime["Date"] = formatdate(localtime=True)
    msg_mime["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg_mime["In-Reply-To"] = IN_REPLY_TO
    msg_mime["References"] = REFERENCES

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg_mime.as_string())
        print(f"Email envoyé avec succès à {RECIPIENT} !", flush=True)

    # 5. Historisation
    contacts_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contacts_deja_contactes.json")
    try:
        with open(contacts_file, "r", encoding="utf-8") as f:
            contacts = json.load(f)
    except Exception:
        contacts = {}

    contacts[RECIPIENT] = {
        "nom": "SCP Aquereburu & Partners (Me Ehonam A. GAMISSO YEVENOU)",
        "email": RECIPIENT,
        "date_envoi": formatdate(localtime=True),
        "sujet": SUBJECT,
        "statut": "proposition_prescription_affaires_envoyee",
        "type": "partenaire_avocat_prescription",
        "territoire": "Togo / OHADA"
    }

    with open(contacts_file, "w", encoding="utf-8") as f:
        json.dump(contacts, f, ensure_ascii=False, indent=2)
    print("Historique contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_followup()
