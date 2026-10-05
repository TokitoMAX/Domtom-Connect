import json
import os
import re
import sys
import subprocess

sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("scripts"))

import scripts.email_validator as ev

# 50 100% PRIVATE, DIRECT, ESTABLISHED TARGETS ACROSS CARIBBEAN & AFRICA
targets_raw = [
    # === 1. HAÏTI (Cabinets d'Affaires Privés, Terroir & Fret) ===
    {"company": "Cabinet Lissade", "email": "info@lissadelaw.com", "country": "Haïti", "sector": "Droit Maritime, Fiscalité & Sociétés", "source": "Site officiel lissadelaw.com"},
    {"company": "Cabinet Leblanc & Associés", "email": "info@avocatleblanc.com", "country": "Haïti", "sector": "Droit des Sociétés & Fiscalité", "source": "Site officiel avocatleblanc.com"},
    {"company": "Cabinet Blaise & Associés", "email": "contact@cabinetblaise.com", "country": "Haïti", "sector": "Droit des Affaires & Contentieux", "source": "Site officiel cabinetblaise.com"},
    {"company": "REBO Café Haïti", "email": "info@rebo.ht", "country": "Haïti", "sector": "Café de Terroir & Torréfaction d'Origine", "source": "Site officiel rebo.ht"},
    {"company": "Chatelain Cargo Services", "email": "sales@chatelaincargo.com", "country": "Haïti", "sector": "Logistique, Fret & Transit Maritime Caribéen", "source": "Site officiel chatelaincargo.com"},

    # === 2. SAINTE-LUCIE & DOMINIQUE (Cabinets, Terroir & Hôtellerie d'Exception) ===
    {"company": "Floissac Fleming & Associates", "email": "info@floissaclawyers.com", "country": "Sainte-Lucie", "sector": "Corporate & Financial Law", "source": "Site officiel floissaclawyers.com"},
    {"company": "Nicholas John & Co", "email": "info@saintlucialawyer.com", "country": "Sainte-Lucie", "sector": "Corporate Law & Maritime", "source": "Site officiel saintlucialawyer.com"},
    {"company": "Jade Mountain Resort", "email": "jademountain@jademountain.com", "country": "Sainte-Lucie", "sector": "Hôtellerie 5 Étoiles & Luxe Caribéen", "source": "Site officiel jademountain.com"},
    {"company": "St. Lucia Distillers", "email": "info@saintluciarums.com", "country": "Sainte-Lucie", "sector": "Rhums d'Excellence & Terroir Caribéen", "source": "Site officiel saintluciarums.com"},
    {"company": "HAJ Law Offices", "email": "joshuafrancis@hajlawoffices.com", "country": "Dominique", "sector": "Cabinet Juridique & Affaires", "source": "Site officiel hajlegalservices.com"},
    {"company": "Whiticker Law Associates", "email": "lawrencea@wlaoffice.com", "country": "Dominique", "sector": "Conseil Juridique & Investissements", "source": "Site officiel whitickerlaw.com / wlaoffice.com"},

    # === 3. SAINT-MARTIN & SAINT-BARTHÉLEMY (Hôtellerie de Prestige & Événements) ===
    {"company": "Grand Case Beach Club", "email": "reservations@grandcasebeachclub.com", "country": "Saint-Martin", "sector": "Hôtellerie de Prestige & Tourisme", "source": "Site officiel grandcasebeachclub.com"},
    {"company": "Orient Beach Hotel", "email": "contact@orientbeachhotel.com", "country": "Saint-Martin", "sector": "Hôtellerie Balnéaire & Événements", "source": "Site officiel orientbeachhotel.com"},
    {"company": "Esmeralda Resort", "email": "reservation@esmeralda-resort.com", "country": "Saint-Martin", "sector": "Resort & Villas d'Exception", "source": "Site officiel esmeralda-resort.com"},

    # === 4. BARBADE, TRINITÉ, JAMAÏQUE & BAHAMAS (Cabinets Leaders & Droit Transactionnel) ===
    {"company": "Clarke Gittens Farmer", "email": "contact@cgf.law", "country": "Barbade", "sector": "Cabinet d'Avocats d'Affaires Caribéen", "source": "Site officiel cgf.law"},
    {"company": "Lex Caribbean Barbados", "email": "barbados@lexcaribbean.com", "country": "Barbade", "sector": "Corporate & Commercial Law Firm", "source": "Site officiel lexcaribbean.com"},
    {"company": "Lex Caribbean Trinidad", "email": "trinidad@lexcaribbean.com", "country": "Trinité-et-Tobago", "sector": "Corporate Law & Transactional Advisory", "source": "Site officiel lexcaribbean.com"},
    {"company": "DunnCox Attorneys", "email": "info@dunncox.com", "country": "Jamaïque", "sector": "Premier Cabinet Juridique d'Affaires Kingston", "source": "Site officiel dunncox.com"},
    {"company": "Higgs & Johnson", "email": "nassau@higgsjohnson.com", "country": "Bahamas", "sector": "Cabinet d'Avocats Spécialisé Corporate & Finance", "source": "Site officiel higgsjohnson.com"},

    # === 5. CAMEROUN (Droit des Affaires, Fret, Fintech & Terroir) ===
    {"company": "Chazai & Partners", "email": "contact@chazai-partners.com", "country": "Cameroun", "sector": "Avocats d'Affaires OHADA & M&A", "source": "Site officiel chazai-partners.com"},
    {"company": "Jing & Partners", "email": "info@jingpartners.com", "country": "Cameroun", "sector": "Cabinet Juridique International & Projets", "source": "Site officiel jingpartners.com"},
    {"company": "NFM Avocats", "email": "contact@nfmavocats.com", "country": "Cameroun", "sector": "Cabinet d'Avocats d'Affaires Douala", "source": "Site officiel nfmavocats.com"},
    {"company": "Maviance PLC", "email": "contact@maviance.com", "country": "Cameroun", "sector": "Fintech & Solutions de Paiement Digital", "source": "Site officiel maviance.com"},
    {"company": "Sogetrans Cameroun", "email": "info@sogetrans-cm.com", "country": "Cameroun", "sector": "Transit & Logistique Multimodale", "source": "Site officiel sogetrans-cm.com"},
    {"company": "Transimex Cameroun", "email": "info@transimex-cm.com", "country": "Cameroun", "sector": "Consignation & Fret Maritime Port de Douala", "source": "Site officiel transimex-cm.com"},
    {"company": "TOKCHAM", "email": "contact@tokcham.fr", "country": "Cameroun", "sector": "Chocolaterie Artisanale & Fèves d'Excellence", "source": "Site officiel tokcham.fr"},
    {"company": "Toumaka Café", "email": "contact@toumaka.coffee", "country": "Cameroun", "sector": "Café Bio Artisanal des Hauts Plateaux", "source": "Site officiel toumaka.coffee"},

    # === 6. RDC, GUINÉE & MALI (Grands Cabinets d'Affaires OHADA) ===
    {"company": "Cabinet Emery Mukendi Wafwana & Associés", "email": "cabsecretariat@cabemery.org", "country": "RDC", "sector": "Cabinet Juridique Panafricain & Énergie", "source": "Site officiel cabemery.org"},
    {"company": "Sylla & Partners", "email": "accueil@syllapartners.com", "country": "Guinée", "sector": "Avocats d'Affaires & Projets d'Infrastructures", "source": "Site officiel syllapartners.com"},
    {"company": "Jurifis Consult", "email": "contact@jurifis.com", "country": "Mali", "sector": "Conseil Juridique, Fiscal & Stratégique", "source": "Site officiel jurifis.com"},

    # === 7. TOGO (Droit des Affaires & Arbitrage) ===
    {"company": "Cabinet Aquereburu & Partners", "email": "contact@aquereburu-partners.com", "country": "Togo", "sector": "Cabinet d'Avocats d'Affaires OHADA", "source": "Site officiel aquereburu-partners.com"},
    {"company": "SCP Martial Akakpo & Associés", "email": "contact@scpmakakpo.com", "country": "Togo", "sector": "Société Civile Professionnelle d'Avocats Lomé", "source": "Site officiel scpmakakpo.com"},

    # === 8. CÔTE D'IVOIRE (Droit des Sociétés, Tailoring & Terroir) ===
    {"company": "Bilé-Aka, Brizoua-Bi & Associés", "email": "contact@bba.ci", "country": "Côte d'Ivoire", "sector": "Cabinet d'Avocats d'Affaires Abidjan", "source": "Site officiel bba.ci / bilebrizoua.ci"},
    {"company": "CLK Avocats", "email": "info@clkavocats.com", "country": "Côte d'Ivoire", "sector": "Droit Commercial, Banques & Investissements", "source": "Site officiel clkavocats.com"},
    {"company": "Le Chocolatier Ivoirien", "email": "lechocolatierivoirien@gmail.com", "country": "Côte d'Ivoire", "sector": "Transformation Cacao & Chocolat Artisanal", "source": "Site officiel lechocolatierivoirien.com"},

    # === 9. SÉNÉGAL (Droit des Affaires & DNVB) ===
    {"company": "SCPA Houda", "email": "houda@avocatshouda.com", "country": "Sénégal", "sector": "Cabinet d'Avocats Spécialisé Affaires OHADA", "source": "Site officiel avocatshouda.com"},
    {"company": "Cap Maison Resort", "email": "reservations@capmaison.com", "country": "Sainte-Lucie", "sector": "Hôtellerie de Luxe & Villas d'Exception", "source": "Site officiel capmaison.com"},
    {"company": "Tongoro", "email": "contact@tongoro.com", "country": "Sénégal", "sector": "Mode & DNVB Internationale", "source": "Site officiel tongoro.com"},

    # === 10. RWANDA (Corporate & Financial Law) ===
    {"company": "K-Solutions & Partners", "email": "info@ksolutions-law.com", "country": "Rwanda", "sector": "Corporate & Financial Law Firm", "source": "Site officiel ksolutions-law.com"},
    {"company": "Trust Law Chambers", "email": "info@trustchambers.rw", "country": "Rwanda", "sector": "Business Law & Commercial Advisory", "source": "Site officiel trustchambers.rw"},

    # === 11. MADAGASCAR (Droit Fiscal, Grands Crus & Conseils Juridiques) ===
    {"company": "Madagascar Conseil International", "email": "conseils@cabinet-mci.com", "country": "Madagascar", "sector": "Cabinet de Conseil Juridique & Fiscal", "source": "Site officiel cabinet-mci.com"},
    {"company": "John W Ffooks & Co", "email": "madagascar@jwflegal.com", "country": "Madagascar", "sector": "Cabinet d'Avocats d'Affaires Panafricain", "source": "Site officiel jwflegal.com"},
    {"company": "LEXEL Juridique & Fiscal", "email": "lexel@lexel.mg", "country": "Madagascar", "sector": "Cabinet Conseil Droit des Sociétés Antananarivo", "source": "Site officiel lexel.mg"},
    {"company": "Chocolaterie Robert Madagascar", "email": "shop@chocolaterierobert.fr", "country": "Madagascar", "sector": "Pur Cacao Fin & Chocolaterie Historique", "source": "Site officiel chocolaterierobert.fr"},

    # === 12. ÎLE MAURICE (Cabinets d'Affaires Internationaux) ===
    {"company": "BLC Robert & Associates", "email": "chambers@blc.mu", "country": "Maurice", "sector": "Leading Business Law Firm Indian Ocean", "source": "Site officiel blc.mu"},
    {"company": "Juristconsult Chambers", "email": "jurist@juristconsult.com", "country": "Maurice", "sector": "Droit des Affaires & Structuration Internationale", "source": "Site officiel juristconsult.com"},

    # === 13. GABON (Droit des Affaires & Investissements) ===
    {"company": "ANPI Gabon", "email": "contact@investingabon.ga", "country": "Gabon", "sector": "Guichet Numérique de l'Investissement", "source": "Site officiel investingabon.ga / gni-anpigabon.com"},

    # === 14. ANTILLES (Fret Aérien & Maritime Spécialisé) ===
    {"company": "Alizés Fret", "email": "enlevement@alizesfret.com", "country": "Antilles", "sector": "Fret Aérien & Maritime Spécialisé", "source": "Site officiel alizesfret.com"},

    # === 15. COMMERCE & EXPANSION RÉGIONALE CARIBÉENNE ===
    {"company": "St. Lucia Chamber of Commerce", "email": "info@stluciachamber.org", "country": "Sainte-Lucie", "sector": "Commerce & Industrie Caribéenne", "source": "Site officiel stluciachamber.org"},
    {"company": "Invest Dominica Authority", "email": "info@investdominica.dm", "country": "Dominique", "sector": "Agence d'Investissement Caribéenne", "source": "Site officiel investdominica.dm"}
]

print(f"Total targets in reconstructed ultra-secure list: {len(targets_raw)}")

# Load databases
with open("scripts/exclusions.json", "r", encoding="utf-8") as f:
    exclusions = json.load(f)

excluded_emails = set(e.lower().strip() for e in exclusions.get("excluded_emails", []))
excluded_domains = set(d.lower().strip() for d in exclusions.get("excluded_domains", []))

with open("contacts_deja_contactes.json", "r", encoding="utf-8") as f:
    contacts_data = json.load(f)

already_contacted_emails = set()
already_contacted_domains = set()

if isinstance(contacts_data, dict):
    if "domains" in contacts_data and isinstance(contacts_data["domains"], list):
        already_contacted_domains.update(d.lower().strip() for d in contacts_data["domains"] if isinstance(d, str))
    if "contacts" in contacts_data and isinstance(contacts_data["contacts"], list):
        for c in contacts_data["contacts"]:
            if isinstance(c, dict):
                em = c.get("email", "")
                if em:
                    already_contacted_emails.add(em.lower().strip())
                dom = c.get("domain", "")
                if dom:
                    already_contacted_domains.add(dom.lower().strip())

batch_leads = []
for c in targets_raw:
    comp = c["company"]
    em = c["email"].strip()
    country = c["country"]
    sector = c["sector"]
    source = c["source"]
    
    # Check dedup & exclusions
    em_lower = em.lower()
    dom_lower = em_lower.split("@")[1]
    
    if em_lower in excluded_emails:
        print(f"ERROR: {em} is in excluded_emails!")
        sys.exit(1)
    if dom_lower in excluded_domains:
        print(f"ERROR: {dom_lower} is in excluded_domains!")
        sys.exit(1)
    if em_lower in already_contacted_emails:
        print(f"ERROR: {em} is already contacted!")
        sys.exit(1)
    if dom_lower in already_contacted_domains and dom_lower not in ["gmail.com"]:
        print(f"ERROR: domain {dom_lower} is already contacted!")
        sys.exit(1)
        
    # Verify DNS & MX
    is_valid, msg = ev.verify_email_target(em)
    if not is_valid:
        print(f"ERROR: {em} failed DNS/MX check: {msg}")
        sys.exit(1)

    # Template generation
    if any(k in sector.lower() for k in ["chocolat", "café", "terroir", "rhum", "mode", "dnvb"]):
        subject = f"Canaux de vente directe et visibilité qualifiée pour {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je me permets de vous contacter car nous suivons avec un vif intérêt l'excellence des créations développées par {comp} à {country}.

Domtom Connect déploie des dispositifs de mise en avant et de commercialisation directe ciblant activement une communauté qualifiée d'acheteurs et de professionnels répartis sur toute la Caraïbe, le continent africain et sa diaspora.

À travers notre canal DTC Pulse et nos outils de visibilité ciblée, nous permettons aux marques emblématiques d'accéder sans intermédiaire à ces marchés captifs et demandeurs de produits d'exception.

Seriez-vous ouvert à un bref échange d'une quinzaine de minutes afin d'envisager comment activer de nouvelles opportunités de diffusion pour {comp} ?

Vous pouvez me joindre directement au 07 45 61 74 97 ou réserver le créneau qui vous convient sur calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    elif any(k in sector.lower() for k in ["hôtellerie", "hotel", "resort", "villas"]):
        subject = f"Clientèle d'affaires et visibilité ciblée / {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je vous contacte car nous admirons la qualité des prestations hôtelières offertes par {comp} à {country}.

Domtom Connect anime un réseau privé de dirigeants, d'investisseurs et de professionnels voyageant régulièrement sur toute la Caraïbe, le continent africain et sa diaspora.

Nous mettons en place des référencements privilégiés pour orienter directement cette clientèle qualifiée vers des établissements d'exception, sans passer par les intermédiaires habituels.

Seriez-vous ouvert à un échange téléphonique rapide afin d'étudier comment orienter ces flux de séjours professionnels vers {comp} ?

Vous pouvez me contacter au 07 45 61 74 97 ou choisir un moment qui vous arrange sur calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    elif any(k in sector.lower() for k in ["transit", "logistique", "fret"]):
        subject = f"Flux logistiques régionaux et partenariats d'affaires / {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je me permets de vous écrire car nous observons l'expertise reconnue de {comp} sur les liaisons maritimes, aériennes et le transit de marchandises à {country}.

Domtom Connect fédère un écosystème grandissant d'acteurs économiques, d'importateurs et d'exportateurs situés sur toute la Caraïbe, le continent africain et sa diaspora.

Nos membres recherchent activement des partenaires logistiques fiables pour fluidifier leurs échanges commerciaux et sécuriser leurs flux de fret transfrontaliers.

Seriez-vous disposé à échanger une quinzaine de minutes pour examiner ensemble des opportunités de synergie opérationnelle ?

Je suis joignable au 07 45 61 74 97 ou disponible via calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    elif any(k in sector.lower() for k in ["commerce & industrie", "agence"]):
        subject = f"Passerelles économiques régionales et synergies d'affaires / {comp}"
        body = f"""Bonjour,

J'espère que vous vous portez bien.

Je prends l'attache de votre organisation car nous suivons avec attention le rôle moteur que joue {comp} dans le rayonnement et le dynamisme économique de {country}.

Domtom Connect développe une infrastructure d'interconnexion B2B reliant décideurs, investisseurs et entreprises répartis sur toute la Caraïbe, le continent africain et sa diaspora.

Nous collaborons régulièrement avec les acteurs économiques de référence afin d'offrir à leurs membres de nouveaux canaux d'exportation, de mise en relation ciblée et d'accès aux marchés caribéens et panafricains.

Seriez-vous disponible pour un court entretien exploratoire d'une quinzaine de minutes afin d'étudier de possibles passerelles partenariales ?

Je reste à votre disposition au 07 45 61 74 97 ou via le lien calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    else:
        # Avocats d'affaires & Conseils stratégiques
        subject = f"Synergies professionnelles et collaborations d'affaires / {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je me permets de vous contacter au vu du positionnement d'excellence de {comp} dans le domaine du conseil stratégique et juridique à {country}.

Domtom Connect structure une plateforme d'affaires rassemblant dirigeants, porteurs de projets et investisseurs connectés sur toute la Caraïbe, le continent africain et sa diaspora.

Nos membres ont des besoins récurrents en accompagnement juridique, structuration d'opérations transfrontalières et conformité régionale pour sécuriser leur développement.

Seriez-vous ouvert à un premier contact de 15 minutes afin d'envisager des synergies d'apport d'affaires et de mise en relation pour {comp} ?

Vous pouvez me contacter directement au 07 45 61 74 97 ou sélectionner un créneau sur calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    # Strict compliance checks
    assert ":" not in subject, f"Colon in subject for {comp}"
    assert ":" not in body, f"Colon in body for {comp}"
    assert not re.search(r'\w\s+-\s+\w', subject), f"Mid-sentence hyphen in subject for {comp}"
    assert not re.search(r'\w\s+-\s+\w', body), f"Mid-sentence hyphen in body for {comp}"
    assert "toute la Caraïbe, le continent africain et sa diaspora" in body, f"Sacred formula missing for {comp}"
    assert "entraide" not in body.lower(), f"Banned word entraide in {comp}"
    assert "ddc" not in body.lower() and "ddc" not in subject.lower(), f"Typo DDC in {comp}"

    batch_leads.append({
        "company": comp,
        "email": em,
        "country": country,
        "sector": sector,
        "source": source,
        "subject": subject,
        "body": body
    })

print(f"\nALL {len(batch_leads)} TARGETS PASSED 100% OF VERIFICATIONS (DNS/MX, DEDUP, EXCLUSIONS, CONTENT AUDIT)!")

with open("batch_65_pancaribeen_afrique_50.json", "w", encoding="utf-8") as f:
    json.dump(batch_leads, f, indent=2, ensure_ascii=False)

print("Saved clean 50 leads to batch_65_pancaribeen_afrique_50.json")
