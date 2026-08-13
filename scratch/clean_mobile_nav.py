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
        print(f"Skipping missing file: {file_path}")
        continue

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Supprimer le bloc HTML static mobile-menu-backdrop & mobile-menu-sheet
    content = re.sub(
        r'<!-- Mobile Bottom Sheet Menu -->\s*<div id="mobile-menu-backdrop".*?</div>\s*<div id="mobile-menu-sheet".*?</div>\s*</div>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Variante sans commentaire ou div imbriquée
    content = re.sub(
        r'<div id="mobile-menu-backdrop".*?</div>\s*<div id="mobile-menu-sheet".*?</div>\s*</div>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Variante générique si mobile-menu-sheet n'a pas été capturé par la regex ci-dessus
    content = re.sub(
        r'<div id="mobile-menu-sheet" class="mobile-menu-sheet">.*?</div>\s*</div>\s*</div>',
        '',
        content,
        flags=re.DOTALL
    )

    # 2. Supprimer la fonction JS inline toggleMobileMenu()
    content = re.sub(
        r'function toggleMobileMenu\(\)\s*\{.*?\n\s*\}',
        '',
        content,
        flags=re.DOTALL
    )

    # 3. Vérifier la présence du script mobile-nav.js
    script_path = "../assets/js/mobile-nav.js?v=12.00" if ("marketplace" in file_path or "admin" in file_path) else "./assets/js/mobile-nav.js?v=12.00"
    script_tag = f'<script src="{script_path}"></script>'

    if "mobile-nav.js" not in content:
        # Inserer avant </body>
        if "</body>" in content:
            content = content.replace("</body>", f"    {script_tag}\n</body>")
        else:
            content += f"\n{script_tag}\n"
    else:
        # S'assurer que le script tag a le bon timestamp / version
        content = re.sub(r'<script src="(?:\./|\.\./)?assets/js/mobile-nav\.js(?:\?v=[\d\.]+)?"></script>', script_tag, content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Processed: {os.path.basename(file_path)}")
