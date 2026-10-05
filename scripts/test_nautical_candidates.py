import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target
from dedup_engine import is_domain_or_company_duplicate

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    # Guadeloupe
    ("Anse Caraïbe Plongée", "jazzdive971@gmail.com", "Guadeloupe (Pointe-Noire)", "https://plongee-guadeloupe-reserve-cousteau.fr"),
    ("Atlantis Plongée", "contact@atlantisplongee.com", "Guadeloupe (Bouillante)", "https://atlantisplongee.com"),
    ("CIP Guadeloupe", "contact@cip-guadeloupe.com", "Guadeloupe (Bouillante)", "https://cip-guadeloupe.com"),
    ("Infini Plongée", "infiniplongee@gmail.com", "Guadeloupe (Saint-François)", "https://infiniplongee.com"),
    ("Noa Plongée", "contact@noaplongee.fr", "Guadeloupe (Saint-François)", "https://noaplongee.fr"),
    ("Sailoé Caraïbes", "charter@sailoe.com", "Guadeloupe (Pointe-à-Pitre)", "https://sailoe.com"),
    ("Corail Caraïbes", "info@corail-caraibes.com", "Guadeloupe (Pointe-à-Pitre)", "https://corail-caraibes.com"),
    ("Gwada Marine", "gwadamarine@outlook.fr", "Guadeloupe (Saint-François)", "https://gwadamarine.fr"),
    ("Chris Marine", "locationbateauguadeloupe@gmail.com", "Guadeloupe (Saint-François)", "https://chrismarine-location.fr"),
    ("Tiki Boat Guadeloupe", "tikiboatguadeloupe@gmail.com", "Guadeloupe (Le Gosier)", "https://tikiboat.fr"),
    ("Fiesta Boat Location", "fiestaboatlocation@gmail.com", "Guadeloupe (Sainte-Anne)", "https://fiestaboatlocation.com"),
    ("Tropical Boat Guadeloupe", "tropicalboat.971@gmail.com", "Guadeloupe (Le Gosier)", "https://tropical-boat-guadeloupe.com"),
    ("Hiwigoloc", "contact@hiwigoloc.fr", "Guadeloupe (Baie-Mahault)", "https://hiwigoloc.fr"),

    # Martinique
    ("DSC Plongée", "dscplongee@gmail.com", "Martinique (Le Diamant)", "https://dscplongee.com"),
    ("Immersion Caraïbes", "info@immersioncaraibes.com", "Martinique (Le Marin)", "https://immersioncaraibes.com"),
    ("Marin Plongée", "contact@marinplongee.com", "Martinique (Le Marin)", "https://marinplongee.com"),
    ("Case Plongée", "case.plongee@gmail.com", "Martinique (Schœlcher)", "Annuaire FFESSM"),
    ("A Papa D'Lo Plongée", "apapadlo972@gmail.com", "Martinique (Saint-Pierre)", "https://habitationperlecreole.net"),
    ("Aliotis Martinique", "aliotis.plongee@gmail.com", "Martinique (Trois-Îlets)", "https://aliotis-martinique.com"),
    ("Autremer Concept", "info@autremerconcept.com", "Martinique (Le Marin)", "https://autremerconcept.com"),
    ("Punch Croisières", "contact@punch-croisieres.com", "Martinique (Le Marin)", "https://punch-croisieres.com"),
    ("Mer-Sea Martinique", "captain@mer.sea.fr", "Martinique (Le François)", "https://mer-sea.fr"),
    ("Seek Sail", "contact@seeksail.com", "Martinique (Le Marin)", "https://seeksail.com"),

    # Saint-Martin & Saint-Barthélemy
    ("Blue Odyssey Diving", "contact@blue-odyssey-diving.com", "Saint-Martin", "https://blue-odyssey-diving.com"),
    ("Atabey Dive Center", "atabeydivecenter@gmail.com", "Saint-Martin", "https://key-paradise.com"),
    ("Creole Rock Watersports", "crwsold@gmail.com", "Saint-Martin", "https://creolerockwatersports.com"),
    ("Saint Martin Boat Charter", "info@saint-martin-boat-charter.com", "Saint-Martin", "https://saint-martin-boat-charter.com"),
    ("Manutea Charter", "manuteachartersxm@gmail.com", "Saint-Martin", "https://manutea-charters.com"),
    ("Arawak Charters", "contact@arawakcharters.com", "Saint-Martin", "https://arawakcharters.com"),
    ("Caribbean Marines", "contact@caribbeanmarines.com", "Saint-Martin", "https://caribbeanmarines.com"),
    ("Wind Adventures", "info@wind-adventures.com", "Saint-Martin (Orient Bay)", "https://wind-adventures.com"),
    ("Captain SUP SXM", "captainsupsxm@gmail.com", "Saint-Martin", "https://captainsup-sxm.com"),
    ("Ouanalao Dive", "ouanalao.dive@gmail.com", "Saint-Barthélemy", "https://ouanalaodive.com"),
    ("Serial Divers St-Barth", "contact@serialdivers.com", "Saint-Barthélemy", "https://serialdivers.com"),
    ("La Bulle SBH", "labullesbh@gmail.com", "Saint-Barthélemy", "Annuaire Saint-Barth"),
    ("Blue Escape FWI", "stephane@blueescapefwi.com", "Saint-Barthélemy", "https://blueescapefwi.com"),
    ("Splash FWI", "splashfwi@gmail.com", "Saint-Barthélemy", "Annuaire Saint-Barth"),
    ("Island Diving St-Barth", "contact@islandiving.com", "Saint-Barthélemy", "https://islandiving.fr"),
    ("SBH SUB", "contact@sbhsub.org", "Saint-Barthélemy", "https://sbhsub.org"),

    # La Réunion & Mayotte
    ("Corail Plongée Réunion", "info@corail-plongee.com", "La Réunion (Saint-Gilles)", "https://corail-plongee.com"),
    ("Escapade Plongée Réunion", "contact@escapadeplongee.com", "La Réunion (Saint-Gilles)", "https://escapadeplongee.com"),
    ("Gecko Bleu Réunion", "geckobleuplongee@gmail.com", "La Réunion (Saint-Gilles)", "https://geckobleu.com"),
    ("Bulle d'Air Réunion", "jean@bulledair.re", "La Réunion (Saint-Gilles)", "https://bulledair.re"),
    ("Plongée Ô Sea Bleu", "contact@oseableu.com", "La Réunion (Saint-Gilles)", "https://oseableu.com"),
    ("Réunion Diving", "info@reuniondiving.com", "La Réunion (Saint-Gilles)", "Annuaire AssoPei"),
    ("Gloria Maris Plongée", "secretariat.gloriamaris@gmail.com", "La Réunion (Saint-Gilles)", "https://gloriamaris.net"),
    ("Abyss Plongée Réunion", "abyss.plongee.reunion@gmail.com", "La Réunion (Saint-Leu)", "https://abyss-plongee.com"),
    ("Excelsus Plongée Réunion", "reservation@excelsus-plongee.com", "La Réunion (Saint-Leu)", "https://excelsus-plongee.com"),
    ("Aquabulle Plongée Réunion", "aquabulle.plongee@gmail.com", "La Réunion (Saint-Leu)", "https://aquabulleplongee.re"),
    ("Plongée Péi Réunion", "infoplongeepei@gmail.com", "La Réunion (Saint-Leu)", "https://plongeepei.fr"),
    ("Lagon Maore", "contact@lagonmaore.com", "Mayotte (Kani-Kéli)", "https://lagonmaore.com"),
    ("Nautilus Plongée Mayotte", "contact@nautilusplongee-mayotte.yt", "Mayotte (Mamoudzou)", "https://nautilusplongee-mayotte.yt"),
    ("Cétamayotte", "contact@cetamayotte.com", "Mayotte (Mamoudzou)", "https://cetamayotte.com"),
    ("Maoré Jet", "contact.maorejet@gmail.com", "Mayotte (Dzaoudzi)", "Office Tourisme Petite-Terre"),
    ("Lagon Aventure Mayotte", "lagonaventure@gmail.com", "Mayotte (Dzaoudzi)", "Office Tourisme Petite-Terre"),
    ("Naut'île Mayotte", "nautilemayotte@gmail.com", "Mayotte (Dzaoudzi)", "Office Tourisme Petite-Terre"),

    # Polynésie & Sénégal
    ("Eleuthera Tahiti Diving", "contact@eleutheratahiti.com", "Polynésie (Tahiti)", "https://eleutheratahiti.com"),
    ("Tahiti Plongée Passion", "tahitiplongeepassion@gmail.com", "Polynésie (Tahiti)", "Tahiti Tourisme"),
    ("Moorea Blue Diving", "mooreadiving@gmail.com", "Polynésie (Moorea)", "Tahiti Tourisme"),
    ("Moorea Fun Dive", "mfdmoorea@gmail.com", "Polynésie (Moorea)", "Tahiti Tourisme"),
    ("Scubapiti Moorea", "scubapitimoorea@gmail.com", "Polynésie (Moorea)", "Tahiti Tourisme"),
    ("Moorea Underwater Experience", "mooreaunderwaterexperience@gmail.com", "Polynésie (Moorea)", "Tahiti Tourisme"),
    ("Ia Ora Diving", "booking.iaoradiving@gmail.com", "Polynésie (Moorea)", "Tahiti Tourisme"),
    ("Tahiti Yacht Charter", "tahiti@tahitiyachtcharter.com", "Polynésie (Raiatea)", "https://tahitiyachtcharter.com"),
    ("Charter Polynésie", "contact@charter-polynesie.com", "Polynésie (Huahine)", "https://charter-polynesie.com"),
    ("Poe Charter Tahiti", "jeanadrien.poecharter@gmail.com", "Polynésie (Tahiti Papeete)", "https://poecharter.pf"),
    ("Tahiti Charter", "tahiticharter@gmail.com", "Polynésie (Tahiti)", "https://tahiti-charter.com"),
    ("Tahiti Sail And Dive", "contact@tahitisailanddive.com", "Polynésie (Tahiti Papeete)", "https://tahitisailanddive.com"),
    ("ELYT Charter Tahiti", "info@elytchartertahiti.com", "Polynésie (Tahiti Papeete)", "https://elytchartertahiti.com"),
    ("Barracuda Club Dakar", "bcd-diving@barracuda-club-dakar.com", "Sénégal (Dakar Ngor)", "https://barracuda-club-plongee.com"),
    ("Nautilus Diving Dakar", "nautilusdakar@gmail.com", "Sénégal (Dakar)", "https://bonjoursenegal.com")
]

valid = []
for c, e, t, s in candidates:
    ok, msg = verify_email_target(e)
    if not ok:
        print(f"FAIL MX: {c} ({e}) - {msg}", flush=True)
        continue
    dup, reason = is_domain_or_company_duplicate(e, c)
    if dup:
        print(f"DUP: {c} ({e}) - {reason}", flush=True)
        continue
    valid.append((c, e, t, s))
    print(f"VALIDE [{len(valid)}]: {c} ({e}) [{t}]", flush=True)

print(f"\nBilan : {len(valid)} / {len(candidates)} valides.", flush=True)
