import imaplib, email, sys, json, os, re, time
from email.header import decode_header

sys.stdout.reconfigure(encoding="utf-8")

mail = None
for attempt in range(4):
    try:
        time.sleep(2)
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
        mail.select('"[Gmail]/Tous les messages"')
        print("Connexion IMAP réussie.")
        break
    except Exception as e:
        print(f"Essai {attempt+1} : {e}")
        time.sleep(4)

if not mail:
    print("Échec de connexion IMAP.")
    sys.exit(1)

# 1. Read Location Carrée email (4970)
s, d = mail.fetch("4970", '(RFC822)')
msg = email.message_from_bytes(d[0][1])
body = ""
if msg.is_multipart():
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
            break
else:
    body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

print("\n=== MESSAGE LOCATION CARRÉE (4970) ===")
print("From:", msg.get("From"))
print("Subject:", msg.get("Subject"))
print("Date:", msg.get("Date"))
print("Body:\n", body)
print("="*60)

# 2. Inspect the 3 bounces (4992, 4994, 5013)
bounces_68 = ["4992", "4994", "5013"]
bounced_addrs = []

for bid in bounces_68:
    s, d = mail.fetch(bid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    b_body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                b_body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        b_body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")
    found = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', b_body)
    clean = [e.lower() for e in found if "google" not in e and "domtom" not in e and "mailer" not in e]
    if clean:
        target = clean[0]
        bounced_addrs.append(target)
        print(f"ID {bid} -> Failed target: {target}")

# 3. Add to exclusions.json
exclusions_file = "scripts/exclusions.json"
with open(exclusions_file, "r", encoding="utf-8") as f:
    ex = json.load(f)

for em in set(bounced_addrs):
    if em not in ex.get("excluded_emails", []):
        ex.setdefault("excluded_emails", []).append(em)
        print(f"[+] Ajouté aux exclusions : {em}")

with open(exclusions_file, "w", encoding="utf-8") as f:
    json.dump(ex, f, indent=2, ensure_ascii=False)

mail.close()
mail.logout()
