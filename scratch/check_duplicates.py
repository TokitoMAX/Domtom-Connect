import json

data = json.load(open('contacts_deja_contactes.json', encoding='utf-8'))
domains = set(data.get('domains', []))
contacts = data.get('contacts', [])

print(f"Total domains in exclusion list: {len(domains)}")
print(f"Total contacts in contacts list: {len(contacts)}")

check_list = [
    'secretsdeloly.com', 'lessecretsdeloly.com',
    'noireonaturel.com', 'kalianature.com',
    'pardon.re', 'pardon.net',
    'parfums-des-iles.com', 'madras-bazaar.re',
    'robertwan.com', 'creationorguyane.com',
    'bourbonpalto.com', 'lasavonnerieantillaise.fr'
]

for dom in check_list:
    in_doms = dom in domains
    matches = [c for c in contacts if isinstance(c, dict) and dom in c.get('email', '')]
    print(f"\n[{dom}] -> in_domains_set: {in_doms} | past_contacts_count: {len(matches)}")
    for m in matches:
        print(f"   -> {m.get('date_contacted')} | {m.get('email')} | {m.get('company')}")
