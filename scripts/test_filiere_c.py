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

CANDIDATES_C = [
    # --- DISTILLERIES & SPIRITUEUX D'EXCELLENCE ---
    ("Distillerie Bologne", "contact@rhumbologne.fr", "Guadeloupe (Basse-Terre)", "https://rhumbologne.fr"),
    ("Distillerie Longueteau", "contact@rhumlongueteau.fr", "Guadeloupe (Capesterre)", "https://distillerielongueteau.com"),
    ("Distillerie Neisson", "contact@neisson.com", "Martinique (Le Carbet)", "https://neisson.com"),
    ("Distillerie La Favorite", "contact@lafavorite.com", "Martinique (Fort-de-France)", "https://rhum-lafavorite.com"),
    ("Rhum A1710", "contact@a1710.fr", "Martinique (Le François)", "https://rhum-a1710.com"),
    ("Rhum Karukera", "contact@rhum-karukera.com", "Guadeloupe (Sainte-Marie)", "https://rhum-karukera.com"),
    ("Distillerie Bielle", "info@rhumbielle.com", "Marie-Galante (Grand-Bourg)", "https://rhumbielle.com"),
    ("Distillerie Poisson Père Labat", "domaine-poisson@orange.fr", "Marie-Galante (Grand-Bourg)", "https://rhum-biologique.com"),
    ("Distillerie Montebello", "boutique@distillerie-montebello.fr", "Guadeloupe (Petit-Bourg)", "https://distillerie-montebello.fr"),
    ("Distillerie Savanna", "contact@savanna.fr", "La Réunion (Saint-André)", "https://savanna.fr"),
    ("Maison Ferroni", "info@ferroni.shop", "France (Aubagne / Marseille)", "https://ferroni.shop"),
    ("Baie des Trésors", "tsaliniere@baiedestresors.com", "Martinique (La Trinité)", "https://baiedestresors.com"),

    # --- CHOCOLATERIES & CACAO D'EXCELLENCE ---
    ("Frères Lauzéa", "contact@frereslauzea.com", "Martinique (Fort-de-France)", "https://frereslauzea.fr"),
    ("David Vignau Maître Chocolatier", "davidvignaumc@gmail.com", "Guadeloupe (Baie-Mahault)", "https://facebook.com/davidvignaumc"),
    ("Bénédicte Chocolats", "benedicte@bvhd.fr", "Martinique (Le Lamentin)", "https://terresducentremartinique.fr"),
    ("Valcaco Filière Cacao", "contact@asso-valcaco.fr", "Martinique", "https://asso-valcaco.fr"),

    # --- ÉPICES & VANILLES DE TERROIR ---
    ("Sambavanilla", "contact@sambavanilla.com", "France / Madagascar", "https://sambavanilla.com"),
    ("Vanille Lavany", "contact@vanillelavany.com", "France / Madagascar", "https://vanillelavany.com"),
    ("Terre Exotique", "contact@terreexotique.fr", "France / Monde", "https://terreexotique.fr"),

    # --- GASTRONOMIE AFRO-CARIBÉENNE & RESTAURATION D'EXCELLENCE ---
    ("BMK Paris", "contact@bmkparis.com", "Paris (10e / 11e)", "https://bmkparis.com"),
    ("BoolOfood", "boolofood@gmail.com", "Paris (19e)", "https://boolofood.com"),
    ("New Soul Food", "resa.newsoulfood@gmail.com", "Paris (10e / 14e)", "https://newsoulfood.fr"),
    ("Godjo Paris", "godjo.paris@gmail.com", "Paris (5e)", "https://godjo.paris"),
    ("Le Coqk'Ivoire", "lecoqkivoire@gmail.com", "Paris (18e)", "https://coqkivoire.fr"),
    ("Le Coq Noir", "lecoqnoirclichy@gmail.com", "Île-de-France (Clichy)", "https://lecoqnoir.fr"),

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
    ("La Bouchée Créole", "laboucheecreole@gmail.com", "Île-de-France (Bondy)", "https://laboucheecreole.com"),
    ("O'Délices de La Réunion", "odelicesdelareunion@gmail.com", "France (Bretagne)", "https://o-delices-de-la-reunion.fr"),
    ("Le 221 Traiteur Africain", "le221traiteurafricain@gmail.com", "Île-de-France (Survilliers)", "https://le221.fr"),
    ("Topsy Paris", "topsy.par@gmail.com", "Île-de-France", "https://topsy-paris.fr"),
    ("DBH Traiteur", "dbh.traiteur@gmail.com", "Île-de-France", "https://dbhtraiteur.fr"),
    ("Les Saveurs d'Afrique", "lessaveursdafrique.paris@gmail.com", "Île-de-France (Alfortville)", "https://chez-makadi-delice.com"),
    ("TropicMarché", "tropicmarche@gmail.com", "France / Outre-Mer", "https://webnode.fr"),
    ("Sougou Express", "sougouexpress@gmail.com", "France / Afrique", "https://sougouexpress.com"),
    ("Le Comptoir du Rhum", "lecomptoirdurhum@gmail.com", "France", "https://lecomptoirdurhum.fr")
]

valid_list_c = []
for c in CANDIDATES_C:
    name, email_addr, territory, source = c
    email_clean = email_addr.lower().strip()
    domain = email_clean.split("@")[1] if "@" in email_clean else ""

    if email_clean in sent_emails:
        continue
    if domain in excluded_domains or email_clean in excluded_emails:
        continue
    if domain not in ["gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "orange.fr"] and domain in sent_domains:
        continue

    ok, msg = verify_email_target(email_clean)
    if not ok:
        print(f"FAILED MX: {name} ({email_clean}) -> {msg}")
        continue

    valid_list_c.append({
        "company": name,
        "email": email_clean,
        "territory": territory,
        "source": source
    })

print(f"Total testés Filière C : {len(CANDIDATES_C)}")
print(f"Total VALIDES SANS DOUBLON NI REBOND : {len(valid_list_c)}")
for item in valid_list_c:
    print(f"- {item['company']} | {item['email']} | {item['territory']}")
