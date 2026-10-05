import smtplib, ssl, json, time, random, sys, subprocess
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# LEADS BATCH 36 - emails 100% verifies via sources web officielles
LEADS = [
    {
        "company": "Alpha Plongée Martinique",
        "email": "contact@alphaplongee.com",
        "territory": "Martinique (Anses d'Arlet)",
        "subject": "Plongée aux Anses d'Arlet et valorisation directe des séjours sous-marins / Alpha Plongée",
        "body": "Bonjour\n\nVos plongées aux Anses d'Arlet, avec leurs fonds marins exceptionnels et la célèbre église sous-marine, constituent une expérience unique que peu d'opérateurs peuvent proposer avec autant d'authenticité.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse, qui permettent aux clubs de plongée et opérateurs nautiques de se rendre visibles directement auprès de plongeurs passionnés par des capsules vidéo immersives et de générer des réservations sans passer par les revendeurs habituels.\n\nNous réunissons sur WhatsApp un réseau privé d'opérateurs nautiques, de guides et d'entrepreneurs des Antilles et de l'océan Indien pour partager des pratiques de développement et des connexions d'affaires directes.\n\nSeriez-vous disponible pour un court échange téléphonique de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Corail Club Caraïbes",
        "email": "corailclub@corailclubcaraibes.com",
        "territory": "Martinique (Les Trois-Îlets)",
        "subject": "Plongée aux Trois-Îlets et expériences marines caribéennes authentiques / Corail Club Caraïbes",
        "body": "Bonjour\n\nLe Corail Club Caraïbes aux Trois-Îlets propose des plongées dans des eaux martiniquaises parmi les plus préservées et les plus riches en biodiversité marine de la Caraïbe.\n\nJe me permets de vous contacter car avec www.domtomconnect.com et l'application DTC Pulse, nous aidons les clubs de plongée et prestataires nautiques à construire une visibilité directe auprès de leurs clientèles cibles, en valorisant l'authenticité de leurs spots et la qualité de leurs équipes.\n\nNous réunissons sur WhatsApp un cercle privé d'opérateurs marins et de dirigeants des Antilles pour partager des retours de terrain et identifier ensemble des leviers de croissance.\n\nPourrions-nous échanger 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Immersion Caraïbes",
        "email": "info@immersioncaraibes.com",
        "territory": "Martinique (Le Marin)",
        "subject": "Plongée au Marin et immersion caribéenne pour les passionnés de la mer / Immersion Caraïbes",
        "body": "Bonjour\n\nVotre club de plongée au Marin offre aux amateurs de fonds sous-marins l'accès à des épaves, des jardins de coraux et une biodiversité marine remarquable dans l'une des baies les plus actives de Martinique.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour offrir aux clubs de plongée un outil de mise en valeur vidéo directe qui attire des plongeurs qualifiés sans dépendre des centrales de réservation.\n\nNous réunissons sur un groupe WhatsApp privé des opérateurs de plongée et entrepreneurs nautiques des Antilles et de l'océan Indien pour partager des stratégies de remplissage et des opportunités de partenariat.\n\nSeriez-vous partant pour un appel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Natiyabel Plongée",
        "email": "info@natiyabel.com",
        "territory": "Martinique (Sainte-Anne)",
        "subject": "Plongée à Sainte-Anne et valorisation des expériences marines martiniquaises / Natiyabel",
        "body": "Bonjour\n\nSainte-Anne offre certains des spots de plongée les plus appréciés de Martinique, et votre club Natiyabel permet à vos clients de découvrir ces fonds marins avec un encadrement professionnel et une connaissance fine du milieu local.\n\nJe vous écris car nous avons créé www.domtomconnect.com et l'application DTC Pulse pour permettre aux prestataires d'activités nautiques de valoriser leurs sorties par le format vidéo court et de générer des réservations directes sans commission.\n\nNous animons un réseau privé WhatsApp d'opérateurs de plongée et de nautisme des Antilles et de l'océan Indien pour partager des pratiques et bâtir des partenariats locaux.\n\nSeriez-vous disponible pour un bref échange de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Feeling Guadeloupe",
        "email": "contact@feelingguadeloupe.fr",
        "territory": "Guadeloupe",
        "subject": "Activités et expériences outdoor en Guadeloupe et valorisation directe des réservations / Feeling",
        "body": "Bonjour\n\nVotre agence permet aux visiteurs de vivre la Guadeloupe avec authenticité, en proposant des activités en pleine nature qui font vraiment ressentir l'âme de l'archipel et ses paysages extraordinaires.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour permettre aux agences de loisirs et opérateurs touristiques de la Guadeloupe de se rendre visibles directement auprès d'une clientèle motivée et de réserver sans passer par des intermédiaires.\n\nNous réunissons sur WhatsApp un réseau privé d'opérateurs touristiques, de guides et d'entrepreneurs des Antilles pour partager des opportunités d'affaires et des stratégies de développement.\n\nPourrions-nous caler un court appel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Karucocorecept",
        "email": "contact@karucocorecept.com",
        "territory": "Guadeloupe",
        "subject": "Réceptif guadeloupéen et développement de nouvelles formes d'accueil direct / Karucocorecept",
        "body": "Bonjour\n\nVotre positionnement en tant qu'agence réceptive en Guadeloupe vous place au cœur de l'organisation des séjours pour les voyageurs souhaitant découvrir l'archipel de façon personnalisée et authentique.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour offrir aux réceptifs et opérateurs touristiques guadeloupéens de nouveaux outils de visibilité et de réservation directe sans dépendre exclusivement des tour-opérateurs et plateformes nationales.\n\nNous réunissons sur WhatsApp un réseau fermé d'agences réceptives, de guides et d'entrepreneurs des Antilles pour créer des synergies et partager des stratégies de développement.\n\nSeriez-vous ouvert pour un échange téléphonique de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Tropical Tour Guadeloupe",
        "email": "receptif@tropical-tour.com",
        "territory": "Guadeloupe",
        "subject": "Réceptif tropical guadeloupéen et nouvelles dynamiques d'accueil des voyageurs / Tropical Tour",
        "body": "Bonjour\n\nVotre activité de réceptif en Guadeloupe permet à des voyageurs du monde entier de vivre l'archipel autrement, avec une expertise locale qui fait toute la différence dans la qualité des séjours proposés.\n\nJe vous écris car avec www.domtomconnect.com et l'application DTC Pulse, nous développons de nouveaux outils de mise en réseau et de réservation directe pour les opérateurs réceptifs des DOM-TOM, en créant des passerelles sans frictions entre les prestataires locaux et leurs clientèles.\n\nNous réunissons sur WhatsApp un réseau privé d'agences réceptives, d'hôteliers et d'entrepreneurs des Antilles pour partager des pratiques de croissance et des opportunités d'affaires.\n\nPourrions-nous échanger 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Connections Réunion",
        "email": "resa@connections-reunion.com",
        "territory": "La Réunion",
        "subject": "Agence réceptive péi et développement des circuits individuels et groupes / Connections Réunion",
        "body": "Bonjour\n\nConnections Réunion s'est imposé comme un acteur de référence de l'accueil réceptif sur l'île, avec une capacité à proposer des séjours sur mesure aussi bien aux individuels qu'aux groupes avec une connaissance fine des richesses naturelles et culturelles péi.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour aider les agences réceptives réunionnaises à se rendre visibles directement auprès de leurs clientèles cibles et à optimiser leurs réservations en ligne sans intermédiaire.\n\nNous animons sur WhatsApp un réseau privé d'opérateurs touristiques et d'entrepreneurs péi pour partager des opportunités de développement et des bonnes pratiques de gestion.\n\nSeriez-vous disponible pour un court échange de 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Karibuni",
        "email": "contact@karibuni.fr",
        "territory": "Martinique (Agri-tourisme & Nature)",
        "subject": "Agrotourisme et immersion nature en Martinique et développement de l'expérience directe / Karibuni",
        "body": "Bonjour\n\nKaribuni incarne une approche du tourisme en Martinique qui met l'accent sur le lien à la nature, à l'agriculture locale et aux savoir-faire traditionnels, offrant une alternative authentique aux offres standardisées de l'île.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous permettons aux prestataires d'agrotourisme et d'expériences nature de valoriser leur singularité par des formats vidéo immersifs et de générer des réservations directes sans intermédiaire.\n\nNous réunissons sur WhatsApp un réseau privé d'entrepreneurs du tourisme durable et de l'agrotourisme des Antilles et de l'océan Indien pour partager des pratiques et bâtir des collaborations.\n\nSeriez-vous partant pour un appel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Agriland Guadeloupe",
        "email": "info@agriland.fr",
        "territory": "Guadeloupe",
        "subject": "Agriculture et développement territorial en Guadeloupe et nouveaux marchés numériques / Agriland",
        "body": "Bonjour\n\nAgriland incarne l'ambition de valoriser la production agricole guadeloupéenne et de créer de nouvelles formes d'accès aux marchés pour les producteurs locaux, dans une logique de développement territorial durable.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour créer de nouveaux circuits de valorisation et de distribution directe pour les producteurs et acteurs de l'agro-alimentaire des DOM-TOM.\n\nNous animons sur WhatsApp un réseau privé d'agriculteurs, d'entrepreneurs du terroir et de décideurs des Antilles et de l'océan Indien pour partager des opportunités d'affaires et des leviers de commercialisation directe.\n\nPourrions-nous échanger 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Le Gild's — Green Lord Domaine (Guadeloupe)",
        "email": "contact@greenlorddomaine.com",
        "territory": "Guadeloupe (Green Lord Domaine)",
        "subject": "Gastronomie de terroir guadeloupéenne et valorisation de l'excellence locale / Green Lord",
        "body": "Bonjour\n\nLe domaine Green Lord et sa table Le Gild's incarnent ce que la Guadeloupe a de plus singulier à offrir en matière d'expérience gastronomique et d'immersion dans un patrimoine naturel et agricole exceptionnel.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous aidons les restaurants d'exception et les domaines gastronomiques des DOM-TOM à se rendre visibles auprès d'une clientèle en quête d'authenticité et à générer des réservations directes sans dépendre de TheFork ou des plateformes nationales.\n\nNous réunissons sur WhatsApp un réseau privé de chefs, restaurateurs et entrepreneurs des Antilles et de l'océan Indien pour partager des savoir-faire et des opportunités de valorisation du terroir local.\n\nSeriez-vous disponible pour un court échange de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Villa Fleurie La Réunion",
        "email": "contact@villafleurie.re",
        "territory": "La Réunion (Saint-Denis)",
        "subject": "Gastronomie contemporaine péi et expériences de table d'exception à La Réunion / Villa Fleurie",
        "body": "Bonjour\n\nVilla Fleurie propose à Saint-Denis une cuisine contemporaine qui puise dans la richesse des produits réunionnais pour offrir des expériences gastronomiques à la hauteur des plus belles tables de l'île.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour permettre aux restaurants d'excellence de La Réunion de valoriser leur démarche culinaire par des formats vidéo immersifs et d'attirer directement une clientèle exigeante sans dépendre des agrégateurs.\n\nNous réunissons sur WhatsApp un réseau privé de restaurateurs, chefs et entrepreneurs péi pour partager des pratiques de développement et bâtir ensemble la gastronomie réunionnaise de demain.\n\nSeriez-vous ouvert pour un bref appel téléphonique de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    }
]

print("=======================================================")
print("ENVOI BATCH 36 : 12 LEADS VERIFIES (plongee, outdoor, gastro DOM-TOM)")
print("=======================================================\n")

with open(CONTACTS_DB_FILE, 'r', encoding='utf-8') as f:
    contacts_db = json.load(f)

existing_contacts = {c['email'].lower() for c in contacts_db.get('contacts', []) if isinstance(c, dict) and 'email' in c}
existing_domains = {d.lower() for d in contacts_db.get('domains', []) if isinstance(d, str)}

# Pre-flight
errors = []
for lead in LEADS:
    if ':' in lead['subject']: errors.append('COLON SUBJECT: ' + lead['company'])
    if ':' in lead['body']: errors.append('COLON BODY: ' + lead['company'])
    if 'www.domtomconnect.com' not in lead['body']: errors.append('MISSING URL: ' + lead['company'])
    if 'Villeronce' not in lead['body']: errors.append('MISSING SIG: ' + lead['company'])
    if lead['email'].lower() in existing_contacts: errors.append('DUPLICATE: ' + lead['email'])

if errors:
    for e in errors: print('ERROR: ' + e)
    sys.exit(1)
print("Pre-vol OK — 0 erreur. Lancement envoi...\n")

context = ssl.create_default_context()
success_count = 0
error_count = 0

try:
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP SSL OK.\n")

        for idx, lead in enumerate(LEADS, 1):
            company = lead["company"]
            recipient = lead["email"].strip()
            territory = lead["territory"]
            subject = lead["subject"]
            body = lead["body"]
            domain = recipient.split('@')[1].lower() if '@' in recipient else ''

            print("[" + str(idx) + "/" + str(len(LEADS)) + "] " + company + " -> " + recipient)

            if recipient.lower() in existing_contacts:
                print("  [SKIP] Deja contacte.")
                continue

            msg = MIMEText(body, "plain", "utf-8")
            msg["From"] = "Loic Villeronce <" + SENDER_EMAIL + ">"
            msg["To"] = recipient
            msg["Subject"] = subject
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

            try:
                server.sendmail(SENDER_EMAIL, recipient, msg.as_string())
                print("  ==> ENVOYE : " + recipient)
                success_count += 1

                contacts_db.setdefault("contacts", []).append({
                    "email": recipient.lower(), "name": company, "domain": domain,
                    "count_sent": 1, "count_received": 0,
                    "last_date": formatdate(localtime=True), "subjects": [subject],
                    "batch": "Batch 36 - Plongee, Outdoor & Gastro DOM-TOM (emails verifies)"
                })
                existing_contacts.add(recipient.lower())
                if domain and domain not in existing_domains:
                    contacts_db.setdefault("domains", []).append(domain)
                    existing_domains.add(domain)
                contacts_db["total_contacts"] = len(contacts_db["contacts"])
                contacts_db["total_domains"] = len(contacts_db["domains"])
                with open(CONTACTS_DB_FILE, 'w', encoding='utf-8') as f_out:
                    json.dump(contacts_db, f_out, indent=2, ensure_ascii=False)

            except Exception as e:
                print("  [ERREUR] " + recipient + ": " + str(e))
                error_count += 1

            if idx < len(LEADS):
                pause = round(random.uniform(13.0, 18.0), 1)
                print("  Pause: " + str(pause) + "s...")
                time.sleep(pause)

except Exception as e:
    print("\nErreur SMTP: " + str(e))
    sys.exit(1)

print("\n=======================================================")
print("BILAN BATCH 36 : " + str(success_count) + " ENVOYES, " + str(error_count) + " ERREURS")
print("TOTAL BASE : " + str(contacts_db['total_contacts']))
print("=======================================================")
