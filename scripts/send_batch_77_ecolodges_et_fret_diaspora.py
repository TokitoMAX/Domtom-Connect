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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_77_ecolodges_et_fret_diaspora.json")

CANDIDATES = [
    # =========================================================================
    # NICHE 2 : ÉCOLODGES D'EXCEPTION, GLAMPING & DOMAINES NATURE
    # =========================================================================
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Les Lodges de l'Oyack",
        "name": "Direction Les Lodges de l'Oyack",
        "email": "contact@leslodgesdeloyack.fr",
        "website": "https://leslodgesdeloyack.fr",
        "source": "Site officiel leslodgesdeloyack.fr",
        "territory": "Guyane",
        "category": "Écolodges & Nature",
        "hook": "votre cadre immersif d'exception au bord de l'Oyack à Roura et votre concept d'écolodges préservant la forêt amazonienne",
        "core_value": "l'alliance du confort raffiné et de la déconnexion en pleine nature tropicale"
    },
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Rour'Attitude",
        "name": "Direction Rour'Attitude",
        "email": "info@amazonie-decouverte.com",
        "website": "https://location-guyane.fr",
        "source": "Site officiel location-guyane.fr",
        "territory": "Guyane",
        "category": "Écolodges & Nature",
        "hook": "vos hébergements nature éco-responsables et vos activités de découverte fluviale au cœur de la Guyane",
        "core_value": "l'hospitalité authentique et le respect absolu de l'environnement forestier guyanais"
    },
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Amazone Nature Lodge",
        "name": "Direction Amazone Nature Lodge",
        "email": "contact@amazonenature.com",
        "website": "https://amazonenature.com",
        "source": "Site officiel amazonenature.com",
        "territory": "Guyane",
        "category": "Écolodges & Nature",
        "hook": "votre positionnement unique aux portes de la réserve de Kaw et l'expérience immersive proposée aux voyageurs amoureux de faune sauvage",
        "core_value": "la sensibilisation écologique et l'accès privilégié aux merveilles naturelles de Guyane"
    },
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Aqua Lodge Guadeloupe",
        "name": "Direction Aqua Lodge",
        "email": "contact@aqualodge.fr",
        "website": "https://aqualodge.fr",
        "source": "Site officiel aqualodge.fr",
        "territory": "Guadeloupe",
        "category": "Écolodges Flottants & Hébergement Insolite",
        "hook": "votre concept innovant de villas flottantes autonomes et écologiques ancrées dans les lagons de Guadeloupe",
        "core_value": "l'expérience nautique haut de gamme sans impact sur les fonds marins caribéens"
    },
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Dimitile Hôtel & Spa",
        "name": "Direction Dimitile Hôtel",
        "email": "contact@hotel-ledimitile.com",
        "website": "https://hotel-ledimitile.com",
        "source": "Site officiel hotel-ledimitile.com",
        "territory": "La Réunion",
        "category": "Hôtellerie de Charme & Patrimoine",
        "hook": "votre demeure créole de charme nichée à l'Entre-Deux face au Dimitile et votre engagement pour un tourisme réunionnais authentique",
        "core_value": "la quiétude des hauts de l'île, l'architecture traditionnelle créole et l'art de vivre montagnard"
    },
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Les Collines de Niassam",
        "name": "Direction Les Collines de Niassam",
        "email": "resa@niassam.com",
        "website": "https://niassam.com",
        "source": "Site officiel niassam.com",
        "territory": "Sénégal",
        "category": "Écolodges & Écotourisme Panafricain",
        "hook": "votre architecture emblématique perchée dans les baobabs et sur pilotis au bord du fleuve dans le Sine Saloum",
        "core_value": "l'intégration poétique dans le paysage du Saloum et le soutien concret aux communautés locales"
    },
    {
        "niche": "Écolodges & Tourisme Immersif",
        "company": "Souimanga Lodge",
        "name": "Direction Souimanga Lodge",
        "email": "dmenciere@souimanga-lodge.com",
        "website": "https://souimanga-lodge.com",
        "source": "Site officiel souimanga-lodge.com",
        "territory": "Sénégal",
        "category": "Écolodges & Écotourisme Panafricain",
        "hook": "vos bungalows lacustres raffinés au cœur de la mangrove de Fimela et votre vision d'un écotourisme sénégalais d'exception",
        "core_value": "la sérénité des îles du Saloum, la discrétion du service et la protection de la mangrove"
    },

    # =========================================================================
    # NICHE 5 : FRET EXPRESS SPÉCIFIQUE, TRANSIT COLIS & LOGISTIQUE DIASPORA
    # =========================================================================
    {
        "niche": "Fret Express & Logistique Diaspora",
        "company": "GO PAK Express",
        "name": "Direction GO PAK",
        "email": "contact@gopak.fr",
        "website": "https://gopak.fr",
        "source": "Site officiel gopak.fr",
        "territory": "Afrique / France",
        "category": "Fret Aérien Express & Colis Diaspora",
        "hook": "vos solutions d'expédition express de colis et marchandises reliant l'Hexagone aux capitales africaines avec transparence",
        "core_value": "la fiabilité des délais d'acheminement et la simplification logistique pour la diaspora"
    },
    {
        "niche": "Fret Express & Logistique Diaspora",
        "company": "e.SHIPLOG",
        "name": "Direction e.SHIPLOG",
        "email": "info@eshiplog.com",
        "website": "https://eshiplog.com",
        "source": "Site officiel eshiplog.com",
        "territory": "Afrique de l'Ouest / France",
        "category": "Transit Multimodal & Logistique Régionale",
        "hook": "votre savoir-faire dans le transport de fret commercial et l'acheminement de conteneurs et colis vers l'Afrique de l'Ouest",
        "core_value": "la maîtrise des réglementations douanières et l'accompagnement des flux commerciaux transfrontaliers"
    },
    {
        "niche": "Fret Express & Logistique Diaspora",
        "company": "Sidina 78 Express",
        "name": "Direction Sidina 78",
        "email": "contacts@sidina78.com",
        "website": "https://sidina78.com",
        "source": "Site officiel sidina78.com",
        "territory": "Madagascar / France",
        "category": "Transport de Colis & Fret Océan Indien",
        "hook": "votre pont logistique régulier assurant l'acheminement de colis et malles d'effets personnels entre la France et Madagascar",
        "core_value": "la proximité humaine avec les familles de la diaspora et la sécurité du fret"
    },
    {
        "niche": "Fret Express & Logistique Diaspora",
        "company": "Colis Antilles",
        "name": "Direction Colis Antilles",
        "email": "info@colisantilles.fr",
        "website": "https://colisantilles.fr",
        "source": "Site officiel colisantilles.fr",
        "territory": "Antilles / France",
        "category": "Réexpédition & Fret Colis Outre-mer",
        "hook": "votre service dédié de réexpédition de commandes et livraison de colis à destination de la Martinique et de la Guadeloupe",
        "core_value": "le désenclavement logistique pour les ultramarins et l'accès fluide au commerce en ligne"
    },
    {
        "niche": "Fret Express & Logistique Diaspora",
        "company": "TDM Caraïbes",
        "name": "Direction TDM Caraïbes",
        "email": "contact@tdm-caraibes.com",
        "website": "https://tdm-caraibes.com",
        "source": "Site officiel tdm-caraibes.com",
        "territory": "Martinique / Guadeloupe",
        "category": "Groupage, Fret & Transport Régional",
        "hook": "votre expertise logistique en groupage de marchandises et transport multimodal depuis votre plateforme du Lamentin",
        "core_value": "l'efficacité du transport inter-îles et la réactivité au service des professionnels caribéens"
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
        "batch": f"Batch 77 ({lead.get('niche', 'Écolodges et Fret')})"
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

    if "Écolodges" in niche:
        subject = f"Développement commercial et synergies pour {company}"
        lead_opening = f"J'ai pris connaissance avec beaucoup d'intérêt de {hook}."
        challenge_p1 = f"Lorsque l'on gère un hébergement d'exception valorisant {core_value}, les défis majeurs touchent régulièrement à la dépendance aux commissions des plateformes, au lissage de la saisonnalité et à la captation directe des clientèles régionales et de la diaspora en séjour."
    else:
        subject = f"Synergies de flux et partenariats pour {company}"
        lead_opening = f"Je découvre avec une grande attention {hook}."
        challenge_p1 = f"Dans les métiers du fret et du transit où {core_value} sont primordiales, les enjeux des dirigeants portent souvent sur la régularité des flux commerciaux, la fidélisation des PME expéditrices et l'accès à un réseau d'entrepreneurs actifs ayant des besoins continus d'acheminement."

    body = f"""Bonjour {name},

{lead_opening}

{challenge_p1}

Je prends contact avec vous au nom de Domtom Connect. Nous avons structuré cet écosystème d'accompagnement pour apporter des réponses concrètes aux problématiques des dirigeants en Afrique, dans les Caraïbes et dans leurs diasporas.

Notre dispositif s'articule notamment autour de notre programme Tremplin, un accompagnement à 360 degrés pour vous permettre d'atteindre vos différents objectifs, ainsi que d'un service de copilotage opérationnel direct pour vous décharger sur le plan commercial et logistique.

Quels sont aujourd'hui vos principaux freins ou priorités pour accélérer le rayonnement de {company} ?

Seriez-vous ouvert à un court échange informel de dix minutes la semaine prochaine afin de faire connaissance de vive voix et voir les synergies possibles ?

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
    print(f"AUDIT DE CONFORMITÉ STRICTE DU BATCH 77 ({len(CANDIDATES)} CIBLES)")
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
        print(f"  [OK] Règles N°4 et N°7 validées sans erreur")
        print(f"  [Sujet] : {subject}")
        
        clean_leads.append(lead)

    print("\n" + "=" * 80)
    if all_passed and len(clean_leads) == len(CANDIDATES):
        print(f"RÉSULTAT : 100% DES {len(clean_leads)} CIBLES DU BATCH 77 SONT VALIDÉES ET PRÊTES.")
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
    print(f"LANCEMENT DE L'ENVOI DU BATCH 77 ({len(leads)} CIBLES)")
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
    print(f"CAMPAGNE BATCH 77 ACHEVÉE : {success_count}/{len(leads)} EMAILS ENVOYÉS SANS AUCUNE ERREUR.")
    print("Tous les contacts ont été enregistrés dans contacts_deja_contactes.json.")
    print("=" * 80)

if __name__ == "__main__":
    is_send = "--send" in sys.argv
    send_batch(dry_run=(not is_send))
