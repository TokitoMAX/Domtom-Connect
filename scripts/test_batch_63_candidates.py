import os
import json
import re
import socket
import subprocess
import urllib.request
from email_validator import verify_email_target
from dedup_engine import is_domain_or_company_duplicate

# Liste candidate pour Batch 63 : Avocats d'affaires, Expertise-Comptable, Agences Digitales & Conseil B2B (Antilles, Guyane, Réunion, Afrique francophone, Paris)
CANDIDATES = [
    # 1. Avocats d'affaires & Conseil Juridique
    {
        "company": "AcSeas Avocats",
        "email": "contact@acseas.com",
        "contact_name": "Maître",
        "location": "Guadeloupe et Martinique",
        "sector": "Avocats d'affaires et droit maritime",
        "axis": "C", # Réseau B2B & Synergies
        "source": "Site officiel acseas.com"
    },
    {
        "company": "AJM Avocats",
        "email": "contact@ajmavocats.com",
        "contact_name": "Maître",
        "location": "Guadeloupe",
        "sector": "Avocats droit des affaires et fiscalité",
        "axis": "C",
        "source": "Site officiel ajmavocats.com"
    },
    {
        "company": "DFM Avocat",
        "email": "contact@dfmavocat.fr",
        "contact_name": "Maître Mollet",
        "location": "Guadeloupe et Martinique",
        "sector": "Avocat d'affaires",
        "axis": "C",
        "source": "Site officiel dfmavocat.fr"
    },
    {
        "company": "Cabinet Lexindies",
        "email": "contact@lexindies-avocats.com",
        "contact_name": "Maître",
        "location": "Guadeloupe, Saint-Martin et Saint-Barthélemy",
        "sector": "Avocats d'affaires et droit des sociétés",
        "axis": "C",
        "source": "Site officiel avocat-guadeloupe-lexindies.fr"
    },
    {
        "company": "FDKA Avocats",
        "email": "fdka@fdka.ci",
        "contact_name": "Maître Fadika",
        "location": "Abidjan, Côte d'Ivoire",
        "sector": "Cabinet d'avocats d'affaires de référence",
        "axis": "C",
        "source": "Barreau de Côte d'Ivoire et fdka.net"
    },
    {
        "company": "Geni & Kebe Avocats",
        "email": "info@gsklaw.sn",
        "contact_name": "Maître Kebe",
        "location": "Dakar, Sénégal",
        "sector": "Avocats d'affaires panafricains",
        "axis": "C",
        "source": "Barreau du Sénégal et gsklaw.sn"
    },
    {
        "company": "AG Avocats Réunion",
        "email": "contact@ag-avocats.com",
        "contact_name": "Maître",
        "location": "La Réunion",
        "sector": "Avocats droit des affaires",
        "axis": "C",
        "source": "Annuaire Barreau Saint-Denis et ag-avocats.com"
    },

    # 2. Expertise Comptable, Audit & Commissariat aux comptes
    {
        "company": "Concilium & Audit",
        "email": "contact@conciliumaudit.fr",
        "contact_name": "Direction",
        "location": "Guadeloupe (Jarry)",
        "sector": "Expertise comptable et commissariat aux comptes",
        "axis": "C",
        "source": "Site officiel conciliumaudit.fr"
    },
    {
        "company": "MG Expertise",
        "email": "contact@mgexpertise.fr",
        "contact_name": "Direction",
        "location": "Martinique",
        "sector": "Cabinet d'expertise comptable et conseil de gestion",
        "axis": "C",
        "source": "Site officiel mgexpertise.fr"
    },

    # 3. Agences Digitales, Communication B2B & Marketing
    {
        "company": "MJ Metrix",
        "email": "direction@mjmetrix.com",
        "contact_name": "Direction",
        "location": "Guadeloupe (Jarry)",
        "sector": "Stratégie digitale et développement web",
        "axis": "C",
        "source": "Site officiel mjmetrix.com"
    },
    {
        "company": "Alpha Agency Guadeloupe",
        "email": "leo.sperl@alphagency.fr",
        "contact_name": "Monsieur Sperl",
        "location": "Guadeloupe",
        "sector": "Agence de communication 360",
        "axis": "C",
        "source": "Site officiel alphagency.fr"
    },
    {
        "company": "Kaza Communication",
        "email": "info@kazacommunication.com",
        "contact_name": "Direction",
        "location": "Martinique",
        "sector": "Agence de communication et médias",
        "axis": "C",
        "source": "Site officiel kazacommunication.com"
    },
    {
        "company": "Nasdy Digital",
        "email": "contact@nasdy.com",
        "contact_name": "Direction",
        "location": "Martinique",
        "sector": "Développement web et mobile",
        "axis": "C",
        "source": "Site officiel nasdy.com"
    },
    {
        "company": "Yello Réunion",
        "email": "hello@yello.re",
        "contact_name": "Direction",
        "location": "La Réunion",
        "sector": "Agence de communication globale",
        "axis": "C",
        "source": "Site officiel yello.re"
    },
    {
        "company": "Run The Com",
        "email": "antoine@runthecom.re",
        "contact_name": "Monsieur Antoine",
        "location": "La Réunion",
        "sector": "Communication digitale et création de contenu",
        "axis": "C",
        "source": "Site officiel runthecom.re"
    },
    {
        "company": "Agence O'My!",
        "email": "contact@omymarketing.com",
        "contact_name": "Direction",
        "location": "La Réunion",
        "sector": "Marketing stratégique et opérationnel",
        "axis": "C",
        "source": "Site officiel omymarketing.com"
    },
    {
        "company": "Zoorit Réunion",
        "email": "info@zoorit.com",
        "contact_name": "Direction",
        "location": "La Réunion",
        "sector": "Agence web et création digitale",
        "axis": "C",
        "source": "Site officiel zoorit.com"
    },
    {
        "company": "Akanha Réunion",
        "email": "contact@akanha.fr",
        "contact_name": "Direction",
        "location": "La Réunion",
        "sector": "Agence de communication et design",
        "axis": "C",
        "source": "Site officiel akanha.fr"
    },
    {
        "company": "Brand & Consultant",
        "email": "contact@brandetconsultant.com",
        "contact_name": "Direction",
        "location": "La Réunion",
        "sector": "Conseil en image et stratégie de marque",
        "axis": "C",
        "source": "Site officiel brandetconsultant.com"
    },
    {
        "company": "Ranking Réunion",
        "email": "contact@ranking.re",
        "contact_name": "Direction",
        "location": "La Réunion",
        "sector": "Référencement et visibilité web",
        "axis": "C",
        "source": "Site officiel ranking.re"
    },
    {
        "company": "Novacom Tahiti",
        "email": "contact@novacom.pf",
        "contact_name": "Direction",
        "location": "Polynésie française (Papeete)",
        "sector": "Agence de communication et multimédia",
        "axis": "C",
        "source": "Site officiel novacom.pf"
    },
    {
        "company": "In-Pulsion Tahiti",
        "email": "contact@in-pulsion.com",
        "contact_name": "Direction",
        "location": "Polynésie française (Papeete)",
        "sector": "Communication stratégique et événementiel",
        "axis": "C",
        "source": "Site officiel in-pulsion.com"
    },
    {
        "company": "Redsoyu Tahiti",
        "email": "info@redsoyu.com",
        "contact_name": "Direction",
        "location": "Polynésie française (Tahiti)",
        "sector": "Agence web et digitale",
        "axis": "C",
        "source": "Site officiel redsoyu.com"
    },
    {
        "company": "Tahiti Communication",
        "email": "direction@tahiticommunication.com",
        "contact_name": "Direction",
        "location": "Polynésie française (Papeete)",
        "sector": "Communication 360 et régie publicitaire",
        "axis": "C",
        "source": "Site officiel tahiticommunication.com"
    },
    {
        "company": "Crea Passion Tahiti",
        "email": "info@crea-passion.pf",
        "contact_name": "Direction",
        "location": "Polynésie française",
        "sector": "Création graphique et web",
        "axis": "C",
        "source": "Site officiel crea-passion.pf"
    },
    {
        "company": "YanaCom Guyane",
        "email": "contact@yanacomguyane.fr",
        "contact_name": "Direction",
        "location": "Guyane (Cayenne)",
        "sector": "Agence conseil en communication et événementiel",
        "axis": "C",
        "source": "Site officiel yanacomguyane.fr"
    },
    {
        "company": "Nuage Com Guyane",
        "email": "contact@nuagecom.com",
        "contact_name": "Direction",
        "location": "Guyane (Cayenne)",
        "sector": "Marketing stratégique et digital",
        "axis": "C",
        "source": "Site officiel nuagecom.com"
    },
    {
        "company": "Agence Web Guyane",
        "email": "contact@agencewebguyane.fr",
        "contact_name": "Direction",
        "location": "Guyane",
        "sector": "Création web et solutions digitales",
        "axis": "C",
        "source": "Site officiel agencewebguyane.fr"
    },
    {
        "company": "Netactions Guyane",
        "email": "infos@netactions.net",
        "contact_name": "Direction",
        "location": "Guyane",
        "sector": "Transformation numérique et communication",
        "axis": "C",
        "source": "Site officiel netactions.net"
    },
    {
        "company": "And Vision Agency",
        "email": "contact@andvisionagency.com",
        "contact_name": "Direction",
        "location": "Sénégal (Dakar)",
        "sector": "Stratégie digitale et webmarketing panafricain",
        "axis": "C",
        "source": "Site officiel andvisionagency.com"
    },
    {
        "company": "Fox Communication Côte d'Ivoire",
        "email": "contact@fox-ci.com",
        "contact_name": "Direction",
        "location": "Côte d'Ivoire (Abidjan)",
        "sector": "Agence conseil en communication et publicité",
        "axis": "C",
        "source": "Site officiel fox-ci.com"
    }
]

print(f"Total initial candidates: {len(CANDIDATES)}")
