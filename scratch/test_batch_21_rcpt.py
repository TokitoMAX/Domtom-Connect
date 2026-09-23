import smtplib
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    ("rhumlongueteau.com", "contact@rhumlongueteau.com"),
    ("kirene.sn", "contact@kirene.sn"),
    ("sudamex.fr", "contact@sudamex.fr"),
    ("antillesglaces.com", "contact@antillesglaces.com"),
    ("cananga.fr", "contact@cananga.fr"),
    ("smae.fr", "contact@smae.fr"),
]

def get_mx(domain):
    cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
    res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
    out = res.stdout.strip().splitlines()
    return out[0].strip() if out else None

for dom, em in candidates:
    mx = get_mx(dom)
    print(f"Testing {em} on {mx}...")
    if not mx:
        print("  NO MX RECORD")
        continue
    try:
        s = smtplib.SMTP(mx, 25, timeout=10)
        s.ehlo("domtomconnect.com")
        code, msg = s.mail("domtomconnect@gmail.com")
        code2, msg2 = s.rcpt(em)
        print(f"  Result: {code2} {msg2.decode('utf-8', errors='ignore')}")
        s.quit()
    except Exception as e:
        print(f"  Error: {e}")
