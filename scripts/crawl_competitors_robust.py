import os, time, json
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

AUDIT_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\deep_audit_results"
os.makedirs(AUDIT_DIR, exist_ok=True)

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 850},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    )

    # 1. LES SAVEURS DE NADOU (Eatbu)
    print(">>> [1/4] Crawl Les Saveurs de Nadou (eatbu.com)...")
    try:
        p1 = context.new_page()
        p1.goto("https://les-saveurs-de-nadou.eatbu.com/", timeout=25000, wait_until="domcontentloaded")
        p1.wait_for_timeout(3000)
        p1.screenshot(path=os.path.join(AUDIT_DIR, "audit_saveurs_de_nadou_real.png"))
        title = p1.title()
        content = p1.content()
        soup = BeautifulSoup(content, 'html.parser')
        text_sample = soup.get_text(separator=" ", strip=True)[:600]
        results["saveurs_de_nadou"] = {
            "title": title,
            "sample": text_sample
        }
        print("  -> Saveurs de Nadou capturé avec succès.")
        p1.close()
    except Exception as e:
        print("  -> Erreur Saveurs de Nadou:", e)

    # 2. NUABOL L'ADDITION (Carte complète et prix réels)
    print(">>> [2/4] Crawl L'Addition Nuabol Angers...")
    try:
        p2 = context.new_page()
        p2.goto("https://commande-en-ligne.laddition.com/commande-en-ligne/nuabolangers", timeout=25000, wait_until="domcontentloaded")
        p2.wait_for_timeout(4000)
        p2.screenshot(path=os.path.join(AUDIT_DIR, "audit_laddition_nuabol_real.png"))
        content = p2.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Get raw text elements
        all_text = soup.get_text(separator="\n", strip=True)
        lines = [line for line in all_text.split("\n") if len(line) > 3]
        results["nuabol_laddition"] = {
            "title": p2.title(),
            "lines_sample": lines[:30]
        }
        print("  -> L'Addition Nuabol capturé avec succès.")
        p2.close()
    except Exception as e:
        print("  -> Erreur L'Addition:", e)

    # 3. CHARDON ANGERS / RECHERCHE GOOGLE DIRECTE
    print(">>> [3/4] Recherche Google: restaurant vegan saumur...")
    try:
        p3 = context.new_page()
        p3.goto("https://www.google.fr/search?q=restaurant+vegan+saumur&hl=fr", timeout=25000)
        p3.wait_for_timeout(2500)
        p3.screenshot(path=os.path.join(AUDIT_DIR, "audit_serp_saumur_vegan.png"))
        print("  -> SERP Saumur capturée.")
        p3.close()
    except Exception as e:
        print("  -> Erreur SERP Saumur:", e)

    # 4. RECHERCHE GOOGLE TRAITEUR ENTREPRISE ANGERS
    print(">>> [4/4] Recherche Google: traiteur buffet entreprise angers...")
    try:
        p4 = context.new_page()
        p4.goto("https://www.google.fr/search?q=traiteur+buffet+entreprise+angers&hl=fr", timeout=25000)
        p4.wait_for_timeout(2500)
        p4.screenshot(path=os.path.join(AUDIT_DIR, "audit_serp_traiteur_angers.png"))
        print("  -> SERP Traiteur Angers capturée.")
        p4.close()
    except Exception as e:
        print("  -> Erreur SERP Traiteur:", e)

    browser.close()

with open(os.path.join(AUDIT_DIR, "robust_crawl_data.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(">>> Crawl robuste terminé avec succès !")
