import imaplib, email, sys, json, os, re
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

def extract_bounced_address(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdisp = str(part.get('Content-Disposition'))
            if ctype in ["text/plain", "message/delivery-status", "text/rfc822-headers"] and "attachment" not in cdisp:
                payload = part.get_payload(decode=True)
                if payload:
                    body += "\n" + payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            body = payload.decode('utf-8', errors='ignore')

    # Look for RFC Final-Recipient
    m_rfc = re.search(r'Final-Recipient:\s*(?:rfc822;)?\s*([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', body, re.IGNORECASE)
    if m_rfc:
        cand = m_rfc.group(1).lower().strip()
        if "domtomconnect" not in cand and "google" not in cand and "mailer" not in cand:
            return cand

    # Look for Action: failed ... Status: ...
    # Look for Your message to <...> or failed to deliver to <...>
    patterns = [
        r'(?:message to|failed to deliver to|delivery to following recipient failed:?|wasn\'t found at|couldn\'t be delivered to|unable to deliver to)\s*:?\s*<?([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)>?',
        r'failed:\s*<?([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)>?',
        r'Recipient:\s*<?([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)>?'
    ]
    for pat in patterns:
        m = re.search(pat, body, re.IGNORECASE)
        if m:
            cand = m.group(1).lower().strip()
            if "domtomconnect" not in cand and "google" not in cand and "mailer" not in cand:
                return cand

    # General regex on body
    emails_found = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', body)
    for e in emails_found:
        el = e.lower().strip()
        if not any(k in el for k in ['domtomconnect', 'google', 'mailer-daemon', 'postmaster', 'gmail', 'protection.outlook', 'microsoft']):
            return el

    return None

def main():
    print("=== CONNEXION IMAP ET SCAN DES REBONDS EN COURS ===")
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
    mail.select("INBOX")

    status, s_data = mail.search(None, 'ALL')
    all_ids = s_data[0].split()
    print(f"Total messages INBOX : {len(all_ids)}")

    # Scan all messages in INBOX for delivery failures
    detected_bounces = set()
    bounced_details = []

    # Check last 150 messages in INBOX
    for mid in reversed(all_ids[-150:]):
        res, h_data = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE TO)])')
        if res != 'OK':
            continue
        h_text = h_data[0][1].decode('utf-8', errors='ignore')
        header = email.message_from_string(h_text)
        from_hdr = decode_mime(header.get("From", "")).lower()
        subj_hdr = decode_mime(header.get("Subject", "")).lower()

        if "mailer-daemon" in from_hdr or "postmaster" in from_hdr or "delivery status" in subj_hdr or "undeliverable" in subj_hdr or "failure" in subj_hdr:
            res_full, f_data = mail.fetch(mid, '(RFC822)')
            if res_full == 'OK':
                msg = email.message_from_bytes(f_data[0][1])
                target = extract_bounced_address(msg)
                date_hdr = header.get("Date", "")
                if target:
                    detected_bounces.add(target)
                    bounced_details.append({
                        "mid": mid.decode(),
                        "date": date_hdr,
                        "subject": subj_hdr[:60],
                        "target": target
                    })

    mail.close()
    mail.logout()

    print(f"\nTotal rebonds identifiés : {len(detected_bounces)}")
    for b in bounced_details:
        print(f" - [{b['date'][:20]}] {b['target']} (ID {b['mid']})")

    # Update exclusions.json
    with open(EXCLUSIONS_PATH, "r", encoding="utf-8") as f:
        ex = json.load(f)

    ex_emails = set(e.lower().strip() for e in ex.get("excluded_emails", []))
    ex_domains = set(d.lower().strip() for d in ex.get("excluded_domains", []))

    new_emails_added = []
    new_domains_added = []

    for target in detected_bounces:
        t_clean = target.lower().strip()
        if t_clean not in ex_emails:
            ex_emails.add(t_clean)
            new_emails_added.append(t_clean)

        if "@" in t_clean:
            dom = t_clean.split("@")[1].strip()
            if dom not in ex_domains and dom not in ["gmail.com", "yahoo.fr", "hotmail.com", "outlook.fr", "orange.fr"]:
                ex_domains.add(dom)
                new_domains_added.append(dom)

    ex["excluded_emails"] = sorted(list(ex_emails))
    ex["excluded_domains"] = sorted(list(ex_domains))
    ex["total_excluded_emails"] = len(ex["excluded_emails"])
    ex["total_excluded_domains"] = len(ex["excluded_domains"])

    with open(EXCLUSIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(ex, f, ensure_ascii=False, indent=2)

    print(f"\n[Exclusions] Mises à jour :")
    print(f" - +{len(new_emails_added)} nouveaux emails exclus : {new_emails_added}")
    print(f" - +{len(new_domains_added)} nouveaux domaines exclus : {new_domains_added}")
    print(f" - Total actuel dans exclusions.json : {ex['total_excluded_emails']} emails, {ex['total_excluded_domains']} domaines.")

    # Update contacts_deja_contactes.json
    with open(CONTACTS_PATH, "r", encoding="utf-8") as f:
        contacts_db = json.load(f)

    marked_bounces = 0
    all_bounced_set = set(ex["excluded_emails"])

    for c in contacts_db.get("contacts", []):
        em = c.get("email", "").lower().strip()
        if em in all_bounced_set or em in detected_bounces:
            if not c.get("bounced") or c.get("statut") != "BOUNCE_EXCLU":
                c["bounced"] = True
                c["statut"] = "BOUNCE_EXCLU"
                marked_bounces += 1

    with open(CONTACTS_PATH, "w", encoding="utf-8") as f:
        json.dump(contacts_db, f, ensure_ascii=False, indent=2)

    print(f"\n[Base Contacts] {marked_bounces} fiches mises à jour avec le statut 'BOUNCE_EXCLU'.")
    print("Nettoyage et exclusion terminés avec succès.")

if __name__ == "__main__":
    main()
