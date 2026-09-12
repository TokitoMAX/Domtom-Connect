import os
import subprocess

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG_IMG = os.path.join(ROOT_DIR, "assets", "images", "quatrieme-couverture-bg.jpg").replace("\\", "/")
OUT_IMG = os.path.join(ROOT_DIR, "assets", "images", "quatrieme-couverture-guide-tome1.jpg")
HTML_PATH = os.path.join(ROOT_DIR, "scratch", "render_back_cover.html")

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}
        html, body {{
            width: 896px;
            height: 1200px;
            overflow: hidden;
            background: #090d16;
        }}
        .back-cover-canvas {{
            position: relative;
            width: 896px;
            height: 1200px;
            background-image: url('file:///{BG_IMG}');
            background-size: 896px 1200px;
            background-repeat: no-repeat;
            background-position: center;
        }}

        /* Zone de texte calée sur le cadre intérieur */
        .content-container {{
            position: absolute;
            left: 105px;
            top: 245px;
            width: 686px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }}

        .header-tag {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.24em;
            color: #d4af37;
            text-transform: uppercase;
            text-align: center;
            margin-bottom: 14px;
            text-shadow: 0 2px 8px rgba(0,0,0,0.85);
        }}

        .hook-title {{
            font-family: 'Cinzel', serif;
            font-size: 18px;
            font-weight: 800;
            line-height: 1.35;
            color: #fef08a;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 18px;
            padding: 0 10px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.9);
        }}

        .divider-line {{
            width: 140px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #eab308, transparent);
            margin: 0 auto 18px auto;
        }}

        .synopsis-text {{
            font-family: 'Lora', Georgia, serif;
            font-size: 14px;
            line-height: 1.8;
            color: #f8fafc;
            text-align: justify;
            text-justify: inter-word;
            text-shadow: 0 1px 6px rgba(0,0,0,0.9);
        }}

        .synopsis-text p {{
            margin-bottom: 14px;
        }}

        .target-box {{
            margin-top: 8px;
            padding: 13px 18px;
            background: rgba(8, 23, 30, 0.78);
            border-left: 3.5px solid #eab308;
            border-radius: 4px;
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.55);
        }}

        .target-title {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 10.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #eab308;
            margin-bottom: 4px;
        }}

        .target-desc {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.5;
            color: #e2e8f0;
        }}

        /* Bas de page éditeur (à gauche du code-barres) */
        .bottom-meta {{
            position: absolute;
            left: 105px;
            top: 1024px;
            width: 515px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #cbd5e1;
            text-shadow: 0 2px 6px rgba(0,0,0,0.9);
        }}

        .bottom-brand {{
            font-size: 12.5px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #ffffff;
            text-transform: uppercase;
            margin-bottom: 3px;
        }}

        .bottom-url {{
            font-size: 11.5px;
            color: #94a3b8;
            margin-bottom: 7px;
        }}

        .bottom-price-tag {{
            display: inline-block;
            font-size: 12.5px;
            font-weight: 800;
            color: #fef08a;
            background: rgba(13, 39, 45, 0.9);
            border: 1px solid rgba(234, 179, 8, 0.45);
            padding: 3px 12px;
            border-radius: 3px;
        }}
    </style>
</head>
<body>
    <div class="back-cover-canvas">
        <div class="content-container">
            <div class="header-tag">Domtom Connect Éditions · Collection Stratégie &amp; Réseau</div>
            <h1 class="hook-title">Ce que vous croyez savoir sur l'entrepreneuriat n'est souvent qu'un mirage théorique.</h1>
            <div class="divider-line"></div>
            <div class="synopsis-text">
                <p>Entreprendre dans les Caraïbes, l'Afrique et la diaspora ne tolère aucune approximation. Loin des discours préfabriqués et des illusions de facilité, ce premier tome pose les fondations concrètes de votre posture : affronter le terrain sans détour, confronter immédiatement votre offre au client réel et dépasser la peur du rejet.</p>
                <p>À travers vingt-huit chapitres structurés comme une consultation directe et sans filtre, vous apprendrez à calculer votre véritable prix plancher, à verrouiller vos marges dès le premier euro, à naviguer les réalités économiques locales et à bâtir un écosystème d'entraide fiable.</p>
                <p>Pas de jargon abstrait. Un plan d'action méthodique conçu pour transformer votre détermination en résultats mesurables, semaine après semaine.</p>
            </div>
            <div class="target-box">
                <div class="target-title">Public concerné</div>
                <div class="target-desc">Artisans, indépendants, créateurs de projets, porteurs d'idées et dirigeants de TPE/PME en quête de rentabilité immédiate et de méthode opérationnelle.</div>
            </div>
        </div>

        <div class="bottom-meta">
            <div class="bottom-brand">Domtom Connect Éditions</div>
            <div class="bottom-url">Plateforme officielle : https://domtomconnect.com</div>
            <div class="bottom-price-tag">Prix public : 5,00 € · Dépôt légal : Septembre 2026</div>
        </div>
    </div>
</body>
</html>"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_exe):
    chrome_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

cmd = [
    chrome_exe,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=896,1200",
    f"--screenshot={OUT_IMG}",
    "file:///" + HTML_PATH.replace("\\", "/")
]
subprocess.run(cmd, check=True)
print(f"[OK] Quatrieme de couverture generee : {OUT_IMG}")
