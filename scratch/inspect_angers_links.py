import urllib.request
from bs4 import BeautifulSoup

url = "https://www.nuabol.fr/nuabolangers"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

print("=== TOUS LES LIENS SUR NUABOLANGERS ===")
for a in soup.find_all('a', href=True):
    txt = a.get_text(strip=True)
    href = a['href']
    if any(k in txt.lower() or k in href.lower() for k in ['réserver', 'reserver', 'saumur', 'angers', 'book', 'table', 'collect']):
        print(f"TEXT: '{txt}' -> HREF: {href}")

print("\n=== PAGE TITLE & H1 ===")
print("Title:", soup.title.string if soup.title else "None")
for h in soup.find_all(['h1', 'h2']):
    print(f"{h.name}: {h.get_text(strip=True)}")
