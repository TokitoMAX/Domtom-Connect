import os

sectors = {
    "entreprises-btp.html": {
        "name": "Accompagnement & Copilotage BTP et Artisans Outre-Mer",
        "description": "Accompagnement opérationnel, sécurisation des marges et copilotage d'intendance pour dirigeants du bâtiment et de la construction en Guadeloupe, Martinique, Guyane et Réunion.",
        "serviceType": "Conseil et Copilotage BTP Insulaire"
    },
    "entreprises-tourisme.html": {
        "name": "Accompagnement & Copilotage Tourisme, Hôtellerie et Écolodges Outre-Mer",
        "description": "Optimisation des réservations directes, structuration financière et copilotage pour exploitants touristiques et hôteliers aux Antilles et dans l'Océan Indien.",
        "serviceType": "Conseil et Copilotage Tourisme Insulaire"
    },
    "entreprises-ingenierie.html": {
        "name": "Accompagnement & Structuration Bureaux d'Études et Ingénierie Outre-Mer",
        "description": "Organisation des processus, gestion de trésorerie et copilotage pour cabinets d'ingénierie et bureaux d'études en milieu insulaire.",
        "serviceType": "Conseil et Organisation Ingénierie"
    },
    "entreprises-juridique.html": {
        "name": "Accompagnement & Fluidification Opérationnelle Cabinets Juridiques Outre-Mer",
        "description": "Délégation d'intendance, organisation des flux et développement d'activité pour avocats et professionnels du droit en Outre-Mer.",
        "serviceType": "Conseil et Support Opérationnel Juridique"
    },
    "marques-agroalimentaire.html": {
        "name": "Accompagnement Marques de Terroir et Agroalimentaire Outre-Mer",
        "description": "Valorisation des produits locaux, circuits de distribution, conformité export et rentabilité des marques agroalimentaires ultramarines.",
        "serviceType": "Développement Commercial Agroalimentaire"
    },
    "marques-cosmetique.html": {
        "name": "Accompagnement Marques Cosmétiques et Pharmacopée Caribéenne",
        "description": "Développement de marque, stratégie omnicanale et scaling pour marques de cosmétique naturelle et valorisation des plantes médicinales tropicales.",
        "serviceType": "Développement Commercial Cosmétique"
    }
}

for filename, data in sectors.items():
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        continue
    
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "schema.org" in content:
        print(f"Already has schema: {filename}")
        continue
    
    schema_block = f"""    <!-- GEO Targeting & SEO Structured Data -->
    <meta name="geo.region" content="FR-GP, FR-MQ, FR-GF, FR-RE, FR-YT, FR-PF, FR">
    <meta name="geo.placename" content="Guadeloupe, Martinique, Guyane, La Réunion, Mayotte, Polynésie française, Paris">
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "{data['name']}",
      "serviceType": "{data['serviceType']}",
      "description": "{data['description']}",
      "url": "https://domtomconnect.com/{filename.replace('.html', '')}",
      "provider": {{
        "@type": "Organization",
        "name": "Domtom Connect",
        "url": "https://domtomconnect.com",
        "founder": {{
          "@type": "Person",
          "name": "Loïc Villeronce",
          "telephone": "+33620783377"
        }}
      }},
      "areaServed": [
        "Guadeloupe",
        "Martinique",
        "Guyane",
        "La Réunion",
        "Mayotte",
        "Polynésie française",
        "France"
      ]
    }}
    </script>
"""
    target = '<link rel="preconnect"'
    if target in content:
        content = content.replace(target, schema_block + "    " + target, 1)
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Successfully injected Schema & GEO into {filename}")
    else:
        print(f"Target '{target}' not found in {filename}")

print("Done.")
