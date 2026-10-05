import os, time, json
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

AUDIT_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\deep_audit_results"
os.makedirs(AUDIT_DIR, exist_ok=True)

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1366, 'height': 900},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    )
    page = context.new_page()

    # ==========================================
    # 1. ENQUÊTE CONCURRENT 1 : MAUVAISE GRAINE (FRÈRES TOQUE & LNK.BIO)
    # ==========================================
    print(">>> [1/5] Investigation Mauvaise Graine sur Frères Toque...")
    try:
        page.goto("https://www.frerestoque.fr/restaurants/mauvaise-graine-angers", timeout=35000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        page.screenshot(path=os.path.join(AUDIT_DIR, "audit_mauvaise_graine_menu.png"), full_page=False)
        
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract items and prices
        items = []
        for el in soup.find_all(['div', 'li'], class_=lambda c: c and any(x in str(c).lower() for x in ['product', 'item', 'dish', 'card'])):
            text = el.get_text(separator=" | ", strip=True)
            if "€" in text and len(text) < 150:
                items.append(text)
        
        results["mauvaise_graine"] = {
            "url": "https://www.frerestoque.fr/restaurants/mauvaise-graine-angers",
            "title": page.title(),
            "sample_menu_items": list(set(items))[:10]
        }
        print("  -> Mauvaise Graine analysé avec succès.")
    except Exception as e:
        print("  -> Erreur Mauvaise Graine:", e)

    # ==========================================
    # 2. ENQUÊTE CONCURRENT 2 : LES SAVEURS DE NADOU (lessaveursdenadou.fr)
    # ==========================================
    print(">>> [2/5] Investigation Les Saveurs de Nadou...")
    try:
        page.goto("https://www.lessaveursdenadou.fr", timeout=35000, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)
        page.screenshot(path=os.path.join(AUDIT_DIR, "audit_saveurs_de_nadou.png"), full_page=False)
        
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        nadou_text = soup.get_text(separator=" ", strip=True)[:1000]
        # Check traiteur, bokit, vegan mentions
        results["saveurs_de_nadou"] = {
            "url": "https://www.lessaveursdenadou.fr",
            "title": page.title(),
            "has_traiteur": "traiteur" in content.lower(),
            "has_bokit": "bokit" in content.lower(),
            "has_vegan": "vegan" in content.lower() or "végétal" in content.lower(),
            "sample_text": nadou_text[:400]
        }
        print("  -> Les Saveurs de Nadou analysé avec succès.")
    except Exception as e:
        print("  -> Erreur Les Saveurs de Nadou:", e)

    # ==========================================
    # 3. ENQUÊTE CONCURRENT 3 : CHARDON ANGERS
    # ==========================================
    print(">>> [3/5] Investigation Chardon Angers (Bistrot Végétarien)...")
    try:
        page.goto("https://www.google.fr/search?q=chardon+angers+restaurant&hl=fr", timeout=30000)
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(AUDIT_DIR, "audit_google_chardon.png"))
        results["chardon"] = {"searched": True}
        print("  -> Chardon recherché sur Google.")
    except Exception as e:
        print("  -> Erreur Chardon:", e)

    # ==========================================
    # 4. ENQUÊTE DU CATALOGUE & PRIX RÉELS NUABOL (L'ADDITION ANGERS)
    # ==========================================
    print(">>> [4/5] Investigation complète de la carte L'Addition Nuabol Angers...")
    try:
        page.goto("https://commande-en-ligne.laddition.com/commande-en-ligne/nuabolangers", timeout=35000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        page.screenshot(path=os.path.join(AUDIT_DIR, "audit_nuabol_laddition_catalog.png"), full_page=False)
        
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract categories, products, prices
        menu_items = []
        for card in soup.find_all(['div', 'li']):
            txt = card.get_text(separator=" - ", strip=True)
            if "€" in txt and ("bokit" in txt.lower() or "bowl" in txt.lower() or "formule" in txt.lower() or "kassav" in txt.lower()):
                if len(txt) < 120:
                    menu_items.append(txt)
                    
        results["nuabol_laddition"] = {
            "title": page.title(),
            "items_found": list(set(menu_items))[:15]
        }
        print(f"  -> {len(menu_items)} éléments de carte Nuabol trouvés sur L'Addition.")
    except Exception as e:
        print("  -> Erreur L'Addition Nuabol:", e)

    # ==========================================
    # 5. RECHERCHE DIRECTE GOOGLE SUR LES REQUÊTES SAUMUR & TRAITEUR B2B
    # ==========================================
    print(">>> [5/5] Investigation Google sur 'traiteur entreprise angers' & 'restaurant vegan saumur'...")
    try:
        page.goto("https://www.google.fr/search?q=restaurant+vegan+saumur&hl=fr", timeout=30000)
        page.wait_for_timeout(2500)
        page.screenshot(path=os.path.join(AUDIT_DIR, "audit_google_saumur_vegan.png"))
        print("  -> Capture Google Saumur réalisée.")
    except Exception as e:
        print("  -> Erreur Google Saumur:", e)

    try:
        page.goto("https://www.google.fr/search?q=traiteur+cocktail+entreprise+angers&hl=fr", timeout=30000)
        page.wait_for_timeout(2500)
        page.screenshot(path=os.path.join(AUDIT_DIR, "audit_google_traiteur_b2b.png"))
        print("  -> Capture Google Traiteur B2B réalisée.")
    except Exception as e:
        print("  -> Erreur Google Traiteur:", e)

    browser.close()

# Save structured results
with open(os.path.join(AUDIT_DIR, "live_investigation_data.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n>>> ENQUÊTE TERRAIN TERMINÉE AVEC SUCCÈS. Données sauvegardées dans deep_audit_results/")
