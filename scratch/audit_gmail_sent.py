import os
import re
import imaplib
import email
from email.header import decode_header
from collections import defaultdict
def load_env_manual(filepath='.env.local'):
    env_vars = {}
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    return env_vars

user = "domtomconnect@gmail.com"
pwd = "esbmvnvpvxdqphci"

print(f"Connexion au compte Gmail: {user}")

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login(user, pwd)

status, folders = mail.list()
sent_folder = None
for f in folders:
    f_str = f.decode('utf-8', errors='ignore')
    if 'Sent' in f_str or 'Envoy' in f_str:
        m = re.search(r'"([^"]+)"$', f_str)
        if m:
            sent_folder = m.group(1)

if not sent_folder:
    sent_folder = '[Gmail]/Messages envoy&AOk-s'

print(f"Dossier des messages envoyés: {sent_folder}")
mail.select(f'"{sent_folder}"')

status, msg_ids = mail.search(None, 'ALL')
ids = msg_ids[0].split()
print(f"Total des messages envoyés trouvés: {len(ids)}")

recipients = []
# On inspecte tous les derniers messages (jusqu'à 600)
for mid in ids[-600:]:
    status, data = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (TO DATE SUBJECT)])')
    for response_part in data:
        if isinstance(response_part, tuple):
            msg = email.message_from_bytes(response_part[1])
            to_val = msg.get('To', '')
            date_val = msg.get('Date', '')
            sub_val = msg.get('Subject', '')
            
            # Décodage propre de l'objet
            if sub_val:
                dh = decode_header(sub_val)
                decoded_parts = []
                for part, enc in dh:
                    if isinstance(part, bytes):
                        decoded_parts.append(part.decode(enc or 'utf-8', errors='ignore'))
                    else:
                        decoded_parts.append(str(part))
                sub_val = ''.join(decoded_parts)

            recipients.append({'id': mid.decode(), 'to': to_val, 'date': date_val, 'subject': sub_val})

mail.logout()

parsed_recipients = []
for r in recipients:
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}', r['to'])
    for e in emails:
        e_clean = e.lower().strip()
        parsed_recipients.append({
            'email': e_clean,
            'domain': e_clean.split('@')[1] if '@' in e_clean else '',
            'date': r['date'],
            'subject': r['subject']
        })

print(f"Total d'adresses destinataires analysées: {len(parsed_recipients)}")

email_sends = defaultdict(list)
domain_sends = defaultdict(list)
free_domains = {'gmail.com', 'yahoo.fr', 'yahoo.com', 'orange.fr', 'hotmail.com', 'hotmail.fr', 'free.fr', 'wanadoo.fr', 'icloud.com', 'laposte.net', 'outlook.fr', 'outlook.com'}

for p in parsed_recipients:
    email_sends[p['email']].append(p)
    if p['domain'] not in free_domains:
        domain_sends[p['domain']].append(p)

real_email_dups = {e: lst for e, lst in email_sends.items() if len(lst) > 1}
real_domain_dups = {d: lst for d, lst in domain_sends.items() if len(lst) > 1}

print("\n" + "="*70)
print(f"1. EMAILS EXACTS REÇUS PLUS D'UNE FOIS ({len(real_email_dups)})")
print("="*70)
for e, lst in real_email_dups.items():
    print(f"\n[EMAIL ENVOYÉ {len(lst)} FOIS] {e}:")
    for item in lst:
        print(f"   - {item['date']} | Objet: {item['subject']}")

print("\n" + "="*70)
print(f"2. ENTREPRISES / DOMAINES PRO REÇUS PLUS D'UNE FOIS ({len(real_domain_dups)})")
print("="*70)
for d, lst in real_domain_dups.items():
    print(f"\n[DOMAINE ENVOYÉ {len(lst)} FOIS] {d}:")
    for item in lst:
        print(f"   - {item['email']} | {item['date']} | Objet: {item['subject']}")
