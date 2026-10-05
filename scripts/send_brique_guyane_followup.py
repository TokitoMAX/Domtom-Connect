import smtplib, ssl, json, time, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target

LEAD = {
    "name": "La Brique de Guyane (Damien Sarazin)",
    "to": ["damien.sarazin@labriquedeguyane.com"],
    "cc": ["adv@labriquedeguyane.com"],
    "subject": "Eco-materiaux amazoniens et valorisation industrielle / La Brique de Guyane",
    "body": """Bonjour Monsieur Sarazin,

Votre secretariat m'a invite a me rapprocher directement de vous concernant le developpement et les synergies industrielles de La Brique de Guyane.

Je me permets de vous contacter au nom de Domtom Connect. Nous animons une plateforme d'affaires et une communaute numerique regroupant les dirigeants de PME et industriels des Outre-mer, d'Afrique et de la diaspora, portee par l'application mobile DTC Pulse.

La fabrication locale de materiaux georesilients en terre crue stabilisee que vous developpez a Matoury est une reponse industrielle exemplaire face aux couts d'importation et a l'empreinte carbone dans le batiment amazonien.

Nous serions ravis d'echanger brievement avec vous pour faire connaissance, comprendre vos enjeux d'expansion et etudier les passerelles que notre reseau professionnel peut offrir a votre etablissement.

Seriez-vous disponible pour un court echange telephonique de dix minutes ces prochains jours selon vos horaires en Guyane ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
}

def main():
    print("=== ENVOI DU RELAIS LA BRIQUE DE GUYANE (DAMIEN SARAZIN) ===")
    
    # 1. Sécurité
    assert ":" not in LEAD["subject"], "Deux-points dans sujet"
    assert ":" not in LEAD["body"], "Deux-points dans corps"
    
    for em in LEAD["to"] + LEAD["cc"]:
        ok, msg = verify_email_target(em)
        assert ok, f"MX fail pour {em}: {msg}"
        print(f"Sécurité OK : {em}")

    # 2. Envoi SMTP
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 465
    SENDER_EMAIL = "domtomconnect@gmail.com"
    APP_PASSWORD = "geqpuqluimxdjxeo"

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        
        msg = MIMEText(LEAD["body"], "plain", "utf-8")
        msg["Subject"] = LEAD["subject"]
        msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
        msg["To"] = ", ".join(LEAD["to"])
        if LEAD["cc"]:
            msg["Cc"] = ", ".join(LEAD["cc"])
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
        
        recipients = LEAD["to"] + LEAD["cc"]
        server.sendmail(SENDER_EMAIL, recipients, msg.as_string())
        print(f"ENVOYÉ AVEC SUCCÈS À : {recipients}")

    # 3. Mise à jour de la base de contacts
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_file = os.path.join(base_dir, "contacts_deja_contactes.json")
    with open(db_file, "r", encoding="utf-8") as f:
        db = json.load(f)

    for em in recipients:
        em_clean = em.lower().strip()
        if em_clean not in db.get("emails", []):
            db.setdefault("emails", []).append(em_clean)
        existing = set(c["email"].lower().strip() for c in db.get("contacts", []))
        if em_clean not in existing:
            db.setdefault("contacts", []).append({"email": em_clean, "company": "La Brique de Guyane B2TG"})

    db["total_contacts"] = len(db["contacts"])

    temp_f = db_file + ".tmp"
    with open(temp_f, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    for _ in range(5):
        try:
            os.replace(temp_f, db_file)
            break
        except Exception:
            time.sleep(0.5)

    print(f"Base de données mise à jour : {db['total_contacts']} contacts uniques.")

if __name__ == "__main__":
    main()
