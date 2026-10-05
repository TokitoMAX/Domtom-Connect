import json, os, sys, re, ssl, smtplib, time, random
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

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
EXCLUSIONS_FILE = os.path.join(BASE_DIR, "scripts", "exclusions.json")
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_73_excellence.json")

CANDIDATES = [
    # 1. GUADELOUPE (Conciergerie de luxe & Intendance de villas de prestige)
    {
        "company": "The Golden Key Guadeloupe",
        "name": "Direction The Golden Key",
        "email": "booking@goldenkey-guadeloupe.com",
        "website": "https://thegoldenkey-guadeloupe.com",
        "source": "Site officiel thegoldenkey-guadeloupe.com",
        "territory": "Guadeloupe",
        "category": "Immobilier & Conciergerie",
        "hook": "vos services de conciergerie privée et la gestion sur mesure de propriétés d'exception en Guadeloupe",
        "core_value": "l'hospitalité haut de gamme et la tranquillité absolue des propriétaires exigeants"
    },
    {
        "company": "WIVM Guadeloupe",
        "name": "Sandrine et l'équipe WIVM",
        "email": "sandrine@wivm.fr",
        "website": "https://wivm.fr",
        "source": "Site officiel wivm.fr",
        "territory": "Guadeloupe",
        "category": "Immobilier & Conciergerie",
        "hook": "votre intendance de villas de luxe à Saint-François et votre gestion locative exclusive pour une clientèle internationale",
        "core_value": "la rigueur opérationnelle et la valorisation constante du patrimoine confié"
    },

    # 2. MARTINIQUE (Villas de standing & Conciergerie sur mesure)
    {
        "company": "Archipel Évasion Martinique",
        "name": "Direction Archipel Évasion",
        "email": "martinique@archipelevasion.com",
        "website": "https://archipelevasion.com",
        "source": "Site officiel archipelevasion.com",
        "territory": "Martinique",
        "category": "Immobilier & Conciergerie",
        "hook": "votre catalogue de résidences prestigieuses et vos expériences personnalisées pour les séjours de standing en Martinique",
        "core_value": "la sélection pointue de biens uniques et l'excellence du service de villégiature"
    },

    # 3. ÎLE MAURICE (Domaines de prestige, Resorts & Transactions exclusives)
    {
        "company": "Heritage Villas Valriche Maurice",
        "name": "Direction Heritage Villas Valriche",
        "email": "enquiry@villasvalriche.com",
        "website": "https://villasvalriche.com",
        "source": "Site officiel villasvalriche.com",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "votre domaine d'exception de Bel Ombre et vos villas de prestige intégrées dans un environnement naturel préservé",
        "core_value": "l'art de vivre mauricien et la création de valeur patrimoniale pérenne pour les investisseurs internationaux"
    },
    {
        "company": "The Estate Mauritius",
        "name": "Direction The Estate Mauritius",
        "email": "contact@the-estate-mauritius.com",
        "website": "https://the-estate-mauritius.com",
        "source": "Site officiel the-estate-mauritius.com",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "votre portefeuille indépendant de propriétés haut de gamme et votre accompagnement confidentiel des acquéreurs",
        "core_value": "la discrétion dans les transactions et l'expertise ciblée des opportunités foncières mauriciennes"
    },
    {
        "company": "Pam Golding Mauritius",
        "name": "Direction Projets Pam Golding",
        "email": "projects@pamgolding.mu",
        "website": "https://pamgolding.mu",
        "source": "Site officiel pamgolding.mu",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "vos grands projets résidentiels de standing et votre réseau international de commercialisation immobilière",
        "core_value": "la notoriété globale et la solidité de l'accompagnement juridique et fiscal pour les investisseurs"
    },
    {
        "company": "MJ Développement Maurice",
        "name": "Direction MJ Développement",
        "email": "info@mj-developpement.com",
        "website": "https://mj-developpement.com",
        "source": "Site officiel mj-developpement.com",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "votre conception de resorts hôteliers et de villas de grand luxe dans l'ouest et le sud mauricien",
        "core_value": "l'élégance architecturale et l'attractivité locative des investissements en pleine propriété"
    },

    # 4. SÉNÉGAL (Saly & Petite Côte, Immobilier balnéaire de référence)
    {
        "company": "Elite Saly Sénégal",
        "name": "Direction Elite Saly",
        "email": "info@elite-saly.com",
        "website": "https://elite-saly.com",
        "source": "Site officiel elite-saly.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre expertise immobilière sur la Petite Côte et votre gestion locative attentive à Saly",
        "core_value": "la relation client personnalisée et la parfaite maîtrise du marché immobilier balnéaire sénégalais"
    },
    {
        "company": "Immo Plage Sénégal",
        "name": "Direction Immo Plage",
        "email": "contact@immobilier-saly.com",
        "website": "https://immobilier-saly.com",
        "source": "Site officiel immobilier-saly.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre offre de villas en bord de mer et votre accompagnement des résidents et investisseurs francophones à Saly",
        "core_value": "la transparence dans les acquisitions et la sérénité garantie aux propriétaires"
    },
    {
        "company": "Saly Immo Sénégal",
        "name": "Direction Saly Immo",
        "email": "contact@saly-immo-senegal.com",
        "website": "https://agence-immobiliere-saly.com",
        "source": "Site officiel agence-immobiliere-saly.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre présence historique et vos transactions sécurisées de villas et terrains sur la zone de Saly",
        "core_value": "la sécurité contractuelle et l'optimisation des projets de vie et de villégiature"
    },

    # 5. BÉNIN & CÔTE D'IVOIRE (Agroalimentaire d'excellence & Soins de terroir)
    {
        "company": "Espace Cajou Afrique Bénin",
        "name": "Direction Espace Cajou Afrique",
        "email": "infos@espacecajouafrique.com",
        "website": "https://espacecajouafrique.com",
        "source": "Site officiel espacecajouafrique.com",
        "territory": "Bénin",
        "category": "Marques & Terroirs",
        "hook": "votre filière d'exportation de noix de cajou de haute qualité et votre engagement pour la valorisation du terroir béninois",
        "core_value": "le respect des calibres premium et l'approvisionnement fiable des circuits d'importation internationaux"
    },
    {
        "company": "Adeba Nature Côte d'Ivoire",
        "name": "Direction Adeba Nature",
        "email": "info@adebanature.com",
        "website": "https://adebanature.com",
        "source": "Site officiel adebanature.com",
        "territory": "Côte d'Ivoire",
        "category": "Marques & Terroirs",
        "hook": "vos soins cosmétiques naturels formulés à partir de beurre de karité pur et de trésors botaniques ivoiriens",
        "core_value": "la noblesse des ingrédients naturels et le rayonnement du savoir-faire dermo-cosmétique africain"
    }
]

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        try:
            with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_contacts_db(data):
    with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def add_lead_to_db(db, lead):
    email = lead["email"].lower().strip()
    domain = email.split("@")[-1]
    company = lead["company"].strip()
    
    if "contacts" not in db:
        db["contacts"] = []
    if "domains" not in db:
        db["domains"] = []
    if "companies" not in db:
        db["companies"] = []
        
    db["contacts"].append({
        "email": email,
        "company": company,
        "territory": lead.get("territory", ""),
        "category": lead.get("category", ""),
        "date_contact": formatdate(localtime=True),
        "source": lead.get("source", ""),
        "batch": "Batch 73 Excellence Territoriale"
    })
    if domain not in db["domains"]:
        db["domains"].append(domain)
    if company not in db["companies"]:
        db["companies"].append(company)
    save_contacts_db(db)

def generate_custom_email(lead):
    name = lead.get("name", "Madame, Monsieur")
    company = lead["company"]
    hook = lead["hook"]
    core_value = lead["core_value"]
    territory = lead["territory"]
    cat = lead.get("category", "")

    if "Terroirs" in cat:
        subject = f"Mise en valeur et développement commercial pour {company}"
        lead_opening = f"J'ai pris le temps d'étudier avec grand intérêt {hook}."
        challenge_p1 = f"Lorsque l'on défend une marque et une filière exigeante attachée à {core_value}, les défis majeurs concernent la régularité des commandes hors marché domestique, la visibilité auprès des acheteurs solvables et l'ouverture de débouchés stables avec la diaspora et les réseaux premium."
    else:
        subject = f"Synergies d'affaires et perspectives de croissance pour {company}"
        lead_opening = f"Je vous écris après avoir attentivement analysé {hook}."
        challenge_p1 = f"Dans un secteur où {core_value} font toute la différence, les priorités se concentrent souvent sur l'entrée de nouveaux mandats qualifiés, la connexion directe avec des investisseurs sérieux de la diaspora et le développement du chiffre d'affaires sans alourdir vos coûts de structure."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Chez Domtom Connect, nous déployons notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, grâce à des actions ciblées de mise en relation d'affaires qualifiée, d'apport d'opportunités concrètes et de mise en visibilité.

Quels sont aujourd'hui vos principaux freins ou priorités pour accélérer le développement de {company} ?

Si vous êtes ouvert à un court échange informel de dix minutes cette semaine, ce sera un réel plaisir d'évoquer ensemble des pistes immédiatement pertinentes pour votre activité.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Plateforme d'accélération et de mise en relation d'affaires
WhatsApp direct, +33 6 20 78 33 77
Plateforme web, www.domtomconnect.com"""

    return subject, body

def check_style_rules(subject, body):
    errors = []
    if ":" in subject:
        errors.append(f"Deux-points trouvé dans le sujet, {subject}")
    if ":" in body:
        errors.append("Deux-points trouvé dans le corps du message")
    if " - " in body or " - " in subject:
        errors.append("Tiret d'incise ' - ' trouvé au milieu d'une phrase")
    mandatory = "notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs"
    if mandatory not in body:
        errors.append("Formule obligatoire Tremplin absente ou altérée")
    return errors

def validate_and_prepare_batch():
    print("=== VALIDATION STRICTE DU BATCH 73 (EXCELLENCE TERRITORIALE) ===", flush=True)
    valid_leads = []
    for c in CANDIDATES:
        email = c["email"].lower().strip()
        comp = c["company"].strip()
        
        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"[REJET DÉDUP/EXCLUSION] {comp} <{email}>, {reason}")
            continue
            
        is_valid, diag = verify_email_target(email)
        if not is_valid:
            print(f"[REJET DNS/MX] {comp} <{email}>, {diag}")
            continue
            
        subj, body = generate_custom_email(c)
        errors = check_style_rules(subj, body)
        if errors:
            print(f"[ERREUR STYLE] {comp} <{email}>, {errors}")
            continue
            
        c["subject"] = subj
        c["body"] = body
        valid_leads.append(c)
        print(f"[VALIDÉ 100%] {comp} <{email}> ({c['territory']})")

    print(f"\nTotal prêts pour le Batch 73, {len(valid_leads)} leads.")
    with open(BATCH_FILE, "w", encoding="utf-8") as f:
        json.dump(valid_leads, f, indent=2, ensure_ascii=False)
    return valid_leads

def send_batch(dry_run=True):
    leads = validate_and_prepare_batch()
    if not leads:
        print("Aucun lead à envoyer.")
        return

    print("="*75)
    print(f"=== {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI RÉEL'} DU BATCH 73 ({len(leads)} LEADS) ===")
    print("="*75)

    db = load_contacts_db()
    sent_count = 0
    context = ssl.create_default_context()
    server = None

    if not dry_run:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, APP_PASSWORD)

    try:
        for idx, lead in enumerate(leads, 1):
            email = lead["email"].lower().strip()
            comp = lead["company"].strip()
            subj = lead["subject"]
            body = lead["body"]

            if dry_run:
                print(f"[{idx}/{len(leads)}] [DRY-RUN OK] {comp} <{email}> ({lead['territory']})")
                sent_count += 1
            else:
                msg = MIMEText(body, "plain", "utf-8")
                msg["Subject"] = subj
                msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
                msg["To"] = f"{lead.get('name', comp)} <{email}>"
                msg["Date"] = formatdate(localtime=True)
                msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

                server.sendmail(SENDER_EMAIL, [email], msg.as_string())
                add_lead_to_db(db, lead)
                sent_count += 1
                print(f"[{idx}/{len(leads)}] ENVOYÉ AVEC SUCCÈS, {comp} <{email}> ({lead['territory']})")

                delay = random.uniform(4.0, 7.0)
                time.sleep(delay)
    finally:
        if server:
            server.quit()

    print("="*75)
    print(f"RÉSULTAT DU BATCH 73, {sent_count} envoyés sur {len(leads)} cibles.")
    print("="*75)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv or "-d" in sys.argv
    send_batch(dry_run=is_dry)
