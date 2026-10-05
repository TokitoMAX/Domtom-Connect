import smtplib, ssl, email
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
import sys, os

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

TO_EMAIL = "contact@damedia-agency.com"
SUBJECT = "Re, Échange sur le développement digital / Damedia Agency"

IN_REPLY_TO = "<1790510277866067875.1790510277@damedia-agency.com>"
REFERENCES = "<179043637981.24148.819955784955934917@domtomconnect.com> <1790510277866067875.1790510277@damedia-agency.com>"

MY_REPLY_TEXT = """Bonjour Jorys,

Merci pour votre retour.

Pour vous donner de la visibilité sur notre démarche, Domtom Connect est un écosystème en plein développement qui relie toute la Caraïbe, le continent africain et sa diaspora.

Nous privilégions des partenariats collaboratifs où chacun apporte de la valeur au réseau, plutôt qu'un simple référencement passif.

Je serais ravi d'échanger avec vous pour faire connaissance et voir posément comment nous pourrions envisager des synergies.

Comme vous êtes plus disponible en fin de journée ou le samedi, je vous laisse choisir le créneau qui vous convient sur ce lien,

calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""

# Vérifications strictes de sécurité
if ":" in MY_REPLY_TEXT:
    raise ValueError("Erreur critique : présence de deux-points dans le corps du message rédigé.")
if " - " in MY_REPLY_TEXT:
    raise ValueError("Erreur critique : présence d'un tiret au milieu d'une phrase.")
if ":" in SUBJECT:
    raise ValueError("Erreur critique : présence de deux-points dans le sujet.")

QUOTED_ORIGINAL = """

Le 27 septembre 2026 à 11h58, Jorys Damas <contact@damedia-agency.com> a écrit :
> Bonjour Monsieur Villeronce,
> 
> Merci pour votre message et pour votre retour sur le travail de Damedia.
> 
> Pour répondre directement à votre question : notre priorité aujourd'hui se situe du côté des opportunités régionales. Damedia est une agence digitale et créative basée à Petit-Bourg, structurée autour de sept expertises création de sites web, référencement, réseaux sociaux, photographie, vidéo, drone FPV cinématique et cartes de visite NFC. Nous accompagnons aujourd'hui des hébergements touristiques, des restaurants et des commerces en Guadeloupe, ainsi qu'une marque e-commerce au Québec.
> 
> En parcourant votre plateforme, j'ai noté que vous animez un annuaire de talents et un réseau de prestataires vérifiés, et que votre application DTC Pulse s'adresse notamment aux restaurateurs et commerçants. C'est précisément le profil d'entreprises que nous servons au quotidien : ce sont elles qui ont besoin d'un site qui convertit, de visuels professionnels et d'une présence en ligne cohérente.
> 
> C'est donc surtout sous l'angle de la mise en relation avec vos membres qu'un échange m'intéresserait, voir si Damedia peut être référencée comme prestataire au sein de votre écosystème.
> 
> Je suis disponible pour votre point de dix minutes. Mes créneaux les plus confortables sont en fin de journée en semaine, ou le samedi ; dites-moi ce qui vous arrange et je m'adapte.
> 
> Bien cordialement,
> --
> Jorys Damas
> Fondateur · Damedia Agency
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

print("Préparation du message en fil de discussion :")
print(f"To: {TO_EMAIL}")
print(f"Subject: {SUBJECT}")
print(f"In-Reply-To: {IN_REPLY_TO}")
print(f"References: {REFERENCES}")

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, [TO_EMAIL], msg.as_string())

print("SUCCÈS : Réponse envoyée avec succès à Jorys Damas dans le même fil de discussion.")
