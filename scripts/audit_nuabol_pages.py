import urllib.request, ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            return response.getcode(), response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return None, str(e)

# Check all sitemaps
c, sitemap = fetch("https://www.nuabol.fr/sitemap.xml")
print("=== SITEMAP INDEX ===")
soup = BeautifulSoup(sitemap, 'html.parser')
for loc in soup.find_all('loc'):
    print("Sub-sitemap:", loc.text)
    sc, sub_xml = fetch(loc.text)
    if sc == 200:
        sub_soup = BeautifulSoup(sub_xml, 'html.parser')
        sub_urls = [u.text for u in sub_soup.find_all('loc')]
        print(f"  -> Found {len(sub_urls)} URLs: {sub_urls[:10]}")

# Test search queries for local keywords
queries = [
    "restaurant vegan saumur",
    "restaurant vegetarien angers",
    "bokit angers",
    "restaurant antillais saumur",
    "restaurant caribeen angers",
    "nuabol angers",
    "nuabol saumur"
]
print("\n=== QUERIES TO CHECK ===")
for q in queries:
    print("-", q)
