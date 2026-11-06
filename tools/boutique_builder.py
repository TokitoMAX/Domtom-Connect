"""
Génère la boutique : /boutique (catalogue) et /boutique/<produit> (une page par produit).
Appelé par tools/site_builder.py, ou seul : python tools/boutique_builder.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_builder import SITE, e, crumbs, section, cards, faq, page, write, CAL
from contenu_boutique import PRODUITS, PARTIES, FAQ_COMMUNE

ORG = {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE}
AUTEUR = {"@type": "Person", "name": "Loïc Villeronce", "url": SITE + "/a-propos"}
SECURITE = '<ul class="pf-trust"><li><i class="fas fa-lock"></i>Paiement sécurisé par Stripe</li><li><i class="fas fa-bolt"></i>Accès immédiat</li><li><i class="fas fa-mobile-alt"></i>Téléphone, tablette, ordinateur</li></ul>'


def offre_ld(p):
    return {"@type": "Offer", "price": f"{p['prix']}.00", "priceCurrency": "EUR", "availability": "https://schema.org/InStock",
            "url": f"{SITE}/boutique/{p['slug']}", "seller": ORG}


def produit_ld(p):
    ld = {"@type": ["Product", "Book"] if p["type"] == "Book" else "Product", "@id": f"{SITE}/boutique/{p['slug']}#produit",
          "name": p["nom"], "description": p["description"], "image": SITE + p["image"], "brand": {"@type": "Brand", "name": "Domtom Connect"},
          "sku": p["slug"], "offers": offre_ld(p)}
    if p["type"] == "Book":
        ld.update({"author": AUTEUR, "bookFormat": "https://schema.org/EBook", "numberOfPages": 41, "inLanguage": "fr", "publisher": ORG})
    return ld


def bouton(p, label=None, ghost=False):
    return f'<a href="{p["stripe"]}" class="{"pf-btn-ghost" if ghost else "pf-btn"}" rel="nofollow"><i class="fas fa-shopping-bag"></i><span>{e(label or "Acheter pour %s €" % p["prix"])}</span></a>'


def fiche(p):
    pts = "".join(f"<li>{e(x)}</li>" for x in p["points"])
    return f"""<section class="pf-hero pf-product">
        <div class="pf-container">
            <div class="pf-product-grid">
                <div class="pf-product-media"><img src="{p['image']}" alt="{e(p['image_alt'])}" width="896" height="1200" loading="eager"/></div>
                <div>
                    <p class="pf-eyebrow">{e(p['eyebrow'])}</p>
                    <h1 class="pf-h1 pf-product-title">{e(p['nom'])}</h1>
                    <p class="pf-lead">{e(p['accroche'])}</p>
                    <div class="pf-buybox">
                        <div class="pf-price">{p['prix']} € <small>paiement unique</small></div>
                        <div class="pf-ctas" style="margin-bottom:14px;">{bouton(p)}</div>
                        {SECURITE}
                    </div>
                    <ul class="pf-list pf-product-points">{pts}</ul>
                    <p class="pf-text"><a href="/chapitre1-lecture" class="pf-more">Lire le chapitre 1 gratuitement →</a></p>
                </div>
            </div>
        </div>
    </section>"""


def sommaire():
    out = []
    for titre, plage, chs in PARTIES:
        li = "".join(f"<li>{e(c)}</li>" for c in chs)
        out.append(f'<div class="pf-card"><span class="pf-tag">{e(plage)}</span><h3 class="pf-h3">{e(titre)}</h3><ol class="pf-toc">{li}</ol></div>')
    return '<div class="pf-grid-2">' + "".join(out) + "</div>"


def comparatif(courant=None):
    lignes = [("Les 28 chapitres de la méthode", ["oui", "oui", "oui"]), ("Livre PDF et EPUB à télécharger", ["oui", "", ""]),
              ("Exercices sur ton projet, étape par étape", ["", "oui", "oui"]), ("Carnet de bord sauvegardé", ["", "oui", "oui"]),
              ("Simulateur de rentabilité et de prix", ["", "oui", "oui"]), ("Plan d'action 30 jours en PDF", ["", "oui", "oui"]),
              ("Accès prioritaire à DTC Pulse et badge fondateur", ["", "", "oui"]), ("Visibilité dans l'incubateur Domtom Connect", ["", "", "oui"])]
    head = "".join(f'<th scope="col"{" class=cur" if p["slug"] == courant else ""}><a href="/boutique/{p["slug"]}">{e(p["court"])}</a><span>{p["prix"]} €</span></th>' for p in PRODUITS)
    rows = "".join("<tr><th scope=\"row\">" + e(l) + "</th>" + "".join(f'<td>{"<i class=\"fas fa-check\" aria-label=\"inclus\"></i>" if v else "<span aria-label=\"non inclus\">·</span>"}</td>' for v in vals) + "</tr>" for l, vals in lignes)
    buy = "".join(f'<td>{bouton(p, "%s €" % p["prix"], ghost=p["slug"] != "guide-interactif")}</td>' for p in PRODUITS)
    return f'<div class="pf-table-wrap"><table class="pf-compare"><thead><tr><th></th>{head}</tr></thead><tbody>{rows}<tr class="buy"><th></th>{buy}</tr></tbody></table></div>'


def suite_humaine():
    return cards([
        {"title": "Diagnostic gratuit", "text": "Dix minutes pour faire le point sur ton projet et savoir par où commencer.", "href": "/anamnese", "more": "Faire le diagnostic"},
        {"title": "Séance stratégique", "text": "Une heure avec Loïc Villeronce sur ton projet, et un plan d'action écrit. 100 €.", "href": "/seance-strategique", "more": "Réserver la séance"},
        {"title": "Programme Tremplin", "text": "Un accompagnement pour lancer ton activité, avec un vrai suivi.", "href": "/tremplin", "more": "Découvrir Tremplin"},
    ], 3)


def build_produits():
    os.makedirs(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "boutique"), exist_ok=True)
    for p in PRODUITS:
        path = f"/boutique/{p['slug']}"
        faq_items = p["faq"] + FAQ_COMMUNE
        pg = {"path": path, "title": p["title"], "description": p["description"],
              "ld": [produit_ld(p),
                     {"@type": "BreadcrumbList", "itemListElement": [
                         {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"},
                         {"@type": "ListItem", "position": 2, "name": "Boutique", "item": SITE + "/boutique"},
                         {"@type": "ListItem", "position": 3, "name": p["nom"], "item": SITE + path}]},
                     {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]}]}
        blocs = [crumbs([("/", "Accueil"), ("/boutique", "Boutique"), (None, p["nom"])]), fiche(p),
                 section("01", "En deux mots", "Ce que tu vas en retirer", p["pitch"], cards(p["pour_qui"], 3), alt=True, sid="pour-qui"),
                 section("02", "Le sommaire", "28 chapitres en 4 parties", "Le contenu réel du Tome 1, du premier blocage à ta feuille de route des 30 premiers jours.", sommaire(), sid="sommaire"),
                 section("03", "Comparer", "Choisis le format qui te correspond", "", comparatif(p["slug"]), alt=True, sid="comparer"),
                 section("04", "Questions fréquentes", "Tout ce que tu dois savoir avant d'acheter", "", faq(faq_items), sid="faq"),
                 section("05", "Aller plus loin", "Besoin d'un regard humain sur ton projet ?", "Le livre et le guide te donnent la méthode. Si tu veux qu'on regarde ton projet ensemble, il y a aussi ces options.", suite_humaine(), alt=True)]
        write(f"boutique/{p['slug']}.html", page(pg, "\n".join(blocs), "boutique"))
        print("OK", path)


def build_catalogue():
    path = "/boutique"
    title = "Boutique, livre et guide pour créer son entreprise en Outre-mer et en Afrique | Domtom Connect"
    desc = "Le livre Les Fondamentaux de l'Entrepreneur (5 €), le guide interactif avec simulateur et plan 30 jours (27 €) et le pack fondateur (47 €). Paiement sécurisé, accès immédiat."
    items = []
    for p in PRODUITS:
        pts = "".join(f"<li>{e(x)}</li>" for x in p["points"][:4])
        items.append(f"""<article class="pf-card pf-shop-card{' accent' if p['slug'] == 'guide-interactif' else ''}">
                <a href="/boutique/{p['slug']}" class="pf-shop-img"><img src="{p['image']}" alt="{e(p['image_alt'])}" loading="lazy"/></a>
                <p class="pf-eyebrow" style="margin:0 0 6px;">{e(p['eyebrow'])}</p>
                <h3 class="pf-h3"><a href="/boutique/{p['slug']}">{e(p['nom'])}</a></h3>
                <p class="pf-text">{e(p['accroche'])}</p>
                <div class="pf-price">{p['prix']} €</div>
                <ul class="pf-list">{pts}</ul>
                <div class="pf-card-cta">{bouton(p, ghost=p['slug'] != 'guide-interactif')}<a href="/boutique/{p['slug']}" class="pf-more">Voir le détail →</a></div>
            </article>""")
    grille = '<div class="pf-grid-3">' + "".join(items) + "</div>"
    choix = cards([
        {"title": "Tu veux d'abord comprendre et te remettre en question", "text": "Commence par le livre. Il est court, direct, et ne coûte que 5 €.", "href": "/boutique/les-fondamentaux-de-l-entrepreneur", "more": "Le livre"},
        {"title": "Tu veux avancer concrètement sur ton projet", "text": "Prends le guide interactif. Tu fais les exercices, tu calcules tes prix, tu repars avec ton plan 30 jours.", "href": "/boutique/guide-interactif", "more": "Le guide interactif"},
        {"title": "Tu veux la méthode et le réseau", "text": "Le pack fondateur ajoute l'accès prioritaire à DTC Pulse et la visibilité dans l'incubateur.", "href": "/boutique/pack-fondateur", "more": "Le pack fondateur"},
    ], 3)
    ld = [{"@type": "CollectionPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": title, "description": desc, "inLanguage": "fr-FR",
           "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{SITE}/boutique/{p['slug']}", "name": p["nom"]} for i, p in enumerate(PRODUITS)]}},
          {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"}, {"@type": "ListItem", "position": 2, "name": "Boutique", "item": SITE + path}]},
          {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ_COMMUNE]}] + [produit_ld(p) for p in PRODUITS]
    hero = f"""<section class="pf-hero">
        <div class="pf-container">
            <p class="pf-eyebrow">La boutique Domtom Connect</p>
            <h1 class="pf-h1">Les outils pour lancer ton activité, <span>à partir de 5 €.</span></h1>
            <p class="pf-lead">Un livre et un atelier en ligne écrits par Loïc Villeronce pour les entrepreneurs de la Caraïbe, d'Afrique et de la diaspora. Une méthode concrète pour passer de l'idée à tes premiers clients, sans capital de départ.</p>
            <div class="pf-ctas"><a href="#produits" class="pf-btn"><span>Voir les produits</span></a><a href="/chapitre1-lecture" class="pf-btn-ghost"><span>Lire le chapitre 1 gratuitement</span></a></div>
            {SECURITE}
        </div>
    </section>"""
    main = "\n".join([crumbs([("/", "Accueil"), (None, "Boutique")]), hero,
                      section("01", "Les produits", "Choisis ton format", "", grille, alt=True, sid="produits"),
                      section("02", "Par où commencer", "Quel produit pour toi ?", "", choix, sid="choisir"),
                      section("03", "Comparer", "Ce que contient chaque format", "", comparatif(), alt=True, sid="comparer"),
                      section("04", "Le sommaire", "28 chapitres en 4 parties", "Le contenu réel du Tome 1. Le chapitre 1 est en lecture libre.", sommaire(), sid="sommaire"),
                      section("05", "Questions fréquentes", "Avant d'acheter", "", faq(FAQ_COMMUNE), alt=True, sid="faq"),
                      section("06", "Aller plus loin", "Besoin d'un regard humain sur ton projet ?", "", suite_humaine())])
    write("boutique.html", page({"path": path, "title": title, "description": desc, "ld": ld}, main, "boutique"))
    print("OK", path)


def build_boutique():
    build_produits()
    build_catalogue()


if __name__ == "__main__":
    build_boutique()
