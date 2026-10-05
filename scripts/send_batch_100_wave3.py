# -*- coding: utf-8 -*-
"""
Script d'envoi du BATCH 100 VAGUE 3 (GLOBAL & ASIE)
- 20 Asie (Chine, Corée du Sud / Paris & International)
- 20 USA (NYC & Miami)
- 15 Canada (Toronto & Montréal)
- 25 Afrique (Lagos, Accra, Nairobi, Cape Town, Kigali)
- 20 France & Caraïbes (DOM-TOM & Hexagone)

Cadence sécurisée : 12 à 17 secondes entre chaque envoi
Mise à jour temps réel de contacts_deja_contactes.json
"""

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

LEADS_FILE = "batch_100_wave3_global_asia.json"
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
    known_domains = set(d.lower().strip() for d in db_exclusion["domains"])

    print(f"\n=======================================================")
    print(f"LANCEMENT DU MEGA-BATCH VAGUE 3 : 100 PROFILS GLOBAUX & ASIE")
    print(f"Cibles: Asie (Chine & Corée), USA, Canada, Afrique, France & Caraïbes")
    print(f"Approche: Écoute humaine, zéro baratin technique, business chill")
    print(f"Site web: www.domtomconnect.com")
    print(f"=======================================================\n")

    sent = 0
    errors = 0
    skipped = 0

    for idx, p in enumerate(leads, 1):
        name = p["name"]
        to_email = p["email"].lower().strip()
        domain = p["domain"].lower().strip()
        company = p["company"]
        zone = p["zone"]
        subject = p["subject"]
        body = p["body"]

        if to_email in known_emails:
            print(f"[{idx}/{len(leads)}] DEJA EN BASE (Email) : {to_email}")
            skipped += 1
            continue

        # Validation stricte zéro deux-points
        check_no_colons(subject)
        check_no_colons(body)

        print(f"[{idx}/{len(leads)}] {company} ({zone}) -> {to_email}")
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
            
            print(f"  ==> [SUCCES] Envoyé à {to_email}")
            sent += 1

            # Mise à jour immédiate de la base d'exclusion
            db_exclusion["contacts"].append({
                "email": to_email,
                "name": name,
                "company": company,
                "zone": zone
            })
            known_emails.add(to_email)

            if domain not in ["gmail.com", "orange.fr", "free.fr", "yahoo.fr", "hotmail.com", "outlook.com"]:
                if domain not in known_domains:
                    db_exclusion["domains"].append(domain)
                    known_domains.add(domain)

            # Sauvegarde temps réel après chaque envoi
            with open(EXCLUSION_FILE, "w", encoding="utf-8") as f:
                json.dump(db_exclusion, f, ensure_ascii=False, indent=2)

        except Exception as e:
            print(f"  [X] ERREUR ENVOI A {to_email}: {e}")
            errors += 1

        # Pause aléatoire de sécurité entre chaque e-mail (12 à 17s)
        if idx < len(leads):
            pause = random.uniform(12.0, 17.0)
            print(f"  ... pause de sécurité ({pause:.1f}s) ...\n")
            time.sleep(pause)

    print(f"\n=======================================================")
    print(f"BILAN CAMPAGNE VAGUE 3")
    print(f"Total traités: {len(leads)}")
    print(f"Envoyés avec succès: {sent}")
    print(f"Ignorés (déjà contactés): {skipped}")
    print(f"Erreurs d'envoi: {errors}")
    print(f"=======================================================\n")

if __name__ == "__main__":
    main()
