import urllib.request, ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request("https://www.nuabol.fr/nuabolangers", headers=headers)
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')
soup = BeautifulSoup(html, 'html.parser')

print("--- LIENS DE CONVERSION SUR /nuabolangers ---")
for a in soup.find_all('a'):
    t = a.get_text(strip=True)
    h = a.get('href', '')
    if any(k in t.lower() or k in h.lower() for k in ['reserv', 'command', 'table', 'book', 'collect']):
        print(f"Bouton : '{t}' -> Destination : {h}")

# Check content of /réserver-à-angers
url_res_angers = "https://www.nuabol.fr" + urllib.parse.quote("/réserver-à-angers")
try:
    req2 = urllib.request.Request(url_res_angers, headers=headers)
    html2 = urllib.request.urlopen(req2, context=ctx).read().decode('utf-8', errors='ignore')
    soup2 = BeautifulSoup(html2, 'html.parser')
    print("\n--- PAGE /réserver-à-angers ---")
    print("Title :", soup2.title.string.strip() if soup2.title else "NO TITLE")
    h1s = [h.get_text(strip=True) for h in soup2.find_all('h1')]
    print("H1 :", h1s)
    # Check if there is an iframe or form
    iframes = [f.get('src') for f in soup2.find_all('iframe')]
    print("Iframes de réservation :", iframes)
except Exception as e:
    print("Erreur chargement /réserver-à-angers:", e)
