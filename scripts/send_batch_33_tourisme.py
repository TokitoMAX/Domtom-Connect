import smtplib, ssl, json, time, random, sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
BATCH_FILE = "batch_33_tourisme_digital.json"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

print("=======================================================")
print("ENVOI BATCH 33 : 12 ACTEURS TOURISME, MOBILITÉ & DIGITAL")
print("=======================================================\n")

with open(BATCH_FILE, 'r', encoding='utf-8') as f:
    leads = json.load(f)

with open(CONTACTS_DB_FILE, 'r', encoding='utf-8') as f:
    contacts_db = json.load(f)

existing_contacts = {c['email'].lower() for c in contacts_db.get('contacts', []) if isinstance(c, dict) and 'email' in c}
existing_domains = {d.lower() for d in contacts_db.get('domains', []) if isinstance(d, str)}

errors_pre = []
for lead in leads:
    e = lead['email'].strip().lower()
    d = e.split('@')[1] if '@' in e else ''
    if ':' in lead['subject'] or ':' in lead['body']:
        errors_pre.append(f"COLON DETECTED: {lead['company']}")
    if 'www.domtomconnect.com' not in lead['body']:
        errors_pre.append(f"MISSING URL: {lead['company']}")
    if "Loïc Villeronce\nFondateur — Domtom Connect" not in lead['body']:
        errors_pre.append(f"MISSING SIGNATURE: {lead['company']}")
    # MX check
    p = subprocess.run(['nslookup', '-type=mx', d], capture_output=True, text=True)
    if 'mail exchanger' not in p.stdout.lower() and 'mx' not in p.stdout.lower():
        errors_pre.append(f"NO MX: {lead['company']} ({d})")

if errors_pre:
    print("❌ PRE-FLIGHT ERRORS:")
    for e in errors_pre:
        print(f"   {e}")
    sys.exit(1)
else:
    print("✅ Pré-vol OK — 0 erreur. Lancement de l'envoi...\n")

context = ssl.create_default_context()
success_count = 0
error_count = 0

try:
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP SSL Gmail réussie.\n")

        for idx, lead in enumerate(leads, 1):
            company = lead["company"]
            recipient = lead["email"].strip()
            territory = lead["territory"]
            subject = lead["subject"]
            body = lead["body"]
            domain = recipient.split('@')[1].lower() if '@' in recipient else ''

            print(f"[{idx}/{len(leads)}] {company} ({territory}) -> {recipient}")
            print(f"  Objet: {subject}")

            if recipient.lower() in existing_contacts:
                print(f"  [SKIP] Déjà contacté.")
                continue

            msg = MIMEText(body, "plain", "utf-8")
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Subject"] = subject
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

            try:
                server.sendmail(SENDER_EMAIL, recipient, msg.as_string())
                print(f"  ==> ENVOYÉ AVEC SUCCÈS À {recipient} !")
                success_count += 1

                contacts_db.setdefault("contacts", []).append({
                    "email": recipient.lower(), "name": company, "domain": domain,
                    "count_sent": 1, "count_received": 0,
                    "last_date": formatdate(localtime=True), "subjects": [subject],
                    "batch": "Batch 33 - Tourisme, Mobilité & Digital"
                })
                existing_contacts.add(recipient.lower())

                if domain and domain not in existing_domains:
                    contacts_db.setdefault("domains", []).append(domain)
                    existing_domains.add(domain)

                contacts_db["total_contacts"] = len(contacts_db["contacts"])
                contacts_db["total_domains"] = len(contacts_db["domains"])

                with open(CONTACTS_DB_FILE, 'w', encoding='utf-8') as f_out:
                    json.dump(contacts_db, f_out, indent=2, ensure_ascii=False)

            except Exception as e:
                print(f"  [ERREUR ENVOI] {recipient}: {e}")
                error_count += 1

            if idx < len(leads):
                pause = round(random.uniform(13.0, 18.0), 1)
                print(f"  Pause de sécurité: {pause}s...")
                time.sleep(pause)

except Exception as e:
    print(f"\nErreur critique de connexion SMTP: {e}")
    sys.exit(1)

print("\n=======================================================")
print(f"BILAN CAMPAGNE BATCH 33 : {success_count} ENVOYÉS, {error_count} ERREURS")
print(f"NOUVEAU TOTAL CONTACTS EN BASE : {contacts_db['total_contacts']}")
print("=======================================================\n")
