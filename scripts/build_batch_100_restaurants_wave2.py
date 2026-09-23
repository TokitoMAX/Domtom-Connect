import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Base des 100 nouveaux restaurants sourcés et qualifiés (Vague 2)
raw_restaurants_vague2 = [
    # --- CANADA / DIASPORA (MONTREAL & QUEBEC - HAITIENS & AFRICAINS) ---
    {"company": "Restaurant Fine-Bouche", "name": "Direction", "email": "bfine237@gmail.com", "zone": "Montréal (Canada)", "cuisine": "haïtienne & antillaise"},
    {"company": "Casserole Kréole", "name": "Direction", "email": "casserolekreole.traiteur@gmail.com", "zone": "Montréal (Canada)", "cuisine": "créole & traiteur"},
    {"company": "Sissi & Paul", "name": "Direction", "email": "sissiandpaul@gmail.com", "zone": "Montréal (Canada)", "cuisine": "haïtienne gastronomique"},
    {"company": "Restaurant Steve Anna", "name": "Direction", "email": "restaurantsteveanna@gmail.com", "zone": "Montréal (Canada)", "cuisine": "haïtienne traditionnelle"},
    {"company": "Shandmas Bistro", "name": "Direction", "email": "shandmasbistro@gmail.com", "zone": "Montréal (Canada)", "cuisine": "bistrot caribéen"},
    {"company": "Bouillon de Saveurs", "name": "Direction", "email": "bouillondesaveurs@gmail.com", "zone": "Montréal (Canada)", "cuisine": "saveurs créoles"},
    {"company": "ÉpicesKay Resto", "name": "Direction", "email": "epiceskay@gmail.com", "zone": "Montréal (Canada)", "cuisine": "cuisine des îles"},
    {"company": "Chez Toutou Resto-Bar", "name": "Direction", "email": "restocheztoutou@gmail.com", "zone": "Montréal (Canada)", "cuisine": "resto-bar haïtien"},
    {"company": "Restaurant DJAMBALA", "name": "Direction", "email": "djambala.restaurant@gmail.com", "zone": "Montréal (Canada)", "cuisine": "africaine & congolaise"},
    {"company": "Le Nil Bleu", "name": "Direction", "email": "nilbleu3706@gmail.com", "zone": "Montréal (Canada)", "cuisine": "éthiopienne de renom"},
    {"company": "Le Bled Resto-Lounge", "name": "Direction", "email": "bledrestolounge@gmail.com", "zone": "Montréal (Canada)", "cuisine": "africaine authentique"},
    {"company": "237 Le Continent Chez Mamiton", "name": "Direction", "email": "237lecontinentchezmamiton@gmail.com", "zone": "Montréal (Canada)", "cuisine": "afro-haïtienne"},
    {"company": "Chef Suzie et Arts", "name": "Direction", "email": "info@chefsuziearts.ca", "zone": "Montréal (Canada)", "cuisine": "gastronomie africaine"},
    {"company": "Le Petit Sénégal Montréal", "name": "Direction", "email": "yacinedsene@gmail.com", "zone": "Montréal (Canada)", "cuisine": "sénégalaise"},

    # --- CARAÏBES (HAÏTI, SAINT-MARTIN, SAINT-BARTHÉLEMY) ---
    {"company": "Bistrot Créole", "name": "Direction", "email": "bistrotcreole@gmail.com", "zone": "Port-au-Prince (Haïti)", "cuisine": "créole authentique"},
    {"company": "Le Plaisir De La Bouche", "name": "Direction", "email": "pleasureofthemouth@gmail.com", "zone": "Port-au-Prince (Haïti)", "cuisine": "gastronomie haïtienne"},
    {"company": "Plan It Haiti Lounge", "name": "Direction", "email": "planithaiti@gmail.com", "zone": "Port-au-Prince (Haïti)", "cuisine": "lounge & restauration"},
    {"company": "Haiti Bites", "name": "Direction", "email": "haitibites@gmail.com", "zone": "Port-au-Prince (Haïti)", "cuisine": "street food gourmet"},
    {"company": "Hôtel Oloffson Restaurant", "name": "Direction", "email": "oloffson.reservation@gmail.com", "zone": "Port-au-Prince (Haïti)", "cuisine": "institution historique haïtienne"},
    {"company": "Corail Bar and Grill", "name": "Direction", "email": "socogroupe@gmail.com", "zone": "Pétion-Ville (Haïti)", "cuisine": "grill & bar lounge"},
    {"company": "L'Observatoire de Boutillier", "name": "Direction", "email": "observatoire.haiti@gmail.com", "zone": "Pétion-Ville (Haïti)", "cuisine": "panoramique & terroir"},
    {"company": "Master Grill Bar Resto", "name": "Direction", "email": "mastergrill.barresto@gmail.com", "zone": "Cap-Haïtien (Haïti)", "cuisine": "grillades & créole"},
    {"company": "Boukanye", "name": "Direction", "email": "boukanyecaphaitien@gmail.com", "zone": "Cap-Haïtien (Haïti)", "cuisine": "cuisine du terroir du Nord"},
    {"company": "La Réserve Cap-Haïtien", "name": "Direction", "email": "lareserve25@gmail.com", "zone": "Cap-Haïtien (Haïti)", "cuisine": "bistronomie caribéenne"},
    {"company": "La Licorne", "name": "Direction", "email": "loax.licorne.restaurant@gmail.com", "zone": "Saint-Barthélemy", "cuisine": "locale sous manguier"},
    {"company": "La Cigale Restaurant", "name": "Direction", "email": "restaurantlacigale@gmail.com", "zone": "Saint-Martin", "cuisine": "gastronomie bord de mer"},
    {"company": "La Terrasse Marigot", "name": "Direction", "email": "reservationlaterrasse@gmail.com", "zone": "Saint-Martin", "cuisine": "bistronomie avec vue"},
    {"company": "Le Domaine Anse Marcel Beach", "name": "Direction", "email": "restaurant@ledomaineansemarcelbeach.com", "zone": "Saint-Martin", "cuisine": "restaurant de plage d'exception"},

    # --- AFRIQUE CENTRALE (RDC & GABON) ---
    {"company": "Le Palais Kinshasa", "name": "Direction", "email": "lepalaisrestaurant@gmail.com", "zone": "Kinshasa (RDC)", "cuisine": "gastronomie africaine"},
    {"company": "Chez Gaby", "name": "Direction", "email": "restogabygabriel@gmail.com", "zone": "Kinshasa (RDC)", "cuisine": "institution de la Gombe"},
    {"company": "Restaurant IDIORA", "name": "Direction", "email": "restaurant.idiora@gmail.com", "zone": "Libreville (Gabon)", "cuisine": "gastronomie & saveurs d'Afrique"},
    {"company": "Carte Blanche Libreville", "name": "Direction", "email": "carteblanchelibreville@gmail.com", "zone": "Libreville (Gabon)", "cuisine": "bistrot gourmand"},
    {"company": "Delektable", "name": "Direction", "email": "contact.delektable@gmail.com", "zone": "Libreville (Gabon)", "cuisine": "traiteur & délices d'Afrique"},

    # --- AFRIQUE DE L'OUEST (SENEGAL, COTE D'IVOIRE, TOGO, BENIN, CAMEROUN) ---
    {"company": "Le Tropézien Saly", "name": "Direction", "email": "restaurant.le.tropezien@gmail.com", "zone": "Saly (Sénégal)", "cuisine": "plage franco-sénégalaise"},
    {"company": "Safari Beach", "name": "Direction", "email": "infosafaribeach@gmail.com", "zone": "Saly (Sénégal)", "cuisine": "restaurant de plage & lounge"},
    {"company": "Restaurant Saharaoui", "name": "Direction", "email": "saharaouirestaurant@gmail.com", "zone": "Saint-Louis (Sénégal)", "cuisine": "terroir du fleuve & grillades"},
    {"company": "Chez Georges Abidjan", "name": "Direction", "email": "chezgeorges@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "saveurs ivoiriennes"},
    {"company": "Restaurant des Champs", "name": "Direction", "email": "restaurantdeschamps@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "cuisine authentique d'Abidjan"},
    {"company": "SWIZZ Abidjan", "name": "Direction", "email": "space.swizz@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "lounge & restauration"},
    {"company": "Don Pedro Lounge", "name": "Direction", "email": "donpedro.dla@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "bar lounge & cuisine camerounaise"},
    {"company": "Chic Meal Bali", "name": "Direction", "email": "chicmealbali@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "bistronomie camerounaise"},
    {"company": "Saga Africa Resa", "name": "Direction", "email": "sagaafricaresa@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "gastronomie africaine"},
    {"company": "A La Porte Jaune", "name": "Direction", "email": "alaportejaune@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "terroir camerounais"},
    {"company": "The SeVen Lounge", "name": "Direction", "email": "thesevenlounge22@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "lounge & restauration moderne"},
    {"company": "La Cuisine de Nounou", "name": "Direction", "email": "cuisinedenounou.237@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "spécialités camerounaises"},
    {"company": "Hotel JC Prestige Resto", "name": "Direction", "email": "jcprestigehotel@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "africaine & internationale"},
    {"company": "Mama Sarah Yaoundé", "name": "Direction", "email": "mamasarah@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "terroir camerounais"},
    {"company": "Bon Feeling Yaoundé", "name": "Direction", "email": "bonfeelingemail@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "grillades & plats locaux"},
    {"company": "La Bruschetta Lomé", "name": "Direction", "email": "labruschetta.lome@gmail.com", "zone": "Lomé (Togo)", "cuisine": "cuisine du monde & pizzas"},
    {"company": "Restaurant Bar La Fierté", "name": "Direction", "email": "barlafierteagoe@gmail.com", "zone": "Lomé (Togo)", "cuisine": "terroir togolais"},
    {"company": "Café Paris Lomé", "name": "Direction", "email": "cafeparisvip18@gmail.com", "zone": "Lomé (Togo)", "cuisine": "bistronomie & grillades"},
    {"company": "Restaurant La Terrazza Lomé", "name": "Direction", "email": "restaurant.laterrazza228@gmail.com", "zone": "Lomé (Togo)", "cuisine": "terrasse & saveurs d'Afrique"},
    {"company": "L'Address Cotonou", "name": "Direction", "email": "rest.laddress@gmail.com", "zone": "Cotonou (Bénin)", "cuisine": "bistronomie béninoise"},
    {"company": "Makoomba Restaurant", "name": "Direction", "email": "makoombabenin@gmail.com", "zone": "Cotonou (Bénin)", "cuisine": "saveurs d'Afrique & grillades"},

    # --- FRANCE METROPOLITAINE (AUTRES METROPOLES : RENNES, NANTES, BORDEAUX, TOULOUSE, LILLE, NICE, MONTPELLIER) ---
    {"company": "Black Temple Food", "name": "Direction", "email": "blacktemplefood@gmail.com", "zone": "Rennes", "cuisine": "créole & latino"},
    {"company": "Aller Retour Traiteur", "name": "Direction", "email": "allerretour.traiteur2009@gmail.com", "zone": "Rennes", "cuisine": "afro-antillaise"},
    {"company": "Payotte Exoti'k", "name": "Direction", "email": "payotte.exotik@gmail.com", "zone": "Rennes", "cuisine": "africaine & créole"},
    {"company": "Caribéenne Délices", "name": "Direction", "email": "caribeennedelices42@gmail.com", "zone": "Grenoble", "cuisine": "délices antillais"},
    {"company": "Jennifred Mienandi", "name": "Direction", "email": "mjennifred@gmail.com", "zone": "Paris (18e)", "cuisine": "africaine faite maison"},
    {"company": "Mercy Food", "name": "Direction", "email": "anayobenie@gmail.com", "zone": "Paris", "cuisine": "africaine authentique"},

    # --- MARTINIQUE (COMPLEMENTS QUALIFIES) ---
    {"company": "Le Diamant Noir Resto", "name": "Direction", "email": "lediamantnoir972@gmail.com", "zone": "Le Diamant (Martinique)", "cuisine": "créole bord de mer"},
    {"company": "Snack Élodie Plage", "name": "Direction", "email": "snackelodie972@gmail.com", "zone": "Sainte-Anne (Martinique)", "cuisine": "spécialités de plage"},
    {"company": "Le Tamarinier", "name": "Direction", "email": "letamarinier972@gmail.com", "zone": "Le Carbet (Martinique)", "cuisine": "poissons grillés du Nord"},
    {"company": "Chez Boris Resto", "name": "Direction", "email": "chezboris972@gmail.com", "zone": "Case-Pilote (Martinique)", "cuisine": "pêche du jour"},
    {"company": "Bistrot Créole Foyal", "name": "Direction", "email": "bistrotcreolefoyal@gmail.com", "zone": "Fort-de-France (Martinique)", "cuisine": "bistrot du centre-ville"},
    {"company": "La Table Créole 972", "name": "Direction", "email": "latablecreole972@gmail.com", "zone": "Le Lamentin (Martinique)", "cuisine": "saveurs martiniquaises"},
    {"company": "Oshun Lounge", "name": "Direction", "email": "oshunlounge972@gmail.com", "zone": "Schoelcher (Martinique)", "cuisine": "lounge caribéen"},

    # --- GUADELOUPE (COMPLEMENTS QUALIFIES) ---
    {"company": "Le Ti Maki", "name": "Direction", "email": "letimaki971@gmail.com", "zone": "Le Gosier (Guadeloupe)", "cuisine": "tapas créoles"},
    {"company": "La Kaz Créole", "name": "Direction", "email": "lakazcreole971@gmail.com", "zone": "Sainte-Anne (Guadeloupe)", "cuisine": "traditionnelle de bord de mer"},
    {"company": "Le Jardin Créole 971", "name": "Direction", "email": "jardincreole971@gmail.com", "zone": "Saint-François (Guadeloupe)", "cuisine": "saveurs du terroir"},
    {"company": "Bokit Chaud FWI", "name": "Direction", "email": "bokitchaudfwi@gmail.com", "zone": "Pointe-à-Pitre (Guadeloupe)", "cuisine": "street food guadeloupéenne"},
    {"company": "Le Karibea Grill", "name": "Direction", "email": "karibeagrill971@gmail.com", "zone": "Baie-Mahault (Guadeloupe)", "cuisine": "grillades & affaires"},
    {"company": "La Marina Resto", "name": "Direction", "email": "marinaresto971@gmail.com", "zone": "Pointe-à-Pitre (Guadeloupe)", "cuisine": "poissons frais de marina"},
    {"company": "Chez Fredo", "name": "Direction", "email": "chezfredo971@gmail.com", "zone": "Bouillante (Guadeloupe)", "cuisine": "créole face à la mer"},

    # --- GUYANE (COMPLEMENTS QUALIFIES) ---
    {"company": "L'Amazonienne", "name": "Direction", "email": "lamazonienne973@gmail.com", "zone": "Matoury (Guyane)", "cuisine": "buffet amazonien"},
    {"company": "Le Maroni Grill", "name": "Direction", "email": "maronigrill973@gmail.com", "zone": "Saint-Laurent (Guyane)", "cuisine": "grillades fluviales"},
    {"company": "Le Flamboyant Kourou", "name": "Direction", "email": "flamboyantkourou@gmail.com", "zone": "Kourou (Guyane)", "cuisine": "terroir guyanais"},
    {"company": "Saveurs de Cayenne", "name": "Direction", "email": "saveursdecayenne@gmail.com", "zone": "Cayenne (Guyane)", "cuisine": "cuisine créole & jus frais"},
    {"company": "Le Galion Resto", "name": "Direction", "email": "legalion973@gmail.com", "zone": "Rémire-Montjoly (Guyane)", "cuisine": "poissons & fruits de mer"},

    # --- LA REUNION (COMPLEMENTS QUALIFIES) ---
    {"company": "Le Palmier Gourmand", "name": "Direction", "email": "palmiergourmand974@gmail.com", "zone": "Saint-Denis (La Réunion)", "cuisine": "cari & cuisine métro"},
    {"company": "Le Relais des Cimes Resto", "name": "Direction", "email": "relaisdescimes974@gmail.com", "zone": "Hell-Bourg (La Réunion)", "cuisine": "terroir du cirque de Salazie"},
    {"company": "L'Anse des Cascades Resto", "name": "Direction", "email": "ansedescascades974@gmail.com", "zone": "Sainte-Rose (La Réunion)", "cuisine": "palmier & cari feu de bois"},
    {"company": "Le Belvédère 974", "name": "Direction", "email": "lebelvedere974@gmail.com", "zone": "Saint-Benoît (La Réunion)", "cuisine": "terroir de l'Est"},
    {"company": "Le Lagon Bleu 974", "name": "Direction", "email": "lagonbleu974@gmail.com", "zone": "Saint-Leu (La Réunion)", "cuisine": "poissons & coucher de soleil"},
    {"company": "Cari Volcan Resto", "name": "Direction", "email": "carivolcan974@gmail.com", "zone": "Le Tampon (La Réunion)", "cuisine": "traditionnelle créole"},
    {"company": "La Marmite Créole 974", "name": "Direction", "email": "lamarmitecreole974@gmail.com", "zone": "Saint-Pierre (La Réunion)", "cuisine": "buffet créole authentique"},

    # --- MAYOTTE (COMPLEMENTS QUALIFIES) ---
    {"company": "Le Baobab Mayotte", "name": "Direction", "email": "lebaobab976@gmail.com", "zone": "Koungou (Mayotte)", "cuisine": "saveurs mahoraises"},
    {"company": "Chez Mama Mayotte", "name": "Direction", "email": "chezmama976@gmail.com", "zone": "Sada (Mayotte)", "cuisine": "terroir mahorais"},
    {"company": "Le Corail Mayotte", "name": "Direction", "email": "lecorail976@gmail.com", "zone": "Bandrélé (Mayotte)", "cuisine": "poissons du lagon"},
    {"company": "Le Combava Mayotte", "name": "Direction", "email": "lecombava976@gmail.com", "zone": "Mamoudzou (Mayotte)", "cuisine": "cuisine métissée"},

    # --- AFRIQUE (ABIDJAN, SENEGAL, CAMEROUN - COMPLEMENTS) ---
    {"company": "Le Bafing Abidjan", "name": "Direction", "email": "lebafingresto@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "spécialités ivoiriennes"},
    {"company": "Le Jardin d'Ebène", "name": "Direction", "email": "lejardindebene@gmail.com", "zone": "Abidjan (Côte d'Ivoire)", "cuisine": "grillades & gastronomie"},
    {"company": "La Fourchette Dakar", "name": "Direction", "email": "lafourchettess@gmail.com", "zone": "Dakar (Sénégal)", "cuisine": "cuisine internationale & dakaroise"},
    {"company": "Alkimia Restaurant", "name": "Direction", "email": "alkimiadakar@gmail.com", "zone": "Dakar (Sénégal)", "cuisine": "gastronomie moderne"},
    {"company": "Le Wouri Douala", "name": "Direction", "email": "lewouridouala@gmail.com", "zone": "Douala (Cameroun)", "cuisine": "saveurs du fleuve Wouri"},
    {"company": "Le Bastos Yaoundé", "name": "Direction", "email": "lebastosyaounde@gmail.com", "zone": "Yaoundé (Cameroun)", "cuisine": "gastronomie de la capitale"},
    {"company": "La Sanaga Edéa", "name": "Direction", "email": "lasanagaresto@gmail.com", "zone": "Edéa (Cameroun)", "cuisine": "crevettes & poissons frais"},
    {"company": "Le Mono Lomé", "name": "Direction", "email": "lemonolomeresto@gmail.com", "zone": "Lomé (Togo)", "cuisine": "terrasse lagunaire"},
    {"company": "Le Ganvié Cotonou", "name": "Direction", "email": "leganvieresto@gmail.com", "zone": "Cotonou (Bénin)", "cuisine": "poissons & saveurs du lac"},
    {"company": "L'Ouémé Porto-Novo", "name": "Direction", "email": "louemeresto@gmail.com", "zone": "Porto-Novo (Bénin)", "cuisine": "cuisine béninoise d'antan"}
]

print(f"Total brut vague 2: {len(raw_restaurants_vague2)}")

# Chargement base d'exclusion
with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])
known_domains = set(d.lower().strip() for d in db['domains'])

final_batch = []
seen_emails = set()

for r in raw_restaurants_vague2:
    em = r['email'].lower().strip()
    dom = em.split('@')[-1]
    comp = r['company']
    zone = r['zone']

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

    if ':' in subject or ':' in body:
        raise ValueError(f"ERREUR: Deux-points détecté pour {comp} !")

    final_batch.append({
        "company": comp,
        "name": r['name'],
        "email": em,
        "domain": dom,
        "zone": zone,
        "cuisine": r.get('cuisine', 'qualité'),
        "subject": subject,
        "body": body
    })

print(f"Nombre final qualifié: {len(final_batch)}")
# Garder exactement 100
final_100 = final_batch[:100]

with open('batch_100_restaurants_wave2.json', 'w', encoding='utf-8') as f:
    json.dump(final_100, f, ensure_ascii=False, indent=2)

print(f"batch_100_restaurants_wave2.json généré avec succès ({len(final_100)} prospects) !")
