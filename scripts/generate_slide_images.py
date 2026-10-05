import os
from PIL import Image, ImageDraw, ImageFont

# Directory for generated slide images
IMG_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\slide_images"
os.makedirs(IMG_DIR, exist_ok=True)

# Helper function to create stylish card images
def create_wix_leak_card():
    img = Image.new("RGB", (900, 480), "#0F172A")
    d = ImageDraw.Draw(img)
    
    # Header bar
    d.rectangle([(0, 0), (900, 60)], fill="#1E293B")
    d.text((30, 20), "PREUVE TECHNIQUE : BAS DE PAGE OFFICIEL NUABOL.FR", fill="#38BDF8")
    
    # Mockup of footer
    d.rectangle([(40, 90), (860, 430)], fill="#1E293B", outline="#334155", width=2)
    
    d.text((70, 120), "NUABOL - Restaurant Végétalien Angers & Saumur", fill="#F8FAFC")
    d.text((70, 160), "42 Rue du Maréchal Leclerc, Saumur | 4 Rue Saint-Maurille, Angers", fill="#94A3B8")
    
    # Social buttons mockup
    d.rectangle([(70, 220), (220, 270)], fill="#334155", outline="#64748B", width=1)
    d.text((90, 235), "[ Instagram ]", fill="#F8FAFC")
    
    d.rectangle([(250, 220), (400, 270)], fill="#334155", outline="#64748B", width=1)
    d.text((275, 235), "[ Facebook ]", fill="#F8FAFC")
    
    # Danger highlight callout
    d.rectangle([(70, 300), (830, 400)], fill="#450A0A", outline="#EF4444", width=2)
    d.text((90, 320), "LIEN CONFIGURÉ SUR L'ICÔNE INSTAGRAM :", fill="#FCA5A5")
    d.text((90, 355), "-> https://www.instagram.com/wix (Page de l'éditeur Wix France !)", fill="#EF4444")
    
    img_path = os.path.join(IMG_DIR, "proof_wix_leak.png")
    img.save(img_path)
    return img_path

def create_semrush_card():
    img = Image.new("RGB", (900, 480), "#0F172A")
    d = ImageDraw.Draw(img)
    
    d.rectangle([(0, 0), (900, 60)], fill="#1E293B")
    d.text((30, 20), "DONNÉES SEMRUSH : ANALYSE DES MOTS-CLÉS DE NUABOL.FR", fill="#F59E0B")
    
    # Table Box
    d.rectangle([(40, 90), (860, 430)], fill="#1E293B", outline="#334155", width=2)
    
    # Table Headers
    d.text((70, 115), "MOT-CLÉ NATUREL", fill="#94A3B8")
    d.text((350, 115), "VOLUME / MOIS", fill="#94A3B8")
    d.text((550, 115), "POSITION", fill="#94A3B8")
    d.text((700, 115), "TYPE DE TRAFIC", fill="#94A3B8")
    d.line([(60, 145), (840, 145)], fill="#334155", width=2)
    
    # Rows
    rows = [
        ("1. nuabol", "1 600", "Top 1", "Marque (Déjà client)"),
        ("2. nuabol saumur", "480", "Top 1", "Marque (Déjà client)"),
        ("3. nuabol angers", "480", "Top 1", "Marque (Déjà client)"),
        ("4. bokit angers", "150", "> Page 5", "DÉCOUVERTE (Perdu)"),
        ("5. restaurant vegan angers", "350", "> Page 5", "DÉCOUVERTE (Perdu)"),
        ("6. traiteur entreprise 49", "200", "Non classé", "B2B (Perdu)")
    ]
    
    y = 160
    for kw, vol, pos, typ in rows:
        color = "#F8FAFC" if "Marque" in typ else "#EF4444"
        d.text((70, y), kw, fill=color)
        d.text((370, y), vol, fill=color)
        d.text((560, y), pos, fill=color)
        d.text((700, y), typ, fill=color)
        y += 40
        
    img_path = os.path.join(IMG_DIR, "proof_semrush_keywords.png")
    img.save(img_path)
    return img_path

def create_social_benchmark_card():
    img = Image.new("RGB", (900, 480), "#0F172A")
    d = ImageDraw.Draw(img)
    
    d.rectangle([(0, 0), (900, 60)], fill="#1E293B")
    d.text((30, 20), "BENCHMARK RÉSEAUX SOCIAUX & PARCOURS DE COMMANDE", fill="#10B981")
    
    # Mauvaise Graine box
    d.rectangle([(40, 90), (430, 430)], fill="#1E293B", outline="#334155", width=2)
    d.text((60, 110), "CONCURRENT : MAUVAISE GRAINE", fill="#38BDF8")
    d.text((60, 145), "• Instagram : @mauvaisegraine.angers", fill="#F8FAFC")
    d.text((60, 180), "• Stratégie : Reels food & Stories quotidiennes", fill="#94A3B8")
    d.text((60, 215), "• Lien Bio : Hub Frères Toque + UberEats", fill="#10B981")
    d.text((60, 250), "• Résultat : Commandes instantanées", fill="#10B981")
    d.text((60, 310), "Point Faible :", fill="#EF4444")
    d.text((60, 345), "Offre 100% burgers gras (Zéro option saine)", fill="#94A3B8")
    
    # Nuabol box
    d.rectangle([(470, 90), (860, 430)], fill="#1E293B", outline="#334155", width=2)
    d.text((490, 110), "SITUATION ACTUELLE : NUABOL", fill="#F59E0B")
    d.text((490, 145), "• Produit : 4.9/5 (Bokits, Kassavs & Bowls)", fill="#10B981")
    d.text((490, 180), "• Réseaux : Publications espacées", fill="#94A3B8")
    d.text((490, 215), "• Lien Site Web : Renvoie vers Wix !", fill="#EF4444")
    d.text((490, 250), "• Résultat : Déperdition des prospects", fill="#EF4444")
    d.text((490, 310), "Opportunité Loïc :", fill="#10B981")
    d.text((490, 345), "Hub 1-Clic : Click & Collect + Traiteur B2B", fill="#38BDF8")
    
    img_path = os.path.join(IMG_DIR, "benchmark_social_channels.png")
    img.save(img_path)
    return img_path

def create_mobile_hub_mockup():
    img = Image.new("RGB", (900, 480), "#0F172A")
    d = ImageDraw.Draw(img)
    
    d.rectangle([(0, 0), (900, 60)], fill="#1E293B")
    d.text((30, 20), "LE HUB DE COMMANDE DIRECTE (EXPÉRIENCE SMARTPHONE SANS FRICTION)", fill="#38BDF8")
    
    # Phone screen frame
    d.rectangle([(250, 80), (650, 440)], fill="#020617", outline="#38BDF8", width=3)
    
    d.text((350, 105), "NUABOL RESTAURANT", fill="#F8FAFC")
    d.text((320, 130), "Healthy & Caribbean 100% Végétal", fill="#94A3B8")
    
    # Button 1
    d.rectangle([(280, 170), (620, 215)], fill="#0284C7")
    d.text((310, 185), "COMMANDE CLICK & COLLECT - ANGERS", fill="#FFFFFF")
    
    # Button 2
    d.rectangle([(280, 230), (620, 275)], fill="#0284C7")
    d.text((310, 245), "COMMANDE CLICK & COLLECT - SAUMUR", fill="#FFFFFF")
    
    # Button 3
    d.rectangle([(280, 290), (620, 335)], fill="#B45309")
    d.text((315, 305), "DEVIS TRAITEUR & BUFFET ENTREPRISE", fill="#FFFFFF")
    
    # Button 4
    d.rectangle([(280, 350), (620, 395)], fill="#10B981")
    d.text((345, 365), "RÉSERVER UNE TABLE EN SALLE", fill="#FFFFFF")
    
    img_path = os.path.join(IMG_DIR, "mobile_hub_mockup.png")
    img.save(img_path)
    return img_path

create_wix_leak_card()
create_semrush_card()
create_social_benchmark_card()
create_mobile_hub_mockup()
print("All slide visual proof assets generated in:", IMG_DIR)
