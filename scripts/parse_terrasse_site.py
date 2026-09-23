from bs4 import BeautifulSoup
import re

with open(r"C:\Users\Silen\.gemini\antigravity-ide\brain\3458b239-d79b-4b26-94f9-eb7346a81def\.system_generated\steps\104\content.md", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

print("--- TITRE ---")
print(soup.title.string if soup.title else "No title")

print("\n--- MENUS & LIENS ---")
links = set()
for a in soup.find_all("a", href=True):
    href = a['href']
    text = a.get_text(strip=True)
    if text and not href.startswith("#") and not href.startswith("javascript"):
        links.add((text, href))

for text, href in sorted(links):
    print(f"- {text}: {href}")

print("\n--- FORMULAIRES / RESERVATION ---")
for form in soup.find_all("form"):
    print("Form action:", form.get("action"))
    for inp in form.find_all(["input", "button", "select"]):
        print("  Input:", inp.get("name"), inp.get("type"), inp.get("value"))

print("\n--- SECTIONS DE TEXTE CLEFS ---")
headings = soup.find_all(["h1", "h2", "h3", "h4"])
for h in headings:
    print(f"[{h.name}] {h.get_text(strip=True)}")
