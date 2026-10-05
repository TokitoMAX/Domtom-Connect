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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_70_panafricain_caraibe.json")

CANDIDATES = [
    # 1. ÎLE MAURICE (Conciergerie & Immobilier Prestige)
    {
        "company": "Royal Keys Conciergerie Maurice",
        "name": "Direction Royal Keys",
        "email": "contact@conciergerie-ilemaurice.com",
        "website": "https://conciergerie-ilemaurice.com",
        "source": "Site officiel conciergerie-ilemaurice.com",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "vos services exclusifs d'intendance de villas de prestige et d'accueil VIP à l'Île Maurice",
        "core_value": "l'hospitalité ultra-personnalisée et la sérénité des propriétaires de résidences de luxe"
    },
    {
        "company": "Villa Vie Immobilier Maurice",
        "name": "Direction Villa Vie",
        "email": "communication@villa-vie.com",
        "website": "https://villa-vie.com",
        "source": "Site officiel villa-vie.com",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "votre expertise de plus de quarante ans en transaction et gestion locative de standing à Maurice",
        "core_value": "la maîtrise foncière et l'accompagnement patrimonial des investisseurs francophones"
    },
    {
        "company": "Horizon Holidays Maurice",
        "name": "Direction Horizon Holidays",
        "email": "reservations@horizon.mu",
        "website": "https://horizon.mu",
        "source": "Site officiel horizon.mu",
        "territory": "Île Maurice",
        "category": "Immobilier & Conciergerie",
        "hook": "votre gestion hôtelière haut de gamme et votre catalogue de résidences privées pieds dans l'eau",
        "core_value": "l'expérience de villégiature haut de gamme et la valorisation locative des biens"
    },

    # 2. CAMEROUN (Douala & Yaoundé)
    {
        "company": "Biotifull Cosmetic Cameroun",
        "name": "Direction Biotifull Cosmetic",
        "email": "contact@biotifullcosmetic.com",
        "website": "https://biotifullcosmetic.com",
        "source": "Site officiel biotifullcosmetic.com",
        "territory": "Cameroun",
        "category": "Marques & Terroirs",
        "hook": "vos gammes capillaires et cosmétiques formulées à partir d'actifs naturels à Douala",
        "core_value": "la valorisation de la beauté afro naturelle et la formulation saine sans compromis"
    },
    {
        "company": "Laboratoires Biopharma Cameroun",
        "name": "Direction Laboratoires Biopharma",
        "email": "biopharma@laboratoires-biopharma.com",
        "website": "https://laboratoires-biopharma.com",
        "source": "Site officiel laboratoires-biopharma.com",
        "territory": "Cameroun",
        "category": "Marques & Terroirs",
        "hook": "votre leadership industriel en dermo-cosmétique et soins corporels de référence en Afrique Centrale",
        "core_value": "la rigueur industrielle et l'accessibilité de soins de qualité pour les peaux noires et métissées"
    },

    # 3. SÉNÉGAL (Dakar)
    {
        "company": "3Vision Group Dakar",
        "name": "Direction 3Vision Group",
        "email": "contact@3vision-group.com",
        "website": "https://3vision-group.com",
        "source": "Site officiel 3vision-group.com",
        "territory": "Sénégal",
        "category": "PME & Services B2B",
        "hook": "vos solutions d'ingénierie digitale, de stratégie web et d'acquisition de trafic à Dakar",
        "core_value": "l'innovation technologique et l'accélération numérique des PME africaines"
    },

    # 4. RDC (Kinshasa)
    {
        "company": "Silikin Village Kinshasa",
        "name": "Direction Silikin Village",
        "email": "commercial@silikinvillage.com",
        "website": "https://silikinvillage.com",
        "source": "Site officiel silikinvillage.com",
        "territory": "RDC",
        "category": "PME & Services B2B",
        "hook": "votre pôle entrepreneurial et d'innovation technologique d'envergure à Kinshasa",
        "core_value": "la création de synergies économiques à fort impact et l'accélération de projets panafricains"
    },

    # 5. GABON (Libreville)
    {
        "company": "Agences N°1 Gabon",
        "name": "Direction Agences N°1",
        "email": "contact@agencesn1.com",
        "website": "https://agencesn1.com",
        "source": "Site officiel agencesn1.com",
        "territory": "Gabon",
        "category": "Immobilier & Conciergerie",
        "hook": "votre expertise reconnue en transaction immobilière et gestion de patrimoine résidentiel à Libreville",
        "core_value": "la sécurité juridique des transactions et le conseil avisé aux investisseurs"
    },
    {
        "company": "IMP Conseil Immobilier Gabon",
        "name": "Direction IMP Conseil",
        "email": "commercial@impconseil.com",
        "website": "https://immobiliergabon.com",
        "source": "Site officiel immobiliergabon.com",
        "territory": "Gabon",
        "category": "Immobilier & Conciergerie",
        "hook": "votre portefeuille de biens immobiliers de standing et vos solutions de gestion locative à Libreville",
        "core_value": "la rigueur de gestion et la rentabilité patrimoniale pérenne"
    }
]

def build_email_for_lead(lead):
    name = lead["name"]
    company = lead["company"]
    hook = lead["hook"]
    core_value = lead["core_value"]

    # 1. Zero colons
    # 2. Zero mid-sentence dashes
    # 3. Exact formula: "notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs"
    # 4. Clear presentation of Domtom Connect
    # 5. Open posture pushing them to speak about their real bottlenecks

    body = f"""Bonjour {name},

J'observe avec attention le parcours de {company} et {hook}. Votre attachement à {core_value} constitue un atout précieux pour votre rayonnement.

Je vous contacte au nom de Domtom Connect. Nous avons créé cet écosystème d'affaires pour apporter des solutions concrètes aux défis des dirigeants et entreprises issus de la Caraïbe, d'Afrique et de leurs diasporas.

Notre dispositif s'articule notamment autour de notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, ainsi que d'un service de copilotage opérationnel en tête-à-tête et d'un réseau d'affaires direct.

Ma démarche aujourd'hui est d'échanger directement avec vous afin de mieux cerner vos problématiques actuelles, vos priorités de croissance et vos blocages éventuels, pour déterminer en toute lucidité si nos leviers peuvent y répondre efficacement.

Seriez-vous disponible pour un court échange de quinze minutes la semaine prochaine afin de faire le point de vive voix ?

Vous pouvez choisir le moment qui vous convient sur ce lien
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
Plateforme www.domtomconnect.com"""

    subject = f"Échange sur vos objectifs et priorités de développement pour {company}"
    return subject, body

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"emails": [], "domains": [], "companies": [], "contacts": []}

def load_exclusions():
    if os.path.exists(EXCLUSIONS_FILE):
        with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"excluded_emails": [], "excluded_domains": []}

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

def add_lead_to_db(db, lead):
    email = lead["email"].lower().strip()
    domain = email.split("@")[1] if "@" in email else ""
    company = lead["company"].strip()

    if email not in db.get("emails", []):
        db.setdefault("emails", []).append(email)
    if domain not in db.get("domains", []):
        db.setdefault("domains", []).append(domain)
    if company not in db.get("companies", []):
        db.setdefault("companies", []).append(company)

    existing_contacts = set(c.get("email", "").lower().strip() for c in db.get("contacts", []))
    if email not in existing_contacts:
        db.setdefault("contacts", []).append({
            "company": company,
            "name": lead.get("name", ""),
            "email": email,
            "territory": lead.get("territory", "Afrique & Caraïbe Étendue"),
            "category": lead.get("category", "Entreprises"),
            "source": lead.get("source", "Site officiel vérifié"),
            "batch": "batch_70_panafricain_caraibe",
            "contacted_at": time.strftime("%Y-%m-%d %H:%M:%S")
        })
    db["total_contacts"] = len(db.get("contacts", []))
    db["total_domains"] = len(db.get("domains", []))
    save_contacts_db(db)

def validate_and_prepare():
    print("=== VALIDATION STRICTE DU BATCH 70 (PANAFRICAIN & CARAÏBE ÉTENDUE) ===", flush=True)
    db = load_contacts_db()
    exclusions = load_exclusions()
    excluded_emails = set(e.lower().strip() for e in exclusions.get("excluded_emails", []))
    excluded_domains = set(d.lower().strip() for d in exclusions.get("excluded_domains", []))

    validated_leads = []
    for c in CANDIDATES:
        email = c["email"].lower().strip()
        comp = c["company"].strip()
        domain = email.split('@')[1] if '@' in email else ""

        # Dedup & Exclusions
        if email in excluded_emails or domain in excluded_domains:
            print(f"[REJET EXCLUSION] {comp} ({email})")
            continue

        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"[REJET DÉDOUBLONNAGE] {comp} ({email}) -> {reason}")
            continue

        # DNS/MX check
        ok, err = verify_email_target(email)
        if not ok:
            print(f"[REJET DNS/MX] {comp} ({email}) -> {err}")
            continue

        subj, body = build_email_for_lead(c)
        if ":" in subj or ":" in body or " - " in subj or " - " in body:
            print(f"[REJET STYLE] {comp}")
            continue

        c["subject"] = subj
        c["body"] = body
        validated_leads.append(c)
        print(f"[VALIDÉ 100%] {comp} <{email}> ({c['territory']})")

    with open(BATCH_FILE, "w", encoding="utf-8") as f:
        json.dump(validated_leads, f, ensure_ascii=False, indent=2)

    print(f"\nTotal prêts pour le Batch 70 : {len(validated_leads)} leads.")
    return validated_leads

def send_batch(dry_run=False):
    leads = validate_and_prepare()
    if not leads:
        print("Aucun lead à envoyer.")
        return

    print("="*75)
    print(f"=== {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI RÉEL'} DU BATCH 70 ({len(leads)} LEADS) ===")
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
                print(f"[{idx}/{len(leads)}] ENVOYÉ AVEC SUCCÈS : {comp} <{email}> ({lead['territory']})")

                delay = random.uniform(4.0, 7.0)
                time.sleep(delay)
    finally:
        if server:
            server.quit()

    print("="*75)
    print(f"RÉSULTAT DU BATCH 70 : {sent_count} envoyés sur {len(leads)} cibles.")
    print("="*75)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv or "-d" in sys.argv
    send_batch(dry_run=is_dry)
