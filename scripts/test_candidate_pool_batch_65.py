import json
import os
import sys

sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("scripts"))

import scripts.email_validator as ev

candidates = [
    # --- 1. HAITI ---
    {"company": "Cabinet Salès", "email": "info@cabsales.ht", "country": "Haïti", "sector": "Droit des Affaires & Propriété Intellectuelle", "source": "Site officiel cabsales.ht / cabinetsales.com"},
    {"company": "Cabinet Lissade", "email": "info@lissadelaw.com", "country": "Haïti", "sector": "Droit Maritime, Fiscalité & Sociétés", "source": "Site officiel lissadelaw.com"},
    {"company": "Cabinet Leblanc & Associés", "email": "info@avocatleblanc.com", "country": "Haïti", "sector": "Droit des Sociétés & Fiscalité", "source": "Site officiel avocatleblanc.com"},
    {"company": "Cabinet Patrick Laurent & Associés", "email": "plaurent@cabinetpatricklaurent.com", "country": "Haïti", "sector": "Droit des Affaires & International", "source": "Site officiel cabinetpatricklaurent.com"},
    {"company": "Cabinet Reynold Georges", "email": "info@cabinetreynoldgeorges.com", "country": "Haïti", "sector": "Droit Commercial & Réglementaire", "source": "Site officiel cabinetreynoldgeorges.com"},
    {"company": "CCIH (Chambre de Commerce et d'Industrie d'Haïti)", "email": "info@ccih.ht", "country": "Haïti", "sector": "Chambre de Commerce & d'Industrie Nationale", "source": "Site officiel ccih.ht"},
    {"company": "REBO Café Haïti", "email": "info@rebo.ht", "country": "Haïti", "sector": "Café de Terroir & Torréfaction d'Origine", "source": "Site officiel rebo.ht"},
    {"company": "Chatelain Cargo Services", "email": "sales@chatelaincargo.com", "country": "Haïti", "sector": "Logistique, Fret & Transit Maritime Caribéen", "source": "Site officiel chatelaincargo.com"},

    # --- 2. SAINTE-LUCIE & DOMINIQUE ---
    {"company": "Floissac Fleming & Associates", "email": "info@floissaclawyers.com", "country": "Sainte-Lucie", "sector": "Corporate & Financial Law", "source": "Site officiel floissaclawyers.com"},
    {"company": "Nicholas John & Co", "email": "info@saintlucialawyer.com", "country": "Sainte-Lucie", "sector": "Corporate Law & Maritime", "source": "Site officiel saintlucialawyer.com"},
    {"company": "St. Lucia Chamber of Commerce", "email": "info@stluciachamber.org", "country": "Sainte-Lucie", "sector": "Commerce & Industrie Caribéenne", "source": "Site officiel stluciachamber.org"},
    {"company": "St. Lucia Distillers", "email": "info@saintluciarums.com", "country": "Sainte-Lucie", "sector": "Rhums d'Excellence & Terroir Caribéen", "source": "Site officiel saintluciarums.com"},
    {"company": "Dominica Association of Industry and Commerce", "email": "info@dominicachamber.com", "country": "Dominique", "sector": "Chambre de Commerce & Industrie", "source": "Site officiel daic.dm / dominicachamber.com"},
    {"company": "Invest Dominica Authority", "email": "info@investdominica.dm", "country": "Dominique", "sector": "Agence Nationale d'Investissement", "source": "Site officiel investdominica.dm"},
    {"company": "HAJ Law Offices", "email": "joshuafrancis@hajlawoffices.com", "country": "Dominique", "sector": "Cabinet Juridique & Affaires", "source": "Site officiel hajlegalservices.com"},

    # --- 3. SAINT-MARTIN & SAINT-BARTHÉLEMY ---
    {"company": "CCISM Saint-Martin", "email": "info@ccism.com", "country": "Saint-Martin", "sector": "Chambre Consulaire Interprofessionnelle", "source": "Site officiel ccism.fr"},
    {"company": "Grand Case Beach Club", "email": "reservations@grandcasebeachclub.com", "country": "Saint-Martin", "sector": "Hôtellerie de Prestige & Tourisme", "source": "Site officiel grandcasebeachclub.com"},
    {"company": "Orient Beach Hotel", "email": "contact@orientbeachhotel.com", "country": "Saint-Martin", "sector": "Hôtellerie Balnéaire & Événements", "source": "Site officiel orientbeachhotel.com"},

    # --- 4. BARBADE, JAMAÏQUE & BAHAMAS ---
    {"company": "Clarke Gittens Farmer", "email": "contact@cgf.law", "country": "Barbade", "sector": "Cabinet d'Avocats d'Affaires Caribéen", "source": "Site officiel cgf.law"},
    {"company": "Lex Caribbean Barbados", "email": "barbados@lexcaribbean.com", "country": "Barbade", "sector": "Corporate & Commercial Law Firm", "source": "Site officiel lexcaribbean.com"},
    {"company": "Lex Caribbean Trinidad", "email": "trinidad@lexcaribbean.com", "country": "Trinité-et-Tobago", "sector": "Corporate Law & Transactional Advisory", "source": "Site officiel lexcaribbean.com"},
    {"company": "Jamaica Chamber of Commerce", "email": "info@jamaicachamber.org.jm", "country": "Jamaïque", "sector": "Chambre de Commerce & d'Industrie", "source": "Site officiel jamaicachamber.org.jm"},
    {"company": "Bahamas Chamber of Commerce", "email": "info@thebahamaschamber.com", "country": "Bahamas", "sector": "Chambre de Commerce & Employeurs", "source": "Site officiel thebahamaschamber.com"},

    # --- 5. CAMEROUN ---
    {"company": "Chazai & Partners", "email": "contact@chazai-partners.com", "country": "Cameroun", "sector": "Avocats d'Affaires OHADA & M&A", "source": "Site officiel chazai-partners.com"},
    {"company": "Jing & Partners", "email": "info@jingpartners.com", "country": "Cameroun", "sector": "Cabinet Juridique International & Projets", "source": "Site officiel jingpartners.com"},
    {"company": "GECAM (Groupement des Entreprises du Cameroun)", "email": "gecam@legecam.cm", "country": "Cameroun", "sector": "Patronat & Développement Économique", "source": "Site officiel legecam.cm"},
    {"company": "Maviance PLC", "email": "contact@maviance.com", "country": "Cameroun", "sector": "Fintech & Solutions de Paiement Digital", "source": "Site officiel maviance.com"},
    {"company": "Sogetrans Cameroun", "email": "info@sogetrans-cm.com", "country": "Cameroun", "sector": "Transit & Logistique Multimodale", "source": "Site officiel sogetrans-cm.com"},
    {"company": "Transimex Cameroun", "email": "info@transimex-cm.com", "country": "Cameroun", "sector": "Consignation & Fret Maritime Port de Douala", "source": "Site officiel transimex-cm.com"},
    {"company": "TOKCHAM", "email": "contact@tokcham.fr", "country": "Cameroun", "sector": "Chocolaterie Artisanale & Fèves d'Excellence", "source": "Site officiel tokcham.fr"},
    {"company": "Toumaka Café", "email": "contact@toumaka.coffee", "country": "Cameroun", "sector": "Café Bio Artisanal des Hauts Plateaux", "source": "Site officiel toumaka.coffee"},

    # --- 6. RDC, GUINÉE & MALI ---
    {"company": "Cabinet Emery Mukendi Wafwana & Associés", "email": "cabsecretariat@cabemery.org", "country": "RDC", "sector": "Cabinet Juridique Panafricain & Énergie", "source": "Site officiel cabemery.org"},
    {"company": "Sylla & Partners", "email": "accueil@syllapartners.com", "country": "Guinée", "sector": "Avocats d'Affaires & Projets d'Infrastructures", "source": "Site officiel syllapartners.com"},
    {"company": "Jurifis Consult", "email": "contact@jurifis.com", "country": "Mali", "sector": "Conseil Juridique, Fiscal & Stratégique", "source": "Site officiel jurifis.com"},

    # --- 7. TOGO & BÉNIN ---
    {"company": "Cabinet Aquereburu & Partners", "email": "contact@aquereburu-partners.com", "country": "Togo", "sector": "Cabinet d'Avocats d'Affaires OHADA", "source": "Site officiel aquereburu-partners.com"},
    {"company": "CCITogo", "email": "ccit@ccit.tg", "country": "Togo", "sector": "Chambre de Commerce et d'Industrie du Togo", "source": "Site officiel ccit.tg"},
    {"company": "Ordre des Avocats du Bénin", "email": "contact@barreaudubenin.bj", "country": "Bénin", "sector": "Secrétariat Général du Barreau Béninois", "source": "Site officiel barreaudubenin.bj"},
    {"company": "CCIB Bénin", "email": "info@ccib.bj", "country": "Bénin", "sector": "Chambre de Commerce et d'Industrie du Bénin", "source": "Site officiel ccib.bj"},

    # --- 8. GABON & CÔTE D'IVOIRE ---
    {"company": "ANPI Gabon", "email": "contact@investingabon.ga", "country": "Gabon", "sector": "Promotion des Investissements & Guichet Numérique", "source": "Site officiel investingabon.ga"},
    {"company": "CGECI (Patronat Ivoirien)", "email": "cgeci@cgeci.com", "country": "Côte d'Ivoire", "sector": "Confédération Générale des Entreprises", "source": "Site officiel cgeci.com"},
    {"company": "Le Chocolatier Ivoirien", "email": "lechocolatierivoirien@gmail.com", "country": "Côte d'Ivoire", "sector": "Transformation Cacao & Chocolat Artisanal", "source": "Site officiel lechocolatierivoirien.com"},
    {"company": "AGL Côte d'Ivoire", "email": "contact.ci@aglgroup.com", "country": "Côte d'Ivoire", "sector": "Logistique & Opérations Portuaires", "source": "Site officiel aglgroup.com"},

    # --- 9. SÉNÉGAL ---
    {"company": "SCPA Houda", "email": "houda@avocatshouda.com", "country": "Sénégal", "sector": "Cabinet d'Avocats Spécialisé Affaires OHADA", "source": "Site officiel avocatshouda.com"},
    {"company": "CCIAD Dakar", "email": "marketing@cciad.sn", "country": "Sénégal", "sector": "Chambre de Commerce, d'Industrie et d'Agriculture de Dakar", "source": "Site officiel cciad.sn"},
    {"company": "Tongoro", "email": "contact@tongoro.com", "country": "Sénégal", "sector": "Mode & DNVB Internationale", "source": "Site officiel tongoro.com"},

    # --- 10. RWANDA, MADAGASCAR & MAURICE ---
    {"company": "K-Solutions & Partners", "email": "info@ksolutions-law.com", "country": "Rwanda", "sector": "Corporate & Financial Law Firm", "source": "Site officiel ksolutions-law.com"},
    {"company": "Trust Law Chambers", "email": "info@trustchambers.rw", "country": "Rwanda", "sector": "Business Law & Commercial Advisory", "source": "Site officiel trustchambers.rw"},
    {"company": "Madagascar Conseil International", "email": "conseils@cabinet-mci.com", "country": "Madagascar", "sector": "Cabinet de Conseil Juridique & Fiscal", "source": "Site officiel cabinet-mci.com"},
    {"company": "John W Ffooks & Co", "email": "madagascar@jwflegal.com", "country": "Madagascar", "sector": "Cabinet d'Avocats d'Affaires Panafricain", "source": "Site officiel jwflegal.com"},
    {"company": "GEM (Groupement des Entreprises de Madagascar)", "email": "gem@iris.mg", "country": "Madagascar", "sector": "Patronat & Développement Économique", "source": "Site officiel gem-madagascar.com"},
    {"company": "Chocolaterie Robert Madagascar", "email": "shop@chocolaterierobert.fr", "country": "Madagascar", "sector": "Pur Cacao Fin & Chocolaterie Historique", "source": "Site officiel chocolaterierobert.fr"},
    {"company": "BLC Robert & Associates", "email": "chambers@blc.mu", "country": "Maurice", "sector": "Leading Business Law Firm Indian Ocean", "source": "Site officiel blc.mu"},
    {"company": "MCCI (Mauritius Chamber of Commerce)", "email": "mcci@mcci.org", "country": "Maurice", "sector": "Chambre de Commerce & Industrie de Maurice", "source": "Site officiel mcci.org"},
    {"company": "EDB Mauritius (Economic Development Board)", "email": "contact@edbmauritius.org", "country": "Maurice", "sector": "Agence Nationale de Promotion & Investissements", "source": "Site officiel edbmauritius.org"},

    # --- 11. ANTILLES & FRET SPÉCIALISÉ ---
    {"company": "Alizés Fret", "email": "enlevement@alizesfret.com", "country": "Antilles", "sector": "Fret Aérien & Maritime Spécialisé", "source": "Site officiel alizesfret.com"}
]

print(f"Total candidates in updated pool: {len(candidates)}")

with open("scripts/exclusions.json", "r", encoding="utf-8") as f:
    exclusions = json.load(f)

excluded_emails = set(e.lower() for e in exclusions.get("excluded_emails", []))
excluded_domains = set(d.lower() for d in exclusions.get("excluded_domains", []))

with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    contacts_data = json.load(f)

already_contacted_emails = set()
already_contacted_domains = set()

if isinstance(contacts_data, dict):
    if "domains" in contacts_data and isinstance(contacts_data["domains"], list):
        already_contacted_domains.update(d.lower() for d in contacts_data["domains"] if isinstance(d, str))
    if "contacts" in contacts_data and isinstance(contacts_data["contacts"], list):
        for c in contacts_data["contacts"]:
            if isinstance(c, dict):
                em = c.get("email", "")
                if em:
                    already_contacted_emails.add(em.lower())
                dom = c.get("domain", "")
                if dom:
                    already_contacted_domains.add(dom.lower())

valid_candidates = []
filtered_out = []

for c in candidates:
    em = c["email"].lower().strip()
    dom = em.split("@")[-1].lower() if "@" in em else ""
    
    if em in excluded_emails:
        filtered_out.append((c["company"], em, "EXCLUDED EMAIL"))
        continue
    if dom in excluded_domains:
        filtered_out.append((c["company"], em, f"EXCLUDED DOMAIN ({dom})"))
        continue
    if em in already_contacted_emails:
        filtered_out.append((c["company"], em, "ALREADY CONTACTED EMAIL"))
        continue
    if dom in already_contacted_domains and dom not in ["gmail.com", "wanadoo.fr", "orange.fr"]:
        filtered_out.append((c["company"], em, f"ALREADY CONTACTED DOMAIN ({dom})"))
        continue
        
    valid_candidates.append(c)

print(f"Passed Dedup & Exclusions: {len(valid_candidates)}")
if filtered_out:
    print(f"Filtered out ({len(filtered_out)}):")
    for comp, em, reason in filtered_out:
        print(f"  [X] {comp} ({em}): {reason}")

final_validated = []
mx_failed = []

for c in valid_candidates:
    em = c["email"].strip()
    is_valid, msg = ev.verify_email_target(em)
    if is_valid:
        final_validated.append(c)
    else:
        mx_failed.append((c["company"], em, msg))
        print(f"  [FAIL MX] {c['company']} ({em}) -> {msg}")

print(f"\nFinal Validated Total: {len(final_validated)}")
if mx_failed:
    print(f"MX Failed Total: {len(mx_failed)}")

with open("batch_65_candidates_validated.json", "w", encoding="utf-8") as f:
    json.dump(final_validated, f, indent=2, ensure_ascii=False)
print("Saved validated candidates to batch_65_candidates_validated.json")
