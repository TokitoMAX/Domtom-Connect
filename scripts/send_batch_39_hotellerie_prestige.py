import smtplib, ssl, json, time, random, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# Batch 39 : HÔTELLERIE DE CHARME & DOMAINES D'EXCEPTION (12 LEADS)
# Approche 100% Business & Solutions / Chiffrage / Réseau & DTC Pulse
LEADS = [
    {
        "company": "La Suite Villa (Trois-Îlets, Martinique)",
        "email": "reservation@la-suite-villa.com",
        "territory": "Martinique (Trois-Îlets)",
        "subject": "Optimisation de vos réservations directes & acquisition client / La Suite Villa",
        "body": "Bonjour,\n\nLa Suite Villa s'est imposée comme une adresse d'exception aux Trois-Îlets, avec une identité forte entre vue panoramique et gastronomie soignée.\n\nPour un établissement de votre standing, l'un des enjeux majeurs de rentabilité reste la dépendance aux commissions des plateformes (Booking, Expedia). Chez Domtom Connect, nous accompagnons les entreprises pour lever ces freins grâce à des solutions ciblées d'acquisition directe et de production de contenus vidéo percutants.\n\nEn parallèle, nous animons un réseau d'affaires réunissant entreprises et porteurs de projets (Caraïbes, Océan Indien, Afrique et diaspora), avec un accès privilégié à notre application mobile DTC Pulse.\n\nQuel est votre principal objectif actuel pour augmenter la part de vos réservations en direct ?\n\nSeriez-vous disponible pour un échange téléphonique de 10 minutes cette semaine afin d'évaluer comment nous pouvons vous accompagner ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Apolline Martinique (Fort-de-France, Martinique)",
        "email": "contact@apollinemartinique.com",
        "territory": "Martinique (Fort-de-France)",
        "subject": "Canaux d'acquisition et visibilité ciblée / Apolline",
        "body": "Bonjour,\n\nApolline offre une expérience d'hébergement rare sur les hauteurs de Fort-de-France, en sublimant le patrimoine architectural créole avec des prestations haut de gamme.\n\nCapter une clientèle exigeante en direct sans subir les coûts d'intermédiation demande une stratégie d'acquisition affûtée. Nous intervenons auprès des établissements d'excellence pour résoudre ces problématiques de commercialisation et booster leur attractivité par des formats vidéo modernes.\n\nNous intégrons également nos clients au sein de notre réseau d'entrepreneurs et de porteurs de projets (Caraïbes, Afrique, Océan Indien, diaspora), tout en leur ouvrant l'accès à notre application mobile DTC Pulse.\n\nQuelle est votre priorité du moment pour développer votre clientèle directe ?\n\nAuriez-vous 10 minutes cette semaine pour un échange téléphonique afin de faire le point ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Domaine de Robinson (Anse Noire, Martinique)",
        "email": "contact@domainederobinson.com",
        "territory": "Martinique (Anse Noire)",
        "subject": "Réservations directes et valorisation de votre offre insolite / Domaine de Robinson",
        "body": "Bonjour,\n\nLe Domaine de Robinson propose une expérience insolite unique en Martinique avec ses hébergements en bordure de l'Anse Noire.\n\nCommercialiser un concept atypique nécessite de convertir les curieux en réservations fermes en direct, sans laisser de marges excessives aux distributeurs tiers. C'est précisément le type de problématique que nous résolvons en créant des passerelles de vente directe et des contenus immersifs taillés pour le digital.\n\nVous aurez également l'opportunité de rejoindre notre réseau d'affaires (Caraïbes, Afrique, Océan Indien, diaspora) et de tester en avant-première notre application mobile DTC Pulse.\n\nSur quel volet de votre commercialisation souhaitez-vous accélérer en ce moment ?\n\nSeriez-vous ouvert à un appel rapide de 10 minutes cette semaine pour en discuter ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Tendacayou Écolodge & Spa (Deshaies, Guadeloupe)",
        "email": "reservation@tendacayou.com",
        "territory": "Guadeloupe (Deshaies)",
        "subject": "Autonomie commerciale et conversion directe / Tendacayou",
        "body": "Bonjour,\n\nTendacayou est une référence incontournable de l'écotourisme en Guadeloupe, niché au cœur de la canopée de Deshaies.\n\nPour une structure indépendante, l'enjeu central est de maximiser la réservation directe pour préserver ses marges, valoriser les services annexes (spa, table) et lisser la fréquentation hors saison. Domtom Connect accompagne les entreprises pour surmonter ces contraintes avec des outils de captation et de vente directe adaptés.\n\nRejoindre nos partenaires, c'est aussi accéder à notre réseau d'entreprises et de porteurs de projets couvrant les Caraïbes, l'Afrique, l'Océan Indien et la diaspora, ainsi qu'à notre application mobile DTC Pulse.\n\nQuel est votre défi principal en ce moment pour dynamiser vos ventes directes ?\n\nAuriez-vous 10 minutes cette semaine pour un court échange téléphonique ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Diana Dea Lodge & Spa (Sainte-Anne, La Réunion)",
        "email": "reception@diana-dea-lodge.re",
        "territory": "La Réunion (Sainte-Anne)",
        "subject": "Stratégie d'acquisition directe & visibilité / Diana Dea Lodge",
        "body": "Bonjour,\n\nLe Diana Dea Lodge propose une expérience hôtelière haut de gamme remarquable à La Réunion, alliant cadre naturel exceptionnel et prestations de standing.\n\nMaintenir un remplissage direct régulier et valoriser l'ensemble de vos offres (hébergement, spa, restauration) exige des canaux digitaux performants qui limitent la dépendance aux OTA. Domtom Connect conçoit des solutions concrètes pour répondre à ces défis de commercialisation et développer vos flux directs.\n\nNous connectons par ailleurs nos interlocuteurs à un réseau d'affaires étendu (Océan Indien, Caraïbes, Afrique, diaspora) et mettons à leur disposition notre application DTC Pulse.\n\nQuels sont vos objectifs prioritaires pour renforcer votre canal direct cette saison ?\n\nSeriez-vous disponible pour un échange téléphonique de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Tsilaosa Hôtel & Spa (Cilaos, La Réunion)",
        "email": "reception@tsilaosa.com",
        "territory": "La Réunion (Cilaos)",
        "subject": "Commercialisation directe et captation de clientèle / Tsilaosa",
        "body": "Bonjour,\n\nAu cœur du cirque de Cilaos, Le Tsilaosa offre un confort et un accueil de qualité très appréciés des visiteurs de l'île.\n\nDans les cirques, l'accessibilité et la saisonnalité imposent de sécuriser ses réservations en amont et en direct. Nous aidons les professionnels du secteur à lever ces freins grâce à des stratégies de visibilité ciblées et des leviers d'acquisition directe sans commissions tierces.\n\nVous pourrez également intégrer notre réseau professionnel regroupant entreprises et porteurs de projets (Océan Indien, Caraïbes, Afrique, diaspora) et découvrir notre application mobile DTC Pulse.\n\nQuel est votre axe de développement prioritaire pour optimiser votre remplissage direct ?\n\nPourrions-nous caler 10 minutes d'échange téléphonique cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Grand Hôtel Montabo (Cayenne, Guyane)",
        "email": "resa@grandhotelmontabo.fr",
        "territory": "Guyane (Cayenne)",
        "subject": "Développement de clientèle directe et partenariats B2B / Grand Hôtel Montabo",
        "body": "Bonjour,\n\nLe Grand Hôtel Montabo est un établissement de référence à Cayenne pour les séjours professionnels et touristiques face à l'océan.\n\nSur le marché guyanais, fidéliser les flux d'affaires tout en développant une clientèle directe rentable nécessite des outils de prospection et de mise en valeur modernes. Chez Domtom Connect, nous accompagnons les entreprises pour résoudre ces enjeux de croissance et de distribution.\n\nNotre écosystème vous ouvre également l'accès à un réseau d'affaires ciblé (Guyane, Caraïbes, Afrique, Océan Indien, diaspora) ainsi qu'à notre application mobile DTC Pulse.\n\nQuels sont vos principaux chantiers commerciaux en cours pour consolider vos réservations ?\n\nSeriez-vous disponible pour un court appel de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Hôtel Ker Alberte (Cayenne, Guyane)",
        "email": "contact@hotelkeralberte.com",
        "territory": "Guyane (Cayenne)",
        "subject": "Acquisition client et rentabilité directe / Hôtel Ker Alberte",
        "body": "Bonjour,\n\nL'Hôtel Ker Alberte met magnifiquement en valeur le patrimoine architectural créole à Cayenne avec un positionnement haut de gamme et intimiste.\n\nPour une maison de charme, le défi est de générer un volume suffisant de réservations directes pour préserver ses marges face aux plateformes internationales. Nous intervenons précisément pour apporter des solutions concrètes de captation client et de visibilité digitale.\n\nNos clients bénéficient également de connexions au sein de notre réseau d'entrepreneurs (Guyane, Caraïbes, Afrique, diaspora) et d'un accès à notre solution DTC Pulse.\n\nQuel est votre principal besoin actuel pour développer vos canaux de vente directe ?\n\nAuriez-vous 10 minutes pour un échange téléphonique cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Le Karibuni Boutique Hotel (Cul-de-Sac, Saint-Martin)",
        "email": "hotel@lekaribuni.com",
        "territory": "Saint-Martin (Cul-de-Sac)",
        "subject": "Optimisation de votre distribution directe / Le Karibuni",
        "body": "Bonjour,\n\nFace à l'îlet Pinel, Le Karibuni propose une offre de séjour exclusive et intimiste réputée à Saint-Martin.\n\nDans un environnement caribéen hautement concurrentiel, réduire l'emprise des OTA et capter une clientèle internationale en direct est essentiel pour protéger sa rentabilité. Domtom Connect aide les établissements à structurer des canaux d'acquisition directe efficaces et des contenus à fort impact.\n\nVous aurez par ailleurs la possibilité d'intégrer notre réseau d'affaires (Caraïbes, Afrique, Océan Indien, diaspora) et de tester notre application mobile DTC Pulse.\n\nQuelle est votre priorité pour développer vos réservations sans intermédiaire cette année ?\n\nSeriez-vous partant pour un court échange de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Hôtel L'Esplanade (Grand Case, Saint-Martin)",
        "email": "info@lesplanade.com",
        "territory": "Saint-Martin (Grand Case)",
        "subject": "Maîtrise des coûts d'acquisition et réservations directes / L'Esplanade",
        "body": "Bonjour,\n\nL'Esplanade bénéficie d'une excellente réputation sur les hauteurs de Grand Case auprès d'une clientèle haut de gamme fidèle.\n\nMême pour un établissement très bien positionné, la maîtrise des coûts d'acquisition client et la stimulation des réservations en direct restent des enjeux stratégiques permanents. Chez Domtom Connect, nous apportons des solutions précises pour booster ces flux directs et valoriser vos atouts en vidéo.\n\nNous vous ouvrons également les portes de notre réseau d'entreprises et de porteurs de projets (Caraïbes, Afrique, Océan Indien, diaspora), avec un accès à notre application mobile DTC Pulse.\n\nQuel est votre axe de développement prioritaire pour votre commercialisation cette saison ?\n\nPourrions-nous caler 10 minutes d'échange téléphonique cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Le Petit Hotel (Grand Case, Saint-Martin)",
        "email": "info@lepetithotel.com",
        "territory": "Saint-Martin (Grand Case)",
        "subject": "Sécurisation de vos ventes directes / Le Petit Hotel",
        "body": "Bonjour,\n\nLe Petit Hotel propose une expérience de premier plan à Grand Case, les pieds dans l'eau avec un accueil personnalisé.\n\nPour une unité hôtelière exclusive, chaque réservation directe compte pour préserver la rentabilité face aux commissions des plateformes. Domtom Connect accompagne les professionnels du secteur pour optimiser leur canal direct et capter une clientèle ciblée.\n\nEn collaborant avec nous, vous rejoignez un réseau d'affaires actif (Caraïbes, Océan Indien, Afrique, diaspora) et accédez à notre application mobile DTC Pulse.\n\nQuel est votre principal défi du moment pour optimiser vos canaux de vente ?\n\nSeriez-vous disponible pour un court appel de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Hôtel Christopher St Barth (Pointe Milou, Saint-Barthélemy)",
        "email": "reservations@hotelchristopher.com",
        "territory": "Saint-Barthélemy (Pointe Milou)",
        "subject": "Acquisition directe et synergies d'affaires / Le Christopher",
        "body": "Bonjour,\n\nLe Christopher s'illustre à Saint-Barthélemy par l'élégance de son positionnement à Pointe Milou et son engagement environnemental reconnu.\n\nSur un marché ultra-luxe, maintenir un lien direct et continu avec une clientèle internationale exigeante nécessite des supports de communication immersifs et des leviers d'acquisition sur mesure. Domtom Connect accompagne les entreprises pour répondre à ces exigences commerciales.\n\nNous connectons également les décideurs à un réseau d'affaires étendu (Caraïbes, Afrique, Océan Indien, diaspora) et leur proposons un accès exclusif à notre application mobile DTC Pulse.\n\nQuels sont vos axes de réflexion actuels pour valoriser vos offres et optimiser vos réservations directes ?\n\nAuriez-vous 10 minutes pour un échange téléphonique cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    }
]

print("=======================================================")
print(f"ENVOI BATCH 39 : {len(LEADS)} ÉTABLISSEMENTS HÔTELIERS DE PRESTIGE")
print("APPROCHE : 100% Business / Problématiques de Commercialisation Directe")
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
                "source": "Recherche web ciblée + vérification MX (Batch 39 — Hôtellerie de Prestige / B2B Solutions)",
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
print(f"BILAN BATCH 39 : {sent_count} ENVOYÉS, {errors_count} ERREURS")
print(f"TOTAL BASE : {len(db_data['contacts'])}")
print("=======================================================")
