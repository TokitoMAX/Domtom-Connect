import json
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    {'name': 'Domaine de Séverin', 'email': 'contact@ledomainedeseverin.fr', 'domain': 'ledomainedeseverin.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Habitation Céron', 'email': 'habitationceron@gmail.com', 'domain': 'gmail.com', 'zone': 'Martinique', 'offre': 'tremplin'},
    {'name': 'Village de la Poterie', 'email': 'contact@poterie-village.fr', 'domain': 'poterie-village.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Rhum A1710', 'email': 'contact@a1710.fr', 'domain': 'a1710.fr', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Baie des Trésors', 'email': 'tsaliniere@baiedestresors.mq', 'domain': 'baiedestresors.mq', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Rhum Hardy', 'email': 'contact@rhum-hardy.com', 'domain': 'rhum-hardy.com', 'zone': 'Martinique', 'offre': 'copilotage'},
    {'name': 'Délices de Guyane', 'email': 'contact@delices-de-guyane.fr', 'domain': 'delices-de-guyane.fr', 'zone': 'Guyane', 'offre': 'copilotage'},
    {'name': 'Solam Guyane', 'email': 'contact@solam.fr', 'domain': 'solam.fr', 'zone': 'Guyane', 'offre': 'copilotage'},
    {'name': 'Scierie Dégrad Saramaca', 'email': 'administratif@scierieds.fr', 'domain': 'scierieds.fr', 'zone': 'Guyane', 'offre': 'copilotage'},
    {'name': 'Structures Esprit Bois', 'email': 'sat@sebois.fr', 'domain': 'sebois.fr', 'zone': 'Guyane', 'offre': 'copilotage'},
    {'name': 'IBS Mayotte', 'email': 'secretariat@ibs-groupe.com', 'domain': 'ibs-groupe.com', 'zone': 'Mayotte', 'offre': 'copilotage'},
    {'name': 'Hôtel Le Saint Alexis', 'email': 'commercial@hotelsaintalexis.com', 'domain': 'hotelsaintalexis.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Blue Margouillat', 'email': 'info@blue-margouillat.com', 'domain': 'blue-margouillat.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Villa Delisle Hôtel & Spa', 'email': 'info@villadelisle.re', 'domain': 'villadelisle.re', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'CBo Territoria', 'email': 'contact@cboterritoria.com', 'domain': 'cboterritoria.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Zoorit', 'email': 'info@zoorit.com', 'domain': 'zoorit.com', 'zone': 'La Réunion', 'offre': 'tremplin'},
    {'name': 'Agence Nawar', 'email': 'contact@nawar.re', 'domain': 'nawar.re', 'zone': 'La Réunion', 'offre': 'tremplin'},
    {'name': 'Corail Hélicoptères', 'email': 'reunion@corailhelico.com', 'domain': 'corailhelico.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Hélilagon', 'email': 'info@helilagon.com', 'domain': 'helilagon.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Aquarium de La Réunion', 'email': 'contact@aquariumdelareunion.com', 'domain': 'aquariumdelareunion.com', 'zone': 'La Réunion', 'offre': 'copilotage'},
    {'name': 'Jardin de Valombreuse', 'email': 'contact@valombreuse.com', 'domain': 'valombreuse.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Karucocoparc', 'email': 'contact@karucocoparc.com', 'domain': 'karucocoparc.com', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'Maison du Cacao', 'email': 'contact@maisonducacao.fr', 'domain': 'maisonducacao.fr', 'zone': 'Guadeloupe', 'offre': 'copilotage'},
    {'name': 'HUB2 Côte d\'Ivoire', 'email': 'contact.ci@hub2.io', 'domain': 'hub2.io', 'zone': 'Côte d\'Ivoire', 'offre': 'copilotage'},
    {'name': 'Daba Finance', 'email': 'contact@dabafinance.com', 'domain': 'dabafinance.com', 'zone': 'Côte d\'Ivoire', 'offre': 'copilotage'},
    {'name': 'KkiaPay', 'email': 'support@kkiapay.me', 'domain': 'kkiapay.me', 'zone': 'Côte d\'Ivoire / Bénin', 'offre': 'copilotage'}
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

print(f"\nTOTAL VALIDÉS POUR BATCH 12 : {len(valid_leads)}")
with open('batch_12_verified.json', 'w', encoding='utf-8') as f:
    json.dump(valid_leads, f, indent=2, ensure_ascii=False)
