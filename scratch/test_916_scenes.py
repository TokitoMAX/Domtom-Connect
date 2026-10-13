import os
from playwright.sync_api import sync_playwright

test_times = [
    (0, "01_rappel_video2"),
    (55, "05_tableau_bfr"),
    (105, "09_whatsapp_mockup"),
    (165, "12_sop_sheet"),
    (250, "16_dtc_pulse"),
    (290, "18_action2_calendly"),
    (300, "19_signature_stay_co")
]

os.makedirs('scratch/test_snapshots_916', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 720, 'height': 1280})
    page.goto('http://localhost:8088/render-video3.html?format=9-16')
    page.wait_for_load_state('networkidle')
    
    print("Testing 9:16 scenes in render-video3.html:")
    for t, label in test_times:
        page.evaluate(f"window.updateTime({t});")
        page.wait_for_timeout(50)
        
        active_id = page.evaluate("document.querySelector('.beat-scene.active')?.id")
        print(f"t={t:3d}s -> Active Beat: {active_id}")
        
        shot_path = f"scratch/test_snapshots_916/{label}.png"
        page.screenshot(path=shot_path)

    browser.close()
print("9:16 SNAPSHOTS COMPLETE")
