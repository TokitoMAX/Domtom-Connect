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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_74_territoires.json")

CANDIDATES = [
    # 1. LA RÉUNION (Conciergeries haut de gamme & Villas de standing)
    {
        "company": "Tropical Home Réunion",
        "name": "Direction Tropical Home",
        "email": "contact@tropicalhome.fr",
        "website": "https://tropicalhome.fr",
        "source": "Site officiel tropicalhome.fr",
        "territory": "La Réunion",
        "category": "Immobilier & Conciergerie",
        "hook": "votre positionnement de premier plan sur la location saisonnière de prestige et les villas d'exception à La Réunion",
        "core_value": "l'exigence d'un accueil haut de gamme et la sérénité garantie aux propriétaires de biens de caractère"
    },
    {
        "company": "Austral Conciergerie Réunion",
        "name": "Direction Austral Conciergerie",
        "email": "contact@australconciergerie.com",
        "website": "https://australconciergerie.com",
        "source": "Site officiel australconciergerie.com",
        "territory": "La Réunion",
        "category": "Immobilier & Conciergerie",
        "hook": "vos prestations d'intendance complète et de valorisation locative de propriétés à La Réunion",
        "core_value": "la proximité opérationnelle et la préservation de la qualité des séjours pour une clientèle exigeante"
    },
    {
        "company": "Hublot Conciergerie Réunion",
        "name": "Direction Hublot Conciergerie",
        "email": "contact@hublot.re",
        "website": "https://hublot.re",
        "source": "Site officiel hublot.re",
        "territory": "La Réunion",
        "category": "Immobilier & Conciergerie",
        "hook": "votre gestion soignée de villas de charme et maisons créoles dans l'ouest et le sud réunionnais",
        "core_value": "la mise en valeur du patrimoine architectural local et l'optimisation des rendements pour les bailleurs"
    },

    # 2. GUYANE (Transactions immobilières, Conseil & Gestion patrimoniale)
    {
        "company": "Cabinet Immobilier Jean Guyane",
        "name": "Direction Cabinet Immobilier Jean",
        "email": "accueil@immojean.com",
        "website": "https://immojean.com",
        "source": "Site officiel immojean.com",
        "territory": "Guyane",
        "category": "Immobilier & Conciergerie",
        "hook": "votre expertise historique en gestion patrimoniale et transactions immobilières à Cayenne",
        "core_value": "la maîtrise des spécificités foncières guyanaises et la sécurisation des investissements clients"
    },
    {
        "company": "Immo-Vert Guyane",
        "name": "Direction Immo-Vert",
        "email": "contact@immovert.net",
        "website": "https://immovert.net",
        "source": "Site officiel immovert.net",
        "territory": "Guyane",
        "category": "Immobilier & Conciergerie",
        "hook": "vos services de conseil et de transaction immobilière adaptés aux projets résidentiels et professionnels en Guyane",
        "core_value": "l'écoute attentive des porteurs de projets et la transparence dans l'accompagnement foncier"
    },
    {
        "company": "Transactis Immo Guyane",
        "name": "Direction Transactis Immo",
        "email": "contact@transactisimmo.fr",
        "website": "https://transactisimmo.fr",
        "source": "Site officiel transactisimmo.fr",
        "territory": "Guyane",
        "category": "Immobilier & Conciergerie",
        "hook": "votre présence active sur le marché immobilier de Cayenne et votre portefeuille diversifié de biens",
        "core_value": "la réactivité commerciale et l'accompagnement sur mesure des acquéreurs et vendeurs"
    },
    {
        "company": "Bes't Immobilier Guyane",
        "name": "Direction Bes't Immobilier",
        "email": "bb@bes-immo.com",
        "website": "https://bes-immo.com",
        "source": "Site officiel bes-immo.com",
        "territory": "Guyane",
        "category": "Immobilier & Conciergerie",
        "hook": "vos compétences reconnues en gestion locative et transaction immobilière sur le territoire guyanais",
        "core_value": "la rigueur de gestion et la fidélisation des propriétaires partenaires"
    },

    # 3. MARTINIQUE (Terroir & Distillerie d'exception)
    {
        "company": "Rhum J.M Martinique",
        "name": "Direction Commerciale et Export Rhum J.M",
        "email": "export@spiridom.com",
        "website": "https://rhum-jm.com",
        "source": "Site officiel rhum-jm.com",
        "territory": "Martinique",
        "category": "Marques & Terroirs",
        "hook": "votre héritage d'exception à Fonds-Préville et la réputation mondiale de vos rhums agricoles de terroir",
        "core_value": "l'authenticité des méthodes de distillation martiniquaises et l'excellence reconnue à l'international"
    },

    # 4. SÉNÉGAL (Agroalimentaire & Logistique d'exportation)
    {
        "company": "Agro-Expedition Senegal",
        "name": "Direction Agro-Expedition",
        "email": "info@agro-senegal.com",
        "website": "https://agro-senegal.com",
        "source": "Site officiel agro-senegal.com",
        "territory": "Sénégal",
        "category": "Marques & Terroirs",
        "hook": "votre hub logistique et vos filières structurées d'exportation de produits horticoles et agricoles sénégalais",
        "core_value": "la fluidité de la chaîne du froid et la régularité des approvisionnements vers les marchés extérieurs"
    },

    # 5. MADAGASCAR (Filière d'excellence Vanille Bourbon & Épices)
    {
        "company": "ETS Mayan Vanille Madagascar",
        "name": "Direction ETS Mayan",
        "email": "contact@etsmayan.com",
        "website": "https://etsmayan.com",
        "source": "Site officiel etsmayan.com",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre travail de culture et de préparation de vanille Bourbon et d'épices d'exception depuis Sambava",
        "core_value": "le respect scrupuleux des étapes d'affinage traditionnel et l'engagement direct auprès des planteurs"
    },
    {
        "company": "Vanygo Madagascar",
        "name": "Direction Vanygo",
        "email": "contact@vanygo-mg.com",
        "website": "https://vanygo-mg.com",
        "source": "Site officiel vanygo-mg.com",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre sélection rigoureuse et votre offre de vanille Bourbon dédiée aux professionnels et importateurs",
        "core_value": "la conformité des calibres gourmet et la traçabilité garantie à chaque expédition"
    },
    {
        "company": "Biovanilla Madagascar",
        "name": "Direction Biovanilla",
        "email": "contact@biovanilla.fr",
        "website": "https://biovanilla.fr",
        "source": "Site officiel biovanilla.fr",
        "territory": "Madagascar",
        "category": "Marques & Terroirs",
        "hook": "votre filière responsable de vanille biologique certifiée et votre gamme de gousses et extraits naturels",
        "core_value": "l'agriculture biologique durable et la valorisation équitable des producteurs malgaches"
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
        "batch": "Batch 74 Territoires & Terroirs"
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
        subject = f"Valorisation et perspectives de développement pour {company}"
        lead_opening = f"J'ai pris connaissance avec beaucoup d'attention de {hook}."
        challenge_p1 = f"Lorsque l'on pilote une production ou une filière d'excellence attachée à {core_value}, les défis clés touchent fréquemment à la régularité des commandes extérieures, à l'accès direct aux réseaux d'acheteurs premium et à la sécurisation des marges face aux contraintes logistiques."
    else:
        subject = f"Partenariats et synergies d'affaires pour {company}"
        lead_opening = f"Je vous contacte après avoir attentivement étudié {hook}."
        challenge_p1 = f"Dans votre secteur où {core_value} sont déterminantes, les enjeux majeurs des dirigeants restent la rentrée régulière de mandats qualifiés, la captation des investisseurs sérieux de la diaspora et la croissance du chiffre d'affaires sans alourdir vos coûts de structure."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Chez Domtom Connect, nous déployons notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, en activant des leviers concrets de visibilité, de mise en relation d'affaires qualifiée et d'apport d'opportunités adaptées à votre marché.

Quels sont aujourd'hui vos principaux freins ou priorités pour accélérer le développement de {company} ?

Si vous êtes ouvert à un court échange informel de dix minutes cette semaine, ce sera un réel plaisir d'échanger de vive voix sur vos perspectives d'activité.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
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
    if "+33 6 20 78 33 77" not in body:
        errors.append("Numéro WhatsApp officiel de Loïc absent ou incorrect")
    return errors

def validate_and_prepare_batch():
    print("=== VALIDATION STRICTE DU BATCH 74 (TERRITOIRES & TERROIRS) ===", flush=True)
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

    print(f"\nTotal prêts pour le Batch 74, {len(valid_leads)} leads.")
    with open(BATCH_FILE, "w", encoding="utf-8") as f:
        json.dump(valid_leads, f, indent=2, ensure_ascii=False)
    return valid_leads

def send_batch(dry_run=True):
    leads = validate_and_prepare_batch()
    if not leads:
        print("Aucun lead à envoyer.")
        return

    print("="*75)
    print(f"=== {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI RÉEL'} DU BATCH 74 ({len(leads)} LEADS) ===")
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
    print(f"RÉSULTAT DU BATCH 74, {sent_count} envoyés sur {len(leads)} cibles.")
    print("="*75)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv or "-d" in sys.argv
    send_batch(dry_run=is_dry)
