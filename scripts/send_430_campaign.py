import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json
import time
import random
import sys
import os

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "geqpuqluimxdjxeo"

PROSPECTS_FILE = os.path.join(os.path.dirname(__file__), "..", "prospects_430.json")
EXCLUSION_FILE = os.path.join(os.path.dirname(__file__), "..", "contacts_deja_contactes.json")

def send_batch(start_idx=0, count=430, dry_run=True):
    with open(PROSPECTS_FILE, "r", encoding="utf-8") as f:
        all_prospects = json.load(f)

    with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
        db_exclusion = json.load(f)

    known_emails = set(c["email"].lower().strip() for c in db_exclusion["contacts"])
    known_domains = set(db_exclusion["domains"])

    batch = all_prospects[start_idx:start_idx + count]
    print(f"\n==========================================")
    print(f"LANCEMENT CAMPAGNE 430 ENTREPRISES")
    print(f"Lot : {len(batch)} prospects (de #{start_idx+1} à #{start_idx + len(batch)})")
    print(f"Mode : {'SIMULATION (DRY-RUN)' if dry_run else 'ENVOI EN DIRECT (LIVE)'}")
    print(f"==========================================\n")

    sent_count = 0
    errors_count = 0

    for idx, p in enumerate(batch, 1):
        to_email = p["email"].lower().strip()
        domain = to_email.split("@")[1]

        if to_email in known_emails or domain in known_domains:
            print(f"[{idx}/{len(batch)}] IGNORE (déjà dans la base d'exclusion) : {to_email}")
            continue

        subject = p["sujet"]
        body = p["corps"]

        print(f"[{idx}/{len(batch)}] {p['entreprise']} ({p['zone']} - {p['langue'].upper()})")
        print(f"  Destinataire : {to_email}")
        print(f"  Offre : {p['offre'].upper()}")
        print(f"  Objet : {subject}")

        if not dry_run:
            msg = MIMEText(body, "plain", "utf-8")
            msg["Subject"] = Header(subject, "utf-8")
            msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
            msg["To"] = to_email

            try:
                with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                    server.login(EMAIL_USER, EMAIL_PASS)
                    server.sendmail(EMAIL_USER, [to_email], msg.as_string())
                print(f"  -> Envoyé avec succès !")
                sent_count += 1

                # Mettre à jour la base d'exclusion en temps réel
                known_emails.add(to_email)
                known_domains.add(domain)
                db_exclusion["contacts"].append({
                    "email": to_email,
                    "name": p["entreprise"],
                    "domain": domain,
                    "count_sent": 1,
                    "count_received": 0,
                    "last_date": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "subjects": [subject]
                })

                # Sauvegarder la base d'exclusion par sécurité tous les 10 envois
                if sent_count % 10 == 0:
                    db_exclusion["total_contacts"] = len(db_exclusion["contacts"])
                    db_exclusion["total_domains"] = len(known_domains)
                    db_exclusion["domains"] = sorted(list(known_domains))
                    with open(EXCLUSION_FILE, "w", encoding="utf-8") as f:
                        json.dump(db_exclusion, f, indent=2, ensure_ascii=False)

            except Exception as e:
                print(f"  -> Erreur envoi : {e}")
                errors_count += 1

            # Délai aléatoire entre 12 et 22 secondes pour sécurité Gmail
            sleep_sec = random.uniform(12, 22)
            print(f"  Pause naturelle ({sleep_sec:.1f}s)...", flush=True)
            time.sleep(sleep_sec)
        else:
            sent_count += 1

    if not dry_run:
        db_exclusion["total_contacts"] = len(db_exclusion["contacts"])
        db_exclusion["total_domains"] = len(known_domains)
        db_exclusion["domains"] = sorted(list(known_domains))
        with open(EXCLUSION_FILE, "w", encoding="utf-8") as f:
            json.dump(db_exclusion, f, indent=2, ensure_ascii=False)
        print("\nBase d'exclusion synchronisée avec succès.")

    print(f"\nTerminé : {sent_count} traités, {errors_count} erreurs.")

if __name__ == "__main__":
    is_live = "--send-live" in sys.argv
    start = 0
    limit = 430

    for arg in sys.argv:
        if arg.startswith("--limit="):
            limit = int(arg.split("=")[1])
        elif arg.startswith("--start="):
            start = int(arg.split("=")[1])

    send_batch(start_idx=start, count=limit, dry_run=not is_live)
