import os
import glob
from datetime import datetime

base_dir = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect"
today = datetime.now().strftime("%Y-%m-%d")

urls = []

# Core High-Priority Pages
core_pages = [
    ("", "1.00", "daily"),
    ("anamnese", "1.00", "weekly"),
    ("tremplin", "1.00", "weekly"),
    ("pilotage", "0.95", "weekly"),
    ("guide-entrepreneur", "0.90", "weekly"),
    ("boutique", "0.85", "monthly"),
    ("beta-test", "0.85", "monthly"),
    ("co-fondateurs", "0.85", "monthly"),
    ("incubateur", "0.85", "monthly"),
    ("rejoindre", "0.85", "monthly"),
    ("a-propos", "0.80", "monthly"),
    ("support", "0.75", "monthly"),
    ("blog", "0.90", "daily"),
    ("marketplace/directory", "0.80", "weekly"),
    ("marketplace/companies", "0.80", "weekly"),
    ("marketplace/jobs", "0.75", "weekly"),
    ("marketplace/projects", "0.75", "weekly"),
    ("marketplace/evenements", "0.75", "weekly"),
    ("vesteris", "0.90", "weekly"),
    ("vesteris-pro", "0.85", "weekly"),
    ("vesteris-host", "0.85", "weekly"),
    ("vesteris-home", "0.85", "weekly"),
]

for slug, priority, freq in core_pages:
    url_loc = f"https://domtomconnect.com/{slug}".rstrip("/")
    if not slug:
        url_loc = "https://domtomconnect.com"
    urls.append((url_loc, priority, freq))

# Sector-specific target pages
sector_pages = [
    ("entreprises", "0.95", "weekly"),
    ("entreprises-btp", "0.90", "weekly"),
    ("entreprises-tourisme", "0.90", "weekly"),
    ("entreprises-ingenierie", "0.90", "weekly"),
    ("entreprises-juridique", "0.90", "weekly"),
    ("marques", "0.95", "weekly"),
    ("marques-agroalimentaire", "0.90", "weekly"),
    ("marques-cosmetique", "0.90", "weekly"),
]

for slug, priority, freq in sector_pages:
    urls.append((f"https://domtomconnect.com/{slug}", priority, freq))

# Territory pages
territories = ["guadeloupe", "martinique", "guyane", "reunion", "mayotte", "polynesie"]
for t in territories:
    urls.append((f"https://domtomconnect.com/territoires/{t}", "0.90", "weekly"))

urls.append(("https://domtomconnect.com/diaspora", "0.85", "weekly"))

# Blog articles
blog_dir = os.path.join(base_dir, "blog")
if os.path.exists(blog_dir):
    for entry in os.listdir(blog_dir):
        entry_path = os.path.join(blog_dir, entry)
        if os.path.isdir(entry_path):
            index_path = os.path.join(entry_path, "index.html")
            if os.path.exists(index_path):
                # Priorité renforcée pour les ponts Afrique, Caraïbe et Diaspora
                prio = "0.85" if any(k in entry for k in ["africa", "caraib", "caribbean", "diaspora", "senegal", "ivoire", "cameroun", "gabon", "rdc", "haiti", "paris", "montreal", "miami", "new-york", "london", "bridge", "expansion"]) else "0.80"
                urls.append((f"https://domtomconnect.com/blog/{entry}", prio, "monthly"))

# Legal pages
legal_pages = ["legal/terms", "legal/privacy"]
for l in legal_pages:
    urls.append((f"https://domtomconnect.com/{l}", "0.40", "yearly"))

# Generate XML
xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
]

seen = set()
for loc, priority, freq in urls:
    if loc in seen:
        continue
    seen.add(loc)
    xml_lines.append('  <url>')
    xml_lines.append(f'    <loc>{loc}</loc>')
    xml_lines.append(f'    <lastmod>{today}</lastmod>')
    xml_lines.append(f'    <changefreq>{freq}</changefreq>')
    xml_lines.append(f'    <priority>{priority}</priority>')
    xml_lines.append('  </url>')

xml_lines.append('</urlset>')

sitemap_path = os.path.join(base_dir, "sitemap.xml")
with open(sitemap_path, "w", encoding="utf-8") as f:
    f.write("\n".join(xml_lines) + "\n")

print(f"Generated sitemap with {len(seen)} URLs at {sitemap_path}")
