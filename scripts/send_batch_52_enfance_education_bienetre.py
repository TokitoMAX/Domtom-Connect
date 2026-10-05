import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# BATCH 52 — BIEN-ÊTRE DES ENFANTS, ÉDUCATION & PETITE ENFANCE
# Structure :
# 1. Accroche valorisante sur leur métier
# 2. Accompagnement Domtom Connect face aux problématiques d'entreprises
# 3. Écoute de leurs besoins et priorités de terrain d'abord
# 4. Vision : Bâtir un réseau fort (Caraïbes, Océan Indien, Afrique, Diaspora) + Groupe WhatsApp + Application DTC Pulse
# 5. Court appel de 10 min
# Règle d'or : Zéro deux-points (:), style fluide et direct, adresses 100% réelles
LEADS = [
    {
        "company": "EduKaraib",
        "email": "contact@edukaraib.com",
        "territory": "Caraïbes (Guadeloupe, Martinique, Guyane)",
        "source": "https://edukaraib.com/contact",
        "subject": "Échange sur vos besoins et accompagnement scolaire / EduKaraib",
        "body": """Bonjour,

Je découvre votre travail avec EduKaraib. Bravo pour ce que vous construisez pour faciliter les cours particuliers et le soutien scolaire dans nos territoires caribéens.

Chez Domtom Connect, nous accompagnons les entreprises et les porteurs de projets ultramarins afin de les aider à répondre concrètement à leurs différentes problématiques de développement, d'organisation ou de gestion.

Dans votre activité aujourd'hui, quels sont vos principaux besoins ou les sujets qui vous demandent le plus d'énergie ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp réunissant des dirigeants, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse pour échanger des solutions et créer des synergies utiles.

Seriez-vous partant pour un court appel de dix minutes cette semaine pour faire connaissance et parler de vos priorités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CRECH'ENDO",
        "email": "contact@crechendo97.com",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://crechendo97.fr",
        "subject": "Échange sur vos priorités d'accueil et gestion en Martinique / CRECH'ENDO",
        "body": """Bonjour,

Je tiens à saluer le travail réalisé par CRECH'ENDO en Martinique depuis dix ans pour l'accueil et le bien-être des tout-petits ainsi que le soutien aux familles.

Chez Domtom Connect, nous accompagnons les dirigeants et porteurs de projets dans nos îles pour les aider à surmonter leurs problématiques de gestion, de recrutement ou de continuité opérationnelle.

Dans votre quotidien de directrice ou directeur, quel est aujourd'hui votre principal besoin ou le défi qui mobilise le plus votre temps ?

Par ailleurs, notre objectif est de créer un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp regroupant des entreprises, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse afin de nous entraider concrètement.

Serait-il possible de caler un court échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Caraïbéditions",
        "email": "fc@caraibeditions.fr",
        "territory": "Guadeloupe / Martinique",
        "source": "https://caraibeditions.fr",
        "subject": "Échange sur vos besoins dans l'édition jeunesse / Caraïbéditions",
        "body": """Bonjour Florent Charbonnier,

Je suis avec beaucoup d'attention les parutions de Caraïbéditions. Bravo pour votre engagement constant à faire rayonner les livres jeunesse, les contes et la bande dessinée auprès des enfants de nos îles.

Avec Domtom Connect, nous accompagnons les entreprises et créateurs ultramarins afin de les aider à lever leurs freins logistiques, commerciaux ou organisationnels.

Dans votre activité éditoriale actuellement, quels sont vos plus grands besoins ou les points de blocage que vous aimeriez débloquer ?

Par ailleurs, notre ambition est de bâtir un réseau fort entre les Caraïbes, le continent africain et sa diaspora. Nous animons un groupe WhatsApp réunissant des dirigeants, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse pour partager des ressources et créer des partenariats.

Auriez-vous dix minutes ces prochains jours pour un bref échange téléphonique informel ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Editions Orphie",
        "email": "contact@editions-orphie.com",
        "territory": "La Réunion (Saint-Denis)",
        "source": "https://editions-orphie.com",
        "subject": "Échange sur vos priorités et la littérature jeunesse / Éditions Orphie",
        "body": """Bonjour,

Bravo pour le magnifique travail des Éditions Orphie depuis tant d'années au service des contes traditionnels, de la jeunesse et de la culture dans l'océan Indien.

Chez Domtom Connect, nous accompagnons les entreprises et porteurs de projets de nos territoires pour les aider à répondre efficacement à leurs problématiques de fonctionnement, de distribution et de gestion.

Dans votre exploitation aujourd'hui, quel est le besoin prioritaire ou la contrainte qui pèse le plus sur votre activité ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant l'océan Indien, les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp rassemblant des entrepreneurs, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse pour échanger des opportunités directes.

Seriez-vous partants pour un court appel de dix minutes cette semaine afin d'en discuter simplement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Les Lapinous Micro-creche Sensorielle",
        "email": "micro.creche.sensorielle@gmail.com",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://www.micro-creche-sensorielle.fr/",
        "subject": "Échange sur vos besoins en micro-crèche en Guadeloupe / Les Lapinous",
        "body": """Bonjour,

Je découvre votre engagement remarquable autour de l'éveil sensoriel et du bien-être des tout-petits avec Les Lapinous et Ti Boudou en Guadeloupe.

Chez Domtom Connect, nous accompagnons les porteurs de projets et gestionnaires de structures locales afin de les aider à faire face à leurs problématiques quotidiennes de gestion, de matériel et d'organisation.

Dans votre quotidien d'accueil, quels sont vos besoins les plus urgents ou les sujets qui vous prennent le plus d'énergie ?

Par ailleurs, notre démarche vise à créer un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous réunissons des dirigeants, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse au sein d'un groupe WhatsApp d'entraide pour partager conseils et solutions.

Pourrions-nous convenir d'un court point téléphonique de dix minutes à votre convenance ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "L'Arche des Bambinous",
        "email": "microcreche.larchedesbambinous@gmail.com",
        "territory": "Guadeloupe (Baie-Mahault Belcourt)",
        "source": "http://larchedesbambinous.fr/",
        "subject": "Échange sur vos priorités petite enfance / L'Arche des Bambinous",
        "body": """Bonjour,

Félicitations pour l'accueil bienveillant et sécurisant que vous offrez chaque jour aux tout-petits et aux parents au sein de L'Arche des Bambinous à Belcourt.

Avec Domtom Connect, nous accompagnons les entrepreneurs et structures de proximité dans nos îles pour les aider à répondre à leurs différentes problématiques opérationnelles et managériales.

Dans votre gestion quotidienne, quel est le besoin majeur ou la difficulté organisationnelle qui vous sollicite le plus en ce moment ?

Par ailleurs, notre mission est de développer un réseau fort reliant les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp regroupant des entreprises, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse pour nous entraider concrètement.

Accepteriez-vous un court appel informel de dix minutes d'ici la semaine prochaine pour faire le point ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "NEOCLUB MONTESSORI",
        "email": "neoclubcontact@gmail.com",
        "territory": "Guyane (Kourou)",
        "source": "https://neoclubmontessori.fr/",
        "subject": "Échange sur vos besoins éducatifs en Guyane / NEOCLUB Montessori",
        "body": """Bonjour,

Je salue votre démarche à Kourou avec NEOCLUB pour faire vivre la pédagogie Montessori et accompagner l'autonomie des enfants en Guyane.

Chez Domtom Connect, nous accompagnons les structures et porteurs de projets ultramarins pour les aider à surmonter leurs problématiques de fonctionnement, d'approvisionnement ou de coordination.

Dans votre quotidien d'école et d'éveil, quels sont vos principaux besoins ou les freins matériels et organisationnels que vous rencontrez ?

Par ailleurs, nous bâtissons un réseau fort reliant les Caraïbes, la Guyane, le continent africain et sa diaspora. Nous animons un groupe WhatsApp d'entraide entre acteurs engagés, couplé à notre application mobile DTC Pulse, afin de créer des passerelles directes.

Auriez-vous dix minutes cette semaine ou la suivante pour un bref échange téléphonique ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Association Les Petits Papillons",
        "email": "lespetitspapillons973@gmail.com",
        "territory": "Guyane (Matoury)",
        "source": "https://associationlespetitspapillons.fr/",
        "subject": "Échange sur vos besoins de gestion en crèche / Les Petits Papillons",
        "body": """Bonjour,

Bravo à toute l'équipe des Petits Papillons pour la gestion de vos différentes structures d'accueil à Matoury, telles que Ti Moun, Adi et Nana ou Raoul et Germaine.

Chez Domtom Connect, nous accompagnons les organisations et gestionnaires de terrain pour les aider à résoudre leurs problématiques de logistique, d'organisation d'équipe ou de visibilité.

Dans le pilotage de vos différents sites, quel est actuellement votre besoin prioritaire ou le sujet qui mobilise le plus vos ressources ?

Par ailleurs, notre objectif est de bâtir un réseau fort reliant nos territoires, le continent africain et la diaspora. Nous réunissons des responsables de structures, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse sur un groupe WhatsApp pour échanger des solutions utiles.

Seriez-vous disponibles pour un court entretien de dix minutes ces prochains jours afin de faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "JUA School",
        "email": "contact@juaschool.com",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://juaschool.com",
        "subject": "Échange sur vos besoins éducatifs à Mayotte / JUA School",
        "body": """Bonjour,

Je tiens à féliciter l'équipe de JUA School à Mamoudzou pour son engagement à proposer une pédagogie moderne et stimulante pour la jeunesse à Mayotte.

Avec Domtom Connect, nous accompagnons les structures d'enseignement et porteurs de projets dans nos territoires afin de les aider à répondre à leurs différentes problématiques de ressources et d'organisation.

Dans le développement de votre école aujourd'hui, quels sont vos besoins essentiels ou les défis qui vous demandent le plus d'énergie ?

Par ailleurs, nous avons pour mission de créer un réseau fort reliant l'océan Indien, les Caraïbes, le continent africain et sa diaspora. Nous mettons en place un groupe WhatsApp regroupant des entreprises, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse afin de nous soutenir mutuellement.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilités pour en discuter ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Educ Oi",
        "email": "educoireunion@gmail.com",
        "territory": "La Réunion (Saint-Gilles-les-Hauts)",
        "source": "https://educ-oi.com/",
        "subject": "Échange sur vos besoins de distribution à La Réunion / Educ Oi",
        "body": """Bonjour,

Bravo pour votre initiative avec Educ Oi. Mettre à disposition du matériel pédagogique et des jeux d'éveil de qualité pour les crèches, les écoles et les parents à La Réunion est une mission précieuse.

Chez Domtom Connect, nous accompagnons les entreprises et artisans péi pour les aider à surmonter leurs problématiques de logistique maritime, d'approvisionnement ou de développement commercial.

Dans votre activité de distribution aujourd'hui, quel est le besoin majeur ou le point de blocage qui vous pèse le plus ?

Par ailleurs, notre ambition est de bâtir un réseau fort reliant l'océan Indien, les Caraïbes, le continent africain et sa diaspora. Nous rassemblons des entreprises, des porteurs de projets et des utilisateurs de notre application mobile DTC Pulse dans un groupe WhatsApp pour créer des synergies d'affaires concrètes.

Seriez-vous partant pour un court échange téléphonique de dix minutes cette semaine pour faire le point ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"emails": [], "domains": [], "companies": []}

def save_contacts_db(db):
    with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def add_lead_to_db(db, lead):
    email = lead["email"].lower().strip()
    domain = email.split("@")[1]
    company = lead["company"].strip()
    
    if email not in db.get("emails", []):
        db.setdefault("emails", []).append(email)
    if domain not in db.get("domains", []):
        db.setdefault("domains", []).append(domain)
    if company not in db.get("companies", []):
        db.setdefault("companies", []).append(company)

def verify_lead_safety(lead):
    # Verif 1: Aucun deux-points (:) dans le sujet ni le corps
    if ":" in lead["subject"]:
        raise ValueError(f"Interdit - Deux-points détecté dans le sujet pour {lead['company']}")
    if ":" in lead["body"]:
        raise ValueError(f"Interdit - Deux-points détecté dans le corps pour {lead['company']}")
    
    # Verif 2: Verification DNS / MX
    is_valid, msg = verify_email_target(lead["email"])
    if not is_valid:
        raise ValueError(f"Echec verification DNS/MX pour {lead['email']} - {msg}")
    
    # Verif 3: Deduplication temps reel
    is_dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
    if is_dup:
        raise ValueError(f"Doublon detecte pour {lead['company']} ({lead['email']}) - {reason}")
    
    return True

def run_batch(dry_run=False):
    print(f"=== BATCH 52 (BIEN-ÊTRE ENFANTS, ÉVEIL & ÉDUCATION) - {len(LEADS)} CIBLES ===")
    
    # Phase 1: Validation pre-vol de securite
    print("\n--- Phase 1 - Validation DNS, MX, Deduplication et Conformite de Style (Zéro deux-points) ---")
    for idx, lead in enumerate(LEADS, 1):
        try:
            verify_lead_safety(lead)
            print(f"[{idx}/{len(LEADS)}] OK - {lead['company']} ({lead['email']}) valide (Source: {lead['source']})")
        except Exception as e:
            print(f"[{idx}/{len(LEADS)}] ERREUR CRITIQUE - {e}")
            sys.exit(1)
            
    print("\nValidation pré-vol 100% réussie.")
    
    if dry_run:
        print("\n[DRY RUN ACTIF] Aucun email envoyé. Toutes les cibles sont 100% conformes et prêtes.")
        return

    print("Connexion au serveur SMTP Gmail...")
    db = load_contacts_db()
    context = ssl.create_default_context()
    sent_count = 0
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP établie avec succès.\n")
        
        for idx, lead in enumerate(LEADS, 1):
            recipient = lead["email"]
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            print(f"[{idx}/{len(LEADS)}] Envoi à {lead['company']} ({recipient})...")
            server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
            print(f" -> DELIVRÉ avec succès à {recipient}")
            
            # Enregistrement immédiat
            add_lead_to_db(db, lead)
            save_contacts_db(db)
            sent_count += 1
            
            if idx < len(LEADS):
                sleep_time = random.uniform(13.0, 18.0)
                print(f" -> Temporisation sécurisée de {sleep_time:.1f} secondes...")
                time.sleep(sleep_time)

    print(f"\n=== BATCH 52 TERMINÉ - {sent_count}/{len(LEADS)} EMAILS ENVOYÉS AVEC SUCCÈS ===")

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    run_batch(dry_run=is_dry)
