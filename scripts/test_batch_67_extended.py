import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

# Extended candidate list for Batch 67:
# High-end B2B services Outre-Mer: Experts-Comptables, Conseils en Gestion, Cabinets Juridiques, Fret/Logistique, Services aux Entreprises
extended_candidates = [
    # --- Previously Validated in Pool 67 (14) ---
    {
        "company": "Soregor TGS France Antilles",
        "name": "Direction TGS France",
        "email": "contact@tgs-france.fr",
        "website": "https://www.tgs-france.fr",
        "source": "Site officiel tgs-france.fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "KPMG Guadeloupe",
        "name": "Direction KPMG Antilles",
        "email": "fr-contactkpmg@kpmg.fr",
        "website": "https://kpmg.com/fr",
        "source": "Site officiel kpmg.com/fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "PwC Antilles-Guyane",
        "name": "Direction PwC Antilles",
        "email": "contact@pwc.fr",
        "website": "https://www.pwc.fr",
        "source": "Site officiel pwc.fr",
        "territory": "Guadeloupe & Martinique",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cabinet Fidag Antilles",
        "name": "Direction Fidag",
        "email": "contact@fidag.fr",
        "website": "https://www.fidag.fr",
        "source": "Site officiel fidag.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet Crowe Réunion",
        "name": "Direction Crowe Réunion",
        "email": "contact@crowe.re",
        "website": "https://www.crowe.re",
        "source": "Site officiel crowe.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Cabinet BDO Réunion",
        "name": "Direction BDO Réunion",
        "email": "contact@bdo.re",
        "website": "https://www.bdo.re",
        "source": "Site officiel bdo.re",
        "territory": "La Réunion",
        "city": "Sainte-Marie"
    },
    {
        "company": "Cabinet Baker Tilly Réunion",
        "name": "Direction Baker Tilly",
        "email": "contact@bakertilly.re",
        "website": "https://www.bakertilly.re",
        "source": "Site officiel bakertilly.re",
        "territory": "La Réunion",
        "city": "Saint-Paul"
    },
    {
        "company": "Cabinet KPMG Tahiti",
        "name": "Direction KPMG Tahiti",
        "email": "contact@kpmg.pf",
        "website": "https://kpmg.pf",
        "source": "Site officiel kpmg.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Cabinet KPMG Nouméa",
        "name": "Direction KPMG Nouméa",
        "email": "contact@kpmg.nc",
        "website": "https://kpmg.nc",
        "source": "Site officiel kpmg.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Cabinet BDO Nouméa",
        "name": "Direction BDO Nouméa",
        "email": "contact@bdo.nc",
        "website": "https://www.bdo.nc",
        "source": "Site officiel bdo.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "BDO Mauritius",
        "name": "Direction BDO Mauritius",
        "email": "bdo@bdo.mu",
        "website": "https://www.bdo.mu",
        "source": "Site officiel bdo.mu",
        "territory": "Maurice / Océan Indien",
        "city": "Port-Louis"
    },
    {
        "company": "KPMG Mauritius",
        "name": "Direction KPMG Mauritius",
        "email": "kpmg@kpmg.mu",
        "website": "https://kpmg.mu",
        "source": "Site officiel kpmg.mu",
        "territory": "Maurice / Océan Indien",
        "city": "Ebène"
    },
    {
        "company": "Baker Tilly Mauritius",
        "name": "Direction Baker Tilly Mauritius",
        "email": "info@bakertilly.mu",
        "website": "https://www.bakertilly.mu",
        "source": "Site officiel bakertilly.mu",
        "territory": "Maurice / Océan Indien",
        "city": "Port-Louis"
    },
    {
        "company": "Grant Thornton Mauritius",
        "name": "Direction Grant Thornton Mauritius",
        "email": "info@gtmu.com",
        "website": "https://www.grantthornton.mu",
        "source": "Site officiel grantthornton.mu",
        "territory": "Maurice / Océan Indien",
        "city": "Ebène"
    },

    # --- NOUVEAUX CANDIDATS EXPERTISE COMPTABLE & CONSEIL ---
    {
        "company": "Expertys Sofigec Guadeloupe",
        "name": "Direction Expertys",
        "email": "cabinet@sofigec-antilles.com",
        "website": "https://www.expertys-antilles.com",
        "source": "Site officiel expertys-antilles.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "DJ Expertise Martinique",
        "name": "Direction DJ Expertise",
        "email": "contact@djexpertise.fr",
        "website": "https://www.djexpertise.fr",
        "source": "Site officiel djexpertise.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Natexpert Martinique",
        "name": "Direction Natexpert",
        "email": "contact@natexpert.fr",
        "website": "https://www.natexpert.fr",
        "source": "Site officiel natexpert.fr",
        "territory": "Martinique",
        "city": "Le Lamentin"
    },
    {
        "company": "ACECOR Réunion",
        "name": "Direction ACECOR",
        "email": "contact@acecor.re",
        "website": "https://www.acecor.re",
        "source": "Site officiel acecor.re",
        "territory": "La Réunion",
        "city": "Sainte-Clotilde"
    },
    {
        "company": "Conseil C2L Réunion",
        "name": "Direction Conseil C2L",
        "email": "lleclerc@conseil-c2l.re",
        "website": "https://www.conseil-c2l.re",
        "source": "Site officiel conseil-c2l.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "HJL Expertise et Conseils Réunion",
        "name": "Direction HJL",
        "email": "contact@hjl-expert-comptable.re",
        "website": "https://www.hjl-expert-comptable.re",
        "source": "Site officiel hjl-expert-comptable.re",
        "territory": "La Réunion",
        "city": "Saint-Louis"
    },
    {
        "company": "Alfa Comptabilité Réunion",
        "name": "Direction Alfa Comptabilité",
        "email": "tampon@alfacomptabilite.com",
        "website": "https://www.alfacomptabilite.com",
        "source": "Site officiel alfacomptabilite.com",
        "territory": "La Réunion",
        "city": "Le Tampon"
    },
    {
        "company": "Expert Avenir Réunion",
        "name": "Direction Expert Avenir",
        "email": "expertavenir974@gmail.com",
        "website": "https://www.expert-avenir.fr",
        "source": "Site officiel expert-avenir.fr",
        "territory": "La Réunion",
        "city": "Saint-Louis"
    },
    {
        "company": "Keaexperts Guadeloupe",
        "name": "Direction Keaexperts",
        "email": "contact@keaexperts.fr",
        "website": "https://www.keaexperts.fr",
        "source": "Site officiel keaexperts.fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Antilles Experts Guadeloupe",
        "name": "Direction Antilles Experts",
        "email": "contact@antillesexperts.com",
        "website": "https://www.antillesexperts.com",
        "source": "Site officiel antillesexperts.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "CRHEA Guadeloupe",
        "name": "Direction CRHEA",
        "email": "contact@crhea-gp.fr",
        "website": "https://www.crhea-gp.fr",
        "source": "Site officiel crhea-gp.fr",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Les Experts du Sud Réunion",
        "name": "Direction Les Experts du Sud",
        "email": "momarjee@xpr2.re",
        "website": "https://www.comptable-lesexpertsdusud.re",
        "source": "Site officiel comptable-lesexpertsdusud.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "RYDGE Conseil Réunion",
        "name": "Direction RYDGE",
        "email": "contact@rydge.fr",
        "website": "https://www.rydge.fr",
        "source": "Site officiel rydge.fr",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Cabinet STH Guadeloupe",
        "name": "Direction Cabinet STH",
        "email": "contact@cabinet-sth.com",
        "website": "https://www.cabinet-sth.com",
        "source": "Site officiel cabinet-sth.com",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Initiative Martinique Active",
        "name": "Direction IMA",
        "email": "contact@ima.mq",
        "website": "https://www.ima.mq",
        "source": "Site officiel ima.mq",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Martinique Développement",
        "name": "Direction Martinique Développement",
        "email": "contact@martiniquedev.fr",
        "website": "https://www.martiniquedev.fr",
        "source": "Site officiel martiniquedev.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "MCA Comptabilité Nouméa",
        "name": "Bernard Forgues",
        "email": "bernard.forgues@mca.nc",
        "website": "https://www.mca.nc",
        "source": "Site officiel mca.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "AEC Nouméa",
        "name": "Direction AEC",
        "email": "contact@aec.nc",
        "website": "https://www.aec.nc",
        "source": "Site officiel aec.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Nautilae Expertise Nouméa",
        "name": "Direction Nautilae",
        "email": "contact@nautilae-expertise.nc",
        "website": "https://www.nautilae-expertise.nc",
        "source": "Site officiel nautilae-expertise.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Lagarde Expertise & Conseil Nouméa",
        "name": "Direction Lagarde Expertise",
        "email": "contact@lagarde.nc",
        "website": "https://www.lagarde.nc",
        "source": "Site officiel lagarde.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Fidupac Tahiti",
        "name": "Direction Fidupac",
        "email": "fidupac@mail.pf",
        "website": "https://www.fidupac.pf",
        "source": "Site officiel fidupac.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Audifi Tahiti",
        "name": "Direction Audifi",
        "email": "contact@audifi.pf",
        "website": "https://www.audifi.pf",
        "source": "Site officiel audifi.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
    },

    # --- CANDIDATS SECTEUR LOGISTIQUE, COMMERCE & SERVICES PRO OUTRE-MER & AFRIQUE ---
    {
        "company": "Long Cours Métropole",
        "name": "Direction Long Cours",
        "email": "contact@long-cours.fr",
        "website": "https://www.long-cours.com",
        "source": "Site officiel long-cours.com",
        "territory": "France / Outre-Mer",
        "city": "Montoir-de-Bretagne"
    },
    {
        "company": "Colis Outremer",
        "name": "Direction Colis Outremer",
        "email": "colis.outremer@gmail.com",
        "website": "https://www.colis-outremer.fr",
        "source": "Site officiel colis-outremer.fr",
        "territory": "France / Outre-Mer",
        "city": "Roissy"
    },
    {
        "company": "Flydomtom",
        "name": "Direction Flydomtom",
        "email": "flydomtom@gmail.com",
        "website": "https://www.flydom-tom.fr",
        "source": "Site officiel flydom-tom.fr",
        "territory": "France / DOM-TOM",
        "city": "Gonesse"
    },
    {
        "company": "Colisbridge",
        "name": "Direction Colisbridge",
        "email": "contact@colisbridge.fr",
        "website": "https://www.colisbridge.fr",
        "source": "Site officiel colisbridge.fr",
        "territory": "France / Outre-Mer",
        "city": "Rungis"
    },
    {
        "company": "Shopiles",
        "name": "Direction Shopiles",
        "email": "sav@shopiles.fr",
        "website": "https://www.shopiles.fr",
        "source": "Site officiel shopiles.fr",
        "territory": "Pantin / Outre-Mer",
        "city": "Pantin"
    },
    {
        "company": "Outre Mer Box",
        "name": "Direction Outre Mer Box",
        "email": "contact@outremerbox.com",
        "website": "https://www.outremerbox.com",
        "source": "Site officiel outremerbox.com",
        "territory": "France / Outre-Mer",
        "city": "Paris"
    },
    {
        "company": "Lucas Outre-mer",
        "name": "Direction Lucas Outre-mer",
        "email": "contact@lucas-outre-mer.fr",
        "website": "https://www.lucas-outre-mer.fr",
        "source": "Site officiel lucas-outre-mer.fr",
        "territory": "Bondy / Antilles",
        "city": "Bondy"
    },
    {
        "company": "TPRM Transports",
        "name": "Direction TPRM",
        "email": "teotprm@gmail.com",
        "website": "https://www.jarrybusiness.com",
        "source": "Annuaire Jarry Business teotprm@gmail.com",
        "territory": "Guadeloupe (Jarry)",
        "city": "Baie-Mahault"
    },
    {
        "company": "Biard Déménagements",
        "name": "Direction Biard",
        "email": "contact@biard.net",
        "website": "https://www.biard.net",
        "source": "Site officiel biard.net",
        "territory": "France / DOM-TOM",
        "city": "Paris"
    },
    {
        "company": "Madisail",
        "name": "Direction Madisail",
        "email": "contact@madisail.com",
        "website": "https://www.madisail.com",
        "source": "Site officiel madisail.com",
        "territory": "Martinique (Le Marin)",
        "city": "Le Marin"
    },
    {
        "company": "Ty Domino",
        "name": "Direction Ty Domino",
        "email": "tydomino@gmail.com",
        "website": "https://www.ty-domino.fr",
        "source": "Site officiel ty-domino.fr",
        "territory": "Martinique (Le Robert)",
        "city": "Le Robert"
    },
    {
        "company": "The Big Blue 972",
        "name": "Direction The Big Blue",
        "email": "thebigblue972@gmail.com",
        "website": "https://www.thebigblue972.fr",
        "source": "Site officiel thebigblue972.fr",
        "territory": "Martinique (Le François)",
        "city": "Le François"
    },
    {
        "company": "Au Gré du Vent",
        "name": "Direction Au Gré du Vent",
        "email": "croisiereaugreduvent@gmail.com",
        "website": "https://www.croisiereaugreduvent.com",
        "source": "Site officiel croisiereaugreduvent.com",
        "territory": "Martinique (Le François)",
        "city": "Le François"
    },
    {
        "company": "Sea The Way",
        "name": "Direction Sea The Way",
        "email": "seatheway.mq@gmail.com",
        "website": "https://www.seatheway.fr",
        "source": "Site officiel seatheway.fr",
        "territory": "Martinique (Le François)",
        "city": "Le François"
    },
    {
        "company": "Skipper Antilles Charter",
        "name": "Direction Skipper Antilles",
        "email": "skipperantillescharter@gmail.com",
        "website": "https://www.skipper-antilles.com",
        "source": "Site officiel skipper-antilles.com",
        "territory": "Martinique (Le Marin)",
        "city": "Le Marin"
    },
    {
        "company": "Sun Exil Attitud",
        "name": "Direction Sun Exil",
        "email": "sunexilattitud@gmail.com",
        "website": "https://www.seattitudexcursions.com",
        "source": "Site officiel seattitudexcursions.com",
        "territory": "Martinique (Sainte-Luce)",
        "city": "Sainte-Luce"
    },
    {
        "company": "Blue Dream Croisières",
        "name": "Direction Blue Dream",
        "email": "bluedreamcroisieres@gmail.com",
        "website": "https://www.bluedream-croisieres.com",
        "source": "Site officiel bluedream-croisieres.com",
        "territory": "Martinique (Le Marin)",
        "city": "Le Marin"
    },
    {
        "company": "Chapel Avocat",
        "name": "Maître Chapel",
        "email": "contact@chapel-avocat.fr",
        "website": "https://www.chapel-avocat.fr",
        "source": "Barreau de la Guadeloupe / chapel-avocat.fr",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Les Avocats Réunis Martinique",
        "name": "Direction Cabinet",
        "email": "contact@lesavocatsreunis.com",
        "website": "https://www.lesavocatsreunis.com",
        "source": "Barreau de la Martinique / lesavocatsreunis.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Ordre des Avocats Saint-Denis",
        "name": "Secrétariat de l'Ordre",
        "email": "contact@odasd.re",
        "website": "https://www.barreau-saint-denis.re",
        "source": "Site officiel barreau-saint-denis.re",
        "territory": "La Réunion",
        "city": "Sainte-Clotilde"
    }
]

print(f"Testing {len(extended_candidates)} candidates...")
validated = []
seen = set()

for c in extended_candidates:
    em = c["email"].lower().strip()
    co = c["company"].strip()
    if em in seen:
        continue
    is_dup, reason = is_domain_or_company_duplicate(em, co, db_file="contacts_deja_contactes.json")
    if is_dup:
        print(f"[-] Dup/Excluded: {em} ({reason})")
        continue
    is_v, msg = verify_email_target(em)
    if not is_v:
        print(f"[-] DNS/MX fail: {em} -> {msg}")
        continue
    seen.add(em)
    validated.append(c)
    print(f"[+] VALIDATED: {co} <{em}> ({c.get('territory')})")

print(f"\nTOTAL VALIDATED: {len(validated)}")
with open("scripts/validated_candidates_batch_67.json", "w", encoding="utf-8") as f:
    json.dump(validated, f, indent=2, ensure_ascii=False)
