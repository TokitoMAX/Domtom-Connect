import json

LEADS_DATA = [
    # 1. Gestion de Patrimoine, Ingénierie Financière & Défiscalisation (Antilles, Guyane, Réunion)
    {
        "company": "SAMO 1er Patrimoine",
        "email": "samo@samo1er.fr",
        "contact_name": "Direction",
        "territory": "Guadeloupe (Jarry)",
        "sector": "Gestion de patrimoine et investissement immobilier",
        "axis": "C",
        "source": "Site officiel samo1er.com"
    },
    {
        "company": "Patrimoine Immobilier",
        "email": "jlm@patrimoine971.com",
        "contact_name": "Direction",
        "territory": "Guadeloupe (Jarry)",
        "sector": "Gestion privée et valorisation d'actifs",
        "axis": "C",
        "source": "Site officiel patrimoine971.com"
    },
    {
        "company": "Antilles Épargne Conseil",
        "email": "contact@antillesepargneconseil.fr",
        "contact_name": "Direction",
        "territory": "Martinique (Fort-de-France)",
        "sector": "Conseil en investissements financiers et épargne",
        "axis": "C",
        "source": "Site officiel antillesepargneconseil.fr"
    },
    {
        "company": "Patrimoine Prestige Antilles",
        "email": "info@pp-antilles.com",
        "contact_name": "Direction",
        "territory": "Martinique (Le Lamentin)",
        "sector": "Gestion de patrimoine haut de gamme et défiscalisation",
        "axis": "C",
        "source": "Mentions légales patrimoineprestigeantilles.fr"
    },
    {
        "company": "Boussole Patrimoine",
        "email": "contact@boussolepatrimoine.fr",
        "contact_name": "Madame Alkan",
        "territory": "La Réunion (Saint-Denis)",
        "sector": "Stratégie patrimoniale et conseil aux dirigeants",
        "axis": "C",
        "source": "Site officiel boussolepatrimoine.fr"
    },
    {
        "company": "Beauvoisine Patrimoine",
        "email": "contact@beauvoisine.fr",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Pierre)",
        "sector": "Conseil en investissement financier et courtage",
        "axis": "C",
        "source": "Mentions légales beauvoisine.fr"
    },
    {
        "company": "Général Assurances & Patrimoine",
        "email": "gestion@general-patrimoine.re",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Denis)",
        "sector": "Ingénierie patrimoniale et protection du dirigeant",
        "axis": "C",
        "source": "Site officiel general-patrimoine.re"
    },
    {
        "company": "Valexis Conseil",
        "email": "contact@valexis.fr",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Pierre)",
        "sector": "Fiscalité patrimoniale et accompagnement d'entrepreneurs",
        "axis": "C",
        "source": "Site officiel valexis.re"
    },
    {
        "company": "C2A Expertise Comptable",
        "email": "contact@c2a.re",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Denis)",
        "sector": "Expertise comptable et audit financier",
        "axis": "C",
        "source": "Site officiel c2a.re"
    },
    {
        "company": "SOFIGEC Expertys",
        "email": "cabinet@sofigec-antilles.com",
        "contact_name": "Direction",
        "territory": "Guadeloupe (Jarry)",
        "sector": "Expertise comptable et conseil stratégique",
        "axis": "C",
        "source": "Site officiel expertys-antilles.com"
    },
    {
        "company": "ADC Guyane Expertise",
        "email": "contact@adcguyane.com",
        "contact_name": "Direction",
        "territory": "Guyane (Cayenne)",
        "sector": "Expertise comptable et commissariat aux comptes",
        "axis": "C",
        "source": "Ordre des Experts-Comptables de Guyane"
    },
    {
        "company": "Audit Conseil Partners",
        "email": "jitalique@auditconseilpartners.fr",
        "contact_name": "Monsieur Italique",
        "territory": "Guyane (Cayenne)",
        "sector": "Audit financier et conseil d'entreprise",
        "axis": "C",
        "source": "Ordre des Experts-Comptables de Guyane"
    },
    {
        "company": "Accentys Conseil Guyane",
        "email": "lb@accentys.fr",
        "contact_name": "Direction",
        "territory": "Guyane (Cayenne)",
        "sector": "Expertise comptable et structuration financière",
        "axis": "C",
        "source": "Ordre des Experts-Comptables de Guyane"
    },
    {
        "company": "Audit et Expertise Guyane",
        "email": "r.dabriou@drauditexpert.fr",
        "contact_name": "Monsieur Dabriou",
        "territory": "Guyane et Guadeloupe",
        "sector": "Audit légal et conseil financier",
        "axis": "C",
        "source": "Ordre des Experts-Comptables de Guyane"
    },
    {
        "company": "Fly Audit Fiduciaire Guyane",
        "email": "l.yvon@flyaudit.fr",
        "contact_name": "Monsieur Yvon",
        "territory": "Guyane",
        "sector": "Expertise comptable et accompagnement de gestion",
        "axis": "C",
        "source": "Ordre des Experts-Comptables de Guyane"
    },

    # 2. Domaines Hôteliers d'Affaires, Écolodges & Conciergeries de Luxe (Axe C - Tourisme d'Affaires)
    {
        "company": "Domaine des Fonds Blancs",
        "email": "els@scicgroup.com",
        "contact_name": "Direction",
        "territory": "Martinique (Le François)",
        "sector": "Domaine de prestige et séminaires d'exception",
        "axis": "C",
        "source": "Mentions légales domainedesfondsblancs.com"
    },
    {
        "company": "La Toubana Hôtel & Spa",
        "email": "conciergerie@toubana.com",
        "contact_name": "Direction de la Conciergerie",
        "territory": "Guadeloupe (Sainte-Anne)",
        "sector": "Hôtellerie 5 étoiles et accueil d'affaires haut de gamme",
        "axis": "C",
        "source": "Site officiel toubana.com"
    },
    {
        "company": "Palm Hôtel & Spa",
        "email": "akea@palm.re",
        "contact_name": "Direction Commerciale",
        "territory": "La Réunion (Grande Anse)",
        "sector": "Hôtellerie de luxe et événements corporate",
        "axis": "C",
        "source": "Site officiel palm.re"
    },
    {
        "company": "Hôtel Boucan Canot",
        "email": "hotel@boucancanot.com",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Gilles)",
        "sector": "Hôtel 4 étoiles et réceptif d'affaires",
        "axis": "C",
        "source": "Site officiel boucancanot.com"
    },
    {
        "company": "Hôtel Christopher St Barth",
        "email": "guestrelations@hotelchristopher.com",
        "contact_name": "Direction des Relations Invités",
        "territory": "Saint-Barthélemy",
        "sector": "Hôtellerie 5 étoiles et conciergerie d'élite",
        "axis": "C",
        "source": "Site officiel hotelchristopher.com"
    },
    {
        "company": "Hôtel Manapany St Barth",
        "email": "reservation@hotelmanapany.com",
        "contact_name": "Direction des Réservations",
        "territory": "Saint-Barthélemy",
        "sector": "Éco-resort 5 étoiles et accueil de prestige",
        "axis": "C",
        "source": "Site officiel hotelmanapany-stbarth.com"
    },
    {
        "company": "Sibarth Bespoke Villas",
        "email": "villas@sibarth.com",
        "contact_name": "Direction",
        "territory": "Saint-Barthélemy",
        "sector": "Location de villas de grand luxe et conciergerie sur-mesure",
        "axis": "C",
        "source": "Site officiel sibarth.com"
    },
    {
        "company": "Prestige Villa Rental",
        "email": "info@prestigevillarental.com",
        "contact_name": "Direction",
        "territory": "Saint-Barthélemy",
        "sector": "Gestion de propriétés d'exception et conciergerie privée",
        "axis": "C",
        "source": "Site officiel prestigevillarental.com"
    },
    {
        "company": "Premium Island Vacations",
        "email": "villas@premiumislandvacations.com",
        "contact_name": "Direction",
        "territory": "Saint-Barthélemy",
        "sector": "Villas privées et conciergerie VIP",
        "axis": "C",
        "source": "Site officiel premiumislandvacations.com"
    },
    {
        "company": "Your Concierge SXM",
        "email": "info@luxuryconciergeinsxm.com",
        "contact_name": "Direction",
        "territory": "Saint-Martin",
        "sector": "Conciergerie de luxe et services exclusifs",
        "axis": "C",
        "source": "Site officiel luxuryconciergeinsxm.com"
    },
    {
        "company": "Hôtel Les Tipaniers Moorea",
        "email": "tipaniersresa@mail.pf",
        "contact_name": "Direction des Réservations",
        "territory": "Polynésie française (Moorea)",
        "sector": "Hôtellerie de charme et réceptif insulaire",
        "axis": "C",
        "source": "Site officiel lestipaniers.com"
    },

    # 3. Fonds d'Investissement PME & Capital Panafricain (Axe C - Finance & Croissance)
    {
        "company": "Cauris Management",
        "email": "cauris@caurismanagement.com",
        "contact_name": "Direction",
        "territory": "Panafricain (Lomé et Abidjan)",
        "sector": "Capital-investissement et financement de champions régionaux",
        "axis": "C",
        "source": "Site officiel caurismanagement.com"
    },
    {
        "company": "Comoé Capital",
        "email": "infos@comoecapital.com",
        "contact_name": "Direction",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Fonds d'investissement d'impact dédié aux PME",
        "axis": "C",
        "source": "Site officiel comoecapital.com"
    },

    # 4. Grands Cabinets d'Avocats d'Affaires & Conseil International (Axe C - Réseau B2B)
    {
        "company": "Cabinet Bersay Avocats",
        "email": "contact@bersay.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires et opérations transfrontalières",
        "axis": "C",
        "source": "Site officiel bersay.com"
    },
    {
        "company": "De Pardieu Brocas Maffei",
        "email": "info@de-pardieu.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Financement, corporate et investissements stratégiques",
        "axis": "C",
        "source": "Site officiel de-pardieu.com"
    },
    {
        "company": "Simon Associés Avocats",
        "email": "contact@simonassocies.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires, restructuration et croissance d'entreprises",
        "axis": "C",
        "source": "Site officiel simonassocies.com"
    },
    {
        "company": "Ginestié Magellan Paley-Vincent",
        "email": "contact@ginestie.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Corporate, fusions-acquisitions et contentieux d'affaires",
        "axis": "C",
        "source": "Site officiel ginestie.com"
    },
    {
        "company": "Vivien & Associés Avocats",
        "email": "contact@va-fr.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des sociétés, M&A et capital-investissement",
        "axis": "C",
        "source": "Site officiel va-fr.com"
    },
    {
        "company": "Hoche Avocats",
        "email": "hoche@hocheavocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires, fiscalité et restructuration",
        "axis": "C",
        "source": "Site officiel hocheavocats.com"
    },
    {
        "company": "Cabinet Klein Wenner",
        "email": "contact@kleinwenner.eu",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit économique, corporate et investissements",
        "axis": "C",
        "source": "Site officiel kleinwenner.eu"
    },
    {
        "company": "Cabinet Veil Jourde",
        "email": "contact@veil.fr",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Conseil stratégique et contentieux complexe",
        "axis": "C",
        "source": "Site officiel veil.fr"
    },
    {
        "company": "BDGS Associés Avocats",
        "email": "contact@bdgs-associes.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Fusions-acquisitions, concurrence et régulation",
        "axis": "C",
        "source": "Site officiel bdgs-associes.com"
    },
    {
        "company": "Racine Avocats",
        "email": "contact@racine.eu",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires et structuration patrimoniale",
        "axis": "C",
        "source": "Site officiel racine.eu"
    },
    {
        "company": "Bredin Prat Avocats",
        "email": "info@bredinprat.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des sociétés, fiscalité et arbitrage international",
        "axis": "C",
        "source": "Site officiel bredinprat.com"
    },
    {
        "company": "Lamartine Conseil",
        "email": "contact@lamartine-avocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Opérations de transmission, LBO et capital-développement",
        "axis": "C",
        "source": "Site officiel lamartine-avocats.com"
    },
    {
        "company": "Ayache Law",
        "email": "contact@ayacheavocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Corporate finance, M&A et fiscalité d'entreprise",
        "axis": "C",
        "source": "Site officiel ayachelaw.com"
    },
    {
        "company": "DELSOL Avocats",
        "email": "contact@delsolavocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires, fiscalité et organisations non lucratives",
        "axis": "C",
        "source": "Site officiel delsolavocats.com"
    },
    {
        "company": "Herald Avocats",
        "email": "contact@herald-avocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit économique, contentieux et restructuration",
        "axis": "C",
        "source": "Site officiel herald-avocats.com"
    },
    {
        "company": "Alerion Avocats",
        "email": "paris@alerionavocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit commercial, fiscalité et corporate international",
        "axis": "C",
        "source": "Site officiel alerionavocats.com"
    },
    {
        "company": "Kalliopé Avocats",
        "email": "contact@kalliope-law.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires, énergie et infrastructures",
        "axis": "C",
        "source": "Site officiel kalliope-law.com"
    },
    {
        "company": "Villechenon Avocats",
        "email": "contact@villechenon.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Venture capital, private equity et fusions-acquisitions",
        "axis": "C",
        "source": "Site officiel villechenon.com"
    },
    {
        "company": "Astura Avocats",
        "email": "contact@astura.fr",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "M&A, droit des technologies et propriété intellectuelle",
        "axis": "C",
        "source": "Site officiel astura.fr"
    },
    {
        "company": "HFW Paris Avocats",
        "email": "hfwenquiries@hfw.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit maritime, commerce international et énergie",
        "axis": "C",
        "source": "Site officiel hfw.com"
    },

    # 5. Pépites d'Excellence & Terroir Mondial (Axe B - Vente Directe & DDC Pulse)
    {
        "company": "Parfumerie Tiki Tahiti",
        "email": "contact@monoitiki.pf",
        "contact_name": "Direction",
        "territory": "Polynésie française (Papeete)",
        "sector": "Monoï authentique de Tahiti et cosmétiques solaires",
        "axis": "B",
        "source": "Site officiel monoitiki.pf"
    },
    {
        "company": "Délices de Guyane Paris",
        "email": "boutiqueparis@delicesdeguyane.com",
        "contact_name": "Direction Commerciale",
        "territory": "Guyane et Paris",
        "sector": "Condiments exotiques, confitures et saveurs amazoniennes",
        "axis": "B",
        "source": "Site officiel delicesdeguyane.com"
    }
]

print(f"Total leads 64 à générer: {len(LEADS_DATA)}")

batch = []

for lead in LEADS_DATA:
    axis = lead["axis"]
    company = lead["company"]
    contact_name = lead["contact_name"]
    territory = lead["territory"]
    sector = lead["sector"]
    
    if axis == "C":
        subject = f"Synergies d'affaires et collaborations avec Domtom Connect / {company}"
        body = f"""Bonjour {contact_name},

Je me permets de vous contacter car l'expertise de {company} en matière de {sector} retient toute notre attention sur le territoire de {territory}.

Domtom Connect anime un réseau d'affaires d'envergure réunissant des entrepreneurs, investisseurs et décideurs économiques à travers toute la Caraïbe, le continent africain et sa diaspora.

Nos membres et partenaires recherchent en permanence des interlocuteurs de premier plan pour structurer leurs projets, sécuriser leurs investissements et accélérer leurs opérations. Nous serions ravis d'échanger avec vous afin d'envisager des synergies concrètes et des partages d'affaires mutuels.

Si cette perspective résonne avec vos priorités de développement, vous pouvez choisir un créneau qui vous convient directement via ce lien,

calendly.com/domtomconnect/30min

Au plaisir d'échanger prochainement,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""

    else:
        subject = f"Canal de vente directe et visibilité diaspora avec Domtom Connect / {company}"
        body = f"""Bonjour {contact_name},

La qualité remarquable des créations signées {company} fait référence sur le territoire de {territory}, et nous suivons votre actualité avec un vif intérêt.

Domtom Connect développe des solutions de mise en avant et de commercialisation directe ciblant activement une communauté qualifiée d'acheteurs et de professionnels répartis sur toute la Caraïbe, le continent africain et sa diaspora.

À travers notre canal DDC Pulse et nos dispositifs de vente directe, nous offrons aux marques d'exception un accès immédiat à ces marchés captifs en demande de produits authentiques.

Seriez-vous ouvert à un bref échange d'une quinzaine de minutes afin d'explorer comment activer ces flux de commandes pour {company} ?

Vous pouvez retenir le créneau de votre choix en toute simplicité ici,

calendly.com/domtomconnect/30min

Au plaisir d'échanger prochainement,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""

    # Contrôles stricts de conformité
    if ":" in subject or ":" in body:
        raise ValueError(f"Erreur deux-points détectée pour {company}")
    if " - " in subject or " - " in body:
        raise ValueError(f"Erreur tiret d'incise détectée pour {company}")
    if "toute la Caraïbe, le continent africain et sa diaspora" not in body:
        raise ValueError(f"Formule sacrée absente pour {company}")
    if "entraide" in body.lower() or "entraide" in subject.lower():
        raise ValueError(f"Mot interdit entraide détecté pour {company}")

    batch.append({
        "company": company,
        "email": lead["email"],
        "territory": territory,
        "sector": sector,
        "axis": axis,
        "source": lead["source"],
        "subject": subject,
        "body": body
    })

output_path = "scripts/batch_64_patrimoine_prestige_50.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(batch, f, indent=2, ensure_ascii=False)

print(f"Batch 64 généré avec succès dans {output_path} ({len(batch)} cibles conformes à 100%).")
