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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_72_croissance.json")

CANDIDATES = [
    # 1. CÔTE D'IVOIRE (Chocolat artisanal de terroir)
    {
        "company": "Chocolat des Villages",
        "name": "Direction Chocolat des Villages",
        "email": "info@chocolatdesvillages.org",
        "website": "https://chocolatdesvillages.ci",
        "source": "Site officiel chocolatdesvillages.ci",
        "territory": "Côte d'Ivoire",
        "category": "Marques & Terroirs",
        "hook": "votre engagement pour la transformation locale et la valorisation artisanale des fèves de cacao ivoiriennes",
        "core_value": "la traçabilité éthique et la fierté d'un chocolat d'origine produit au plus près des planteurs"
    },

    # 2. MADAGASCAR (Huiles essentielles pures & Extraits d'exception)
    {
        "company": "FLORAMAD Madagascar",
        "name": "Direction FLORAMAD",
        "email": "contact@floramad.com",
        "website": "https://floramad.com",
        "source": "Site officiel floramad.com",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre maîtrise complète de la distillation et de l'exportation d'huiles essentielles pures et naturelles de Madagascar",
        "core_value": "l'excellence aromatique et la rigueur des standards botaniques malgaches"
    },
    {
        "company": "MadAroma Exports Madagascar",
        "name": "Direction MadAroma Exports",
        "email": "contact@madaroma-exports.mg",
        "website": "https://madaroma-exports.mg",
        "source": "Site officiel madaroma-exports.mg",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre gamme d'huiles végétales, d'extraits de Ravintsara et d'Ylang Ylang issus du terroir de Madagascar",
        "core_value": "la pureté des principes actifs et la régularité d'approvisionnement des laboratoires internationaux"
    },
    {
        "company": "GEHEM Madagascar",
        "name": "Direction GEHEM",
        "email": "info@gehemgie.com",
        "website": "https://gehemgie.com",
        "source": "Site officiel gehemgie.com",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre mission de fédération et de structuration de la filière d'excellence des huiles essentielles et extraits de Madagascar",
        "core_value": "la défense de la haute valeur ajoutée des exportations et le renforcement des débouchés mondiaux"
    },

    # 3. SÉNÉGAL (Immobilier de prestige Dakar & Almadies)
    {
        "company": "Immoplus Sablux Dakar",
        "name": "Direction Immoplus Sablux",
        "email": "contact@immoplussablux.com",
        "website": "https://immoplussablux.com",
        "source": "Site officiel immoplussablux.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "vos programmes immobiliers de standing et vos réalisations architecturales de premier plan aux Almadies et à Dakar",
        "core_value": "la signature architecturale moderne et la sécurité des investissements pour la diaspora et les entreprises"
    },
    {
        "company": "Gaïa Immobilier Dakar",
        "name": "Direction Gaïa Immobilier",
        "email": "contact@immo-gaia.com",
        "website": "https://immo-gaia.com",
        "source": "Site officiel immo-gaia.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre savoir-faire reconnu en gestion locative rigoureuse et en transaction immobilière sur le marché dakarois",
        "core_value": "la relation de confiance durable et l'optimisation du rendement des patrimoines confiés"
    },
    {
        "company": "Delsa Immo Dakar",
        "name": "Direction Delsa Immo",
        "email": "contact@delsa-immo.com",
        "website": "https://delsa-immo.com",
        "source": "Site officiel delsa-immo.com",
        "territory": "Sénégal",
        "category": "Immobilier & Conciergerie",
        "hook": "votre sélection de résidences d'affaires et votre réactivité commerciale pour accompagner les projets immobiliers au Sénégal",
        "core_value": "l'écoute des besoins spécifiques des acquéreurs et l'agilité dans le closing des transactions"
    },

    # 4. GABON (Immobilier & Gestion à Libreville)
    {
        "company": "Centrimmo Libreville",
        "name": "Direction Centrimmo",
        "email": "contact@centrimmo.pro",
        "website": "https://centrimmo.pro",
        "source": "Site officiel centrimmo.pro",
        "territory": "Gabon",
        "category": "Immobilier & Conciergerie",
        "hook": "votre positionnement sur la gestion de résidences et la transaction de biens immobiliers à Libreville",
        "core_value": "le professionnalisme de vos équipes et la préservation de la valeur locative des biens"
    },

    # 5. CAMEROUN (Douala, Transaction & Promotion foncière)
    {
        "company": "EPEE LINE Douala",
        "name": "Direction EPEE LINE",
        "email": "contact@epeeline.com",
        "website": "https://epeeline.com",
        "source": "Site officiel epeeline.com",
        "territory": "Cameroun",
        "category": "Immobilier & Conciergerie",
        "hook": "votre ancrage stratégique à Douala et votre expertise en aménagement foncier et transaction immobilière",
        "core_value": "la sécurisation juridique des titres et la mise en valeur des terrains à fort potentiel"
    },
    {
        "company": "Lena Real Estate Douala",
        "name": "Direction Lena Real Estate",
        "email": "contact@lena-realestate.com",
        "website": "https://lena-realestate.com",
        "source": "Site officiel lena-realestate.com",
        "territory": "Cameroun",
        "category": "Immobilier & Conciergerie",
        "hook": "votre offre personnalisée de gestion de biens et de recherche sur mesure pour les cadres et entreprises à Douala",
        "core_value": "le ciblage précis des biens et le respect strict du cahier des charges client"
    },
    {
        "company": "Codecis Immobilier Douala",
        "name": "Direction Codecis Immobilier",
        "email": "info@codecis.com",
        "website": "https://codecis.com",
        "source": "Site officiel codecis.com",
        "territory": "Cameroun",
        "category": "Immobilier & Conciergerie",
        "hook": "votre déploiement commercial dynamique et vos solutions de promotion et d'investissement au Cameroun",
        "core_value": "la vision d'un habitat accessible et moderne avec un suivi rigoureux des chantiers"
    },
    {
        "company": "Zenith Immobilier Douala",
        "name": "Direction Zenith Immobilier",
        "email": "info@zenithimo.com",
        "website": "https://zenithimo.com",
        "source": "Site officiel zenithimo.com",
        "territory": "Cameroun",
        "category": "Immobilier & Conciergerie",
        "hook": "votre catalogue diversifié de biens résidentiels et votre accompagnement de proximité auprès des investisseurs locaux",
        "core_value": "la transparence dans les négociations et la tranquillité d'esprit des propriétaires"
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
        "batch": "Batch 72 Panafricain Croissance"
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
        subject = f"Valorisation et développement d'affaires pour {company}"
        lead_opening = f"J'ai découvert avec beaucoup d'attention {hook}."
        challenge_p1 = f"Lorsque l'on développe une production d'exception attachée à {core_value}, les défis clés résident dans la visibilité hors des frontières locales, la structuration de débouchés stables et l'accès direct aux réseaux d'acheteurs et de la diaspora solvables."
    else:
        subject = f"Opportunités et partenariats stratégiques pour {company}"
        lead_opening = f"Je prends contact avec vous après avoir analysé {hook}."
        challenge_p1 = f"Sur un marché compétitif valorisant {core_value}, les priorités des dirigeants se concentrent souvent sur la captation continue de mandats de qualité, la connexion avec des investisseurs sérieux de la diaspora et la croissance du chiffre d'affaires sans alourdir les charges de structure."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Chez Domtom Connect, nous déployons notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, en activant des leviers très concrets de mise en relation d'affaires qualifiée, d'apport d'opportunités et de renforcement de notoriété.

Quels sont aujourd'hui vos principaux freins ou priorités pour accélérer le développement de {company} ?

Si vous êtes ouvert à un court échange de dix minutes cette semaine, ce sera un réel plaisir d'étudier quelques pistes adaptées à vos ambitions.

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
    print("=== VALIDATION STRICTE DU BATCH 72 (PANAFRICAIN CROISSANCE) ===", flush=True)
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

    print(f"\nTotal prêts pour le Batch 72, {len(valid_leads)} leads.")
    with open(BATCH_FILE, "w", encoding="utf-8") as f:
        json.dump(valid_leads, f, indent=2, ensure_ascii=False)
    return valid_leads

def send_batch(dry_run=True):
    leads = validate_and_prepare_batch()
    if not leads:
        print("Aucun lead à envoyer.")
        return

    print("="*75)
    print(f"=== {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI RÉEL'} DU BATCH 72 ({len(leads)} LEADS) ===")
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
    print(f"RÉSULTAT DU BATCH 72, {sent_count} envoyés sur {len(leads)} cibles.")
    print("="*75)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv or "-d" in sys.argv
    send_batch(dry_run=is_dry)
