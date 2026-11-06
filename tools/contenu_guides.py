"""Guides pratiques et outils gratuits. Contenu concret, aucune promesse chiffrée, aucun client inventé.
Les montants et délais administratifs ne sont jamais cités car ils changent : on renvoie vers l'organisme officiel."""

AUTEUR = "Loïc Villeronce"

# ---------------------------------------------------------------- guides par problème
GUIDES = [
 {"slug": "sortir-des-plateformes-de-reservation", "theme": "tourisme",
  "title": "Réduire sa dépendance à Booking et Airbnb aux Antilles et dans la Caraïbe | Domtom Connect",
  "description": "Hébergeurs, activités, loueurs des Antilles et de la Caraïbe : la méthode concrète pour récupérer des réservations en direct sans quitter les plateformes du jour au lendemain.",
  "eyebrow": "Guide pratique · Tourisme", "h1": ("Récupérer des réservations en direct,", "sans quitter les plateformes du jour au lendemain."),
  "lead": "Les plateformes vous apportent de la visibilité, mais prennent une commission sur chaque client, y compris sur ceux qui reviennent ou qui vous auraient trouvé seuls. L'objectif n'est pas de les quitter, mais de reprendre la main sur une partie de vos réservations.",
  "facts": [("Commission", "prélevée sur chaque réservation"), ("Clients fidèles", "souvent repris par la plateforme"), ("Objectif", "un équilibre plateformes et direct")],
  "sections": [
   {"type": "prose", "eyebrow": "Le problème", "h2": "Pourquoi tant d'hébergeurs se sentent coincés", "p": [
     "Aux Antilles, en Guyane et dans toute la Caraïbe, une grande partie des hébergements, des activités et des locations dépend des grandes plateformes. Elles apportent des clients que vous n'auriez pas eus seuls, c'est indéniable. Mais elles prélèvent leur commission sur chaque réservation, contrôlent le contact avec le client et peuvent changer leurs règles à tout moment.",
     "Le vrai coût, ce n'est pas seulement la commission. C'est le client qui revient l'année suivante et repasse par la plateforme, l'ami qu'il recommande et qui réserve aussi par la plateforme, et l'absence de lien direct pour lui proposer une autre date ou une autre prestation."]},
   {"type": "etapes", "eyebrow": "La méthode", "h2": "Six étapes pour récupérer des réservations en direct", "items": [
     ("Calculez ce que vous coûtent vraiment les plateformes", "Prix moyen, nombre de nuits ou de prestations, commission. Notre calculateur gratuit vous donne le chiffre en une minute."),
     ("Ayez un site qui permet de réserver", "Pas une simple vitrine : des disponibilités, un prix clair, un bouton pour réserver ou demander, et si possible un paiement ou un acompte en ligne."),
     ("Soignez votre fiche Google", "Beaucoup de voyageurs tapent votre nom ou votre activité sur Google. Une fiche complète, avec des photos et des avis, renvoie vers votre site."),
     ("Récupérez le contact de chaque client", "Pendant le séjour, proposez de rejoindre votre liste WhatsApp ou e-mail pour être prévenu des disponibilités et des offres de fidélité."),
     ("Donnez une vraie raison de réserver en direct", "Un service en plus, un horaire d'arrivée plus souple, un conseil personnalisé. Respectez les règles de chaque plateforme sur la parité tarifaire."),
     ("Mesurez chaque mois", "Part des réservations directes, chiffre récupéré, origine des clients. Ce qui se mesure s'améliore.")]},
   {"type": "cartes", "eyebrow": "Les erreurs à éviter", "h2": "Ce qui fait échouer la plupart des tentatives", "items": [
     ("Quitter les plateformes d'un coup", "Elles restent une source de clients. On rééquilibre progressivement."),
     ("Un site sans réservation", "Si le client doit écrire un mail et attendre, il retourne sur la plateforme."),
     ("Oublier les clients passés", "Vos anciens clients sont les plus faciles à faire revenir en direct.")]},
   {"type": "outil", "slug": "calculateur-commissions-reservation", "texte": "Combien vous coûtent les plateformes chaque année ? Faites le calcul en une minute."},
  ],
  "faq": [("Est-ce que j'ai le droit de proposer un prix plus bas en direct ?", "Cela dépend des conditions de chaque plateforme et de votre contrat. Renseignez-vous avant. Vous pouvez souvent offrir un service ou un avantage plutôt qu'un prix plus bas."),
          ("Combien de réservations directes peut-on espérer ?", "Cela dépend de votre activité, de votre clientèle et de votre présence en ligne. Personne ne peut promettre un chiffre, mais chaque réservation récupérée est une commission économisée."),
          ("Faut-il un site cher pour réserver en direct ?", "Non. Il faut surtout un site clair, rapide sur téléphone et qui permet de réserver ou de demander facilement. Le devis dépend des fonctions dont vous avez besoin.")],
  "cta": "/creation-site-web"},
 {"slug": "remplir-en-basse-saison", "theme": "tourisme",
  "title": "Remplir en basse saison aux Antilles, en Guyane et dans la Caraïbe | Domtom Connect",
  "description": "Hébergeurs, restaurants, activités : les leviers concrets pour remplir en basse saison aux Antilles et dans la Caraïbe, clientèle locale, diaspora, groupes et offres adaptées.",
  "eyebrow": "Guide pratique · Tourisme et restauration", "h1": ("Remplir en basse saison,", "au lieu de la subir chaque année."),
  "lead": "La haute saison remplit tout, puis viennent des mois plus calmes qui pèsent sur la trésorerie et sur le moral. Les entreprises qui s'en sortent le mieux ne subissent pas la basse saison, elles la préparent avec des clientèles et des offres différentes.",
  "facts": [("Clientèle locale", "souvent oubliée"), ("Diaspora", "voyage aussi hors saison"), ("Groupes", "entreprises, associations, écoles")],
  "sections": [
   {"type": "prose", "eyebrow": "Le constat", "h2": "Pourquoi la basse saison fait si mal", "p": [
     "Dans beaucoup d'îles, l'activité touristique se concentre sur quelques mois. Le reste de l'année, les charges continuent, les équipes doivent être payées et les investissements attendent. Beaucoup d'entreprises compensent en baissant leurs prix sur les plateformes, ce qui réduit encore leur marge.",
     "Pourtant, d'autres clientèles existent hors saison : les habitants de l'île, la diaspora qui rentre pour les vacances scolaires ou les fêtes, les entreprises qui organisent des séminaires et des sorties, les associations et les écoles."]},
   {"type": "etapes", "eyebrow": "Les leviers", "h2": "Cinq leviers concrets pour la basse saison", "items": [
     ("Les résidents de l'île", "Offres week-end, menus du midi, activités pour les familles. Ils sont là toute l'année et recommandent autour d'eux."),
     ("La diaspora", "Vacances scolaires, fêtes, retours au pays. Une communication ciblée vers la diaspora de l'Hexagone ou d'Amérique du Nord peut remplir des périodes creuses."),
     ("Les groupes et les entreprises", "Séminaires, sorties d'équipe, comités d'entreprise, associations sportives ou culturelles. Une offre groupe claire sur votre site attire ces demandes."),
     ("Les événements", "Soirées à thème, ateliers, privatisations. Ils créent une raison de venir à une période calme."),
     ("La trésorerie anticipée", "Prévoir dès la haute saison ce qui servira à tenir pendant la basse saison, et planifier les travaux et les congés à ce moment-là.")]},
   {"type": "cartes", "eyebrow": "Les erreurs à éviter", "h2": "Ce qui aggrave la basse saison", "items": [
     ("Tout miser sur les promotions", "Baisser les prix sans changer de clientèle réduit surtout la marge."),
     ("Communiquer trop tard", "Une offre de basse saison se prépare et se diffuse plusieurs semaines avant."),
     ("Ignorer les données", "Regarder les mois creux des années passées permet d'anticiper.")]},
   {"type": "outil", "slug": "calculateur-commissions-reservation", "texte": "Vous voulez savoir ce que les plateformes vous coûtent sur l'année ? Utilisez le calculateur gratuit."},
  ],
  "faq": [("La basse saison est-elle la même partout ?", "Non. Elle varie selon l'île, le type de clientèle et votre activité. C'est pour ça qu'on part toujours de vos propres chiffres."),
          ("Comment toucher la diaspora ?", "Par vos réseaux sociaux, par des partenaires dans l'Hexagone ou en Amérique du Nord, et par le réseau Domtom Connect et l'application DTC Pulse."),
          ("Pouvez-vous m'aider à construire une offre de basse saison ?", "Oui, c'est typiquement le travail d'une séance stratégique d'une heure, avec un plan d'action écrit.")],
  "cta": "/seance-strategique"},
 {"slug": "etre-paye-plus-vite-btp", "theme": "btp",
  "title": "BTP en Outre-mer : se faire payer plus vite et protéger sa trésorerie | Domtom Connect",
  "description": "Entreprises du BTP aux Antilles, en Guyane et à La Réunion : les méthodes concrètes pour réduire les délais de paiement, mieux facturer et ne plus découvrir les trous de trésorerie au dernier moment.",
  "eyebrow": "Guide pratique · BTP et bâtiment", "h1": ("Se faire payer plus vite", "et arrêter d'avancer l'argent des autres."),
  "lead": "Dans le BTP en Outre-mer, on paie les salaires, le carburant et les matériaux tout de suite, et on est payé des semaines plus tard. Ce décalage met en danger des entreprises pourtant rentables. Voici comment le réduire concrètement.",
  "facts": [("Acomptes", "à prévoir dès le devis"), ("Situations", "à facturer sans attendre"), ("Relances", "organisées, pas improvisées")],
  "sections": [
   {"type": "prose", "eyebrow": "Le problème", "h2": "Pourquoi les entreprises du bâtiment manquent de trésorerie", "p": [
     "Entre les délais d'approvisionnement maritime, l'octroi de mer, les situations de travaux validées tardivement et les retards de paiement de certains donneurs d'ordre, la trésorerie des entreprises du BTP ultramarines est sous tension permanente.",
     "Le plus souvent, le problème n'est pas le manque de chantiers. C'est l'organisation de la facturation et du suivi des paiements, faite le soir, en retard, après une journée sur le terrain."]},
   {"type": "etapes", "eyebrow": "La méthode", "h2": "Six actions pour encaisser plus vite", "items": [
     ("Prévoir un acompte dans chaque devis", "Pour les clients particuliers comme pour les professionnels quand c'est possible, l'acompte finance les premiers achats."),
     ("Facturer les situations sans attendre", "Une situation facturée en retard, c'est un paiement en retard. Bloquez un créneau fixe chaque semaine."),
     ("Écrire des conditions de paiement claires", "Délai, pénalités de retard et indemnité forfaitaire pour les professionnels, mentionnés sur le devis et la facture."),
     ("Relancer avec un calendrier", "Une relance amiable à l'échéance, une deuxième une semaine après, puis un appel. Toujours les mêmes étapes, sans gêne."),
     ("Suivre un tableau de trésorerie simple", "Ce qui doit rentrer, ce qui doit sortir, semaine par semaine. On voit les tensions venir au lieu de les subir."),
     ("Connaître les recours", "Pour les marchés publics et les gros donneurs d'ordre, renseignez-vous sur les délais légaux et les dispositifs de médiation des entreprises.")]},
   {"type": "cartes", "eyebrow": "Les erreurs à éviter", "h2": "Ce qui creuse la trésorerie", "items": [
     ("Démarrer sans acompte", "Vous financez le chantier du client avec votre propre argent."),
     ("Facturer le vendredi soir", "La facturation passe toujours après le chantier, et les retards s'accumulent."),
     ("Ne pas relancer par peur de vexer", "Un client professionnel s'attend à être relancé. C'est votre argent.")]},
  ],
  "faq": [("Pouvez-vous m'aider à organiser la facturation et les relances ?", "Oui, c'est le cœur du copilotage que nous proposons aux entreprises du BTP, avec des modèles et un suivi."),
          ("Les délais de paiement sont-ils encadrés par la loi ?", "Oui, entre professionnels, des délais maximums et des pénalités de retard sont prévus. Vérifiez les règles applicables à votre situation auprès de votre expert-comptable."),
          ("Est-ce que c'est adapté à une petite entreprise artisanale ?", "Oui. Les mêmes principes s'appliquent, avec des outils plus simples.")],
  "cta": "/entreprises-btp"},
 {"slug": "vendre-a-la-diaspora", "theme": "diaspora",
  "title": "Vendre à la diaspora depuis la Caraïbe ou l'Afrique, la méthode concrète | Domtom Connect",
  "description": "Producteurs, marques, artisans et entreprises de services de la Caraïbe et d'Afrique : comment vendre à la diaspora en France, au Canada, aux États-Unis et au Royaume-Uni, étape par étape.",
  "eyebrow": "Guide pratique · Diaspora et vente en ligne", "h1": ("Vendre à la diaspora,", "étape par étape."),
  "lead": "Des millions de personnes originaires de la Caraïbe et d'Afrique vivent en France, au Canada, aux États-Unis et au Royaume-Uni. Beaucoup cherchent les produits, les saveurs et les services de chez eux, et sont prêtes à payer pour les recevoir. Encore faut-il qu'elles puissent vous trouver, vous faire confiance et commander facilement.",
  "facts": [("Confiance", "le premier frein à lever"), ("Logistique", "à organiser avant de vendre"), ("Communauté", "le meilleur canal")],
  "sections": [
   {"type": "prose", "eyebrow": "L'opportunité", "h2": "Pourquoi la diaspora est un vrai marché", "p": [
     "La diaspora garde un lien fort avec son territoire d'origine : produits alimentaires, cosmétiques, artisanat, mode, musique, mais aussi services comme la construction, l'immobilier, les démarches ou le tourisme de retour. Elle achète souvent pour elle et pour sa famille restée au pays.",
     "Le frein principal n'est pas l'envie, c'est la confiance et la simplicité. Un client à Paris ou à Montréal ne commande pas à une entreprise qu'il ne connaît pas si le site est flou, le paiement compliqué ou la livraison incertaine."]},
   {"type": "etapes", "eyebrow": "La méthode", "h2": "Six étapes pour vendre à la diaspora", "items": [
     ("Choisir les bons produits", "Ceux qui voyagent bien, se conservent, et que la diaspora ne trouve pas facilement là où elle vit."),
     ("Régler la logistique avant de vendre", "Expédition, groupage, point relais, partenaire sur place. Le client doit savoir quand et comment il reçoit."),
     ("Vérifier les règles d'import", "Certains produits, notamment alimentaires ou cosmétiques, sont soumis à des règles dans le pays de destination. Renseignez-vous avant."),
     ("Créer une boutique claire", "Photos, prix, frais de livraison, délais et paiement sécurisé. Tout doit être visible avant la commande."),
     ("Passer par la communauté", "Associations, églises, groupes WhatsApp et Facebook, influenceurs de la diaspora, réseau Domtom Connect et application DTC Pulse."),
     ("Rassurer à chaque étape", "Avis clients, réponses rapides sur WhatsApp, suivi de commande. La confiance se construit commande après commande.")]},
   {"type": "cartes", "eyebrow": "Les erreurs à éviter", "h2": "Ce qui bloque les ventes", "items": [
     ("Vendre avant d'avoir la logistique", "Un retard de livraison peut détruire la confiance de toute une communauté."),
     ("Des frais cachés", "Les frais de livraison découverts au dernier moment font abandonner le panier."),
     ("Compter uniquement sur les réseaux sociaux", "Un site ou une boutique reste indispensable pour encaisser et rassurer.")]},
   {"type": "outil", "slug": "calculateur-prix-plancher", "texte": "Avant de fixer vos prix pour la diaspora, calculez votre prix plancher avec l'outil gratuit."},
  ],
  "faq": [("Qu'est-ce que DTC Pulse ?", "C'est l'application de réseau de Domtom Connect pour les entrepreneurs et les communautés de la Caraïbe, de l'Afrique et de la diaspora. Chaque entreprise y crée et gère elle-même son compte."),
          ("Pouvez-vous créer ma boutique en ligne ?", "Oui, la création de boutique en ligne fait partie de nos offres sur devis, après un échange offert de 30 minutes."),
          ("Je vis dans la diaspora et je veux vendre des produits du pays, c'est pour moi ?", "Oui. La méthode est la même, vue depuis l'autre côté, et la séance stratégique permet de poser votre plan.")],
  "cta": "/creation-site-web"},
 {"slug": "trouver-des-clients-sur-whatsapp", "theme": "general",
  "title": "Trouver et fidéliser des clients avec WhatsApp Business, Caraïbe et Afrique | Domtom Connect",
  "description": "WhatsApp est le premier canal commercial aux Antilles et en Afrique. La méthode concrète pour l'utiliser avec WhatsApp Business sans harceler vos clients ni y passer vos soirées.",
  "eyebrow": "Guide pratique · Vente et relation client", "h1": ("WhatsApp, votre premier canal de vente,", "à condition de l'organiser."),
  "lead": "Aux Antilles, en Guyane, en Afrique et dans la diaspora, beaucoup de ventes commencent par un message WhatsApp. C'est une force, mais sans organisation, les messages se perdent, les clients attendent et vous répondez à minuit.",
  "facts": [("Catalogue", "vos produits dans l'application"), ("Réponses rapides", "pour les questions récurrentes"), ("Étiquettes", "pour suivre chaque client")],
  "sections": [
   {"type": "prose", "eyebrow": "Le constat", "h2": "Pourquoi WhatsApp mérite une vraie méthode", "p": [
     "Vos clients préfèrent écrire plutôt qu'appeler, et ils attendent une réponse rapide. Beaucoup d'entrepreneurs utilisent leur WhatsApp personnel, mélangent famille et clients, et perdent des ventes simplement parce qu'un message est resté sans réponse.",
     "WhatsApp Business, l'application gratuite pour les professionnels, propose des outils simples qui changent tout quand on les utilise vraiment : profil d'entreprise, catalogue, réponses rapides, message d'absence, étiquettes."]},
   {"type": "etapes", "eyebrow": "La méthode", "h2": "Six réglages et habitudes qui font vendre", "items": [
     ("Séparer le pro du perso", "Un numéro et un compte WhatsApp Business dédiés à l'activité."),
     ("Compléter le profil", "Description, horaires, adresse ou zone, lien vers votre site."),
     ("Créer le catalogue", "Vos produits ou prestations avec photo, prix et description. Le client choisit sans vous poser dix questions."),
     ("Préparer des réponses rapides", "Tarifs, délais, livraison, modalités de paiement. Une touche au lieu de retaper le même message."),
     ("Étiqueter chaque conversation", "Nouveau contact, devis envoyé, à relancer, client. Vous savez où en est chacun."),
     ("Relier WhatsApp à votre site", "Un bouton sur le site qui ouvre la conversation avec un message déjà préparé. La demande arrive qualifiée.")]},
   {"type": "cartes", "eyebrow": "Les erreurs à éviter", "h2": "Ce qui fait fuir sur WhatsApp", "items": [
     ("Envoyer des messages en masse non sollicités", "Ça agace, et les signalements peuvent faire bloquer votre compte."),
     ("Répondre trois jours plus tard", "Un message d'absence et des horaires clairs valent mieux qu'un silence."),
     ("Tout négocier par écrit sans trace", "Confirmez les prix et les délais par un devis ou un récapitulatif.")]},
  ],
  "faq": [("WhatsApp Business est-il payant ?", "L'application WhatsApp Business est gratuite. Des offres payantes existent pour les grandes entreprises qui automatisent beaucoup de messages."),
          ("Peut-on relier WhatsApp à un site internet ?", "Oui, avec un bouton qui ouvre directement la conversation. Nous l'intégrons à tous les sites que nous créons."),
          ("Pouvez-vous m'aider à organiser ma relation client ?", "Oui, dans le cadre du copilotage ou d'une séance stratégique.")],
  "cta": "/seance-strategique"},
]

# ---------------------------------------------------------------- guides « créer son entreprise »
CREATION_DOM = {
 "etapes": [
  ("Clarifier le projet et le marché", "Qui sont vos clients, combien sont-ils prêts à payer, qui sont vos concurrents dans l'île. C'est l'étape la plus souvent bâclée."),
  ("Choisir le statut juridique", "Micro-entreprise, entreprise individuelle, EURL, SASU, SARL ou SAS. Le choix dépend de votre chiffre d'affaires prévu, de vos charges et de votre protection sociale. Faites-vous conseiller par un expert-comptable."),
  ("Faire les formalités en ligne", "Depuis 2023, toutes les créations d'entreprise se déclarent sur le guichet unique en ligne de l'INPI, formalites.entreprises.gouv.fr, y compris en Outre-mer."),
  ("Se renseigner sur les aides", "ACRE, dispositifs de la Région, prêts d'honneur, microcrédit de l'ADIE, et en Outre-mer les exonérations LODEOM et les zones franches d'activité nouvelle génération (ZFANG), sous conditions."),
  ("Ouvrir un compte et organiser sa gestion", "Compte professionnel, outil de facturation, suivi de trésorerie dès le premier mois."),
  ("Trouver ses premiers clients", "Avant même l'immatriculation, testez votre offre auprès de vrais clients. C'est le meilleur moyen de ne pas investir dans le vide."),
 ],
 "aides": [("ACRE", "Une exonération partielle de cotisations sociales au démarrage, sous conditions."),
           ("LODEOM", "Des exonérations de cotisations patronales spécifiques à l'Outre-mer, pour les entreprises qui embauchent, sous conditions."),
           ("ZFANG", "Les zones franches d'activité nouvelle génération offrent des abattements fiscaux en Outre-mer pour certains secteurs, sous conditions."),
           ("Prêts d'honneur et microcrédit", "Les réseaux de prêt d'honneur et l'ADIE financent des créateurs qui n'ont pas accès au crédit bancaire classique.")],
}

CREATION = [
 {"slug": "creer-son-entreprise-en-guadeloupe", "pays": "Guadeloupe", "en": "en Guadeloupe", "terr": "guadeloupe", "type": "dom",
  "local": ["En Guadeloupe, créer son entreprise suit les mêmes règles que dans l'Hexagone, avec des spécificités ultramarines fortes : coût du transport et des marchandises, octroi de mer, marché insulaire où la réputation circule vite, et dispositifs d'aide propres à l'Outre-mer.",
            "Les acteurs locaux à connaître sont la CCI Îles de Guadeloupe, la Chambre de métiers et de l'artisanat pour les artisans, la Région Guadeloupe pour les aides régionales, et les réseaux d'accompagnement à la création. Votre expert-comptable reste votre meilleur allié pour le choix du statut."]},
 {"slug": "creer-son-entreprise-en-martinique", "pays": "Martinique", "en": "en Martinique", "terr": "martinique", "type": "dom",
  "local": ["En Martinique, la création d'entreprise suit le droit français, avec les réalités d'un marché insulaire concentré : beaucoup de concurrence dans certains secteurs, des coûts d'approvisionnement élevés liés au transport et à l'octroi de mer, et une clientèle qui compare vite.",
            "Les interlocuteurs à connaître sont la CCI Martinique, la Chambre de métiers et de l'artisanat, la Collectivité Territoriale de Martinique pour les aides, et le réseau Martinique Développement qui coordonne des acteurs de l'accompagnement. Faites valider votre statut par un expert-comptable."]},
 {"slug": "creer-son-entreprise-en-guyane", "pays": "Guyane", "en": "en Guyane", "terr": "guyane", "type": "dom",
  "local": ["En Guyane, territoire jeune et en croissance, beaucoup de projets se lancent. Les distances entre communes, la logistique et la dépendance aux approvisionnements extérieurs doivent être intégrées dès le départ dans le prix et l'organisation.",
            "Les interlocuteurs à connaître sont la CCI de Guyane, la Chambre de métiers et de l'artisanat, la Collectivité Territoriale de Guyane pour les aides, et les réseaux d'accompagnement à la création. Un expert-comptable vous aidera à choisir le bon statut."]},
 {"slug": "creer-son-entreprise-a-la-reunion", "pays": "La Réunion", "en": "à La Réunion", "terr": "reunion", "type": "dom",
  "local": ["À La Réunion, le marché est plus large que dans la plupart des îles, mais aussi plus concurrentiel. Les coûts d'approvisionnement et l'octroi de mer pèsent sur les marges, et la proximité de Maurice, de Madagascar et de Mayotte peut ouvrir des perspectives régionales.",
            "Les interlocuteurs à connaître sont la CCI Réunion, la Chambre de métiers et de l'artisanat, la Région Réunion pour les aides et les réseaux d'accompagnement à la création. Votre expert-comptable vous orientera sur le statut le plus adapté."]},
 {"slug": "creer-son-entreprise-au-senegal", "pays": "Sénégal", "en": "au Sénégal", "terr": "senegal", "type": "ohada",
  "organisme": "l'APIX, l'Agence pour la promotion des investissements et des grands travaux, qui gère le guichet de création d'entreprise",
  "local": ["Au Sénégal, comme dans les autres pays de l'espace OHADA, le droit des affaires est harmonisé : les formes juridiques comme l'entreprise individuelle, la SARL ou la SAS sont communes à 17 pays africains, ce qui facilite les projets régionaux.",
            "La création d'entreprise se fait auprès de l'APIX, qui centralise les formalités. Dakar concentre une grande partie de l'activité, mais les régions offrent aussi des opportunités, et le paiement mobile est très répandu, ce qui change la façon de vendre."]},
 {"slug": "creer-son-entreprise-en-cote-d-ivoire", "pays": "Côte d'Ivoire", "en": "en Côte d'Ivoire", "terr": "cote-d-ivoire", "type": "ohada",
  "organisme": "le CEPICI, le Centre de promotion des investissements en Côte d'Ivoire, qui abrite le guichet unique de création d'entreprise",
  "local": ["En Côte d'Ivoire, le droit des affaires suit l'OHADA, avec des formes juridiques communes à 17 pays africains, comme l'entreprise individuelle, la SARL ou la SAS.",
            "Les formalités de création passent par le guichet unique du CEPICI à Abidjan. Le marché ivoirien est l'un des plus dynamiques d'Afrique de l'Ouest, ce qui attire aussi beaucoup de concurrence : une offre claire et une organisation solide dès le départ font la différence."]},
 {"slug": "creer-son-entreprise-au-cameroun", "pays": "Cameroun", "en": "au Cameroun", "terr": "cameroun", "type": "ohada",
  "organisme": "les Centres de formalités de création d'entreprises (CFCE), présents dans plusieurs grandes villes",
  "local": ["Au Cameroun, pays membre de l'OHADA, les formes juridiques sont communes à 17 pays africains, et le bilinguisme français anglais est un atout pour travailler avec les pays voisins.",
            "Les formalités se font auprès des Centres de formalités de création d'entreprises (CFCE). Douala, capitale économique, et Yaoundé concentrent une grande partie de l'activité, et la diaspora camerounaise est souvent impliquée dans les projets comme cliente, partenaire ou investisseuse."]},
]

CREATION_OHADA = {
 "etapes": [
  ("Clarifier le projet et le marché", "Qui sont vos clients, combien sont-ils prêts à payer, comment ils paient, qui sont vos concurrents. C'est l'étape la plus souvent bâclée."),
  ("Choisir la forme juridique", "Entrepreneur individuel, statut de l'entreprenant prévu par l'OHADA pour les très petites activités, SARL ou SAS selon votre projet et vos associés. Faites-vous conseiller."),
  ("Réaliser les formalités", "Auprès de {organisme}. Renseignez-vous directement auprès de l'organisme pour les pièces et les frais en vigueur."),
  ("Organiser les paiements", "Compte bancaire professionnel, mais aussi paiement mobile, très utilisé par vos clients. Séparez dès le départ l'argent de l'entreprise et l'argent personnel."),
  ("Mettre en place une gestion simple", "Facturation, suivi des encaissements et des dépenses, trésorerie semaine par semaine."),
  ("Trouver ses premiers clients", "Testez votre offre auprès de vrais clients avant d'investir lourdement, y compris auprès de la diaspora si votre produit s'y prête."),
 ],
 "aides": [("OHADA", "Un droit des affaires commun à 17 pays, utile pour les projets régionaux."),
           ("Statut de l'entreprenant", "Une forme simplifiée prévue par l'OHADA pour démarrer une petite activité."),
           ("La diaspora", "Cliente, partenaire ou investisseuse, elle peut accélérer un projet bien structuré."),
           ("Le paiement mobile", "Un canal d'encaissement que vos clients utilisent déjà au quotidien.")],
}

# ---------------------------------------------------------------- outils
OUTILS = [
 {"slug": "calculateur-commissions-reservation", "lang": "fr",
  "title": "Calculateur gratuit : combien vous coûtent Booking, Airbnb et les plateformes ? | Domtom Connect",
  "description": "Hébergeurs et activités des Antilles et de la Caraïbe : calculez en une minute ce que les commissions des plateformes de réservation vous coûtent chaque année, et ce que vous pourriez récupérer en direct.",
  "eyebrow": "Outil gratuit · Tourisme", "h1": ("Combien vous coûtent", "les plateformes de réservation ?"),
  "lead": "Renseignez votre prix moyen, votre volume et la commission de vos plateformes. Le calcul se fait directement dans votre navigateur, rien n'est enregistré."},
 {"slug": "booking-commission-calculator", "lang": "en",
  "title": "Free booking commission calculator for Caribbean hotels and tours | Domtom Connect",
  "description": "Hotels, villas, guesthouses and tour operators in the Caribbean: calculate in one minute how much booking platform commissions cost you every year, and how much you could keep with direct bookings.",
  "eyebrow": "Free tool · Caribbean tourism", "h1": ("How much do booking platforms", "really cost you?"),
  "lead": "Enter your average price, your volume and your platform commission. The calculation runs in your browser, nothing is stored."},
 {"slug": "calculateur-prix-plancher", "lang": "fr",
  "title": "Calculateur gratuit de prix plancher pour entrepreneurs | Domtom Connect",
  "description": "Porteurs de projet de la Caraïbe, d'Afrique et de la diaspora : calculez le prix minimum de votre produit ou service et le nombre de ventes nécessaires pour vivre de votre activité.",
  "eyebrow": "Outil gratuit · Porteurs de projet", "h1": ("Votre prix plancher,", "calculé en une minute."),
  "lead": "Le prix plancher, c'est le prix en dessous duquel vous perdez de l'argent. Beaucoup d'entrepreneurs le découvrent trop tard. Calculez le vôtre maintenant, le calcul se fait dans votre navigateur."},
]
