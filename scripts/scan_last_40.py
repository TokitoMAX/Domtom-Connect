import imaplib, email, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

def decode_str(s):
    if not s: return ''
    decoded = decode_header(s)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes): res.append(text.decode(enc or 'utf-8', errors='ignore'))
        else: res.append(str(text))
    return ''.join(res)

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('INBOX')

status, data = mail.search(None, 'ALL')
ids = data[0].split()

print(f"Total messages in INBOX: {len(ids)}")
# Inspect last 60
recent_ids = ids[-60:]

print("=== SCAN DES 60 DERNIERS MESSAGES ===")
for mid in reversed(recent_ids):
    s, d = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)])')
    msg = email.message_from_bytes(d[0][1])
    sender = decode_str(msg.get('From', ''))
    subj = decode_str(msg.get('Subject', ''))
    date = msg.get('Date', '')
    
    sender_l = sender.lower()
    # Filter out obvious newsletters
    if any(k in sender_l for k in ['skool', 'instagram', 'tiktok', 'openai', 'zapier', 'womanbusinesspassion', 'libertywebi', 'entrepreneurs.com', 'supabase', 'barnes', 'paypal', 'natiye.fr', 'google.com']):
        continue
    print(f"[{mid.decode()}] {date} | DE: {sender} | SUJET: {subj}")

mail.close()
mail.logout()
