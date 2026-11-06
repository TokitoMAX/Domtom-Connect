"""
Signale les pages du site à Bing, Yandex et aux autres moteurs IndexNow (Bing alimente aussi ChatGPT et Copilot).
À lancer après chaque publication importante.

Utilisation
    python tools/indexnow.py                 -> toutes les URL du sitemap en ligne
    python tools/indexnow.py /boutique /en   -> seulement ces pages
"""
import re, sys
import requests

SITE = "https://domtomconnect.com"
KEY = "090a8fee72d46ca84705643c6fd5ee69"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        urls = [SITE + (a if a.startswith("/") else "/" + a) for a in sys.argv[1:]]
    else:
        urls = re.findall(r"<loc>([^<]+)</loc>", requests.get(SITE + "/sitemap.xml", timeout=20).text)
    body = {"host": "domtomconnect.com", "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt", "urlList": urls}
    r = requests.post("https://api.indexnow.org/indexnow", json=body, timeout=30)
    print(len(urls), "URL envoyées, réponse", r.status_code)
