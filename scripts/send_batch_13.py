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
EMAIL_PASS = "esbmvnvpvxdqphci"

LEADS_FILE = "batch_13_sector_leads.json"
EXCLUSION_FILE = "contacts_deja_contactes.json"

def get_body_agro(company):
    return f"""Bonjour,

Dans l'agroalimentaire et la production locale, la gestion des approvisionnements, la logistique et les contraintes réglementaires absorbent une part immense de votre temps de dirigeant.

Le risque est de passer vos journées à régler des urgences de production et de distribution, au détriment de la stratégie de marque, des marges et du développement commercial.

Avec Domtom Connect, j'interviens comme copilote opérationnel sur-mesure. Vous vous concentrez sur la vision et la rentabilité, pendant que je prends en charge les tâches de coordination et de suivi opérationnel qui vous saturent.

Avez-vous 15 minutes cette semaine pour faire le point sur vos priorités actuelles et voir ce qui pourrait vous faire gagner du temps ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_body_transport(company):
    return f"""Bonjour,

Dans les métiers du fret et du transit, les imprévus d'acheminement, la coordination des flux et les flux documentaires prennent une énergie considérable.

Ces charges opérationnelles saturent vite le quotidien d'une équipe dirigeante, alors que votre vraie valeur ajoutée réside dans la négociation, la rentabilité des lignes et la relation client.

Avec Domtom Connect, j'interviens comme copilote opérationnel dédié. Je vous soulage des lourdeurs de gestion et d'organisation interne pour fluidifier vos process et libérer votre temps business.

Seriez-vous disponible 15 minutes cette semaine pour échanger sur vos principaux goulots d'étranglement opérationnels ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_body_tourisme(company):
    return f"""Bonjour,

Gérer un site touristique ou une infrastructure nautique exige une présence constante sur l'exploitation, les plannings et l'accueil quotidien.

Ce pilotage opérationnel permanent laisse souvent très peu d'espace au dirigeant pour travailler sur la croissance hors-saison, les nouveaux partenariats et la rentabilité globale.

Avec Domtom Connect, j'agis comme copilote opérationnel à vos côtés. Je prends en main les sujets d'organisation et de coordination interne qui vous ralentissent afin de vous redonner du temps utile.

Auriez-vous 15 minutes cette semaine pour un échange rapide sur vos enjeux actuels de structuration ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_body_tech(company):
    return f"""Bonjour,

Faire grandir une startup ou une fintech demande une vitesse d'exécution permanente entre closing, opérations et structuration.

Lorsque les fondateurs passent trop d'heures sur les frictions opérationnelles et la gestion quotidienne, cela freine directement le déploiement et la trajectoire de croissance.

Avec Domtom Connect, j'interviens comme copilote opérationnel pour absorber vos chantiers chronophages et structurer vos process afin d'accélérer sereinement.

Seriez-vous ouvert à un échange de 15 minutes cette semaine pour faire le point sur vos prochains paliers d'accélération ?

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
    print(f"ENVOI DE BATCH 13 : {len(leads)} PROSPECTS ULTRA-PERSONNALISÉS PAR SECTEUR")
    print(f"=======================================================\n")

    sent = 0
    errors = 0

    for idx, p in enumerate(leads, 1):
        name = p["name"]
        to_email = p["email"].lower().strip()
        domain = p["domain"]
        sector = p["sector"]

        if to_email in known_emails:
            print(f"[{idx}/{len(leads)}] DÉJÀ EN BASE (Email) : {to_email}")
            continue
        if domain != "gmail.com" and domain in known_domains:
            print(f"[{idx}/{len(leads)}] DÉJÀ EN BASE (Domaine) : {to_email}")
            continue

        if sector == "agro":
            subject = f"Optimisation de vos flux et marge / {name}"
            body = get_body_agro(name)
        elif sector == "transport":
            subject = f"Vos opérations et coordination / {name}"
            body = get_body_transport(name)
        elif sector == "tourisme":
            subject = f"Saisonnalité et pilotage opérationnel / {name}"
            body = get_body_tourisme(name)
        else: # tech / fintech
            subject = f"Accélération et structuration / {name}"
            body = get_body_tech(name)

        # Strict validation : zero colons
        check_no_colons(body)

        print(f"[{idx}/{len(leads)}] {name} [{sector.upper()}] ({p['zone']}) -> {to_email}")
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
