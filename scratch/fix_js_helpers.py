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

    # Nettoyer les résidus de toggleMobileMenu et du commentaire
    content = re.sub(r'// Inline UI Helpers \(Restored for Dashboard context\)\s*else\s*\{.*?\n\s*\}\s*\}\s*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'// Inline UI Helpers \(Restored for Dashboard context\)', '', content)
    content = re.sub(r'function toggleMobileMenu\(\)\s*\{.*?if \(btn\) btn\.classList\.toggle\(\'active\'\);\s*\}\s*\}', '', content, flags=re.DOTALL)
    
    # Nettoyer tout résidu orphelin 'else { backdrop.style.display ...'
    content = re.sub(r'else\s*\{\s*backdrop\.style\.display\s*=\s*\'block\';.*?\n\s*\}\s*\}\s*\}', '', content, flags=re.DOTALL)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Cleaned residue in: {os.path.basename(file_path)}")
