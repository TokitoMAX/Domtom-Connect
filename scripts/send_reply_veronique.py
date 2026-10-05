import smtplib, ssl, email
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
import sys, os

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

TO_EMAIL = "soutien.scolaire.education@gmail.com"
SUBJECT = "Re, Échange sur le soutien scolaire à Rémire-Montjoly / Familles et Scolarité"

IN_REPLY_TO = "<CAPTGB719hpbMP8Sm+49Lur6LeySTXXZr-XaFWKXB=79wCvj+dA@mail.gmail.com>"
REFERENCES = "<179043558065.36348.8786263380055146055@domtomconnect.com> <CAPTGB719hpbMP8Sm+49Lur6LeySTXXZr-XaFWKXB=79wCvj+dA@mail.gmail.com>"

MY_REPLY_TEXT = """Bonjour Madame Ringuet,

Merci pour votre retour et pour la clarté de vos explications.

Je tiens tout d'abord à clarifier un point sur le terme d'entraide mentionné dans mon précédent message, qui a pu prêter à confusion. Domtom Connect n'est pas une structure caritative ou bénévole, mais un écosystème d'affaires reliant toute la Caraïbe, le continent africain et sa diaspora.

Pour autant, vos besoins de visibilité, de partenariats locaux et de pérennisation financière sont réels. Pour qu'une structure éducative se développe durablement, elle gagne à être pilotée avec des réflexes d'entreprise.

C'est précisément là que réside notre valeur ajoutée, vous aider à structurer votre modèle, vous connecter à des chefs d'entreprise et mécènes de la diaspora prêts à soutenir des initiatives concrètes, et positionner vos actions sur l'application DTC Pulse.

Si aborder l'avenir de votre association sous cet angle business et économique fait sens pour vous, prenons dix minutes pour en parler.

Vous pouvez choisir le créneau qui vous convient sur ce lien,

calendly.com/domtomconnect/30min

Au plaisir d'échanger prochainement,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""

# Vérifications strictes de conformité
if ":" in MY_REPLY_TEXT:
    raise ValueError("Erreur critique : présence de deux-points dans le corps rédigé.")
if " - " in MY_REPLY_TEXT:
    raise ValueError("Erreur critique : présence d'un tiret au milieu d'une phrase.")
if ":" in SUBJECT:
    raise ValueError("Erreur critique : présence de deux-points dans le sujet.")

QUOTED_ORIGINAL = """

Le 27 septembre 2026 à 07h02, veronique ringuet <soutien.scolaire.education@gmail.com> a écrit :
> Bonjour Monsieur Villeronce,
> 
> Je vous remercie pour votre message et pour l’intérêt que vous portez aux actions de l’association Familles & Scolarité.
> 
> Notre objectif est effectivement d’accompagner les élèves de manière personnalisée, de renforcer leurs acquis, de redonner confiance aux jeunes en difficulté et, plus largement, de participer à la prévention du décrochage scolaire en Guyane.
> 
> Aujourd’hui, nos principaux besoins concernent notamment le développement de nos partenariats locaux, une meilleure visibilité de nos actions, la recherche de financements permettant de pérenniser et développer nos projets, ainsi que la structuration de notre modèle afin de pouvoir accompagner davantage de familles.
> 
> Nous développons également différents projets autour du soutien scolaire, des ateliers pédagogiques, de la confiance en soi, de la gestion des émotions et de l’accompagnement des familles.
> 
> Je serais donc intéressée pour en savoir davantage sur Domtom Connect, votre groupe d’entraide ainsi que sur DTC Pulse, et voir quelles passerelles pourraient éventuellement être envisagées avec Familles & Scolarité.
> 
> Nous pouvons effectivement prévoir un court échange téléphonique.
> 
> Bien cordialement,
> Mme Véronique Ringuet
> Présidente
> Association Familles & Scolarité
"""

FULL_BODY = MY_REPLY_TEXT + QUOTED_ORIGINAL

msg = MIMEText(FULL_BODY, "plain", "utf-8")
msg["Subject"] = SUBJECT
msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
msg["To"] = TO_EMAIL
msg["Date"] = formatdate(localtime=True)
msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
msg["In-Reply-To"] = IN_REPLY_TO
msg["References"] = REFERENCES

print("Préparation de l'envoi en fil de discussion pour Véronique Ringuet :")
print(f"To: {TO_EMAIL}")
print(f"Subject: {SUBJECT}")
print(f"In-Reply-To: {IN_REPLY_TO}")
print(f"References: {REFERENCES}")

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, [TO_EMAIL], msg.as_string())

print("SUCCÈS : Réponse envoyée avec succès à Véronique Ringuet dans son fil de discussion.")
