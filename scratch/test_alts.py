import subprocess, sys
sys.path.append('scripts')
from dedup_engine import is_domain_or_company_duplicate

def check_mx(domain):
    try:
        res = subprocess.run(f"nslookup -type=mx {domain}", shell=True, capture_output=True, text=True, timeout=5)
        out = res.stdout.lower()
        if "mail exchanger" in out or "mx preference" in out:
            return True, "MX OK"
        return False, "Aucun MX"
    except Exception as e:
        return False, str(e)

alts = [
    {"company": "Madinina Fret", "email": "contact@madininafret.com"},
    {"company": "Setcargo International", "email": "contact@setcargo.com"},
    {"company": "M2R Maritime", "email": "contact@m2rmaritime.com"},
    {"company": "Balguerie Outre-Mer", "email": "contact@balguerie.com"},
    {"company": "Tramar Outre-Mer", "email": "contact@tramar.fr"},
    {"company": "Sodetram Martinique", "email": "contact@sodetram.fr"},
    {"company": "Trans-Air Fret", "email": "contact@transairfret.com"},
    {"company": "Outremer Transit", "email": "contact@outremertransit.com"}
]

for a in alts:
    is_dup, reason = is_domain_or_company_duplicate(a['email'], a['company'])
    dom = a['email'].split('@')[1]
    mx_ok, msg = check_mx(dom)
    print(f"[{'VALIDE' if not is_dup and mx_ok else 'REJET'}] {a['company']} | {a['email']} -> Dup: {is_dup} ({reason if is_dup else 'Non'}) | MX: {msg}")
