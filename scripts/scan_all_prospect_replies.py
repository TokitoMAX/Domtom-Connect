import imaplib, email, re, sys
from email.header import decode_header

sys.stdout.reconfigure(encoding='utf-8')

def decode_mime(header_val):
    if not header_val:
        return ""
    parts = decode_header(header_val)
    res = ""
    for part, enc in parts:
        if isinstance(part, bytes):
            res += part.decode(enc or 'utf-8', errors='ignore')
        else:
            res += str(part)
    return res

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select("INBOX")

status, data = mail.search(None, 'ALL')
msg_ids = data[0].split()

print(f"Total messages in INBOX: {len(msg_ids)}")

prospect_replies = []

# Scan last 200 messages
for mid in reversed(msg_ids[-200:]):
    res, hdata = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE IN-REPLY-TO REFERENCES)])')
    if res != 'OK':
        continue
    h_text = hdata[0][1].decode('utf-8', errors='ignore')
    msg = email.message_from_string(h_text)
    from_h = decode_mime(msg.get('From', ''))
    from_lower = from_h.lower()
    subj_h = decode_mime(msg.get('Subject', ''))
    date_h = msg.get('Date', '')
    
    # Filter out auto notifications, bounces, marketing
    if any(k in from_lower for k in ['mailer-daemon', 'postmaster', 'google', 'openai', 'calendly', 'luma', 'zapier', 'supabase', 'brevo', 'tiktok', 'skool', 'rachel', 'systeme.io', 'antispammeur', 'formspree', 'testmonapp', 'ritmo', 'corentin']):
        continue
    if any(k in subj_h.lower() for k in ['delivery status', 'failure', 'undelivered', 'security alert', 'connexion', 'warning']):
        continue
    if 'domtomconnect@gmail.com' in from_lower:
        continue
        
    # Fetch body snippet
    res2, bdata = mail.fetch(mid, '(BODY.PEEK[TEXT]<0.1500>)')
    body_snip = bdata[0][1].decode('utf-8', errors='ignore') if (res2 == 'OK' and bdata and bdata[0]) else ""
    # clean tags
    body_clean = re.sub(r'<[^>]+>', ' ', body_snip)
    body_clean = re.sub(r'\s+', ' ', body_clean).strip()
    
    prospect_replies.append({
        'mid': mid.decode(),
        'from': from_h,
        'subject': subj_h,
        'date': date_h,
        'body': body_clean[:300]
    })

print(f"Total prospect replies found in last 200: {len(prospect_replies)}\n")
for r in prospect_replies:
    print(f"ID {r['mid']} | {r['date'][:22]} | From: {r['from']}")
    print(f"   Subj: {r['subject']}")
    print(f"   Snippet: {r['body'][:200]}\n")

mail.logout()
