import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('batch_20_needs_discovery.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)
with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_emails = set(c['email'].lower().strip() for c in excl['contacts'])
known_domains = set(d.lower().strip() for d in excl['domains'])

print("--- STATUS DES PROSPECTS BATCH 20 ---")
for l in leads:
    em = l['email'].lower().strip()
    dom = l['domain'].lower().strip()
    in_em = em in known_emails
    in_dom = dom in known_domains
    print(f"{l['company']} | {em} | in_contacts: {in_em} | in_domains: {in_dom}")
