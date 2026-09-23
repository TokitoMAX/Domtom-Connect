import json

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

known_domains = set(data['domains'])

check_list = [
    "prodom.fr", "rogeralbertdistribution.fr", "alphacaraibe.fr"
]

for d in check_list:
    status = "DEJA CONTACTE" if d in known_domains else "INEDIT"
    print(f"{d}: {status}")
