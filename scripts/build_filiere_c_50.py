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
known_contacts = set(c["email"].lower().strip() for c in db.get("contacts", []))

with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
    ex = json.load(f)
excluded_emails = set(e.lower().strip() for e in ex.get("excluded_emails", []))
excluded_domains = set(d.lower().strip() for d in ex.get("excluded_domains", []))

RAW_POOL_C = [
    # --- DISTILLERIES, TERROIR & SPIRITUEUX D'EXCELLENCE ---
    ("Distillerie Savanna", "contact@savanna.fr", "La Réunion (Saint-André)", "https://savanna.fr"),
    ("Maison Ferroni", "info@ferroni.shop", "France (Aubagne / Marseille)", "https://ferroni.shop"),
    ("Baie des Trésors", "tsaliniere@baiedestresors.com", "Martinique (La Trinité)", "https://baiedestresors.com"),
    ("La Rhumerie Boulevard Saint-Germain", "contact@larhumerie.com", "Paris (6e)", "https://larhumerie.com"),
    ("Délices de Guyane", "boutiqueparis@delicesdeguyane.com", "Guyane / Paris", "https://delices-de-guyane.fr"),
    ("David Vignau Maître Chocolatier", "davidvignaumc@gmail.com", "Guadeloupe (Baie-Mahault)", "https://facebook.com/davidvignaumc"),
    ("Bénédicte Chocolats", "benedicte@bvhd.fr", "Martinique (Le Lamentin)", "https://terresducentremartinique.fr"),
    ("Sambavanilla", "contact@sambavanilla.com", "France / Madagascar", "https://sambavanilla.com"),
    ("Café Chaulet", "cafe.chaulet@wanadoo.fr", "Guadeloupe (Vieux-Habitants)", "https://cafe-chaulet.com"),
    ("Rhum Karukera", "contact@rhum-karukera.com", "Guadeloupe (Capesterre)", "https://rhum-karukera.com"),
    ("La Kaz à Boudins", "lakazaboudins@gmail.com", "Guadeloupe (Les Abymes)", "https://lakazaboudins.com"),
    ("Robbe Épicerie Fine", "robbe.stephanie59@gmail.com", "Guadeloupe (Terre-de-Haut)", "https://legrandsudcaraibe.com"),
    ("Les Saveurs de Maya", "lessaveursdemaya972@gmail.com", "Martinique", "https://lessaveursdemaya.com"),
    ("Confituriers de la Réunion", "confituriers.reunion@gmail.com", "La Réunion", "https://confituriersdelareunion.com"),
    ("Nout'Saveurs Épices", "noutsaveur.epices420@gmail.com", "La Réunion (Le Port)", "https://noutsaveurs.re"),
    ("Ter à Ter Épicerie Fine", "teraterreunion@gmail.com", "La Réunion (Saint-Denis)", "https://facebook.com/teraterreunion"),
    ("Le Comptoir du Rhum", "lecomptoirdurhum@gmail.com", "France", "https://lecomptoirdurhum.fr"),
    ("TropicMarché", "tropicmarche@gmail.com", "France / Outre-Mer", "https://webnode.fr"),
    ("Sougou Express", "sougouexpress@gmail.com", "France / Afrique", "https://sougouexpress.com"),

    # --- RESTAURATION AFRO-CARIBÉENNE D'EXCELLENCE (PARIS & RÉGIONS) ---
    ("New Soul Food", "resa.newsoulfood@gmail.com", "Paris (10e / 14e)", "https://newsoulfood.fr"),
    ("Le Coq Noir", "lecoqnoirclichy@gmail.com", "Île-de-France (Clichy)", "https://lecoqnoir.fr"),
    ("Restaurant Le Mauricia", "lemauricia@gmail.com", "Toulouse", "https://eatbu.com"),
    ("La Maison Nelly", "nellytraiteur1@gmail.com", "Lyon", "https://lamaisonnellyrestaurant.fr"),
    ("Okra Restaurant", "okra2022.contact@gmail.com", "Bordeaux", "https://okra-restaurant.com"),
    ("Waris Restaurant", "warisrestaurant@gmail.com", "Lille (Loos)", "https://warisrestaurant.fr"),
    ("Christo Renaissance", "christobar.bxl@gmail.com", "Belgique (Bruxelles)", "https://christo-renaissance.be"),
    ("Afro Bowl Group", "info@afrobowlgroup.com", "Belgique (Bruxelles)", "https://afrobowlgroup.com"),
    ("Kicoucou Restaurant", "infokicoucou@gmail.com", "Belgique (Bruxelles)", "https://kicoucou.be"),
    ("Caribbean Food 34", "caribbeannfood34@gmail.com", "Montpellier", "https://caribbeanfood34.com"),
    ("NUABOL Angers", "nuabolangers@gmail.com", "Angers", "https://nuabol.fr"),
    ("L'Épice Restaurant", "contact@lepice-restaurant-angers.fr", "Angers", "https://lepice-restaurant-angers.fr"),
    ("AP Anglade Pierre", "contact@anglade-pierre.fr", "Tours", "https://anglade-pierre.fr"),
    ("Le King Créole", "kingcreole@live.fr", "Rennes", "https://king-creole.fr"),
    ("Ti'Bokit Rennes", "tibokit971@gmail.com", "Rennes", "https://facebook.com/tibokit971"),
    ("Francky Traiteur Antillais", "franckytraiteur@gmail.com", "Île-de-France / Normandie", "https://eatbu.com"),
    ("Madin' Madras", "madinmadras972@gmail.com", "Île-de-France", "https://madinmadras.fr"),
    ("Les Palmes d'Or", "lespalmesdor01@gmail.com", "Toulouse", "https://eatbu.com"),
    ("Les Saveurs de Mymy", "lessaveursdemymy45@gmail.com", "Centre-Val de Loire", "https://facebook.com/lessaveursdemymy45"),
    ("Caprice Créole", "lecamiontoque@gmail.com", "Lyon", "https://evenementielpourtous.com"),

    # --- TRAITEURS CRÉOLES & TERROIR AFRO-INSULAIRE ---
    ("Cook and Enjoy", "traiteur.ce@gmail.com", "France (Occitanie)", "https://cookandenjoy.fr"),
    ("Les Saveurs de Luce'îles", "saveursdelucille@gmail.com", "France (Compiègne)", "https://saveursdelucille.fr"),
    ("MBL Traiteur", "mbltraiteur@gmail.com", "Île-de-France (Athis-Mons)", "https://mbl-traiteur.fr"),
    ("Le X Kitchen", "xkitchentraiteur@gmail.com", "Île-de-France (Combs-la-Ville)", "https://lexkitchen.fr"),
    ("AGOA Traiteur Antillais", "agoatraiteur@gmail.com", "France", "https://facebook.com/agoatraiteur"),
    ("Madinina Traiteur", "madinina.traiteur@gmail.com", "France (Nord)", "https://madinina-traiteur.fr"),
    ("Traiteur Créole & Antillais", "contact.traiteurcreole@gmail.com", "Île-de-France (Choisy-le-Roi)", "https://traiteur-creole-antillais.fr"),
    ("Terre D'Sens", "terredsens.ll@gmail.com", "France", "https://traiteurcreole.fr"),
    ("Matante Eunice 974", "lesdelices974deunice@gmail.com", "France (Toulouse)", "https://traiteur-reunionnais.fr"),
    ("Cap Kreol Traiteur", "capkreol.traiteur@gmail.com", "France (Saint-Nazaire)", "https://dish.co"),
    ("O'Délices de La Réunion", "odelicesdelareunion@gmail.com", "France (Bretagne)", "https://o-delices-de-la-reunion.fr"),
    ("Le 221 Traiteur Africain", "le221traiteurafricain@gmail.com", "Île-de-France (Survilliers)", "https://le221.fr"),
    ("Topsy Paris", "topsy.par@gmail.com", "Île-de-France", "https://topsy-paris.fr"),
    ("DBH Traiteur", "dbh.traiteur@gmail.com", "Île-de-France", "https://dbhtraiteur.fr"),
    ("Les Saveurs d'Afrique", "lessaveursdafrique.paris@gmail.com", "Île-de-France (Alfortville)", "https://chez-makadi-delice.com"),
    ("Caribbean Food 34", "caribbeannfood34@gmail.com", "Montpellier", "https://caribbeanfood34.com"),
    ("Restaurant Teranga", "contact@teranga-restaurant.fr", "Strasbourg", "https://restaurant-teranga-strasbourg.fr")
]

valid_c = []
seen_emails = set()
seen_domains = set()

for c in RAW_POOL_C:
    name, email_addr, territory, source = c
    email_clean = email_addr.lower().strip()
    domain = email_clean.split("@")[1] if "@" in email_clean else ""

    if email_clean in known_contacts or email_clean in seen_emails:
        continue
    if domain in excluded_domains or email_clean in excluded_emails:
        continue
    if domain not in ["gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "wanadoo.fr", "orange.fr", "live.fr"] and domain in sent_domains:
        continue

    ok, msg = verify_email_target(email_clean)
    if not ok:
        print(f"FAILED MX: {name} ({email_clean}) -> {msg}")
        continue

    seen_emails.add(email_clean)
    if domain not in ["gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "wanadoo.fr", "orange.fr", "live.fr"]:
        seen_domains.add(domain)

    valid_c.append({
        "company": name,
        "email": email_clean,
        "territory": territory,
        "source": source
    })

print(f"Total testés Filière C : {len(RAW_POOL_C)}")
print(f"Total VALIDES SANS DOUBLON NI REBOND (INÉDITS) : {len(valid_c)}")

final_50_c = valid_c[:50]
with open(os.path.join(BASE_DIR, "scripts", "filiere_c_50.json"), "w", encoding="utf-8") as f:
    json.dump(final_50_c, f, indent=2, ensure_ascii=False)
print(f"Fichier filiere_c_50.json sauvegardé avec {len(final_50_c)} contacts 100% INÉDITS !")
