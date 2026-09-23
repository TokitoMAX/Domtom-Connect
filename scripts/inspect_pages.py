import urllib.request
import ssl
from bs4 import BeautifulSoup
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("RESERVATION", "https://www.laterrasserooftoprestaurantsxm.com/en/reservation/"),
    ("MENU", "https://www.laterrasserooftoprestaurantsxm.com/en/menu/"),
    ("ABOUT US", "https://www.laterrasserooftoprestaurantsxm.com/en/about-us/")
]

headers = {'User-Agent': 'Mozilla/5.0'}

for title, u in urls:
    print(f"\n=================== {title} ({u}) ===================")
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, "html.parser")
            # print forms
            forms = soup.find_all("form")
            print(f"Forms found: {len(forms)}")
            for f in forms:
                print(" Form ID/Action:", f.get("id"), f.get("action"))
                for inp in f.find_all(["input", "select", "textarea", "button"]):
                    print("   field:", inp.get("name"), inp.get("type"), inp.get("placeholder"))
            
            # Print main content text snippets
            main_text = soup.get_text(separator=' ', strip=True)
            print("Extrait texte (500 chars):", main_text[:500])
    except Exception as e:
        print("Erreur:", e)
