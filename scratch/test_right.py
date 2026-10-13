from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://localhost:8088/render-video4-8020.html')
    page.evaluate('updateTime(140.0)') # Semaine 1, J1-J3, charPos right
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_07_right.png')
    print("Scene 7 (Right position) captured.")
    browser.close()
