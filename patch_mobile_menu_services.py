import os
import glob

html_files = glob.glob('*.html')
target_string = '<a href="premium.html" onclick="toggleMobileMenu()"><i class="fas fa-gem"></i> 1-to-1</a>'
replacement = target_string + '\n            <a href="mon-espace.html#services" onclick="toggleMobileMenu()"><i class="fas fa-handshake"></i> Copilotage</a>'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if target_string in content and 'href="mon-espace.html#services"' not in content:
        new_content = content.replace(target_string, replacement)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched menu in {file}")
