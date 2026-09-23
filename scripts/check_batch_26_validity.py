import json
import subprocess
import smtplib
import socket
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('batch_26_terroir_excellence.json', 'r', encoding='utf-8') as f:
    batch = json.load(f)

print(f"============================================================")
print(f"AUDIT ET VÉRIFICATION APPROFONDIE DES {len(batch)} ADRESSES EMAIL")
print(f"============================================================\n")

for idx, p in enumerate(batch, 1):
    c_name = p['company']
    email = p['email']
    dom = p['domain']
    
    # 1. NSLOOKUP MX
    res = subprocess.run(['nslookup', '-type=mx', dom], capture_output=True, text=True)
    mx_lines = [l.strip() for l in res.stdout.split('\n') if 'mail exchanger' in l or 'MX preference' in l]
    
    mx_host = None
    if mx_lines:
        parts = mx_lines[0].split('=')
        if len(parts) > 1:
            mx_host = parts[-1].strip().rstrip('.')
            
    print(f"[{idx}/{len(batch)}] {c_name}")
    print(f"  Email : {email}")
    print(f"  Domaine : {dom}")
    print(f"  Serveur MX : {mx_host}")

    # 2. Test de connectivité réseau / ping port SMTP
    if mx_host:
        # Check IP resolution
        try:
            ip = socket.gethostbyname(mx_host)
            print(f"  Résolution IP MX : {ip} [OK]")
        except Exception as e:
            print(f"  Résolution IP MX : ÉCHEC ({e})")
            
        # Try direct SMTP handshake (RCPT TO)
        try:
            s = smtplib.SMTP(mx_host, 25, timeout=6)
            s.ehlo("domtomconnect.com")
            code, msg = s.mail("domtomconnect@gmail.com")
            code2, msg2 = s.rcpt(email)
            resp = msg2.decode('utf-8', errors='ignore').strip()
            print(f"  Réponse SMTP directe (Port 25) : Code {code2} -> {resp}")
            s.quit()
        except Exception as e:
            print(f"  Test Port 25 direct : {e} (Filtrage standard FAI / protection anti-spam)")
    else:
        print(f"  ❌ AUCUN SERVEUR MX TROUVÉ !")

    # 3. Vérification du corps de l'email
    subject = p['subject']
    body = p['body']
    colons = []
    if ":" in subject:
        colons.append("dans l'objet")
    if ":" in body:
        colons.append("dans le corps")
    
    if colons:
        print(f"  ❌ DEUX-POINTS TROUVÉS : {', '.join(colons)}")
    else:
        print(f"  Règle 0 deux-points : [PARFAIT]")

    print("-" * 60)
