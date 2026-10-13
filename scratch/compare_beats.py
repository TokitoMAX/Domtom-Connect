import json
from bs4 import BeautifulSoup

with open('assets/audio/video3_sync.json', 'r', encoding='utf-8') as f:
    sync_data = json.load(f)

with open('video-methode.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

import re
with open('video-methode.html', 'r', encoding='utf-8') as f:
    m = re.search(r'const beats = (\[.*?\]);', f.read(), re.DOTALL)
    matches = re.findall(r"id:\s*'([^']+)'(?:,\s*pillId:\s*'[^']+')?,\s*start:\s*([0-9.]+),\s*end:\s*([0-9.]+)", m.group(1))

for bid, s, e in matches:
    s = float(s)
    e = float(e)
    # Find spoken text in [s, e]
    spoken = [item['text'] for item in sync_data if not (item['end'] <= s or item['start'] >= e)]
    
    # DOM element
    el = soup.find(id=bid)
    title = el.find(class_='b-title').get_text(strip=True) if el.find(class_='b-title') else ''
    tag = el.find(class_='b-tag').get_text(strip=True) if el.find(class_='b-tag') else ''
    desc = el.find(class_='b-desc').get_text(strip=True) if el.find(class_='b-desc') else ''
    
    print(f"=== {bid} [{s}s - {e}s] ===")
    print(f"TAG: {tag}")
    print(f"TITLE: {title}")
    if desc:
        print(f"DESC: {desc}")
    print("VOIX:")
    for line in spoken:
        print(f"  - {line}")
    print()
