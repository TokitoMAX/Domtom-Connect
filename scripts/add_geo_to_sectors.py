import os

sector_files = [
    "entreprises-btp.html",
    "entreprises-tourisme.html",
    "entreprises-ingenierie.html",
    "entreprises-juridique.html",
    "marques-agroalimentaire.html",
    "marques-cosmetique.html",
    "entreprises.html",
    "marques.html",
    "guide-entrepreneur.html"
]

geo_block = """    <!-- GEO Targeting Meta Tags -->
    <meta name="geo.region" content="FR-GP, FR-MQ, FR-GF, FR-RE, FR-YT, FR-PF, FR">
    <meta name="geo.placename" content="Guadeloupe, Martinique, Guyane, La Réunion, Mayotte, Polynésie française, Paris">
"""

for fn in sector_files:
    if not os.path.exists(fn):
        continue
    with open(fn, "r", encoding="utf-8") as f:
        c = f.read()
    if 'name="geo.region"' not in c:
        if '<meta name="keywords"' in c:
            c = c.replace('<meta name="keywords"', geo_block + '    <meta name="keywords"', 1)
        elif '<link rel="canonical"' in c:
            c = c.replace('<link rel="canonical"', geo_block + '    <link rel="canonical"', 1)
        with open(fn, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"Added GEO meta to {fn}")

print("Done.")
