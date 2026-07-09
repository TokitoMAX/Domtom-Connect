import re
from bs4 import BeautifulSoup
import os

blog_path = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\blog\index.html'
index_path = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\index.html'

with open(blog_path, 'r', encoding='utf-8') as f:
    blog_html = f.read()

with open(index_path, 'r', encoding='utf-8') as f:
    index_html = f.read()

# 1. Get the mega footer from index.html
soup_index = BeautifulSoup(index_html, 'html.parser')
mega_footer = soup_index.find('footer', class_='footer')

# Adjust links in mega_footer to be relative to blog/ (add ../ to local links)
if mega_footer:
    for a in mega_footer.find_all('a'):
        href = a.get('href', '')
        if href and not href.startswith('http') and not href.startswith('#') and not href.startswith('mailto:'):
            if href.startswith('/'):
                a['href'] = '..' + href
            else:
                a['href'] = '../' + href
    for img in mega_footer.find_all('img'):
        src = img.get('src', '')
        if src and not src.startswith('http'):
            if src.startswith('/'):
                img['src'] = '..' + src
            else:
                img['src'] = '../' + src

# 2. Modify blog.html
soup_blog = BeautifulSoup(blog_html, 'html.parser')

# Replace footer
old_footer = soup_blog.find('footer', class_='footer')
if old_footer and mega_footer:
    old_footer.replace_with(mega_footer)

# Find carousel articles that are not the 4 podcasts
carousel = soup_blog.find('div', class_='articles-carousel-track')
if carousel:
    articles = carousel.find_all('article')
    new_articles_for_grid = []
    
    for article in articles:
        # Check if it has a date. The 50 new ones don't have data-date in the HTML snippet I saw
        if not article.has_attr('data-date'):
            # Clone it
            from copy import copy
            grid_article = BeautifulSoup(str(article), 'html.parser').article
            grid_article['class'] = ['blog-card'] # remove carousel-card
            grid_article['data-date'] = '2026-07-09'
            new_articles_for_grid.append(grid_article)
            
            # also add data-date to the carousel article for consistency?
            article['data-date'] = '2026-07-09'

    # Add them to blog-grid
    blog_grid = soup_blog.find('div', class_='blog-grid')
    if blog_grid:
        for new_art in new_articles_for_grid:
            blog_grid.append(new_art)

# Write back
with open(blog_path, 'w', encoding='utf-8') as f:
    # bs4 can mess up formatting a bit, but it should be fine. We can format it using prettier later if needed.
    # Actually, bs4 might convert things to lower case, but HTML is case insensitive.
    f.write(str(soup_blog))
print("Successfully updated blog/index.html")
