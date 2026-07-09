import os
import glob

html_files = glob.glob('d:/DomtomConnect-Website/*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to bump version for auth.js
    new_content = content.replace('auth.js', 'auth.js?v=2.0')
    new_content = new_content.replace('auth.js?v=2.0?v=2.0', 'auth.js?v=2.0') # Just in case it already had it
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Bumped cache version in {file}")
