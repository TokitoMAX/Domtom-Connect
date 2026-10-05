import os, sys, ssl, smtplib, time
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

RECIPIENT = "ksassocies@ksassocies.com"
IN_REPLY_TO = "<BCFA91C9-AA69-4663-A8FB-C6D8D6858AAA@ksassocies.com>"
SUBJECT = "Re, Synergies d'affaires et collaborations avec Domtom Connect / KS & Associés Avocats"

BODY = """Bonjour Maître,

Je vous remercie sincèrement pour votre retour et pour la précision de vos questions.

Par souci d'honnêteté et pour ne pas vous faire perdre de temps, je préfère vous répondre avec une totale transparence sur la réalité actuelle de notre structure.

Domtom Connect est un écosystème d'accompagnement entrepreneurial que je développe à destination des porteurs de projets et dirigeants de PME issus de la Caraïbe, d'Afrique et de leurs diasporas. Nous intervenons sur des problématiques concrètes de terrain à travers notre programme Tremplin (accompagnement individuel et copilotage opérationnel), notre diagnostic gratuit d'entreprise (l'Anamnèse), une communauté d'entraide sur WhatsApp, et notre application mobile DTC Pulse actuellement en bêta fermée.

Pour être parfaitement direct avec vous, nous n'avons pas aujourd'hui de flux de dossiers juridiques actifs à apporter immédiatement à votre cabinet. Notre démarche initiale avait simplement pour but d'identifier en amont des cabinets de référence et de confiance sur la place d'Abidjan, vers lesquels nous pourrions orienter des contacts si des besoins précis en droit des affaires ou en conformité venaient à se présenter.

Si votre attente actuelle est de collaborer avec un apporteur d'affaires vous garantissant un volume immédiat de dossiers, ce n'est pas ce que nous pouvons vous proposer aujourd'hui, et je préférais vous le préciser sans faux-semblant.

Si malgré cela vous souhaitez que nous restions en contact ou que nous prenions dix minutes pour échanger informellement sur nos activités respectives, ce sera avec grand plaisir. Dans le cas contraire, je comprends parfaitement vos priorités et vous remercie encore pour votre accueil.

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
WhatsApp direct, +33 6 20 78 33 77
Plateforme web, www.domtomconnect.com

---
Le 29 septembre 2026, KS & Associés <ksassocies@ksassocies.com> a écrit,

Monsieur,
Je vous remercie de votre message et de l'intérêt que vous portez à KS & Associés.
Notre cabinet accompagne depuis 2012 des investisseurs et entreprises, notamment internationaux, dans leurs opérations en Côte d'Ivoire et dans l'espace OHADA, structuration et implantation, droit minier et des ressources naturelles, contentieux et arbitrage commercial, conformité réglementaire. Les profils que fédère votre réseau, entre la Caraïbe, l'Afrique et la diaspora, rejoignent naturellement une partie de notre clientèle.
Avant de fixer un échange, je vous serais reconnaissant de bien vouloir me transmettre une brève présentation de Domtom Connect, la composition de votre réseau, les secteurs et pays représentés, ainsi que le cadre dans lequel s'inscrirait notre collaboration (partenariat de référencement réciproque, adhésion, conditions éventuelles). 
Sur cette base, je serai heureux de convenir d'un créneau.
Bien cordialement,
Avocats à la Cour, Cocody Deux-Plateaux, ENA, rue J9, 01 BP 640 Abidjan 01 (Côte-d’Ivoire)"""

def check_rules():
    errors = []
    if ":" in SUBJECT:
        errors.append(f"Deux-points trouvé dans le sujet, {SUBJECT}")
    if ":" in BODY:
        errors.append("Deux-points trouvé dans le corps du message")
    if " - " in BODY or " - " in SUBJECT:
        errors.append("Tiret d'incise ' - ' trouvé au milieu d'une phrase")
    return errors

def send_reply(dry_run=True):
    errors = check_rules()
    if errors:
        print("Erreurs détectées :", errors)
        return False

    print("=== OPTION A : VÉRITÉ TOTALE ET TRANSPARENCE BRUTE ===")
    print(f"Destinataire : {RECIPIENT}")
    print(f"In-Reply-To : {IN_REPLY_TO}")
    print(f"Subject : {SUBJECT}")
    print("Zéro deux-points : OK")
    print("Zéro tiret au milieu de phrase : OK")
    print("="*60)

    if dry_run:
        print("[DRY-RUN OK] Réponse Option A prête pour envoi.")
        return True

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        msg = MIMEText(BODY, "plain", "utf-8")
        msg["Subject"] = SUBJECT
        msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
        msg["To"] = f"KS & Associés <{RECIPIENT}>"
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
        msg["In-Reply-To"] = IN_REPLY_TO
        msg["References"] = IN_REPLY_TO

        server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())
        print("EMAIL OPTION A ENVOYÉ AVEC SUCCÈS À KS & ASSOCIÉS AVOCATS !")
    return True

if __name__ == "__main__":
    is_dry = "--send" not in sys.argv
    send_reply(dry_run=is_dry)
