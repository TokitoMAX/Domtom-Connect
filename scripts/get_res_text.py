import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request("https://www.laterrasserooftoprestaurantsxm.com/en/reservation/", headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, "html.parser")
content = soup.find("div", class_="entry-content") or soup.find("main") or soup.body
print(content.get_text(separator='\n', strip=True))
