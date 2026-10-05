import json, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('batch_34_medias_presse.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

existing_contacts = {c['email'].lower() for c in db.get('contacts', []) if isinstance(c, dict) and 'email' in c}
existing_domains = {d.lower() for d in db.get('domains', []) if isinstance(d, str)}

errors = []
seen_emails = set()
seen_domains = set()

for lead in leads:
    comp = lead['company']
    e = lead['email'].strip().lower()
    d = e.split('@')[1] if '@' in e else ''
    
    if e in existing_contacts: errors.append('DUPLICATE EMAIL: ' + e)
    if e in seen_emails: errors.append('INTERNAL DUPE: ' + e)
    seen_emails.add(e)
    if d in existing_domains: errors.append('DUPLICATE DOMAIN: ' + d)
    if d in seen_domains: errors.append('INTERNAL DOMAIN DUPE: ' + d)
    seen_domains.add(d)
    
    if ':' in lead['subject']: errors.append('COLON IN SUBJECT: ' + comp)
    if ':' in lead['body']: errors.append('COLON IN BODY: ' + comp)
    if 'www.domtomconnect.com' not in lead['body']: errors.append('MISSING URL: ' + comp)
    if 'Villeronce' not in lead['body']: errors.append('MISSING SIG: ' + comp)
    
    p = subprocess.run(['nslookup', '-type=mx', d], capture_output=True, text=True)
    if 'mail exchanger' not in p.stdout.lower() and 'mx' not in p.stdout.lower():
        errors.append('NO MX: ' + comp + ' (' + d + ')')
    else:
        print('OK | ' + comp + ' | ' + e)

print('')
if errors:
    print('ERRORS:')
    for er in errors:
        print('  ' + er)
    sys.exit(1)
else:
    print('100% CONFORME - ' + str(len(leads)) + ' leads prets')
