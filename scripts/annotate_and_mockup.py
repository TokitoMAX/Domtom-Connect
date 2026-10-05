import os
from PIL import Image, ImageDraw, ImageFont

IMG_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\slide_images"

def get_font(size=14, bold=False):
    # Use standard Arial font available on Windows
    font_names = ["arialbd.ttf" if bold else "arial.ttf", "segoeuib.ttf" if bold else "segoeui.ttf", "calibrib.ttf" if bold else "calibri.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(os.path.join(r"C:\Windows\Fonts", fn), size)
        except:
            pass
    return ImageFont.load_default()

font_title = get_font(18, bold=True)
font_label = get_font(14, bold=True)
font_sub = get_font(12, bold=False)
font_sm = get_font(10, bold=False)

# 1. Annotate Footer Leak
def annotate_footer():
    src = os.path.join(IMG_DIR, "nuabol_footer_real.png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Red highlight around social icons area at bottom
    box_top = int(h * 0.45)
    box_bottom = int(h * 0.95)
    box_left = int(w * 0.35)
    box_right = int(w * 0.65)
    
    # Red pulsing box
    d.rectangle([(box_left, box_top), (box_right, box_bottom)], outline="#EF4444", width=5)
    d.rectangle([(box_left-2, box_top-2), (box_right+2, box_bottom+2)], outline="#FCA5A5", width=2)
    
    # Callout banner at top of image
    d.rectangle([(20, 20), (w - 20, 110)], fill=(220, 38, 38, 240), outline="#FFFFFF", width=2)
    d.text((40, 30), "FAILLE CRITIQUE DE CONVERSION DÉTECTÉE DANS LE CODE SOURCE", fill="#FFFFFF", font=font_title)
    d.text((40, 60), "• Icône Facebook pointe vers : https://www.facebook.com/WixFrancais (Compte éditeur Wix)", fill="#FEF08A", font=font_label)
    d.text((40, 82), "• Icône Instagram pointe vers : https://www.instagram.com/wix (Perte quotidienne de prospects qualifiés)", fill="#FEF08A", font=font_label)
    
    # Callout arrow / label at the bottom
    d.rectangle([(box_left - 10, box_top - 45), (box_right + 10, box_top - 5)], fill=(15, 23, 42, 230), outline="#EF4444", width=2)
    d.text((box_left + 10, box_top - 38), "FUITE DIRECTE VERS L'ÉDITEUR WIX", fill="#EF4444", font=font_label)
    
    out = Image.alpha_composite(im, overlay).convert("RGB")
    out.save(os.path.join(IMG_DIR, "annotated_footer_leak.png"))
    print("Saved annotated_footer_leak.png")

# 2. Annotate SEMrush
def annotate_semrush():
    src = os.path.join(IMG_DIR, "real_semrush_overview.png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Top banner callout
    d.rectangle([(15, 15), (w - 15, 80)], fill=(15, 23, 42, 240), outline="#38BDF8", width=2)
    d.text((30, 25), "DIAGNOSTIC ANALYTIQUE CERTIFIÉ : 100% DE TRAFIC DE MARQUE 'NUABOL'", fill="#38BDF8", font=font_title)
    d.text((30, 52), "Zéro acquisition sur 'Bokit Angers', 'Restaurant Vegan Angers' ou 'Traiteur 49'", fill="#F8FAFC", font=font_sub)
    
    # Red tag bottom right
    d.rectangle([(w - 420, h - 70), (w - 15, h - 15)], fill=(220, 38, 38, 230), outline="#FFFFFF", width=2)
    d.text((w - 400, h - 58), "IMPACT : 0 NOUVEAU PROSPECT DÉCOUVERT", fill="#FFFFFF", font=font_label)
    d.text((w - 400, h - 35), "Chaque mois, des centaines de couverts perdus", fill="#FEF08A", font=font_sm)
    
    out = Image.alpha_composite(im, overlay).convert("RGB")
    out.save(os.path.join(IMG_DIR, "annotated_semrush.png"))
    print("Saved annotated_semrush.png")

# 3. Annotate Google Maps Nuabol
def annotate_gmaps():
    src = os.path.join(IMG_DIR, "gmaps_nuabol_real.png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Top green badge for 4.9/5
    d.rectangle([(20, 20), (520, 95)], fill=(16, 149, 106, 240), outline="#FFFFFF", width=2)
    d.text((35, 30), "CAPITAL SATISFACTION : 4,9 / 5 (221 AVIS)", fill="#FFFFFF", font=font_title)
    d.text((35, 60), "Excellente réputation client place du Ralliement à Angers", fill="#DCFCE7", font=font_sub)
    
    # Bottom orange warning for missing features
    d.rectangle([(20, h - 120), (w - 20, h - 20)], fill=(15, 23, 42, 240), outline="#F59E0B", width=2)
    d.text((35, h - 108), "OPPORTUNITÉS CRO IMMÉDIATES À DÉPLOYER SUR LA FICHE :", fill="#F59E0B", font=font_label)
    d.text((35, h - 80), "• Intégrer le catalogue produits interactif avec photos HD et prix (70% des clics restent sur Maps)", fill="#F8FAFC", font=font_sub)
    d.text((35, h - 55), "• Déployer la stratégie Review SEO pour ranker Top 1 sur 'Bokit' et 'Vegan'", fill="#F8FAFC", font=font_sub)
    
    out = Image.alpha_composite(im, overlay).convert("RGB")
    out.save(os.path.join(IMG_DIR, "annotated_gmaps_nuabol.png"))
    print("Saved annotated_gmaps_nuabol.png")

# 4. Annotate L'Addition ordering interface
def annotate_laddition():
    src = os.path.join(IMG_DIR, "real_laddition_nuabol.png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Top bar warning about GA4
    d.rectangle([(20, 20), (w - 20, 110)], fill=(2, 132, 199, 240), outline="#FFFFFF", width=2)
    d.text((35, 30), "PARCOURS CLICK & COLLECT : L'ADDITION (MODÈLE VERTUEUX SANS COMMISSIONS 30%)", fill="#FFFFFF", font=font_title)
    d.text((35, 60), "FAILLE ANALYTIQUE : Rupture de domaine externe sans tracking Google Analytics 4 cross-domaine", fill="#FEF08A", font=font_label)
    d.text((35, 82), "Conséquence : Nuabol ne sait pas quel canal (Instagram, Google, Bouche-à-oreille) génère le CA", fill="#FFFFFF", font=font_sub)
    
    out = Image.alpha_composite(im, overlay).convert("RGB")
    out.save(os.path.join(IMG_DIR, "annotated_laddition.png"))
    print("Saved annotated_laddition.png")

# 5. Annotate Mobile Rendering
def annotate_mobile():
    src = os.path.join(IMG_DIR, "real_nuabol_mobile.png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Warning callout on top
    d.rectangle([(10, 10), (w - 10, 85)], fill=(15, 23, 42, 230), outline="#EF4444", width=2)
    d.text((18, 18), "AUDIT CRO MOBILE (80% DU TRAFIC)", fill="#EF4444", font=get_font(12, bold=True))
    d.text((18, 40), "• Bouton 'Commander' non fixé au scroll", fill="#F8FAFC", font=get_font(10, bold=False))
    d.text((18, 58), "• Réservations fragmentées (/book-online & accent)", fill="#F8FAFC", font=get_font(10, bold=False))
    
    out = Image.alpha_composite(im, overlay).convert("RGB")
    out.save(os.path.join(IMG_DIR, "annotated_mobile.png"))
    print("Saved annotated_mobile.png")

# 6. Annotate Instagram Grid / Bio
def annotate_instagram():
    src = os.path.join(IMG_DIR, "ig_nuabol_real.png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Callout top
    d.rectangle([(20, 20), (w - 20, 105)], fill=(15, 23, 42, 240), outline="#F59E0B", width=2)
    d.text((35, 30), "AUDIT INSTAGRAM @NUABOL_RESTAURANTS (831 ABONNÉS)", fill="#F59E0B", font=font_title)
    d.text((35, 58), "• Lien bio unique vers nuabol.fr (absence de hub 1-clic Click & Collect / Traiteur)", fill="#F8FAFC", font=font_sub)
    d.text((35, 80), "• Stories à la une non structurées (aucun onglet Menu, Horaires, Avis vérifiés)", fill="#F8FAFC", font=font_sub)
    
    out = Image.alpha_composite(im, overlay).convert("RGB")
    out.save(os.path.join(IMG_DIR, "annotated_ig_nuabol.png"))
    print("Saved annotated_ig_nuabol.png")

# 7. Create Mockup of Solution 1: Hub Mobile 1-Clic
def create_mockup_mobile_hub():
    img = Image.new("RGB", (800, 1000), "#0F172A")
    d = ImageDraw.Draw(img)
    
    # Phone frame
    d.rectangle([(150, 40), (650, 960)], fill="#1E293B", outline="#334155", width=4)
    # Notch / Camera
    d.rectangle([(350, 50), (450, 65)], fill="#0F172A")
    
    # Brand Header
    d.text((270, 100), "NUABOL RESTAURANTS", fill="#FFFFFF", font=font_title)
    d.text((245, 130), "Street-Food Végétale Caraïbéenne", fill="#94A3B8", font=font_sub)
    d.text((320, 150), "Angers & Saumur", fill="#10B981", font=font_label)
    
    # Buttons
    buttons = [
        ("COMMANDER CLICK & COLLECT - ANGERS", "#0284C7", "Prêt en 15 min • Place du Ralliement"),
        ("COMMANDER CLICK & COLLECT - SAUMUR", "#0284C7", "Prêt en 15 min • Rue Maréchal Leclerc"),
        ("RÉSERVER UNE TABLE (ANGERS & SAUMUR)", "#10B981", "Confirmation immédiate sans attente"),
        ("TRAITEUR & COCKTAILS D'ENTREPRISE B2B", "#B45309", "Devis express pour vos séminaires (Anjou)"),
        ("NOTRE CARTE & ALLERGÈNES (SANS GLUTEN)", "#334155", "Bokits, Kassavs, Bowls & Boissons")
    ]
    
    y = 200
    for label, bg, sub in buttons:
        d.rectangle([(180, y), (620, y + 90)], fill=bg, outline="#FFFFFF", width=1)
        d.text((200, y + 18), label, fill="#FFFFFF", font=font_label)
        d.text((200, y + 48), sub, fill="#E2E8F0", font=font_sm)
        y += 120
        
    # Footer tag
    d.text((250, 880), "SOLUTION DÉPLOYÉE PAR LOÏC VILLERONCE", fill="#64748B", font=font_sm)
    d.text((240, 905), "Zéro déperdition d'audience Instagram & TikTok", fill="#10B981", font=font_sm)
    
    img.save(os.path.join(IMG_DIR, "solution_mockup_hub_mobile.png"))
    print("Saved solution_mockup_hub_mobile.png")

# 8. Create Mockup of Solution 2: Local Silo Angers Page
def create_mockup_silo_angers():
    img = Image.new("RGB", (900, 600), "#0F172A")
    d = ImageDraw.Draw(img)
    
    # Header bar
    d.rectangle([(0, 0), (900, 70)], fill="#1E293B")
    d.text((30, 25), "MAQUETTE ARCHITECTURE : PAGE PILIER SEO DÉDIÉE (/nuabol-angers)", fill="#38BDF8", font=font_title)
    
    # Browser window mockup
    d.rectangle([(40, 100), (860, 560)], fill="#FFFFFF", outline="#334155", width=2)
    # Browser top bar
    d.rectangle([(40, 100), (860, 140)], fill="#F1F5F9")
    d.text((60, 112), "URL : nuabol.fr/nuabol-angers (Cible SEO : 'Restaurant Vegan Angers' & 'Bokit Angers')", fill="#0F172A", font=font_label)
    
    # Content of the page
    d.text((70, 160), "NUABOL ANGERS - RESTAURANT VÉGÉTALIEN & BOKITS CARAÏBÉENS", fill="#0F172A", font=font_title)
    d.text((70, 195), "Place du Ralliement • 4 Rue Saint-Maurille, 49100 Angers • Tramway A & C", fill="#64748B", font=font_sub)
    
    # 3 action cards
    d.rectangle([(70, 240), (310, 420)], fill="#F8FAFC", outline="#E2E8F0", width=2)
    d.text((90, 260), "CLICK & COLLECT", fill="#0284C7", font=font_label)
    d.text((90, 290), "Commande en ligne directe", fill="#1E293B", font=font_sub)
    d.text((90, 315), "Retrait express sans attente", fill="#64748B", font=font_sm)
    d.rectangle([(90, 360), (290, 400)], fill="#0284C7")
    d.text((120, 372), "COMMANDER", fill="#FFFFFF", font=font_label)
    
    d.rectangle([(330, 240), (570, 420)], fill="#F8FAFC", outline="#E2E8F0", width=2)
    d.text((350, 260), "RÉSERVATION TABLE", fill="#10B981", font=font_label)
    d.text((350, 290), "Service midi & soir", fill="#1E293B", font=font_sub)
    d.text((350, 315), "Options sans gluten certifiées", fill="#64748B", font=font_sm)
    d.rectangle([(350, 360), (550, 400)], fill="#10B981")
    d.text((380, 372), "RÉSERVER", fill="#FFFFFF", font=font_label)
    
    d.rectangle([(590, 240), (830, 420)], fill="#F8FAFC", outline="#E2E8F0", width=2)
    d.text((610, 260), "TRAITEUR B2B", fill="#B45309", font=font_label)
    d.text((610, 290), "Cocktails & séminaires", fill="#1E293B", font=font_sub)
    d.text((610, 315), "Livraison sur Angers métropole", fill="#64748B", font=font_sm)
    d.rectangle([(610, 360), (810, 400)], fill="#B45309")
    d.text((640, 372), "DEVIS B2B", fill="#FFFFFF", font=font_label)
    
    # Bottom tech tag
    d.rectangle([(70, 450), (830, 530)], fill="#EFF6FF", outline="#BFDBFE", width=1)
    d.text((90, 465), "BALISAGE SCHEMA.ORG & GEO INTÉGRÉ SOUS LE CAPOT WIX :", fill="#1E40AF", font=font_label)
    d.text((90, 492), "• Restaurant, GeoCoordinates (Angers), Menu, ServesCuisine (Vegan, Caribbean) • Lisible par ChatGPT & Gemini", fill="#1E3A8A", font=font_sub)
    
    img.save(os.path.join(IMG_DIR, "solution_mockup_silo_angers.png"))
    print("Saved solution_mockup_silo_angers.png")

# 9. Create Mockup of Solution 3: B2B Catering
def create_mockup_catering_b2b():
    img = Image.new("RGB", (900, 600), "#0F172A")
    d = ImageDraw.Draw(img)
    
    d.rectangle([(0, 0), (900, 70)], fill="#1E293B")
    d.text((30, 25), "MAQUETTE CENTRE DE PROFIT : PAGE TRAITEUR D'ENTREPRISE B2B (/traiteur-b2b)", fill="#F59E0B", font=font_title)
    
    d.rectangle([(40, 100), (860, 560)], fill="#FFFFFF", outline="#334155", width=2)
    d.rectangle([(40, 100), (860, 140)], fill="#F1F5F9")
    d.text((60, 112), "URL : nuabol.fr/traiteur-b2b (Cible : Entreprises, Agences, Écoles & Séminaires Angevins)", fill="#0F172A", font=font_label)
    
    d.text((70, 160), "BUFFETS & COCKTAILS D'ENTREPRISE SAINS, COLORÉS ET 100% VÉGÉTAUX", fill="#0F172A", font=font_title)
    d.text((70, 195), "Émancipez-vous des traiteurs traditionnels lourds. Offrez une expérience fraîche et inclusive à vos équipes.", fill="#64748B", font=font_sub)
    
    # Left: packages
    d.rectangle([(70, 240), (450, 530)], fill="#F8FAFC", outline="#E2E8F0", width=1)
    d.text((90, 260), "FORMULES ENTREPRISES PACKAGÉES :", fill="#0F172A", font=font_label)
    d.text((90, 300), "• Formule 'Séminaire Express' (Mini-Bokits & Salades)", fill="#334155", font=font_sub)
    d.text((90, 330), "• Formule 'Cocktail Caraïbes' (Kassavs, Dips & Douceurs)", fill="#334155", font=font_sub)
    d.text((90, 360), "• Formule 'Buffet Déjeuner Sain' (Bowls signature)", fill="#334155", font=font_sub)
    d.text((90, 410), "Panier moyen constaté : 300 € à 1 500 € par événement", fill="#10B981", font=font_label)
    d.text((90, 440), "Marge préservée (sans commission intermédiaire)", fill="#10B981", font=font_sub)
    d.text((90, 480), "Option 100% Sans Gluten disponible pour tous vos convives", fill="#64748B", font=font_sm)
    
    # Right: form mockup
    d.rectangle([(480, 240), (830, 530)], fill="#EFF6FF", outline="#93C5FD", width=2)
    d.text((505, 260), "DEMANDE DE DEVIS EXPRESS EN 3 CLICS", fill="#1E40AF", font=font_label)
    
    fields = [("Nom de l'entreprise :", "Ex : Crédit Agricole Anjou"), ("Nombre de convives :", "Ex : 25 personnes"), ("Date de l'événement :", "Ex : Jeudi 15 Octobre"), ("Budget estimé :", "Ex : 500 €")]
    fy = 300
    for f_label, f_val in fields:
        d.text((505, fy), f_label, fill="#1E3A8A", font=font_sm)
        d.rectangle([(505, fy + 18), (805, fy + 42)], fill="#FFFFFF", outline="#CBD5E1", width=1)
        d.text((515, fy + 24), f_val, fill="#94A3B8", font=font_sm)
        fy += 48
        
    d.rectangle([(505, fy + 8), (805, fy + 40)], fill="#B45309")
    d.text((565, fy + 16), "RECEVOIR MON DEVIS EN 24H", fill="#FFFFFF", font=font_label)
    
    img.save(os.path.join(IMG_DIR, "solution_mockup_catering_b2b.png"))
    print("Saved solution_mockup_catering_b2b.png")

annotate_footer()
annotate_semrush()
annotate_gmaps()
annotate_laddition()
annotate_mobile()
annotate_instagram()
create_mockup_mobile_hub()
create_mockup_silo_angers()
create_mockup_catering_b2b()
print("All professional annotated assets and solution mockups created!")
