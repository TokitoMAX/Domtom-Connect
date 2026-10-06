import smtplib, ssl, email
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
import sys, os

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

TO_EMAIL = "ricoland97@gmail.com"
CC_EMAIL = "bio.savane@gmail.com"
SUBJECT = "Re, Valorisation des filieres agricoles locales et agroalimentaire / Bio Savane"

IN_REPLY_TO = "<CAHGiGdhjTY-n8mLTGWa9G_ocEW4ys_3W70EsMVFh5XJz=3gmhA@mail.gmail.com>"
REFERENCES = "<179029603855.34472.399516446327266334@domtomconnect.com> <CAHGiGdhjTY-n8mLTGWa9G_ocEW4ys_3W70EsMVFh5XJz=3gmhA@mail.gmail.com>"

MY_REPLY_TEXT = """Bonjour Madame Dumas, bonjour Monsieur Landais,

Merci beaucoup Lauriane pour cette mise en relation et ces coordonnees directes.

Monsieur Landais, je serais ravi d'echanger avec vous autour de la valorisation de votre filiere vegetale et des perspectives de developpement pour Bio Savane en Guyane et au-dela.

Pour convenir d'un court creneau telephonique de dix minutes selon vos disponibilites, je peux vous joindre directement au +594 694 23 35 73, ou vous pouvez choisir le moment qui vous convient le mieux sur ce lien,

calendly.com/domtomconnect/30min

Au plaisir d'echanger avec vous tres prochainement,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Telephone, +33 6 20 78 33 77
Plateforme, www.domtomconnect.com"""

# Vérifications strictes de sécurité
if ":" in MY_REPLY_TEXT:
    raise ValueError("Erreur critique, presence de deux-points dans le corps du message redige.")
if " - " in MY_REPLY_TEXT:
    raise ValueError("Erreur critique, presence d'un tiret au milieu d'une phrase.")
if ":" in SUBJECT:
    raise ValueError("Erreur critique, presence de deux-points dans le sujet.")

QUOTED_ORIGINAL = """

Le lundi 5 octobre 2026, Lauriane DUMAS <bio.savane@gmail.com> a ecrit,
> Bonjour,
> 
> Vous pouvez contacter Monsieur LANDAIS Eric, president de Biosavane et en charge de la filiere vegetale. Il est en copie de ce mail. Son numero de telephone est le +594 694 23 35 73
> En vous remerciant par avance,
> 
> Cordialement,
> 
> Lauriane DUMAS
> Coordinatrice de BIOSAVANE
> 
> Societe Cooperative Agricole certifiee AB
> Port, 0694 23 66 72
> 
> Ensemble, cultivons autrement !
> www.biosavane.com
"""

# Nettoyage strict de toute présence de deux-points dans l'intégralité du mail
FULL_BODY = MY_REPLY_TEXT + QUOTED_ORIGINAL
if ":" in FULL_BODY:
    raise ValueError("Erreur critique absolue, deux-points detecte dans FULL_BODY !")

msg = MIMEText(FULL_BODY, "plain", "utf-8")
msg["Subject"] = SUBJECT
msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
msg["To"] = TO_EMAIL
msg["Cc"] = CC_EMAIL
msg["Date"] = formatdate(localtime=True)
msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
msg["In-Reply-To"] = IN_REPLY_TO
msg["References"] = REFERENCES

recipients = [TO_EMAIL, CC_EMAIL]

print("Verification et preparation du message,")
print(f"To, {TO_EMAIL}")
print(f"Cc, {CC_EMAIL}")
print(f"Subject, {SUBJECT}")
print(f"In-Reply-To, {IN_REPLY_TO}")
print(f"References, {REFERENCES}")

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, recipients, msg.as_string())

print("SUCCES, Reponse envoyee avec succes a Eric Landais et Lauriane Dumas dans le fil de discussion !")
