import os
from playwright.sync_api import sync_playwright

test_times = [
    (0, "01_rappel_video2"),
    (10, "02_vraie_question"),
    (22, "03_methode_4_etapes"),
    (35, "04_illusion_ca"),
    (55, "05_tableau_bfr"),
    (68, "06_marge_nette"),
    (80, "07_anamnese"),
    (95, "08_nettoyage_offres"),
    (105, "09_whatsapp_mockup"),
    (125, "10_offres_phares"),
    (145, "11_piege_recrutement"),
    (165, "12_sop_sheet"),
    (185, "13_tremplin_immersion"),
    (210, "14_zone_de_genie"),
    (230, "15_reseau_whatsapp"),
    (250, "16_dtc_pulse"),
    (270, "17_action1_anamnese"),
    (290, "18_action2_calendly"),
    (300, "19_signature_stay_co")
]

os.makedirs('scratch/test_snapshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://localhost:8088/video-methode.html')
    page.wait_for_load_state('networkidle')
    
    print("Testing all 19 scenes in video-methode.html:")
    for t, label in test_times:
        # Call updateTime directly
        page.evaluate(f"window.updateTime({t});")
        page.wait_for_timeout(50)
        
        # Check active beat
        active_id = page.evaluate("document.querySelector('.beat-scene.active')?.id")
        chapter_text = page.evaluate("document.getElementById('chapter-indicator')?.textContent")
        caption_text = page.evaluate("document.getElementById('caption-pill')?.textContent")
        
        print(f"t={t:3d}s -> Active Beat: {active_id:8s} | Chapitre: {chapter_text} | Caption: {caption_text[:40]}...")
        
        # Save snapshot
        shot_path = f"scratch/test_snapshots/{label}.png"
        page.locator('.video-screen').screenshot(path=shot_path)

    browser.close()
print("ALL SNAPSHOTS GENERATED SUCCESSFULLY")
