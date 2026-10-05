import sys, os, json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target
from dedup_engine import is_domain_or_company_duplicate

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
EXCLUSIONS_FILE = os.path.join(BASE_DIR, "scripts", "exclusions.json")

with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)
sent_emails = set(e.lower().strip() for e in db.get("emails", []))
sent_companies = set(c.lower().strip() for c in db.get("companies", []))
sent_domains = set(d.lower().strip() for d in db.get("domains", []))

with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
    ex = json.load(f)
excluded_emails = set(e.lower().strip() for e in ex.get("excluded_emails", []))
excluded_domains = set(d.lower().strip() for d in ex.get("excluded_domains", []))

RAW_CANDIDATES = [
    # --- MARTINIQUE ---
    ("Ty Domino", "tydomino@gmail.com", "Martinique (Le Robert)", "https://ty-domino.fr"),
    ("The Big Blue 972", "thebigblue972@gmail.com", "Martinique (Le François)", "https://thebigblue972.fr"),
    ("Au Gré du Vent", "croisiereaugreduvent@gmail.com", "Martinique (Le François)", "https://croisiereaugreduvent.com"),
    ("Sea The Way", "seatheway.mq@gmail.com", "Martinique (Le François)", "https://seatheway.fr"),
    ("Skipper Antilles Charter", "skipperantillescharter@gmail.com", "Martinique (Le Marin)", "https://skipper-antilles.com"),
    ("Sun Exil Attitud", "sunexilattitud@gmail.com", "Martinique (Sainte-Luce)", "https://seattitudexcursions.com"),
    ("Blue Dream Croisières", "bluedreamcroisieres@gmail.com", "Martinique (Le Marin)", "https://bluedream-croisieres.com"),
    ("Madisail", "contact@madisail.com", "Martinique (Le Marin)", "https://madisail.com"),
    ("Tropic Voile", "contact@tropicvoile.fr", "Martinique (Le Marin)", "https://tropicvoile.fr"),
    ("France Escales Antilles", "contact@france-escales-antilles.fr", "Martinique (Le Marin)", "https://escales-grenadines.com"),
    ("Ecolodge Martinique", "ecolodgemartinique@gmail.com", "Martinique (Fort-de-France)", "https://ecolodge-martinique.com"),
    ("Dom Nature Lodge & Spa", "contact.domnature@gmail.com", "Martinique (Sainte-Luce)", "https://domnaturelodge.com"),
    ("Zannanna Lodge", "zannannalodge@gmail.com", "Martinique (Le Diamant)", "https://zannannalodge.com"),
    ("Ecolodge Kay Milo", "madinvillas@gmail.com", "Martinique (Sainte-Anne)", "https://kay-milo.fr"),

    # --- GUADELOUPE ---
    ("Julien Guide de Pêche", "julien.guidedepeche@gmail.com", "Guadeloupe (Pointe-à-Pitre)", "https://julienguidedepeche.com"),
    ("ACM Caraïbes", "commercial@acm-caraibes.com", "Guadeloupe (Pointe-à-Pitre)", "https://acm-caraibes.com"),
    ("Libellule Excursion", "contact.libelluleexcursion@gmail.com", "Guadeloupe (Sainte-Rose)", "https://facebook.com/libelluleexcursion"),
    ("Manta Evasion", "mantaevasion@gmail.com", "Guadeloupe (Petit-Canal)", "https://lagon-travel.com"),
    ("Sademar", "reservationsademar@gmail.com", "Guadeloupe (Saint-François)", "https://sademar.fr"),
    ("AWAK Guadeloupe", "awak.reservation@gmail.com", "Guadeloupe (Saint-François)", "https://awak-guadeloupe.com"),
    ("Butterfly Tours", "butterflytours971@gmail.com", "Guadeloupe (Saint-François)", "https://loeildegwada.net"),
    ("Paradoxe Croisières", "paradoxecroisieres97118@gmail.com", "Guadeloupe (Saint-François)", "https://loeildegwada.net"),
    ("Nakolodge", "nakolodge@gmail.com", "Guadeloupe (Sainte-Anne)", "https://nakolodge-guadeloupe.com"),
    ("Au Jardin des Colibris", "ecolodge@aujardindescolibris.com", "Guadeloupe (Deshaies)", "https://aujardindescolibris.com"),
    ("Iguana Ecolodge", "contact@iguana-ecolodge.com", "Guadeloupe (Saint-François)", "https://iguana-ecolodge.com"),
    ("Tropicangel Ecolodge", "tropicangel.reception@gmail.com", "Guadeloupe (Pointe-Noire)", "https://tropicangel.com"),
    ("Les Bananes Vertes", "info@lesbananesvertes.fr", "Guadeloupe (Saint-Claude)", "https://lesbananesvertes.fr"),

    # --- SAINT-MARTIN & SAINT-BARTHÉLEMY ---
    ("Sea Breeze Boat Charter", "seabreezeboatsxm@gmail.com", "Saint-Martin", "https://seabreezeboatsxm.com"),
    ("Aquadventure Boat", "contact.aquadventure@gmail.com", "Saint-Martin", "https://aquadventure-sxm.com"),
    ("Go and Sea Boat Charters", "goandseaboatcharters@gmail.com", "Saint-Martin", "https://goandseaboatcharters.com"),
    ("Blue Pelican Boat Rental", "Islandtime.contact@gmail.com", "Saint-Martin", "https://bluepelicansxm.com"),
    ("SXM Divers", "info@sxmdivers.com", "Saint-Martin", "https://sxmdivers.com"),
    ("St Barth Yachting", "contact@stbarth-yachting.com", "Saint-Barthélemy", "https://stbarth-yachting.com"),
    ("St Barth Excursions", "saintbarthexcursions@gmail.com", "Saint-Barthélemy", "https://saintbarthexcursions.com"),
    ("St Barth R Way", "info@stbarthrway.com", "Saint-Barthélemy", "https://stbarthrway.com"),
    ("St Barth Evasion", "hello@stbarthevasion.com", "Saint-Barthélemy", "https://stbarthevasion.com"),
    ("Blue Escape FWI", "stephane@blueescapefwi.com", "Saint-Barthélemy", "https://blueescapefwi.com"),
    ("Splash FWI", "splashfwi@gmail.com", "Saint-Barthélemy", "Annuaire Saint-Barth"),
    ("Island Diving St-Barth", "contact@islandiving.com", "Saint-Barthélemy", "https://islandiving.fr"),
    ("SBH SUB", "contact@sbhsub.org", "Saint-Barthélemy", "https://sbhsub.org"),

    # --- GUYANE (ÉCOTOURISME & FLEUVE) ---
    ("EKAWLODGE", "ekawlodge@gmail.com", "Guyane (Marais de Kaw)", "https://ekawlodge.com"),
    ("Camp Cariacou", "infos.campcariacou@gmail.com", "Guyane (Kourou)", "https://campcariacou.com"),
    ("L'Oiseau de Paradis", "contact@ecolodgeoiseauparadis.com", "Guyane (Sinnamary)", "https://ecolodgeoiseauparadis.com"),
    ("Le Sourou", "carbet.sourou@gmail.com", "Guyane (Roura)", "https://parcnaturel-guyane.fr"),
    ("Obungal'eau", "obungaleau973@gmail.com", "Guyane (Maripa-Soula)", "https://parc-amazonien-guyane.fr"),
    ("T'Air Nature Guyane", "infos@t-airnatureguyane.com", "Guyane (Cayenne)", "https://tairnature-guyane.com"),

    # --- LA RÉUNION ---
    ("Réunion Fishing Club", "contact@reunionfishingclub.com", "La Réunion (Saint-Gilles)", "https://reunionfishingclub.com"),
    ("BLUE Pêche au gros", "bluemarlin97434@gmail.com", "La Réunion (Saint-Gilles)", "https://bluepecheaugros.fr"),
    ("Sindbad Réunion Pêche", "contact@sindbadreunionpeche.com", "La Réunion (Saint-Gilles)", "https://sindbadreunionpeche.com"),
    ("Jolly Rodgers Pêche", "contact@jrpeche.fr", "La Réunion (Le Port)", "https://jrpeche.fr"),
    ("Namasté Catamaran", "info@namastecatamaran.re", "La Réunion (Le Port)", "https://namastecatamaran.re"),
    ("Festiyacht de Bourbon", "contact@fyb.re", "La Réunion (Le Port)", "https://fyb.re"),
    ("Lady la Fée", "contact@ladylafee.re", "La Réunion (Saint-Gilles)", "https://ladylafee.re"),
    ("Lodge 1 2 3 Cat", "lodge123cat@gmail.com", "La Réunion (Le Tampon)", "https://lodge123cat.com"),
    ("BibizFamily Lodge", "bibizfamilylodge@gmail.com", "La Réunion (Saint-Joseph)", "https://bibizfamilylodge.fr"),
    ("Lodge Spa La Chaloupe", "reservation@lodge-spa-chaloupe.re", "La Réunion (Saint-Leu)", "https://lodge-spa-chaloupe.re"),
    ("Diana Dea Lodge", "reception@diana-dea-lodge.re", "La Réunion (Sainte-Anne)", "https://diana-dea-lodge.re"),

    # --- POLYNÉSIE FRANÇAISE ---
    ("Tahiti Plongée Passion", "tahitiplongeepassion@gmail.com", "Polynésie (Tahiti)", "https://tahitiplongeepassion.com"),
    ("Diveasy Bora Bora", "diveasyborabora@gmail.com", "Polynésie (Bora Bora)", "https://padi.com"),
    ("HiRO DiVE Bora Bora", "hirodiveborabora@gmail.com", "Polynésie (Bora Bora)", "https://hirodiveborabora.com"),
    ("H2O Bora Bora", "h2oborabora@gmail.com", "Polynésie (Bora Bora)", "https://boraborah2o.com"),
    ("Moorea Fun Dive", "mfdmoorea@gmail.com", "Polynésie (Moorea)", "https://facebook.com/MFDMoorea"),
    ("Scubapiti Moorea", "scubapitimoorea@gmail.com", "Polynésie (Moorea)", "https://scubapiti.com"),
    ("Moorea Underwater Experience", "mooreaunderwaterexperience@gmail.com", "Polynésie (Moorea)", "https://mooreaunderwater.com"),
    ("Ia Ora Diving", "booking.iaoradiving@gmail.com", "Polynésie (Moorea)", "https://iaoradiving.com"),
    ("Tahiti Charter", "tahiticharter@gmail.com", "Polynésie (Tahiti)", "https://tahiti-charter.com"),
    ("Tahiti Sail And Dive", "contact@tahitisailanddive.com", "Polynésie (Papeete)", "https://tahitisailanddive.com"),
    ("ELYT Charter Tahiti", "info@elytchartertahiti.com", "Polynésie (Papeete)", "https://elytchartertahiti.com"),

    # --- SÉNÉGAL (LODGES & NAUTISME) ---
    ("Nautilus Diving Dakar", "nautilusdakar@gmail.com", "Sénégal (Dakar Ngor)", "https://nautilus-diving.com"),
    ("Hakuna Lodge", "welcome@hakunalodge.com", "Sénégal (Sine Saloum Mar-Lodj)", "https://hakunalodge.com"),
    ("Souimanga Lodge", "info@souimanga-lodge.com", "Sénégal (Sine Saloum Fimela)", "https://souimanga-lodge.com"),
    ("Hotel Cap du Sine Saloum", "info@capdusinesaloum.com", "Sénégal (Ndangane)", "https://capdusinesaloum.com"),
    ("Campement Les Bougainvilliers", "campement.bougainvilliers@gmail.com", "Sénégal (Ndangane)", "https://senegal-online.com"),
    ("Fagapa Village", "lefagapavillage@gmail.com", "Sénégal (Djilor)", "https://senegal-online.com"),
    ("Les Aventuriers du Saloum", "lesaventuriersdusaloum@gmail.com", "Sénégal (Toubacouta)", "https://guidesinesaloum.com"),
    ("Dalaal Diam Lodge", "dalaaldiam.lodge@gmail.com", "Sénégal (Somone)", "https://dalaal-diam.com"),
    ("Lodge Terre et Mer", "reception@lodgeterreetmer.com", "Sénégal (Somone)", "https://lodgeterreetmer.com"),
    ("Campement Le Paradise", "paradisecap1@gmail.com", "Sénégal (Cap Skirring)", "https://cap-skirring.voyage"),
    ("Au P'tit Bonheur", "ptitbonheurcap@gmail.com", "Sénégal (Cap Skirring)", "https://auptitbonheurducap.com"),
    ("Chez Campos", "campossenegal@gmail.com", "Sénégal (Cap Skirring)", "https://chezcampos.com"),

    # --- CAP-VERT ---
    ("Kite Verde", "kiteverde@gmail.com", "Cap-Vert (Île de Sal)", "https://kite-verde.com"),
    ("100 Feet Kite School", "100piedi.kiteschool@gmail.com", "Cap-Vert (Île de Sal)", "https://100piedikiteschool.com"),
    ("Santa Kite Cabo Verde", "santakitecaboverde@gmail.com", "Cap-Vert (Île de Sal)", "https://santakitecaboverde.com"),
    ("Surf Hub Cape Verde", "surfhubcv@gmail.com", "Cap-Vert (Île de Sal)", "https://surfhubcapeverde.com"),
    ("Inês Water Sports Center", "inescorreiawatersports@gmail.com", "Cap-Vert (Île de Sal)", "https://ineswatersportscenter.com"),
    ("Cabo Verde Diving", "info@caboverdediving.net", "Cap-Vert (Île de Sal)", "https://caboverdediving.net"),
    ("Cidade Velha Diving", "cidadevelhadiving@gmail.com", "Cap-Vert (Île de Santiago)", "https://cidadevelhadiving.com"),
    ("Terra Lodge", "booking@terralodge.net", "Cap-Vert (São Vicente Mindelo)", "https://terra-lodge.net")
]

valid_list = []
seen_emails = set()
seen_domains = set()

for c in RAW_CANDIDATES:
    name, email_addr, territory, source = c
    email_clean = email_addr.lower().strip()
    domain = email_clean.split("@")[1] if "@" in email_clean else ""

    # Dedup & Exclusion
    if email_clean in sent_emails or email_clean in seen_emails:
        continue
    if domain in excluded_domains or email_clean in excluded_emails:
        continue
    if domain not in ["gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "outlook.fr"] and domain in sent_domains:
        continue

    # MX check
    ok, msg = verify_email_target(email_clean)
    if not ok:
        continue

    seen_emails.add(email_clean)
    if domain not in ["gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "outlook.fr"]:
        seen_domains.add(domain)

    valid_list.append({
        "company": name,
        "email": email_clean,
        "territory": territory,
        "source": source
    })

print(f"Total testés : {len(RAW_CANDIDATES)}")
print(f"Total VALIDES SANS DOUBLON NI REBOND : {len(valid_list)}")
print(json.dumps(valid_list[:10], indent=2, ensure_ascii=False))
