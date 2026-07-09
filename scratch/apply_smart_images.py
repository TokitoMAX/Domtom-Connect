import os
import re
from bs4 import BeautifulSoup
import random

blog_path = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\blog\index.html'

with open(blog_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

image_categories = {
    'tech': [
        '1451187580459-43490279c0fa', '1498050108023-c5249f4df085', 
        '1461749280684-dccba630e2f6', '1504384308090-c894fdcc538d',
        '1517694712202-14dd9538aa97'
    ],
    'business': [
        '1454165804606-c3d57bc86b40', '1556761175-5973dc0f32b7', 
        '1542744173-8e7e53415bb0', '1522071820081-009f0129c71c',
        '1507679622114-c4a0298a004f'
    ],
    'finance': [
        '1611974789855-9c2a0a7236a3', '1553729459-efe14ef6055d', 
        '1460925895917-afdab827c52f', '1579225663312-fa8ce210f001'
    ],
    'tropical': [
        '1507525428034-b723cf961d3e', '1459749411175-04bf5292ceea', 
        '1544376798-89aa6b82c6cd', '1499793983690-e29da59ef1c2'
    ],
    'logistics': [
        '1586528116311-ad8ed7c1590a', '1578575437130-527eed3abbec',
        '1519681393784-d120267933ba'
    ],
    'agriculture': [
        '1500937386664-56d1dfef3854', '1416879598553-305942475ab0',
        '1523348837708-15d4a09af1ac'
    ]
}

def get_base_url(photo_id):
    return f"https://images.unsplash.com/photo-{photo_id}?auto=format&fit=crop&q=80&w=800"

articles = soup.find_all('article', class_='blog-card')
modified = 0

for article in articles:
    h3 = article.find('h3')
    if not h3: continue
    title = h3.text.lower()
    
    # Extract href from the <a> tag inside <h3>
    a_tag = h3.find('a')
    href = a_tag.get('href', '').lower() if a_tag else ''

    combined_text = title + ' ' + href
    
    # Determine category
    category = 'business' # default
    if any(kw in combined_text for kw in ['tech', 'saas', 'logiciel', 'app', 'digital', 'innovation', 'crm', 'web']):
        category = 'tech'
    elif any(kw in combined_text for kw in ['finance', 'investisseur', 'fonds', 'capital', 'business angel', 'levée', 'financement']):
        category = 'finance'
    elif any(kw in combined_text for kw in ['caraïbes', 'antilles', 'martinique', 'guadeloupe', 'guyane', 'réunion', 'île', 'outre-mer', 'diaspora', 'tourisme', 'tropical']):
        category = 'tropical'
    elif any(kw in combined_text for kw in ['logistique', 'export', 'import', 'fret', 'transport']):
        category = 'logistics'
    elif any(kw in combined_text for kw in ['agricol', 'agriculture', 'ferme', 'plantation']):
        category = 'agriculture'
    elif any(kw in combined_text for kw in ['marketing', 'b2b', 'vente', 'commerce', 'client', 'agence', 'consultant', 'mentor']):
        category = 'business'

    # Select random image from category
    photo_id = random.choice(image_categories[category])
    new_src = get_base_url(photo_id)
    
    img = article.find('img')
    if img and img.get('src') != new_src:
        img['src'] = new_src
        modified += 1

print(f"Assigned smart images to {modified} articles.")

with open(blog_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
