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

RECIPIENT = "kouggan@gmail.com"
RECIPIENT_NAME = "Kouggan KOUGGAN (YAQOOA Immobilier)"
CC_EMAIL = "contact@yaqooa.com"

IN_REPLY_TO = "<GVXPR09MB665432C899EDFADCEA9CFDC5F4892@GVXPR09MB6654.eurprd09.prod.outlook.com>"
REFERENCES = "<179098282166.28744.2375330480553985729@domtomconnect.com> <GVXPR09MB665432C899EDFADCEA9CFDC5F4892@GVXPR09MB6654.eurprd09.prod.outlook.com>"
SUBJECT = "Re, Échange sur vos objectifs et priorités de développement pour YAQOOA Immobilier Abidjan"

BODY_TEXT = """Bonjour Monsieur Kouggan,

C'est parfaitement clair et je comprends tout à fait votre priorité du moment.

La phase de programmation et de stabilisation technique est l'étape la plus cruciale avant toute ouverture commerciale.

Étant nous-mêmes concepteurs d'infrastructures numériques et d'écosystèmes d'affaires, nous savons à quel point ce travail de fond demande de l'énergie et de la concentration.

Menez à bien vos développements. Si jamais vous rencontrez un blocage technique particulier ou si vous souhaitez un retour d'expérience neutre sur l'architecture ou l'ergonomie de votre plateforme avant son lancement officiel, ce sera un plaisir d'échanger simplement et sans engagement.

En attendant, si vous souhaitez échanger de manière informelle avec d'autres fondateurs et porteurs de projets de notre écosystème qui partagent ces mêmes défis techniques, vous êtes le bienvenu sur notre canal d'entraide WhatsApp
chat.whatsapp.com/Fe8LuB5IUa1K8JbP00qOdt

Cela vous permettra de suivre nos actualités en toute liberté sans aucune sollicitation.

Je garde précieusement votre contact et ne manquerai pas de prendre de vos nouvelles dès que votre plateforme sera stabilisée pour les futures synergies d'affaires.

Je vous souhaite un excellent sprint de programmation avec vos équipes.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

QUOTE_THREAD = """
> Le 2 oct. 2026 à 23,25, Kouggan KOUGGAN a écrit
> Bonjour Monsieur,
> Nous accusons réception de votre mail qui traduit l'attention que vous portez à notre travail.
> Toutefois, tenons-nous à vous indiquer que nous sommes en création de la plateforme, la mise en ligne répond à volonté de peaufiner la programmation.
> Pour l'heure seule la programmation de notre plateforme reste la priorité.
> Les collaborateurs et référencements du site se feront, mais pas maintenant.
> Nous vous saurons bon gré de nous recontacter ultérieurement.
> Cordialement
"""

FULL_BODY = BODY_TEXT + QUOTE_THREAD

def send_reply():
    print("=== ENVOI RÉPONSE THREADÉE À KOUGGAN KOUGGAN (YAQOOA IMMOBILIER) ===", flush=True)

    # 1. Vérifications de style obligatoires
    if ":" in BODY_TEXT:
        raise ValueError("Erreur critique : Deux-points interdits dans le corps rédigé !")
    if " - " in BODY_TEXT:
        raise ValueError("Erreur critique : Tiret d'incise ' - ' interdit au milieu d'une phrase !")

    # 2. Validation DNS / MX
    ok, msg = verify_email_target(RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {RECIPIENT} : {msg}")
    print(f"Validation DNS/MX OK pour {RECIPIENT}.", flush=True)

    # 3. Message MIME
    msg_mime = MIMEText(FULL_BODY, "plain", "utf-8")
    msg_mime["Subject"] = Header(SUBJECT, "utf-8")
    msg_mime["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg_mime["To"] = f"{RECIPIENT_NAME} <{RECIPIENT}>"
    msg_mime["Cc"] = CC_EMAIL
    msg_mime["Date"] = formatdate(localtime=True)
    msg_mime["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg_mime["In-Reply-To"] = IN_REPLY_TO
    msg_mime["References"] = REFERENCES

    # 4. Envoi SMTP
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        recipients = [RECIPIENT, CC_EMAIL]
        server.sendmail(SENDER_EMAIL, recipients, msg_mime.as_string())
        print(f"Email envoyé avec succès à {RECIPIENT} (et Cc {CC_EMAIL}) !", flush=True)

    # 5. Historisation
    contacts_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contacts_deja_contactes.json")
    try:
        with open(contacts_file, "r", encoding="utf-8") as f:
            contacts = json.load(f)
    except Exception:
        contacts = {}

    contacts[RECIPIENT] = {
        "nom": RECIPIENT_NAME,
        "email": RECIPIENT,
        "date_reponse_envoyee": formatdate(localtime=True),
        "sujet": SUBJECT,
        "statut": "reponse_post_retour_yaqooa_envoyee",
        "lien_whatsapp_propose": True
    }

    with open(contacts_file, "w", encoding="utf-8") as f:
        json.dump(contacts, f, ensure_ascii=False, indent=2)
    print("Historique contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_reply()
