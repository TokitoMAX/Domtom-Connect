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

EXCLUSION_FILE = "contacts_deja_contactes.json"

prospect = {
    "company": "Groupe Cananga",
    "name": "Direction commerciale",
    "email": "commercial@cananga.net",
    "domain": "cananga.net",
    "zone": "Mayotte",
    "subject": "Approvisionnements maritimes et distribution insulaire / Groupe Cananga",
    "body": """Bonjour,

Le Groupe Cananga joue un rôle économique déterminant à Mayotte en assurant l'importation et la distribution de biens essentiels pour l'ensemble du territoire depuis Kawéni.

Opérer une chaîne de distribution d'envergure dans le contexte mahorais impose des contraintes logistiques quotidiennes exceptionnelles. Entre les cadences de rotation au port de Longoni, la gestion rigoureuse des stocks face aux délais maritimes et les arbitrages de trésorerie sous forte tension d'approvisionnement, le pilotage opérationnel absorbe une énergie managériale considérable.

Nous menons actuellement des échanges directs avec les dirigeants de structures majeures de l'océan Indien pour comprendre les réalités vécues sur le terrain. À votre niveau, quel est le principal irritant ou le défi d'organisation qui pèse le plus lourd sur vos opérations au quotidien ?

Seriez-vous disponibles pour un court échange téléphonique informel de dix minutes ces prochains jours afin de partager votre retour d'expérience ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""
}

# Strict zero colons check
if ":" in prospect["subject"]:
    raise ValueError("Erreur: deux-points dans le sujet !")
if ":" in prospect["body"]:
    raise ValueError("Erreur: deux-points dans le corps !")

with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)

known_emails = set(c["email"].lower().strip() for c in db["contacts"])
known_domains = set(db["domains"])

if prospect["email"].lower() in known_emails:
    raise ValueError("Email déjà dans la base !")
if prospect["domain"] in known_domains:
    raise ValueError("Domaine déjà dans la base !")

msg = MIMEText(prospect["body"], "plain", "utf-8")
msg["Subject"] = Header(prospect["subject"], "utf-8")
msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
msg["To"] = prospect["email"]
msg["Reply-To"] = EMAIL_USER

print(f"Envoi à {prospect['company']} ({prospect['email']})...")
with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
    server.login(EMAIL_USER, EMAIL_PASS)
    server.sendmail(EMAIL_USER, [prospect["email"]], msg.as_string())

print(f"==> ENVOYÉ AVEC SUCCÈS À {prospect['email']} !")

db["contacts"].append({
    "email": prospect["email"],
    "name": prospect["name"],
    "company": prospect["company"]
})
db["domains"].append(prospect["domain"])

with open(EXCLUSION_FILE, "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Exclusion mise à jour avec succès.")
