import smtplib, ssl, json, time, random, sys, os
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate

sys.stdout.reconfigure(encoding='utf-8')

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"
CONTACTS_DB_FILE = "contacts_deja_contactes.json"

# BATCH 41 : LOGISTIQUE, FRET & TRANSIT OUTRE-MER (12 CIBLES ULTRA-QUALIFIÉES)
# Approche 100% Authentique / Création de Réseau Business & Application DTC Pulse
# Règle d'or : Zéro mensonge, Zéro deux-points (:), Style direct et respectueux
LEADS = [
    {
        "company": "Cargo Services (Jarry, Guadeloupe)",
        "email": "infos@cargoservices.fr",
        "territory": "Guadeloupe (Baie-Mahault)",
        "subject": "Écosystème business Outre-mer et acteurs logistiques de confiance / Cargo Services",
        "body": """Bonjour,

La logistique et le transit restent l'épine dorsale de notre économie en Guadeloupe. Dans un contexte insulaire, la fluidité des approvisionnements et la rigueur d'un commissionnaire comme Cargo Services à Jarry sont vitales pour le quotidien des entreprises.

Je vous contacte en toute transparence. Avec Domtom Connect, nous sommes en train de bâtir un réseau d'affaires dédié à nos territoires d'Outre-mer et à la diaspora. Dans ce cadre, nous avons développé une application mobile qui se nomme DTC Pulse, pensée comme un réseau social centré à 100% sur le business et la visibilité des entreprises locales.

Pour faire grandir cet écosystème, compter sur des logisticiens de confiance au sein du réseau est une priorité absolue. Sans transport fiable et sans professionnels solides, aucun développement commercial pérenne n'est possible pour nos marques et commerçants.

Nous aimerions vous présenter notre démarche, valoriser vos expertises dans l'application et voir comment nous pourrions collaborer de manière simple.

Seriez-vous ouvert pour un court échange téléphonique de 10 minutes cette semaine ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Tropical Export (Le Lamentin, Martinique)",
        "email": "tropicalexport.fdf@gmail.com",
        "territory": "Martinique (Le Lamentin)",
        "subject": "Réseau d'affaires caribéen et partenaires fret de confiance / Tropical Export",
        "body": """Bonjour,

La réactivité sur le fret et les expéditions est un défi quotidien pour l'économie martiniquaise. Le travail que vous réalisez avec Tropical Export au Lamentin pour faciliter les flux aériens et maritimes joue un rôle essentiel pour le tissu économique local.

Je viens vers vous en toute simplicité. Avec Domtom Connect, nous développons un réseau d'affaires pour connecter les entreprises de nos îles et avons créé l'application mobile DTC Pulse, un réseau social orienté 100% business pour valoriser nos acteurs économiques.

Nous avons la conviction que bâtir un réseau solide passe par l'intégration d'acteurs logistiques sérieux et de confiance. Ce sont des compétences recherchées par tous les entrepreneurs qui cherchent à sécuriser leurs expéditions et leurs approvisionnements.

Nous serions ravis de faire connaissance, de vous présenter le projet et d'échanger sur la façon dont nous pourrions mettre en avant vos solutions.

Auriez-vous 10 minutes à m'accorder au téléphone cette semaine pour en discuter ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Madinina Fret (Le Lamentin, Martinique)",
        "email": "contact@madininafret.com",
        "territory": "Martinique (Le Lamentin)",
        "subject": "Développement de notre réseau business et acteurs du fret / Madinina Fret",
        "body": """Bonjour,

Assurer le transit et l'acheminement des marchandises vers la Martinique demande une exigence opérationnelle constante. Avec Madinina Fret, vous apportez une solution concrète aux contraintes d'éloignement et de délais propres à nos îles.

Je prends contact avec vous en toute franchise. Chez Domtom Connect, nous construisons un réseau d'affaires pour fédérer les entrepreneurs d'Outre-mer et venons de concevoir l'application mobile DTC Pulse, un réseau social dédié aux opportunités professionnelles et aux entreprises péi.

Notre démarche est claire. Pour que nos entrepreneurs avancent, ils ont besoin de partenaires logistiques de confiance à leurs côtés. Intégrer des spécialistes du fret comme vous au cœur de ce réseau est une opportunité mutuelle évidente.

J'aimerais beaucoup vous présenter notre vision et voir comment valoriser votre savoir-faire auprès de notre communauté.

Seriez-vous disponible pour un court appel de 10 minutes cette semaine ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Trans-Fret Services (Le Lamentin, Martinique)",
        "email": "contact@transitaire-martinique.com",
        "territory": "Martinique (Le Lamentin)",
        "subject": "Synergies professionnelles et réseau économique Outre-mer / Trans-Fret Services",
        "body": """Bonjour,

La maîtrise du dédouanement et de l'affrètement maritime est un pilier indispensable pour l'activité économique en Martinique. L'expertise de Trans-Fret Services à Place d'Armes permet à de nombreuses structures de surmonter la complexité logistique insulaire.

Je vous écris avec une intention claire et transparente. À travers Domtom Connect, nous mettons sur pied un réseau d'affaires régional et avons lancé l'application mobile DTC Pulse, un espace d'échange et de visibilité pensé uniquement pour le business.

Nous savons que la logistique est le socle de toute réussite commerciale sur nos territoires. Avoir des interlocuteurs fiables et référents dans ce domaine au sein du réseau apporte une vraie valeur à nos membres.

Serait-il possible de convenir d'un échange téléphonique de 10 minutes cette semaine afin d'évaluer comment nous pourrions collaborer ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "M2R Maritime (Caraïbes & Métropole)",
        "email": "contact@m2rmaritime.com",
        "territory": "Caraïbes & Métropole",
        "subject": "Connexion de notre réseau d'entreprises aux flux maritimes / M2R Maritime",
        "body": """Bonjour,

La continuité maritime entre la métropole et les Antilles représente un enjeu capital pour nos territoires. La rigueur apportée par M2R Maritime sur le groupage et la gestion des conteneurs répond à une attente forte des acteurs économiques.

Je vous contacte directement pour vous présenter notre initiative. Nous développons avec Domtom Connect un réseau d'affaires reliant nos îles et venons de lancer DTC Pulse, une application mobile conçue comme un réseau social focalisé sur le business et l'entraide entrepreneuriale.

Pour notre communauté d'entrepreneurs, identifier des spécialistes maritimes de confiance est fondamental. Nous souhaitons intégrer des partenaires transporteurs de référence dans cette dynamique pour faciliter les flux de nos membres.

Seriez-vous partant pour échanger 10 minutes au téléphone cette semaine pour faire un point de contact ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "SGC Maritime (Antilles, Guyane & Réunion)",
        "email": "contact@sgcmaritime.com",
        "territory": "Antilles, Guyane & Réunion",
        "subject": "Partenariat réseau d'affaires et visibilité fret Outre-mer / SGC Maritime",
        "body": """Bonjour,

Relier l'ensemble des bassins ultramarins (Antilles, Guyane, Océan Indien) avec régularité exige une maîtrise logistique de haut niveau. La réputation de SGC Maritime sur ces liaisons maritimes témoigne de votre engagement auprès de nos territoires.

Je vous écris en toute sincérité. Nous sommes en train de créer chez Domtom Connect un réseau d'affaires pour interconnecter nos régions et avons développé l'application mobile DTC Pulse, un réseau social business conçu pour mettre en avant les forces vives de nos îles.

Dans cette construction, nous recherchons des acteurs logistiques solides et reconnus. Avoir des partenaires de confiance capables de répondre aux interrogations de transport de nos adhérents est un atout précieux.

Seriez-vous disponible pour un entretien téléphonique de 10 minutes cette semaine afin d'en discuter simplement ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Guyalog Fret (Guyane)",
        "email": "contact@guyalog.fr",
        "territory": "Guyane (Dégrad des Cannes)",
        "subject": "Écosystème économique guyanais et réseau d'affaires / Guyalog Fret",
        "body": """Bonjour,

L'acheminement et la gestion logistique au port de Dégrad des Cannes représentent le cœur battant du commerce en Guyane. Le rôle de Guyalog Fret dans l'organisation de ces flux est indispensable au fonctionnement quotidien du territoire.

Je vous sollicite en toute authenticité. Avec Domtom Connect, nous déployons un réseau d'affaires pour valoriser les initiatives économiques ultramarines, appuyé par notre application mobile DTC Pulse, un réseau social orienté 100% business.

Nous accordons une importance majeure à la logistique. Disposer au sein de notre réseau d'acteurs de confiance implantés sur le terrain guyanais permettrait d'éclairer nos porteurs de projets et de favoriser des coopérations locales directes.

Auriez-vous un créneau de 10 minutes cette semaine pour un échange téléphonique de présentation ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Oceanic Transit (Guyane)",
        "email": "contact@oceanictransit.com",
        "territory": "Guyane (Cayenne)",
        "subject": "Réseau d'entrepreneurs ultramarins et logistique de confiance / Oceanic Transit",
        "body": """Bonjour,

La sécurisation des formalités douanières et du transit maritime est une condition sine qua non pour toute activité d'importation en Guyane. L'ancrage d'Oceanic Transit à Cayenne apporte cette rigueur indispensable aux professionnels.

Je viens vers vous en toute transparence. Chez Domtom Connect, nous bâtissons un écosystème d'affaires pour rapprocher les entreprises de nos territoires et avons conçu l'application mobile DTC Pulse, un réseau social tourné vers le développement business.

Nous savons d'expérience que la logistique est la préoccupation numéro un de beaucoup d'entrepreneurs. Nous souhaitons intégrer des professionnels du transit de confiance dans le réseau afin de nouer des ponts utiles pour nos adhérents.

Seriez-vous ouvert pour un court appel de 10 minutes cette semaine afin de faire connaissance ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Centrimex Réunion (La Réunion)",
        "email": "reunion@centrimex.com",
        "territory": "La Réunion (Le Port)",
        "subject": "Connexion réseau d'affaires Océan Indien et transit / Centrimex Réunion",
        "body": """Bonjour,

Le Port de La Réunion est le carrefour stratégique de l'Océan Indien. L'expertise de Centrimex sur le fret multimodal et le groupage international est un levier majeur pour sécuriser les chaînes d'approvisionnement réunionnaises.

Je prends attache avec votre agence en toute sincérité. Avec Domtom Connect, nous construisons un réseau d'affaires pour connecter les entreprises de nos territoires insulaires et avons créé l'application mobile DTC Pulse, dédiée aux synergies économiques et professionnelles.

Intégrer des logisticiens de premier plan dans cette démarche nous paraît fondamental. Nos entrepreneurs et créateurs ont besoin de se reposer sur des acteurs reconnus pour fluidifier leurs flux vers et depuis La Réunion.

Pourrions-nous convenir d'un échange téléphonique de 10 minutes cette semaine afin de vous exposer notre démarche ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Outremer Fret (Antilles & Réunion)",
        "email": "contact@outremerfret.com",
        "territory": "Antilles & Réunion",
        "subject": "Synergies d'affaires et valorisation logistique Outre-mer / Outremer Fret",
        "body": """Bonjour,

La spécialisation d'Outremer Fret sur les flux aériens et maritimes vers les départements d'outre-mer constitue un savoir-faire précieux pour la continuité de nos territoires.

Je vous contacte en toute simplicité. Nous développons à travers Domtom Connect un réseau d'affaires interconnecté entre les Antilles, l'Océan Indien et la métropole, avec notre application mobile DTC Pulse, un réseau social centré sur les échanges professionnels et la croissance des entreprises.

Avoir dans notre écosystème des acteurs du fret de confiance est une démarche stratégique. Cela permet d'apporter des réponses sérieuses à nos membres tout en donnant une visibilité ciblée à vos solutions de transport.

Seriez-vous disponible pour un entretien téléphonique de 10 minutes cette semaine pour évaluer ces opportunités ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Setcargo International (Antilles & Océan Indien)",
        "email": "contact@setcargo.com",
        "territory": "Antilles & Océan Indien",
        "subject": "Réseau économique et acteurs de référence du fret / Setcargo International",
        "body": """Bonjour,

L'envergure de Setcargo sur les dessertes ultramarines fait de votre groupe un pilier incontournable du fret et de l'approvisionnement de nos territoires.

Je prends contact avec vous en toute franchise. Chez Domtom Connect, nous mettons en place un réseau d'affaires fédérant entrepreneurs et acteurs économiques locaux, et nous avons lancé l'application mobile DTC Pulse pour dynamiser la mise en relation business.

Compter des spécialistes du transport de confiance dans notre réseau représente une vraie valeur ajoutée pour notre communauté. Nous souhaitons échanger avec vous pour envisager des passerelles de visibilité et de collaboration.

Auriez-vous 10 minutes à m'accorder par téléphone cette semaine pour faire un point d'introduction ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "STRM Transports (Antilles & Métropole)",
        "email": "contact@strm-transports.com",
        "territory": "Antilles & Métropole",
        "subject": "Liaisons logistiques et dynamique de réseau d'affaires / STRM Transports",
        "body": """Bonjour,

Le transport régulier de marchandises entre la métropole et les Antilles demande une gestion rigoureuse pour répondre aux attentes des professionnels comme des particuliers. L'activité de STRM Transports s'inscrit pleinement dans cette nécessité.

Je vous écris en toute authenticité. Avec Domtom Connect, nous construisons un réseau d'affaires pour nos territoires et avons développé l'application mobile DTC Pulse, un réseau social dédié aux opportunités économiques et professionnelles.

Nous savons combien la question du transport est centrale pour le tissu d'entreprises locales. Avoir des acteurs de transport fiables dans notre réseau apporte une valeur concrète et directe à nos membres.

Seriez-vous ouvert pour un court appel téléphonique de 10 minutes cette semaine afin d'en discuter ?

Bien cordialement,

Loïc Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

def load_db():
    try:
        with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Erreur chargement DB : {e}")
        return {"contacts": [], "domains": []}

def save_db(data):
    with open(CONTACTS_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    print("=" * 70)
    print("DÉMARRAGE DU BATCH 41 — LOGISTIQUE & TRANSIT OUTRE-MER (12 LEADS)")
    print("=" * 70)

    db = load_db()
    contacts = db.get("contacts", [])
    domains = set(d.lower().strip() for d in db.get("domains", []))

    # ÉTAPE 1 : CONTRÔLE PRÉALABLE STRICT ANTI-DOUBLON
    print("\n--- ÉTAPE 1 : VÉRIFICATION DÉDUPLICATION PAR DEDUP_ENGINE ---")
    valid_leads = []
    for lead in LEADS:
        is_dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"])
        if is_dup:
            print(f"[REJET SÉCURITÉ] {lead['company']} ({lead['email']}) -> {reason}")
        else:
            valid_leads.append(lead)
            print(f"[VALIDÉ DEDUP] {lead['company']} ({lead['email']})")

    print(f"\nTotal leads qualifiés pour l'envoi : {len(valid_leads)} / {len(LEADS)}")
    if len(valid_leads) == 0:
        print("Aucun lead à envoyer. Fin du script.")
        return

    # ÉTAPE 2 : CONNEXION SMTP SSL GMAIL
    print("\n--- ÉTAPE 2 : CONNEXION SMTP SSL GMAIL ---")
    context = ssl.create_default_context()
    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP réussie avec domtomconnect@gmail.com")
    except Exception as e:
        print(f"Échec critique de connexion SMTP : {e}")
        return

    # ÉTAPE 3 : ENVOI AVEC PAUSES 13-18 SECONDES
    success_count = 0
    now_str = time.strftime("%Y-%m-%d %H:%M:%S")

    for i, lead in enumerate(valid_leads, 1):
        to_email = lead["email"]
        company = lead["company"]
        subject = lead["subject"]
        body = lead["body"]

        msg = MIMEText(body, "plain", "utf-8")
        msg["From"] = f"Loïc Villeronce <{SENDER_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

        try:
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
            success_count += 1
            print(f"[{i}/{len(valid_leads)}] OK Envoyé à {company} ({to_email})")

            # Mise à jour DB immédiate
            contacts.append({
                "company": company,
                "email": to_email,
                "territory": lead.get("territory", ""),
                "date_contacted": now_str,
                "source": "Recherche web ciblée + vérification MX (Batch 41 – Logistique, Fret & Transit / B2B Authentique)",
                "statut": "envoyé"
            })
            domain = to_email.split("@")[1].lower().strip()
            domains.add(domain)

        except Exception as e:
            print(f"[{i}/{len(valid_leads)}] ERREUR sur {company} ({to_email}) : {e}")

        # Pause humaine aléatoire sauf après le dernier
        if i < len(valid_leads):
            pause = random.randint(13, 18)
            print(f"   Pause de sécurité : {pause}s...")
            time.sleep(pause)

    try:
        server.quit()
        print("Connexion SMTP clôturée proprement.")
    except:
        pass

    # Sauvegarde consolidée
    db["contacts"] = contacts
    db["domains"] = sorted(list(domains))
    db["total_contacts"] = len(contacts)
    db["total_domains"] = len(db["domains"])
    save_db(db)

    print("\n" + "=" * 70)
    print(f"BILAN BATCH 41 : {success_count}/{len(valid_leads)} envoyés avec succès.")
    print(f"Base de données mise à jour : {len(contacts)} contacts uniques nets.")
    print("=" * 70)

if __name__ == "__main__":
    main()
