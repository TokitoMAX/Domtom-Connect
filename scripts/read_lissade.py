import imaplib, email, sys, json, os

sys.stdout.reconfigure(encoding="utf-8")

# 1. Read Lissade email
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
mail.select('"[Gmail]/Tous les messages"')

s, d = mail.fetch("4968", '(RFC822)')
msg = email.message_from_bytes(d[0][1])

print("=== MESSAGE DU CABINET LISSADE (4968) ===")
print("From:", msg.get("From"))
print("Subject:", msg.get("Subject"))
print("Date:", msg.get("Date"))
print("Message-ID:", msg.get("Message-ID"))
print("In-Reply-To:", msg.get("In-Reply-To"))

body = ""
if msg.is_multipart():
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
            break
        elif part.get_content_type() == "text/html" and not body:
            body = part.get_payload(decode=True).decode("utf-8", errors="ignore")
else:
    body = msg.get_payload(decode=True).decode("utf-8", errors="ignore")

print("\n--- CORPS DU MESSAGE LISSADE ---")
print(body)
print("--------------------------------")

mail.close()
mail.logout()

# 2. Add bounces to exclusions.json
exclusions_file = "scripts/exclusions.json"
with open(exclusions_file, "r", encoding="utf-8") as f:
    ex = json.load(f)

for bad_email in ["contact@nathalie-jacoby-koaly-avocat.fr", "contact@ose.gp"]:
    if bad_email not in ex.get("excluded_emails", []):
        ex.setdefault("excluded_emails", []).append(bad_email)
        print(f"[+] Ajouté aux exclusions : {bad_email}")

with open(exclusions_file, "w", encoding="utf-8") as f:
    json.dump(ex, f, indent=2, ensure_ascii=False)
