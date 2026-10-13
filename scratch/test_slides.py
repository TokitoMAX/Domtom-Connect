from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:8088/video-studio-video4.html')
    
    print('Initial active slide:', page.evaluate("document.querySelector('.beat-scene.active').id"))
    
    page.evaluate("window.updateTime(55.0)")
    page.wait_for_timeout(200)
    print('Slide at 55s:', page.evaluate("document.querySelector('.beat-scene.active').id"))
    page.screenshot(path='scratch/preview_55s.png')
    
    page.evaluate("window.updateTime(135.0)")
    page.wait_for_timeout(200)
    print('Slide at 135s:', page.evaluate("document.querySelector('.beat-scene.active').id"))
    page.screenshot(path='scratch/preview_135s.png')

    page.evaluate("window.updateTime(245.0)")
    page.wait_for_timeout(200)
    print('Slide at 245s:', page.evaluate("document.querySelector('.beat-scene.active').id"))
    page.screenshot(path='scratch/preview_245s.png')
    
    browser.close()
