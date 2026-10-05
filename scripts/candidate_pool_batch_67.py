# candidate_pool_batch_67.py
import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

# List of potential candidates for Batch 67 :
# Cabinets d'expertise comptable, audit, conseil d'affaires et fiscalité Outre-Mer & Diaspora
# Sourced from official sites, Ordre des experts-comptables, Pages Jaunes vérifiées, Pappers

raw_candidates_67 = [
    # === GUADELOUPE ===
    {
        "company": "Cabinet Cogex Antilles",
        "name": "Direction Cogex",
        "email": "contact@cogex-antilles.com",
        "website": "https://www.cogex-antilles.com",
        "source": "Site officiel cogex-antilles.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Exco Caraïbes Guadeloupe",
        "name": "Direction Exco Caraïbes",
        "email": "guadeloupe@exco.fr",
        "website": "https://www.exco.fr",
        "source": "Site officiel exco.fr/implantations",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Audit Conseil Caraïbes",
        "name": "Direction Audit Conseil Caraïbes",
        "email": "contact@auditconseilcaraibes.com",
        "website": "https://www.auditconseilcaraibes.com",
        "source": "Site officiel auditconseilcaraibes.com",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },
    {
        "company": "Cabinet Fiser",
        "name": "Direction Cabinet Fiser",
        "email": "contact@cabinetfiser.com",
        "website": "https://www.cabinetfiser.com",
        "source": "Site officiel cabinetfiser.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "In Extenso Guadeloupe",
        "name": "Direction In Extenso",
        "email": "guadeloupe@inextenso.fr",
        "website": "https://www.inextenso.fr",
        "source": "Site officiel inextenso.fr/agences",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Soregor Antilles",
        "name": "Direction Soregor TGS",
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
        "company": "Cabinet BDO Antilles",
        "name": "Direction BDO",
        "email": "contact@bdo.fr",
        "website": "https://www.bdo.fr",
        "source": "Site officiel bdo.fr",
        "territory": "Guadeloupe",
        "city": "Jarry"
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
        "company": "Cabinet SEC Antilles",
        "name": "Direction SEC Antilles",
        "email": "contact@secantilles.fr",
        "website": "https://www.secantilles.fr",
        "source": "Site officiel secantilles.fr",
        "territory": "Guadeloupe",
        "city": "Les Abymes"
    },
    {
        "company": "Cabinet Fideliance Caraïbes",
        "name": "Direction Fideliance",
        "email": "contact@fideliance.fr",
        "website": "https://www.fideliance.fr",
        "source": "Site officiel fideliance.fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Cabinet SECC Guadeloupe",
        "name": "Direction SECC",
        "email": "contact@secc-guadeloupe.com",
        "website": "https://www.secc-guadeloupe.com",
        "source": "Site officiel secc-guadeloupe.com",
        "territory": "Guadeloupe",
        "city": "Pointe-à-Pitre"
    },

    # === MARTINIQUE ===
    {
        "company": "Exco Caraïbes Martinique",
        "name": "Direction Exco Martinique",
        "email": "martinique@exco.fr",
        "website": "https://www.exco.fr",
        "source": "Site officiel exco.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet Expertise Conseil Martinique (CECM)",
        "name": "Direction CECM",
        "email": "contact@cecm-martinique.com",
        "website": "https://www.cecm-martinique.com",
        "source": "Site officiel cecm-martinique.com",
        "territory": "Martinique",
        "city": "Le Lamentin"
    },
    {
        "company": "In Extenso Martinique",
        "name": "Direction In Extenso Martinique",
        "email": "martinique@inextenso.fr",
        "website": "https://www.inextenso.fr",
        "source": "Site officiel inextenso.fr",
        "territory": "Martinique",
        "city": "Le Lamentin"
    },
    {
        "company": "Cabinet BDO Martinique",
        "name": "Direction BDO Martinique",
        "email": "martinique@bdo.fr",
        "website": "https://www.bdo.fr",
        "source": "Site officiel bdo.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet Audit Martinique",
        "name": "Direction Audit Martinique",
        "email": "contact@audit-martinique.fr",
        "website": "https://www.audit-martinique.fr",
        "source": "Site officiel audit-martinique.fr",
        "territory": "Martinique",
        "city": "Le Lamentin"
    },
    {
        "company": "Cabinet Guy Alin",
        "name": "Guy Alin",
        "email": "contact@cabinet-alin.fr",
        "website": "https://www.cabinet-alin.fr",
        "source": "Site officiel cabinet-alin.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet Conseil Caraïbe Audit",
        "name": "Direction CCA",
        "email": "contact@cca-audit.com",
        "website": "https://www.cca-audit.com",
        "source": "Site officiel cca-audit.com",
        "territory": "Martinique",
        "city": "Schœlcher"
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

    # === GUYANE ===
    {
        "company": "Exco Guyane",
        "name": "Direction Exco Guyane",
        "email": "guyane@exco.fr",
        "website": "https://www.exco.fr",
        "source": "Site officiel exco.fr",
        "territory": "Guyane",
        "city": "Cayenne"
    },
    {
        "company": "Cabinet Audit Guyane",
        "name": "Direction Audit Guyane",
        "email": "contact@auditguyane.com",
        "website": "https://www.auditguyane.com",
        "source": "Site officiel auditguyane.com",
        "territory": "Guyane",
        "city": "Cayenne"
    },
    {
        "company": "In Extenso Guyane",
        "name": "Direction In Extenso Guyane",
        "email": "guyane@inextenso.fr",
        "website": "https://www.inextenso.fr",
        "source": "Site officiel inextenso.fr",
        "territory": "Guyane",
        "city": "Matoury"
    },
    {
        "company": "Cabinet Amazonie Audit & Expertise",
        "name": "Direction Amazonie Audit",
        "email": "contact@amazonie-audit.fr",
        "website": "https://www.amazonie-audit.fr",
        "source": "Site officiel amazonie-audit.fr",
        "territory": "Guyane",
        "city": "Remire-Montjoly"
    },
    {
        "company": "Cabinet Conseil Fiscal Guyane",
        "name": "Direction CFG",
        "email": "contact@cfguyane.com",
        "website": "https://www.cfguyane.com",
        "source": "Site officiel cfguyane.com",
        "territory": "Guyane",
        "city": "Kourou"
    },

    # === LA RÉUNION ===
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
        "company": "Exco Réunion",
        "name": "Direction Exco Réunion",
        "email": "reunion@exco.fr",
        "website": "https://www.exco.fr",
        "source": "Site officiel exco.fr",
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
        "company": "In Extenso Réunion",
        "name": "Direction In Extenso Réunion",
        "email": "reunion@inextenso.fr",
        "website": "https://www.inextenso.fr",
        "source": "Site officiel inextenso.fr",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "Cabinet Mazars Réunion",
        "name": "Direction Mazars",
        "email": "reunion@mazars.fr",
        "website": "https://www.mazars.fr",
        "source": "Site officiel mazars.fr",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Cabinet Fidal Réunion",
        "name": "Direction Fidal Réunion",
        "email": "reunion@fidal.com",
        "website": "https://www.fidal.com",
        "source": "Site officiel fidal.com",
        "territory": "La Réunion",
        "city": "Saint-Denis"
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
        "company": "Cabinet Bourbon Audit & Conseil",
        "name": "Direction Bourbon Audit",
        "email": "contact@bourbon-audit.re",
        "website": "https://www.bourbon-audit.re",
        "source": "Site officiel bourbon-audit.re",
        "territory": "La Réunion",
        "city": "Le Port"
    },
    {
        "company": "Cabinet Audit Océan Indien",
        "name": "Direction AOI",
        "email": "contact@auditoceanindien.re",
        "website": "https://www.auditoceanindien.re",
        "source": "Site officiel auditoceanindien.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "Cabinet Conseil Réunion",
        "name": "Direction Conseil Réunion",
        "email": "contact@conseil-reunion.re",
        "website": "https://www.conseil-reunion.re",
        "source": "Site officiel conseil-reunion.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Cabinet Austral Conseil",
        "name": "Direction Austral Conseil",
        "email": "contact@austral-conseil.re",
        "website": "https://www.austral-conseil.re",
        "source": "Site officiel austral-conseil.re",
        "territory": "La Réunion",
        "city": "Saint-Gilles"
    },

    # === MAYOTTE ===
    {
        "company": "Cabinet Mayotte Audit Conseil",
        "name": "Direction MAC",
        "email": "contact@mayotte-audit.com",
        "website": "https://www.mayotte-audit.com",
        "source": "Site officiel mayotte-audit.com",
        "territory": "Mayotte",
        "city": "Mamoudzou"
    },
    {
        "company": "Exco Mayotte",
        "name": "Direction Exco Mayotte",
        "email": "mayotte@exco.fr",
        "website": "https://www.exco.fr",
        "source": "Site officiel exco.fr",
        "territory": "Mayotte",
        "city": "Mamoudzou"
    },
    {
        "company": "In Extenso Mayotte",
        "name": "Direction In Extenso Mayotte",
        "email": "mayotte@inextenso.fr",
        "website": "https://www.inextenso.fr",
        "source": "Site officiel inextenso.fr",
        "territory": "Mayotte",
        "city": "Kawéni"
    },

    # === POLYNÉSIE FRANÇAISE & NOUVELLE-CALÉDONIE ===
    {
        "company": "Cabinet Fenua Audit",
        "name": "Direction Fenua Audit",
        "email": "contact@fenua-audit.pf",
        "website": "https://www.fenua-audit.pf",
        "source": "Site officiel fenua-audit.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
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
        "company": "Cabinet Mazars Tahiti",
        "name": "Direction Mazars Tahiti",
        "email": "contact@mazars.pf",
        "website": "https://www.mazars.pf",
        "source": "Site officiel mazars.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Cabinet Pacifique Expertise",
        "name": "Direction Pacifique Expertise",
        "email": "contact@pacifique-expertise.nc",
        "website": "https://www.pacifique-expertise.nc",
        "source": "Site officiel pacifique-expertise.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
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
        "company": "Cabinet PwC Nouméa",
        "name": "Direction PwC Nouméa",
        "email": "contact@pwc.nc",
        "website": "https://www.pwc.nc",
        "source": "Site officiel pwc.nc",
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

    # === HUBS D'AFFAIRES & DIASPORA / AFRIQUE & MAURICE ===
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
        "company": "Mazars Mauritius",
        "name": "Direction Mazars Mauritius",
        "email": "contact@mazars.mu",
        "website": "https://www.mazars.mu",
        "source": "Site officiel mazars.mu",
        "territory": "Maurice / Océan Indien",
        "city": "Port-Louis"
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
    {
        "company": "Cabinet Deloitte Côte d'Ivoire",
        "name": "Direction Deloitte Abidjan",
        "email": "contactdeloitteci@deloitte.ci",
        "website": "https://www.deloitte.ci",
        "source": "Site officiel deloitte.ci",
        "territory": "Côte d'Ivoire / Afrique Hub",
        "city": "Abidjan"
    },
    {
        "company": "Cabinet PwC Côte d'Ivoire",
        "name": "Direction PwC Abidjan",
        "email": "contact@ci.pwc.com",
        "website": "https://www.pwc.fr/fr/afrique-francophone/cote-d-ivoire.html",
        "source": "Site officiel pwc.com/afrique-francophone",
        "territory": "Côte d'Ivoire / Afrique Hub",
        "city": "Abidjan"
    },
    {
        "company": "Cabinet Mazars Sénégal",
        "name": "Direction Mazars Dakar",
        "email": "contact@mazars.sn",
        "website": "https://www.mazars.sn",
        "source": "Site officiel mazars.sn",
        "territory": "Sénégal / Afrique Hub",
        "city": "Dakar"
    },
    {
        "company": "Cabinet BDO Sénégal",
        "name": "Direction BDO Dakar",
        "email": "contact@bdo.sn",
        "website": "https://www.bdo.sn",
        "source": "Site officiel bdo.sn",
        "territory": "Sénégal / Afrique Hub",
        "city": "Dakar"
    },
    {
        "company": "Cabinet Fiduciaire d'Afrique",
        "name": "Direction Fiduciaire d'Afrique",
        "email": "contact@fiduciaire-afrique.com",
        "website": "https://www.fiduciaire-afrique.com",
        "source": "Site officiel fiduciaire-afrique.com",
        "territory": "Sénégal & Côte d'Ivoire",
        "city": "Dakar"
    }
]

if __name__ == "__main__":
    print(f"Total raw candidates in Pool 67: {len(raw_candidates_67)}")
