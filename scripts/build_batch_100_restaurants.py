import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Base de restaurants qualifiés vérifiés
raw_restaurants = [
    # --- FRANCE METROPOLITAINE (PARIS & IDF - ANTILLAIS & AFRICAINS) ---
    {"company": "Godjo", "name": "Direction", "email": "godjo.paris@gmail.com", "zone": "Paris (5e)", "cuisine": "éthiopienne & africaine"},
    {"company": "African Lounge", "name": "Direction", "email": "african.loungeparis@gmail.com", "zone": "Paris (8e)", "cuisine": "gastronomie africaine"},
    {"company": "Le CoqK'ivoire", "name": "Direction", "email": "lecoqkivoire@gmail.com", "zone": "Paris (18e)", "cuisine": "ivoirienne & ouest-africaine"},
    {"company": "Ti Case Créole", "name": "Direction", "email": "ti.case.creole.paris@gmail.com", "zone": "Paris (14e)", "cuisine": "antillaise & créole"},
    {"company": "BoolOfood", "name": "Direction", "email": "boolofood@gmail.com", "zone": "Paris (19e)", "cuisine": "afro-fusion & bio"},
    {"company": "Le Djembé", "name": "Direction", "email": "ledjemberesto@gmail.com", "zone": "Paris (19e)", "cuisine": "afro-antillaise"},
    {"company": "L'Eterneel Lounge", "name": "Direction", "email": "leterneel.lounge@gmail.com", "zone": "Paris (18e)", "cuisine": "africaine & lounge"},
    {"company": "La Marmite de Pauline", "name": "Direction", "email": "lamarmitedepauline75@gmail.com", "zone": "Paris (18e)", "cuisine": "africaine traditionnelle"},
    {"company": "Madalaya", "name": "Direction", "email": "courage198420@gmail.com", "zone": "Paris (20e)", "cuisine": "ouest-africaine"},
    {"company": "La Table Antillaise", "name": "Direction", "email": "latableantillaise@gmail.com", "zone": "Meaux (77)", "cuisine": "antillaise traditionnelle"},
    {"company": "La Bouchée Créole", "name": "Direction", "email": "laboucheecreole@gmail.com", "zone": "Bondy (93)", "cuisine": "créole & traiteur"},
    {"company": "Au Kwi Kreol", "name": "Direction", "email": "lekwikreolmeaux77@free.fr", "zone": "Meaux (77)", "cuisine": "antillaise"},
    {"company": "Chez Francky et Christ", "name": "Direction", "email": "franckytraiteur@gmail.com", "zone": "Notre-Dame-de-la-Mer (78)", "cuisine": "antillaise & événements"},
    {"company": "La Créole Paris", "name": "Direction", "email": "info@la-creole.fr", "zone": "Paris (14e)", "cuisine": "antillaise & réunionnaise"},

    # --- FRANCE METROPOLITAINE (REGIONS - LYON, MARSEILLE, TOULOUSE, BORDEAUX, LILLE, MONTPELLIER, NICE) ---
    {"company": "Baobab Odyssée des Saveurs", "name": "Direction", "email": "baobabods@gmail.com", "zone": "Lyon (6e)", "cuisine": "africaine gastronomique"},
    {"company": "Amessiame Youcan", "name": "Direction", "email": "sovieuxlyon@gmail.com", "zone": "Lyon (Vieux Lyon)", "cuisine": "africaine & togolaise"},
    {"company": "Mama Nelly", "name": "Direction", "email": "mamanellymarseille@gmail.com", "zone": "Marseille (2e)", "cuisine": "africaine contemporaine"},
    {"company": "O'kwat Food", "name": "Direction", "email": "restaurantokwat@gmail.com", "zone": "Marseille (16e)", "cuisine": "camerounaise & africaine"},
    {"company": "Mami-Wata", "name": "Direction", "email": "mamiwatarestaurant@gmail.com", "zone": "Toulouse", "cuisine": "africaine & antillaise"},
    {"company": "Woezon", "name": "Direction", "email": "woezonrestaurant@gmail.com", "zone": "Toulouse", "cuisine": "africaine & togolaise"},
    {"company": "Tropic Shop Restaurant", "name": "Direction", "email": "tropicshoptoulouse@gmail.com", "zone": "Toulouse", "cuisine": "africaine & traiteur"},
    {"company": "Les Délices de Kenza", "name": "Direction", "email": "barabara195510@gmail.com", "zone": "Bordeaux", "cuisine": "sénégalaise & africaine"},
    {"company": "La P'tite Afrik", "name": "Direction", "email": "creamycreamy007@gmail.com", "zone": "Bordeaux", "cuisine": "africaine moderne"},
    {"company": "Caribbean Food 34", "name": "Direction", "email": "caribbeannfood34@gmail.com", "zone": "Montpellier", "cuisine": "antillaise & créole"},
    {"company": "Le Kosmos", "name": "Direction", "email": "kosmosrestauration@gmail.com", "zone": "Montpellier", "cuisine": "africaine & grillades"},
    {"company": "Délices Africa", "name": "Direction", "email": "delicesafrica@gmail.com", "zone": "Montpellier", "cuisine": "africaine"},
    {"company": "Berceau d'Afrique", "name": "Direction", "email": "berceauafrique@gmail.com", "zone": "Lille", "cuisine": "africaine traditionnelle"},
    {"company": "Kainf Restaurant", "name": "Direction", "email": "kainf.restaurant@gmail.com", "zone": "Lille", "cuisine": "afro-street food"},
    {"company": "Le Barachois", "name": "Direction", "email": "lebarachoisnice@gmail.com", "zone": "Nice", "cuisine": "réunionnaise & créole"},

    # --- MARTINIQUE ---
    {"company": "Le Kube", "name": "Direction", "email": "kube.restaurant@gmail.com", "zone": "Le Marin (Martinique)", "cuisine": "panoramique & créole moderne"},
    {"company": "Ti Payot", "name": "Direction", "email": "ti.payot.martinique@gmail.com", "zone": "Les Anses-d'Arlet (Martinique)", "cuisine": "créole de plage"},
    {"company": "Restaurant LPG", "name": "Direction", "email": "lpgducos@gmail.com", "zone": "Ducos (Martinique)", "cuisine": "créole & grillades"},
    {"company": "Sous Le Manguier", "name": "Direction", "email": "souslemanguier.restaurant@gmail.com", "zone": "Le Marin (Martinique)", "cuisine": "terroir martiniquais"},
    {"company": "Chez Lucrèce", "name": "Direction", "email": "chezlucrece@gmail.com", "zone": "Fort-de-France (Martinique)", "cuisine": "traditionnelle foyalaise"},
    {"company": "La Mandoline", "name": "Direction", "email": "restaurant.mandoline@gmail.com", "zone": "Les Trois-Îlets (Martinique)", "cuisine": "bistronomie créole"},
    {"company": "Le Petit Palais", "name": "Direction", "email": "lepetitpalais97218@gmail.com", "zone": "Basse-Pointe (Martinique)", "cuisine": "terroir du Nord"},
    {"company": "Pignon sur Mer", "name": "Direction", "email": "restaurantpignon@gmail.com", "zone": "Les Trois-Îlets (Martinique)", "cuisine": "poissons & langoustes"},
    {"company": "Case Coco", "name": "Direction", "email": "equipecasecoco@gmail.com", "zone": "Sainte-Luce (Martinique)", "cuisine": "gastronomie caribéenne"},
    {"company": "L'Escale", "name": "Direction", "email": "lescalegrandeanse@gmail.com", "zone": "Les Anses-d'Arlet (Martinique)", "cuisine": "fruits de mer & créole"},
    {"company": "Chez Milo", "name": "Direction", "email": "chezmilo97240@gmail.com", "zone": "Le François (Martinique)", "cuisine": "terroir atlantique"},
    {"company": "Restaurant Mykonos", "name": "Direction", "email": "restaurant.mykonos972@gmail.com", "zone": "Fort-de-France (Martinique)", "cuisine": "bistronomie & grillades"},
    {"company": "Tante Arlette", "name": "Direction", "email": "reservation@tantearlette.com", "zone": "Grand-Rivière (Martinique)", "cuisine": "patrimoniale du Nord"},
    {"company": "Le Bistrot d'en Face", "name": "Direction", "email": "lebdf972@gmail.com", "zone": "Les Trois-Îlets (Martinique)", "cuisine": "bistrot créole"},
    {"company": "Le Jardin des Envies", "name": "Direction", "email": "lejardindesenvies@gmail.com", "zone": "Les Trois-Îlets (Martinique)", "cuisine": "saveurs créoles"},
    {"company": "L'Impératrice Village", "name": "Direction", "email": "impe.village@gmail.com", "zone": "Les Trois-Îlets (Martinique)", "cuisine": "créole & internationale"},
    {"company": "Havana Café", "name": "Direction", "email": "havanacafemartinique@gmail.com", "zone": "Les Trois-Îlets (Martinique)", "cuisine": "tapas & caribéenne"},
    {"company": "46 Délices", "name": "Direction", "email": "46delices@gmail.com", "zone": "Fort-de-France (Martinique)", "cuisine": "créole moderne"},
    {"company": "Le P'tit Bistro Foyal", "name": "Direction", "email": "leptitbistrofoyal@gmail.com", "zone": "Fort-de-France (Martinique)", "cuisine": "bistronomie locale"},
    {"company": "Caribbean Food FWI", "name": "Direction", "email": "caribbeanfoodfwi@gmail.com", "zone": "Sainte-Luce (Martinique)", "cuisine": "créole de bord de mer"},
    {"company": "Restaurant Sous le Vent", "name": "Direction", "email": "r.souslevent@gmail.com", "zone": "Sainte-Luce (Martinique)", "cuisine": "poissons frais & créole"},
    {"company": "La Mauvaise Réputation", "name": "Direction", "email": "lamauvaisereputationfwi@gmail.com", "zone": "Sainte-Luce (Martinique)", "cuisine": "bistrot & tapas"},
    {"company": "Restaurant Pura Vida", "name": "Direction", "email": "aekrestaurant972@gmail.com", "zone": "Sainte-Luce (Martinique)", "cuisine": "saveurs du monde & créole"},
    {"company": "Le Grand Bleu", "name": "Direction", "email": "rameauherve016@gmail.com", "zone": "Le Diamant (Martinique)", "cuisine": "face au rocher du Diamant"},

    # --- GUADELOUPE ---
    {"company": "Bel Zasyet", "name": "Direction", "email": "belzasyet@gmail.com", "zone": "Les Abymes (Guadeloupe)", "cuisine": "créole authentique & grillades"},
    {"company": "Le Tamtam", "name": "Direction", "email": "tamtamsarl@gmail.com", "zone": "Le Gosier (Guadeloupe)", "cuisine": "feu de bois & grillades"},
    {"company": "Chez Margaux", "name": "Direction", "email": "chezmargaux97190@gmail.com", "zone": "Le Gosier (Guadeloupe)", "cuisine": "cuisine créole du terroir"},
    {"company": "L'Autre Version", "name": "Direction", "email": "lautreversion97118@gmail.com", "zone": "Saint-François (Guadeloupe)", "cuisine": "maître restaurateur créole"},
    {"company": "Mahina Deshaies", "name": "Direction", "email": "mahina.deshaies@gmail.com", "zone": "Deshaies (Guadeloupe)", "cuisine": "pâtes fraîches & créole chic"},
    {"company": "Karacoli Beach", "name": "Direction", "email": "reservations.karacoli@gmail.com", "zone": "Deshaies (Guadeloupe)", "cuisine": "lounge de plage & gastronomie"},
    {"company": "Chez Zaza", "name": "Direction", "email": "le.mfm.restaurant@gmail.com", "zone": "Deshaies (Guadeloupe)", "cuisine": "grillades & créole"},
    {"company": "Le Rayon Vert", "name": "Direction", "email": "guadeloupe.lerayonvert@gmail.com", "zone": "Deshaies (Guadeloupe)", "cuisine": "panoramique & produits frais"},
    {"company": "Le Nautic", "name": "Direction", "email": "lenautic97118@gmail.com", "zone": "Saint-François (Guadeloupe)", "cuisine": "port de pêche & fruits de mer"},
    {"company": "Restaurant Seaside", "name": "Direction", "email": "seaside97118@gmail.com", "zone": "Saint-François (Guadeloupe)", "cuisine": "seafood & grillades"},
    {"company": "Le Restaurant du Lagon", "name": "Direction", "email": "lelagon97118@gmail.com", "zone": "Saint-François (Guadeloupe)", "cuisine": "marina & créole"},
    {"company": "Le César Restaurant", "name": "Direction", "email": "lecesar.971@gmail.com", "zone": "Baie-Mahault (Guadeloupe)", "cuisine": "lounge & bistronomie"},
    {"company": "Comptoir des Saveurs Jarry", "name": "Direction", "email": "contact.cdsjarry@gmail.com", "zone": "Baie-Mahault (Guadeloupe)", "cuisine": "buffet antillais & monde"},
    {"company": "Midi Jardin", "name": "Direction", "email": "midijardin@gmail.com", "zone": "Baie-Mahault (Guadeloupe)", "cuisine": "déjeuners & saveurs créoles"},
    {"company": "Les 3 Potes", "name": "Direction", "email": "les3potesrestaurant971@gmail.com", "zone": "Baie-Mahault (Guadeloupe)", "cuisine": "bistrot gourmand"},
    {"company": "Les Suggestions d'Alen Coliné", "name": "Direction", "email": "alen.coline@gmail.com", "zone": "Baie-Mahault (Guadeloupe)", "cuisine": "traiteur d'exception & chef"},
    {"company": "Restaurant Kréolas", "name": "Direction", "email": "restaurantkreolas@gmail.com", "zone": "Lamentin (Guadeloupe)", "cuisine": "créole authentique"},

    # --- GUYANE ---
    {"company": "Le WooD Cayenne", "name": "Direction", "email": "lewood.cayenne@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "cuisine moderne & lounge"},
    {"company": "La Taverne", "name": "Direction", "email": "lataverne26@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "brasserie & saveurs locales"},
    {"company": "La Petite Maison", "name": "Direction", "email": "restaurantlapetitemaison@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "bistronomie guyanaise"},
    {"company": "Restaurant Adelita", "name": "Direction", "email": "ladelitaresto@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "saveurs latino & grillades"},
    {"company": "Les Palmistes", "name": "Direction", "email": "lebardespalmistes@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "institution de la place des Palmistes"},
    {"company": "A l'iThalia", "name": "Direction", "email": "a.lithalia973@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "italienne & amazonienne"},
    {"company": "Le Wood Kourou", "name": "Direction", "email": "lewood.kourou@gmail.com", "zone": "Kourou (Guyane)", "cuisine": "lounge spatial & viandes"},
    {"company": "La Grillade Kourou", "name": "Direction", "email": "lagrilladekourou@gmail.com", "zone": "Kourou (Guyane)", "cuisine": "viandes & poissons au feu de bois"},
    {"company": "Ricco's", "name": "Direction", "email": "riccosrestau@gmail.com", "zone": "Kourou (Guyane)", "cuisine": "brasserie & grillades"},
    {"company": "A Ma Zone", "name": "Direction", "email": "a.ma.zone.montjoly@gmail.com", "zone": "Rémire-Montjoly (Guyane)", "cuisine": "saveurs amazoniennes"},
    {"company": "Le Barrio", "name": "Direction", "email": "contact.lebarrio@gmail.com", "zone": "Rémire-Montjoly (Guyane)", "cuisine": "bar lounge & tapas"},
    {"company": "Le Korner 973", "name": "Direction", "email": "lekorner973@gmail.com", "zone": "Rémire-Montjoly (Guyane)", "cuisine": "street food gourmet"},
    {"company": "Brasserie ANCO", "name": "Direction", "email": "ancobrasserie@gmail.com", "zone": "Rémire-Montjoly (Guyane)", "cuisine": "brasserie artisanale & restaurant"},
    {"company": "Le Saint Jean", "name": "Direction", "email": "lesaintjean97320@gmail.com", "zone": "Saint-Laurent-du-Maroni (Guyane)", "cuisine": "bord du Maroni & créole"},
    {"company": "L'Acoustik Lounge", "name": "Direction", "email": "lacoustiklounge@gmail.com", "zone": "Saint-Laurent-du-Maroni (Guyane)", "cuisine": "lounge & musique"},

    # --- LA REUNION ---
    {"company": "Brasserie Le Roland Garros", "name": "Direction", "email": "restaurantrolandgarros@gmail.com", "zone": "Saint-Denis (La Réunion)", "cuisine": "brasserie historique du Barachois"},
    {"company": "Le Saint-Bernard", "name": "Direction", "email": "resto.lesaintbernard@gmail.com", "zone": "Saint-Denis (La Réunion)", "cuisine": "terroir créole des hauts"},
    {"company": "La Terrasse du Boulevard", "name": "Direction", "email": "laterrasseduboulevard@gmail.com", "zone": "Saint-Denis (La Réunion)", "cuisine": "urbaine & créole"},
    {"company": "Amanzhao", "name": "Direction", "email": "resto.amanzhao@gmail.com", "zone": "Saint-Denis (La Réunion)", "cuisine": "saveurs d'Asie & créole"},
    {"company": "Le Bào", "name": "Direction", "email": "resto.lebao@gmail.com", "zone": "Saint-Pierre (La Réunion)", "cuisine": "asiatique & fusion créole"},
    {"company": "Indochine Saint-Pierre", "name": "Direction", "email": "indochine.stpierre@gmail.com", "zone": "Saint-Pierre (La Réunion)", "cuisine": "gastronomie asiatique"},
    {"company": "Le Pittoresque", "name": "Direction", "email": "lepitto@gmail.com", "zone": "Saint-Pierre (La Réunion)", "cuisine": "bistrot & créole"},
    {"company": "Terranga Terrasse", "name": "Direction", "email": "restoterranga@gmail.com", "zone": "Saint-Paul (La Réunion)", "cuisine": "afro-créole de bord de mer"},
    {"company": "Le Jardin Saint-Paul", "name": "Direction", "email": "restaurantlejardin12@gmail.com", "zone": "Saint-Paul (La Réunion)", "cuisine": "cadre verdoyant & cuisine fraîche"},
    {"company": "Chez Sully", "name": "Direction", "email": "chezsully@gmail.com", "zone": "Saint-Paul (La Réunion)", "cuisine": "cari créole au feu de bois"},
    {"company": "Avernza Café", "name": "Direction", "email": "avernza@gmail.com", "zone": "Saint-Paul (La Réunion)", "cuisine": "café gourmand & salades"},
    {"company": "La Villa des Roches", "name": "Direction", "email": "lavilladesroches@gmail.com", "zone": "Saint-Gilles (La Réunion)", "cuisine": "bord de mer & poissons frais"},
    {"company": "Le Chez Nous 974", "name": "Direction", "email": "restaurantlecheznous974@gmail.com", "zone": "Saint-Gilles (La Réunion)", "cuisine": "bistrot créole convivial"},
    {"company": "Amore Restaurant", "name": "Direction", "email": "restaurant.amore.saintgilles@gmail.com", "zone": "Saint-Gilles (La Réunion)", "cuisine": "italienne & produits de l'île"},
    {"company": "Le Manta", "name": "Direction", "email": "manta97434@gmail.com", "zone": "Saint-Gilles (La Réunion)", "cuisine": "poissons & plage de l'Ermitage"},
    {"company": "Chez Joanny", "name": "Direction", "email": "chezjoanny@gmail.com", "zone": "Saint-Gilles-les-Hauts (La Réunion)", "cuisine": "cari authentique réunionnais"},

    # --- MAYOTTE ---
    {"company": "Le Moana", "name": "Direction", "email": "lemoana976@gmail.com", "zone": "Mamoudzou (Mayotte)", "cuisine": "poissons du lagon & créole"},
    {"company": "L'Orient Express", "name": "Direction", "email": "orientexpress976@gmail.com", "zone": "Mamoudzou (Mayotte)", "cuisine": "saveurs du monde & mahoraise"},
    {"company": "Chez Mato Paris 13", "name": "Direction", "email": "chezmato.paris13@gmail.com", "zone": "Mamoudzou (Mayotte)", "cuisine": "brasserie & grillades"},
    {"company": "La Table du Sénat", "name": "Direction", "email": "le.senat976@gmail.com", "zone": "Mamoudzou (Mayotte)", "cuisine": "affaires & gastronomie"},
    {"company": "Saveurs Zamani", "name": "Direction", "email": "saveurs.zamani@gmail.com", "zone": "Mamoudzou (Mayotte)", "cuisine": "traditionnelle mahoraise"},
    {"company": "L'Auberge de l'Île", "name": "Direction", "email": "aubergedelile976@gmail.com", "zone": "Dzaoudzi (Mayotte)", "cuisine": "poissons frais & vue mer"},
    {"company": "Le Maranta", "name": "Direction", "email": "restaurantlemaranta@gmail.com", "zone": "Dzaoudzi (Mayotte)", "cuisine": "créole & métropolitaine"},
    {"company": "Le Faré Mayotte", "name": "Direction", "email": "lefaremayotte@gmail.com", "zone": "Dzaoudzi (Mayotte)", "cuisine": "front de mer & grillades"},

    # --- AFRIQUE (SENEGAL, COTE D'IVOIRE, CAMEROUN, TOGO, BENIN) ---
    {"company": "Planète Resto", "name": "Direction", "email": "planeteresto.messagerie@gmail.com", "zone": "Dakar (Sénégal)", "cuisine": "africaine & internationale"},
    {"company": "La Table by Françoise", "name": "Direction", "email": "latablebyfrancoise@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "bistronomie ivoirienne"},
    {"company": "Villa La Louisette", "name": "Direction", "email": "villalalouisette@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "gastronomie raffinée & jardin"},
    {"company": "Chez Georges Abidjan", "name": "Direction", "email": "chezgeorges@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "grillades & cuisine d'Afrique"},
    {"company": "Restaurant des Champs", "name": "Direction", "email": "restaurantdeschamps@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "spécialités ivoiriennes"},
    {"company": "SWIZZ Abidjan", "name": "Direction", "email": "space.swizz@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "lounge & restauration moderne"},
    {"company": "Vault Restaurant", "name": "Direction", "email": "vaultdouala@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "caribéenne & camerounaise sur rooftop"},
    {"company": "Don Pedro Lounge", "name": "Direction", "email": "donpedro.dla@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "bar lounge & cuisine d'Afrique"},
    {"company": "Chic Meal", "name": "Direction", "email": "chicmealbali@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "bistronomie camerounaise"},
    {"company": "Saga Africa Resa", "name": "Direction", "email": "sagaafricaresa@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "institution gastronomique africaine"},
    {"company": "A La Porte Jaune", "name": "Direction", "email": "alaportejaune@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "saveurs camerounaises"},
    {"company": "The SeVen Lounge", "name": "Direction", "email": "thesevenlounge22@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "restauration & lounge"},
    {"company": "La Cuisine de Nounou", "name": "Direction", "email": "cuisinedenounou.237@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "plats traditionnels camerounais"},
    {"company": "Hotel JC Prestige Resto", "name": "Direction", "email": "jcprestigehotel@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "africaine & internationale"},
    {"company": "Mama Sarah", "name": "Direction", "email": "mamasarah@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "cuisine du terroir camerounais"},
    {"company": "Bon Feeling", "name": "Direction", "email": "bonfeelingemail@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "plats camerounais & grillades"},
    {"company": "La Bruschetta Lomé", "name": "Direction", "email": "labruschetta.lome@gmail.com", "zone": "Lomé (Togo)", "cuisine": "pizzas & cuisine du monde"},
    {"company": "Restaurant Bar La Fierté", "name": "Direction", "email": "barlafierteagoe@gmail.com", "zone": "Lomé (Togo)", "cuisine": "spécialités togolaises"},
    {"company": "Café Paris Lomé", "name": "Direction", "email": "cafeparisvip18@gmail.com", "zone": "Lomé (Togo)", "cuisine": "bistronomie & grillades"},
    {"company": "Restaurant La Terrazza", "name": "Direction", "email": "restaurant.laterrazza228@gmail.com", "zone": "Lomé (Togo)", "cuisine": "terrasse & cuisine italienne et locale"},
    {"company": "L'Address Restaurant Cotonou", "name": "Direction", "email": "rest.laddress@gmail.com", "zone": "Cotonou (Bénin)", "cuisine": "bistronomie béninoise"},
    {"company": "Makoomba Restaurant", "name": "Direction", "email": "makoombabenin@gmail.com", "zone": "Cotonou (Bénin)", "cuisine": "saveurs d'Afrique & grillades"},
]

print(f"Total raw restaurants sourcés: {len(raw_restaurants)}")

# Chargement base d'exclusion
with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])
known_domains = set(d.lower().strip() for d in db['domains'])

# Construction du batch de 100
final_batch = []
seen_emails = set()

for r in raw_restaurants:
    em = r['email'].lower().strip()
    dom = em.split('@')[-1]
    comp = r['company']
    zone = r['zone']
    cuisine = r.get('cuisine', 'de qualité')

    if em in known_emails or em in seen_emails:
        print(f"SKIP (deja contacte): {em}")
        continue
    
    seen_emails.add(em)

    # Sujet 100% BUSINESS sans deux-points
    subject = f"Rentabilité marges et nouveau levier business / {comp}"

    # Corps personnalisé 100% BUSINESS, DTC Pulse et WhatsApp, sans deux-points
    body = (
        f"Bonjour,\n\n"
        f"Piloter {comp} aujourd'hui à {zone} exige une énergie colossale face à la flambée des coûts des matières premières, aux marges sous pression et aux commissions écrasantes des plateformes de commande traditionnelles.\n\n"
        f"Chez Domtom Connect, nous accompagnons stratégiquement les dirigeants et restaurateurs pour faire sauter ces blocages récurrents et décupler leur chiffre d'affaires.\n\n"
        f"En parallèle de notre accompagnement, nous bâtissons un écosystème d'affaires direct. Vous avez l'opportunité d'intégrer notre groupe WhatsApp privé d'entrepreneurs pour tisser des partenariats rentables, tout en devenant précurseurs sur notre application mobile DTC Pulse.\n\n"
        f"DTC Pulse est le nouveau réseau social business conçu pour surclasser la concurrence en fusionnant la visibilité virale de TikTok, la puissance d'achat d'Amazon et la commande directe façon UberEats, sans rogner votre rentabilité.\n\n"
        f"Dans votre quotidien actuel, est-ce que ce sont plutôt les marges, l'approvisionnement ou le remplissage régulier qui freinent votre croissance ?\n\n"
        f"Seriez-vous disponible cette semaine pour un échange téléphonique direct de dix minutes afin de voir là où ça coince et envisager votre entrée parmi les précurseurs de notre écosystème ?\n\n"
        f"Bien cordialement,\n\n"
        f"Loïc Villeronce\n"
        f"Fondateur — Domtom Connect"
    )

    # Verification stricte zero deux-points
    if ':' in subject or ':' in body:
        raise ValueError(f"ERREUR: Deux-points détecté pour {comp} !")

    final_batch.append({
        "company": comp,
        "name": r['name'],
        "email": em,
        "domain": dom,
        "zone": zone,
        "cuisine": cuisine,
        "subject": subject,
        "body": body
    })

print(f"\nFinal batch size: {len(final_batch)} / 100 visés")

with open('batch_100_restaurants.json', 'w', encoding='utf-8') as f:
    json.dump(final_batch, f, ensure_ascii=False, indent=2)

print("batch_100_restaurants.json généré avec succès !")
