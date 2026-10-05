import imaplib
import email
from email.utils import getaddresses
import json
import os
from collections import defaultdict
from datetime import datetime

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

INTERNAL_EMAILS = {
    "domtomconnect@gmail.com",
    "loickrv@gmail.com",
    "contact@domtomconnect.com"
}

IGNORE_DOMAINS = {
    "google.com", "accounts.google.com", "notifications.google.com",
    "stripe.com", "paypal.com", "vercel.com", "supabase.com", "supabase.io",
    "github.com", "resend.com", "brevo.com", "sendinblue.com"
}

def scan_folder(mail, folder_name, is_sent=True, contacts=None):
    if contacts is None:
        contacts = {}
    print(f"Selection du dossier {folder_name}...", flush=True)
    status, data = mail.select(folder_name, readonly=True)
    if status != 'OK':
        print(f"Impossible d'ouvrir {folder_name} ({status})", flush=True)
        return
    
    status, search_data = mail.search(None, 'ALL')
    if status != 'OK' or not search_data[0]:
        print(f"Aucun message dans {folder_name}", flush=True)
        return

    msg_ids = search_data[0].split()
    total = len(msg_ids)
    print(f"Dossier {folder_name}: {total} messages trouves.", flush=True)

    # Decouper par blocs de 100 pour aller 100x plus vite
    chunk_size = 100
    for i in range(0, total, chunk_size):
        chunk = msg_ids[i:i+chunk_size]
        id_str = b",".join(chunk).decode('ascii')
        
        try:
            fetch_status, fetch_data = mail.fetch(id_str, '(BODY.PEEK[HEADER.FIELDS (FROM TO CC BCC SUBJECT DATE)])')
            if fetch_status != 'OK':
                continue
            
            for item in fetch_data:
                if isinstance(item, tuple) and len(item) > 1:
                    raw_header = item[1]
                    try:
                        msg = email.message_from_bytes(raw_header)
                        subject = msg.get("Subject", "")
                        date_str = msg.get("Date", "")

                        if is_sent:
                            recipients = []
                            for f in ["To", "Cc", "Bcc"]:
                                val = msg.get(f)
                                if val:
                                    recipients.extend(getaddresses([val]))
                            for name, addr in recipients:
                                addr = addr.lower().strip()
                                if not addr or "@" not in addr:
                                    continue
                                domain = addr.split("@")[1]
                                if addr in INTERNAL_EMAILS or domain in IGNORE_DOMAINS:
                                    continue
                                
                                if addr not in contacts:
                                    contacts[addr] = {
                                        "email": addr,
                                        "name": name,
                                        "domain": domain,
                                        "count_sent": 0,
                                        "count_received": 0,
                                        "last_date": date_str,
                                        "subjects": []
                                    }
                                c = contacts[addr]
                                c["count_sent"] += 1
                                if name and not c["name"]:
                                    c["name"] = name
                                if subject and len(c["subjects"]) < 2 and subject not in c["subjects"]:
                                    c["subjects"].append(subject)
                        else:
                            # INBOX: analyser le From
                            from_val = msg.get("From")
                            if from_val:
                                for name, addr in getaddresses([from_val]):
                                    addr = addr.lower().strip()
                                    if not addr or "@" not in addr:
                                        continue
                                    domain = addr.split("@")[1]
                                    if addr in INTERNAL_EMAILS or domain in IGNORE_DOMAINS:
                                        continue
                                    
                                    if addr not in contacts:
                                        contacts[addr] = {
                                            "email": addr,
                                            "name": name,
                                            "domain": domain,
                                            "count_sent": 0,
                                            "count_received": 0,
                                            "last_date": date_str,
                                            "subjects": []
                                        }
                                    c = contacts[addr]
                                    c["count_received"] += 1
                                    if name and not c["name"]:
                                        c["name"] = name
                                    if subject and len(c["subjects"]) < 2 and subject not in c["subjects"]:
                                        c["subjects"].append(subject)
                    except Exception:
                        continue
            print(f"Traites: {min(i+chunk_size, total)}/{total}", flush=True)
        except Exception as e:
            print(f"Erreur chunk {i}-{i+chunk_size}: {e}", flush=True)

def main():
    print(f"Connexion a Gmail ({EMAIL_ACCOUNT})...", flush=True)
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    print("Connecte avec succes !", flush=True)

    contacts = {}

    # Scan des messages envoyes
    scan_folder(mail, '"[Gmail]/Messages envoy&AOk-s"', is_sent=True, contacts=contacts)
    # Scan des messages recus dans la boite de reception
    scan_folder(mail, 'INBOX', is_sent=False, contacts=contacts)

    mail.logout()

    output_list = list(contacts.values())
    output_list.sort(key=lambda x: (x["count_sent"] + x["count_received"]), reverse=True)
    domains_set = sorted(list(set(c["domain"] for c in output_list)))

    result = {
        "extracted_at": datetime.now().isoformat(),
        "total_contacts": len(output_list),
        "total_domains": len(domains_set),
        "domains": domains_set,
        "contacts": output_list
    }

    out_json_path = os.path.join(os.path.dirname(__file__), "..", "contacts_deja_contactes.json")
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\nTermine !", flush=True)
    print(f"Total contacts uniques: {len(output_list)}", flush=True)
    print(f"Total noms de domaine: {len(domains_set)}", flush=True)
    print(f"Fichier genere: {out_json_path}", flush=True)

if __name__ == "__main__":
    main()
