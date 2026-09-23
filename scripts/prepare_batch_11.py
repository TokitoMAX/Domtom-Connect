import json
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    {'name': 'Transport TMG', 'email': 'contact@transporttmg.com', 'domain': 'transporttmg.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'QuickShipping', 'email': 'contact@quickshipping.fr', 'domain': 'quickshipping.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Eshopper', 'email': 'contact.guadeloupe@eshopper.fr', 'domain': 'eshopper.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'GLC International', 'email': 'contact@glc-international.fr', 'domain': 'glc-international.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Pompière S.A.', 'email': 'contact@pompiere.fr', 'domain': 'pompiere.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Newdem Martinique', 'email': 'martinique@newdem.fr', 'domain': 'newdem.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'SKMS Transport', 'email': 'contact.skmstransport@gmail.com', 'domain': 'gmail.com', 'zone': 'Guyane', 'offre': 'tremplin'},
    {'name': 'ServeU', 'email': 'contact@serveu.fr', 'domain': 'serveu.fr', 'zone': 'Mayotte', 'offre': 'copilotage'},
    {'name': 'Garcia Location', 'email': 'contact@garcialocation.com', 'domain': 'garcialocation.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'MultiAuto Réunion', 'email': 'contact@multiauto.fr', 'domain': 'multiauto.fr', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Idéal Car Guadeloupe', 'email': 'idealcar971@gmail.com', 'domain': 'gmail.com', 'zone': 'Guadeloupe', 'offre': 'tremplin'},
    {'name': 'Alizés Locations', 'email': 'contact@alizes-locations.com', 'domain': 'alizes-locations.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Hibiscus Location', 'email': 'contact@hibiscuslocation.com', 'domain': 'hibiscuslocation.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': "Pop's Car", 'email': 'contact@popscar.com', 'domain': 'popscar.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Kawuk', 'email': 'contact@kawuk.com', 'domain': 'kawuk.com', 'zone': 'Guadeloupe', 'offre': 'tremplin'},
    {'name': 'Digital Freedom Caraïbe', 'email': 'contact@digitalfreedomcaraibe.com', 'domain': 'digitalfreedomcaraibe.com', 'zone': 'Martinique', 'offre': 'tremplin'},
    {'name': 'Kamtar', 'email': 'bonjour@kamtar.ci', 'domain': 'kamtar.ci', 'zone': "Côte d'Ivoire", 'offre': 'copilotage'},
    {'name': 'Paps Logistics', 'email': 'hello@paps-app.com', 'domain': 'paps-app.com', 'zone': 'Sénégal', 'offre': 'copilotage'},
    {'name': 'OuiCarry', 'email': 'contact@ouicarry.com', 'domain': 'ouicarry.com', 'zone': 'Sénégal', 'offre': 'copilotage'},
    {'name': 'Chargel', 'email': 'info@chargel.me', 'domain': 'chargel.me', 'zone': 'Sénégal', 'offre': 'copilotage'},
    {'name': 'Julaya', 'email': 'contact@julaya.co', 'domain': 'julaya.co', 'zone': "Côte d'Ivoire", 'offre': 'copilotage'},
    {'name': 'Baloon Assurance', 'email': 'contact@baloon.africa', 'domain': 'baloon.africa', 'zone': "Côte d'Ivoire", 'offre': 'copilotage'},
    {'name': 'Susu', 'email': 'contact@susu.fr', 'domain': 'susu.fr', 'zone': "Côte d'Ivoire / France", 'offre': 'copilotage'},
    {'name': 'Distillerie Bielle', 'email': 'info@rhumbielle.com', 'domain': 'rhumbielle.com', 'zone': 'Marie-Galante', 'offre': 'copilotage'},
    {'name': 'Distillerie Bologne', 'email': 'contact@rhumbologne.fr', 'domain': 'rhumbologne.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Distillerie Neisson', 'email': 'contact@neisson.com', 'domain': 'neisson.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Distillerie Depaz', 'email': 'communication@rhum-depaz.fr', 'domain': 'rhum-depaz.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Distillerie Montebello', 'email': 'boutique@distillerie-montebello.fr', 'domain': 'distillerie-montebello.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Café Chaulet', 'email': 'cafe.chaulet@wanadoo.fr', 'domain': 'wanadoo.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'SolarX Africa', 'email': 'info@solarx-africa.com', 'domain': 'solarx-africa.com', 'zone': 'Sénégal / CI', 'offre': 'copilotage'}
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
    if dom not in ['gmail.com', 'wanadoo.fr'] and dom in known_domains:
        print(f"EXCLU (domaine deja en base) : {dom}")
        continue
    
    # Check MX resolution
    cmd = ['nslookup', '-type=mx', dom]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout
    if 'mail exchanger' in out or 'MX preference' in out or dom in ['gmail.com', 'wanadoo.fr']:
        valid_leads.append(c)
        print(f"VALID MX : {c['name']} ({c['zone']}) -> {em}")
    else:
        print(f"PAS DE MX : {dom}")

print(f"\nTOTAL VALIDÉS POUR BATCH 11 : {len(valid_leads)}")
with open('batch_11_verified.json', 'w', encoding='utf-8') as f:
    json.dump(valid_leads, f, indent=2, ensure_ascii=False)
