import urllib.request, ssl, json, time
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
            return res.status, res.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return None, str(e)

print("="*65)
print("1. VÉRIFICATION EN DIRECT DES LIENS SORTANTS SUR NUABOL.FR")
print("="*65)
status, html = fetch("https://www.nuabol.fr")
soup = BeautifulSoup(html, 'html.parser')

all_links = soup.find_all('a')
print(f"Nombre total de balises <a> trouvées sur la homepage : {len(all_links)}")

print("\n--- LIENS RÉSEAUX SOCIAUX DÉTECTÉS ---")
social_matches = []
for a in all_links:
    href = a.get('href', '')
    text = a.get_text(strip=True)
    if any(k in href.lower() for k in ['facebook', 'instagram', 'tiktok', 'twitter', 'linkedin', 'wix']):
        social_matches.append((text, href))
for t, h in social_matches:
    print(f"  Texte du lien: '{t}' -> Destination: {h}")

print("\n--- BOUTONS DE COMMANDE & RÉSERVATION SUR LA HOMEPAGE ---")
action_matches = []
for a in all_links:
    href = a.get('href', '')
    text = a.get_text(strip=True)
    if any(k in text.lower() or k in href.lower() for k in ['command', 'reserv', 'collect', 'laddition', 'book']):
        action_matches.append((text, href))
for t, h in action_matches:
    print(f"  Texte: '{t}' -> Destination: {h}")

print("\n" + "="*65)
print("2. VÉRIFICATION DU BALISAGE SCHEMA.ORG (DONNÉES STRUCTURÉES IA & GOOGLE)")
print("="*65)
schemas = soup.find_all('script', type='application/ld+json')
print(f"Nombre de blocs JSON-LD trouvés sur nuabol.fr : {len(schemas)}")
for i, s in enumerate(schemas):
    try:
        data = json.loads(s.string)
        print(f"\n--- BLOC JSON-LD N°{i+1} : Type '{data.get('@type')}' ---")
        if data.get('@type') == 'LocalBusiness':
            print("  Nom déclaré :", data.get('name'))
            print("  Adresse déclarée :", data.get('address'))
            print("  Téléphone :", data.get('telephone'))
    except Exception as e:
        print(f"Erreur de décodage JSON-LD {i}: {e}")

print("\n" + "="*65)
print("3. VÉRIFICATION DE LA PAGE DÉDIÉE ANGERS (nuabol.fr/nuabolangers)")
print("="*65)
st_angers, html_angers = fetch("https://www.nuabol.fr/nuabolangers")
if st_angers == 200:
    soup_a = BeautifulSoup(html_angers, 'html.parser')
    print("Statut HTTP : 200 OK")
    print("Title de la page :", soup_a.title.string.strip() if soup_a.title else "AUCUN TITLE")
    h1_a = [h.get_text(strip=True) for h in soup_a.find_all('h1')]
    print("Balises H1 :", h1_a)
    schemas_a = soup_a.find_all('script', type='application/ld+json')
    print(f"Blocs JSON-LD trouvés sur /nuabolangers : {len(schemas_a)}")
    if len(schemas_a) == 0:
        print("  -> CONSTAT BRUT : ZÉRO balisage Schema.org pour l'établissement d'Angers !")
else:
    print("Erreur de chargement /nuabolangers:", st_angers, html_angers)

print("\n" + "="*65)
print("4. TEST DES 3 URLS DE RÉSERVATION TROUVÉES DANS LE SITEMAP")
print("="*65)
for u in ["/book-online", "/réservation", "/réserver-à-angers"]:
    full_url = "https://www.nuabol.fr" + urllib.parse.quote(u)
    code, content = fetch(full_url)
    print(f"Test URL '{u}' -> Code HTTP: {code}")
