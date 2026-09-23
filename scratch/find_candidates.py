import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    excl = json.load(f)

known_emails = set(c['email'].lower().strip() for c in excl['contacts'])
known_domains = set(d.lower().strip() for d in excl['domains'])

print(f"Total contacts exclus: {len(known_emails)}")
print(f"Total domaines exclus: {len(known_domains)}")

# Let's inspect prospects_430.json if it exists
try:
    with open('prospects_430.json', 'r', encoding='utf-8') as f:
        p430 = json.load(f)
    print(f"Prospects dans prospects_430.json: {len(p430)}")
    
    available = []
    for p in p430:
        em = p.get('email', '').lower().strip()
        dom = em.split('@')[-1] if '@' in em else ''
        if em and em not in known_emails and dom not in known_domains:
            available.append(p)
    print(f"Prospects disponibles non contactés: {len(available)}")
    for a in available[:15]:
        print(f"- {a.get('nom', a.get('company', a.get('name')))} | {a.get('email')} | {a.get('territoire', a.get('zone', ''))} | {a.get('activite', a.get('secteur', ''))}")
except Exception as e:
    print(f"Erreur prospects_430: {e}")
