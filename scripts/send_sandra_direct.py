import smtplib, ssl, json, time, os, sys
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formatdate, make_msgid

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target

email_addr = 'sandsaintg@gmail.com'
company = 'Sandra - Conseil et Artisanat'

# Verification DNS/MX
ok, msg = verify_email_target(email_addr)
print(f'Verification email: {ok} ({msg})')
if not ok:
    print('Erreur validation DNS/MX. Abandon.')
    sys.exit(1)

subject = 'Votre diagnostic Anamnèse et accompagnement / Domtom Connect'
body = """Bonjour Sandra,

J'ai vu que vous aviez pris quelques minutes pour passer notre diagnostic d'Anamnèse sur Domtom Connect, et je tenais à vous saluer personnellement.

Votre profil diagnostiqué est ressorti sous la typologie "Le spectateur théoricien (T-02)" dans le secteur du conseil, de la prestation de service et de l'artisanat en Martinique.

C'est un profil très fréquent chez les entrepreneurs qui sont déjà installés et possèdent une réelle maîtrise technique de leur métier, mais qui se retrouvent souvent ralentis dans leur développement — notamment par la prospection commerciale, la transformation des devis en contrats signés ou la difficulté d'attirer des clients réguliers sans s'épuiser.

Chez Domtom Connect, nous développons des solutions concrètes et des accompagnements sur-mesure pour aider les prestataires de nos îles à structurer leur acquisition et franchir un palier rentable.

Pour faire le point ensemble sur vos priorités actuelles et étudier comment nous pourrions collaborer pour propulser votre activité, je vous invite à choisir le moment qui vous convient le mieux pour notre échange diagnostique via ce lien -
calendly.com/domtomconnect/30min

Au plaisir d'échanger avec vous et de vous accompagner dans votre développement,

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com
"""

assert ':' not in subject, 'Deux-points interdit dans le sujet'
assert ':' not in body, 'Deux-points interdit dans le corps'
print('Validation règles de conformité (zéro deux-points) : OK')

# Envoi SMTP
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 465
SENDER_EMAIL = 'domtomconnect@gmail.com'
APP_PASSWORD = 'geqpuqluimxdjxeo'

msg = MIMEText(body, 'plain', 'utf-8')
msg['Subject'] = Header(subject, 'utf-8')
msg['From'] = f'Loïc Villeronce <{SENDER_EMAIL}>'
msg['To'] = f'Sandra <{email_addr}>'
msg['Date'] = formatdate(localtime=True)
msg['Message-ID'] = make_msgid(domain='domtomconnect.com')

context = ssl.create_default_context()
with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.login(SENDER_EMAIL, APP_PASSWORD)
    server.sendmail(SENDER_EMAIL, [email_addr], msg.as_string())

print(f'Email envoyé avec succès à Sandra ({email_addr}) !')

# Mise à jour contacts_deja_contactes.json
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(base_dir, 'contacts_deja_contactes.json')
if os.path.exists(db_path):
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)
else:
    db = {'emails': [], 'domains': [], 'companies': [], 'contacts': []}

if email_addr not in db.get('emails', []):
    db.setdefault('emails', []).append(email_addr)
if company not in db.get('companies', []):
    db.setdefault('companies', []).append(company)

existing_emails = set(c.get('email', '').lower().strip() for c in db.get('contacts', []))
if email_addr.lower().strip() not in existing_emails:
    db.setdefault('contacts', []).append({
        'email': email_addr,
        'company': company,
        'date': formatdate(localtime=True),
        'source': 'anamnese_inbound'
    })

db['total_contacts'] = len(db.get('contacts', []))

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print('Base contacts_deja_contactes.json mise à jour avec succès !')
