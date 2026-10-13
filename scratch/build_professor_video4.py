# -*- coding: utf-8 -*-
import json

# SVG Icons without emojis
ICONS = {
    "warning": '<svg class="svg-ico danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    "action": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    "brain": '<svg class="svg-ico amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5c0 2-1 3-2 4 1 1 2 2 2 4a5 5 0 0 1-5 5 5 5 0 0 1-5-5c0-2 1-3 2-4-1-1-2-2-2-4a5 5 0 0 1 5-5z"/></svg>',
    "target": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    "package": '<svg class="svg-ico danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    "ship": '<svg class="svg-ico amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20a6 6 0 0 0 10 0 6 6 0 0 0 10 0"/><path d="M4 18l1.5-6h13L20 18"/><path d="M12 4v8"/><path d="M8 8h8"/></svg>',
    "calendar": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    "phone": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    "shield": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    "card": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    "video": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    "check": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    "stethoscope": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
    "book": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    "rocket": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    "network": '<svg class="svg-ico em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
}

# The 16 beats with professional poses and motion design elements
beats_data = [
    {
        "id": "beat-1",
        "start": 0.0,
        "end": 20.97,
        "caption": "80% des porteurs de projets s'épuisent pendant des mois sans jamais encaisser le moindre euro.",
        "avatar": "explaining",
        "badge": "L'ERREUR CLASSIQUE",
        "tag": "Constat de terrain",
        "title": "<span class=\"danger\">80%</span> des porteurs de projets s'épuisent <span class=\"danger\">dans le vide.</span>",
        "desc": "Des semaines passées sur un logo ou des plans théoriques sans encaisser le moindre euro.",
        "motion_badge": "80% PERTE DE TEMPS",
        "motion_gauge": {"val1": "80% Épuisement", "val2": "0 € Encaissé", "pct": 80, "color": "danger"},
        "cards": [
            {"ico": "warning", "title": "Épuisement stérile", "text": "Courir partout pendant des mois sans jamais confronter son offre au marché.", "type": "danger"},
            {"ico": "package", "title": "Logo et théories", "text": "Se réfugier dans des détails esthétiques pour repousser la confrontation commerciale.", "type": "amber"}
        ]
    },
    {
        "id": "beat-2",
        "start": 21.22,
        "end": 51.26,
        "caption": "Bonjour, moi c'est Loïc Villeronce, fondateur de Domtom Connect. Pourquoi utiliser un avatar et une IA ?",
        "avatar": "focus",
        "badge": "LOÏC VILLERONCE • FONDATEUR",
        "tag": "Présentation officielle",
        "title": "Loïc Villeronce, <span class=\"em\">fondateur de Domtom Connect.</span>",
        "desc": "Un choix totalement assumé de s'exprimer via un avatar animé propulsé par une IA.",
        "motion_badge": "PRÉCISION CHIRURGICALE",
        "cards": [
            {"ico": "action", "title": "Efficacité chirurgicale", "text": "Condenser mon savoir pour t'apporter un maximum de valeur sans perte de temps.", "type": "highlight"},
            {"ico": "network", "title": "Écosystème d'accompagnement", "text": "Aider les entreprises et porteurs de projets en Caraïbes, Afrique et diaspora.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-3",
        "start": 51.51,
        "end": 69.42,
        "caption": "Retrouve-moi en direct avec mon micro face caméra sur mes Shorts YouTube, TikTok et Instagram.",
        "avatar": "presenting",
        "badge": "100% RÉEL FACE CAMÉRA",
        "showShorts": True,
        "tag": "100% Réel sans filtre",
        "title": "Retrouve-moi en direct <span class=\"em\">sur Shorts, TikTok & Insta.</span>",
        "desc": "Prises de parole réelles avec mon micro face caméra pour échanger sans artifice.",
        "motion_badge": "VIDÉOS DIRECTES",
        "cards": [
            {"ico": "video", "title": "Prise de parole quotidienne", "text": "Vidéos face caméra où tu vois mon vrai visage et mes retours d'expérience directs.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-4",
        "start": 69.67,
        "end": 97.98,
        "caption": "La loi du 80/20, 80% d'action et 20% de réflexion. L'action imparfaite bat la théorie parfaite.",
        "avatar": "explaining",
        "badge": "LOI DU 80/20",
        "tag": "Principe de Pareto",
        "title": "<span class=\"em\">80% d'action massive,</span> <span class=\"amber\">20%</span> de réflexion.",
        "desc": "L'action imparfaite bat toujours la théorie parfaite, créer du mouvement immédiat.",
        "motion_gauge": {"val1": "80% Action terrain", "val2": "20% Stratégie", "pct": 80, "color": "emerald"},
        "cards": [
            {"ico": "action", "title": "80% Action concrète", "text": "Confronter son offre directement au marché et déclencher du mouvement.", "type": "highlight"},
            {"ico": "brain", "title": "20% Réflexion stratégique", "text": "Ajuster sa trajectoire sans jamais s'enfermer dans le doute ou la paralysie.", "type": "amber"}
        ]
    },
    {
        "id": "beat-5",
        "start": 98.23,
        "end": 125.67,
        "caption": "En Martinique, l'erreur classique est de commander 500 t-shirts ou de bloquer 3 000 € en stock sans client.",
        "avatar": "explaining",
        "badge": "RÉALITÉS EN MARTINIQUE",
        "tag": "Cas concret en Martinique",
        "title": "Lancer son projet <span class=\"amber\">sans bloquer son cash.</span>",
        "desc": "Marque de vêtements locale ou prestation de service, attention au piège du stock.",
        "motion_gauge": {"val1": "3 000 € Bloqués en cartons", "val2": "0 Client", "pct": 100, "color": "danger"},
        "cards": [
            {"ico": "package", "title": "Le piège des 500 pièces", "text": "Bloquer 3 000 € dans des cartons sans avoir validé un seul client payant.", "type": "danger"},
            {"ico": "ship", "title": "Fret maritime & octroi de mer", "text": "Délais d'approvisionnement et trésorerie gelée, le risque fatal aux Antilles.", "type": "amber"}
        ]
    },
    {
        "id": "beat-6",
        "start": 125.92,
        "end": 133.53,
        "caption": "Voici le plan d'action chirurgical sur 2 semaines pour appliquer le 80/20 et sécuriser ton lancement.",
        "avatar": "presenting",
        "badge": "MÉTHODE CHIRURGICALE",
        "tag": "Feuille de route",
        "title": "Le plan d'action chirurgical <span class=\"em\">sur 14 jours.</span>",
        "desc": "Quatorze jours chrono pour appliquer le 80/20 et sécuriser son lancement sans risque.",
        "motion_badge": "14 JOURS CHRONO",
        "cards": [
            {"ico": "calendar", "title": "Feuille de route en 2 semaines", "text": "Une méthode claire, structurée et immédiatement applicable sur le terrain.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-7",
        "start": 133.78,
        "end": 152.16,
        "caption": "Semaine 1, jours 1 à 3, oublie le catalogue de 15 produits. Définis une seule offre irrésistible.",
        "avatar": "focus",
        "badge": "SEMAINE 1 • JOURS 1 À 3",
        "tag": "Semaine 1 • Fondations",
        "title": "Une seule pièce forte, <span class=\"em\">une seule offre irrésistible.</span>",
        "desc": "Oublier le catalogue de 15 produits, cibler un besoin précis et urgent.",
        "motion_badge": "1 OFFRE CLÉ UNIQUE",
        "cards": [
            {"ico": "target", "title": "Une seule offre phare", "text": "Un produit unique ou une prestation de service à haute valeur ajoutée.", "type": "highlight"},
            {"ico": "action", "title": "Zéro éparpillement", "text": "Concentrer 100% de sa force de frappe sur une proposition de valeur claire.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-8",
        "start": 152.41,
        "end": 174.75,
        "caption": "Semaine 1, jours 4 à 7, terrain en Martinique. Contacte 20 personnes cibles via WhatsApp avec 0 € en stock.",
        "avatar": "presenting",
        "badge": "SEMAINE 1 • JOURS 4 À 7",
        "tag": "Semaine 1 • Confrontation terrain",
        "title": "Terrain en Martinique, <span class=\"em\">20 personnes cibles.</span>",
        "desc": "Via WhatsApp, le réseau local ou en direct, valider l'intérêt avant de dépenser 1 centime.",
        "motion_gauge": {"val1": "20 Contacts qualifiés", "val2": "0 € Dépensé en stock", "pct": 100, "color": "emerald"},
        "cards": [
            {"ico": "phone", "title": "20 contacts WhatsApp directs", "text": "Présenter son prototype ou son offre test directement à des prospects réels.", "type": "highlight"},
            {"ico": "shield", "title": "0 € de stock commandé", "text": "Écouter les retours réels et valider l'intérêt avant tout engagement financier.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-9",
        "start": 175.0,
        "end": 190.91,
        "caption": "Semaine 2, jours 8 à 10, lance les précommandes fermes. Encaisse les règlements avant de produire.",
        "avatar": "explaining",
        "badge": "SEMAINE 2 • JOURS 8 À 10",
        "tag": "Semaine 2 • Précommandes",
        "title": "Précommandes fermes, <span class=\"em\">encaisser avant de produire.</span>",
        "desc": "Lancer une offre de lancement exclusive et sécuriser les premiers règlements.",
        "motion_badge": "ENCAISSEMENT AVANT PRODUCTION",
        "cards": [
            {"ico": "card", "title": "Trésorerie auto-financée", "text": "Faire financer la production finale directement par les précommandes clients.", "type": "highlight"},
            {"ico": "action", "title": "Offre de lancement exclusive", "text": "Créer une urgence commerciale avec un avantage fort pour les premiers acheteurs.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-10",
        "start": 191.16,
        "end": 201.43,
        "caption": "Semaine 2, jours 11 à 14, documente les retours avec des vidéos courtes pour la preuve sociale locale.",
        "avatar": "presenting",
        "badge": "SEMAINE 2 • JOURS 11 À 14",
        "tag": "Semaine 2 • Preuve sociale",
        "title": "Documenter les retours, <span class=\"em\">preuve sociale locale.</span>",
        "desc": "Des vidéos courtes sur les réseaux sociaux pour montrer les premiers clients satisfaits.",
        "motion_badge": "PREUVE SOCIALE VIDÉO",
        "cards": [
            {"ico": "video", "title": "Preuve sociale en vidéo", "text": "Diffuser les avis et livraisons réelles pour déclencher un bouche-à-oreille puissant.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-11",
        "start": 201.68,
        "end": 212.07,
        "caption": "En 14 jours chrono, marché validé, fonds encaissés, tu sais sur quels 20% d'actions concentrer ton énergie.",
        "avatar": "focus",
        "badge": "BILAN 14 JOURS CHRONO",
        "tag": "Validation complète",
        "title": "Marché validé, <span class=\"em\">trésorerie en sécurité.</span>",
        "desc": "En 14 jours, tes fonds sont encaissés et tu sais sur quels 20% concentrer ton énergie.",
        "motion_badge": "OBJECTIF ATTEINT",
        "cards": [
            {"ico": "check", "title": "Validation terrain 100% réussie", "text": "Des clients réels ont payé sans que tu n'aies pris le moindre risque financier.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-12",
        "start": 212.32,
        "end": 232.13,
        "caption": "Pour avancer en autonomie, fais ton diagnostic gratuit avec l'Anamnèse clinique sur www.domtomconnect.com.",
        "avatar": "presenting",
        "badge": "DIAGNOSTIC GRATUIT",
        "tag": "Accompagnement Domtom Connect",
        "title": "Diagnostic gratuit, <span class=\"em\">l'Anamnèse clinique.</span>",
        "desc": "Identifie gratuitement tes blocages et tes leviers de croissance sur www.domtomconnect.com.",
        "motion_badge": "LEAD MAGNET GRATUIT",
        "cards": [
            {"ico": "stethoscope", "title": "L'Anamnèse clinique", "text": "Un outil gratuit de diagnostic clinique des problématiques d'entreprise.", "type": "highlight"},
            {"ico": "target", "title": "Accès immédiat en ligne", "text": "Disponible 24h/24 sur www.domtomconnect.com pour poser un diagnostic clair.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-13",
        "start": 232.38,
        "end": 241.86,
        "caption": "Nous avons aussi conçu un ebook interactif complet qui te guide pas à pas dans ton lancement.",
        "avatar": "focus",
        "badge": "POUR AVANCER SEUL",
        "tag": "Guide opérationnel",
        "title": "L'Ebook interactif, <span class=\"em\">ton guide opérationnel.</span>",
        "desc": "Un guide complet pour les porteurs de projets qui travaillent sur leur lancement.",
        "motion_badge": "GUIDE PAS À PAS",
        "cards": [
            {"ico": "book", "title": "Toutes les étapes opérationnelles", "text": "Structuration, validation de marché et méthodes concrètes pour avancer seul.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-14",
        "start": 242.11,
        "end": 260.27,
        "caption": "Si tu veux un accompagnement direct sur le terrain, le Programme Tremplin propose One-to-One et copilotage direct.",
        "avatar": "explaining",
        "badge": "ACCOMPAGNEMENT 360°",
        "tag": "Accompagnement intensif",
        "title": "Le Programme Tremplin, <span class=\"em\">copilotage opérationnel direct.</span>",
        "desc": "Suivi One-to-One pour déléguer les tâches chronophages et te concentrer sur ta zone de génie.",
        "motion_badge": "COPILOTAGE BUSINESS",
        "cards": [
            {"ico": "rocket", "title": "Suivi individuel One-to-One", "text": "Accompagnement à 360 degrés adapté à tes réalités d'exploitation territoriales.", "type": "highlight"},
            {"ico": "shield", "title": "Déléguer le chronophage", "text": "Reprendre le contrôle de ton temps pour te focaliser sur la rentabilité pure.", "type": "highlight"}
        ]
    },
    {
        "id": "beat-15",
        "start": 260.52,
        "end": 274.82,
        "caption": "Rejoins notre réseau business actif sur WhatsApp et notre application propriétaire DTC Pulse en bêta fermée.",
        "avatar": "presenting",
        "badge": "TECH & RÉSEAU D'AFFAIRES",
        "tag": "Réseau et Tech",
        "title": "Groupe WhatsApp actif <span class=\"em\">& DTC Pulse.</span>",
        "desc": "Réseau business propriétaire fusionnant Uber Eats, TikTok et Amazon, en bêta fermée.",
        "isPulse": True
    },
    {
        "id": "beat-16",
        "start": 275.07,
        "end": 300.72,
        "caption": "Réserve ton échange direct de 30 minutes sur Calendly. Rendez-vous sur www.domtomconnect.com. Stay co.",
        "avatar": "focus",
        "badge": "CALENDLY & STAY CO.",
        "tag": "Passage à l'action",
        "title": "Échange direct de <span class=\"em\">30 minutes sur Calendly.</span>",
        "desc": "On analyse ta situation sans détour et on voit en franchise si ça a du sens de collaborer.",
        "cards": [
            {"ico": "calendar", "title": "Lien Calendly officiel", "text": "calendly.com/domtomconnect/30min", "type": "highlight"},
            {"ico": "target", "title": "Plateforme officielle", "text": "www.domtomconnect.com", "type": "highlight"}
        ],
        "isFinal": True
    }
]

# Map chapter to beats for Studio
chapters = [
    {"label": "01. Constat 80%", "sec": 0.0},
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

for b in beats_data:
    sec = b["start"]
    if sec < 21.2: b["chapter"] = "01. Constat 80%"
    elif sec < 51.5: b["chapter"] = "02. Loïc & Avatar IA"
    elif sec < 69.7: b["chapter"] = "03. Preuve en direct"
    elif sec < 98.2: b["chapter"] = "04. Loi du 80/20"
    elif sec < 125.9: b["chapter"] = "05. Cas Martinique"
    elif sec < 133.8: b["chapter"] = "06. Plan 14 jours"
    elif sec < 175.0: b["chapter"] = "07. Semaine 1"
    elif sec < 201.7: b["chapter"] = "08. Semaine 2"
    elif sec < 212.3: b["chapter"] = "09. Bilan & Résultats"
    elif sec < 242.1: b["chapter"] = "10. Domtom Connect"
    elif sec < 275.1: b["chapter"] = "11. Tremplin & DTC Pulse"
    else: b["chapter"] = "12. Action & Stay co."

def render_slides_inner():
    html = []
    for i, b in enumerate(beats_data):
        active_cls = " active" if i == 0 else ""
        html.append(f'        <!-- SLIDE {i+1:02d} : {b["tag"].upper()} ({b["start"]}s - {b["end"]}s) -->')
        html.append(f'        <div class="beat-scene{active_cls}" id="{b["id"]}">')
        
        # Tag & Motion Badge
        html.append('            <div class="slide-header-row">')
        html.append(f'                <span class="b-tag">{b["tag"]}</span>')
        if b.get("motion_badge"):
            html.append(f'                <span class="motion-pill">{b["motion_badge"]}</span>')
        html.append('            </div>')
        
        # Title & Desc
        html.append(f'            <h1 class="b-title">{b["title"]}</h1>')
        html.append(f'            <p class="b-desc">{b["desc"]}</p>')
        
        # Interactive Motion Gauge if present
        if b.get("motion_gauge"):
            g = b["motion_gauge"]
            cls = g.get("color", "emerald")
            html.append('            <div class="motion-gauge-box">')
            html.append('                <div class="gauge-labels">')
            html.append(f'                    <span class="gauge-lbl left">{g["val1"]}</span>')
            html.append(f'                    <span class="gauge-lbl right">{g["val2"]}</span>')
            html.append('                </div>')
            html.append('                <div class="gauge-track">')
            html.append(f'                    <div class="gauge-fill {cls}" style="width: {g["pct"]}%;"></div>')
            html.append('                </div>')
            html.append('            </div>')
            
        # DTC Pulse container
        if b.get("isPulse"):
            html.append('            <div class="phones-container">')
            html.append('                <img src="assets/images/screenshots/screen1.png" class="phone-img" alt="DTC Pulse Écran 1">')
            html.append('                <img src="assets/images/logo-pulse.png" class="pulse-center-logo" alt="Logo DTC Pulse">')
            html.append('                <img src="assets/images/screenshots/screen2.png" class="phone-img" alt="DTC Pulse Écran 2">')
            html.append('            </div>')
        elif b.get("cards"):
            html.append('            <div class="cards-row">')
            for c in b["cards"]:
                ico_html = ICONS.get(c.get("ico", "action"), ICONS["action"])
                cls = f'info-card {c.get("type", "")}'.strip()
                html.append(f'                <div class="{cls}">')
                html.append('                    <div class="info-card-title">')
                html.append(f'                        {ico_html}')
                html.append(f'                        <span>{c["title"]}</span>')
                html.append('                    </div>')
                html.append(f'                    <div class="info-card-text">{c["text"]}</div>')
                html.append('                </div>')
            html.append('            </div>')
            
        if b.get("isFinal"):
            html.append('            <div class="stay-co-sign">')
            html.append('                Stay <span class="em">co.</span>')
            html.append('            </div>')
            
        html.append('        </div>\n')
    return "\n".join(html)

slides_code = render_slides_inner()

# CSS common styles for the Professor stage & Motion design
SHARED_CSS = """
        :root {
            --obsidian: #030605;
            --emerald: #00BFA6;
            --emerald-bright: #10B981;
            --emerald-glow: rgba(0, 191, 166, 0.4);
            --amber: #F59E0B;
            --red: #EF4444;
            --white: #FFFFFF;
            --gray-300: #D1D5DB;
            --gray-400: #9CA3AF;
            --gray-600: #4B5563;
            --border: rgba(255, 255, 255, 0.08);
            --border-emerald: rgba(0, 191, 166, 0.35);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        /* Plateau Broadcast avec Présentateur */
        .stage-broadcast-layout {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            gap: 24px;
            position: relative;
            z-index: 20;
            padding: 20px 40px 60px 20px;
        }

        /* 1. Colonne Présentateur (Professor Avatar) */
        .professor-col {
            flex: 0 0 340px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            position: relative;
            z-index: 25;
        }

        .professor-stage-frame {
            position: relative;
            width: 100%;
            height: 88%;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8));
        }

        .professor-stage-frame::after {
            content: '';
            position: absolute;
            bottom: -15px;
            width: 240px;
            height: 35px;
            border-radius: 50%;
            background: radial-gradient(ellipse at center, rgba(0, 191, 166, 0.45) 0%, transparent 75%);
            filter: blur(8px);
            z-index: 1;
        }

        .professor-img {
            max-height: 100%;
            width: auto;
            object-fit: contain;
            position: relative;
            z-index: 2;
            transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: professor-sway 6s ease-in-out infinite;
            -webkit-mask-image: linear-gradient(to bottom, black 82%, transparent 100%);
            mask-image: linear-gradient(to bottom, black 82%, transparent 100%);
        }

        @keyframes professor-sway {
            0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
            50% { transform: translateY(-8px) scale(1.015) rotate(0.6deg); }
        }

        .professor-badge-card {
            margin-top: -10px;
            background: rgba(5, 12, 10, 0.95);
            border: 1px solid var(--border-emerald);
            border-radius: 100px;
            padding: 6px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
            z-index: 30;
        }

        .audio-wave-anim {
            display: flex;
            align-items: center;
            gap: 3px;
            height: 14px;
        }

        .audio-wave-bar {
            width: 2.5px;
            height: 100%;
            background: var(--emerald);
            border-radius: 2px;
            animation: waveBounce 0.8s ease-in-out infinite alternate;
        }
        .audio-wave-bar:nth-child(2) { animation-delay: 0.15s; }
        .audio-wave-bar:nth-child(3) { animation-delay: 0.3s; }
        .audio-wave-bar:nth-child(4) { animation-delay: 0.45s; }

        @keyframes waveBounce {
            0% { height: 20%; }
            100% { height: 100%; }
        }

        .professor-badge-text {
            font-size: 11px;
            font-weight: 800;
            color: var(--emerald);
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        /* 2. Colonne Tableau de Bord / Slides interactives */
        .board-col {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 20;
            max-width: 820px;
            text-align: left;
        }

        .beat-scene {
            display: none;
            flex-direction: column;
            width: 100%;
            animation: fadeInBoard 0.35s ease-out forwards;
        }

        .beat-scene.active {
            display: flex;
        }

        @keyframes fadeInBoard {
            from { opacity: 0; transform: translateX(14px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .slide-header-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .b-tag {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: var(--emerald);
            text-transform: uppercase;
            background: rgba(0, 191, 166, 0.12);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid rgba(0, 191, 166, 0.3);
        }

        .motion-pill {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            color: var(--amber);
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            padding: 3px 10px;
            border-radius: 100px;
        }

        .b-title {
            font-family: 'Cabinet Grotesk', sans-serif;
            font-size: 42px;
            font-weight: 900;
            line-height: 1.12;
            letter-spacing: -0.5px;
            margin-bottom: 12px;
            color: #FFFFFF;
        }

        .b-title span.em { color: var(--emerald); }
        .b-title span.amber { color: var(--amber); }
        .b-title span.danger { color: var(--red); }

        .b-desc {
            font-size: 16px;
            font-weight: 500;
            color: var(--gray-300);
            line-height: 1.45;
            max-width: 700px;
            margin-bottom: 16px;
        }

        /* Jauges Motion Design interactives */
        .motion-gauge-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px 18px;
            margin-bottom: 16px;
            max-width: 680px;
        }

        .gauge-labels {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 800;
            margin-bottom: 8px;
        }

        .gauge-lbl.left { color: var(--white); }
        .gauge-lbl.right { color: var(--amber); }

        .gauge-track {
            height: 8px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            overflow: hidden;
            position: relative;
        }

        .gauge-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gauge-fill.emerald {
            background: linear-gradient(90deg, var(--emerald) 0%, var(--emerald-bright) 100%);
            box-shadow: 0 0 12px var(--emerald);
        }

        .gauge-fill.danger {
            background: linear-gradient(90deg, #F87171 0%, var(--red) 100%);
            box-shadow: 0 0 12px var(--red);
        }

        /* Cartes d'information avec icônes SVG */
        .cards-row {
            display: flex;
            gap: 14px;
            width: 100%;
            max-width: 760px;
        }

        .info-card {
            flex: 1;
            padding: 14px 18px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            transition: all 0.2s;
        }

        .info-card.highlight {
            background: rgba(0, 191, 166, 0.08);
            border-color: var(--border-emerald);
        }

        .info-card.danger {
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.3);
        }

        .info-card.amber {
            background: rgba(245, 158, 11, 0.08);
            border-color: rgba(245, 158, 11, 0.3);
        }

        .info-card-title {
            font-size: 14px;
            font-weight: 800;
            color: var(--white);
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .svg-ico {
            width: 18px;
            height: 18px;
            stroke-width: 2.2;
        }

        .svg-ico.em { stroke: var(--emerald); }
        .svg-ico.amber { stroke: var(--amber); }
        .svg-ico.danger { stroke: var(--red); }

        .info-card-text {
            font-size: 13px;
            color: var(--gray-400);
            line-height: 1.4;
        }

        .phones-container {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 8px;
        }

        .phone-img {
            height: 125px;
            width: auto;
            border-radius: 12px;
            border: 1px solid var(--border-emerald);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
        }

        .pulse-center-logo {
            height: 52px;
            width: auto;
        }

        .stay-co-sign {
            font-family: 'Cabinet Grotesk', sans-serif;
            font-size: 46px;
            font-weight: 900;
            color: #FFFFFF;
            margin-top: 14px;
        }

        .stay-co-sign .em { color: var(--emerald); }

        /* Sous-titres dynamiques épurés */
        .caption-bar {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: center;
            z-index: 35;
            pointer-events: none;
        }

        .caption-pill {
            background: rgba(3, 8, 6, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(14px);
            padding: 8px 24px;
            border-radius: 100px;
            font-size: 14px;
            font-weight: 600;
            color: var(--white);
            max-width: 80%;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
        }

        /* 3. MODE 9:16 VERTICAL POUR SHORTS */
        body.mode-9-16 .stage-broadcast-layout,
        .video-screen.vertical .stage-broadcast-layout {
            flex-direction: column;
            padding: 30px 20px 70px;
            gap: 14px;
            text-align: center;
            justify-content: flex-start;
        }

        body.mode-9-16 .professor-col,
        .video-screen.vertical .professor-col {
            flex: 0 0 360px;
            width: 100%;
            height: auto;
            align-items: center;
        }

        body.mode-9-16 .professor-stage-frame,
        .video-screen.vertical .professor-stage-frame {
            height: 330px;
            width: 100%;
        }

        .video-screen.vertical .professor-col {
            flex: 0 0 200px;
        }

        .video-screen.vertical .professor-stage-frame {
            height: 185px;
        }

        body.mode-9-16 .board-col,
        .video-screen.vertical .board-col {
            text-align: center;
            align-items: center;
        }

        body.mode-9-16 .slide-header-row,
        .video-screen.vertical .slide-header-row {
            justify-content: center;
        }

        body.mode-9-16 .b-title,
        .video-screen.vertical .b-title {
            font-size: 26px;
            line-height: 1.15;
            max-width: 310px;
        }

        body.mode-9-16 .b-desc,
        .video-screen.vertical .b-desc {
            font-size: 13px;
            line-height: 1.35;
            max-width: 290px;
        }

        body.mode-9-16 .cards-row,
        .video-screen.vertical .cards-row {
            flex-direction: column;
            gap: 8px;
            max-width: 295px;
        }

        body.mode-9-16 .info-card,
        .video-screen.vertical .info-card {
            padding: 10px 14px;
            text-align: left;
        }

        body.mode-9-16 .phone-img,
        .video-screen.vertical .phone-img {
            height: 90px;
        }

        body.mode-9-16 .pulse-center-logo,
        .video-screen.vertical .pulse-center-logo {
            height: 40px;
        }

        body.mode-9-16 .caption-pill,
        .video-screen.vertical .caption-pill {
            font-size: 12px;
            padding: 6px 14px;
            bottom: 12px;
        }
"""

# ----------------- 1. RENDER-VIDEO4-8020.HTML -----------------
render_page_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domtom Connect • Rendu Pur Vidéo 4 (Loi 80/20 & Plan d'Action 14 Jours)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Cabinet+Grotesk:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        {SHARED_CSS}

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
            overflow: hidden;
            background: radial-gradient(circle at 65% 35%, #05140e 0%, #010403 70%, #000000 100%);
        }}

        .ambient-glow {{
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background: rgba(0, 191, 166, 0.16);
            filter: blur(150px);
            left: 5%;
            top: 15%;
            pointer-events: none;
        }}

        .screen-watermark {{
            position: absolute;
            top: 28px;
            left: 36px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 30;
            opacity: 0.9;
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

        <div class="stage-broadcast-layout">
            <!-- 1. Présentateur (Professor Avatar avec Corps & Gestes) -->
            <div class="professor-col">
                <div class="professor-stage-frame">
                    <img src="assets/images/loic_professor_explaining.jpg" id="professorImg" class="professor-img" alt="Loïc Villeronce">
                </div>
                <div class="professor-badge-card">
                    <div class="audio-wave-anim">
                        <div class="audio-wave-bar"></div>
                        <div class="audio-wave-bar"></div>
                        <div class="audio-wave-bar"></div>
                        <div class="audio-wave-bar"></div>
                    </div>
                    <span class="professor-badge-text" id="professorBadge">LOÏC VILLERONCE</span>
                </div>
            </div>

            <!-- 2. Tableau de bord interactif Motion Design -->
            <div class="board-col">
{slides_code}
            </div>
        </div>

        <div class="caption-bar">
            <div class="caption-pill" id="caption-pill">Domtom Connect</div>
        </div>
    </div>

    <audio id="audio" src="assets/audio/video4_8020_complete.mp3" preload="auto"></audio>

    <script>
        const audio = document.getElementById('audio');
        const screenFill = document.getElementById('screen-fill');
        const captionPill = document.getElementById('caption-pill');
        const professorImg = document.getElementById('professorImg');
        const professorBadge = document.getElementById('professorBadge');

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('format') === '9-16') {{
            document.body.className = 'mode-9-16';
        }}

        const professorPoses = {{
            presenting: 'assets/images/loic_professor_presenting.jpg',
            explaining: 'assets/images/loic_professor_explaining.jpg',
            focus: 'assets/images/loic_professor_focus.jpg'
        }};

        const beats = {json.dumps(beats_data, ensure_ascii=False, indent=12)};

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
                if (b.avatar && professorPoses[b.avatar]) {{
                    professorImg.src = professorPoses[b.avatar];
                }}
                if (b.badge) {{
                    professorBadge.textContent = b.badge;
                }}
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
    f.write(render_page_content)
print("Updated render-video4-8020.html with Professor Avatar and zero emojis!")

# ----------------- 2. VIDEO-STUDIO-VIDEO4.HTML -----------------
chapters_html = []
for ch in chapters:
    cls = " active" if ch["sec"] == 0.0 else ""
    chapters_html.append(f'        <button class="chapter-pill{cls}" onclick="jumpTo({ch["sec"]})">{ch["label"]}</button>')
chapters_bar_code = "\n".join(chapters_html)

studio_page_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Domtom Connect • Studio Vidéo 4 • La Loi du 80/20 & Plan d'Action 14 Jours</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Cabinet+Grotesk:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        {SHARED_CSS}

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

        /* Header */
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
            width: 1020px;
            height: 574px;
        }}

        .video-screen.vertical {{
            width: 360px;
            height: 640px;
        }}

        .viewport-inner {{
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            background: radial-gradient(circle at 65% 35%, #05140e 0%, #010403 70%, #000000 100%);
        }}

        .ambient-glow {{
            position: absolute;
            width: 480px;
            height: 480px;
            border-radius: 50%;
            background: rgba(0, 191, 166, 0.15);
            filter: blur(130px);
            left: 10%;
            top: 20%;
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

        /* Player Bar */
        .player-bar {{
            width: 100%;
            max-width: 1020px;
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

        /* Details Cards */
        .details-grid {{
            width: 100%;
            max-width: 1020px;
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

                    <div class="stage-broadcast-layout">
                        <!-- 1. Présentateur (Professor Avatar avec Corps & Gestes) -->
                        <div class="professor-col">
                            <div class="professor-stage-frame">
                                <img src="assets/images/loic_professor_explaining.jpg" id="professorImg" class="professor-img" alt="Loïc Villeronce">
                            </div>
                            <div class="professor-badge-card">
                                <div class="audio-wave-anim">
                                    <div class="audio-wave-bar"></div>
                                    <div class="audio-wave-bar"></div>
                                    <div class="audio-wave-bar"></div>
                                    <div class="audio-wave-bar"></div>
                                </div>
                                <span class="professor-badge-text" id="professorBadge">LOÏC VILLERONCE</span>
                            </div>
                        </div>

                        <!-- 2. Tableau de bord interactif Motion Design -->
                        <div class="board-col">
{slides_code}
                        </div>
                    </div>

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

                    <div class="ctrl-center" id="chapterIndicator">01. Constat 80%</div>

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
        const professorImg = document.getElementById('professorImg');
        const professorBadge = document.getElementById('professorBadge');

        const professorPoses = {{
            presenting: 'assets/images/loic_professor_presenting.jpg',
            explaining: 'assets/images/loic_professor_explaining.jpg',
            focus: 'assets/images/loic_professor_focus.jpg'
        }};

        const beats = {json.dumps(beats_data, ensure_ascii=False, indent=12)};

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

                if (b.avatar && professorPoses[b.avatar]) {{
                    professorImg.src = professorPoses[b.avatar];
                }}
                if (b.badge) {{
                    professorBadge.textContent = b.badge;
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
    f.write(studio_page_content)
print("Updated video-studio-video4.html with Professor Avatar and zero emojis!")
