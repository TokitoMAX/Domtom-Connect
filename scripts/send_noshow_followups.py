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

# -------------------------------------------------------------
# 1. NISSI GEORGES PIERRE (MASTER GRILL BAR RESTO)
# -------------------------------------------------------------
NISSI_PRIMARY = "mastergrill.barresto@gmail.com"
NISSI_CC = "emmanuellanissi90@gmail.com"
NISSI_LAST_MSG_ID = "<179081714796.23724.786052338620530486@domtomconnect.com>"
NISSI_REFS = "<6ab30f46.e862d496.1ec487.dd66@mx.google.com> <CAJj_-c=2d8rcrVHEMJNv6dV52_Dw0PBsFiGd4O2eVSdJUt3n1Q@mail.gmail.com> <179046589760.8376.11562589387266585139@domtomconnect.com> <179081714796.23724.786052338620530486@domtomconnect.com>"
NISSI_SUBJECT = "Re, Un petit mot pour Master Grill Bar Resto / Rentabilité et nouvelle visibilité"

NISSI_BODY_TEXT = """Bonjour Nissi,

J'espère que vous allez bien.

Sauf erreur de ma part, je ne vous ai pas vue sur Google Meet ce matin lors de notre créneau d'échange.

Je comprends tout à fait les imprévus du quotidien ou la contrainte liée au décalage horaire avec Haïti.

Seriez-vous partante pour que nous reprogrammions notre rendez-vous sur une plage qui vous arrange davantage ?

Vous pouvez choisir très simplement un nouveau créneau directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de faire votre connaissance et d'échanger avec vous autour de Master Grill Bar Resto.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

NISSI_QUOTE = """
> Le 01 oct. 2026 à 03:12, Loïc Villeronce <domtomconnect@gmail.com> a écrit :
> Bonjour Nissi,
> Je vous écris ce court mot pour vous confirmer notre rendez-vous d'échange prévu ce matin.
> Pour tenir compte du décalage horaire entre Haïti et Paris, notre créneau est fixé à 00h30 heure locale au Cap-Haïtien, ce qui correspond à 06h30 heure de Paris.
> Voici le lien direct pour vous connecter à la visioconférence Google Meet meet.google.com/qdk-jtcy-dxj
"""

NISSI_FULL_BODY = NISSI_BODY_TEXT + NISSI_QUOTE

# -------------------------------------------------------------
# 2. BINNUR ALKAN (BOUSSOLE PATRIMOINE)
# -------------------------------------------------------------
BINNUR_RECIPIENT = "binnur.alkan@boussolepatrimoine.fr"
BINNUR_LAST_MSG_ID = "<179081715778.49380.14035645795316268922@domtomconnect.com>"
BINNUR_REFS = "<calendar-b15c447f-563d-4a2c-9e72-98fa85d66fa9@google.com> <179081715778.49380.14035645795316268922@domtomconnect.com>"
BINNUR_SUBJECT = "Re, Rendez-vous Domtom Connect et Boussole Patrimoine / Confirmation 10h30 heure Réunion"

BINNUR_BODY_TEXT = """Bonjour Binnur,

J'espère que vous passez une excellente journée.

Sauf erreur de ma part, je ne vous ai pas vue sur Google Meet ce matin lors de notre appel prévu à 10h30 heure de La Réunion.

Je me doute que vous avez un emploi du temps très chargé et qu'un contretemps de dernière minute a pu survenir.

Serait-il envisageable de convenir d'une nouvelle date afin que nous puissions échanger ensemble comme prévu ?

Vous pouvez sélectionner le moment qui vous convient le mieux directement sur ce lien
calendly.com/domtomconnect/30min

Au plaisir de notre prochain échange et des futures synergies entre Boussole Patrimoine et notre réseau.

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com
"""

BINNUR_QUOTE = """
> Le 01 oct. 2026 à 03:12, Loïc Villeronce <domtomconnect@gmail.com> a écrit :
> Bonjour Binnur,
> Je vous remercie pour la validation de notre rendez-vous d'échange prévu ce matin.
> Pour tenir compte du fuseau horaire de La Réunion, notre créneau est bien fixé à 10h30 heure locale, ce qui correspond à 08h30 heure de Paris.
> Voici le lien direct pour rejoindre notre visioconférence Google Meet meet.google.com/mce-fomd-qye
"""

BINNUR_FULL_BODY = BINNUR_BODY_TEXT + BINNUR_QUOTE

def send_all_noshow_followups():
    print("=== DÉBUT ENVOI DES RELANCES APRÈS RENDEZ-VOUS MANQUÉS ===", flush=True)

    # Vérifications des règles strictes
    for name, text in [("Nissi", NISSI_BODY_TEXT), ("Binnur", BINNUR_BODY_TEXT)]:
        if ":" in text:
            raise ValueError(f"Erreur critique ({name}) : Deux-points interdit dans le corps rédigé !")
        if " - " in text:
            raise ValueError(f"Erreur critique ({name}) : Tiret d'incise ' - ' interdit au milieu d'une phrase !")

    # 1. Envoi à Nissi
    print("Vérification DNS/MX pour Nissi...", flush=True)
    for em in [NISSI_PRIMARY, NISSI_CC]:
        ok, msg = verify_email_target(em)
        if not ok:
            raise ValueError(f"Erreur DNS/MX pour {em} : {msg}")
    print("DNS/MX OK pour Nissi.", flush=True)

    msg_nissi = MIMEText(NISSI_FULL_BODY, "plain", "utf-8")
    msg_nissi["Subject"] = Header(NISSI_SUBJECT, "utf-8")
    msg_nissi["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg_nissi["To"] = f"Nissi Pierre <{NISSI_PRIMARY}>"
    msg_nissi["Cc"] = NISSI_CC
    msg_nissi["Date"] = formatdate(localtime=True)
    msg_nissi["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg_nissi["In-Reply-To"] = NISSI_LAST_MSG_ID
    msg_nissi["References"] = NISSI_REFS

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [NISSI_PRIMARY, NISSI_CC], msg_nissi.as_string())
    print("Email de relance envoyé à Nissi Georges Pierre avec succès !", flush=True)

    # 2. Envoi à Binnur
    print("Vérification DNS/MX pour Binnur...", flush=True)
    ok, msg = verify_email_target(BINNUR_RECIPIENT)
    if not ok:
        raise ValueError(f"Erreur DNS/MX pour {BINNUR_RECIPIENT} : {msg}")
    print("DNS/MX OK pour Binnur.", flush=True)

    msg_binnur = MIMEText(BINNUR_FULL_BODY, "plain", "utf-8")
    msg_binnur["Subject"] = Header(BINNUR_SUBJECT, "utf-8")
    msg_binnur["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg_binnur["To"] = f"Binnur Alkan <{BINNUR_RECIPIENT}>"
    msg_binnur["Date"] = formatdate(localtime=True)
    msg_binnur["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg_binnur["In-Reply-To"] = BINNUR_LAST_MSG_ID
    msg_binnur["References"] = BINNUR_REFS

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, [BINNUR_RECIPIENT], msg_binnur.as_string())
    print("Email de relance envoyé à Binnur Alkan avec succès !", flush=True)

    # 3. Historisation dans contacts_deja_contactes.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "contacts_deja_contactes.json")
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db = json.load(f)
    else:
        db = {"emails": [], "domains": [], "companies": [], "contacts": []}

    db.setdefault("contacts", []).append({
        "email": NISSI_PRIMARY,
        "company": "Master Grill Bar Resto",
        "action": "followup_noshow_reschedule",
        "date": formatdate(localtime=True)
    })
    db.setdefault("contacts", []).append({
        "email": BINNUR_RECIPIENT,
        "company": "Boussole Patrimoine",
        "action": "followup_noshow_reschedule",
        "date": formatdate(localtime=True)
    })
    db["total_contacts"] = len(db.get("contacts", []))
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("contacts_deja_contactes.json mis à jour avec succès !", flush=True)

if __name__ == "__main__":
    send_all_noshow_followups()
