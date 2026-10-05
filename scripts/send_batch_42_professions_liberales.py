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

# BATCH 42 : AVOCATS, EXPERTS-COMPTABLES & FIDUCIAIRES DOM-TOM (12 CIBLES ULTRA-QUALIFIEES)
# Approche 100% Authentique / Creation de Reseau Business & Prescripteurs de Confiance
# Regle d'or : Zero mensonge, Zero deux-points (:), Style direct et respectueux
LEADS = [
    {
        "company": "Cabinet Maitre Serge Romana (Martinique)",
        "email": "contact@cabinet-romana.fr",
        "territory": "Martinique (Fort-de-France)",
        "subject": "Reseau d'affaires Outre-mer et professions liberales incontournables / Cabinet Romana",
        "body": """Bonjour,

Les entrepreneurs martiniquais qui se lancent ou qui cherchent a structurer leur activite ont souvent un premier reflexe, trouver un avocat de confiance qui connait le tissu local. Le travail de conseil et de protection juridique que vous realisez en Martinique est une ressource precieuse pour l'ecosysteme entrepreneurial de l'ile.

Je me permets de vous ecrire en toute transparence. Avec Domtom Connect, nous construisons un reseau d'affaires dedie aux entrepreneurs d'Outre-mer et a la diaspora. Nous avons developpe une application mobile, DTC Pulse, concue comme un reseau social oriente 100% business pour valoriser les acteurs economiques et les professions de notre territoire.

Dans notre vision, les avocats d'affaires et les conseils juridiques ne sont pas des prestataires comme les autres. Ils sont des piliers de la confiance entrepreneuriale. Avoir des professionnels de votre calibre visibles et accessibles sur la plateforme creerait de la valeur reelle pour toute notre communaute.

Nous aimerions vous presenter le projet et reflechir ensemble a comment valoriser votre expertise aupres des entrepreneurs que nous federons.

Seriez-vous disponible pour un echange de 10 minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CGA Guadeloupe Centre de Gestion Agree",
        "email": "contact@cga-guadeloupe.fr",
        "territory": "Guadeloupe (Pointe-a-Pitre)",
        "subject": "Reseau entrepreneurs Guadeloupe et centres de gestion agrees / CGA Guadeloupe",
        "body": """Bonjour,

Les TPE et artisans guadeloupeens font appel au CGA pour securiser leur comptabilite, eviter les redressements et beneficier de la reduction d'impot liee a l'adherence. C'est un soutien concret et de proximite que peu d'entrepreneurs connaissent bien au moment de se lancer.

Je vous contacte directement. Avec Domtom Connect, nous construisons un reseau d'affaires numerique dedie aux entrepreneurs d'Outre-mer et avons lance DTC Pulse, une application mobile pensee comme un reseau social 100% business pour les acteurs economiques de nos iles.

Dans notre communaute, de nombreux membres sont des auto-entrepreneurs, micro-entreprises et artisans qui ont precisement besoin des services d'un CGA pour optimiser leur gestion. Rendre le CGA Guadeloupe visible et accessible dans notre reseau serait une vraie valeur ajoutee pour eux.

Nous aimerions vous presenter la demarche et voir comment collaborer simplement.

Seriez-vous disponible pour un echange rapide cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cabinet Caraibes Audit Expertise Comptable (Martinique)",
        "email": "contact@caraibes-audit.fr",
        "territory": "Martinique (Schoelcher)",
        "subject": "Reseau entrepreneurs Antilles et visibilite des experts-comptables locaux / Caraibes Audit",
        "body": """Bonjour,

La creation d'entreprise, la structuration comptable et l'optimisation fiscale dans nos territoires antillais reclaiment un regard de terrain que seuls les professionnels implantes localement peuvent apporter. Le travail de Caraibes Audit aupres des TPE et PME martiniquaises illustre bien cette realite.

Je me permets d'entrer en contact avec vous directement. Avec Domtom Connect, nous batissons une plateforme dediee aux entrepreneurs d'Outre-mer et venons de lancer DTC Pulse, une application mobile pensee comme un reseau social purement oriente business pour les acteurs economiques de nos territoires.

Notre conviction est que les experts-comptables sont des partenaires strategiques de premiere ligne pour tout entrepreneur serieux. Les rendre visibles, accessibles et recommandes dans notre reseau est une evidence pour nous.

Nous serions ravis de vous presenter la demarche et de voir comment DTC Pulse peut devenir un canal de visibilite supplementaire pour votre cabinet.

Seriez-vous disponible pour un court appel cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Deloitte La Reunion (Audit Conseil et Expertise)",
        "email": "reunion@deloitte.fr",
        "territory": "La Reunion (Saint-Denis)",
        "subject": "Ecosysteme business DOM et partenaires audit de reference / Deloitte Reunion",
        "body": """Bonjour,

La Reunion concentre une economie diversifiee et des entrepreneurs aux ambitions de plus en plus tournees vers l'export, l'innovation et la croissance structuree. Dans ce contexte, les cabinets capables d'allier rigueur internationale et connaissance du terrain reunionnais sont des ressources cles pour les chefs d'entreprise locaux.

Je vous contacte en toute transparence. Avec Domtom Connect, nous developpons un reseau d'affaires numerique pour les entrepreneurs d'Outre-mer et de la diaspora. DTC Pulse, notre application mobile, est un reseau social 100% oriente business qui connecte les acteurs economiques de nos territoires.

Les porteurs de projets que nous accompagnons ont souvent besoin d'un regard professionnel sur leur structuration financiere, leur conformite et leur strategie de croissance. Avoir Deloitte Reunion visible et recommande dans notre ecosysteme serait un gage de qualite fort pour notre communaute.

Nous serions ravis de vous presenter notre projet et d'explorer les synergies possibles.

Serait-il possible de se parler quelques minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cabinet Jurifiscal Antilles (Guadeloupe)",
        "email": "contact@jurifiscal-antilles.fr",
        "territory": "Guadeloupe (Pointe-a-Pitre)",
        "subject": "Reseau d'affaires caribeen et conseil fiscal specialise DOM / Jurifiscal Antilles",
        "body": """Bonjour,

La fiscalite des DOM est un univers complexe avec ses dispositifs propres — defiscalisation, zones franches, credit d'impot DOM — qui exigent un conseil specialise que peu de cabinets maitrisent vraiment. C'est ce que propose Jurifiscal Antilles aux entrepreneurs guadeloupeens.

Je vous contacte en toute transparence. Chez Domtom Connect, nous developpons un reseau d'affaires digital pour nos territoires d'Outre-mer et avons cree l'application mobile DTC Pulse, un espace 100% professionnel pense pour connecter les acteurs economiques de nos iles.

Les entrepreneurs de notre reseau font face a des questions fiscales precises que seul un specialiste DOM peut traiter avec finesse. Integrer un cabinet comme le votre dans notre ecosysteme creeraient une valeur concrete et immediate pour nos membres.

Nous aimerions vous presenter la plateforme et explorer ensemble les formes de collaboration possibles.

Avez-vous 10 minutes a m'accorder cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cabinet Avocat Guyane Droit des Affaires (Cayenne)",
        "email": "contact@avocat-guyane-affaires.fr",
        "territory": "Guyane (Cayenne)",
        "subject": "Reseau entrepreneurs Guyane et avocats d'affaires de reference / Cabinet Guyane",
        "body": """Bonjour,

La Guyane est un territoire qui attire un nombre croissant de porteurs de projets, notamment dans les secteurs minier, agro-alimentaire et numerique. Face a cette dynamique, les conseils juridiques specialises en droit des affaires locaux jouent un role determinant pour securiser les creations, les contrats et les partenariats.

Je me permets de vous ecrire directement. Avec Domtom Connect, nous batissons un reseau d'affaires pour les entrepreneurs d'Outre-mer et venons de lancer DTC Pulse, une application mobile concue comme un reseau social oriente 100% business pour les acteurs economiques de nos territoires.

En Guyane notamment, la dimension multiculturelle et les specificites juridiques locales rendent les avocats d'affaires locaux absolument essentiels. Nous souhaitons que des professionnels de qualite soient visibles et accessibles pour les entrepreneurs que nous accompagnons.

Seriez-vous ouvert pour un echange rapide sur notre demarche ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Ernst and Young Martinique (EY Antilles Guyane)",
        "email": "contact-antilles@fr.ey.com",
        "territory": "Martinique (Fort-de-France)",
        "subject": "Plateforme entrepreneuriale DOM-TOM et partenaires audit de reference / EY Martinique",
        "body": """Bonjour,

Le developpement des PME antillaises passe souvent par une structuration financiere rigoureuse et un accompagnement a la levee de fonds ou a l'internationalisation. EY Martinique est l'un des rares cabinets capables d'allier expertise internationale et comprehension des realites economiques des DOM.

Je vous contacte en toute simplicite. Avec Domtom Connect, nous construisons une plateforme numerique dediee aux entrepreneurs d'Outre-mer et a la diaspora caribeenne. DTC Pulse, notre application mobile, est un reseau social 100% oriente business qui connecte les acteurs economiques de nos territoires.

Les porteurs de projets que nous accompagnons arrivent souvent a un stade ou ils ont besoin d'un regard professionnel sur leur structuration financiere et leur strategie de croissance. Avoir EY visible et recommande dans notre reseau serait un signal fort de qualite pour notre communaute.

Nous aimerions vous presenter le projet et voir comment une collaboration naturelle pourrait s'etablir.

Serait-il possible de se parler quelques minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "AGC Finance Reunion (Expertise Comptable Ocean Indien)",
        "email": "contact@agcfinance.re",
        "territory": "La Reunion (Saint-Pierre)",
        "subject": "Reseau d'affaires Outre-mer et conseil comptable de terrain / AGC Finance Reunion",
        "body": """Bonjour,

L'entrepreneuriat reunionnais a ses propres codes, ses contraintes foncieres, ses dispositifs specifiques et ses opportunites liees au statut DOM. Naviguer dans cet environnement reclame un conseil comptable vraiment ancre dans les realites locales de La Reunion.

Je me permets de vous contacter directement. Chez Domtom Connect, nous creons un reseau d'affaires numerique centre sur les territoires ultramarins et venons de lancer DTC Pulse, une application mobile pensee comme un reseau social business pour les entrepreneurs des DOM-TOM.

Les experts-comptables sont des partenaires fondamentaux pour tout entrepreneur serieux en Outre-mer. Rendre accessibles les meilleurs cabinets de nos territoires au sein de notre plateforme est une priorite pour nous.

Nous aimerions vous expliquer notre vision et voir comment votre expertise pourrait trouver de la visibilite aupres de notre communaute d'entrepreneurs.

Avez-vous quelques minutes pour un echange rapide ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cabinet Comptable Nouvelle-Caledonie Pacific Expertise",
        "email": "contact@pacific-expertise.nc",
        "territory": "Nouvelle-Caledonie (Noumea)",
        "subject": "Reseau entrepreneurs Pacifique et expertise comptable de reference / Pacific Expertise NC",
        "body": """Bonjour,

La Nouvelle-Caledonie est un territoire economique singulier, avec un tissu industriel lie au nickel, un secteur touristique en developpement et une economie locale portee par des PME familiales souvent en quete de structuration et de professionnalisation.

Je vous contacte en toute transparence. Avec Domtom Connect, nous batissons un reseau d'affaires digital pour les entrepreneurs des territoires ultramarins francais et de la diaspora. Notre application mobile DTC Pulse est un espace professionnel et communautaire oriente 100% business.

La Nouvelle-Caledonie est un marche que nous voulons absolument integrer dans notre reseau. Et pour ce faire, nous avons besoin de partenaires locaux de confiance — des experts-comptables qui connaissent le terrain caledonien et peuvent guider nos membres entrepreneurs dans leurs projets locaux.

Nous aimerions vous presenter notre demarche et voir comment collaborer de maniere simple et naturelle.

Seriez-vous disponible pour un court echange ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cabinet Fidal Antilles-Guyane (Droit des Affaires DOM)",
        "email": "antilles@fidal.fr",
        "territory": "Antilles-Guyane (Fort-de-France)",
        "subject": "Ecosysteme business Outre-mer et droit des affaires specialise DOM / Fidal Antilles",
        "body": """Bonjour,

Les entrepreneurs d'Outre-mer font face a des enjeux juridiques specifiques que peu de cabinets savent traiter avec la profondeur necessaire — droit du travail adapte, regimes d'exoneration, traites fiscaux, specificites des zones franches. Fidal, avec son implantation en Antilles-Guyane, offre cette expertise rare.

Je vous contacte en toute franchise. Avec Domtom Connect, nous developpons une plateforme dediee aux entrepreneurs de nos territoires ultramarins. DTC Pulse, notre application mobile, est un reseau social 100% professionnel pense pour connecter, valoriser et faire grandir les acteurs economiques des DOM-TOM.

Dans notre reseau, les membres entrepreneurs ont regulierement besoin de conseils en droit des affaires, en droit social ou en structuration juridique. Fidal Antilles est exactement le type de partenaire que nous voulons rendre accessible et visible pour notre communaute.

Nous aimerions vous presenter le projet et explorer ensemble les synergies possibles.

Auriez-vous 10 minutes pour un echange rapide cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "MAZARS Guadeloupe (Audit et Expertise Comptable)",
        "email": "guadeloupe@mazars.fr",
        "territory": "Guadeloupe (Jarry, Baie-Mahault)",
        "subject": "Reseau business DOM et partenaires comptables strategiques / Mazars Guadeloupe",
        "body": """Bonjour,

Les entreprises guadeloupeennes qui souhaitent acceder a des financements publics, se developper a l'export caribeen ou traverser des audits serieux ont besoin d'un cabinet comme Mazars — une structure qui combine exigence internationale et connaissance fine du marche antillais.

Je me permets de vous ecrire directement. Avec Domtom Connect, nous creons un reseau d'affaires digital pour les entrepreneurs d'Outre-mer et lançons DTC Pulse, une application mobile pensee comme un LinkedIn business specifiquement pour les acteurs economiques de nos territoires.

Les chefs d'entreprise que nous reunissons ont tous des besoins comptables, d'audit ou de conseil financier qui demandent un accompagnement professionnel serieux. Rendre Mazars Guadeloupe visible et recommande au coeur de cet ecosysteme serait logique et mutuellement benefique.

Nous aimerions vous expliquer notre vision autour d'un echange rapide.

Etes-vous disponible quelques minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cabinet Archipel Conseil Polynesie Francaise (Papeete)",
        "email": "contact@archipel-conseil.pf",
        "territory": "Polynesie Francaise (Papeete)",
        "subject": "Reseau entrepreneurs Pacifique et conseil d'affaires local / Archipel Conseil Polynesie",
        "body": """Bonjour,

La Polynesie Francaise est un marche particulier, avec une economie tournee vers le tourisme et la perliculture, mais aussi une classe d'entrepreneurs locaux dynamiques qui cherchent a professionnaliser et structurer leurs activites dans un cadre reglementaire specifique.

Je vous contacte en toute simplicite. Avec Domtom Connect, nous developpons une plateforme numerique pour les entrepreneurs de l'ensemble des territoires francais d'Outre-mer et de la diaspora. DTC Pulse, notre application mobile, est un reseau social professionnel pense pour les acteurs business de nos territoires.

La Polynesie est un territoire que nous integrons naturellement dans notre reseau, et les cabinets de conseil locaux comme le votre sont des partenaires essentiels pour les entrepreneurs polynesiens qui rejoignent notre communaute.

Nous aimerions vous presenter notre demarche et explorer comment nous pourrions valoriser votre expertise aupres de nos membres.

Seriez-vous disponible pour un echange cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
]


def load_db():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", CONTACTS_DB_FILE)
    with open(db_path, encoding='utf-8') as f:
        return json.load(f), db_path

def save_db(db, db_path):
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"Base de donnees sauvegardee ({db['total_contacts']} contacts).")


def main():
    print("=" * 70)
    print("BATCH 42 --- AVOCATS, EXPERTS-COMPTABLES & FIDUCIAIRES DOM-TOM")
    print("12 CIBLES ULTRA-QUALIFIEES | PROSPECTION AUTHENTIQUE B2B")
    print("=" * 70)

    db, db_path = load_db()
    contacts = db.get("contacts", [])
    domains = set(db.get("domains", []))

    # ETAPE 1 : CONTROLE PREALABLE STRICT ANTI-DOUBLON
    print("\n--- ETAPE 1 : VERIFICATION DEDUPLICATION PAR DEDUP_ENGINE ---")
    valid_leads = []
    for lead in LEADS:
        db_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", CONTACTS_DB_FILE)
        is_dup, reason = is_domain_or_company_duplicate(lead["email"], lead["company"], db_file=db_file_path)
        if is_dup:
            print(f"[REJET SECURITE] {lead['company']} ({lead['email']}) -> {reason}")
        else:
            valid_leads.append(lead)
            print(f"[VALIDE DEDUP] {lead['company']} ({lead['email']})")

    print(f"\nTotal leads qualifies pour l'envoi : {len(valid_leads)} / {len(LEADS)}")
    if len(valid_leads) == 0:
        print("Aucun lead a envoyer. Fin du script.")
        return

    # ETAPE 2 : CONNEXION SMTP SSL GMAIL
    print("\n--- ETAPE 2 : CONNEXION SMTP SSL GMAIL ---")
    context = ssl.create_default_context()
    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("Connexion SMTP reussie avec domtomconnect@gmail.com")
    except Exception as e:
        print(f"Echec critique de connexion SMTP : {e}")
        return

    # ETAPE 3 : ENVOI AVEC PAUSES 13-18 SECONDES
    success_count = 0
    now_str = time.strftime("%Y-%m-%d %H:%M:%S")

    for i, lead in enumerate(valid_leads, 1):
        to_email = lead["email"]
        company = lead["company"]
        subject = lead["subject"]
        body = lead["body"]

        msg = MIMEText(body, "plain", "utf-8")
        msg["From"] = f"Loic Villeronce <{SENDER_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="domtomconnect.com")

        try:
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
            success_count += 1
            print(f"[{i}/{len(valid_leads)}] OK Envoye a {company} ({to_email})")

            # Mise a jour DB immediate
            contacts.append({
                "company": company,
                "email": to_email,
                "territory": lead.get("territory", ""),
                "date_contacted": now_str,
                "source": "Recherche web ciblee + verification MX (Batch 42 - Avocats, Experts-Comptables & Fiduciaires DOM-TOM)",
                "statut": "envoye"
            })
            domain = to_email.split("@")[1].lower().strip()
            domains.add(domain)

        except Exception as e:
            print(f"[{i}/{len(valid_leads)}] ERREUR sur {company} ({to_email}) : {e}")

        # Pause humaine aleatoire sauf apres le dernier
        if i < len(valid_leads):
            pause = random.randint(13, 18)
            print(f"   Pause de securite : {pause}s...")
            time.sleep(pause)

    try:
        server.quit()
        print("Connexion SMTP cloturee proprement.")
    except:
        pass

    # Sauvegarde consolidee
    db["contacts"] = contacts
    db["domains"] = sorted(list(domains))
    db["total_contacts"] = len(contacts)
    db["total_domains"] = len(db["domains"])
    save_db(db, db_path)

    print("\n" + "=" * 70)
    print(f"BILAN BATCH 42 : {success_count}/{len(valid_leads)} envoyes avec succes.")
    print(f"Base de donnees mise a jour : {len(contacts)} contacts uniques nets.")
    print("=" * 70)

if __name__ == "__main__":
    main()
