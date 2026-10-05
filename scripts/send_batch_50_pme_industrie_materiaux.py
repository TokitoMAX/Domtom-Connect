import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# BATCH 50 — PME & PMI INDUSTRIELLES, METALLURGIE, MATERIAUX & BTP SPECIALISE (10 CIBLES ULTRA-QUALIFIEES)
# Regle d'or : Zero mensonge, Zero deux-points (:), Zero guessing, MX verifie
LEADS = [
    {
        "company": "Plastiserd Polynesie",
        "email": "plastiserd@plastiserd.pf",
        "territory": "Polynesie Francaise (Papeete)",
        "source": "https://www.plastiserd.pf",
        "subject": "Transformation industrielle et solutions d'emballage insulaire / Plastiserd",
        "body": """Madame, Monsieur,

Plastiserd constitue un pilier industriel incontournable du fenua, permettant a l'ensemble des producteurs et artisans de Polynesie francaise d'acceder a des solutions d'emballage et de plasturgie de qualite.

Je vous contacte au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique mobilisant les chefs d'entreprise, industriels et acteurs de terrain ultramarins, en Afrique et dans la diaspora, couplee a l'application mobile DTC Pulse.

Faire tourner un outil industriel a des milliers de kilometres des grands centres d'approvisionnement exige une maitrise constante de l'anticipation logistique, de la maintenance des lignes et des defis d'eco-responsabilite.

Dans le cadre de nos travaux avec les PMI insulaires, nous serions tres honores de pouvoir echanger brievement avec votre direction sur vos defis operationnels et envisager des synergies utiles pour votre marque.

Seriez-vous disponibles pour un court appel telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Tokuyama Nouvelle Caledonie",
        "email": "direction@tokuyama.nc",
        "territory": "Nouvelle-Caledonie (Noumea - Numbo)",
        "source": "https://www.tokuyama.nc",
        "subject": "Production cimentiere locale et autonomie des batisseurs caledoniens / Tokuyama NC",
        "body": """Madame, Monsieur,

L'usine Tokuyama en Baie de Numbo joue un role souverain pour l'economie de la Nouvelle-Caledonie, garantissant aux professionnels de la construction et des travaux publics un ciment de qualite produit sur place.

Je me permets de vous contacter au nom de Domtom Connect avec un message de solidarite industrielle et de cooperation economique. Nous animons un reseau d'affaires et une plateforme professionnelle reliant les dirigeants de PMI et PME des territoires d'Outre-mer, d'Afrique et de la diaspora, portee par l'application DTC Pulse.

Face aux defis majeurs de reconstruction et de perennite des filieres de base caledoniennes, nous cherchons a batir des cooperations durables et a valoriser les savoir-faire techniques indispensables de nos territoires.

Nous serions tres heureux de solliciter un court creneau d'echange avec votre direction afin de faire connaissance et de voir comment notre reseau d'affaires peut soutenir les acteurs de votre secteur.

Pourrions-nous convenir d'un court creneau telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "La Brique de Guyane B2TG",
        "email": "info@labriquedeguyane.com",
        "territory": "Guyane (Matoury)",
        "source": "https://www.labriquedeguyane.com",
        "subject": "Eco-materiaux amazoniens et construction durable / La Brique de Guyane",
        "body": """Madame, Monsieur,

La Brique de Guyane demontre avec excellence qu'il est possible d'allier valorisation des matieres premieres locales, performance thermique et diminution drastique de l'empreinte carbone dans le secteur de la construction.

Je prends attache avec vous au nom de Domtom Connect. Nous batissons une communaute numerique et une plateforme d'affaires dediee aux entrepreneurs et industriels d'Outre-mer, du continent africain et de la diaspora, grace a notre application mobile DTC Pulse.

Le developpement des materiaux biosources et georésilients en climat tropical equatorial est un sujet prioritaire pour nos territoires confrontes a l'inflation des couts d'importation.

Nous aimerions vivement echanger avec votre direction sur vos perspectives de croissance et voir comment notre plateforme peut vous apporter des opportunites d'affaires et de visibilite etendues.

Serait-il possible de caler dix minutes d'echange telephonique d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SOMACO Mayotte",
        "email": "somaco@maharajah.fr",
        "territory": "Mayotte (Mamoudzou - Kaweni)",
        "source": "https://www.somaco-online.fr",
        "subject": "Disponibilite des materiaux et approvisionnements du BTP mahorais / SOMACO",
        "body": """Madame, Monsieur,

La SOMACO occupe une position centrale a Mayotte pour fournir aux entreprises, artisans et particuliers les equipements, materiaux et quincailleries indispensables aux chantiers de l'ile.

Je me permets de vous ecrire au nom de Domtom Connect. Nous federons un reseau professionnel et une plateforme d'affaires collaborative reliant les PME et PMI des Outre-mer, d'Afrique et de la diaspora, couplee a l'application mobile DTC Pulse.

Dans un contexte de forte tension sur les transports maritimes et de besoins considerables en infrastructures a Mayotte, la fluidification des chaines d'approvisionnement et la solidarite interentreprises sont au coeur de nos preoccupations.

Nous serions tres honores de pouvoir echanger avec votre direction afin de presenter nos actions et d'envisager des synergies utiles au sein de notre reseau.

Auriez-vous dix minutes a nous consacrer pour un echange telephonique informel ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Karib Profils",
        "email": "contact@karibprofils.fr",
        "territory": "Martinique (Le Robert)",
        "source": "https://www.karibprofils.fr",
        "subject": "Ossatures metalliques et solutions anticycloniques / Karib Profils",
        "body": """Madame, Monsieur,

Karib Profils realise un travail remarquable au Robert pour concevoir et profiler des structures metalliques de haute qualite, parfaitement adaptees aux exigences sismiques et cycloniques de nos regions insulaires.

Je vous contacte au nom de Domtom Connect. Nous animons une plateforme d'affaires et une communaute professionnelle mobilisant les dirigeants de PME, industriels et artisans des Outre-mer, d'Afrique et de la diaspora, portee par l'application DTC Pulse.

L'autonomie technique de nos territoires repose sur des capacites de profilage et de fabrication sur mesure comme les votres, capables de repondre rapidement aux chantiers locaux sans dependre des delais transatlantiques.

Nous serions ravis de faire votre connaissance et d'echanger sur vos projets de developpement, tout en etudiant comment notre reseau peut vous apporter de nouvelles opportunites B2B.

Seriez-vous disponibles pour un court creneau telephonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Caraibes Profils Numerique CPN",
        "email": "contact@cpnfwi.com",
        "territory": "Guadeloupe (Baie-Mahault - Jarry)",
        "source": "https://www.cpnfwi.com",
        "subject": "Innovation en ossature acier leger et industrialisation / CPN Guadeloupe",
        "body": """Madame, Monsieur,

CPN apporte une reponse industrielle moderne et performante aux defis de construction en Guadeloupe grace a ses procedes d'ossatures en acier leger fabriquees directement a Jarry.

Je me permets de vous contacter au nom de Domtom Connect. Nous avons mis en place une plateforme d'affaires et une communaute numerique dediee aux acteurs economiques et industriels d'Outre-mer, d'Afrique et de la diaspora, s'appuyant sur notre application mobile DTC Pulse.

La rapidite de mise en oeuvre, la modularite et la resistance mecanique de vos procedes repondent parfaitement aux attentes des constructeurs et promoteurs confrontes aux delais et couts insulaires.

Nous aimerions beaucoup solliciter un bref moment d'echange avec votre equipe dirigeante pour decouvrir vos enjeux actuels et envisager des passerelles d'affaires prometteuses.

Pourrions-nous convenir d'un court creneau telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SAMIR Industrie",
        "email": "contact@samir-martinique.fr",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.samir-martinique.fr",
        "subject": "Menuiserie aluminium industrielle et fermetures de batiment / SAMIR Industrie",
        "body": """Madame, Monsieur,

SAMIR Industrie est une reference industrielle majeure aux Antilles, alliant maitrise technologique de l'aluminium, fabrication sur mesure et reponse aux standards architecturaux les plus rigoureux.

Je prends contact avec vous au nom de Domtom Connect. Nous batissons une plateforme d'affaires et un reseau professionnel collaboratif reliant les industriels et dirigeants de PME des Outre-mer, du continent africain et de la diaspora, adossee a l'application mobile DTC Pulse.

Le travail des metaux et des fermetures industrielles sous climat marin tropical impose une expertise de pointe et une logistique d'approvisionnement en profiles particulierement agile.

Nous serions tres honores de pouvoir echanger avec votre direction sur vos dynamiques d'activite et d'evaluer les opportunites de collaboration au sein de notre communaute.

Auriez-vous dix minutes a nous accorder pour un echange telephonique d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "L'Atelier SAGIP",
        "email": "contact@lateliersagip.com",
        "territory": "Martinique (Le Lamentin)",
        "source": "https://www.lateliersagip.com",
        "subject": "Profiles PVC et habillage durable du batiment tropical / L'Atelier SAGIP",
        "body": """Madame, Monsieur,

L'Atelier SAGIP accomplit un role essentiel en Martinique pour fabriquer et distribuer des solutions en PVC, faux-plafonds et revetements resistants aux agressions de l'humidite et de la salinite tropicale.

Je vous adresse ce message au nom de Domtom Connect. Nous structurons une communaute numerique et un reseau d'affaires mobilisant les entrepreneurs et transformateurs d'Outre-mer, d'Afrique et de la diaspora, a travers notre application DTC Pulse.

Notre projet a pour vocation de favoriser le reflexe de production locale et de decloisonner les relations d'affaires entre producteurs de nos differentes regions ultramarines.

Nous serions ravis de faire connaissance avec votre equipe et de voir comment notre plateforme peut soutenir la mise en relation avec de nouveaux donneurs d'ordre.

Seriez-vous disponibles pour un court appel telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Mecanique Precision Antilles MPA",
        "email": "mpa.secretaire@gmail.com",
        "territory": "Guadeloupe (Baie-Mahault - Jarry)",
        "source": "https://www.mecanique-precision-antilles.com",
        "subject": "Usinage de precision et maintenance industrielle / MPA Guadeloupe",
        "body": """Madame, Monsieur,

Mecanique Precision Antilles constitue un maillon vital de l'ecosysteme industriel guadeloupeen, apportant des reponses techniques sur mesure en tournage, fraisage et refection de pieces mecaniques d'urgence.

Je me permets de vous contacter au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute professionnelle dediee aux dirigeants de PME et PMI des Outre-mer, d'Afrique et de la diaspora, accompagnee de l'application DTC Pulse.

Pour les entreprises de production et de travaux publics, la reactivite d'un atelier d'usinage local est indispensable pour eviter l'arret des machines lie a l'attente de pieces detachees depuis l'Hexagone.

Nous serions tres heureux de solliciter un court entretien telephonique avec votre direction afin de faire connaissance et d'envisager des pistes de mise en avant aupres des industriels de notre reseau.

Pourrions-nous convenir d'un court creneau telephonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "COGEDAL Le Meunier de Bourbon",
        "email": "contact@cogedal.re",
        "territory": "La Reunion (Saint-Pierre)",
        "source": "https://www.lemeunierdebourbon.re",
        "subject": "Meunerie industrielle et securite alimentaire pei / COGEDAL",
        "body": """Madame, Monsieur,

La COGEDAL assure une mission strategique de premier plan pour La Reunion en garantissant la transformation meuniere et la disponibilite quotidienne de farines indispensables aux boulangers et industriels de l'ile.

Je prends l'initiative de vous contacter au nom de Domtom Connect. Nous animons un reseau d'affaires et une communaute numerique mobilisant les chefs d'entreprise et transformateurs des territoires ultramarins, en Afrique et dans la diaspora, soutenus par l'application mobile DTC Pulse.

La resilience agroalimentaire insulaire, la securisation des stocks de cereales face aux aleas maritimes et le maintien de la qualite artisanale sont des sujets au coeur de nos reflexions operationnelles.

Nous serions tres honores de pouvoir echanger avec votre equipe sur vos chantiers de developpement et explorer les opportunites de synergie avec notre reseau professionnel.

Seriez-vous ouverts a un court echange telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def load_contacts_db():
    if os.path.exists(CONTACTS_DB_FILE):
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"domains": [], "contacts": []}

def save_contacts_db(db):
    db["total_contacts"] = len(db.get("contacts", []))
    db["total_domains"] = len(db.get("domains", []))
    with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def add_lead_to_db(db, lead):
    email = lead["email"]
    domain = email.split("@")[1].lower()
    if "domains" not in db:
        db["domains"] = []
    if "contacts" not in db:
        db["contacts"] = []
        
    if domain not in db["domains"]:
        db["domains"].append(domain)
        
    exists = any(c.get("email", "").lower() == email.lower() for c in db["contacts"])
    if not exists:
        db["contacts"].append({
            "company": lead["company"],
            "email": email,
            "territory": lead["territory"],
            "source": lead["source"],
            "date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "batch": 50
        })

def verify_lead_safety(lead):
    # Verif 1: Pas de deux-points dans le corps et l'objet
    if ":" in lead["subject"]:
        raise ValueError(f"Interdit: Deux-points detecte dans l'objet pour {lead['company']}")
    if ":" in lead["body"]:
        raise ValueError(f"Interdit: Deux-points detecte dans le corps pour {lead['company']}")
    
    # Verif 2: Verification DNS / MX
    is_valid, msg = verify_email_target(lead["email"])
    if not is_valid:
        raise ValueError(f"Echec verification DNS/MX pour {lead['email']}: {msg}")
    
    # Verif 3: Deduplication temps reel
    is_dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
    if is_dup:
        raise ValueError(f"Doublon detecte pour {lead['company']} ({lead['email']}): {reason}")
    
    return True

def run_batch():
    print(f"=== DEMARRAGE DU BATCH 50 (PME & PMI INDUSTRIE / MATERIAUX) : {len(LEADS)} CIBLES ===")
    
    # Phase 1: Validation pre-vol de securite
    print("\n--- Phase 1: Validation DNS, MX, Deduplication et Conformite de Style ---")
    for idx, lead in enumerate(LEADS, 1):
        try:
            verify_lead_safety(lead)
            print(f"[{idx}/{len(LEADS)}] OK - {lead['company']} ({lead['email']}) valide")
        except Exception as e:
            print(f"[{idx}/{len(LEADS)}] ERREUR CRITIQUE - {e}")
            sys.exit(1)
            
    print("\nValidation pre-vol 100% reussie. Connexion au serveur SMTP Gmail...")
    
    db = load_contacts_db()
    context = ssl.create_default_context()
    sent_count = 0
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP etablie avec succes.\n")
        
        for idx, lead in enumerate(LEADS, 1):
            recipient = lead["email"]
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            print(f"[{idx}/{len(LEADS)}] Envoi a {lead['company']} ({recipient})...")
            server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
            print(f" -> DELIVRE avec succes a {recipient}")
            
            # Enregistrement immediat
            add_lead_to_db(db, lead)
            save_contacts_db(db)
            sent_count += 1
            
            if idx < len(LEADS):
                sleep_time = random.uniform(13.0, 17.5)
                print(f" -> Temporisation securisee de {sleep_time:.1f} secondes...")
                time.sleep(sleep_time)

    print(f"\n=== BATCH 50 TERMINE : {sent_count}/{len(LEADS)} EMAILS ENVOYES AVEC SUCCES ===")

if __name__ == "__main__":
    run_batch()
