# -*- coding: utf-8 -*-
import json

with open("scratch/beats_data_v4_8020.json", "r", encoding="utf-8") as f:
    beats = json.load(f)

# Chapters for studio
chapters = [
    {"label": "01. Accroche", "sec": 0.0},
    {"label": "02. Loïc & Avatar IA", "sec": 21.2},
    {"label": "03. Preuve en direct", "sec": 51.5},
    {"label": "04. Loi du 80/20", "sec": 69.7},
    {"label": "05. Cas Martinique", "sec": 98.2},
    {"label": "06. Plan 14 jours", "sec": 125.9},
    {"label": "07. Semaine 1", "sec": 133.8},
    {"label": "08. Semaine 2", "sec": 175.0},
    {"label": "09. Bilan & Résultats", "sec": 201.7},
    {"label": "10. Domtom Connect", "sec": 212.3},
    {"label": "11. Tremplin & DTC Pulse", "sec": 242.1},
    {"label": "12. Action & Stay co.", "sec": 275.1}
]

# Map chapter to beats
for b in beats:
    sec = b["start"]
    if sec < 21.2:
        b["chapter"] = "01. Accroche"
    elif sec < 51.5:
        b["chapter"] = "02. Loïc & Avatar IA"
    elif sec < 69.7:
        b["chapter"] = "03. Preuve en direct"
    elif sec < 98.2:
        b["chapter"] = "04. Loi du 80/20"
    elif sec < 125.9:
        b["chapter"] = "05. Cas Martinique"
    elif sec < 133.8:
        b["chapter"] = "06. Plan 14 jours"
    elif sec < 175.0:
        b["chapter"] = "07. Semaine 1"
    elif sec < 201.7:
        b["chapter"] = "08. Semaine 2"
    elif sec < 212.3:
        b["chapter"] = "09. Bilan & Résultats"
    elif sec < 242.1:
        b["chapter"] = "10. Domtom Connect"
    elif sec < 275.1:
        b["chapter"] = "11. Tremplin & DTC Pulse"
    else:
        b["chapter"] = "12. Action & Stay co."

def build_slides_html(is_render_page=False):
    html = []
    for i, b in enumerate(beats):
        active_cls = " active" if i == 0 else ""
        html.append(f'        <!-- SLIDE {i+1:02d} : {b["tag"].upper()} ({b["start"]}s - {b["end"]}s) -->')
        html.append(f'        <div class="beat-scene{active_cls}" id="{b["id"]}">')
        html.append(f'            <span class="b-tag">{b["tag"]}</span>')
        html.append(f'            <h1 class="b-title">{b["title"]}</h1>')
        html.append(f'            <p class="b-desc">{b["desc"]}</p>')
        
        if b.get("isPulse"):
            html.append('            <div class="phones-container">')
            html.append('                <img src="assets/images/screenshots/screen1.png" class="phone-img" alt="DTC Pulse Écran 1">')
            html.append('                <img src="assets/images/logo-pulse.png" class="pulse-center-logo" alt="Logo DTC Pulse">')
            html.append('                <img src="assets/images/screenshots/screen2.png" class="phone-img" alt="DTC Pulse Écran 2">')
            html.append('            </div>')
        elif b.get("cards"):
            html.append('            <div class="cards-row">')
            for c in b["cards"]:
                cls = f'info-card {c.get("type", "")}'.strip()
                html.append(f'                <div class="{cls}">')
                html.append(f'                    <div class="info-card-title">{c["title"]}</div>')
                html.append(f'                    <div class="info-card-text">{c["text"]}</div>')
                html.append('                </div>')
            html.append('            </div>')
            
        if b.get("isFinal"):
            html.append('            <div style="font-family: \'Cabinet Grotesk\', sans-serif; font-size: 44px; font-weight: 900; color: #fff; margin-top: 14px;">')
            html.append('                Stay <span style="color: var(--emerald);">co.</span>')
            html.append('            </div>')
            
        html.append('        </div>\n')
    return "\n".join(html)

slides_code = build_slides_html()

# ----------------- 1. RENDER-VIDEO4-8020.HTML -----------------
render_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domtom Connect • Rendu Pur Vidéo 4 (Loi 80/20 & Plan d'Action 14 Jours)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Cabinet+Grotesk:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {{
            --obsidian: #030605;
            --emerald: #00BFA6;
            --emerald-bright: #10B981;
            --amber: #F59E0B;
            --red: #EF4444;
            --white: #FFFFFF;
            --gray-300: #D1D5DB;
            --gray-400: #9CA3AF;
            --border: rgba(255, 255, 255, 0.08);
            --border-emerald: rgba(0, 191, 166, 0.35);
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }}

        html, body {{
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background-color: #000000;
            color: var(--white);
            font-family: 'Plus Jakarta Sans', sans-serif;
        }}

        .viewport-inner {{
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            text-align: center;
            overflow: hidden;
            background: radial-gradient(circle at 50% 25%, #05140e 0%, #010403 70%, #000000 100%);
        }}

        .ambient-glow {{
            position: absolute;
            width: 550px;
            height: 550px;
            border-radius: 50%;
            background: rgba(0, 191, 166, 0.16);
            filter: blur(140px);
            pointer-events: none;
        }}

        .screen-watermark {{
            position: absolute;
            top: 36px;
            left: 44px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 30;
            opacity: 0.85;
        }}

        .screen-watermark img {{
            height: 22px;
            width: auto;
        }}

        .screen-timeline {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(255, 255, 255, 0.08);
            z-index: 40;
        }}

        .screen-timeline-fill {{
            height: 100%;
            width: 0%;
            background: var(--emerald);
            box-shadow: 0 0 10px var(--emerald);
        }}

        .avatar-widget {{
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            z-index: 25;
        }}

        .avatar-circle-frame {{
            width: 110px;
            height: 110px;
            border-radius: 50%;
            padding: 4px;
            background: linear-gradient(135deg, var(--emerald) 0%, rgba(255, 255, 255, 0.2) 100%);
            box-shadow: 0 10px 30px rgba(0, 191, 166, 0.35);
            margin-bottom: 10px;
            transition: all 0.3s ease;
        }}

        .avatar-circle-img {{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            display: block;
        }}

        .avatar-badge-name {{
            background: rgba(3, 6, 5, 0.9);
            border: 1px solid var(--border-emerald);
            padding: 4px 14px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 800;
            color: var(--emerald);
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }}

        .real-shorts-badge {{
            margin-top: 10px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid var(--emerald);
            border-radius: 100px;
            padding: 4px 14px 4px 6px;
            backdrop-filter: blur(10px);
            animation: pulse-glow 2s infinite ease-in-out;
        }}

        @keyframes pulse-glow {{
            0%, 100% {{ box-shadow: 0 0 15px rgba(0, 191, 166, 0.3); }}
            50% {{ box-shadow: 0 0 25px rgba(0, 191, 166, 0.6); }}
        }}

        .real-shorts-thumb {{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid #FFFFFF;
        }}

        .real-shorts-meta {{
            text-align: left;
        }}

        .real-shorts-title {{
            font-size: 11px;
            font-weight: 800;
            color: #FFFFFF;
        }}

        .real-shorts-sub {{
            font-size: 9px;
            color: var(--emerald-bright);
            font-weight: 600;
        }}

        .beat-scene {{
            display: none;
            flex-direction: column;
            align-items: center;
            max-width: 900px;
            width: 100%;
            z-index: 20;
            animation: fadeInScene 0.35s ease-out forwards;
        }}

        .beat-scene.active {{
            display: flex;
        }}

        @keyframes fadeInScene {{
            from {{ opacity: 0; transform: translateY(10px) scale(0.98); }}
            to {{ opacity: 1; transform: translateY(0) scale(1); }}
        }}

        .b-tag {{
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: var(--emerald);
            text-transform: uppercase;
            margin-bottom: 10px;
            background: rgba(0, 191, 166, 0.12);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid rgba(0, 191, 166, 0.3);
        }}

        .b-title {{
            font-family: 'Cabinet Grotesk', sans-serif;
            font-size: 46px;
            font-weight: 900;
            line-height: 1.12;
            letter-spacing: -0.5px;
            margin-bottom: 14px;
            color: #FFFFFF;
            max-width: 850px;
        }}

        .b-title .em {{
            color: var(--emerald);
        }}

        .b-title .danger {{
            color: var(--red);
        }}

        .b-title .amber {{
            color: var(--amber);
        }}

        .b-desc {{
            font-size: 17px;
            font-weight: 500;
            color: var(--gray-300);
            line-height: 1.45;
            max-width: 720px;
        }}

        .cards-row {{
            display: flex;
            gap: 16px;
            margin-top: 18px;
            width: 100%;
            max-width: 820px;
        }}

        .info-card {{
            flex: 1;
            padding: 14px 18px;
            border-radius: 14px;
            text-align: left;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
        }}

        .info-card.highlight {{
            background: rgba(0, 191, 166, 0.08);
            border-color: var(--border-emerald);
        }}

        .info-card.danger {{
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.3);
        }}

        .info-card.amber {{
            background: rgba(245, 158, 11, 0.08);
            border-color: rgba(245, 158, 11, 0.3);
        }}

        .info-card-title {{
            font-size: 14px;
            font-weight: 800;
            color: var(--white);
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }}

        .info-card-text {{
            font-size: 13px;
            color: var(--gray-400);
            line-height: 1.4;
        }}

        .phones-container {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin: 12px 0;
        }}

        .phone-img {{
            height: 120px;
            width: auto;
            border-radius: 10px;
            border: 1px solid var(--border-emerald);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        }}

        .pulse-center-logo {{
            height: 52px;
            width: auto;
        }}

        .caption-bar {{
            position: absolute;
            bottom: 30px;
            left: 30px;
            right: 30px;
            display: flex;
            justify-content: center;
            z-index: 35;
            pointer-events: none;
        }}

        .caption-pill {{
            background: rgba(3, 6, 5, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(12px);
            padding: 10px 22px;
            border-radius: 100px;
            font-size: 15px;
            font-weight: 600;
            color: var(--white);
            max-width: 85%;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }}

        /* MODE 9:16 VERTICAL */
        body.mode-9-16 .viewport-inner {{
            padding: 24px;
        }}

        body.mode-9-16 .avatar-circle-frame {{
            width: 90px;
            height: 90px;
        }}

        body.mode-9-16 .b-title {{
            font-size: 30px;
            line-height: 1.15;
            max-width: 320px;
        }}

        body.mode-9-16 .b-desc {{
            font-size: 13px;
            line-height: 1.35;
            max-width: 300px;
        }}

        body.mode-9-16 .cards-row {{
            flex-direction: column;
            gap: 8px;
            max-width: 310px;
        }}

        body.mode-9-16 .info-card {{
            padding: 10px 14px;
        }}

        body.mode-9-16 .info-card-title {{
            font-size: 12px;
        }}

        body.mode-9-16 .info-card-text {{
            font-size: 11px;
        }}

        body.mode-9-16 .phone-img {{
            height: 95px;
        }}

        body.mode-9-16 .pulse-center-logo {{
            height: 40px;
        }}

        body.mode-9-16 .caption-pill {{
            font-size: 12px;
            padding: 8px 16px;
        }}
    </style>
</head>
<body>

    <div class="viewport-inner">
        <div class="ambient-glow"></div>

        <div class="screen-watermark">
            <img src="assets/images/logo-domtomconnect-white.png" alt="Domtom Connect">
        </div>

        <div class="screen-timeline">
            <div class="screen-timeline-fill" id="screen-fill"></div>
        </div>

        <div class="avatar-widget" id="avatarWidget">
            <div class="avatar-circle-frame">
                <img src="assets/images/loic_avatar_shocked.jpg" id="avatarImg" class="avatar-circle-img" alt="Loïc Villeronce Avatar">
            </div>
            <div class="avatar-badge-name" id="avatarBadge">L'ERREUR CLASSIQUE</div>

            <div class="real-shorts-badge" id="realShortsBadge" style="display: none;">
                <img src="assets/images/loic_reel_short.png" class="real-shorts-thumb" alt="Loïc Shorts YouTube">
                <div class="real-shorts-meta">
                    <div class="real-shorts-title">Loïc Villeronce en direct</div>
                    <div class="real-shorts-sub">✓ YouTube Shorts, TikTok, Instagram</div>
                </div>
            </div>
        </div>

{slides_code}

        <div class="caption-bar">
            <div class="caption-pill" id="caption-pill">Domtom Connect</div>
        </div>

    </div>

    <audio id="audio" src="assets/audio/video4_8020_complete.mp3" preload="auto"></audio>

    <script>
        const audio = document.getElementById('audio');
        const screenFill = document.getElementById('screen-fill');
        const captionPill = document.getElementById('caption-pill');
        const avatarImg = document.getElementById('avatarImg');
        const avatarBadge = document.getElementById('avatarBadge');
        const realShortsBadge = document.getElementById('realShortsBadge');

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('format') === '9-16') {{
            document.body.className = 'mode-9-16';
        }}

        const avatarImages = {{
            boss: 'assets/images/loic_avatar_boss.jpg',
            thinking: 'assets/images/loic_avatar_thinking.jpg',
            shocked: 'assets/images/loic_avatar_shocked.jpg'
        }};

        const beats = {json.dumps(beats, ensure_ascii=False, indent=12)};

        let activeBeatIdx = -1;

        function updateTime(cur) {{
            const dur = audio.duration || 300.72;
            const pct = Math.min(100, (cur / dur) * 100);
            if (screenFill) screenFill.style.width = pct + '%';

            let idx = 0;
            for (let i = 0; i < beats.length; i++) {{
                if (cur >= beats[i].start && cur < beats[i].end) {{
                    idx = i;
                    break;
                }}
            }}
            if (cur >= beats[beats.length - 1].end) {{
                idx = beats.length - 1;
            }}

            if (idx !== activeBeatIdx) {{
                activeBeatIdx = idx;
                const b = beats[idx];

                beats.forEach((item, i) => {{
                    const el = document.getElementById(item.id);
                    if (el) el.classList.toggle('active', i === idx);
                }});

                if (captionPill) captionPill.textContent = b.caption;
                if (b.avatar && avatarImages[b.avatar]) avatarImg.src = avatarImages[b.avatar];
                if (b.badge) avatarBadge.textContent = b.badge;
                if (realShortsBadge) realShortsBadge.style.display = b.showShorts ? 'inline-flex' : 'none';
            }}
        }}

        window.updateTime = updateTime;

        audio.addEventListener('timeupdate', () => {{
            updateTime(audio.currentTime);
        }});

        document.body.addEventListener('click', () => {{
            if (audio.paused) audio.play();
        }});
    </script>
</body>
</html>
"""

with open("render-video4-8020.html", "w", encoding="utf-8") as f:
    f.write(render_html)
print("Updated render-video4-8020.html successfully!")

# ----------------- 2. VIDEO-STUDIO-VIDEO4.HTML -----------------
# Read the head, styles, and controls from video-studio-video4.html and inject new chapters and beats
chapters_html = []
for ch in chapters:
    cls = " active" if ch["sec"] == 0.0 else ""
    chapters_html.append(f'        <button class="chapter-pill{cls}" onclick="jumpTo({ch["sec"]})">{ch["label"]}</button>')
chapters_bar_code = "\n".join(chapters_html)

studio_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domtom Connect • Studio Vidéo 4 • La Loi du 80/20 & Plan d'Action 14 Jours</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Cabinet+Grotesk:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {{
            --obsidian: #030605;
            --emerald: #00BFA6;
            --emerald-bright: #10B981;
            --emerald-glow: rgba(0, 191, 166, 0.35);
            --amber: #F59E0B;
            --red: #EF4444;
            --white: #FFFFFF;
            --gray-300: #D1D5DB;
            --gray-400: #9CA3AF;
            --gray-600: #4B5563;
            --border: rgba(255, 255, 255, 0.08);
            --border-emerald: rgba(0, 191, 166, 0.35);
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }}

        body {{
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--obsidian);
            color: var(--white);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 50% 15%, rgba(0, 191, 166, 0.08) 0%, transparent 60%),
                linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
            background-size: 100% 100%, 40px 40px, 40px 40px;
        }}

        /* Top Bar */
        header {{
            padding: 14px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            background: rgba(3, 6, 5, 0.95);
            backdrop-filter: blur(20px);
            position: sticky;
            top: 0;
            z-index: 100;
        }}

        .brand-badge {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}

        .brand-badge img {{
            height: 24px;
            width: auto;
        }}

        .brand-text {{
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #FFFFFF;
        }}

        .header-tools {{
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }}

        .format-switch {{
            display: flex;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 3px;
            gap: 3px;
        }}

        .format-btn {{
            background: transparent;
            border: none;
            color: var(--gray-400);
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }}

        .format-btn.active {{
            background: rgba(0, 191, 166, 0.15);
            color: var(--white);
            border: 1px solid var(--border-emerald);
        }}

        .btn-download-action {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            background: rgba(0, 191, 166, 0.12);
            color: var(--emerald);
            border: 1px solid var(--border-emerald);
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
        }}

        .btn-download-action:hover {{
            background: var(--emerald);
            color: #000;
        }}

        /* Chapters Bar */
        .chapters-bar {{
            padding: 10px 32px;
            background: rgba(5, 10, 8, 0.85);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            white-space: nowrap;
        }}

        .chapters-bar::-webkit-scrollbar {{
            height: 4px;
        }}

        .chapters-bar::-webkit-scrollbar-thumb {{
            background: var(--border-emerald);
            border-radius: 4px;
        }}

        .chapter-pill {{
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border);
            color: var(--gray-400);
            padding: 5px 12px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }}

        .chapter-pill:hover {{
            color: var(--white);
            border-color: rgba(255, 255, 255, 0.2);
        }}

        .chapter-pill.active {{
            background: rgba(0, 191, 166, 0.18);
            color: var(--white);
            border-color: var(--emerald);
        }}

        /* Main Workspace */
        main {{
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px 32px 40px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
        }}

        .stage-box {{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }}

        /* Video Screen Mockup */
        .video-screen {{
            position: relative;
            background: #000000;
            border: 1px solid var(--border-emerald);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 191, 166, 0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        }}

        .video-screen.landscape {{
            width: 960px;
            height: 540px;
        }}

        .video-screen.vertical {{
            width: 337px;
            height: 600px;
        }}

        .viewport-inner {{
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            text-align: center;
            overflow: hidden;
            background: radial-gradient(circle at 50% 25%, #05140e 0%, #010403 70%, #000000 100%);
        }}

        .ambient-glow {{
            position: absolute;
            width: 450px;
            height: 450px;
            border-radius: 50%;
            background: rgba(0, 191, 166, 0.15);
            filter: blur(120px);
            pointer-events: none;
        }}

        .screen-watermark {{
            position: absolute;
            top: 24px;
            left: 28px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 30;
            opacity: 0.85;
        }}

        .screen-watermark img {{
            height: 18px;
            width: auto;
        }}

        .screen-timeline {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(255, 255, 255, 0.08);
            z-index: 40;
        }}

        .screen-timeline-fill {{
            height: 100%;
            width: 0%;
            background: var(--emerald);
            box-shadow: 0 0 10px var(--emerald);
        }}

        .avatar-widget {{
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 14px;
            z-index: 25;
        }}

        .avatar-circle-frame {{
            width: 88px;
            height: 88px;
            border-radius: 50%;
            padding: 3px;
            background: linear-gradient(135deg, var(--emerald) 0%, rgba(255, 255, 255, 0.2) 100%);
            box-shadow: 0 8px 24px rgba(0, 191, 166, 0.35);
            margin-bottom: 8px;
            transition: all 0.3s ease;
        }}

        .video-screen.vertical .avatar-circle-frame {{
            width: 72px;
            height: 72px;
            margin-bottom: 6px;
        }}

        .avatar-circle-img {{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            display: block;
        }}

        .avatar-badge-name {{
            background: rgba(3, 6, 5, 0.9);
            border: 1px solid var(--border-emerald);
            padding: 3px 12px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 800;
            color: var(--emerald);
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }}

        .real-shorts-badge {{
            margin-top: 8px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid var(--emerald);
            border-radius: 100px;
            padding: 4px 12px 4px 6px;
            backdrop-filter: blur(10px);
            animation: pulse-glow 2s infinite ease-in-out;
        }}

        @keyframes pulse-glow {{
            0%, 100% {{ box-shadow: 0 0 12px rgba(0, 191, 166, 0.3); }}
            50% {{ box-shadow: 0 0 22px rgba(0, 191, 166, 0.6); }}
        }}

        .real-shorts-thumb {{
            width: 26px;
            height: 26px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid #FFFFFF;
        }}

        .real-shorts-meta {{
            text-align: left;
        }}

        .real-shorts-title {{
            font-size: 10px;
            font-weight: 800;
            color: #FFFFFF;
        }}

        .real-shorts-sub {{
            font-size: 8px;
            color: var(--emerald-bright);
            font-weight: 600;
        }}

        .beat-scene {{
            display: none;
            flex-direction: column;
            align-items: center;
            max-width: 820px;
            width: 100%;
            z-index: 20;
            animation: fadeInScene 0.3s ease-out forwards;
        }}

        .beat-scene.active {{
            display: flex;
        }}

        .b-tag {{
            display: inline-block;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: var(--emerald);
            text-transform: uppercase;
            margin-bottom: 8px;
            background: rgba(0, 191, 166, 0.12);
            padding: 3px 10px;
            border-radius: 100px;
            border: 1px solid rgba(0, 191, 166, 0.3);
        }}

        .b-title {{
            font-family: 'Cabinet Grotesk', sans-serif;
            font-size: 38px;
            font-weight: 900;
            line-height: 1.15;
            letter-spacing: -0.5px;
            margin-bottom: 10px;
            color: #FFFFFF;
        }}

        .video-screen.vertical .b-title {{
            font-size: 24px;
            line-height: 1.18;
            max-width: 280px;
        }}

        .b-title .em {{
            color: var(--emerald);
        }}

        .b-title .danger {{
            color: var(--red);
        }}

        .b-title .amber {{
            color: var(--amber);
        }}

        .b-desc {{
            font-size: 15px;
            font-weight: 500;
            color: var(--gray-300);
            line-height: 1.45;
            max-width: 700px;
        }}

        .video-screen.vertical .b-desc {{
            font-size: 12px;
            line-height: 1.35;
            max-width: 280px;
        }}

        .cards-row {{
            display: flex;
            gap: 14px;
            margin-top: 14px;
            width: 100%;
            max-width: 760px;
        }}

        .video-screen.vertical .cards-row {{
            flex-direction: column;
            gap: 8px;
            max-width: 290px;
            margin-top: 10px;
        }}

        .info-card {{
            flex: 1;
            padding: 12px 16px;
            border-radius: 12px;
            text-align: left;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
        }}

        .info-card.highlight {{
            background: rgba(0, 191, 166, 0.08);
            border-color: var(--border-emerald);
        }}

        .info-card.danger {{
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.3);
        }}

        .info-card.amber {{
            background: rgba(245, 158, 11, 0.08);
            border-color: rgba(245, 158, 11, 0.3);
        }}

        .info-card-title {{
            font-size: 13px;
            font-weight: 800;
            color: var(--white);
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }}

        .info-card-text {{
            font-size: 12px;
            color: var(--gray-400);
            line-height: 1.4;
        }}

        .phones-container {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            margin: 10px 0;
        }}

        .phone-img {{
            height: 110px;
            width: auto;
            border-radius: 10px;
            border: 1px solid var(--border-emerald);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        }}

        .video-screen.vertical .phone-img {{
            height: 85px;
        }}

        .pulse-center-logo {{
            height: 48px;
            width: auto;
        }}

        .caption-bar {{
            position: absolute;
            bottom: 18px;
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: center;
            z-index: 35;
            pointer-events: none;
        }}

        .caption-pill {{
            background: rgba(3, 6, 5, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(12px);
            padding: 7px 18px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 600;
            color: var(--white);
            max-width: 85%;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
            transition: all 0.2s ease;
        }}

        .video-screen.vertical .caption-pill {{
            font-size: 11px;
            padding: 6px 14px;
            bottom: 12px;
        }}

        /* Player Bar */
        .player-bar {{
            width: 100%;
            max-width: 960px;
            margin-top: 16px;
            background: rgba(8, 14, 12, 0.9);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }}

        .progress-track {{
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            cursor: pointer;
            position: relative;
        }}

        .progress-bar-fill {{
            height: 100%;
            width: 0%;
            background: var(--emerald);
            border-radius: 4px;
            box-shadow: 0 0 10px var(--emerald);
        }}

        .player-controls {{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }}

        .ctrl-left {{
            display: flex;
            align-items: center;
            gap: 14px;
        }}

        .btn-play {{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: var(--emerald);
            border: none;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }}

        .btn-play:hover {{
            transform: scale(1.05);
            background: var(--emerald-bright);
        }}

        .time-display {{
            font-size: 12px;
            font-weight: 700;
            color: var(--gray-400);
            font-variant-numeric: tabular-nums;
        }}

        .ctrl-center {{
            font-size: 12px;
            font-weight: 800;
            color: var(--emerald);
            letter-spacing: 0.5px;
        }}

        /* Description YouTube & Ressources */
        .details-grid {{
            width: 100%;
            max-width: 960px;
            margin-top: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }}

        .details-card {{
            background: rgba(8, 14, 12, 0.7);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px 20px;
        }}

        .details-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }}

        .details-title {{
            font-size: 13px;
            font-weight: 800;
            color: var(--white);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .btn-copy {{
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--emerald);
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }}

        .btn-copy:hover {{
            background: rgba(0, 191, 166, 0.15);
            border-color: var(--emerald);
        }}

        .details-content {{
            font-size: 12px;
            color: var(--gray-300);
            line-height: 1.5;
            white-space: pre-wrap;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 8px;
            padding: 10px 14px;
            max-height: 180px;
            overflow-y: auto;
        }}

        .toast {{
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--emerald);
            color: #000;
            font-weight: 800;
            font-size: 12px;
            padding: 10px 18px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 191, 166, 0.4);
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.25s ease;
            pointer-events: none;
            z-index: 200;
        }}

        .toast.show {{
            opacity: 1;
            transform: translateY(0);
        }}
    </style>
</head>
<body>

    <header>
        <div class="brand-badge">
            <img src="assets/images/logo-domtomconnect-white.png" alt="Domtom Connect">
            <span class="brand-text">STUDIO VIDÉO 4</span>
        </div>

        <div class="header-tools">
            <div class="format-switch">
                <button class="format-btn active" id="btn-169" onclick="setFormat('16-9')">Paysage 16:9</button>
                <button class="format-btn" id="btn-916" onclick="setFormat('9-16')">Shorts 9:16</button>
            </div>

            <a href="render-video4-8020.html" target="_blank" class="btn-download-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Ouvrir Rendu Plein Écran
            </a>

            <a href="assets/audio/video4_8020_complete.mp3" download="Voix_Off_Video4_8020.mp3" class="btn-download-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Audio MP3 (5m01)
            </a>

            <a href="scripts/script_youtube_video4_loi_8020_marketing.md" download="Script_Video4_Loi_8020.md" class="btn-download-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Script .md
            </a>
        </div>
    </header>

    <div class="chapters-bar">
{chapters_bar_code}
    </div>

    <main>
        <div class="stage-box">

            <div class="video-screen landscape" id="screen">
                <div class="viewport-inner">
                    <div class="ambient-glow"></div>

                    <div class="screen-watermark">
                        <img src="assets/images/logo-domtomconnect-white.png" alt="Domtom Connect">
                    </div>

                    <div class="screen-timeline">
                        <div class="screen-timeline-fill" id="screen-fill"></div>
                    </div>

                    <div class="avatar-widget" id="avatarWidget">
                        <div class="avatar-circle-frame">
                            <img src="assets/images/loic_avatar_shocked.jpg" id="avatarImg" class="avatar-circle-img" alt="Loïc Villeronce Avatar">
                        </div>
                        <div class="avatar-badge-name" id="avatarBadge">L'ERREUR CLASSIQUE</div>

                        <div class="real-shorts-badge" id="realShortsBadge" style="display: none;">
                            <img src="assets/images/loic_reel_short.png" class="real-shorts-thumb" alt="Loïc Shorts YouTube">
                            <div class="real-shorts-meta">
                                <div class="real-shorts-title">Loïc Villeronce en direct</div>
                                <div class="real-shorts-sub">✓ YouTube Shorts, TikTok, Instagram</div>
                            </div>
                        </div>
                    </div>

{slides_code}

                    <div class="caption-bar">
                        <div class="caption-pill" id="caption-pill">Domtom Connect</div>
                    </div>

                </div>
            </div>

            <!-- Player Bar -->
            <div class="player-bar">
                <div class="progress-track" id="track" onclick="seek(event)">
                    <div class="progress-bar-fill" id="fill"></div>
                </div>

                <div class="player-controls">
                    <div class="ctrl-left">
                        <button class="btn-play" id="btnPlay" onclick="togglePlay()">
                            <svg id="playIcon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </button>
                        <span class="time-display" id="timeDisplay"><span id="curTime">00:00</span> / 05:01</span>
                    </div>

                    <div class="ctrl-center" id="chapterIndicator">01. Accroche</div>

                    <div class="ctrl-right">
                        <a href="render-video4-8020.html" target="_blank" style="color: var(--gray-400); font-size: 11px; text-decoration: none; font-weight: 700;">
                            Mode Rendu Pur ↗
                        </a>
                    </div>
                </div>
            </div>

            <!-- YouTube Metadata Box -->
            <div class="details-grid">
                <div class="details-card">
                    <div class="details-header">
                        <span class="details-title">Titre & Chapitrage YouTube</span>
                        <button class="btn-copy" onclick="copyText('yt-title')">Copier</button>
                    </div>
                    <div class="details-content" id="yt-title">La loi du 80/20 appliquée en Martinique, le plan d'action chirurgical sur deux semaines

00:00 Le piège de l'éparpillement et la promesse du plan d'action
00:21 Loïc Villeronce, pourquoi un avatar animé et une IA
00:51 Mes prises de parole directes sur les Shorts YouTube
01:09 La loi du 80/20 vulgarisée, 80% d'action et 20% de réflexion
01:38 Cas concret en Martinique, lancer son projet sans bloquer son cash
02:05 Méthode d'accélération sur deux semaines
02:13 Semaine 1, valider son offre et confronter le marché local
02:55 Semaine 2, encaisser les premières commandes et accélérer
03:21 Bilan des 14 jours chrono
03:32 Les solutions Domtom Connect, Anamnèse et Ebook interactif
04:02 Le Programme Tremplin, copilotage opérationnel direct
04:20 Réseau WhatsApp d'affaires et application DTC Pulse
04:35 Prendre son échange direct de 30 minutes sur Calendly
04:59 Signature Stay co.</div>
                </div>

                <div class="details-card">
                    <div class="details-header">
                        <span class="details-title">Description Complète & Liens</span>
                        <button class="btn-copy" onclick="copyText('yt-desc')">Copier</button>
                    </div>
                    <div class="details-content" id="yt-desc">Quatre-vingts pour cent des porteurs de projets s'épuisent pendant des mois sans jamais encaisser le moindre euro.

Dans cette vidéo, Loïc Villeronce, fondateur de Domtom Connect, te présente le plan d'action chirurgical sur deux semaines pour appliquer la loi du 80/20 en Martinique, éviter le piège du stock inutile et encaisser tes premiers clients.

Ressources et accès direct,
1. Diagnostic gratuit avec l'Anamnèse clinique sur www.domtomconnect.com
2. L'Ebook interactif pour structurer votre lancement en toute autonomie
3. Le Programme Tremplin 360°, accompagnement One-to-One et copilotage direct
4. Application DTC Pulse et groupe WhatsApp d'affaires
5. Réserver un échange de 30 minutes sur Calendly, calendly.com/domtomconnect/30min

Plateforme, www.domtomconnect.com
Contact direct, +33 6 20 78 33 77

Stay co.</div>
                </div>
            </div>

        </div>
    </main>

    <div class="toast" id="toast">Copié dans le presse-papier !</div>

    <audio id="audio" src="assets/audio/video4_8020_complete.mp3" preload="auto"></audio>

    <script>
        const audio = document.getElementById('audio');
        const screen = document.getElementById('screen');
        const fill = document.getElementById('fill');
        const screenFill = document.getElementById('screen-fill');
        const curTime = document.getElementById('curTime');
        const playIcon = document.getElementById('playIcon');
        const captionPill = document.getElementById('caption-pill');
        const chapterIndicator = document.getElementById('chapterIndicator');
        const avatarImg = document.getElementById('avatarImg');
        const avatarBadge = document.getElementById('avatarBadge');
        const realShortsBadge = document.getElementById('realShortsBadge');

        const avatarImages = {{
            boss: 'assets/images/loic_avatar_boss.jpg',
            thinking: 'assets/images/loic_avatar_thinking.jpg',
            shocked: 'assets/images/loic_avatar_shocked.jpg'
        }};

        const beats = {json.dumps(beats, ensure_ascii=False, indent=12)};

        let activeBeatIdx = -1;

        function setFormat(fmt) {{
            document.getElementById('btn-169').classList.toggle('active', fmt === '16-9');
            document.getElementById('btn-916').classList.toggle('active', fmt === '9-16');
            if (fmt === '9-16') {{
                screen.classList.remove('landscape');
                screen.classList.add('vertical');
            }} else {{
                screen.classList.remove('vertical');
                screen.classList.add('landscape');
            }}
        }}

        function togglePlay() {{
            if (audio.paused) {{
                audio.play();
                playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            }} else {{
                audio.pause();
                playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
            }}
        }}

        function jumpTo(sec) {{
            audio.currentTime = sec;
            updateTime(sec);
            if (audio.paused) togglePlay();
        }}

        function seek(e) {{
            const rect = document.getElementById('track').getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const newTime = pos * (audio.duration || 300.72);
            audio.currentTime = newTime;
            updateTime(newTime);
        }}

        function formatTime(s) {{
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
        }}

        function updateTime(cur) {{
            const dur = audio.duration || 300.72;
            const pct = Math.min(100, (cur / dur) * 100);

            if (fill) fill.style.width = pct + '%';
            if (screenFill) screenFill.style.width = pct + '%';
            if (curTime) curTime.textContent = formatTime(cur);

            let idx = 0;
            for (let i = 0; i < beats.length; i++) {{
                if (cur >= beats[i].start && cur < beats[i].end) {{
                    idx = i;
                    break;
                }}
            }}
            if (cur >= beats[beats.length - 1].end) {{
                idx = beats.length - 1;
            }}

            if (idx !== activeBeatIdx) {{
                activeBeatIdx = idx;
                const b = beats[idx];

                beats.forEach((item, i) => {{
                    const el = document.getElementById(item.id);
                    if (el) el.classList.toggle('active', i === idx);
                }});

                if (captionPill) captionPill.textContent = b.caption;
                if (chapterIndicator) chapterIndicator.textContent = b.chapter;

                if (b.avatar && avatarImages[b.avatar]) {{
                    avatarImg.src = avatarImages[b.avatar];
                }}
                if (b.badge) {{
                    avatarBadge.textContent = b.badge;
                }}
                if (realShortsBadge) {{
                    realShortsBadge.style.display = b.showShorts ? 'inline-flex' : 'none';
                }}

                document.querySelectorAll('.chapter-pill').forEach((pill) => {{
                    pill.classList.toggle('active', pill.textContent.startsWith(b.chapter.split('.')[0]));
                }});
            }}
        }}

        window.updateTime = updateTime;

        audio.addEventListener('timeupdate', () => {{
            updateTime(audio.currentTime);
        }});

        updateTime(0.0);

        audio.addEventListener('ended', () => {{
            playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        }});

        function copyText(id) {{
            const el = document.getElementById(id);
            const text = el.value || el.innerText;
            navigator.clipboard.writeText(text).then(() => {{
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2400);
            }});
        }}
    </script>
</body>
</html>
"""

with open("video-studio-video4.html", "w", encoding="utf-8") as f:
    f.write(studio_html)
print("Updated video-studio-video4.html successfully!")
