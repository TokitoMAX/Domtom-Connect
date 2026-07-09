import os
import glob

html_files = glob.glob('d:/DomtomConnect-Website/*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('incubator.module.js?v=1.4', 'incubator.module.js?v=1.5')
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Bumped cache version in {file}")
