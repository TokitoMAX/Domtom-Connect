import imaplib, email, sys
from email.header import decode_header
sys.stdout.reconfigure(encoding='utf-8')

def clean_header(val):
    if not val: return ""
    decoded = decode_header(val)
    parts = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            parts.append(text.decode(enc or 'utf-8', errors='ignore'))
        else:
            parts.append(str(text))
    return " ".join(parts)

m = imaplib.IMAP4_SSL('imap.gmail.com')
m.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
m.select('INBOX')

print("=== 1. ANALYSE DE LA RÉPONSE DE YAQOOA IMMOBILIER (3080) ===")
_, data = m.fetch(b'3080', '(RFC822)')
msg = email.message_from_bytes(data[0][1])
print("From:", clean_header(msg.get("From")))
print("Subject:", clean_header(msg.get("Subject")))
print("Date:", msg.get("Date"))
print("Message-ID:", msg.get("Message-ID"))
print("In-Reply-To:", msg.get("In-Reply-To"))
for part in msg.walk():
    if part.get_content_type() == 'text/plain':
        print("\n--- TEXTE RÉPONSE YAQOOA ---")
        print(part.get_payload(decode=True).decode('utf-8', errors='ignore'))

print("\n=== 2. ANALYSE DES 7 ÉCHECS (3073 À 3079) ===")
for mid in [b'3073', b'3074', b'3075', b'3076', b'3077', b'3078', b'3079']:
    _, d = m.fetch(mid, '(RFC822)')
    em = email.message_from_bytes(d[0][1])
    payload = ""
    for part in em.walk():
        if part.get_content_type() == 'text/plain':
            payload = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            break
    print(f"\n--- ÉCHEC ID {mid.decode()} ---")
    lines = payload.splitlines()
    for l in lines[:15]:
        if l.strip():
            print("  ", l.strip())

m.logout()
