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

RAW_POOL_B = [
    # --- FRET OUTRE-MER & LOGISTIQUE DIASPORA ---
    ("Long Cours Métropole", "contact@long-cours.fr", "France / Outre-Mer", "https://long-cours.com"),
    ("Colis Outremer", "colis.outremer@gmail.com", "France / Outre-Mer", "https://colis-outremer.fr"),
    ("Flydomtom", "flydomtom@gmail.com", "France / DOM-TOM", "https://flydom-tom.fr"),
    ("DEPOLOG", "depolog.tls@gmail.com", "Toulouse / Antilles", "https://depolog.fr"),
    ("Colisbridge", "contact@colisbridge.fr", "France / Outre-Mer", "https://colisbridge.fr"),
    ("Shopiles", "sav@shopiles.fr", "Pantin / Outre-Mer", "https://shopiles.fr"),
    ("Outre Mer Box", "contact@outremerbox.com", "France / Outre-Mer", "https://outremerbox.com"),
    ("Lucas Outre-mer", "contact@lucas-outre-mer.fr", "Bondy / Antilles", "https://lucas-outre-mer.fr"),
    ("TPRM Transports", "teotprm@gmail.com", "Guadeloupe (Jarry)", "https://jarrybusiness.com"),
    ("Biard Déménagements", "contact@biard.net", "France / DOM-TOM", "https://biard.net"),
    ("Expedom", "info@expedom.com", "La Réunion (Saint-Denis)", "https://expedom.com"),
    ("DCF Mayotte Déménagement", "contact@yt.dcf-demenagement.com", "Mayotte (Mamoudzou)", "https://dcf-mayotte.com"),
    ("Madi Transit", "contact@madi-transit.com", "Mayotte", "https://maditransit.com"),
    ("Univers Du Déménagement", "commerciale.udd@gmail.com", "Guadeloupe (Baie-Mahault)", "https://facebook.com/universdudemenagement"),
    ("Réunion Déménagement", "reuniondemenagement@gmail.com", "La Réunion", "https://demenagement-974-reunion-metropole-974.fr"),
    ("Les Dalons du Déménagement", "otedalons@gmail.com", "La Réunion", "https://lesdalonsdudemenagement.com"),
    ("Benny Bens Express", "bennybenzexpress@gmail.com", "Martinique", "https://bennybensexpress.com"),
    ("NOMADE Movers", "nomademovers@gmail.com", "France / Outre-Mer", "https://nomade-movers.fr"),
    ("ABD Déménagement Outre-Mer", "abd.demenagement@gmail.com", "France / DOM-TOM", "https://abd-demenagement.fr"),
    ("JP Fargues", "info@jp-fargues.com", "France / Outre-Mer", "https://jp-fargues.com"),
    ("Magellan Transit", "contact@magellan-transit.com", "France / DOM-TOM", "https://magellan-transit.com"),
    ("RMP Caraïbes Transit", "info@rmp-caraibes.com", "Guadeloupe / Saint-Barth", "https://rmp-caraibes.com"),
    ("Trans Dom Service 972", "vaubiengwena972@gmail.com", "Martinique", "https://transdomservice.com"),

    # --- FRET & LOGISTIQUE AFRIQUE & DIASPORA ---
    ("TAF Afrique", "afrique@taftrans.fr", "France / Afrique", "https://taftrans.fr"),
    ("Colis Abidjan", "fret@colis-abidjan.com", "France / Côte d'Ivoire", "https://colis-abidjan.com"),
    ("Dakar Bagages", "dakarbagages@gmail.com", "Paris / Dakar", "https://dakarbagages.com"),
    ("Africolis", "contact.africolis@gmail.com", "France / Afrique", "https://africolis.fr"),
    ("Fret Abidjan", "info@fret-abidjan.com", "France / Côte d'Ivoire", "https://fret-abidjan.com"),
    ("Ivo Transit", "contact.ivotransit@gmail.com", "France (Nantes) / Afrique", "https://ivotransit.com"),
    ("Envoi Colis Afrique Occident", "envoiscolisafriqueoccident@gmail.com", "Paris / Abidjan", "https://envoicolisabidjan.com"),
    ("AMT Transit", "amt.transit@gmail.com", "France / Abidjan", "https://facebook.com/amttransit"),
    ("GlaceEcaille Fret", "glaceecaille@gmail.com", "Paris / Afrique", "https://glaceecaille.fr"),
    ("DK Logistique", "contact.dklogistik@gmail.com", "France / Guinée Conakry", "https://dklogistique.com"),
    ("Colis224", "mycolis224@gmail.com", "France / Guinée Conakry", "https://colis224.com"),
    ("Bird Company Fret", "birdcompagny93@gmail.com", "France / Guinée", "https://birdcompany.fr"),
    ("France Fret Express", "contact@francefretexpress.com", "France / Afrique", "https://francefretexpress.com"),
    ("Fret Relais", "contact@fretrelais.fr", "France / Afrique", "https://fretrelais.fr"),
    ("Como Fret Services", "como.fret.services@gmail.com", "France / Comores", "https://comofretservices.com"),
    ("Colis Haraka", "colisharaka@gmail.com", "France (Marseille) / Comores", "https://colisharaka.com"),
    ("Madazon Logistics", "contact@madazon-logistics.fr", "France / Madagascar", "https://madazon-logistics.fr"),
    ("STMA Fret Connexion", "contact@stma-fretconnexion.com", "France (Marseille) / Comores", "https://stma-fretconnexion.com"),
    ("AMB Translog", "contact@amb-translog.fr", "France / Comores", "https://amb-translog.fr"),
    ("Facility Business Services", "facility.bandja@gmail.com", "France / Cameroun", "https://facilitybs.fr"),
    ("Smart Fret Cameroun", "smartfretsmartfret@gmail.com", "France / Cameroun", "https://smartfret.com"),
    ("FG Expedition", "fgexpedition@gmail.com", "France / Cameroun", "https://fgexpedition-agency.com"),
    ("OuiCarry", "contact@ouicarry.com", "France / Sénégal", "https://ouicarry.com"),
    ("KEST Transit", "kesttrading.contact@gmail.com", "France / Afrique", "https://kesttransit.com"),
    ("JBM Fret Services", "jbmfretservices@gmail.com", "France / RDC", "https://jbmfretservices.com"),
    ("Groupage France Congo", "colisdebrazza@gmail.com", "France / Congo Brazzaville", "https://groupagefrancecongo.fr"),
    ("Tind-ex Fret", "tind-ex2018@gmail.com", "France / Congo", "https://tindex.fr"),
    ("Agence Ottawa-Kin", "agenceottawakin@gmail.com", "France / RDC Kinshasa", "https://agenceottawakin.com"),
    ("Express Cargo Afrique", "contact@expresscargoaf.com", "France / RDC", "https://expresscargoaf.com"),

    # --- TECH, SAAS & FINTECH DIASPORA ---
    ("PaySika", "support@paysika.co", "Cameroun / CEMAC", "https://paysika.co"),
    ("Chargily", "support@chargily.com", "Algérie / Diaspora", "https://chargily.com"),
    ("Chari", "support@chari.ma", "Maroc / Afrique B2B", "https://chari.co")
]

valid_b = []
seen_emails = set()
seen_domains = set()

for c in RAW_POOL_B:
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

    valid_b.append({
        "company": name,
        "email": email_clean,
        "territory": territory,
        "source": source
    })

print(f"Total testés Filière B : {len(RAW_POOL_B)}")
print(f"Total VALIDES SANS DOUBLON NI REBOND : {len(valid_b)}")

# Save exactly 50
final_50_b = valid_b[:50]
with open(os.path.join(BASE_DIR, "scripts", "filiere_b_50.json"), "w", encoding="utf-8") as f:
    json.dump(final_50_b, f, indent=2, ensure_ascii=False)
print(f"Fichier filiere_b_50.json sauvegardé avec {len(final_50_b)} contacts !")
