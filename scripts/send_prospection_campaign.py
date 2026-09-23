import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json
import time
import sys
import os

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

PROSPECTS_FILE = os.path.join(os.path.dirname(__file__), "..", "fichier_prospection_copilotage.json")

def generate_email_body(company_name):
    return f"""Bonjour,

En tant que dirigeant, votre temps doit servir en priorité à développer votre activité et faire rentrer du chiffre d'affaires.

Le problème, c'est que les journées sont souvent absorbées par des tâches opérationnelles, techniques ou de coordination qui prennent énormément d'énergie sans générer directement de ventes.

Avec Domtom Connect, j'interviens comme copilote opérationnel sur-mesure :
- Vous vous concentrez sur ce qui fait tourner et grandir le business.
- Je prends en charge les tâches énergivores qui vous ralentissent et vous font perdre votre temps.

Avez-vous 15 minutes cette semaine pour échanger sur vos priorités actuelles et voir ce qui pourrait vous être délégué ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
"""

def send_campaign(dry_run=True):
    with open(PROSPECTS_FILE, "r", encoding="utf-8") as f:
        prospects = json.load(f)

    print(f"Chargement de {len(prospects)} prospects.")
    if dry_run:
        print("\n--- MODE SIMULATION (DRY-RUN) --- Aucun email externe ne sera envoyé.")
    else:
        print("\n--- MODE ENVOI REEL ACTIVE ---")

    for p in prospects:
        to_email = p["email"]
        company = p["entreprise"]
        subject = f"Vos tâches énergivores / {company}"
        body = generate_email_body(company)

        print(f"\n[Prospect #{p['id']}] {company} -> {to_email}")
        print(f"  Objet: {subject}")

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
            except Exception as e:
                print(f"  -> Erreur lors de l'envoi : {e}")

            # Pause naturelle de 15 secondes entre chaque envoi
            print("  Attente de sécurité (15s)...")
            time.sleep(15)

if __name__ == "__main__":
    is_live = "--send-live" in sys.argv
    send_campaign(dry_run=not is_live)
