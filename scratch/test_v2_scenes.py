from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    
    # Scene 1: 5s (left)
    page.goto('http://localhost:8088/render-video4-8020.html')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/anime_v2_scene1.png')
    print("Scene 1 captured")

    # Scene 2: 25s (center)
    page.evaluate('updateTime(25.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/anime_v2_scene2_center.png')
    print("Scene 2 captured")

    # Scene 4: 75s (center Pareto)
    page.evaluate('updateTime(75.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/anime_v2_scene4_pareto.png')
    print("Scene 4 captured")

    # Scene 5: 105s (right Martinique crate)
    page.evaluate('updateTime(105.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/anime_v2_scene5_martinique.png')
    print("Scene 5 captured")

    # Scene 8: 160s (WhatsApp Martinique)
    page.evaluate('updateTime(160.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/anime_v2_scene8_whatsapp.png')
    print("Scene 8 captured")

    # Scene 9: 180s (Cash odometer)
    page.evaluate('updateTime(180.0)')
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/anime_v2_scene9_cash.png')
    print("Scene 9 captured")

    browser.close()
