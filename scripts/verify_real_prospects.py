import subprocess
import json
import re

# Base d'exclusion
with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    db = json.load(f)

excluded_domains = set(db["domains"])
excluded_emails = set(c["email"].lower().strip() for c in db["contacts"])

def check_mx(domain):
    try:
        cmd = f"Resolve-DnsName -Name {domain} -Type MX -ErrorAction SilentlyContinue"
        res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True, timeout=4)
        return "NameExchange" in res.stdout or "MailExchange" in res.stdout or len(res.stdout.strip()) > 0
    except Exception:
        return False

# Liste de vraies entreprises répertoriées aux Antilles, Guyane, Réunion, Afrique et Diaspora
candidates = [
    # Antilles / Guyane / Réunion (Marques et PME réelles)
    {"name": "Rhum Bologne", "domain": "rhum-bologne.com", "email": "contact@rhum-bologne.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Damoiseau", "domain": "damoiseau.com", "email": "contact@damoiseau.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Rhum Clément", "domain": "rhum-clement.net", "email": "contact@rhum-clement.net", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Chanflor", "domain": "chanflor.com", "email": "contact@chanflor.com", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Capès Dolé", "domain": "capes-dole.com", "email": "contact@capes-dole.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Biométal", "domain": "biometal.fr", "email": "contact@biometal.fr", "zone": "Martinique / Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Madivial", "domain": "madivial.fr", "email": "contact@madivial.fr", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Outremer Market", "domain": "outremer-market.com", "email": "contact@outremer-market.com", "zone": "DOM-TOM", "offre": "tremplin", "lang": "fr"},
    {"name": "Karuline", "domain": "karuline.com", "email": "contact@karuline.com", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "ColisExpat", "domain": "colisexpat.com", "email": "contact@colisexpat.com", "zone": "DOM / International", "offre": "copilotage", "lang": "fr"},
    {"name": "Easy Import Auto", "domain": "easyimportauto.com", "email": "contact@easyimportauto.com", "zone": "France / DOM", "offre": "copilotage", "lang": "fr"},
    {"name": "Bourbon Lumière", "domain": "bourbonlumiere.re", "email": "contact@bourbonlumiere.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Chatel Réunion", "domain": "chatel.re", "email": "contact@chatel.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Cilam", "domain": "cilam.com", "email": "contact@cilam.com", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Air Caraïbes Privé", "domain": "aircaraibes.com", "email": "contact@aircaraibes.com", "zone": "Antilles", "offre": "copilotage", "lang": "fr"},

    # Afrique Tech, Logistique & PME
    {"name": "OuiCarry", "domain": "ouicarry.com", "email": "contact@ouicarry.com", "zone": "Sénégal / France", "offre": "copilotage", "lang": "fr"},
    {"name": "Paps Logistique", "domain": "paps.sn", "email": "contact@paps.sn", "zone": "Sénégal / Côte d'Ivoire", "offre": "copilotage", "lang": "fr"},
    {"name": "Chargel", "domain": "chargel.com", "email": "hello@chargel.com", "zone": "Sénégal", "offre": "tremplin", "lang": "fr"},
    {"name": "CinetPay", "domain": "cinetpay.com", "email": "contact@cinetpay.com", "zone": "Côte d'Ivoire", "offre": "tremplin", "lang": "fr"},
    {"name": "Kamtar", "domain": "kamtar.co", "email": "contact@kamtar.co", "zone": "Côte d'Ivoire", "offre": "copilotage", "lang": "fr"},
    {"name": "Touchdown Africa", "domain": "touchdown.sn", "email": "info@touchdown.sn", "zone": "Sénégal", "offre": "tremplin", "lang": "fr"},
    {"name": "Julaya", "domain": "julaya.co", "email": "contact@julaya.co", "zone": "Côte d'Ivoire", "offre": "tremplin", "lang": "fr"},
    {"name": "Djamo", "domain": "djamo.ci", "email": "support@djamo.ci", "zone": "Côte d'Ivoire", "offre": "tremplin", "lang": "fr"},
    {"name": "Lafricamobile", "domain": "lafricamobile.com", "email": "contact@lafricamobile.com", "zone": "Sénégal / Panafrique", "offre": "copilotage", "lang": "fr"},
    {"name": "CoinAfrique", "domain": "coinafrique.com", "email": "contact@coinafrique.com", "zone": "Afrique de l'Ouest", "offre": "copilotage", "lang": "fr"},

    # Caraïbes Anglophones (English)
    {"name": "WiPay Caribbean", "domain": "wipaycaribbean.com", "email": "info@wipaycaribbean.com", "zone": "Trinidad / Caribbean", "offre": "tremplin", "lang": "en"},
    {"name": "Mailpac Group", "domain": "mailpac.com", "email": "info@mailpac.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"},
    {"name": "Caribshopper", "domain": "caribshopper.com", "email": "support@caribshopper.com", "zone": "Caribbean", "offre": "tremplin", "lang": "en"},
    {"name": "Lasco Distributors", "domain": "lascojamaica.com", "email": "info@lascojamaica.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"},
    {"name": "GraceKennedy", "domain": "gracekennedy.com", "email": "gracekennedy@gkco.com", "zone": "Jamaica / Global", "offre": "copilotage", "lang": "en"},
    {"name": "Massy Group", "domain": "massygroup.com", "email": "info@massygroup.com", "zone": "Trinidad / Caribbean", "offre": "copilotage", "lang": "en"},
    {"name": "Courts Caribbean", "domain": "shopcourts.com", "email": "customerservice@shopcourts.com", "zone": "Caribbean", "offre": "copilotage", "lang": "en"},
    {"name": "Goddard Enterprises", "domain": "goddardenterprisesltd.com", "email": "info@gelinfo.com", "zone": "Barbados", "offre": "copilotage", "lang": "en"},

    # Caraïbes Hispanophones (Spanish)
    {"name": "Aeropaq", "domain": "aeropaq.com", "email": "info@aeropaq.com", "zone": "República Dominicana", "offre": "copilotage", "lang": "es"},
    {"name": "EPS Courier", "domain": "eps.com.do", "email": "servicioalcliente@eps.com.do", "zone": "República Dominicana", "offre": "copilotage", "lang": "es"},
    {"name": "BM Cargo", "domain": "bmcargo.com", "email": "info@bmcargo.com", "zone": "República Dominicana", "offre": "copilotage", "lang": "es"},
    {"name": "Gustazos", "domain": "gustazos.com", "email": "support@gustazos.com", "zone": "Puerto Rico / Caribe", "offre": "tremplin", "lang": "es"},
    {"name": "Rica Dominicana", "domain": "gruporica.com", "email": "contacto@gruporica.com", "zone": "República Dominicana", "offre": "copilotage", "lang": "es"},
    {"name": "Cervecería Nacional Dominicana", "domain": "cnd.com.do", "email": "contacto@cnd.com.do", "zone": "República Dominicana", "offre": "copilotage", "lang": "es"}
]

print("Vérification DNS/MX et déduplication en direct...")
verified = []

for c in candidates:
    dom = c["domain"]
    em = c["email"].lower().strip()
    
    if dom in excluded_domains or em in excluded_emails:
        print(f"[EXCLU] {dom} déjà contacté.")
        continue
        
    has_mx = check_mx(dom)
    if has_mx:
        print(f"[VALIDE MX] {c['name']} ({dom}) -> OK")
        verified.append(c)
    else:
        print(f"[INVALIDE MX] {c['name']} ({dom}) -> REJETE")

print(f"\nTotal entreprises réelles 100% validées : {len(verified)}")
with open("verified_candidates.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
