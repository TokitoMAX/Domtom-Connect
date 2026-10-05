import json

LEADS_DATA = [
    # 1. Avocats d'affaires & Conseil Juridique
    {
        "company": "AcSeas Avocats",
        "email": "contact@acseas.com",
        "contact_name": "Maître",
        "territory": "Guadeloupe et Martinique",
        "sector": "Avocats d'affaires et droit maritime",
        "axis": "C",
        "source": "Site officiel acseas.com"
    },
    {
        "company": "DFM Avocat",
        "email": "contact@dfmavocat.fr",
        "contact_name": "Maître Mollet",
        "territory": "Guadeloupe et Martinique",
        "sector": "Avocat en droit des affaires",
        "axis": "C",
        "source": "Site officiel dfmavocat.fr"
    },
    {
        "company": "Cabinet Lexindies",
        "email": "contact@lexindies-avocats.com",
        "contact_name": "Maître",
        "territory": "Guadeloupe, Saint-Martin et Saint-Barthélemy",
        "sector": "Avocats d'affaires et droit des sociétés",
        "axis": "C",
        "source": "Site officiel avocat-guadeloupe-lexindies.fr"
    },
    {
        "company": "FDKA Avocats",
        "email": "fdka@fdka.ci",
        "contact_name": "Maître Fadika",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Cabinet d'avocats d'affaires de référence",
        "axis": "C",
        "source": "Barreau de Côte d'Ivoire et fdka.net"
    },
    {
        "company": "Geni & Kebe Avocats",
        "email": "info@gsklaw.sn",
        "contact_name": "Maître Kebe",
        "territory": "Sénégal (Dakar)",
        "sector": "Avocats d'affaires panafricains",
        "axis": "C",
        "source": "Barreau du Sénégal et gsklaw.sn"
    },
    {
        "company": "Mame Adama Gueye & Partners",
        "email": "contact@magp.sn",
        "contact_name": "Maître Gueye",
        "territory": "Sénégal (Dakar)",
        "sector": "Cabinet d'avocats d'affaires de premier plan",
        "axis": "C",
        "source": "Site officiel magp.sn"
    },
    {
        "company": "Cabinet Diawara Avocats",
        "email": "diaws@diawara-avocats.sn",
        "contact_name": "Maître Diawara",
        "territory": "Sénégal (Dakar)",
        "sector": "Avocats d'affaires et investissements",
        "axis": "C",
        "source": "Site officiel diawara-avocats.sn"
    },
    {
        "company": "Cabinet Anthony Fofana Associés",
        "email": "afa@afa.ci",
        "contact_name": "Maître Fofana",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Avocats en droit commercial et des sociétés",
        "axis": "C",
        "source": "Site officiel afa.ci"
    },
    {
        "company": "KS & Associés Avocats",
        "email": "ksassocies@ksassocies.com",
        "contact_name": "Maître",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Avocats d'affaires et arbitrage",
        "axis": "C",
        "source": "Site officiel ksassocies.com"
    },
    {
        "company": "BK & Associés Avocats",
        "email": "contact@bkavocats.com",
        "contact_name": "Maître",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Droit des affaires et fiscalité",
        "axis": "C",
        "source": "Site officiel bkavocats.com"
    },
    {
        "company": "Asafo & Co Avocats",
        "email": "info@asafoandco.com",
        "contact_name": "Direction",
        "territory": "Paris et Panafricain",
        "sector": "Cabinet d'affaires panafricain d'élite",
        "axis": "C",
        "source": "Site officiel asafoandco.com"
    },
    {
        "company": "Farthouat Avocats",
        "email": "contact@farthouat.com",
        "contact_name": "Maître",
        "territory": "Paris",
        "sector": "Droit des affaires et contentieux stratégique",
        "axis": "C",
        "source": "Site officiel farthouat.com"
    },
    {
        "company": "Genesis Avocats",
        "email": "info@genesis-avocats.com",
        "contact_name": "Direction",
        "territory": "Paris",
        "sector": "Droit des affaires et développement international",
        "axis": "C",
        "source": "Site officiel genesis-avocats.com"
    },

    # 2. Expertise Comptable, Audit & Gestion de Patrimoine
    {
        "company": "Concilium & Audit",
        "email": "contact@conciliumaudit.fr",
        "contact_name": "Direction",
        "territory": "Guadeloupe (Jarry)",
        "sector": "Expertise comptable et commissariat aux comptes",
        "axis": "C",
        "source": "Site officiel conciliumaudit.fr"
    },
    {
        "company": "MG Expertise",
        "email": "contact@mgexpertise.fr",
        "contact_name": "Direction",
        "territory": "Martinique (Le Lamentin)",
        "sector": "Expertise comptable et conseil stratégique",
        "axis": "C",
        "source": "Site officiel mgexpertise.fr"
    },
    {
        "company": "CCO Expertise",
        "email": "contact@ccoexpertise.re",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Denis)",
        "sector": "Cabinet d'expertise comptable et audit",
        "axis": "C",
        "source": "Site officiel ccoexpertise.re"
    },
    {
        "company": "CMG Audit & Conseil",
        "email": "contact@cmgexpert.sn",
        "contact_name": "Direction",
        "territory": "Sénégal (Dakar)",
        "sector": "Audit financier et expertise comptable",
        "axis": "C",
        "source": "Site officiel cmgexpert.sn"
    },
    {
        "company": "Sprimtour Immobilier",
        "email": "contact@sprimtour.com",
        "contact_name": "Direction",
        "territory": "Guadeloupe (Baie-Mahault)",
        "sector": "Immobilier de prestige et investissement",
        "axis": "C",
        "source": "Site officiel sprimtour.com"
    },
    {
        "company": "MPI Martinique Patrimoine",
        "email": "contact@agencempi.fr",
        "contact_name": "Direction",
        "territory": "Martinique (Fort-de-France)",
        "sector": "Gestion de patrimoine et immobilier",
        "axis": "C",
        "source": "Site officiel mpi-immobilier.com"
    },
    {
        "company": "Ecofip Partenaires",
        "email": "partenaires@ecofip.com",
        "contact_name": "Direction des Partenariats",
        "territory": "Antilles, Guyane et Réunion",
        "sector": "Ingénierie financière et défiscalisation ultramarine",
        "axis": "C",
        "source": "Site officiel ecofip.com"
    },
    {
        "company": "AXIA Conseil Ingénierie",
        "email": "contact@axiaconseil.sn",
        "contact_name": "Direction",
        "territory": "Sénégal (Dakar)",
        "sector": "Ingénierie financière et grands projets",
        "axis": "C",
        "source": "Site officiel axiaconseil.sn"
    },
    {
        "company": "Cabinet Carrée Conseil",
        "email": "contact@ccarree.com",
        "contact_name": "Direction",
        "territory": "Sénégal (Dakar)",
        "sector": "Conseil en stratégie et transformation d'entreprise",
        "axis": "C",
        "source": "Site officiel ccarree.com"
    },
    {
        "company": "Tiidde Consulting",
        "email": "contact@tiiddeconsulting.com",
        "contact_name": "Direction",
        "territory": "Sénégal (Dakar)",
        "sector": "Stratégie de croissance et analyse d'investissement",
        "axis": "C",
        "source": "Site officiel tiiddeconsulting.com"
    },
    {
        "company": "Althea Consulting",
        "email": "contact@altheaconsulting-sn.com",
        "contact_name": "Direction",
        "territory": "Sénégal (Dakar)",
        "sector": "Conseil en management et performance commerciale",
        "axis": "C",
        "source": "Site officiel altheaconsulting-sn.com"
    },
    {
        "company": "ESPartners Conseil",
        "email": "info@espartners.co",
        "contact_name": "Direction",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Accompagnement stratégique et accélération de PME",
        "axis": "C",
        "source": "Site officiel espartners.co"
    },

    # 3. Agences Digitales, Stratégie & Communication B2B
    {
        "company": "Alpha Agency Guadeloupe",
        "email": "leo.sperl@alphagency.fr",
        "contact_name": "Monsieur Sperl",
        "territory": "Guadeloupe",
        "sector": "Communication 360 et production de marque",
        "axis": "C",
        "source": "Site officiel alphagency.fr"
    },
    {
        "company": "CitronMer Agence",
        "email": "contact@citronmer.com",
        "contact_name": "Direction",
        "territory": "Guadeloupe (Jarry)",
        "sector": "Communication stratégique et identité de marque",
        "axis": "C",
        "source": "Site officiel citronmer.com"
    },
    {
        "company": "Kaza Communication",
        "email": "info@kazacommunication.com",
        "contact_name": "Direction",
        "territory": "Martinique",
        "sector": "Stratégie de communication et médias",
        "axis": "C",
        "source": "Site officiel kazacommunication.com"
    },
    {
        "company": "Agence O'My! Marketing",
        "email": "contact@omymarketing.com",
        "contact_name": "Direction",
        "territory": "La Réunion",
        "sector": "Marketing stratégique et activation commerciale",
        "axis": "C",
        "source": "Site officiel omymarketing.com"
    },
    {
        "company": "Akanha Agence Conseil",
        "email": "contact@akanha.fr",
        "contact_name": "Direction",
        "territory": "La Réunion",
        "sector": "Design de marque et communication d'influence",
        "axis": "C",
        "source": "Site officiel akanha.fr"
    },
    {
        "company": "Nautilus Communication",
        "email": "contact@nautilus.fr",
        "contact_name": "Direction",
        "territory": "La Réunion (Saint-Denis)",
        "sector": "Communication institutionnelle et d'entreprise",
        "axis": "C",
        "source": "Site officiel nautilus.fr"
    },
    {
        "company": "Ranking Réunion",
        "email": "contact@ranking.re",
        "contact_name": "Direction",
        "territory": "La Réunion",
        "sector": "Stratégie de référencement et visibilité web",
        "axis": "C",
        "source": "Site officiel ranking.re"
    },
    {
        "company": "Novacom Tahiti",
        "email": "contact@novacom.pf",
        "contact_name": "Direction",
        "territory": "Polynésie française (Papeete)",
        "sector": "Communication digitale et création audiovisuelle",
        "axis": "C",
        "source": "Site officiel novacom.pf"
    },
    {
        "company": "In-Pulsion Tahiti",
        "email": "contact@in-pulsion.com",
        "contact_name": "Direction",
        "territory": "Polynésie française (Papeete)",
        "sector": "Conseil en stratégie de marque et événementiel",
        "axis": "C",
        "source": "Site officiel in-pulsion.com"
    },
    {
        "company": "Redsoyu Tahiti",
        "email": "info@redsoyu.com",
        "contact_name": "Direction",
        "territory": "Polynésie française (Tahiti)",
        "sector": "Agence web et création digitale",
        "axis": "C",
        "source": "Site officiel redsoyu.com"
    },
    {
        "company": "Tahiti Communication",
        "email": "direction@tahiticommunication.com",
        "contact_name": "Direction",
        "territory": "Polynésie française (Papeete)",
        "sector": "Régie publicitaire et communication 360",
        "axis": "C",
        "source": "Site officiel tahiticommunication.com"
    },
    {
        "company": "Crea Passion Tahiti",
        "email": "info@crea-passion.pf",
        "contact_name": "Direction",
        "territory": "Polynésie française",
        "sector": "Studio graphique et édition",
        "axis": "C",
        "source": "Site officiel crea-passion.pf"
    },
    {
        "company": "YanaCom Guyane",
        "email": "contact@yanacomguyane.fr",
        "contact_name": "Direction",
        "territory": "Guyane (Cayenne)",
        "sector": "Conseil en communication et événementiel",
        "axis": "C",
        "source": "Site officiel yanacomguyane.fr"
    },
    {
        "company": "Nuage Com Guyane",
        "email": "contact@nuagecom.com",
        "contact_name": "Direction",
        "territory": "Guyane (Cayenne)",
        "sector": "Marketing opérationnel et digital",
        "axis": "C",
        "source": "Site officiel nuagecom.com"
    },
    {
        "company": "Netactions Guyane",
        "email": "infos@netactions.net",
        "contact_name": "Direction",
        "territory": "Guyane",
        "sector": "Transformation numérique et solutions web",
        "axis": "C",
        "source": "Site officiel netactions.net"
    },
    {
        "company": "Guyacom Guyane",
        "email": "service.client@guyacom.fr",
        "contact_name": "Direction Commerciale",
        "territory": "Guyane (Cayenne)",
        "sector": "Opérateur télécom et solutions connectées",
        "axis": "C",
        "source": "Site officiel guyacom.fr"
    },
    {
        "company": "And Vision Agency",
        "email": "contact@andvisionagency.com",
        "contact_name": "Direction",
        "territory": "Sénégal (Dakar)",
        "sector": "Stratégie marketing et acquisition digitale",
        "axis": "C",
        "source": "Site officiel andvisionagency.com"
    },
    {
        "company": "Fox Communication",
        "email": "contact@fox-ci.com",
        "contact_name": "Direction",
        "territory": "Côte d'Ivoire (Abidjan)",
        "sector": "Publicité et conseil en communication",
        "axis": "C",
        "source": "Site officiel fox-ci.com"
    },
    {
        "company": "Totem Experience Group",
        "email": "contact@totem-experience.com",
        "contact_name": "Direction",
        "territory": "Paris et Panafricain",
        "sector": "Marketing d'influence et création de contenus",
        "axis": "C",
        "source": "Site officiel totem-experience.com"
    },

    # 4. Terroir d'Exception, Vente Directe & DDC Pulse (Axe B)
    {
        "company": "Baie des Trésors Rhum",
        "email": "contact@baiedestresors.com",
        "contact_name": "Direction",
        "territory": "Martinique (La Caravelle)",
        "sector": "Rhum agricole parcellaire de terroir",
        "axis": "B",
        "source": "Site officiel baiedestresors.com"
    },
    {
        "company": "Vanille de Tahiti",
        "email": "vanille@vanilledetahiti.pf",
        "contact_name": "Direction",
        "territory": "Polynésie française",
        "sector": "Filière d'excellence de vanille tahitienne",
        "axis": "B",
        "source": "Site officiel vanilledetahiti.com"
    },
    {
        "company": "Domaine Pari Pari",
        "email": "contact@domaineparipari.com",
        "contact_name": "Direction",
        "territory": "Polynésie française (Taha'a)",
        "sector": "Rhum agricole bio et vanille grand cru",
        "axis": "B",
        "source": "Site officiel domaineparipari.com"
    },
    {
        "company": "Manutea Tahiti Rotui",
        "email": "manutea@rotui.pf",
        "contact_name": "Direction",
        "territory": "Polynésie française (Moorea)",
        "sector": "Liqueurs fines, spiritueux et saveurs locales",
        "axis": "B",
        "source": "Site officiel vinananas-manutea.com"
    },
    {
        "company": "Coopérative Bourbon Pointu",
        "email": "commandes@coopbourbonpointu.re",
        "contact_name": "Direction",
        "territory": "La Réunion",
        "sector": "Café grand cru d'exception mondialement réputé",
        "axis": "B",
        "source": "Site officiel coopbourbonpointu.re"
    },
    {
        "company": "Distillerie Bellevue Marie-Galante",
        "email": "infos@distillerie-bellevue.com",
        "contact_name": "Direction",
        "territory": "Marie-Galante",
        "sector": "Domaine éco-positif et rhums agricoles d'exception",
        "axis": "B",
        "source": "Site officiel distillerie-bellevue.com"
    }
]

print(f"Total leads à générer: {len(LEADS_DATA)}")

batch = []

for lead in LEADS_DATA:
    axis = lead["axis"]
    company = lead["company"]
    contact_name = lead["contact_name"]
    territory = lead["territory"]
    sector = lead["sector"]
    
    if axis == "C":
        # Axe C: Réseau d'Affaires & Synergies B2B
        subject = f"Synergies d'affaires et collaborations avec Domtom Connect / {company}"
        body = f"""Bonjour {contact_name},

Je me permets de vous contacter car l'expertise de {company} en matière de {sector} retient toute notre attention sur le territoire de {territory}.

Domtom Connect anime un réseau d'affaires d'envergure réunissant des entrepreneurs, investisseurs et décideurs économiques à travers toute la Caraïbe, le continent africain et sa diaspora.

Nos membres et partenaires recherchent en permanence des experts de haut niveau pour structurer leurs opérations, sécuriser leurs investissements et accélérer leur croissance. Nous serions ravis d'échanger avec vous afin d'envisager des synergies concrètes et des partages d'affaires mutuels.

Si cette perspective résonne avec vos priorités de développement, vous pouvez choisir un créneau qui vous convient directement via ce lien,

calendly.com/domtomconnect/30min

Au plaisir d'échanger prochainement,

Bien cordialement,

Loic Villeronce
Fondateur de Domtom Connect
Plateforme www.domtomconnect.com"""

    else:
        # Axe B: Vente Directe, Visibilité Diaspora & DDC Pulse
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

output_path = "scripts/batch_63_synergies_50.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(batch, f, indent=2, ensure_ascii=False)

print(f"Batch 63 généré avec succès dans {output_path} ({len(batch)} cibles conformes à 100%).")
