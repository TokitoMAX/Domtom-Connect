import smtplib, ssl, json, time, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target
from dedup_engine import is_domain_or_company_duplicate

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"emails": [], "domains": [], "companies": [], "contacts": []}

def save_contacts_db(db):
    temp_file = CONTACTS_DB_FILE + ".tmp"
    with open(temp_file, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    for _ in range(5):
        try:
            if os.path.exists(CONTACTS_DB_FILE):
                os.replace(temp_file, CONTACTS_DB_FILE)
            else:
                os.rename(temp_file, CONTACTS_DB_FILE)
            return
        except Exception:
            time.sleep(0.5)

TARGETS = [
    {
        "name": "Sandra (Lead Outil Anamnèse)",
        "email": "sandsaintg@gmail.com",
        "subject": "Votre diagnostic Anamnèse et échange sur votre activité / Domtom Connect",
        "body": """Bonjour Sandra,

J'ai vu que vous aviez pris quelques minutes aujourd'hui pour passer notre diagnostic d'Anamnèse sur Domtom Connect, et je tenais à vous saluer personnellement.

Votre profil diagnostiqué est ressorti sous la typologie "Le spectateur théoricien (T-02)" dans le secteur du conseil, de la prestation de service et de l'artisanat en Martinique.

C'est un profil très fréquent chez les entrepreneurs qui sont déjà installés et possèdent une réelle maîtrise technique de leur métier, mais qui se retrouvent parfois ralentis dans leur développement — notamment par la gestion du temps commercial, la transformation des devis en contrats signés ou la difficulté d'attirer des clients réguliers sans s'épuiser.

Je serais curieux d'avoir votre retour à chaud. Qu'avez-vous pensé des résultats de ce diagnostic ? Est-ce que cela résonne avec ce que vous vivez sur le terrain en Martinique en ce moment ?

Chez Domtom Connect, nous développons des outils opérationnels concrets et proposons des accompagnements sur-mesure pour aider les indépendants et prestataires de nos îles à simplifier leur acquisition et passer un cap sereinement.

Si cela vous dit, nous pourrions caler un court échange téléphonique de quinze minutes cette semaine, en toute tranquillité, pour faire le point sur vos priorités actuelles et voir si certains de nos outils ou un accompagnement ciblé peuvent vous faire gagner un temps précieux.

Quel jour ou créneau vous conviendrait le mieux ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "name": "Noa Plongée (Relais nouvelle adresse)",
        "email": "noaplongee@gmail.com",
        "subject": "Développement nautique et partenariats / Noa Plongée",
        "body": """Bonjour,

Merci pour votre retour et pour la transmission de votre nouvelle adresse e-mail.

Félicitations pour la renommée de Noa Plongée à la marina de Saint-François et pour vos explorations sous-marines de qualité en Guadeloupe.

Chez Domtom Connect, notre mission est de connecter les prestataires touristiques et nautiques aux opportunités d'affaires de la diaspora et des îles, tout en aidant à développer les réservations directes hors commissions.

Dans la conduite de votre saison nautique, quelle problématique demande le plus d'énergie à votre équipe en ce moment ?

Nous serions ravis de vous présenter notre communauté WhatsApp d'entraide et l'application DTC Pulse.

Pourrions-nous prévoir un point téléphonique rapide de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def send_targets(dry_run=False):
    print("=== ENVOI STRATÉGIQUE : LEAD ANAMNÈSE (SANDRA) & RELAIS NOA PLONGÉE ===", flush=True)
    db = load_contacts_db()
    
    for t in TARGETS:
        if ":" in t["subject"] or ":" in t["body"]:
            raise ValueError(f"Deux-points interdit détecté pour {t['name']}")
        ok, msg = verify_email_target(t["email"])
        if not ok:
            raise ValueError(f"Erreur validation MX pour {t['email']} : {msg}")
        print(f"Validation OK pour {t['name']} ({t['email']})", flush=True)

    if dry_run:
        print("\nMode simulation (--dry-run). Aucun email envoyé.", flush=True)
        return

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP établie.", flush=True)
        
        for idx, t in enumerate(TARGETS, 1):
            msg = MIMEText(t["body"], "plain", "utf-8")
            msg["Subject"] = t["subject"]
            msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
            msg["To"] = t["email"]
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            server.sendmail(SENDER_EMAIL, [t["email"]], msg.as_string())
            print(f"[{idx}/{len(TARGETS)}] ENVOYÉ avec succès à {t['name']} ({t['email']})", flush=True)
            
            # Mise à jour DB
            em = t["email"].lower().strip()
            if em not in db.get("emails", []):
                db.setdefault("emails", []).append(em)
            existing = set(c["email"].lower().strip() for c in db.get("contacts", []))
            if em not in existing:
                db.setdefault("contacts", []).append({"email": em, "company": t["name"]})
            save_contacts_db(db)
            
            if idx < len(TARGETS):
                time.sleep(14.0)

    print("\nOpération terminée avec succès.", flush=True)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    send_targets(dry_run=is_dry)
