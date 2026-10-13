from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 720})

    # 1. Scene 1 (5s)
    page.goto('http://localhost:8088/render-video4-8020.html')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/mograph_01_hook.png')
    print("Scene 1 captured")

    # 2. Scene 4 (75s - Pareto 80/20)
    page.evaluate('updateTime(75.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/mograph_04_pareto.png')
    print("Scene 4 captured")

    # 3. Scene 5 (105s - Martinique container crash)
    page.evaluate('updateTime(105.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/mograph_05_martinique.png')
    print("Scene 5 captured")

    # 4. Scene 8 (160s - WhatsApp Martinique)
    page.evaluate('updateTime(160.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/mograph_08_whatsapp.png')
    print("Scene 8 captured")

    # 5. Scene 9 (180s - Cash +680 €)
    page.evaluate('updateTime(180.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/mograph_09_cash.png')
    print("Scene 9 captured")

    # 6. Studio page (105s)
    page.goto('http://localhost:8088/video-studio-video4.html')
    page.wait_for_timeout(500)
    page.evaluate('updateTime(105.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/mograph_studio.png')
    print("Studio captured")

    browser.close()
