import os
from playwright.sync_api import sync_playwright

IMG_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\slide_images"
os.makedirs(IMG_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 850})
    
    # 1. Google Search: restaurant vegan angers
    try:
        page.goto("https://www.google.fr/search?q=restaurant+vegan+angers&hl=fr", timeout=30000)
        page.wait_for_timeout(2000)
        # click cookies
        for selector in ["button:has-text('Tout accepter')", "button:has-text('J\'accepte')", "#L2AGLb"]:
            try:
                page.click(selector, timeout=2000)
                page.wait_for_timeout(1000)
                break
            except:
                pass
        page.screenshot(path=os.path.join(IMG_DIR, "real_serp_vegan_angers.png"))
        print("Captured real_serp_vegan_angers.png")
    except Exception as e:
        print("Error SERP vegan:", e)

    # 2. Google Search: bokit angers
    try:
        page.goto("https://www.google.fr/search?q=bokit+angers&hl=fr", timeout=30000)
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(IMG_DIR, "real_serp_bokit_angers.png"))
        print("Captured real_serp_bokit_angers.png")
    except Exception as e:
        print("Error SERP bokit:", e)

    # 3. Instagram Mauvaise Graine Bio Link (lnk.bio/MenuMG)
    try:
        page.goto("https://lnk.bio/MenuMG", timeout=30000)
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(IMG_DIR, "real_competitor_bio_link.png"))
        print("Captured real_competitor_bio_link.png")
    except Exception as e:
        print("Error competitor bio link:", e)

    # 4. Nuabol Instagram post detail
    try:
        page.goto("https://www.instagram.com/nuabol_restaurants/", timeout=30000)
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(IMG_DIR, "real_ig_nuabol_grid.png"))
        print("Captured real_ig_nuabol_grid.png")
    except Exception as e:
        print("Error IG Nuabol grid:", e)

    browser.close()

print("All extra captures finished.")
