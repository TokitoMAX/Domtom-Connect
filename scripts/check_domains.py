import json

with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

known_domains = set(data['domains'])

check_list = [
    "noviris.com", "basicom.fr", "coclicomedia.com", "web2web.fr", 
    "digitom.fr", "mjmetrix.com", "primo-studio.fr", "rankeoo.com",
    "meetafrica.fr", "resonances-nordsud.org", "mansa.fr", "club-ebene.fr",
    "essitem.io", "caraibesangels.org", "tsena.fr", "betweenoceans.pro"
]

print("Verification croisee avec la base d'exclusion :")
for d in check_list:
    status = "DEJA CONTACTE / DANS LA BOITE" if d in known_domains else "NOUVEAU (PROSPECTABLE)"
    print(f"- {d} : {status}")
