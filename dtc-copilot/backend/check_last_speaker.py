import imaplib, email, sys, re
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

m = imaplib.IMAP4_SSL('imap.gmail.com')
m.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
m.select('"[Gmail]/Tous les messages"')

def decode_mime(val):
    if not val: return ""
    try:
        parts = decode_header(val)
        res = ""
        for p, enc in parts:
            res += p.decode(enc or 'utf-8', errors='ignore') if isinstance(p, bytes) else str(p)
        return res
    except: return str(val)

def extract_email(text):
    found = re.findall(r'[\w\.-]+@[\w\.-]+', text or '')
    return found[0].lower() if found else ""

# Search all replies
status, data = m.search(None, '(SUBJECT "Re:")')
ids = data[0].split()[-60:]

print(f"Analyse des 60 derniers fils 'Re:'...")

conversations = {} # email -> list of msgs sorted by date

for mid in ids:
    res, d = m.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID IN-REPLY-TO)])')
    if res != 'OK' or not d or not d[0]: continue
    msg = email.message_from_string(d[0][1].decode('utf-8', errors='ignore'))
    from_h = decode_mime(msg.get('From', ''))
    to_h = decode_mime(msg.get('To', ''))
    subj_h = decode_mime(msg.get('Subject', ''))
    date_h = msg.get('Date', '')

    from_email = extract_email(from_h)
    to_email = extract_email(to_h)
    
    partner = to_email if from_email == 'domtomconnect@gmail.com' else from_email
    if not partner or partner in ['domtomconnect@gmail.com', 'noreply', 'mailer-daemon']:
        continue

    if partner not in conversations:
        conversations[partner] = []
    conversations[partner].append({
        'mid': mid.decode(),
        'date': date_h,
        'from': from_email,
        'sender_name': from_h,
        'subj': subj_h
    })

print(f"\nTotal correspondants uniques identifiés: {len(conversations)}")

for partner, msgs in conversations.items():
    last_msg = msgs[-1] # le plus récent
    if last_msg['from'] == 'domtomconnect@gmail.com':
        print(f"✓ [TRAITÉ] {partner} : Dernier message ENVOYÉ par Loïc ({last_msg['subj'][:50]})")
    else:
        print(f"❓ [INCOMING] {partner} : Dernier message REÇU du prospect ({last_msg['subj'][:50]})")

m.logout()
