import os, shutil
from playwright.sync_api import sync_playwright
from PIL import Image

IMG_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\slide_images"
os.makedirs(IMG_DIR, exist_ok=True)

# 1. Convert User's Uploaded SEMrush Screenshot
uploaded_semrush = r"C:\Users\Silen\.gemini\antigravity-ide\brain\c972e6e5-2a71-43a5-9112-7ac4af990823\.user_uploaded\uploaded_media_1790712215254.img"
if os.path.exists(uploaded_semrush):
    try:
        im = Image.open(uploaded_semrush)
        # Crop to the most relevant keyword & traffic overview section
        w, h = im.size
        # Top overview and organic keywords table
        cropped_semrush = im.crop((0, 0, w, int(h * 0.45)))
        cropped_path = os.path.join(IMG_DIR, "real_semrush_proof.png")
        cropped_semrush.save(cropped_path)
        print("Real SEMrush image extracted:", cropped_path)
    except Exception as e:
        print("Error processing semrush image:", e)

# 2. Capture Real Live Screenshots of Nuabol.fr and Competitors with Playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    # Capture 1: Nuabol Homepage
    try:
        print("Capturing Nuabol Homepage...")
        page.goto("https://www.nuabol.fr", timeout=30000, wait_until="networkidle")
        page.screenshot(path=os.path.join(IMG_DIR, "real_nuabol_homepage.png"))
        print("Captured real_nuabol_homepage.png")
        
        # Capture 2: Nuabol Footer with broken links
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(IMG_DIR, "real_nuabol_footer.png"))
        print("Captured real_nuabol_footer.png")
    except Exception as e:
        print("Error capturing Nuabol homepage:", e)

    # Capture 3: Nuabol Angers Page
    try:
        print("Capturing Nuabol Angers...")
        page.goto("https://www.nuabol.fr/nuabolangers", timeout=30000, wait_until="networkidle")
        page.screenshot(path=os.path.join(IMG_DIR, "real_nuabol_angers.png"))
        print("Captured real_nuabol_angers.png")
    except Exception as e:
        print("Error capturing Nuabol Angers:", e)

    # Capture 4: Mauvaise Graine (Frères Toque / Delivery)
    try:
        print("Capturing Mauvaise Graine...")
        page.goto("https://www.frerestoque.fr/restaurants/mauvaise-graine-angers", timeout=30000)
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(IMG_DIR, "real_competitor_mauvaise_graine.png"))
        print("Captured real_competitor_mauvaise_graine.png")
    except Exception as e:
        print("Error capturing competitor Mauvaise Graine:", e)

    browser.close()

print("All real live captures completed in:", IMG_DIR)
