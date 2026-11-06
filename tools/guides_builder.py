"""
Guides pratiques (/guides/...), outils gratuits (/outils/...), page /guides, et liens depuis les pages territoires.
Appelé en dernier par tools/site_builder.py.
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_builder import SITE, CAL, WA, e, crumbs, hero, section, cards, faq, pricing, final_cta, page, write, prose, lead_audit
from contenu_guides import GUIDES, CREATION, CREATION_DOM, CREATION_OHADA, OUTILS, AUTEUR

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATE = "2026-11-06"
ORG = {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE}


def article_ld(path, title, desc, faq_items, crumbs_ld):
    return [{"@type": "Article", "@id": SITE + path + "#article", "headline": title.split(" | ")[0], "description": desc, "inLanguage": "fr-FR",
             "author": {"@type": "Person", "name": AUTEUR, "url": SITE + "/a-propos"}, "publisher": ORG, "datePublished": DATE, "dateModified": DATE,
             "mainEntityOfPage": SITE + path},
            {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (u, n) in enumerate(crumbs_ld)]},
            {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]}]


def etapes_html(items):
    return cards([{"title": f"{i}. {t}", "text": x} for i, (t, x) in enumerate(items, 1)], 2)


def outil_callout(slug, texte):
    o = next(x for x in OUTILS if x["slug"] == slug)
    return f"""<div class="pf-cta-box" style="text-align:left;">
                <p class="pf-eyebrow">Outil gratuit</p>
                <h3 class="pf-h3">{e(o['h1'][0])} {e(o['h1'][1])}</h3>
                <p class="pf-text">{e(texte)}</p>
                <div class="pf-ctas" style="margin-bottom:0;"><a href="/outils/{slug}" class="pf-btn"><span>Utiliser l'outil gratuit</span></a></div>
            </div>"""


def liens_utiles(courant):
    autres = [g for g in GUIDES if g["slug"] != courant][:3]
    return cards([{"title": g["h1"][0].rstrip(",") , "text": g["description"].split(". ")[0] + ".", "href": "/guides/" + g["slug"], "more": "Lire le guide"} for g in autres], 3)


def build_guides():
    os.makedirs(os.path.join(ROOT, "guides"), exist_ok=True)
    for g in GUIDES:
        path = "/guides/" + g["slug"]
        p = {"path": path, "title": g["title"], "description": g["description"], "eyebrow": g["eyebrow"], "h1": g["h1"], "lead": g["lead"], "facts": g["facts"],
             "steps_title": "Dans ce guide", "steps": [(s["h2"], s.get("eyebrow", "")) for s in g["sections"] if s["type"] in ("prose", "etapes", "cartes")][:3]}
        p["ld"] = article_ld(path, g["title"], g["description"], g["faq"], [("/", "Accueil"), ("/guides", "Guides"), (path, g["h1"][0].rstrip(","))])
        blocs = [crumbs([("/", "Accueil"), ("/guides", "Guides"), (None, g["h1"][0].rstrip(","))]), hero(p)]
        n = 1
        for s in g["sections"]:
            if s["type"] == "prose":
                inner = prose(s["p"])
            elif s["type"] == "etapes":
                inner = etapes_html(s["items"])
            elif s["type"] == "cartes":
                inner = cards([{"title": t, "text": x} for t, x in s["items"]], 3)
            elif s["type"] == "outil":
                blocs.append(f'<section class="pf-section"><div class="pf-container">{outil_callout(s["slug"], s["texte"])}</div></section>')
                continue
            blocs.append(section(f"{n:02d}", s["eyebrow"], s["h2"], "", inner, alt=(n % 2 == 0)))
            n += 1
        blocs += [lead_audit("guide-" + g["slug"]),
                  section(f"{n:02d}", "Questions fréquentes", "Vos questions sur ce sujet", "", faq(g["faq"]), alt=True),
                  section(f"{n + 1:02d}", "À lire aussi", "D'autres guides pratiques", "", liens_utiles(g["slug"])),
                  final_cta("Passons de la lecture à l'action", "Trente minutes offertes avec Loïc Villeronce pour appliquer cette méthode à votre entreprise.")]
        write(f"guides/{g['slug']}.html", page(p, "\n".join(blocs), ""))
        print("OK", path)


def build_creation():
    for c in CREATION:
        path = "/guides/" + c["slug"]
        base = CREATION_DOM if c["type"] == "dom" else CREATION_OHADA
        etapes = [(t, x.format(organisme=c.get("organisme", ""))) for t, x in base["etapes"]]
        title = f"Créer son entreprise {c['en']} en 2026, les étapes concrètes | Domtom Connect"
        desc = f"Créer son entreprise {c['en']} : étude du marché, statut, formalités, aides, gestion et premiers clients. Le guide concret de Domtom Connect pour les porteurs de projet."
        faq_items = [(f"Combien de temps faut-il pour créer son entreprise {c['en']} ?", "Les formalités elles-mêmes peuvent aller vite, mais le vrai travail est en amont : valider son offre, son prix et ses premiers clients. Comptez le temps de bien préparer, c'est ce qui fait durer une entreprise."),
                     ("Quel statut choisir ?", "Cela dépend de votre activité, de votre chiffre d'affaires prévu, de vos associés et de votre protection sociale. Un expert-comptable ou un organisme d'accompagnement vous aidera à trancher."),
                     ("Pouvez-vous m'accompagner dans la création ?", "Oui. La séance stratégique d'une heure permet de poser un plan concret, et le programme Tremplin accompagne les porteurs de projet dans leur lancement."),
                     ("Existe-t-il des ressources pour bien démarrer ?", "Oui. Le livre Les Fondamentaux de l'Entrepreneur et le guide interactif de la boutique Domtom Connect reprennent toute la méthode, de l'idée aux premiers clients.")]
        p = {"path": path, "title": title, "description": desc, "eyebrow": f"Guide pratique · Création d'entreprise · {c['pays']}",
             "h1": (f"Créer son entreprise {c['en']},", "les étapes concrètes."), "lead": c["local"][0],
             "facts": [("6 étapes", "de l'idée aux premiers clients"), ("Organismes", "officiels cités"), ("Conseil", "avant de choisir son statut")],
             "steps_title": "Dans ce guide", "steps": [("Le contexte local", ""), ("Les six étapes", ""), ("Les aides et les atouts", "")],
             "ctas": [("CAL", "Réserver un échange de 30 minutes", True), ("/tremplin", "Programme Tremplin", False)]}
        p["ld"] = article_ld(path, title, desc, faq_items, [("/", "Accueil"), ("/guides", "Guides"), (path, f"Créer son entreprise {c['en']}")])
        blocs = [crumbs([("/", "Accueil"), ("/guides", "Guides"), (None, f"Créer son entreprise {c['en']}")]), hero(p),
                 section("01", "Le contexte", f"Entreprendre {c['en']}, ce qu'il faut savoir", "", prose(c["local"])),
                 section("02", "La méthode", "Les six étapes pour créer votre entreprise", "", etapes_html(etapes), alt=True),
                 section("03", "Les leviers", "Aides et atouts à connaître" if c["type"] == "dom" else "Les atouts à connaître", "Les dispositifs évoluent et sont soumis à conditions. Vérifiez toujours auprès de l'organisme concerné ou de votre expert-comptable.", cards([{"title": t, "text": x} for t, x in base["aides"]], 2)),
                 section("04", "Pour aller plus vite", "Les ressources Domtom Connect", "", cards([
                     {"title": "Le livre, 5 €", "text": "Les Fondamentaux de l'Entrepreneur, de l'idée aux premiers clients.", "href": "/boutique/les-fondamentaux-de-l-entrepreneur", "more": "Voir le livre"},
                     {"title": "Le calculateur de prix plancher", "text": "Gratuit, pour fixer un prix qui vous fait vivre.", "href": "/outils/calculateur-prix-plancher", "more": "Calculer"},
                     {"title": "La séance stratégique, 100 €", "text": "Une heure avec Loïc Villeronce et un plan d'action écrit.", "href": "/seance-strategique", "more": "Réserver"}], 3), alt=True),
                 section("05", "Questions fréquentes", f"Créer son entreprise {c['en']}, vos questions", "", faq(faq_items)),
                 section("06", "Aller plus loin", "Entreprendre sur votre territoire", "", cards([{"title": c["pays"], "text": f"Notre page pour les entreprises {c['en']}.", "href": "/territoires/" + c["terr"], "more": "Voir la page"},
                                                                                                    {"title": "Tous les guides", "text": "Méthodes concrètes pour vendre, encaisser et grandir.", "href": "/guides", "more": "Voir les guides"}], 2), alt=True),
                 final_cta("Lancez votre projet avec un plan clair", "Trente minutes offertes avec Loïc Villeronce pour regarder votre projet et voir par où commencer.")]
        write(f"guides/{c['slug']}.html", page(p, "\n".join(blocs), ""))
        print("OK", path)


def champ(name, label, val, suffix="", step="1"):
    return f'<label>{e(label)}<span class="pf-inp"><input type="number" inputmode="decimal" min="0" step="{step}" name="{name}" value="{val}"/>{f"<em>{e(suffix)}</em>" if suffix else ""}</span></label>'


def build_outils():
    os.makedirs(os.path.join(ROOT, "outils"), exist_ok=True)
    for o in OUTILS:
        path = "/outils/" + o["slug"]; en = o["lang"] == "en"
        if o["slug"] == "calculateur-prix-plancher":
            form = f"""<div class="pf-calc" data-calc="prix">
                <div class="pf-form">{champ("fixes", "Vos charges fixes par mois (loyer, abonnements, assurance…)", 300, "€")}{champ("salaire", "Ce que vous voulez vous verser par mois", 1500, "€")}{champ("unitaire", "Coût direct d'une vente (matière, livraison, commission)", 5, "€")}{champ("volume", "Nombre de ventes que vous pouvez faire par mois", 100)}{champ("heures", "Heures travaillées par mois", 140, "h")}{champ("prixvise", "Le prix que vous envisagez", 25, "€")}</div>
                <div class="pf-calc-out"><div><span>Votre prix plancher</span><strong data-out="plancher">—</strong></div><div><span>Ventes nécessaires par mois au prix envisagé</span><strong data-out="ventes">—</strong></div><div><span>Ce que doit rapporter chaque heure</span><strong data-out="heure">—</strong></div>
                <p class="pf-form-note">Le prix plancher couvre vos coûts et votre rémunération pour le volume indiqué. En dessous, vous travaillez à perte.</p></div>
            </div>"""
            expl = ["Le prix plancher est le prix minimum qui couvre le coût direct de chaque vente, vos charges fixes et la rémunération que vous voulez vous verser, pour un volume de ventes réaliste.",
                    "Beaucoup de porteurs de projet fixent leur prix en regardant la concurrence, sans calculer ce qu'il leur faut pour vivre. Résultat, ils travaillent beaucoup pour peu. Le guide interactif de la boutique va plus loin, avec un simulateur complet et un plan d'action de 30 jours."]
            suite = cards([{"title": "Le guide interactif, 27 €", "text": "Le simulateur complet, le carnet de bord et votre plan 30 jours.", "href": "/boutique/guide-interactif", "more": "Découvrir"},
                           {"title": "Le livre, 5 €", "text": "La méthode pour passer de l'idée aux premiers clients.", "href": "/boutique/les-fondamentaux-de-l-entrepreneur", "more": "Découvrir"},
                           {"title": "La séance stratégique, 100 €", "text": "Une heure pour poser votre prix, votre offre et votre plan.", "href": "/seance-strategique", "more": "Réserver"}], 3)
            faqs = [("Le prix plancher est-il le prix que je dois afficher ?", "Non, c'est le minimum. Votre prix de vente doit être au-dessus, en tenant compte de la valeur perçue par vos clients et des prix du marché."),
                    ("Mes données sont-elles enregistrées ?", "Non. Le calcul se fait dans votre navigateur et rien n'est envoyé.")]
        else:
            L = (("Average price per night or booking", "Nights or bookings sold per year", "Share booked through platforms", "Average platform commission", "Share you could move to direct bookings", "Currency"),
                 ("Ce que vous payez en commissions chaque année", "Soit par mois", "Récupérable en direct", "Votre chiffre d'affaires annuel")) if not en else None
            lab = (["Average price per night or booking", "Nights or bookings sold per year", "Share booked through platforms", "Average platform commission", "Share you could realistically move to direct", "Currency"],
                   ["Commissions paid every year", "Per month", "You could keep with direct bookings", "Your yearly revenue"]) if en else \
                  (["Prix moyen d'une nuit ou d'une prestation", "Nuits ou prestations vendues par an", "Part réservée via les plateformes", "Commission moyenne des plateformes", "Part que vous pourriez réserver en direct", "Devise"],
                   ["Ce que vous coûtent les commissions chaque année", "Soit par mois", "Ce que vous pourriez garder en direct", "Votre chiffre d'affaires annuel"])
            devises = ["$", "€", "XCD", "TTD", "JMD", "BBD"] if en else ["€", "$", "XCD", "TTD", "JMD", "BBD"]
            form = f"""<div class="pf-calc" data-calc="commissions" data-lang="{o['lang']}">
                <div class="pf-form">{champ("prix", lab[0][0], 120)}{champ("nuits", lab[0][1], 200)}{champ("part", lab[0][2], 70, "%")}{champ("commission", lab[0][3], 17, "%", "0.5")}{champ("direct", lab[0][4], 30, "%")}
                <label>{e(lab[0][5])}<select name="devise">{''.join(f'<option>{d}</option>' for d in devises)}</select></label></div>
                <div class="pf-calc-out"><div><span>{e(lab[1][0])}</span><strong data-out="an">—</strong></div><div><span>{e(lab[1][1])}</span><strong data-out="mois">—</strong></div><div class="hl"><span>{e(lab[1][2])}</span><strong data-out="gain">—</strong></div><div><span>{e(lab[1][3])}</span><strong data-out="ca">—</strong></div>
                <p class="pf-form-note">{e("Estimate based on your figures. Commission rates vary by platform and contract." if en else "Estimation à partir de vos chiffres. Les commissions varient selon la plateforme et votre contrat.")}</p></div>
            </div>"""
            if en:
                expl = ["Booking platforms bring visibility, but they take a commission on every booking, including returning guests and people who would have found you anyway. Most owners never add up what it costs over a full year.",
                        "This calculator shows the yearly cost of commissions and how much you could keep by moving part of your bookings to your own website. The goal is not to leave platforms overnight, but to rebalance."]
                suite = cards([{"title": "A website that takes bookings", "text": "Fast, mobile friendly, with online booking and payment.", "href": "/en", "more": "See how we help"},
                               {"title": "Free 30 minute call", "text": "Look at your figures together and see what is realistic.", "href": "/en", "more": "Book a call"}], 2)
                faqs = [("Is my data stored?", "No. The calculation runs in your browser and nothing is sent."),
                        ("What commission should I enter?", "Use the average commission shown in your platform statements, including any extra fees you pay.")]
            else:
                expl = ["Les plateformes de réservation apportent de la visibilité, mais prélèvent une commission sur chaque réservation, y compris sur les clients qui reviennent ou qui vous auraient trouvé seuls. Peu d'hébergeurs additionnent ce que ça représente sur une année complète.",
                        "Ce calculateur montre le coût annuel des commissions et ce que vous pourriez garder en déplaçant une partie de vos réservations vers votre propre site. Le but n'est pas de quitter les plateformes du jour au lendemain, mais de rééquilibrer."]
                suite = cards([{"title": "Le guide pour sortir des plateformes", "text": "La méthode concrète en six étapes.", "href": "/guides/sortir-des-plateformes-de-reservation", "more": "Lire le guide"},
                               {"title": "Un site qui réserve en direct", "text": "Réservation, paiement, WhatsApp et référencement local.", "href": "/creation-site-web", "more": "Voir l'offre"},
                               {"title": "Remplir en basse saison", "text": "Les leviers concrets pour les mois calmes.", "href": "/guides/remplir-en-basse-saison", "more": "Lire le guide"}], 3)
                faqs = [("Mes données sont-elles enregistrées ?", "Non. Le calcul se fait dans votre navigateur et rien n'est envoyé."),
                        ("Quelle commission indiquer ?", "Celle qui apparaît sur vos relevés de plateforme, en incluant les éventuels frais supplémentaires.")]
        p = {"path": path, "title": o["title"], "description": o["description"], "lang": o["lang"]}
        p["ld"] = [{"@type": "WebApplication", "@id": SITE + path + "#app", "name": o["h1"][0] + " " + o["h1"][1], "url": SITE + path, "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
                    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}, "provider": ORG, "inLanguage": o["lang"]},
                   {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}]
        head = f"""<section class="pf-hero"><div class="pf-container">
            <p class="pf-eyebrow">{e(o['eyebrow'])}</p>
            <h1 class="pf-h1">{e(o['h1'][0])} <span>{e(o['h1'][1])}</span></h1>
            <p class="pf-lead">{e(o['lead'])}</p>
            {form}
        </div></section>"""
        h = (("How it works", "What the figures mean"), ("Next steps", "Turn the result into more direct bookings"), ("FAQ", "Questions")) if en else \
            (("Comment ça marche", "Ce que disent ces chiffres"), ("Et maintenant", "Transformer ce chiffre en action"), ("Questions fréquentes", "Vos questions"))
        blocs = [crumbs([("/", "Home" if en else "Accueil"), ("/guides", "Guides"), (None, o["h1"][0])]), head,
                 section("01", h[0][0], h[0][1], "", prose(expl), alt=True), section("02", h[1][0], h[1][1], "", suite)]
        if not en:
            blocs.append(lead_audit("outil-" + o["slug"]))
        blocs.append(section("03", h[2][0], h[2][1], "", faq(faqs), alt=True))
        html_page = page(p, "\n".join(blocs), "").replace('<script src="/assets/js/lead-audit.js" defer></script>', '<script src="/assets/js/lead-audit.js" defer></script>\n    <script src="/assets/js/outils.js" defer></script>')
        write(f"outils/{o['slug']}.html", html_page)
        print("OK", path)


def build_hub():
    path = "/guides"
    title = "Guides pratiques et outils gratuits pour entrepreneurs de la Caraïbe et d'Afrique | Domtom Connect"
    desc = "Créer son entreprise, sortir des plateformes, remplir en basse saison, se faire payer, vendre à la diaspora, WhatsApp. Des guides concrets et des calculateurs gratuits."
    p = {"path": path, "title": title, "description": desc, "eyebrow": "Guides et outils gratuits", "h1": ("Des méthodes concrètes,", "pas de théorie."),
         "lead": "Des guides pratiques et des outils gratuits pensés pour les entrepreneurs des Antilles, de Guyane, de la Caraïbe, de l'océan Indien, d'Afrique et de la diaspora, à partir des problèmes qu'ils vivent vraiment.",
         "facts": [(str(len(GUIDES) + len(CREATION)), "guides pratiques"), (str(len(OUTILS)), "outils gratuits"), ("Gratuit", "sans inscription")],
         "steps_title": "Par où commencer", "steps": [("Un outil", "Pour chiffrer votre situation en une minute."), ("Un guide", "Pour la méthode pas à pas."), ("Un échange", "Pour l'appliquer à votre entreprise, 30 minutes offertes.")]}
    p["ld"] = [{"@type": "CollectionPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": title, "description": desc, "inLanguage": "fr-FR"}]
    blocs = [crumbs([("/", "Accueil"), (None, "Guides")]), hero(p),
             section("01", "Outils gratuits", "Chiffrez votre situation en une minute", "", cards([{"title": o["h1"][0] + " " + o["h1"][1], "text": o["description"].split(". ")[0] + ".", "href": "/outils/" + o["slug"], "more": "Utiliser l'outil" if o["lang"] == "fr" else "Use the tool"} for o in OUTILS], 3), alt=True),
             section("02", "Guides pratiques", "Résoudre un problème précis", "", cards([{"title": g["h1"][0].rstrip(","), "text": g["description"].split(". ")[0] + ".", "href": "/guides/" + g["slug"], "more": "Lire le guide"} for g in GUIDES], 3)),
             section("03", "Créer son entreprise", "Les étapes concrètes, pays par pays", "", cards([{"title": f"Créer son entreprise {c['en']}", "text": c["local"][0].split(". ")[0] + ".", "href": "/guides/" + c["slug"], "more": "Lire le guide"} for c in CREATION], 3), alt=True),
             final_cta("Besoin d'aller plus vite ?", "Trente minutes offertes avec Loïc Villeronce pour appliquer ces méthodes à votre entreprise.")]
    write("guides/index.html", page(p, "\n".join(blocs), ""))
    print("OK", path)


# ---------------------------------------------------------------- liens depuis les pages territoires
def relier_territoires():
    from contenu_pays import PAYS
    region = {p["slug"]: p["region"] for p in PAYS}
    for s in ("guadeloupe", "martinique", "guyane", "reunion", "mayotte", "polynesie"):
        region[s] = "dom"
    creation = {c["terr"]: c["slug"] for c in CREATION}
    G = {g["slug"]: g for g in GUIDES}
    choix = {"dom": ["sortir-des-plateformes-de-reservation", "etre-paye-plus-vite-btp", "trouver-des-clients-sur-whatsapp"],
             "caraibe-fr": ["sortir-des-plateformes-de-reservation", "remplir-en-basse-saison", "vendre-a-la-diaspora"],
             "ocean-indien": ["sortir-des-plateformes-de-reservation", "remplir-en-basse-saison", "trouver-des-clients-sur-whatsapp"],
             "afrique-fr": ["vendre-a-la-diaspora", "trouver-des-clients-sur-whatsapp"],
             "diaspora": ["vendre-a-la-diaspora", "trouver-des-clients-sur-whatsapp"]}
    for slug, reg in region.items():
        f = os.path.join(ROOT, "territoires", slug, "index.html")
        if not os.path.exists(f):
            continue
        t = open(f, encoding="utf-8").read()
        if 'id="guides-utiles"' in t:
            continue
        if reg in ("caraibe-en", "caraibe-es"):
            items = [{"title": "Booking commission calculator", "text": "How much do booking platforms cost you every year? Free, one minute.", "href": "/outils/booking-commission-calculator", "more": "Use the tool"}]
            titre, sous = "Free tool", "Check what platforms really cost you"
        elif reg in choix:
            items = []
            if slug in creation:
                items.append({"title": f"Créer son entreprise", "text": "Les étapes concrètes, les organismes et les aides.", "href": "/guides/" + creation[slug], "more": "Lire le guide"})
            items += [{"title": G[x]["h1"][0].rstrip(","), "text": G[x]["description"].split(". ")[0] + ".", "href": "/guides/" + x, "more": "Lire le guide"} for x in choix[reg]]
            items.append({"title": "Outils gratuits", "text": "Calculateur de commissions et de prix plancher.", "href": "/guides", "more": "Voir les outils"})
            titre, sous = "Guides pratiques", "Des méthodes concrètes pour votre activité"
        else:
            continue
        bloc = f'<section class="pf-section" id="guides-utiles"><div class="pf-container"><div class="pf-head"><p class="pf-eyebrow">{e(titre)}</p><h2 class="pf-h2">{e(sous)}</h2></div>{cards(items[:4], 2 if len(items) % 2 == 0 else 3)}</div></section>\n    '
        i = t.rfind('<section class="pf-section alt">')
        if i == -1:
            continue
        t = t[:i] + bloc + t[i:]
        open(f, "w", encoding="utf-8").write(t)


def build_tout_guides():
    build_guides(); build_creation(); build_outils(); build_hub(); relier_territoires()


if __name__ == "__main__":
    build_tout_guides()
