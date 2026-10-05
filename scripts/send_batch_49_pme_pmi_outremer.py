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

# BATCH 49 — PME ET PMI INDUSTRIELLES ET AGROALIMENTAIRES PAN-OUTRE-MER (10 CIBLES ULTRA-QUALIFIEES)
# Regle d'or : Zero mensonge, Zero deux-points (:), Zero guessing, MX verifie
LEADS = [
    {
        "company": "Bourbon Packaging",
        "email": "contact@bourbonpackaging.com",
        "territory": "La Reunion (Bras-Panon)",
        "source": "https://www.bourbonpackaging.com",
        "subject": "Approvisionnements industriels et emballages responsables / Bourbon Packaging",
        "body": """Madame, Monsieur,

Bourbon Packaging accomplit un role industriel strategique a La Reunion, garantissant la continuite des emballages souples et papier indispensables aux producteurs et transformateurs de toute l'ile.

Je me permets de vous contacter au nom de Domtom Connect. Nous animons une plateforme d'affaires et une communaute numerique regroupant les dirigeants de PME, industriels et acteurs de terrain ultramarins, en Afrique et dans la diaspora, couplee a l'application mobile DTC Pulse.

En tant qu'industriel insulaire confronte a l'acheminement des matieres premieres, aux contraintes de fret maritime et aux imperatifs d'eco-conception, votre retour d'experience sur la regulation des chaines de valeur locales est extremement precieux.

Dans le cadre de nos echanges avec les dirigeants de nos territoires, nous serions ravis de faire connaissance et de voir comment notre reseau peut soutenir le rayonnement de vos solutions d'emballage durable.

Seriez-vous disponibles pour un court echange telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SOPRODEC Guadeloupe",
        "email": "guadeloupe@soprodec.com",
        "territory": "Guadeloupe (Baie-Mahault - Jarry)",
        "source": "https://www.soprodec.com",
        "subject": "Equipements d'hygiene professionnelle et distribution insulaire / SOPRODEC",
        "body": """Madame, Monsieur,

SOPRODEC est devenue une reference incontournable pour les professionnels de Guadeloupe en matiere de produits d'hygiene, d'entretien et d'equipements professionnels adaptes aux normes tropicales.

Je prends contact avec vous au nom de Domtom Connect. Nous avons concu une plateforme d'affaires et une communaute dediee aux entrepreneurs et industriels des Outre-mer, d'Afrique et de la diaspora, portee par notre application DTC Pulse.

Diriger une structure de distribution et de transformation en milieu insulaire exige une maitrise permanente des flux logistiques, des stocks critiques et des relations fournisseurs maritimes.

Nous aimerions vivement solliciter un moment d'echange avec votre direction pour decouvrir vos enjeux d'expansion et envisager des passerelles utiles au sein de notre reseau B2B.

Auriez-vous dix minutes a nous consacrer pour un echange telephonique informel ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Bio Savane Guyane",
        "email": "bio.savane@gmail.com",
        "territory": "Guyane (Macouria)",
        "source": "https://www.biosavane.com",
        "subject": "Valorisation des filieres agricoles locales et agroalimentaire / Bio Savane",
        "body": """Madame, Monsieur,

Bio Savane represente une initiative remarquable de structuration agricole et de transformation locale en Guyane, valorisant le potentiel immense de la biodiversite et des productions de notre terroir amazonien.

Je me permets de vous ecrire au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique mobilisant les entrepreneurs, cooperatives et transformateurs d'Outre-mer, d'Afrique et de la diaspora, connectes via notre application DTC Pulse.

Notre mission est d'encourager la souverainete alimentaire, l'economie circulaire et la visibilite des marques locales au-dela de leurs bassins de production.

Nous serions tres honores de pouvoir echanger avec votre equipe sur vos chantiers de developpement et de reflechir aux synergies commerciales que notre plateforme peut faciliter pour vos productions.

Pourrions-nous caler un court creneau telephonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Imprimah Mayotte",
        "email": "contact@imprimah.com",
        "territory": "Mayotte (Mamoudzou - Kaweni)",
        "source": "https://www.imprimah.com",
        "subject": "Solutions d'impression industrielle et communication locale / Imprimah Mayotte",
        "body": """Madame, Monsieur,

Imprimah joue un role cle dans le dynamisme economique de Mayotte en fournissant aux entreprises, administrations et artisans des solutions graphiques et d'impression industrielle de proximite.

Je vous contacte au nom de Domtom Connect. Nous animons un reseau d'affaires et une communaute professionnelle reliant les PME et PMI ultramarines, du continent africain et de la diaspora, grace a notre application mobile DTC Pulse.

Les enjeux de delais de fabrication, de maintenance technique des presses et de continuite des approvisionnements en papier sous contrainte insulaire font la realite quotidienne de vos equipes.

Nous serions ravis de faire votre connaissance et de discuter des opportunites d'echange et de cooperation commerciale que notre reseau peut apporter a votre etablissement.

Seriez-vous disponibles pour un court appel telephonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Biscochoc Nouvelle Caledonie",
        "email": "biscochoc@biscochoc.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "source": "https://www.biscochoc.nc",
        "subject": "Filiere chocolatiere industrielle et rayonnement export du Pacifique / Biscochoc",
        "body": """Madame, Monsieur,

Biscochoc est un fleuron de l'industrie caledonienne, illustrant la capacite d'une PMI du Pacifique a fabriquer des produits d'excellence, a innover et a exporter a l'echelle internationale.

Je prends l'initiative de vous contacter au nom de Domtom Connect avec un profond respect pour votre trajectoire industrielle. Nous developpons une plateforme d'affaires et un reseau professionnel mobilisant les dirigeants de PME des territoires d'Outre-mer, d'Afrique et de la diaspora, couples a l'application mobile DTC Pulse.

Dans un contexte economique complexe ou la resilience des PMI locales et la diversification des debouches sont vitales, nous souhaitons creer des passerelles directes de cooperation entre industriels ultramarins.

Nous aimerions solliciter un court echange telephonique avec votre direction pour presenter notre initiative et reflechir aux connexions utiles pour votre marque.

Serait-il possible de convenir d'un court entretien telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Societe Le Froid Nouvelle Caledonie",
        "email": "lefroid@lefroid.nc",
        "territory": "Nouvelle-Caledonie (Noumea - Montravel)",
        "source": "https://www.lefroid.nc",
        "subject": "Production agroalimentaire locale et defis d'embouteillage / Societe Le Froid",
        "body": """Madame, Monsieur,

La Societe Le Froid compte parmi les acteurs industriels historiques et structurants de Nouvelle-Caledonie, assurant avec regularite la production, l'embouteillage et la distribution de boissons sur l'ensemble du territoire.

Je vous contacte au nom de Domtom Connect. Nous batissons un reseau professionnel et une plateforme d'affaires collaborative dediee aux entrepreneurs et industriels d'Outre-mer, d'Afrique et de la diaspora, accompagnee de l'application DTC Pulse.

Le maintien des cadences de production, l'approvisionnement maritime en intrants et la gestion de la logistique du froid dans les iles representent des defis operationnels majeurs partages par l'ensemble de nos regions.

Nous serions tres honores de pouvoir echanger brievement avec votre direction sur ces enjeux et vous exposer la vocation d'entraide economique de notre communaute.

Auriez-vous dix minutes a nous accorder pour un echange telephonique d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Jus de Fruits de Moorea Rotui",
        "email": "rotui@rotui.pf",
        "territory": "Polynesie Francaise (Moorea)",
        "source": "https://www.rotui.pf",
        "subject": "Transformation des fruits tropicaux et fierte de production locale / Rotui Moorea",
        "body": """Madame, Monsieur,

L'Usine de Jus de Fruits de Moorea et la marque Rotui incarnent avec brio la reussite agro-industrielle polynesienne, reliant le travail des planteurs d'ananas a une marque emblematique reconnue bien au-dela du fenua.

Je me permets de vous adresser ce message au nom de Domtom Connect. Nous federons une plateforme d'affaires et une communaute numerique reliant les entrepreneurs, industriels et cooperatives des territoires d'Outre-mer, d'Afrique et de la diaspora, grace a notre application DTC Pulse.

Notre projet valorise les savoir-faire de nos terroirs insulaires et vise a creer des circuits de solidarite economique et d'affaires directes entre professionnels passionnes par la production locale.

Nous serions ravis de faire votre connaissance et d'echanger sur vos perspectives d'expansion et sur les opportunites que notre reseau peut apporter a votre structure.

Seriez-vous disponibles pour un court creneau telephonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Groupe Reunimer",
        "email": "info@reunimer.com",
        "territory": "La Reunion (Le Port)",
        "source": "https://www.reunimer.com",
        "subject": "Filiere peche durable et valorisation halieutique locale / Groupe Reunimer",
        "body": """Madame, Monsieur,

Le Groupe Reunimer accomplit une mission essentielle pour valoriser les ressources de la mer, structurer la filiere peche reunionnaise et approvisionner le marche local et regional en produits de tres haute fraicheur.

Je vous contacte au nom de Domtom Connect. Nous structurons une plateforme d'affaires et un reseau professionnel collaboratif mobilisant les dirigeants de PME et PMI des Outre-mer, d'Afrique et de la diaspora, couple a notre application mobile DTC Pulse.

La maitrise de la chaine du froid, la gestion des flottes et la transformation halieutique en milieu tropical insulaire necessitent une rigueur et une vision industrielle hors du commun.

Nous aimerions beaucoup echanger avec votre direction sur vos orientations strategiques et voir comment notre reseau d'affaires peut soutenir le rayonnement des produits de la mer de La Reunion.

Seriez-vous ouverts a un court entretien telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Ti Kafe Torrefacteur de Martinique",
        "email": "cafecaraibe@gmail.com",
        "territory": "Martinique (Les Trois-Ilets - Tartane)",
        "source": "https://www.tikafe.fr",
        "subject": "Torrefaction artisanale caribeenne et developpement de marque / Ti Kafe",
        "body": """Madame, Monsieur,

Ti'Kafe realise un travail d'artisanat d'exception en Martinique, redonnant ses lettres de noblesse a la torrefaction fraiche et faisant redecouvrir la richesse aromatique des grands crus caribeens.

Je me permets de vous ecrire au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique dediee aux entrepreneurs et createurs des Outre-mer, d'Afrique et de la diaspora, portee par notre application mobile DTC Pulse.

Faire vivre une marque artisanale d'excellence impose des arbitrages constants entre qualite du sourcing, maitrise des approvisionnements et elargissement des circuits de distribution.

Nous serions tres heureux de pouvoir echanger avec votre equipe sur votre parcours, et voir comment Domtom Connect peut vous offrir un relais de visibilite et des opportunites commerciales concretes au sein de notre reseau.

Pourrions-nous convenir d'un court creneau telephonique de dix minutes d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Edena Boissons",
        "email": "televentes@edenaboissons.re",
        "territory": "La Reunion (La Possession)",
        "source": "https://www.edena-boissons.re",
        "subject": "Valorisation de la ressource en eau et production industrielle pei / Edena Boissons",
        "body": """Madame, Monsieur,

Edena Boissons est un acteur industriel incontournable du paysage reunionnais, preservant et valorisant depuis des decennies la purete des eaux de nos cirques au service des foyers de l'ile.

Je prends attache avec vous au nom de Domtom Connect. Nous avons mis en place un reseau d'affaires et une plateforme professionnelle mobilisant les dirigeants d'entreprises et d'industries ultramarines, du continent africain et de la diaspora, appuyes sur l'application mobile DTC Pulse.

Les enjeux de conditionnement responsable, d'economie circulaire et d'efficacite industrielle locale sont au coeur de la resilience economique de nos territoires.

Nous serions tres honores de pouvoir solliciter un court echange avec votre equipe de direction afin de faire connaissance et d'envisager des synergies utiles au sein de notre reseau.

Auriez-vous dix minutes a nous consacrer pour un echange telephonique informel ces prochains jours ?

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
            "batch": 49
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
    print(f"=== DEMARRAGE DU BATCH 49 (PME & PMI OUTRE-MER) : {len(LEADS)} CIBLES ===")
    
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

    print(f"\n=== BATCH 49 TERMINE : {sent_count}/{len(LEADS)} EMAILS ENVOYES AVEC SUCCES ===")

if __name__ == "__main__":
    run_batch()
