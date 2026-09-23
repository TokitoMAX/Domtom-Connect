import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_emails = set(c['email'].lower().strip() for c in excl['contacts'])
known_domains = set(d.lower().strip() for d in excl['domains'])

check_list = [
    ("Distillerie Longueteau", "reservation@rhumlongueteau.fr", "rhumlongueteau.fr"),
    ("Groupe Kirène", "marketing@kirene.sn", "kirene.sn"),
    ("SGDE", "contact@sgde.fr", "sgde.fr"),
    ("SMAE Mayotte", "contact@mahoraisedeseaux.com", "mahoraisedeseaux.com"),
    ("Groupe GRAHD / Antilles Glaces", "cpouply@grahd.com", "grahd.com"),
    ("CERP Martinique", "contact@cerp-ba.com", "cerp-ba.com"),
]

print("--- VERIFICATION DES 6 CIBLES DU BATCH 21 ---")
for name, em, dom in check_list:
    in_em = em.lower().strip() in known_emails
    in_dom = dom.lower().strip() in known_domains
    print(f"{name} ({em} / {dom}): in_emails={in_em}, in_domains={in_dom}")
