import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

FOLLOWUPS = [
    {
        "name": "La Brique de Guyane (Damien Sarazin)",
        "to": ["damien.sarazin@labriquedeguyane.com"],
        "cc": ["adv@labriquedeguyane.com"],
        "subject": "Eco-materiaux amazoniens et valorisation industrielle / La Brique de Guyane",
        "in_reply_to": None,
        "references": None,
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
    },
    {
        "name": "Zantilles Market (Dario)",
        "to": ["contact@zantillesmarket.fr"],
        "cc": [],
        "subject": "Re - Épicerie antillaise en ligne et nouvelles formes de connexion avec la clientèle / Zantilles Market",
        "in_reply_to": "<dd1ba2dcae0105a3fbfc7b4ea274c87f@zantillesmarket.fr>",
        "references": "<dd1ba2dcae0105a3fbfc7b4ea274c87f@zantillesmarket.fr>",
        "body": """Bonjour Dario,

Merci beaucoup pour votre retour transparent et pour ces precisions.

Je comprends parfaitement votre demarche de refonte. C'est justement sur ces defis concrets de rentabilite, de modele economique et de valorisation des circuits antillais dans l'Hexagone que nos echanges prennent tout leur sens.

Je serais ravi que nous puissions faire le point aujourd'hui vendredi vers 14h00, ou sur un autre creneau cet apres-midi qui vous conviendrait.

Je vous joindrai directement sur votre ligne au 06 10 97 45 86.

A tres bientot,

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "name": "Manuel Marchal (Témoignages La Réunion)",
        "to": ["mm.manuelmarchal@gmail.com"],
        "cc": ["journal.temoignages@gmail.com"],
        "subject": "Re - Voix historique de La Reunion et nouvelles dynamiques entrepreneuriales de l'ile / Temoignages",
        "in_reply_to": "<CANGeXCXPcdxGB-SFZ06hh87yr-n2HakiDVBXW4y1ysPQcZZYeg@mail.gmail.com>",
        "references": "<CANGeXCXPcdxGB-SFZ06hh87yr-n2HakiDVBXW4y1ysPQcZZYeg@mail.gmail.com>",
        "body": """Bonjour Manuel,

Merci pour votre reponse et pour cette precision de creneau.

14h00 a La Reunion (soit 12h00 a Paris) me convient parfaitement. Seriez-vous disponible aujourd'hui vendredi pour ce court echange, ou prefereriez-vous caler ce point lundi prochain a 14h00 ?

Je vous joindrai au numero indique (+262 693 87 44 92) a l'heure convenue.

Au plaisir d'echanger prochainement,

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def send_followups():
    print(f"=== ENVOI DES {len(FOLLOWUPS)} MESSAGES APPROUVES ===")
    
    # Verification securite stricte
    for item in FOLLOWUPS:
        if ":" in item["subject"]:
            raise ValueError(f"Deux-points detecte dans l'objet pour {item['name']}")
        if ":" in item["body"]:
            raise ValueError(f"Deux-points detecte dans le corps pour {item['name']}")
    print("Verification de conformite (zero deux-points) reussie.\n")
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP etablie avec succes.\n")
        
        for idx, item in enumerate(FOLLOWUPS, 1):
            msg = MIMEText(item["body"], "plain", "utf-8")
            msg["Subject"] = item["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = ", ".join(item["to"])
            if item["cc"]:
                msg["Cc"] = ", ".join(item["cc"])
            if item["in_reply_to"]:
                msg["In-Reply-To"] = item["in_reply_to"]
            if item["references"]:
                msg["References"] = item["references"]
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="gmail.com")
            
            destinations = item["to"] + item["cc"]
            print(f"[{idx}/{len(FOLLOWUPS)}] Envoi a {item['name']} -> {destinations}...")
            server.sendmail(SENDER_EMAIL, destinations, msg.as_string())
            print(f" -> ENVOYE avec succes.")
            
            if idx < len(FOLLOWUPS):
                pause = random.uniform(12.0, 16.0)
                print(f"   Pause de securite {pause:.1f}s...")
                time.sleep(pause)

    print("\n=== LES 3 MESSAGES ONT ETE ENVOYES AVEC SUCCES ===")

if __name__ == "__main__":
    send_followups()
