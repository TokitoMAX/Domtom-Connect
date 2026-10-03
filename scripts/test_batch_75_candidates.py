import os, sys, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

candidates = [
    # Architecture & Bureaux d'études
    {'company': 'B&M Architecture', 'email': 'contact@bm-architecture.fr', 'territory': 'Guadeloupe', 'website': 'https://bm-architecture.fr', 'category': 'Architecture & Urbanisme'},
    {'company': 'Moma Architecture', 'email': 'contact@moma-architecture.fr', 'territory': 'Guadeloupe', 'website': 'https://moma-architecture.fr', 'category': 'Architecture & Urbanisme'},
    {'company': 'Design S&C Agency', 'email': 'contact@designscagency.com', 'territory': 'Guadeloupe', 'website': 'https://designscagency.com', 'category': 'Architecture & Design Intérieur'},
    {'company': 'Philippe Zaffran Architecte', 'email': 'info@philippe-zaffran-architecte.fr', 'territory': 'Martinique', 'website': 'https://philippe-zaffran-architecte.fr', 'category': 'Architecture & Bâtiment'},
    {'company': 'Abite Architectes', 'email': 'contact@abite.fr', 'territory': 'Martinique', 'website': 'https://abite.fr', 'category': 'Architecture & Urbanisme'},
    {'company': 'Atelier Racines', 'email': 'caroline.tourriol@atelier-racines.re', 'territory': 'La Réunion', 'website': 'https://atelier-racines.re', 'category': 'Paysage & Architecture'},
    # Énergie Solaire & Photovoltaïque Outre-mer
    {'company': 'Gwadasolaire', 'email': 'contact@gwadasolaire.fr', 'territory': 'Guadeloupe', 'website': 'https://gwadasolaire.fr', 'category': 'Énergie Solaire & Photovoltaïque'},
    {'company': 'Solar Electric Guadeloupe', 'email': 'contact@solarelectric-intl.com', 'territory': 'Guadeloupe', 'website': 'https://solarelectric-intl.com', 'category': 'Énergie Solaire & Photovoltaïque'},
    {'company': 'Tecsol Antilles-Guyane', 'email': 'contact@tecsol-antilles-guyane.fr', 'territory': 'Martinique', 'website': 'https://tecsol.fr', 'category': 'Ingénierie & Solaire'},
    {'company': 'ENR DEAL', 'email': 'contact@enrdeal.com', 'territory': 'Martinique', 'website': 'https://enrdeal.com', 'category': 'Énergie Solaire & Équipements'},
    {'company': 'Chris Solaire Solutions', 'email': 'contact@css-solaire.com', 'territory': 'Martinique', 'website': 'https://css-solaire.com', 'category': 'Énergie Solaire & Maintenance'},
    {'company': 'Solarmax Réunion', 'email': 'info@solarmax.re', 'territory': 'La Réunion', 'website': 'https://solarmax.re', 'category': 'Photovoltaïque & Autoconsommation'},
    {'company': 'Botaik Réunion', 'email': 'contact@botaik.com', 'territory': 'La Réunion', 'website': 'https://botaik.re', 'category': 'Études & Ingénierie Solaire'},
    {'company': 'Solar Service Réunion', 'email': 'contact@solarservice.fr', 'territory': 'La Réunion', 'website': 'https://solarservice.fr', 'category': 'Photovoltaïque & Solaire'},
    # Conseil & Développement Stratégique Panafricain (Abidjan & Dakar)
    {'company': 'Mind Consulting Abidjan', 'email': 'letsmeet@mind.ci', 'territory': 'Côte d\'Ivoire', 'website': 'https://mind.ci', 'category': 'Stratégie Marketing & Développement'},
    {'company': '2IC Ipsum International Consulting', 'email': 'infoline@2ic.ci', 'territory': 'Côte d\'Ivoire', 'website': 'https://2ic.ci', 'category': 'Audit & Conseil Entreprise'},
    {'company': 'Baraka Consulting Abidjan', 'email': 'info@barakaconsulting.ci', 'territory': 'Côte d\'Ivoire', 'website': 'https://barakaconsulting.ci', 'category': 'Conseil & Création d\'Entreprise'},
    {'company': 'Sand Consulting Dakar', 'email': 'contact@sandconsulting.sn', 'territory': 'Sénégal', 'website': 'https://sandconsulting.sn', 'category': 'Conseil en Stratégie & Organisation'},
    {'company': 'MCG Mbacke Consulting Group', 'email': 'contact@mcg.sn', 'territory': 'Sénégal', 'website': 'https://mcg.sn', 'category': 'Conseil en Management & Investissement'},
    {'company': 'ACE Consulting Dakar', 'email': 'contact@aceconsulting.sn', 'territory': 'Sénégal', 'website': 'https://aceconsulting.sn', 'category': 'Audit & Conseil Stratégique'}
]

def main():
    print(f"=== TEST DES CANDIDATS BATCH 75 ({len(candidates)} cibles) ===")
    validated = []
    for c in candidates:
        em = c['email'].lower().strip()
        comp = c['company']
        is_dup, reason = is_domain_or_company_duplicate(em, comp)
        if is_dup:
            print(f"[REJET DEDUP] {comp} <{em}> : {reason}")
            continue
        ok, diag = verify_email_target(em)
        if not ok:
            print(f"[REJET MX] {comp} <{em}> : {diag}")
            continue
        print(f"[VALIDE 100%] {comp} <{em}> ({c['territory']})")
        validated.append(c)

    print(f"\nTotal Validés 100% : {len(validated)} / {len(candidates)}")
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batch_75_energie_architecture_conseil.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(validated, f, ensure_ascii=False, indent=2)
    print(f"Fichier sauvegardé : {output_path}")

if __name__ == "__main__":
    main()
