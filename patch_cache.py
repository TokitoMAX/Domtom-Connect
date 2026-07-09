import os
import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to bump version for router.js, app.js, incubator.module.js, services.module.js
    new_content = content.replace('router.js?v=12.00', 'router.js?v=12.02')
    new_content = new_content.replace('app.js?v=12.00', 'app.js?v=12.02')
    new_content = new_content.replace('incubator.module.js?v=1.3', 'incubator.module.js?v=1.4')
    new_content = new_content.replace('services.module.js?v=1.0', 'services.module.js?v=1.1')
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Bumped cache version in {file}")
