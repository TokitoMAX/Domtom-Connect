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
BATCH_FILE = os.path.join(BASE_DIR, "scripts", "batch_68_sondage_locaux_intendance_50.json")

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
        db.setdefault("contacts", []).append({
            "company": company,
            "name": lead.get("name", ""),
            "email": email,
            "territory": lead.get("territory", "Outre-Mer"),
            "city": lead.get("city", ""),
            "source": lead.get("source", "Vérifié"),
            "batch": "batch_68_sondage_locaux_intendance_50",
            "contacted_at": time.strftime("%Y-%m-%d %H:%M:%S")
        })
    db["total_contacts"] = len(db.get("contacts", []))
    db["total_domains"] = len(db.get("domains", []))
    save_contacts_db(db)

def send_batch(dry_run=False):
    if not os.path.exists(BATCH_FILE):
        print(f"Erreur : Le fichier {BATCH_FILE} n'existe pas.")
        return

    with open(BATCH_FILE, "r", encoding="utf-8") as f:
        leads = json.load(f)

    db = load_contacts_db()
    exclusions = load_exclusions()
    excluded_emails = set(e.lower().strip() for e in exclusions.get("excluded_emails", []))
    excluded_domains = set(d.lower().strip() for d in exclusions.get("excluded_domains", []))

    print(f"=== {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI RÉEL'} DU BATCH 68 ({len(leads)} LEADS) ===")
    print(f"Thématique : Sondage Besoins Locaux, Entretien & Intendance Immobilière (Vesteris / Domtom Connect)")
    print(f"Règles appliquées : 0 Guessing, 0 Deux-points, 0 Tiret en milieu de phrase, Validation DNS/MX stricte.")
    print("="*70)

    sent_count = 0
    skipped_count = 0

    context = ssl.create_default_context()

    server = None
    if not dry_run:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, APP_PASSWORD)

    try:
        for idx, lead in enumerate(leads, 1):
            email = lead["email"].lower().strip()
            company = lead["company"].strip()
            domain = email.split("@")[1] if "@" in email else ""

            # Check exclusions
            if email in excluded_emails or domain in excluded_domains:
                print(f"[{idx}/{len(leads)}] REJETÉ (Exclusion List) : {email}")
                skipped_count += 1
                continue

            # Check DNS & MX
            is_valid, msg_err = verify_email_target(email)
            if not is_valid:
                print(f"[{idx}/{len(leads)}] REJETÉ (DNS/MX Invalide) : {email} -> {msg_err}")
                skipped_count += 1
                continue

            # Style validation
            subj = lead["subject"]
            body = lead["body"]
            if ":" in subj or ":" in body:
                print(f"[{idx}/{len(leads)}] ERREUR DE STYLE (Deux-points détecté) : {email}")
                skipped_count += 1
                continue
            if " - " in subj or " - " in body:
                print(f"[{idx}/{len(leads)}] ERREUR DE STYLE (Tiret d'incise détecté) : {email}")
                skipped_count += 1
                continue

            if dry_run:
                print(f"[{idx}/{len(leads)}] VALIDÉ POUR ENVOI : {company} <{email}> ({lead.get('territory')})")
                print(f"    Sujet : {subj}")
                sent_count += 1
            else:
                msg = MIMEText(body, "plain", "utf-8")
                msg["Subject"] = subj
                msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
                msg["To"] = email
                msg["Date"] = formatdate(localtime=True)
                msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

                server.sendmail(SENDER_EMAIL, [email], msg.as_string())
                add_lead_to_db(db, lead)
                sent_count += 1
                print(f"[{idx}/{len(leads)}] ENVOYÉ AVEC SUCCÈS : {company} <{email}>")

                # Respectful delay between emails (3 to 6 seconds)
                delay = random.uniform(3.0, 6.0)
                time.sleep(delay)

    finally:
        if server:
            server.quit()

    print("="*70)
    print(f"RÉSULTAT DU BATCH 68 : {sent_count} envoyés / {skipped_count} ignorés sur {len(leads)} cibles.")
    print("="*70)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv or "-d" in sys.argv
    send_batch(dry_run=is_dry)
