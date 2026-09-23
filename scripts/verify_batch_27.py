import json
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

LEADS_FILE = "batch_27_immobilier_excellence.json"
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

        # 1. Check colons (Règle absolue : 0 deux-points)
        if ":" in subject:
            errors.append(f"[{c_name}] Deux-points interdit dans l'objet : {subject}")
        if ":" in body:
            errors.append(f"[{c_name}] Deux-points interdit dans le corps !")

        # 2. Check intra-batch duplicate
        if email in emails_seen:
            errors.append(f"[{c_name}] Doublon dans le batch : {email}")
        emails_seen.add(email)

        # 3. Check duplicate against global exclusion base
        if email in known_emails:
            errors.append(f"[{c_name}] Email {email} déjà contacté en base !")
        if dom in known_domains:
            errors.append(f"[{c_name}] Domaine {dom} déjà contacté en base !")

        # 4. Check signature
        if "Loïc Villeronce\nFondateur — Domtom Connect" not in body:
            errors.append(f"[{c_name}] Signature manquante ou non conforme !")

        # 5. Check URL format
        if "www.domtomconnect.com" not in body:
            errors.append(f"[{c_name}] Lien www.domtomconnect.com manquant !")

        # 6. Check MX
        res = subprocess.run(['nslookup', '-type=mx', dom], capture_output=True, text=True)
        mx_lines = [l.strip() for l in res.stdout.splitlines() if 'mail exchanger' in l or 'MX preference' in l]
        if not mx_lines:
            errors.append(f"[{c_name}] Aucun enregistrement MX valide pour {dom} !")

    if errors:
        print("\n❌ ERREURS DÉTECTÉES :")
        for e in errors:
            print(f" - {e}")
        sys.exit(1)
    else:
        print(f"\n✅ 100% CONFORME : Les {len(batch)} entreprises immobilières sont ultra-qualifiées, 0 deux-points, 0 doublon, MX résolus.")

if __name__ == "__main__":
    main()
