import sys, os, json, re
sys.stdout.reconfigure(encoding='utf-8')

LEADS_82 = [
    {
        "company": "Voiles Bleues Conciergerie",
        "email": "contact@voilesbleues.com",
        "territory": "Guadeloupe (Sainte-Anne & Saint-François)",
        "source": "https://www.voilesbleues.com",
        "subject": "Réservations directes et charge d'intendance pour Voiles Bleues",
        "body": """Bonjour,

Je suis de près le développement de votre conciergerie et la qualité de votre portefeuille de villas sur la Grande-Terre, notamment à Saint-François et Sainte-Anne. Votre sens de l'accueil haut de gamme fait une vraie différence pour le séjour des voyageurs en Guadeloupe.

Je vous contacte au nom de Domtom Connect. Nous animons un écosystème d'affaires et d'accompagnement de terrain dédié aux dirigeants et acteurs économiques ultramarins.

Nous savons combien le métier de conciergerie est intense au quotidien entre les arrivées décalées, l'intendance logistique et la pression des commissions prélevées par les plateformes de réservation en ligne. À travers notre communauté d'entrepreneurs et notre tech propriétaire DTC Pulse, nous connectons directement des propriétaires et gestionnaires de propriétés d'exception avec des cadres, chefs d'entreprise et membres de la diaspora cherchant des séjours de standing sans intermédiaires.

Seriez-vous disponibles pour un court échange téléphonique informel de quinze minutes ces prochains jours afin de faire connaissance ?

Vous pouvez retenir directement le créneau qui vous convient sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "KVZ Conciergerie",
        "email": "contact@kvzconciergerie.com",
        "territory": "Guadeloupe (Le Moule & Grande-Terre)",
        "source": "https://www.kvzconciergerie.com",
        "subject": "Flux de voyageurs directs et logistique pour KVZ Conciergerie",
        "body": """Bonjour,

Votre réactivité et votre rigueur dans la gestion locative et la conciergerie privée sur la Grande-Terre apportent une vraie sérénité aux propriétaires qui vous confient leurs biens.

Je me permets de vous contacter au nom de Domtom Connect. Nous développons une communauté d'affaires active et des solutions de copilotage opérationnel pour soutenir les entrepreneurs de la Caraïbe.

Nous constatons sur le terrain que les gestionnaires de conciergerie portent une charge mentale permanente 7 jours sur 7. En complément de notre outil gratuit d'anamnèse pour optimiser votre organisation, nous valorisons les hébergements de qualité auprès de notre réseau de dirigeants et membres de la diaspora en déplacement professionnel ou en vacances aux Antilles, favorisant des réservations directes sans commissions abusives.

Seriez-vous ouverts à une brève conversation de quinze minutes cette semaine pour évaluer de potentielles synergies ?

Vous pouvez sélectionner un moment à votre convenance sur mon agenda,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Conciergerie Vanille",
        "email": "conciergerievanille@gmail.com",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://www.conciergerievanille.com",
        "subject": "Échange informel et réservations directes pour Conciergerie Vanille",
        "body": """Bonjour,

Votre accompagnement sur mesure pour les villas de Saint-François et Sainte-Anne témoigne d'un ancrage local précieux et d'une attention aux détails très appréciée des propriétaires.

Je vous écris au nom de Domtom Connect, un écosystème d'entraide et de réseau professionnel pour les acteurs économiques des Antilles et de la diaspora.

Nous aidons les gérants indépendants à alléger leur charge opérationnelle tout en stimulant leurs canaux de commercialisation directe. Grâce à notre groupe WhatsApp d'entraide et à notre application mobile DTC Pulse en phase de test, nous créons des ponts avec des profils qualifiés cherchant des hébergements de charme en Guadeloupe en dehors des circuits classiques.

Auriez-vous dix à quinze minutes à m'accorder au téléphone cette semaine pour faire connaissance ?

Vous pouvez fixer l'appel très facilement via ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Villa Prestige Antilles",
        "email": "location@villa-prestige-antilles.com",
        "territory": "Guadeloupe & Martinique",
        "source": "https://www.villa-prestige-antilles.com",
        "subject": "Clientèle diaspora et partenariats pour Villa Prestige Antilles",
        "body": """Bonjour,

La réputation de votre catalogue de propriétés d'exception en Guadeloupe et en Martinique fait référence pour les séjours de standing aux Antilles françaises.

Je me permets de vous contacter au nom de Domtom Connect. Nous fédérons des dirigeants, cadres et investisseurs de la Caraïbe et de la diaspora métropolitaine.

Beaucoup de nos membres organisent régulièrement des séjours privés, des séminaires ou des retours temporaires au pays et recherchent des villas de prestige avec un niveau d'exigence irréprochable. Nous serions ravis de faire connaître votre collection de villas auprès de notre écosystème d'affaires tout en échangeant sur vos perspectives de développement.

Seriez-vous disponibles pour un court échange de quinze minutes ces prochains jours ?

Vous pouvez réserver directement sur mon calendrier en ligne,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Les Clés d'Alice Conciergerie",
        "email": "contact@lesclesdalice.fr",
        "territory": "Martinique (Le Diamant & Sud)",
        "source": "https://www.lesclesdalice.fr",
        "subject": "Optimisation des réservations et logistique pour Les Clés d'Alice",
        "body": """Bonjour,

Votre gestion bienveillante et professionnelle des villas dans le sud de la Martinique, notamment autour du Diamant, apporte un vrai confort aux propriétaires éloignés.

Je vous contacte au nom de Domtom Connect. Nous construisons une communauté active pour épauler les entrepreneurs ultramarins dans leur quotidien opérationnel.

Entre la coordination des prestataires de ménage, les arrivées tardives et les creux de fréquentation en basse saison, nous savons combien la gestion d'une conciergerie demande d'énergie. Notre rôle est d'apporter du soutien concret aux gérants, tant sur la décharge opérationnelle que sur la mise en relation avec des voyageurs directs issus de notre réseau d'affaires.

Pourrions-nous échanger une quinzaine de minutes au téléphone cette semaine pour faire un point convivial ?

Vous pouvez choisir le moment qui vous convient sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Villa Design Caraïbes",
        "email": "contact@villadesigncaraibes.com",
        "territory": "Martinique",
        "source": "https://www.villadesigncaraibes.com",
        "subject": "Synergies d'affaires et clientèle directe pour Villa Design Caraïbes",
        "body": """Bonjour,

L'élégance architecturale et le niveau de prestation que vous proposez sur votre parc de villas en Martinique correspondent exactement aux attentes d'une clientèle exigeante.

Je vous écris au nom de Domtom Connect. Notre réseau rassemble des chefs d'entreprise, cadres et porteurs de projets issus de la diaspora antillaise et de l'international.

Nos membres recherchent fréquemment des résidences de caractère pour leurs déplacements d'affaires ou leurs séjours personnels dans les îles. Collaborer avec des acteurs réputés comme Villa Design Caraïbes permettrait de vous ouvrir un canal de prescription directe tout en échangeant sur nos solutions d'accompagnement opérationnel pour votre structure.

Seriez-vous ouverts à une courte discussion téléphonique de quinze minutes ces prochains jours ?

Vous pouvez fixer le rendez-vous à votre convenance sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Eden Paradise Ecolodge & Spa",
        "email": "edenparadise.spa@gmail.com",
        "territory": "Martinique (Sainte-Luce)",
        "source": "https://www.edenparadisespa.com",
        "subject": "Valorisation de l'éco-séjour et réservations directes pour Eden Paradise",
        "body": """Bonjour,

Votre concept d'écolodge et spa au cœur de la nature à Sainte-Luce offre une parenthèse de sérénité unique et très appréciée en Martinique.

Je me permets de vous contacter au nom de Domtom Connect. Nous accompagnons les dirigeants et porteurs d'initiatives des territoires ultramarins pour les aider à valoriser leurs pépites locales.

Les écolodges de caractère comme le vôtre méritent d'être réservés en direct, sans subir les lourdes commissions des grandes centrales de réservation en ligne. Notre écosystème met en lumière les expériences authentiques auprès de notre communauté de dirigeants et de la diaspora, tout en vous proposant un diagnostic d'anamnèse gratuit pour optimiser vos opérations.

Seriez-vous disponibles pour un échange téléphonique de quinze minutes à votre convenance ?

Vous pouvez choisir le créneau qui vous arrange directement ici,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "SXM Conciergerie",
        "email": "reception@sxmconciergerie.com",
        "territory": "Saint-Martin",
        "source": "https://www.sxmconciergerie.com",
        "subject": "Échange professionnel et partenariats d'affaires pour SXM Conciergerie",
        "body": """Bonjour,

L'exigence logistique et la diversité des prestations que vous orchestrez pour les séjours à Saint-Martin font de votre structure un partenaire clé pour les voyageurs et propriétaires de l'île.

Je vous contacte au nom de Domtom Connect. Nous bâtissons un réseau professionnel et des solutions de copilotage pour soutenir les entrepreneurs ultramarins dans leurs défis de gestion.

À Saint-Martin, la saisonnalité et la gestion opérationnelle 24/7 imposent un rythme particulièrement exigeant aux gérants. Nous soutenons les dirigeants de conciergerie pour optimiser leurs processus tout en favorisant les mises en relation directes avec notre réseau d'affaires caribéen et international.

Auriez-vous un quart d'heure à m'accorder au téléphone ces prochains jours afin de faire connaissance ?

Vous pouvez sélectionner un créneau selon vos disponibilités sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Luxury Living St Barts",
        "email": "hello@llstbarts.com",
        "territory": "Saint-Barthélemy (Gustavia)",
        "source": "https://www.luxurylivingstbarts.com",
        "subject": "Partenariat d'affaires et réservations directes pour Luxury Living St Barts",
        "body": """Bonjour,

Le standard d'excellence et la discrétion que vous appliquez dans la conciergerie privée et la gestion de propriétés à Saint-Barthélemy reflètent parfaitement l'exigence de cette destination unique.

Je vous écris au nom de Domtom Connect. Notre organisation fédère des chefs d'entreprise, cadres et investisseurs de la zone Caraïbes et de la diaspora métropolitaine.

Nous serions ravis de faire connaître vos services auprès de nos membres voyageant à Saint-Barthélemy et de discuter de vos enjeux organisationnels. Notre accompagnement de terrain aide également les dirigeants indépendants à sécuriser leurs opérations et à alléger leur charge administrative.

Seriez-vous disponibles pour un court échange de quinze minutes cette semaine ?

Vous pouvez retenir le moment qui vous convient sur mon calendrier,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Tropicalodge",
        "email": "contact@tropicalodge.fr",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://www.tropicalodge.fr",
        "subject": "Réservations directes et gestion locative pour Tropicalodge",
        "body": """Bonjour,

Votre sélection de lodges et villas de charme sur la côte ouest de La Réunion propose une expérience authentique et soignée qui séduit particulièrement les voyageurs en quête de tranquillité péi.

Je me permets de vous contacter au nom de Domtom Connect. Nous développons un réseau d'accompagnement opérationnel et d'opportunités d'affaires pour les entrepreneurs de l'océan Indien et de la diaspora.

Nous constatons combien la dépendance aux plateformes de réservation en ligne pèse sur la rentabilité des hébergeurs réunionnais. Grâce à notre communauté et à notre application mobile DTC Pulse, nous connectons directement les domaines de charme avec des voyageurs professionnels et des familles de la diaspora cherchant à réserver sans intermédiaires.

Pourrions-nous échanger une quinzaine de minutes au téléphone ces prochains jours ?

Vous pouvez choisir le jour et l'heure facilement sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Yes Conciergerie La Réunion",
        "email": "reunion@yesconciergerie.com",
        "territory": "La Réunion (Saint-Gilles-les-Bains)",
        "source": "https://www.yesconciergerie-reunion.re",
        "subject": "Échange professionnel et optimisation logistique pour Yes Conciergerie",
        "body": """Bonjour,

Votre présence active sur Saint-Gilles et l'ouest réunionnais pour la conciergerie de villas et résidences de standing apporte une vraie réponse aux propriétaires soucieux de la qualité de leur intendance.

Je vous contacte au nom de Domtom Connect. Nous soutenons au quotidien les acteurs économiques ultramarins dans la structuration de leur activité et la réduction de leur charge mentale.

La gestion d'une conciergerie en période de pointe comme en basse saison demande une veille permanente sur les plannings et les équipes de terrain. Avec nos démarches de copilotage et notre diagnostic gratuit, nous aidons les dirigeants à consolider leurs processus tout en leur apportant de la visibilité auprès de notre réseau d'entrepreneurs.

Seriez-vous disponibles pour un court entretien de quinze minutes cette semaine ?

Vous pouvez retenir un créneau sur mon agenda directement ici,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Conciergerie Réunionnaise",
        "email": "conciergeriereunionnaise@gmail.com",
        "territory": "La Réunion",
        "source": "https://www.conciergeriereunionnaise.re",
        "subject": "Échange informel et synergies locales pour la Conciergerie Réunionnaise",
        "body": """Bonjour,

Votre engagement dans l'accueil des voyageurs et la gestion de propriétés saisonnières à La Réunion met en valeur l'hospitalité réunionnaise et la tranquillité des propriétaires partenaires.

Je vous écris au nom de Domtom Connect. Notre mission est de créer des synergies concrètes et de soutenir le développement des entreprises indépendantes de nos territoires.

Nous savons que la coordination quotidienne des séjours est chronophage et exigeante. Nous proposons aux dirigeants de conciergerie des outils d'organisation pour sécuriser leur intendance tout en faisant connaître leurs hébergements auprès de notre communauté de membres et de cadres en déplacement à La Réunion.

Auriez-vous dix à quinze minutes à m'accorder au téléphone ces prochains jours afin de faire connaissance ?

Vous pouvez fixer notre appel selon vos disponibilités sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Écolodge de Simal",
        "email": "resa.ecolodgesimal@gmail.com",
        "territory": "Sénégal (Sine Saloum)",
        "source": "https://www.ecolodgedesimal.com",
        "subject": "Valorisation de l'éco-séjour et flux directs pour l'Écolodge de Simal",
        "body": """Bonjour,

L'immersion écologique et culturelle que vous offrez au bord du Sine Saloum fait de l'Écolodge de Simal un modèle de tourisme durable et chaleureux au Sénégal.

Je vous contacte au nom de Domtom Connect. Nous développons un réseau d'affaires et de mise en relation reliant l'Afrique de l'Ouest, les Caraïbes et la diaspora.

Nos membres et dirigeants d'entreprises organisent régulièrement des séjours de ressourcement ou des séminaires d'équipe et recherchent des lieux préservés porteurs de sens. Nous serions enchantés de promouvoir votre écolodge auprès de notre écosystème afin de favoriser des réservations directes et de faire connaissance.

Seriez-vous ouverts à un court échange téléphonique ou visio de quinze minutes cette semaine ?

Vous pouvez réserver facilement un moment sur mon agenda,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "Coucoué Lodge",
        "email": "contact@coucoue-lodge.com",
        "territory": "Côte d'Ivoire (Assinie)",
        "source": "https://www.coucoue-lodge.com",
        "subject": "Échange d'affaires et synergies pour la direction de Coucoué Lodge",
        "body": """Bonjour,

La notoriété et le cadre d'exception de Coucoué Lodge en bord de lagune à Assinie en font une référence incontournable de l'hospitalité et de la détente haut de gamme en Côte d'Ivoire.

Je vous écris au nom de Domtom Connect. Nous animons un écosystème de chefs d'entreprise et d'investisseurs reliant l'Afrique francophone, les territoires caribéens et leurs diasporas.

Nos dirigeants partenaires organisent fréquemment des retraites professionnelles, des séjours privés ou des événements exclusifs et privilégient des adresses emblématiques comme la vôtre. Nous aimerions échanger avec vous pour envisager des partenariats de recommandation directe et vous présenter notre écosystème d'accompagnement.

Auriez-vous un quart d'heure à m'accorder au téléphone ces prochains jours ?

Vous pouvez sélectionner le moment qui vous convient sur ce lien,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    },
    {
        "company": "La Maison d'Akoula",
        "email": "contact@akoula.ci",
        "territory": "Côte d'Ivoire (Assinie)",
        "source": "https://www.akoula.ci",
        "subject": "Clientèle directe et opportunités d'affaires pour La Maison d'Akoula",
        "body": """Bonjour,

L'exclusivité et le raffinement de vos lodges privatifs à Assinie incarnent une vision moderne et élégante du séjour de prestige en Côte d'Ivoire.

Je me permets de vous contacter au nom de Domtom Connect. Notre communauté rassemble des décideurs, investisseurs et cadres de la diaspora et de l'Afrique de l'Ouest.

Pour leurs séjours de détente comme pour des temps d'échange discrets, nos membres apprécient particulièrement les cadres confidentiels et de grand standing. Nous serions honorés de faire connaître La Maison d'Akoula au sein de notre réseau d'affaires et de faire votre connaissance lors d'un court échange.

Seriez-vous disponibles pour une conversation téléphonique de quinze minutes cette semaine ?

Vous pouvez retenir votre créneau directement sur mon agenda en ligne,
calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur de Domtom Connect
Téléphone direct, +33 6 20 78 33 77
Site web, www.domtomconnect.com
Pôle tourisme, www.domtomconnect.com/entreprises-tourisme"""
    }
]

print(f"Total leads compiled: {len(LEADS_82)}")

# Strictest validation checks
for idx, lead in enumerate(LEADS_82, 1):
    subj = lead['subject']
    body = lead['body']
    
    # Rule 1: No colon in subject or body
    if ':' in subj:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ':' in subject: {subj}")
    if ':' in body:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ':' in body!")
        
    # Rule 2: No mid-sentence dashes
    if ' - ' in body:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ' - ' in body!")
    if ' - ' in subj:
        raise ValueError(f"Lead {idx} ({lead['company']}) has ' - ' in subject!")
        
    # Rule 3: Zero unicode emoji
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
    if emoji_pattern.findall(subj) or emoji_pattern.findall(body):
        raise ValueError(f"Lead {idx} has emoji!")
        
    # Rule 4: Canonical Calendly and Phone
    if 'calendly.com/domtomconnect/30min' not in body:
        raise ValueError(f"Lead {idx} missing calendly!")
    if '+33 6 20 78 33 77' not in body:
        raise ValueError(f"Lead {idx} missing phone!")

print("100% of leads passed all strict rules (zero colon, zero mid-sentence dash, zero emoji, official contacts)!")

# Save to JSON
with open('scripts/batch_82_conciergeries_lodges.json', 'w', encoding='utf-8') as f:
    json.dump(LEADS_82, f, indent=2, ensure_ascii=False)

print("Saved to scripts/batch_82_conciergeries_lodges.json successfully!")
