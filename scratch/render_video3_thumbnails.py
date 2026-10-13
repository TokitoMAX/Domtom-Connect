import os
from playwright.sync_api import sync_playwright

os.makedirs('assets/images', exist_ok=True)

def render_thumbnails():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # 1. 16:9 Thumbnail (1280x720)
        page16 = browser.new_page(viewport={'width': 1280, 'height': 720})
        page16.goto('http://localhost:8088/scratch/thumbnail_builder_video3_16x9.html')
        page16.wait_for_timeout(1000)
        out16 = os.path.join('assets/images', 'miniature_video3_16x9.png')
        page16.screenshot(path=out16)
        print("Generated 16:9 Thumbnail:", out16)
        page16.close()

        # 2. 9:16 Vertical Cover (720x1280)
        page9 = browser.new_page(viewport={'width': 720, 'height': 1280})
        page9.goto('http://localhost:8088/scratch/thumbnail_builder_video3_9x16.html')
        page9.wait_for_timeout(1000)
        out9 = os.path.join('assets/images', 'couverture_video3_9x16.png')
        page9.screenshot(path=out9)
        print("Generated 9:16 Cover:", out9)
        page9.close()

        browser.close()

if __name__ == '__main__':
    render_thumbnails()
