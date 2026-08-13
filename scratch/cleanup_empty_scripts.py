import os
import re

files_to_clean = [
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\mon-espace.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\dtc.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\pilotage.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\vitrine.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\business.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\billetterie.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\premium.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\messages.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\channel.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\profile.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\mastermind.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\epopee.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\candidatures.html",
    r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\tremplin.html"
]

for file_path in files_to_clean:
    if not os.path.exists(file_path):
        continue

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Supprimer les balises script vides ou contenant seulement ); }); ou des résidus isolés
    content = re.sub(r'<script>\s*[\);\s\}]*</script>', '', content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Verified & cleaned script tags in: {os.path.basename(file_path)}")
