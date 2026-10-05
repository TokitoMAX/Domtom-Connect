import os, sys, json, socket, subprocess
from email_validator import verify_email_target

LEADS = [
    {"company": "AcSeas Avocats", "email": "contact@acseas.com"},
    {"company": "AJM Avocats", "email": "contact@ajmavocats.com"},
    {"company": "DFM Avocat", "email": "contact@dfmavocat.fr"},
    {"company": "Cabinet Lexindies", "email": "contact@lexindies-avocats.com"},
    {"company": "FDKA Avocats", "email": "fdka@fdka.ci"},
    {"company": "Geni & Kebe Avocats", "email": "info@gsklaw.sn"},
    {"company": "Concilium & Audit", "email": "contact@conciliumaudit.fr"},
    {"company": "MG Expertise", "email": "contact@mgexpertise.fr"},
    {"company": "CCO Expertise", "email": "contact@ccoexpertise.re"},
    {"company": "Sprimtour Immobilier", "email": "contact@sprimtour.com"},
    {"company": "MPI Martinique Patrimoine Immobilier", "email": "contact@agencempi.fr"},
    {"company": "Ecofip Partenaires", "email": "partenaires@ecofip.com"},
    {"company": "MJ Metrix Digital", "email": "direction@mjmetrix.com"},
    {"company": "Alpha Agency Guadeloupe", "email": "leo.sperl@alphagency.fr"},
    {"company": "Kaza Communication", "email": "info@kazacommunication.com"},
    {"company": "Nasdy Digital", "email": "contact@nasdy.com"},
    {"company": "Yello Réunion", "email": "hello@yello.re"},
    {"company": "Run The Com", "email": "antoine@runthecom.re"},
    {"company": "Agence O'My!", "email": "contact@omymarketing.com"},
    {"company": "Zoorit Réunion", "email": "info@zoorit.com"},
    {"company": "Akanha Réunion", "email": "contact@akanha.fr"},
    {"company": "Brand & Consultant", "email": "contact@brandetconsultant.com"},
    {"company": "Ranking Réunion", "email": "contact@ranking.re"},
    {"company": "Novacom Tahiti", "email": "contact@novacom.pf"},
    {"company": "In-Pulsion Tahiti", "email": "contact@in-pulsion.com"},
    {"company": "Redsoyu Tahiti", "email": "info@redsoyu.com"},
    {"company": "Tahiti Communication", "email": "direction@tahiticommunication.com"},
    {"company": "Crea Passion Tahiti", "email": "info@crea-passion.pf"},
    {"company": "YanaCom Guyane", "email": "contact@yanacomguyane.fr"},
    {"company": "Nuage Com Guyane", "email": "contact@nuagecom.com"},
    {"company": "Agence Web Guyane", "email": "contact@agencewebguyane.fr"},
    {"company": "Netactions Guyane", "email": "infos@netactions.net"},
    {"company": "And Vision Agency Dakar", "email": "contact@andvisionagency.com"},
    {"company": "Fox Communication Abidjan", "email": "contact@fox-ci.com"},
    {"company": "Rhum A 1710", "email": "contact@a1710.fr"},
    {"company": "Distillerie Bielle", "email": "info@rhumbielle.com"},
    {"company": "Distillerie La Favorite", "email": "contact@lafavorite.com"},
    {"company": "Rhum Papa Rouyo", "email": "hello@paparouyo.com"},
    {"company": "Habitation Saint-Étienne Rhum HSE", "email": "contact@rhumhse.com"},
    {"company": "Baie des Trésors Rhum", "email": "contact@baiedestresors.com"},
    {"company": "Parfums des Îles", "email": "contact@parfums-des-iles.com"},
    {"company": "Escale Bleue Vanille Bleue", "email": "contact@escale-bleue.fr"},
    {"company": "Vanille de Tahiti", "email": "vanille@vanilledetahiti.pf"},
    {"company": "Domaine Pari Pari", "email": "contact@domaineparipari.com"},
    {"company": "Manutea Tahiti Rotui", "email": "manutea@rotui.pf"},
    {"company": "Coopérative Bourbon Pointu", "email": "commandes@coopbourbonpointu.re"},
    {"company": "Distillerie Bellevue Marie-Galante", "email": "infos@distillerie-bellevue.com"},
    {"company": "Délices de Guyane", "email": "boutiqueparis@delicesdeguyane.com"},
    {"company": "Délices M'Amour Lesueur", "email": "guylesueur@guylesueur.com"},
    {"company": "Distillerie Père Labat", "email": "contact@rhumduperelabat.com"}
]

print(f"Total leads à tester: {len(LEADS)}")

# Load exclusions & known contacts
with open("scripts/exclusions.json", encoding="utf-8") as f:
    excl = json.load(f)
excl_emails = set(e.lower().strip() for e in excl.get("excluded_emails", []))
excl_domains = set(d.lower().strip() for d in excl.get("excluded_domains", []))

with open("contacts_deja_contactes.json", encoding="utf-8") as f:
    db = json.load(f)
known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))

valid = []
invalid = []

for idx, lead in enumerate(LEADS, 1):
    e = lead["email"].lower().strip()
    dom = e.split("@")[1]
    
    if e in known_emails:
        print(f"[{idx:02d}] DOUBLON BASE: {e}")
        invalid.append((lead, "Doublon base contacts"))
        continue
    if e in excl_emails or dom in excl_domains:
        print(f"[{idx:02d}] EXCLUSION: {e} / {dom}")
        invalid.append((lead, "Exclusion blacklist"))
        continue
        
    ok, msg = verify_email_target(e)
    if ok:
        print(f"[{idx:02d}] VALIDE: {lead['company']} ({e})")
        valid.append(lead)
    else:
        print(f"[{idx:02d}] INVALIDE DNS/MX: {lead['company']} ({e}) -> {msg}")
        invalid.append((lead, msg))

print(f"\nRésultat: {len(valid)} valides, {len(invalid)} rejetés.")
