from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    
    # 1. Test render page at 0s (center, 80% loss meter)
    page.goto('http://localhost:8088/render-video4-8020.html')
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_01_hook.png')
    print("Anime Scene 1 captured.")
    
    # 2. Test render page at 75s (Pareto 80/20 scale)
    page.evaluate('updateTime(75.0)')
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_04_pareto.png')
    print("Anime Scene 4 captured.")
    
    # 3. Test render page at 105s (Martinique box drop)
    page.evaluate('updateTime(105.0)')
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_05_martinique.png')
    print("Anime Scene 5 captured.")
    
    # 4. Test render page at 160s (WhatsApp chat cascade)
    page.evaluate('updateTime(160.0)')
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_08_whatsapp.png')
    print("Anime Scene 8 captured.")
    
    # 5. Test render page at 180s (Cash counter)
    page.evaluate('updateTime(180.0)')
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_09_cash.png')
    print("Anime Scene 9 captured.")
    
    # 6. Test studio page
    page.goto('http://localhost:8088/video-studio-video4.html')
    page.evaluate('updateTime(105.0)')
    page.wait_for_timeout(600)
    page.screenshot(path='scratch/anime_studio_martinique.png')
    print("Anime Studio captured.")
    
    browser.close()
