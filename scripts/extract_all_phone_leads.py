import imaplib, email, sys, re, json
from email.header import decode_header
from bs4 import BeautifulSoup

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
mail.select('"[Gmail]/Tous les messages"')

status, data = mail.search(None, 'ALL')
all_mids = data[0].split()
print(f"Total messages to inspect: {len(all_mids)}")

phone_regex = re.compile(r'(?:\+?\d{1,3}[ -]?)?(?:\(?\d{2,4}\)?[ -]?)?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}')

leads_with_phone = []

# Scan messages from the last 600
for mid in reversed(all_mids[-600:]):
    res, hdata = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID IN-REPLY-TO REFERENCES)])')
    if res != 'OK':
        continue
    h_text = hdata[0][1].decode('utf-8', errors='ignore')
    msg = email.message_from_string(h_text)
    from_h = decode_mime(msg.get('From', ''))
    from_lower = from_h.lower()
    subj_h = decode_mime(msg.get('Subject', ''))
    date_h = msg.get('Date', '')
    msg_id = msg.get('Message-ID', '')
    
    if any(k in from_lower for k in ['mailer-daemon', 'postmaster', 'google', 'openai', 'calendly', 'luma', 'zapier', 'supabase', 'brevo', 'tiktok', 'skool', 'rachel', 'systeme.io', 'antispammeur', 'formspree', 'testmonapp', 'ritmo', 'corentin', 'hunter.io', 'notifications@']):
        continue
    if any(k in subj_h.lower() for k in ['delivery status', 'failure', 'undelivered', 'security alert', 'connexion', 'warning', 'accepté:', 'rejeté:']):
        continue
    if 'domtomconnect@gmail.com' in from_lower:
        continue

    # Fetch text
    res2, bdata = mail.fetch(mid, '(BODY.PEEK[TEXT]<0.4000>)')
    if res2 != 'OK' or not bdata or not bdata[0]:
        continue
        
    raw_payload = bdata[0][1].decode('utf-8', errors='ignore')
    # clean HTML
    if '<html' in raw_payload.lower() or '<div' in raw_payload.lower():
        soup = BeautifulSoup(raw_payload, 'html.parser')
        clean_text = soup.get_text(separator=' ', strip=True)
    else:
        clean_text = raw_payload
        
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    
    # Check for phone numbers or keywords
    has_phone = phone_regex.search(clean_text)
    has_call_keyword = any(k in clean_text.lower() for k in ['téléphone', 'telephone', 'appelez', 'joignable', 'whatsapp', 'wasap', 'contactez-moi', 'parler', 'numéro', 'numero', 'portable', 'mobile'])
    
    if has_phone or has_call_keyword:
        leads_with_phone.append({
            'mid': mid.decode(),
            'from': from_h,
            'subject': subj_h,
            'date': date_h,
            'text': clean_text[:400]
        })

print(f"\nTotal potential leads with phone/call mentions: {len(leads_with_phone)}\n")
for lead in leads_with_phone:
    print("="*60)
    print(f"MID: {lead['mid']} | Date: {lead['date']}")
    print(f"From: {lead['from']}")
    print(f"Subj: {lead['subject']}")
    print(f"Body: {lead['text'][:300]}")

mail.logout()
