import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
EXCLUSIONS_FILE = os.path.join(BASE_DIR, "scripts", "exclusions.json")
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_66_patrimoine_defiscalisation_50.json")

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"emails": [], "domains": [], "companies": [], "contacts": []}

def load_exclusions():
    if os.path.exists(EXCLUSIONS_FILE):
        with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"excluded_emails": [], "excluded_domains": []}

def save_contacts_db(db):
    temp_file = CONTACTS_DB_FILE + ".tmp"
    with open(temp_file, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    for _ in range(5):
        try:
            if os.path.exists(CONTACTS_DB_FILE):
                os.replace(temp_file, CONTACTS_DB_FILE)
            else:
                os.rename(temp_file, CONTACTS_DB_FILE)
            return
        except Exception:
            time.sleep(0.5)

def add_lead_to_db(db, lead):
    email = lead["email"].lower().strip()
    domain = email.split("@")[1]
    company = lead["company"].strip()
    
    if email not in db.get("emails", []):
        db.setdefault("emails", []).append(email)
    if domain not in db.get("domains", []):
        db.setdefault("domains", []).append(domain)
    if company not in db.get("companies", []):
        db.setdefault("companies", []).append(company)
    
    existing_contacts = set(c["email"].lower().strip() for c in db.get("contacts", []))
    if email not in existing_contacts:
        db.setdefault("contacts", []).append({"email": email, "company": company})
        
    db["total_contacts"] = len(db["contacts"])
    db["total_domains"] = len(db.get("domains", []))

def verify_lead_safety(lead, known_emails, excl_emails, excl_domains):
    if ":" in lead["subject"]:
        raise ValueError(f"Interdit - Deux-points détecté dans le sujet pour {lead['company']}")
    if ":" in lead["body"]:
        raise ValueError(f"Interdit - Deux-points détecté dans le corps pour {lead['company']}")
    if " - " in lead["subject"]:
        raise ValueError(f"Interdit - Tiret en milieu de phrase dans le sujet pour {lead['company']}")
    if " - " in lead["body"]:
        raise ValueError(f"Interdit - Tiret en milieu de phrase dans le corps pour {lead['company']}")
    if "toute la Caraïbe, le continent africain et sa diaspora" not in lead["body"]:
        raise ValueError(f"Interdit - Formule sacrée manquante pour {lead['company']}")
    if "entraide" in lead["body"].lower():
        raise ValueError(f"Interdit - Mot entraide présent pour {lead['company']}")
    
    e = lead["email"].lower().strip()
    dom = e.split("@")[1]
    if e in known_emails:
        raise ValueError(f"Doublon base globale pour {e}")
    if e in excl_emails or dom in excl_domains:
        raise ValueError(f"Exclusion détectée pour {e} (domaine : {dom})")
    
    is_valid, msg = verify_email_target(lead["email"])
    if not is_valid:
        raise ValueError(f"Echec verification DNS/MX pour {lead['email']} - {msg}")
    
    return True

def run_batch(dry_run=False, limit=None):
    with open(BATCH_FILE, "r", encoding="utf-8") as f:
        targets = json.load(f)
    if limit:
        targets = targets[:limit]
        
    db = load_contacts_db()
    excl = load_exclusions()
    known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))
    excl_emails = set(e.lower().strip() for e in excl.get("excluded_emails", []))
    excl_domains = set(d.lower().strip() for d in excl.get("excluded_domains", []))
    
    print(f"=== BATCH 66 (50 CIBLES GESTION PATRIMOINE, DÉFISCALISATION GIRARDIN & FAMILY OFFICES) - {len(targets)} CIBLES ===")
    
    pending_targets = [lead for lead in targets if lead["email"].lower().strip() not in known_emails]
    already_sent = len(targets) - len(pending_targets)
    print(f"\nStatut : {already_sent} cibles déjà délivrées, {len(pending_targets)} cibles restantes à expédier.")
    
    print("\n--- Phase 1 - Sécurité & Règles Permanentes (DNS/MX, Zéro deux-points, Zéro tiret) ---")
    for idx, lead in enumerate(pending_targets, 1):
        try:
            verify_lead_safety(lead, known_emails, excl_emails, excl_domains)
            print(f"[{idx:02d}/{len(pending_targets)}] OK - {lead['company']} ({lead['email']}) [{lead['territory']}] [Axe {lead['axis']}]")
        except Exception as e:
            print(f"[{idx:02d}/{len(pending_targets)}] ERREUR CRITIQUE - {e}")
            return
            
    print("\nSécurité 100% validée. Tous les leads sont conformes.")
    
    if dry_run:
        print("\n[DRY RUN] Aucun email envoyé. Validation terminée avec succès.")
        return
        
    print("\n--- Phase 2 - Expédition Sécurisée via SMTP SSL ---")
    context = ssl.create_default_context()
    
    success_count = 0
    fail_count = 0
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Authentification SMTP réussie. Début de l'envoi...\n")
        
        for idx, lead in enumerate(pending_targets, 1):
            recipient = lead["email"].strip()
            company = lead["company"].strip()
            
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            try:
                server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
                print(f"[{idx:02d}/{len(pending_targets)}] ENVOYÉ -> {company} ({recipient})")
                add_lead_to_db(db, lead)
                save_contacts_db(db)
                success_count += 1
                
                # Pause anti-spam naturelle
                sleep_time = random.uniform(2.5, 4.2)
                time.sleep(sleep_time)
                
            except Exception as e:
                print(f"[{idx:02d}/{len(pending_targets)}] ÉCHEC -> {company} ({recipient}) : {e}")
                fail_count += 1
                
    print(f"\n=== BILAN BATCH 66 ===")
    print(f"Succès : {success_count}")
    print(f"Échecs : {fail_count}")
    print(f"Base totale contacts actuelle : {db.get('total_contacts', len(db['contacts']))}")

if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    run_batch(dry_run=dry)
