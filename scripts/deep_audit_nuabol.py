import urllib.request, ssl, re, json
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

code, html = fetch("https://www.nuabol.fr")
soup = BeautifulSoup(html, 'html.parser')

print("=== 1. ANALYTICS & PIXELS ===")
scripts = soup.find_all('script')
has_ga = any('google-analytics' in str(s) or 'gtag' in str(s) or 'G-' in str(s) for s in scripts)
has_gtm = any('googletagmanager' in str(s) for s in scripts)
has_fb = any('facebook' in str(s) or 'fbevents' in str(s) for s in scripts)
has_hotjar = any('hotjar' in str(s) for s in scripts)
print(f"Google Analytics / Tag Manager: {has_ga or has_gtm}")
print(f"Meta Pixel (Facebook/Instagram Ads): {has_fb}")
print(f"Heatmap / UX Tracking (Hotjar/Clarity): {has_hotjar}")

print("\n=== 2. SOCIAL MEDIA INTEGRATION ===")
social_links = [a.get('href') for a in soup.find_all('a') if a.get('href') and any(plat in a.get('href') for plat in ['instagram', 'facebook', 'tiktok', 'linkedin', 'tripadvisor', 'happycow'])]
print("Social Links found on site:", set(social_links))

print("\n=== 3. OPEN GRAPH & TWITTER CARDS ===")
og_tags = {meta.get('property'): meta.get('content') for meta in soup.find_all('meta') if meta.get('property', '').startswith('og:')}
print("OpenGraph tags:", json.dumps(og_tags, indent=2, ensure_ascii=False))

print("\n=== 4. MOBILE VIEWPORT & RESPONSIVENESS ===")
viewport = soup.find('meta', attrs={'name': 'viewport'})
print("Viewport:", viewport.get('content') if viewport else "MISSING")

print("\n=== 5. ASSET SIZE & WEIGHT ===")
images = soup.find_all('img')
print(f"Number of images on homepage: {len(images)}")
js_scripts = [s.get('src') for s in scripts if s.get('src')]
print(f"External JS files: {len(js_scripts)}")
css_links = [l.get('href') for l in soup.find_all('link', attrs={'rel': 'stylesheet'})]
print(f"CSS files: {len(css_links)}")

print("\n=== 6. SUB-PAGES INSPECTION (Angers & Saumur) ===")
for sub in ["/nuabolangers", "/nuabolsaumur", "/clickandcollect"]:
    sc, shtml = fetch(f"https://www.nuabol.fr{sub}")
    if sc == 200:
        ssoup = BeautifulSoup(shtml, 'html.parser')
        title = ssoup.title.string if ssoup.title else "NO TITLE"
        h1s = [h.get_text(strip=True) for h in ssoup.find_all('h1')]
        meta_d = ssoup.find('meta', attrs={'name': 'description'})
        desc = meta_d.get('content') if meta_d else "NO DESC"
        print(f"\n--- URL: {sub} ---")
        print(f"  Title: {title}")
        print(f"  Description: {desc}")
        print(f"  H1: {h1s}")
