import json

f_path = 'scripts/exclusions.json'
with open(f_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

bad_emails = [
    'contact@digitalinnovation.bj',
    'contact@mahatsara.com',
    'contact@comptoirdesiles.fr',
    'contact@biodesiles.fr',
    'reunion@avril-beaute.fr',
    'contact@karunature.com',
    'contact@tikoze.com',
    'contact@oceom.fr'
]

bad_domains = [
    'digitalinnovation.bj',
    'mahatsara.com',
    'comptoirdesiles.fr',
    'biodesiles.fr',
    'karunature.com',
    'tikoze.com',
    'oceom.fr'
]

added_e = 0
for e in bad_emails:
    if e not in data['excluded_emails']:
        data['excluded_emails'].append(e)
        added_e += 1

added_d = 0
for d in bad_domains:
    if d not in data['excluded_domains']:
        data['excluded_domains'].append(d)
        added_d += 1

data['excluded_emails'] = sorted(list(set(data['excluded_emails'])))
data['excluded_domains'] = sorted(list(set(data['excluded_domains'])))
data['total_excluded_emails'] = len(data['excluded_emails'])
data['total_excluded_domains'] = len(data['excluded_domains'])

with open(f_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Done! Added {added_e} emails, {added_d} domains.")
print(f"Total emails: {len(data['excluded_emails'])}, Total domains: {len(data['excluded_domains'])}")
