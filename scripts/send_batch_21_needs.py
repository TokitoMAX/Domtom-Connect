import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json
import time
import random
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "geqpuqluimxdjxeo"

LEADS_FILE = "batch_21_needs_discovery.json"
EXCLUSION_FILE = "contacts_deja_contactes.json"

def check_no_colons(text):
    if ":" in text:
        raise ValueError("ERREUR: Présence de deux-points interdite dans le corps ou l'objet de l'email !")

def main():
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        leads = json.load(f)

    with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
        db_exclusion = json.load(f)

    known_emails = set(c["email"].lower().strip() for c in db_exclusion["contacts"])
    known_domains = set(db_exclusion["domains"])

    print(f"\n=======================================================")
    print(f"ENVOI BATCH 21 : {len(leads)} DECIDEURS - ECOUTE DES BESOINS REELS")
    print(f"=======================================================\n")

    sent = 0
    errors = 0

    for idx, p in enumerate(leads, 1):
        name = p["name"]
        to_email = p["email"].lower().strip()
        domain = p["domain"]
        subject = p["subject"]
        body = p["body"]

        if to_email in known_emails:
            print(f"[{idx}/{len(leads)}] DEJA EN BASE (Email) : {to_email}")
            continue
        if domain != "gmail.com" and domain in known_domains:
            print(f"[{idx}/{len(leads)}] DEJA EN BASE (Domaine) : {to_email}")
            continue

        # Strict validation : zero colons
        check_no_colons(subject)
        check_no_colons(body)

        print(f"[{idx}/{len(leads)}] {p['company']} ({p['zone']}) -> {to_email}")
        print(f"  Objet: {subject}")

        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = Header(subject, "utf-8")
        msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
        msg["To"] = to_email
        msg["Reply-To"] = EMAIL_USER

        try:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(EMAIL_USER, EMAIL_PASS)
                server.sendmail(EMAIL_USER, [to_email], msg.as_string())
            
            print(f"  ==> ENVOYE AVEC SUCCES A {to_email} !")
            sent += 1

            # Update exclusion lists
            db_exclusion["contacts"].append({
                "email": to_email,
                "name": name,
                "company": p["company"]
            })
            if domain != "gmail.com":
                db_exclusion["domains"].append(domain)

            # Save immediately
            with open(EXCLUSION_FILE, "w", encoding="utf-8") as f:
                json.dump(db_exclusion, f, ensure_ascii=False, indent=2)

        except Exception as e:
            print(f"  [X] ERREUR LORS DE L'ENVOI A {to_email}: {e}")
            errors += 1

        # Pause aleatoire de securite
        if idx < len(leads):
            pause = random.uniform(12.0, 18.0)
            print(f"  Pause de securite: {pause:.1f}s...")
            time.sleep(pause)

    print(f"\n=======================================================")
    print(f"RAPPORT BATCH 21 : {sent} envoyes, {errors} erreurs")
    print(f"=======================================================\n")

if __name__ == "__main__":
    main()
