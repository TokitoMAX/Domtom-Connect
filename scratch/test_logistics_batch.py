import subprocess, sys
sys.path.append('scripts')
from dedup_engine import is_domain_or_company_duplicate

def check_mx_windows(domain):
    try:
        res = subprocess.run(f"nslookup -type=mx {domain}", shell=True, capture_output=True, text=True, timeout=5)
        out = res.stdout.lower()
        if "mail exchanger" in out or "mx preference" in out:
            return True, "MX OK"
        return False, "Aucun MX"
    except Exception as e:
        return False, str(e)

CANDIDATES = [
    {
        "company": "SGC Maritime",
        "email": "contact@sgcmaritime.com",
        "territory": "Antilles, Guyane & Réunion"
    },
    {
        "company": "Outremer Fret",
        "email": "contact@outremerfret.com",
        "territory": "Guadeloupe, Martinique & Réunion"
    },
    {
        "company": "Oceanic Transit",
        "email": "contact@oceanictransit.com",
        "territory": "Guyane (Cayenne)"
    },
    {
        "company": "SNT Logistique",
        "email": "info@snt.re",
        "territory": "La Réunion (Le Port)"
    },
    {
        "company": "DSG Transit Repiquet",
        "email": "commercial@transit-repiquet.com",
        "territory": "La Réunion (Le Port)"
    },
    {
        "company": "Centrimex Réunion",
        "email": "reunion@centrimex.com",
        "territory": "La Réunion (Le Port)"
    },
    {
        "company": "Cargo Services Jarry",
        "email": "infos@cargoservices.fr",
        "territory": "Guadeloupe (Baie-Mahault)"
    },
    {
        "company": "Tropical Export",
        "email": "tropicalexport.fdf@gmail.com",
        "territory": "Martinique (Le Lamentin)"
    },
    {
        "company": "Expedom Fret",
        "email": "contact@expedom.com",
        "territory": "La Réunion & Mayotte"
    },
    {
        "company": "Guyalog Fret",
        "email": "contact@guyalog.fr",
        "territory": "Guyane (Dégrad des Cannes)"
    },
    {
        "company": "Trans-Fret Services",
        "email": "contact@transitaire-martinique.com",
        "territory": "Martinique (Le Lamentin)"
    },
    {
        "company": "STRM Transports",
        "email": "contact@strm-transports.com",
        "territory": "Antilles & Métropole"
    }
]

print("=== VÉRIFICATION RIGOUREUSE BATCH 41 LOGISTIQUE ===")
valides = 0
for c in CANDIDATES:
    is_dup, reason = is_domain_or_company_duplicate(c['email'], c['company'])
    dom = c['email'].split('@')[1]
    mx_ok, mx_msg = check_mx_windows(dom)

    status = "VALIDE" if (not is_dup and mx_ok) else "REJET"
    if status == "VALIDE":
        valides += 1
    print(f"[{status}] {c['company']} | {c['email']} ({dom}) -> MX: {mx_msg}")
    if is_dup:
        print(f"   -> BLOCAGE DOUBLON : {reason}")
    if not mx_ok:
        print(f"   -> ERREUR MX : {mx_msg}")

print(f"\nTotal cibles 100% validées : {valides} / {len(CANDIDATES)}")
