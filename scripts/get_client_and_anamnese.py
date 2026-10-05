import imaplib, email, sys, re
sys.stdout.reconfigure(encoding='utf-8')

m = imaplib.IMAP4_SSL('imap.gmail.com')
m.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
m.select('INBOX')

# 1. Inspect message 3058 (Anamnèse)
print('=== 1. ANAMNÈSE HIER (MSG 3058) ===')
_, data = m.fetch('3058', '(RFC822)')
msg = email.message_from_bytes(data[0][1])
print('Subject:', msg.get('Subject'))
print('Date:', msg.get('Date'))
for part in msg.walk():
    payload = part.get_payload(decode=True)
    if payload:
        try:
            content = payload.decode('utf-8', errors='ignore')
        except:
            content = str(payload)
        clean = re.sub(r'<[^>]+>', '\n', content)
        lines = [line.strip() for line in clean.splitlines() if line.strip()]
        for line in lines:
            print("  ", line)

# 2. Search for Calendly / Meeting for Monday 5 Oct
print('\n=== 2. RECHERCHE RDV LUNDI 5 OCTOBRE ===')
_, ms = m.search(None, 'ALL')
all_ids = ms[0].split()
for mid in all_ids[-60:]:
    _, d = m.fetch(mid, '(RFC822)')
    cmsg = email.message_from_bytes(d[0][1])
    subj = str(cmsg.get('Subject') or '')
    sender = str(cmsg.get('From') or '')
    date_hdr = str(cmsg.get('Date') or '')
    if 'calendly' in sender.lower() or 'calendly' in subj.lower() or 'invitation' in subj.lower() or '5 oct' in subj.lower() or 'lundi' in subj.lower():
        print(f"[{mid.decode()}] {date_hdr} | {sender} | {subj}")

m.logout()
