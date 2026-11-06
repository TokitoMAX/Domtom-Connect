"""
Générateur de pages Domtom Connect.

Un seul gabarit (noir, blanc, vert, pensé mobile d'abord) pour toutes les pages de service,
de secteur et de territoire. Le contenu vit dans tools/contenu_*.py, le rendu est identique partout.

Utilisation
    python tools/site_builder.py            -> régénère toutes les pages déclarées
"""
import html, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://domtomconnect.com"
CAL_URL = "https://calendly.com/domtomconnect/30min"
CAL = f'href="{CAL_URL}" onclick="return openCalendlyDiagnostic(event);"'
WA = "https://wa.me/33620783377"

def e(t):
    return html.escape(t, quote=True)

# ---------------------------------------------------------------- menu
NAV_ITEMS = [("/entreprises", "Entreprises", "entreprises"), ("/seance-strategique", "Séance stratégique", "seance"),
             ("/tremplin", "Porteurs de projet", "tremplin"), ("/anamnese", "Diagnostic gratuit", "anamnese"),
             ("/rejoindre", "Réseau et DTC Pulse", "reseau")]

def nav(active):
    items = "\n".join(f'                    <li><a href="{h}" class="nav-link{" nav-link-active" if k == active else ""}">{l}</a></li>' for h, l, k in NAV_ITEMS)
    drawer = "\n".join(f'        <a href="{h}" class="mobile-nav-link"><span>{l}</span><i class="fas fa-chevron-right"></i></a>' for h, l, k in NAV_ITEMS)
    return f"""<header class="site-nav">
        <div class="container">
            <div class="nav-inner">
                <a href="/" class="nav-brand" aria-label="Domtom Connect, accueil">
                    <img src="/assets/images/logo-emblem-dark-clean.png" alt="Domtom Connect" class="pf-logo-nav"/>
                    <span class="nav-brand-title">Domtom Connect</span>
                </a>
                <ul class="nav-menu">
{items}
                </ul>
                <div class="nav-actions">
                    <a href="/login" class="nav-btn-login">Se connecter</a>
                    <a {CAL} class="nav-btn-cta"><span>Réserver un échange</span></a>
                    <button class="mobile-toggle" aria-label="Ouvrir le menu" id="mobile-menu-btn" aria-expanded="false"><i class="fas fa-bars"></i></button>
                </div>
            </div>
        </div>
    </header>
    <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <a href="/" class="mobile-nav-link"><span>Accueil</span><i class="fas fa-chevron-right"></i></a>
{drawer}
        <div class="mobile-nav-divider"></div>
        <div class="mobile-nav-actions">
            <a {CAL} class="mobile-nav-cta"><i class="fas fa-calendar-alt"></i><span>Réserver un échange (30 min)</span></a>
            <a href="/login" class="mobile-nav-login"><i class="fas fa-user-circle"></i><span>Espace membre</span></a>
        </div>
    </div>"""

# ---------------------------------------------------------------- pied de page
def footer():
    return f"""<footer class="pf-footer">
        <div class="pf-container">
            <div class="pf-footer-grid">
                <div>
                    <a href="/" class="pf-footer-brand"><img src="/assets/images/logo-emblem-dark-clean.png" alt="" class="pf-logo-footer"/><span>Domtom Connect</span></a>
                    <p>Conseil, copilotage et réseau d'affaires pour les dirigeants et porteurs de projets de la Caraïbe, d'Afrique et de la diaspora.</p>
                    <p><a href="mailto:domtomconnect@gmail.com">domtomconnect@gmail.com</a><br/><a href="{WA}">+33 6 20 78 33 77 (WhatsApp)</a></p>
                </div>
                <div>
                    <h3>Offres</h3>
                    <a href="/seance-strategique">Séance stratégique</a>
                    <a href="/pilotage">Copilotage opérationnel</a>
                    <a href="/tremplin">Programme Tremplin</a>
                    <a href="/anamnese">Diagnostic gratuit</a>
                    <a href="/guide-entrepreneur">Guide de l'entrepreneur</a>
                </div>
                <div>
                    <h3>Secteurs</h3>
                    <a href="/entreprises-btp">BTP et bâtiment</a>
                    <a href="/entreprises-tourisme">Tourisme et hébergement</a>
                    <a href="/entreprises-ingenierie">Bureaux d'études</a>
                    <a href="/entreprises-juridique">Cabinets juridiques et comptables</a>
                    <a href="/marques">Marques et producteurs</a>
                </div>
                <div>
                    <h3>Domtom Connect</h3>
                    <a href="/a-propos">À propos</a>
                    <a href="/rejoindre">Réseau et DTC Pulse</a>
                    <a href="/blog">Blog</a>
                    <a href="/support">Contact</a>
                    <a href="/login">Espace membre</a>
                </div>
            </div>
            <div class="pf-footer-bottom">
                <span>© 2026 Domtom Connect · Loïc Villeronce</span>
                <span><a href="/legal/privacy">Confidentialité</a> · <a href="/child-safety">Sécurité des mineurs</a></span>
                <span class="pf-social"><a href="https://www.linkedin.com/company/domtomconnect" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a><a href="https://www.instagram.com/domtomconnect" aria-label="Instagram"><i class="fab fa-instagram"></i></a><a href="https://www.youtube.com/@domtomconnect" aria-label="YouTube"><i class="fab fa-youtube"></i></a><a href="https://www.tiktok.com/@domtomconnect" aria-label="TikTok"><i class="fab fa-tiktok"></i></a></span>
            </div>
        </div>
    </footer>"""

# ---------------------------------------------------------------- en-tête technique
HEAD_TRACKING = """    <script src="https://t.contentsquare.net/uxa/86bd8964d6ff4.js"></script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TBM8LXJV');</script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1C5QTWZFER"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-1C5QTWZFER');</script>"""

def head(p, ld):
    url = SITE + p["path"]
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8"/>
{HEAD_TRACKING}
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>{e(p['title'])}</title>
    <meta name="description" content="{e(p['description'])}"/>
    <meta name="robots" content="index, follow, max-image-preview:large"/>
    <link rel="canonical" href="{url}"/>
    <link rel="icon" type="image/png" href="/assets/images/logo-domtomconnect.png"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="{url}"/>
    <meta property="og:title" content="{e(p['title'])}"/>
    <meta property="og:description" content="{e(p['description'])}"/>
    <meta property="og:image" content="{SITE}/assets/images/logo-domtomconnect.png"/>
    <meta property="og:locale" content="fr_FR"/>
    <meta property="og:site_name" content="Domtom Connect"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <link rel="stylesheet" href="/assets/css/site-nav.css"/>
    <link rel="stylesheet" href="/assets/css/refonte-pro.css"/>
    <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet"/>
    <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
    <script>function openCalendlyDiagnostic(e){{if(e&&e.preventDefault)e.preventDefault();if(window.Calendly&&typeof window.Calendly.initPopupWidget==='function'){{window.Calendly.initPopupWidget({{url:'{CAL_URL}'}});}}else{{window.open('{CAL_URL}','_blank');}}return false;}}</script>
    <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
    </script>
</head>"""

# ---------------------------------------------------------------- composants
def chips(groups, current):
    out = []
    for label, items in groups:
        links = "".join(f'<a href="{h}" class="pf-chip{" active" if h == current else ""}">{e(l)}</a>' for h, l in items)
        out.append(f'<div class="pf-chips-group"><span class="pf-chips-label">{e(label)}</span><div class="pf-chips-row">{links}</div></div>')
    return f'<nav class="pf-chips" aria-label="Secteurs"><div class="pf-container">{"".join(out)}</div></nav>'

def crumbs(items):
    parts = []
    for i, (h, l) in enumerate(items):
        parts.append(f'<a href="{h}">{e(l)}</a>' if h else f'<span aria-current="page">{e(l)}</span>')
    return '<div class="pf-crumb"><div class="pf-container">' + '<span class="sep">/</span>'.join(parts) + "</div></div>"

def ctas_html(p):
    ctas = p.get("ctas") or [("CAL", "Réserver un échange de 30 minutes", True), ("/seance-strategique", "Séance stratégique à 100 €", False)]
    out = []
    for href, label, primary in ctas:
        attr = CAL if href == "CAL" else f'href="{href}"'
        icon = '<i class="fas fa-calendar-alt"></i>' if href == "CAL" and primary else ""
        out.append(f'<a {attr} class="{"pf-btn" if primary else "pf-btn-ghost"}">{icon}<span>{e(label)}</span></a>')
    return "\n                        ".join(out)

def hero(p):
    facts = "".join(f"<li><strong>{e(a)}</strong><span>{e(b)}</span></li>" for a, b in p["facts"])
    steps = "".join(f"<li><strong>{e(a)}</strong><span>{e(b)}</span></li>" for a, b in p["steps"])
    return f"""<section class="pf-hero">
        <div class="pf-container">
            <div class="pf-hero-grid">
                <div>
                    <p class="pf-eyebrow">{e(p['eyebrow'])}</p>
                    <h1 class="pf-h1">{e(p['h1'][0])} <span>{e(p['h1'][1])}</span></h1>
                    <p class="pf-lead">{e(p['lead'])}</p>
                    <div class="pf-ctas">
                        {ctas_html(p)}
                    </div>
                    <ul class="pf-facts">{facts}</ul>
                </div>
                <aside class="pf-steps" aria-label="{e(p.get('steps_title', 'Comment nous travaillons'))}">
                    <p class="pf-eyebrow">{e(p.get('steps_title', 'Comment nous travaillons'))}</p>
                    <ol>{steps}</ol>
                </aside>
            </div>
        </div>
    </section>"""

def section(num, eyebrow, h2, intro, inner, alt=False, sid=""):
    i = f'<p class="pf-text">{e(intro)}</p>' if intro else ""
    return f"""<section class="pf-section{' alt' if alt else ''}"{f' id="{sid}"' if sid else ''}>
        <div class="pf-container">
            <div class="pf-head">
                <p class="pf-eyebrow">{num} · {e(eyebrow)}</p>
                <h2 class="pf-h2">{e(h2)}</h2>
                {i}
            </div>
            {inner}
        </div>
    </section>"""

def cards(items, cols=3):
    out = []
    for it in items:
        lst = "".join(f"<li>{e(x)}</li>" for x in it.get("list", []))
        lst = f'<ul class="pf-list">{lst}</ul>' if lst else ""
        tag = f'<span class="pf-tag">{e(it["tag"])}</span>' if it.get("tag") else ""
        more = f'<a href="{it["href"]}" class="pf-more">{e(it["more"])} →</a>' if it.get("href") else ""
        out.append(f'<div class="pf-card">{tag}<h3 class="pf-h3">{e(it["title"])}</h3><p class="pf-text">{e(it["text"])}</p>{lst}{more}</div>')
    return f'<div class="pf-grid-{cols}">' + "".join(out) + "</div>"

def before_after(rows):
    out = "".join(f'<div class="pf-ba-row"><div class="pf-ba-cell before"><span>Aujourd\'hui</span><p>{e(a)}</p></div><div class="pf-ba-arrow" aria-hidden="true">→</div><div class="pf-ba-cell after"><span>Avec Domtom Connect</span><p>{e(b)}</p></div></div>' for a, b in rows)
    return f'<div class="pf-ba">{out}</div>'

def pricing():
    return f"""<div class="pf-grid-3">
                <div class="pf-card"><h3 class="pf-h3">Échange offert</h3><div class="pf-price">0 €</div><ul class="pf-list"><li>30 minutes avec Loïc Villeronce</li><li>Votre situation et vos objectifs</li><li>Un avis franc sur ce que nous pouvons faire</li></ul><div class="pf-card-cta"><a {CAL} class="pf-btn-ghost">Réserver l'échange</a></div></div>
                <div class="pf-card accent"><span class="pf-tag">Pour bien démarrer</span><h3 class="pf-h3">Séance stratégique</h3><div class="pf-price">100 € <small>la séance</small></div><ul class="pf-list"><li>Une heure de travail sur votre entreprise</li><li>Vos priorités et vos prochaines actions</li><li>Un plan d'action écrit</li><li>Déduit du devis si vous continuez</li></ul><div class="pf-card-cta"><a href="/seance-strategique" class="pf-btn">Réserver ma séance</a></div></div>
                <div class="pf-card"><h3 class="pf-h3">Accompagnement</h3><div class="pf-price">Sur devis</div><ul class="pf-list"><li>Copilotage opérationnel</li><li>Développement commercial</li><li>Création de site web ou de boutique en ligne</li></ul><div class="pf-card-cta"><a href="/pilotage" class="pf-btn-ghost">Voir le copilotage</a></div></div>
            </div>"""

def faq(items):
    return '<div class="pf-faq">' + "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in items) + "</div>"

def final_cta(title, text):
    return f"""<section class="pf-section alt">
        <div class="pf-container">
            <div class="pf-cta-box">
                <p class="pf-eyebrow">Passer à l'action</p>
                <h2 class="pf-h2">{e(title)}</h2>
                <p class="pf-lead">{e(text)}</p>
                <div class="pf-ctas" style="margin-bottom:0;">
                    <a {CAL} class="pf-btn"><i class="fas fa-calendar-alt"></i><span>Réserver un échange de 30 minutes</span></a>
                    <a href="/seance-strategique" class="pf-btn-ghost"><span>Séance stratégique à 100 €</span></a>
                    <a href="{WA}" class="pf-btn-ghost"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a>
                </div>
            </div>
        </div>
    </section>"""

def page(p, main, active=""):
    ld = {"@context": "https://schema.org", "@graph": p["ld"]}
    return head(p, ld) + f"""
<body class="pf-page">
    {nav(active)}
    <main>
    {main}
    </main>
    {footer()}
    <script src="/assets/js/site-nav.js" defer></script>
</body>
</html>
"""

def write(path, content):
    full = os.path.join(ROOT, path)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

# ---------------------------------------------------------------- pages secteur
def build_secteurs():
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from contenu_secteurs import SECTEURS, GROUPES
    common_faq = [
        ("Combien coûte un accompagnement Domtom Connect ?", "Le premier échange de 30 minutes est offert. La séance stratégique d'une heure coûte 100 €, avec un plan d'action écrit, et ce montant est déduit si vous poursuivez. L'accompagnement est ensuite proposé sur devis."),
        ("Travaillez-vous à distance ?", "Oui. Les échanges se font en visio, au téléphone et sur WhatsApp, que vous soyez en Guadeloupe, en Martinique, en Guyane, à La Réunion, en Afrique ou dans l'Hexagone."),
    ]
    for s in SECTEURS:
        path = "/" + s["file"][:-5]
        faq_items = s["faq"] + common_faq
        others = [x for x in SECTEURS if x["file"] != s["file"]]
        p = {
            "path": path, "title": s["title"], "description": s["description"],
            "eyebrow": s["eyebrow"], "h1": s["h1"], "lead": s["lead"],
            "facts": [("30 min", "premier échange offert"), ("100 €", "séance stratégique, déduite du devis"), ("Sur devis", "accompagnement sur mesure")],
            "steps": [("Un échange de 30 minutes", "Offert. Vous présentez votre activité, nous vous disons franchement si nous pouvons vous aider."),
                      ("Une séance stratégique", "Une heure sur votre entreprise, avec un plan d'action écrit. 100 €, déduits si vous continuez."),
                      ("Un accompagnement sur mesure", s["accompagnement"])],
            "ld": [
                {"@type": "WebPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": s["title"], "description": s["description"], "inLanguage": "fr-FR"},
                {"@type": "Service", "@id": SITE + path + "#service", "name": s["service_name"], "serviceType": s["service_types"],
                 "audience": {"@type": "BusinessAudience", "name": s["audience"]},
                 "provider": {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE},
                 "areaServed": ["Guadeloupe", "Martinique", "Guyane", "Saint-Martin", "La Réunion", "Mayotte", "Afrique de l'Ouest", "Afrique centrale", "France hexagonale"],
                 "offers": [{"@type": "Offer", "name": "Échange de 30 minutes", "price": "0", "priceCurrency": "EUR"},
                            {"@type": "Offer", "name": "Séance stratégique", "price": "100", "priceCurrency": "EUR", "url": SITE + "/seance-strategique"}]},
                {"@type": "BreadcrumbList", "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"},
                    {"@type": "ListItem", "position": 2, "name": s["parent"][1], "item": SITE + s["parent"][0]},
                    {"@type": "ListItem", "position": 3, "name": s["label"], "item": SITE + path}]},
                {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]},
            ],
        }
        main = "\n".join([
            chips(GROUPES, path),
            crumbs([("/", "Accueil"), (s["parent"][0], s["parent"][1]), (None, s["label"])]),
            hero(p),
            section("01", s["pains_eyebrow"], s["pains_h2"], s["pains_intro"], cards(s["pains"], 3), sid="realite"),
            section("02", "Ce que nous faisons pour vous", s["services_h2"], s.get("services_intro", ""), cards(s["services"], 3), alt=True, sid="services"),
            section("03", "Ce qui change", s["ba_h2"], "", before_after(s["before_after"]), sid="resultats"),
            section("04", "Comment démarrer", "Une première marche claire, puis du sur mesure", "", pricing(), alt=True, sid="tarifs"),
            section("05", "Questions fréquentes", s["faq_h2"], "", faq(faq_items), sid="faq"),
            section("06", "Autres secteurs", "Nous accompagnons aussi", "", cards([{"title": o["label"], "text": o["teaser"], "href": "/" + o["file"][:-5], "more": "Voir la page"} for o in others[:6]], 3), alt=True),
            final_cta(s["cta_title"], s["cta_text"]),
        ])
        write(s["file"], page(p, main, "entreprises"))
        print("OK", s["file"])

# ---------------------------------------------------------------- pages d'offre (pilotage, tremplin, ...)
def build_offres():
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from contenu_offres import OFFRES
    for o in OFFRES:
        path = "/" + o["file"][:-5]
        faq_items = o["faq"]
        p = dict(o, path=path)
        p["ld"] = [
            {"@type": "WebPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": o["title"], "description": o["description"], "inLanguage": "fr-FR"},
            {"@type": "Service", "@id": SITE + path + "#service", "name": o["service_name"], "serviceType": o["service_types"],
             "provider": {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE},
             "areaServed": ["Guadeloupe", "Martinique", "Guyane", "Saint-Martin", "La Réunion", "Mayotte", "Afrique de l'Ouest", "Afrique centrale", "France hexagonale"],
             "offers": o.get("ld_offers", [{"@type": "Offer", "name": "Échange de 30 minutes", "price": "0", "priceCurrency": "EUR"}])},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": o["label"], "item": SITE + path}]},
            {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]},
        ]
        blocks = [crumbs([("/", "Accueil"), (None, o["label"])]), hero(p)]
        for i, sec in enumerate(o["sections"], 1):
            num = f"{i:02d}"
            t = sec["type"]
            if t == "cards":
                inner = cards(sec["items"], sec.get("cols", 3))
            elif t == "ba":
                inner = before_after(sec["items"])
            elif t == "pricing":
                inner = pricing()
            elif t == "faq":
                inner = faq(faq_items)
            else:
                continue
            blocks.append(section(num, sec["eyebrow"], sec["h2"], sec.get("intro", ""), inner, alt=(i % 2 == 0), sid=sec.get("id", "")))
        blocks.append(final_cta(o["cta_title"], o["cta_text"]))
        write(o["file"], page(p, "\n".join(blocks), o.get("active", "")))
        print("OK", o["file"])

if __name__ == "__main__":
    build_secteurs()
    build_offres()
