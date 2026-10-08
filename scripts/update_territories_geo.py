import os

territories_meta = {
    "guadeloupe": {
        "region": "FR-GP",
        "placename": "Guadeloupe",
        "position": "16.265;-61.551",
        "icbm": "16.265, -61.551"
    },
    "martinique": {
        "region": "FR-MQ",
        "placename": "Martinique",
        "position": "14.6415;-61.0242",
        "icbm": "14.6415, -61.0242"
    },
    "guyane": {
        "region": "FR-GF",
        "placename": "Guyane",
        "position": "4.9372;-52.3260",
        "icbm": "4.9372, -52.3260"
    },
    "reunion": {
        "region": "FR-RE",
        "placename": "La Réunion",
        "position": "-21.1151;55.5364",
        "icbm": "-21.1151, 55.5364"
    },
    "mayotte": {
        "region": "FR-YT",
        "placename": "Mayotte",
        "position": "-12.8275;45.1662",
        "icbm": "-12.8275, 45.1662"
    },
    "polynesie": {
        "region": "FR-PF",
        "placename": "Polynésie française",
        "position": "-17.6797;-149.4068",
        "icbm": "-17.6797, -149.4068"
    }
}

base_dir = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\territoires"

for t_name, data in territories_meta.items():
    file_path = os.path.join(base_dir, t_name, "index.html")
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if geo meta already present
    if 'name="geo.region"' not in content:
        geo_block = f"""    <!-- GEO Targeting Meta Tags -->
    <meta name="geo.region" content="{data['region']}">
    <meta name="geo.placename" content="{data['placename']}">
    <meta name="geo.position" content="{data['position']}">
    <meta name="ICBM" content="{data['icbm']}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
"""
        # Insert before canonical or after description
        if '<link rel="canonical"' in content:
            content = content.replace('<link rel="canonical"', geo_block + '    <link rel="canonical"', 1)
        elif '</head>' in content:
            content = content.replace('</head>', geo_block + '</head>', 1)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated geo tags for {t_name}")

print("All territory pages updated.")
