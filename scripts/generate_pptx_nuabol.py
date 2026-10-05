import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation 16:9 Widescreen
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

blank_layout = prs.slide_layouts[6]

# Directories
SLIDE_IMG_DIR = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\slide_images"

# Color Tokens
BG_COLOR = RGBColor(248, 250, 252)       # Slate 50
SIDEBAR_BG = RGBColor(15, 23, 42)        # Slate 900
CARD_BG = RGBColor(255, 255, 255)        # Pure White
CARD_BORDER = RGBColor(226, 232, 240)    # Slate 200
NAVY_PRIMARY = RGBColor(15, 23, 42)     # Slate 900
BLUE_ACCENT = RGBColor(2, 132, 199)      # Sky 600
GOLD_ACCENT = RGBColor(180, 83, 9)       # Amber 700
GREEN_ACCENT = RGBColor(16, 149, 106)    # Emerald 600
RED_ACCENT = RGBColor(220, 38, 38)       # Red 600
TEXT_MAIN = RGBColor(30, 41, 59)         # Slate 800

def set_slide_base(slide, title, category="EXPÉRIENCE CLIENT & PARCOURS DE COMMANDE"):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.color.rgb = BG_COLOR

    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category.upper()
    p_cat.font.size = Pt(10)
    p_cat.font.bold = True
    p_cat.font.color.rgb = BLUE_ACCENT

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.6))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title
    p_title.font.size = Pt(20)
    p_title.font.bold = True
    p_title.font.color.rgb = NAVY_PRIMARY

def add_clean_card(slide, left, top, width, height, title, items, tag=None, tag_color=BLUE_ACCENT, border_color=CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = border_color
    card.line.width = Pt(1)

    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.32)
    tf.margin_right = Inches(0.32)
    tf.margin_top = Inches(0.26)
    tf.margin_bottom = Inches(0.26)

    if tag:
        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(9)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color
        p_tag.space_after = Pt(3)
        p_title = tf.add_paragraph()
    else:
        p_title = tf.paragraphs[0]

    p_title.text = title
    p_title.font.size = Pt(13)
    p_title.font.bold = True
    p_title.font.color.rgb = NAVY_PRIMARY
    p_title.space_after = Pt(7)

    for item in items:
        p = tf.add_paragraph()
        if item.startswith("1.") or item.startswith("2.") or item.startswith("3.") or item.startswith("•") or item.startswith("—"):
            p.text = item
        else:
            p.text = f"• {item}" if item else ""
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MAIN
        p.space_after = Pt(3.5)

def place_img(slide, img_name, left, top, width, height):
    p = os.path.join(SLIDE_IMG_DIR, img_name)
    if os.path.exists(p):
        slide.shapes.add_picture(p, left, top, width, height)

# ==========================================
# SLIDE 0 : COUVERTURE SIMPLE & ACCESSIBLE
# ==========================================
s0 = prs.slides.add_slide(blank_layout)
bg0 = s0.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
bg0.fill.solid()
bg0.fill.fore_color.rgb = SIDEBAR_BG
bg0.line.color.rgb = SIDEBAR_BG

cov_box = s0.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(10.9), Inches(3.8))
tf0 = cov_box.text_frame
tf0.word_wrap = True

p0 = tf0.paragraphs[0]
p0.text = "EXPÉRIENCE CLIENT & CONVERSION DIGITALE"
p0.font.size = Pt(12)
p0.font.bold = True
p0.font.color.rgb = BLUE_ACCENT
p0.space_after = Pt(14)

p1 = tf0.add_paragraph()
p1.text = "NUABOL : Fluidifier le Parcours de Commande"
p1.font.size = Pt(30)
p1.font.bold = True
p1.font.color.rgb = RGBColor(255, 255, 255)
p1.space_after = Pt(12)

p2 = tf0.add_paragraph()
p2.text = "Comprendre les freins de vos clients sur smartphone • Simplifier l'accès au menu • Transformer les visites en commandes"
p2.font.size = Pt(13.5)
p2.font.color.rgb = RGBColor(148, 163, 184)
p2.space_after = Pt(26)

p3 = tf0.add_paragraph()
p3.text = "Par Loïc VILLERONCE, Chef de Projet Digital"
p3.font.size = Pt(12)
p3.font.bold = True
p3.font.color.rgb = GREEN_ACCENT

# ==========================================
# SLIDE 1 : CE QUI FAIT VOTRE FORCE (LE PRODUIT)
# ==========================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_base(s1, "Les Forces de Nuabol : Un Produit Validé et des Clients Conquis")

add_clean_card(s1, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2),
               "Un Savoir-Faire Culinaire Reconnu",
               [
                   "Une note moyenne exceptionnelle de 4,9 / 5 sur Google (plus de 220 avis vérifiés).",
                   "Une offre de street-food végétale et caribéenne unique à Angers et Saumur.",
                   "Forte fidélité de vos habitués sur les bokits, kassavs et bowls.",
                   "",
                   "Le Constat Positif :",
                   "— Votre cuisine plaît énormément, les retours clients sont élogieux.",
                   "— Le bouche-à-oreille fonctionne très bien dans vos salles physiques.",
                   "",
                   "Le Défi Commercial :",
                   "— Comment faire pour qu'une personne qui ne vous connaît pas encore puisse commander chez vous en quelques secondes sans hésiter ?"
               ], tag="Ce qui fonctionne", tag_color=GREEN_ACCENT)

place_img(s1, "gmaps_nuabol_real.png", Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2))

# ==========================================
# SLIDE 2 : EXPÉRIENCE MULTI-ÉCRANS ET CODES FAST-FOOD
# ==========================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_base(s2, "Restauration Rapide : L'Expérience sur Mobile, Tablette et PC")

add_clean_card(s2, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2),
               "Les Standards du Secteur Street-Food",
               [
                   "La Réalité d'un Client qui a Faim :",
                   "— Entre 11h30 et 13h15, le client est pressé, souvent dans la rue ou au bureau.",
                   "— La règle d'or du fast-food : la commande doit être accessible en 2 clics chrono.",
                   "",
                   "L'Expérience selon l'Écran Utilisé :",
                   "— Sur Smartphone (80% du trafic) : Le client navigue au pouce. Il a besoin d'un bouton fixe 'Commander' toujours visible en bas de l'écran.",
                   "— Sur PC et Tablette (commandes de bureau et groupes) : L'internaute veut choisir sa formule et réserver sa table en quelques secondes sans chercher.",
                   "",
                   "Le Risque d'Abandon :",
                   "— À chaque écran intermédiaire ou clic supplémentaire, 20% des clients abandonnent et partent commander ailleurs."
               ], tag="Multi-Écrans", tag_color=BLUE_ACCENT)

place_img(s2, "real_nuabol_mobile.png", Inches(8.0), Inches(1.5), Inches(3.8), Inches(5.2))

# ==========================================
# SLIDE 3 : L'ÉTAT ACTUEL DE NUABOL.FR (CE QUI EST BON VS CE QUI BLOQUE)
# ==========================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_base(s3, "L'État Actuel de votre Site : Ce qui Fonctionne vs Ce qui Bloque")

add_clean_card(s3, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2),
               "Diagnostic Pragmatique de Nuabol.fr",
               [
                   "Ce qui est Très Bon sur votre Site :",
                   "— Le graphisme est soigné, l'identité visuelle est chaleureuse.",
                   "— Les photos de bokits et de bowls donnent immédiatement envie.",
                   "— Votre module de commande L'Addition est en place (zéro commission plateforme).",
                   "",
                   "Ce qui Fait Fuir le Client (Chemin Trop Long) :",
                   "— Un parcours à rallonge : 4 étapes avant d'arriver au menu de commande.",
                   "— La confusion Angers et Saumur : Sur la page d'Angers, le bouton indique 'Réserver à Saumur', et la page de réservation Angers n'a aucun formulaire.",
                   "— L'internaute ne sait plus où cliquer, perd patience et renonce à sa commande."
               ], tag="Diagnostic Terrain", tag_color=RED_ACCENT)

place_img(s3, "proof_page_angers.png", Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2))

# ==========================================
# SLIDE 4 : LES RÉSEAUX SOCIAUX (LE LIEN MANQUANT)
# ==========================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_base(s4, "Réseaux Sociaux : Des Photos qui Donnent Faim mais sans Passerelle de Vente")

add_clean_card(s4, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2),
               "Vos Réseaux Sociaux et votre Site Doivent se Répondre",
               [
                   "1. Sur Instagram et TikTok :",
                   "— Vous publiez de superbes vidéos et photos de plats très appétissants.",
                   "— Mais dans la biographie, il manque le bouton direct pour commander en 1 clic.",
                   "— Sur TikTok, il n'y a aucun lien pour aller vers votre site.",
                   "— L'abonné salive devant la vidéo, mais ne peut pas passer commande immédiatement.",
                   "",
                   "2. Sur le Site Web :",
                   "— Les boutons réseaux du bas de page renvoient par erreur vers Wix.",
                   "",
                   "L'Opportunité : Transformer vos abonnés et spectateurs en clients qui passent commande le midi même."
               ], tag="Passerelle Vente", tag_color=GOLD_ACCENT)

place_img(s4, "annotated_footer_leak.png", Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2))

# ==========================================
# SLIDE 5 : COMMENT FONT LES AUTRES FAST-FOODS
# ==========================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_base(s5, "Comment Font les Fast-Foods Efficaces et Concurrents Directs")

add_clean_card(s5, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2),
               "L'Efficacité du Parcours Direct en Street-Food",
               [
                   "Le Standard dans la Restauration Rapide :",
                   "— Un parcours direct : photos des formules, choix des garnitures et validation.",
                   "— L'exemple Mauvaise Graine : ils n'ont même pas de site web, mais un simple lien 1-clic dans leur bio Instagram qui ouvre immédiatement la commande.",
                   "",
                   "L'Atout Majeur de Nuabol face aux Burgers :",
                   "— Votre cuisine est saine, fraîche et artisanale, là où les fast-foods classiques proposent du gras.",
                   "— Votre note Google est bien plus élevée (4,9/5 contre 4,6/5).",
                   "— Vous avez déjà votre propre caisse de commande en direct.",
                   "",
                   "Il suffit d'offrir la même rapidité d'accès pour capter les clients à midi."
               ], tag="Modèle Efficace", tag_color=BLUE_ACCENT)

place_img(s5, "real_competitor_bio_link.png", Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2))

# ==========================================
# SLIDE 6 : LA SIMPLIFICATION EN 3 ACTIONS CONCRÈTES
# ==========================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_base(s6, "Le Plan d'Action : Raccourcir le Chemin du Client en 3 Étapes")

add_clean_card(s6, Inches(0.8), Inches(1.5), Inches(3.6), Inches(5.2),
               "1. Bouton Direct Mobile",
               [
                   "Installer un bouton fixe sur smartphone 'Commander à Angers' et 'Commander à Saumur'.",
                   "Accès immédiat à votre carte sans chercher.",
                   "Clarifier la réservation de table pour Angers en un seul geste."
               ], tag="Fluidité", tag_color=BLUE_ACCENT)

add_clean_card(s6, Inches(4.8), Inches(1.5), Inches(3.6), Inches(5.2),
               "2. Lien 1-Clic Réseaux",
               [
                   "Mettre en place un lien unique et propre dans vos bios Instagram et TikTok.",
                   "L'abonné clique et choisit immédiatement : Click & Collect, Table ou Traiteur.",
                   "Corriger les liens du bas de page du site vers vos vrais comptes."
               ], tag="Conversion", tag_color=GREEN_ACCENT)

add_clean_card(s6, Inches(8.8), Inches(1.5), Inches(3.6), Inches(5.2),
               "3. Visibilité Google Locale",
               [
                   "Mettre à jour vos photos et votre carte sur Google Maps.",
                   "Inciter vos clients satisfaits à laisser leur avis pour repasser N°1 absolu à Angers.",
                   "Capter les 70% de clients qui choisissent leur déjeuner sur la carte Google."
               ], tag="Visibilité", tag_color=GOLD_ACCENT)

# ==========================================
# SLIDE 7 : CONCLUSION & ÉCHANGE DE 15 MINUTES
# ==========================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_base(s7, "Conclusion : Une Démarche Simple, Pragmatique et sans Stress")

add_clean_card(s7, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2),
               "L'Approche Recommandée par Loïc",
               [
                   "Pas de refonte coûteuse :",
                   "— Votre site actuel est déjà propre graphiquement. On ne casse rien, on simplifie uniquement le chemin parcouru par le client.",
                   "",
                   "Intervention rapide :",
                   "— Quelques ajustements bien ciblés sous le capot de votre site Wix.",
                   "— Aucun impact sur votre service quotidien en cuisine.",
                   "",
                   "Le Résultat Concret :",
                   "— Plus de commandes directes sans intermédiaire, et un site qui travaille enfin pour vous tous les jours."
               ], tag="Bon Sens", tag_color=GREEN_ACCENT)

add_clean_card(s7, Inches(6.9), Inches(1.5), Inches(5.6), Inches(5.2),
               "Prochaine Étape",
               [
                   "Un Échange de 15 Minutes :",
                   "— Faire le point ensemble sur vos priorités du moment.",
                   "— Regarder comment mettre en place ces ajustements simplement.",
                   "",
                   "Contact :",
                   "— Loïc VILLERONCE, Chef de Projet Digital",
                   "— Accompagnement sur-mesure pour les restaurateurs et commerces de bouche.",
                   "",
                   "À votre disposition pour en discuter dès que vous le souhaitez."
               ], tag="Discussion", tag_color=BLUE_ACCENT)

# Save presentation
output_path1 = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\NUABOL_Audit_Strategique_Plan_Acceleration.pptx"
output_path2 = r"C:\Users\Silen\.gemini\antigravity-ide\brain\c972e6e5-2a71-43a5-9112-7ac4af990823\NUABOL_Audit_Strategique_Plan_Acceleration.pptx"

prs.save(output_path1)
prs.save(output_path2)
print("Customer-Experience 8-Slide Pitch Deck saved successfully!")
