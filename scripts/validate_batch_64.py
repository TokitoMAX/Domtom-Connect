import os, sys, json
from email_validator import verify_email_target

LEADS_64 = [
    # 1. Gestion de Patrimoine, Ingénierie Financière & Défiscalisation (Antilles, Guyane, Réunion)
    {"company": "SAMO 1er Patrimoine", "email": "samo@samo1er.fr", "territory": "Guadeloupe (Jarry)", "axis": "C"},
    {"company": "Patrimoine Immobilier", "email": "jlm@patrimoine971.com", "territory": "Guadeloupe (Jarry)", "axis": "C"},
    {"company": "Antilles Épargne Conseil", "email": "contact@antillesepargneconseil.fr", "territory": "Martinique (Fort-de-France)", "axis": "C"},
    {"company": "Patrimoine Prestige Antilles", "email": "info@pp-antilles.com", "territory": "Martinique (Le Lamentin)", "axis": "C"},
    {"company": "Boussole Patrimoine", "email": "contact@boussolepatrimoine.fr", "territory": "La Réunion (Saint-Denis)", "axis": "C"},
    {"company": "Beauvoisine Patrimoine", "email": "contact@beauvoisine.fr", "territory": "La Réunion (Saint-Pierre)", "axis": "C"},
    {"company": "Général Assurances & Patrimoine", "email": "gestion@general-patrimoine.re", "territory": "La Réunion (Saint-Denis)", "axis": "C"},
    {"company": "Valexis Conseil", "email": "contact@valexis.fr", "territory": "La Réunion (Saint-Pierre)", "axis": "C"},
    {"company": "C2A Expertise Comptable", "email": "contact@c2a.re", "territory": "La Réunion (Saint-Denis)", "axis": "C"},
    {"company": "SOFIGEC Expertys", "email": "cabinet@sofigec-antilles.com", "territory": "Guadeloupe (Jarry)", "axis": "C"},
    {"company": "ADC Guyane Expertise", "email": "contact@adcguyane.com", "territory": "Guyane (Cayenne)", "axis": "C"},
    {"company": "Audit Conseil Partners", "email": "jitalique@auditconseilpartners.fr", "territory": "Guyane (Cayenne)", "axis": "C"},
    {"company": "Accentys Conseil Guyane", "email": "lb@accentys.fr", "territory": "Guyane (Cayenne)", "axis": "C"},
    {"company": "Audit et Expertise Guyane", "email": "r.dabriou@drauditexpert.fr", "territory": "Guyane et Guadeloupe", "axis": "C"},
    {"company": "Fly Audit Fiduciaire Guyane", "email": "l.yvon@flyaudit.fr", "territory": "Guyane", "axis": "C"},

    # 2. Domaines Hôteliers d'Affaires, Écolodges & Conciergeries de Luxe (Axe C - Tourisme d'Affaires)
    {"company": "Domaine des Fonds Blancs", "email": "els@scicgroup.com", "territory": "Martinique (Le François)", "axis": "C"},
    {"company": "La Toubana Hôtel & Spa", "email": "conciergerie@toubana.com", "territory": "Guadeloupe (Sainte-Anne)", "axis": "C"},
    {"company": "Palm Hôtel & Spa", "email": "akea@palm.re", "territory": "La Réunion (Grande Anse)", "axis": "C"},
    {"company": "Hôtel Boucan Canot", "email": "hotel@boucancanot.com", "territory": "La Réunion (Saint-Gilles)", "axis": "C"},
    {"company": "Hôtel Christopher St Barth", "email": "guestrelations@hotelchristopher.com", "territory": "Saint-Barthélemy", "axis": "C"},
    {"company": "Hôtel Manapany St Barth", "email": "reservation@hotelmanapany.com", "territory": "Saint-Barthélemy", "axis": "C"},
    {"company": "Sibarth Bespoke Villas", "email": "villas@sibarth.com", "territory": "Saint-Barthélemy", "axis": "C"},
    {"company": "Prestige Villa Rental", "email": "info@prestigevillarental.com", "territory": "Saint-Barthélemy", "axis": "C"},
    {"company": "Premium Island Vacations", "email": "villas@premiumislandvacations.com", "territory": "Saint-Barthélemy", "axis": "C"},
    {"company": "Your Concierge SXM", "email": "info@luxuryconciergeinsxm.com", "territory": "Saint-Martin", "axis": "C"},
    {"company": "Hôtel Les Tipaniers Moorea", "email": "tipaniersresa@mail.pf", "territory": "Polynésie française (Moorea)", "axis": "C"},

    # 3. Fonds d'Investissement PME & Capital Panafricain (Axe C - Finance & Croissance)
    {"company": "Cauris Management", "email": "cauris@caurismanagement.com", "territory": "Panafricain (Lomé et Abidjan)", "axis": "C"},
    {"company": "Comoé Capital", "email": "infos@comoecapital.com", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},

    # 4. Grands Cabinets d'Avocats d'Affaires & Conseil International (Axe C - Réseau B2B)
    {"company": "Cabinet Bersay Avocats", "email": "contact@bersay.com", "territory": "Paris", "axis": "C"},
    {"company": "De Pardieu Brocas Maffei", "email": "info@de-pardieu.com", "territory": "Paris", "axis": "C"},
    {"company": "Simon Associés Avocats", "email": "contact@simonassocies.com", "territory": "Paris", "axis": "C"},
    {"company": "Ginestié Magellan Paley-Vincent", "email": "contact@ginestie.com", "territory": "Paris", "axis": "C"},
    {"company": "Vivien & Associés Avocats", "email": "contact@va-fr.com", "territory": "Paris", "axis": "C"},
    {"company": "Hoche Avocats", "email": "hoche@hocheavocats.com", "territory": "Paris", "axis": "C"},
    {"company": "Cabinet Klein Wenner", "email": "contact@kleinwenner.eu", "territory": "Paris", "axis": "C"},
    {"company": "Cabinet Veil Jourde", "email": "contact@veil.fr", "territory": "Paris", "axis": "C"},
    {"company": "BDGS Associés Avocats", "email": "contact@bdgs-associes.com", "territory": "Paris", "axis": "C"},
    {"company": "Racine Avocats", "email": "contact@racine.eu", "territory": "Paris", "axis": "C"},
    {"company": "Bredin Prat Avocats", "email": "info@bredinprat.com", "territory": "Paris", "axis": "C"},
    {"company": "Lamartine Conseil", "email": "contact@lamartine-avocats.com", "territory": "Paris", "axis": "C"},
    {"company": "Ayache Law", "email": "contact@ayacheavocats.com", "territory": "Paris", "axis": "C"},
    {"company": "DELSOL Avocats", "email": "contact@delsolavocats.com", "territory": "Paris", "axis": "C"},
    {"company": "Herald Avocats", "email": "contact@herald-avocats.com", "territory": "Paris", "axis": "C"},
    {"company": "Alerion Avocats", "email": "paris@alerionavocats.com", "territory": "Paris", "axis": "C"},
    {"company": "Kalliopé Avocats", "email": "contact@kalliope-law.com", "territory": "Paris", "axis": "C"},
    {"company": "Villechenon Avocats", "email": "contact@villechenon.com", "territory": "Paris", "axis": "C"},
    {"company": "Astura Avocats", "email": "contact@astura.fr", "territory": "Paris", "axis": "C"},
    {"company": "HFW Paris Avocats", "email": "hfwenquiries@hfw.com", "territory": "Paris", "axis": "C"},

    # 5. Pépites d'Excellence & Terroir Mondial (Axe B - Vente Directe & DDC Pulse)
    {"company": "Parfumerie Tiki Tahiti", "email": "contact@monoitiki.pf", "territory": "Polynésie française (Papeete)", "axis": "B"},
    {"company": "Délices de Guyane Paris", "email": "boutiqueparis@delicesdeguyane.com", "territory": "Guyane et Paris", "axis": "B"}
]

print(f"Total leads 64 à tester: {len(LEADS_64)}")

with open("scripts/exclusions.json", encoding="utf-8") as f:
    excl = json.load(f)
excl_emails = set(e.lower().strip() for e in excl.get("excluded_emails", []))
excl_domains = set(d.lower().strip() for d in excl.get("excluded_domains", []))

with open("contacts_deja_contactes.json", encoding="utf-8") as f:
    db = json.load(f)
known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))

valid = []
rejected = []

for idx, c in enumerate(LEADS_64, 1):
    e = c["email"].lower().strip()
    dom = e.split("@")[1]
    
    if e in known_emails:
        rejected.append((c, "Doublon contacts_deja_contactes"))
        print(f"[{idx:02d}] DOUBLON: {e}")
        continue
    if e in excl_emails or dom in excl_domains:
        rejected.append((c, "Exclusion blacklist"))
        print(f"[{idx:02d}] EXCLU: {e}")
        continue
        
    ok, msg = verify_email_target(e)
    if ok:
        valid.append(c)
        print(f"[{idx:02d}] VALIDE: {c['company']} ({e})")
    else:
        rejected.append((c, msg))
        print(f"[{idx:02d}] INVALIDE DNS/MX: {e} -> {msg}")

print(f"\nBilan Batch 64 Final: {len(valid)} valides sur {len(LEADS_64)}")
