import subprocess
import json

def has_mx_record(domain):
    try:
        # Utiliser Resolve-DnsName natif de PowerShell sur Windows
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=5)
        return "NameExchange" in res.stdout or "MailExchange" in res.stdout or len(res.stdout.strip()) > 0
    except Exception:
        return False

# Test sur quelques domaines
test_domains = [
    "kadalys.com",        # Doit être True
    "shop-e-dom.com",     # Doit être True
    "afrety.com",         # Doit être True
    "guadeloupe-froid.fr" # Doit être False
]

for d in test_domains:
    print(f"{d} -> MX valide: {has_mx_record(d)}")
