import imaplib, email, sys, json, os, re
from email.header import decode_header

sys.stdout.reconfigure(encoding="utf-8")

def clean_header(val):
    if not val:
        return ""
    decoded = decode_header(val)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or "utf-8", errors="ignore"))
        else:
            res.append(text)
    return " ".join(res)

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

# 1. Inspect the 8 delivery failures to extract failed recipients and add to exclusions
failure_ids = ["4910", "4914", "4922", "4933", "4943", "4957", "4961", "4964", "4939"]
bounced_emails = []

print("=== INSPECTION DES ÉCHECS DE DISTRIBUTION ===")
for fid in failure_ids:
    s, d = mail.fetch(fid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")
    
    # Extract bounced email address via regex
    found = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', body)
    # Filter out system emails
    clean_found = [e.lower() for e in found if "google" not in e and "domtom" not in e and "mailer" not in e and "postmaster" not in e]
    if clean_found:
        target = clean_found[0]
        bounced_emails.append(target)
        print(f"ID {fid} -> Bounced target: {target}")

# 2. Add all bounced emails to exclusions.json
exclusions_file = "scripts/exclusions.json"
with open(exclusions_file, "r", encoding="utf-8") as f:
    ex = json.load(f)

for em in set(bounced_emails):
    if em not in ex.get("excluded_emails", []):
        ex.setdefault("excluded_emails", []).append(em)
        print(f"[+] Ajouté à exclusions.json : {em}")

with open(exclusions_file, "w", encoding="utf-8") as f:
    json.dump(ex, f, indent=2, ensure_ascii=False)

# 3. Inspect messages 4860 to 4905 to ensure NO prospect reply was ever missed
print("\n=== SCAN EXHAUSTIF DES MESSAGES 4860 À 4905 ===")
for num in range(4860, 4906):
    try:
        s, d = mail.fetch(str(num), '(RFC822.HEADER)')
        msg = email.message_from_bytes(d[0][1])
        sender = clean_header(msg.get("From"))
        subj = clean_header(msg.get("Subject"))
        if "domtomconnect" not in sender.lower() and "google" not in sender.lower() and "mailer-daemon" not in sender.lower() and "calendly" not in sender.lower() and "stripe" not in sender.lower():
            print(f"Prospect trouvé ID {num} : From={sender} | Subject={subj}")
    except Exception:
        pass

mail.close()
mail.logout()
