import smtplib
from email.mime.text import MIMEText
from email.header import Header
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "geqpuqluimxdjxeo"

TO_EMAIL = "francoise.guinot@airawak.com"
SUBJECT = "Re: Vos plannings de vol et coordination / Airawak"
IN_REPLY_TO = "<CAKH-LLXSq+=G0yNJXZcqY8ZRKhgV7cJTpc_YmETH85fMVbdVKA@mail.gmail.com>"

BODY = """Bonjour Madame Guinot,

C'est parfaitement noté, aucun souci. Dans le secteur aérien, je sais que les besoins peuvent surgir du jour au lendemain et je reste bien entendu à votre écoute si la situation évolue.

En attendant, au-delà de l'accompagnement direct, je développe un écosystème collaboratif pensé pour connecter les décideurs, entrepreneurs et porteurs de projets de nos territoires.

Si vous souhaitez garder un pied dans cette dynamique sans aucune contrainte, deux portes d'entrée sont envisageables selon ce qui vous convient le mieux

La première option est notre groupe WhatsApp privé dédié aux dirigeants et acteurs économiques locaux, parfait pour échanger simplement et capter des opportunités ou synergies entre professionnels.

La seconde option est de tester en avant-première notre application mobile DTC Pulse, actuellement en bêta fermée, et de nous partager votre retour d'expérience de dirigeante de terrain.

L'une de ces démarches résonne-t-elle avec vos envies du moment ? Si oui, je vous transmettrai l'accès avec grand plaisir.

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

# Strict check zero colons in body
if ":" in BODY:
    raise ValueError("ERREUR: Présence de deux-points interdite dans le corps de l'email !")

msg = MIMEText(BODY, "plain", "utf-8")
msg["Subject"] = Header(SUBJECT, "utf-8")
msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
msg["To"] = f"Francoise Guinot <{TO_EMAIL}>"
msg["Reply-To"] = EMAIL_USER
msg["In-Reply-To"] = IN_REPLY_TO
msg["References"] = IN_REPLY_TO

print(f"Envoi de la réponse à Airawak ({TO_EMAIL})...")
with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
    server.login(EMAIL_USER, EMAIL_PASS)
    server.sendmail(EMAIL_USER, [TO_EMAIL], msg.as_string())

print("==> Réponse envoyée avec succès à Françoise Guinot (Airawak) !")

