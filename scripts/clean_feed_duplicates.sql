-- Script pour nettoyer les doublons de l'événement dans le DTC Feed
-- À exécuter dans le SQL Editor de Supabase

DELETE FROM public.showcase_items
WHERE category = 'status' 
AND title = 'opportunite'
AND description ILIKE '%Nouvel événement : Masterclass%';

-- Une fois ce script exécuté, tous les posts en double de la Masterclass auront disparu.
-- Vous pourrez ensuite relancer "post_event_to_feed.sql" UNE SEULE FOIS pour avoir un post propre et unique !
