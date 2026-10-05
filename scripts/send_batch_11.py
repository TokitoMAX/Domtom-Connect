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

LEADS_FILE = "batch_11_verified.json"
EXCLUSION_FILE = "contacts_deja_contactes.json"

def get_fr_copilotage(company):
    return f"""Bonjour,

En tant que dirigeant, votre temps doit servir en priorité à développer votre activité et faire rentrer du chiffre d'affaires.

Le problème est que les journées sont souvent absorbées par des tâches opérationnelles chronophages qui prennent énormément d'énergie sans générer directement de ventes.

Avec Domtom Connect, j'interviens comme copilote opérationnel sur-mesure. Vous vous concentrez sur le business et je prends en charge ce qui vous ralentit.

Avez-vous 15 minutes cette semaine pour échanger sur vos priorités actuelles et voir ce qui pourrait vous être délégué ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_fr_tremplin(company):
    return f"""Bonjour,

Lancer et structurer une entreprise demande d'aller vite sans se perdre dans la théorie.

Avec le programme Tremplin de Domtom Connect, nous accompagnons les fondateurs pour valider leurs offres, sécuriser leurs marges et mettre en place leur acquisition afin de passer rapidement un cap.

Seriez-vous disponible pour un échange rapide de 15 minutes cette semaine afin de faire le point sur vos prochains paliers de croissance ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def check_no_colons(text):
    if ":" in text:
        raise ValueError("ERREUR: Présence de deux-points interdite !")

def main():
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        leads = json.load(f)

    with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
        db_exclusion = json.load(f)

    known_emails = set(c["email"].lower().strip() for c in db_exclusion["contacts"])
    known_domains = set(db_exclusion["domains"])

    print(f"\n=======================================================")
    print(f"ENVOI DE BATCH 11 : {len(leads)} PROSPECTS ULTRA-CERTIFIÉS")
    print(f"=======================================================\n")

    sent = 0
    errors = 0

    for idx, p in enumerate(leads, 1):
        name = p["name"]
        to_email = p["email"].lower().strip()
        domain = p["domain"]
        offer = p["offre"]

        if to_email in known_emails:
            print(f"[{idx}/{len(leads)}] DÉJÀ EN BASE (Email) : {to_email}")
            continue
        if domain not in ["gmail.com", "wanadoo.fr"] and domain in known_domains:
            print(f"[{idx}/{len(leads)}] DÉJÀ EN BASE (Domaine) : {to_email}")
            continue

        if offer == "tremplin":
            subject = f"Accélération et structuration / {name}"
            body = get_fr_tremplin(name)
        else:
            subject = f"Vos tâches énergivores / {name}"
            body = get_fr_copilotage(name)

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
            if domain not in ["gmail.com", "wanadoo.fr"]:
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
