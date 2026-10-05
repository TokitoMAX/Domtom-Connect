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

CANDIDATES_FILE = "verified_candidates.json"
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

def get_en_copilotage(company):
    return f"""Hello,

As a business leader, your time is best spent driving revenue and closing clients.

However, daily operational and administrative tasks often drain hours without directly generating sales.

At Domtom Connect, we act as an executive copilot on demand. You focus on growth, while we handle the time-consuming tasks slowing you down.

Would you have 15 minutes this week for a brief call to see where we could take things off your plate?

Best regards,

Loïc Villeronce
Founder — Domtom Connect"""

def get_en_tremplin(company):
    return f"""Hello,

Scaling a young company requires execution over endless planning.

Through Domtom Connect's Tremplin program, we work directly with founders to validate offers, protect margins, and set up clear growth engines to reach the next milestone quickly.

Would you be open to a quick 15-minute exchange this week to discuss your upcoming growth targets?

Best regards,

Loïc Villeronce
Founder — Domtom Connect"""

def get_es_copilotage(company):
    return f"""Hola,

Como director, su tiempo debe enfocarse en generar ventas y hacer crecer su negocio.

Sin embargo, las tareas operativas consumen mucha energía sin generar ingresos directos.

En Domtom Connect actuamos como copiloto operativo a medida. Usted se enfoca en el negocio y nosotros gestionamos lo que le quita tiempo.

¿Tendría 15 minutos esta semana para una breve llamada sobre sus prioridades actuales?

Atentamente,

Loïc Villeronce
Fundador — Domtom Connect"""

def get_es_tremplin(company):
    return f"""Hola,

Escalar una empresa joven requiere ejecución práctica más que teoría.

A través del programa Tremplin de Domtom Connect, acompañamos a los fundadores para validar ofertas, proteger márgenes y activar canales de captación para dar un salto de crecimiento.

¿Estaría disponible para una llamada de 15 minutos esta semana para analizar sus próximos objetivos?

Atentamente,

Loïc Villeronce
Fundador — Domtom Connect"""

def main():
    with open(CANDIDATES_FILE, "r", encoding="utf-8") as f:
        candidates = json.load(f)

    with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
        db_exclusion = json.load(f)

    known_emails = set(c["email"].lower().strip() for c in db_exclusion["contacts"])
    known_domains = set(db_exclusion["domains"])

    print(f"\n=======================================================")
    print(f"ENVOI SUR LES {len(candidates)} ENTREPRISES RÉELLES VÉRIFIÉES")
    print(f"=======================================================\n")

    sent = 0
    errors = 0

    for idx, c in enumerate(candidates, 1):
        name = c["name"]
        domain = c["domain"]
        email = c["email"].lower().strip()
        lang = c["lang"]
        offer = c["offre"]

        if email in known_emails or domain in known_domains:
            print(f"[{idx}/{len(candidates)}] DÉJÀ EXCLU : {email}")
            continue

        if lang == "fr":
            subject = f"Vos tâches énergivores / {name}" if offer == "copilotage" else f"Accélération et structuration / {name}"
            body = get_fr_copilotage(name) if offer == "copilotage" else get_fr_tremplin(name)
        elif lang == "en":
            subject = f"Freeing up your time / {name}" if offer == "copilotage" else f"Scaling your business / {name}"
            body = get_en_copilotage(name) if offer == "copilotage" else get_en_tremplin(name)
        else:
            subject = f"Optimización de su tiempo operativo / {name}" if offer == "copilotage" else f"Aceleración y estructuración / {name}"
            body = get_es_copilotage(name) if offer == "copilotage" else get_es_tremplin(name)

        print(f"[{idx}/{len(candidates)}] {name} ({c['zone']} - {lang.upper()}) -> {email}")
        print(f"  Objet: {subject}")

        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = Header(subject, "utf-8")
        msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
        msg["To"] = email

        try:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(EMAIL_USER, EMAIL_PASS)
                server.sendmail(EMAIL_USER, [email], msg.as_string())
            print(f"  -> Envoyé avec succès !")
            sent += 1

            # Mettre à jour exclusion
            known_emails.add(email)
            known_domains.add(domain)
            db_exclusion["contacts"].append({
                "email": email,
                "name": name,
                "domain": domain,
                "count_sent": 1,
                "count_received": 0,
                "last_date": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "subjects": [subject]
            })

            # Sauvegarde régulière
            db_exclusion["total_contacts"] = len(db_exclusion["contacts"])
            db_exclusion["total_domains"] = len(known_domains)
            db_exclusion["domains"] = sorted(list(known_domains))
            with open(EXCLUSION_FILE, "w", encoding="utf-8") as f_out:
                json.dump(db_exclusion, f_out, indent=2, ensure_ascii=False)

        except Exception as e:
            print(f"  -> Erreur : {e}")
            errors += 1

        # Pause aléatoire entre 12 et 20 secondes
        sleep_sec = random.uniform(12, 20)
        print(f"  Pause de sécurité ({sleep_sec:.1f}s)...", flush=True)
        time.sleep(sleep_sec)

    print(f"\nTerminé ! {sent} envoyés avec succès, {errors} erreurs.")

if __name__ == "__main__":
    main()
