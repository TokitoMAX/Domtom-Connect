import re
from bs4 import BeautifulSoup

for fn in ['video-methode.html', 'render-video3.html']:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    soup = BeautifulSoup(content, 'html.parser')
    dom_beats = [el['id'] for el in soup.find_all(class_='beat-scene')]
    
    m = re.search(r'const beats = (\[.*?\]);', content, re.DOTALL)
    if not m:
        print(f'{fn}: ERROR NO BEATS ARRAY FOUND')
        continue
    js_text = m.group(1)
    matches = re.findall(r"id:\s*'([^']+)'(?:,\s*pillId:\s*'[^']+')?,\s*start:\s*([0-9.]+),\s*end:\s*([0-9.]+)", js_text)
    js_ids = [item[0] for item in matches]
    
    print(f'{fn}:')
    print(f'  DOM beat count: {len(dom_beats)}')
    print(f'  JS beat count: {len(js_ids)}')
    print(f'  DOM matches JS exactly: {dom_beats == js_ids}')
    if dom_beats != js_ids:
        print(f'  DOM: {dom_beats}')
        print(f'  JS:  {js_ids}')
    
    for i in range(len(matches)):
        bid, s, e = matches[i]
        s = float(s)
        e = float(e)
        if s >= e:
            print(f'  ERROR in {bid}: start {s} >= end {e}')
        if i > 0:
            prev_e = float(matches[i-1][2])
            if abs(s - prev_e) > 0.1:
                print(f'  GAP/OVERLAP between {matches[i-1][0]} ({prev_e}) and {bid} ({s})')
print('DONE CHECK')
