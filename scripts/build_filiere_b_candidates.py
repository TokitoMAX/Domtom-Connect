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

RAW_CANDIDATES_B = [
    # --- FRET & LOGISTIQUE DIASPORA / OUTRE-MER / AFRIQUE ---
    ("QuickShipping", "contact@quickshipping.fr", "Guadeloupe (Les Abymes)", "https://quickshipping.fr"),
    ("Long Cours Métropole", "contact@long-cours.fr", "France / DOM-TOM", "https://long-cours.com"),
    ("Colis Outremer", "colis.outremer@gmail.com", "France / Outre-Mer", "https://colis-outremer.fr"),
    ("Flydomtom", "flydomtom@gmail.com", "France / DOM-TOM", "https://flydom-tom.fr"),
    ("DEPOLOG", "depolog.tls@gmail.com", "Toulouse / Antilles", "https://depolog.fr"),
    ("Colisbridge", "contact@colisbridge.fr", "France / Outre-Mer", "https://colisbridge.fr"),
    ("Shopiles", "sav@shopiles.fr", "Pantin / Outre-Mer", "https://shopiles.fr"),
    ("Outre Mer Box", "contact@outremerbox.com", "France / Outre-Mer", "https://outremerbox.com"),
    ("Outremer Fret", "exploitation@outremerfret.com", "France / Outre-Mer", "https://outremerfret.com"),
    ("Outremer Transit", "contact@outremertransit.com", "France / La Réunion", "https://outremertransit.com"),
    ("Lucas Outre-mer", "contact@lucas-outre-mer.fr", "Bondy / Antilles", "https://lucas-outre-mer.fr"),
    ("TPRM Transports", "teotprm@gmail.com", "Guadeloupe (Jarry)", "https://jarrybusiness.com"),
    ("DCF Mayotte Déménagement", "contact@yt.dcf-demenagement.com", "Mayotte (Mamoudzou)", "https://dcf-mayotte.com"),
    ("Madi Transit", "contact@madi-transit.com", "Mayotte", "https://maditransit.com"),
    ("Expedom", "info@expedom.com", "La Réunion (Saint-Denis)", "https://expedom.com"),
    ("AGS Déménagement Guyane", "ags-guyane@ags-demenagement.com", "Guyane (Cayenne)", "https://ags-demenagement.com"),
    ("TAF Afrique", "afrique@taftrans.fr", "France / Afrique", "https://taftrans.fr"),
    ("Colis Abidjan", "fret@colis-abidjan.com", "France / Côte d'Ivoire", "https://colis-abidjan.com"),
    ("Dakar Bagages", "dakarbagages@gmail.com", "Paris / Dakar", "https://dakarbagages.com"),
    ("Africolis", "contact.africolis@gmail.com", "France / Afrique", "https://africolis.fr"),
    ("Paps Logistics", "hello@paps-app.com", "Sénégal / Côte d'Ivoire", "https://papslogistics.com"),
    ("Logidoo", "logidoo@logidoo.co", "Sénégal (Dakar)", "https://logidoo.co"),

    # --- TECH, SAAS, FINTECH & MARKETPLACES AFRIQUE / CARAÏBES ---
    ("Julaya", "contact@julaya.co", "France / Côte d'Ivoire", "https://julaya.co"),
    ("ANKA", "help@anka.africa", "Côte d'Ivoire (Abidjan)", "https://anka.africa"),
    ("Djamo", "business@djamo.com", "Côte d'Ivoire (Abidjan)", "https://djamo.com"),
    ("FedaPay", "contact@fedapay.com", "Bénin / Togo", "https://fedapay.com"),
    ("InTouch Group", "contact@intouchgroup.net", "Sénégal / France", "https://intouchgroup.net"),
    ("CinetPay", "support.marchands@cinetpay.com", "Côte d'Ivoire (Abidjan)", "https://cinetpay.com"),
    ("Gozem", "support@gozem.co", "Togo / Bénin", "https://gozem.co"),
    ("PaySika", "support@paysika.co", "Cameroun / CEMAC", "https://paysika.co"),
    ("Chargily", "support@chargily.com", "Algérie / Diaspora", "https://chargily.com"),
    ("Chari", "support@chari.ma", "Maroc / Afrique B2B", "https://chari.co"),

    # --- DNVB E-COMMERCE & BEAUTÉ DIASPORA ---
    ("Les Secrets de Loly", "contact@secretsdeloly.com", "Paris (France)", "https://secretsdeloly.com"),
    ("WAAM Cosmetics", "contact@waamcosmetics.com", "Paris (France)", "https://waamcosmetics.com"),
    ("Madame La Présidente", "bonjour@madamelapresidente.fr", "La Courneuve (France)", "https://madamelapresidente.fr"),
    ("Kalia Nature", "serviceclient@kalia-nature.com", "France / Caraïbes", "https://kalianature.com"),
    ("Noireônaturel", "service-client@noireonaturel.com", "France / Diaspora", "https://noireonaturel.com")
]

valid_list = []
seen_emails = set()
seen_domains = set()

for c in RAW_CANDIDATES_B:
    name, email_addr, territory, source = c
    email_clean = email_addr.lower().strip()
    domain = email_clean.split("@")[1] if "@" in email_clean else ""

    if email_clean in sent_emails or email_clean in seen_emails:
        continue
    if domain in excluded_domains or email_clean in excluded_emails:
        continue
    if domain not in ["gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "outlook.fr"] and domain in sent_domains:
        continue

    ok, msg = verify_email_target(email_clean)
    if not ok:
        print(f"FAILED MX: {name} ({email_clean}) -> {msg}")
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

print(f"Total testés Filière B : {len(RAW_CANDIDATES_B)}")
print(f"Total VALIDES SANS DOUBLON NI REBOND : {len(valid_list)}")
with open(os.path.join(BASE_DIR, "scripts", "filiere_b_validated.json"), "w", encoding="utf-8") as f:
    json.dump(valid_list, f, indent=2, ensure_ascii=False)
