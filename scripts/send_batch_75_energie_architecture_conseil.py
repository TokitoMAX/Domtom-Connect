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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_75_energie_architecture_conseil.json")

CANDIDATES = [
    # 1. GUADELOUPE (Architecture, Design & Énergie Solaire)
    {
        "company": "B&M Architecture",
        "name": "Direction B&M Architecture",
        "email": "contact@bm-architecture.fr",
        "website": "https://bm-architecture.fr",
        "source": "Site officiel bm-architecture.fr",
        "territory": "Guadeloupe",
        "category": "Architecture & Ingénierie",
        "hook": "vos réalisations architecturales et projets d'urbanisme menés en Guadeloupe depuis votre agence de Baie-Mahault",
        "core_value": "la rigueur de conception bioclimatique et la maîtrise d'œuvre adaptée aux contraintes insulaires"
    },
    {
        "company": "Moma Architecture",
        "name": "Magali Mobetie et l'équipe Moma Architecture",
        "email": "contact@moma-architecture.fr",
        "website": "https://moma-architecture.fr",
        "source": "Site officiel moma-architecture.fr",
        "territory": "Guadeloupe",
        "category": "Architecture & Ingénierie",
        "hook": "vos signatures architecturales et projets d'aménagement contemporains développés en Guadeloupe",
        "core_value": "l'intégration environnementale élégante et la sensibilité aux modes de vie caribéens"
    },
    {
        "company": "Design S&C Agency",
        "name": "Direction Design S&C Agency",
        "email": "contact@designscagency.com",
        "website": "https://designscagency.com",
        "source": "Site officiel designscagency.com",
        "territory": "Guadeloupe",
        "category": "Architecture & Ingénierie",
        "hook": "vos créations en architecture d'intérieur et valorisation d'espaces professionnels et résidentiels à Baie-Mahault",
        "core_value": "la précision du design spatial et l'expérience client haut de gamme"
    },
    {
        "company": "Gwadasolaire",
        "name": "Direction Gwadasolaire",
        "email": "contact@gwadasolaire.fr",
        "website": "https://gwadasolaire.fr",
        "source": "Site officiel gwadasolaire.fr",
        "territory": "Guadeloupe",
        "category": "Énergie Solaire & Transition",
        "hook": "vos installations de centrales photovoltaïques et solutions d'autonomie énergétique en Guadeloupe",
        "core_value": "la fiabilité des équipements solaires et l'accompagnement technique de proximité"
    },

    # 2. MARTINIQUE (Architecture de référence & Solutions Solaires)
    {
        "company": "Philippe Zaffran Architecte",
        "name": "Philippe Zaffran et l'équipe PZA",
        "email": "info@philippe-zaffran-architecte.fr",
        "website": "https://philippe-zaffran-architecte.fr",
        "source": "Site officiel philippe-zaffran-architecte.fr",
        "territory": "Martinique",
        "category": "Architecture & Ingénierie",
        "hook": "la renommée de vos projets architecturaux et réalisations de référence en Martinique",
        "core_value": "l'excellence constructive et l'écoute sur mesure des maîtres d'ouvrage"
    },
    {
        "company": "Chris Solaire Solutions",
        "name": "Direction Chris Solaire Solutions",
        "email": "contact@css-solaire.com",
        "website": "https://css-solaire.com",
        "source": "Site officiel css-solaire.com",
        "territory": "Martinique",
        "category": "Énergie Solaire & Transition",
        "hook": "vos prestations d'installation, maintenance préventive et nettoyage d'équipements solaires en Martinique",
        "core_value": "la performance durable des installations photovoltaïques et la réactivité terrain"
    },

    # 3. LA RÉUNION (Paysage, Architecture & Solaire)
    {
        "company": "Atelier Racines",
        "name": "Caroline Tourriol",
        "email": "caroline.tourriol@atelier-racines.re",
        "website": "https://atelier-racines.re",
        "source": "Site officiel atelier-racines.re",
        "territory": "La Réunion",
        "category": "Architecture & Ingénierie",
        "hook": "vos projets remarquables de paysage, d'aménagement d'espaces extérieurs et d'architecture à La Réunion",
        "core_value": "la valorisation de la biodiversité tropicale et l'harmonie des aménagements paysagers insulaires"
    },
    {
        "company": "Solarmax Réunion",
        "name": "Direction Solarmax Réunion",
        "email": "info@solarmax.re",
        "website": "https://solarmax.re",
        "source": "Site officiel solarmax.re",
        "territory": "La Réunion",
        "category": "Énergie Solaire & Transition",
        "hook": "votre expertise reconnue en autoconsommation photovoltaïque, batteries de stockage et raccordement à La Réunion",
        "core_value": "la réduction durable des factures énergétiques et l'ingénierie solaire locale"
    },
    {
        "company": "Botaik Réunion",
        "name": "Direction Botaik",
        "email": "contact@botaik.com",
        "website": "https://botaik.re",
        "source": "Site officiel botaik.re",
        "territory": "La Réunion",
        "category": "Énergie Solaire & Transition",
        "hook": "vos études photovoltaïques personnalisées et votre accompagnement complet des projets d'énergie solaire à La Réunion",
        "core_value": "l'optimisation du dimensionnement solaire et la clarté du retour sur investissement"
    },

    # 4. AFRIQUE DE L'OUEST (Conseil en Stratégie, Organisation & Management)
    {
        "company": "Mind Consulting Abidjan",
        "name": "Direction Mind Consulting",
        "email": "letsmeet@mind.ci",
        "website": "https://mind.ci",
        "source": "Site officiel mind.ci",
        "territory": "Côte d'Ivoire",
        "category": "Conseil & Stratégie Panafricaine",
        "hook": "vos interventions en stratégie marketing, communication et transformation de marques à Abidjan",
        "core_value": "la pertinence stratégique et la créativité opérationnelle au service de la croissance d'entreprises"
    },
    {
        "company": "2IC Ipsum International Consulting",
        "name": "Direction 2IC",
        "email": "infoline@2ic.ci",
        "website": "https://2ic.ci",
        "source": "Site officiel 2ic.ci",
        "territory": "Côte d'Ivoire",
        "category": "Conseil & Stratégie Panafricaine",
        "hook": "votre offre d'accompagnement en audit, conseil d'entreprise, assistance managériale et formation à Abidjan",
        "core_value": "la rigueur méthodologique et la structuration organisationnelle pérenne"
    },
    {
        "company": "Baraka Consulting Abidjan",
        "name": "Direction Baraka Consulting",
        "email": "info@barakaconsulting.ci",
        "website": "https://barakaconsulting.ci",
        "source": "Site officiel barakaconsulting.ci",
        "territory": "Côte d'Ivoire",
        "category": "Conseil & Stratégie Panafricaine",
        "hook": "vos services d'appui à la création d'entreprise, structuration juridique et externalisation de fonctions clés en Côte d'Ivoire",
        "core_value": "la fluidification du parcours entrepreneurial et le pilotage administratif serein"
    },
    {
        "company": "Sand Consulting Dakar",
        "name": "Direction Sand Consulting",
        "email": "contact@sandconsulting.sn",
        "website": "https://sandconsulting.sn",
        "source": "Site officiel sandconsulting.sn",
        "territory": "Sénégal",
        "category": "Conseil & Stratégie Panafricaine",
        "hook": "votre positionnement en conseil en stratégie, organisation et développement de structures au Sénégal",
        "core_value": "l'alignement des équipes et l'efficience opérationnelle des dirigeants ouest-africains"
    },
    {
        "company": "MCG Mbacke Consulting Group",
        "name": "Direction Mbacke Consulting Group",
        "email": "contact@mcg.sn",
        "website": "https://mcg.sn",
        "source": "Site officiel mcg.sn",
        "territory": "Sénégal",
        "category": "Conseil & Stratégie Panafricaine",
        "hook": "vos missions d'assistance technique, de conseil en investissement et management de projets à Dakar",
        "core_value": "la sécurisation des investissements stratégiques et la vision long terme pour les entreprises régionales"
    },
    {
        "company": "ACE Consulting Dakar",
        "name": "Direction ACE Consulting",
        "email": "contact@aceconsulting.sn",
        "website": "https://aceconsulting.sn",
        "source": "Site officiel aceconsulting.sn",
        "territory": "Sénégal",
        "category": "Conseil & Stratégie Panafricaine",
        "hook": "vos expertises en audit, conseil financier et accompagnement à la croissance des organisations à Dakar",
        "core_value": "l'intégrité de l'analyse économique et la création de valeur durable pour les dirigeants"
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
        "batch": "Batch 75 Architecture Solaire & Conseil"
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

    if "Solaire" in cat:
        subject = f"Perspectives de développement et synergies pour {company}"
        lead_opening = f"J'ai pris connaissance avec beaucoup d'intérêt de {hook}."
        challenge_p1 = f"Dans le secteur de la transition énergétique où {core_value} sont primordiales, les priorités majeures des dirigeants touchent à la fluidification des approvisionnements, au renforcement des équipes techniques et au développement commercial sans surcharger votre temps d'encadrement."
    elif "Architecture" in cat:
        subject = f"Échange sur vos perspectives et projets pour {company}"
        lead_opening = f"Je découvre avec une grande attention {hook}."
        challenge_p1 = f"Dans les métiers de la maîtrise d'œuvre et de la création spatiale où {core_value} font toute la différence, les défis des associés et fondateurs résident souvent dans la captation de marchés d'envergure, le suivi opérationnel rigoureux et la délégation des tâches chronophages."
    else:
        subject = f"Synergies de croissance et partenariats pour {company}"
        lead_opening = f"Je vous contacte après avoir attentivement analysé {hook}."
        challenge_p1 = f"Pour un cabinet de conseil où {core_value} constituent votre signature, les enjeux clés portent régulièrement sur l'élargissement du portefeuille de mandats qualifiés, la mise en relation avec des décideurs régionaux et l'optimisation du temps consacré au développement stratégique."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Je vous contacte au nom de Domtom Connect. Nous avons structuré cet écosystème d'affaires pour apporter des solutions concrètes aux défis des dirigeants et entreprises en Afrique, aux Caraïbes et dans leurs diasporas.

Notre dispositif s'articule notamment autour de notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, ainsi que d'un service de copilotage opérationnel en tête-à-tête pour vous décharger sur vos priorités d'expansion.

Quels sont aujourd'hui vos principaux freins ou axes prioritaires pour accélérer le rayonnement de {company} ?

Seriez-vous ouvert à un court échange informel de dix minutes la semaine prochaine afin de faire le point de vive voix sur vos perspectives ?

Vous pouvez choisir le moment qui vous convient le mieux sur mon agenda en ligne
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
    print("AUDIT DE SÉCURITÉ ET CONFORMITÉ STRICTE DU BATCH 75 (15 CIBLES)")
    print("=" * 80)
    
    clean_leads = []
    all_passed = True
    
    for idx, lead in enumerate(CANDIDATES, 1):
        email = lead["email"].lower().strip()
        comp = lead["company"]
        print(f"\n[{idx}/15] Audit : {comp} <{email}> ({lead['territory']})")
        
        # 1. Vérification Déduplication et Exclusions
        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"  [X] ERREUR DEDUP/EXCLUSION : {reason}")
            all_passed = False
            continue
            
        # 2. Vérification DNS & MX
        is_valid_email, reason_mx = verify_email_target(email)
        if not is_valid_email:
            print(f"  [X] ERREUR DNS/MX : {reason_mx}")
            all_passed = False
            continue
        print(f"  [OK] DNS & MX vérifiés avec succès")
        
        # 3. Vérification du Copyrighting et des Règles de Style
        subject, body = generate_custom_email(lead)
        errors = check_style_rules(subject, body)
        if errors:
            print(f"  [X] ERREURS DE STYLE : {errors}")
            all_passed = False
            continue
        print(f"  [OK] Règle N°4 (zéro deux-points) et N°7 (zéro tiret d'incise) validées")
        print(f"  [Sujet généré] : {subject}")
        
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
    print("LANCEMENT OFFICIEL DE L'ENVOI EN PRODUCTION DU BATCH 75 (15 CIBLES)")
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
            
            print(f"[{idx}/15] Envoi en cours à {comp} <{to_email}>...")
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
            print(f"  -> Délivré avec succès ! Message-ID : {msg['Message-ID']}")
            
            add_lead_to_db(db, lead)
            success_count += 1
            
            if idx < len(leads):
                wait_time = random.uniform(3.5, 6.0)
                print(f"  Pause de temporisation ({wait_time:.1f}s) pour préserver la réputation d'IP...")
                time.sleep(wait_time)
                
    print("\n" + "=" * 80)
    print(f"CAMPAGNE BATCH 75 ACHEVÉE : {success_count}/{len(leads)} EMAILS ENVOYÉS SANS AUCUNE ERREUR.")
    print("Tous les contacts ont été enregistrés dans contacts_deja_contactes.json.")
    print("=" * 80)

if __name__ == "__main__":
    is_send = "--send" in sys.argv
    send_batch(dry_run=(not is_send))
