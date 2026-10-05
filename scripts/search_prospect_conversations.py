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

keywords = [
    "demoulin", "cetamayotte", "adamaze", "benin", 
    "bouffard", "ranking", "hibiscus", "saunier", 
    "reunion", "leblanc", "nissi", "master", "grill", "boussole", "alkan", 
    "bkeditions", "kouassi", "sandra", "noaplongee",
    "louiseloc", "lekouz", "edukaraib", "depolog", "damedia", "yaqooa", "aliotis", "buggy"
]

results = []

for kw in keywords:
    try:
        status, data = mail.search(None, f'(OR FROM "{kw}" BODY "{kw}")')
    except Exception as e:
        continue
    mids = data[0].split()
    print(f"Keyword '{kw}': {len(mids)} messages")
    for mid in mids:
        if mid in [r['mid'] for r in results]:
            continue
        res, hdata = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID IN-REPLY-TO REFERENCES)])')
        if res != 'OK':
            continue
        h_text = hdata[0][1].decode('utf-8', errors='ignore')
        msg = email.message_from_string(h_text)
        from_h = decode_mime(msg.get('From', ''))
        subj_h = decode_mime(msg.get('Subject', ''))
        date_h = msg.get('Date', '')
        
        # skip sent by us unless relevant
        if 'domtomconnect@gmail.com' in from_h.lower() and not any(k in subj_h.lower() for k in ["recap", "whatsapp", "contact"]):
            continue
            
        res2, bdata = mail.fetch(mid, '(BODY.PEEK[TEXT]<0.3000>)')
        raw = bdata[0][1].decode('utf-8', errors='ignore') if (res2 == 'OK' and bdata and bdata[0]) else ""
        if '<html' in raw.lower():
            soup = BeautifulSoup(raw, 'html.parser')
            text = soup.get_text(separator=' ', strip=True)
        else:
            text = raw
        text = re.sub(r'\s+', ' ', text).strip()
        
        results.append({
            'mid': mid,
            'from': from_h,
            'subj': subj_h,
            'date': date_h,
            'body': text
        })

print(f"\nTotal distinct messages fetched: {len(results)}\n")
for r in results:
    # Filter only relevant prospect messages
    if any(k in r['from'].lower() for k in ['mailer-daemon', 'postmaster', 'google', 'openai', 'calendly', 'zapier', 'supabase', 'brevo', 'tiktok', 'skool', 'hunter', 'systeme.io', 'femmentrepreneur', 'corentin']):
        continue
    print("="*70)
    print(f"ID {r['mid'].decode()} | Date: {r['date']}")
    print(f"From: {r['from']}")
    print(f"Subj: {r['subj']}")
    print(f"Body: {r['body'][:400]}")

mail.logout()
