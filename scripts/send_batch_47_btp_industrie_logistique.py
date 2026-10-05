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

# BATCH 47 — FEDERATIONS BTP, INDUSTRIE ET GRANDS PORTS PAN-OUTRE-MER (10 CIBLES ULTRA-QUALIFIEES)
# Regle d'or : Zero mensonge, Zero deux-points (:), Zero guessing, MX verifie
LEADS = [
    {
        "company": "FRBTP Reunion",
        "email": "contact@frbtp.re",
        "territory": "La Reunion (Saint-Denis)",
        "source": "https://www.frbtp.re",
        "subject": "Dynamique economique et resilience des entreprises du BTP reunionnais / FRBTP",
        "body": """Madame, Monsieur,

Le secteur du BTP a La Reunion est l'un des premiers moteurs de l'activite economique et de l'emploi local, incarnant la transformation et les infrastructures durables de l'ile.

Je me permets de vous contacter au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute numerique pour federer les entrepreneurs, dirigeants et acteurs operationnels de nos territoires ultramarins, du continent africain et de la diaspora. Notre application mobile DTC Pulse est concue pour faciliter les connexions directes et valoriser les realisations de terrain.

Dans un contexte ou les entreprises de construction doivent relever des defis d'approvisionnement maritime, de couts des materiaux et de commande publique, nous voulons promouvoir une solidarite economique et des synergies d'affaires elargies.

Nous serions tres honores de pouvoir vous presenter notre demarche et d'echanger sur la maniere dont notre reseau peut valoriser les competences des batisseurs de La Reunion.

Seriez-vous disponibles pour un court echange telephonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "ADIR Reunion Association Developpement Industriel",
        "email": "adir@adir.info",
        "territory": "La Reunion (Saint-Denis)",
        "source": "https://www.adir.info",
        "subject": "Production locale et valorisation de l'industrie reunionnaise / ADIR Reunion",
        "body": """Madame, Monsieur,

L'ADIR accomplit une mission essentielle pour porter la voix des industriels, defendre la production locale et affirmer la place de l'industrie comme levier d'autonomie pour La Reunion.

Je vous contacte avec beaucoup d'admiration pour votre action. Chez Domtom Connect, nous batissons une plateforme d'affaires et un reseau professionnel dedie a l'entrepreneuriat ultramarin, couple a notre application mobile DTC Pulse. Notre mission est de creer des flux economiques directs entre les territoires d'Outre-mer, l'Afrique et la diaspora.

Nous partageons pleinement votre attachement a la valorisation du produire local et a l'economie circulaire, afin de faire decouvrir et rayonner nos marques industrielles d'excellence au-dela de nos frontieres insulaires.

Nous aimerions vivement solliciter un moment d'echange avec votre direction pour faire connaissance et envisager des ponts utiles pour les adherents de l'ADIR.

Auriez-vous dix minutes a nous accorder prochainement pour en parler ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "AMPI Martinique Association Promotion Industrie",
        "email": "industrie@ampi.mq",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.industrie.mq",
        "subject": "Developpement industriel et mise en valeur des productions locales / AMPI Martinique",
        "body": """Madame, Monsieur,

L'industrie martiniquaise fait preuve d'une formidable capacite d'innovation pour maintenir et developper la production locale, au coeur des enjeux d'emploi et de transformation durable de l'ile.

Je me permets de vous ecrire directement. Avec Domtom Connect, nous animons une plateforme d'affaires et une communaute numerique mobilisant les entrepreneurs des Outre-mer, d'Afrique et de la diaspora. Notre application mobile DTC Pulse est entierement orientee sur le business concret et la visibilite operationnelle.

Notre ambition est de batir des passerelles d'affaires directes pour nos industriels et transformateurs, facilitant les debouches commerciaux et l'entraide entre nos differentes regions.

Nous serions ravis de vous presenter nos initiatives et de discuter de collaborations possibles pour mettre en lumiere les capacites industrielles martiniquaises aupres de notre reseau.

Serait-il possible de convenir d'un court creneau telephonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "FCBTP Nouvelle Caledonie",
        "email": "direction@fcbtp.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "source": "https://www.fcbtp.nc",
        "subject": "Solidarite economique Outre-mer et soutien aux entreprises du BTP / FCBTP",
        "body": """Madame, Monsieur,

Les entreprises du BTP en Nouvelle-Caledonie forment un pilier strategique de l'amenagement et du tissu socio-economique, confrontes aujourd'hui a des enjeux cruciaux de reconstruction et de perennite.

Je prends contact au nom de Domtom Connect. Nous developpons une plateforme d'affaires et une communaute professionnelle reliant les acteurs economiques des territoires ultramarins et de la diaspora, portee par notre application mobile DTC Pulse.

Dans cette periode exigeante, nous croyons profondement a la solidarite ultramarine et a la force des reseaux pour briser l'isolement, echanger de bonnes pratiques et faire emerger de nouveaux partenariats d'affaires.

Nous serions tres honores de pouvoir echanger brievement avec votre direction pour vous exprimer notre solidarite et voir comment nos outils peuvent etre utiles a vos entreprises membres.

Accepteriez-vous un court appel telephonique de quelques minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Grand Port Maritime de La Reunion Port Reunion",
        "email": "contact@reunion.port.fr",
        "territory": "La Reunion (Le Port)",
        "source": "https://reunion.port.fr",
        "subject": "Connectivite maritime et corridors economiques ultramarins / Port Reunion",
        "body": """Madame, Monsieur,

Port Reunion est le poumon vital des echanges economiques et de la continuite territoriale de La Reunion, assurant avec rigueur l'approvisionnement et le positionnement maritime de l'ile dans le sud-ouest de l'ocean Indien.

Je vous contacte au nom de Domtom Connect. Nous developpons un ecosysteme d'affaires et une application mobile, DTC Pulse, concus pour relier les entrepreneurs, exportateurs et acteurs du developpement de nos Outre-mer avec le continent africain et la diaspora.

Nous portons un interet majeur aux questions logistiques et maritimes, qui determinent directement la competitivite et la capacite de deploiement de nos PME insulaires.

Nous serions ravis de solliciter un court entretien d'introduction afin de vous exposer notre demarche et d'echanger sur les dynamiques de flux entre l'ocean Indien et nos autres territoires partenaires.

Seriez-vous disponibles pour un court echange telephonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Grand Port Maritime de la Martinique",
        "email": "contact@martinique.port.fr",
        "territory": "Martinique (Fort-de-France)",
        "source": "https://www.martinique.port.fr",
        "subject": "Plateforme logistique caraibe et developpement economique / GPM Martinique",
        "body": """Madame, Monsieur,

Le Grand Port Maritime de la Martinique joue un role fondamental de carrefour logistique, commercial et industriel pour l'ensemble du territoire et du bassin caribeen.

Je me permets de vous ecrire directement. Avec Domtom Connect, nous batissons une plateforme d'affaires connectant les createurs d'entreprises, dirigeants et porteurs de projets d'Outre-mer et de la diaspora, grace a notre application mobile DTC Pulse.

Parce que la maitrise logistique et l'efficacite portuaire sont au coeur de la reussite de nos entreprises locales, nous travaillons a creer des liens plus etroits entre les acteurs economiques et leurs infrastructures de reference.

Nous serions tres heureux de pouvoir vous presenter brievement notre projet et d'envisager des echanges constructifs autour des dynamiques de notre reseau.

Pourrions-nous convenir d'un court creneau de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Guadeloupe Port Caraibes GPMG",
        "email": "dcri@port-guadeloupe.com",
        "territory": "Guadeloupe (Pointe-a-Pitre)",
        "source": "https://www.guadeloupe-portcaraibes.com",
        "subject": "Developpement des flux ultramarins et attractivite portuaire / Guadeloupe Port Caraibes",
        "body": """Madame, Monsieur,

Guadeloupe Port Caraibes se situe au centre des grands corridors de transport maritime regional et international, moteur essentiel de la vie economique de l'archipel guadeloupeen.

Je vous contacte au nom de Domtom Connect. Nous federons une communaute numerique de decideurs, entrepreneurs et acteurs economiques de l'ensemble des Outre-mer et du continent africain, accompagnee par notre solution mobile DTC Pulse.

Notre objectif est d'encourager la circulation des opportunites d'affaires et la valorisation des infrastructures qui structurent l'activite de nos societes insulaires.

Nous serions tres honores de pouvoir echanger avec votre Direction de la Communication et des Relations Institutionnelles pour vous presenter notre initiative et reflechir aux passerelles positives pour notre communaute.

Auriez-vous dix minutes a nous consacrer au telephone prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Grand Port Maritime de la Guyane",
        "email": "gpm@portdeguyane.fr",
        "territory": "Guyane (Degrad des Cannes)",
        "source": "https://www.portdeguyane.fr",
        "subject": "Infrastructures portuaires et continuite logistique guyanaise / Port de Guyane",
        "body": """Madame, Monsieur,

Le Port de Degrad des Cannes represente la porte d'entree strategique de la Guyane, un equipement indispensable au developpement et a l'approvisionnement d'un territoire aux perspectives majeures.

Je vous adresse ce message avec beaucoup d'interet. A travers Domtom Connect, nous construisons une plateforme d'affaires panafricaine et ultramarine, reliee a notre application mobile DTC Pulse, pour desenclaver les initiatives locales et catalyser les partenariats entre nos territoires.

Nous portons une grande attention aux questions d'infrastructures et de connectivite logistique, indispensables a l'epanouissement des entreprises et a la fluidite des activites economiques guyanaises.

Nous aimerions vivement faire votre connaissance et vous presenter notre travail lors d'un court echange informel.

Serait-il envisageable d'avoir un bref entretien telephonique ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Port Autonome de Papeete Polynesie",
        "email": "direction@portppt.pf",
        "territory": "Polynesie Francaise (Papeete)",
        "source": "https://www.portdepapeete.pf",
        "subject": "Liaisons maritimes et developpement economique insulaire / Port Autonome de Papeete",
        "body": """Madame, Monsieur,

Le Port Autonome de Papeete constitue le coeur nevralgique des liaisons inter-iles et de l'ouverture internationale de la Polynesie francaise, garantissant une continuite territoriale d'une ampleur geographique unique.

Je me permets de vous contacter au nom de Domtom Connect. Nous developpons une plateforme collaborative et une communaute numerique avec l'application mobile DTC Pulse, dediees a la connexion des entrepreneurs et decideurs de l'ensemble des Outre-mer et de la diaspora.

Notre vocation est de faire dialoguer nos territoires, de partager des retours d'experience concrets et de valoriser les piliers logistiques et economiques qui font vivre nos communautes insulaires.

Nous serions tres heureux de solliciter un court moment d'echange avec votre direction pour vous presenter notre plateforme et envisager des liens mutuellement enrichissants.

Pourrions-nous caler un court appel de dix minutes selon vos disponibilites ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Port Autonome de la Nouvelle Caledonie Noumea",
        "email": "panc@noumeaport.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "source": "https://www.noumeaport.nc",
        "subject": "Continuite logistique maritime et reseau d'affaires ultramarin / Port de Noumea",
        "body": """Madame, Monsieur,

Le Port Autonome de la Nouvelle-Caledonie assure une mission de premier plan pour maintenir la vie economique, le ravitaillement et l'ouverture internationale du territoire.

Je vous contacte pour vous presenter l'initiative Domtom Connect. Nous rassemblons des dirigeants, entrepreneurs et porteurs de projets de tous les territoires d'Outre-mer au sein d'une communaute d'affaires solidaire, soutenue par notre application mobile DTC Pulse.

Face aux contraintes geographiques et aux defis actuels, nous sommes convaincus que la synergie entre territoires d'Outre-mer est un atout precieux pour partager des solutions, elargir les perspectives et renforcer la resilience de nos economies.

Nous serions tres honores de pouvoir echanger brievement avec votre equipe pour vous presenter notre demarche et nos objectifs d'interconnexion.

Seriez-vous ouverts a un court echange telephonique d'une dizaine de minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def check_no_colons(text):
    return ":" not in text

def main():
    print(f"=== BATCH 47 : ENVOI PROSPECTION B2B (10 CIBLES BTP, INDUSTRIE & PORTS) ===")
    print(f"Expéditeur : {SENDER_EMAIL}")
    print(f"Vérification préalable rigoureuse...")

    for idx, lead in enumerate(LEADS, 1):
        assert check_no_colons(lead["subject"]), f"Erreur deux-points dans subject de {lead['company']}"
        assert check_no_colons(lead["body"]), f"Erreur deux-points dans body de {lead['company']}"

        is_dup, dup_msg = is_domain_or_company_duplicate(lead["email"], lead["company"], CONTACTS_DB_FILE)
        if is_dup:
            print(f"FATAL: Doublon détecté pour {lead['company']} : {dup_msg}")
            sys.exit(1)

        ok_mx, mx_msg = verify_email_target(lead["email"])
        if not ok_mx:
            print(f"FATAL: Échec MX pour {lead['company']} ({lead['email']}) : {mx_msg}")
            sys.exit(1)

        print(f"[{idx}/10] VALIDÉ : {lead['company']} ({lead['email']})")

    print("\nTous les 10 leads sont 100% conformes et validés. Connexion SMTP SSL...")

    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
    server.login(SENDER_EMAIL, APP_PASSWORD)
    print("Connexion SMTP établie avec succès.\n")

    with open(CONTACTS_DB_FILE, encoding='utf-8') as f:
        db = json.load(f)

    sent_count = 0
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

            domain = recipient.split("@")[1].lower()
            if domain not in db.get("domains", []):
                db["domains"].append(domain)
            db["contacts"].append({
                "company": lead["company"],
                "email": recipient,
                "territory": lead["territory"],
                "source": lead["source"],
                "date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "batch": 47
            })

            if idx < len(LEADS):
                pause_time = random.uniform(12.5, 17.5)
                print(f"   ... Pause cadence de {pause_time:.1f}s ...")
                time.sleep(pause_time)

    finally:
        server.quit()
        with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(db, f, ensure_ascii=False, indent=2)
        print(f"\nBase {CONTACTS_DB_FILE} mise à jour. {sent_count} emails envoyés.")

    print("\n=== BATCH 47 COMPLÉTÉ AVEC SUCCÈS (10/10) ===")

if __name__ == "__main__":
    main()
