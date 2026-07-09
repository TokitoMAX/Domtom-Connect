-- Script pour nettoyer TOUS les posts liés à la Masterclass (les tiens et les tests)
-- À exécuter dans le SQL Editor de Supabase

DELETE FROM public.showcase_items
WHERE description ILIKE '%Masterclass%' 
   OR description ILIKE '%plateforme%'
   OR description ILIKE '%prochain événement%';

-- Une fois ce script exécuté, TON FEED SERA ENTIEREMENT VIDE DE CES DOUBLONS.
-- Ensuite, retourne relancer "post_event_to_feed.sql" UNE SEULE FOIS pour le recréer proprement.
