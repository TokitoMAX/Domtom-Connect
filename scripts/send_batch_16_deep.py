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

LEADS_FILE = "batch_16_deep_researched.json"
EXCLUSION_FILE = "contacts_deja_contactes.json"

def check_no_colons(text):
    if ":" in text:
        raise ValueError("ERREUR: Présence de deux-points interdite dans le corps de l'email !")

def main():
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        leads = json.load(f)

    with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
        db_exclusion = json.load(f)

    known_emails = set(c["email"].lower().strip() for c in db_exclusion["contacts"])
    known_domains = set(db_exclusion["domains"])

    print(f"\n=======================================================")
    print(f"ENVOI BATCH 16 : {len(leads)} PROSPECTS HYPER-CIBLÉS 1-TO-1")
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
            print(f"[{idx}/{len(leads)}] DÉJÀ EN BASE (Email) : {to_email}")
            continue
        if domain != "gmail.com" and domain in known_domains:
            print(f"[{idx}/{len(leads)}] DÉJÀ EN BASE (Domaine) : {to_email}")
            continue

        # Strict validation : zero colons
        check_no_colons(body)

        print(f"[{idx}/{len(leads)}] {name} ({p['zone']}) -> {to_email}")
        print(f"  Objet: {subject}")

        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = Header(subject, "utf-8")
        msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
        msg["To"] = to_email

        try:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(EMAIL_USER, EMAIL_PASS)
                server.sendmail(EMAIL_USER, [to_email], msg.as_string())
            print(f"  -> Envoyé avec succès !")
            sent += 1

            # Mettre à jour exclusion
            known_emails.add(to_email)
            if domain != "gmail.com":
                known_domains.add(domain)
            db_exclusion["contacts"].append({
                "email": to_email,
                "name": name,
                "domain": domain,
                "count_sent": 1,
                "count_received": 0,
                "last_date": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "subjects": [subject]
            })

            # Sauvegarder dans la base
            db_exclusion["total_contacts"] = len(db_exclusion["contacts"])
            db_exclusion["total_domains"] = len(known_domains)
            db_exclusion["domains"] = sorted(list(known_domains))
            with open(EXCLUSION_FILE, "w", encoding="utf-8") as f_out:
                json.dump(db_exclusion, f_out, indent=2, ensure_ascii=False)

        except Exception as e:
            print(f"  -> Erreur d'envoi : {e}")
            errors += 1

        sleep_sec = random.uniform(12, 18)
        print(f"  Pause de sécurité ({sleep_sec:.1f}s)...", flush=True)
        time.sleep(sleep_sec)

    print(f"\nTerminé ! {sent} envoyés avec succès, {errors} erreurs.")

if __name__ == "__main__":
    main()
