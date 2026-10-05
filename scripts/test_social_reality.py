import urllib.request, ssl, re, json
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

print("=================================================================")
print("5. VÉRIFICATION DU COMPTE TIKTOK DE NUABOL (@nuabol)")
print("=================================================================")
try:
    req = urllib.request.Request("https://www.tiktok.com/@nuabol", headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
        html = res.read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        
        # Look for bio link
        bio_link = soup.find('a', attrs={'data-e2e': 'user-link'})
        print("Lien bio détecté sur TikTok :", bio_link.get('href') if bio_link else "AUCUN LIEN EN BIO DÉTECTÉ")
        
        # Look for bio description
        bio_desc = soup.find('h2', attrs={'data-e2e': 'user-bio'})
        if not bio_desc:
            bio_desc = soup.find('meta', attrs={'name': 'description'})
            print("Description meta TikTok :", bio_desc.get('content') if bio_desc else "NON TROUVÉE")
        else:
            print("Bio TikTok :", bio_desc.get_text(strip=True))
except Exception as e:
    print("Erreur inspection TikTok:", e)

print("\n=================================================================")
print("6. VÉRIFICATION DU COMPTE FACEBOOK (facebook.com/nuabolrestaurants)")
print("=================================================================")
try:
    req = urllib.request.Request("https://www.facebook.com/nuabolrestaurants/", headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
        html = res.read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.title.string.strip() if soup.title else "PAS DE TITLE"
        print("Titre de la page Facebook :", title)
        # Look for website link in page
        has_nuabol_fr = "nuabol.fr" in html
        print("Présence du lien nuabol.fr dans le code de la page Facebook :", has_nuabol_fr)
except Exception as e:
    print("Erreur inspection Facebook:", e)
