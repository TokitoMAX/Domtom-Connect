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

# BATCH 46 — CHAMBRES D'AGRICULTURE, ATTRACTIVITE ET RESEAUX D'ACCOMPAGNEMENT PAN-OUTRE-MER (10 CIBLES)
# Regle d'or : Zero mensonge, Zero deux-points (:), Zero guessing, MX verifie
LEADS = [
    {
        "company": "Chambre d Agriculture de La Reunion",
        "email": "dg@reunion.chambagri.fr",
        "territory": "La Reunion (Saint-Denis)",
        "source": "https://reunion.chambre-agriculture.fr",
        "subject": "Valorisation des filieres agricoles locales et reseau d'affaires Outre-mer / CA Reunion",
        "body": """Madame, Monsieur,

L'agriculture reunionnaise porte des savoir-faire d'excellence et incarne la souverainete alimentaire et l'identite economique de notre ile.

Je me permets de vous contacter au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique pour connecter les entrepreneurs et producteurs de nos territoires ultramarins, du continent africain et de la diaspora. Avec notre application mobile DTC Pulse, axee sur le business et la visibilite de terrain, nous offrons un canal moderne de promotion directe.

Notre demarche s'inscrit dans une logique d'economie circulaire entre nos territoires, afin de faire rayonner les productions agricoles, agroalimentaires et artisanales aupres d'un public engage et de prescripteurs economiques.

Nous serions tres heureux de vous presenter notre initiative et d'echanger sur les passerelles possibles au benefice des agriculteurs et groupements de La Reunion.

Seriez-vous disponibles pour un court echange de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chambre d Agriculture de Guadeloupe",
        "email": "cda_direction@guadeloupe.chambagri.fr",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://guadeloupe.chambre-agriculture.fr",
        "subject": "Filiere agricole guadeloupeenne et dynamique de reseau ultramarin / CA Guadeloupe",
        "body": """Madame, Monsieur,

L'agriculture en Guadeloupe est un moteur essentiel de l'economie locale, reliant la terre, l'innovation paysanne et la valorisation de nos productions de terroir.

Je vous ecris avec beaucoup d'interet. A travers Domtom Connect, nous construisons un reseau d'affaires panafricain et ultramarin visant a relier directement les entrepreneurs, transformateurs et porteurs de projets de nos territoires. Notre application mobile DTC Pulse a ete concue pour simplifier la mise en relation d'affaires et apporter une nouvelle dynamique de visibilite.

Nous souhaitons encourager les circuits courts et l'economie circulaire au sein de notre reseau, pour creer de nouveaux debouches et valoriser le travail des exploitants agricoles guadeloupeens.

Nous aimerions beaucoup echanger avec vous sur ces enjeux et voir comment notre plateforme peut etre un relais complementaire pour vos acteurs de terrain.

Auriez-vous un court moment pour en parler simplement au telephone cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chambre d Agriculture de Martinique",
        "email": "ca972@martinique.chambagri.fr",
        "territory": "Martinique (Le Lamentin)",
        "source": "https://martinique.chambres-agriculture.fr",
        "subject": "Economie circulaire ultramarine et valorisation du monde agricole / CA Martinique",
        "body": """Madame, Monsieur,

Le monde agricole martiniquais joue un role vital dans notre equilibre territorial, alliant resilience, transmission et recherche constante d'independance alimentaire.

Je prends contact directement avec votre direction. Avec Domtom Connect, nous batissons une plateforme d'affaires et une communaute numerique mobilisant les entrepreneurs des Outre-mer, d'Afrique et de la diaspora. Notre application mobile DTC Pulse est dediee aux echanges professionnels concrets et au developpement des opportunites economiques.

Notre objectif est de batir des synergies directes entre nos producteurs locaux et nos relais economiques regionaux ou de la diaspora, afin de soutenir les filieres d'origine martiniquaises.

Nous serions ravis de faire connaissance et d'etudier les opportunites de collaboration pour mettre en valeur les initiatives agricoles de l'ile.

Serait-il possible de convenir d'un court appel de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chambre d Agriculture de Guyane",
        "email": "chambre.agriculture@guyane.chambagri.fr",
        "territory": "Guyane (Macouria)",
        "source": "https://guyane.chambres-agriculture.fr",
        "subject": "Potentiel agricole guyanais et connexions economiques d'Outre-mer / CA Guyane",
        "body": """Madame, Monsieur,

L'agriculture guyanaise se distingue par l'immensite de ses ressources et la singularite de ses filieres, au coeur des defis de developpement et d'autonomie de notre region.

Je vous contacte au nom de Domtom Connect. Nous developpons une plateforme d'affaires pour briser l'isolement geographique de nos entrepreneurs et stimuler les flux economiques entre les territoires ultramarins, l'Afrique et la diaspora. Notre solution mobile DTC Pulse offre un espace d'echange professionnel dynamique et operationnel.

Nous avons a coeur de soutenir une economie circulaire ou les richesses de la terre guyanaise et ses transformateurs trouvent un echo puissant et des partenaires commerciaux solides.

Nous serions tres honores d'echanger avec votre institution pour explorer comment faire profiter les porteurs de projets agricoles guyanais de notre dynamique de reseau.

Auriez-vous dix minutes ces prochains jours pour un premier echange telephonique ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chambre de l Agriculture, de la Peche et de l Aquaculture de Mayotte (CAPAM)",
        "email": "capam@mayotte.chambagri.fr",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://mayotte.chambres-agriculture.fr",
        "subject": "Developpement des filieres terre et mer et reseau d'affaires / CAPAM Mayotte",
        "body": """Madame, Monsieur,

La CAPAM mene une mission fondamentale pour soutenir les producteurs, pecheurs et aquaculteurs de Mayotte dans un contexte territorial aux defis majeurs.

Je vous adresse ce message avec grand interet. Chez Domtom Connect, nous animons une communaute d'affaires dediee aux acteurs economiques ultramarins, relies a notre application mobile DTC Pulse. Notre mission est de creer des passerelles directes d'entraide et de business entre l'ocean Indien, la Caraibe, l'Afrique et la diaspora.

Nous sommes convaincus que la valorisation des filieres agricoles et halieutiques de Mayotte gagne a s'appuyer sur des reseaux d'affaires solidaires et des outils de communication modernes.

Nous aimerions vous presenter notre demarche et reflechir ensemble a des actions utiles pour les producteurs mahorais.

Seriez-vous ouverts a un court appel informel de quelques minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chambre d Agriculture de Nouvelle-Caledonie (CANC)",
        "email": "accueil@canc.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "source": "https://canc.nc",
        "subject": "Solidarite economique Outre-mer et valorisation du monde rural / CANC Nouvelle-Caledonie",
        "body": """Madame, Monsieur,

Le monde rural et agricole caledonien traverse une periode decisive qui exige de nouvelles formes de solidarite economique et de valorisation de ses acteurs.

Je vous contacte au nom de Domtom Connect. Nous federons les entrepreneurs, createurs et acteurs economiques de l'ensemble des Outre-mer au sein d'une plateforme d'affaires et a travers l'application mobile DTC Pulse. Notre volonte est de rapprocher les territoires ultramarins pour favoriser le partage d'experiences et les collaborations concretes.

Nous portons une attention particuliere aux filieres locales et a l'economie de proximite, en cherchant a offrir aux producteurs et porteurs de projets une tribune valorisante et un acces a des synergies ultramarines elargies.

Nous serions tres heureux de vous exposer notre travail et de voir comment nous pouvons apporter notre contribution au monde agricole caledonien.

Serait-il envisageable d'avoir un bref echange telephonique a votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chambre de l Agriculture et de la Peche Lagonaire de Polynesie Francaise (CAPL)",
        "email": "secretariat@capl.pf",
        "territory": "Polynesie Francaise (Papeete)",
        "source": "https://capl.pf",
        "subject": "Valorisation des filieres agricoles et lagonaires du Fenua / CAPL Polynesie",
        "body": """Madame, Monsieur,

Les activites agricoles et lagonaires constituent le coeur nourricier et patrimonial de la Polynesie francaise, porteuses d'authenticite et de qualite environnementale.

Je me permets de vous ecrire avec enthousiasme. Avec Domtom Connect, nous batissons un pont economique moderne entre les territoires d'Outre-mer, l'Afrique et la diaspora, soutenu par notre application mobile DTC Pulse. Notre vocation est d'encourager les opportunites d'affaires et la reconnaissance des savoir-faire insulaires.

Nous souhaitons faciliter la decouverte et la mise en relation autour des produits d'exception du Fenua aupres d'un reseau panafricain et international receptif.

Nous serions ravis de faire votre connaissance et de discuter des passerelles possibles pour accompagner la visibilite des exploitants et pecheurs polynesiens.

Pourrions-nous convenir d'un court creneau d'echange ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Martinique Developpement",
        "email": "contact@martiniquedev.fr",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://martiniquedev.fr",
        "subject": "Attractivite territoriale et synergies d'affaires pour les PME martiniquaises / Martinique Developpement",
        "body": """Madame, Monsieur,

L'action de Martinique Developpement est centrale pour stimuler la creation d'entreprises, structurer nos filieres d'avenir et attirer de nouvelles energies sur le territoire.

Je vous contacte directement pour vous presenter Domtom Connect. Nous animons un reseau d'affaires et une plateforme dediee a l'entrepreneuriat ultramarin, couplee a notre application mobile DTC Pulse. Notre mission est d'ouvrir des perspectives de croissance et d'accelerer les partenariats entre la Martinique, les Caraibes, l'Afrique et la diaspora.

Nous collaborons avec les acteurs du developpement economique pour proposer aux entrepreneurs des solutions de visibilite novatrices et un reseau professionnel solide et bienveillant.

Nous serions tres heureux de solliciter un moment d'echange avec votre equipe pour vous presenter nos actions et imaginer des synergies positives pour l'economie locale.

Auriez-vous dix minutes a m'accorder au telephone cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Initiative Martinique Active (IMA)",
        "email": "contact@ima.mq",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.ima.mq",
        "subject": "Accompagnement entrepreneurial et reseau d'affaires Outre-mer / Initiative Martinique Active",
        "body": """Madame, Monsieur,

Le travail mene par Initiative Martinique Active pour financer et accompagner les createurs d'entreprises est un levier decisif de reussite et d'emploi sur notre territoire.

Je vous contacte au nom de Domtom Connect. Nous developpons une communaute d'affaires et des outils digitaux, dont notre application DTC Pulse, concus pour aider les entrepreneurs a briser l'isolement, elargir leur carnet d'adresses et developper leur activite entre les Outre-mer, l'Afrique et la diaspora.

Nous constatons au quotidien que la reussite d'un porteur de projet finance depend etroitement de sa capacite a integrer rapidement un reseau de pairs et a trouver des clients ou partenaires de confiance.

Nous serions tres interesses d'echanger avec votre structure afin d'envisager des passerelles utiles pour les entrepreneurs que vous accompagnez.

Seriez-vous disponibles pour un court echange telephonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Initiative Mayotte",
        "email": "contact@initiative-mayotte.fr",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://initiative-mayotte.fr",
        "subject": "Financement des porteurs de projets mahorais et synergies de reseau / Initiative Mayotte",
        "body": """Madame, Monsieur,

L'accompagnement et le pret d'honneur accordes par Initiative Mayotte sont des piliers incontournables pour faire emerger et grandir les entreprises mahoraises.

Je me permets de vous contacter avec attention. Chez Domtom Connect, nous batissons une plateforme professionnelle et un ecosysteme d'affaires avec l'application mobile DTC Pulse, dedies aux acteurs economiques ultramarins et de la diaspora.

Notre ambition est de donner aux entrepreneurs finances un reseau d'appui supplementaire, permettant de creer des passerelles economiques avec l'ocean Indien, l'Afrique et les autres territoires francais.

Nous aimerions beaucoup vous presenter notre demarche et reflechir ensemble a la maniere de valoriser et entourer les entrepreneurs suivis par Initiative Mayotte.

Auriez-vous un court creneau de dix minutes ces prochains jours pour un appel informel ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def check_no_colons(text):
    return ":" not in text

def main():
    print(f"=== BATCH 46 : ENVOI PROSPECTION B2B (10 CIBLES ULTRA-SOURCÉES) ===")
    print(f"Expéditeur : {SENDER_EMAIL}")
    print(f"Vérification rigoureuse préalable...")

    # 1. Validation formelle de tous les leads
    for idx, lead in enumerate(LEADS, 1):
        # A. Aucun deux-points
        assert check_no_colons(lead["subject"]), f"Erreur deux-points dans subject du lead {lead['company']}"
        assert check_no_colons(lead["body"]), f"Erreur deux-points dans body du lead {lead['company']}"

        # B. Dedup check
        is_dup, dup_msg = is_domain_or_company_duplicate(lead["email"], lead["company"], CONTACTS_DB_FILE)
        if is_dup:
            print(f"FATAL: Doublon détecté pour {lead['company']} : {dup_msg}")
            sys.exit(1)

        # C. DNS / MX check
        ok_mx, mx_msg = verify_email_target(lead["email"])
        if not ok_mx:
            print(f"FATAL: Échec MX pour {lead['company']} ({lead['email']}) : {mx_msg}")
            sys.exit(1)

        print(f"[{idx}/10] VALIDÉ : {lead['company']} ({lead['email']}) | {mx_msg}")

    print("\nTous les 10 leads sont 100% conformes et validés. Connexion SMTP SSL...")

    # 2. Connexion SMTP SSL
    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
    server.login(SENDER_EMAIL, APP_PASSWORD)
    print("Connexion SMTP établie avec succès.\n")

    # Charger contacts existants
    with open(CONTACTS_DB_FILE, encoding='utf-8') as f:
        db = json.load(f)

    sent_count = 0
    success_leads = []

    try:
        for idx, lead in enumerate(LEADS, 1):
            recipient = lead["email"]
            subject = lead["subject"]
            body = lead["body"]

            msg = MIMEText(body, "plain", "utf-8")
            msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
            msg["To"] = recipient
            msg["Subject"] = subject
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="gmail.com")

            server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
            sent_count += 1
            print(f"[{idx}/10] ENVOYÉ avec succès à : {lead['company']} <{recipient}>")
            
            # Enregistrer dans db
            domain = recipient.split("@")[1].lower()
            if domain not in db.get("domains", []):
                db["domains"].append(domain)
            db["contacts"].append({
                "company": lead["company"],
                "email": recipient,
                "territory": lead["territory"],
                "source": lead["source"],
                "date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "batch": 46
            })
            success_leads.append(lead)

            # Pause anti-spam 12 à 18s (sauf après le dernier)
            if idx < len(LEADS):
                pause_time = random.uniform(12.5, 17.5)
                print(f"   ... Pause cadence de {pause_time:.1f}s ...")
                time.sleep(pause_time)

    finally:
        server.quit()
        # Sauvegarder contacts_deja_contactes.json
        with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(db, f, ensure_ascii=False, indent=2)
        print(f"\nBase {CONTACTS_DB_FILE} mise à jour. {sent_count} emails envoyés.")

    print("\n=== BATCH 46 COMPLÉTÉ AVEC SUCCÈS (10/10) ===")

if __name__ == "__main__":
    main()
