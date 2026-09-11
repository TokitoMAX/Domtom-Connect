# -*- coding: utf-8 -*-
"""
Compilateur Officiel du Livre d'Auteur — Les Fondamentaux de l'Entrepreneur (Tome 1)
Édition Littéraire Pure · 28 Chapitres d'Action & Consultation
Formats de sortie :
- Manuscrit Markdown intégral : docs/LIVRE-TOME-1-COMPLET.md
- Livre PDF Haute Définition : assets/ebooks/Les-Fondamentaux-de-l-Entrepreneur-Tome-1.pdf
- Livre EPUB 3 Universel : assets/ebooks/Les-Fondamentaux-de-l-Entrepreneur-Tome-1.epub
"""

import os
import sys
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
OUTPUT_DIR = os.path.join(ROOT_DIR, "assets", "ebooks")
COVER_IMG_SRC = os.path.join(ROOT_DIR, "assets", "images", "couverture-guide-tome1.jpg")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Importer les 4 Actes
sys.path.insert(0, os.path.join(ROOT_DIR, "scripts"))
from book_act1 import ACT1_CHAPTERS
from book_act2 import ACT2_CHAPTERS
from book_act3 import ACT3_CHAPTERS
from book_act4 import ACT4_CHAPTERS

ALL_CHAPTERS = ACT1_CHAPTERS + ACT2_CHAPTERS + ACT3_CHAPTERS + ACT4_CHAPTERS
print(f"Chargement réussi : {len(ALL_CHAPTERS)} chapitres d'auteur chargés.")

# ==============================================================================
# 1. GÉNÉRATION DU MANUSCRIT MARKDOWN INTÉGRAL
# ==============================================================================

def build_markdown_manuscript():
    md_path = os.path.join(ROOT_DIR, "docs", "LIVRE-TOME-1-COMPLET.md")
    lines = [
        "# LES FONDAMENTAUX DE L'ENTREPRENEUR — TOME 1",
        "## La Première Séance : De l'Idée au Terrain sans Excuse",
        "### Édition Littéraire Officielle · Domtom Connect Éditions\n",
        "---\n"
    ]
    current_act = ""
    for ch in ALL_CHAPTERS:
        if ch["act"] != current_act:
            current_act = ch["act"]
            lines.append(f"\n# {current_act.upper()}\n")
        lines.append(f"## Chapitre {ch['num']} — {ch['title']}\n")
        lines.append(ch["content"].strip())
        lines.append("\n---\n")
    
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"✅ Manuscrit Markdown généré : {md_path}")
    return md_path

# ==============================================================================
# 2. GÉNÉRATION DU LIVRE PDF HAUTE DÉFINITION
# ==============================================================================

def build_pdf_book():
    html_path = os.path.join(ROOT_DIR, "scratch", "guide-tome1-print.html")
    cover_uri = "file:///" + COVER_IMG_SRC.replace("\\", "/")
    
    # Sommaire
    toc_items = []
    current_act = ""
    for ch in ALL_CHAPTERS:
        if ch["act"] != current_act:
            current_act = ch["act"]
            toc_items.append(f'<div class="toc-act-title">{current_act}</div>')
        toc_items.append(f"""
        <div class="toc-row">
            <span class="toc-num">Chapitre {ch['num']}</span>
            <span class="toc-title">{ch['title']}</span>
            <span class="toc-dots"></span>
        </div>
        """)
    full_toc_html = "\n".join(toc_items)
    
    # Chapitres — parser intelligent : fusionne les blocs liste en prose continue
    def content_to_html(content):
        """Convertit le texte brut en HTML éditorial, fusionnant les listes numérotées
        en paragraphes de prose pour éviter les pages vides."""
        raw_lines = content.strip().split("\n")
        # On reconstitue des blocs sémantiques
        blocks = []
        current_block = []
        for line in raw_lines:
            stripped = line.strip()
            if stripped == "":
                # Double saut de ligne = nouveau bloc
                if current_block:
                    blocks.append(" ".join(current_block))
                    current_block = []
            else:
                current_block.append(stripped)
        if current_block:
            blocks.append(" ".join(current_block))

        p_html = []
        lead_done = False
        list_buffer = []

        def flush_list():
            """Vide le buffer de liste en un seul <p> de prose."""
            if list_buffer:
                prose = " ".join(list_buffer)
                p_html.append(f'<p class="list-prose">{prose}</p>')
                list_buffer.clear()

        for i, block in enumerate(blocks):
            # Détecte si le bloc commence par un numéro (ex: "1. ", "2. ")
            is_list_item = bool(re.match(r'^\d+[.)]\s', block))
            # Ou un mot-clé de type « Premièrement / Deuxièmement / Semaine X :"
            is_keyword_item = bool(re.match(
                r'^(Premi[eè]rement|Deuxi[eè]mement|Troisi[eè]mement|Semaine\s+\w+|Le\s+(premier|deuxi[eè]me|troisi[eè]me)\s+outil|Le\s+(premier|deuxi[eè]me|troisi[eè]me|quatri[eè]me|cinqui[eè]me)\s+(chemin|pilier))',
                block, re.IGNORECASE
            ))

            if is_list_item or is_keyword_item:
                # Nettoie le marqueur de liste et l'ajoute au buffer
                clean = re.sub(r'^\d+[.)]\s+', '', block)
                list_buffer.append(clean)
            else:
                # Bloc normal : vide d'abord le buffer de liste si présent
                flush_list()
                # Supprime le deux-points final d'une phrase d'introduction
                block_clean = re.sub(r'\s*:\s*$', '.', block)
                if not lead_done:
                    p_html.append(f'<p class="lead-p">{block_clean}</p>')
                    lead_done = True
                else:
                    p_html.append(f'<p>{block_clean}</p>')

        flush_list()
        return "\n".join(p_html)

    chapters_html_list = []
    current_act_for_chapter = ""
    for idx, ch in enumerate(ALL_CHAPTERS):
        body_html = content_to_html(ch["content"])
        # Nouvelle page uniquement au début de chaque Acte
        act_break = ch['act'] != current_act_for_chapter
        current_act_for_chapter = ch['act']
        section_class = 'book-chapter act-start' if act_break else 'book-chapter'

        chapters_html_list.append(f"""
        <section class="{section_class}">
            <div class="chapter-top-act">{ch['act']}</div>
            <div class="chapter-top-num">Chapitre {ch['num']}</div>
            <h2 class="chapter-title">{ch['title']}</h2>
            <div class="chapter-body">
                {body_html}
            </div>
        </section>
        """)
    all_chapters_html = "\n".join(chapters_html_list)
    
    print_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Les Fondamentaux de l'Entrepreneur — Tome 1</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        @page {{
            size: A4;
            margin: 24mm 20mm 24mm 20mm;
            @bottom-right {{
                content: counter(page);
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 8.5pt;
                color: #71717a;
            }}
            @bottom-left {{
                content: "Les Fondamentaux de l'Entrepreneur · Tome 1";
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 8pt;
                color: #a1a1aa;
                text-transform: uppercase;
                letter-spacing: 0.08em;
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
            font-size: 11pt;
            line-height: 1.85;
            color: #18181b;
            background: #ffffff;
            margin: 0;
            padding: 0;
        }}

        /* COUVERTURE */
        .page-cover {{
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #090d16;
        }}
        .page-cover img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }}

        /* PAGE DE GARDE */
        .page-garde {{
            page-break-before: always;
            padding: 90px 40px 40px 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 80vh;
        }}
        .garde-tag {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 10pt;
            font-weight: 700;
            color: #52525b;
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }}
        .garde-title {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 26pt;
            font-weight: 900;
            color: #09090b;
            line-height: 1.2;
            margin: 30px 0 14px 0;
            letter-spacing: -0.02em;
        }}
        .garde-sub {{
            font-size: 13.5pt;
            color: #3f3f46;
            font-style: italic;
            max-width: 600px;
            margin: 0 auto;
        }}
        .garde-author {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin-top: 80px;
            font-size: 12pt;
            font-weight: 800;
            color: #18181b;
            letter-spacing: 0.05em;
        }}
        .garde-legal {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 8.5pt;
            color: #71717a;
            line-height: 1.6;
            border-top: 1px solid #e4e4e7;
            padding-top: 24px;
        }}

        /* SOMMAIRE */
        .page-toc {{
            page-break-before: always;
            padding-top: 30px;
        }}
        .toc-main-title {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 20pt;
            font-weight: 900;
            color: #09090b;
            border-bottom: 2px solid #18181b;
            padding-bottom: 12px;
            margin-bottom: 28px;
            letter-spacing: -0.01em;
        }}
        .toc-act-title {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 9pt;
            font-weight: 800;
            color: #52525b;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 20px;
            margin-bottom: 10px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e4e4e7;
        }}
        .toc-row {{
            display: flex;
            align-items: baseline;
            margin-bottom: 8px;
            font-size: 9pt;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }}
        .toc-num {{
            font-weight: 700;
            color: #52525b;
            width: 90px;
            flex-shrink: 0;
            font-size: 8.5pt;
        }}
        .toc-title {{
            font-weight: 600;
            color: #18181b;
            flex-shrink: 0;
            max-width: 68%;
        }}
        .toc-dots {{
            flex-grow: 1;
            border-bottom: 1px dotted #d4d4d8;
            margin: 0 8px;
        }}

        /* CORPS DES CHAPITRES — chaque chapitre commence sur une nouvelle page */
        .book-chapter {{
            page-break-before: always;
            padding-top: 30px;
        }}
        /* Le tout premier chapitre de l'Acte I n'a pas besoin d'un saut supplémentaire
           car le sommaire a déjà son page-break-before */
        .chapter-top-act {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 8.5pt;
            font-weight: 700;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 6px;
        }}
        .chapter-top-num {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 10pt;
            font-weight: 900;
            color: #18181b;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 12px;
        }}
        .chapter-title {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 17pt;
            font-weight: 900;
            color: #09090b;
            line-height: 1.25;
            margin: 0 0 22px 0;
            letter-spacing: -0.01em;
        }}
        .chapter-body p {{
            margin-bottom: 1.3em;
            text-align: justify;
            text-justify: inter-word;
            color: #18181b;
        }}
        /* Listes numérotées fusionnées en prose continue */
        .chapter-body .list-prose {{
            margin-bottom: 1.3em;
            text-align: justify;
            color: #18181b;
        }}
        .lead-p::first-letter {{
            font-size: 34pt;
            float: left;
            line-height: 28pt;
            padding-right: 8px;
            padding-top: 4px;
            font-weight: 600;
            color: #09090b;
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
        <div class="garde-tag">Édition Littéraire Officielle · Caraïbes · Afrique · Diaspora</div>
        <div>
            <h1 class="garde-title">Les Fondamentaux de l'Entrepreneur</h1>
            <p class="garde-sub">Tome 1 · La Première Séance : De l'Idée au Terrain sans Excuse</p>
            <div class="garde-author">Écosystème Domtom Connect</div>
        </div>
        <div class="garde-legal">
            © 2026 Domtom Connect Éditions. Tous droits réservés.<br>
            Toute reproduction, diffusion ou exploitation commerciale sans autorisation écrite préalable est strictement interdite.<br>
            Plateforme officielle : <strong>https://domtomconnect.com</strong>
        </div>
    </div>

    <!-- 3. SOMMAIRE -->
    <div class="page-toc">
        <h2 class="toc-main-title">Sommaire Général de la Consultation</h2>
        {full_toc_html}
    </div>

    <!-- 4. LES 28 CHAPITRES EN PROSE CONTINUE -->
    {all_chapters_html}

</body>
</html>
"""
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(print_html)
    print(f"✅ Document HTML d'impression généré : {html_path}")
    
    # Conversion PDF via Chrome headless
    pdf_out_path = os.path.join(OUTPUT_DIR, "Les-Fondamentaux-de-l-Entrepreneur-Tome-1.pdf")
    chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_exe):
        chrome_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        
    cmd = [
        chrome_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_out_path}",
        "file:///" + html_path.replace("\\", "/")
    ]
    subprocess.run(cmd, check=True)
    size_mb = os.path.getsize(pdf_out_path) / (1024 * 1024)
    print(f"✅ Livre PDF Haute Définition généré : {pdf_out_path} ({size_mb:.2f} Mo)")
    return pdf_out_path

# ==============================================================================
# 3. GÉNÉRATION DU LIVRE EPUB 3 UNIVERSEL
# ==============================================================================

def build_epub_book():
    print("\n--- Construction de l'EPUB 3 Officiel ---")
    build_dir = os.path.join(ROOT_DIR, "scratch", "epub_literary_build")
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir)
    
    # 1. mimetype (sans compression)
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
    shutil.copyfile(COVER_IMG_SRC, os.path.join(images_dir, "cover.jpg"))
    
    # CSS EPUB épuré
    css_content = """
    body {
        font-family: Georgia, serif;
        line-height: 1.75;
        color: #111827;
        margin: 0;
        padding: 5% 6%;
        background-color: #ffffff;
    }
    h1, h2, h3 {
        color: #000000;
        line-height: 1.25;
        font-weight: 700;
    }
    h1 {
        font-size: 1.7em;
        border-bottom: 1px solid #111827;
        padding-bottom: 0.3em;
        margin-top: 1em;
        margin-bottom: 0.8em;
    }
    .act-tag {
        font-size: 0.8em;
        font-weight: bold;
        text-transform: uppercase;
        color: #4b5563;
        letter-spacing: 0.08em;
        margin-bottom: 0.4em;
    }
    .chap-num {
        font-size: 0.9em;
        font-weight: bold;
        text-transform: uppercase;
        color: #000000;
        letter-spacing: 0.1em;
    }
    p {
        margin: 0.9em 0;
        text-align: justify;
        text-indent: 1.2em;
    }
    p:first-of-type {
        text-indent: 0;
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

    # Couverture XHTML
    with open(os.path.join(oebps, "cover.xhtml"), "w", encoding="utf-8") as f:
        f.write("""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr">
<head>
    <title>Couverture</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <style>
        body { margin: 0; padding: 0; text-align: center; background-color: #090d16; }
        img { max-width: 100%; height: auto; max-height: 100vh; display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="cover-container">
        <img src="images/cover.jpg" alt="Couverture — Les Fondamentaux de l'Entrepreneur" />
    </div>
</body>
</html>""")

    spine_items = ["cover"]
    manifest_items = [
        '<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
        '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
        '<item id="style" href="style.css" media-type="text/css"/>'
    ]
    toc_entries = []

    for ch in ALL_CHAPTERS:
        chap_id = f"chap_{ch['num']}"
        file_name = f"{chap_id}.xhtml"
        title = ch["title"]
        act = ch["act"]
        
        paragraphs = ch["content"].strip().split("\n\n")
        p_html = []
        for p in paragraphs:
            p_clean = xml_escape(p.strip().replace("\n", " "))
            p_html.append(f'<p>{p_clean}</p>')
        body_xhtml = "\n".join(p_html)

        chap_xhtml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr">
<head>
    <title>{xml_escape(title)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <article>
        <div class="act-tag">{xml_escape(act)}</div>
        <div class="chap-num">Chapitre {ch['num']}</div>
        <h1>{xml_escape(title)}</h1>
        {body_xhtml}
    </article>
</body>
</html>"""
        with open(os.path.join(oebps, file_name), "w", encoding="utf-8") as f:
            f.write(chap_xhtml)

        manifest_items.append(f'<item id="{chap_id}" href="{file_name}" media-type="application/xhtml+xml"/>')
        spine_items.append(chap_id)
        toc_entries.append((chap_id, file_name, f"Ch. {ch['num']} · {title}"))

    # Navigation EPUB 3 (nav.xhtml)
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

    # Table NCX (Kindle KDP)
    nav_points = "\n".join([f"""        <navPoint id="navPoint-{idx+1}" playOrder="{idx+1}">
            <navLabel><text>{xml_escape(t)}</text></navLabel>
            <content src="{fn}"/>
        </navPoint>""" for idx, (_, fn, t) in enumerate(toc_entries)])
    ncx_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:domtomconnect-guide-tome1-litteraire-2026"/>
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

    # content.opf
    manifest_xml = "\n        ".join(manifest_items)
    spine_xml = "\n        ".join([f'<itemref idref="{item}"/>' for item in spine_items])
    opf_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="fr">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="pub-id">urn:uuid:domtomconnect-guide-tome1-litteraire-2026</dc:identifier>
        <dc:title>Les Fondamentaux de l'Entrepreneur — Tome 1</dc:title>
        <dc:creator>Domtom Connect</dc:creator>
        <dc:publisher>Domtom Connect Éditions</dc:publisher>
        <dc:language>fr</dc:language>
        <dc:description>Le livre officiel de consultation et d'action pour entreprendre dans les Caraïbes, l'Afrique et la diaspora. Édition littéraire pure.</dc:description>
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

    # Emballage ZIP
    epub_out_path = os.path.join(OUTPUT_DIR, "Les-Fondamentaux-de-l-Entrepreneur-Tome-1.epub")
    if os.path.exists(epub_out_path):
        os.remove(epub_out_path)

    with zipfile.ZipFile(epub_out_path, "w") as z:
        z.write(mimetype_path, "mimetype", compress_type=zipfile.ZIP_STORED)
        for folder, _, files in os.walk(build_dir):
            for file in files:
                full_path = os.path.join(folder, file)
                rel_path = os.path.relpath(full_path, build_dir)
                if rel_path == "mimetype":
                    continue
                z.write(full_path, rel_path, compress_type=zipfile.ZIP_DEFLATED)

    epub_size_mb = os.path.getsize(epub_out_path) / (1024 * 1024)
    print(f"✅ Livre EPUB 3 Officiel généré : {epub_out_path} ({epub_size_mb:.2f} Mo)")
    return epub_out_path

if __name__ == "__main__":
    md_file = build_markdown_manuscript()
    pdf_file = build_pdf_book()
    epub_file = build_epub_book()
    print("\n==================================================================")
    print("COMPILATION FINALE TERMINÉE AVEC SUCCÈS :")
    print(f"1. Manuscrit Markdown : {md_file}")
    print(f"2. Livre PDF HD       : {pdf_file}")
    print(f"3. Livre EPUB 3       : {epub_file}")
    print("==================================================================")
