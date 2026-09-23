import json
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    {'name': 'Chocolats Mascarin', 'email': 'mascarin@mascarin.fr', 'domain': 'mascarin.fr', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Royal Bourbon Industries', 'email': 'rbi@royalbourbon.com', 'domain': 'royalbourbon.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Distillerie Chatel', 'email': 'chatel@groupechatel.com', 'domain': 'groupechatel.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': "Jardin d'Eden", 'email': 'contact@jardindeden.re', 'domain': 'jardindeden.re', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Le Labyrinthe Enchampthé', 'email': 'info@enchampthe.com', 'domain': 'enchampthe.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Capès Dolé', 'email': 'contact@capesdole.com', 'domain': 'capesdole.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Rhum Karukera', 'email': 'contact@rhum-karukera.com', 'domain': 'rhum-karukera.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Distillerie Damoiseau', 'email': 'rhum@damoiseau.com', 'domain': 'damoiseau.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Marina Bas-du-Fort', 'email': 'info@marinaguadeloupe.com', 'domain': 'marinaguadeloupe.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Eaux de Didier (SEEMD)', 'email': 'seemd@fontainedidier.com', 'domain': 'fontainedidier.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Chanflor (SOMES)', 'email': 'marketing@somadicom.fr', 'domain': 'somadicom.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Marina du Marin', 'email': 'contact@marina-martinique.fr', 'domain': 'marina-martinique.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Denel Martinique', 'email': 'contact@denelmartinique.com', 'domain': 'denelmartinique.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Le Meunier des Antilles', 'email': 'accueil@meunierdesantilles.com', 'domain': 'meunierdesantilles.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'GDI Guyane', 'email': 'contact@ardi-gdi.fr', 'domain': 'ardi-gdi.fr', 'zone': 'Guyane', 'offre': 'copilotage'},
    {'name': 'Madi Transit', 'email': 'contact@madi-transit.com', 'domain': 'madi-transit.com', 'zone': 'Mayotte', 'offre': 'copilotage'},
    {'name': 'TILT Groupe RDT', 'email': 'mayotte@groupe-rdt.com', 'domain': 'groupe-rdt.com', 'zone': 'Mayotte', 'offre': 'copilotage'},
    {'name': 'InTouch', 'email': 'contact@intouchgroup.net', 'domain': 'intouchgroup.net', 'zone': 'Sénégal / Côte d\'Ivoire', 'offre': 'copilotage'},
    {'name': 'Djamo', 'email': 'business@djamo.com', 'domain': 'djamo.com', 'zone': 'Côte d\'Ivoire', 'offre': 'copilotage'},
    {'name': 'Yobante Express', 'email': 'info@yobanteexpress.com', 'domain': 'yobanteexpress.com', 'zone': 'Sénégal', 'offre': 'copilotage'},
    {'name': 'Logidoo', 'email': 'logidoo@logidoo.co', 'domain': 'logidoo.co', 'zone': 'Sénégal', 'offre': 'copilotage'},
    {'name': 'Coliba', 'email': 'info@colibaafrica.com', 'domain': 'colibaafrica.com', 'zone': 'Côte d\'Ivoire', 'offre': 'copilotage'}
]

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])
known_domains = set(db['domains'])

valid_leads = []
for c in candidates:
    em = c['email'].lower().strip()
    dom = c['domain'].lower().strip()
    c['lang'] = 'fr'
    
    if em in known_emails:
        print(f"EXCLU (email deja en base) : {em}")
        continue
    if dom != 'gmail.com' and dom in known_domains:
        print(f"EXCLU (domaine deja en base) : {dom}")
        continue
    
    # Check MX resolution
    cmd = ['nslookup', '-type=mx', dom]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout
    if 'mail exchanger' in out or 'MX preference' in out or dom == 'gmail.com':
        valid_leads.append(c)
        print(f"VALID MX : {c['name']} ({c['zone']}) -> {em}")
    else:
        print(f"PAS DE MX : {dom}")

print(f"\nTOTAL VALIDÉS POUR BATCH 13 : {len(valid_leads)}")
with open('batch_13_verified.json', 'w', encoding='utf-8') as f:
    json.dump(valid_leads, f, indent=2, ensure_ascii=False)
