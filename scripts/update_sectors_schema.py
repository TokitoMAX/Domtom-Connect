import os

sectors = {
    "entreprises-btp.html": {
        "name": "Accompagnement & Copilotage BTP et Artisans Outre-Mer",
        "description": "Accompagnement opérationnel, sécurisation des marges et copilotage d'intendance pour dirigeants du bâtiment et de la construction en Guadeloupe, Martinique, Guyane et Réunion.",
        "serviceType": "Conseil et Copilotage BTP Insulaire",
        "keywords": ["BTP Guadeloupe", "BTP Martinique", "BTP Réunion", "Artisans Bâtiment Outre-Mer"]
    },
    "entreprises-tourisme.html": {
        "name": "Accompagnement & Copilotage Tourisme, Hôtellerie et Écolodges Outre-Mer",
        "description": "Optimisation des réservations directes, structuration financière et copilotage pour exploitants touristiques et hôteliers aux Antilles et dans l'Océan Indien.",
        "serviceType": "Conseil et Copilotage Tourisme Insulaire",
        "keywords": ["Tourisme Guadeloupe", "Hôtellerie Martinique", "Gîtes Réunion", "Écolodges Caraïbes"]
    },
    "entreprises-ingenierie.html": {
        "name": "Accompagnement & Structuration Bureaux d'Études et Ingénierie Outre-Mer",
        "description": "Organisation des processus, gestion de trésorerie et copilotage pour cabinets d'ingénierie et bureaux d'études en milieu insulaire.",
        "serviceType": "Conseil et Organisation Ingénierie",
        "keywords": ["Ingénierie Outre-Mer", "Bureaux d'études Antilles", "Maîtrise d'œuvre Guyane"]
    },
    "entreprises-juridique.html": {
        "name": "Accompagnement & Fluidification Opérationnelle Cabinets Juridiques Outre-Mer",
        "description": "Délégation d'intendance, organisation des flux et développement d'activité pour avocats et professionnels du droit en Outre-Mer.",
        "serviceType": "Conseil et Support Opérationnel Juridique",
        "keywords": ["Avocats Guadeloupe", "Cabinets juridiques Martinique", "Droit Outre-Mer"]
    },
    "marques-agroalimentaire.html": {
        "name": "Accompagnement Marques de Terroir et Agroalimentaire Outre-Mer",
        "description": "Valorisation des produits locaux, circuits de distribution, conformité export et rentabilité des marques agroalimentaires ultramarines.",
        "serviceType": "Développement Commercial Agroalimentaire",
        "keywords": ["Terroir Antilles", "Agroalimentaire Réunion", "Export Caraïbes", "Produits locaux"]
    },
    "marques-cosmetique.html": {
        "name": "Accompagnement Marques Cosmétiques et Pharmacopée Caribéenne",
        "description": "Développement de marque, stratégie omnicanale et scaling pour marques de cosmétique naturelle et valorisation des plantes médicinales tropicales.",
        "serviceType": "Développement Commercial Cosmétique",
        "keywords": ["Cosmétique naturelle Antilles", "Pharmacopée caribéenne", "Skincare tropical"]
    }
}

base_dir = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect"

for filename, data in sectors.items():
    file_path = os.path.join(base_dir, filename)
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if 'schema.org' in content:
        continue
    
    schema_block = f"""    <!-- GEO & AI Structured Data (Schema.org Service) -->
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
    if '<link rel="preconnect"' in content:
        content = content.replace('<link rel="preconnect"', schema_block + '    <link rel="preconnect"', 1)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Added Schema.org to {filename}")

print("All sector pages updated with Schema.org Service.")
