import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT_TO = "contact@edukaraib.com"
RECIPIENT_CC = "johnfres.45@gmail.com"

LAST_MSG_ID = "<1a0e910c80c.51d2a2e6143098.4241559725253297929@edukaraib.com>"
PREV_REFS = "<1a0deb0bbfe.6daa0bfb834895.3220181439287453384@edukaraib.com>"

subject = "Re, Échange Dom Tom Connect et EduKaraib / Factur'Peyi"

body = """Salut Joseph,

Merci infiniment pour ton retour et pour tes mots. Venant de quelqu'un qui est lui aussi dans l'arène et dans l'exécution quotidienne, ça a une vraie valeur et ça touche juste.

J'apprécie énormément ton honnêteté. Tu as totalement raison, je préfère mille fois une franchise comme la tienne qu'un membre silencieux sur WhatsApp qui n'a pas le temps de s'investir. Construire un réseau demande une énergie folle et je respecte à 100% ton focus actuel sur tes deux plateformes.

Je garde très précieusement ton lien partenaire Factur'Peyi,
facturepeyi.com/espace-partenaire

D'ailleurs, si tu souhaites à terme qu'on mette en place des campagnes de promotion et du contenu UGC pour propulser tes affaires auprès de notre audience ultramarine et maximiser les inscriptions, la porte est grande ouverte. On pourra caler ça ensemble pour voir comment gérer cette mise en avant pour tes produits.

En parallèle, si tu souhaites tester DTC Pulse à ton rythme, voici le lien d'accès au test Google Play (qui fonctionne aussi très bien sur BlueStacks sur ordinateur),
play.google.com/apps/testing/com.domtomconnect.app

Entre créateurs de produits, ton regard et tes retours d'expérience me seront toujours précieux si tu trouves un moment pour y jeter un œil, sans aucune obligation.

Force à toi dans le développement d'EduKaraib et de Factur'Peyi. La porte reste ouverte, et on se croisera forcément sur la route.

À bientôt,

Bien cordialement,

Loïc Villeronce
Fondateur de Dom Tom Connect et DTC Pulse
domtomconnect@gmail.com

---
Le 28 sept. 2026 à 19h29, Edukaraib (contact@edukaraib.com) a écrit,
> Salut Loïc,
> Merci pour l'échange, et pour le temps que tu m'as accordé.
> Je préfère être honnête avec toi plutôt que de te laisser dans le flou..."""

# Strict safety checks
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
    
    if dry_run:
        print("\n--- CORPS DU MESSAGE (DRY RUN) ---")
        print(body)
        print("----------------------------------")
        print("\nValidation 100% réussie. Zéro deux-points, zéro tiret d'incise.")
        return

    context = ssl.create_default_context()
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_TO
    msg["Cc"] = RECIPIENT_CC
    msg["Date"] = formatdate(localtime=True)
    new_id = make_msgid(domain="domtomconnect.com")
    msg["Message-ID"] = new_id
    msg["In-Reply-To"] = LAST_MSG_ID
    msg["References"] = f"{PREV_REFS} {LAST_MSG_ID}"

    all_recipients = [RECIPIENT_TO, RECIPIENT_CC]

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, all_recipients, msg.as_string())
        print(f"EMAIL ENVOYÉ AVEC SUCCÈS À JOSEPH TWISEYIMANA ! (ID: {new_id})")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    send_reply(dry_run=dry)
