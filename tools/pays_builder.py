"""
Pages pays (Caraïbe francophone, anglophone, hispanophone), sous-pages « création de site » locales,
et page de regroupement /territoires. Appelé en dernier par tools/site_builder.py.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_builder import SITE, CAL, WA, e, crumbs, chips, hero, section, cards, faq, before_after, pricing, final_cta, page, write, prose, lead_audit
from contenu_pays import PAYS, REGIONS, SITES_LOCAUX
from contenu_territoires import TERRITOIRES

T = {
 "fr": {"home": "Accueil", "terr": "Territoires", "eyebrow": "Conseil, copilotage et sites qui convertissent · {nom}",
        "h1a": "Développer votre entreprise", "steps_title": "Comment nous travaillons",
        "ctas": [("CAL", "Réserver un échange de 30 minutes", True), ("/seance-strategique", "Séance stratégique à 100 €", False)],
        "steps": [("Un échange de 30 minutes", "Offert. Vous présentez votre activité, nous vous disons franchement si nous pouvons vous aider."),
                  ("Une séance stratégique", "Une heure et un plan d'action écrit. 100 €, déduits si vous continuez."),
                  ("Un accompagnement sur mesure", "Site qui convertit, copilotage ou développement commercial, sur devis.")],
        "s_ctx": ("Le contexte local", "Entreprendre {en}, ce qui change vraiment"), "s_def": ("Les défis", "Ce que vivent les entreprises {de}"),
        "s_srv": ("Ce que nous faisons", "Trois façons de vous aider"), "s_off": ("Comment démarrer", "Une première marche claire, puis du sur mesure"),
        "s_faq": ("Questions fréquentes", "Les questions des entrepreneurs {de}"), "s_oth": ("Autres territoires", "Nous accompagnons aussi"),
        "more": "Voir la page", "lead": "Domtom Connect accompagne les dirigeants et porteurs de projet {en} : copilotage, développement commercial et sites internet pensés pour convertir. Tout se fait à distance, en visio, au téléphone et sur WhatsApp.",
        "srv": [("Site qui convertit", "Être trouvé et choisi", "Un site rapide, visible sur Google et dans les IA, qui mène vers la réservation, l'achat ou le rendez-vous.", "/creation-site-web"),
                ("Copilotage", "Un bras droit pour décider", "Priorités, trésorerie, organisation. Vous arrêtez de tout porter seul.", "/pilotage"),
                ("Réseau et diaspora", "Vendre plus loin", "Le réseau Domtom Connect et l'application DTC Pulse relient la Caraïbe, l'Afrique et la diaspora.", "/diaspora")],
        "common": [("Combien coûte un accompagnement ?", "Le premier échange de 30 minutes est offert. La séance stratégique d'une heure coûte 100 €, déduits si vous poursuivez. L'accompagnement et les sites sont proposés sur devis."),
                   ("Faut-il se déplacer ?", "Non. Tout se fait à distance, en visio, au téléphone et sur WhatsApp.")],
        "cta": ("Parlons de votre entreprise {en}", "Trente minutes offertes avec Loïc Villeronce pour regarder votre situation et voir franchement si nous pouvons vous aider.")},
 "en": {"home": "Home", "terr": "Territories", "eyebrow": "Business support and websites that convert · {nom}",
        "h1a": "Grow your business", "steps_title": "How we work",
        "ctas": [("CAL", "Book a free 30 minute call", True), (WA, "Message us on WhatsApp", False)],
        "steps": [("A free 30 minute call", "You tell us about your business, we tell you honestly whether we can help."),
                  ("A strategy session", "One hour and a written action plan, 100 euros, deducted from the quote if you continue."),
                  ("Tailored support", "A website that converts, operational support or sales development, quoted clearly.")],
        "s_ctx": ("Local context", "Doing business {en}"), "s_def": ("The challenges", "What businesses face {en}"),
        "s_srv": ("What we do", "Three ways we help"), "s_off": ("How to start", "A clear first step, then tailored support"),
        "s_faq": ("FAQ", "Questions business owners ask us"), "s_oth": ("Other territories", "We also work with"),
        "more": "See the page", "lead": "Domtom Connect helps business owners {en} with websites that convert, operational support and access to a network linking the Caribbean, Africa and the diaspora. Everything happens remotely, by video call, phone and WhatsApp, in English or French.",
        "srv": [("Website that converts", "Be found and chosen", "A fast website, visible on Google and in AI assistants, that leads visitors to book, buy or get in touch.", "/en"),
                ("Operations", "A right hand for the owner", "Priorities, cash flow and organisation, so the business stops depending on you for everything.", "/en"),
                ("Network and diaspora", "Sell further", "Our network and the DTC Pulse app connect the Caribbean, Africa and the diaspora.", "/en")],
        "common": [("How much does it cost?", "The first 30 minute call is free. A one hour strategy session costs 100 euros, deducted from the quote if you continue. Websites and ongoing support are quoted after the call."),
                   ("Do you speak English?", "Yes. Calls can be in English or French, and everything is confirmed in writing by email or WhatsApp.")],
        "cta": ("Let's talk about your business", "Thirty free minutes with Loïc Villeronce, founder of Domtom Connect, to look at your situation and see honestly how we can help.")},
 "es": {"home": "Inicio", "terr": "Territorios", "eyebrow": "Acompañamiento y sitios web que convierten · {nom}",
        "h1a": "Haga crecer su negocio", "steps_title": "Cómo trabajamos",
        "ctas": [("CAL", "Reservar una llamada gratuita de 30 minutos", True), (WA, "Escribir por WhatsApp", False)],
        "steps": [("Una llamada gratuita de 30 minutos", "Nos presenta su negocio y le decimos con franqueza si podemos ayudarle."),
                  ("Una sesión estratégica", "Una hora y un plan de acción por escrito, 100 euros, descontados del presupuesto si continúa."),
                  ("Acompañamiento a medida", "Sitio web que convierte, apoyo operativo o desarrollo comercial, con presupuesto claro.")],
        "s_ctx": ("Contexto local", "Emprender {en}"), "s_def": ("Los retos", "Lo que viven los negocios {de}"),
        "s_srv": ("Lo que hacemos", "Tres formas de ayudarle"), "s_off": ("Cómo empezar", "Un primer paso claro y luego acompañamiento a medida"),
        "s_faq": ("Preguntas frecuentes", "Lo que nos preguntan los empresarios"), "s_oth": ("Otros territorios", "También trabajamos con"),
        "more": "Ver la página", "lead": "Domtom Connect acompaña a los empresarios {en} con sitios web que convierten, apoyo operativo y una red que conecta el Caribe, África y la diáspora. Todo se hace a distancia, por videollamada, teléfono y WhatsApp.",
        "srv": [("Sitio que convierte", "Ser encontrado y elegido", "Un sitio rápido, visible en Google y en los asistentes de IA, que lleva al visitante a reservar, comprar o contactarle.", None),
                ("Apoyo operativo", "Una mano derecha para el dueño", "Prioridades, tesorería y organización, para que el negocio no dependa solo de usted.", None),
                ("Red y diáspora", "Vender más lejos", "Nuestra red y la aplicación DTC Pulse conectan el Caribe, África y la diáspora.", None)],
        "common": [("¿Cuánto cuesta?", "La primera llamada de 30 minutos es gratuita. La sesión estratégica de una hora cuesta 100 euros, descontados del presupuesto si continúa. Los sitios web y el acompañamiento se presupuestan después de la llamada."),
                   ("¿En qué idioma trabajan?", "Las llamadas son en francés o inglés, y todo se confirma por escrito, por correo o WhatsApp, también en español.")],
        "cta": ("Hablemos de su negocio", "Treinta minutos gratuitos con Loïc Villeronce, fundador de Domtom Connect, para ver su situación y cómo podemos ayudarle.")},
}

def offres_intl(lang):
    t = {"en": [("Free", "30 minute call", "Your situation, your goals and an honest opinion."), ("100 €", "Strategy session", "One hour and a written action plan, deducted from the quote."), ("Quote", "Tailored support", "Website, operations or both, quoted before anything starts.")],
         "es": [("Gratis", "Llamada de 30 minutos", "Su situación, sus objetivos y una opinión franca."), ("100 €", "Sesión estratégica", "Una hora y un plan de acción escrito, descontado del presupuesto."), ("Presupuesto", "Acompañamiento a medida", "Sitio web, apoyo operativo o ambos, presupuestados antes de empezar.")]}[lang]
    return '<div class="pf-grid-3">' + "".join(f'<div class="pf-card"><h3 class="pf-h3">{e(b)}</h3><div class="pf-price">{e(a)}</div><p class="pf-text">{e(c)}</p></div>' for a, b, c in t) + "</div>"

def cta_intl(lang, titre, texte):
    lab = {"en": ("Book a free call", "WhatsApp"), "es": ("Reservar una llamada", "WhatsApp")}[lang]
    return f"""<section class="pf-section alt"><div class="pf-container"><div class="pf-cta-box">
            <h2 class="pf-h2">{e(titre)}</h2><p class="pf-lead">{e(texte)}</p>
            <div class="pf-ctas" style="margin-bottom:0;"><a {CAL} class="pf-btn"><i class="fas fa-calendar-alt"></i><span>{lab[0]}</span></a><a href="{WA}" class="pf-btn-ghost"><i class="fab fa-whatsapp"></i><span>{lab[1]}</span></a></div>
        </div></div></section>"""

def toutes_terr():
    base = [("/territoires/" + t["slug"], t["nom"]) for t in TERRITOIRES]
    return base + [("/territoires/" + p["slug"], p["nom"]) for p in PAYS]

def build_pays():
    for p in PAYS:
        L = T[p["lang"]]; path = "/territoires/" + p["slug"]
        groupes = [(REGIONS[p["region"]], [("/territoires", "Tous")] + [("/territoires/" + x["slug"], x["nom"]) for x in PAYS if x["region"] == p["region"]] + ([("/diaspora", "Diaspora")] if p["region"] == "diaspora" else []))]
        faq_items = p["faq"] + L["common"]
        pg = {"path": path, "lang": p["lang"],
              "title": {"fr": f"Accompagnement et création de site internet {p['en']} | Domtom Connect", "en": f"Business support and websites {p['en']} | Domtom Connect", "es": f"Acompañamiento y sitios web {p['en']} | Domtom Connect"}[p["lang"]],
              "description": L["lead"].format(en=p["en"])[:158].rsplit(" ", 1)[0] + "…",
              "eyebrow": L["eyebrow"].format(nom=p["nom"]), "h1": (L["h1a"], p["en"] + "."), "lead": L["lead"].format(en=p["en"]),
              "facts": p["faits"], "steps": L["steps"], "steps_title": L["steps_title"], "ctas": L["ctas"]}
        pg["ld"] = [{"@type": "WebPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": pg["title"], "description": pg["description"], "inLanguage": p["lang"]},
                    {"@type": "Service", "@id": SITE + path + "#service", "name": pg["title"].split(" | ")[0], "serviceType": ["Business consulting", "Website creation", "Operational support"],
                     "provider": {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE},
                     "areaServed": {"@type": "Place", "name": p["nom"]}, "availableLanguage": ["French", "English"],
                     "offers": [{"@type": "Offer", "price": "0", "priceCurrency": "EUR", "name": "30 min"}, {"@type": "Offer", "price": "100", "priceCurrency": "EUR", "url": SITE + "/seance-strategique"}]},
                    {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": L["home"], "item": SITE + "/"}, {"@type": "ListItem", "position": 2, "name": L["terr"], "item": SITE + "/territoires"}, {"@type": "ListItem", "position": 3, "name": p["nom"], "item": SITE + path}]},
                    {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]}]
        srv = cards([dict({"tag": a, "title": b, "text": c}, **({"href": h, "more": L["more"]} if h else {})) for a, b, c, h in L["srv"]], 3)
        voisins = [x for x in PAYS if x["region"] == p["region"] and x["slug"] != p["slug"]]
        oth = cards([{"title": x["nom"], "text": REGIONS[x["region"]], "href": "/territoires/" + x["slug"], "more": L["more"]} for x in voisins] + [{"title": L["terr"], "text": "Caraïbe, océan Indien, Afrique, diaspora", "href": "/territoires", "more": L["more"]}], 3)
        blocs = [chips(groupes, path), crumbs([("/", L["home"]), ("/territoires", L["terr"]), (None, p["nom"])]), hero(pg),
                 section("01", L["s_ctx"][0], L["s_ctx"][1].format(en=p["en"]), "", prose(p["contexte"]), sid="contexte"),
                 section("02", L["s_def"][0], L["s_def"][1].format(en=p["en"], de=p["de"]), "", cards([{"title": a, "text": b} for a, b in p["defis"]], 3), alt=True, sid="defis"),
                 section("03", L["s_srv"][0], L["s_srv"][1], "", srv, sid="services")]
        if p["lang"] == "fr":
            blocs += [lead_audit("pays-" + p["slug"]), section("04", L["s_off"][0], L["s_off"][1], "", pricing(), alt=True, sid="tarifs")]
        else:
            blocs += [section("04", L["s_off"][0], L["s_off"][1], "", offres_intl(p["lang"]), alt=True, sid="tarifs")]
        blocs += [section("05", L["s_faq"][0], L["s_faq"][1].format(de=p["de"]), "", faq(faq_items), sid="faq"),
                  section("06", L["s_oth"][0], L["s_oth"][1], "", oth, alt=True)]
        titre, texte = L["cta"]
        blocs.append(final_cta(titre.format(en=p["en"]), texte) if p["lang"] == "fr" else cta_intl(p["lang"], titre, texte))
        os.makedirs(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "territoires", p["slug"]), exist_ok=True)
        write(f"territoires/{p['slug']}/index.html", page(pg, "\n".join(blocs), ""))
        print("OK", path)

def build_sites_locaux():
    from contenu_site_web import OFFRE_SITE as O
    secs = {s.get("id"): s for s in O["sections"]}
    for s in SITES_LOCAUX:
        path = f"/territoires/{s['slug']}/creation-site-web"
        title = f"Création de site internet {s['en']}, un site qui convertit | Domtom Connect"
        desc = f"Création de site internet {s['en']} pensé pour convertir : réservation, paiement, WhatsApp, référencement local et visibilité dans les IA. Échange offert de 30 minutes."
        pg = {"path": path, "title": title, "description": desc, "eyebrow": f"Création de site internet · {s['nom']}",
              "h1": (f"Création de site internet {s['en']},", "un site qui convertit."), "lead": O["lead"], "facts": O["facts"], "steps": O["steps"]}
        faq_items = O["faq"][:5]
        pg["ld"] = [{"@type": "WebPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": title, "description": desc, "inLanguage": "fr-FR"},
                    {"@type": "Service", "@id": SITE + path + "#service", "name": f"Création de site internet {s['en']}", "serviceType": O["service_types"],
                     "provider": {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE}, "areaServed": {"@type": "AdministrativeArea", "name": s["nom"]}},
                    {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"}, {"@type": "ListItem", "position": 2, "name": "Territoires", "item": SITE + "/territoires"},
                                                                    {"@type": "ListItem", "position": 3, "name": s["nom"], "item": f"{SITE}/territoires/{s['slug']}"}, {"@type": "ListItem", "position": 4, "name": "Création de site internet", "item": SITE + path}]},
                    {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]}]
        autres = [x for x in SITES_LOCAUX if x["slug"] != s["slug"]]
        blocs = [crumbs([("/", "Accueil"), ("/territoires", "Territoires"), (f"/territoires/{s['slug']}", s["nom"]), (None, "Création de site internet")]), hero(pg),
                 section("01", "Le contexte local", f"Ce que vos clients font {s['en']} avant de vous choisir", "", prose(s["local"]), sid="contexte"),
                 section("02", secs["offres"]["eyebrow"], secs["offres"]["h2"], "", cards(secs["offres"]["items"], 3), alt=True, sid="offres"),
                 section("03", secs["moderne"]["eyebrow"], secs["moderne"]["h2"], "", cards(secs["moderne"]["items"], 3), sid="moderne"),
                 lead_audit("site-" + s["slug"], s["nom"]),
                 section("04", "Comment démarrer", "Un échange offert, puis un devis clair", "", pricing(), alt=True, sid="tarifs"),
                 section("05", "Questions fréquentes", f"Créer son site {s['en']}, les questions qu'on nous pose", "", faq(faq_items), sid="faq"),
                 section("06", "Ailleurs", "Création de site dans les autres territoires", "", cards([{"title": x["nom"], "text": f"Création de site internet {x['en']}.", "href": f"/territoires/{x['slug']}/creation-site-web", "more": "Voir la page"} for x in autres] + [{"title": "Toutes nos offres de site", "text": "La page complète sur nos sites qui convertissent.", "href": "/creation-site-web", "more": "Voir la page"}], 2), alt=True),
                 final_cta(f"Parlons de votre site {s['en']}", "Trente minutes offertes avec Loïc Villeronce pour regarder votre activité, votre site actuel s'il existe, et ce qui vous amènerait vraiment des clients.")]
        write(f"territoires/{s['slug']}/creation-site-web.html", page(pg, "\n".join(blocs), ""))
        print("OK", path)

def build_hub():
    path = "/territoires"
    title = "Accompagnement d'entreprise dans la Caraïbe, l'océan Indien, l'Afrique et la diaspora | Domtom Connect"
    desc = "Antilles, Guyane, Saint-Martin, Haïti, Caraïbe anglophone et hispanophone, océan Indien, Afrique et diaspora. Copilotage et sites qui convertissent, territoire par territoire."
    groupes = [("Antilles, Guyane et océan Indien", [(t["slug"], t["nom"], t["lead"].split(". ")[0] + ".") for t in TERRITOIRES])]
    for code, nom in REGIONS.items():
        groupes.append((nom, [(p["slug"], p["nom"], p["contexte"][0].split(". ")[0] + ".") for p in PAYS if p["region"] == code]))
    blocs = [crumbs([("/", "Accueil"), (None, "Territoires")]),
             hero({"eyebrow": "Territoires", "h1": ("Un accompagnement pensé", "pour chaque territoire."),
                   "lead": "Chaque territoire a ses contraintes, son marché, sa langue et son rythme. Choisissez le vôtre pour voir comment nous accompagnons les dirigeants et porteurs de projet sur place, entièrement à distance.",
                   "facts": [(str(len(TERRITOIRES) + len(PAYS)), "territoires couverts"), ("3 langues", "français, anglais, espagnol"), ("100 % à distance", "visio, téléphone, WhatsApp")],
                   "steps": [("Un échange de 30 minutes", "Offert, pour faire le point."), ("Une séance stratégique", "Une heure et un plan d'action écrit, 100 €."), ("Un accompagnement sur mesure", "Sur devis, selon vos priorités.")]})]
    for i, (nom, items) in enumerate(groupes, 1):
        blocs.append(section(f"{i:02d}", "Région", nom, "", cards([{"title": n, "text": t, "href": "/territoires/" + s, "more": "Voir la page"} for s, n, t in items], 3), alt=(i % 2 == 0)))
    blocs.append(section(f"{len(groupes) + 1:02d}", "Région", "Diaspora", "", cards([{"title": "Diaspora", "text": "Hexagone, Canada, États-Unis, Royaume-Uni. Entreprendre avec la Caraïbe et l'Afrique depuis l'étranger.", "href": "/diaspora", "more": "Voir la page"}, {"title": "English speaking Caribbean", "text": "Our page in English for Caribbean businesses.", "href": "/en", "more": "See the page"}], 2)))
    blocs.append(final_cta("Parlons de votre entreprise", "Trente minutes offertes avec Loïc Villeronce, où que vous soyez."))
    ld = [{"@type": "CollectionPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": title, "description": desc, "inLanguage": "fr-FR"},
          {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"}, {"@type": "ListItem", "position": 2, "name": "Territoires", "item": SITE + path}]}]
    write("territoires/index.html", page({"path": path, "title": title, "description": desc, "ld": ld}, "\n".join(blocs), ""))
    print("OK", path)

def relier_locaux():
    # lien local : la carte « Présence en ligne » des pages territoires pointe vers la sous-page du territoire
    racine = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for s in SITES_LOCAUX:
        f = os.path.join(racine, "territoires", s["slug"], "index.html")
        t = open(f, encoding="utf-8").read()
        t = t.replace('href="/creation-site-web" class="pf-more"', f'href="/territoires/{s["slug"]}/creation-site-web" class="pf-more"')
        open(f, "w", encoding="utf-8").write(t)

def build_tout():
    build_pays(); build_sites_locaux(); relier_locaux(); build_hub()

if __name__ == "__main__":
    build_tout()
