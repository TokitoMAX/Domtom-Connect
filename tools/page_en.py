"""
Page d'atterrissage en anglais pour les entreprises de la Caraïbe anglophone : /en
Appelée par tools/site_builder.py, ou seule : python tools/page_en.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_builder import SITE, CAL, WA, e, crumbs, section, cards, faq, before_after, page, write

FAQ_EN = [
    ("Do you work with businesses outside the French islands?", "Yes. We work remotely with businesses in St Lucia, Grenada, Sint Maarten, Dominica, Trinidad and Tobago, Jamaica and across the Caribbean, as well as in Africa and the diaspora. Calls happen on video, phone or WhatsApp."),
    ("Do you speak English?", "Yes. Calls can be held in English or French, and everything we agree on is confirmed in writing by email or WhatsApp, so nothing gets lost."),
    ("How much does it cost?", "The first 30 minute call is free. A one hour strategy session costs 100 euros and comes with a written action plan, deducted from the quote if you continue. Websites and ongoing support are quoted after the free call."),
    ("What is DTC Pulse?", "DTC Pulse is the Domtom Connect business network app, connecting entrepreneurs and communities across the Caribbean, Africa and the diaspora. Each business creates and manages its own account."),
]

def build_en():
    path = "/en"
    title = "Business support and websites for Caribbean companies | Domtom Connect"
    desc = "Operational support, direct booking websites and diaspora reach for businesses in St Lucia, Grenada, Sint Maarten and across the Caribbean. Free 30 minute call."
    p = {"path": path, "title": title, "description": desc, "lang": "en", "alternates": [("en", "/en"), ("fr", "/"), ("x-default", "/")],
         "ld": [{"@type": "WebPage", "@id": SITE + path + "#webpage", "url": SITE + path, "name": title, "description": desc, "inLanguage": "en"},
                {"@type": "Service", "@id": SITE + path + "#service", "name": "Business support and website creation for Caribbean companies",
                 "serviceType": ["Business coaching", "Operational support", "Website creation", "Direct booking website"],
                 "provider": {"@type": "Organization", "@id": SITE + "/#organization", "name": "Domtom Connect", "url": SITE},
                 "areaServed": ["Saint Lucia", "Grenada", "Sint Maarten", "Dominica", "Trinidad and Tobago", "Jamaica", "Barbados", "Caribbean"],
                 "availableLanguage": ["English", "French"],
                 "offers": [{"@type": "Offer", "name": "Free 30 minute call", "price": "0", "priceCurrency": "EUR"},
                            {"@type": "Offer", "name": "Strategy session", "price": "100", "priceCurrency": "EUR", "url": SITE + "/seance-strategique"}]},
                {"@type": "FAQPage", "inLanguage": "en", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ_EN]}]}
    hero = f"""<section class="pf-hero">
        <div class="pf-container">
            <p class="pf-eyebrow">Domtom Connect · For Caribbean businesses</p>
            <h1 class="pf-h1">More direct customers, <span>less time lost on everything else.</span></h1>
            <p class="pf-lead">We help hotels, tour operators, restaurants and small businesses across the Caribbean win more direct bookings, organise their operations and reach the Caribbean diaspora in Europe and North America.</p>
            <div class="pf-ctas">
                <a {CAL} class="pf-btn"><i class="fas fa-calendar-alt"></i><span>Book a free 30 minute call</span></a>
                <a href="{WA}" class="pf-btn-ghost"><i class="fab fa-whatsapp"></i><span>Message us on WhatsApp</span></a>
            </div>
            <ul class="pf-facts"><li><strong>Free</strong><span>first 30 minute call</span></li><li><strong>English or French</strong><span>written follow up on WhatsApp</span></li><li><strong>Remote</strong><span>wherever you are in the Caribbean</span></li></ul>
        </div>
    </section>"""
    services = cards([
        {"tag": "Direct bookings", "title": "A website that brings bookings", "text": "A fast, mobile friendly website where guests book and pay you directly, so fewer of your customers go through platforms that take a commission.",
         "list": ["Booking or enquiry forms", "Secure online payment", "Google Business Profile"]},
        {"tag": "Operations", "title": "A right hand for the owner", "text": "We work with you on priorities, cash flow and organisation, so the business stops depending on you for every single decision.",
         "list": ["Clear priorities", "Simple dashboard", "Regular calls"]},
        {"tag": "Diaspora", "title": "Reach customers abroad", "text": "Many visitors and diaspora customers plan from abroad. We help you be found and chosen before they arrive, including through DTC Pulse, our business network app.",
         "list": ["Online visibility", "Diaspora network", "Products sold online"]},
    ], 3)
    ba = before_after([
        ("Most bookings come through platforms that take their cut.", "More guests book and pay you directly."),
        ("You answer the same questions on WhatsApp all day.", "Prices, availability and answers are on your website."),
        ("Low season is a worry every year.", "You plan ahead and reach customers who travel off peak."),
    ]).replace("Aujourd'hui", "Today").replace("Avec Domtom Connect", "With Domtom Connect")
    steps = cards([
        {"title": "1. A free 30 minute call", "text": "You tell us about your business and goals, we tell you honestly whether we can help."},
        {"title": "2. A strategy session, if useful", "text": "One hour on your business with a written action plan, 100 euros, deducted from the quote if you continue."},
        {"title": "3. Tailored support", "text": "Website, operational support or both, quoted clearly before anything starts."},
    ], 3)
    final = f"""<section class="pf-section alt">
        <div class="pf-container">
            <div class="pf-cta-box">
                <p class="pf-eyebrow">Next step</p>
                <h2 class="pf-h2">Let's talk about your business</h2>
                <p class="pf-lead">Thirty free minutes with Loïc Villeronce, founder of Domtom Connect, to look at your situation and see honestly what would bring you more customers.</p>
                <div class="pf-ctas" style="margin-bottom:0;">
                    <a {CAL} class="pf-btn"><i class="fas fa-calendar-alt"></i><span>Book a free call</span></a>
                    <a href="{WA}" class="pf-btn-ghost"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a>
                    <a href="/" class="pf-btn-ghost"><span>Version française</span></a>
                </div>
            </div>
        </div>
    </section>"""
    main = "\n".join([crumbs([("/", "Home"), (None, "English")]), hero,
                      section("01", "What we do", "Three ways we help Caribbean businesses", "", services, alt=True, sid="services"),
                      section("02", "What changes", "Before and after", "", ba, sid="results"),
                      section("03", "How it works", "A clear first step, then tailored support", "", steps, alt=True, sid="how"),
                      section("04", "FAQ", "Questions business owners ask us", "", faq(FAQ_EN), sid="faq"),
                      final])
    write("en.html", page(p, main, ""))
    print("OK", path)

if __name__ == "__main__":
    build_en()
