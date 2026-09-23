import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

to_email = "group@gozem.co"
subject = "Expansion terrain et pilotage opérationnel / Gozem"
body = """Bonjour,

L'aventure Gozem force le respect par sa vitesse d'exécution et sa capacité à simplifier le quotidien de millions d'usagers et de chauffeurs en Afrique de l'Ouest et Centrale.

Déployer une super-app multi-pays sur le terrain est une mécanique exigeante, où la logistique, la gestion des flottes et l'expérience utilisateur demandent des arbitrages permanents.

Nous échangeons entre fondateurs et décideurs de l'écosystème pour partager nos réalités opérationnelles. Selon vous, quel est aujourd'hui le point de friction majeur ou le défi d'organisation qui prend le plus d'énergie à vos équipes ?

Seriez-vous ouverts à un court échange informel de dix minutes d'ici la fin de semaine pour en discuter ?

Bien à vous,

Loïc Villeronce
Fondateur — Domtom Connect"""

msg = MIMEText(body, "plain", "utf-8")
msg["Subject"] = Header(subject, "utf-8")
msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
msg["To"] = to_email
msg["Reply-To"] = EMAIL_USER

with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
    server.login(EMAIL_USER, EMAIL_PASS)
    server.sendmail(EMAIL_USER, [to_email], msg.as_string())

print("Envoyé à group@gozem.co !")
