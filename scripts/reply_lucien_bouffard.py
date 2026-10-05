import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "ranking.re@gmail.com"
RECIPIENT_CC = "contact@ranking.re"
LAST_MSG_ID = "<calendar-e905a0da-df94-4e35-b49c-74aa79128477@google.com>"

subject = "Re, Rendez-vous Ranking Réunion et Dom Tom Connect"

body = """Bonjour Lucien,

Je tiens à vous présenter mes excuses les plus sincères pour notre rendez-vous prévu aujourd'hui à 13h00 (15h00 heure Réunion).

J'ai été pris par un imprévu d'urgence totalement indépendant de ma volonté. Le temps de résoudre cette situation critique, l'horaire était malheureusement déjà dépassé et je n'ai pas pu vous rejoindre à temps en visio.

Votre temps est précieux et je suis sincèrement désolé pour ce contretemps. Notre échange me tient particulièrement à cœur au vu des synergies évidentes entre Ranking Réunion et le réseau Dom Tom Connect dans l'Océan Indien.

Seriez-vous d'accord pour que nous reprogrammions notre échange à votre meilleure convenance ? Je reste disponible aujourd'hui plus tard, demain ou dans les prochains jours selon vos disponibilités.

Vous pouvez sélectionner directement le moment qui vous convient sur mon agenda partagé,
calendly.com/domtomconnect/30min

Ou si vous préférez, n'hésitez pas à me donner vos créneaux libres directement par retour d'email.

Encore toutes mes excuses pour ce désagrément, et au plaisir d'échanger avec vous.

Bien cordialement,

Loïc Villeronce
Fondateur de Dom Tom Connect et DTC Pulse
domtomconnect@gmail.com

---
Le 28 sept. 2026 à 06h39 UTC, Lucien BOUFFARD (ranking.re@gmail.com) a écrit,
> Rendez-vous confirmé, Lucien BOUFFARD and Loïc VILLERONCE
> Lun. 28 sept. 2026 13h00 à 13h30 (UTC+2)"""

# Safety validation
if ":" in subject:
    raise ValueError("Interdit - Deux-points détecté dans le sujet")
if ":" in body:
    raise ValueError("Interdit - Deux-points détecté dans le corps")
if " - " in subject:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le sujet")
if " - " in body:
    raise ValueError("Interdit - Tiret en milieu de phrase dans le corps")

def send_reply(dry_run=False):
    print(f"Destinataire principal, {RECIPIENT_TO}")
    print(f"Copie (CC), {RECIPIENT_CC}")
    print(f"Sujet, {subject}")
    print(f"In-Reply-To, {LAST_MSG_ID}")
    print(f"References, {LAST_MSG_ID}")
    print("\n--- Corps du message ---")
    print(body)
    print("------------------------\n")
    
    if dry_run:
        print("[DRY RUN] Aucun email envoyé. Validation 100% conforme.")
        return

    context = ssl.create_default_context()
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_TO
    msg["Cc"] = RECIPIENT_CC
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = LAST_MSG_ID
    msg["References"] = LAST_MSG_ID

    all_recipients = [RECIPIENT_TO, RECIPIENT_CC]

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, all_recipients, msg.as_string())
        print("EMAIL D'EXCUSES ET REPROGRAMMATION ENVOYÉ AVEC SUCCÈS À LUCIEN BOUFFARD !")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    send_reply(dry_run=dry)
