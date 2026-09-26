import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

RECIPIENT = "louiseloc972@gmail.com"
SUBJECT = "Re - Vos priorités d'exploitation aux Trois-Îlets / Louiseloc"

BODY = """Bonjour,

C'est bien noté, et je vous rassure tout de suite, je ne venais absolument pas vous vendre une prestation ou un abonnement !

J'imagine que vous êtes régulièrement sollicitée par des agences et des démarcheurs qui vous font perdre votre temps, d'où votre réponse directe, et vous avez parfaitement raison de protéger vos journées.

En réalité, en regardant ce que vous avez bâti aux Trois-Îlets, j'ai trouvé votre formule combinant la location de véhicules et votre hébergement T3 avec piscine particulièrement intelligente. C'est exactement le genre d'offre complète et indépendante que recherchent les voyageurs et la diaspora qui souhaitent faire travailler des acteurs locaux plutôt que des multinationales.

Notre démarche chez Domtom Connect est avant tout de fédérer un réseau d'entraide entre entrepreneurs de Martinique et d'ailleurs, pour partager des recommandations directes, échanger des solutions concrètes et mettre en lumière des structures locales comme la vôtre.

Même sans parler d'aucun partenariat formel, par simple curiosité entrepreneuriale, qu'est-ce qui tourne le mieux pour vous aujourd'hui pour remplir vos voitures et votre hébergement — le bouche-à-oreille direct ou les plateformes en ligne ? Et est-ce que les commissions des intermédiaires ne sont pas trop lourdes à supporter ?

Quoi qu'il en soit, je vous souhaite une très belle saison aux Trois-Îlets et plein de réussite dans le développement de Louiseloc.

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""

def verify_and_send(dry_run=True):
    if ":" in SUBJECT or ":" in BODY:
        raise ValueError("Présence interdite de deux-points dans le sujet ou le corps")
        
    print(f"Destinataire : {RECIPIENT}")
    print(f"Sujet : {SUBJECT}")
    print("\nCorps du message :\n")
    print(BODY)
    
    if dry_run:
        print("\n[SIMULATION] Le message est validé techniquement. Prêt à être expédié.")
        return
        
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        msg = MIMEText(BODY, "plain", "utf-8")
        msg["Subject"] = SUBJECT
        msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
        msg["To"] = RECIPIENT
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
        
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())
        print("\n[ENVOYÉ] Réponse stratégique envoyée avec succès à Louiseloc.")

if __name__ == "__main__":
    is_live = "--send" in sys.argv
    verify_and_send(dry_run=not is_live)
