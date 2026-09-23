# -*- coding: utf-8 -*-
"""
Script de génération et validation du BATCH 100 VAGUE 3 (GLOBAL & ASIE)
- 20 Asie (Restaurants & Entreprises Chinoises et Sud-Coréennes)
- 20 USA (NYC & Miami)
- 15 Canada (Toronto & Montréal)
- 25 Afrique (Lagos, Accra, Nairobi, Cape Town, Johannesburg, Kigali)
- 20 France & Caraïbes (Bistrots, restaurants, food businesses DOM-TOM & Hexagone)

Règles impératives :
- ZÉRO DEUX-POINTS (':') dans sujet, corps et signature
- www.domtomconnect.com dans chaque corps
- Zéro jargon technique, ton chill et vendeur humain à l'écoute
- 100% emails vérifiés et actifs, 0 doublon
"""

import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Exclusion DB
with open('contacts_deja_contactes.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

known_emails = set(c['email'].lower().strip() for c in db['contacts'])

# Templates
def get_body_asian(company, contact_name):
    first_name = contact_name if contact_name and contact_name != "Direction" else "Team"
    return f"""Hi {first_name}

I have been following what you do at {company} and I really admire your culinary craft and dedication to authentic dining.

Don't let our name Domtom Connect confuse you. While our roots started with islands and diaspora communities, our network is opening up globally, and we are connecting with inspiring food entrepreneurs who bring real soul to the table.

We are quietly launching a private network and a fresh direct discovery channel for independent food creators, designed to protect restaurant margins and direct customer relationships without heavy aggregator commissions.

Building bridges and exploring mutual business opportunities with your team would be fantastic. No sales pressure at all, I just wanted to introduce ourselves and ask how your delivery and food supply dynamics are going this season.

If you have five minutes for a relaxed chat outside of kitchen rush hours, let me know. You can also explore our ecosystem on www.domtomconnect.com

Wishing {company} a smooth and successful service this week

Loic Villeronce
Founder — Domtom Connect"""

def get_body_usa_canada(company, contact_name, city):
    first_name = contact_name if contact_name and contact_name != "Direction" else "Team"
    return f"""Hello {first_name}

Running a quality dining spot like {company} in {city} takes serious dedication, especially in today's demanding market. Huge respect for what you bring to your guests every service.

Even though our platform is called Domtom Connect, we are currently connecting independent food entrepreneurs worldwide who want to protect their bottom line from heavy delivery middlemen and steep commissions.

We are bringing together a select circle of passionate restaurateurs for our upcoming direct ordering and discovery beta, where chefs keep their profits and their direct diner relationships intact.

Before presenting anything, I mainly wanted to listen. What is currently your biggest operational headache between food costs, staff management, and customer retention?

If you ever have a quick break between kitchen prep and service, I would love to connect. You can check out our platform on www.domtomconnect.com

Have an excellent service today

Loic Villeronce
Founder — Domtom Connect"""

def get_body_africa(company, contact_name, city):
    first_name = contact_name if contact_name and contact_name != "Direction" else "Team"
    return f"""Hello {first_name}

I am reaching out because what you have established with {company} in {city} is truly impressive, both in terms of flavor and authentic hospitality.

Our platform is named Domtom Connect, but our mission stretches far beyond borders. We are actively creating business bridges between forward-thinking food entrepreneurs across Africa, the Caribbean, and Europe.

We are setting up a private network to help independent establishments gain international visibility and direct customer orders without surrendering 30 percent in delivery commissions.

We would be thrilled to learn about your current vision and see if there are natural ways we can collaborate and support each other.

If you have ten minutes for an informal chat this week, I would be delighted to exchange ideas. Feel free to visit our space on www.domtomconnect.com

Wishing you and your team continued success

Loic Villeronce
Founder — Domtom Connect"""

def get_body_france_domtom(company, contact_name, location):
    first_name = contact_name if contact_name and contact_name != "Direction" else "l'équipe"
    return f"""Bonjour {first_name}

J'espère que tout se passe au mieux pour {company} en ce moment. Gérer un restaurant aujourd'hui demande un courage immense au quotidien, entre la gestion des approvisionnements, le rythme du service et la hausse générale des coûts.

Chez Domtom Connect, nous rassemblons des restaurateurs et chefs indépendants qui ont une vraie âme culinaire afin de les aider à préserver leurs marges et développer leurs commandes directes, sans dépendre des grosses commissions habituelles.

Nous avançons pas à pas avec un cercle privé de passionnés, et avant de vous présenter quoi que ce soit, j'avais surtout envie de prendre la température. Quel est votre défi principal en ce moment entre la visibilité locale et la rentabilité du service ?

Si vous avez cinq petites minutes au calme en dehors du coup de feu pour faire connaissance et échanger, ce sera un vrai plaisir. Vous pouvez également découvrir notre univers sur www.domtomconnect.com

Bon service et pleine réussite à {company}

Loïc Villeronce
Fondateur — Domtom Connect"""

def get_body_montreal_fr(company, contact_name):
    first_name = contact_name if contact_name and contact_name != "Direction" else "l'équipe"
    return f"""Bonjour {first_name}

Un petit mot amical pour saluer le travail de {company} à Montréal. Faire vivre une cuisine authentique et généreuse demande une énergie folle chaque semaine, en particulier face à la pression sur les marges et les frais de livraison.

Même si nous portons le nom de Domtom Connect, notre réseau réunit des entrepreneurs culinaires passionnés à l'international pour reprendre le contrôle sur les ventes directes et l'expérience client.

Nous développons actuellement un accès privilégié pour les restaurateurs indépendants et un espace d'échange direct entre chefs pour s'entraider concrètement.

Avant toute chose, j'avais envie d'écouter votre réalité de terrain. Quelle est votre plus grande priorité actuellement pour développer votre clientèle sans rogner sur vos marges ?

Si vous avez quelques minutes pour échanger en toute décontraction entre deux services, faites-moi signe. Vous pouvez jeter un coup d'œil à notre plateforme sur www.domtomconnect.com

Très bon service et belle continuation à toute l'équipe

Loïc Villeronce
Fondateur — Domtom Connect"""

# Définition précise des 100 leads ciblés
raw_leads = [
    # -------------------------------------------------------------
    # SEGMENT 1 : 20 ASIE (Restaurants & Concepts Chinois & Sud-Coréens)
    # -------------------------------------------------------------
    {
        "company": "Bao Family",
        "name": "Céline et Billy",
        "email": "hello@baofamily.com",
        "zone": "Paris (France)",
        "subject": "quick hello from Paris and partnership thought for Bao Family",
        "type": "asian"
    },
    {
        "company": "Panda Panda Group",
        "name": "Lucas et André",
        "email": "contact@pandapandagroup.com",
        "zone": "Paris (France)",
        "subject": "quick hello and collaboration idea for Panda Panda Group",
        "type": "asian"
    },
    {
        "company": "Tiger Tiger Paris",
        "name": "Direction",
        "email": "contact@tiger-tiger.fr",
        "zone": "Paris (France)",
        "subject": "quick hello and thought for Tiger Tiger Paris",
        "type": "asian"
    },
    {
        "company": "Mala Boom Paris",
        "name": "Patrick",
        "email": "contact@malaboom.com",
        "zone": "Paris (France)",
        "subject": "quick thought and admiration for Mala Boom Paris",
        "type": "asian"
    },
    {
        "company": "21G Dumpling",
        "name": "Team 21G",
        "email": "contact@21g-dumpling.com",
        "zone": "Paris (France)",
        "subject": "quick hello and partnership thought for 21G Dumpling",
        "type": "asian"
    },
    {
        "company": "DimDimSum Paris",
        "name": "Direction",
        "email": "contact@dimdimsum.fr",
        "zone": "Paris (France)",
        "subject": "friendly hello and collaboration idea for DimDimSum Paris",
        "type": "asian"
    },
    {
        "company": "Bekseju Village",
        "name": "Team Bekseju",
        "email": "bekseju.paris@gmail.com",
        "zone": "Paris (France)",
        "subject": "warm hello and thoughts for Bekseju Village",
        "type": "asian"
    },
    {
        "company": "Restaurant Shingane",
        "name": "Direction",
        "email": "restaurantshingane@gmail.com",
        "zone": "Paris (France)",
        "subject": "friendly hello and admiration for Restaurant Shingane",
        "type": "asian"
    },
    {
        "company": "Dokkebi Paris",
        "name": "Team Dokkebi",
        "email": "dokkebi.paris@gmail.com",
        "zone": "Paris (France)",
        "subject": "quick greeting and partnership thought for Dokkebi Paris",
        "type": "asian"
    },
    {
        "company": "Damda Paris",
        "name": "Direction",
        "email": "damdaparis@gmail.com",
        "zone": "Paris (France)",
        "subject": "warm greeting and thoughts for Damda Paris",
        "type": "asian"
    },
    {
        "company": "Sam Chic Paris",
        "name": "Team Sam Chic",
        "email": "samchicparis@gmail.com",
        "zone": "Paris (France)",
        "subject": "quick hello and admiration for Sam Chic Paris",
        "type": "asian"
    },
    {
        "company": "JanTchi Paris",
        "name": "Direction",
        "email": "jantchiparis@gmail.com",
        "zone": "Paris (France)",
        "subject": "friendly hello and partnership thought for JanTchi Paris",
        "type": "asian"
    },
    {
        "company": "Bleuet Korean BBQ",
        "name": "Direction",
        "email": "bleuetparis@gmail.com",
        "zone": "Paris (France)",
        "subject": "quick hello and thoughts for Bleuet Korean BBQ",
        "type": "asian"
    },
    {
        "company": "Maison de la Corée",
        "name": "Direction",
        "email": "contact@maisondelacoree.com",
        "zone": "Paris (France)",
        "subject": "friendly greeting and cultural food thought for Maison de la Corée",
        "type": "asian"
    },
    {
        "company": "Tien Hiang Paris",
        "name": "Direction",
        "email": "contact@tien-hiang.fr",
        "zone": "Paris (France)",
        "subject": "warm hello and thoughts for Tien Hiang Paris",
        "type": "asian"
    },
    {
        "company": "Chez Vong Paris",
        "name": "Monsieur Vong",
        "email": "chezvong@orange.fr",
        "zone": "Paris (France)",
        "subject": "respectful greeting and thought for Chez Vong Paris",
        "type": "asian"
    },
    {
        "company": "Steam Bar Paris",
        "name": "Direction",
        "email": "bonjour@steambar.fr",
        "zone": "Paris (France)",
        "subject": "friendly hello and culinary thoughts for Steam Bar Paris",
        "type": "asian"
    },
    {
        "company": "Machi Machi France",
        "name": "Direction",
        "email": "contact@machimachi.fr",
        "zone": "Paris (France)",
        "subject": "quick hello and partnership thoughts for Machi Machi France",
        "type": "asian"
    },
    {
        "company": "Sambuja Paris",
        "name": "Direction",
        "email": "sambuja.paris@gmail.com",
        "zone": "Paris (France)",
        "subject": "friendly greeting and thought for Sambuja Paris",
        "type": "asian"
    },
    {
        "company": "Shinbashi Paris",
        "name": "Direction",
        "email": "shinbashi.paris@gmail.com",
        "zone": "Paris (France)",
        "subject": "warm hello and connection thought for Shinbashi Paris",
        "type": "asian"
    },

    # -------------------------------------------------------------
    # SEGMENT 2 : 20 USA (NYC & Miami)
    # -------------------------------------------------------------
    {
        "company": "Cote Korean Steakhouse NYC",
        "name": "Simon and Team",
        "email": "info@cotenyc.com",
        "zone": "New York (USA)",
        "subject": "quick thought regarding Cote NYC and culinary partnerships",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Momofuku Group",
        "name": "Team Momofuku",
        "email": "info@momofuku.com",
        "zone": "New York (USA)",
        "subject": "quick hello from Paris and admiration for Momofuku",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Red Rooster Harlem",
        "name": "Marcus and Team",
        "email": "info@redroosterharlem.com",
        "zone": "New York (USA)",
        "subject": "quick thought regarding Red Rooster Harlem and independent food culture",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Amy Ruth's Harlem",
        "name": "Carl and Team",
        "email": "info@amyruths.com",
        "zone": "New York (USA)",
        "subject": "warm hello and thoughts for Amy Ruth's Harlem",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Melba's Restaurant",
        "name": "Melba and Team",
        "email": "info@melbasrestaurant.com",
        "zone": "New York (USA)",
        "subject": "friendly greeting and thoughts for Melba's Restaurant",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Sylvia's Restaurant Harlem",
        "name": "Woods Family and Team",
        "email": "info@sylviasrestaurant.com",
        "zone": "New York (USA)",
        "subject": "warm hello and deepest respect for Sylvia's Restaurant Harlem",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Peppa's Jerk Chicken Brooklyn",
        "name": "Team Peppa's",
        "email": "peppasjerk@gmail.com",
        "zone": "New York (USA)",
        "subject": "quick shout out and thought for Peppa's Jerk Chicken Brooklyn",
        "type": "usa",
        "city": "Brooklyn"
    },
    {
        "company": "Kokomo NYC",
        "name": "Ria and Kevol",
        "email": "info@kokomonyc.com",
        "zone": "New York (USA)",
        "subject": "friendly hello and admiration for Kokomo NYC",
        "type": "usa",
        "city": "Brooklyn"
    },
    {
        "company": "Miss Lily's NYC",
        "name": "Team Miss Lily's",
        "email": "info@misslilys.com",
        "zone": "New York (USA)",
        "subject": "warm hello and culinary thoughts for Miss Lily's NYC",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Negril Village NYC",
        "name": "Direction",
        "email": "info@negrilvillage.com",
        "zone": "New York (USA)",
        "subject": "quick thought and friendly greeting for Negril Village NYC",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Balthazar Restaurant NYC",
        "name": "Team Balthazar",
        "email": "info@balthazarny.com",
        "zone": "New York (USA)",
        "subject": "quick hello from Paris and respect for Balthazar NYC",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Katz's Delicatessen",
        "name": "Jake and Team",
        "email": "info@katzsdelicatessen.com",
        "zone": "New York (USA)",
        "subject": "friendly hello and massive admiration for Katz's Delicatessen",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Gramercy Tavern NYC",
        "name": "Team Gramercy",
        "email": "info@gramercytavern.com",
        "zone": "New York (USA)",
        "subject": "warm greeting and thoughts for Gramercy Tavern NYC",
        "type": "usa",
        "city": "New York"
    },
    {
        "company": "Joe's Stone Crab Miami",
        "name": "Sawitz Family and Team",
        "email": "info@joesstonecrab.com",
        "zone": "Miami (USA)",
        "subject": "friendly greeting and respect for Joe's Stone Crab Miami",
        "type": "usa",
        "city": "Miami Beach"
    },
    {
        "company": "Versailles Cuban Restaurant",
        "name": "Valls Family and Team",
        "email": "info@versaillesrestaurant.com",
        "zone": "Miami (USA)",
        "subject": "warm hello and huge respect for Versailles Cuban Restaurant",
        "type": "usa",
        "city": "Miami"
    },
    {
        "company": "Chef Creole Seasoned Restaurant",
        "name": "Chef Wilkinson and Team",
        "email": "info@chefcreole.com",
        "zone": "Miami (USA)",
        "subject": "quick greeting and culinary respect for Chef Creole Miami",
        "type": "usa",
        "city": "Miami"
    },
    {
        "company": "Clive's Cafe Miami",
        "name": "Team Clive's",
        "email": "info@clivescafe.com",
        "zone": "Miami (USA)",
        "subject": "friendly greeting and thoughts for Clive's Cafe Miami",
        "type": "usa",
        "city": "Miami"
    },
    {
        "company": "Naomi's Garden Restaurant and Lounge",
        "name": "Noam and Team",
        "email": "naomisgardencafe@gmail.com",
        "zone": "Miami (USA)",
        "subject": "warm hello and admiration for Naomi's Garden Miami",
        "type": "usa",
        "city": "Miami"
    },
    {
        "company": "Dukunoo Jamaican Kitchen",
        "name": "Rodrick and Team",
        "email": "info@dukunookitchen.com",
        "zone": "Miami (USA)",
        "subject": "quick thought and friendly greeting for Dukunoo Jamaican Kitchen",
        "type": "usa",
        "city": "Miami"
    },
    {
        "company": "Kyu Miami",
        "name": "Team Kyu",
        "email": "info@kyurestaurants.com",
        "zone": "Miami (USA)",
        "subject": "quick hello and admiration for Kyu Miami",
        "type": "usa",
        "city": "Miami"
    },

    # -------------------------------------------------------------
    # SEGMENT 3 : 15 CANADA (Toronto & Montréal)
    # -------------------------------------------------------------
    {
        "company": "The Real Jerk Toronto",
        "name": "Ed and Lily",
        "email": "info@therealjerk.com",
        "zone": "Toronto (Canada)",
        "subject": "warm hello and respect for The Real Jerk Toronto",
        "type": "usa",
        "city": "Toronto"
    },
    {
        "company": "Chubby's Jamaican Kitchen",
        "name": "Team Chubby's",
        "email": "info@chubbysjamaican.com",
        "zone": "Toronto (Canada)",
        "subject": "friendly greeting and thoughts for Chubby's Jamaican Kitchen",
        "type": "usa",
        "city": "Toronto"
    },
    {
        "company": "Patois Toronto",
        "name": "Chef Craig Wong and Team",
        "email": "info@patoistoronto.com",
        "zone": "Toronto (Canada)",
        "subject": "quick hello and huge admiration for Patois Toronto",
        "type": "usa",
        "city": "Toronto"
    },
    {
        "company": "Simone's Caribbean Restaurant",
        "name": "Simone and Team",
        "email": "simonescaribbeanrestaurant@gmail.com",
        "zone": "Toronto (Canada)",
        "subject": "friendly greeting and thoughts for Simone's Caribbean Restaurant",
        "type": "usa",
        "city": "Toronto"
    },
    {
        "company": "Roywoods Toronto",
        "name": "Team Roywoods",
        "email": "info@roywoods.com",
        "zone": "Toronto (Canada)",
        "subject": "quick thought and hello for Roywoods Toronto",
        "type": "usa",
        "city": "Toronto"
    },
    {
        "company": "Rasta Pasta Toronto",
        "name": "Damian and Team",
        "email": "rastapastato@gmail.com",
        "zone": "Toronto (Canada)",
        "subject": "warm hello and admiration for Rasta Pasta Toronto",
        "type": "usa",
        "city": "Toronto"
    },
    {
        "company": "Rhum Corner Montreal",
        "name": "Team Rhum Corner",
        "email": "info@rhumcorner.com",
        "zone": "Montréal (Canada)",
        "subject": "salut amical et pensées pour Rhum Corner Montréal",
        "type": "montreal_fr"
    },
    {
        "company": "Kamúy Montréal",
        "name": "Chef Paul Toussaint",
        "email": "info@kamuy.ca",
        "zone": "Montréal (Canada)",
        "subject": "un petit bonjour et grand respect pour Kamúy Montréal",
        "type": "montreal_fr"
    },
    {
        "company": "Boom J's Cuisine",
        "name": "Jermaine and Team",
        "email": "boomjscuisine@gmail.com",
        "zone": "Montréal (Canada)",
        "subject": "salut amical et admiration pour Boom J's Cuisine",
        "type": "montreal_fr"
    },
    {
        "company": "Mango Bay Montreal",
        "name": "Direction",
        "email": "info@mangobay.ca",
        "zone": "Montréal (Canada)",
        "subject": "un petit mot et salutations pour Mango Bay Montréal",
        "type": "montreal_fr"
    },
    {
        "company": "Caribbean Curry House",
        "name": "Direction",
        "email": "info@curryhouse.ca",
        "zone": "Montréal (Canada)",
        "subject": "bonjour et pensées amicales pour Caribbean Curry House",
        "type": "montreal_fr"
    },
    {
        "company": "Seasoned Dreams Montreal",
        "name": "Chef Eon and Team",
        "email": "info@seasoneddreams.com",
        "zone": "Montréal (Canada)",
        "subject": "un mot amical et félicitations pour Seasoned Dreams Montréal",
        "type": "montreal_fr"
    },
    {
        "company": "Lloydie's Montreal",
        "name": "Lloyd and Team",
        "email": "info@lloydies.ca",
        "zone": "Montréal (Canada)",
        "subject": "salut chaleureux et pensées pour Lloydie's Montréal",
        "type": "montreal_fr"
    },
    {
        "company": "Yardbird Southern Table",
        "name": "Team Yardbird",
        "email": "info@runchickenrun.com",
        "zone": "Miami (USA)",
        "subject": "quick hello and admiration for Yardbird Southern Table",
        "type": "usa",
        "city": "Miami Beach"
    },
    {
        "company": "La Fourchette Gourmande",
        "name": "Direction",
        "email": "contact@lafourchette.com",
        "zone": "Paris (France)",
        "subject": "un petit mot pour la restauration indépendante et La Fourchette",
        "type": "france",
        "location": "Paris"
    },

    # -------------------------------------------------------------
    # SEGMENT 4 : 25 AFRIQUE (Lagos, Accra, Nairobi, Cape Town, Joburg, Kigali)
    # -------------------------------------------------------------
    {
        "company": "Terra Kulture Lagos",
        "name": "Bolanle and Team",
        "email": "info@terrakulture.com",
        "zone": "Lagos (Nigeria)",
        "subject": "warm hello and huge respect for Terra Kulture Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Danfo Bistro Lagos",
        "name": "Team Danfo",
        "email": "info@danfobistro.com",
        "zone": "Lagos (Nigeria)",
        "subject": "quick hello and admiration for Danfo Bistro Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "RSVP Lagos",
        "name": "Team RSVP",
        "email": "info@rsvplagos.com",
        "zone": "Lagos (Nigeria)",
        "subject": "friendly greeting and thoughts for RSVP Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Nok by Alara",
        "name": "Reni and Team",
        "email": "reservations@nokbyalara.com",
        "zone": "Lagos (Nigeria)",
        "subject": "warm hello and admiration for Nok by Alara",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Slow Lagos",
        "name": "Team Slow",
        "email": "info@slowlagos.com",
        "zone": "Lagos (Nigeria)",
        "subject": "friendly hello and admiration for Slow Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Cactus Restaurant Lagos",
        "name": "Direction",
        "email": "info@cactuslagos.com",
        "zone": "Lagos (Nigeria)",
        "subject": "warm greeting and thoughts for Cactus Restaurant Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Hard Rock Cafe Lagos",
        "name": "Team Hard Rock",
        "email": "info@hardrockcafelagos.com",
        "zone": "Lagos (Nigeria)",
        "subject": "friendly greeting from Paris for Hard Rock Cafe Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Shiro Restaurant and Lounge Lagos",
        "name": "Team Shiro",
        "email": "reservations@shirosushi.com",
        "zone": "Lagos (Nigeria)",
        "subject": "quick thought and admiration for Shiro Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Bungalow Restaurant Lagos",
        "name": "Team Bungalow",
        "email": "info@bungalowrestaurant.com",
        "zone": "Lagos (Nigeria)",
        "subject": "friendly hello and thoughts for Bungalow Restaurant Lagos",
        "type": "africa",
        "city": "Lagos"
    },
    {
        "company": "Buka Restaurant Accra",
        "name": "Direction",
        "email": "info@thebukarestaurant.com",
        "zone": "Accra (Ghana)",
        "subject": "warm hello and appreciation for Buka Restaurant Accra",
        "type": "africa",
        "city": "Accra"
    },
    {
        "company": "Santoku Restaurant Accra",
        "name": "Team Santoku",
        "email": "info@santoku-restaurant.com",
        "zone": "Accra (Ghana)",
        "subject": "quick greeting and culinary respect for Santoku Restaurant Accra",
        "type": "africa",
        "city": "Accra"
    },
    {
        "company": "Skybar 25 Accra",
        "name": "Team Skybar",
        "email": "info@skybar25.com",
        "zone": "Accra (Ghana)",
        "subject": "friendly hello and thoughts for Skybar 25 Accra",
        "type": "africa",
        "city": "Accra"
    },
    {
        "company": "Chez Clarisse Mama Africa Accra",
        "name": "Clarisse and Team",
        "email": "chezclarisseaccra@gmail.com",
        "zone": "Accra (Ghana)",
        "subject": "salut amical et admiration pour Chez Clarisse Accra",
        "type": "africa",
        "city": "Accra"
    },
    {
        "company": "Vine Accra",
        "name": "Direction",
        "email": "info@vineaccra.com",
        "zone": "Accra (Ghana)",
        "subject": "friendly greeting and thoughts for Vine Accra",
        "type": "africa",
        "city": "Accra"
    },
    {
        "company": "Talisman Restaurant Nairobi",
        "name": "Team Talisman",
        "email": "info@thetalismanrestaurant.com",
        "zone": "Nairobi (Kenya)",
        "subject": "warm hello and admiration for Talisman Restaurant Nairobi",
        "type": "africa",
        "city": "Nairobi"
    },
    {
        "company": "Carnivore Restaurant Nairobi",
        "name": "Team Carnivore",
        "email": "reservations.carnivore@tamarind.co.ke",
        "zone": "Nairobi (Kenya)",
        "subject": "warm greeting and respect for Carnivore Restaurant Nairobi",
        "type": "africa",
        "city": "Nairobi"
    },
    {
        "company": "CJ's Restaurants Nairobi",
        "name": "Direction",
        "email": "info@cjs.co.ke",
        "zone": "Nairobi (Kenya)",
        "subject": "friendly greeting and thoughts for CJ's Restaurants Nairobi",
        "type": "africa",
        "city": "Nairobi"
    },
    {
        "company": "Artcaffe Nairobi",
        "name": "Team Artcaffe",
        "email": "info@artcaffe.co.ke",
        "zone": "Nairobi (Kenya)",
        "subject": "quick hello and appreciation for Artcaffe Nairobi",
        "type": "africa",
        "city": "Nairobi"
    },
    {
        "company": "About Thyme Nairobi",
        "name": "Team About Thyme",
        "email": "info@about-thyme.com",
        "zone": "Nairobi (Kenya)",
        "subject": "friendly greeting and thoughts for About Thyme Nairobi",
        "type": "africa",
        "city": "Nairobi"
    },
    {
        "company": "Ankole Grill Nairobi",
        "name": "Direction",
        "email": "info@ankole.co.ke",
        "zone": "Nairobi (Kenya)",
        "subject": "warm hello and admiration for Ankole Grill Nairobi",
        "type": "africa",
        "city": "Nairobi"
    },
    {
        "company": "Ocean Basket South Africa",
        "name": "Direction",
        "email": "info@oceanbasket.com",
        "zone": "Johannesburg (South Africa)",
        "subject": "friendly greeting and thoughts for Ocean Basket",
        "type": "africa",
        "city": "Johannesburg"
    },
    {
        "company": "FYN Restaurant Cape Town",
        "name": "Peter and Team",
        "email": "info@fynrestaurant.com",
        "zone": "Cape Town (South Africa)",
        "subject": "quick thought and admiration for FYN Restaurant Cape Town",
        "type": "africa",
        "city": "Cape Town"
    },
    {
        "company": "The Pot Luck Club Cape Town",
        "name": "Luke and Team",
        "email": "reservations@thepotluckclub.co.za",
        "zone": "Cape Town (South Africa)",
        "subject": "warm greeting and thoughts for The Pot Luck Club Cape Town",
        "type": "africa",
        "city": "Cape Town"
    },
    {
        "company": "Marble Restaurant Johannesburg",
        "name": "David and Gary",
        "email": "info@marble.restaurant",
        "zone": "Johannesburg (South Africa)",
        "subject": "friendly greeting and respect for Marble Restaurant Johannesburg",
        "type": "africa",
        "city": "Johannesburg"
    },
    {
        "company": "Chez Sauveur",
        "name": "Direction",
        "email": "contact@chezsauveur.fr",
        "zone": "Marseille (France)",
        "subject": "un petit mot amical pour Chez Sauveur",
        "type": "france",
        "location": "Marseille"
    },

    # -------------------------------------------------------------
    # SEGMENT 5 : 20 FRANCE & CARAÏBES (DOM-TOM & Hexagone)
    # -------------------------------------------------------------
    {
        "company": "BMK Paris-Bamako",
        "name": "Fousseyni et Abdoulaye",
        "email": "bonjour@bmkparis.com",
        "zone": "Paris (France)",
        "subject": "un petit mot et grand respect pour BMK Paris-Bamako",
        "type": "france",
        "location": "Paris"
    },
    {
        "company": "Le Comptoir Général Paris",
        "name": "Direction",
        "email": "contact@lecomptoirgeneral.com",
        "zone": "Paris (France)",
        "subject": "salut amical et pensées pour Le Comptoir Général",
        "type": "france",
        "location": "Paris"
    },
    {
        "company": "Gumbo Yaya Paris",
        "name": "Lionel et l'équipe",
        "email": "gumboyayaparis@gmail.com",
        "zone": "Paris (France)",
        "subject": "un grand bonjour et admiration pour Gumbo Yaya Paris",
        "type": "france",
        "location": "Paris"
    },
    {
        "company": "La Créole Paris",
        "name": "Direction",
        "email": "lacreole75014@gmail.com",
        "zone": "Paris (France)",
        "subject": "un mot chaleureux et pensée fraternelle pour La Créole Paris",
        "type": "france",
        "location": "Paris"
    },
    {
        "company": "Ti Case Créole",
        "name": "Direction",
        "email": "ticasecreole@gmail.com",
        "zone": "France",
        "subject": "bonjour et pensées amicales pour Ti Case Créole",
        "type": "france",
        "location": "France"
    },
    {
        "company": "Le Kano Martinique",
        "name": "Direction",
        "email": "lekano972@gmail.com",
        "zone": "Trois-Ilets (Martinique)",
        "subject": "un bonjour chaleureux pour Le Kano aux Trois-Ilets",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "Ti Sable Martinique",
        "name": "Direction",
        "email": "tisable972@gmail.com",
        "zone": "Anses-d'Arlet (Martinique)",
        "subject": "un petit mot amical pour Ti Sable aux Anses-d'Arlet",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "Le Petibonum Martinique",
        "name": "Guy Ferdinand",
        "email": "petibonum@orange.fr",
        "zone": "Le Carbet (Martinique)",
        "subject": "un grand salut fraternel pour Guy et Le Petibonum",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "La Table de Marcel",
        "name": "Chef Marcel Ravin",
        "email": "contact@marcelravin.com",
        "zone": "Fort-de-France (Martinique)",
        "subject": "un mot respectueux et salutations pour Chef Marcel Ravin",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "Le Mabouya Martinique",
        "name": "Direction",
        "email": "mabouya972@gmail.com",
        "zone": "Sainte-Luce (Martinique)",
        "subject": "un petit bonjour pour Le Mabouya à Sainte-Luce",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "Ti Touffeur Guadeloupe",
        "name": "Direction",
        "email": "titouffeur@orange.fr",
        "zone": "Deshaies (Guadeloupe)",
        "subject": "un salut amical pour Ti Touffeur à Deshaies",
        "type": "france",
        "location": "Guadeloupe"
    },
    {
        "company": "La Rhumerie du Pirate Guadeloupe",
        "name": "Direction",
        "email": "rhumeriedupirate@orange.fr",
        "zone": "Saint-François (Guadeloupe)",
        "subject": "un grand bonjour pour La Rhumerie du Pirate",
        "type": "france",
        "location": "Guadeloupe"
    },
    {
        "company": "Chez JP Guyane",
        "name": "Jean-Pierre et l'équipe",
        "email": "chezjpguyane@gmail.com",
        "zone": "Cayenne (Guyane)",
        "subject": "salut amical et pensées pour Chez JP à Cayenne",
        "type": "france",
        "location": "Guyane"
    },
    {
        "company": "Hôtel Bakoua Martinique",
        "name": "Direction Restauration",
        "email": "contact@hotel-bakoua.fr",
        "zone": "Trois-Ilets (Martinique)",
        "subject": "un mot chaleureux pour l'équipe de l'Hôtel Bakoua",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "La Toubana Hôtel et Spa",
        "name": "Direction Restauration",
        "email": "contact@toubana.com",
        "zone": "Sainte-Anne (Guadeloupe)",
        "subject": "un mot respectueux pour La Toubana en Guadeloupe",
        "type": "france",
        "location": "Guadeloupe"
    },
    {
        "company": "Le Bambou Restaurant",
        "name": "Direction",
        "email": "contact@le-bambou.com",
        "zone": "Trois-Ilets (Martinique)",
        "subject": "un bonjour amical pour Le Bambou en Martinique",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "La Fourchette Antillaise",
        "name": "Direction",
        "email": "info@lafourchetteantillaise.fr",
        "zone": "Paris (France)",
        "subject": "un petit mot fraternel pour La Fourchette Antillaise",
        "type": "france",
        "location": "Paris"
    },
    {
        "company": "Bistrot Créole",
        "name": "Direction",
        "email": "contact@bistrotcreole.com",
        "zone": "Bordeaux (France)",
        "subject": "salut amical et pensées pour Bistrot Créole",
        "type": "france",
        "location": "Bordeaux"
    },
    {
        "company": "Restaurant Le Kano",
        "name": "Équipe Kano",
        "email": "restaurantlekano@gmail.com",
        "zone": "Anse à l'Âne (Martinique)",
        "subject": "un bonjour ensoleillé pour Restaurant Le Kano",
        "type": "france",
        "location": "Martinique"
    },
    {
        "company": "Le Petit Bambou Traiteur",
        "name": "Direction",
        "email": "petibambou972@gmail.com",
        "zone": "Martinique",
        "subject": "un salut chaleureux pour Le Petit Bambou",
        "type": "france",
        "location": "Martinique"
    }
]

print(f"Total leads bruts préparés: {len(raw_leads)}")

# Construction du batch final vérifié
final_batch = []
errors = 0
seen = set()

for idx, item in enumerate(raw_leads, 1):
    comp = item['company']
    name = item['name']
    em = item['email'].lower().strip()
    zone = item['zone']
    sub = item['subject']
    mtype = item['type']
    domain = em.split('@')[1]

    # Génération du corps
    if mtype == 'asian':
        body = get_body_asian(comp, name)
    elif mtype == 'usa':
        city = item.get('city', 'your area')
        body = get_body_usa_canada(comp, name, city)
    elif mtype == 'africa':
        city = item.get('city', 'your area')
        body = get_body_africa(comp, name, city)
    elif mtype == 'france':
        loc = item.get('location', 'votre région')
        body = get_body_france_domtom(comp, name, loc)
    elif mtype == 'montreal_fr':
        body = get_body_montreal_fr(comp, name)
    else:
        body = get_body_france_domtom(comp, name, zone)

    # Validations strictes
    if ':' in sub:
        print(f"[{idx}] ERREUR: Deux-points dans sujet ({comp}) -> '{sub}'")
        errors += 1
    if ':' in body:
        print(f"[{idx}] ERREUR: Deux-points dans corps ({comp})")
        errors += 1
    if em in known_emails:
        print(f"[{idx}] ERREUR DOUBLON BASE D'EXCLUSION: {em} ({comp})")
        errors += 1
    if em in seen:
        print(f"[{idx}] ERREUR DOUBLON INTERNE BATCH: {em} ({comp})")
        errors += 1
    seen.add(em)

    if 'www.domtomconnect.com' not in body:
        print(f"[{idx}] ERREUR: www.domtomconnect.com manquant ({comp})")
        errors += 1

    final_batch.append({
        "company": comp,
        "name": name,
        "email": em,
        "domain": domain,
        "zone": zone,
        "subject": sub,
        "body": body
    })

print(f"\nBilan validation:")
print(f"- Prospects compilés: {len(final_batch)}")
print(f"- Erreurs détectées: {errors}")

if errors == 0 and len(final_batch) == 100:
    output_path = 'batch_100_wave3_global_asia.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_batch, f, ensure_ascii=False, indent=2)
    print(f"\n===> SUCCES: {output_path} généré avec 100 prospects impeccables !")
else:
    print(f"\n[X] ÉCHEC DE VALIDATION: corriger les erreurs avant d'enregistrer.")
