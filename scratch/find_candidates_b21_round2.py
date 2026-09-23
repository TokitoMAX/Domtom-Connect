import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_emails = set(c['email'].lower().strip() for c in excl['contacts'])
known_domains = set(d.lower().strip() for d in excl['domains'])

def check_mx(domain):
    try:
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameExchange"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=5)
        out = res.stdout.strip().splitlines()
        return [o.strip() for o in out if o.strip()]
    except Exception:
        return []

candidates = [
    # Groupe Bernard Hayot / filiales & concessions reconnues
    {"company": "Société Antillaise de Distribution Automobile (SADA)", "domain": "sada.mq", "zone": "Martinique", "sector": "Automobile & Distribution"},
    # L'Union Industrielle et Maritime de Guadeloupe (UIMG) / Acajou
    {"company": "Albioma Caraïbes", "domain": "albioma.com", "zone": "Guadeloupe / Martinique / Réunion", "sector": "Énergie & Biomasse"},
    # Groupe Parfait / Antilles
    {"company": "Groupe Parfait", "domain": "groupeparfait.com", "zone": "Martinique / Guadeloupe", "sector": "Grande Distribution & Automobile"},
    # Société Réunionnaise du Radiotéléphone (SRR / SFR Réunion)
    {"company": "SFR Réunion / SRR", "domain": "srr.fr", "zone": "La Réunion", "sector": "Télécoms & Réseaux"},
    # Zeop (La Réunion - Premier opérateur fibre indépendant de l'île)
    {"company": "Zeop", "domain": "zeop.re", "zone": "La Réunion", "sector": "Télécoms & Très Haut Débit"},
    # Air Austral
    {"company": "Air Austral", "domain": "air-austral.com", "zone": "La Réunion", "sector": "Compagnie aérienne océan Indien"},
    # Air Caraïbes
    {"company": "Air Caraïbes", "domain": "aircaraibes.com", "zone": "Guadeloupe / Martinique", "sector": "Transport aérien caribéen"},
    # Groupe Fabre Domergue (Martinique - Distribution CHR & Agro)
    {"company": "Groupe Fabre Domergue", "domain": "fabredomergue.com", "zone": "Martinique", "sector": "Distribution alimentaire CHR"},
    # Pharmacie / Grossiste Cerp Bretagne Atlantique / Antilles
    {"company": "CERP Martinique", "domain": "cerp-ba.com", "zone": "Antilles", "sector": "Répartition pharmaceutique"},
    # Société Mahoraise des Eaux (SMAE)
    {"company": "SMAE Mayotte", "domain": "smae.fr", "zone": "Mayotte", "sector": "Gestion de l'eau & Réseaux"},
    # Guyane Éco Logistique / Dégrad des Cannes
    {"company": "Transports Guyane Express", "domain": "guyane-express.com", "zone": "Guyane", "sector": "Transport terrestre & Desserte intérieure"},
    # Groupe Loret
    {"company": "Groupe Loret", "domain": "loret.net", "zone": "Guadeloupe", "sector": "Télécoms sous-marins & Automobile"},
    # BTP Réunion - Groupe Ravate
    {"company": "Groupe Ravate", "domain": "ravate.com", "zone": "La Réunion", "sector": "Bricolage, Matériaux & BTP"},
    # Antenne Réunion (Média TV majeur de La Réunion)
    {"company": "Antenne Réunion", "domain": "antennereunion.fr", "zone": "La Réunion", "sector": "Télévision privée & Numérique"},
    # Karuline (Guadeloupe - Agrochimie & Hygiène locale)
    {"company": "Karuline", "domain": "karuline.com", "zone": "Guadeloupe", "sector": "Industrie locale & Hygiène"},
    # Tropic Marché
    {"company": "Soreca (Martinique)", "domain": "soreca.mq", "zone": "Martinique", "sector": "Agroalimentaire & Distribution"},
    # Cuisinella / Schmidt Antilles
    {"company": "Doreva (Guadeloupe / Martinique)", "domain": "doreva.fr", "zone": "Guadeloupe", "sector": "Aménagement & Habitat"},
    # Mascareignes Expertise / Experts-comptables Réunion
    {"company": "Exa Océan Indien", "domain": "exa.re", "zone": "La Réunion", "sector": "Expertise comptable & Audit"}
]

print("--- RECHERCHE APPROFONDIE CANDIDATS BATCH 21 ---")
results = []
for c in candidates:
    dom = c['domain'].lower().strip()
    if dom in known_domains:
        print(f"[DEJA EN BASE] {c['company']} ({dom})")
        continue
    mx = check_mx(dom)
    is_m365 = any('outlook' in m.lower() or 'microsoft' in m.lower() for m in mx)
    is_orange = any('orange' in m.lower() or 'wanadoo' in m.lower() for m in mx)
    status = "OK" if mx and not is_orange else ("EXCLU ORANGE" if is_orange else "NO MX")
    print(f"{c['company']} ({c['zone']}) -> {dom} | MX: {len(mx)} | M365: {is_m365} | Status: {status} | MX1: {mx[0] if mx else 'None'}")
    if status == "OK":
        results.append((c, mx, is_m365))

print(f"\nTotal éligibles trouvés: {len(results)}")
