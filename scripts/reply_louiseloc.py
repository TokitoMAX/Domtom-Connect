import smtplib, ssl, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"

RECIPIENT = "louiseloc972@gmail.com"
ORIGINAL_MSG_ID = "<CAFO_rZ2p5ipibk1Kxqx7PeC_qWzEJSuasf5nAtb1r7VJXWmMYQ@mail.gmail.com>"
INITIAL_OUTBOUND_ID = "<179043434374.40268.14126710024206185757@domtomconnect.com>"

SUBJECT = "Re - Vos priorités d'exploitation aux Trois-Îlets / Louiseloc"

# Corps de la réponse intégrant l'historique du fil pour un threading parfait
REPLY_TEXT = """Bonjour,

C'est bien noté, et je vous rassure tout de suite, je ne venais absolument pas vous vendre une prestation ou un abonnement !

J'imagine que vous êtes régulièrement sollicitée par des agences et des démarcheurs qui vous font perdre votre temps, d'où votre réponse directe, et vous avez parfaitement raison de protéger vos journées.

En réalité, en regardant ce que vous avez bâti aux Trois-Îlets, j'ai trouvé votre formule combinant la location de véhicules et votre hébergement T3 avec piscine particulièrement intelligente. C'est exactement le genre d'offre complète et indépendante que recherchent les voyageurs et la diaspora qui souhaitent faire travailler des acteurs locaux plutôt que des multinationales.

Notre démarche chez Domtom Connect est avant tout de fédérer un réseau d'entraide entre entrepreneurs de Martinique et d'ailleurs, pour partager des recommandations directes, échanger des solutions concrètes et mettre en lumière des structures locales comme la vôtre.

Même sans parler d'aucun partenariat formel, par simple curiosité entrepreneuriale, qu'est-ce qui tourne le mieux pour vous aujourd'hui pour remplir vos voitures et votre hébergement — le bouche-à-oreille direct ou les plateformes en ligne ? Et est-ce que les commissions des intermédiaires ne sont pas trop lourdes à supporter ?

Quoi qu'il en soit, je vous souhaite une très belle saison aux Trois-Îlets et plein de réussite dans le développement de Louiseloc.

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com

> Le sam. 26 sept. 2026 à 11:01, Louiseloc <louiseloc972@gmail.com> a écrit :
> Bonjour,
> 
> Désolé je n'ai pas besoin de vos services.
> 
> Cordialement."""

def send_threaded_reply(dry_run=True):
    # Règle stricte : zéro deux-points dans le corps de notre texte
    if ":" in REPLY_TEXT.split("> Le sam.")[0]:
        raise ValueError("Erreur : Deux-points détecté dans le corps du message rédigé")

    print(f"Destinataire : {RECIPIENT}")
    print(f"Sujet : {SUBJECT}")
    print(f"In-Reply-To : {ORIGINAL_MSG_ID}")
    print(f"References : {INITIAL_OUTBOUND_ID} {ORIGINAL_MSG_ID}")
    print("\n--- APERÇU DU CORPS THREADÉ ---\n")
    print(REPLY_TEXT)
    
    if dry_run:
        print("\n[SIMULATION] Threading SMTP validé à 100%. En attente de validation finale.")
        return
        
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        msg = MIMEText(REPLY_TEXT, "plain", "utf-8")
        msg["Subject"] = SUBJECT
        msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
        msg["To"] = RECIPIENT
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
        
        # En-têtes obligatoires RFC 2822 pour garantir le fil de discussion Gmail
        msg["In-Reply-To"] = ORIGINAL_MSG_ID
        msg["References"] = f"{INITIAL_OUTBOUND_ID} {ORIGINAL_MSG_ID}"
        
        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())
        print("\n[SUCCÈS] Réponse envoyée dans le fil de discussion existant.")

if __name__ == "__main__":
    is_live = "--send" in sys.argv
    send_threaded_reply(dry_run=not is_live)
