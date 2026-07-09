import os
import glob

html_files = glob.glob('*.html')
target_string = '<script src="./assets/js/modules/incubator.module.js?v=1.3"></script>'
replacement = target_string + '\n    <script src="./assets/js/modules/services.module.js?v=1.0"></script>'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if target_string in content and 'services.module.js' not in content:
        new_content = content.replace(target_string, replacement)
        
        # Also let's make sure there is a <div id="services-view" class="view-section" style="display:none;"></div> next to incubator-view
        view_target = '<div id="incubator-view" class="view-section" style="display:none;"></div>'
        view_replacement = view_target + '\n                <div id="services-view" class="view-section" style="display:none;"></div>'
        if view_target in new_content and 'id="services-view"' not in new_content:
            new_content = new_content.replace(view_target, view_replacement)
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched {file}")
