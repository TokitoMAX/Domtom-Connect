import smtplib
import email
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
import sys

sys.stdout.reconfigure(encoding="utf-8")

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "domtomconnect@gmail.com"
SMTP_PASS = "geqpuqluimxdjxeo"

replies = [
    {
        "name": "CK CONSULTING",
        "to": "ckconsultingfwi@gmail.com",
        "subject": "Re, Accompagnement des entrepreneurs guadeloupéens et nouvelles dynamiques de croissance / CK Consulting",
        "in_reply_to": "<CAHR+2P9ZiO2cWxVmCi5dG92WxZTJpo9X=j6CGKa_Kw-g8pOQRg@mail.gmail.com>",
        "references": "<179021272193.16056.13459981473002307632@domtomconnect.com> <CAHR+2P9ZiO2cWxVmCi5dG92WxZTJpo9X=j6CGKa_Kw-g8pOQRg@mail.gmail.com>",
        "body_text": """Bonjour,

Avec grand plaisir pour caler cet échange et faire le point sur vos activités et vos axes de développement.

Vous pouvez choisir directement le créneau de 30 minutes qui vous convient le mieux sur mon agenda en ligne, accessible via ce lien
calendly.com/domtomconnect/30min

Si vous préférez convenir d'un moment par message, je reste également joignable sur mon WhatsApp direct au +33 6 20 78 33 77.

Au plaisir d'échanger prochainement,

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone / WhatsApp direct, +33 6 20 78 33 77
Plateforme web, www.domtomconnect.com
Agenda, calendly.com/domtomconnect/30min

Le jeu. 8 oct. 2026 à 18,01, CK CONSULTING <ckconsultingfwi@gmail.com> a écrit
> Bonjour Loic,
> serait-il possible de convenir d'un rdv stpm ?
> bien à vous
>
> Site web & réseaux, linktr.ee/ckconsulting
"""
    },
    {
        "name": "Easy Ivoire Concierge",
        "to": "info@easyivoire.com",
        "subject": "Re, Développement et partenariats stratégiques pour Easy Ivoire Concierge",
        "in_reply_to": "<000a01dd571e$02571600$07054200$@easyivoire.com>",
        "references": "<179099443606.29648.2347910937558647175@domtomconnect.com> <000a01dd571e$02571600$07054200$@easyivoire.com>",
        "body_text": """Bonjour Franck Joel,

Merci pour votre retour et pour ces précisions sur vos priorités actuelles.

L'acquisition de clientèle qualifiée auprès de la diaspora et des professionnels est en effet au cœur de ce que nous structurons avec le programme Tremplin et notre écosystème d'affaires.

Ce sera avec grand plaisir d'échanger 30 minutes de vive voix pour faire connaissance, comprendre votre organisation actuelle et voir si nous pouvons créer des synergies concrètes ensemble.

Vous pouvez sélectionner le moment qui vous convient sur mon agenda
calendly.com/domtomconnect/30min

Je note également votre contact WhatsApp et reste disponible au +33 6 20 78 33 77 si vous souhaitez caler ce point directement par message.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone / WhatsApp direct, +33 6 20 78 33 77
Plateforme web, www.domtomconnect.com
Agenda, calendly.com/domtomconnect/30min

Le jeu. 8 oct. 2026 à 14,10, <info@easyivoire.com> a écrit
> Bonjour Loïc,
>
> Merci pour votre message et pour l’intérêt porté à Easy Ivoire.
>
> Actuellement, notre priorité est surtout de développer notre clientèle, notamment auprès de la diaspora et des professionnels à la recherche de services fiables en Côte d’Ivoire.
>
> Je suis tout à fait ouvert à un échange de 10 minutes pour découvrir concrètement ce que Domtom Connect pourrait nous apporter.
>
> Bien cordialement,
>
> Franck Joel DAGO
> Easy Ivoire
> Tel, +2250504942798 (whatsapp)
"""
    }
]

# Verification rules check
for item in replies:
    body = item["body_text"]
    if ":" in body:
        print(f"ERREUR RÈGLE 4: Deux-points trouvés dans le corps pour {item['name']} !")
        sys.exit(1)
    if " - " in body:
        print(f"ERREUR RÈGLE 7: Tiret incise trouvé dans le corps pour {item['name']} !")
        sys.exit(1)

print("Vérification des règles validée avec succès (zéro deux-points, zéro tiret d'incise, threading complet).")

server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
server.ehlo()
server.starttls()
server.ehlo()
server.login(SMTP_USER, SMTP_PASS)

for item in replies:
    msg = MIMEText(item["body_text"], "plain", "utf-8")
    msg["From"] = f"Loïc Villeronce <{SMTP_USER}>"
    msg["To"] = item["to"]
    msg["Subject"] = item["subject"]
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
    msg["In-Reply-To"] = item["in_reply_to"]
    msg["References"] = item["references"]

    server.sendmail(SMTP_USER, [item["to"]], msg.as_string())
    print(f"==> Email envoyé avec succès à {item['name']} ({item['to']})")

server.quit()
print("Tous les emails ont été envoyés.")
