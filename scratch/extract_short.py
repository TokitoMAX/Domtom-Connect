import urllib.request
import re
import json

url = "https://www.youtube.com/watch?v=mIy0eM2UIys"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# find title
title_match = re.search(r'<title>(.*?)</title>', html)
print("Title:", title_match.group(1) if title_match else "None")

# find captionTracks
match = re.search(r'"captionTracks":(\[.*?\])', html)
if match:
    tracks = json.loads(match.group(1))
    print(f"Found {len(tracks)} caption tracks")
    for t in tracks:
        print("Track lang:", t.get('languageCode'), t.get('baseUrl'))
        cap_url = t.get('baseUrl')
        if cap_url:
            cap_req = urllib.request.Request(cap_url, headers={'User-Agent': 'Mozilla/5.0'})
            cap_xml = urllib.request.urlopen(cap_req).read().decode('utf-8', errors='ignore')
            text_lines = re.findall(r'<text[^>]*>(.*?)</text>', cap_xml)
            import html as htmllib
            clean_lines = [htmllib.unescape(l) for l in text_lines]
            print("Captions text:\n" + "\n".join(clean_lines))
else:
    print("No caption tracks found in initial HTML")
