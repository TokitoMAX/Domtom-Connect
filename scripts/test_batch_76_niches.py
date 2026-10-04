import os, sys, json
sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

CANDIDATES = [
    # =========================================================================
    # NICHE 1 : CHOCOLATIERS BEAN-TO-BAR & CAFÉS / TERROIRS D'EXCEPTION
    # =========================================================================
    {
        "niche": "Niche 1 - Chocolat Bean-to-Bar & Terroirs",
        "company": "Naomi Martino Chocolats",
        "name": "Naomi Martino",
        "email": "chocolats@naomimartino.fr",
        "website": "https://naomimartino.fr",
        "source": "Site officiel naomimartino.fr",
        "territory": "Guadeloupe",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "votre démarche d'excellence en chocolat Bean to Bar et la valorisation remarquable des fèves et épices du terroir guadeloupéen",
        "core_value": "l'authenticité des saveurs locales, la créativité gustative et l'exigence d'un artisanat d'art sans compromis"
    },
    {
        "niche": "Niche 1 - Chocolat Bean-to-Bar & Terroirs",
        "company": "Audaces Chocolat",
        "name": "François-Xavier Caussade",
        "email": "fxcaussade@audaces.re",
        "website": "https://audaces.re",
        "source": "Site officiel audaces.re",
        "territory": "La Réunion",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "vos créations chocolatières Bean to Bar et l'alliance originale avec les trésors aromatiques réunionnais comme le combava ou le faham",
        "core_value": "la précision de la torréfaction des fèves pures origines et la mise en lumière du patrimoine gustatif de l'île"
    },
    {
        "niche": "Niche 1 - Chocolat Bean-to-Bar & Terroirs",
        "company": "Le Passeur d'Arômes",
        "name": "Direction Le Passeur d'Arômes",
        "email": "contact@lepasseurdaromes.re",
        "website": "https://lepasseurdaromes.re",
        "source": "Site officiel lepasseurdaromes.re",
        "territory": "La Réunion",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "votre travail minutieux d'artisan chocolatier Bean to Bar et votre sélection rigoureuse de cacaos fins à La Réunion",
        "core_value": "le respect scrupuleux du produit brut et la finesse du conchage artisanal"
    },
    {
        "niche": "Niche 1 - Chocolat Bean-to-Bar & Terroirs",
        "company": "Bénédicte Chocolats",
        "name": "Direction Bénédicte Chocolats",
        "email": "mondedesepices@bvhd.fr",
        "website": "https://mondedesepices.fr",
        "source": "Site officiel mondedesepices.fr",
        "territory": "Martinique",
        "category": "Chocolaterie Artisanale Bean-to-Bar",
        "hook": "vos gammes de chocolats artisanaux et tablettes pur terroir élaborées au Lamentin à partir d'ingrédients locaux",
        "core_value": "la promotion des filières agricoles martiniquaises et la gourmandise authentique"
    },
    {
        "niche": "Niche 1 - Chocolat Bean-to-Bar & Terroirs",
        "company": "Coopérative Bourbon Pointu",
        "name": "Direction Coopérative Bourbon Pointu",
        "email": "cooperative@cafe-reunion.com",
        "website": "https://coopbourbonpointu.re",
        "source": "Site officiel coopbourbonpointu.re",
        "territory": "La Réunion",
        "category": "Café Rare & Terroirs d'Exception",
        "hook": "votre travail historique de renaissance et de préservation du café Bourbon Pointu, grand cru emblématique de La Réunion",
        "core_value": "la rareté botanique d'un café d'exception mondialement reconnu et l'engagement des producteurs passionnés"
    },
    {
        "niche": "Niche 1 - Chocolat Bean-to-Bar & Terroirs",
        "company": "Domaine du Café Grillé",
        "name": "Direction Domaine du Café Grillé",
        "email": "gestion@domaineducafegrille.fr",
        "website": "https://domaineducafegrille.fr",
        "source": "Site officiel domaineducafegrille.fr",
        "territory": "La Réunion",
        "category": "Café Rare & Terroirs d'Exception",
        "hook": "votre mise en valeur vivante de l'histoire du café réunionnais et la transmission du patrimoine agricole créole",
        "core_value": "l'agrotourisme culturel et l'enracinement des savoir-faire botaniques dans le Sud sauvage"
    },

    # =========================================================================
    # NICHE 3 : COSMÉTIQUE BOTANIQUE TROPICALE & HUILES RARES
    # =========================================================================
    {
        "niche": "Niche 3 - Cosmétique Botanique & Huiles Rares",
        "company": "Genesis Soap",
        "name": "Direction Genesis Soap",
        "email": "contact@genesissoap.fr",
        "website": "https://genesissoap.fr",
        "source": "Site officiel genesissoap.fr",
        "territory": "Guadeloupe",
        "category": "Cosmétique Naturelle & Savonnerie",
        "hook": "vos savons et soins artisanaux saponifiés à froid développés à Trois-Rivières à partir d'huiles végétales pures",
        "core_value": "la naturalité sans concession, la douceur dermatologique et le respect des écosystèmes tropicaux"
    },
    {
        "niche": "Niche 3 - Cosmétique Botanique & Huiles Rares",
        "company": "Les Petits Savons de Steph",
        "name": "Stéphanie et l'équipe",
        "email": "contact@lespetitssavonsdesteph.fr",
        "website": "https://lespetitssavonsdesteph.fr",
        "source": "Site officiel lespetitssavonsdesteph.fr",
        "territory": "Martinique",
        "category": "Cosmétique Naturelle & Savonnerie",
        "hook": "vos créations de savonnerie artisanale et soins naturels pensés et formulés avec passion à Fort-de-France",
        "core_value": "la transparence totale sur les ingrédients et la bienveillance d'une cosmétique faite main"
    },
    {
        "niche": "Niche 3 - Cosmétique Botanique & Huiles Rares",
        "company": "Ti Soap Péï",
        "name": "Direction Ti Soap Péï",
        "email": "info@tisoappei.com",
        "website": "https://tisoappei.re",
        "source": "Site officiel tisoappei.re",
        "territory": "La Réunion",
        "category": "Cosmétique Naturelle & Savonnerie",
        "hook": "votre gamme locale de savons naturels saponifiés à froid et soins enrichis aux plantes médicinales péi au Tampon",
        "core_value": "la préservation des vertus des plantes traditionnelles et l'éco-responsabilité quotidienne"
    },
    {
        "niche": "Niche 3 - Cosmétique Botanique & Huiles Rares",
        "company": "Délicathe",
        "name": "Direction Délicathe",
        "email": "contactdelicathe@gmail.com",
        "website": "https://delicathe.com",
        "source": "Site officiel delicathe.com",
        "territory": "La Réunion",
        "category": "Cosmétique Naturelle & Savonnerie",
        "hook": "vos soins cosmétiques naturels et savons artisanaux élaborés à La Possession dans une démarche éthique et bienveillante",
        "core_value": "le plaisir sensoriel, la pureté des formules et la valorisation du bien-être au naturel"
    },
    {
        "niche": "Niche 3 - Cosmétique Botanique & Huiles Rares",
        "company": "Bio Stratège Guyane",
        "name": "Mariana Royer et l'équipe",
        "email": "info@biostratege.com",
        "website": "https://biostratege.com",
        "source": "Site officiel biostratege.com",
        "territory": "Guyane",
        "category": "Biocosméceutique & Actifs Amazoniens",
        "hook": "vos avancées scientifiques remarquables dans l'éco-extraction et la valorisation des principes actifs de la forêt amazonienne",
        "core_value": "la haute technologie verte, la valorisation durable de la biodiversité et le rayonnement de la Guyane"
    },

    # =========================================================================
    # NICHE 4 : AGRI-TECH & VALORISATION DES BIO-RESSOURCES LOCALES
    # =========================================================================
    {
        "niche": "Niche 4 - Agri-Tech & Bio-Ressources",
        "company": "Sargawatt",
        "name": "Direction Sargawatt",
        "email": "contact@sargawatt.fr",
        "website": "https://sargawatt.com",
        "source": "Site officiel sargawatt.com",
        "territory": "Martinique",
        "category": "Valorisation de la Biomasse & Énergie",
        "hook": "vos solutions innovantes de traitement, séchage et transformation industrielle des algues sargasses en Martinique",
        "core_value": "la transformation d'un fléau écologique en opportunité économique et industrielle vertueuse"
    },
    {
        "niche": "Niche 4 - Agri-Tech & Bio-Ressources",
        "company": "ACP Environnement",
        "name": "Direction ACP Environnement",
        "email": "contact@acpenvironnement.org",
        "website": "https://acpenvironnement.org",
        "source": "Site officiel acpenvironnement.org",
        "territory": "Martinique",
        "category": "Valorisation des Déchets Organiques & Compostage",
        "hook": "vos projets engagés d'économie circulaire, de valorisation organique et de protection des sols aux Antilles",
        "core_value": "la régénération écologique locale et la gestion durable des cycles de matière"
    },
    {
        "niche": "Niche 4 - Agri-Tech & Bio-Ressources",
        "company": "Naturaform",
        "name": "Direction Naturaform",
        "email": "contact@naturaform.re",
        "website": "https://naturaform.re",
        "source": "Site officiel naturaform.re",
        "territory": "La Réunion",
        "category": "Micro-algues & Compléments Naturels",
        "hook": "votre culture de spiruline péi de haute qualité et le développement de super-aliments nutritifs au Port à La Réunion",
        "core_value": "l'autonomie nutritionnelle locale, la traçabilité irréprochable et la vitalité naturelle"
    },
    {
        "niche": "Niche 4 - Agri-Tech & Bio-Ressources",
        "company": "Run Spirit",
        "name": "Direction Run Spirit",
        "email": "contact@runspirit.re",
        "website": "https://runspirit.re",
        "source": "Site officiel runspirit.re",
        "territory": "La Réunion",
        "category": "Micro-algues & Compléments Naturels",
        "hook": "vos bassins de spiruline artisanale séchée à basse température sous le soleil de Sainte-Marie",
        "core_value": "la pureté des procédés solaires et la concentration optimale en nutriments essentiels"
    },
    {
        "niche": "Niche 4 - Agri-Tech & Bio-Ressources",
        "company": "Parc Aquacole de Guadeloupe",
        "name": "Direction Parc Aquacole",
        "email": "info@parc-aquacole.fr",
        "website": "https://parc-aquacole.fr",
        "source": "Site officiel parc-aquacole.fr",
        "territory": "Guadeloupe",
        "category": "Aquaculture Durable & Écotourisme",
        "hook": "votre modèle exemplaire d'aquaculture d'eau douce responsable et de valorisation écotouristique à Pointe-Noire",
        "core_value": "l'harmonie entre production aquacole saine et sensibilisation active du grand public"
    },
    {
        "niche": "Niche 4 - Agri-Tech & Bio-Ressources",
        "company": "Aquasearch",
        "name": "Direction Aquasearch",
        "email": "contact@aquasearch.fr",
        "website": "https://aquasearch.fr",
        "source": "Site officiel aquasearch.fr",
        "territory": "Martinique",
        "category": "Bio-Ressources Marines & Ingénierie",
        "hook": "vos expertises pointues en écologie marine, suivi de la biodiversité tropicale et ingénierie aquacole au Robert",
        "core_value": "la rigueur scientifique et l'innovation appliquée à la préservation du milieu marin caribéen"
    }
]

def main():
    print(f"=== TEST DES CANDIDATS BATCH 76 NICHES SPÉCIALISÉES ({len(CANDIDATES)} cibles) ===")
    validated = []
    
    for c in CANDIDATES:
        email = c['email'].lower().strip()
        comp = c['company']
        
        is_dup, reason = is_domain_or_company_duplicate(email, comp)
        if is_dup:
            print(f"[REJET DEDUP] {comp} <{email}> : {reason}")
            continue
            
        ok, diag = verify_email_target(email)
        if not ok:
            print(f"[REJET MX] {comp} <{email}> : {diag}")
            continue
            
        print(f"[VALIDE 100%] {comp} <{email}> ({c['territory']} | {c['niche']})")
        validated.append(c)

    print(f"\nTotal Validés 100% : {len(validated)} / {len(CANDIDATES)}")
    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "batch_76_niches_specialisees.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(validated, f, ensure_ascii=False, indent=2)
    print(f"Sauvegardé dans : {out_file}")

if __name__ == "__main__":
    main()
