import json
import subprocess

with open('batch_26_terroir_excellence.json', 'r', encoding='utf-8') as f:
    batch = json.load(f)

print("=== VÉRIFICATION DNS & MX POUR LE BATCH 26 ===")
for p in batch:
    dom = p['domain']
    em = p['email']
    comp = p['company']
    res = subprocess.run(['nslookup', '-type=mx', dom], capture_output=True, text=True)
    mx_lines = [l.strip() for l in res.stdout.splitlines() if 'mail exchanger' in l or 'MX preference' in l]
    mx = mx_lines[0] if mx_lines else 'AUCUN MX'
    print(f"[{comp}] {em} -> {mx}")
