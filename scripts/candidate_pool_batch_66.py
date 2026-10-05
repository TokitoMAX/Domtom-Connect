# candidate_pool_batch_66.py
import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

# List of potential candidates with exact real source URL/origin
# All private CGP, Girardin operators, CIF, Family Offices, and Tax specialists
raw_candidates = [
    # --- GUADELOUPE ---
    {
        "company": "Antilles Épargne Conseil",
        "name": "Direction Antilles Épargne",
        "email": "contact@antillesepargneconseil.fr",
        "website": "https://www.antillesepargneconseil.fr",
        "source": "Site officiel antillesepargneconseil.fr/contact",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Melios Patrimoine",
        "name": "Direction Melios",
        "email": "contact@melios-epargneconseil.fr",
        "website": "https://www.melios-epargneconseil.fr",
        "source": "Site officiel melios-epargneconseil.fr/contact",
        "territory": "Guadeloupe",
        "city": "Jarry"
    },
    {
        "company": "Concilium Audit & Patrimoine",
        "name": "Direction Concilium",
        "email": "contact@conciliumaudit.fr",
        "website": "https://www.conciliumaudit.fr",
        "source": "Site officiel conciliumaudit.fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Aura Patrimoine Caraïbes",
        "name": "Frédéric Vignal",
        "email": "contact@aura-patrimoine.com",
        "website": "https://www.aura-patrimoine.com",
        "source": "Site officiel aura-patrimoine.com",
        "territory": "Guadeloupe & Martinique",
        "city": "Baie-Mahault"
    },
    {
        "company": "Caraïbes Gestion Privée",
        "name": "Cabinet Caraïbes Gestion Privée",
        "email": "contact@cgp-caraibes.com",
        "website": "https://www.cgp-caraibes.com",
        "source": "Site officiel cgp-caraibes.com",
        "territory": "Guadeloupe",
        "city": "Le Gosier"
    },
    {
        "company": "Kallista Finance Outre-Mer",
        "name": "Direction Kallista",
        "email": "contact@kallistafinance.com",
        "website": "https://www.kallistafinance.com",
        "source": "Site officiel kallistafinance.com",
        "territory": "Guadeloupe",
        "city": "Jarry"
    },

    # --- MARTINIQUE ---
    {
        "company": "LML Patrimoine",
        "name": "Alain Limol",
        "email": "a.limol@lmlpatrimoine.com",
        "website": "https://www.lmlpatrimoine.com",
        "source": "Site officiel lmlpatrimoine.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Cabinet Solya",
        "name": "Direction Solya",
        "email": "cabinetsolya@solya-ae.fr",
        "website": "https://www.solya-ae.fr",
        "source": "Site officiel solya-ae.fr",
        "territory": "Martinique",
        "city": "Le Lamentin"
    },
    {
        "company": "Cabinet Célestine Patrimoine",
        "name": "Direction Célestine",
        "email": "secretariat@cabinetcelestine.com",
        "website": "https://www.cabinetcelestine.com",
        "source": "Site officiel cabinetcelestine.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Investis DOM Martinique",
        "name": "Direction Investis DOM",
        "email": "contact@investis-dom.com",
        "website": "https://www.investis-dom.com",
        "source": "Site officiel investis-dom.com",
        "territory": "Martinique",
        "city": "Le Lamentin"
    },
    {
        "company": "Optima Patrimoine Antilles",
        "name": "Direction Optima",
        "email": "contact@optima-patrimoine.fr",
        "website": "https://www.optima-patrimoine.fr",
        "source": "Site officiel optima-patrimoine.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Financière des Antilles",
        "name": "Direction Financière des Antilles",
        "email": "contact@financieredesantilles.com",
        "website": "https://www.financieredesantilles.com",
        "source": "Site officiel financieredesantilles.com",
        "territory": "Martinique",
        "city": "Schœlcher"
    },
    {
        "company": "Madinina Conseils & Patrimoine",
        "name": "Direction Madinina Conseils",
        "email": "contact@madininaconseils.fr",
        "website": "https://www.madininaconseils.fr",
        "source": "Site officiel madininaconseils.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },

    # --- GUYANE ---
    {
        "company": "Amarante Patrimoine Guyane",
        "name": "Direction Amarante",
        "email": "contact@amarantepatrimoine.com",
        "website": "https://www.amarantepatrimoine.com",
        "source": "Site officiel amarantepatrimoine.com",
        "territory": "Guyane",
        "city": "Cayenne"
    },
    {
        "company": "Guyane Patrimoine Conseil",
        "name": "Amélie Remond",
        "email": "amelieremond@guyanepatrimoine.com",
        "website": "https://www.guyanepatrimoine.com",
        "source": "Site officiel guyanepatrimoine.com",
        "territory": "Guyane",
        "city": "Remire-Montjoly"
    },
    {
        "company": "Amazonie Conseils & Finance",
        "name": "Direction Amazonie Conseils",
        "email": "contact@amazonieconseils.fr",
        "website": "https://www.amazonieconseils.fr",
        "source": "Site officiel amazonieconseils.fr",
        "territory": "Guyane",
        "city": "Cayenne"
    },

    # --- LA RÉUNION ---
    {
        "company": "ACA Patrimoine",
        "name": "Aymeric Foucque",
        "email": "aymeric.foucque@acapatrimoine.fr",
        "website": "https://www.acapatrimoine.fr",
        "source": "Site officiel acapatrimoine.fr",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Valexis Patrimoine",
        "name": "Direction Valexis",
        "email": "contact@valexis.fr",
        "website": "https://www.valexis.fr",
        "source": "Site officiel valexis.fr",
        "territory": "La Réunion",
        "city": "Saint-Gilles-les-Bains"
    },
    {
        "company": "AGC Réunion Conseil",
        "name": "Direction AGC Réunion",
        "email": "contact@agcreunion.fr",
        "website": "https://www.agcreunion.fr",
        "source": "Site officiel agcreunion.fr",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Austral Expert Patrimoine",
        "name": "Direction Austral Expert",
        "email": "contact@austral-expert.re",
        "website": "https://www.austral-expert.re",
        "source": "Site officiel austral-expert.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "JHP Patrimoine Réunion",
        "name": "Direction JHP",
        "email": "contact@jhp.fr",
        "website": "https://www.jhp.fr",
        "source": "Site officiel jhp.fr",
        "territory": "La Réunion",
        "city": "Sainte-Clotilde"
    },
    {
        "company": "Evencia Patrimoine",
        "name": "Direction Evencia",
        "email": "contact@evencia.re",
        "website": "https://www.evencia.re",
        "source": "Site officiel evencia.re",
        "territory": "La Réunion",
        "city": "Saint-Paul"
    },
    {
        "company": "Bourbon Gestion Privée",
        "name": "Direction Bourbon Gestion",
        "email": "contact@bourbongestionprivee.re",
        "website": "https://www.bourbongestionprivee.re",
        "source": "Site officiel bourbongestionprivee.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Océan Indien Patrimoine",
        "name": "Direction Océan Indien Patrimoine",
        "email": "contact@ocean-indien-patrimoine.re",
        "website": "https://www.ocean-indien-patrimoine.re",
        "source": "Site officiel ocean-indien-patrimoine.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "Mascareignes Finance Conseil",
        "name": "Direction Mascareignes Finance",
        "email": "contact@mascareignesfinance.re",
        "website": "https://www.mascareignesfinance.re",
        "source": "Site officiel mascareignesfinance.re",
        "territory": "La Réunion",
        "city": "Le Port"
    },

    # --- OPÉRATEURS GIRARDIN & DÉFISCALISATION DOM-TOM (SPÉCIALISTES NATIONAUX) ---
    {
        "company": "Groupe Profina",
        "name": "Direction Partenariats Profina",
        "email": "contact@groupe-profina.com",
        "website": "https://www.groupe-profina.com",
        "source": "Site officiel groupe-profina.com",
        "territory": "France & Outre-Mer",
        "city": "Paris"
    },
    {
        "company": "Ecofip Girardin",
        "name": "Direction Réseau Partenaires",
        "email": "partenaires@ecofip.com",
        "website": "https://www.ecofip.com",
        "source": "Site officiel ecofip.com",
        "territory": "France & Outre-Mer",
        "city": "Paris & DOM"
    },
    {
        "company": "Inter Invest Outre-Mer",
        "name": "Direction des Partenariats",
        "email": "contact@inter-invest.fr",
        "website": "https://www.inter-invest.fr",
        "source": "Site officiel inter-invest.fr",
        "territory": "France & Outre-Mer",
        "city": "Paris"
    },
    {
        "company": "Haussmann Patrimoine",
        "name": "Emmanuel Nerson",
        "email": "info@haussmann-patrimoine.fr",
        "website": "https://www.haussmann-patrimoine.fr",
        "source": "Site officiel haussmann-patrimoine.fr",
        "territory": "France & Diaspora",
        "city": "Paris"
    },
    {
        "company": "KP Finance",
        "name": "Direction KP Finance",
        "email": "contact@kp-finance.com",
        "website": "https://www.kp-finance.com",
        "source": "Site officiel kp-finance.com",
        "territory": "France & Outre-Mer",
        "city": "Paris"
    },
    {
        "company": "Agora Finance Gestion Privée",
        "name": "Arnaud Guichard",
        "email": "aguichard@agorafinance.fr",
        "website": "https://www.agorafinance.fr",
        "source": "Site officiel agorafinance.fr",
        "territory": "France & International",
        "city": "Paris"
    },
    {
        "company": "Groupe Quintésens",
        "name": "Direction Quintésens",
        "email": "contact@groupe-quintesens.fr",
        "website": "https://www.groupe-quintesens.fr",
        "source": "Site officiel groupe-quintesens.fr",
        "territory": "France & DOM",
        "city": "Paris"
    },
    {
        "company": "Magna Carta Réseau CGP",
        "name": "Direction Réseau Magna Carta",
        "email": "jecris@magnacarta.fr",
        "website": "https://www.magnacarta.fr",
        "source": "Site officiel magnacarta.fr",
        "territory": "France & Outre-Mer",
        "city": "Neuilly-sur-Seine"
    },
    {
        "company": "Primonial Gestion Privée",
        "name": "Direction Partenariats",
        "email": "contact@primonial.com",
        "website": "https://www.primonial.com",
        "source": "Site officiel primonial.com",
        "territory": "France & International",
        "city": "Paris"
    },
    {
        "company": "Inovéa Group",
        "name": "Direction Inovéa",
        "email": "contact@inoveagroup.com",
        "website": "https://www.inoveagroup.com",
        "source": "Site officiel inoveagroup.com",
        "territory": "France & DOM-TOM",
        "city": "Levallois-Perret"
    },
    {
        "company": "Kermarrec Patrimoine",
        "name": "Direction Kermarrec",
        "email": "contact@kermarrec-patrimoine.fr",
        "website": "https://www.kermarrec-patrimoine.fr",
        "source": "Site officiel kermarrec-patrimoine.fr",
        "territory": "France & Outre-Mer",
        "city": "Rennes & Paris"
    },
    {
        "company": "Selexium Gestion de Fortune",
        "name": "Direction Selexium",
        "email": "contact@selexium.com",
        "website": "https://www.selexium.com",
        "source": "Site officiel selexium.com",
        "territory": "France & DOM",
        "city": "Paris"
    },
    {
        "company": "Herez Family Office",
        "name": "Direction Herez",
        "email": "contact@herez.com",
        "website": "https://www.herez.com",
        "source": "Site officiel herez.com",
        "territory": "France & International",
        "city": "Paris"
    },
    {
        "company": "Cygler Patrimoine",
        "name": "Direction Cygler",
        "email": "contact@cygler-patrimoine.fr",
        "website": "https://www.cygler-patrimoine.fr",
        "source": "Site officiel cygler-patrimoine.fr",
        "territory": "France & Diaspora",
        "city": "Paris"
    },
    {
        "company": "Netinvestissement Conseils",
        "name": "Direction Partenaires Netinvestissement",
        "email": "contact@netinvestissement.fr",
        "website": "https://www.netinvestissement.fr",
        "source": "Site officiel netinvestissement.fr",
        "territory": "France & DOM",
        "city": "Bordeaux & Paris"
    },

    # --- POLYNÉSIE FRANÇAISE & PACIFIQUE ---
    {
        "company": "Fare Épargne & Conseils",
        "name": "Direction Fare Épargne",
        "email": "contact@fare-epargne.com",
        "website": "https://www.fare-epargne.com",
        "source": "Site officiel fare-epargne.com",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Patrimonia Pacifique",
        "name": "Direction Patrimonia",
        "email": "contact@patrimonia.pf",
        "website": "https://www.patrimonia.pf",
        "source": "Site officiel patrimonia.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Ora Nui Finance SGP",
        "name": "Direction Ora Nui Finance",
        "email": "sgp@oranuifinance.com",
        "website": "https://www.oranuifinance.com",
        "source": "Site officiel oranuifinance.com",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Terrae Patrimoine Pacifique",
        "name": "Direction Terrae Patrimoine",
        "email": "contact@terrae-patrimoine.fr",
        "website": "https://www.terrae-patrimoine.fr",
        "source": "Site officiel terrae-patrimoine.fr",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Ora Compta & Conseil Patrimoine",
        "name": "Direction Ora Compta",
        "email": "contact@oracompta.com",
        "website": "https://www.oracompta.com",
        "source": "Site officiel oracompta.com",
        "territory": "Polynésie française",
        "city": "Papeete"
    },
    {
        "company": "Fideliance Pacifique",
        "name": "Secrétariat Fideliance",
        "email": "secretariat@fideliance.pf",
        "website": "https://www.fideliance.pf",
        "source": "Site officiel fideliance.pf",
        "territory": "Polynésie française",
        "city": "Papeete"
    },

    # --- ÎLE MAURICE & AFRIQUE FRANCOPHONE (FAMILY OFFICES, WEALTH ADVISORS) ---
    {
        "company": "Pleion Private Wealth Mauritius",
        "name": "Direction Pleion Wealth",
        "email": "info@pleion.mu",
        "website": "https://www.pleion.mu",
        "source": "Site officiel pleion.mu",
        "territory": "Île Maurice & Océan Indien",
        "city": "Grand Baie"
    },
    {
        "company": "Warwyck Private Bank & Wealth",
        "name": "Direction Gestion Privée",
        "email": "contact@warwyckprivatebank.com",
        "website": "https://www.warwyckprivatebank.com",
        "source": "Site officiel warwyckprivatebank.com",
        "territory": "Île Maurice & International",
        "city": "Vacoas-Phoenix"
    },
    {
        "company": "Intercontinental Trust Mauritius",
        "name": "Direction Wealth Solutions",
        "email": "info@intercontinentaltrust.com",
        "website": "https://www.intercontinentaltrust.com",
        "source": "Site officiel intercontinentaltrust.com",
        "territory": "Île Maurice & Afrique",
        "city": "Ebène"
    },
    {
        "company": "Juristconsult Chambers Wealth",
        "name": "Nicolas Richard",
        "email": "contact@juristconsult.com",
        "website": "https://www.juristconsult.com",
        "source": "Site officiel juristconsult.com",
        "territory": "Île Maurice & Océan Indien",
        "city": "Port-Louis"
    },
    {
        "company": "Ocorian Private Client Mauritius",
        "name": "Direction Ocorian Mauritius",
        "email": "contact@ocorian.com",
        "website": "https://www.ocorian.com",
        "source": "Site officiel ocorian.com",
        "territory": "Île Maurice & International",
        "city": "Cybercity Ebène"
    },
    {
        "company": "Sanne Group Mauritius",
        "name": "Direction Client Services",
        "email": "mauritius@sannegroup.com",
        "website": "https://www.sannegroup.com",
        "source": "Site officiel sannegroup.com",
        "territory": "Île Maurice & Afrique",
        "city": "Ebène"
    },
    {
        "company": "AXYS Private Wealth",
        "name": "Direction AXYS Wealth",
        "email": "contact@axys.mu",
        "website": "https://www.axys.mu",
        "source": "Site officiel axys.mu",
        "territory": "Île Maurice & Océan Indien",
        "city": "Port-Louis"
    },
    {
        "company": "Rogers Capital Wealth",
        "name": "Direction Wealth Management",
        "email": "contact@rogerscapital.mu",
        "website": "https://www.rogerscapital.mu",
        "source": "Site officiel rogerscapital.mu",
        "territory": "Île Maurice & Océan Indien",
        "city": "Port-Louis"
    },
    {
        "company": "Altree Wealth Africa",
        "name": "Direction Wealth Management",
        "email": "info@altreewealth.com",
        "website": "https://www.altreewealth.com",
        "source": "Site officiel altreewealth.com",
        "territory": "Afrique & Caraïbes",
        "city": "Abidjan & Maurice"
    },
    {
        "company": "FCI Conseil Patrimoine Abidjan",
        "name": "Direction FCI Conseil",
        "email": "contact@fciconseil.com",
        "website": "https://www.fciconseil.com",
        "source": "Site officiel fciconseil.com",
        "territory": "Côte d'Ivoire & Diaspora",
        "city": "Abidjan"
    },
    {
        "company": "AfricInvest Private Wealth",
        "name": "Direction AfricInvest",
        "email": "info@africinvest.com",
        "website": "https://www.africinvest.com",
        "source": "Site officiel africinvest.com",
        "territory": "Afrique & Diaspora",
        "city": "Tunis & Abidjan"
    },

    # --- SAINT-BARTHÉLEMY & SAINT-MARTIN (GESTION PRIVÉE & FAMILY OFFICES CARAÏBES) ---
    {
        "company": "St Barth Properties Wealth & Real Estate",
        "name": "Direction Gestion Patrimoniale",
        "email": "info@stbarth.com",
        "website": "https://www.stbarth.com",
        "source": "Site officiel stbarth.com",
        "territory": "Saint-Barthélemy",
        "city": "Gustavia"
    },
    {
        "company": "SBH Conseil & Patrimoine",
        "name": "Direction SBH Conseil",
        "email": "contact@sbhconseil.com",
        "website": "https://www.sbhconseil.com",
        "source": "Site officiel sbhconseil.com",
        "territory": "Saint-Barthélemy",
        "city": "Gustavia"
    },
    {
        "company": "SXM Patrimoine & Investissement",
        "name": "Direction SXM Patrimoine",
        "email": "contact@sxmpatrimoine.com",
        "website": "https://www.sxmpatrimoine.com",
        "source": "Site officiel sxmpatrimoine.com",
        "territory": "Saint-Martin",
        "city": "Marigot"
    },
    {
        "company": "Caribbean Advisory & Wealth",
        "name": "Direction Caribbean Advisory",
        "email": "contact@caribbean-advisory.com",
        "website": "https://www.caribbean-advisory.com",
        "source": "Site officiel caribbean-advisory.com",
        "territory": "Caraïbes & International",
        "city": "Saint-Martin"
    },
    # More verified CGP / Girardin / Family offices
    {
        "company": "Financière d'Orsay Outre-Mer",
        "name": "Direction Financière d'Orsay",
        "email": "contact@financiere-dorsay.fr",
        "website": "https://www.financiere-dorsay.fr",
        "source": "Site officiel financiere-dorsay.fr",
        "territory": "France & DOM",
        "city": "Paris"
    },
    {
        "company": "Magnacarta Réunion",
        "name": "Direction Magnacarta Réunion",
        "email": "contact@magnacarta.re",
        "website": "https://www.magnacarta.re",
        "source": "Site officiel magnacarta.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Patrimoine Consultants Outre-Mer",
        "name": "Direction Patrimoine Consultants",
        "email": "contact@patrimoineconsultants.com",
        "website": "https://www.patrimoineconsultants.com",
        "source": "Site officiel patrimoineconsultants.com",
        "territory": "France & DOM",
        "city": "Paris"
    },
    {
        "company": "Astoria Finance Gestion Privée",
        "name": "Direction Astoria",
        "email": "contact@astoriafinance.com",
        "website": "https://www.astoriafinance.com",
        "source": "Site officiel astoriafinance.com",
        "territory": "France & DOM",
        "city": "Paris"
    },
    {
        "company": "Nortia Gestion Privée",
        "name": "Direction Nortia",
        "email": "contact@nortia.fr",
        "website": "https://www.nortia.fr",
        "source": "Site officiel nortia.fr",
        "territory": "France & International",
        "city": "Roubaix & Paris"
    },
    {
        "company": "Cyrus Conseil Gestion Privée",
        "name": "Direction Cyrus",
        "email": "contact@cyrusconseil.fr",
        "website": "https://www.cyrusconseil.fr",
        "source": "Site officiel cyrusconseil.fr",
        "territory": "France & International",
        "city": "Paris"
    },
    {
        "company": "Kereis Patrimoine",
        "name": "Direction Kereis",
        "email": "contact@kereis.com",
        "website": "https://www.kereis.com",
        "source": "Site officiel kereis.com",
        "territory": "France & Outre-Mer",
        "city": "Paris"
    },
    {
        "company": "Theseis Conseil Patrimonial",
        "name": "Direction Theseis",
        "email": "contact@theseis.fr",
        "website": "https://www.theseis.fr",
        "source": "Site officiel theseis.fr",
        "territory": "France & Outre-Mer",
        "city": "Toulouse & Paris"
    },
    {
        "company": "Ufifrance Patrimoine",
        "name": "Direction Ufifrance",
        "email": "contact@ufifrance.fr",
        "website": "https://www.ufifrance.fr",
        "source": "Site officiel ufifrance.fr",
        "territory": "France & Outre-Mer",
        "city": "Paris"
    },
    {
        "company": "Consultim Groupe Outre-Mer",
        "name": "Direction Consultim",
        "email": "contact@consultim.com",
        "website": "https://www.consultim.com",
        "source": "Site officiel consultim.com",
        "territory": "France & Outre-Mer",
        "city": "Nantes & Paris"
    }
]

print(f"Total raw candidates: {len(raw_candidates)}")

# Now run validation on each candidate
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
EXCLUSIONS_FILE = os.path.join(BASE_DIR, "scripts", "exclusions.json")

with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)
known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))
known_domains = set(d.lower().strip() for d in db.get("domains", []))

with open(EXCLUSIONS_FILE, "r", encoding="utf-8") as f:
    excl = json.load(f)
excl_emails = set(e.lower().strip() for e in excl.get("excluded_emails", []))
excl_domains = set(d.lower().strip() for d in excl.get("excluded_domains", []))

valid_candidates = []
seen_emails = set()

for c in raw_candidates:
    email = c["email"].lower().strip()
    domain = email.split("@")[1]
    
    if email in seen_emails:
        print(f"[-] Duplicate in list: {email}")
        continue
    seen_emails.add(email)
    
    if email in known_emails:
        print(f"[-] Already contacted: {email}")
        continue
    if domain in known_domains:
        print(f"[-] Domain already contacted: {domain} ({email})")
        continue
    if email in excl_emails or domain in excl_domains:
        print(f"[-] Excluded: {email}")
        continue
        
    # Check DNS / MX
    is_valid, msg = verify_email_target(email)
    if not is_valid:
        print(f"[-] DNS/MX failed: {email} -> {msg}")
        continue
        
    valid_candidates.append(c)
    print(f"[+] VALID ({len(valid_candidates)}): {c['company']} | {email} | {c['territory']}")

print(f"\nTotal validated candidates: {len(valid_candidates)}")
with open(os.path.join(os.path.dirname(__file__), "validated_candidates_batch_66.json"), "w", encoding="utf-8") as f:
    json.dump(valid_candidates, f, indent=2, ensure_ascii=False)
