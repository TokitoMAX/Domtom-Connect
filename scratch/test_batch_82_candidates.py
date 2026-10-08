import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'scripts'))
from email_validator import verify_domain_mx

candidates_82 = [
    {
        "company": "The Golden Key Guadeloupe",
        "email": "booking@goldenkey-guadeloupe.com",
        "domain": "goldenkey-guadeloupe.com",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://www.goldenkey-guadeloupe.com",
        "specialty": "Conciergerie premium & Villas de luxe"
    },
    {
        "company": "Voiles Bleues Conciergerie",
        "email": "contact@voilesbleues.com",
        "domain": "voilesbleues.com",
        "territory": "Guadeloupe (Sainte-Anne & Saint-François)",
        "source": "https://www.voilesbleues.com",
        "specialty": "Conciergerie de villas d'exception"
    },
    {
        "company": "KVZ Conciergerie",
        "email": "contact@kvzconciergerie.com",
        "domain": "kvzconciergerie.com",
        "territory": "Guadeloupe (Le Moule & Grande-Terre)",
        "source": "https://www.kvzconciergerie.com",
        "specialty": "Conciergerie privée et intendance locative"
    },
    {
        "company": "Au Jardin des Colibris",
        "email": "ecolodge@aujardindescolibris.com",
        "domain": "aujardindescolibris.com",
        "territory": "Guadeloupe (Deshaies)",
        "source": "https://www.aujardindescolibris.com",
        "specialty": "Écolodge de charme dans la canopée"
    },
    {
        "company": "WIVM West Indies Villa Management",
        "email": "sandrine@wivm.fr",
        "domain": "wivm.fr",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://www.wivm.fr",
        "specialty": "Intendance & Gestion de propriétés haut de gamme"
    },
    {
        "company": "Villa Prestige Antilles",
        "email": "location@villa-prestige-antilles.com",
        "domain": "villa-prestige-antilles.com",
        "territory": "Guadeloupe & Martinique",
        "source": "https://www.villa-prestige-antilles.com",
        "specialty": "Location de villas de prestige & Conciergerie"
    },
    {
        "company": "Les Clés d'Alice Conciergerie",
        "email": "contact@lesclesdalice.fr",
        "domain": "lesclesdalice.fr",
        "territory": "Martinique (Le Diamant & Sud)",
        "source": "https://www.lesclesdalice.fr",
        "specialty": "Gestion locative & Conciergerie privée"
    },
    {
        "company": "Villa Design Caraïbes",
        "email": "contact@villadesigncaraibes.com",
        "domain": "villadesigncaraibes.com",
        "territory": "Martinique",
        "source": "https://www.villadesigncaraibes.com",
        "specialty": "Intendance de villas de prestige & Conciergerie sur-mesure"
    },
    {
        "company": "Eden Paradise Ecolodge & Spa",
        "email": "edenparadise.spa@gmail.com",
        "domain": "gmail.com",
        "territory": "Martinique (Sainte-Luce)",
        "source": "https://www.edenparadisespa.com",
        "specialty": "Écolodge d'exception & Bien-être tropical"
    },
    {
        "company": "Luxury Homes St Barth",
        "email": "contact@luxuryhomes-stbarth.com",
        "domain": "luxuryhomes-stbarth.com",
        "territory": "Saint-Barthélemy (Gustavia)",
        "source": "https://www.luxuryhomes-stbarth.com",
        "specialty": "Gestion de villas ultra-luxe & Conciergerie VIP"
    },
    {
        "company": "Luxury Living St Barts",
        "email": "hello@llstbarts.com",
        "domain": "llstbarts.com",
        "territory": "Saint-Barthélemy (Gustavia)",
        "source": "https://www.luxurylivingstbarts.com",
        "specialty": "Conciergerie privée & Intendance haut de gamme"
    },
    {
        "company": "The Concierge St Barth",
        "email": "eric@theconcierge.fr",
        "domain": "theconcierge.fr",
        "territory": "Saint-Barthélemy",
        "source": "https://www.theconcierge.fr",
        "specialty": "Conciergerie d'exception & Séjours sur-mesure"
    },
    {
        "company": "Tropicalodge",
        "email": "contact@tropicalodge.fr",
        "domain": "tropicalodge.fr",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://www.tropicalodge.fr",
        "specialty": "Conciergerie & Lodges de caractère"
    },
    {
        "company": "Yes Conciergerie La Réunion",
        "email": "reunion@yesconciergerie.com",
        "domain": "yesconciergerie.com",
        "territory": "La Réunion (Saint-Gilles-les-Bains)",
        "source": "https://www.yesconciergerie-reunion.re",
        "specialty": "Conciergerie de villas & Résidences de standing"
    },
    {
        "company": "Écolodge de Simal",
        "email": "resa.ecolodgesimal@gmail.com",
        "domain": "gmail.com",
        "territory": "Sénégal (Sine Saloum)",
        "source": "https://www.ecolodgedesimal.com",
        "specialty": "Écolodge d'exception au bord du Saloum"
    },
    {
        "company": "Coucoué Lodge",
        "email": "contact@coucoue-lodge.com",
        "domain": "coucoue-lodge.com",
        "territory": "Côte d'Ivoire (Assinie)",
        "source": "https://www.coucoue-lodge.com",
        "specialty": "Lodge de référence en bord de lagune"
    },
    {
        "company": "La Maison d'Akoula",
        "email": "contact@akoula.ci",
        "domain": "akoula.ci",
        "territory": "Côte d'Ivoire (Assinie)",
        "source": "https://www.akoula.ci",
        "specialty": "Écolodge de luxe & Domaine privatif"
    }
]

print(f"Testing {len(candidates_82)} candidates for Batch 82...")

exclusions = json.load(open('scripts/exclusions.json', encoding='utf-8'))
ex_emails = set(e.lower() for e in exclusions.get('excluded_emails', []))
ex_domains = set(d.lower() for d in exclusions.get('excluded_domains', []))

contacts_db = json.load(open('contacts_deja_contactes.json', encoding='utf-8'))
db_emails = set(c.get('email', '').lower() for c in contacts_db.get('contacts', []))
db_domains = set(d.lower() for d in contacts_db.get('domains', []))

valid = []
for c in candidates_82:
    email = c['email'].lower().strip()
    domain = c['domain'].lower().strip()
    comp = c['company']
    
    if email in ex_emails or (domain not in ['gmail.com', 'yahoo.fr', 'hotmail.com'] and domain in ex_domains):
        print(f"❌ REJETÉ (Exclusion): {email} ({domain})")
        continue
    if email in db_emails:
        print(f"❌ REJETÉ (Email déjà contacté): {email}")
        continue
    if domain not in ['gmail.com', 'yahoo.fr', 'hotmail.com'] and domain in db_domains:
        print(f"❌ REJETÉ (Domaine déjà contacté): {domain} pour {comp}")
        continue
        
    mx_ok, mx_msg = verify_domain_mx(domain)
    if not mx_ok:
        print(f"❌ REJETÉ (MX invalide): {domain} -> {mx_msg}")
        continue
        
    print(f"✅ VALIDÉ: {comp} ({c['territory']}) | {email}")
    valid.append(c)

print(f"\nTotal valides et neufs pour Batch 82: {len(valid)} / {len(candidates_82)}")
