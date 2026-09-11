# -*- coding: utf-8 -*-
"""
Générateur d'E-books classiques pour Domtom Connect — Tome 1
Formats générés :
1. EPUB 3 Standard (compatible Amazon KDP/Kindle, Apple Books, Kobo, Tolino, Android)
2. PDF Haute Définition paginé (prêt à imprimer, vendre ou lire sur tablette/PC)
"""

import os
import sys
import json
import re
import shutil
import zipfile
import subprocess
from xml.sax.saxutils import escape as xml_escape

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_JSON_PATH = os.path.join(ROOT_DIR, "scratch", "guide_data.json")
OUTPUT_DIR = os.path.join(ROOT_DIR, "assets", "ebooks")
COVER_IMG_SRC = os.path.join(ROOT_DIR, "assets", "images", "couverture-guide-tome1.jpg")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Charger les données du guide
with open(DATA_JSON_PATH, "r", encoding="utf-8") as f:
    guide_data = json.load(f)

chapters = guide_data.get("chapters", [])
print(f"Chargement réussi : {len(chapters)} chapitres à compiler.")

def clean_html_for_ebook(html_content, is_epub=True):
    """Nettoie le HTML pour un livre classique 80/20 sobre, lisible et épuré."""
    if not html_content:
        return ""
    
    content = html_content

    # 1. Supprimer TOUS les émojis (plages Unicode complètes)
    emoji_pattern = re.compile(
        "["
        "\U0001F000-\U0001FAFF"  # Émojis et symboles étendus
        "\U00002600-\U000027BF"  # Symboles divers et dingbats
        "\U00002300-\U000023FF"  # Symboles techniques
        "\U00002B50-\U00002B55"  # Étoiles et formes
        "]+",
        flags=re.UNICODE
    )
    content = emoji_pattern.sub("", content)

    # 2. Nettoyer les balises d'icônes web (FontAwesome) - les supprimer totalement
    content = re.sub(r'<i\s+class="[^"]*"[^>]*>.*?</i>', '', content, flags=re.DOTALL)

    # 3. Nettoyer les résidus markdown d'étoiles (**texte** -> <strong>texte</strong>, *texte* -> <em>texte</em>)
    content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
    content = re.sub(r'\*(.*?)\*', r'<em>\1</em>', content)
    content = content.replace('*', '')  # Supprimer toute étoile isolée résiduelle

    # 4. Supprimer les éléments interactifs du web (boutons, toggles)
    content = re.sub(r'<div class="active-sector-indicator-bar".*?</div>\s*</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<button[^>]*>.*?</button>', '', content, flags=re.DOTALL)

    # 5. Convertir les blocs adaptatifs en fiches sectorielles sobres
    content = re.sub(r'<div class="sector-adaptive-card"[^>]*>', '<div class="sector-case-card">', content)

    # 6. NETTOYAGE RADICAL DES COULEURS INLINE :
    # Supprimer tous les styles inline qui imposent des couleurs de texte ou de fond du thème sombre
    content = re.sub(r'style="[^"]*color:\s*(?:var\([^)]+\)|#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))[^"]*"', '', content)
    content = re.sub(r'style="[^"]*background:\s*(?:var\([^)]+\)|#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))[^"]*"', '', content)

    # 7. Valider la syntaxe XHTML pour EPUB
    if is_epub:
        content = re.sub(r'<br\s*(?<!/)>', '<br/>', content, flags=re.IGNORECASE)
        content = re.sub(r'<hr\s*(?<!/)>', '<hr/>', content, flags=re.IGNORECASE)
        content = re.sub(r'<img([^>]+?)(?<!/)>', r'<img\1/>', content, flags=re.IGNORECASE)
        content = re.sub(r'&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)', '&amp;', content)
    
    return content

def render_retenir_8020(exercise, is_epub=True):
    """
    Rendu 80/20 pour le livre classique :
    Ne PAS reproduire le carnet interactif complexe pour préserver la valeur des 27 € de la version interactive.
    Fournir à la place un résumé sobre du principe d'action et une invitation à l'atelier interactif.
    """
    if not exercise:
        return ""
    
    title = xml_escape(exercise.get("title", "Principe d'action")) if is_epub else exercise.get("title", "Principe d'action")
    desc = xml_escape(exercise.get("description", "")) if is_epub else exercise.get("description", "")
    
    # Nettoyer toute étoile ou émoji éventuel
    for char in ["*", "📝", "💡", "🎯"]:
        title = title.replace(char, "")
        desc = desc.replace(char, "")

    return f"""
    <div class="retenir-box">
        <div class="retenir-tag">POINT CLÉ D'ACTION</div>
        <h3 class="retenir-title">{title}</h3>
        <p class="retenir-desc">{desc}</p>
        <p class="retenir-note"><em>Pour réaliser cet exercice avec le carnet de bord sauvegardé et les calculateurs dynamiques, accédez à la version interactive sur domtomconnect.com.</em></p>
    </div>
    """

# ==============================================================================
# 1. COMPILATION DE L'EPUB 3
# ==============================================================================

def build_epub():
    print("\n--- Début de la construction de l'EPUB 3 ---")
    build_dir = os.path.join(ROOT_DIR, "scratch", "epub_build")
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir)
    
    # 1. mimetype (doit être le 1er fichier, non compressé)
    mimetype_path = os.path.join(build_dir, "mimetype")
    with open(mimetype_path, "w", encoding="utf-8", newline="") as f:
        f.write("application/epub+zip")
        
    # 2. META-INF/container.xml
    meta_inf = os.path.join(build_dir, "META-INF")
    os.makedirs(meta_inf)
    with open(os.path.join(meta_inf, "container.xml"), "w", encoding="utf-8") as f:
        f.write("""<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>""")

    # 3. OEBPS structure
    oebps = os.path.join(build_dir, "OEBPS")
    os.makedirs(oebps)
    images_dir = os.path.join(oebps, "images")
    os.makedirs(images_dir)
    
    # Copier la couverture
    cover_dest = os.path.join(images_dir, "cover.jpg")
    shutil.copyfile(COVER_IMG_SRC, cover_dest)
    
    # 4. CSS pour l'EPUB (Lecture pure, contrastes nets, zéro artifice)
    css_content = """
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
        line-height: 1.7;
        color: #111827;
        margin: 0;
        padding: 5% 6%;
        background-color: #ffffff;
    }
    h1, h2, h3, h4 {
        color: #000000;
        line-height: 1.25;
        margin-top: 1.4em;
        margin-bottom: 0.6em;
        font-weight: 700;
    }
    h1 {
        font-size: 1.75em;
        border-bottom: 1px solid #111827;
        padding-bottom: 0.3em;
        color: #000000;
    }
    h2 { font-size: 1.35em; color: #111827; }
    h3 { font-size: 1.15em; color: #111827; }
    h4 { font-size: 1.05em; color: #111827; }
    p { margin: 0.9em 0; text-align: justify; color: #111827; }
    .lead-text { font-size: 1.08em; font-weight: 600; color: #000000; }
    .chapter-badge {
        display: inline-block;
        font-size: 0.8em;
        font-weight: 700;
        text-transform: uppercase;
        color: #4b5563;
        letter-spacing: 0.05em;
        margin-bottom: 0.4em;
    }
    .chapter-meta {
        font-size: 0.85em;
        color: #6b7280;
        margin-bottom: 1.5em;
    }
    .highlight-box {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-left: 4px solid #111827;
        padding: 14px 18px;
        margin: 1.4em 0;
    }
    .vs-container {
        margin: 1.4em 0;
    }
    .vs-card {
        border: 1px solid #d1d5db;
        padding: 12px 16px;
        margin-bottom: 1em;
        background-color: #ffffff;
    }
    .vs-card.bad {
        border-left: 3px solid #991b1b;
        background-color: #fffbfb;
    }
    .vs-card.good {
        border-left: 3px solid #111827;
        background-color: #f9fafb;
    }
    .sector-case-card {
        border: 1px solid #e5e7eb;
        padding: 14px;
        margin: 1.2em 0;
        background-color: #f9fafb;
    }
    .sector-adaptive-tag {
        font-size: 0.8em;
        font-weight: 700;
        color: #111827;
        text-transform: uppercase;
    }
    .retenir-box {
        margin-top: 2.2em;
        border: 1px solid #9ca3af;
        border-left: 4px solid #111827;
        background-color: #f9fafb;
        padding: 16px 20px;
    }
    .retenir-tag {
        font-size: 0.78em;
        font-weight: 800;
        color: #111827;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
    .retenir-title {
        color: #000000;
        font-size: 1.15em;
        margin: 0.4em 0 0.5em 0;
    }
    .retenir-desc {
        font-size: 0.95em;
        color: #1f2937;
        line-height: 1.6;
    }
    .retenir-note {
        margin-top: 12px;
        font-size: 0.85em;
        color: #6b7280;
        border-top: 1px dashed #d1d5db;
        padding-top: 8px;
    }
    .cover-container {
        text-align: center;
        margin: 0;
        padding: 0;
    }
    .cover-img {
        max-width: 100%;
        max-height: 100vh;
        height: auto;
    }
    """
    with open(os.path.join(oebps, "style.css"), "w", encoding="utf-8") as f:
        f.write(css_content)

    # 5. Page de couverture (cover.xhtml)
    with open(os.path.join(oebps, "cover.xhtml"), "w", encoding="utf-8") as f:
        f.write("""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr">
<head>
    <title>Couverture</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <style>
        body { margin: 0; padding: 0; text-align: center; background-color: #060b13; }
        img { max-width: 100%; height: auto; max-height: 100vh; display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="cover-container">
        <img src="images/cover.jpg" alt="Couverture — Les Fondamentaux de l'Entrepreneur — Tome 1" />
    </div>
</body>
</html>""")

    # 6. Générer les chapitres
    spine_items = ["cover"]
    manifest_items = [
        '<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
        '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
        '<item id="style" href="style.css" media-type="text/css"/>'
    ]
    toc_entries = []

    # On ignore le chapitre 0 s'il s'agit du placeholder de couverture web
    real_chapters = [c for c in chapters if c.get("id") != "couverture"]

    for i, chap in enumerate(real_chapters):
        chap_id = f"chap_{i+1}"
        file_name = f"{chap_id}.xhtml"
        title = chap.get("title", f"Chapitre {i+1}")
        badge = chap.get("badge", "")
        subtitle = chap.get("subtitle", "")
        read_time = chap.get("readTime", "")
        raw_content = chap.get("content", "")
        exercise = chap.get("exercise", None)

        clean_body = clean_html_for_ebook(raw_content, is_epub=True)
        exercise_html = render_retenir_8020(exercise, is_epub=True)

        meta_line = ""
        if badge or read_time:
            meta_line = f'<div class="chapter-meta">{badge} · Durée estimée : {read_time}</div>'

        chap_html = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr">
<head>
    <title>{xml_escape(title)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <article>
        {f'<div class="chapter-badge">{xml_escape(badge)}</div>' if badge else ''}
        <h1>{xml_escape(title)}</h1>
        {f'<p class="lead-text"><em>{xml_escape(subtitle)}</em></p>' if subtitle else ''}
        {meta_line}
        <div class="chapter-content">
            {clean_body}
        </div>
        {exercise_html}
    </article>
</body>
</html>"""
        with open(os.path.join(oebps, file_name), "w", encoding="utf-8") as f:
            f.write(chap_html)

        manifest_items.append(f'<item id="{chap_id}" href="{file_name}" media-type="application/xhtml+xml"/>')
        spine_items.append(chap_id)
        toc_entries.append((chap_id, file_name, title))

    # 7. Navigation EPUB 3 (nav.xhtml)
    nav_li = "\n".join([f'        <li><a href="{fn}">{xml_escape(t)}</a></li>' for _, fn, t in toc_entries])
    nav_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr">
<head>
    <title>Table des Matières</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Sommaire Général</h1>
        <ol>
{nav_li}
        </ol>
    </nav>
</body>
</html>"""
    with open(os.path.join(oebps, "nav.xhtml"), "w", encoding="utf-8") as f:
        f.write(nav_content)
    manifest_items.append('<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>')

    # 8. Table des matières EPUB 2 (toc.ncx pour Kindle KDP)
    nav_points = "\n".join([f"""        <navPoint id="navPoint-{idx+1}" playOrder="{idx+1}">
            <navLabel><text>{xml_escape(t)}</text></navLabel>
            <content src="{fn}"/>
        </navPoint>""" for idx, (_, fn, t) in enumerate(toc_entries)])
    
    ncx_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:domtomconnect-guide-tome1-2026"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle>
        <text>Les Fondamentaux de l'Entrepreneur — Tome 1</text>
    </docTitle>
    <navMap>
{nav_points}
    </navMap>
</ncx>"""
    with open(os.path.join(oebps, "toc.ncx"), "w", encoding="utf-8") as f:
        f.write(ncx_content)
    manifest_items.append('<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>')

    # 9. content.opf
    manifest_xml = "\n        ".join(manifest_items)
    spine_xml = "\n        ".join([f'<itemref idref="{item}"/>' for item in spine_items])

    opf_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="fr">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="pub-id">urn:uuid:domtomconnect-guide-tome1-2026</dc:identifier>
        <dc:title>Les Fondamentaux de l'Entrepreneur — Tome 1</dc:title>
        <dc:creator>Domtom Connect</dc:creator>
        <dc:publisher>Domtom Connect Éditions</dc:publisher>
        <dc:language>fr</dc:language>
        <dc:description>Le guide universel d'action pour entreprendre sans excuse : mindset, validation terrain, choix du modèle, pricing, encaissement et feuille de route 30 jours pour les Caraïbes, l'Afrique et la diaspora.</dc:description>
        <meta property="dcterms:modified">2026-09-11T00:00:00Z</meta>
        <meta name="cover" content="cover-image"/>
    </metadata>
    <manifest>
        {manifest_xml}
    </manifest>
    <spine toc="ncx">
        {spine_xml}
    </spine>
</package>"""
    with open(os.path.join(oebps, "content.opf"), "w", encoding="utf-8") as f:
        f.write(opf_content)

    # 10. Emballage ZIP en fichier .epub (mimetype non compressé au début)
    epub_out_path = os.path.join(OUTPUT_DIR, "Les-Fondamentaux-de-l-Entrepreneur-Tome-1.epub")
    if os.path.exists(epub_out_path):
        os.remove(epub_out_path)

    with zipfile.ZipFile(epub_out_path, "w") as z:
        # 1. Écriture du mimetype sans compression
        z.write(mimetype_path, "mimetype", compress_type=zipfile.ZIP_STORED)
        
        # 2. Ajout de tous les autres fichiers avec compression DEFLATED
        for folder, _, files in os.walk(build_dir):
            for file in files:
                full_path = os.path.join(folder, file)
                rel_path = os.path.relpath(full_path, build_dir)
                if rel_path == "mimetype":
                    continue
                z.write(full_path, rel_path, compress_type=zipfile.ZIP_DEFLATED)

    epub_size_mb = os.path.getsize(epub_out_path) / (1024 * 1024)
    print(f"✅ Fichier EPUB généré avec succès : {epub_out_path} ({epub_size_mb:.2f} Mo)")
    return epub_out_path

# ==============================================================================
# 2. COMPILATION DU PDF HAUTE DÉFINITION
# ==============================================================================

def build_pdf_html():
    print("\n--- Préparation du document HTML pour génération PDF ---")
    html_out_path = os.path.join(ROOT_DIR, "scratch", "guide-tome1-print.html")
    
    real_chapters = [c for c in chapters if c.get("id") != "couverture"]
    
    # Construction du sommaire
    toc_items = []
    chapters_html_list = []
    
    for idx, chap in enumerate(real_chapters):
        title = chap.get("title", f"Chapitre {idx+1}")
        badge = chap.get("badge", "")
        subtitle = chap.get("subtitle", "")
        read_time = chap.get("readTime", "")
        raw_content = chap.get("content", "")
        exercise = chap.get("exercise", None)
        
        chap_num_display = badge if badge else f"Chapitre {idx+1}"
        toc_items.append(f"""
        <div class="toc-row">
            <span class="toc-badge">{chap_num_display}</span>
            <span class="toc-title">{title}</span>
            <span class="toc-dots"></span>
            <span class="toc-time">{read_time}</span>
        </div>
        """)
        
        clean_body = clean_html_for_ebook(raw_content, is_epub=False)
        exercise_html = render_retenir_8020(exercise, is_epub=False)
        
        chapters_html_list.append(f"""
        <section class="book-chapter">
            <div class="chapter-header">
                <span class="chapter-badge-top">{chap_num_display}</span>
                <h2 class="chapter-title">{title}</h2>
                {f'<p class="chapter-sub"><em>{subtitle}</em></p>' if subtitle else ''}
                <div class="chapter-reading-tag">Durée estimée : {read_time}</div>
            </div>
            <div class="chapter-body">
                {clean_body}
            </div>
            {exercise_html}
        </section>
        """)

    full_toc_html = "\n".join(toc_items)
    all_chapters_html = "\n".join(chapters_html_list)

    # Image de couverture en URI absolue
    cover_uri = "file:///" + COVER_IMG_SRC.replace("\\", "/")

    print_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Les Fondamentaux de l'Entrepreneur — Tome 1</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        @page {{
            size: A4;
            margin: 20mm 18mm 20mm 18mm;
            @bottom-right {{
                content: counter(page);
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 9pt;
                color: #64748b;
            }}
            @bottom-left {{
                content: "Les Fondamentaux de l'Entrepreneur · Tome 1";
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 8pt;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}
        }}

        @page :first {{
            margin: 0;
            @bottom-right {{ content: normal; }}
            @bottom-left {{ content: normal; }}
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Lora', Georgia, serif;
            font-size: 10.5pt;
            line-height: 1.75;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 0;
        }}

        h1, h2, h3, h4, h5, h6, .chapter-badge-top, .toc-badge, .retenir-tag, .chapter-reading-tag {{
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            color: #000000;
        }}

        /* --- 1. COUVERTURE PLEINE PAGE --- */
        .page-cover {{
            page-break-after: always;
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #060b13;
        }}
        .page-cover img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }}

        /* --- 2. PAGE DE GARDE --- */
        .page-garde {{
            page-break-after: always;
            padding: 80px 40px 40px 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 80vh;
        }}
        .garde-tag {{
            font-size: 10pt;
            font-weight: 700;
            color: #4b5563;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }}
        .garde-title {{
            font-size: 25pt;
            font-weight: 900;
            color: #000000;
            line-height: 1.2;
            margin: 24px 0 12px 0;
        }}
        .garde-sub {{
            font-size: 13pt;
            color: #374151;
            font-style: italic;
            max-width: 600px;
            margin: 0 auto;
        }}
        .garde-author {{
            margin-top: 60px;
            font-size: 12pt;
            font-weight: 700;
            color: #111827;
        }}
        .garde-legal {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 8.5pt;
            color: #6b7280;
            line-height: 1.5;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }}

        /* --- 3. SOMMAIRE --- */
        .page-toc {{
            page-break-after: always;
            padding-top: 30px;
        }}
        .toc-main-title {{
            font-size: 18pt;
            font-weight: 800;
            color: #000000;
            border-bottom: 2px solid #111827;
            padding-bottom: 10px;
            margin-bottom: 24px;
        }}
        .toc-row {{
            display: flex;
            align-items: baseline;
            margin-bottom: 9px;
            font-size: 9.5pt;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }}
        .toc-badge {{
            font-weight: 700;
            color: #4b5563;
            width: 110px;
            flex-shrink: 0;
            font-size: 8.5pt;
        }}
        .toc-title {{
            font-weight: 600;
            color: #111827;
            flex-shrink: 0;
            max-width: 62%;
        }}
        .toc-dots {{
            flex-grow: 1;
            border-bottom: 1px dotted #cbd5e1;
            margin: 0 8px;
        }}
        .toc-time {{
            color: #6b7280;
            font-size: 8.5pt;
            flex-shrink: 0;
        }}

        /* --- 4. CHAPITRES --- */
        .book-chapter {{
            page-break-before: always;
            padding-top: 20px;
        }}
        .chapter-header {{
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }}
        .chapter-badge-top {{
            display: inline-block;
            background: #f3f4f6;
            color: #111827;
            font-weight: 700;
            font-size: 8.5pt;
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid #d1d5db;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        .chapter-title {{
            font-size: 17pt;
            font-weight: 800;
            color: #000000;
            line-height: 1.25;
            margin: 12px 0 8px 0;
        }}
        .chapter-sub {{
            font-size: 11pt;
            color: #374151;
            margin: 0 0 10px 0;
        }}
        .chapter-reading-tag {{
            font-size: 8.5pt;
            color: #6b7280;
            font-weight: 500;
        }}

        .chapter-body p {{
            margin-bottom: 1.2em;
            text-align: justify;
            color: #111827;
        }}
        .lead-text {{
            font-size: 11.5pt;
            font-weight: 600;
            color: #000000;
        }}

        /* Encadrés sobres et lisibles */
        .highlight-box {{
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-left: 4px solid #111827;
            padding: 14px 18px;
            margin: 20px 0;
            border-radius: 4px;
            page-break-inside: avoid;
        }}
        .highlight-box h4 {{
            margin-top: 0;
            color: #000000;
            font-size: 10.5pt;
            font-weight: 700;
        }}

        .vs-container {{
            margin: 20px 0;
            page-break-inside: avoid;
        }}
        .vs-card {{
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 12px 16px;
            margin-bottom: 12px;
            page-break-inside: avoid;
            background: #ffffff;
        }}
        .vs-card.bad {{
            border-left: 3px solid #991b1b;
            background: #fffbfb;
        }}
        .vs-card.good {{
            border-left: 3px solid #111827;
            background: #f9fafb;
        }}
        .vs-card h4 {{
            margin-top: 0;
            font-size: 10.5pt;
            color: #000000;
        }}

        .sector-case-card {{
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            border-radius: 4px;
            padding: 14px 18px;
            margin: 16px 0;
            page-break-inside: avoid;
        }}
        .sector-adaptive-tag {{
            font-size: 8pt;
            font-weight: 700;
            color: #111827;
            text-transform: uppercase;
        }}
        .adaptive-offer-col {{
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #d1d5db;
        }}
        .adaptive-offer-name {{
            font-weight: 700;
            color: #000000;
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 4px 0;
        }}

        /* --- 5. POINT CLÉ D'ACTION (80/20) --- */
        .retenir-box {{
            page-break-inside: avoid;
            margin-top: 30px;
            border: 1px solid #cbd5e1;
            border-left: 4px solid #111827;
            border-radius: 4px;
            padding: 16px 20px;
            background: #f9fafb;
        }}
        .retenir-tag {{
            font-size: 8pt;
            font-weight: 800;
            color: #111827;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }}
        .retenir-title {{
            font-size: 12pt;
            font-weight: 700;
            color: #000000;
            margin: 5px 0 6px 0;
        }}
        .retenir-desc {{
            font-size: 9.5pt;
            color: #1f2937;
            line-height: 1.6;
            margin-bottom: 6px;
        }}
        .retenir-note {{
            font-size: 8.5pt;
            color: #6b7280;
            border-top: 1px dashed #d1d5db;
            padding-top: 8px;
            margin-top: 8px;
        }}
    </style>
</head>
<body>

    <!-- 1. COUVERTURE -->
    <div class="page-cover">
        <img src="{cover_uri}" alt="Couverture officielle Tome 1" />
    </div>

    <!-- 2. PAGE DE GARDE -->
    <div class="page-garde">
        <div class="garde-tag">Édition Spéciale · Caraïbes · Afrique · Diaspora</div>
        <div>
            <h1 class="garde-title">Les Fondamentaux de l'Entrepreneur</h1>
            <p class="garde-sub">Tome 1 · La Première Séance : De l'Idée au Terrain sans Excuse</p>
            <div class="garde-author">Écosystème Domtom Connect</div>
        </div>
        <div class="garde-legal">
            © 2026 Domtom Connect. Tous droits réservés.<br>
            Toute reproduction, diffusion ou utilisation sans autorisation préalable écrite est strictement interdite.<br>
            Plateforme officielle : <strong>https://domtomconnect.com</strong>
        </div>
    </div>

    <!-- 3. SOMMAIRE -->
    <div class="page-toc">
        <h2 class="toc-main-title">Sommaire Général de la Consultation</h2>
        {full_toc_html}
    </div>

    <!-- 4. LES 30 CHAPITRES -->
    {all_chapters_html}

</body>
</html>
"""
    with open(html_out_path, "w", encoding="utf-8") as f:
        f.write(print_html)
        
    print(f"✅ Document HTML d'impression généré : {html_out_path}")
    return html_out_path

def convert_html_to_pdf(html_path):
    print("\n--- Conversion du document en PDF Haute Définition via Chrome headless ---")
    pdf_out_path = os.path.join(OUTPUT_DIR, "Les-Fondamentaux-de-l-Entrepreneur-Tome-1.pdf")
    
    # Trouver Chrome ou Edge
    chrome_candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    ]
    browser_exe = None
    for c in chrome_candidates:
        if os.path.exists(c):
            browser_exe = c
            break
            
    if not browser_exe:
        print("❌ Erreur : Impossible de trouver Google Chrome ou Microsoft Edge pour la génération PDF.")
        return None
        
    print(f"Navigateur détecté : {browser_exe}")
    file_url = "file:///" + html_path.replace("\\", "/")
    
    cmd = [
        browser_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_out_path}",
        file_url
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Avertissement lors de la commande headless : {res.stderr}")
        
    if os.path.exists(pdf_out_path):
        size_mb = os.path.getsize(pdf_out_path) / (1024 * 1024)
        print(f"✅ Fichier PDF généré avec succès : {pdf_out_path} ({size_mb:.2f} Mo)")
        return pdf_out_path
    else:
        print("❌ Échec de la génération du fichier PDF.")
        return None

if __name__ == "__main__":
    epub_file = build_epub()
    html_file = build_pdf_html()
    pdf_file = convert_html_to_pdf(html_file)
    
    print("\n==========================================================")
    print("BILAN DE GÉNÉRATION DES E-BOOKS DU TOME 1 :")
    print(f"1. EPUB : {epub_file}")
    print(f"2. PDF  : {pdf_file}")
    print("==========================================================")
