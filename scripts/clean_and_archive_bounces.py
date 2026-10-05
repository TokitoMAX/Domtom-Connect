import imaplib, email, re, json, sys, os

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCLUSIONS_FILE = os.path.join(BASE_DIR, "scripts", "exclusions.json")

def load_exclusions():
    if os.path.exists(EXCLUSIONS_FILE):
        with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"description": "", "excluded_domains": [], "excluded_emails": []}

def save_exclusions(data):
    with open(EXCLUSIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def run():
    print("=== NETTOYAGE ET ARCHIVAGE DES REBONDS GMAIL ===", flush=True)
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
    mail.select("INBOX")
    
    # Recherche ciblée sur les messages récents (depuis le 25 septembre) de mailer-daemon
    status, data = mail.search(None, '(FROM "mailer-daemon" SINCE "25-Sep-2026")')
    bounce_ids = data[0].split()
    print(f"Notifications de rebond trouvées (dernières 48h) : {len(bounce_ids)}", flush=True)
    
    exclusions = load_exclusions()
    excluded_emails = set(e.lower().strip() for e in exclusions.get("excluded_emails", []))
    excluded_domains = set(d.lower().strip() for d in exclusions.get("excluded_domains", []))
    
    new_excluded_emails = []
    new_excluded_domains = []
    archived_count = 0
    
    for idx, mid in enumerate(bounce_ids, 1):
        res, mdata = mail.fetch(mid, '(RFC822)')
        if not mdata or not mdata[0]:
            continue
        msg = email.message_from_bytes(mdata[0][1])
        
        body = ""
        for part in msg.walk():
            ctype = part.get_content_type()
            if ctype in ['text/plain', 'message/delivery-status']:
                payload = part.get_payload(decode=True)
                if payload:
                    body += payload.decode('utf-8', errors='ignore') + "\n"
        
        # Trouver les adresses emails dans le corps du rebond
        raw_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', body)
        
        # Filtrer pour trouver l'adresse destinataire qui a échoué
        target_emails = []
        for e in raw_emails:
            el = e.lower().strip()
            if any(skip in el for skip in ['google', 'domtomconnect', 'mailer-daemon', 'gmail.com/', 'rfc822', 'formspree', 'w3.org']):
                continue
            if el not in target_emails:
                target_emails.append(el)
                
        failed_email = target_emails[0] if target_emails else None
        
        if failed_email:
            domain = failed_email.split('@')[1] if '@' in failed_email else ''
            
            # Ajouter aux exclusions permanentes
            if failed_email not in excluded_emails:
                excluded_emails.add(failed_email)
                new_excluded_emails.append(failed_email)
                
            if domain and domain not in ['gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'outlook.fr', 'outlook.com', 'icloud.com']:
                if domain not in excluded_domains:
                    excluded_domains.add(domain)
                    new_excluded_domains.append(domain)
                    
            print(f"[{idx:02d}/{len(bounce_ids)}] Rebond détecté : {failed_email} (Domaine: {domain})", flush=True)
        
        # Archiver dans Gmail : Marquer lu + retirer de la boîte de réception
        try:
            mail.store(mid, '+FLAGS', '\\Seen')
            # Supprimer le label INBOX pour archiver hors de la boîte principale
            mail.store(mid, '-X-GM-LABELS', '\\Inbox')
            archived_count += 1
        except Exception as e:
            print(f"    Erreur archivage {mid.decode()} : {e}", flush=True)
            
    # Sauvegarde des exclusions permanentes
    exclusions["excluded_emails"] = sorted(list(excluded_emails))
    exclusions["excluded_domains"] = sorted(list(excluded_domains))
    save_exclusions(exclusions)
    
    print(f"\n=== BILAN FINAL ===", flush=True)
    print(f"Messages de rebond archivés hors de l'INBOX : {archived_count}", flush=True)
    print(f"Nouvelles adresses rejetées définitivement bloquées : {len(new_excluded_emails)}", flush=True)
    for ne in new_excluded_emails:
        print(f"  - {ne}", flush=True)
    print(f"Nouveaux domaines bloqués : {len(new_excluded_domains)}", flush=True)
    for nd in new_excluded_domains:
        print(f"  - {nd}", flush=True)
    print(f"Total global exclusions actives : {len(exclusions['excluded_emails'])} adresses et {len(exclusions['excluded_domains'])} domaines.", flush=True)

if __name__ == '__main__':
    run()
