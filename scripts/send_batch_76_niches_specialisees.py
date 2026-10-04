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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_76_niches_specialisees.json")

CANDIDATES = [
    # =========================================================================
    # NICHE 1 : CHOCOLATIERS BEAN-TO-BAR & CAFÉS / TERROIRS D'EXCEPTION
    # =========================================================================
    {
        "niche": "Chocolat Bean-to-Bar & Terroirs",
        "company": "Naomi Martino Chocolats",
        "name": "Naomi Martino",
        "email": "chocolats@naomimartino.fr",
        "website": "https://naomimartino.fr",
        "source": "Site officiel naomimartino.fr",
        "territory": "Guadeloupe",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "votre démarche d'excellence en chocolat Bean to Bar et la valorisation remarquable des fèves et épices du terroir guadeloupéen",
        "core_value": "l'authenticité des saveurs locales, la créativité gustative et l'exigence d'un artisanat d'art sans compromis"
    },
    {
        "niche": "Chocolat Bean-to-Bar & Terroirs",
        "company": "Audaces Chocolat",
        "name": "François-Xavier Caussade",
        "email": "fxcaussade@audaces.re",
        "website": "https://audaces.re",
        "source": "Site officiel audaces.re",
        "territory": "La Réunion",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "vos créations chocolatières Bean to Bar et l'alliance originale avec les trésors aromatiques réunionnais comme le combava ou le faham",
        "core_value": "la précision de la torréfaction des fèves pures origines et la mise en lumière du patrimoine gustatif de l'île"
    },
    {
        "niche": "Chocolat Bean-to-Bar & Terroirs",
        "company": "Le Passeur d'Arômes",
        "name": "Direction Le Passeur d'Arômes",
        "email": "contact@lepasseurdaromes.re",
        "website": "https://lepasseurdaromes.re",
        "source": "Site officiel lepasseurdaromes.re",
        "territory": "La Réunion",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "votre travail minutieux d'artisan chocolatier Bean to Bar et votre sélection rigoureuse de cacaos fins à La Réunion",
        "core_value": "le respect scrupuleux du produit brut et la finesse du conchage artisanal"
    },
    {
        "niche": "Chocolat Bean-to-Bar & Terroirs",
        "company": "Domaine du Café Grillé",
        "name": "Direction Domaine du Café Grillé",
        "email": "gestion@domaineducafegrille.fr",
        "website": "https://domaineducafegrille.fr",
        "source": "Site officiel domaineducafegrille.fr",
        "territory": "La Réunion",
        "category": "Café Rare & Terroirs d'Exception",
        "hook": "votre mise en valeur vivante de l'histoire du café réunionnais et la transmission du patrimoine agricole créole",
        "core_value": "l'agrotourisme culturel et l'enracinement des savoir-faire botaniques dans le Sud sauvage"
    },
    {
        "niche": "Chocolat Bean-to-Bar & Terroirs",
        "company": "Bitasyon Bio",
        "name": "Franck Morel",
        "email": "franckmorel974@gmail.com",
        "website": "https://bitasyonbio.fr",
        "source": "Site officiel bitasyonbio.fr",
        "territory": "La Réunion",
        "category": "Chocolaterie Paysanne & Cacao Bio",
        "hook": "votre engagement pionnier de paysan chocolatier biologique cultivant et transformant ses propres cacaos à Saint-Philippe",
        "core_value": "l'agro-écologie paysanne, la pureté du chocolat d'artisan et la préservation de la terre"
    },
    {
        "niche": "Chocolat Bean-to-Bar & Terroirs",
        "company": "La Maison du Cacao",
        "name": "Direction La Maison du Cacao",
        "email": "reservation.maisonducacao@gmail.com",
        "website": "https://maisonducacao.fr",
        "source": "Site officiel maisonducacao.fr",
        "territory": "Guadeloupe",
        "category": "Cacao de Terroir & Agrotourisme",
        "hook": "votre rôle emblématique dans la valorisation de la filière cacao traditionnelle guadeloupéenne à Pointe-Noire",
        "core_value": "la transmission de la culture du chocolat créole et le rayonnement touristique des savoir-faire insulaires"
    },

    # =========================================================================
    # NICHE 3 : COSMÉTIQUE BOTANIQUE TROPICALE & HUILES RARES
    # =========================================================================
    {
        "niche": "Cosmétique Botanique & Huiles Rares",
        "company": "LS Trade Nature",
        "name": "Direction LS Trade Nature",
        "email": "contact@lstradenature.com",
        "website": "https://lstradenature.com",
        "source": "Site officiel lstradenature.com",
        "territory": "Martinique",
        "category": "Huiles Végétales & Cosmétique Naturelle",
        "hook": "votre valorisation des huiles pures traditionnelles comme le carapate et vos formulations botaniques élaborées au Lamentin",
        "core_value": "la préservation des trésors cosmétiques caribéens et l'exigence de traçabilité pharmaceutique"
    },
    {
        "niche": "Cosmétique Botanique & Huiles Rares",
        "company": "Délicathe",
        "name": "Direction Délicathe",
        "email": "contactdelicathe@gmail.com",
        "website": "https://delicathe.com",
        "source": "Site officiel delicathe.com",
        "territory": "La Réunion",
        "category": "Cosmétique Naturelle & Savonnerie",
        "hook": "vos soins cosmétiques naturels et savons artisanaux formulés à La Possession dans une démarche éthique et locale",
        "core_value": "le plaisir sensoriel, la pureté des ingrédients botaniques et le bien-être au naturel"
    },
    {
        "niche": "Cosmétique Botanique & Huiles Rares",
        "company": "Comptoir des Monoï",
        "name": "Direction Comptoir des Monoï",
        "email": "info@comptoirdesmonoi.com",
        "website": "https://comptoirdesmonoi.fr",
        "source": "Site officiel comptoirdesmonoi.fr",
        "territory": "Polynésie",
        "category": "Monoï de Tahiti Appellation d'Origine",
        "hook": "votre savoir-faire authentique dans la production de véritable Monoï de Tahiti AOP et soins traditionnels polynésiens",
        "core_value": "le respect de l'appellation d'origine contrôlée et la diffusion des vertus de la flore du Pacifique"
    },
    {
        "niche": "Cosmétique Botanique & Huiles Rares",
        "company": "Laboratoire Pacifique Sud LCPS",
        "name": "Direction LCPS",
        "email": "info-tahiti@pacifiquesud.com",
        "website": "https://pacifiquesud.com",
        "source": "Site officiel pacifiquesud.com",
        "territory": "Polynésie",
        "category": "Extraction Botanique & Ingrédients Cosmétiques",
        "hook": "votre expertise pointue en éco-extraction et fourniture d'actifs végétaux d'exception issus de la flore polynésienne",
        "core_value": "l'innovation phyto-chimique propre et la valorisation industrielle durable des bio-ressources insulaires"
    },

    # =========================================================================
    # NICHE 4 : AGRI-TECH & VALORISATION DES BIO-RESSOURCES LOCALES
    # =========================================================================
    {
        "niche": "Agri-Tech & Bio-Ressources",
        "company": "Sargawatt",
        "name": "Direction Sargawatt",
        "email": "contact@sargawatt.fr",
        "website": "https://sargawatt.com",
        "source": "Site officiel sargawatt.com",
        "territory": "Martinique",
        "category": "Valorisation de la Biomasse & Énergie",
        "hook": "vos procédés innovants de traitement, séchage et transformation industrielle des algues sargasses en Martinique",
        "core_value": "la conversion d'une urgence écologique en opportunité économique et industrielle vertueuse"
    },
    {
        "niche": "Agri-Tech & Bio-Ressources",
        "company": "ACP Environnement",
        "name": "Direction ACP Environnement",
        "email": "contact@acpenvironnement.org",
        "website": "https://acpenvironnement.org",
        "source": "Site officiel acpenvironnement.org",
        "territory": "Martinique",
        "category": "Valorisation Organique & Compostage",
        "hook": "vos actions d'économie circulaire, de valorisation de la biomasse et de régénération des sols aux Antilles",
        "core_value": "la gestion durable des cycles de matière et la préservation de la fertilité agronomique locale"
    },
    {
        "niche": "Agri-Tech & Bio-Ressources",
        "company": "Naturaform",
        "name": "Direction Naturaform",
        "email": "contact@naturaform.re",
        "website": "https://naturaform.re",
        "source": "Site officiel naturaform.re",
        "territory": "La Réunion",
        "category": "Micro-algues & Compléments Naturels",
        "hook": "votre culture rigoureuse de spiruline péi et la création de super-aliments nutritifs au Port à La Réunion",
        "core_value": "l'autonomie nutritionnelle insulaire, la traçabilité sans compromis et l'énergie vitale naturelle"
    },
    {
        "niche": "Agri-Tech & Bio-Ressources",
        "company": "Parc Aquacole de Guadeloupe",
        "name": "Direction Parc Aquacole",
        "email": "info@parc-aquacole.fr",
        "website": "https://parc-aquacole.fr",
        "source": "Site officiel parc-aquacole.fr",
        "territory": "Guadeloupe",
        "category": "Aquaculture Durable & Écotourisme",
        "hook": "votre modèle remarquable d'aquaculture responsable en eau douce et de découverte pédagogique à Pointe-Noire",
        "core_value": "l'équilibre entre production locale qualitative et éducation aux écosystèmes fluviaux"
    },
    {
        "niche": "Agri-Tech & Bio-Ressources",
        "company": "Aquasearch",
        "name": "Direction Aquasearch",
        "email": "contact@aquasearch.fr",
        "website": "https://aquasearch.fr",
        "source": "Site officiel aquasearch.fr",
        "territory": "Martinique",
        "category": "Bio-Ressources Marines & Ingénierie",
        "hook": "vos travaux spécialisés en écologie marine, suivi scientifique des habitats côtiers et ingénierie aquacole au Robert",
        "core_value": "la rigueur scientifique et l'apport de solutions concrètes pour l'économie bleue antillaise"
    },
    {
        "niche": "Agri-Tech & Bio-Ressources",
        "company": "SYPAGUA Guadeloupe",
        "name": "Direction SYPAGUA",
        "email": "info@sypagua.com",
        "website": "https://sypagua.com",
        "source": "Site officiel sypagua.com",
        "territory": "Guadeloupe",
        "category": "Filière Aquacole & Croissance Bleue",
        "hook": "votre rôle fédérateur pour structurer la filière aquacole guadeloupéenne et porter la voix des producteurs locaux",
        "core_value": "la défense de l'autonomie alimentaire territoriale et la professionnalisation de l'aquaculture insulaire"
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
        "batch": f"Batch 76 Niches ({lead.get('niche', 'Spécialisé')})"
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
    niche = lead.get("niche", "")

    if "Chocolat" in niche:
        subject = f"Valorisation et perspectives de développement pour {company}"
        lead_opening = f"J'ai pris connaissance avec beaucoup d'attention de {hook}."
        challenge_p1 = f"Lorsque l'on pilote une production artisanale de haut vol attachée à {core_value}, les défis majeurs touchent régulièrement à l'ouverture de débouchés commerciaux premium hors du territoire, à la sécurisation des approvisionnements locaux et à la préservation des marges face aux contraintes logistiques."
    elif "Cosmétique" in niche:
        subject = f"Perspectives de croissance et partenariats pour {company}"
        lead_opening = f"Je découvre avec un vif intérêt {hook}."
        challenge_p1 = f"Dans le domaine de la formulation botanique où {core_value} font votre force, les enjeux clés portent souvent sur l'élargissement de votre réseau de distribution en pharmacie et concept stores, la visibilité auprès de la diaspora et la délégation des tâches opérationnelles chronophages."
    else:
        subject = f"Échange sur vos perspectives et innovations pour {company}"
        lead_opening = f"Je vous contacte après avoir attentivement étudié {hook}."
        challenge_p1 = f"Dans le secteur des bio-ressources et des technologies durables où {core_value} sont déterminantes, les priorités des dirigeants résident fréquemment dans le passage à l'échelle commerciale, la conclusion de partenariats stratégiques et l'accès à des réseaux d'affaires engagés."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Je prends contact avec vous au nom de Domtom Connect. Nous avons bâti cet écosystème d'affaires pour accompagner concrètement les entrepreneurs et porteurs de projets en Afrique, dans les Caraïbes et dans leurs diasporas.

Notre dispositif s'appuie notamment sur notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, ainsi que sur un service de copilotage opérationnel direct pour vous décharger sur le développement commercial et la mise en relation d'affaires.

Quels sont aujourd'hui vos principaux freins ou priorités pour accélérer le développement de {company} ?

Seriez-vous disponible pour un court échange informel de dix minutes la semaine prochaine afin de faire connaissance de vive voix et voir si des synergies sont possibles ?

Vous pouvez choisir le moment qui vous convient sur mon agenda en ligne
calendly.com/domtomconnect/30min

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
    return errors

def verify_all_batch():
    print("=" * 80)
    print(f"AUDIT STRICT ET CONFORMITÉ DU BATCH 76 NICHES SPÉCIALISÉES ({len(CANDIDATES)} CIBLES)")
    print("=" * 80)
    
    clean_leads = []
    all_passed = True
    
    for idx, lead in enumerate(CANDIDATES, 1):
        email = lead["email"].lower().strip()
        comp = lead["company"]
        print(f"\n[{idx}/{len(CANDIDATES)}] Audit : {comp} <{email}> ({lead['territory']} | {lead['niche']})")
        
        # 1. Déduplication et Exclusions
        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"  [X] ERREUR DEDUP/EXCLUSION : {reason}")
            all_passed = False
            continue
            
        # 2. DNS & MX
        is_valid_email, reason_mx = verify_email_target(email)
        if not is_valid_email:
            print(f"  [X] ERREUR DNS/MX : {reason_mx}")
            all_passed = False
            continue
        print(f"  [OK] DNS & MX vérifiés avec succès")
        
        # 3. Règles de Style
        subject, body = generate_custom_email(lead)
        errors = check_style_rules(subject, body)
        if errors:
            print(f"  [X] ERREURS DE STYLE : {errors}")
            all_passed = False
            continue
        print(f"  [OK] Règle N°4 (zéro deux-points) et N°7 (zéro tiret d'incise) validées")
        print(f"  [Sujet] : {subject}")
        
        clean_leads.append(lead)

    print("\n" + "=" * 80)
    if all_passed and len(clean_leads) == len(CANDIDATES):
        print(f"RÉSULTAT : 100% DES {len(clean_leads)} CIBLES SONT TOTALEMENT SÉCURISÉES ET VALIDÉES.")
    else:
        print(f"ATTENTION : Seulement {len(clean_leads)}/{len(CANDIDATES)} cibles valides.")
    print("=" * 80)
    return clean_leads

def send_batch(dry_run=True):
    leads = verify_all_batch()
    if len(leads) != len(CANDIDATES):
        print("Annulation de l'envoi : certains prospects n'ont pas passé l'audit.")
        return

    if dry_run:
        print("\n[MODE DRY-RUN] Aucun email ne sera expédié.")
        print("Pour lancer l'envoi réel, exécutez la commande avec le drapeau --send.")
        return

    print("\n" + "=" * 80)
    print(f"LANCEMENT DE L'ENVOI DU BATCH 76 NICHES SPÉCIALISÉES ({len(leads)} CIBLES)")
    print("=" * 80)
    
    db = load_contacts_db()
    context = ssl.create_default_context()
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP établie avec succès sur smtp.gmail.com:465.")
        
        success_count = 0
        for idx, lead in enumerate(leads, 1):
            to_email = lead["email"].lower().strip()
            comp = lead["company"]
            subject, body = generate_custom_email(lead)
            
            msg = MIMEText(body, "plain", "utf-8")
            msg["Subject"] = subject
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = f"{lead.get('name', comp)} <{to_email}>"
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            print(f"[{idx}/{len(leads)}] Envoi en cours à {comp} <{to_email}> ({lead['niche']})...")
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
            print(f"  -> Délivré avec succès ! Message-ID : {msg['Message-ID']}")
            
            add_lead_to_db(db, lead)
            success_count += 1
            
            if idx < len(leads):
                wait_time = random.uniform(3.5, 6.0)
                print(f"  Pause de temporisation ({wait_time:.1f}s) pour préserver la réputation d'IP...")
                time.sleep(wait_time)
                
    print("\n" + "=" * 80)
    print(f"CAMPAGNE BATCH 76 ACHEVÉE : {success_count}/{len(leads)} EMAILS ENVOYÉS SANS AUCUNE ERREUR.")
    print("Tous les contacts ont été enregistrés dans contacts_deja_contactes.json.")
    print("=" * 80)

if __name__ == "__main__":
    is_send = "--send" in sys.argv
    send_batch(dry_run=(not is_send))
