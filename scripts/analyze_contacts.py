import json

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total contacts: {data['total_contacts']}")
print(f"Total domains: {data['total_domains']}")

# Afficher les contacts avec le plus de messages envoyés
sent_contacts = [c for c in data['contacts'] if c['count_sent'] > 0]
sent_contacts.sort(key=lambda x: x['count_sent'], reverse=True)

print(f"\nTop 25 contacts a qui vous avez ENVOYE des messages :")
for c in sent_contacts[:25]:
    name = c['name'] or '(sans nom)'
    print(f"- {c['email']} ({name}) | {c['count_sent']} envois | Derniers sujets: {c['subjects'][:1]}")

# Domaines d'entreprises notables
print("\nQuelques domaines d'entreprises contactées :")
company_domains = [d for d in data['domains'] if not any(x in d for x in ['gmail', 'hotmail', 'yahoo', 'outlook', 'orange.fr', 'free.fr', 'laposte.net', 'icloud', 'wanadoo.fr', 'sfr.fr'])]
print(f"Total domaines pros/entreprises : {len(company_domains)}")
for d in company_domains[:30]:
    print(f"  • {d}")
