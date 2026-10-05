# candidate_pool_batch_68.py
import json, os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dedup_engine import is_domain_or_company_duplicate
from email_validator import verify_email_target

raw_candidates_68 = [
    # === LA RÉUNION (Agences & PME) ===
    {
        "company": "Sunkaz Immobilier",
        "name": "Direction Sunkaz",
        "email": "contact@sunkaz.re",
        "website": "https://www.sunkaz.re",
        "source": "Site officiel sunkaz.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "Accord Immobilier Réunion",
        "name": "Direction Accord Immobilier",
        "email": "info@accord-immobilier.re",
        "website": "https://www.accord-immobilier.re",
        "source": "Site officiel accord-immobilier.re",
        "territory": "La Réunion",
        "city": "Saint-Pierre"
    },
    {
        "company": "Lemerle Rivière Immobilier",
        "name": "Direction Lemerle Rivière",
        "email": "contact@lemerle-riviere.re",
        "website": "https://www.lemerle-riviere.re",
        "source": "Site officiel lemerle-riviere.re",
        "territory": "La Réunion",
        "city": "Le Tampon"
    },
    {
        "company": "Mon Agence Immobilière Réunion",
        "name": "Direction Mon Agence",
        "email": "bonjour@monagenceimmo.re",
        "website": "https://www.monagenceimmo.re",
        "source": "Site officiel monagenceimmo.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Univers Immobilier Réunion",
        "name": "Direction Univers Immobilier",
        "email": "contact@univers-immobilier.re",
        "website": "https://www.univers-immobilier.re",
        "source": "Site officiel univers-immobilier.re",
        "territory": "La Réunion",
        "city": "Saint-Denis"
    },
    {
        "company": "Agenceimmo.re",
        "name": "Direction Agenceimmo",
        "email": "contact@agenceimmo.re",
        "website": "https://www.agenceimmo.re",
        "source": "Site officiel agenceimmo.re",
        "territory": "La Réunion",
        "city": "Saint-Paul"
    },

    # === GUADELOUPE (Agences & PME) ===
    {
        "company": "Agence Molinard Immobilier",
        "name": "Direction Agence Molinard",
        "email": "agencemolinard@gmail.com",
        "website": "https://www.agencemolinard.com",
        "source": "Site officiel agencemolinard.com",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Immovital Guadeloupe",
        "name": "Direction Immovital",
        "email": "contact@immovital.fr",
        "website": "https://www.immovital.fr",
        "source": "Site officiel immovital.fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },
    {
        "company": "Alias Immobilier Guadeloupe",
        "name": "Direction Alias Immobilier",
        "email": "contact@aliasimmobilier.fr",
        "website": "https://www.aliasimmobilier.fr",
        "source": "Site officiel aliasimmobilier.fr",
        "territory": "Guadeloupe",
        "city": "Baie-Mahault"
    },

    # === MARTINIQUE (Agences & PME) ===
    {
        "company": "L'Immobilier Pass'Avant",
        "name": "Direction Pass'Avant",
        "email": "contact@limmobilierpassavant.com",
        "website": "https://www.limmobilierpassavant.com",
        "source": "Site officiel limmobilierpassavant.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Accent Immo Martinique",
        "name": "Direction Accent Immo",
        "email": "contact@accentimmo.fr",
        "website": "https://www.accentimmo.fr",
        "source": "Site officiel accentimmo.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Agence Larcher Martinique",
        "name": "Direction Agence Larcher",
        "email": "acharlery.agencelarcher@gmail.com",
        "website": "https://www.agencelarcher.fr",
        "source": "Site officiel agencelarcher.fr",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },
    {
        "company": "Guy Hoquet Didier Martinique",
        "name": "Direction Guy Hoquet Didier",
        "email": "didier@gha.immo",
        "website": "https://www.guyhoquet-antilles.com",
        "source": "Site officiel guyhoquet-antilles.com",
        "territory": "Martinique",
        "city": "Fort-de-France"
    },

    # === GUYANE (Agences & PME) ===
    {
        "company": "APS Immobilier Guyane",
        "name": "Direction APS Immo",
        "email": "contact@aps-immo.com",
        "website": "https://www.aps-immo.fr",
        "source": "Site officiel aps-immo.fr",
        "territory": "Guyane",
        "city": "Cayenne"
    },
    {
        "company": "Milton Immobilier Guyane",
        "name": "Direction Milton Immobilier",
        "email": "contact@miltonimmobilier.fr",
        "website": "https://www.miltonimmobilier.fr",
        "source": "Site officiel miltonimmobilier.fr",
        "territory": "Guyane",
        "city": "Cayenne"
    },
    {
        "company": "Guyane Services Immobiliers",
        "name": "Direction GSI",
        "email": "guyane.services.immobiliers7@gmail.com",
        "website": "https://gsi-guyane.com",
        "source": "Annuaire professionnel Guyane",
        "territory": "Guyane",
        "city": "Cayenne"
    },

    # === NOUVELLE-CALÉDONIE & POLYNÉSIE ===
    {
        "company": "Conciergerie By Mademoiselle",
        "name": "Direction Conciergerie By Mademoiselle",
        "email": "contact@conciergerie.nc",
        "website": "https://www.conciergerie.nc",
        "source": "Site officiel conciergerie.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "My Room Conciergerie Nouméa",
        "name": "Urielle",
        "email": "urielle@myroomconciergerie.nc",
        "website": "https://www.myroomconciergerie.nc",
        "source": "Site officiel myroomconciergerie.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "L'Agence Immo Nouméa",
        "name": "Direction L'Agence Immo",
        "email": "info@lagenceimmo.nc",
        "website": "https://www.lagenceimmo.nc",
        "source": "Site officiel lagenceimmo.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    },
    {
        "company": "Agence Immobilière Soleil Nouméa",
        "name": "Direction Agence Soleil",
        "email": "agence@soleil.nc",
        "website": "https://www.soleil.nc",
        "source": "Site officiel soleil.nc",
        "territory": "Nouvelle-Calédonie",
        "city": "Nouméa"
    }
]

print(f"Total raw candidates pool 68: {len(raw_candidates_68)}")
