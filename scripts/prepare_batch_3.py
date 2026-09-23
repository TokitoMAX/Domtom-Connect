import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    db = json.load(f)

excluded_domains = set(db["domains"])
excluded_emails = set(c["email"].lower().strip() for c in db["contacts"])

def check_mx(domain):
    try:
        res = subprocess.run(["nslookup", "-type=mx", domain], capture_output=True, text=True, timeout=3)
        out = res.stdout
        return "mail exchanger" in out.lower() or "mx preference" in out.lower()
    except Exception:
        return False

candidate_leads = [
    # Martinique
    {"name": "Blue Lines SAS", "email": "bl.contact@bluelines.mq", "domain": "bluelines.mq", "zone": "Martinique", "offre": "copilotage", "lang": "fr"},
    {"name": "Casababa", "email": "contact@casababa.mq", "domain": "casababa.mq", "zone": "Martinique", "offre": "tremplin", "lang": "fr"},
    
    # Guadeloupe
    {"name": "Hôtel Saint-Georges", "email": "direction@hotelsaintgeorges.gp", "domain": "hotelsaintgeorges.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "GMC Matériel Caraïbe", "email": "contact@gmc.gp", "domain": "gmc.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Make Up For Ever Guadeloupe", "email": "contact@makeupforever.gp", "domain": "makeupforever.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "Natur'O", "email": "contact@naturo.gp", "domain": "naturo.gp", "zone": "Guadeloupe", "offre": "tremplin", "lang": "fr"},
    {"name": "Courses à Domicile Guadeloupe", "email": "clients@cad.gp", "domain": "cad.gp", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},
    {"name": "MBG Autos", "email": "contact@mbg-autos.com", "domain": "mbg-autos.com", "zone": "Guadeloupe", "offre": "copilotage", "lang": "fr"},

    # Réunion
    {"name": "SCMP Réunion", "email": "contact@scmp.re", "domain": "scmp.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "THÉO Consultant", "email": "contact@theoconsultant.re", "domain": "theoconsultant.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Les Tisserands", "email": "hello@lestisserands.org", "domain": "lestisserands.org", "zone": "Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Résidence Santa Apolonia", "email": "contact@residence-santa-apolonia.com", "domain": "residence-santa-apolonia.com", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "E2R Réunion", "email": "e2r@e2r.re", "domain": "e2r.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "STE Réunion", "email": "contact@st-electrique.re", "domain": "st-electrique.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Beauty Artist", "email": "contact@beautyartist.re", "domain": "beautyartist.re", "zone": "Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Reflet Péi", "email": "contact@refletpei.re", "domain": "refletpei.re", "zone": "Réunion", "offre": "tremplin", "lang": "fr"},
    {"name": "Drive Me Réunion", "email": "contact@drive-me.re", "domain": "drive-me.re", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},
    {"name": "Mon Bureau RH", "email": "contact@mon-bureau-rh.com", "domain": "mon-bureau-rh.com", "zone": "Réunion", "offre": "copilotage", "lang": "fr"},

    # Sénégal
    {"name": "Sipres SA", "email": "contact@sipres.sn", "domain": "sipres.sn", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},
    {"name": "HeberSenegal", "email": "contact@hebersenegal.com", "domain": "hebersenegal.com", "zone": "Sénégal", "offre": "tremplin", "lang": "fr"},
    {"name": "APIX Sénégal", "email": "infos@apix.sn", "domain": "apix.sn", "zone": "Sénégal", "offre": "copilotage", "lang": "fr"},
    {"name": "Garraway T S & Co", "email": "info@tsgarraway.com", "domain": "tsgarraway.com", "zone": "Barbados", "offre": "copilotage", "lang": "en"},

    # Côte d'Ivoire
    {"name": "Groupe Assawa", "email": "contact@assawaeducation.ci", "domain": "assawaeducation.ci", "zone": "Côte d'Ivoire", "offre": "tremplin", "lang": "fr"},
    {"name": "SONAPIE", "email": "info@sonapie.ci", "domain": "sonapie.ci", "zone": "Côte d'Ivoire", "offre": "copilotage", "lang": "fr"},
    {"name": "Weblogy Group", "email": "contact@weblogy.com", "domain": "weblogy.com", "zone": "Côte d'Ivoire", "offre": "copilotage", "lang": "fr"},

    # International / Caribbean Diaspora (Anglophone)
    {"name": "WiPay Caribbean", "email": "info@wipaycaribbean.com", "domain": "wipaycaribbean.com", "zone": "Trinidad & Tobago / Caribbean", "offre": "copilotage", "lang": "en"},
    {"name": "Mailpac Group", "email": "info@mailpac.com", "domain": "mailpac.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"},
    {"name": "Lasco Jamaica", "email": "info@lascojamaica.com", "domain": "lascojamaica.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"},
    {"name": "Atlas Cargo", "email": "info@atlascargo.com", "domain": "atlascargo.com", "zone": "Barbados", "offre": "copilotage", "lang": "en"},
    {"name": "A. E. Parnell & Company", "email": "admin@aeparnell.com", "domain": "aeparnell.com", "zone": "Jamaica", "offre": "copilotage", "lang": "en"}
]

print("Vérification DNS / MX et dédoublonnage pour Batch 3...", flush=True)
verified = []
for p in candidate_leads:
    em = p["email"].lower().strip()
    dom = p["domain"].lower().strip()

    if em in excluded_emails or dom in excluded_domains:
        print(f"[-] DÉJÀ CONTACTÉ : {em} ({dom})", flush=True)
        continue

    if check_mx(dom):
        print(f"[+] MX VALIDE : {p['name']} -> {em}", flush=True)
        verified.append(p)
    else:
        print(f"[x] ECHEC MX (serveur mail introuvable) : {dom}", flush=True)

print(f"\nRésultat final : {len(verified)} prospects certifiés valides avec MX.", flush=True)
with open("batch_3_verified.json", "w", encoding="utf-8") as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
