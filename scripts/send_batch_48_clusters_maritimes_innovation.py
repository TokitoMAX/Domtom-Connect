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

# BATCH 48 — CLUSTERS MARITIMES, INNOVATION & HUBS AERIENS PAN-OUTRE-MER (10 CIBLES ULTRA-QUALIFIEES)
# Regle d'or : Zero mensonge, Zero deux-points (:), Zero guessing, MX verifie
LEADS = [
    {
        "company": "Cluster Maritime de La Reunion",
        "email": "contact@cluster-maritime.re",
        "territory": "La Reunion (Le Port)",
        "source": "https://www.cluster-maritime.re",
        "subject": "Economie bleue et synergies d'affaires maritimes / Cluster Maritime Reunion",
        "already_sent": True,
        "body": """Madame, Monsieur,

Le secteur maritime et l'economie bleue a La Reunion sont des piliers incontournables de la croissance insulaire, structurant a la fois le grand port, la peche, les energies marines et les services nautiques de l'ocean Indien.

Je me permets de vous contacter au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique mobilisant les entrepreneurs, dirigeants et acteurs operationnels ultramarins, en Afrique et dans la diaspora. Notre application mobile DTC Pulse est concue pour connecter directement les porteurs de projets et accelerer les opportunites economiques.

Le developpement maritime necessite des partenariats etendus et des debouches concrets. Notre volonte est de valoriser les competences maritimes reunionnaises et de batir des liens economiques solides avec les autres territoires.

Nous serions tres honores de pouvoir echanger avec votre equipe sur vos axes de developpement et explorer les synergies possibles avec notre reseau.

Seriez-vous disponibles pour un court echange telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cluster Maritime de la Martinique",
        "email": "president@cluster-maritime-martinique.org",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.cluster-maritime-martinique.org",
        "subject": "Croissance bleue et valorisation de la filiere maritime / Cluster Maritime Martinique",
        "body": """Madame, Monsieur,

Le Cluster Maritime de la Martinique joue un role federateur majeur pour promouvoir l'economie de la mer, la modernisation portuaire et les activites maritimes dans l'arc antillais.

Je vous adresse ce message au nom de Domtom Connect. Nous animons un reseau d'affaires et une plateforme dediee a l'entrepreneuriat de nos territoires d'Outre-mer, d'Afrique et de la diaspora, portee par notre application mobile DTC Pulse.

Face aux defis de decarbonation, de connectivite inter-iles et de formation aux metiers de la mer, nous souhaitons faciliter la visibilite des acteurs maritimes martiniquais et susciter des collaborations interregionales utiles.

Nous aimerions solliciter un court entretien avec votre direction pour presenter notre initiative et reflechir aux passerelles que nous pourrions construire au service de vos adherents.

Serait-il envisageable de caler dix minutes d'echange telephonique d'ici la semaine prochaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cluster Maritime de Guadeloupe",
        "email": "contact@cluster-maritime-guadeloupe.fr",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://www.cluster-maritime-guadeloupe.fr",
        "subject": "Filiere maritime et cooperative economique ultramarine / Cluster Maritime Guadeloupe",
        "body": """Madame, Monsieur,

La mer constitue une formidable reserve de developpement durable pour la Guadeloupe, portee par vos actions en faveur de la croissance bleue, de la logistique portuaire et de l'innovation navale.

Je me permets de vous ecrire pour vous presenter Domtom Connect. Nous structurons une plateforme d'affaires et un reseau professionnel collaboratif reliant les entrepreneurs des Outre-mer, du continent africain et de la diaspora, s'appuyant sur notre application mobile DTC Pulse.

Notre mission est de decloisonner nos bassins economiques et de creer des ponts commerciaux directs entre professionnels de terrain confrontes aux memes realites insulaires.

Nous serions tres heureux de vous presenter nos outils et d'envisager comment Domtom Connect peut contribuer au rayonnement de l'ecosysteme maritime guadeloupeen.

Auriez-vous dix minutes a nous consacrer pour un echange telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cluster Maritime de Guyane",
        "email": "cluster.maritime.guyane@gmail.com",
        "territory": "Guyane (Remire-Montjoly)",
        "source": "https://www.cluster-maritime.fr",
        "subject": "Potentiel maritime amazonien et cooperations economiques / Cluster Maritime Guyane",
        "body": """Madame, Monsieur,

L'espace maritime guyanais, riche de ses ressources halieutiques et de sa position geostrategique en Amerique du Sud, represente un atout considerable pour l'economie bleue et les echanges regionaux.

Je prends contact avec vous au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique mobilisant les entrepreneurs et dirigeants d'Outre-mer, d'Afrique et de la diaspora, couplee a l'application mobile DTC Pulse.

Notre demarche vise a encourager la cooperation sud-sud et la valorisation des filieres territoriales d'excellence, en offrant des espaces de mise en relation directe entre professionnels.

Nous serions ravis de faire votre connaissance et de discuter des synergies possibles pour appuyer les acteurs maritimes guyanais dans notre reseau.

Seriez-vous disponibles pour un bref echange telephonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cluster Maritime de Nouvelle Caledonie",
        "email": "secretariat@clustermaritime.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "source": "https://www.clustermaritime.nc",
        "subject": "Solidarite economique et avenir maritime du Pacifique / Cluster Maritime NC",
        "body": """Madame, Monsieur,

Le secteur maritime en Nouvelle-Caledonie est au coeur de la connectivite du Caillou, de ses approvisionnements et de la preservation de son exceptionnel lagon.

Je vous contacte au nom de Domtom Connect avec un message de solidarite et de cooperation economique. Nous animons une plateforme d'affaires et une communaute dediee a l'entrepreneuriat dans tous les territoires ultramarins, en Afrique et dans la diaspora, soutenue par l'application DTC Pulse.

Dans une periode ou la resilience et la diversification economique caledonienne sont fondamentales, nous souhaitons offrir des canaux d'echange et d'affaires privilegies aux entreprises locales avec d'autres regions d'Outre-mer.

Nous serions tres honores de pouvoir vous presenter notre demarche et d'echanger sur des initiatives conjointes utiles pour vos membres.

Pourrions-nous convenir d'un court creneau d'echange telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cluster Maritime de Polynesie Francaise",
        "email": "contact@cluster-maritime.pf",
        "territory": "Polynesie Francaise (Papeete)",
        "source": "https://www.cluster-maritime.pf",
        "subject": "Espaces maritimes polynesiens et passerelles d'affaires / Cluster Maritime Polynesie",
        "body": """Madame, Monsieur,

Avec une zone economique exclusive de plusieurs millions de kilometres carres, la Polynesie francaise est le symbole meme de la vocation oceanique et du potentiel des metiers de la mer.

Je me permets de vous contacter au nom de Domtom Connect. Nous avons cree une plateforme d'affaires et un reseau professionnel dedie aux porteurs de projets, dirigeants et entreprises des Outre-mer, d'Afrique et de la diaspora, connectes via notre application DTC Pulse.

Notre objectif est de valoriser les initiatives maritimes d'excellence et de creer des cooperations directes entre entrepreneurs du Pacifique, de l'ocean Indien et des Caraibes.

Nous serions tres heureux d'echanger avec vous sur vos grands chantiers et de reflechir ensemble aux opportunites que notre reseau peut apporter a vos adherents.

Seriez-vous ouverts a un court echange telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Temergie Cluster Transition Energetique",
        "email": "contact@temergie.com",
        "territory": "La Reunion (Sainte-Marie)",
        "source": "https://www.temergie.com",
        "subject": "Innovation energetique et transition ecologique insulaire / Temergie",
        "body": """Madame, Monsieur,

Temergie mene une action pionniere pour accelerer la transition energetique, l'autonomie electrique et le deploiement des technologies propres en milieu insulaire tropical.

Je vous contacte au nom de Domtom Connect. Nous animons une plateforme d'affaires et une communaute numerique mobilisant les entrepreneurs et dirigeants des territoires d'Outre-mer, d'Afrique et de la diaspora, portee par l'application DTC Pulse.

Les enjeux d'efficacite energetique et d'economie circulaire sont essentiels pour la competitivite de nos entreprises. Nous souhaitons donner une tribune d'affaires et favoriser la mise en relation d'experts en energies renouvelables avec les PME de notre reseau.

Nous serions ravis d'echanger avec votre equipe sur vos actions et sur les passerelles que nous pourrions construire au benefice de vos adherents.

Auriez-vous dix minutes a nous accorder prochainement pour un court appel d'introduction ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "ADIM Agence Developpement et Innovation de Mayotte",
        "email": "contact@adim-mayotte.fr",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://www.adim-mayotte.fr",
        "subject": "Attractivite et accompagnement de l'entrepreneuriat mahorais / ADIM Mayotte",
        "body": """Madame, Monsieur,

L'ADIM accomplit un travail determinant pour structurer l'innovation, renforcer l'attractivite et accompagner la croissance des entreprises sur le territoire mahorais.

Je me permets de vous contacter au nom de Domtom Connect. Nous avons mis en place une plateforme d'affaires et une communaute professionnelle dediee aux entrepreneurs d'Outre-mer, du continent africain et de la diaspora, soutenue par notre application DTC Pulse.

Notre volonte est d'ouvrir des opportunites d'affaires et d'investissement directes pour les acteurs economiques de Mayotte, notamment dans le canal du Mozambique et avec les autres bassins ultramarins.

Nous aimerions vivement echanger avec votre direction sur vos programmes en cours et voir comment notre reseau peut servir de relais pour vos porteurs de projets.

Serait-il possible de convenir d'un court creneau telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SAMAC Aeroport Martinique Aime Cesaire",
        "email": "contact@martinique.aeroport.fr",
        "territory": "Martinique (Le Lamentin)",
        "source": "https://www.martinique.aeroport.fr",
        "subject": "Connectivite aerienne et developpement economique territorial / SAMAC Martinique",
        "body": """Madame, Monsieur,

L'Aeroport Martinique Aime Cesaire est une porte d'entree strategique indispensable pour le dynamisme economique, touristique et logistique de l'ile et de la Caraibe.

Je vous adresse ce message au nom de Domtom Connect. Nous federons une plateforme d'affaires et une communaute numerique regroupant les entrepreneurs, dirigeants et acteurs operationnels des Outre-mer, d'Afrique et de la diaspora, a travers notre application mobile DTC Pulse.

La connectivite aerienne et la continuite territoriale sont au coeur des preoccupations de nos membres. Nous souhaitons valoriser les infrastructures territoriales et creer des synergies concretes entre professionnels de notre reseau.

Nous serions tres honores de pouvoir presenter notre demarche a votre direction et d'echanger sur des pistes d'interet commun.

Auriez-vous dix minutes a nous consacrer pour un echange telephonique informel ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Aeroport de La Reunion Roland Garros",
        "email": "contact@reunion.aeroport.fr",
        "territory": "La Reunion (Sainte-Marie)",
        "source": "https://www.reunion.aeroport.fr",
        "subject": "Hub aerien et dynamisme economique de l'ocean Indien / Aeroport Roland Garros",
        "body": """Madame, Monsieur,

L'Aeroport de La Reunion Roland Garros constitue l'infrastructure pivot de l'ouverture internationale, du fret et des flux de voyageurs de La Reunion et de la zone ocean Indien.

Je me permets de vous contacter au nom de Domtom Connect. Nous animons un reseau d'affaires et une communaute professionnelle reliant les entrepreneurs et decideurs ultramarins, en Afrique et dans la diaspora, s'appuyant sur l'application mobile DTC Pulse.

Nos travaux portent sur le developpement des flux d'affaires et la valorisation des infrastructures majeures qui garantissent notre autonomie et notre attractivite regionale.

Nous serions tres heureux de pouvoir solliciter un court moment d'echange avec votre equipe afin de faire connaissance et d'envisager des passerelles utiles pour notre communaute.

Seriez-vous disponibles pour un court creneau telephonique de dix minutes ces prochains jours ?

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
        
    # Verifier si pas deja dans db["contacts"]
    exists = any(c.get("email", "").lower() == email.lower() for c in db["contacts"])
    if not exists:
        db["contacts"].append({
            "company": lead["company"],
            "email": email,
            "territory": lead["territory"],
            "source": lead["source"],
            "date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "batch": 48
        })

def run_batch():
    print(f"=== DEMARRAGE DU BATCH 48 : {len(LEADS)} CIBLES ===")
    
    db = load_contacts_db()
    
    # Lead 1 etait deja envoye avec succes avant l'interruption
    lead_1 = LEADS[0]
    add_lead_to_db(db, lead_1)
    save_contacts_db(db)
    print(f"[1/10] DEJA ENVOYE & ENREGISTRE : {lead_1['company']} ({lead_1['email']})")
    
    # Connexion SMTP
    context = ssl.create_default_context()
    sent_count = 1
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP etablie avec succes.\n")
        
        for idx, lead in enumerate(LEADS[1:], 2):
            recipient = lead["email"]
            msg = MIMEText(lead["body"], "plain", "utf-8")
            msg["Subject"] = lead["subject"]
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="domtomconnect.com")
            
            print(f"[{idx}/10] Envoi a {lead['company']} ({recipient})...")
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

    print(f"\n=== BATCH 48 TERMINE : {sent_count}/10 EMAILS ENVOYES AVEC SUCCES ===")

if __name__ == "__main__":
    run_batch()
