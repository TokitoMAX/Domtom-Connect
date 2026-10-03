import imaplib, email, re, json, sys, os
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCLUSIONS_PATH = os.path.join(BASE_DIR, "exclusions.json")
ROOT_DIR = os.path.dirname(BASE_DIR)
CONTACTS_PATH = os.path.join(ROOT_DIR, "contacts_deja_contactes.json")

def decode_mime(header_val):
    if not header_val:
        return ""
    parts = decode_header(header_val)
    res = ""
    for part, enc in parts:
        if isinstance(part, bytes):
            res += part.decode(enc or 'utf-8', errors='ignore')
        else:
            res += str(part)
    return res

def scan_bounces():
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
    mail.select('INBOX')

    bounced_emails = set()

    # Search for bounces
    search_queries = [
        'FROM "mailer-daemon"',
        'FROM "postmaster"',
        'SUBJECT "Delivery Status Notification"',
        'SUBJECT "Undeliverable"'
    ]

    all_matched_ids = set()
    for sq in search_queries:
        res, data = mail.search(None, sq)
        if res == 'OK' and data[0]:
            for mid in data[0].split():
                all_matched_ids.add(mid)

    print(f"Total bounce / NDR messages trouvés dans INBOX : {len(all_matched_ids)}")

    # Sort and inspect the most recent 40 bounce messages
    sorted_mids = sorted(list(all_matched_ids), key=lambda x: int(x))[-40:]

    for mid in sorted_mids:
        res, h_data = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (SUBJECT DATE FROM)])')
        if res != 'OK':
            continue
        h_text = h_data[0][1].decode('utf-8', errors='ignore')
        header = email.message_from_string(h_text)
        subj = decode_mime(header.get("Subject", ""))
        date_hdr = header.get("Date", "")

        res_b, b_data = mail.fetch(mid, '(BODY.PEEK[TEXT]<0.3000>)')
        body = b_data[0][1].decode('utf-8', errors='ignore') if (res_b == 'OK' and b_data[0]) else ''

        # Extract failed email
        found = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', body)
        clean = [e.lower().strip() for e in found if not any(k in e.lower() for k in [
            'domtomconnect', 'google', 'mailer', 'postmaster', 'gmail', 
            'protection.outlook', 'microsoft', 'w3.org', 'schema.org'
        ])]

        if clean:
            target = clean[0]
            bounced_emails.add(target)
            print(f" -> ID {mid.decode()} | {date_hdr[:22]} | Rebond détecté : {target}")

    mail.close()
    mail.logout()

    # Known list from recent batches
    explicit_bounces = [
        "contact@hublot.re",
        "info@zenithimo.com",
        "contact@lena-realestate.com",
        "contact@epeeline.com",
        "contact@delsa-immo.com",
        "info@chocolatdesvillages.org",
        "contact@reen.sn",
        "contact@conciergerie-ilemaurice.com",
        "contact@replikimmo.com",
        "contact@teyaimmobilier.com",
        "contact@mdimmo-ci.com",
        "contact@karukera-conciergerie.com",
        "contact@boiscorail.re",
        "contact@maevareunion.fr",
        "contact@lasourcecosmetics.com",
        "export@spiridom.com",
        "biopharma@laboratoires-biopharma.com"
    ]
    for eb in explicit_bounces:
        bounced_emails.add(eb.lower().strip())

    print(f"\nTotal adresses rebondies à exclure : {len(bounced_emails)}")

    # 1. Update exclusions.json
    with open(EXCLUSIONS_PATH, 'r', encoding='utf-8') as f:
        ex = json.load(f)

    ex_emails = set(e.lower().strip() for e in ex.get('excluded_emails', []))
    ex_domains = set(d.lower().strip() for d in ex.get('excluded_domains', []))

    new_e = []
    new_d = []

    for em in sorted(list(bounced_emails)):
        if em not in ex_emails:
            ex_emails.add(em)
            new_e.append(em)
        if "@" in em:
            domain = em.split("@")[1].strip()
            if domain not in ex_domains and domain not in ["gmail.com", "yahoo.fr", "hotmail.com", "outlook.fr", "orange.fr"]:
                ex_domains.add(domain)
                new_d.append(domain)

    ex["excluded_emails"] = sorted(list(ex_emails))
    ex["excluded_domains"] = sorted(list(ex_domains))
    ex["total_excluded_emails"] = len(ex["excluded_emails"])
    ex["total_excluded_domains"] = len(ex["excluded_domains"])

    with open(EXCLUSIONS_PATH, 'w', encoding='utf-8') as f:
        json.dump(ex, f, ensure_ascii=False, indent=2)

    print(f"\n[exclusions.json mis à jour]")
    print(f" - {len(new_e)} nouveaux emails exclus : {new_e}")
    print(f" - {len(new_d)} nouveaux domaines exclus : {new_d}")
    print(f" - Total actuel : {ex['total_excluded_emails']} adresses et {ex['total_excluded_domains']} domaines exclus définitivement.")

    # 2. Update contacts_deja_contactes.json
    with open(CONTACTS_PATH, 'r', encoding='utf-8') as f:
        db = json.load(f)

    count_flagged = 0
    all_bounced_set = set(bounced_emails)

    for c in db.get("contacts", []):
        em = c.get("email", "").lower().strip()
        if em in all_bounced_set or em in ex_emails:
            if c.get("statut") != "BOUNCE_EXCLU":
                c["bounced"] = True
                c["statut"] = "BOUNCE_EXCLU"
                count_flagged += 1

    with open(CONTACTS_PATH, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"\n[contacts_deja_contactes.json mis à jour]")
    print(f" - {count_flagged} contacts passés au statut 'BOUNCE_EXCLU'.")

if __name__ == "__main__":
    scan_bounces()
