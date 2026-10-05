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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_71_expansion.json")

CANDIDATES = [
    # 1. MADAGASCAR (Vanille d'excellence & Terroir d'exception)
    {
        "company": "Sahavanille Madagascar",
        "name": "Direction Sahavanille",
        "email": "contact@sahavanille.com",
        "website": "https://sahavanille.com",
        "source": "Site officiel sahavanille.com",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre filière d'excellence de vanille Bourbon naturelle et vos partenariats directs avec les planteurs de Madagascar",
        "core_value": "l'authenticité aromatique et la valorisation équitable des récoltes malgaches sur les marchés internationaux"
    },
    {
        "company": "Madagascar Flavors",
        "name": "Direction Madagascar Flavors",
        "email": "contact@madagascar-flavors.com",
        "website": "https://madagascar-flavors.com",
        "source": "Site officiel madagascar-flavors.com",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre savoir-faire de préparation et d'exportation de vanille et d'épices d'exception depuis la région de Sambava",
        "core_value": "le respect des standards d'affinage traditionnels et l'approvisionnement direct des professionnels de la gastronomie"
    },

    # 2. CÔTE D'IVOIRE (Conciergerie & Services d'Accueil)
    {
        "company": "Easy Ivoire Concierge",
        "name": "Direction Easy Ivoire",
        "email": "info@easyivoire.com",
        "website": "https://easyivoire.com",
        "source": "Site officiel easyivoire.com",
        "territory": "Côte d'Ivoire",
        "category": "Immobilier & Conciergerie",
        "hook": "vos solutions d'intendance haut de gamme et d'accueil personnalisé pour la diaspora et les voyageurs d'affaires en Côte d'Ivoire",
        "core_value": "la fluidité logistique et la tranquillité d'esprit garantie aux résidents et visiteurs exigeants"
    },

    # 3. BÉNIN (Immobilier de standing & Promotion foncière)
    {
        "company": "BENIN-IMMO",
        "name": "Direction BENIN-IMMO",
        "email": "contact@benin-immo.com",
        "website": "https://benin-immo.com",
        "source": "Site officiel benin-immo.com",
        "territory": "Bénin",
        "category": "Immobilier & Conciergerie",
        "hook": "votre maillage territorial et votre offre complète en transaction et sécurisation foncière à Cotonou et sur le littoral béninois",
        "core_value": "la transparence contractuelle et l'accompagnement sur mesure des acquéreurs locaux et internationaux"
    },
    {
        "company": "Ladynad Immobilier Bénin",
        "name": "Direction Ladynad Immobilier",
        "email": "contact@ladynadimmo.com",
        "website": "https://ladynadimmo.com",
        "source": "Site officiel ladynadimmo.com",
        "territory": "Bénin",
        "category": "Immobilier & Conciergerie",
        "hook": "vos réalisations en construction moderne et votre gestion locative rigoureuse au Bénin",
        "core_value": "la pérennité du bâti et la valorisation patrimoniale continue des actifs immobiliers"
    },
    {
        "company": "IMMOSUD BÉNIN",
        "name": "Direction IMMOSUD",
        "email": "info@immosud-benin.com",
        "website": "https://immosud-benin.com",
        "source": "Site officiel immosud-benin.com",
        "territory": "Bénin",
        "category": "Immobilier & Conciergerie",
        "hook": "votre portefeuille de biens résidentiels et professionnels ainsi que votre expertise du marché immobilier à Cotonou",
        "core_value": "la proximité client et la sécurité des investissements fonciers"
    },
    {
        "company": "Bénin Agence Immobilière",
        "name": "Direction Bénin Agence",
        "email": "info@beninagence.com",
        "website": "https://beninagence.com",
        "source": "Site officiel beninagence.com",
        "territory": "Bénin",
        "category": "Immobilier & Conciergerie",
        "hook": "votre présence active dans la transaction immobilière et votre accompagnement dédié aux investisseurs de la diaspora béninoise",
        "core_value": "la fiabilité juridique et la sélection de biens à fort potentiel de rentabilité"
    },
    {
        "company": "BENIN HOUSE",
        "name": "Direction BENIN HOUSE",
        "email": "contact@beninhouse.com",
        "website": "https://beninhouse.com",
        "source": "Site officiel beninhouse.com",
        "territory": "Bénin",
        "category": "Immobilier & Conciergerie",
        "hook": "votre catalogue de résidences de standing et vos solutions sur mesure de gestion locative au Bénin",
        "core_value": "le confort des locataires et la sérénité des propriétaires bailleurs"
    },

    # 4. TOGO (Immobilier de prestige & Aménagement)
    {
        "company": "TogoLux Properties Lomé",
        "name": "Direction TogoLux Properties",
        "email": "contact@togolux.com",
        "website": "https://togolux.com",
        "source": "Site officiel togolux.com",
        "territory": "Togo",
        "category": "Immobilier & Conciergerie",
        "hook": "votre positionnement de premier plan sur l'immobilier résidentiel et commercial haut de gamme à Lomé",
        "core_value": "l'exigence architecturale et la mise en relation d'acquéreurs solvables avec des biens d'exception"
    },
    {
        "company": "Lenbor Group Togo",
        "name": "Direction Lenbor Group",
        "email": "services@lenborgroup.com",
        "website": "https://lenborgroup.com",
        "source": "Site officiel lenborgroup.com",
        "territory": "Togo",
        "category": "Immobilier & Conciergerie",
        "hook": "votre vision intégrée alliant conseil en aménagement, transaction et développement d'infrastructures au Togo",
        "core_value": "l'efficacité opérationnelle et la création durable de valeur foncière"
    },

    # 5. SÉNÉGAL (Cosmétique naturelle, Soins & Terroir d'Afrique)
    {
        "company": "REEN Cosmetics Sénégal",
        "name": "Direction REEN Cosmetics",
        "email": "contact@reen.sn",
        "website": "https://reen.sn",
        "source": "Site officiel reen.sn",
        "territory": "Sénégal",
        "category": "Marques & Terroirs",
        "hook": "vos formulations cosmétiques naturelles et votre valorisation d'ingrédients africains d'exception pour les soins de la peau et des cheveux",
        "core_value": "l'alliance des richesses végétales locales et d'une cosmétologie moderne écoresponsable"
    },
    {
        "company": "BONFONI Sénégal",
        "name": "Direction BONFONI",
        "email": "contact@bonfoni.sn",
        "website": "https://bonfoni.sn",
        "source": "Site officiel bonfoni.sn",
        "territory": "Sénégal",
        "category": "Marques & Terroirs",
        "hook": "votre réseau de distribution et votre catalogue de soins et produits de beauté dédiés au bien-être au Sénégal",
        "core_value": "la qualité certifiée et l'accessibilité de soins de beauté premium pour une clientèle exigeante"
    },
    {
        "company": "Even Glowing Skin Sénégal",
        "name": "Direction Even Glowing Skin",
        "email": "contact@evenglowingskin.com",
        "website": "https://evenglowingskin.com",
        "source": "Site officiel evenglowingskin.com",
        "territory": "Sénégal",
        "category": "Marques & Terroirs",
        "hook": "votre gamme experte de soins dermo-cosmétiques ciblés et votre écoute attentive des besoins cutanés spécifiques",
        "core_value": "l'éclat naturel du teint et l'efficacité prouvée de rituels de beauté sains"
    },
    {
        "company": "Binta Beauty Sénégal",
        "name": "Direction Binta Beauty",
        "email": "contact@bintabeauty.com",
        "website": "https://bintabeauty.com",
        "source": "Site officiel bintabeauty.com",
        "territory": "Sénégal",
        "category": "Marques & Terroirs",
        "hook": "votre sélection soignée de soins capillaires et corporels ainsi que votre communauté grandissante de passionnés de beauté",
        "core_value": "la valorisation de l'élégance naturelle et le conseil personnalisé au quotidien"
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
        "batch": "Batch 71 Panafricain & Caraibe Expansion"
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
        subject = f"Mise en avant et expansion de {company}"
        lead_opening = f"J'ai pris connaissance avec un vif intérêt de {hook}."
        challenge_p1 = f"Lorsque l'on pilote une marque d'excellence valorisant {core_value}, les défis portent souvent sur la visibilité en dehors du marché domestique, l'accélération des flux de commandes et la structuration de relais de distribution solides auprès des diasporas et des clientèles premium."
    else:
        subject = f"Développement et partenariats stratégiques pour {company}"
        lead_opening = f"Je me permets de vous contacter après avoir étudié {hook}."
        challenge_p1 = f"Dans votre secteur où priment {core_value}, les enjeux majeurs restent l'acquisition directe de mandats ou de clients solvables, la captation des investisseurs de la diaspora et la maximisation de votre notoriété hors frontières sans alourdir vos coûts fixes."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Chez Domtom Connect, nous déployons notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, en activant des leviers concrets de visibilité, de mise en relation d'affaires qualifiée et d'apport d'opportunités ciblées.

Quels sont aujourd'hui vos principaux freins ou priorités pour accélérer le développement de {company} ?

Si vous êtes ouvert à un échange informel de dix minutes cette semaine, ce sera un réel plaisir de partager quelques pistes immédiatement actionnables pour vos activités.

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
    print("=== VALIDATION STRICTE DU BATCH 71 (EXPANSION PANAFRICAINE & CARAÏBE) ===")
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

    print(f"\nTotal prêts pour le Batch 71, {len(valid_leads)} leads.")
    with open(BATCH_FILE, "w", encoding="utf-8") as f:
        json.dump(valid_leads, f, indent=2, ensure_ascii=False)
    return valid_leads

def send_batch(dry_run=True):
    leads = validate_and_prepare_batch()
    if not leads:
        print("Aucun lead à envoyer.")
        return

    print("="*75)
    print(f"=== {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI RÉEL'} DU BATCH 71 ({len(leads)} LEADS) ===")
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
    print(f"RÉSULTAT DU BATCH 71, {sent_count} envoyés sur {len(leads)} cibles.")
    print("="*75)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv or "-d" in sys.argv
    send_batch(dry_run=is_dry)
