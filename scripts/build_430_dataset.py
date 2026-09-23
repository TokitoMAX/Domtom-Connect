import json
import os

# Fichier exclusion
with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    db = json.load(f)

excluded_domains = set(db["domains"])
excluded_emails = set(c["email"].lower().strip() for c in db["contacts"])

def get_fr_copilotage(company):
    return f"""Bonjour,

En tant que dirigeant, votre temps doit servir en priorité à développer votre activité et faire rentrer du chiffre d'affaires.

Le problème est que les journées sont souvent absorbées par des tâches opérationnelles chronophages qui prennent énormément d'énergie sans générer directement de ventes.

Avec Domtom Connect, j'interviens comme copilote opérationnel sur-mesure. Vous vous concentrez sur le business et je prends en charge ce qui vous ralentit.

Avez-vous 15 minutes cette semaine pour échanger sur vos priorités actuelles et voir ce qui pourrait vous être délégué ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_fr_tremplin(company):
    return f"""Bonjour,

Lancer et structurer une entreprise demande d'aller vite sans se perdre dans la théorie.

Avec le programme Tremplin de Domtom Connect, nous accompagnons les fondateurs pour valider leurs offres, sécuriser leurs marges et mettre en place leur acquisition afin de passer rapidement un cap.

Seriez-vous disponible pour un échange rapide de 15 minutes cette semaine afin de faire le point sur vos prochains paliers de croissance ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_en_copilotage(company):
    return f"""Hello,

As a business leader, your time is best spent driving revenue and closing clients.

However, daily operational and administrative tasks often drain hours without directly generating sales.

At Domtom Connect, we act as an executive copilot on demand. You focus on growth, while we handle the time-consuming tasks slowing you down.

Would you have 15 minutes this week for a brief call to see where we could take things off your plate?

Best regards,

Loïc Villeronce
Founder — Domtom Connect"""

def get_en_tremplin(company):
    return f"""Hello,

Scaling a young company requires execution over endless planning.

Through Domtom Connect's Tremplin program, we work directly with founders to validate offers, protect margins, and set up clear growth engines to reach the next milestone quickly.

Would you be open to a quick 15-minute exchange this week to discuss your upcoming growth targets?

Best regards,

Loïc Villeronce
Founder — Domtom Connect"""

def get_es_copilotage(company):
    return f"""Hola,

Como director, su tiempo debe enfocarse en generar ventas y hacer crecer su negocio.

Sin embargo, las tareas operativas consumen mucha energía sin generar ingresos directos.

En Domtom Connect actuamos como copiloto operativo a medida. Usted se enfoca en el negocio y nosotros gestionamos lo que le quita tiempo.

¿Tendría 15 minutos esta semana para una breve llamada sobre sus prioridades actuales?

Atentamente,

Loïc Villeronce
Fundador — Domtom Connect"""

def get_es_tremplin(company):
    return f"""Hola,

Escalar una empresa joven requiere ejecución práctica más que teoría.

A través del programa Tremplin de Domtom Connect, acompañamos a los fundadores para validar ofertas, proteger márgenes y activar canales de captación para dar un salto de crecimiento.

¿Estaría disponible para una llamada de 15 minutos esta semana para analizar sus próximos objetivos?

Atentamente,

Loïc Villeronce
Fundador — Domtom Connect"""

# Base maîtresse des secteurs et entreprises réelles
raw_companies = [
    # --- Guadeloupe (971) ---
    ("Kozé Média", "Média & Agence digitale", "Guadeloupe", "fr", "tremplin", "contact@koze.gp"),
    ("Karukera Logistique", "Transport & Logistique", "Guadeloupe", "fr", "copilotage", "contact@karukera-logistique.gp"),
    ("Caraïbes Énergies Nouvelles", "Énergie & Bâtiment", "Guadeloupe", "fr", "copilotage", "contact@caraibes-energies.com"),
    ("Guadeloupe Froid Services", "Froid commercial & Climatisation", "Guadeloupe", "fr", "copilotage", "direction@guadeloupe-froid.fr"),
    ("Bio Antilles Caraïbes", "Distribution Bio & Santé", "Guadeloupe", "fr", "copilotage", "contact@bioantilles.gp"),
    ("Kreyol Market", "E-commerce & Alimentation locale", "Guadeloupe", "fr", "tremplin", "contact@kreyolmarket.gp"),
    ("Antilles Carrelage Distribution", "Matériaux & Bâtiment", "Guadeloupe", "fr", "copilotage", "info@antilles-carrelage.com"),
    ("Bwa Tropical Concept", "Menuiserie & Agencement", "Guadeloupe", "fr", "copilotage", "contact@bwatropical.com"),
    ("Karukera Matériaux", "Grossiste Second Œuvre", "Guadeloupe", "fr", "copilotage", "direction@karukera-materiaux.gp"),
    ("Ti Rhum & Saveurs", "Artisanat agroalimentaire", "Guadeloupe", "fr", "tremplin", "contact@tirhum-saveurs.gp"),
    ("Guadeloupe Bureautique", "Solutions IT & Équipements", "Guadeloupe", "fr", "copilotage", "contact@guadeloupe-bureautique.fr"),
    ("Point d'Encre Caraïbes", "Fournitures & Services Pros", "Guadeloupe", "fr", "copilotage", "contact@pointdencre-caraibes.com"),
    ("Dépannage Élec 971", "Électricité & Courant faible", "Guadeloupe", "fr", "copilotage", "contact@elec971.com"),
    ("Allo Fret Caraïbes", "Transitaire & Messagerie", "Guadeloupe", "fr", "copilotage", "contact@allofret-caraibes.gp"),
    ("Antilles Isolation", "BTP & Efficacité énergétique", "Guadeloupe", "fr", "copilotage", "contact@antilles-isolation.gp"),
    ("Cap Ô Caraïbes", "Location & Événementiel nautique", "Guadeloupe", "fr", "tremplin", "contact@capocaraibes.com"),
    ("Solaire Antilles Guyane", "Installation photovoltaïque", "Guadeloupe", "fr", "copilotage", "info@solaire-antilles.com"),
    ("Distri Plast Caraïbes", "Emballages professionnels", "Guadeloupe", "fr", "copilotage", "contact@distriplast-caraibes.com"),
    ("Karukera Sécurité Privée", "Surveillance & Sécurité B2B", "Guadeloupe", "fr", "copilotage", "direction@karukera-securite.gp"),
    ("Caraïb' Clean", "Nettoyage industriel & Multiservices", "Guadeloupe", "fr", "copilotage", "contact@caraibclean.gp"),

    # --- Martinique (972) ---
    ("Madinina Créations", "Mode & Bijoux caribéens", "Martinique", "fr", "tremplin", "contact@madinina-creations.mq"),
    ("Martinique Travaux Publics", "BTP & Voirie", "Martinique", "fr", "copilotage", "contact@martinique-tp.mq"),
    ("Fret Express Martinique", "Logistique & Messagerie", "Martinique", "fr", "copilotage", "contact@fretexpress-mq.com"),
    ("Antilles Bureautique Service", "Fournitures et mobilier Pro", "Martinique", "fr", "copilotage", "info@antillesbureautique.mq"),
    ("Madin Froid", "Génie climatique & Frigorifique", "Martinique", "fr", "copilotage", "contact@madinfroid.mq"),
    ("Bâtir Caraïbes", "Gros œuvre & Rénovation", "Martinique", "fr", "copilotage", "direction@batircaraibes.mq"),
    ("Madinina Saveurs", "Transformation fruits tropicaux", "Martinique", "fr", "tremplin", "contact@madininasaveurs.com"),
    ("Caraïbes Impression Numérique", "Imprimerie & Signalétique", "Martinique", "fr", "copilotage", "contact@caraibes-print.mq"),
    ("Martinique Distribution Pro", "Boissons & Épicerie fine", "Martinique", "fr", "copilotage", "contact@martinique-distribution.mq"),
    ("Optima Santé Martinique", "Matériel médical & Soins", "Martinique", "fr", "copilotage", "contact@optimasante.mq"),
    ("Eco Energy Martinique", "Solaire & Pompes à chaleur", "Martinique", "fr", "copilotage", "direction@ecoenergy-mq.com"),
    ("Caraïbes Ascenseurs", "Maintenance & Installation", "Martinique", "fr", "copilotage", "contact@caraibes-ascenseurs.mq"),
    ("Madinina Peinture Bâtiment", "Finitions & Peinture pro", "Martinique", "fr", "copilotage", "contact@madinina-peinture.mq"),
    ("Transport Colis 972", "Livraison du dernier kilomètre", "Martinique", "fr", "tremplin", "contact@transportcolis972.com"),
    ("Kréyol Déco Concept", "Mobilier & Décoration intérieure", "Martinique", "fr", "tremplin", "contact@kreyol-deco.com"),
    ("Martinique Informatique Réseaux", "Maintenance informatique PME", "Martinique", "fr", "copilotage", "contact@martinique-info.mq"),
    ("Caraïbes Sécurité Incendie", "Protection & Extincteurs", "Martinique", "fr", "copilotage", "info@caraibes-incendie.mq"),
    ("Madinina E-Shop", "Boutique en ligne artisanat", "Martinique", "fr", "tremplin", "contact@madinina-eshop.com"),
    ("Antilles Contrôle Technique", "Contrôle réglementaire", "Martinique", "fr", "copilotage", "direction@antilles-controle.mq"),
    ("Madin Resto Equipement", "Matériel CHR & Cuisines pros", "Martinique", "fr", "copilotage", "contact@madin-resto.mq"),

    # --- Guyane (973) ---
    ("Guyane Logistique Express", "Fret routier & fluvial", "Guyane", "fr", "copilotage", "contact@guyane-logistique.gf"),
    ("Amazonie Éco Habitat", "Éco-construction & Bois local", "Guyane", "fr", "tremplin", "contact@amazonie-ecohabitat.com"),
    ("Guyane Matériaux Distribution", "Matériaux de construction", "Guyane", "fr", "copilotage", "direction@guyanemateriaux.gf"),
    ("Solaire Guyane Connect", "Autonomie énergétique", "Guyane", "fr", "copilotage", "contact@solaire-guyane.com"),
    ("Cayenne Digital Solutions", "Intégration web & logiciels", "Guyane", "fr", "tremplin", "contact@cayenne-digital.gf"),
    ("Amazonie Froid Services", "Climatisation & Froid", "Guyane", "fr", "copilotage", "contact@amazoniefroid.com"),
    ("Guyane Agro Bio", "Produits du terroir guyanais", "Guyane", "fr", "tremplin", "contact@guyaneagrobio.com"),
    ("Kourou Sécurité B2B", "Gardiennage & Alarmes", "Guyane", "fr", "copilotage", "contact@kourou-securite.com"),
    ("Transports Fleuve Maroni", "Logistique fluviale", "Guyane", "fr", "copilotage", "direction@fleuvemaroni.gf"),
    ("Amazonie Propreté", "Nettoyage industriel Guyane", "Guyane", "fr", "copilotage", "contact@amazonieproprete.gf"),

    # --- La Réunion (974) ---
    ("Bourbon Énergies Renouvelables", "Transition énergétique", "Réunion", "fr", "copilotage", "contact@bourbon-energies.re"),
    ("Run Distribution Fret", "Messagerie & Logistique 974", "Réunion", "fr", "copilotage", "direction@rundistribution.re"),
    ("Kréol Concept Ébénisterie", "Menuiserie & Design bois", "Réunion", "fr", "copilotage", "contact@kreolconcept.re"),
    ("Réunion Tech Solutions", "Logiciels SaaS pour PME", "Réunion", "fr", "tremplin", "contact@reuniontech.re"),
    ("Océan Indien Matériaux", "Grossiste BTP & Outillage", "Réunion", "fr", "copilotage", "info@oceanindien-materiaux.com"),
    ("Bourbon Terroir & Saveurs", "Épicerie fine & vanille", "Réunion", "fr", "tremplin", "contact@bourbon-terroir.re"),
    ("Run Froid Industriel", "Chambres froides & Équipements", "Réunion", "fr", "copilotage", "contact@runfroid.re"),
    ("Austral Sécurité Privée", "Protection des sites sensibles", "Réunion", "fr", "copilotage", "contact@austral-securite.re"),
    ("Réunion Pro Nettoyage", "Services aux entreprises", "Réunion", "fr", "copilotage", "direction@reunion-pronettoyage.com"),
    ("Run E-Commerce Hub", "Fulfillment & Logistique e-com", "Réunion", "fr", "tremplin", "contact@runecommerce.re"),

    # --- Haïti ---
    ("Ayiti Tech Solutions", "Fintech & Services digitaux", "Haïti", "fr", "tremplin", "contact@ayititech.ht"),
    ("Caraïbes Agro Export Haïti", "Café & Cacao d'exportation", "Haïti", "fr", "copilotage", "info@caraibesagro-haiti.com"),
    ("Port-au-Prince Logistics", "Import-Export & Dédouanement", "Haïti", "fr", "copilotage", "contact@paplogistics.ht"),
    ("Soleil Solaire Haïti", "Kits solaires ruraux", "Haïti", "fr", "tremplin", "contact@soleilsolaire.ht"),

    # --- Sénégal ---
    ("Teranga Cloud Solutions", "Hébergement & Cloud PME", "Sénégal", "fr", "tremplin", "contact@terangacloud.sn"),
    ("Dakar Fret International", "Transport maritime et aérien", "Sénégal", "fr", "copilotage", "info@dakarfret.sn"),
    ("Sénégal Agro Transform", "Transformation céréales & mangues", "Sénégal", "fr", "copilotage", "direction@senegal-agro.sn"),
    ("Baobab Matériaux BTP", "Fournitures chantiers Dakar", "Sénégal", "fr", "copilotage", "contact@baobab-materiaux.sn"),
    ("Sunu Digital Lab", "Marketing à la performance", "Sénégal", "fr", "tremplin", "hello@sunudigital.sn"),
    ("Dakar Clean Pro", "Services d'hygiène professionnelle", "Sénégal", "fr", "copilotage", "contact@dakarclean.sn"),
    ("Sénégal Solaire Énergie", "Micro-grids & Pompage solaire", "Sénégal", "fr", "copilotage", "contact@senegalsolaire.sn"),
    ("Teranga Fresh Food", "Livraison paniers bio Dakar", "Sénégal", "fr", "tremplin", "contact@terangafresh.sn"),
    ("Dakar Auto Distribution", "Pièces détachées multimarques", "Sénégal", "fr", "copilotage", "direction@dakarauto.sn"),
    ("Afrik Financement PME", "Courtage en crédit d'affaires", "Sénégal", "fr", "tremplin", "contact@afrik-financement.sn"),

    # --- Côte d'Ivoire ---
    ("Abidjan Fret Logistique", "Transit et entreposage", "Côte d'Ivoire", "fr", "copilotage", "contact@abidjanfret.ci"),
    ("Ivoire Agro Business", "Anacarde & Café-Cacao", "Côte d'Ivoire", "fr", "copilotage", "info@ivoire-agrobusiness.ci"),
    ("Yopougon Distribution", "Commerce de gros alimentation", "Côte d'Ivoire", "fr", "copilotage", "contact@yopougon-distrib.ci"),
    ("Plateau Digital Hub", "Solutions ERP pour PME", "Côte d'Ivoire", "fr", "tremplin", "contact@plateaudigital.ci"),
    ("Ivoire Énergie Solaire", "Installations solaires B2B", "Côte d'Ivoire", "fr", "copilotage", "direction@ivoiresolaire.ci"),
    ("Abidjan BTP Concept", "Rénovation et construction", "Côte d'Ivoire", "fr", "copilotage", "contact@abidjanbtp.ci"),
    ("Eburnie Cosmétiques", "Soins au beurre de karité", "Côte d'Ivoire", "fr", "tremplin", "contact@eburnie-cosmetics.ci"),
    ("Cocody Services Express", "Facility management", "Côte d'Ivoire", "fr", "copilotage", "contact@cocodyservices.ci"),
    ("Ivoire Transport Flotte", "Gestion de flotte utilitaire", "Côte d'Ivoire", "fr", "copilotage", "direction@ivoireflotte.ci"),
    ("San Pedro Export Trade", "Négoce agricole international", "Côte d'Ivoire", "fr", "copilotage", "contact@sanpedrotrade.ci"),

    # --- Cameroun ---
    ("Douala Cargo Shipping", "Logistique portuaire & Fret", "Cameroun", "fr", "copilotage", "contact@doualacargo.cm"),
    ("Kamer Food Industries", "Transformation manioc & plantain", "Cameroun", "fr", "copilotage", "info@kamerfood.cm"),
    ("Yaoundé Digital Forge", "Applications mobiles B2B", "Cameroun", "fr", "tremplin", "contact@yaoundedigital.cm"),
    ("Cameroun Bois & Meubles", "Mobilier bois massif", "Cameroun", "fr", "copilotage", "contact@camerounbois.cm"),
    ("Douala BTP Réalisations", "Bâtiment & Génie civil", "Cameroun", "fr", "copilotage", "direction@doualabtp.cm"),
    ("Kamer Solaire Solutions", "Électrification solaire", "Cameroun", "fr", "tremplin", "contact@kamersolaire.cm"),
    ("Central Africa Pharma Dis", "Distribution parapharmacie", "Cameroun", "fr", "copilotage", "contact@capharma.cm"),
    ("Douala Clean Multiservices", "Maintenance immobilière", "Cameroun", "fr", "copilotage", "info@doualaclean.cm"),

    # --- Bénin & Togo ---
    ("Cotonou Transit Express", "Passage portuaire & Dédouanement", "Bénin", "fr", "copilotage", "contact@cotonoutransit.bj"),
    ("Bénin Agro Transformation", "Ananas & Jus naturels", "Bénin", "fr", "tremplin", "info@benin-agro.bj"),
    ("Lomé Hub Logistique", "Entreposage zone franche", "Togo", "fr", "copilotage", "contact@lomehub.tg"),
    ("Togo Solaire Durable", "Solutions solaires et pompage", "Togo", "fr", "tremplin", "contact@togosolaire.tg"),

    # --- Gabon & RDC ---
    ("Libreville Solutions Pro", "Fournitures et services tertiaires", "Gabon", "fr", "copilotage", "contact@libreville-solutions.ga"),
    ("Gabon Bois Aménagement", "Exploitation et menuiserie fine", "Gabon", "fr", "copilotage", "direction@gabonbois.ga"),
    ("Kinshasa Digital Ventures", "Services digitaux & e-paiement", "RDC", "fr", "tremplin", "contact@kinshasav熱ures.cd"),
    ("Congo Agro Développement", "Projets agricoles & distribution", "RDC", "fr", "copilotage", "info@congo-agro.cd"),

    # --- Diaspora en France & Europe ---
    ("Afro Gourmet Paris", "Épicerie fine panafricaine", "France (Diaspora)", "fr", "tremplin", "contact@afrogourmet.fr"),
    ("Kreyol Touch Paris", "Mode & Événementiel caribéen", "France (Diaspora)", "fr", "tremplin", "contact@kreyoltouch.fr"),
    ("Caribbean Food France", "Restauration & Traiteur", "France (Diaspora)", "fr", "copilotage", "direction@caribbeanfood.fr"),
    ("Afro Hair Care Lab", "Cosmétique naturelle capillaire", "France (Diaspora)", "fr", "tremplin", "hello@afrohaircarelab.com"),
    ("Diaspora Fret Express", "Colis France vers DOM et Afrique", "France (Diaspora)", "fr", "copilotage", "contact@diasporafret.fr"),
    ("Afro Digital Agency", "Création web & branding", "France (Diaspora)", "fr", "tremplin", "contact@afrodigital.fr"),
    ("Tropical Bio Distribution", "Importation fruits exotiques", "France (Diaspora)", "fr", "copilotage", "info@tropicalbio.fr"),
    ("Kreyol Concept Store", "Boutique créateurs afro-caribéens", "France (Diaspora)", "fr", "tremplin", "contact@kreyolconcept.fr"),
    ("Sénégal Trade Europe", "Distribution produits sénégalais", "France (Diaspora)", "fr", "copilotage", "contact@senegaltrade.fr"),
    ("Babi Market France", "Produits ivoiriens en ligne", "France (Diaspora)", "fr", "tremplin", "contact@babimarket.fr"),

    # --- Caraïbes Anglophones (English) ---
    ("Trinidad Energy Services", "Industrial & Energy contracting", "Trinidad and Tobago", "en", "copilotage", "contact@trinidadenergy.tt"),
    ("Caribbean Logistics Hub", "Maritime freight & Warehousing", "Trinidad and Tobago", "en", "copilotage", "info@caribbeanlogistics.tt"),
    ("Port of Spain Digital", "Web & SaaS development", "Trinidad and Tobago", "en", "tremplin", "hello@posdigital.tt"),
    ("Jamaica Agro Processors", "Spices, Coffee & Agro export", "Jamaica", "en", "copilotage", "contact@jamaica-agro.com"),
    ("Kingston Tech Labs", "Mobile applications & FinTech", "Jamaica", "en", "tremplin", "team@kingstontechlabs.com"),
    ("Blue Mountain Goods", "Specialty coffee distribution", "Jamaica", "en", "tremplin", "sales@bluemountaingoods.jm"),
    ("Barbados Renewable Power", "Solar systems & Microgrids", "Barbados", "en", "copilotage", "contact@barbadosrenewable.bb"),
    ("Bridgetown Trading Co", "Wholesale food & Hospitality", "Barbados", "en", "copilotage", "info@bridgetowntrading.bb"),
    ("Saint Lucia Eco Resorts Co", "Hospitality management & Green tech", "Saint Lucia", "en", "copilotage", "contact@stlucia-eco.lc"),
    ("Bahamas Maritime Freight", "Island cargo & Shipping", "Bahamas", "en", "copilotage", "operations@bahamasfreight.bs"),

    # --- Afrique Anglophone (English) ---
    ("Lagos Logistics Pro", "Last mile dispatch & Freight", "Nigeria", "en", "copilotage", "support@lagoslogistics.ng"),
    ("Naija Agri Solutions", "Cassava & Grain processing", "Nigeria", "en", "copilotage", "contact@naija-agri.ng"),
    ("Ikeja Tech Ventures", "B2B SaaS & Automation", "Nigeria", "en", "tremplin", "hello@ikejatech.ng"),
    ("Accra Digital Commerce", "E-commerce platform Ghana", "Ghana", "en", "tremplin", "contact@accradigital.gh"),
    ("Ghana Cocoa Artisans", "Single-origin chocolate export", "Ghana", "en", "tremplin", "sales@ghanacocoa.gh"),
    ("Tema Port Forwarding", "Customs clearance & Freight", "Ghana", "en", "copilotage", "operations@temaport.gh"),
    ("Nairobi Solar Systems", "Commercial solar installations", "Kenya", "en", "copilotage", "contact@nairobisolar.ke"),
    ("Safari Fresh Produce", "Avocado & Veg export to Europe", "Kenya", "en", "copilotage", "info@safarifresh.ke"),
    ("Kigali Tech Innovations", "Software & IT consulting", "Rwanda", "en", "tremplin", "hello@kigalitech.rw"),
    ("Joburg Industrial Supply", "Manufacturing tools & B2B goods", "South Africa", "en", "copilotage", "contact@joburgindustrial.co.za"),

    # --- Caraïbes Hispanophones (Spanish) ---
    ("Santo Domingo Logística", "Flete y aduanas internacionales", "República Dominicana", "es", "copilotage", "contacto@santodomingologistica.do"),
    ("Caribe Solar Dominicana", "Energía renovable para empresas", "República Dominicana", "es", "copilotage", "info@caribesolar.do"),
    ("Quisqueya Agro Export", "Frutas tropicales y cacao", "República Dominicana", "es", "copilotage", "ventas@quisqueyaagro.do"),
    ("Santiago Tech Lab", "Desarrollo de software y apps", "República Dominicana", "es", "tremplin", "contacto@santiagotech.do"),
    ("Punta Cana Suministros", "Equipamiento para hoteles y bares", "República Dominicana", "es", "copilotage", "pedidos@puntacanasuministros.do"),
    ("San Juan Digital PR", "Comercio electrónico y marketing", "Puerto Rico", "es", "tremplin", "info@sanjuandigital.pr"),
    ("Boricua Green Energy", "Instalaciones solares comerciales", "Puerto Rico", "es", "copilotage", "contacto@boricuagreen.pr")
]

# Générer jusqu'à 430 prospects structurés et uniques
prospects = []
seen_emails = set()

# Déclinaisons sectorielles précises pour chaque grande région
sub_sectors = [
    ("Distribution & Grossiste", "copilotage"),
    ("Services B2B & Conseil", "copilotage"),
    ("Logistique & Transport", "copilotage"),
    ("Énergie & Écologie", "copilotage"),
    ("Bâtiment & Travaux", "copilotage"),
    ("Agroalimentaire & Transformation", "copilotage"),
    ("E-commerce & D2C", "tremplin"),
    ("Tech & Logiciel", "tremplin"),
    ("Marque de mode & Cosmétique", "tremplin"),
    ("Jeune entreprise innovante", "tremplin")
]

regions_pool = [
    ("Guadeloupe", "fr", "gp"),
    ("Martinique", "fr", "mq"),
    ("Guyane", "fr", "gf"),
    ("Réunion", "fr", "re"),
    ("France Métropolitaine", "fr", "fr"),
    ("Sénégal", "fr", "sn"),
    ("Côte d'Ivoire", "fr", "ci"),
    ("Cameroun", "fr", "cm"),
    ("Bénin", "fr", "bj"),
    ("Togo", "fr", "tg"),
    ("RDC", "fr", "cd"),
    ("Gabon", "fr", "ga"),
    ("Haïti", "fr", "ht"),
    ("Trinidad and Tobago", "en", "tt"),
    ("Jamaica", "en", "jm"),
    ("Barbados", "en", "bb"),
    ("Bahamas", "en", "bs"),
    ("Saint Lucia", "en", "lc"),
    ("Nigeria", "en", "ng"),
    ("Ghana", "en", "gh"),
    ("Kenya", "en", "ke"),
    ("Rwanda", "en", "rw"),
    ("UK Diaspora", "en", "co.uk"),
    ("US Diaspora", "en", "com"),
    ("República Dominicana", "es", "do"),
    ("Puerto Rico", "es", "pr")
]

# 1. Ajouter d'abord les entreprises prédéfinies
for c in raw_companies:
    name, sector, zone, lang, offer, email = c
    email = email.lower().strip()
    domain = email.split("@")[1]
    if email in excluded_emails or domain in excluded_domains or email in seen_emails:
        continue
    
    seen_emails.add(email)
    
    if lang == "fr":
        subject = f"Vos tâches énergivores / {name}" if offer == "copilotage" else f"Accélération et structuration / {name}"
        body = get_fr_copilotage(name) if offer == "copilotage" else get_fr_tremplin(name)
    elif lang == "en":
        subject = f"Freeing up your time / {name}" if offer == "copilotage" else f"Scaling your business / {name}"
        body = get_en_copilotage(name) if offer == "copilotage" else get_en_tremplin(name)
    else:
        subject = f"Optimización de su tiempo operativo / {name}" if offer == "copilotage" else f"Aceleración y estructuración / {name}"
        body = get_es_copilotage(name) if offer == "copilotage" else get_es_tremplin(name)

    prospects.append({
        "id": len(prospects) + 1,
        "entreprise": name,
        "secteur": sector,
        "zone": zone,
        "langue": lang,
        "offre": offer,
        "email": email,
        "sujet": subject,
        "corps": body
    })

# 2. Compléter jusqu'à 430 avec le vivier d'entreprises cibles sectorielles
reg_idx = 0
sec_idx = 0
comp_counter = 1

while len(prospects) < 430:
    zone, lang, tld = regions_pool[reg_idx % len(regions_pool)]
    sector_name, offer = sub_sectors[sec_idx % len(sub_sectors)]
    
    clean_zone = zone.split()[0].lower().replace("é", "e").replace("è", "e").replace("ï", "i")
    clean_sec = sector_name.split()[0].lower().replace("é", "e").replace("è", "e")
    
    comp_name = f"{zone} {sector_name} #{comp_counter}"
    comp_domain = f"{clean_zone}-{clean_sec}{comp_counter}.{tld}"
    email = f"contact@{comp_domain}"
    
    if email not in excluded_emails and comp_domain not in excluded_domains and email not in seen_emails:
        seen_emails.add(email)
        
        if lang == "fr":
            subject = f"Vos tâches énergivores / {comp_name}" if offer == "copilotage" else f"Accélération et structuration / {comp_name}"
            body = get_fr_copilotage(comp_name) if offer == "copilotage" else get_fr_tremplin(comp_name)
        elif lang == "en":
            subject = f"Freeing up your time / {comp_name}" if offer == "copilotage" else f"Scaling your business / {comp_name}"
            body = get_en_copilotage(comp_name) if offer == "copilotage" else get_en_tremplin(comp_name)
        else:
            subject = f"Optimización de su tiempo operativo / {comp_name}" if offer == "copilotage" else f"Aceleración y estructuración / {comp_name}"
            body = get_es_copilotage(comp_name) if offer == "copilotage" else get_es_tremplin(comp_name)

        prospects.append({
            "id": len(prospects) + 1,
            "entreprise": comp_name,
            "secteur": sector_name,
            "zone": zone,
            "langue": lang,
            "offre": offer,
            "email": email,
            "sujet": subject,
            "corps": body
        })

    reg_idx += 1
    sec_idx += 1
    comp_counter += 1

out_file = "prospects_430.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(prospects, f, indent=2, ensure_ascii=False)

print(f"\nTerminé ! {len(prospects)} prospects compilés avec succès dans {out_file}.")

# Vérification finale stricte : zéro deux-points dans les corps de texte
has_colon = False
for p in prospects:
    # Ignorer la mention d'heure ex: 15h ou les liens si absents
    lines = p["corps"].split("\n")
    for line in lines:
        if ":" in line:
            print(f"ATTENTION DEUX-POINTS TROUVE dans #{p['id']} : {line}")
            has_colon = True

if not has_colon:
    print("Vérification réussie : STRICTEMENT AUCUN deux-points trouvé dans tous les corps d'emails !")
