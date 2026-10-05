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

# BATCH 51 — PME & PMI INDUSTRIELLES, BOIS, AGROALIMENTAIRE, NAUTISME & INFRASTRUCTURES OUTRE-MER (10 CIBLES ULTRA-QUALIFIEES)
# Regle d'or : Zero mensonge, Zero deux-points (:), Zero guessing, MX verifie
LEADS = [
    {
        "company": "CNOI Chantier Naval de l'Ocean Indien",
        "email": "cnoi@cnoi.info",
        "territory": "Ocean Indien (La Reunion)",
        "source": "https://cnoi.info",
        "subject": "Souverainete maritime et reparation navale dans le bassin Ocean Indien / CNOI",
        "body": """Madame, Monsieur,

Le Chantier Naval de l'Ocean Indien represente une infrastructure strategique incontournable pour l'entretien, la reparation et la modernisation de la flotte de peche, marchande et scientifique dans tout le bassin sud-ouest de l'ocean Indien.

Je prends attache avec votre equipe au nom de Domtom Connect. Nous pilotons une plateforme professionnelle et un reseau d'affaires dedies a la mise en relation des acteurs economiques et industriels d'Outre-mer, du continent africain et de la diaspora, portee par l'application DTC Pulse.

Le dynamisme des metiers maritimes et le maintien en condition operationnelle des unites navales sont au coeur des priorites de developpement economique de nos regions littorales.

Dans le cadre de nos liaisons avec les filieres maritimes et logistiques, nous serions ravis de convenir d'un court entretien avec votre direction pour identifier d'eventuels ponts de collaboration.

Serait-il envisageable de caler un bref appel de dix minutes selon vos disponibilites ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chantier Naval du Pacifique Sud CNPS",
        "email": "cnps@mail.pf",
        "territory": "Polynesie francaise (Fare Ute - Papeete)",
        "source": "https://cnps.pf",
        "subject": "Entretien naval et perennite de la flotte insulaire en Polynesie / CNPS",
        "body": """Madame, Monsieur,

L'activite de chantier naval de CNPS a Fare Ute remplit une mission determinante pour le maintien et la renovation de la flottille polynesienne, qu'il s'agisse de la peche professionnelle, du cabotage inter-iles ou du nautisme.

Je me permets de vous ecrire au nom de Domtom Connect. Nous animons une plateforme de mise en relation d'affaires et une communaute numerique regroupant les dirigeants, artisans industriels et entrepreneurs d'Outre-mer, du continent africain et de la diaspora, couplee a l'application mobile DTC Pulse.

La logistique technique, l'approvisionnement en pieces certifiees et la gestion du carenage en milieu insulaire eloigne requierent un savoir-faire d'adaptation remarquable.

Nous serions tres heureux de pouvoir echanger brievement avec votre direction afin d'envisager des synergies et de faire decouvrir nos initiatives a votre equipe.

Pourrions-nous fixer un court creneau telephonique de dix minutes d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Huilerie de Tahiti",
        "email": "contact@huileriedetahiti.pf",
        "territory": "Polynesie francaise (Papeete)",
        "source": "https://huileriedetahiti.pf",
        "subject": "Transformation industrielle du coprah et filiere Monoi de Tahiti A.O. / Huilerie de Tahiti",
        "body": """Madame, Monsieur,

L'outil industriel de l'Huilerie de Tahiti remplit un role fondamental dans l'equilibre socio-economique des archipels du fenua en valorisant la production de coprah et en garantissant la reference mondiale du Monoi de Tahiti Appellation d'Origine.

Je me permets de vous joindre au nom de Domtom Connect. Nous animons un reseau d'affaires et une communaute numerique rassemblant les dirigeants d'entreprises, industriels et decideurs ultramarins, en Afrique et dans la diaspora, couplee a l'application mobile DTC Pulse.

La transformation locale de matieres premieres insulaires et la montee en gamme a l'international constituent des enjeux strategiques partages par l'ensemble de nos territoires d'Outre-mer.

Nous serions tres honores de pouvoir echanger brievement avec votre direction sur vos projets et identifier comment notre plateforme d'affaires peut valoriser votre ecosysteme.

Seriez-vous disponibles pour un court point telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CIENC Eaux du Mont-Dore",
        "email": "contact@cienc.nc",
        "territory": "Nouvelle-Caledonie (Mont-Dore)",
        "source": "https://fontainesdeaudumontdore.nc",
        "subject": "Embouteillage local et autonomie industrielle caledonienne / CIENC",
        "body": """Madame, Monsieur,

La Compagnie Internationale des Eaux de Nouvelle-Caledonie et son usine du Mont-Dore assurent un service essentiel pour l'autonomie et le bien-etre quotidien des foyers et entreprises du territoire.

Je vous adresse ce message au nom de Domtom Connect avec un profond esprit de solidarite economique et industrielle. Nous developpons une plateforme d'affaires et une communaute numerique mobilisant les chefs d'entreprise et industriels d'Outre-mer, d'Afrique et de la diaspora, avec le soutien de l'application DTC Pulse.

A l'heure ou la Nouvelle-Caledonie doit relever des defis considerables de stabilisation et de reconstruction de son tissu productif, le soutien aux outils industriels de base est capital.

Nous serions tres honores de pouvoir echanger brievement avec votre direction pour vous presenter notre demarche et voir comment notre reseau peut apporter son soutien aux filieres locales.

Pourrions-nous convenir d'un court creneau telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Scierie Oyapock",
        "email": "office.scierie@scierieoyapock.fr",
        "territory": "Guyane (Saint-Georges-de-l'Oyapock)",
        "source": "https://scierieoyapock973.fr",
        "subject": "Valorisation de la filiere bois amazonienne et materiaux durables / Scierie Oyapock",
        "body": """Madame, Monsieur,

L'activite d'exploitation et de sciage de la Scierie Oyapock a Saint-Georges constitue un maillon exemplaire pour transformer durablement les bois d'oeuvre de Guyane et approvisionner les batisseurs de notre region.

Je prends contact avec vous au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique federant les chefs d'entreprise, industriels et artisans d'Outre-mer, d'Afrique et de la diaspora, relayee par l'application DTC Pulse.

La souverainete en materiaux biosources tropicaux et la maitrise des chaines d'approvisionnement forestieres representent des piliers de croissance pour nos economies equatoriales.

Nous serions ravis de solliciter quelques minutes d'echange telephonique avec votre direction afin de faire connaissance et d'etudier comment notre reseau d'affaires peut soutenir le rayonnement de vos productions.

Seriez-vous disponibles pour un court appel de dix minutes dans les jours a venir ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Matouba Eaux de Source",
        "email": "matouba@matouba.fr",
        "territory": "Guadeloupe (Saint-Claude)",
        "source": "https://www.matouba.fr",
        "subject": "Industrie agroalimentaire et embouteillage d'eau de source guadeloupeenne / Matouba",
        "body": """Madame, Monsieur,

La mise en valeur et l'embouteillage de l'eau de source au pied de la Soufriere par Matouba incarnent un savoir-faire industriel essentiel a l'equilibre et a la consommation quotidienne des Guadeloupéens.

Je vous contacte au nom de Domtom Connect. Notre plateforme d'affaires et notre communaute professionnelle connectent les decideurs economiques, transformateurs et industriels d'Outre-mer, d'Afrique et de la diaspora, avec l'appui de notre application mobile DTC Pulse.

Dans un contexte ou la valorisation des ressources locales et l'optimisation des chaines de distribution insulaires sont primordiales, nous nous attachons a creer des ponts d'affaires concrets et de la visibilite pour nos marques emblematiques.

Nous serions tres heureux de convenir d'un court entretien telephonique avec vos responsables pour echanger sur vos perspectives et presenter nos actions.

Auriez-vous dix minutes a nous accorder d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MayTP Mayotte BTP",
        "email": "contact@maytp.fr",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://maytp.fr",
        "subject": "Infrastructures travaux publics et terrassement a Mayotte / MayTP",
        "body": """Madame, Monsieur,

Les chantiers conduits par MayTP dans le terrassement, la voirie et l'amenagement des reseaux repondent aux defis cruciaux d'equipement et de modernisation des infrastructures sur l'ile de Mayotte.

Je me permets de prendre contact avec votre direction au nom de Domtom Connect. Nous animons un reseau d'affaires et une communaute numerique mobilisant les chefs d'entreprise, entrepreneurs du BTP et acteurs de terrain ultramarins, en Afrique et dans la diaspora, couplee a l'application mobile DTC Pulse.

Le developpement des reseaux territoriaux et l'adaptation des methodes constructives aux contraintes climatiques et insulaires mahoraises appellent un engagement operationnel de premier ordre.

Nous serions tres honores de pouvoir echanger brievement avec votre direction sur vos defis actuels et identifier d'eventuelles synergies utiles pour vos marches.

Pourrions-nous caler un court creneau telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "FINC Federation des Industries de Nouvelle-Caledonie",
        "email": "accueil@finc.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "source": "https://finc.nc",
        "subject": "Soutien et synergies pour la production industrielle en Nouvelle-Caledonie / FINC",
        "body": """Madame, Monsieur,

L'action menee par la FINC pour defendre, accompagner et structurer les industries de transformation caledoniennes est plus que jamais decisive pour la survie et la relance du tissu productif local.

Je vous contacte au nom de Domtom Connect dans un esprit de solidarite economique et de cooperation active entre territoires ultramarins. Nous developpons une plateforme d'affaires et un reseau professionnel mobilisant les industriels et dirigeants d'Outre-mer, du continent africain et de la diaspora, soutenue par l'application DTC Pulse.

Face aux epreuves economiques et logistiques que traversent les usines et ateliers du Caillou, nous souhaitons mettre notre reseau au service de la visibilite, du plaidoyer et des debouches de vos adherents.

Nous serions tres honores de convenir d'un court echange avec votre equipe de direction pour vous exposer notre demarche et envisager comment etre utiles aux industriels caledoniens.

Seriez-vous disponibles pour un bref appel de dix minutes selon vos disponibilites ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Fenua Ma Syndicat Traitement Dechets",
        "email": "accueil@fenuama.pf",
        "territory": "Polynesie francaise (Papeete)",
        "source": "https://fenuama.pf",
        "subject": "Gestion des dechets et economie circulaire insulaire en Polynesie / Fenua Ma",
        "body": """Madame, Monsieur,

Le travail technique accompli par Fenua Ma pour le tri, la valorisation et le traitement des dechets dans les iles de Polynesie francaise est exemplaire au regard des contraintes geographiques insulaires.

Je prends attache avec votre equipe au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique reliant les acteurs economiques, industriels et gestionnaires de services environnementaux d'Outre-mer, d'Afrique et de la diaspora, portee par l'application DTC Pulse.

Les solutions d'eco-gestion et de recyclage en milieu tropical et oceanique constituent une priorite absolue partagee par l'ensemble de nos territoires ultramarins.

Nous serions ravis de solliciter un court creneau d'echange telephonique avec votre direction afin d'envisager des partages d'experience et des perspectives utiles au sein de notre reseau.

Pourrions-nous convenir d'un rendez-vous telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Brasserie de Tahiti Hinano",
        "email": "hinano@mail.pf",
        "territory": "Polynesie francaise (Papeete)",
        "source": "https://brasseriedetahiti.com",
        "subject": "Fleuron agro-industriel et rayonnement economique du fenua / Brasserie de Tahiti",
        "body": """Madame, Monsieur,

La Brasserie de Tahiti et son emblématique marque Hinano incarnent depuis plus d'un siecle la reussite industrielle, l'innovation continue et le rayonnement culturel et commercial de la Polynesie francaise.

Je me permets de vous contacter au nom de Domtom Connect. Nous batissons une plateforme d'affaires et une communaute numerique reliant les capitaines d'industrie, transformateurs et porteurs de marques d'Outre-mer, du continent africain et de la diaspora, avec l'appui de notre application mobile DTC Pulse.

Le maintien d'un haut niveau d'exigence qualitatif et logistique a grande distance des approvisionnements mondiaux force l'admiration de l'ensemble des acteurs ultramarins.

Dans le cadre du renforcement de nos synergies avec les leaders industriels de nos territoires, nous serions tres honores de pouvoir echanger brievement avec votre direction sur vos perspectives.

Serait-il possible de fixer un court appel telephonique de dix minutes ces prochains jours ?

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
    return {"emails": [], "domains": [], "companies": []}

def save_contacts_db(db):
    with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def add_lead_to_db(db, lead):
    email = lead["email"].lower().strip()
    domain = email.split("@")[1]
    company = lead["company"].strip()
    
    if email not in db.get("emails", []):
        db.setdefault("emails", []).append(email)
    if domain not in db.get("domains", []):
        db.setdefault("domains", []).append(domain)
    if company not in db.get("companies", []):
        db.setdefault("companies", []).append(company)

def verify_lead_safety(lead):
    # Verif 1: Aucun deux-points (:) dans le sujet ni le corps
    if ":" in lead["subject"]:
        raise ValueError(f"Interdit - Deux-points detecte dans le sujet pour {lead['company']}")
    if ":" in lead["body"]:
        raise ValueError(f"Interdit - Deux-points detecte dans le corps pour {lead['company']}")
    
    # Verif 2: Verification DNS / MX
    is_valid, msg = verify_email_target(lead["email"])
    if not is_valid:
        raise ValueError(f"Echec verification DNS/MX pour {lead['email']} - {msg}")
    
    # Verif 3: Deduplication temps reel
    is_dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
    if is_dup:
        raise ValueError(f"Doublon detecte pour {lead['company']} ({lead['email']}) - {reason}")
    
    return True

def run_batch():
    print(f"=== DEMARRAGE DU BATCH 51 (PME & PMI INDUSTRIE, BOIS, AGRO, MARITIME) - {len(LEADS)} CIBLES ===")
    
    # Phase 1: Validation pre-vol de securite
    print("\n--- Phase 1 - Validation DNS, MX, Deduplication et Conformite de Style ---")
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
                sleep_time = random.uniform(13.0, 18.0)
                print(f" -> Temporisation securisee de {sleep_time:.1f} secondes (tranquille)...")
                time.sleep(sleep_time)

    print(f"\n=== BATCH 51 TERMINE - {sent_count}/{len(LEADS)} EMAILS ENVOYES AVEC SUCCES ===")

if __name__ == "__main__":
    run_batch()
