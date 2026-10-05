import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_FILE = os.path.join(BASE_DIR, "scripts", "pending_replies.json")
EXCLUSIONS_FILE = os.path.join(BASE_DIR, "scripts", "exclusions.json")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

def load_data():
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_exclusions():
    if os.path.exists(EXCLUSIONS_FILE):
        with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"excluded_emails": [], "excluded_domains": []}

def check_no_colons(text):
    # Rule 4: No colons in outgoing email body
    return ":" not in text

def send_all():
    items = load_data()
    exclusions = load_exclusions()
    excluded_emails = set(e.lower().strip() for e in exclusions.get("excluded_emails", []))
    excluded_domains = set(d.lower().strip() for d in exclusions.get("excluded_domains", []))

    print(f"=== PRÉPARATION DE L'ENVOI DE {len(items)} RÉPONSES APPROUVÉES ===", flush=True)

    # Validation préalable
    for item in items:
        to_addr = item["to"].lower().strip()
        domain = to_addr.split("@")[1] if "@" in to_addr else ""
        if to_addr in excluded_emails or domain in excluded_domains:
            print(f"[ERREUR] Destinataire exclu trouvé: {to_addr}. Abandon.")
            return False
        if not check_no_colons(item["body"]):
            print(f"[ERREUR] Présence de deux-points interdits dans le corps pour {to_addr}. Abandon.")
            return False

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP établie avec succès.\n", flush=True)

        for idx, item in enumerate(items, 1):
            to_addr = item["to"]
            msg = MIMEText(item["body"], "plain", "utf-8")
            msg["Subject"] = Header(item["subject"], "utf-8")
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = to_addr
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

            if item.get("in_reply_to"):
                msg["In-Reply-To"] = item["in_reply_to"]
            if item.get("references"):
                msg["References"] = item["references"]

            print(f"[{idx}/{len(items)}] Envoi à {item['target_name']} ({to_addr})...", flush=True)
            server.sendmail(SENDER_EMAIL, [to_addr], msg.as_string())
            print(f"   -> Envoyé avec succès !", flush=True)

            if idx < len(items):
                delay = random.uniform(8, 15)
                print(f"   Attente de sécurité {delay:.1f}s...\n", flush=True)
                time.sleep(delay)

    print("\nToutes les réponses ont été envoyées avec succès !", flush=True)
    return True

if __name__ == "__main__":
    send_all()
