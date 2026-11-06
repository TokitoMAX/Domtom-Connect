"""
Guides in English and Spanish, Spanish booking calculator, hub sections and links from EN/ES territory pages.
Called last by tools/site_builder.py.
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_builder import SITE, CAL, WA, e, crumbs, hero, section, cards, faq, page, write, prose
from pays_builder import cta_intl, offres_intl
from guides_builder import article_ld, etapes_html, champ, ORG, ROOT, DATE
from contenu_guides_intl import GUIDES_INTL, CREATION_INTL

T = {
 "en": {"home": "Home", "guides": "Guides", "faq": ("FAQ", "Your questions"), "also": ("Read also", "More practical guides"), "more": "Read the guide",
        "ctas": [("CAL", "Book a free 30 minute call", True), (WA, "Message us on WhatsApp", False)], "inguide": "In this guide",
        "tool": ("Free tool", "Use the free tool"), "cta": ("From reading to action", "Thirty free minutes with Loïc Villeronce to apply this method to your business."),
        "start": {"h1": ("Start a business in {pays},", "the practical steps."), "eyebrow": "Practical guide · Starting a business · {pays}",
                  "title": "How to start a business in {pays}, practical steps | Domtom Connect",
                  "desc": "Starting a business in {pays}: market, legal structure, registration, payments, bookkeeping and first customers. A practical guide by Domtom Connect.",
                  "steps": [("Clarify your project and market", "Who your customers are, what they will pay, how they pay, who your competitors are. This is the step most often rushed."),
                            ("Choose your legal structure", "Sole proprietorship, business name or limited company, depending on your project, partners and liability. Get advice from a local accountant or attorney."),
                            ("Register your business", "With {body}. Check the current requirements and fees directly with the official body."),
                            ("Set up payments", "A business bank account, plus the payment methods your customers already use. Keep business and personal money separate from day one."),
                            ("Keep simple books", "Invoicing, tracking income and expenses, and weekly cash flow."),
                            ("Find your first customers", "Test your offer with real customers before investing heavily, including the diaspora if your product fits.")],
                  "ctx": ("Local context", "Starting a business in {pays}, what to know"), "meth": ("The method", "Six steps to start your business"),
                  "res": ("Go further", "Resources and support"), "faq": [("Which structure should I choose?", "It depends on your activity, expected revenue, partners and liability. A local accountant or attorney will help you decide."),
                                                                             ("Can you support me in launching?", "Yes. A one hour strategy session sets out a concrete plan, and our support can continue on a quoted basis."),
                                                                             ("Do you work in English?", "Yes. Calls can be in English or French, and everything is confirmed in writing.")]}},
 "es": {"home": "Inicio", "guides": "Guías", "faq": ("Preguntas frecuentes", "Sus preguntas"), "also": ("Lea también", "Más guías prácticas"), "more": "Leer la guía",
        "ctas": [("CAL", "Reservar una llamada gratuita de 30 minutos", True), (WA, "Escribir por WhatsApp", False)], "inguide": "En esta guía",
        "tool": ("Herramienta gratuita", "Usar la herramienta gratuita"), "cta": ("De la lectura a la acción", "Treinta minutos gratuitos con Loïc Villeronce para aplicar este método a su negocio."),
        "start": {"h1": ("Crear una empresa en {pays},", "los pasos concretos."), "eyebrow": "Guía práctica · Crear una empresa · {pays}",
                  "title": "Cómo crear una empresa en {pays}, los pasos concretos | Domtom Connect",
                  "desc": "Crear una empresa en {pays}: mercado, forma jurídica, registros, pagos, gestión y primeros clientes. Guía práctica de Domtom Connect.",
                  "steps": [("Aclarar el proyecto y el mercado", "Quiénes son sus clientes, cuánto pagarán, cómo pagan, quiénes son sus competidores. Es el paso que más se descuida."),
                            ("Elegir la forma jurídica", "Persona física, empresa individual o sociedad, según su proyecto, sus socios y su responsabilidad. Pida consejo a un contador o abogado local."),
                            ("Registrar la empresa", "Ante {body}. Verifique directamente con cada organismo los requisitos y costos vigentes."),
                            ("Organizar los cobros", "Una cuenta bancaria de empresa y los medios de pago que ya usan sus clientes. Separe desde el inicio el dinero del negocio y el personal."),
                            ("Llevar una gestión sencilla", "Facturación, control de ingresos y gastos, tesorería semana a semana."),
                            ("Encontrar los primeros clientes", "Pruebe su oferta con clientes reales antes de invertir mucho, también con la diáspora si su producto lo permite.")],
                  "ctx": ("Contexto local", "Emprender en {pays}, lo que hay que saber"), "meth": ("El método", "Seis pasos para crear su empresa"),
                  "res": ("Ir más lejos", "Recursos y acompañamiento"), "faq": [("¿Qué forma jurídica elegir?", "Depende de su actividad, sus ingresos previstos, sus socios y su responsabilidad. Un contador o abogado local le ayudará a decidir."),
                                                                                   ("¿Pueden acompañarme en el lanzamiento?", "Sí. Una sesión estratégica de una hora permite definir un plan concreto, y el acompañamiento puede continuar con presupuesto."),
                                                                                   ("¿En qué idioma trabajan?", "Las llamadas son en francés o inglés, y todo se confirma por escrito, también en español.")]}},
}


def callout(lang, slug, texte):
    t = T[lang]["tool"]
    return f"""<section class="pf-section"><div class="pf-container"><div class="pf-cta-box" style="text-align:left;">
            <p class="pf-eyebrow">{e(t[0])}</p><p class="pf-lead">{e(texte)}</p>
            <div class="pf-ctas" style="margin-bottom:0;"><a href="/outils/{slug}" class="pf-btn"><span>{e(t[1])}</span></a></div>
        </div></div></section>"""


def build_guides_intl():
    for g in GUIDES_INTL:
        L = T[g["lang"]]; path = "/guides/" + g["slug"]
        p = {"path": path, "lang": g["lang"], "title": g["title"], "description": g["description"], "eyebrow": g["eyebrow"], "h1": g["h1"], "lead": g["lead"],
             "facts": [], "steps_title": L["inguide"], "steps": [(s[2], s[1]) for s in g["sections"]], "ctas": L["ctas"]}
        p["ld"] = article_ld(path, g["title"], g["description"], g["faq"], [("/", L["home"]), ("/guides", L["guides"]), (path, g["h1"][0].rstrip(","))])
        p["ld"][0]["inLanguage"] = g["lang"]
        blocs = [crumbs([("/", L["home"]), ("/guides", L["guides"]), (None, g["h1"][0].rstrip(","))]), hero(p)]
        for i, (typ, eyebrow, h2, data) in enumerate(g["sections"], 1):
            inner = prose(data) if typ == "prose" else etapes_html(data) if typ == "steps" else cards([{"title": a, "text": b} for a, b in data], 3)
            blocs.append(section(f"{i:02d}", eyebrow, h2, "", inner, alt=(i % 2 == 0)))
        if g.get("tool"):
            blocs.append(callout(g["lang"], *g["tool"]))
        n = len(g["sections"]) + 1
        autres = [x for x in GUIDES_INTL if x["lang"] == g["lang"] and x["slug"] != g["slug"]][:3]
        blocs.append(section(f"{n:02d}", L["faq"][0], L["faq"][1], "", faq(g["faq"]), alt=True))
        if autres:
            blocs.append(section(f"{n + 1:02d}", L["also"][0], L["also"][1], "", cards([{"title": x["h1"][0].rstrip(","), "text": x["description"].split(". ")[0] + ".", "href": "/guides/" + x["slug"], "more": L["more"]} for x in autres], 3)))
        blocs.append(cta_intl(g["lang"], *L["cta"]))
        write(f"guides/{g['slug']}.html", page(p, "\n".join(blocs), ""))
        print("OK", path)


def build_creation_intl():
    for c in CREATION_INTL:
        L = T[c["lang"]]; S = L["start"]; path = "/guides/" + c["slug"]
        title = S["title"].format(pays=c["pays"]); desc = S["desc"].format(pays=c["pays"])
        p = {"path": path, "lang": c["lang"], "title": title, "description": desc, "eyebrow": S["eyebrow"].format(pays=c["pays"]),
             "h1": (S["h1"][0].format(pays=c["pays"]), S["h1"][1]), "lead": c["local"][0], "facts": [], "ctas": L["ctas"],
             "steps_title": L["inguide"], "steps": [(S["ctx"][0], ""), (S["meth"][0], ""), (S["res"][0], "")]}
        p["ld"] = article_ld(path, title, desc, S["faq"], [("/", L["home"]), ("/guides", L["guides"]), (path, p["h1"][0].rstrip(","))])
        p["ld"][0]["inLanguage"] = c["lang"]
        steps = [(a, b.format(body=c["body"])) for a, b in S["steps"]]
        res_items = [{"title": c["pays"], "text": "Domtom Connect " + ("in " if c["lang"] == "en" else "en ") + c["pays"] + ".", "href": "/territoires/" + c["terr"], "more": L["more"].split(" ")[0] + (" the page" if c["lang"] == "en" else " la página")},
                     {"title": "Strategy session, 100 €" if c["lang"] == "en" else "Sesión estratégica, 100 €", "text": "One hour and a written action plan." if c["lang"] == "en" else "Una hora y un plan de acción escrito.", "href": "/seance-strategique", "more": "Book" if c["lang"] == "en" else "Reservar"}]
        blocs = [crumbs([("/", L["home"]), ("/guides", L["guides"]), (None, p["h1"][0].rstrip(","))]), hero(p),
                 section("01", S["ctx"][0], S["ctx"][1].format(pays=c["pays"]), "", prose(c["local"])),
                 section("02", S["meth"][0], S["meth"][1], "", etapes_html(steps), alt=True),
                 section("03", S["res"][0], S["res"][1], "", cards(res_items, 2)),
                 section("04", L["faq"][0], L["faq"][1], "", faq(S["faq"]), alt=True),
                 cta_intl(c["lang"], *L["cta"])]
        write(f"guides/{c['slug']}.html", page(p, "\n".join(blocs), ""))
        print("OK", path)


def build_calculadora():
    path = "/outils/calculadora-comisiones-reservas"
    title = "Calculadora gratuita de comisiones de Booking y Airbnb para el Caribe | Domtom Connect"
    desc = "Hoteles, villas y excursiones en República Dominicana, Puerto Rico y el Caribe: calcule en un minuto lo que le cuestan cada año las comisiones de las plataformas de reservas."
    devises = ["$", "€", "DOP"]
    form = f"""<div class="pf-calc" data-calc="commissions" data-lang="es">
        <div class="pf-form">{champ("prix", "Precio medio por noche o reserva", 120)}{champ("nuits", "Noches o reservas vendidas al año", 200)}{champ("part", "Parte reservada por plataformas", 70, "%")}{champ("commission", "Comisión media de las plataformas", 17, "%", "0.5")}{champ("direct", "Parte que podría pasar a reserva directa", 30, "%")}
        <label>Moneda<select name="devise">{''.join(f'<option>{d}</option>' for d in devises)}</select></label></div>
        <div class="pf-calc-out"><div><span>Comisiones pagadas cada año</span><strong data-out="an">—</strong></div><div><span>Por mes</span><strong data-out="mois">—</strong></div><div class="hl"><span>Lo que podría conservar en directo</span><strong data-out="gain">—</strong></div><div><span>Su facturación anual</span><strong data-out="ca">—</strong></div>
        <p class="pf-form-note">Estimación basada en sus cifras. Las comisiones varían según la plataforma y su contrato.</p></div>
    </div>"""
    p = {"path": path, "lang": "es", "title": title, "description": desc,
         "ld": [{"@type": "WebApplication", "@id": SITE + path + "#app", "name": "Calculadora de comisiones de reservas", "url": SITE + path, "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
                 "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}, "provider": ORG, "inLanguage": "es"}]}
    head = f"""<section class="pf-hero"><div class="pf-container">
        <p class="pf-eyebrow">Herramienta gratuita · Turismo en el Caribe</p>
        <h1 class="pf-h1">¿Cuánto le cuestan <span>las plataformas de reservas?</span></h1>
        <p class="pf-lead">Indique su precio medio, su volumen y la comisión de sus plataformas. El cálculo se hace en su navegador, no se guarda nada.</p>
        {form}
    </div></section>"""
    blocs = [crumbs([("/", "Inicio"), ("/guides", "Guías"), (None, "Calculadora de comisiones")]), head,
             section("01", "Y ahora", "Convertir esta cifra en reservas directas", "", cards([{"title": "La guía de reservas directas", "text": "El método concreto en seis pasos.", "href": "/guides/conseguir-reservas-directas-caribe", "more": "Leer la guía"},
                                                                                              {"title": "República Dominicana", "text": "Acompañamiento y sitios web que convierten.", "href": "/territoires/republique-dominicaine", "more": "Ver la página"},
                                                                                              {"title": "Puerto Rico", "text": "Acompañamiento y sitios web bilingües.", "href": "/territoires/porto-rico", "more": "Ver la página"}], 3), alt=True),
             cta_intl("es", "Hablemos de sus reservas", "Treinta minutos gratuitos con Loïc Villeronce para ver sus cifras y lo que es realista.")]
    html_page = page(p, "\n".join(blocs), "").replace('<script src="/assets/js/lead-audit.js" defer></script>', '<script src="/assets/js/lead-audit.js" defer></script>\n    <script src="/assets/js/outils.js" defer></script>')
    write("outils/calculadora-comisiones-reservas.html", html_page)
    print("OK", path)


def completer_hub():
    f = os.path.join(ROOT, "guides", "index.html")
    t = open(f, encoding="utf-8").read()
    if 'id="guides-en"' in t:
        return
    en = [x for x in GUIDES_INTL if x["lang"] == "en"] ; es = [x for x in GUIDES_INTL if x["lang"] == "es"]
    en_items = [{"title": x["h1"][0].rstrip(","), "text": x["description"].split(". ")[0] + ".", "href": "/guides/" + x["slug"], "more": "Read the guide"} for x in en] + \
               [{"title": f"Start a business in {c['pays']}", "text": c["local"][0].split(". ")[0] + ".", "href": "/guides/" + c["slug"], "more": "Read the guide"} for c in CREATION_INTL if c["lang"] == "en"]
    es_items = [{"title": x["h1"][0].rstrip(","), "text": x["description"].split(". ")[0] + ".", "href": "/guides/" + x["slug"], "more": "Leer la guía"} for x in es] + \
               [{"title": f"Crear una empresa en {c['pays']}", "text": c["local"][0].split(". ")[0] + ".", "href": "/guides/" + c["slug"], "more": "Leer la guía"} for c in CREATION_INTL if c["lang"] == "es"] + \
               [{"title": "Calculadora de comisiones", "text": "Lo que le cuestan las plataformas cada año.", "href": "/outils/calculadora-comisiones-reservas", "more": "Usar la herramienta"}]
    bloc = section("04", "In English", "Practical guides in English", "", cards(en_items, 3), sid="guides-en") + "\n    " + \
           section("05", "En español", "Guías prácticas en español", "", cards(es_items, 3), alt=True, sid="guias-es") + "\n    "
    i = t.rfind('<section class="pf-section alt">')
    t = t[:i] + bloc + t[i:]
    open(f, "w", encoding="utf-8").write(t)


def relier_intl():
    from contenu_pays import PAYS
    region = {p["slug"]: (p["region"], p["lang"]) for p in PAYS}
    for slug, (reg, lang) in region.items():
        if lang == "fr":
            continue
        key = "diaspora-en" if reg == "diaspora" else reg
        items = [{"title": x["h1"][0].rstrip(","), "text": x["description"].split(". ")[0] + ".", "href": "/guides/" + x["slug"], "more": T[lang]["more"]} for x in GUIDES_INTL if key in x["region"]]
        items = [{"title": ("Start a business in " if lang == "en" else "Crear una empresa en ") + c["pays"], "text": c["local"][0].split(". ")[0] + ".", "href": "/guides/" + c["slug"], "more": T[lang]["more"]} for c in CREATION_INTL if c["terr"] == slug] + items
        if reg == "caraibe-en":
            items.append({"title": "Booking commission calculator", "text": "What platforms cost you every year. Free, one minute.", "href": "/outils/booking-commission-calculator", "more": "Use the tool"})
        if reg == "caraibe-es":
            items.append({"title": "Calculadora de comisiones", "text": "Lo que le cuestan las plataformas cada año. Gratis, un minuto.", "href": "/outils/calculadora-comisiones-reservas", "more": "Usar la herramienta"})
        if not items:
            continue
        titre, sous = ("Practical guides", "Concrete methods for your business") if lang == "en" else ("Guías prácticas", "Métodos concretos para su negocio")
        bloc = f'<section class="pf-section" id="guides-utiles"><div class="pf-container"><div class="pf-head"><p class="pf-eyebrow">{e(titre)}</p><h2 class="pf-h2">{e(sous)}</h2></div>{cards(items[:4], 2 if len(items[:4]) % 2 == 0 else 3)}</div></section>\n    '
        f = os.path.join(ROOT, "territoires", slug, "index.html")
        t = open(f, encoding="utf-8").read()
        t = re.sub(r'<section class="pf-section" id="guides-utiles">[\s\S]*?</section>\n    ', "", t)
        i = t.rfind('<section class="pf-section alt">')
        if i == -1:
            continue
        open(f, "w", encoding="utf-8").write(t[:i] + bloc + t[i:])


def build_tout_intl():
    build_guides_intl(); build_creation_intl(); build_calculadora(); completer_hub(); relier_intl()


if __name__ == "__main__":
    build_tout_intl()
