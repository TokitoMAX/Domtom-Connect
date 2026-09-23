import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

LEADS_FILE = "batch_26_terroir_excellence.json"
EXCLUSION_FILE = "contacts_deja_contactes.json"

def main():
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        batch = json.load(f)

    with open(EXCLUSION_FILE, "r", encoding="utf-8") as f:
        d = json.load(f)

    known_domains = set(d.get("domains", []))
    known_emails = {c["email"].lower() for c in d.get("contacts", []) if isinstance(c, dict) and "email" in c}

    errors = []
    emails_seen = set()

    print(f"Vérification de {len(batch)} cibles dans {LEADS_FILE}...")

    for i, p in enumerate(batch, 1):
        c_name = p["company"]
        subject = p["subject"]
        body = p["body"]
        email = p["email"].lower().strip()
        dom = p["domain"].lower().strip()

        # Check colons (Règle absolue : 0 deux-points)
        if ":" in subject:
            errors.append(f"[{c_name}] Deux-points interdit dans l'objet : {subject}")
        if ":" in body:
            errors.append(f"[{c_name}] Deux-points interdit dans le corps !")

        # Check intra-batch duplicate
        if email in emails_seen:
            errors.append(f"[{c_name}] Doublon dans le batch : {email}")
        emails_seen.add(email)

        # Check duplicate against global exclusion base
        if email in known_emails:
            errors.append(f"[{c_name}] Email {email} déjà contacté en base !")
        if dom in known_domains:
            errors.append(f"[{c_name}] Domaine {dom} déjà contacté en base !")

        # Check signature
        if "Loïc Villeronce\nFondateur — Domtom Connect" not in body:
            errors.append(f"[{c_name}] Signature manquante ou non conforme !")

    if errors:
        print("\n❌ ERREURS DÉTECTÉES :")
        for e in errors:
            print(f" - {e}")
        sys.exit(1)
    else:
        print(f"\n✅ 100% CONFORME : Les {len(batch)} entreprises sont ultra-qualifiées, 0 deux-points, 0 doublon.")

if __name__ == "__main__":
    main()
