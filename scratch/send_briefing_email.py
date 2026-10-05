import smtplib, ssl, sys, os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
from email_validator import verify_email_target

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
RECIPIENT = "domtomconnect@gmail.com"

# Vérification DNS/MX
ok, err = verify_email_target(RECIPIENT)
if not ok:
    raise ValueError(f"Erreur validation email : {err}")

SUBJECT = "[BRIEFING STRATÉGIQUE] Tes 3 rendez-vous de ce jeudi 1er octobre (Profils, Liens et Pitchs)"

# Règle stricte Domtom Connect : aucun deux-points dans le corps de texte rédigé
TEXT_BODY = """Bonjour Loïc,

Voici ton dossier de préparation complet pour tes 3 rendez-vous de ce jeudi 1er octobre.

==================================================
1. NISSI GEORGES PIERRE — MASTER GRILL BAR RESTO
==================================================
Horaire, 06h30 heure de Paris (00h30 heure locale Haïti)
Lien Meet, disponible sur ton invitation Calendly (calendly.com/events/1f6719e6-654f-4548-bf5e-c37b7bb5366d/google_meet)

Profil et établissement,
- Dirigeante, Nissi Georges Pierre
- Établissement, Master Grill Bar Resto
- Adresse, Rue 29 A, Carénage, Cap-Haïtien, Haïti
- Téléphone, +509 47 20 77 59
- Email réservation, emmanuellanissi90@gmail.com
- Email officiel, mastergrill.barresto@gmail.com
- Page Facebook, facebook.com/p/Master-Grill-Bar-Resto-100083281729015/

Ce qu'elle a dit dans son message,
Elle est très intéressée pour découvrir DTC Pulse afin d'augmenter son chiffre d'affaires tout en réduisant l'impact des commissions prédatrices sur ses marges en Haïti.

Comment mener l'appel,
1. Saluer son travail et la résilience remarquable de son restaurant à Cap-Haïtien.
2. Lui demander comment se répartit son activité entre la salle et la livraison, et quelles commissions lui posent problème.
3. Lui présenter la solution DTC Pulse, une vitrine directe sans commission abusive pour connecter les clients locaux et la diaspora haïtienne.
4. Objectif de fin d'appel, valider son accord pour créer la vitrine pilote de Master Grill sur l'application avec ses 3 plats signatures.

==================================================
2. BINNUR ALKAN — BOUSSOLE PATRIMOINE
==================================================
Horaire, 08h30 heure de Paris (10h30 heure de La Réunion)
Lien Google Meet direct, meet.google.com/mce-fomd-qye

Profil et cabinet,
- Dirigeante, Binnur Alkan (Conseillère en Investissements Financiers, agréée ORIAS 20003057)
- Cabinet, Boussole Patrimoine
- Adresse, La Saline-les-Bains, La Réunion (97434)
- Zone d'intervention, La Réunion, tout l'Outre-Mer et l'Hexagone
- Email, binnur.alkan@boussolepatrimoine.fr
- Site internet officiel, boussolepatrimoine.fr

Ce qu'elle recherche,
Elle a noté lors de sa réservation vouloir un partenariat et une collaboration suite à notre email sur l'ingénierie patrimoniale.

Comment mener l'appel,
1. Valoriser son expertise patrimoniale et la force du pont entre La Réunion et l'Hexagone.
2. Lui demander quels sont ses clients cibles prioritaires actuellement (chefs d'entreprise, cadres, investisseurs défiscalisation).
3. Lui exposer la valeur de Domtom Connect, nous accompagnons des centaines de dirigeants et de porteurs de projets qui recherchent des experts de confiance pour leur optimisation fiscale (Girardin, immobilier, PER).
4. Objectif de fin d'appel, sceller un accord d'apport d'affaires et convenir d'une mise en avant de son cabinet auprès de notre réseau.

==================================================
3. CYNTHIA ZÈBRE — UNIVERS DU DÉMÉNAGEMENT (UDD)
==================================================
Horaire, 15h30 heure de Paris (09h30 heure Guadeloupe et Martinique)
Lien Google Meet direct, meet.google.com/xpy-xevy-srk

Profil et entreprise,
- Interlocutrice, Cynthia Zèbre (Responsable Commerciale)
- Entreprise, Univers Du Déménagement (UDD SAS, SIREN 952 484 780)
- Adresse, 45 Rue Alfred Lumière, 97122 Baie-Mahault, Guadeloupe (ZI Jarry)
- Téléphone, 0690 92 34 92
- Email, commerciale.udd@gmail.com
- Page Facebook, facebook.com/universdudemenagement/

Ce qu'elle recherche,
Elle a accepté notre proposition d'échange sur les synergies logistiques et le transport pour la diaspora antillaise.

Comment mener l'appel,
1. Cadrer l'échange sur son implantation stratégique au cœur de Jarry en Guadeloupe.
2. Évaluer leurs capacités actuelles sur les déménagements en provenance de l'Hexagone vers les Antilles.
3. Présenter le vivier Domtom Connect, nos membres ultramarins en métropole préparent régulièrement des retours au pays ou expédient du fret commercial.
4. Objectif de fin d'appel, faire d'UDD le transporteur partenaire privilégié de Domtom Connect avec une tarification préférentielle pour nos membres.

==================================================
FICHIER COMPLET CONSULTABLE HORS LIGNE
==================================================
Le dossier interactif détaillé avec tous les liens cliquables a également été généré dans ton ordinateur au chemin suivant,
C/dtc/FICHES_BRIEFING_RDV_JEUDI_01_OCTOBRE.html

Bonne préparation et excellents rendez-vous,
L'équipe Domtom Connect
"""

# Vérification stricte de la règle de style n°4 : aucun deux-points
if ":" in TEXT_BODY:
    raise ValueError("Erreur, présence de deux-points détectée dans le corps du texte !")

msg = MIMEMultipart("alternative")
msg["Subject"] = Header(SUBJECT, "utf-8")
msg["From"] = f"Domtom Connect Assistant <{SENDER_EMAIL}>"
msg["To"] = RECIPIENT
msg["Date"] = formatdate(localtime=True)
msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

msg.attach(MIMEText(TEXT_BODY, "plain", "utf-8"))

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, [RECIPIENT], msg.as_string())

print("Email de briefing envoyé avec succès à domtomconnect@gmail.com !")
