import os, sys, json
from email_validator import verify_email_target

CANDIDATES = [
    # 1. Avocats d'affaires & Conseil Juridique (Antilles, Afrique, France)
    {"company": "AcSeas Avocats", "email": "contact@acseas.com", "territory": "Guadeloupe et Martinique", "axis": "C"},
    {"company": "DFM Avocat", "email": "contact@dfmavocat.fr", "territory": "Guadeloupe et Martinique", "axis": "C"},
    {"company": "Cabinet Lexindies", "email": "contact@lexindies-avocats.com", "territory": "Guadeloupe et Saint-Martin", "axis": "C"},
    {"company": "FDKA Avocats", "email": "fdka@fdka.ci", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},
    {"company": "Geni & Kebe Avocats", "email": "info@gsklaw.sn", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Mame Adama Gueye & Partners", "email": "contact@magp.sn", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Cabinet Diawara Avocats", "email": "diaws@diawara-avocats.sn", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Cabinet Anthony Fofana Associés", "email": "afa@afa.ci", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},
    {"company": "KS & Associés Avocats", "email": "ksassocies@ksassocies.com", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},
    {"company": "BK & Associés Avocats", "email": "contact@bkavocats.com", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},
    {"company": "Asafo & Co Avocats", "email": "info@asafoandco.com", "territory": "Paris et Panafricain", "axis": "C"},
    {"company": "Farthouat Avocats", "email": "contact@farthouat.com", "territory": "Paris", "axis": "C"},
    {"company": "Genesis Avocats", "email": "info@genesis-avocats.com", "territory": "Paris", "axis": "C"},

    # 2. Expertise Comptable, Audit & Gestion de Patrimoine
    {"company": "Concilium & Audit", "email": "contact@conciliumaudit.fr", "territory": "Guadeloupe (Jarry)", "axis": "C"},
    {"company": "MG Expertise", "email": "contact@mgexpertise.fr", "territory": "Martinique (Le Lamentin)", "axis": "C"},
    {"company": "CCO Expertise", "email": "contact@ccoexpertise.re", "territory": "La Réunion (Saint-Denis)", "axis": "C"},
    {"company": "CMG Audit & Conseil", "email": "contact@cmgexpert.sn", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Sprimtour Immobilier", "email": "contact@sprimtour.com", "territory": "Guadeloupe (Baie-Mahault)", "axis": "C"},
    {"company": "MPI Martinique Patrimoine", "email": "contact@agencempi.fr", "territory": "Martinique (Fort-de-France)", "axis": "C"},
    {"company": "Ecofip Partenaires", "email": "partenaires@ecofip.com", "territory": "Antilles, Guyane et Réunion", "axis": "C"},
    {"company": "AXIA Conseil Ingénierie", "email": "contact@axiaconseil.sn", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Cabinet Carrée Conseil", "email": "contact@ccarree.com", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Tiidde Consulting", "email": "contact@tiiddeconsulting.com", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Althea Consulting", "email": "contact@altheaconsulting-sn.com", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "ESPartners Conseil", "email": "info@espartners.co", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},

    # 3. Agences Digitales, Stratégie & Communication B2B
    {"company": "Alpha Agency Guadeloupe", "email": "leo.sperl@alphagency.fr", "territory": "Guadeloupe", "axis": "C"},
    {"company": "CitronMer Agence", "email": "contact@citronmer.com", "territory": "Guadeloupe (Jarry)", "axis": "C"},
    {"company": "Kaza Communication", "email": "info@kazacommunication.com", "territory": "Martinique", "axis": "C"},
    {"company": "Agence O'My! Marketing", "email": "contact@omymarketing.com", "territory": "La Réunion", "axis": "C"},
    {"company": "Akanha Agence Conseil", "email": "contact@akanha.fr", "territory": "La Réunion", "axis": "C"},
    {"company": "Nautilus Communication", "email": "contact@nautilus.fr", "territory": "La Réunion (Saint-Denis)", "axis": "C"},
    {"company": "Ranking Réunion", "email": "contact@ranking.re", "territory": "La Réunion", "axis": "C"},
    {"company": "Novacom Tahiti", "email": "contact@novacom.pf", "territory": "Polynésie française (Papeete)", "axis": "C"},
    {"company": "In-Pulsion Tahiti", "email": "contact@in-pulsion.com", "territory": "Polynésie française (Papeete)", "axis": "C"},
    {"company": "Redsoyu Tahiti", "email": "info@redsoyu.com", "territory": "Polynésie française", "axis": "C"},
    {"company": "Tahiti Communication", "email": "direction@tahiticommunication.com", "territory": "Polynésie française (Papeete)", "axis": "C"},
    {"company": "Crea Passion Tahiti", "email": "info@crea-passion.pf", "territory": "Polynésie française", "axis": "C"},
    {"company": "YanaCom Guyane", "email": "contact@yanacomguyane.fr", "territory": "Guyane (Cayenne)", "axis": "C"},
    {"company": "Nuage Com Guyane", "email": "contact@nuagecom.com", "territory": "Guyane (Cayenne)", "axis": "C"},
    {"company": "Netactions Guyane", "email": "infos@netactions.net", "territory": "Guyane", "axis": "C"},
    {"company": "Guyacom Guyane", "email": "service.client@guyacom.fr", "territory": "Guyane (Cayenne)", "axis": "C"},
    {"company": "And Vision Agency", "email": "contact@andvisionagency.com", "territory": "Sénégal (Dakar)", "axis": "C"},
    {"company": "Fox Communication", "email": "contact@fox-ci.com", "territory": "Côte d'Ivoire (Abidjan)", "axis": "C"},
    {"company": "Totem Experience Group", "email": "contact@totem-experience.com", "territory": "Paris et Panafricain", "axis": "C"},

    # 4. Marques d'Exception du Terroir, Vente Directe & DDC Pulse (Axe B)
    {"company": "Baie des Trésors Rhum", "email": "contact@baiedestresors.com", "territory": "Martinique (La Caravelle)", "axis": "B"},
    {"company": "Vanille de Tahiti", "email": "vanille@vanilledetahiti.pf", "territory": "Polynésie française", "axis": "B"},
    {"company": "Domaine Pari Pari", "email": "contact@domaineparipari.com", "territory": "Polynésie française (Taha'a)", "axis": "B"},
    {"company": "Manutea Tahiti Rotui", "email": "manutea@rotui.pf", "territory": "Polynésie française (Moorea)", "axis": "B"},
    {"company": "Coopérative Bourbon Pointu", "email": "commandes@coopbourbonpointu.re", "territory": "La Réunion", "axis": "B"},
    {"company": "Distillerie Bellevue Marie-Galante", "email": "infos@distillerie-bellevue.com", "territory": "Marie-Galante", "axis": "B"},
    {"company": "Délices de Guyane", "email": "boutiqueparis@delicesdeguyane.com", "territory": "Guyane et Paris", "axis": "B"}
]

print(f"Total candidats v2: {len(CANDIDATES)}")

with open("scripts/exclusions.json", encoding="utf-8") as f:
    excl = json.load(f)
excl_emails = set(e.lower().strip() for e in excl.get("excluded_emails", []))
excl_domains = set(d.lower().strip() for d in excl.get("excluded_domains", []))

with open("contacts_deja_contactes.json", encoding="utf-8") as f:
    db = json.load(f)
known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))

valid = []
rejected = []

for idx, c in enumerate(CANDIDATES, 1):
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

print(f"\nBilan v2: {len(valid)} valides sur {len(CANDIDATES)}")
