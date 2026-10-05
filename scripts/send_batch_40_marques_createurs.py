import smtplib, ssl, json, time, random, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# Batch 40 : MARQUES DE MODE, CRÉATEURS, COSMÉTIQUE & JOAILLERIE D'ART (12 LEADS)
# Approche 100% Business / Solutions Concrètes / Vente Directe & DTC Pulse
LEADS = [
    {
        "company": "Pardon! (Saint-Denis, La Réunion)",
        "email": "communication@pardon.re",
        "territory": "La Réunion (Saint-Denis)",
        "subject": "Expansion de marque identitaire et nouveaux leviers digitaux / Pardon!",
        "body": "Bonjour,\n\nPardon! a marqué l'histoire du textile et de la pop-culture à La Réunion, avec un ton inimitable, un sens aigu de la provocation créative et un attachement péi indémodable.\n\nPour une marque forte comme la vôtre, les enjeux actuels tournent autour de la conquête de nouveaux relais de croissance : activer la diaspora en direct sans friction logistique, renouveler l'engagement des nouvelles générations sur mobile et amplifier la vente en ligne par des formats vidéo courts et percutants.\n\nChez Domtom Connect, nous accompagnons les marques de caractère pour résoudre ces problématiques de commercialisation et de conversion digitale. Parallèlement, nous animons un réseau d'affaires réunissant entreprises et porteurs de projets (Océan Indien, Caraïbes, Afrique, diaspora) et ouvrons l'accès à notre application mobile DTC Pulse.\n\nQuel est votre principal chantier commercial ou créatif pour booster vos canaux directs cette saison ?\n\nSeriez-vous disponible pour un échange téléphonique de 10 minutes cette semaine afin d'évaluer comment nous pouvons vous accompagner ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Bourbon Palto (Saint-Denis, La Réunion)",
        "email": "contact@bourbonpalto.com",
        "territory": "La Réunion (Saint-Denis)",
        "subject": "Vente directe textile péi et captation de communauté / Bourbon Palto",
        "body": "Bonjour,\n\nBourbon Palto s'est imposé comme un repère incontournable du textile et de l'habillement à La Réunion, alliant esprit local et proximité avec les familles réunionnaises.\n\nFace à la pression sur les marges et à la concurrence du prêt-à-porter d'importation, dynamiser le panier moyen en ligne et fidéliser une communauté d'acheteurs directs demande des outils d'acquisition modernes et du contenu visuel impactant. Nous intervenons précisément auprès des marques textiles pour débloquer ces canaux de vente directe.\n\nEn collaborant avec nous, vous rejoignez également un réseau d'affaires actif couvrant l'Océan Indien, les Caraïbes, l'Afrique et la diaspora, tout en accédant à notre application mobile DTC Pulse.\n\nQuelle est votre priorité actuelle pour développer vos ventes hors boutique physique ?\n\nAuriez-vous 10 minutes cette semaine pour un court échange téléphonique ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Parfums des Îles (Sainte-Luce, Martinique)",
        "email": "contact@parfums-des-iles.com",
        "territory": "Martinique (Sainte-Luce)",
        "subject": "Commercialisation directe et rayonnement de vos fragrances / Parfums des Îles",
        "body": "Bonjour,\n\nDepuis Sainte-Luce, Parfums des Îles valorise magnifiquement les essences de la flore caribéenne en créant des fragrances artisanales d'une grande finesse olfactive.\n\nVendre du parfum et des cosmétiques artisanaux depuis un marché insulaire implique de surmonter la barrière de l'export et de recréer l'expérience sensorielle en ligne pour convertir des clients distants en acheteurs réguliers. Domtom Connect conçoit des stratégies concrètes de production de contenu vidéo immersif et d'acquisition directe pour répondre à ce défi.\n\nNous intégrons aussi nos partenaires à notre réseau d'affaires (Caraïbes, Afrique, Océan Indien, diaspora) et leur proposons un accès exclusif à notre application mobile DTC Pulse.\n\nSur quel levier souhaitez-vous accélérer pour accroître vos commandes en direct cette année ?\n\nSeriez-vous ouvert à un appel rapide de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "La Savonnerie Antillaise (Les Trois-Îlets, Martinique)",
        "email": "lasavonnerieantillaise@yahoo.fr",
        "territory": "Martinique (Les Trois-Îlets)",
        "subject": "Valorisation artisanale et développement des ventes directes / Savonnerie Antillaise",
        "body": "Bonjour,\n\nAu cœur du Village de la Poterie aux Trois-Îlets, La Savonnerie Antillaise offre aux amateurs de soins naturels des savons artisanaux authentiques élaborés à partir d'ingrédients locaux.\n\nPour un atelier artisanal, le défi consiste à ne pas dépendre uniquement des flux de passage touristiques et à générer un flux continu de réassort et de commandes en ligne tout au long de l'année. Nous aidons les artisans et créateurs de nos îles à structurer leur visibilité digitale pour déclencher des ventes directes récurrentes.\n\nNos clients ont également l'opportunité de rejoindre notre réseau d'entreprises et de porteurs de projets (Caraïbes, Océan Indien, Afrique, diaspora) et de découvrir l'application mobile DTC Pulse.\n\nQuel est votre enjeu principal en ce moment pour développer votre distribution ou votre e-commerce ?\n\nPourrions-nous caler un échange de 10 minutes au téléphone cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Madras Bazaar (La Réunion)",
        "email": "contact@madras-bazaar.re",
        "territory": "La Réunion",
        "subject": "Stratégie de vente en ligne et partenariats créateurs / Madras Bazaar",
        "body": "Bonjour,\n\nMadras Bazaar enrichit l'offre textile et accessoires à La Réunion en mettant en valeur les étoffes traditionnelles et des créations colorées appréciées des connaisseurs.\n\nDans le secteur de la mode et des tissus, élargir son audience au-delà du cercle local et optimiser la conversion sur mobile demande des formats de présentation vivants et une acquisition ciblée. Chez Domtom Connect, nous apportons des solutions techniques et de communication vidéo pour dynamiser ces flux commerciaux directs.\n\nVous aurez également l'opportunité d'intégrer notre réseau professionnel réunissant créateurs et dirigeants (Océan Indien, Caraïbes, Afrique, diaspora) et d'utiliser notre plateforme DTC Pulse.\n\nQuelle est votre plus grande priorité commerciale pour les prochains mois ?\n\nSeriez-vous disponible pour un court appel téléphonique de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Madras & Cie (Guadeloupe)",
        "email": "mpcmadrasetcie@gmail.com",
        "territory": "Guadeloupe",
        "subject": "Valorisation des créations madras et nouveaux débouchés / Madras & Cie",
        "body": "Bonjour,\n\nMadras & Cie réalise un travail minutieux pour faire vivre le patrimoine textile antillais à travers des créations artisanales qui célèbrent nos traditions avec fraîcheur.\n\nPour une marque artisanale indépendante, l'un des freins récurrents réside dans la visibilité à grande échelle et les coûts de commercialisation hors du département. Nous concevons pour les créateurs des solutions sur mesure afin d'augmenter leur notoriété digitale et générer des ventes directes sans intermédiaires prédateurs.\n\nNous vous ouvrons également les portes de notre réseau d'entreprises et de porteurs de projets (Caraïbes, Afrique, Océan Indien, diaspora), avec un accès à l'application mobile DTC Pulse.\n\nQuels sont vos objectifs du moment pour accroître vos débouchés et votre carnet de commandes ?\n\nAuriez-vous 10 minutes cette semaine pour faire connaissance lors d'un bref appel ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Eliette Lesuperbe (Guadeloupe)",
        "email": "creationslesuperbes@gmail.com",
        "territory": "Guadeloupe",
        "subject": "Haute couture caribéenne et valorisation de prestige / Eliette Lesuperbe",
        "body": "Bonjour,\n\nVotre parcours et vos collections haute couture honorent la Guadeloupe et l'espace caribéen, en élevant nos matières et nos identités au rang de créations d'exception.\n\nPour une maison de création de prestige, le rayonnement international passe par une mise en scène vidéo irréprochable et la connexion avec des décideurs et des prescripteurs d'affaires capables de porter vos créations au-delà des frontières insulaires. C'est précisément l'accompagnement que nous structurons pour les marques de premier plan.\n\nNotre écosystème réunit un réseau d'affaires ciblé (Caraïbes, Afrique, Océan Indien, diaspora) et met à votre disposition l'application mobile DTC Pulse pour présenter vos pièces à une audience d'acheteurs qualifiés.\n\nQuels sont vos projets actuels en matière de diffusion ou de nouvelles collaborations ?\n\nSeriez-vous partante pour un court échange téléphonique de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Kalia Nature (Paris / Antilles)",
        "email": "serviceclient@kalia-nature.com",
        "territory": "France & Antilles",
        "subject": "Croissance de marque cosmétique et passerelles directes / Kalia Nature",
        "body": "Bonjour,\n\nKalia Nature a bâti une marque remarquable en formulant des soins capillaires naturels inspirés de la richesse botanique caribéenne, avec une exigence de composition plébiscitée par les utilisatrices.\n\nDans un marché de la beauté naturelle très sollicité, maintenir des coûts d'acquisition maîtrisés et fidéliser sa communauté en direct exige des formats vidéo engageants et des canaux de distribution sans déperdition de marge. Domtom Connect accompagne les marques de beauté pour optimiser ces leviers d'acquisition directe.\n\nEn parallèle, nous animons un réseau d'affaires réunissant dirigeants et porteurs de projets (Caraïbes, Afrique, Océan Indien, diaspora) et vous donnons un accès privilégié à notre solution DTC Pulse.\n\nQuelle est votre priorité actuelle sur le développement de vos ventes directes ou de vos marchés d'Outre-Mer ?\n\nSeriez-vous disponible pour un échange téléphonique de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Les Secrets de Loly (Paris / International)",
        "email": "contact@secretsdeloly.com",
        "territory": "France & International",
        "subject": "Partenariats B2B et synergies territoriales Outre-Mer / Les Secrets de Loly",
        "body": "Bonjour,\n\nLes Secrets de Loly a réalisé une trajectoire entrepreneuriale exceptionnelle, en s'imposant comme la référence incontournable du soin des cheveux texturés en France et à l'international.\n\nAlors que votre marque consolide sa présence globale, la pénétration continue et le lien direct avec les communautés des Outre-Mer (Antilles, Océan Indien, Guyane) représentent un ancrage affectif et commercial de premier ordre face aux marques concurrentes.\n\nChez Domtom Connect, nous bâtissons un écosystème d'affaires direct reliant entreprises et acteurs économiques majeurs des Caraïbes, d'Afrique et de la diaspora. Nous offrons également un canal d'exposition mobile via notre application DTC Pulse.\n\nNous serions ravis d'échanger sur vos perspectives de développement dans les territoires ultramarins et de voir comment créer des synergies bénéfiques.\n\nAuriez-vous 10 minutes pour un échange téléphonique cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "NoireÔNaturel (Cosmétique Bio Afro-Caribéenne)",
        "email": "service-client@noireonaturel.com",
        "territory": "France & Caraïbes",
        "subject": "Visibilité digitale et dynamisation de vos ventes directes / NoireÔNaturel",
        "body": "Bonjour,\n\nNoireÔNaturel est une marque pionnière de la bio-cosmétique afro-caribéenne, défendant avec rigueur une formulation certifiée bio et une valorisation des ingrédients de nos terroirs.\n\nPour une marque indépendante engagée, la rentabilité repose sur la force du canal direct pour contrer le coût de référencement en boutique physique et préserver l'indépendance de la marque. Nous aidons les entreprises de cosmétique à amplifier leurs ventes directes par des contenus vidéo éducatifs et immersifs.\n\nVous aurez par ailleurs accès à notre réseau d'affaires (Caraïbes, Afrique, Océan Indien, diaspora) et à notre application mobile DTC Pulse.\n\nQuel est votre chantier prioritaire du moment pour stimuler vos ventes sur votre boutique en ligne ?\n\nSeriez-vous ouverte à un court appel téléphonique de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Robert Wan (Papeete, Polynésie française)",
        "email": "info@robertwan.com",
        "territory": "Polynésie française (Tahiti)",
        "subject": "Joaillerie d'art, perle de Tahiti et synergies d'affaires / Robert Wan",
        "body": "Bonjour,\n\nLa maison Robert Wan est l'incarnation mondiale de la Perle de Tahiti, ayant su élever ce trésor marin au sommet de la haute joaillerie internationale depuis la Polynésie française.\n\nPour une maison de votre stature, préserver l'exclusivité tout en engageant les nouvelles générations d'amateurs de luxe via des formats numériques immersifs est un défi constant. Chez Domtom Connect, nous accompagnons les fleurons de nos territoires pour valoriser leur histoire et leurs savoir-faire avec modernité.\n\nNous rassemblons un réseau d'affaires de dirigeants et porteurs de projets couvrant nos différents bassins océaniques et la diaspora, adossé à notre application mobile DTC Pulse.\n\nNous serions honorés de faire un point sur vos perspectives actuelles de communication et d'explorer ensemble d'éventuelles synergies.\n\nPourrions-nous caler 10 minutes d'échange téléphonique cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Création Or Guyane (Cayenne, Guyane)",
        "email": "contact@creationorguyane.com",
        "territory": "Guyane (Cayenne)",
        "subject": "Bijouterie d'art guyanaise et nouveaux circuits de vente / Création Or Guyane",
        "body": "Bonjour,\n\nCréation Or Guyane perpétue avec talent l'art de la bijouterie traditionnelle guyanaise à Cayenne, en sublimant les pépites d'or et l'artisanat local.\n\nPour un créateur en joaillerie en Guyane, valoriser la pièce unique et sécuriser la vente directe auprès d'une clientèle dispersée (diaspora, collectionneurs en métropole) demande des canaux de confiance et une présentation visuelle soignée. Domtom Connect aide les professionnels à lever ces freins grâce à des solutions concrètes de mise en valeur digitale et de captation client.\n\nVous rejoindrez également notre réseau professionnel (Guyane, Caraïbes, Afrique, Océan Indien, diaspora) et découvrirez notre application mobile DTC Pulse.\n\nQuelle est votre priorité du moment pour développer vos ventes hors de Cayenne ?\n\nAuriez-vous 10 minutes disponibles cette semaine pour un échange téléphonique ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    }
]

print("=======================================================")
print(f"ENVOI BATCH 40 : {len(LEADS)} MARQUES DE MODE, CRÉATEURS & JOAILLERIE D'ART")
print("APPROCHE : 100% Business / Vente Directe & Synergies Commerciales")
print("=======================================================")

# Chargement de la base existante
try:
    with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
        db_data = json.load(f)
    existing_contacts = {c["email"].lower() for c in db_data.get("contacts", []) if isinstance(c, dict) and "email" in c}
except Exception as e:
    print(f"Erreur chargement base: {e}")
    sys.exit(1)

# Vérification pré-vol doublons
for lead in LEADS:
    if lead["email"].lower() in existing_contacts:
        print(f"ERREUR : {lead['email']} est déjà dans la base !")
        sys.exit(1)

print("Pre-vol OK — 0 doublon. Lancement envoi...\n")

context = ssl.create_default_context()
sent_count = 0
errors_count = 0

with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    print("Connexion SMTP SSL OK.\n")

    for i, lead in enumerate(LEADS, 1):
        try:
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = lead["email"]
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="gmail.com")

            print(f"[{i}/{len(LEADS)}] {lead['company']} -> {lead['email']}")
            server.sendmail(SENDER_EMAIL, [lead["email"]], msg.as_string())
            print(f"  ==> ENVOYÉ : {lead['email']}")

            # Ajout à la base
            new_entry = {
                "company": lead["company"],
                "email": lead["email"],
                "territory": lead.get("territory", ""),
                "date_contacted": time.strftime("%Y-%m-%d %H:%M:%S"),
                "source": "Recherche web ciblée + vérification MX (Batch 40 — Mode, Créateurs & Joaillerie / B2B)",
                "statut": "envoyé"
            }
            db_data["contacts"].append(new_entry)
            existing_contacts.add(lead["email"].lower())
            sent_count += 1

            # Sauvegarde progressive
            with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(db_data, f, ensure_ascii=False, indent=2)

            pause = random.uniform(13.0, 17.5)
            print(f"  Pause: {pause:.1f}s...")
            time.sleep(pause)

        except Exception as e:
            print(f"  ERREUR sur {lead['email']} : {e}")
            errors_count += 1

print("\n=======================================================")
print(f"BILAN BATCH 40 : {sent_count} ENVOYÉS, {errors_count} ERREURS")
print(f"TOTAL BASE : {len(db_data['contacts'])}")
print("=======================================================")
