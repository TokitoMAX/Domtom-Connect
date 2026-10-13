from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 720, 'height': 1280})
    page.goto('http://localhost:8088/render-video4-8020.html?format=9-16')
    page.evaluate('updateTime(105.0)') # Cas Martinique
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/preview_render_916_martinique.png')
    print("Vertical 9:16 screenshot captured.")
    browser.close()
