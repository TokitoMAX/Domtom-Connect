import urllib.request
import re
from bs4 import BeautifulSoup
import random

blog_path = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\blog\index.html'
with open(blog_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

urls = set()
for img in soup.find_all('img'):
    src = img.get('src')
    if src and 'unsplash.com' in src:
        urls.add(src)

print(f'Checking {len(urls)} URLs...')
good_urls = []
for url in list(urls):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req)
        if resp.status == 200:
            good_urls.append(url)
    except Exception as e:
        pass

print(f'Found {len(good_urls)} good URLs.')
if not good_urls:
    print('No good URLs found, aborting.')
    exit(1)

# Sort them for deterministic cycling
good_urls.sort()

articles = soup.find_all('article', class_='blog-card')
print(f'Found {len(articles)} articles.')

modified_count = 0
for i, article in enumerate(articles):
    # 1. Fix broken images by cycling through good URLs
    img = article.find('img')
    if img:
        # Replace all images with a cycle of good URLs to ensure diversity and no broken links
        img['src'] = good_urls[i % len(good_urls)]
        
    # 2. Make image clickable
    img_container = article.find('div', class_='blog-card-image')
    h3_a = article.find('h3')
    if h3_a and h3_a.find('a'):
        target_link = h3_a.find('a').get('href')
        
        if img_container and img:
            # Check if it's already wrapped
            if not img.parent.name == 'a':
                # Create a new a tag
                a_tag = soup.new_tag('a', href=target_link)
                # Replace img with a_tag
                img.replace_with(a_tag)
                # Put img inside a_tag
                a_tag.append(img)
                modified_count += 1

print(f'Modified {modified_count} articles to be clickable.')

with open(blog_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
print('Saved blog/index.html')
