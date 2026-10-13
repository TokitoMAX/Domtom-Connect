# -*- coding: utf-8 -*-
"""
DOMTOM CONNECT - Vidéo 4 (80/20 & Plan d'action Martinique sur 14 jours)
Style : Motion Design Animé Immersif + Loïc en Incrustation Vidéo Animée (Buste vivant & Onde vocale)
Rythme posé & pédagogique : Slides stables qui restent affichées avec mise en valeur progressive par phase
Images Réelles Officielles : Photo réelle de Loïc, Avatar 3D Formateur, Couverture 3D du Tome 1, Shorts TikTok réels
"""

import json
import os

SYNC_FILE = os.path.join(os.path.dirname(__file__), "..", "assets", "audio", "video4_8020_sync.json")
if not os.path.exists(SYNC_FILE):
    SYNC_FILE = "assets/audio/video4_8020_sync.json"

with open(SYNC_FILE, "r", encoding="utf-8") as f:
    sync_cues_data = json.load(f)

# SVG Icons épurés (Zéro émoji)
ICONS = {
    "warning": '<svg class="svg-ico danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    "action": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    "brain": '<svg class="svg-ico amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5c0 2-1 3-2 4 1 1 2 2 2 4a5 5 0 0 1-5 5 5 5 0 0 1-5-5c0-2 1-3 2-4-1-1-2-2-2-4a5 5 0 0 1 5-5z"/></svg>',
    "target": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="6" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    "check": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
}

# 12 Actes majeurs posés, pédagogiques et parfaitement calés sur la voix off
beats_data = [
    {
        "id": "beat-1",
        "start": 0.0,
        "end": 21.22,
        "badge": "L'ERREUR FATALE",
        "tag": "Constat terrain",
        "title": "<span class=\"danger\">80%</span> d'énergie perdue <span class=\"danger\">dans le vide.</span>",
        "interactiveType": "energy_drain_meter"
    },
    {
        "id": "beat-2",
        "start": 21.22,
        "end": 51.51,
        "badge": "LOÏC VILLERONCE, FONDATEUR",
        "tag": "Présentation officielle",
        "title": "Loïc Villeronce, <span class=\"em\">fondateur de Domtom Connect.</span>",
        "interactiveType": "ai_hologram_core"
    },
    {
        "id": "beat-3",
        "start": 51.51,
        "end": 69.67,
        "badge": "100% RÉEL FACE CAMÉRA",
        "tag": "Authenticité sans filtre",
        "title": "Retrouve-moi en direct <span class=\"em\">sur Shorts, TikTok et Insta.</span>",
        "interactiveType": "shorts_device"
    },
    {
        "id": "beat-4",
        "start": 69.67,
        "end": 98.23,
        "badge": "LOI DE PARETO",
        "tag": "Principe d'efficacité",
        "title": "<span class=\"em\">80% d'action massive,</span> <span class=\"amber\">20%</span> de réflexion.",
        "interactiveType": "pareto_scale_3d"
    },
    {
        "id": "beat-5",
        "start": 98.23,
        "end": 125.92,
        "badge": "RÉALITÉS EN MARTINIQUE",
        "tag": "Cas concret créateur",
        "title": "Lancer sa marque locale <span class=\"amber\">sans 1 € de stock bloqué.</span>",
        "interactiveType": "martinique_creator_trap"
    },
    {
        "id": "beat-6",
        "start": 125.92,
        "end": 175.00,
        "badge": "SEMAINE 1 • SPRINT RÉALISTE DE VALIDATION",
        "tag": "Fondations et Terrain",
        "title": "Semaine 1, poser les fondations <span class=\"em\">et valider l'offre sur le terrain.</span>",
        "interactiveType": "semaine_1_pedagogy_master"
    },
    {
        "id": "beat-7",
        "start": 175.00,
        "end": 212.32,
        "badge": "SEMAINE 2 • PRÉCOMMANDES ET ACCÉLÉRATION",
        "tag": "Précommandes et Bilan",
        "title": "Semaine 2, précommandes fermes <span class=\"em\">et autofinancement par les clients.</span>",
        "interactiveType": "semaine_2_pedagogy_master"
    },
    {
        "id": "beat-8",
        "start": 212.32,
        "end": 232.38,
        "badge": "DIAGNOSTIC OFFERT",
        "tag": "Outil Lead Magnet",
        "title": "L'Anamnèse clinique, <span class=\"em\">diagnostic gratuit.</span>",
        "interactiveType": "anamnese_scanner_screen"
    },
    {
        "id": "beat-9",
        "start": 232.38,
        "end": 242.11,
        "badge": "GUIDE OPÉRATIONNEL TOME 1",
        "tag": "Autonomie pas à pas",
        "title": "L'Ebook interactif, <span class=\"em\">les fondamentaux de l'entrepreneur.</span>",
        "interactiveType": "ebook_hologram"
    },
    {
        "id": "beat-10",
        "start": 242.11,
        "end": 260.52,
        "badge": "ACCOMPAGNEMENT 360°",
        "tag": "Copilotage direct",
        "title": "Programme Tremplin, <span class=\"em\">copilotage opérationnel.</span>",
        "interactiveType": "tremplin_cockpit"
    },
    {
        "id": "beat-11",
        "start": 260.52,
        "end": 275.07,
        "badge": "TECH ET RÉSEAU D'AFFAIRES",
        "tag": "Réseau Business",
        "title": "Réseau WhatsApp actif <span class=\"em\">et DTC Pulse.</span>",
        "interactiveType": "pulse_device_show"
    },
    {
        "id": "beat-12",
        "start": 275.07,
        "end": 300.72,
        "badge": "CALENDLY, STAY CO.",
        "tag": "Passage à l'action",
        "title": "Échange direct de <span class=\"em\">30 minutes offert.</span>",
        "interactiveType": "calendly_vip_ticket",
        "isFinal": True
    }
]

# Chapitres clairs et aérés pour scrubber du Studio
chapters = [
    {"label": "01. Constat 80%", "sec": 0.0},
    {"label": "02. Loïc & Avatar IA", "sec": 21.2},
    {"label": "03. Preuve en direct", "sec": 51.5},
    {"label": "04. Loi du 80/20", "sec": 69.7},
    {"label": "05. Piège Martinique", "sec": 98.2},
    {"label": "06. Semaine 1 (Fondations & Terrain)", "sec": 125.9},
    {"label": "07. Semaine 2 (Précommandes & Cash)", "sec": 175.0},
    {"label": "08. Anamnèse clinique", "sec": 212.3},
    {"label": "09. Ebook Tome 1", "sec": 232.4},
    {"label": "10. Tremplin & Copilotage", "sec": 242.1},
    {"label": "11. Réseau & DTC Pulse", "sec": 260.5},
    {"label": "12. Calendly & Stay co.", "sec": 275.1}
]


def render_interactive_scene_html(b):
    """Génère les animations Motion Design grand format immersives avec les vraies images."""
    t = b.get("interactiveType", "")
    html = []
    
    if t == "energy_drain_meter":
        html.append('''
        <div class="mograph-box drain-meter-stage">
            <div class="mograph-top-stat">
                <div class="stat-big-block danger">
                    <span class="pct-num">80%</span>
                    <span class="pct-lbl">D'ÉNERGIE DÉPENSÉE DANS LE VIDE</span>
                </div>
                <div class="stat-big-block gray">
                    <span class="pct-num">0 €</span>
                    <span class="pct-lbl">ENCAISSÉ SUR LE COMPTE</span>
                </div>
            </div>
            <div class="mograph-meter-track">
                <div class="mograph-meter-fill"></div>
            </div>
            <div class="mograph-chips-row">
                <div class="m-chip danger">MOIS PASSÉS SUR UN LOGO</div>
                <div class="m-chip danger">PLANS THÉORIQUES SANS FIN</div>
                <div class="m-chip danger">ZÉRO PROSPECT CONFRONTÉ</div>
            </div>
        </div>
        ''')
    elif t == "ai_hologram_core":
        html.append('''
        <div class="mograph-box holo-core-stage-with-avatar">
            <div class="avatar-hero-column">
                <img src="assets/images/loic_professor_presenting.jpg" class="avatar-presenter-photo" alt="Avatar Loïc Formateur">
                <span class="avatar-tag-pill">AVATAR PROPULSÉ PAR IA</span>
            </div>
            <div class="holo-details-column">
                <div class="core-rings-anime-compact">
                    <div class="core-orbit o1"></div>
                    <div class="core-orbit o2"></div>
                    <div class="core-center-orb">
                        <span>CONDENSATION DU SAVOIR</span>
                    </div>
                </div>
                <div class="core-values-col">
                    <div class="c-val-card em">
                        <div class="c-val-title">PRÉCISION CHIRURGICALE</div>
                        <div class="c-val-sub">Aller droit à l'essentiel sans perte de temps</div>
                    </div>
                    <div class="c-val-card em">
                        <div class="c-val-title">ACCOMPAGNEMENT STRATÉGIQUE</div>
                        <div class="c-val-sub">Caraïbe, Afrique et diaspora</div>
                    </div>
                </div>
            </div>
        </div>
        ''')
    elif t == "shorts_device":
        html.append('''
        <div class="mograph-box shorts-stage">
            <div class="phone-mockup-3d">
                <img src="assets/images/loic_reel_short.png" class="phone-screen-img" alt="Loïc Face Caméra Réel">
                <div class="live-rec-badge">
                    <span class="rec-dot"></span> DIRECT LOÏC AVEC SON MICRO
                </div>
            </div>
            <div class="shorts-meta-side">
                <div class="shorts-headline">LOÏC VILLERONCE EN DIRECT SANS FILTRE</div>
                <div class="shorts-pills-col">
                    <div class="s-pill">YOUTUBE SHORTS</div>
                    <div class="s-pill">TIKTOK OFFICIEL</div>
                    <div class="s-pill">INSTAGRAM DIRECT</div>
                </div>
                <div class="shorts-subnote">Prendre la parole face caméra pour créer une vraie relation de confiance avec son audience.</div>
            </div>
        </div>
        ''')
    elif t == "pareto_scale_3d":
        html.append('''
        <div class="mograph-box pareto-scale-stage">
            <div class="scale-visual-beam">
                <div class="scale-side heavy-action">
                    <div class="scale-pct-huge em">80%</div>
                    <div class="scale-head">ACTION MASSIVE</div>
                    <div class="scale-sub">Confrontation terrain, précommandes et vente</div>
                    <span class="scale-badge-em">POIDS DOMINANT</span>
                </div>
                <div class="scale-pivot-center">VS</div>
                <div class="scale-side light-reflex">
                    <div class="scale-pct-huge amber">20%</div>
                    <div class="scale-head">RÉFLEXION CHIRURGICALE</div>
                    <div class="scale-sub">Ciblage précis et arbitrage stratégique</div>
                    <span class="scale-badge-amber">JUSTE CE QU'IL FAUT</span>
                </div>
            </div>
        </div>
        ''')
    elif t == "martinique_creator_trap":
        html.append('''
        <div class="mograph-box creator-trap-stage">
            <div class="trap-split-row">
                <div class="trap-column fatal-mistake">
                    <div class="trap-header-tag danger">LE PIÈGE CLASSIQUE DU DÉBUTANT</div>
                    <div class="trap-box-content">
                        <div class="trap-big-metric danger">3 000 € BLOQUÉS</div>
                        <div class="trap-desc-line">500 t-shirts commandés en Chine dans des cartons</div>
                        <div class="trap-pills-list">
                            <span class="t-pill danger">Fret maritime exorbitant</span>
                            <span class="t-pill danger">Octroi de mer imprévu</span>
                            <span class="t-pill danger">Zéro client qui a payé</span>
                        </div>
                        <div class="trap-stamp danger">STOCK MORT • DETTE BANCAIRE</div>
                    </div>
                </div>
                <div class="trap-separator-vs">VS</div>
                <div class="trap-column zero-euro-truth">
                    <div class="trap-header-tag em">LA MÉTHODE RÉALISTE À 0 €</div>
                    <div class="trap-box-content">
                        <div class="trap-big-metric em">0 € EN POCHE</div>
                        <div class="trap-desc-line">1 smartphone, 1 connexion, 1 idée locale forte</div>
                        <div class="trap-pills-list">
                            <span class="t-pill em">Mockup virtuel 3D gratuit sur Canva</span>
                            <span class="t-pill em">Attention organique réseaux sociaux</span>
                            <span class="t-pill em">Production financée par les clients</span>
                        </div>
                        <div class="trap-stamp em">0 € DE DETTE • RISQUE FINANCIER NUL</div>
                    </div>
                </div>
            </div>
        </div>
        ''')
    elif t == "semaine_1_pedagogy_master":
        # GRANDE SCÈNE STABLE SEMAINE 1 (125.9s à 175.0s, 49 SECONDES POSÉES)
        html.append('''
        <div class="mograph-box master-pedagogy-stage">
            <div class="master-pedagogy-left">
                <img src="assets/images/loic_professor_explaining.jpg" class="pedagogy-hero-photo" alt="Loïc Formateur">
                <span class="instructor-tag">SEMAINE 1 • LES FONDATIONS</span>
            </div>
            <div class="master-pedagogy-right">
                <!-- Phase A : Jours 1 à 3 -->
                <div class="pedagogy-phase-card phase-active" id="s1-part-1">
                    <div class="phase-head-row">
                        <span class="phase-badge em">JOURS 1 À 3 • CONCEPTION 0 €</span>
                        <span class="phase-focus-tag">RÈGLE DU 80/20</span>
                    </div>
                    <div class="phase-main-title">1 SEULE OFFRE PHARE • PROTOYPE VIRTUEL</div>
                    <div class="phase-bullets-row">
                        <div class="p-bullet">
                            <span class="p-bullet-title">OUBLIE LE CATALOGUE DE 15 PRODUITS</span>
                            <span class="p-bullet-desc">Concentre 100% de ton énergie sur une seule pièce forte ou prestation qui résout un besoin précis.</span>
                        </div>
                        <div class="p-bullet">
                            <span class="p-bullet-title">MOCKUP SUR SMARTPHONE</span>
                            <span class="p-bullet-desc">Visuel photoréaliste créé sans payer de graphiste. Zéro tissu acheté, zéro dépense.</span>
                        </div>
                    </div>
                </div>

                <!-- Phase B : Jours 4 à 7 -->
                <div class="pedagogy-phase-card" id="s1-part-2">
                    <div class="phase-head-row">
                        <span class="phase-badge em">JOURS 4 À 7 • TERRAIN EN MARTINIQUE</span>
                        <span class="phase-focus-tag">CONFRONTATION DIRECTE</span>
                    </div>
                    <div class="phase-main-title">20 CONTACTS CIBLES QUALIFIÉS SUR WHATSAPP</div>
                    <div class="phase-bullets-row">
                        <div class="p-bullet">
                            <span class="p-bullet-title">PRÉSENTER LE PROTOTYPE TEST</span>
                            <span class="p-bullet-desc">Contacter 20 personnes cibles via WhatsApp ou en direct. Écouter leurs retours sans filtre.</span>
                        </div>
                        <div class="p-bullet">
                            <span class="p-bullet-title">VALIDER L'INTÉRÊT RÉEL</span>
                            <span class="p-bullet-desc">Savoir exactement qui est prêt à acheter avant de dépenser le moindre centime en fabrication.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ''')
    elif t == "semaine_2_pedagogy_master":
        # GRANDE SCÈNE STABLE SEMAINE 2 (175.0s à 212.3s, 37 SECONDES POSÉES)
        html.append('''
        <div class="mograph-box master-pedagogy-stage">
            <div class="master-pedagogy-left">
                <img src="assets/images/loic_professor_focus.jpg" class="pedagogy-hero-photo" alt="Loïc Stratège">
                <span class="instructor-tag">SEMAINE 2 • ACCÉLÉRATION</span>
            </div>
            <div class="master-pedagogy-right">
                <!-- Phase C : Jours 8 à 10 -->
                <div class="pedagogy-phase-card phase-active" id="s2-part-1">
                    <div class="phase-head-row">
                        <span class="phase-badge em">JOURS 8 À 10 • PRÉCOMMANDES FERMES</span>
                        <span class="phase-focus-tag">AUTOFINANCEMENT TOTAL</span>
                    </div>
                    <div class="phase-cash-spotlight">
                        <div class="cash-stat-block">
                            <span class="cash-big-num em">+680 €</span>
                            <span class="cash-big-lbl">ENCAISSÉS AVANT DE PRODUIRE</span>
                        </div>
                        <div class="cash-rule-text">
                            Tu lances les précommandes avec une offre exclusive. Tu encaisses les premiers règlements avant même de lancer la production finale.
                        </div>
                    </div>
                </div>

                <!-- Phase D : Jours 11 à 14 -->
                <div class="pedagogy-phase-card" id="s2-part-2">
                    <div class="phase-head-row">
                        <span class="phase-badge em">JOURS 11 À 14 • PREUVE SOCIALE & BILAN</span>
                        <span class="phase-focus-tag">MARCHÉ VALIDÉ EN 14 JOURS</span>
                    </div>
                    <div class="phase-main-title">DOCUMENTER LES RETOURS VIDÉOS COURTES</div>
                    <div class="phase-bullets-row">
                        <div class="p-bullet">
                            <span class="p-bullet-title">PREUVE SOCIALE LOCALE</span>
                            <span class="p-bullet-desc">Partager les avis des premiers acheteurs en vidéos courtes sur les réseaux pour créer l'effet d'entraînement.</span>
                        </div>
                        <div class="p-bullet highlight">
                            <span class="p-bullet-title">BILAN EN 14 JOURS CHRONO</span>
                            <span class="p-bullet-desc">Marché validé, fonds encaissés, tu sais exactement sur quels 20% d'actions concentrer ton énergie.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ''')
    elif t == "anamnese_scanner_screen":
        html.append('''
        <div class="mograph-box scanner-stage">
            <div class="scanner-hero-card">
                <div class="radar-box">
                    <div class="radar-sweep-anime"></div>
                </div>
                <div class="scanner-text-side">
                    <div class="sc-badge">OUTIL LEAD MAGNET OFFERT</div>
                    <div class="sc-title">L'ANAMNÈSE CLINIQUE</div>
                    <div class="sc-desc">Diagnostic gratuit et confidentiel pour porteurs de projets et entreprises.</div>
                    <div class="sc-url">www.domtomconnect.com</div>
                </div>
            </div>
        </div>
        ''')
    elif t == "ebook_hologram":
        html.append('''
        <div class="mograph-box ebook-real-showcase-stage">
            <div class="ebook-3d-visual-wrapper">
                <img src="assets/images/mockup-couverture-guide-tome1-3d.jpg" class="ebook-official-3d-img" alt="Livre Tome 1 Domtom Connect">
            </div>
            <div class="ebook-details-side">
                <span class="eb-badge-pill">GUIDE OPÉRATIONNEL OFFICIEL</span>
                <h2 class="eb-headline">LES FONDAMENTAUX DE L'ENTREPRENEUR</h2>
                <div class="eb-tagline">TOME 1 • LE GUIDE POUR ENTREPRENDRE SANS EXCUSE</div>
                <p class="eb-description">Conçu spécialement pour les porteurs de projets qui partent de zéro, ce guide complet te donne toutes les étapes concrètes pour lancer et structurer ton business.</p>
                <div class="eb-access-footer">
                    <span class="eb-access-link">Disponible sur www.domtomconnect.com</span>
                </div>
            </div>
        </div>
        ''')
    elif t == "tremplin_cockpit":
        html.append('''
        <div class="mograph-box tremplin-cockpit-stage">
            <div class="cockpit-hud-grid">
                <div class="hud-card h1">
                    <div class="hud-card-title">ACCOMPAGNEMENT 360°</div>
                    <div class="hud-card-sub">Suivi One-to-One individuel direct</div>
                </div>
                <div class="hud-card h2">
                    <div class="hud-card-title">COPILOTAGE OPÉRATIONNEL</div>
                    <div class="hud-card-sub">Déléguer les tâches chronophages</div>
                </div>
                <div class="hud-card h3">
                    <div class="hud-card-title">ZONE DE GÉNIE</div>
                    <div class="hud-card-sub">Se focaliser sur le chiffre d'affaires pur</div>
                </div>
            </div>
        </div>
        ''')
    elif t == "pulse_device_show":
        html.append('''
        <div class="mograph-box pulse-stage">
            <div class="pulse-devices-gallery">
                <img src="assets/images/screenshots/screen1.png" class="p-device-shot left" alt="DTC Pulse 1">
                <div class="pulse-central-emblem">
                    <img src="assets/images/logo-pulse.png" class="pulse-logo-img" alt="Logo DTC Pulse">
                    <div class="pulse-brand-name">DTC PULSE</div>
                    <div class="pulse-beta-badge">BÊTA FERMÉE</div>
                </div>
                <img src="assets/images/screenshots/screen2.png" class="p-device-shot right" alt="DTC Pulse 2">
            </div>
            <div class="pulse-tagline-bar">RÉSEAU WHATSAPP ACTIF + APPLICATION FUSIONNANT UBER EATS, TIKTOK ET AMAZON</div>
        </div>
        ''')
    elif t == "calendly_vip_ticket":
        html.append('''
        <div class="mograph-box calendly-stage">
            <div class="calendly-vip-card">
                <div class="cal-top-row">
                    <span class="cal-vip-tag">ÉCHANGE STRATÉGIQUE PRIVILÈGE</span>
                    <span class="cal-vip-time">30 MINUTES CHRONO</span>
                </div>
                <div class="cal-link-hero">calendly.com/domtomconnect/30min</div>
                <div class="cal-phone-direct">WhatsApp direct officiel, +33 6 20 78 33 77</div>
                <div class="cal-sentence">On analyse ta situation sans détour pour voir en toute franchise si ça a du sens de collaborer ou pas.</div>
                <div class="cal-btn-pulse">RÉSERVER MON CRÉNEAU EN DIRECT</div>
            </div>
        </div>
        ''')
        
    return "\n".join(html)


def render_all_scenes_html():
    html = []
    for i, b in enumerate(beats_data):
        active_cls = " active" if i == 0 else ""
        html.append(f'        <!-- ACTE {i+1:02d} : {b["tag"].upper()} ({b["start"]}s - {b["end"]}s) -->')
        html.append(f'        <div class="mograph-scene{active_cls}" id="{b["id"]}">')
        
        # En-tête de scène : Badge + Super-titre géant
        html.append('            <div class="mograph-scene-header">')
        html.append(f'                <span class="scene-badge-pill">{b["badge"]}</span>')
        html.append(f'                <h1 class="scene-hero-title">{b["title"]}</h1>')
        html.append('            </div>')
        
        # Centre de scène : Animation Motion Design
        html.append('            <div class="mograph-scene-body">')
        html.append(render_interactive_scene_html(b))
        html.append('            </div>')
        
        # Signature finale
        if b.get("isFinal"):
            html.append('            <div class="stay-co-sign">')
            html.append('                Stay <span class="em">co.</span>')
            html.append('            </div>')
            
        html.append('        </div>\n')
    return "\n".join(html)


# CSS Moteur Motion Design Animé + Loïc en Incrustation Vidéo Animée
MOGRAPH_CSS = """
        :root {
            --obsidian: #030605;
            --emerald: #00BFA6;
            --emerald-bright: #10B981;
            --emerald-glow: rgba(0, 191, 166, 0.45);
            --amber: #F59E0B;
            --red: #EF4444;
            --red-glow: rgba(239, 68, 68, 0.45);
            --white: #FFFFFF;
            --gray-300: #D1D5DB;
            --gray-400: #9CA3AF;
            --border: rgba(255, 255, 255, 0.1);
            --border-emerald: rgba(0, 191, 166, 0.4);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .stage-mograph-arena {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: radial-gradient(circle at 50% 25%, #081a20 0%, #040e12 50%, #010406 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .anime-speedlines-bg {
            position: absolute;
            inset: 0;
            background: repeating-conic-gradient(from 0deg, transparent 0deg 9deg, rgba(0, 191, 166, 0.02) 9deg 10deg);
            pointer-events: none;
            animation: rotateSpeedlines 45s linear infinite;
        }

        @keyframes rotateSpeedlines {
            100% { transform: rotate(360deg); }
        }

        .stage-grid-floor {
            position: absolute;
            bottom: 0;
            left: -20%;
            width: 140%;
            height: 40%;
            background-image: 
                linear-gradient(rgba(0, 191, 166, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 191, 166, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            transform: perspective(600px) rotateX(60deg);
            transform-origin: bottom center;
            pointer-events: none;
            -webkit-mask-image: linear-gradient(to top, black 0%, transparent 80%);
            mask-image: linear-gradient(to top, black 0%, transparent 80%);
        }

        /* LOÏC EN INCRUSTATION VIDÉO ANIMÉE (BUSTE VIVANT AVEC VRAIE PHOTO & ONDE VOCALE) */
        .loic-live-hud {
            position: absolute;
            bottom: 24px;
            left: 28px;
            z-index: 60;
            display: flex;
            align-items: center;
            gap: 14px;
            background: rgba(4, 12, 14, 0.94);
            border: 1.5px solid var(--border-emerald);
            padding: 8px 18px 8px 10px;
            border-radius: 100px;
            box-shadow: 0 10px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 191, 166, 0.25);
            backdrop-filter: blur(12px);
        }

        .hud-portrait-circle {
            position: relative;
            width: 66px;
            height: 66px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid var(--emerald);
            box-shadow: 0 0 20px var(--emerald-glow);
            background: #0d1418;
            flex-shrink: 0;
        }

        .hud-portrait-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scale(1.05);
            animation: loicBreathing 3.5s ease-in-out infinite;
        }

        @keyframes loicBreathing {
            0%, 100% { transform: scale(1.05) translateY(0); }
            50% { transform: scale(1.08) translateY(-2px); }
        }

        .hud-info-side {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .hud-live-tag {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: var(--emerald);
            text-transform: uppercase;
        }

        .hud-red-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--red);
            animation: hudBlink 1s infinite alternate;
        }

        @keyframes hudBlink {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
        }

        .hud-author-name {
            font-size: 13px;
            font-weight: 900;
            color: var(--white);
            letter-spacing: -0.2px;
        }

        .hud-voice-bars {
            display: flex;
            align-items: center;
            gap: 3px;
            height: 10px;
        }

        .h-bar {
            width: 2.5px;
            height: 100%;
            background: var(--emerald);
            border-radius: 2px;
            animation: voiceBarBounce 0.65s ease-in-out infinite alternate;
        }
        .h-bar:nth-child(2) { animation-delay: 0.15s; }
        .h-bar:nth-child(3) { animation-delay: 0.3s; }
        .h-bar:nth-child(4) { animation-delay: 0.45s; }
        .h-bar:nth-child(5) { animation-delay: 0.2s; }

        @keyframes voiceBarBounce {
            0% { height: 20%; opacity: 0.4; }
            100% { height: 100%; opacity: 1; }
        }

        /* SCÈNES MOTION DESIGN */
        .mograph-scene {
            display: none;
            width: 100%;
            max-width: 1100px;
            height: 82%;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            z-index: 20;
            animation: scenePopIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            padding: 10px 20px;
        }

        .mograph-scene.active {
            display: flex;
        }

        @keyframes scenePopIn {
            0% { opacity: 0; transform: scale(0.96) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .mograph-scene-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 6px;
            margin-bottom: 18px;
        }

        .scene-badge-pill {
            background: rgba(0, 191, 166, 0.12);
            border: 1px solid var(--border-emerald);
            padding: 4px 14px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.8px;
            color: var(--emerald);
            text-transform: uppercase;
        }

        .scene-hero-title {
            font-size: 32px;
            font-weight: 900;
            line-height: 1.15;
            letter-spacing: -0.6px;
            color: var(--white);
        }

        .scene-hero-title .em { color: var(--emerald); }
        .scene-hero-title .amber { color: var(--amber); }
        .scene-hero-title .danger { color: var(--red); }

        .mograph-scene-body {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* SCÈNE 1 : DRAIN METER */
        .drain-meter-stage {
            width: 100%;
            max-width: 780px;
            background: rgba(10, 18, 22, 0.88);
            border: 2px solid rgba(239, 68, 68, 0.5);
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 20px 50px rgba(239, 68, 68, 0.2);
        }
        .mograph-top-stat {
            display: flex;
            justify-content: space-between;
            margin-bottom: 18px;
        }
        .stat-big-block {
            display: flex;
            flex-direction: column;
        }
        .stat-big-block.danger .pct-num {
            font-size: 46px;
            font-weight: 900;
            color: var(--red);
            line-height: 1;
        }
        .stat-big-block.gray .pct-num {
            font-size: 46px;
            font-weight: 900;
            color: var(--gray-400);
            line-height: 1;
            text-align: right;
        }
        .pct-lbl {
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: var(--white);
            margin-top: 4px;
        }
        .mograph-meter-track {
            height: 22px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 18px;
        }
        .mograph-meter-fill {
            height: 100%;
            width: 80%;
            background: linear-gradient(90deg, #F59E0B, #EF4444);
            animation: drainAnim 2s infinite alternate ease-in-out;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
        }
        @keyframes drainAnim {
            0% { width: 75%; }
            100% { width: 85%; }
        }
        .mograph-chips-row {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .m-chip {
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 900;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #FCA5A5;
        }

        /* SCÈNE 2 : AVATAR IA INCARNÉ + ORBE */
        .holo-core-stage-with-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 36px;
            width: 100%;
            max-width: 860px;
        }
        .avatar-hero-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .avatar-presenter-photo {
            width: 200px;
            height: 310px;
            object-fit: cover;
            border-radius: 20px;
            border: 2px solid var(--emerald);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.9), 0 0 35px var(--emerald-glow);
        }
        .avatar-tag-pill {
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.8px;
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--border-emerald);
        }
        .holo-details-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            flex: 1;
        }
        .core-rings-anime-compact {
            position: relative;
            width: 140px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .core-orbit {
            position: absolute;
            border-radius: 50%;
            border: 2px dashed var(--emerald);
        }
        .core-orbit.o1 {
            width: 100%;
            height: 100%;
            animation: spinOrbit 12s linear infinite;
        }
        .core-orbit.o2 {
            width: 110px;
            height: 110px;
            border: 2px dotted var(--emerald-bright);
            animation: spinOrbitRev 8s linear infinite;
        }
        @keyframes spinOrbit { 100% { transform: rotate(360deg); } }
        @keyframes spinOrbitRev { 100% { transform: rotate(-360deg); } }
        .core-center-orb {
            width: 85px;
            height: 85px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--emerald) 0%, rgba(0, 191, 166, 0.2) 75%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 9px;
            font-weight: 900;
            color: var(--white);
            box-shadow: 0 0 25px var(--emerald-glow);
        }
        .core-values-col {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
        }
        .c-val-card {
            background: rgba(10, 18, 22, 0.88);
            border: 1.5px solid var(--border-emerald);
            border-radius: 14px;
            padding: 12px 18px;
            text-align: center;
        }
        .c-val-title {
            font-size: 13px;
            font-weight: 900;
            color: var(--emerald);
            margin-bottom: 2px;
        }
        .c-val-sub {
            font-size: 11px;
            color: var(--white);
            font-weight: 600;
        }

        /* SCÈNE 3 : SHORTS DEVICE AVEC VRAIE PHOTO LOÏC FACE CAMÉRA */
        .shorts-stage {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 36px;
        }
        .phone-mockup-3d {
            position: relative;
            width: 155px;
            height: 270px;
            border-radius: 20px;
            overflow: hidden;
            border: 3px solid var(--emerald);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.9), 0 0 30px var(--emerald-glow);
        }
        .phone-screen-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .live-rec-badge {
            position: absolute;
            bottom: 10px;
            left: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.85);
            border-radius: 6px;
            font-size: 8px;
            font-weight: 900;
            color: var(--white);
            padding: 4px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .rec-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--red);
            animation: hudBlink 1s infinite alternate;
        }
        .shorts-meta-side {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 360px;
        }
        .shorts-headline {
            font-size: 20px;
            font-weight: 900;
            color: var(--white);
            line-height: 1.25;
        }
        .shorts-pills-col {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .s-pill {
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 900;
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.12);
            border: 1px solid var(--border-emerald);
            width: fit-content;
        }
        .shorts-subnote {
            font-size: 12px;
            color: var(--gray-300);
            line-height: 1.35;
        }

        /* SCÈNE 4 : PARETO SCALE 3D */
        .pareto-scale-stage {
            width: 100%;
            max-width: 820px;
        }
        .scale-visual-beam {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
        }
        .scale-side {
            flex: 1;
            padding: 24px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
            transition: all 0.4s ease;
        }
        .scale-side.heavy-action {
            background: rgba(0, 191, 166, 0.14);
            border: 2px solid var(--emerald);
            box-shadow: 0 0 35px var(--emerald-glow);
            transform: translateY(12px);
        }
        .scale-side.light-reflex {
            background: rgba(245, 158, 11, 0.12);
            border: 1.5px solid var(--amber);
            transform: translateY(-12px);
        }
        .scale-pct-huge {
            font-size: 58px;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 6px;
        }
        .scale-head {
            font-size: 16px;
            font-weight: 900;
            color: var(--white);
            margin-bottom: 4px;
        }
        .scale-sub {
            font-size: 11px;
            color: var(--gray-400);
            font-weight: 700;
            margin-bottom: 10px;
        }
        .scale-badge-em {
            font-size: 10px;
            font-weight: 900;
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--border-emerald);
            display: inline-block;
        }
        .scale-badge-amber {
            font-size: 10px;
            font-weight: 900;
            color: var(--amber);
            background: rgba(245, 158, 11, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid rgba(245, 158, 11, 0.4);
            display: inline-block;
        }
        .scale-pivot-center {
            font-size: 16px;
            font-weight: 900;
            color: var(--gray-400);
            padding: 8px 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.06);
        }

        /* SCÈNE 5 : CREATOR TRAP */
        .creator-trap-stage {
            width: 100%;
            max-width: 860px;
        }
        .trap-split-row {
            display: flex;
            align-items: stretch;
            gap: 18px;
        }
        .trap-column {
            flex: 1;
            border-radius: 20px;
            padding: 22px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.85);
        }
        .trap-column.fatal-mistake {
            background: rgba(25, 12, 14, 0.88);
            border: 2px solid rgba(239, 68, 68, 0.6);
        }
        .trap-column.zero-euro-truth {
            background: rgba(10, 24, 22, 0.88);
            border: 2px solid var(--emerald);
            box-shadow: 0 0 30px var(--emerald-glow);
        }
        .trap-header-tag {
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.8px;
            padding: 4px 12px;
            border-radius: 100px;
            width: fit-content;
        }
        .trap-header-tag.danger {
            background: rgba(239, 68, 68, 0.2);
            color: #FCA5A5;
            border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .trap-header-tag.em {
            background: rgba(0, 191, 166, 0.2);
            color: var(--emerald);
            border: 1px solid var(--border-emerald);
        }
        .trap-box-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 1;
        }
        .trap-big-metric {
            font-size: 28px;
            font-weight: 900;
            line-height: 1;
        }
        .trap-big-metric.danger { color: var(--red); }
        .trap-big-metric.em { color: var(--emerald); }
        .trap-desc-line {
            font-size: 12px;
            color: var(--white);
            font-weight: 700;
        }
        .trap-pills-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin: 6px 0;
        }
        .t-pill {
            font-size: 11px;
            font-weight: 800;
            padding: 6px 12px;
            border-radius: 8px;
            width: fit-content;
        }
        .t-pill.danger {
            background: rgba(239, 68, 68, 0.15);
            color: #FCA5A5;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .t-pill.em {
            background: rgba(0, 191, 166, 0.15);
            color: var(--emerald);
            border: 1px solid var(--border-emerald);
        }
        .trap-stamp {
            font-size: 11px;
            font-weight: 900;
            text-align: center;
            padding: 8px;
            border-radius: 8px;
            margin-top: auto;
        }
        .trap-stamp.danger {
            border: 1.5px solid var(--red);
            color: var(--red);
            background: rgba(239, 68, 68, 0.1);
        }
        .trap-stamp.em {
            border: 1.5px solid var(--emerald);
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.1);
        }
        .trap-separator-vs {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 900;
            color: var(--gray-400);
        }

        /* GRANDES SCÈNES PÉDAGOGIQUES MAJEURES ET STABLES (SEMAINE 1 & SEMAINE 2) */
        .master-pedagogy-stage {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 28px;
            width: 100%;
            max-width: 900px;
        }
        .master-pedagogy-left {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }
        .pedagogy-hero-photo {
            width: 200px;
            height: 310px;
            object-fit: cover;
            border-radius: 20px;
            border: 2px solid var(--emerald);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.95), 0 0 35px var(--emerald-glow);
        }
        .instructor-tag {
            font-size: 10px;
            font-weight: 900;
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--border-emerald);
        }
        .master-pedagogy-right {
            display: flex;
            flex-direction: column;
            gap: 14px;
            flex: 1;
        }
        .pedagogy-phase-card {
            background: rgba(10, 18, 22, 0.9);
            border: 1.5px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0.75;
        }
        .pedagogy-phase-card.phase-active {
            border-color: var(--emerald);
            background: rgba(10, 24, 22, 0.95);
            box-shadow: 0 0 35px var(--emerald-glow);
            opacity: 1;
            transform: scale(1.02);
        }
        .phase-head-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .phase-badge {
            font-size: 10px;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 6px;
            letter-spacing: 0.5px;
        }
        .phase-badge.em {
            background: rgba(0, 191, 166, 0.18);
            color: var(--emerald);
            border: 1px solid var(--border-emerald);
        }
        .phase-focus-tag {
            font-size: 9px;
            font-weight: 800;
            color: var(--gray-400);
            letter-spacing: 0.5px;
        }
        .phase-main-title {
            font-size: 15px;
            font-weight: 900;
            color: var(--white);
            letter-spacing: -0.2px;
        }
        .phase-bullets-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .p-bullet {
            display: flex;
            flex-direction: column;
            gap: 2px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            padding: 6px 10px;
        }
        .p-bullet.highlight {
            background: rgba(0, 191, 166, 0.12);
            border: 1px solid var(--border-emerald);
        }
        .p-bullet-title {
            font-size: 11px;
            font-weight: 900;
            color: var(--emerald);
        }
        .p-bullet-desc {
            font-size: 11px;
            color: var(--gray-300);
            line-height: 1.35;
        }
        .phase-cash-spotlight {
            display: flex;
            align-items: center;
            gap: 16px;
            background: rgba(0, 191, 166, 0.12);
            border: 1px solid var(--border-emerald);
            border-radius: 12px;
            padding: 12px 16px;
        }
        .cash-stat-block {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }
        .cash-big-num {
            font-size: 32px;
            font-weight: 900;
            line-height: 1;
        }
        .cash-big-num.em { color: var(--emerald); }
        .cash-big-lbl {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: var(--white);
            margin-top: 2px;
        }
        .cash-rule-text {
            font-size: 11px;
            color: var(--gray-300);
            line-height: 1.35;
        }

        /* SCÈNE 8 : SCANNER LEAD MAGNET */
        .scanner-stage {
            width: 100%;
            max-width: 760px;
        }
        .scanner-hero-card {
            display: flex;
            align-items: center;
            gap: 24px;
            background: rgba(10, 18, 22, 0.88);
            border: 2px solid var(--emerald);
            border-radius: 22px;
            padding: 24px;
            box-shadow: 0 15px 40px var(--emerald-glow);
        }
        .radar-box {
            position: relative;
            width: 110px;
            height: 110px;
            border-radius: 50%;
            border: 2px solid var(--emerald);
            background: radial-gradient(circle, rgba(0, 191, 166, 0.15) 0%, transparent 70%);
            overflow: hidden;
            flex-shrink: 0;
        }
        .radar-sweep-anime {
            position: absolute;
            inset: 0;
            background: conic-gradient(from 0deg, transparent 0deg 300deg, var(--emerald) 360deg);
            animation: radarSweep 3s linear infinite;
        }
        @keyframes radarSweep {
            100% { transform: rotate(360deg); }
        }
        .scanner-text-side {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .sc-badge {
            font-size: 10px;
            font-weight: 900;
            color: var(--emerald);
            letter-spacing: 0.8px;
        }
        .sc-title {
            font-size: 22px;
            font-weight: 900;
            color: var(--white);
        }
        .sc-desc {
            font-size: 12px;
            color: var(--gray-300);
            line-height: 1.35;
        }
        .sc-url {
            font-size: 13px;
            font-weight: 900;
            color: var(--emerald);
            margin-top: 4px;
        }

        /* SCÈNE 9 : VRAIE COUVERTURE 3D OFFICIELLE DU LIVRE TOME 1 */
        .ebook-real-showcase-stage {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 36px;
            width: 100%;
            max-width: 860px;
        }
        .ebook-3d-visual-wrapper {
            position: relative;
            width: 200px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ebook-official-3d-img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: -15px 20px 45px rgba(0, 0, 0, 0.95), 0 0 35px var(--emerald-glow);
            transform: perspective(800px) rotateY(-8deg);
            transition: all 0.4s ease;
        }
        .ebook-details-side {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 480px;
        }
        .eb-badge-pill {
            font-size: 10px;
            font-weight: 900;
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--border-emerald);
            width: fit-content;
        }
        .eb-headline {
            font-size: 24px;
            font-weight: 900;
            color: var(--white);
            line-height: 1.2;
        }
        .eb-tagline {
            font-size: 12px;
            font-weight: 800;
            color: var(--amber);
            letter-spacing: 0.5px;
        }
        .eb-description {
            font-size: 13px;
            color: var(--gray-300);
            line-height: 1.4;
            margin-top: 4px;
        }
        .eb-access-footer {
            margin-top: 6px;
        }
        .eb-access-link {
            font-size: 13px;
            font-weight: 900;
            color: var(--emerald);
        }

        /* SCÈNE 10 : TREMPLIN COCKPIT */
        .tremplin-cockpit-stage {
            width: 100%;
            max-width: 820px;
        }
        .cockpit-hud-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }
        .hud-card {
            background: rgba(10, 18, 22, 0.88);
            border: 1.5px solid var(--border-emerald);
            border-radius: 18px;
            padding: 24px 18px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
            transition: all 0.3s ease;
        }
        .hud-card:hover {
            border-color: var(--emerald);
            box-shadow: 0 0 25px var(--emerald-glow);
        }
        .hud-card-title {
            font-size: 13px;
            font-weight: 900;
            color: var(--emerald);
            margin-bottom: 6px;
        }
        .hud-card-sub {
            font-size: 11px;
            color: var(--white);
            font-weight: 600;
            line-height: 1.3;
        }

        /* SCÈNE 11 : DTC PULSE */
        .pulse-stage {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            max-width: 820px;
        }
        .pulse-devices-gallery {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
        }
        .p-device-shot {
            width: 110px;
            height: 190px;
            object-fit: cover;
            border-radius: 16px;
            border: 2px solid var(--border-emerald);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
        }
        .p-device-shot.left { transform: rotate(-5deg); }
        .p-device-shot.right { transform: rotate(5deg); }
        .pulse-central-emblem {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .pulse-logo-img {
            width: 75px;
            height: 75px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px var(--emerald-glow));
        }
        .pulse-brand-name {
            font-size: 17px;
            font-weight: 900;
            color: var(--white);
            letter-spacing: 1px;
        }
        .pulse-beta-badge {
            background: rgba(0, 191, 166, 0.2);
            border: 1px solid var(--border-emerald);
            color: var(--emerald);
            font-size: 9px;
            font-weight: 900;
            padding: 3px 10px;
            border-radius: 100px;
        }
        .pulse-tagline-bar {
            font-size: 11px;
            font-weight: 900;
            color: var(--emerald);
            letter-spacing: 0.5px;
            text-align: center;
            background: rgba(0, 191, 166, 0.12);
            padding: 8px 18px;
            border-radius: 100px;
            border: 1px solid var(--border-emerald);
        }

        /* SCÈNE 12 : CALENDLY VIP */
        .calendly-stage {
            width: 100%;
            max-width: 780px;
        }
        .calendly-vip-card {
            background: rgba(10, 24, 22, 0.88);
            border: 2px solid var(--emerald);
            border-radius: 22px;
            padding: 26px 32px;
            text-align: center;
            box-shadow: 0 0 45px var(--emerald-glow);
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
        }
        .cal-top-row {
            display: flex;
            gap: 12px;
        }
        .cal-vip-tag {
            font-size: 10px;
            font-weight: 900;
            color: var(--emerald);
            background: rgba(0, 191, 166, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--border-emerald);
        }
        .cal-vip-time {
            font-size: 10px;
            font-weight: 900;
            color: var(--amber);
            background: rgba(245, 158, 11, 0.15);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .cal-link-hero {
            font-size: 26px;
            font-weight: 900;
            color: var(--white);
            letter-spacing: -0.4px;
        }
        .cal-phone-direct {
            font-size: 13px;
            font-weight: 800;
            color: var(--emerald);
        }
        .cal-sentence {
            font-size: 13px;
            color: var(--gray-300);
            font-weight: 600;
            max-width: 580px;
            line-height: 1.35;
        }
        .cal-btn-pulse {
            margin-top: 6px;
            padding: 10px 24px;
            border-radius: 100px;
            background: var(--emerald);
            color: var(--obsidian);
            font-size: 12px;
            font-weight: 900;
            box-shadow: 0 0 25px var(--emerald-glow);
            animation: orbPulse 1.8s infinite alternate ease-in-out;
        }

        .stay-co-sign {
            margin-top: 8px;
            font-size: 20px;
            font-weight: 900;
            color: var(--white);
            letter-spacing: 1px;
        }
        .stay-co-sign .em { color: var(--emerald); }

        /* SOUS-TITRES OFFICIELS BROADCAST DYNAMIQUES */
        .bottom-broadcast-subtitles {
            position: absolute;
            bottom: 24px;
            right: 28px;
            left: 270px;
            z-index: 50;
            background: rgba(4, 12, 14, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            padding: 12px 20px;
            color: var(--white);
            font-size: 14px;
            font-weight: 700;
            line-height: 1.35;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            min-height: 58px;
            display: flex;
            align-items: center;
        }

        .top-time-progress-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.08);
            z-index: 100;
        }
        .top-time-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--emerald), var(--emerald-bright));
            box-shadow: 0 0 12px var(--emerald-glow);
            transition: width 0.1s linear;
        }

        .top-brand-logo {
            position: absolute;
            top: 18px;
            right: 26px;
            height: 28px;
            object-fit: contain;
            z-index: 80;
            opacity: 0.9;
        }

        /* FORMAT 9:16 RESPONSIVE */
        .mode-9-16 .stage-mograph-arena {
            width: 100vw;
            height: 100vh;
            padding: 70px 16px 120px 16px;
            flex-direction: column;
            justify-content: flex-start;
        }

        .mode-9-16 .mograph-scene {
            height: auto;
            max-width: 100%;
            padding: 0;
        }

        .mode-9-16 .scene-hero-title {
            font-size: 24px;
        }

        .mode-9-16 .loic-live-hud {
            left: 16px;
            bottom: 80px;
            padding: 6px 14px 6px 8px;
        }

        .mode-9-16 .hud-portrait-circle {
            width: 50px;
            height: 50px;
        }

        .mode-9-16 .bottom-broadcast-subtitles {
            left: 16px;
            right: 16px;
            bottom: 16px;
            font-size: 12px;
            min-height: 50px;
            padding: 8px 14px;
        }

        .mode-9-16 .holo-core-stage-with-avatar {
            flex-direction: column;
        }
        .mode-9-16 .avatar-presenter-photo {
            width: 140px;
            height: 200px;
        }

        .mode-9-16 .trap-split-row {
            flex-direction: column;
        }

        .mode-9-16 .master-pedagogy-stage {
            flex-direction: column;
        }
        .mode-9-16 .pedagogy-hero-photo {
            width: 130px;
            height: 180px;
        }

        .mode-9-16 .ebook-real-showcase-stage {
            flex-direction: column;
        }
        .mode-9-16 .ebook-3d-visual-wrapper {
            width: 140px;
        }

        .mode-9-16 .cockpit-hud-grid {
            grid-template-columns: 1fr;
        }
"""

all_scenes_code = render_all_scenes_html()


def build_pure_render_html():
    """Génère render-video4-8020.html."""
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domtom Connect - Vidéo 4 (80/20 & Plan d'action Martinique sur 14 jours)</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {{
            margin: 0;
            padding: 0;
            background: #000;
            font-family: 'Plus Jakarta Sans', sans-serif;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        {MOGRAPH_CSS}
    </style>
</head>
<body>
    <div style="position: relative; width: 100%; height: 100%; overflow: hidden;">
        <div class="top-time-progress-bar">
            <div class="top-time-fill" id="time-progress-fill"></div>
        </div>

        <img src="assets/images/logo-domtomconnect-white.png" class="top-brand-logo" alt="Domtom Connect">

        <div class="stage-mograph-arena">
            <div class="anime-speedlines-bg"></div>
            <div class="stage-grid-floor"></div>

            <!-- Incrustation Loïc Vidéo Animée (HUD Vivant avec vraie photo) -->
            <div class="loic-live-hud">
                <div class="hud-portrait-circle">
                    <img src="assets/images/loic_portrait.png" class="hud-portrait-img" alt="Loïc Villeronce">
                </div>
                <div class="hud-info-side">
                    <div class="hud-live-tag">
                        <span class="hud-red-dot"></span> DIRECT LOÏC
                    </div>
                    <span class="hud-author-name">LOÏC VILLERONCE</span>
                    <div class="hud-voice-bars">
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                    </div>
                </div>
            </div>

            <!-- Scènes Motion Design (12 Actes Majeurs) -->
{all_scenes_code}

            <!-- Sous-titre officiel broadcast en direct (dynamique par cue) -->
            <div class="bottom-broadcast-subtitles" id="subtitles-box">
                Quatre-vingts pour cent des porteurs de projets s'épuisent pendant des mois sans jamais encaisser le moindre euro.
            </div>
        </div>
    </div>

    <audio id="master-audio" src="assets/audio/video4_8020_complete.mp3" preload="auto"></audio>

    <script>
        const beats = {json.dumps(beats_data, ensure_ascii=False)};
        const syncCues = {json.dumps(sync_cues_data, ensure_ascii=False)};
        const masterAudio = document.getElementById('master-audio');
        const timeProgressFill = document.getElementById('time-progress-fill');
        const subtitlesBox = document.getElementById('subtitles-box');

        let currentBeatIndex = -1;
        const totalDuration = 300.72;

        function updateTime(currentTime) {{
            const pct = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));
            timeProgressFill.style.width = pct + '%';

            // Sous-titre dynamique en temps réel mot à mot
            const activeCue = syncCues.find(c => currentTime >= c.start && currentTime < c.end);
            if (activeCue) {{
                subtitlesBox.textContent = activeCue.text;
            }}

            // Slide actif verrouillé stable
            let activeIdx = -1;
            for (let i = beats.length - 1; i >= 0; i--) {{
                if (currentTime >= beats[i].start) {{
                    activeIdx = i;
                    break;
                }}
            }}
            if (activeIdx === -1) activeIdx = 0;

            if (activeIdx !== currentBeatIndex) {{
                currentBeatIndex = activeIdx;
                const b = beats[activeIdx];

                document.querySelectorAll('.mograph-scene').forEach(el => el.classList.remove('active'));
                const activeScene = document.getElementById(b.id);
                if (activeScene) activeScene.classList.add('active');
            }}

            // Illuminations internes progressives par phase sans changer de slide brutalement
            if (activeIdx === 5) {{ // Semaine 1
                const s1Part1 = document.getElementById('s1-part-1');
                const s1Part2 = document.getElementById('s1-part-2');
                if (s1Part1 && s1Part2) {{
                    if (currentTime < 152.41) {{
                        s1Part1.classList.add('phase-active');
                        s1Part2.classList.remove('phase-active');
                    }} else {{
                        s1Part1.classList.remove('phase-active');
                        s1Part2.classList.add('phase-active');
                    }}
                }}
            }} else if (activeIdx === 6) {{ // Semaine 2
                const s2Part1 = document.getElementById('s2-part-1');
                const s2Part2 = document.getElementById('s2-part-2');
                if (s2Part1 && s2Part2) {{
                    if (currentTime < 191.16) {{
                        s2Part1.classList.add('phase-active');
                        s2Part2.classList.remove('phase-active');
                    }} else {{
                        s2Part1.classList.remove('phase-active');
                        s2Part2.classList.add('phase-active');
                    }}
                }}
            }}
        }}

        masterAudio.addEventListener('timeupdate', () => {{
            updateTime(masterAudio.currentTime);
        }});

        const params = new URLSearchParams(window.location.search);
        if (params.get('format') === '9-16') {{
            document.body.classList.add('mode-9-16');
        }}

        window.addEventListener('click', () => {{
            if (masterAudio.paused) masterAudio.play();
            else masterAudio.pause();
        }});

        window.updateTime = updateTime;
        window.masterAudio = masterAudio;
    </script>
</body>
</html>"""


def build_studio_html():
    """Génère video-studio-video4.html."""
    pure_render_inner = f"""
        <div class="top-time-progress-bar">
            <div class="top-time-fill" id="time-progress-fill"></div>
        </div>

        <img src="assets/images/logo-domtomconnect-white.png" class="top-brand-logo" alt="Domtom Connect">

        <div class="stage-mograph-arena">
            <div class="anime-speedlines-bg"></div>
            <div class="stage-grid-floor"></div>

            <!-- Incrustation Loïc Vidéo Animée (HUD Vivant avec vraie photo) -->
            <div class="loic-live-hud">
                <div class="hud-portrait-circle">
                    <img src="assets/images/loic_portrait.png" class="hud-portrait-img" alt="Loïc Villeronce">
                </div>
                <div class="hud-info-side">
                    <div class="hud-live-tag">
                        <span class="hud-red-dot"></span> DIRECT LOÏC
                    </div>
                    <span class="hud-author-name">LOÏC VILLERONCE</span>
                    <div class="hud-voice-bars">
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                        <span class="h-bar"></span>
                    </div>
                </div>
            </div>

            <!-- Scènes Motion Design (12 Actes Majeurs) -->
{all_scenes_code}

            <!-- Sous-titre officiel broadcast en direct (dynamique par cue) -->
            <div class="bottom-broadcast-subtitles" id="subtitles-box">
                Quatre-vingts pour cent des porteurs de projets s'épuisent pendant des mois sans jamais encaisser le moindre euro.
            </div>
        </div>
    """

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Studio Vidéo 4 - Domtom Connect (80/20 & Plan d'action Martinique sur 14 jours)</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }}
        body {{
            background: #06090c;
            color: #fff;
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
        }}

        .studio-header {{
            background: #0d1318;
            border-bottom: 1px solid rgba(0, 191, 166, 0.25);
            padding: 10px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 100;
        }}
        .brand-block {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        .brand-logo-img {{
            height: 28px;
        }}
        .studio-title-badge {{
            background: rgba(0, 191, 166, 0.15);
            border: 1px solid rgba(0, 191, 166, 0.4);
            color: #00BFA6;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 6px;
        }}
        .controls-top-group {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        .fmt-btn {{
            background: #141f27;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }}
        .fmt-btn.active {{
            background: #00BFA6;
            color: #000;
            border-color: #00BFA6;
        }}

        .studio-main-viewport {{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #040608;
            position: relative;
            overflow: hidden;
            padding: 10px 16px;
            min-height: 0;
        }}
        .preview-viewport-169 {{
            height: 100%;
            max-height: 100%;
            aspect-ratio: 16 / 9;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 191, 166, 0.15);
            position: relative;
        }}
        .preview-viewport-916 {{
            height: 100%;
            max-height: 100%;
            aspect-ratio: 9 / 16;
            background: #000;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 191, 166, 0.15);
            position: relative;
        }}

        .studio-footer {{
            background: #0d1318;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 24px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 100;
        }}
        .timeline-controls-row {{
            display: flex;
            align-items: center;
            gap: 16px;
        }}
        .btn-play-pause {{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #00BFA6;
            color: #000;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.2s;
        }}
        .btn-play-pause:hover {{
            transform: scale(1.08);
            box-shadow: 0 0 15px rgba(0, 191, 166, 0.6);
        }}
        .slider-time-track {{
            flex: 1;
            accent-color: #00BFA6;
            cursor: pointer;
        }}
        .time-display-lbl {{
            font-size: 12px;
            font-weight: 800;
            color: #A7F3D0;
            min-width: 90px;
            text-align: right;
        }}
        .chapters-scroll-row {{
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 4px;
        }}
        .chap-btn {{
            background: #15222c;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #9CA3AF;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }}
        .chap-btn:hover, .chap-btn.active {{
            background: rgba(0, 191, 166, 0.15);
            border-color: #00BFA6;
            color: #00BFA6;
        }}

        {MOGRAPH_CSS}
    </style>
</head>
<body>
    <header class="studio-header">
        <div class="brand-block">
            <img src="assets/images/logo-domtomconnect-white.png" class="brand-logo-img" alt="Domtom Connect">
            <span class="studio-title-badge">STUDIO BROADCAST • VIDÉO 4 (80/20 & MARTINIQUE)</span>
        </div>
        <div class="controls-top-group">
            <button class="fmt-btn active" id="btn-169" onclick="setFormat('169')">Format 16:9 Broadcast</button>
            <button class="fmt-btn" id="btn-916" onclick="setFormat('916')">Format 9:16 Shorts / TikTok</button>
        </div>
    </header>

    <main class="studio-main-viewport">
        <div class="preview-viewport-169" id="preview-stage">
            {pure_render_inner}
        </div>
    </main>

    <footer class="studio-footer">
        <div class="timeline-controls-row">
            <button class="btn-play-pause" id="btn-play" onclick="togglePlay()">▶</button>
            <input type="range" class="slider-time-track" id="time-slider" min="0" max="300.72" step="0.1" value="0" oninput="onScrub(this.value)">
            <span class="time-display-lbl" id="time-display">00:00 / 05:00</span>
        </div>
        <div class="chapters-scroll-row" id="chapters-bar">
        </div>
    </footer>

    <audio id="master-audio" src="assets/audio/video4_8020_complete.mp3" preload="auto"></audio>

    <script>
        const beats = {json.dumps(beats_data, ensure_ascii=False)};
        const chapters = {json.dumps(chapters, ensure_ascii=False)};
        const syncCues = {json.dumps(sync_cues_data, ensure_ascii=False)};
        const masterAudio = document.getElementById('master-audio');
        const timeSlider = document.getElementById('time-slider');
        const timeDisplay = document.getElementById('time-display');
        const btnPlay = document.getElementById('btn-play');
        const chaptersBar = document.getElementById('chapters-bar');
        const previewStage = document.getElementById('preview-stage');
        const timeProgressFill = document.getElementById('time-progress-fill');
        const subtitlesBox = document.getElementById('subtitles-box');

        let currentBeatIndex = -1;
        const totalDuration = 300.72;

        chapters.forEach((ch, idx) => {{
            const btn = document.createElement('button');
            btn.className = 'chap-btn';
            btn.textContent = ch.label;
            btn.onclick = () => {{
                masterAudio.currentTime = ch.sec;
                updateTime(ch.sec);
            }};
            chaptersBar.appendChild(btn);
        }});

        function formatTime(s) {{
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${{m.toString().padStart(2, '0')}}:${{sec.toString().padStart(2, '0')}}`;
        }}

        function updateTime(currentTime) {{
            timeSlider.value = currentTime;
            timeDisplay.textContent = `${{formatTime(currentTime)}} / 05:00`;
            const pct = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));
            timeProgressFill.style.width = pct + '%';

            // Sous-titre dynamique en temps réel mot à mot
            const activeCue = syncCues.find(c => currentTime >= c.start && currentTime < c.end);
            if (activeCue) {{
                subtitlesBox.textContent = activeCue.text;
            }}

            let activeIdx = -1;
            for (let i = beats.length - 1; i >= 0; i--) {{
                if (currentTime >= beats[i].start) {{
                    activeIdx = i;
                    break;
                }}
            }}
            if (activeIdx === -1) activeIdx = 0;

            if (activeIdx !== currentBeatIndex) {{
                currentBeatIndex = activeIdx;
                const b = beats[activeIdx];

                document.querySelectorAll('.mograph-scene').forEach(el => el.classList.remove('active'));
                const activeScene = document.getElementById(b.id);
                if (activeScene) activeScene.classList.add('active');
            }}

            // Illuminations internes progressives par phase sans changer de slide brutalement
            if (activeIdx === 5) {{ // Semaine 1
                const s1Part1 = document.getElementById('s1-part-1');
                const s1Part2 = document.getElementById('s1-part-2');
                if (s1Part1 && s1Part2) {{
                    if (currentTime < 152.41) {{
                        s1Part1.classList.add('phase-active');
                        s1Part2.classList.remove('phase-active');
                    }} else {{
                        s1Part1.classList.remove('phase-active');
                        s1Part2.classList.add('phase-active');
                    }}
                }}
            }} else if (activeIdx === 6) {{ // Semaine 2
                const s2Part1 = document.getElementById('s2-part-1');
                const s2Part2 = document.getElementById('s2-part-2');
                if (s2Part1 && s2Part2) {{
                    if (currentTime < 191.16) {{
                        s2Part1.classList.add('phase-active');
                        s2Part2.classList.remove('phase-active');
                    }} else {{
                        s2Part1.classList.remove('phase-active');
                        s2Part2.classList.add('phase-active');
                    }}
                }}
            }}
        }}

        function togglePlay() {{
            if (masterAudio.paused) {{
                masterAudio.play();
                btnPlay.textContent = '⏸';
            }} else {{
                masterAudio.pause();
                btnPlay.textContent = '▶';
            }}
        }}

        function onScrub(val) {{
            const t = parseFloat(val);
            masterAudio.currentTime = t;
            updateTime(t);
        }}

        masterAudio.addEventListener('timeupdate', () => {{
            updateTime(masterAudio.currentTime);
        }});

        masterAudio.addEventListener('ended', () => {{
            btnPlay.textContent = '▶';
        }});

        function setFormat(fmt) {{
            document.getElementById('btn-169').classList.toggle('active', fmt === '169');
            document.getElementById('btn-916').classList.toggle('active', fmt === '916');
            if (fmt === '169') {{
                previewStage.className = 'preview-viewport-169';
                document.body.classList.remove('mode-9-16');
            }} else {{
                previewStage.className = 'preview-viewport-916';
                document.body.classList.add('mode-9-16');
            }}
        }}

        window.updateTime = updateTime;
    </script>
</body>
</html>"""


if __name__ == "__main__":
    render_code = build_pure_render_html()
    studio_code = build_studio_html()
    
    with open("render-video4-8020.html", "w", encoding="utf-8") as f:
        f.write(render_code)
        
    with open("video-studio-video4.html", "w", encoding="utf-8") as f:
        f.write(studio_code)
        
    print("SUCCESS: render-video4-8020.html and video-studio-video4.html successfully built with Motion Design & Live Video HUD!")
