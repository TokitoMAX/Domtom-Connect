import smtplib, ssl, json, time, random, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# Batch 38 : NOUVELLE APPROCHE COPYWRITING CENTRÉE SUR LE CLIENT & SES PROBLÉMATIQUES
# 12 pépites du terroir, spiritueux, artisanat et patrimoine DOM-TOM
LEADS = [
    {
        "company": "Escale Bleue (Atelier de la Vanille Bleue — La Réunion)",
        "email": "contact@escale-bleue.fr",
        "territory": "La Réunion (Saint-Philippe)",
        "subject": "Valorisation de la Vanille Bleue et circuits directs : vos enjeux du moment / Escale Bleue",
        "body": "Bonjour,\n\nEscale Bleue a su transformer la vanille de La Réunion en un joyau gastronomique mondial grâce au procédé unique de la Vanille Bleue, récompensé pour sa qualité d'exception.\n\nQuand on développe une production artisanale aussi pointue depuis l'océan Indien, on se heurte souvent à des défis bien spécifiques : valoriser son histoire auprès d'une clientèle exigeante sans intermédiaire, dépasser les coûts logistiques vers l'extérieur et toucher directement les passionnés de gastronomie authentique.\n\nC'est précisément autour de ces problématiques concrètes que nous développons Domtom Connect et l'écosystème WIDI disciples. Notre démarche n'est pas de vous proposer un catalogue de services standardisés, mais de bâtir une alliance d'entrepreneurs ultramarins qui se serrent les coudes : mutualiser des solutions face aux freins d'insularité, vous ouvrir des canaux de visibilité directe et créer du business ensemble.\n\nQuelle est votre priorité ou votre plus gros défi de développement en ce moment ?\n\nSeriez-vous ouvert à un échange informel de 10 minutes cette semaine pour faire connaissance et voir comment notre réseau peut vous être directement utile ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Distillerie Damoiseau (Guadeloupe)",
        "email": "rhum@damoiseau.com",
        "territory": "Guadeloupe (Le Moule)",
        "subject": "Rayonnement du rhum agricole et synergies entre entrepreneurs d'Outre-Mer / Damoiseau",
        "body": "Bonjour,\n\nLa Distillerie Damoiseau fait la fierté de la Guadeloupe et incarne un savoir-faire sucrier et rhumié incontournable, présent sur toutes les tables antillaises comme sur la scène internationale.\n\nPour une maison de votre envergure ancrée en Grande-Terre, les enjeux actuels restent majeurs : préserver un lien fort et direct avec la nouvelle génération de consommateurs, dynamiser la vente directe et le spiritourisme, tout en défendant la valeur du terroir face aux fluctuations du fret et des marchés mondiaux.\n\nAvec Domtom Connect et l'écosystème WIDI disciples, nous avons pour mission de fédérer les forces vives économiques des DOM-TOM. L'idée est de créer un véritable réseau d'affaires et de solidarité entre dirigeants : partager des leviers concrets, briser les barrières logistiques et offrir une vitrine digitale puissante et moderne à nos fleurons ultramarins.\n\nNous serions ravis d'échanger sur les défis actuels qui mobilisent vos équipes et de voir comment faire des synergies utiles ensemble.\n\nAuriez-vous 10 minutes pour un court appel de prise de contact cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Distillerie Poisson / Rhum Père Labat (Marie-Galante)",
        "email": "contact@rhumduperelabat.com",
        "territory": "Guadeloupe (Marie-Galante)",
        "subject": "L'authenticité de Marie-Galante et le défi de la visibilité directe / Rhum Père Labat",
        "body": "Bonjour,\n\nLe Rhum Père Labat est une véritable légende vivante de Marie-Galante. Votre méthode traditionnelle de distillation en colonne de cuivre donne à vos rhums une intensité aromatique unique que les connaisseurs s'arrachent.\n\nPourtant, produire sur la « Grande Galette » implique une double insularité et des contraintes logistiques et de distribution que les acteurs extérieurs sous-estiment totalement. Faire rayonner votre marque, fidéliser des amateurs sans passer par une chaîne d'intermédiaires qui rogne les marges, et se faire connaître des voyageurs en amont de leur séjour sont des défis quotidiens.\n\nNous avons conçu Domtom Connect et l'écosystème WIDI disciples pour répondre exactement à ces freins : regrouper des entrepreneurs ultramarins pour créer de l'entraide d'affaires concrète, mutualiser des relais de diffusion et valoriser l'histoire humaine de vos cuvées directement auprès d'une audience engagée.\n\nQuels sont vos plus gros freins actuels sur la commercialisation ou le développement ?\n\nSeriez-vous partant pour échanger 10 minutes au téléphone cette semaine pour explorer comment notre réseau peut vous épauler ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Distillerie Longueteau (Guadeloupe)",
        "email": "contact@rhumlongueteau.fr",
        "territory": "Guadeloupe (Capesterre-Belle-Eau)",
        "subject": "Parcellaire d'exception et nouveaux canaux de connexion directe / Domaine Longueteau",
        "body": "Bonjour,\n\nLe Domaine de Marquisat de Sainte-Marie et la famille Longueteau réalisent un travail admirable avec leurs cuvées parcellaires et leur maîtrise totale de la canne jusqu'à la bouteille, faisant de votre domaine un modèle d'exigence en Guadeloupe.\n\nPour un producteur indépendant de haute volée, les défis du moment touchent souvent à l'autonomie commerciale : s'émanciper des circuits de distribution classiques, raconter la singularité de chaque parcelle en vidéo immersive pour toucher les passionnés, et développer une clientèle fidèle prête à commander en direct malgré les contraintes du fret maritime.\n\nC'est pour résoudre ces défis que nous avons lancé Domtom Connect et la communauté WIDI disciples. Notre vocation est de rassembler les entrepreneurs péi afin de faire du business ensemble, d'apporter des réponses collectives aux difficultés de distribution et de donner une visibilité nouvelle aux marques qui incarnent l'excellence ultramarine.\n\nJ'aimerais beaucoup comprendre quelles sont vos priorités stratégiques du moment et voir comment nous pourrions collaborer utilement.\n\nSeriez-vous disponible pour un court échange de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Rhum Saint James (Martinique)",
        "email": "saintjames.international@la-martiniquaise.fr",
        "territory": "Martinique (Sainte-Marie)",
        "subject": "Patrimoine agricole martiniquais et synergies d'affaires ultramarines / Saint James",
        "body": "Bonjour,\n\nDepuis 1765 à Sainte-Marie, Saint James porte haut les couleurs du rhum agricole AOC Martinique, alliant tradition séculaire, musée du rhum et engagement fort en faveur du développement durable.\n\nFace aux évolutions rapides du marché des spiritueux, les enjeux clés résident dans la capacité à engager les nouvelles générations de consommateurs, à sublimer l'expérience touristique sur place et à renforcer l'attachement direct aux valeurs du terroir martiniquais.\n\nÀ travers Domtom Connect et l'écosystème WIDI disciples, nous développons un réseau collaboratif réunissant acteurs économiques, producteurs et créateurs de projets des Outre-Mer. Notre objectif est de faire converger nos énergies pour lever les freins du développement insulaire, créer des opportunités de partenariats transversaux et valoriser nos marques emblématiques par des formats interactifs modernes.\n\nNous serions très heureux d'écouter les perspectives actuelles de votre maison et de réfléchir ensemble à des synergies bénéfiques.\n\nPourrions-nous caler un bref appel de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Habitation Clément (Martinique)",
        "email": "communication.clement@gbh.fr",
        "territory": "Martinique (Le François)",
        "subject": "Culture, patrimoine et connexion directe avec la communauté / Habitation Clément",
        "body": "Bonjour,\n\nL'Habitation Clément réussit le tour de force d'unir l'excellence du rhum agricole martiniquais, un parc botanique d'exception et la Fondation Clément dédiée à la création artistique caribéenne, constituant un phare culturel majeur pour l'île.\n\nMaintenir une fréquentation de qualité, valoriser la programmation culturelle tout au long de l'année et nourrir un lien vivant avec la diaspora et les visiteurs au-delà de leur séjour sont des défis continus pour un site patrimonial d'une telle envergure.\n\nC'est dans cette optique que nous avons créé Domtom Connect et la dynamique WIDI disciples. Nous bâtissons un réseau d'entrepreneurs et d'institutions des DOM-TOM pour mutualiser les audiences, partager des retours d'expérience sur l'animation de communauté et offrir des canaux digitaux immersifs pour prolonger l'impact de vos initiatives patrimoniales.\n\nQuels sont vos chantiers prioritaires en matière de communication ou de valorisation cette année ?\n\nSeriez-vous disponible pour un court échange de 10 minutes cette semaine afin d'explorer de possibles collaborations ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Plantation Trois Rivières (Martinique)",
        "email": "contact.mq@groupebbs.fr",
        "territory": "Martinique (Sainte-Luce)",
        "subject": "Valorisation de l'identité du Sud et développement de circuits directs / Trois Rivières",
        "body": "Bonjour,\n\nAvec son moulin emblématique à Sainte-Luce et des rhums d'une finesse minérale reconnue, Trois Rivières est l'un des plus beaux étendards du savoir-faire martiniquais.\n\nDans un secteur hautement concurrentiel, les problématiques récurrentes tournent autour de la singularisation de l'offre, de l'augmentation des ventes directes en boutique et sur le web, et de la création d'une communauté engagée qui soutient la marque dans la durée, bien au-delà de la haute saison touristique.\n\nAvec Domtom Connect et l'écosystème WIDI disciples, nous voulons justement casser les cloisons entre entrepreneurs ultramarins. Notre réseau est né pour s'épauler concrètement : trouver ensemble des réponses aux défis de transport, de notoriété et de commercialisation directe, et bâtir des projets d'affaires conjoints.\n\nNous aimerions beaucoup en savoir plus sur vos enjeux du moment et voir comment nous pourrions vous apporter des relais d'exposition concrets.\n\nSeriez-vous ouvert à un appel de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "M'Amour Confitures (Guy Lesueur — Guadeloupe)",
        "email": "guylesueur@guylesueur.com",
        "territory": "Guadeloupe (Pointe-Noire)",
        "subject": "Transformation des fruits locaux et conquête de nouveaux débouchés / Confitures M'Amour",
        "body": "Bonjour,\n\nDepuis des décennies à Pointe-Noire, les confitures M'Amour des Établissements Guy Lesueur enchantent les familles antillaises et font vivre les filières fruitières de Guadeloupe avec une passion intacte.\n\nTransformer des matières premières locales en milieu insulaire pose des questions cruciales : sécuriser les approvisionnements face aux aléas climatiques, supporter les surcoûts d'emballage et de transport, et trouver des débouchés à forte valeur ajoutée sans dépendre exclusivement des centrales d'achat de la grande distribution.\n\nC'est précisément la raison d'être de Domtom Connect et de la communauté WIDI disciples : fédérer les producteurs et créateurs d'Outre-Mer pour faire bloc, partager des solutions d'acheminement et de vente directe, et créer un écosystème d'affaires où les entreprises locales s'entraident mutuellement.\n\nQuelle est votre plus grande préoccupation actuelle sur la distribution ou la valorisation de vos produits ?\n\nPourrions-nous échanger 10 minutes au téléphone cette semaine pour faire le point et voir comment avancer ensemble ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Brasserie Lékouz (Guadeloupe)",
        "email": "brasserie@lekouz.com",
        "territory": "Guadeloupe (Goyave)",
        "subject": "Brassage artisanal péi et expansion des débouchés locaux / Brasserie Lékouz",
        "body": "Bonjour,\n\nLékouz a insufflé une vraie vague d'air frais dans le paysage brassicole guadeloupéen à Goyave, avec des bières artisanales de caractère qui valorisent les saveurs péi et créent un lieu de vie très convivial.\n\nLe quotidien d'un brasseur indépendant aux Antilles n'est pas simple : affronter la concurrence des marques industrielles importées soutenues par des budgets colossaux, fidéliser les débits de boissons et le réseau CHR, et gérer l'approvisionnement en matières premières soumises aux coûts de fret.\n\nNous construisons Domtom Connect et l'application WIDI disciples pour que les entrepreneurs courageux de nos îles ne soient plus isolés face à ces défis. Nous rassemblons des chefs d'entreprise locaux pour faire du business ensemble, créer des événements et des synergies commerciales, et donner à vos créations la visibilité directe qu'elles méritent.\n\nQuelles sont vos priorités du moment pour élargir votre distribution ou consolider votre trésorerie ?\n\nSeriez-vous disponible pour un court échange de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Distillerie Bellevue (Marie-Galante)",
        "email": "contact@habitation-bellevue.com",
        "territory": "Guadeloupe (Marie-Galante)",
        "subject": "Énergie solaire, terroir de Marie-Galante et valorisation directe / Distillerie Bellevue",
        "body": "Bonjour,\n\nLa Distillerie Bellevue à Grand-Bourg allie avec brio tradition rhumière et modernité écologique, en devenant le premier domaine éco-positif des Caraïbes tout en produisant l'un des rhums les plus titrés de Marie-Galante.\n\nMalgré cette excellence, les réalités de l'insularité restent rudes : acheminer les produits vers la Guadeloupe continentale et l'Hexagone avec des coûts de fret croissants, attirer les visiteurs sur le domaine en dehors des pics de saison et maintenir une rentabilité forte sur la vente directe.\n\nC'est pour aborder frontalement ces problématiques que nous avons créé le réseau Domtom Connect et l'écosystème WIDI disciples. Notre but est de réunir des entrepreneurs de terrain pour s'entraider, imaginer des solutions logistiques partagées et offrir de nouveaux canaux de vente et de recommandation mutuelle.\n\nQuel est votre principal frein ou objectif sur lequel vous aimeriez trouver des partenaires fiables ?\n\nSeriez-vous ouvert pour en discuter 10 minutes au téléphone cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "L'Effet Péi (La Réunion)",
        "email": "eshop@leffet-boutik.re",
        "territory": "La Réunion (Le Port / Saint-Paul)",
        "subject": "Marque identitaire péi et nouveaux relais d'expansion communautaire / L'Effet Péi",
        "body": "Bonjour,\n\nL'Effet Péi a réussi l'exploit de devenir un véritable symbole identitaire à La Réunion, porté par une créativité graphique unique et une fidélité exemplaire des Réunionnais.\n\nCependant, pour une marque de textile et d'accessoires insulaire, le contexte économique actuel impose de nouveaux défis : hausse des coûts de fabrication et d'import des matières premières, pression sur le pouvoir d'achat local et complexité pour livrer la diaspora métropolitaine sans que les frais de port ne découragent l'acheteur.\n\nAvec Domtom Connect et la dynamique WIDI disciples, nous mettons en place un réseau d'affaires dédié aux entrepreneurs ultramarins pour explorer des leviers concrets : mutualisation de visibilité, partenariats de co-branding avec d'autres acteurs péi et valorisation vidéo directe pour booster les ventes en ligne.\n\nNous aimerions comprendre les axes sur lesquels vous cherchez à innover cette année et voir comment notre réseau peut vous ouvrir des opportunités concrètes.\n\nSeriez-vous partant pour un rapide échange téléphonique de 10 minutes cette semaine ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    },
    {
        "company": "Jardin de Balata (Martinique)",
        "email": "contact@jardindebalata.fr",
        "territory": "Martinique (Fort-de-France)",
        "subject": "Écotourisme, préservation botanique et flux de visiteurs directs / Jardin de Balata",
        "body": "Bonjour,\n\nLe Jardin de Balata est un véritable chef-d'œuvre vivant de la Martinique, offrant une immersion végétale féerique qui émerveille des générations de visiteurs et valorise la biodiversité caribéenne.\n\nPour un site touristique naturel de cette renommée, les enjeux du moment touchent à l'indépendance commerciale : capter directement les voyageurs avant leur départ pour ne pas dépendre des commissions des voyagistes, réguler les flux pour protéger le site, et entretenir l'attachement des résidents locaux en basse saison.\n\nC'est exactement pour ces défis que nous développons Domtom Connect et l'écosystème WIDI disciples. Nous réunissons les acteurs du tourisme et du patrimoine des DOM-TOM pour partager des stratégies concrètes de fidélisation, briser l'isolement face aux aléas touristiques et faire du business ensemble dans un esprit solidaire.\n\nQuelles sont vos priorités actuelles pour dynamiser les visites ou renouveler vos canaux de réservation ?\n\nSeriez-vous disponible pour un échange informel de 10 minutes cette semaine afin de faire connaissance ?\n\nBien cordialement,\n\nLoïc Villeronce\nFondateur — Domtom Connect"
    }
]

print("=======================================================")
print(f"ENVOI BATCH 38 : {len(LEADS)} PROSPECTS TERROIR, SPIRITUEUX & ARTISANAT")
print("APPROCHE : 100% Client-Centric / Problématiques Métier / Gagnant-Gagnant")
print("=======================================================")

# Chargement de la base existante
try:
    with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
        db_data = json.load(f)
    existing_contacts = {c["email"].lower() for c in db_data.get("contacts", []) if isinstance(c, dict) and "email" in c}
except Exception as e:
    print(f"Erreur chargement base: {e}")
    sys.exit(1)

# Vérification pré-vol
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
                "source": "Recherche web ciblée + vérification MX (Batch 38 — Approche Client-Centric / Problématiques)",
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
print(f"BILAN BATCH 38 : {sent_count} ENVOYÉS, {errors_count} ERREURS")
print(f"TOTAL BASE : {len(db_data['contacts'])}")
print("=======================================================")
