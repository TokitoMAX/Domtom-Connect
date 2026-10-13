import os
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    
    # 1. Studio page
    page.goto('http://localhost:8088/video-studio-video4.html')
    page.wait_for_timeout(1000)
    page.screenshot(path='scratch/preview_studio_video4_updated.png')
    print("Studio screenshot captured.")
    
    # 2. Render 16:9 at cas martinique
    page.goto('http://localhost:8088/render-video4-8020.html')
    page.evaluate('updateTime(105.0)') # Cas concret Martinique
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/preview_render_martinique.png')
    print("Render Martinique captured.")
    
    # 3. Render 16:9 at semaine 1
    page.evaluate('updateTime(155.0)') # Semaine 1, J4-J7
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/preview_render_semaine1.png')
    print("Render Semaine 1 captured.")
    
    # 4. Render 16:9 at Tremplin / DTC Pulse
    page.evaluate('updateTime(265.0)') # DTC Pulse
    page.wait_for_timeout(500)
    page.screenshot(path='scratch/preview_render_dtcpulse.png')
    print("Render DTC Pulse captured.")
    
    browser.close()
