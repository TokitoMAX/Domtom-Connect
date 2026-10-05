import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target
from build_batch_54_location_voiture_50 import LEADS

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

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
    
    print(f"=== BATCH 54 (50 CIBLES LOCATION DE VOITURE & VÉHICULES) - {len(targets)} CIBLES ===")
    print("Répartition : 16 Guadeloupe + 14 Martinique + 2 Îles du Nord + 4 Guyane + 8 La Réunion + 6 Afrique")
    
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
            
    print(f"\nSécurité validée à 100% sur {len(pending_targets)} cibles.")
    
    if dry_run:
        print("\nMode simulation (--dry-run) actif. Aucun e-mail n'a été envoyé.")
        return

    if not pending_targets:
        print("\nToutes les cibles du Batch 54 ont déjà été envoyées !")
        return

    # Phase 2: Envoi effectif SMTP
    print("\n--- Phase 2 - Connexion SMTP SSL et Envoi Sécurisé ---")
    context = ssl.create_default_context()
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Authentification SMTP réussie sur domtomconnect@gmail.com.")
        
        for idx, lead in enumerate(pending_targets, 1):
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
            msg["To"] = lead["email"]
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            try:
                server.sendmail(SENDER_EMAIL, [lead["email"]], msg.as_string())
                print(f"[{idx:02d}/{len(pending_targets)}] ENVOYÉ -> {lead['company']} ({lead['email']}) [{lead['territory']}]")
                
                # Mettre a jour la base de contacts temps reel
                add_lead_to_db(db, lead)
                save_contacts_db(db)
                known_emails.add(lead["email"].lower().strip())
                
                # Pause anti-spam / anti-rate-limit (13-18 secondes)
                if idx < len(pending_targets):
                    sleep_time = random.uniform(13.0, 18.0)
                    print(f"    Pause respectueuse de {sleep_time:.1f}s...")
                    time.sleep(sleep_time)
            except Exception as e:
                print(f"[{idx:02d}/{len(pending_targets)}] ERREUR D'ENVOI pour {lead['email']} : {e}")
                # Enregistrer ce qui a été envoyé avant de lever l'erreur
                save_contacts_db(db)
                raise e

    print(f"\n=== SUCCÈS COMPLET DU BATCH 54 : {len(pending_targets)}/{len(pending_targets)} EMAILS ENVOYÉS SANS ERREUR ===")
    print(f"Base de données globale mise à jour : {db.get('total_contacts')} contacts uniques.")

if __name__ == "__main__":
    is_dry_run = "--dry-run" in sys.argv
    run_batch(dry_run=is_dry_run)
