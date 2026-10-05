import json
import subprocess
import socket

with open("batch_65_pancaribeen_afrique_50.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total targets to inspect: {len(data)}\n")

risky_targets = []
safe_targets = []

for i, x in enumerate(data, 1):
    comp = x["company"]
    country = x["country"]
    em = x["email"]
    dom = em.split("@")[1].lower()
    sector = x["sector"]
    
    # Check MX host
    mx_hosts = []
    try:
        res = subprocess.run(['nslookup', '-type=mx', dom], capture_output=True, text=True, timeout=5)
        for line in res.stdout.splitlines():
            if 'mail exchanger =' in line.lower():
                mx_hosts.append(line.split('=')[-1].strip())
    except Exception as e:
        mx_hosts = [f"Error: {e}"]
        
    is_institution = any(k in comp.lower() or k in sector.lower() for k in ["chambre de commerce", "patronat", "barreau", "consulaire"])
    is_conglomerate = any(k in comp.lower() for k in ["agl", "bollore"])
    
    # Assess risk
    reasons = []
    if is_institution:
        reasons.append("Institution/Consulaire (Risque de filtrage strict ou adresse générique non active)")
    if is_conglomerate:
        reasons.append("Grand groupe international (Filtrage interne complexe)")
    if dom in ["iris.mg", "sentoo.sn"]:
        reasons.append("FAI historique local parfois restrictif")
        
    if reasons:
        risky_targets.append((i, comp, em, country, reasons, mx_hosts))
        print(f"[{i:02d}] [ATTENTION] {comp} ({country}) -> {em} | Risque: {', '.join(reasons)}")
    else:
        safe_targets.append((i, comp, em, country, mx_hosts))
        print(f"[{i:02d}] [SECURE] {comp} ({country}) -> {em} | MX: {mx_hosts[:1]}")

print(f"\nTotal Secure: {len(safe_targets)}")
print(f"Total Risky/Institutionnel: {len(risky_targets)}")
