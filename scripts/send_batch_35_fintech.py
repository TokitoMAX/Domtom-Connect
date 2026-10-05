import smtplib, ssl, json, time, random, sys, subprocess
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
BATCH_FILE = "batch_35_fintech_banques.json"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

print("=======================================================")
print("ENVOI BATCH 35 : 12 FINTECH, BANQUES & SERVICES FINANCIERS")
print("=======================================================\n")

with open(BATCH_FILE, 'r', encoding='utf-8') as f:
    leads = json.load(f)

with open(CONTACTS_DB_FILE, 'r', encoding='utf-8') as f:
    contacts_db = json.load(f)

existing_contacts = {c['email'].lower() for c in contacts_db.get('contacts', []) if isinstance(c, dict) and 'email' in c}
existing_domains = {d.lower() for d in contacts_db.get('domains', []) if isinstance(d, str)}

# Pre-flight checks
errors_pre = []
for lead in leads:
    e = lead['email'].strip().lower()
    d = e.split('@')[1] if '@' in e else ''
    if ':' in lead['subject']: errors_pre.append('COLON SUBJECT: ' + lead['company'])
    if ':' in lead['body']: errors_pre.append('COLON BODY: ' + lead['company'])
    if 'www.domtomconnect.com' not in lead['body']: errors_pre.append('MISSING URL: ' + lead['company'])
    if 'Villeronce' not in lead['body']: errors_pre.append('MISSING SIG: ' + lead['company'])
    if e in existing_contacts: errors_pre.append('DUPLICATE: ' + e)

if errors_pre:
    for er in errors_pre: print('ERROR: ' + er)
    sys.exit(1)
else:
    print("Pre-vol OK — 0 erreur. Lancement de l'envoi...\n")

context = ssl.create_default_context()
success_count = 0
error_count = 0

try:
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP SSL Gmail reussie.\n")

        for idx, lead in enumerate(leads, 1):
            company = lead["company"]
            recipient = lead["email"].strip()
            territory = lead["territory"]
            subject = lead["subject"]
            body = lead["body"]
            domain = recipient.split('@')[1].lower() if '@' in recipient else ''

            print("[" + str(idx) + "/" + str(len(leads)) + "] " + company + " (" + territory + ") -> " + recipient)
            print("  Objet: " + subject)

            if recipient.lower() in existing_contacts:
                print("  [SKIP] Deja contacte.")
                continue

            msg = MIMEText(body, "plain", "utf-8")
            msg["From"] = "Loic Villeronce <" + SENDER_EMAIL + ">"
            msg["To"] = recipient
            msg["Subject"] = subject
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

            try:
                server.sendmail(SENDER_EMAIL, recipient, msg.as_string())
                print("  ==> ENVOYE AVEC SUCCES A " + recipient + " !")
                success_count += 1

                contacts_db.setdefault("contacts", []).append({
                    "email": recipient.lower(), "name": company, "domain": domain,
                    "count_sent": 1, "count_received": 0,
                    "last_date": formatdate(localtime=True), "subjects": [subject],
                    "batch": "Batch 35 - FinTech, Banques & Services Financiers"
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
                print("  [ERREUR ENVOI] " + recipient + ": " + str(e))
                error_count += 1

            if idx < len(leads):
                pause = round(random.uniform(13.0, 18.0), 1)
                print("  Pause de securite: " + str(pause) + "s...")
                time.sleep(pause)

except Exception as e:
    print("\nErreur critique SMTP: " + str(e))
    sys.exit(1)

print("\n=======================================================")
print("BILAN CAMPAGNE BATCH 35 : " + str(success_count) + " ENVOYES, " + str(error_count) + " ERREURS")
print("NOUVEAU TOTAL CONTACTS EN BASE : " + str(contacts_db['total_contacts']))
print("=======================================================\n")
