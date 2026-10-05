import urllib.request
import json
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            return response.getcode(), response.read().decode('utf-8', errors='ignore'), dict(response.info())
    except Exception as e:
        return None, str(e), {}

# 1. Check Homepage
code, html, resp_headers = fetch("https://nuabol.fr")
print("=== HOMEPAGE STATUS ===")
print("HTTP Code:", code)
print("Server / Tech:", resp_headers.get('Server'), resp_headers.get('X-Powered-By'))

if code == 200:
    soup = BeautifulSoup(html, 'html.parser')
    print("\n=== SEO METADATA ===")
    print("Title:", soup.title.string if soup.title else "NO TITLE")
    
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    print("Meta Description:", meta_desc.get('content') if meta_desc else "NO META DESCRIPTION")
    
    meta_robots = soup.find('meta', attrs={'name': 'robots'})
    print("Meta Robots:", meta_robots.get('content') if meta_robots else "None (default index, follow)")
    
    canonical = soup.find('link', attrs={'rel': 'canonical'})
    print("Canonical Link:", canonical.get('href') if canonical else "NO CANONICAL")
    
    print("\n=== HEADINGS STRUCTURE ===")
    h1s = soup.find_all('h1')
    print(f"H1 tags count: {len(h1s)}")
    for h1 in h1s:
        print("  - H1:", h1.get_text(strip=True))
        
    h2s = soup.find_all('h2')
    print(f"H2 tags count: {len(h2s)}")
    for h2 in h2s[:5]:
        print("  - H2:", h2.get_text(strip=True))

    print("\n=== SCHEMA.ORG / JSON-LD ===")
    schemas = soup.find_all('script', attrs={'type': 'application/ld+json'})
    print(f"JSON-LD scripts count: {len(schemas)}")
    for s in schemas:
        print("Schema content:\n", s.string[:400] if s.string else "")

    print("\n=== IMAGES ALT TEXT ===")
    imgs = soup.find_all('img')
    without_alt = [img.get('src') for img in imgs if not img.get('alt')]
    print(f"Total images: {len(imgs)}, without alt: {len(without_alt)}")

    print("\n=== INTERNAL & EXTERNAL LINKS ===")
    links = [a.get('href') for a in soup.find_all('a') if a.get('href')]
    print(f"Total links: {len(links)}")
    print("Sample links:", links[:8])

# 2. Check robots.txt & sitemap.xml
print("\n=== ROBOTS.TXT ===")
r_code, r_text, _ = fetch("https://nuabol.fr/robots.txt")
print("robots.txt code:", r_code)
print("robots.txt content:\n", r_text[:300] if r_text else "Empty")

print("\n=== SITEMAP.XML ===")
s_code, s_text, _ = fetch("https://nuabol.fr/sitemap.xml")
print("sitemap.xml code:", s_code)
print("sitemap.xml content snippet:\n", s_text[:300] if s_text else "Empty")
