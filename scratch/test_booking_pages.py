import urllib.request
from bs4 import BeautifulSoup
import sys

for target in ["https://www.nuabol.fr/r%C3%A9server-%C3%A0-angers", "https://www.nuabol.fr/book-online"]:
    print(f"\n=====================================")
    print(f"URL: {target}")
    try:
        req = urllib.request.Request(target, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        print("TITLE:", soup.title.string.strip() if soup.title and soup.title.string else "None")
        
        # Check text content
        text = soup.get_text(separator=" ", strip=True)
        print("PAGE TEXT SAMPLE (first 300 chars):", text[:300])
        
        # Check for form or booking widget
        forms = soup.find_all('form')
        print(f"FORMS COUNT: {len(forms)}")
        
        # Check if Wix Bookings or widget is present
        if "wix-bookings" in html.lower() or "booking" in html.lower():
            print("Wix Bookings keyword present in HTML")
        else:
            print("No booking keyword in HTML")
            
    except Exception as e:
        print("ERROR:", e)
