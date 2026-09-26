import json, sys, os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

sys.stdout.reconfigure(encoding='utf-8')

# 50 CIBLES ULTRA-QUALIFIÉES - BATCH 58 (VAGUE 4 / 4)
# Secteur : Activités Nautiques, Plaisance, Charters, Plongée & Sports de Mer
# Répartition : 12 Guadeloupe + 8 Martinique + 9 Saint-Martin & Saint-Barth + 11 La Réunion + 5 Mayotte + 5 Polynésie française
LEADS = [
    # --- GUADELOUPE (12) ---
    {
        "company": "Anse Caraïbe Plongée",
        "email": "jazzdive971@gmail.com",
        "territory": "Guadeloupe (Pointe-Noire)",
        "source": "https://plongee-guadeloupe-reserve-cousteau.fr",
        "subject": "Échange sur vos activités de plongée / Anse Caraïbe Plongée",
        "body": """Bonjour,

Bravo pour votre passion et votre investissement quotidien à Pointe-Noire pour faire découvrir les trésors sous-marins de la Guadeloupe et de la Réserve Cousteau.

Chez Domtom Connect, nous accompagnons les professionnels du tourisme et de la mer dans nos îles afin de les aider à développer leur visibilité directe et briser l'effet de saisonnalité.

Dans votre activité de plongée aujourd'hui, quelle est la priorité numéro un qui mobilise votre énergie — capter des réservations directes, entretenir vos équipements ou recruter des moniteurs qualifiés ?

Nous animons par ailleurs une communauté WhatsApp active regroupant des entrepreneurs et mettons à disposition l'application mobile DTC Pulse.

Seriez-vous partant pour convenir d'un court échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Atlantis Plongée",
        "email": "contact@atlantisplongee.com",
        "territory": "Guadeloupe (Bouillante)",
        "source": "https://atlantisplongee.com",
        "subject": "Vos sorties sous-marines et développement / Atlantis Plongée",
        "body": """Bonjour,

Félicitations pour l'accueil chaleureux et les explorations inoubliables que votre club propose sur les fonds marins de Bouillante.

Chez Domtom Connect, notre rôle est d'épauler les dirigeants de structures nautiques afin de valoriser leurs prestations et favoriser des synergies locales fortes.

Quel est aujourd'hui votre principal défi opérationnel — la gestion des réservations, la visibilité en ligne ou les contraintes logistiques ?

Notre écosystème réunit des indépendants au sein d'un groupe d'entraide WhatsApp et via notre application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "CIP Guadeloupe",
        "email": "contact@cip-guadeloupe.com",
        "territory": "Guadeloupe (Bouillante)",
        "source": "https://cip-guadeloupe.com",
        "subject": "Activités subaquatiques et réseau d'affaires / CIP Guadeloupe",
        "body": """Bonjour,

Toutes mes félicitations pour la longévité et la qualité d'encadrement reconnue du Centre International de Plongée en Guadeloupe.

Chez Domtom Connect, nous soutenons les acteurs emblématiques de nos territoires afin d'élargir leurs relais d'affaires et de promouvoir leur expertise.

Dans la dynamique actuelle de votre centre, quel enjeu requiert le plus d'attention de votre part ?

Nous serions heureux de vous accueillir sur notre groupe WhatsApp d'entraide et de vous faire découvrir l'application DTC Pulse.

Auriez-vous dix minutes à consacrer à un échange informel par téléphone prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Infini Plongée",
        "email": "infiniplongee@gmail.com",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://infiniplongee.com",
        "subject": "Sorties plongée et entraide locale / Infini Plongée",
        "body": """Bonjour,

Bravo pour vos belles excursions marines au départ de Saint-François et pour l'expérience privilégiée offerte à vos plongeurs.

Chez Domtom Connect, nous accompagnons les professionnels de la mer pour les aider à maximiser leurs réservations en direct et fidéliser leur clientèle.

Quel est actuellement votre challenge le plus déterminant — la régularité du remplissage, la communication digitale ou l'organisation technique ?

Nous animons une communauté de pairs sur WhatsApp et proposons notre application mobile DTC Pulse.

Seriez-vous disponible pour un appel découverte de dix minutes ces jours-ci ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Noa Plongée",
        "email": "contact@noaplongee.fr",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://noaplongee.fr",
        "subject": "Développement nautique et partenariats / Noa Plongée",
        "body": """Bonjour,

Félicitations pour la renommée de Noa Plongée à la marina de Saint-François et pour vos explorations sous-marines de qualité.

Chez Domtom Connect, notre mission est de connecter les prestataires touristiques aux opportunités d'affaires de la diaspora et des îles.

Dans la conduite de votre saison nautique, quelle problématique demande le plus d'énergie à votre équipe ?

Nous serions ravis de vous présenter notre communauté WhatsApp d'entraide et l'application DTC Pulse.

Pourrions-nous prévoir un point téléphonique rapide de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Sailoé Caraïbes",
        "email": "charter@sailoe.com",
        "territory": "Guadeloupe (Pointe-à-Pitre)",
        "source": "https://sailoe.com",
        "subject": "Charters nautiques et opportunités de synergies / Sailoé Caraïbes",
        "body": """Bonjour,

Bravo pour l'excellence de votre flotte de catamarans et voiliers au départ de la Guadeloupe pour naviguer sur l'arc caribéen.

Chez Domtom Connect, nous accompagnons les acteurs de la plaisance et du charter afin de renforcer leurs canaux de commercialisation directe.

Quel est aujourd'hui votre chantier prioritaire — la captation de clientèle internationale, l'entretien naval ou l'optimisation des périodes creuses ?

Notre réseau d'entraide WhatsApp et notre application mobile DTC Pulse favorisent des coopérations directes entre professionnels.

Seriez-vous ouvert à un échange téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Corail Caraïbes",
        "email": "info@corail-caraibes.com",
        "territory": "Guadeloupe (Pointe-à-Pitre)",
        "source": "https://corail-caraibes.com",
        "subject": "Croisières en voilier et réseau d'affaires / Corail Caraïbes",
        "body": """Bonjour,

Toutes mes félicitations pour la qualité éprouvée de vos locations de voiliers et croisières aux Antilles depuis la marina de Bas-du-Fort.

Chez Domtom Connect, notre ambition est de dynamiser les entreprises nautiques en créant des passerelles concrètes avec nos membres et partenaires.

Dans l'exploitation de votre flotte, quelle est la priorité stratégique qui mobilise vos équipes actuellement ?

Nous animons une communauté WhatsApp d'entraide et mettons à disposition l'application mobile DTC Pulse.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Gwada Marine",
        "email": "gwadamarine@outlook.fr",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://gwadamarine.fr",
        "subject": "Location de bateaux et synergies / Gwada Marine",
        "body": """Bonjour,

Bravo pour vos prestations nautiques à Saint-François et pour la mise à disposition de bateaux fiables pour naviguer en Guadeloupe.

Chez Domtom Connect, nous aidons les loueurs indépendants à augmenter leur visibilité sans dépendre excessivement des commissions de plateformes tierces.

Quel est aujourd'hui votre principal défi au quotidien — la gestion du planning, l'entretien des moteurs ou la fidélisation client ?

Nous serions heureux de vous accueillir au sein de notre groupe WhatsApp d'entraide et sur notre application DTC Pulse.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Chris Marine",
        "email": "locationbateauguadeloupe@gmail.com",
        "territory": "Guadeloupe (Saint-François)",
        "source": "https://chrismarine-location.fr",
        "subject": "Flotte nautique et entraide entrepreneuriale / Chris Marine",
        "body": """Bonjour,

Félicitations pour le dynamisme de Chris Marine dans la location de bateaux à moteur pour explorer Petite-Terre et le lagon.

Chez Domtom Connect, nous apportons aux gérants de structures nautiques un appui concret pour créer des synergies territoriales.

Dans votre saison de location, quel est le besoin majeur qui sollicite le plus vos ressources en ce moment ?

Notre plateforme propose un canal WhatsApp d'entraide et l'application mobile DTC Pulse pour stimuler le bouche-à-oreille qualifié.

Pourrions-nous caler dix minutes d'échange téléphonique selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Tiki Boat Guadeloupe",
        "email": "tikiboatguadeloupe@gmail.com",
        "territory": "Guadeloupe (Le Gosier)",
        "source": "https://tikiboat.fr",
        "subject": "Expériences nautiques insolites et partenariats / Tiki Boat",
        "body": """Bonjour,

Bravo pour l'originalité et la convivialité de vos balades en Tiki Boat au départ du Gosier pour découvrir les îlets du lagon.

Chez Domtom Connect, nous mettons en lumière les concepts touristiques novateurs afin d'élargir leur audience et générer des réservations récurrentes.

Quelle est la priorité numéro un sur laquelle vous concentrez vos efforts cette année ?

Nous animons une communauté dynamique sur WhatsApp et via notre application mobile DTC Pulse.

Seriez-vous partant pour convenir d'un bref point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Fiesta Boat Location",
        "email": "fiestaboatlocation@gmail.com",
        "territory": "Guadeloupe (Sainte-Anne)",
        "source": "https://fiestaboatlocation.com",
        "subject": "Événements sur l'eau et visibilité / Fiesta Boat",
        "body": """Bonjour,

Toutes mes félicitations pour vos sorties festives et conviviales en mer à Sainte-Anne au service des groupes et des vacanciers.

Chez Domtom Connect, notre rôle est d'épauler les professionnels des loisirs maritimes dans leur organisation et leur développement d'affaires.

Quel est actuellement votre challenge le plus marquant dans la commercialisation de vos sorties ?

Nous serions ravis de vous intégrer à notre réseau d'entraide WhatsApp et de vous présenter l'application DTC Pulse.

Auriez-vous dix minutes à m'accorder par téléphone pour en discuter ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Hiwigoloc",
        "email": "contact@hiwigoloc.fr",
        "territory": "Guadeloupe (Baie-Mahault)",
        "source": "https://hiwigoloc.fr",
        "subject": "Location nautique et réseau d'affaires / Hiwigoloc",
        "body": """Bonjour,

Bravo pour votre offre complète de location nautique et vos solutions adaptées aux amateurs de sorties en mer en Guadeloupe.

Chez Domtom Connect, nous accompagnons les entrepreneurs ultramarins afin de catalyser leurs coopérations économiques et leur croissance.

Dans le développement de votre activité, quelle problématique retient le plus votre attention en ce moment ?

Nous fédérons des dirigeants au sein d'un groupe d'entraide WhatsApp et sur l'application DTC Pulse.

Pourrions-nous prévoir un échange téléphonique rapide de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- MARTINIQUE (8) ---
    {
        "company": "DSC Plongée",
        "email": "dscplongee@gmail.com",
        "territory": "Martinique (Le Diamant)",
        "source": "https://dscplongee.com",
        "subject": "Plongée au Rocher du Diamant et synergies / DSC Plongée",
        "body": """Bonjour,

Félicitations pour vos superbes plongées autour du mythique Rocher du Diamant et la qualité d'encadrement reconnue de votre équipe.

Chez Domtom Connect, nous accompagnons les centres de plongée martiniquais pour sécuriser leurs flux de réservations et renforcer leur ancrage économique.

Quel est aujourd'hui le principal enjeu opérationnel pour DSC Plongée — la logistique bateau, le recrutement de moniteurs ou l'étalement de la saison ?

Notre écosystème repose sur un groupe WhatsApp d'entraide entre professionnels et sur l'application mobile DTC Pulse.

Seriez-vous ouvert à un court appel téléphonique de dix minutes dans les jours à venir ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Marin Plongée",
        "email": "contact@marinplongee.com",
        "territory": "Martinique (Le Marin)",
        "source": "https://marinplongee.com",
        "subject": "Explorations sous-marines et développement / Marin Plongée",
        "body": """Bonjour,

Bravo pour votre passion et votre accompagnement soigné des plongeurs au départ du port de plaisance du Marin.

Chez Domtom Connect, nous aidons les structures nautiques à développer leur clientèle directe et à nouer des partenariats créateurs de valeur.

Quelle est actuellement votre priorité pour continuer à faire progresser votre club ?

Nous animons une communauté active sur WhatsApp ainsi que l'application mobile DTC Pulse, pensée pour faciliter les mises en relation.

Pourrions-nous caler dix minutes d'échange téléphonique à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Case Plongée",
        "email": "case.plongee@gmail.com",
        "territory": "Martinique (Schœlcher)",
        "source": "Annuaire FFESSM",
        "subject": "Plongée loisir et entraide locale / Case Plongée",
        "body": """Bonjour,

Toutes mes félicitations pour votre engagement subaquatique à Schœlcher et pour la convivialité qui caractérise votre club.

Chez Domtom Connect, nous soutenons les acteurs associatifs et professionnels de la mer pour leur faire bénéficier de réseaux d'entraide élargis.

Quel est aujourd'hui votre besoin prioritaire pour dynamiser vos sorties et votre matériel ?

Nous serions heureux de vous accueillir sur notre groupe WhatsApp d'entraide et de vous présenter l'application DTC Pulse.

Seriez-vous disponible pour un rapide appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "A Papa D'Lo Plongée",
        "email": "apapadlo972@gmail.com",
        "territory": "Martinique (Saint-Pierre)",
        "source": "https://habitationperlecreole.net",
        "subject": "Épaves de Saint-Pierre et réseau professionnel / A Papa D'Lo",
        "body": """Bonjour,

Bravo pour vos explorations exceptionnelles sur les célèbres épaves de la baie de Saint-Pierre et votre passion communicative pour l'histoire maritime.

Chez Domtom Connect, notre mission est de relier les passionnés et professionnels de nos îles pour amplifier leur notoriété et leurs réservations directes.

Quel est à ce stade le défi majeur dans la gestion de votre activité de plongée au nord de l'île ?

Nous animons une communauté WhatsApp d'entraide et mettons à disposition l'application mobile DTC Pulse.

Auriez-vous dix minutes à m'accorder par téléphone pour échanger tranquillement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Aliotis Martinique",
        "email": "aliotis.plongee@gmail.com",
        "territory": "Martinique (Trois-Îlets)",
        "source": "https://aliotis-martinique.com",
        "subject": "Sorties subaquatiques et opportunités / Aliotis Martinique",
        "body": """Bonjour,

Félicitations pour l'ambiance et la qualité d'encadrement d'Aliotis Plongée à la Pointe du Bout aux Trois-Îlets.

Chez Domtom Connect, nous accompagnons les professionnels du tourisme nautique afin de réduire leur dépendance aux intermédiaires et favoriser le bouche-à-oreille direct.

Quelle est la problématique qui mobilise le plus votre attention en ce moment ?

Notre démarche collaborative s'appuie sur un canal WhatsApp d'entraide et l'application mobile DTC Pulse.

Pourrions-nous prévoir un point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Autremer Concept",
        "email": "info@autremerconcept.com",
        "territory": "Martinique (Le Marin)",
        "source": "https://autremerconcept.com",
        "subject": "Gestion de flotte de catamarans et synergies / Autremer Concept",
        "body": """Bonjour,

Bravo pour la qualité de gestion de votre flotte et vos prestations de charter nautique au port de plaisance du Marin.

Chez Domtom Connect, nous soutenons les acteurs majeurs du nautisme dans nos territoires insulaires pour développer leurs alliances d'affaires.

Quel est aujourd'hui votre principal axe de progression — la fidélisation des plaisanciers, l'entretien technique ou la commercialisation internationale ?

Nous animons un réseau d'entrepreneurs sur WhatsApp et via notre application mobile DTC Pulse.

Seriez-vous partant pour convenir d'un bref point téléphonique de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Punch Croisières",
        "email": "contact@punch-croisieres.com",
        "territory": "Martinique (Le Marin)",
        "source": "https://punch-croisieres.com",
        "subject": "Croisières en mer et développement territorial / Punch Croisières",
        "body": """Bonjour,

Toutes mes félicitations pour la référence que représente Punch Croisières dans la location de voiliers et catamarans en Martinique et aux Grenadines.

Chez Domtom Connect, notre rôle est d'épauler les entreprises nautiques dans leur développement et leur mise en relation avec de nouvelles clientèles qualifiées.

Quelle est la priorité numéro un sur laquelle se concentre votre équipe actuellement ?

Nous serions ravis de vous présenter notre écosystème d'entraide WhatsApp et l'application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Seek Sail",
        "email": "contact@seeksail.com",
        "territory": "Martinique (Le Marin)",
        "source": "https://seeksail.com",
        "subject": "Location de bateaux et passerelles d'affaires / Seek Sail",
        "body": """Bonjour,

Bravo pour l'accompagnement complet que vous offrez aux plaisanciers pour la location de catamarans et voiliers aux Antilles.

Chez Domtom Connect, nous accompagnons les professionnels de la réservation nautique afin de démultiplier leurs synergies opérationnelles.

Quel est à présent le principal levier de croissance que vous souhaitez activer pour votre agence ?

Nous animons une communauté WhatsApp d'entraide entre professionnels ainsi que notre application DTC Pulse.

Seriez-vous disponible pour un appel découverte de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- SAINT-MARTIN & SAINT-BARTHÉLEMY (9) ---
    {
        "company": "Blue Odyssey Diving",
        "email": "contact@blue-odyssey-diving.com",
        "territory": "Saint-Martin",
        "source": "https://blue-odyssey-diving.com",
        "subject": "Explorations marines et développement / Blue Odyssey Diving",
        "body": """Bonjour,

Félicitations pour votre approche respectueuse des écosystèmes marins et la qualité de vos sorties plongée à Saint-Martin.

Chez Domtom Connect, nous accompagnons les professionnels du tourisme nautique dans les îles du Nord pour soutenir leur visibilité directe et leurs réservations.

Quel est aujourd'hui votre défi majeur — la captation de voyageurs directs, la saisonnalité ou la gestion logistique de vos sorties ?

Nous animons un réseau WhatsApp dédié à l'entraide professionnelle et proposons l'application mobile DTC Pulse.

Pourrions-nous prévoir un échange téléphonique de dix minutes selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Atabey Dive Center",
        "email": "atabeydivecenter@gmail.com",
        "territory": "Saint-Martin",
        "source": "https://key-paradise.com",
        "subject": "Sorties subaquatiques et réseau d'affaires / Atabey Dive Center",
        "body": """Bonjour,

Bravo pour votre implication dans la transmission de la plongée et la découverte des fonds marins de Saint-Martin.

Chez Domtom Connect, notre mission est de relier les prestataires maritimes aux opportunités économiques de la diaspora et des réseaux régionaux.

Quelle est la priorité principale qui mobilise votre équipe en ce moment ?

Nous serions ravis de vous accueillir sur notre groupe d'entraide WhatsApp et sur l'application DTC Pulse.

Auriez-vous dix minutes à consacrer à un échange téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Creole Rock Watersports",
        "email": "crwsold@gmail.com",
        "territory": "Saint-Martin",
        "source": "https://creolerockwatersports.com",
        "subject": "Loisirs nautiques et synergies / Creole Rock Watersports",
        "body": """Bonjour,

Toutes mes félicitations pour vos activités nautiques à Grand-Case et l'accueil réservé aux passionnés de glisse et de snorkeling à Saint-Martin.

Chez Domtom Connect, nous aidons les acteurs du nautisme à stimuler les réservations en direct et à briser l'effet basse saison.

Quel est aujourd'hui votre principal axe d'optimisation commerciale ou opérationnelle ?

Nous animons une communauté de dirigeants sur WhatsApp et via notre application mobile DTC Pulse.

Seriez-vous partant pour un court appel de dix minutes dans les jours à venir ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Saint Martin Boat Charter",
        "email": "info@saint-martin-boat-charter.com",
        "territory": "Saint-Martin",
        "source": "https://saint-martin-boat-charter.com",
        "subject": "Charters de bateaux et réseau d'affaires / Saint Martin Boat Charter",
        "body": """Bonjour,

Bravo pour la qualité de vos excursions privées en bateau et vos croisières sur-mesure autour de Saint-Martin, Anguilla et Saint-Barth.

Chez Domtom Connect, nous accompagnons les compagnies de charter pour développer des partenariats directs et élargir leur carnet de commandes.

Dans le développement de votre flotte, quel est le défi le plus exigeant actuellement ?

Notre plateforme réunit des professionnels au sein d'un groupe WhatsApp d'entraide et via notre application DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique informel à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Manutea Charter",
        "email": "manuteachartersxm@gmail.com",
        "territory": "Saint-Martin",
        "source": "https://manutea-charters.com",
        "subject": "Croisières catamaran et collaborations / Manutea Charter",
        "body": """Bonjour,

Félicitations pour vos croisières d'exception en catamaran et le confort remarquable offert à vos passagers au départ de Saint-Martin.

Chez Domtom Connect, notre rôle est d'apporter aux armateurs et skippers un vivier d'opportunités et des relais de recommandation solides.

Quelle est la priorité numéro un sur laquelle vous concentrez vos efforts cette saison ?

Nous animons une communauté active sur WhatsApp ainsi que notre application mobile DTC Pulse.

Seriez-vous ouvert à un point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Arawak Charters",
        "email": "contact@arawakcharters.com",
        "territory": "Saint-Martin",
        "source": "https://arawakcharters.com",
        "subject": "Expéditions marines et synergies / Arawak Charters",
        "body": """Bonjour,

Bravo pour la passion et le professionnalisme de vos sorties en mer et charters personnalisés dans les eaux caribéennes.

Chez Domtom Connect, nous soutenons les structures nautiques des îles du Nord afin de valoriser leurs compétences et développer leur clientèle directe.

Quel est aujourd'hui votre principal enjeu d'exploitation ou de commercialisation ?

Nous serions très heureux de vous faire une place au sein de notre groupe WhatsApp d'entraide et sur l'application DTC Pulse.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Caribbean Marines",
        "email": "contact@caribbeanmarines.com",
        "territory": "Saint-Martin",
        "source": "https://caribbeanmarines.com",
        "subject": "Location de bateaux haut de gamme et synergies / Caribbean Marines",
        "body": """Bonjour,

Toutes mes félicitations pour l'élégance de votre flotte de bateaux à moteur et la rigueur de vos services maritimes à Saint-Martin.

Chez Domtom Connect, nous accompagnons les professionnels de la plaisance haut de gamme pour créer des passerelles d'affaires directes.

Dans votre activité de location et charter, quel défi requiert le plus d'attention de votre part ?

Nous fédérons des acteurs économiques autour d'un canal WhatsApp d'entraide et via notre application mobile DTC Pulse.

Pourrions-nous prévoir dix minutes d'échange téléphonique prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Wind Adventures",
        "email": "info@wind-adventures.com",
        "territory": "Saint-Martin (Orient Bay)",
        "source": "https://wind-adventures.com",
        "subject": "Sports nautiques et réseau d'affaires / Wind Adventures",
        "body": """Bonjour,

Bravo pour votre référence historique dans le kitesurf, le foil, le catamaran et les sports de glisse à la Baie Orientale.

Chez Domtom Connect, nous aidons les écoles de glisse et centres nautiques à amplifier leur impact et sécuriser leur fréquentation.

Quelle est la priorité majeure qui mobilise votre équipe pour la saison à venir ?

Notre réseau comprend un groupe WhatsApp d'entraide entre professionnels ainsi que notre application DTC Pulse.

Seriez-vous partant pour convenir d'un court entretien téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Captain SUP SXM",
        "email": "captainsupsxm@gmail.com",
        "territory": "Saint-Martin",
        "source": "https://captainsup-sxm.com",
        "subject": "Paddle et excursions lagon / Captain SUP SXM",
        "body": """Bonjour,

Félicitations pour vos randonnées uniques en stand up paddle et la mise en valeur des lagons et mangroves de Saint-Martin.

Chez Domtom Connect, notre mission est de connecter les créateurs d'expériences éco-touristiques à un réseau étendu de recommandations.

Quel est actuellement votre principal défi commercial ou organisationnel au sein de votre activité ?

Nous animons une communauté WhatsApp d'entraide et mettons à disposition notre application mobile DTC Pulse.

Auriez-vous dix minutes disponibles pour un premier contact téléphonique ces jours-ci ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- LA RÉUNION (11) ---
    {
        "company": "Corail Plongée Réunion",
        "email": "info@corail-plongee.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://corail-plongee.com",
        "subject": "Plongée sous-marine et synergies régionales / Corail Plongée",
        "body": """Bonjour,

Bravo pour votre réputation solide au port de Saint-Gilles et la régularité exemplaire de vos explorations subaquatiques à La Réunion.

Chez Domtom Connect, nous accompagnons les professionnels de la mer dans l'océan Indien afin de stimuler leurs coopérations et valoriser leur savoir-faire.

Dans le développement de votre centre, quel enjeu requiert le plus d'énergie — la fidélisation des plongeurs locaux, la logistique bateau ou le recrutement ?

Nous animons un écosystème WhatsApp d'entraide entre dirigeants ainsi que l'application mobile DTC Pulse.

Seriez-vous ouvert à un court appel de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Escapade Plongée Réunion",
        "email": "contact@escapadeplongee.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://escapadeplongee.com",
        "subject": "Sorties en mer et entraide professionnelle / Escapade Plongée",
        "body": """Bonjour,

Félicitations pour la qualité de vos formations et baptêmes de plongée dans la baie de Saint-Paul et au large de Saint-Gilles.

Chez Domtom Connect, notre rôle est d'épauler les responsables de centres nautiques pour créer des partenariats territoriaux durables.

Quel est aujourd'hui votre principal défi au quotidien dans la conduite de vos activités ?

Notre communauté de pairs sur WhatsApp et notre application DTC Pulse sont conçues pour faciliter le partage de solutions concrètes.

Pourrions-nous caler dix minutes d'échange téléphonique selon votre emploi du temps ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Gecko Bleu Réunion",
        "email": "geckobleuplongee@gmail.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://geckobleu.com",
        "subject": "Plongée personnalisée et réseau d'affaires / Gecko Bleu",
        "body": """Bonjour,

Toutes mes félicitations pour la convivialité et l'approche intimiste en petits comités que vous privilégiez chez Gecko Bleu.

Chez Domtom Connect, nous valorisons les structures indépendantes qui misent sur la qualité de l'expérience client et la proximité.

Quelle est la priorité numéro un sur laquelle vous concentrez vos efforts actuellement ?

Nous vous proposons de rejoindre notre groupe WhatsApp d'entraide et d'utiliser notre application mobile DTC Pulse.

Auriez-vous dix minutes pour un premier échange téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Bulle d'Air Réunion",
        "email": "jean@bulledair.re",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://bulledair.re",
        "subject": "Formations subaquatiques et partenariats / Bulle d'Air",
        "body": """Bonjour Jean,

Bravo pour votre passion et votre dévouement de longue date pour enseigner la plongée et faire découvrir la faune réunionnaise.

Chez Domtom Connect, nous accompagnons les figures du nautisme insulaire pour briser l'isolement et ouvrir de nouveaux canaux de recommandation.

Quel est aujourd'hui votre défi majeur dans l'organisation de vos cursus et sorties en mer ?

Nous animons une communauté WhatsApp d'entraide et mettons à disposition l'application DTC Pulse.

Seriez-vous partant pour convenir d'un court échange téléphonique de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Plongée Ô Sea Bleu",
        "email": "contact@oseableu.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://oseableu.com",
        "subject": "Exploration sous-marine et synergies / Ô Sea Bleu",
        "body": """Bonjour,

Félicitations pour votre accueil bienveillant et la passion avec laquelle vous partagez la beauté des récifs réunionnais.

Chez Domtom Connect, notre mission est de connecter les acteurs de la mer aux opportunités économiques régionales et à la diaspora.

Dans la gestion de votre centre nautique, quelle question opérationnelle sollicite le plus vos ressources ?

Nous serions ravis de vous présenter notre réseau d'entraide WhatsApp et l'application mobile DTC Pulse.

Pourrions-nous prévoir dix minutes d'échange téléphonique dans les jours qui viennent ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Réunion Diving",
        "email": "info@reuniondiving.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "Annuaire AssoPei",
        "subject": "Prestations de plongée et entraide / Réunion Diving",
        "body": """Bonjour,

Bravo pour l'encadrement professionnel et la diversité des sites explorés par votre équipe au large de la côte Ouest.

Chez Domtom Connect, nous soutenons les professionnels de la plongée afin d'optimiser leur visibilité directe et de favoriser les coopérations.

Quel est actuellement votre principal enjeu de développement ou d'organisation ?

Nous réunissons des dirigeants et indépendants au sein d'un groupe WhatsApp d'entraide et sur notre application DTC Pulse.

Seriez-vous disponible pour un appel découverte de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Gloria Maris Plongée",
        "email": "secretariat.gloriamaris@gmail.com",
        "territory": "La Réunion (Saint-Gilles)",
        "source": "https://gloriamaris.net",
        "subject": "Tradition subaquatique et développement / Gloria Maris",
        "body": """Bonjour,

Toutes mes félicitations pour la réputation historique et le sérieux de l'école de plongée Gloria Maris à Saint-Gilles.

Chez Domtom Connect, notre rôle est d'épauler les structures nautiques emblématiques afin de renforcer leurs passerelles d'affaires.

Quelle est la priorité majeure qui retient toute votre attention en ce moment ?

Notre réseau comprend un groupe WhatsApp d'entraide entre professionnels ainsi que notre application DTC Pulse.

Auriez-vous dix minutes à consacrer à un échange téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Abyss Plongée Réunion",
        "email": "abyss.plongee.reunion@gmail.com",
        "territory": "La Réunion (Saint-Leu)",
        "source": "https://abyss-plongee.com",
        "subject": "Plongée sur la pente externe et synergies / Abyss Plongée",
        "body": """Bonjour,

Bravo pour vos magnifiques sorties sur la pente externe de Saint-Leu et pour le respect accordé à la biodiversité marine réunionnaise.

Chez Domtom Connect, nous accompagnons les clubs de plongée pour sécuriser leur fréquentation et développer leur notoriété directe.

Dans l'exploitation de votre club, quel défi technique ou humain demande le plus d'énergie ?

Nous serions enchantés de vous faire découvrir notre communauté WhatsApp d'entraide et notre application DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Excelsus Plongée Réunion",
        "email": "reservation@excelsus-plongee.com",
        "territory": "La Réunion (Saint-Leu)",
        "source": "https://excelsus-plongee.com",
        "subject": "Expérience subaquatique et réseau d'affaires / Excelsus Plongée",
        "body": """Bonjour,

Félicitations pour le dynamisme d'Excelsus Plongée à Saint-Leu et pour l'excellence de votre pédagogie sous-marine.

Chez Domtom Connect, nous aidons les structures touristiques et sportives à briser l'éloignement et à nouer des partenariats fructueux.

Quel est aujourd'hui votre principal axe de conquête ou de consolidation pour votre centre ?

Nous animons une communauté active sur WhatsApp et proposons l'application mobile DTC Pulse pour faciliter les mises en relation.

Seriez-vous ouvert à un point téléphonique de dix minutes cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Aquabulle Plongée Réunion",
        "email": "aquabulle.plongee@gmail.com",
        "territory": "La Réunion (Saint-Leu)",
        "source": "https://aquabulleplongee.re",
        "subject": "Sorties sous-marines et entraide locale / Aquabulle Plongée",
        "body": """Bonjour,

Bravo pour l'accueil chaleureux et les baptêmes et explorations mémorables que vous organisez au port de Saint-Leu.

Chez Domtom Connect, notre mission est de connecter les entrepreneurs ultramarins aux opportunités d'affaires régionales et internationales.

Dans votre activité quotidienne, quelle contrainte logistique ou commerciale sollicite le plus vos ressources ?

Nous animons un groupe d'entraide WhatsApp et la plateforme mobile DTC Pulse.

Auriez-vous dix minutes à m'accorder par téléphone pour faire connaissance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Plongée Péi Réunion",
        "email": "infoplongeepei@gmail.com",
        "territory": "La Réunion (Saint-Leu)",
        "source": "https://plongeepei.fr",
        "subject": "Passion sous-marine péi et synergies / Plongée Péi",
        "body": """Bonjour,

Toutes mes félicitations pour l'esprit péi et l'ambiance authentique que vous faites vivre aux plongeurs à Saint-Leu.

Chez Domtom Connect, nous soutenons les professionnels passionnés qui font rayonner nos territoires et valorisent notre patrimoine naturel.

Quel est actuellement le principal projet ou défi qui mobilise vos équipes chez Plongée Péi ?

Nous serions ravis de vous accueillir au sein de notre communauté WhatsApp d'entraide et sur l'application DTC Pulse.

Pourrions-nous prévoir dix minutes d'échange téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- MAYOTTE (5) ---
    {
        "company": "Lagon Maore",
        "email": "contact@lagonmaore.com",
        "territory": "Mayotte (Kani-Kéli)",
        "source": "https://lagonmaore.com",
        "subject": "Plongée à N'Gouja et réseau d'affaires / Lagon Maore",
        "body": """Bonjour,

Félicitations pour le cadre exceptionnel de la plage de N'Gouja et votre rôle moteur dans la découverte du lagon et des tortues à Mayotte.

Chez Domtom Connect, nous apportons un soutien concret aux professionnels mahorais pour relier leurs activités aux écosystèmes régionaux et métropolitains.

Dans le contexte actuel de Mayotte, quel est le défi opérationnel le plus marquant pour vos activités nautiques ?

Nous animons un groupe d'entraide WhatsApp réunissant des dirigeants ainsi que notre application mobile DTC Pulse.

Seriez-vous disponible pour un court appel de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Nautilus Plongée Mayotte",
        "email": "contact@nautilusplongee-mayotte.yt",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://nautilusplongee-mayotte.yt",
        "subject": "Passes mahoraises et synergies marines / Nautilus Plongée",
        "body": """Bonjour,

Bravo pour votre investissement pérenne à Mamoudzou pour faire explorer les passes mythiques du lagon de Mayotte.

Chez Domtom Connect, notre mission est d'épauler les structures nautiques face à l'éloignement en favorisant des collaborations directes.

Quelle est aujourd'hui votre priorité de développement la plus stratégique ?

Nous vous proposons de rejoindre notre communauté WhatsApp d'entraide et d'utiliser notre application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique selon vos disponibilités ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Cétamayotte",
        "email": "contact@cetamayotte.com",
        "territory": "Mayotte (Mamoudzou)",
        "source": "https://cetamayotte.com",
        "subject": "Observation des cétacés et partenariats / Cétamayotte",
        "body": """Bonjour,

Toutes mes félicitations pour votre approche éco-responsable et passionnée dans l'observation des baleines, dauphins et cétacés du lagon mahorais.

Chez Domtom Connect, nous valorisons les acteurs éco-touristiques majeurs pour leur ouvrir de nouveaux canaux de recommandation.

Quel est actuellement votre plus grand défi au sein de votre activité d'excursion en mer ?

Nous animons une communauté de pairs sur WhatsApp et mettons à disposition l'application mobile DTC Pulse.

Auriez-vous dix minutes à m'accorder par téléphone cette semaine pour échanger ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Maoré Jet",
        "email": "contact.maorejet@gmail.com",
        "territory": "Mayotte (Dzaoudzi)",
        "source": "Office Tourisme Petite-Terre",
        "subject": "Loisirs nautiques et entraide / Maoré Jet",
        "body": """Bonjour,

Bravo pour l'énergie que vous apportez à Dzaoudzi avec vos randonnées en jet-ski et activités nautiques autour de Petite-Terre.

Chez Domtom Connect, notre mission est de rompre l'isolement géographique en favorisant des liens d'affaires solides entre professionnels.

Quelle est la problématique qui demande le plus de ressources à votre structure actuellement ?

Nous serions heureux de vous accueillir sur notre groupe WhatsApp d'entraide et de vous présenter l'application DTC Pulse.

Seriez-vous partant pour convenir d'un court point téléphonique de dix minutes ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Lagon Aventure Mayotte",
        "email": "lagonaventure@gmail.com",
        "territory": "Mayotte (Dzaoudzi)",
        "source": "Office Tourisme Petite-Terre",
        "subject": "Excursions en mer et réseau d'affaires / Lagon Aventure",
        "body": """Bonjour,

Félicitations pour vos superbes sorties découverte des îlets et du lagon mahorais au départ de Petite-Terre.

Chez Domtom Connect, nous accompagnons les prestataires maritimes dans la valorisation de leurs offres et la construction de synergies d'affaires.

Quel est aujourd'hui votre chantier prioritaire pour optimiser votre saison ?

Notre écosystème réunit des entrepreneurs au sein d'un groupe WhatsApp d'entraide et sur notre application mobile DTC Pulse.

Pourrions-nous prévoir un appel découverte de dix minutes à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },

    # --- POLYNÉSIE FRANÇAISE (5) ---
    {
        "company": "Eleuthera Tahiti Diving",
        "email": "contact@eleutheratahiti.com",
        "territory": "Polynésie (Tahiti Punaauia)",
        "source": "https://eleutheratahiti.com",
        "subject": "Plongée sous-marine à Tahiti et synergies / Eleuthera",
        "body": """Bonjour,

Ia ora na et bravo pour l'excellence de votre centre Eleuthera Diving à la marina Taina pour faire explorer les tombants et lagons de Tahiti.

Chez Domtom Connect, nous accompagnons les professionnels du tourisme ultramarin afin de décloisonner leurs opportunités et développer leur clientèle directe.

Dans l'exploitation de votre centre de plongée, quelle priorité retient toute votre attention en ce moment ?

Nous animons une communauté WhatsApp d'entraide entre dirigeants et mettons à disposition notre application mobile DTC Pulse.

Seriez-vous ouvert à un court échange téléphonique de dix minutes ces prochains jours ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Tahiti Yacht Charter",
        "email": "tahiti@tahitiyachtcharter.com",
        "territory": "Polynésie (Raiatea)",
        "source": "https://tahitiyachtcharter.com",
        "subject": "Croisières privées aux îles Sous-le-Vent et opportunités / Tahiti Yacht Charter",
        "body": """Bonjour,

Ia ora na et toutes mes félicitations pour la référence incontournable que vous incarnez dans les croisières privées en catamaran aux îles Sous-le-Vent.

Chez Domtom Connect, nous accompagnons les leaders de la plaisance insulaire pour développer des collaborations à haute valeur ajoutée.

Quel est aujourd'hui votre principal défi stratégique — l'accès aux clientèles directes, la logistique de flotte ou la diversification d'itinéraires ?

Notre réseau d'affaires s'appuie sur une communauté d'entraide WhatsApp et notre application mobile DTC Pulse.

Pourrions-nous prévoir dix minutes d'échange téléphonique selon vos créneaux ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Moorea Blue Diving",
        "email": "mooreadiving@gmail.com",
        "territory": "Polynésie (Moorea)",
        "source": "Tahiti Tourisme",
        "subject": "Plongées lagons et passes de Moorea / Moorea Blue Diving",
        "body": """Bonjour,

Ia ora na et félicitations pour la passion avec laquelle vous guidez les plongeurs dans les passes et sur les récifs préservés de Moorea.

Chez Domtom Connect, nous oeuvrons à relier les professionnels de l'Outre-mer aux réseaux de la diaspora et des partenaires économiques majeurs.

Quelle est la problématique opérationnelle qui sollicite le plus votre équipe actuellement ?

Nous serions très heureux de vous faire une place sur notre groupe WhatsApp d'entraide et de vous présenter notre application DTC Pulse.

Auriez-vous dix minutes à consacrer à un premier point téléphonique cette semaine ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Charter Polynésie",
        "email": "contact@charter-polynesie.com",
        "territory": "Polynésie (Huahine)",
        "source": "https://charter-polynesie.com",
        "subject": "Croisières lagon et partenariats économiques / Charter Polynésie",
        "body": """Bonjour,

Ia ora na et bravo pour l'authenticité et la sérénité de vos croisières en catamaran au départ de Huahine à travers les îles de la Société.

Chez Domtom Connect, nous aidons les professionnels du charter à optimiser leurs canaux de distribution directe et à nouer des partenariats solides.

Dans le développement de votre activité nautique, quelle priorité mobilise le plus votre énergie ?

Nous animons une communauté de dirigeants sur WhatsApp et proposons notre application mobile DTC Pulse.

Seriez-vous partant pour convenir d'un bref appel de dix minutes prochainement ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    },
    {
        "company": "Poe Charter Tahiti",
        "email": "jeanadrien.poecharter@gmail.com",
        "territory": "Polynésie (Tahiti Papeete)",
        "source": "https://poecharter.pf",
        "subject": "Charters nautiques et entraide / Poe Charter",
        "body": """Bonjour Jean-Adrien,

Ia ora na et toutes mes félicitations pour la beauté de votre flotte de catamarans et la qualité de vos croisières sur-mesure au départ de Papeete.

Chez Domtom Connect, notre rôle est d'apporter aux armateurs et entrepreneurs de la mer un réseau dynamique de recommandations et de soutien.

Quel est à présent votre objectif de développement ou défi logistique le plus important ?

Nous serions ravis de vous accueillir dans notre écosystème WhatsApp d'entraide et sur notre application mobile DTC Pulse.

Pourrions-nous caler dix minutes d'échange téléphonique à votre convenance ?

Bien cordialement,

Loic Villeronce
Fondateur — Domtom Connect
Plateforme www.domtomconnect.com"""
    }
]

if __name__ == '__main__':
    print('=== VÉRIFICATION DU BATCH 58 (50 CIBLES ACTIVITÉS NAUTIQUES & MER) ===')
    db_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'contacts_deja_contactes.json')
    known_emails = set()
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            db = json.load(f)
            known_emails = set(c['email'].lower().strip() for c in db.get('contacts', []))

    for idx, lead in enumerate(LEADS, 1):
        if ':' in lead['subject']:
            raise ValueError(f"Deux-points dans sujet ({lead['company']})")
        if ':' in lead['body']:
            raise ValueError(f"Deux-points dans corps ({lead['company']})")
        
        ok, msg = verify_email_target(lead['email'])
        if not ok:
            raise ValueError(f"MX FAIL {lead['email']} : {msg}")
            
        if lead['email'].lower().strip() not in known_emails:
            dup, reason = is_domain_or_company_duplicate(lead['email'], lead['company'])
            if dup:
                raise ValueError(f"DUP {lead['email']} : {reason}")
                
        print(f"[{idx:02d}] VALIDE - {lead['company']} ({lead['email']}) [{lead['territory']}]")

    print(f"\nBilan : {len(LEADS)} / 50 cibles parfaitement valides.")
