-- =============================================================
-- NETTOYAGE - Suppression de l'événement "Test" parasite
-- À exécuter dans le SQL Editor de Supabase
-- =============================================================

-- 1. Voir quels événements existent avant suppression
SELECT id, title, event_date, location FROM public.events ORDER BY created_at;

-- 2. Supprimer l'événement "Test" (Paris)
-- (Cette requête supprime tous les events dont le titre est 'Test'
--  ou dont la location est 'Paris' — ajustez si nécessaire)
DELETE FROM public.events
WHERE title = 'Test'
   OR location ILIKE '%paris%';

-- 3. Vérification après suppression
SELECT id, title, event_date, location FROM public.events ORDER BY created_at;
