-- =============================================================
-- NETTOYAGE TOTAL - Suppression des données fake Mastermind
-- À exécuter dans le SQL Editor de Supabase
-- =============================================================

-- Suppression des événements physiques "fakes"
DELETE FROM public.events
WHERE title IN (
    'Afterwork B2B Networking - Martinique',
    'Meetup Co-Working & Cocktails - Guadeloupe',
    'Sommet des Entrepreneurs - Guyane',
    'Test'
);

-- Suppression des replays "fakes"
DELETE FROM public.webinars
WHERE title IN (
    'Lever des fonds en Guyane : Guide Complet',
    'Optimisation Fiscale Outre-Mer',
    'Pitcher son projet devant des investisseurs'
);

-- Vérification
SELECT id, title FROM public.events;
SELECT id, title FROM public.webinars;
