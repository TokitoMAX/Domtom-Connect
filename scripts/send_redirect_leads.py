import smtplib, ssl, json, time, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

REDIRECT_LEADS = [
    {
        "company": "Car'Men Location Citadelle",
        "email": "carmen-location@citadelle-sa.com",
        "territory": "Martinique (Le Lamentin)",
        "subject": "Échange sur votre développement de flotte / Car'Men Location",
        "body": """Bonjour,

Faisant suite au retour d'Isabelle CAPEL SIMBA qui m'a indiqué vos coordonnées durant ses congés, je me permets de vous contacter concernant Car'Men Location au Lamentin.

Chez Domtom Connect, nous accompagnons les dirigeants et structures de mobilité afin de les aider à sécuriser leur trésorerie, maîtriser leurs coûts d'entretien de parc et diversifier leur clientèle.

Dans votre activité aujourd'hui, quelles sont les priorités ou les problématiques logistiques qui sollicitent le plus votre attention ?

Nous animons également un groupe d'entraide WhatsApp et l'application DTC Pulse réunissant des professionnels des Caraïbes et d'Afrique pour partager ressources et solutions.

Seriez-vous ouvert à un court échange téléphonique de dix minutes cette semaine selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "RCM Location Guadeloupe",
        "email": "contacts.rcmlocation@gmail.com",
        "territory": "Guadeloupe (Les Abymes)",
        "subject": "Échange sur votre activité de location de véhicules / RCM Location",
        "body": """Bonjour,

Faisant suite à la notification de changement d'adresse de RCM Location aux Abymes, je vous réadresse notre message sur vos nouvelles coordonnées.

Chez Domtom Connect, notre mission est d'apporter un soutien concret aux professionnels et loueurs indépendants dans la gestion de leurs contraintes locales et insulaires (pièces détachées, optimisation de parc et trésorerie).

Dans votre fonctionnement régulier, quel est le domaine qui mobilise le plus votre énergie actuellement ?

Nous avons également mis en place un réseau d'entraide sur WhatsApp et l'application DTC Pulse pour connecter nos territoires ultramarins et la diaspora.

Seriez-vous disponible pour un court appel téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def main():
    print("=== ENVOI DES REDIRECTIONS AUTOMATIQUES (CAR'MEN & RCM) ===")
    
    # 1. Vérifications de sécurité
    for lead in REDIRECT_LEADS:
        if ":" in lead["subject"]:
            raise ValueError(f"Deux-points dans sujet: {lead['company']}")
        if ":" in lead["body"]:
            raise ValueError(f"Deux-points dans corps: {lead['company']}")
        ok, msg = verify_email_target(lead["email"])
        if not ok:
            raise ValueError(f"MX invalide pour {lead['email']}: {msg}")
        print(f"Sécurité OK : {lead['company']} <{lead['email']}>")

    # 2. Envoi SMTP
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 465
    SENDER_EMAIL = "domtomconnect@gmail.com"
    APP_PASSWORD = "geqpuqluimxdjxeo"

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP réussie.")
        for lead in REDIRECT_LEADS:
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
            msg["To"] = lead["email"]
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            server.sendmail(SENDER_EMAIL, [lead["email"]], msg.as_string())
            print(f"ENVOYÉ AVEC SUCCÈS -> {lead['company']} ({lead['email']})")
            time.sleep(5)

    # 3. Mise à jour de la base contacts
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_file = os.path.join(base_dir, "contacts_deja_contactes.json")
    with open(db_file, "r", encoding="utf-8") as f:
        db = json.load(f)

    for lead in REDIRECT_LEADS:
        em = lead["email"].lower().strip()
        dom = em.split("@")[1]
        comp = lead["company"]
        if em not in db.get("emails", []): db.setdefault("emails", []).append(em)
        if dom not in db.get("domains", []): db.setdefault("domains", []).append(dom)
        if comp not in db.get("companies", []): db.setdefault("companies", []).append(comp)
        existing = set(c["email"].lower().strip() for c in db.get("contacts", []))
        if em not in existing:
            db.setdefault("contacts", []).append({"email": em, "company": comp})

    db["total_contacts"] = len(db["contacts"])
    db["total_domains"] = len(db["domains"])

    temp_f = db_file + ".tmp"
    with open(temp_f, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    for _ in range(5):
        try:
            os.replace(temp_f, db_file)
            break
        except Exception:
            time.sleep(0.5)

    print(f"Base de données mise à jour : {db['total_contacts']} contacts uniques.")

if __name__ == "__main__":
    main()
