import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target
from build_batch_53_enfance_40 import LEADS

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"emails": [], "domains": [], "companies": [], "contacts": []}

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

def verify_lead_safety(lead, known_emails):
    # Verif 1: Aucun deux-points (:) dans le sujet ni le corps
    if ":" in lead["subject"]:
        raise ValueError(f"Interdit - Deux-points détecté dans le sujet pour {lead['company']}")
    if ":" in lead["body"]:
        raise ValueError(f"Interdit - Deux-points détecté dans le corps pour {lead['company']}")
    
    # Verif 2: Verification DNS / MX
    is_valid, msg = verify_email_target(lead["email"])
    if not is_valid:
        raise ValueError(f"Echec verification DNS/MX pour {lead['email']} - {msg}")
    
    # Verif 3: Deduplication temps reel (ignorer si c'est deja enregistre dans cette session)
    if lead["email"].lower().strip() not in known_emails:
        is_dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
        if is_dup:
            raise ValueError(f"Doublon détecté pour {lead['company']} ({lead['email']}) - {reason}")
    
    return True

def run_batch(dry_run=False, limit=None):
    targets = LEADS[:limit] if limit else LEADS
    db = load_contacts_db()
    known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))
    
    print(f"=== BATCH 53 (40 CIBLES ENFANCE, PETITE ENFANCE, ÉDUCATION & ÉVEIL) - {len(targets)} CIBLES ===")
    print("Répartition : 20 Caraïbes + 20 Continent Africain")
    
    # Filtrer les cibles à envoyer
    pending_targets = [lead for lead in targets if lead["email"].lower().strip() not in known_emails]
    already_sent = len(targets) - len(pending_targets)
    print(f"\nStatut : {already_sent} cibles déjà délivrées, {len(pending_targets)} cibles restantes à expédier.")
    
    # Phase 1: Validation pre-vol de securite sur les cibles restantes
    print("\n--- Phase 1 - Validation DNS, MX, Déduplication et Conformité de Style (Zéro deux-points) ---")
    for idx, lead in enumerate(pending_targets, 1):
        try:
            verify_lead_safety(lead, known_emails)
            print(f"[{idx:02d}/{len(pending_targets)}] OK - {lead['company']} ({lead['email']}) [{lead['territory']}]")
        except Exception as e:
            print(f"[{idx:02d}/{len(pending_targets)}] ERREUR CRITIQUE - {e}")
            sys.exit(1)
            
    print(f"\nValidation pré-vol 100% réussie pour les {len(pending_targets)} cibles restantes.")
    
    if dry_run:
        print("\n[DRY RUN ACTIF] Aucun email envoyé. Les cibles restantes sont 100% conformes et prêtes.")
        return

    if not pending_targets:
        print("\nToutes les cibles du Batch 53 ont déjà été envoyées !")
        return

    print("Connexion au serveur SMTP Gmail...")
    context = ssl.create_default_context()
    sent_count = 0
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP établie avec succès.\n")
        
        for idx, lead in enumerate(pending_targets, 1):
            recipient = lead["email"]
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            print(f"[{already_sent + idx:02d}/{len(targets)}] Envoi à {lead['company']} ({recipient})...")
            server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
            print(f" -> DELIVRÉ avec succès à {recipient}")
            
            # Enregistrement immédiat
            add_lead_to_db(db, lead)
            save_contacts_db(db)
            sent_count += 1
            
            if idx < len(pending_targets):
                sleep_time = random.uniform(13.0, 18.0)
                print(f" -> Temporisation sécurisée de {sleep_time:.1f} secondes...")
                time.sleep(sleep_time)

    print(f"\n=== BATCH 53 TERMINÉ - {already_sent + sent_count}/{len(targets)} EMAILS ENVOYÉS AVEC SUCCÈS ===")

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    run_batch(dry_run=is_dry)
