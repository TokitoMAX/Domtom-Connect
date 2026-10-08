import sys
import os
import smtplib
import time
import json
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate, make_msgid

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_domain_mx

JSON_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batch_82_conciergeries_lodges.json")
with open(JSON_FILE, "r", encoding="utf-8") as f:
    TARGETS = json.load(f)

def audit_batch():
    print("=" * 80)
    print("AUDIT DE CONFORMITÉ STRICTE — BATCH 82 (CONCIERGERIES DE PRESTIGE & ÉCOLODGES)")
    print("=" * 80)

    db_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contacts_deja_contactes.json")
    with open(db_file, encoding='utf-8') as f:
        db = json.load(f)
    contacted_emails = {c.get("email", "").lower().strip() for c in db.get("contacts", [])}
    contacted_domains = set(db.get("domains", []))

    exclusions_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "exclusions.json")
    with open(exclusions_file, encoding='utf-8') as f:
        exclusions = json.load(f)
    excluded_emails = {e.lower().strip() for e in exclusions.get("excluded_emails", [])}
    excluded_domains = {d.lower().strip() for d in exclusions.get("excluded_domains", [])}

    has_error = False

    for i, t in enumerate(TARGETS, 1):
        comp = t["company"]
        email = t["email"].lower().strip()
        subj = t["subject"]
        body = t["body"]
        domain = email.split('@')[1]
        loc = t["territory"]
        src = t["source"]

        # Règle 1 : Zéro devinette
        if not src or "http" not in src:
            print(f"[{i:02d}/15] ERREUR REGLE 1 : Pas de source vérifiable pour {comp}")
            has_error = True

        # Règle 2 : Exclusion / Rebond historique
        if email in excluded_emails or domain in excluded_domains:
            print(f"[{i:02d}/15] ERREUR REGLE 5 : Email ou domaine dans exclusions.json pour {comp} ({email})")
            has_error = True

        # Règle 3 : Déduplication
        if email in contacted_emails:
            print(f"[{i:02d}/15] ERREUR DOUBLON : Email déjà contacté pour {comp} ({email})")
            has_error = True

        # Règle 4 : Validation DNS & MX
        mx_ok, mx_msg = verify_domain_mx(domain)
        if not mx_ok:
            print(f"[{i:02d}/15] ERREUR DNS/MX : Domaine {domain} sans MX actif ({mx_msg})")
            has_error = True

        # Règle 5 : Zéro deux-points (:)
        if ":" in subj:
            print(f"[{i:02d}/15] ERREUR REGLE 4 : Deux-points trouvé dans le sujet de {comp}")
            has_error = True
        if ":" in body:
            print(f"[{i:02d}/15] ERREUR REGLE 4 : Deux-points trouvé dans le corps de {comp}")
            has_error = True

        # Règle 6 : Aucun tiret d'incise ( - )
        if " - " in subj:
            print(f"[{i:02d}/15] ERREUR REGLE 7 : Tiret d'incise trouvé dans le sujet de {comp}")
            has_error = True
        if " - " in body:
            print(f"[{i:02d}/15] ERREUR REGLE 7 : Tiret d'incise trouvé dans le corps de {comp}")
            has_error = True

        # Règle 7 : Zéro emoji
        emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
        if emoji_pattern.findall(subj) or emoji_pattern.findall(body):
            print(f"[{i:02d}/15] ERREUR EMOJI : Emoji trouvé dans {comp}")
            has_error = True

        print(f"[{i:02d}/15] OK : {comp} ({loc}) <{email}> -> MX OK ({domain})")

    print("=" * 80)
    if has_error:
        print("AUDIT ÉCHOUÉ : Des erreurs doivent être corrigées avant tout envoi.")
        sys.exit(1)
    else:
        print("AUDIT RÉUSSI : 100% DES 15 CIBLES DU BATCH 82 SONT CONFORMES ET PRÊTES.")
        print("=" * 80)

def send_batch():
    audit_batch()

    db_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "contacts_deja_contactes.json")
    with open(db_file, encoding='utf-8') as f:
        db = json.load(f)

    smtp_server = "smtp.gmail.com"
    smtp_port = 465
    smtp_user = "domtomconnect@gmail.com"
    smtp_pass = os.environ.get("GMAIL_APP_PASS", "geqpuqluimxdjxeo")

    print("\nConnexion SMTP en cours sur smtp.gmail.com:465...")
    server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30)
    server.login(smtp_user, smtp_pass)
    print("Connexion SMTP établie avec succès.\n")

    sent_count = 0
    total = len(TARGETS)

    for i, t in enumerate(TARGETS, 1):
        comp = t["company"]
        email = t["email"]
        subj = t["subject"]
        body = t["body"]

        msg = MIMEMultipart("alternative")
        msg["From"] = f"Loïc Villeronce <{smtp_user}>"
        msg["To"] = f"{comp} <{email}>"
        msg["Subject"] = subj
        msg["Date"] = formatdate(localtime=True)
        msg_id = make_msgid(domain="domtomconnect.com")
        msg["Message-ID"] = msg_id

        msg.attach(MIMEText(body, "plain", "utf-8"))

        print(f"[{i:02d}/{total:02d}] Envoi en cours à {comp} <{email}>...")
        try:
            server.sendmail(smtp_user, [email], msg.as_string())
            print(f"  -> Délivré avec succès ! Message-ID : {msg_id}")
            sent_count += 1

            contact_record = {
                "email": email.lower().strip(),
                "nom": comp,
                "prenom": "",
                "entreprise": comp,
                "batch": "batch_82",
                "date_contact": time.strftime("%Y-%m-%d"),
                "statut": "ENVOYE",
                "source": t["source"],
                "notes": f"Batch 82 - Pôle Conciergeries de Prestige & Écolodges ({t['territory']})"
            }
            db["contacts"].append(contact_record)
            domain = email.split('@')[1].lower().strip()
            if domain not in db["domains"]:
                db["domains"].append(domain)
            db["total_contacts"] = len(db["contacts"])
            db["total_domains"] = len(db["domains"])

            with open(db_file, "w", encoding="utf-8") as f_out:
                json.dump(db, f_out, ensure_ascii=False, indent=2)

            if i < total:
                pause = 13.0 + (i % 3) * 2.0
                print(f"  Pause de sécurité anti-spam ({pause:.1f}s)...")
                time.sleep(pause)

        except Exception as e:
            print(f"  -> ERREUR d'envoi à {comp} <{email}> : {e}")

    server.quit()
    print("\n" + "=" * 80)
    print(f"RÉSULTAT : {sent_count}/{total} EMAILS DÉLIVRÉS AVEC SUCCÈS.")
    print("=" * 80)

if __name__ == "__main__":
    if "--send" in sys.argv:
        send_batch()
    else:
        audit_batch()
