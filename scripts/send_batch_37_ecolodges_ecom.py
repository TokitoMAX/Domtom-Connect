import smtplib, ssl, json, time, random, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

LEADS = [
    {
        "company": "Les Lataniers (La Réunion — Écolodge)",
        "email": "contact@les-lataniers.com",
        "territory": "La Réunion (Piton Saint-Leu)",
        "subject": "Hébergement écoresponsable péi et valorisation de l'expérience directe / Les Lataniers",
        "body": "Bonjour\n\nLes Lataniers offrent à leurs hôtes un hébergement écoresponsable avec vue sur l'océan à Piton Saint-Leu, dans un cadre naturel exceptionnel qui incarne parfaitement l'engagement de La Réunion pour un tourisme durable et ancré dans son territoire.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour aider les hébergements indépendants et écoresponsables à valoriser leur démarche par des capsules vidéo immersives et à générer des réservations directes sans passer par Booking ou Airbnb.\n\nNous réunissons sur WhatsApp un réseau privé d'hôteliers, de propriétaires d'écolodges et d'entrepreneurs péi pour partager des stratégies de développement et des bonnes pratiques de gestion.\n\nSeriez-vous disponible pour un court échange téléphonique de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "La Caféière Beauséjour (Guadeloupe)",
        "email": "info@cafeierebeausejour.fr",
        "territory": "Guadeloupe (Pointe-Noire)",
        "subject": "Maison d'hôtes de caractère en Guadeloupe et valorisation de l'accueil direct / La Caféière",
        "body": "Bonjour\n\nLa Caféière Beauséjour à Pointe-Noire propose une expérience d'hébergement rare, ancrée dans le patrimoine agricole et naturel de la Basse-Terre, avec une authenticité qui fait toute la différence pour les voyageurs en quête d'immersion véritable.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous aidons les maisons d'hôtes et les hébergements de caractère des Antilles à se rendre visibles directement auprès d'une clientèle exigeante et à fidéliser leurs clients sans intermédiaire.\n\nNous animons sur WhatsApp un réseau privé de propriétaires de gîtes, de chambres d'hôtes et d'hôteliers indépendants des DOM-TOM pour partager des pratiques et des opportunités de collaboration.\n\nPourrions-nous caler un échange de 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Le Jardin Maoré (Mayotte — Écolodge 4*)",
        "email": "contact@jardinmaore.com",
        "territory": "Mayotte (Kani-Kéli)",
        "subject": "Écolodge 4 étoiles à Mayotte et valorisation de l'expérience balnéaire mahoraise / Jardin Maoré",
        "body": "Bonjour\n\nLe Jardin Maoré constitue l'une des adresses hôtelières les plus remarquables de Mayotte, avec un positionnement écoresponsable et une situation en bord de plage de N'Gouja qui en fait une référence incontournable pour les visiteurs à la recherche d'un séjour d'exception dans l'océan Indien.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour permettre aux établissements hôteliers d'exception des DOM-TOM de valoriser leur offre par des vidéos immersives et d'attirer directement une clientèle premium sans dépendre exclusivement des OTA.\n\nNous réunissons sur WhatsApp un réseau privé de directeurs d'hôtels, d'écolodges et d'entrepreneurs du tourisme de Mayotte, La Réunion et des Antilles pour partager des stratégies et des opportunités de partenariat.\n\nSeriez-vous partant pour un bref appel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Dominocho (e-commerce rhum & épicerie fine réunionnaise)",
        "email": "contact@dominocho.com",
        "territory": "La Réunion (e-commerce national)",
        "subject": "Rhums et épicerie fine réunionnaise en ligne et nouveaux canaux de vente directe / Dominocho",
        "body": "Bonjour\n\nDominocho s'est imposé comme une référence du commerce en ligne pour les amateurs de rhums artisanaux et de produits d'épicerie fine réunionnaise, avec un catalogue qui valorise l'excellence des producteurs locaux auprès d'une clientèle nationale.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour offrir aux e-commerçants spécialisés dans les produits DOM-TOM de nouveaux canaux de mise en valeur par le format vidéo court et de connexion directe avec une clientèle passionnée.\n\nNous réunissons sur WhatsApp un réseau privé d'entrepreneurs du e-commerce et de créateurs de marques ultramarins pour partager des pratiques d'acquisition client et des retours de terrain sur les marchés digitaux.\n\nSeriez-vous ouvert pour un échange informel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "La Maison des Antilles (e-commerce produits antillais)",
        "email": "contact@lamaisondesantilles.com",
        "territory": "France métropolitaine — produits Antilles Guyane",
        "subject": "Produits antillais en ligne et développement de nouveaux circuits de valorisation directe / Maison des Antilles",
        "body": "Bonjour\n\nLa Maison des Antilles est devenue une plateforme de référence pour les amateurs de produits frais, d'épicerie et de traiteur antillais, en proposant une offre complète qui fait le pont entre les producteurs des Antilles et la diaspora et les curieux en métropole.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous construisons de nouveaux canaux de mise en valeur des produits ultramarins par le format vidéo court immersif, permettant aux e-commerçants de toucher une audience plus large et plus engagée.\n\nNous animons un réseau privé WhatsApp d'entrepreneurs du commerce en ligne et de distributeurs de produits DOM-TOM pour partager des stratégies d'acquisition et des opportunités de partenariat.\n\nSeriez-vous disponible pour un court échange de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Zantilles Market (épicerie antillaise en ligne)",
        "email": "contact@zantillesmarket.fr",
        "territory": "France — épicerie antillaise e-commerce",
        "subject": "Épicerie antillaise en ligne et nouvelles formes de connexion avec la clientèle / Zantilles Market",
        "body": "Bonjour\n\nZantilles Market propose à une clientèle dispersée en France métropolitaine et dans les DOM une épicerie antillaise en ligne complète et de qualité, rendant accessibles les saveurs des Antilles à tous ceux qui ne peuvent s'y rendre régulièrement.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour offrir aux acteurs du commerce en ligne de produits antillais de nouvelles formes de valorisation vidéo et de fidélisation directe de leur clientèle.\n\nNous réunissons sur WhatsApp un réseau privé d'e-commerçants et de créateurs de marques ultramarins pour partager des bonnes pratiques et identifier ensemble des opportunités de croissance.\n\nPourrions-nous échanger 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "OUA Concept (épicerie créole premium)",
        "email": "contact@oua-concept.com",
        "territory": "France — épicerie créole artisanale premium",
        "subject": "Épicerie créole artisanale premium et valorisation des producteurs ultramarins / OUA Concept",
        "body": "Bonjour\n\nOUA Concept se distingue par une sélection rigoureuse de produits créoles artisanaux premium, mettant en avant les savoir-faire des producteurs ultramarins et offrant à sa clientèle des expériences gustatives authentiques et haut de gamme.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous aidons les marques de produits artisanaux ultramarins à construire une présence vidéo distinctive et à créer des liens directs et durables avec leurs communautés de clients.\n\nNous réunissons sur WhatsApp un cercle privé de fondateurs de marques créoles et d'entrepreneurs du terroir ultramarin pour partager des pratiques et développer ensemble de nouvelles formes de commerce direct.\n\nSeriez-vous partant pour un appel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Allô Fifi Épicerie Créole",
        "email": "contact@fifiepicerie.net",
        "territory": "France — épicerie créole artisanale",
        "subject": "Épicerie créole artisanale et connexion directe avec les amateurs de saveurs authentiques / Allô Fifi",
        "body": "Bonjour\n\nAllô Fifi Épicerie est une marque attachante et authentique portée par la passion de sa fondatrice pour les saveurs créoles, proposant des produits artisanaux qui racontent une histoire et créent un lien émotionnel fort avec leur clientèle.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse, deux outils pensés pour les marques créoles à fort ancrage humain qui souhaitent valoriser leur démarche par des formats vidéo immersifs et toucher directement une communauté de clients fidèles.\n\nNous animons sur WhatsApp un réseau privé de fondatrices et fondateurs de marques créoles et artisanales des DOM-TOM pour partager des retours d'expérience et construire ensemble de nouvelles formes de commercialisation directe.\n\nSeriez-vous disponible pour un échange informel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "LJeConseils Martinique",
        "email": "contact@ljeconseils.fr",
        "territory": "Martinique",
        "subject": "Formation professionnelle et coaching entrepreneurial en Martinique et nouvelles approches / LJeConseils",
        "body": "Bonjour\n\nVotre cabinet LJeConseils accompagne les professionnels et entrepreneurs martiniquais avec une approche de la formation et du coaching ancrée dans la réalité des marchés insulaires et des enjeux spécifiques des DOM.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour offrir aux formateurs et coachs indépendants des Antilles de nouveaux outils de mise en valeur de leur expertise et de connexion directe avec leurs clients potentiels.\n\nNous réunissons sur WhatsApp un réseau privé de coachs, formateurs et consultants des DOM-TOM pour partager des pratiques de développement et identifier ensemble des opportunités de collaboration et de prescription mutuelle.\n\nSeriez-vous partant pour un court échange de 10 minutes au téléphone cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Elite Coaching Martinique",
        "email": "contact@elitecoachingmartinique.com",
        "territory": "Martinique",
        "subject": "Coaching entrepreneurial et accompagnement des dirigeants martiniquais / Elite Coaching",
        "body": "Bonjour\n\nElite Coaching Martinique accompagne les entrepreneurs et dirigeants de l'île avec des programmes d'accompagnement ciblés pour renforcer leur performance, leur leadership et leur capacité à développer leur activité dans un contexte insulaire spécifique.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous construisons de nouveaux espaces de mise en réseau pour les coachs et consultants des Antilles, leur permettant de valoriser leur expertise directement auprès de leurs clients cibles.\n\nNous animons un réseau privé WhatsApp de coachs, mentors et entrepreneurs des Antilles et des Outre-Mer pour partager des pratiques de développement et créer des collaborations entre professionnels.\n\nSeriez-vous disponible pour un échange de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "CK Consulting FWI (Guadeloupe)",
        "email": "contact@ckconsultingfwi.com",
        "territory": "Guadeloupe",
        "subject": "Accompagnement des entrepreneurs guadeloupéens et nouvelles dynamiques de croissance / CK Consulting",
        "body": "Bonjour\n\nCK Consulting FWI accompagne les entrepreneurs et dirigeants de Guadeloupe dans leur développement avec des formations certifiantes et un suivi personnalisé qui prend en compte les spécificités des marchés caribéens.\n\nJe vous contacte car nous développons www.domtomconnect.com et l'application DTC Pulse pour créer de nouvelles formes de mise en valeur et de connexion directe pour les cabinets de conseil et de formation des DOM-TOM avec leur réseau de clients et partenaires.\n\nNous réunissons sur WhatsApp un cercle privé de consultants, formateurs et dirigeants des Antilles et de l'océan Indien pour partager des leviers de développement et identifier des collaborations mutuellement bénéfiques.\n\nPourrions-nous caler un bref appel de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "YuUp Coaching (La Réunion)",
        "email": "contact@yuup-coaching.fr",
        "territory": "La Réunion",
        "subject": "Coaching et développement des talents péi et nouvelles formes de mise en réseau / YuUp",
        "body": "Bonjour\n\nYuUp Coaching accompagne des individus et des équipes à La Réunion dans le développement de leurs talents et de leur posture professionnelle, avec une approche humaine et centrée sur des résultats mesurables dans un contexte péi.\n\nJe vous contacte car avec www.domtomconnect.com et l'application DTC Pulse, nous offrons aux coachs et formateurs réunionnais de nouveaux outils pour valoriser leur expertise, toucher une clientèle plus large et construire des communautés de clients engagés.\n\nNous animons sur WhatsApp un réseau privé de coachs, consultants et entrepreneurs péi pour partager des pratiques de croissance et identifier ensemble des opportunités de collaboration.\n\nSeriez-vous ouvert pour un court échange téléphonique de 10 minutes cette semaine\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    }
]

print("=======================================================")
print("ENVOI BATCH 37 : 12 ECOLODGES, E-COMMERCE CREOLE & COACHS DOM-TOM")
print("(emails 100% verifies via sources web)")
print("=======================================================\n")

with open(CONTACTS_DB_FILE, 'r', encoding='utf-8') as f:
    contacts_db = json.load(f)

existing_contacts = {c['email'].lower() for c in contacts_db.get('contacts', []) if isinstance(c, dict) and 'email' in c}
existing_domains = {d.lower() for d in contacts_db.get('domains', []) if isinstance(d, str)}

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
                    "batch": "Batch 37 - Ecolodges, E-commerce Creole & Coachs"
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
print("BILAN BATCH 37 : " + str(success_count) + " ENVOYES, " + str(error_count) + " ERREURS")
print("TOTAL BASE : " + str(contacts_db['total_contacts']))
print("=======================================================")
